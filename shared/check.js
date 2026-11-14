// Verifica um curso de ponta a ponta:
//   1. revê o conteúdo (campos em falta, português do Brasil, linhas dos passos);
//   2. corre todos os exemplos, perguntas com check: true e soluções com a ferramenta real
//      (gcc, sqlite3, python...) e compara a saída com o que a página mostra;
//   3. faz o build e corre o smoke test no browser (shared/smoke.js).
// Uso: node shared/check.js [slug...] [--skip-smoke]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT, loadCourse, evalLessons, slugsFromArgs } = require('./courses.js');
const { buildSteps } = require('./engine.js');
const { runSmoke } = require('./smoke.js');

// ⟦...⟧ marca o que o utilizador escreve: é o stdin do programa e não faz parte da saída.
const inputsOf = text => [...text.matchAll(/⟦([^⟧]*)⟧/g)].map(m => m[1]);
const stripInputs = text => text.replace(/⟦[^⟧]*⟧/g, '');
const normalize = text => text.replace(/\r\n/g, '\n');
const plain = html => String(html).replace(/<[^>]+>/g, ' ');

// Palavras do português do Brasil que não queremos no texto que o aluno lê.
// A última alternativa apanha o gerúndio brasileiro ("está fazendo" em vez de "está a fazer").
const BRAZILIAN = /(?<!\p{L})(tela|telas|arquivos?|usu[aá]ri[oa]s?|voc[eê]s?|celular(es)?|deletar|registros?|equipe|contato|salv(ar|a|e)|baixar|digit(e|ar)|clique|clicar|planilha|senha|mouse|aplicativos?|gerenciar|acessar|cadastr\p{L}*|(estou|está|estava|estamos|estão)\s+(?!quando|segundo|mundo|fundo)\p{L}+(ando|endo|indo))(?!\p{L})/giu;

function makeReport() {
  let checks = 0;
  const failures = [];
  const warnings = [];
  return {
    check(label, ok, detail) {
      checks++;
      if (!ok) failures.push('✗ ' + label + (detail ? '\n' + detail : ''));
    },
    warn(label, detail) { warnings.push('! ' + label + (detail ? '\n' + detail : '')); },
    get checks() { return checks; },
    failures,
    warnings,
  };
}

// Os passos de um exemplo: o motor aceita-os e cada passo aponta para uma linha de código a sério.
function reviewSteps(label, ex, report, lineReport) {
  let steps;
  try { steps = buildSteps(ex.steps); } catch (e) { report.check(label + ': motor', false, e.message); return; }
  const lines = ex.code.split('\n');
  steps.forEach((s, si) => {
    const text = lines[s.l - 1];
    report.check(`${label} passo ${si + 1}: linha ${s.l} existe e não está vazia`, text !== undefined && text.trim() !== '');
    report.check(`${label} passo ${si + 1}: tem explicação`, s.n.trim().length > 0);
    lineReport.push(`${label} #${si + 1} L${s.l}: ${(text || '').trim()}  ||  ${plain(s.n).replace(/\s+/g, ' ').trim().slice(0, 100)}`);
  });
}

// 1. Conteúdo: estrutura de cada lição e linguagem.
function reviewContent(course, lessons, report, lineReport) {
  const texts = [['página inicial', course.homeHtml], ['cábula', course.cheatHtml]];
  lessons.forEach((L, li) => {
    const where = `Lição ${L.id}`;
    report.check(`${where}: id igual à posição`, L.id === li);
    ['title', 'short', 'body', 'analogy'].forEach(f => report.check(`${where}: campo ${f}`, typeof L[f] === 'string' && L[f].trim().length > 0));
    report.check(`${where}: tem exemplos, erros comuns, quiz e exercícios`, L.examples.length && L.mistakes.length && L.quiz.length && L.exercises.length);
    if (L.examples.length > 2) report.warn(`${where}: ${L.examples.length} exemplos (a regra é 1 ou 2)`);
    if (L.exercises.length !== 2) report.warn(`${where}: ${L.exercises.length} exercício(s) (a regra é 2)`);
    texts.push([where, [L.title, L.short, L.body, L.analogy].join(' ')]);
    L.examples.forEach((ex, i) => {
      texts.push([`${where} exemplo ${i + 1}`, ex.title + ' ' + ex.steps.map(s => s.n || '').join(' ')]);
      reviewSteps(`${where} exemplo ${i + 1} (${ex.title})`, ex, report, lineReport);
    });
    texts.push([`${where} erros comuns`, L.mistakes.join(' ')]);
    L.quiz.forEach((q, i) => {
      texts.push([`${where} quiz ${i + 1}`, [q.q, q.exp].concat(q.check ? [] : q.opts).join(' ')]);
      report.check(`${where} quiz ${i + 1}: índice da resposta certa`, Number.isInteger(q.ok) && q.ok >= 0 && q.ok < q.opts.length);
      report.check(`${where} quiz ${i + 1}: tem explicação`, typeof q.exp === 'string' && q.exp.trim().length > 0);
      report.check(`${where} quiz ${i + 1}: opções diferentes entre si`, new Set(q.opts).size === q.opts.length);
    });
    L.exercises.forEach((ex, i) => {
      texts.push([`${where} exercício ${i + 1}`, [ex.title, ex.text, ex.hint].join(' ')]);
      ['title', 'text', 'run', 'hint', 'solution'].forEach(f => report.check(`${where} exercício ${i + 1}: campo ${f}`, typeof ex[f] === 'string' && ex[f].trim().length > 0));
    });
  });
  texts.forEach(([where, text]) => {
    const found = plain(text).match(BRAZILIAN);
    report.check(`${where}: português de Portugal`, !found, found ? 'encontrado: ' + [...new Set(found)].join(', ') : '');
  });
}

