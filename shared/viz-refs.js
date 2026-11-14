// ===== Visualizador de referências (Python, e mais tarde C# e TypeScript) =====
// Troca o painel "Memória" por dois: "Nomes" (os frames, com as variáveis) e "Objetos" (o heap).
// Uma variável que aponta para um objeto mostra "→ #1"; o objeto tem a etiqueta "#1" da mesma cor.
// Assim, dois nomes a apontar para a mesma lista veem-se logo. Só entra nas páginas com viz: 'refs'.

// Cada visualizador regista-se em VIZ_MODES com o seu nome; um curso (ou um exemplo) escolhe qual usa.
if (typeof VIZ_MODES === 'undefined') var VIZ_MODES = {};
VIZ_MODES.refs = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const isRef = v => typeof v === 'string' && v.charAt(0) === '@';
  // Os textos dos painéis: por omissão os do Python; um curso pode trocá-los em course.js (vizLabels).
  // moved: o valor que marca uma variável que já não se pode usar (Rust); orphan: a nota de um objeto sem dono.
  const LABELS = Object.assign({ names: 'Nomes', objects: 'Objetos', moved: null, orphan: 'sem nomes: vai ser apagado' },
    typeof COURSE !== 'undefined' && COURSE.vizLabels ? COURSE.vizLabels : {});

  // A etiqueta de um objeto: o id sem o "o" ('o3' → '#3'), com uma de seis cores.
  function chip(id, changed, arrow) {
    const n = parseInt(id.replace(/\D/g, ''), 10) || 0;
    return '<span class="ref ref-c' + (n % 6) + (changed ? ' chg' : '') + '">' + (arrow ? '→ ' : '') + '#' + esc(id.replace(/^o/, '')) + '</span>';
  }

  // Um valor dentro de uma variável ou de um objeto: uma referência vira etiqueta, um struct do C#
  // (um objeto guardado na própria variável) mostra os campos, e o resto aparece tal e qual.
  function valueHtml(v, changed) {
    if (isRef(v)) return chip(v.slice(1), changed, true);
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return '<span class="inline-struct' + (changed ? ' chg' : '') + '">' +
        Object.keys(v).map(k => '<span class="f-name">' + esc(k) + '</span> ' + valueHtml(v[k], false)).join('<span class="sep">, </span>') + '</span>';
    }
    // Um array guardado na própria variável (por exemplo um array do Rust na pilha): [a, b, c].
    if (Array.isArray(v)) return '<span class="' + (changed ? 'chg' : '') + '">[' + v.map(x => valueHtml(x, false)).join(', ') + ']</span>';
    if (LABELS.moved && v === LABELS.moved) return '<span class="moved' + (changed ? ' chg' : '') + '">' + esc(v) + '</span>';
    return '<span class="' + (changed ? 'chg' : '') + '">' + esc(v) + '</span>';
  }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ---------- Nomes ----------
  function namesHtml(frames, prevFrames) {
    if (!frames.length) return '<p class="mem-empty">O programa ainda não começou a correr.</p>';
    return frames.map((f, fi) => {
      const active = fi === frames.length - 1;
      const prev = prevFrames && prevFrames[fi] && prevFrames[fi].name === f.name ? prevFrames[fi] : null;
      const vars = f.vars.length
        ? '<div class="names">' + f.vars.map(v => {
          const old = prev ? prev.vars.find(x => x.name === v.name) : undefined;
          const isNew = prevFrames && !old;
          return '<div class="name' + (isNew ? ' is-new' : '') + '">' +
            (v.type ? '<span class="var-type">' + esc(v.type) + '</span>' : '') +
            '<span class="var-name">' + esc(v.name) + '</span>' + valueHtml(v.value, old && !same(old.value, v.value)) + '</div>';
        }).join('') + '</div>'
        : '<p class="mem-empty">sem nomes</p>';
      // O frame de topo chama-se "global" (Python) ou "Main" (C#); os das funções levam () no fim.
      const label = f.name === 'global' || !/^\w+$/.test(f.name) ? f.name : f.name + '()';
      return '<div class="frame' + (active ? ' active' : '') + '"><div class="frame-name"><span>' + esc(label) + '</span>' +
        (active && frames.length > 1 ? '<span>a correr</span>' : (!active ? '<span>em pausa</span>' : '')) + '</div>' + vars + '</div>';
    }).join('');
  }

  // ---------- Objetos ----------
  // O corpo de um objeto depende do tipo: lista/tuplo (caixas com índice), dicionário (chave → valor),
  // objeto com campos (C#), ou um valor simples (int, str, ...).
  function objectBody(obj, old) {
    const v = obj.value;
    const prevAt = k => (old && old.type === obj.type && old.value ? old.value[k] : undefined);
    if (Array.isArray(v) && (obj.type === 'dict' || /^Dictionary/.test(obj.type))) {
      if (!v.length) return '<span class="obj-empty">vazio</span>';
      const oldMap = {};
      if (old && Array.isArray(old.value)) old.value.forEach(([k, x]) => { oldMap[JSON.stringify(k)] = x; });
      return '<div class="t-wrap"><table class="mini kv"><tbody>' + v.map(([k, x]) => {
        const before = oldMap[JSON.stringify(k)];
        const changed = old && (before === undefined || !same(before, x));
        return '<tr><td>' + valueHtml(k, false) + '</td><td>' + valueHtml(x, changed) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    }
    if (Array.isArray(v)) {
      if (!v.length) return '<span class="obj-empty">vazia</span>';
      return '<div class="cells">' + v.map((x, i) => {
        const before = prevAt(i);
        const changed = old && (before === undefined || !same(before, x));
        return '<div class="cell"><span class="cell-v">' + valueHtml(x, changed) + '</span><span class="cell-i">[' + i + ']</span></div>';
      }).join('') + '</div>';
    }
    if (v && typeof v === 'object') {
      return '<div class="fields">' + Object.keys(v).map(k => {
        const before = prevAt(k);
        return '<span class="f-name">' + esc(k) + '</span><span>' + valueHtml(v[k], old && !same(before, v[k])) + '</span>';
      }).join('') + '</div>';
    }
    return '<div class="var-val">' + valueHtml(v, old && !same(old.value, v)) + '</div>';
  }

  function heapHtml(heap, orphans, prevHeap) {
    const ids = Object.keys(heap);
    if (!ids.length) return '<p class="mem-empty">Ainda não há objetos.</p>';
    return '<div class="objs">' + ids.map(id => {
      const obj = heap[id];
      const old = prevHeap ? prevHeap[id] : undefined;
      const isNew = prevHeap && !old;
      const orphan = orphans.includes(id);
      return '<div class="obj' + (isNew ? ' is-new' : '') + (orphan ? ' orphan' : '') + '">' +
        '<div class="obj-top">' + chip(id, false, false) + '<span class="var-type">' + esc(obj.type) + '</span></div>' +
        objectBody(obj, old) +
        (orphan ? '<span class="orphan-note">' + esc(LABELS.orphan) + '</span>' : '') + '</div>';
    }).join('') + '</div>';
  }

  return {
    panelsHtml() {
      return '<div class="panel"><div class="panel-label"><span>' + esc(LABELS.names) + '</span><span>→ #n = aponta para o objeto #n</span></div><div class="mem names-box"></div></div>' +
        '<div class="panel"><div class="panel-label"><span>' + esc(LABELS.objects) + '</span><span>amarelo = mudou agora</span></div><div class="mem heap-box"></div></div>' +
        '<div class="panel out"><div class="panel-label"><span>Ecrã</span></div><pre class="term"></pre></div>';
    },
    // helpers vem do template: renderTerm (o ecrã) e isLast (se é o último passo).
    render(host, step, prev, helpers) {
      host.querySelector('.names-box').innerHTML = namesHtml(step.frames, prev ? prev.frames : null);
      host.querySelector('.heap-box').innerHTML = heapHtml(step.heap, step.orphans, prev ? prev.heap : null);
      const term = host.querySelector('.term');
      term.innerHTML = helpers.renderTerm(step.out, !helpers.isLast);
      term.scrollTop = term.scrollHeight;
    },
  };
})();

