// Compila e corre todos os programas das lições com gcc e compara com o que a página mostra.
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { buildSteps } = require('./engine.js');

const src = fs.readFileSync(path.join(__dirname, 'lessons1.js'), 'utf8') + '\n' +
            fs.readFileSync(path.join(__dirname, 'lessons2.js'), 'utf8');
const mod = { exports: {} };
new Function('module', src)(mod);
const { LESSONS } = mod.exports;

const tmp = fs.mkdtempSync('/tmp/cdz-');
let fails = 0, checks = 0;
const warnings = [];

function runC(code, stdin, label) {
  const file = path.join(tmp, 'p.c');
  const exe = path.join(tmp, 'p');
  fs.writeFileSync(file, code + '\n');
  const cc = spawnSync('gcc', ['-std=c11', '-Wall', '-Wextra', '-o', exe, file, '-lm'], { encoding: 'utf8' });
  if (cc.status !== 0) return { error: 'COMPILAÇÃO FALHOU:\n' + cc.stderr };
  if (cc.stderr.trim()) warnings.push(label + ':\n' + cc.stderr.trim().split('\n').filter(l => /warning/.test(l)).join('\n'));
  const r = spawnSync(exe, [], { input: stdin, encoding: 'utf8', timeout: 3000 });
  return { out: r.stdout, status: r.status };
}

const inputsOf = s => [...s.matchAll(/⟦([^⟧]*)⟧/g)].map(m => m[1]);
const strip = s => s.replace(/⟦[^⟧]*⟧/g, '');

function check(label, ok, detail) {
  checks++;
  if (!ok) { fails++; console.log('✗ ' + label + '\n' + detail + '\n'); }
}

const lineReport = [];

for (const L of LESSONS) {
  L.examples.forEach((ex, ei) => {
    const label = `Lição ${L.id} exemplo ${ei + 1} (${ex.title})`;
    let steps;
    try { steps = buildSteps(ex.steps); } catch (e) { check(label + ' motor', false, e.message); return; }
    const lines = ex.code.split('\n');
    steps.forEach((s, si) => {
      const txt = lines[s.l - 1];
      if (txt === undefined || !txt.trim()) check(`${label} passo ${si + 1}`, false, 'linha ' + s.l + ' vazia ou inexistente');
      lineReport.push(`${label} #${si + 1} L${s.l}: ${(txt || '').trim()}  ||  ${s.n.replace(/<[^>]+>/g, '').slice(0, 90)}`);
    });
    const allOut = ex.steps.map(s => s.o || '').join('');
    const stdin = inputsOf(allOut).join('\n') + '\n';
    const r = runC(ex.code, stdin, label);
    if (r.error) { check(label, false, r.error); return; }
    const exp = strip(allOut);
    check(label, r.out === exp, `esperado:\n${JSON.stringify(exp)}\nreal:\n${JSON.stringify(r.out)}`);
    check(label + ' saída final', steps[steps.length - 1].out === allOut, 'saída acumulada diferente');
  });

  L.quiz.forEach((q, qi) => {
    if (q.ok < 0 || q.ok >= q.opts.length) check(`Lição ${L.id} quiz ${qi + 1}`, false, 'índice ok inválido');
    if (!q.check) return;
    const label = `Lição ${L.id} quiz ${qi + 1}`;
    let prog;
    if (/\bmain\s*\(/.test(q.code)) prog = q.code;
    else prog = '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n' + q.code.split('\n').map(l => '    ' + l).join('\n') + '\n    return 0;\n}';
    const r = runC(prog, '', label);
    if (r.error) { check(label, false, r.error); return; }
    const got = r.out.replace(/\s+$/, '');
    check(label, got === q.opts[q.ok].replace(/\s+$/, ''), `resposta marcada: ${JSON.stringify(q.opts[q.ok])}\nreal: ${JSON.stringify(r.out)}`);
    const dup = q.opts.filter((o, i) => i !== q.ok && o.replace(/\s+$/, '') === got);
    check(label + ' (opções únicas)', dup.length === 0, 'outra opção também coincide');
  });

  L.exercises.forEach((ex, xi) => {
    const label = `Lição ${L.id} exercício ${xi + 1} (${ex.title})`;
    const stdin = inputsOf(ex.run).join('\n') + '\n';
    const r = runC(ex.solution, stdin, label);
    if (r.error) { check(label, false, r.error); return; }
    check(label, r.out === strip(ex.run), `esperado:\n${JSON.stringify(strip(ex.run))}\nreal:\n${JSON.stringify(r.out)}`);
  });
}

fs.writeFileSync(path.join(__dirname, 'line-report.txt'), lineReport.join('\n'));
console.log(`\n${checks - fails}/${checks} verificações passaram.`);
if (warnings.length) console.log('\nAvisos do compilador:\n' + warnings.join('\n\n'));
process.exit(fails ? 1 : 0);
