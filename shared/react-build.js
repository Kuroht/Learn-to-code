// Prepara o código das lições de React para correr na página, sem bundler (só em Node, no build e no check).
// O código das lições é o de um projeto Vite a sério (App.tsx, com imports e export default). Aqui:
//   1. os imports do "react" passam a vir do React global (o ficheiro UMD que vai dentro da página);
//   2. os outros imports e os exports desaparecem (cada exemplo é um só ficheiro);
//   3. o TypeScript compila o TSX para JavaScript (JSX → React.createElement);
//   4. cada componente (função com nome em maiúscula) ganha uma marca no início, para o visualizador
//      saber quem renderizou;
//   5. no fim, a App é montada no <div id="root">.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { hashCode } = require('./viz-react.js');

function toPageJs(tsx) {
  const src = tsx
    .replace(/^import\s+\{([^}]*)\}\s+from\s+["']react["'];?[ \t]*$/gm, (m, names) => {
      const values = names.split(',').map(s => s.trim()).filter(s => s && !s.startsWith('type '));
      return values.length ? 'const { ' + values.join(', ') + ' } = React;' : '';
    })
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+default\s+function/gm, 'function')
    .replace(/^export\s+(function|const|interface|type)\b/gm, '$1')
    .replace(/^export\s+default\s+\w+;?[ \t]*$/gm, '');
  const out = ts.transpileModule(src, {
    compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
  }).outputText;
  const marked = out.replace(/function ([A-Z][A-Za-z0-9_]*)\(([^)]*)\) \{/g, (m, name) => m + ' __dozero.mark("' + name + '");');
  return marked + '\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));\n';
}

// Todo o código React de um curso: os exemplos, as perguntas com ask e as soluções dos exercícios.
function reactSources(lessons, defaultViz) {
  const sources = [];
  lessons.forEach(L => {
    L.examples.forEach(ex => { if ((ex.viz || defaultViz) === 'react') sources.push(ex.code); });
    L.quiz.forEach(q => { if (q.ask) sources.push(q.code); });
    L.exercises.forEach(ex => { if (ex.tests) sources.push(ex.solution); });
  });
  return sources;
}

// { hash do código: JavaScript compilado }, para o visualizador encontrar o JavaScript de cada exemplo.
function compileAll(lessons, defaultViz) {
  const map = {};
  reactSources(lessons, defaultViz).forEach(code => { map[hashCode(code)] = toPageJs(code); });
  return map;
}

// Os ficheiros UMD do React 18 (a última versão que os tem): vão inteiros para dentro da página.
function reactUmd() {
  const root = path.join(__dirname, '..', 'node_modules');
  return [
    fs.readFileSync(path.join(root, 'react', 'umd', 'react.production.min.js'), 'utf8'),
    fs.readFileSync(path.join(root, 'react-dom', 'umd', 'react-dom.production.min.js'), 'utf8'),
  ];
}

module.exports = { toPageJs, compileAll, reactUmd };