// 2. Corre o código com a ferramenta real e compara com a página.
function runPrograms(course, lessons, report) {
  const runner = require(course.runnerPath);
  if (!runner.isAvailable()) {
    report.check(`${runner.toolName} instalado`, false, `Sem o ${runner.toolName} não dá para correr os programas, por isso o curso NÃO está verificado.\n${runner.installHint}`);
    return;
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dozero-' + course.config.slug + '-'));
  const run = (code, stdin, label, item) => {
    const result = runner.run(code, stdin, tmpDir, item);
    if (result.warnings) report.warn(label + ': avisos de ' + runner.toolName, result.warnings);
    if (result.out !== undefined) result.out = normalize(result.out);
    return result;
  };
  const nonAscii = (label, text) => { if (/[^\x00-\x7f⟦⟧]/.test(text)) report.warn(label + ': acentos no texto do programa', JSON.stringify(text)); };

  lessons.forEach(L => {
    L.examples.forEach((ex, ei) => {
      const label = `Lição ${L.id} exemplo ${ei + 1} (${ex.title})`;
      const shown = ex.steps.map(s => s.o || '').join('');
      nonAscii(label, shown);
      const result = run(ex.code, inputsOf(shown).join('\n') + '\n', label, ex);
      if (result.error) { report.check(label, false, result.error); return; }
      const expected = stripInputs(shown);
      report.check(label + ': saída igual à da página', result.out === expected, `página:\n${JSON.stringify(expected)}\nreal:\n${JSON.stringify(result.out)}`);
    });

    L.quiz.forEach((q, qi) => {
      if (!q.check) return;
      const label = `Lição ${L.id} quiz ${qi + 1}`;
      const result = run(runner.wrapQuiz(q.code, q), '', label, q);
      if (result.error) { report.check(label, false, result.error); return; }
      const got = result.out.replace(/\s+$/, '');
      const matching = q.opts.map((o, i) => i).filter(i => q.opts[i].replace(/\s+$/, '') === got);
      report.check(label + ': a opção certa é a saída real', matching.includes(q.ok), `marcada: ${JSON.stringify(q.opts[q.ok])}\nreal: ${JSON.stringify(result.out)}`);
      report.check(label + ': só uma opção coincide', matching.length === 1, `coincidem: ${matching.map(i => 'ABCD'[i]).join(', ')}`);
    });

    L.exercises.forEach((ex, xi) => {
      const label = `Lição ${L.id} exercício ${xi + 1} (${ex.title})`;
      nonAscii(label, ex.run);
      const result = run(ex.solution, inputsOf(ex.run).join('\n') + '\n', label, ex);
      if (result.error) { report.check(label, false, result.error); return; }
      const expected = stripInputs(ex.run);
      report.check(label + ': saída igual ao exemplo de execução', result.out === expected, `página:\n${JSON.stringify(expected)}\nreal:\n${JSON.stringify(result.out)}`);
    });
  });
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

async function checkCourse(slug, options) {
  console.log(`\n=== ${slug} ===`);
  const course = loadCourse(slug);
  const lessons = evalLessons(course);
  const report = makeReport();
  const lineReport = [];

  reviewContent(course, lessons, report, lineReport);
  runPrograms(course, lessons, report);

  const outDir = path.join(ROOT, 'out', slug);
  fs.mkdirSync(outDir, { recursive: true });
  // Lista "passo → linha → explicação", para rever à mão se cada explicação bate com a linha.
  fs.writeFileSync(path.join(outDir, 'line-report.txt'), lineReport.join('\n') + '\n');

  if (!options.skipSmoke) {
    const build = spawnSync(process.execPath, [path.join(__dirname, 'build.js'), slug], { encoding: 'utf8' });
    report.check('build', build.status === 0, build.stderr);
    if (build.status === 0) {
      const smokeErrors = await runSmoke(slug);
      report.check('smoke test no browser', smokeErrors.length === 0, smokeErrors.join('\n'));
    }
  }

  if (report.warnings.length) console.log('\nAvisos:\n' + report.warnings.join('\n\n'));
  if (report.failures.length) console.log('\nFalhas:\n' + report.failures.join('\n\n'));
  console.log(`\n${slug}: ${report.checks - report.failures.length}/${report.checks} verificações passaram.`);
  return report.failures.length === 0;
}

(async () => {
  const args = process.argv.slice(2);
  let allOk = true;
  try {
    for (const slug of slugsFromArgs(args)) {
      const ok = await checkCourse(slug, { skipSmoke: args.includes('--skip-smoke') });
      allOk = allOk && ok;
    }
  } catch (e) {
    console.error('ERRO: ' + (e.stack || e.message));
    process.exit(1);
  }
  process.exit(allOk ? 0 : 1);
})();
