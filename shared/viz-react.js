// ===== Visualizador de apps React (curso de React) =====
// O painel da direita mostra a app a correr (um iframe com o React verdadeiro) e a árvore de componentes,
// com as props, o estado e quais renderizaram no último passo. A árvore é lida do próprio React, pelo
// mesmo gancho que as React DevTools usam; o "renderizou" vem de uma marca que o build põe no início de
// cada componente. No painel do código, as linhas novas em relação à lição anterior (ex.prev) ficam a verde.
// Campos de um passo: act (como no visualizador da página), sel, wait (ms extra antes de olhar para a app).
// Se o código do exemplo tem console.log, aparece também o painel "Consola" (as linhas novas do passo a negrito).
// Também corre em Node: o build e o runner usam hashCode e pageHtml.

// Um número curto que identifica um bocado de código (para encontrar o JavaScript compilado pelo build).
function hashCode(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return 'h' + (h >>> 0).toString(36);
}

// Corre dentro do iframe, antes do React: instala o gancho das DevTools e as marcas de renderização.
function reactInspector() {
  let root = null;
  const marks = {};
  // A consola: cada linha guarda a "geração" (quantas ações já houve), para se saber que linhas são novas.
  const logs = [];
  let generation = 0;
  const originalLog = console.log;
  console.log = function (...args) {
    logs.push({ text: args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '), generation });
    originalLog.apply(console, args);
  };
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, isDisabled: false, renderers: new Map(),
    inject(renderer) { const id = this.renderers.size + 1; this.renderers.set(id, renderer); return id; },
    onCommitFiberRoot(id, fiberRoot) { root = fiberRoot; },
    onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
  };
  // Um valor em texto curto, para a árvore.
  function show(v, depth) {
    if (typeof v === 'function') return 'ƒ';
    if (v && v.nodeType === 1) return '<' + v.tagName.toLowerCase() + '>'; // um elemento da página (um ref)
    if (typeof v === 'string') return JSON.stringify(v);
    if (v === null || typeof v !== 'object') return String(v);
    if ((depth || 0) > 1) return Array.isArray(v) ? '[…]' : '{…}';
    if (Array.isArray(v)) return '[' + v.map(x => show(x, (depth || 0) + 1)).join(', ') + ']';
    return '{ ' + Object.keys(v).map(k => k + ': ' + show(v[k], (depth || 0) + 1)).join(', ') + ' }';
  }
  // O que um hook guarda, para a árvore: estado (useState), ref (useRef) ou memo (useMemo/useCallback).
  // Os efeitos não aparecem. Os hooks estão numa lista ligada, pela ordem em que o componente os chama.
  function hookInfo(h) {
    const v = h.memoizedState;
    if (h.queue && h.queue.dispatch) return { kind: 'state', value: show(v) };
    if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && 'current' in v) return { kind: 'ref', value: show(v.current) };
    if (Array.isArray(v) && v.length === 2 && (v[1] === null || Array.isArray(v[1]))) return { kind: 'memo', value: show(v[0]) };
    return null;
  }
  // Percorre as fibras do React e fica só com os componentes (as funções), com as props e os hooks.
  function walk(fiber, depth, out) {
    while (fiber) {
      if (typeof fiber.type === 'function') {
        const props = {};
        Object.keys(fiber.memoizedProps || {}).forEach(k => { if (k !== 'children') props[k] = show(fiber.memoizedProps[k]); });
        const state = [];
        for (let h = fiber.memoizedState; h; h = h.next) { const info = hookInfo(h); if (info) state.push(info); }
        out.push({ name: fiber.type.name || '?', depth, props, state, key: fiber.key });
        walk(fiber.child, depth + 1, out);
      } else {
        walk(fiber.child, depth, out);
      }
      fiber = fiber.sibling;
    }
    return out;
  }
  window.__dozero = {
    mark(name) { marks[name] = (marks[name] || 0) + 1; },
    reset() { Object.keys(marks).forEach(k => delete marks[k]); generation++; },
    logs() { return logs.map(l => ({ text: l.text, fresh: l.generation === generation })); },
    rendered() { return Object.assign({}, marks); },
    tree() { return root ? walk(root.current.child, 0, []) : []; },
  };
}

// A página completa de uma app: o inspetor, o React, o ReactDOM, o CSS do curso e o código compilado.
function pageHtml(js, css, reactSrc, reactDomSrc) {
  return '<!DOCTYPE html><html lang="pt"><head><meta charset="utf-8"><style>' + css + '</style>' +
    '<script>(' + reactInspector.toString() + ')();</' + 'script>' +
    '<script>' + reactSrc + '</' + 'script><script>' + reactDomSrc + '</' + 'script></head>' +
    '<body><div id="root"></div><script>' + js + '</' + 'script></body></html>';
}

