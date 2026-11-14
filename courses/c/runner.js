// Corre programas em C com gcc, para o shared/check.js comparar a saída real com a da página.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isWindows = process.platform === 'win32';

// Usa o gcc do PATH. Se não houver, usa o gcc portátil em .tools/gcc (descompactado do WinLibs, sem instalar).
function findGcc() {
  if (spawnSync('gcc', ['--version']).status === 0) return { command: 'gcc', env: process.env };
  const toolsDir = path.join(__dirname, '..', '..', '.tools', 'gcc');
  const binDir = fs.existsSync(toolsDir)
    ? fs.readdirSync(toolsDir).map(name => path.join(toolsDir, name, 'bin')).find(dir => fs.existsSync(path.join(dir, 'gcc.exe')))
    : null;
  if (!binDir) return null;
  // O gcc portátil precisa da sua pasta bin no PATH para encontrar as próprias ferramentas e DLLs.
  return { command: path.join(binDir, 'gcc.exe'), env: { ...process.env, PATH: binDir + path.delimiter + process.env.PATH } };
}
const gcc = findGcc();

module.exports = {
  toolName: 'gcc',
  installHint: 'Instala o gcc ("winget install BrechtSanders.WinLibs.POSIX.UCRT"), ou descompacta o zip do WinLibs (https://winlibs.com) para .tools/gcc/ na raiz do repositório. No Linux: "sudo apt install gcc".',

  // Diz se há um gcc para usar.
  isAvailable() {
    return gcc !== null;
  },

  // As perguntas do quiz podem ser só um bocado de código: embrulha-o num main.
  wrapQuiz(code) {
    if (/\bmain\s*\(/.test(code)) return code;
    const body = code.split('\n').map(line => '    ' + line).join('\n');
    return '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n' + body + '\n    return 0;\n}';
  },

  // Compila e corre. Devolve { out } ou { error }, e { warnings } se o gcc avisou de alguma coisa.
  run(code, stdin, tmpDir) {
    const source = path.join(tmpDir, 'p.c');
    const exe = path.join(tmpDir, isWindows ? 'p.exe' : 'p');
    fs.writeFileSync(source, code + '\n');
    const compile = spawnSync(gcc.command, ['-std=c11', '-Wall', '-Wextra', '-o', exe, source, '-lm'], { encoding: 'utf8', env: gcc.env });
    if (compile.status !== 0) return { error: 'COMPILAÇÃO FALHOU:\n' + compile.stderr };
    const warnings = compile.stderr.split('\n').filter(line => /warning/.test(line)).join('\n');
    const result = spawnSync(exe, [], { input: stdin, encoding: 'utf8', timeout: 3000, env: gcc.env });
    if (result.error) return { error: 'NÃO CORREU: ' + result.error.message };
    return { out: result.stdout, warnings };
  },
};
