// Corre programas em JavaScript para o shared/check.js comparar a saída real com a da página.
// Os programas normais correm dentro do próprio Node, num contexto isolado (módulo vm): não se arranca
// nenhum programa novo. O console.log escreve exatamente como no Node (util.format).
// Os exemplos, perguntas e exercícios das lições do DOM (viz: 'page', ask ou tests) são verificados
// num browser sem janela, com o shared/page-check.js (o mesmo do curso de HTML).
const vm = require('vm');
const util = require('util');
const pageCheck = require('../../shared/page-check.js');

// Corre um programa e devolve tudo o que ele escreveu. Um erro que ninguém apanhou aparece como o Node o
// mostra na primeira linha ("TypeError: ..."). Espera pelos setTimeout e pelas Promises antes de acabar.
async function runInNode(code) {
  let out = '';
  let pending = 0;
  const context = vm.createContext({
    console: { log: (...args) => { out += util.format(...args) + '\n'; } },
    // Funções que o Node e os browsers dão, mas que não fazem parte da linguagem (o contexto vm não as tem).
    structuredClone: value => structuredClone(value),
    setTimeout: (fn, ms, ...args) => {
      pending++;
      return setTimeout(() => { pending--; try { fn(...args); } catch (e) { out += `${e.name}: ${e.message}\n`; } }, ms);
    },
  });
  try {
    vm.runInContext(code, context, { timeout: 3000 });
  } catch (e) {
    out += `${e.name}: ${e.message}\n`;
  }
  for (let i = 0; i < 200 && (pending > 0 || i < 3); i++) await new Promise(r => setTimeout(r, 5));
  return out;
}

const nonAsciiWarning = (report, label, text) => {
  if (/[^\x00-\x7f]/.test(text)) report.warn(label + ': acentos no texto do programa', JSON.stringify(text));
};

module.exports = {
  toolName: 'node',
  installHint: 'É preciso o Node.js (e o Edge ou o Chrome para as lições do DOM).',
  isAvailable: () => true,
  wrapQuiz: code => code,

  async run(code, stdin, tmpDir, item) {
    if (item.ask) return pageCheck.ask(code, item);
    return { out: await runInNode(code) };
  },

  async checkExample(ex, lesson, ctx) {
    if (ex.viz === 'page') return pageCheck.checkExample(ex, ctx);
    const shown = ex.steps.map(s => s.o || '').join('');
    nonAsciiWarning(ctx.report, ctx.label, shown);
    const out = await runInNode(ex.code);
    ctx.report.check(ctx.label + ': saída igual à da página', out === shown, `página:\n${JSON.stringify(shown)}\nreal:\n${JSON.stringify(out)}`);
  },

  async checkExercise(ex, lesson, ctx) {
    if (ex.tests) return pageCheck.checkExercise(ex, ctx);
    nonAsciiWarning(ctx.report, ctx.label, ex.run);
    const out = await runInNode(ex.solution);
    ctx.report.check(ctx.label + ': saída igual ao exemplo de execução', out === ex.run, `página:\n${JSON.stringify(ex.run)}\nreal:\n${JSON.stringify(out)}`);
  },

  finish: pageCheck.close,
};