// As linhas de "code" que não estavam em "prev" (uma comparação linha a linha, como um diff simples).
function addedLines(prev, code) {
  const a = prev.split('\n');
  const b = code.split('\n');
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
    L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  }
  const added = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) { i++; j++; } else if (i < a.length && L[i + 1][j] >= L[i][j + 1]) { i++; } else { added.push(j + 1); j++; }
  }
  return added;
}

// Os nomes do que cada hook guarda, tirados do código, pela ordem em que o React os guarda:
// const [nome, setNome] = useState(...), const campo = useRef(...), const total = useMemo(...) / useCallback(...).
// Se o componente chama um hook próprio (useTarefas), os nomes desse hook entram no sítio da chamada.
function stateNames(code, component, depth) {
  if ((depth || 0) > 3) return [];
  const header = new RegExp('function ' + component + '(<[^>]*>)?\\(').exec(code);
  if (!header) return [];
  const rest = code.slice(header.index + header[0].length);
  const end = rest.search(/\n(export )?(default )?(const \w+ = memo\()?function /);
  const body = end < 0 ? rest : rest.slice(0, end);
  const names = [];
  const re = /const \[(\w+), *\w+\] *= *useState\b|const (\w+)(?:: [^=]+)? *= *use(?:Ref|Memo|Callback)\b|\b(use(?!State\b|Effect\b|Ref\b|Memo\b|Callback\b)[A-Z]\w*)(?:<[^>]*>)?\(/g;
  for (const m of body.matchAll(re)) {
    if (m[1] || m[2]) names.push(m[1] || m[2]);
    else names.push(...stateNames(code, m[3], (depth || 0) + 1));
  }
  return names;
}

if (typeof VIZ_MODES === 'undefined') var VIZ_MODES = {};
VIZ_MODES.react = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pageFor = code => {
    const js = typeof REACT_COMPILED !== 'undefined' ? REACT_COMPILED[hashCode(code)] : null;
    if (!js) return '<p style="font-family:sans-serif">(código não compilado pelo build)</p>';
    return pageHtml(js, REACT_CSS, REACT_UMD[0], REACT_UMD[1]);
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // As ações do utilizador. O valor de um campo muda-se pelo setter do protótipo, senão o React não
  // repara na mudança (ele vigia o setter do próprio elemento).
  function applyAct(doc, [type, sel, value]) {
    const el = doc.querySelector(sel);
    if (!el) return;
    if (type === 'click') el.click();
    if (type === 'input') {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true }));
    }
  }

  // Faz as ações uma a uma, limpando as marcas de renderização antes de cada uma. Para (e devolve false)
  // se entretanto o aluno mudou de passo ou de lição: o iframe pode já nem estar na página.
  async function playActs(frame, list, stillCurrent) {
    for (const act of list) {
      if (!stillCurrent() || !frame.contentWindow || !frame.contentWindow.__dozero) return false;
      frame.contentWindow.__dozero.reset();
      applyAct(frame.contentDocument, act);
      await sleep(120);
    }
    return stillCurrent() && !!frame.contentWindow;
  }

  const KIND_LABEL = { state: '', ref: ' (ref)', memo: ' (memo)' };
  // As marcas contam por nome: com 3 ItemTarefa, 3 marcas são 1 render de cada.
  function renderTag(node, tree, rendered) {
    if (!rendered[node.name]) return '';
    const instances = tree.filter(n => n.name === node.name).length;
    const times = Math.round(rendered[node.name] / instances);
    return '<span class="rtag">renderizou' + (times > 1 ? ' ' + times + '×' : '') + '</span>';
  }

  function treeHtml(tree, rendered, code) {
    if (!tree.length) return '<p class="mem-empty">Ainda não há componentes.</p>';
    return tree.map(node => {
      const names = stateNames(code, node.name);
      const props = Object.keys(node.props).map(k => '<span class="rp"><span class="rk">' + esc(k) + '</span>=' + esc(node.props[k]) + '</span>').join('');
      const state = node.state.map((h, i) => '<span class="rs rs-' + h.kind + '"><span class="rk">' + esc((names[i] || 'hook ' + (i + 1)) + KIND_LABEL[h.kind]) + '</span>: ' + esc(h.value) + '</span>').join('');
      return '<div class="rnode' + (rendered[node.name] ? ' rendered' : '') + '" style="margin-left:' + (node.depth * 16) + 'px">' +
        '<div class="rhead"><span class="rname">&lt;' + esc(node.name) + '&gt;</span>' +
        renderTag(node, tree, rendered) + '</div>' +
        (props ? '<div class="rprops">' + props + '</div>' : '') + (state ? '<div class="rstate">' + state + '</div>' : '') + '</div>';
    }).join('');
  }

  // Lê a app (árvore, renderizações) e desenha os painéis.
  function decorate(host, step, code) {
    const frame = host.querySelector('.preview');
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!win || !win.__dozero) return;
    doc.querySelectorAll('.__hl').forEach(e => e.classList.remove('__hl'));
    if (step.sel) { try { doc.querySelectorAll(step.sel).forEach(e => e.classList.add('__hl')); } catch (e) { /* seletor inválido */ } }
    host.querySelector('.rtree').innerHTML = treeHtml(win.__dozero.tree(), win.__dozero.rendered(), code);
    const lines = win.__dozero.logs();
    host.querySelector('.rconsole').innerHTML = lines.length
      ? lines.map(l => '<div class="rlog' + (l.fresh ? ' fresh' : '') + '">' + esc(l.text) + '</div>').join('')
      : '<p class="mem-empty">(nada ainda)</p>';
  }

  // As linhas novas desta lição ficam marcadas no painel do código (uma vez por exemplo).
  function markAdded(host, ex) {
    if (host.__marked || !ex.prev) return;
    host.__marked = true;
    const added = addedLines(ex.prev, ex.code);
    host.querySelectorAll('.ln').forEach(el => { if (added.includes(Number(el.dataset.n))) el.classList.add('novo'); });
  }

  return {
    panelsHtml() {
      return '<div class="panel"><div class="panel-label"><span>App</span><span>podes carregar nos botões</span></div><div class="page-box"><iframe class="preview" title="App do exemplo"></iframe></div></div>' +
        '<div class="panel"><div class="panel-label"><span>Componentes</span><span>amarelo = renderizou agora</span></div><div class="mem rtree"></div></div>' +
        '<div class="panel rconsole-panel" hidden><div class="panel-label"><span>Consola</span><span>negrito = novo neste passo</span></div><div class="rconsole"></div></div>';
    },
    async render(host, step, prev, helpers) {
      const ex = helpers.ex;
      markAdded(host, ex);
      host.querySelector('.rconsole-panel').hidden = !ex.code.includes('console.log');
      const frame = host.querySelector('.preview');
      const acts = step.acts || [];
      const done = host.__acts || [];
      const token = (host.__token || 0) + 1;
      host.__token = token;
      const samePage = host.__loaded && frame.contentWindow && frame.contentWindow.__dozero;
      // Voltar a um passo com menos espera (antes de os dados chegarem) obriga a recarregar a app.
      const wait = step.wait || 0;
      const waitOk = wait >= (host.__wait || 0);
      host.__wait = wait;
      if (samePage && waitOk && done.length <= acts.length && JSON.stringify(acts.slice(0, done.length)) === JSON.stringify(done)) {
        host.__acts = acts;
        if (!(await playActs(frame, acts.slice(done.length), () => host.__token === token))) return;
        if (step.wait) await sleep(step.wait);
        if (host.__token === token) decorate(host, step, ex.code);
        return;
      }
      // Recarrega a app e repete as ações todas.
      host.__loaded = false;
      host.__acts = acts;
      frame.onload = async () => {
        await sleep(150);
        if (!(await playActs(frame, acts, () => host.__token === token))) return;
        if (step.wait) await sleep(step.wait);
        host.__loaded = true;
        if (host.__token === token) decorate(host, step, ex.code);
      };
      host.__loads = (host.__loads || 0) + 1;
      frame.srcdoc = pageFor(ex.code).replace('</head>', '<style>.__hl { outline: 3px solid #f5b400 !important; outline-offset: 2px; }</style></head>') + '<!--' + host.__loads + '-->';
    },
    // Nos exercícios, o "resultado esperado" é a app da solução, a correr: podes experimentá-la.
    exerciseHtml(ex) {
      return '<div><div class="ex-label">Resultado esperado (experimenta)</div><div class="page-box"><iframe class="preview" title="Resultado esperado" srcdoc="' + esc(pageFor(ex.solution)) + '"></iframe></div></div>';
    },
  };
})();

if (typeof module !== 'undefined') module.exports = { hashCode, pageHtml, addedLines, stateNames };
