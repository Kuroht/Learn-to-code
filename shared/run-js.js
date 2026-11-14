// Corre um programa JavaScript dentro do próprio Node, num contexto isolado (módulo vm): não se arranca
// nenhum programa novo. Usado pelos runners de JavaScript e de TypeScript (depois de compilar).
// O console.log escreve exatamente como no Node (util.format). Um erro que ninguém apanhou aparece como
// o Node o mostra na primeira linha ("TypeError: ..."). Espera pelos setTimeout e pelas Promises.
const vm = require('vm');
const util = require('util');

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
    // Uma Promise rejeitada que ninguém apanhou também tem de aparecer, como no Node.
    const result = vm.runInContext(code, context, { timeout: 3000 });
    if (result && typeof result.then === 'function') result.then(null, e => { out += `${e.name}: ${e.message}\n`; });
  } catch (e) {
    out += `${e.name}: ${e.message}\n`;
  }
  for (let i = 0; i < 400 && (pending > 0 || i < 3); i++) await new Promise(r => setTimeout(r, 5));
  return out;
}

module.exports = { runInNode };
