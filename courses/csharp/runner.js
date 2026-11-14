// Corre programas em C# para o shared/check.js comparar a saída real com a da página.
// Para não fazer um "dotnet build" por programa (uns segundos cada), o prepare junta todos os programas
// num só projeto: cada um fica no seu namespace (P0, P1, ...) e um Main gerado chama o programa pedido.
// Assim há um só build e um só .exe, que corre uma vez por programa.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ENV = {
  ...process.env,
  DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1', DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1',
  DOTNET_CLI_UI_LANGUAGE: 'en', // mensagens do compilador em inglês, iguais em qualquer máquina
};

// Os programas usam "top-level statements": instruções soltas e, no fim, as classes/interfaces.
// Isto parte o programa nessas duas partes e mete-o num namespace, com as instruções num método Run.
const TYPE_START = /^(public\s+|internal\s+|abstract\s+|sealed\s+|static\s+|partial\s+)*(class|interface|struct|record|enum)\s/;
function toModule(code, n) {
  const lines = code.split('\n');
  const usings = [];
  while (lines.length && /^using\s+[\w.]+;\s*$/.test(lines[0])) usings.push(lines.shift());
  let split = lines.findIndex(l => TYPE_START.test(l));
  if (split < 0) split = lines.length;
  const statements = lines.slice(0, split).join('\n');
  const types = lines.slice(split).join('\n');
  return usings.join('\n') + `\nnamespace P${n} {\nstatic class Entry {\npublic static void Run() {\n${statements}\n}\n}\n${types}\n}\n`;
}

// O Main gerado: corre o programa n e, se acabar com uma exceção, escreve a mesma primeira linha que o .NET escreve.
function dispatcher(ids) {
  const cases = ids.map(n => `            case ${n}: P${n}.Entry.Run(); break;`).join('\n');
  return `public static class Dispatcher {
    public static int Main(string[] args) {
        try {
            switch (int.Parse(args[0])) {
${cases}
            }
        } catch (System.Exception e) {
            System.Console.WriteLine("Unhandled exception. " + e.GetType() + ": " + e.Message);
            return 1;
        }
        return 0;
    }
}
`;
}

const CSPROJ = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>disable</Nullable>
    <InvariantGlobalization>true</InvariantGlobalization>
    <StartupObject>Dispatcher</StartupObject>
    <AssemblyName>programas</AssemblyName>
  </PropertyGroup>
</Project>
`;

const state = { index: new Map(), compileErrors: {}, warnings: {}, exe: null };

module.exports = {
  toolName: 'dotnet',
  installHint: 'Instala o .NET SDK (https://dotnet.microsoft.com/download) e abre um terminal novo.',

  isAvailable() {
    return spawnSync('dotnet', ['--version'], { encoding: 'utf8', env: ENV }).status === 0;
  },

  wrapQuiz(code) {
    return code;
  },

  // Compila todos os programas num só projeto. Um programa que não compila fica com o primeiro erro
  // do compilador como "saída" (por exemplo "error CS0029: Cannot implicitly convert type 'double' to 'int'"),
  // para as perguntas do tipo "isto compila?" poderem ser verificadas.
  prepare(codes, tmpDir) {
    const proj = path.join(tmpDir, 'proj');
    fs.mkdirSync(proj, { recursive: true });
    fs.writeFileSync(path.join(proj, 'programas.csproj'), CSPROJ);
    [...new Set(codes)].forEach((code, n) => {
      state.index.set(code, n);
      fs.writeFileSync(path.join(proj, `P${n}.cs`), toModule(code, n));
    });
    let alive = [...state.index.values()];
    for (let attempt = 0; attempt < 4; attempt++) {
      fs.writeFileSync(path.join(proj, 'Dispatcher.cs'), dispatcher(alive));
      const build = spawnSync('dotnet', ['build', '-nologo', '-v', 'q', '-clp:NoSummary'], { cwd: proj, encoding: 'utf8', env: ENV, timeout: 300000 });
      const text = build.stdout + build.stderr;
      const diag = [...text.matchAll(/P(\d+)\.cs\(\d+,\d+\): (error|warning) (CS\d+: .*?)(?: \[.*\])?\r?$/gm)];
      diag.filter(d => d[2] === 'warning').forEach(d => { (state.warnings[d[1]] = state.warnings[d[1]] || new Set()).add('warning ' + d[3]); });
      if (build.status === 0) {
        state.exe = path.join(proj, 'bin', 'Debug', 'net10.0', process.platform === 'win32' ? 'programas.exe' : 'programas');
        return null;
      }
      const broken = new Set();
      diag.filter(d => d[2] === 'error').forEach(d => {
        if (!state.compileErrors[d[1]]) state.compileErrors[d[1]] = 'error ' + d[3];
        broken.add(Number(d[1]));
      });
      if (!broken.size) return 'o dotnet build falhou sem indicar nenhum programa:\n' + text.slice(-2000);
      broken.forEach(n => fs.rmSync(path.join(proj, `P${n}.cs`)));
      alive = alive.filter(n => !broken.has(n));
    }
    return 'o dotnet build continuou a falhar depois de retirar os programas com erros';
  },

  run(code, stdin) {
    const n = state.index.get(code);
    if (n === undefined) return { error: 'programa não preparado' };
    if (state.compileErrors[n]) return { out: state.compileErrors[n] + '\n' };
    const r = spawnSync(state.exe, [String(n)], { input: stdin, encoding: 'utf8', timeout: 5000, env: ENV });
    if (r.error) return { error: 'NÃO CORREU: ' + r.error.message };
    const warnings = state.warnings[n] ? [...state.warnings[n]].join('\n') : '';
    return { out: r.stdout, warnings };
  },
};
