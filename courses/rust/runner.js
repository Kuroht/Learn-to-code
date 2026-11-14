// Corre programas em Rust para o shared/check.js comparar a saída real com a da página.
// Como no C#, o prepare junta todos os programas num só: cada um vira um módulo (p0, p1, ...) e um main
// gerado corre o programa pedido. Um só rustc em vez de um por programa.
// O Windows desta máquina não deixa correr os .exe que o rustc cria, por isso compila-se para WebAssembly
// (alvo wasm32-wasip1) e o programa corre dentro do próprio Node, com o node:wasi. Não se cria nenhum .exe.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { WASI } = require('node:wasi');

// O rustup instala em ~/.cargo/bin, que pode ainda não estar no PATH deste terminal.
const CARGO_BIN = path.join(os.homedir(), '.cargo', 'bin');
const ENV = { ...process.env, PATH: CARGO_BIN + path.delimiter + process.env.PATH };

// Cada programa vira um módulo: só é preciso tornar o seu main público.
const toModule = code => code.replace(/^fn main\(\)/m, 'pub fn main()');

// O main gerado. Se o programa entrar em pânico, escreve "thread 'main' panicked: <mensagem>"
// (o Rust escreve também o número da thread e a linha, que aqui não interessam). Em WebAssembly
// um pânico termina logo o programa, por isso não é preciso apanhá-lo.
function dispatcher(ids) {
  const mods = ids.map(n => `mod p${n};`).join('\n');
  const arms = ids.map(n => `        ${n} => p${n}::main(),`).join('\n');
  return `#![allow(warnings)]
${mods}

fn main() {
    std::panic::set_hook(Box::new(|info| {
        let msg = if let Some(s) = info.payload().downcast_ref::<&str>() {
            s.to_string()
        } else if let Some(s) = info.payload().downcast_ref::<String>() {
            s.clone()
        } else {
            String::from("?")
        };
        println!("thread 'main' panicked: {}", msg);
    }));
    let n: usize = std::env::args().nth(1).unwrap().parse().unwrap();
    match n {
${arms}
        _ => {}
    }
}
`;
}

const state = { index: new Map(), compileErrors: {}, module: null, tmpDir: null };

module.exports = {
  toolName: 'rustc (wasm32-wasip1)',
  installHint: 'Instala o Rust com o rustup (https://rustup.rs) e depois corre "rustup target add wasm32-wasip1".',

  isAvailable() {
    const targets = spawnSync('rustup', ['target', 'list', '--installed'], { encoding: 'utf8', env: ENV });
    return targets.status === 0 && targets.stdout.includes('wasm32-wasip1');
  },

  wrapQuiz(code) {
    return code;
  },

  // Compila tudo. Um programa que não compila fica com o primeiro erro como "saída", por exemplo
  // "error[E0382]: borrow of moved value: `s`". O rustc pára antes do borrow checker se houver erros de
  // tipos em qualquer módulo, por isso compila-se várias vezes, tirando os módulos com erros de cada vez.
  prepare(codes, tmpDir) {
    const dir = path.join(tmpDir, 'src');
    fs.mkdirSync(dir, { recursive: true });
    [...new Set(codes)].forEach((code, n) => {
      state.index.set(code, n);
      fs.writeFileSync(path.join(dir, `p${n}.rs`), toModule(code));
    });
    let alive = [...state.index.values()];
    const wasm = path.join(tmpDir, 'programas.wasm');
    for (let attempt = 0; attempt < 8; attempt++) {
      fs.writeFileSync(path.join(dir, 'main.rs'), dispatcher(alive));
      const args = ['--edition', '2024', '--target', 'wasm32-wasip1', '--error-format=json', '-o', wasm, path.join(dir, 'main.rs')];
      const build = spawnSync('rustc', args, { encoding: 'utf8', env: ENV, timeout: 300000 });
      if (build.status === 0) {
        state.module = new WebAssembly.Module(fs.readFileSync(wasm));
        state.tmpDir = tmpDir;
        return null;
      }
      const broken = new Set();
      build.stderr.split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l)).forEach(d => {
        if (d.level !== 'error' || !d.spans.length) return;
        const m = /p(\d+)\.rs$/.exec(d.spans[0].file_name);
        if (!m) return;
        const code = d.code && /^E\d+$/.test(d.code.code) ? `[${d.code.code}]` : '';
        // Tira o nome do módulo que o runner acrescentou ("p56::Ponto" → "Ponto"): o aluno nunca o vê.
        const message = d.message.replace(/\bp\d+::/g, '');
        if (!state.compileErrors[m[1]]) state.compileErrors[m[1]] = `error${code}: ${message}`;
        broken.add(Number(m[1]));
      });
      if (!broken.size) return 'o rustc falhou sem indicar nenhum programa:\n' + build.stderr.slice(-2000);
      alive = alive.filter(n => !broken.has(n));
    }
    return 'o rustc continuou a falhar depois de retirar os programas com erros';
  },

  // Corre o programa n dentro do Node. O stdin e o stdout do programa são dois ficheiros temporários.
  run(code, stdin) {
    const n = state.index.get(code);
    if (n === undefined) return { error: 'programa não preparado' };
    if (state.compileErrors[n]) return { out: state.compileErrors[n] + '\n' };
    const inFile = path.join(state.tmpDir, 'stdin.txt');
    const outFile = path.join(state.tmpDir, 'stdout.txt');
    fs.writeFileSync(inFile, stdin);
    const inFd = fs.openSync(inFile, 'r');
    const outFd = fs.openSync(outFile, 'w');
    const wasi = new WASI({ version: 'preview1', args: ['programas', String(n)], stdin: inFd, stdout: outFd, stderr: outFd, returnOnExit: true });
    try {
      wasi.start(new WebAssembly.Instance(state.module, wasi.getImportObject()));
    } catch (e) {
      // Um pânico acaba numa instrução "unreachable": a mensagem já foi escrita pelo hook.
      if (!/unreachable/.test(e.message)) return { error: 'NÃO CORREU: ' + e.message };
    } finally {
      fs.closeSync(inFd);
      fs.closeSync(outFd);
    }
    return { out: fs.readFileSync(outFile, 'utf8') };
  },
};
