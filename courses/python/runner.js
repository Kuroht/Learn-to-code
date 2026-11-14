// Corre programas em Python, para o shared/check.js comparar a saída real com a da página.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// "python" no Windows, "python3" no Linux e no Mac. Fica com o primeiro que responder.
const PYTHON = ['python', 'python3'].find(cmd => {
  const r = spawnSync(cmd, ['--version'], { encoding: 'utf8' });
  return r.status === 0 && /Python 3/.test(r.stdout + r.stderr);
});

module.exports = {
  toolName: 'python',
  installHint: 'Instala o Python 3 (python.org ou Microsoft Store) e abre um terminal novo.',

  isAvailable() {
    return Boolean(PYTHON);
  },

  // As perguntas do quiz já são programas completos (em Python não há main).
  wrapQuiz(code) {
    return code;
  },

  // Corre o programa. Se acabar com uma exceção, a última linha do erro (por exemplo
  // "TypeError: can only concatenate str (not "int") to str") junta-se à saída, porque é o que o aluno vê no ecrã.
  run(code, stdin, tmpDir) {
    const file = path.join(tmpDir, 'p.py');
    fs.writeFileSync(file, code + '\n');
    // -I: modo isolado (não lê módulos da pasta do programa nem variáveis de ambiente do Python).
    const r = spawnSync(PYTHON, ['-I', file], {
      cwd: tmpDir, input: stdin, encoding: 'utf8', timeout: 5000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });
    if (r.error) return { error: 'NÃO CORREU: ' + r.error.message };
    if (r.status !== 0) {
      const lines = r.stderr.trim().split(/\r?\n/);
      return { out: r.stdout + lines[lines.length - 1] + '\n' };
    }
    return { out: r.stdout };
  },
};
