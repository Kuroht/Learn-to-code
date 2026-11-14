// Verifica o curso de React:
// 1. o TypeScript verifica os tipos de cada App.tsx com os tipos oficiais do React (@types/react), como num
//    projeto Vite com TypeScript;
// 2. a app corre num browser sem janela (o mesmo React que vai dentro da página), cada passo é repetido
//    com as suas ações, e confirma-se o que aparece (chk), que componentes renderizaram (rr), quantas vezes (rn)
//    e as linhas da consola desde o início (log).
// Nas perguntas e nos testes dos exercícios, o seletor especial "@consola" dá as linhas da consola, uma por linha.
const path = require('path');
const ts = require('typescript');
const pageCheck = require('../../shared/page-check.js');
const { buildSteps } = require('../../shared/engine.js');
const { toPageJs, reactUmd } = require('../../shared/react-build.js');
const { pageHtml } = require('../../shared/viz-react.js');
const config = require('./course.js');

const ROOT = path.join(__dirname, '..', '..');
const FILE = path.join(ROOT, 'App.tsx').replace(/\\/g, '/'); // ficheiro virtual: o código da lição
const OPTIONS = {
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  types: ['react', 'react-dom'],
  skipLibCheck: true,
  noEmit: true,
};
// O React demora um pouco a desenhar depois de carregar e depois de cada ação.
const SETTLE = 150;

const cache = new Map();
const baseHost = ts.createCompilerHost(OPTIONS);

// Os erros de tipos do código, já em texto ("error TS2322: ..."), do primeiro para o último.
function typeErrors(code) {
  const host = Object.create(baseHost);
  const isFile = name => name.replace(/\\/g, '/') === FILE;
  host.getCurrentDirectory = () => ROOT;
  host.fileExists = name => isFile(name) || baseHost.fileExists(name);
  host.readFile = name => (isFile(name) ? code : baseHost.readFile(name));
  host.getSourceFile = (name, version) => {
    if (isFile(name)) return ts.createSourceFile(name, code, version, true, ts.ScriptKind.TSX);
    if (!cache.has(name)) cache.set(name, baseHost.getSourceFile(name, version));
    return cache.get(name);
  };
  const program = ts.createProgram([FILE], OPTIONS, host);
  return ts.getPreEmitDiagnostics(program)
    .filter(d => d.file && isFile(d.file.fileName))
    .sort((a, b) => a.start - b.start)
    .map(d => `error TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n').split('\n')[0]}`);
}

// Uma medição: a consola ("@consola") ou um elemento da página (como no curso de HTML).
async function measure(sel, what) {
  if (sel === '@consola') return (await pageCheck.evaluate(() => window.__dozero.logs().map(l => l.text))).join('\n');
  return pageCheck.measure(sel, what);
}

const UMD = reactUmd();
const pageOf = code => pageHtml(toPageJs(code), config.previewCss, UMD[0], UMD[1]);

module.exports = {
  toolName: 'TypeScript + React (Edge sem janela)',
  installHint: 'Corre "npm install" (typescript, react, react-dom e os tipos) e tem o Edge ou o Chrome instalado.',
  isAvailable: () => pageCheck.isAvailable(),
  wrapQuiz: code => code,

  // Uma pergunta: se o código não compila, a "saída" é o erro; senão, a medição pedida em ask, depois das ações.
  async run(code, stdin, tmpDir, q) {
    const errors = typeErrors(code);
    if (errors.length) return { out: errors[0] + '\n' };
    if (!q.ask) return { error: 'pergunta com check: true mas sem ask' };
    await pageCheck.open();
    const jsErrors = await pageCheck.render(pageOf(code), q.width, q.acts, { settle: SETTLE, wait: q.wait });
    if (jsErrors.length) return { error: 'ERRO DE JAVASCRIPT NA APP: ' + jsErrors.join('; ') };
    return { out: await measure(q.ask[0], q.ask[1]) };
  },

  async checkExample(ex, lesson, { label, report }) {
    const errors = typeErrors(ex.code);
    report.check(label + ': compila sem erros de tipos', errors.length === 0, errors.join('\n'));
    if (errors.length) return;
    let steps;
    try { steps = buildSteps(ex.steps); } catch (e) { return; } // já reportado na revisão do conteúdo
    await pageCheck.open();
    const html = pageOf(ex.code);
    for (const [i, s] of steps.entries()) {
      const where = `${label} passo ${i + 1}`;
      const jsErrors = await pageCheck.render(html, null, s.acts, { settle: SETTLE, wait: s.wait });
      report.check(`${where}: sem erros de JavaScript`, jsErrors.length === 0, jsErrors.join('\n'));
      if (s.sel) report.check(`${where}: "${s.sel}" encontra elementos`, Number(await pageCheck.measure(s.sel, 'count')) > 0);
      for (const [sel, what, expected] of ex.steps[i].chk || []) {
        const got = await measure(sel, what);
        report.check(`${where}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
      }
      // rr: os componentes que renderizaram por causa deste passo (a montagem, ou a última ação).
      const rr = ex.steps[i].rr;
      if (rr) {
        const rendered = Object.keys(await pageCheck.evaluate(() => window.__dozero.rendered())).sort();
        report.check(`${where}: renderizaram ${rr.join(', ') || '(nenhum)'}`, JSON.stringify(rendered) === JSON.stringify(rr.slice().sort()), `real: ${rendered.join(', ') || '(nenhum)'}`);
      }
      // rn: quantas vezes renderizaram (para mostrar renders a mais), por exemplo { App: 2 }.
      for (const [name, times] of Object.entries(ex.steps[i].rn || {})) {
        const counts = await pageCheck.evaluate(() => window.__dozero.rendered());
        report.check(`${where}: ${name} renderizou ${times} vez(es)`, (counts[name] || 0) === times, `real: ${counts[name] || 0}`);
      }
      // log: todas as linhas da consola desde que a app abriu.
      const log = ex.steps[i].log;
      if (log) {
        const got = await measure('@consola');
        report.check(`${where}: consola = ${log.join(' / ') || '(vazia)'}`, got === log.join('\n'), `real: ${got.split('\n').join(' / ') || '(vazia)'}`);
      }
    }
  },

  async checkExercise(ex, lesson, { label, report }) {
    const errors = typeErrors(ex.solution);
    report.check(label + ': a solução compila sem erros de tipos', errors.length === 0, errors.join('\n'));
    if (errors.length) return;
    report.check(label + ': tem testes', Array.isArray(ex.tests) && ex.tests.length > 0);
    await pageCheck.open();
    const jsErrors = await pageCheck.render(pageOf(ex.solution), ex.width, ex.acts, { settle: SETTLE, wait: ex.wait });
    report.check(label + ': sem erros de JavaScript', jsErrors.length === 0, jsErrors.join('\n'));
    for (const [sel, what, expected] of ex.tests || []) {
      const got = await measure(sel, what);
      report.check(`${label}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
    }
  },

  finish: pageCheck.close,
};
