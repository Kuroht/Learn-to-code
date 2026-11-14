// Corre programas em C com gcc, para o shared/check.js comparar a saída real com a da página.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const isWindows = process.platform === 'win32';

module.exports = {
  toolName: 'gcc',
  installHint: 'Instala o gcc. No Windows: MSYS2 (https://www.msys2.org) e depois "pacman -S mingw-w64-ucrt-x86_64-gcc", com C:\\msys64\\ucrt64\\bin no PATH. No Linux: "sudo apt install gcc".',

  // Diz se o gcc está instalado.
  isAvailable() {
    return spawnSync('gcc', ['--version'], { encoding: 'utf8' }).status === 0;
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
    const compile = spawnSync('gcc', ['-std=c11', '-Wall', '-Wextra', '-o', exe, source, '-lm'], { encoding: 'utf8' });
    if (compile.status !== 0) return { error: 'COMPILAÇÃO FALHOU:\n' + compile.stderr };
    const warnings = compile.stderr.split('\n').filter(line => /warning/.test(line)).join('\n');
    const result = spawnSync(exe, [], { input: stdin, encoding: 'utf8', timeout: 3000 });
    if (result.error) return { error: 'NÃO CORREU: ' + result.error.message };
    return { out: result.stdout, warnings };
  },
};
