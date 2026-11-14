// Verifica programas em TypeScript, tudo dentro do próprio Node (nenhum programa novo é arrancado).
// 1. O compilador do TypeScript (o pacote typescript, em JavaScript puro) verifica os tipos, com strict.
// 2. Se houver erros, a "saída" é o primeiro, como o tsc o escreve: "error TS2322: Type 'string' is not ...".
//    O programa não chega a correr, tal como na vida real.
// 3. Se não houver, o código é traduzido para JavaScript e corre com o shared/run-js.js.
const ts = require('typescript');
const { runInNode } = require('../../shared/run-js.js');

const OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  strict: true,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], // o lib.dom traz o console e o setTimeout
  noEmit: true,
};
const FILE = 'programa.ts';

// As declarações da biblioteca padrão (lib.*.d.ts) são grandes: lê-se cada uma uma só vez e guarda-se.
const libCache = new Map();
const baseHost = ts.createCompilerHost(OPTIONS);

// Os erros de tipos do programa, do primeiro para o último, já em texto.
function typeErrors(code) {
  const host = Object.create(baseHost);
  host.getSourceFile = (name, version) => {
    if (name === FILE) return ts.createSourceFile(name, code, version, true);
    if (!libCache.has(name)) libCache.set(name, baseHost.getSourceFile(name, version));
    return libCache.get(name);
  };
  const program = ts.createProgram([FILE], OPTIONS, host);
  return ts.getPreEmitDiagnostics(program)
    .filter(d => d.file && d.file.fileName === FILE)
    .sort((a, b) => a.start - b.start)
    .map(d => `error TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n').split('\n')[0]}`);
}

// Verifica os tipos e, se estiver tudo bem, corre. Devolve o texto que aparece no ecrã.
async function check(code) {
  const errors = typeErrors(code);
  if (errors.length) return errors[0] + '\n';
  const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return runInNode(js);
}

const nonAsciiWarning = (report, label, text) => {
  if (/[^\x00-\x7f]/.test(text)) report.warn(label + ': acentos no texto do programa', JSON.stringify(text));
};

module.exports = {
  toolName: 'TypeScript ' + ts.version,
  installHint: 'Corre "npm install" na raiz do repositório (instala o typescript).',
  isAvailable: () => true,
  wrapQuiz: code => code,

  async run(code) {
    return { out: await check(code) };
  },

  async checkExample(ex, lesson, { label, report }) {
    const shown = ex.steps.map(s => s.o || '').join('');
    nonAsciiWarning(report, label, shown);
    const out = await check(ex.code);
    report.check(label + ': saída igual à da página', out === shown, `página:\n${JSON.stringify(shown)}\nreal:\n${JSON.stringify(out)}`);
  },

  async checkExercise(ex, lesson, { label, report }) {
    nonAsciiWarning(report, label, ex.run);
    const out = await check(ex.solution);
    report.check(label + ': saída igual ao exemplo de execução', out === ex.run, `página:\n${JSON.stringify(ex.run)}\nreal:\n${JSON.stringify(out)}`);
  },
};
