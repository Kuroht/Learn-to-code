// ===== Visualizador de páginas (curso de HTML e CSS) =====
// Troca o painel "Memória + Ecrã" por três: a própria página (um iframe), a árvore DOM e um inspetor
// com o modelo de caixa do elemento em destaque. Tudo o que aparece é calculado pelo browser que mostra
// a página, por isso nunca contradiz o que se vê. Só entra nas páginas com viz: 'page'.
// Campos de um passo: sel (seletor dos elementos em destaque), box (seletor do elemento no inspetor),
// width (largura da página em px, para as media queries). Um exemplo com build: [de, até] mostra as linhas
// desse intervalo a aparecer uma a uma, até à linha do passo.

// O HTML da página num passo: as linhas do intervalo "build" que ainda não chegaram desaparecem.
// Também corre em Node (o runner usa-o para verificar cada passo).
function pageAt(ex, line) {
  const lines = ex.code.split('\n');
  if (!ex.build) return ex.code;
  const [from, to] = ex.build;
  return lines.filter((_, i) => i + 1 < from || i + 1 > to || i + 1 <= line).join('\n');
}

const VIZ_SIDE = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // O destaque é só um contorno, para não mudar as cores da página que se está a estudar.
  const HL_STYLE = '<style>.__hl { outline: 3px solid #f5b400 !important; outline-offset: 2px !important; }</style>';

  // A árvore DOM do body, com os elementos em destaque marcados.
  function treeHtml(el, depth, hits) {
    if (depth > 8) return '';
    return Array.from(el.children).map(child => {
      const tag = child.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style') return '';
      const id = child.id ? '<span class="t-id">#' + esc(child.id) + '</span>' : '';
      const cls = child.classList.length ? '<span class="t-cls">.' + esc(Array.from(child.classList).filter(c => c !== '__hl').join('.')) + '</span>' : '';
      const own = Array.from(child.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
      const text = own ? '<span class="t-txt">' + esc(own.length > 28 ? own.slice(0, 28) + '…' : own) + '</span>' : '';
      return '<div class="tnode' + (hits.includes(child) ? ' hit' : '') + '" style="padding-left:' + (depth * 14) + 'px">' +
        '<span class="t-tag">&lt;' + tag + '&gt;</span>' + id + cls + text + '</div>' + treeHtml(child, depth + 1, hits);
    }).join('');
  }

  // O modelo de caixa de um elemento: margem, borda, enchimento (padding) e conteúdo, em píxeis.
  function boxHtml(el, win) {
    const cs = win.getComputedStyle(el);
    const px = p => Math.round(parseFloat(cs.getPropertyValue(p)) || 0);
    const side = name => [px(name + '-top'), px(name + '-right'), px(name + '-bottom'), px(name + '-left')];
    const b = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'].map(px);
    const m = side('margin');
    const p = side('padding');
    const cw = Math.round(el.clientWidth - p[1] - p[3]);
    const ch = Math.round(el.clientHeight - p[0] - p[2]);
    const tag = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + Array.from(el.classList).filter(c => c !== '__hl').join('.') : '');
    const ring = (label, v, inner, cls) => '<div class="bx ' + cls + '"><span class="bx-l">' + label + '</span>' +
      '<span class="bx-t">' + v[0] + '</span><div class="bx-mid"><span>' + v[3] + '</span>' + inner + '<span>' + v[1] + '</span></div><span class="bx-t">' + v[2] + '</span></div>';
    const content = '<div class="bx bx-c">' + (el.clientWidth ? cw + ' × ' + ch : 'inline') + '</div>';
    return '<div class="insp-head"><code>' + esc(tag) + '</code><span>largura total: ' + el.offsetWidth + 'px</span></div>' +
      ring('margin', m, ring('border', b, ring('padding', p, content, 'bx-p'), 'bx-b'), 'bx-m') +
      '<div class="insp-props"><span>display</span><code>' + esc(cs.display) + '</code><span>color</span><code>' + esc(cs.color) + '</code>' +
      '<span>background</span><code>' + esc(cs.backgroundColor) + '</code><span>font-size</span><code>' + esc(cs.fontSize) + '</code></div>';
  }

  // Depois de a página carregar: destaca os elementos, desenha a árvore e o inspetor.
  function decorate(host, step) {
    const frame = host.querySelector('.preview');
    const doc = frame.contentDocument;
    if (!doc || !doc.body) return;
    doc.querySelectorAll('.__hl').forEach(e => e.classList.remove('__hl'));
    let hits = [];
    if (step.sel) { try { hits = Array.from(doc.querySelectorAll(step.sel)); } catch (e) { hits = []; } }
    hits.forEach(e => e.classList.add('__hl'));
    host.querySelector('.dom').innerHTML = treeHtml(doc.body, 0, hits) || '<p class="mem-empty">O body ainda está vazio.</p>';
    const target = step.box ? doc.querySelector(step.box) : hits[0];
    host.querySelector('.insp').innerHTML = target ? boxHtml(target, frame.contentWindow) : '<p class="mem-empty">Nenhum elemento em destaque.</p>';
  }

  return {
    panelsHtml() {
      return '<div class="panel"><div class="panel-label"><span>Página</span><span>contorno amarelo = em destaque</span></div><div class="page-box"><iframe class="preview" title="Página do exemplo"></iframe></div></div>' +
        '<div class="panel"><div class="panel-label"><span>Árvore (DOM)</span></div><div class="mem dom"></div></div>' +
        '<div class="panel"><div class="panel-label"><span>Inspetor</span><span>modelo de caixa, em px</span></div><div class="mem insp"></div></div>';
    },
    // helpers.ex vem do template: o exemplo inteiro (código e intervalo "build").
    render(host, step, prev, helpers) {
      const frame = host.querySelector('.preview');
      frame.style.width = step.width ? step.width + 'px' : '100%';
      const html = pageAt(helpers.ex, step.l) + HL_STYLE;
      if (host.__html === html) { decorate(host, step); return; }
      host.__html = html;
      frame.onload = () => decorate(host, step);
      frame.srcdoc = html;
    },
    // Nos exercícios, o "resultado esperado" é a página da solução, desenhada pelo browser.
    exerciseHtml(ex) {
      return '<div><div class="ex-label">Resultado esperado</div><div class="page-box"><iframe class="preview" title="Resultado esperado" srcdoc="' + esc(ex.solution) + '"></iframe></div></div>';
    },
  };
})();

if (typeof module !== 'undefined') module.exports = { pageAt };
