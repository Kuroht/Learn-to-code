// Verifica o curso de HTML e CSS num browser a sério (Edge ou Chrome, sem janela), com o playwright-core.
// Cada passo de cada exemplo é desenhado e as afirmações das explicações (chk) são medidas na página;
// as perguntas (ask) e os testes dos exercícios (tests) também.
// Uma medição é [seletor, o quê]: 'count' (quantos elementos), 'text' (o texto visível), 'width' e 'height'
// (tamanho total em px) ou o nome de uma propriedade CSS (o valor calculado pelo browser).
const { buildSteps } = require('../../shared/engine.js');
const { pageAt } = require('../../shared/viz-page.js');
const { findBrowser } = require('../../shared/smoke.js');

// As cores usadas no curso, com o nome em português (é assim que aparecem nas opções das perguntas).
const COLOR_NAMES = {
  'rgb(255, 0, 0)': 'vermelho', 'rgb(0, 0, 255)': 'azul', 'rgb(0, 128, 0)': 'verde',
  'rgb(255, 165, 0)': 'laranja', 'rgb(128, 0, 128)': 'roxo', 'rgb(0, 0, 0)': 'preto',
  'rgb(128, 128, 128)': 'cinzento', 'rgb(255, 255, 255)': 'branco', 'rgba(0, 0, 0, 0)': 'transparente',
};

const state = { browser: null, page: null, html: null, width: null };

// Desenha uma página (só se for diferente da última).
async function render(html, width) {
  const w = width || 800;
  if (state.html === html && state.width === w) return;
  await state.page.setViewportSize({ width: w, height: 600 });
  await state.page.setContent(html, { waitUntil: 'load' });
  state.html = html;
  state.width = w;
}

// Mede uma coisa na página desenhada e devolve-a como texto.
async function measure(sel, what) {
  const value = await state.page.evaluate(([s, w]) => {
    const all = document.querySelectorAll(s);
    if (w === 'count') return String(all.length);
    const el = all[0];
    if (!el) return '(nenhum elemento)';
    if (w === 'text') return el.innerText.trim();
    if (w === 'width') return el.offsetWidth + 'px';
    if (w === 'height') return el.offsetHeight + 'px';
    return getComputedStyle(el).getPropertyValue(w);
  }, [sel, what]);
  return COLOR_NAMES[value] || value;
}

module.exports = {
  toolName: 'Edge/Chrome (sem janela)',
  installHint: 'É preciso o Chrome ou o Edge instalado (ou o caminho na variável CHROME_PATH), e "npm install".',

  isAvailable() {
    try { findBrowser(); require('playwright-core'); return true; } catch (e) { return false; }
  },

  async prepare() {
    const { chromium } = require('playwright-core');
    state.browser = await chromium.launch({ executablePath: findBrowser() });
    state.page = await state.browser.newPage();
    return null;
  },

  wrapQuiz(code) {
    return code;
  },

  // Uma pergunta com ask: [seletor, o quê] desenha o código e devolve a medição (que tem de ser a opção certa).
  async run(code, stdin, tmpDir, item) {
    if (!item.ask) return { error: 'pergunta com check: true mas sem ask' };
    await render(code, item.width);
    return { out: await measure(item.ask[0], item.ask[1]) };
  },

  // Cada passo: o que está em destaque (sel, box) existe na página desse passo, e as afirmações (chk) batem certo.
  async checkExample(ex, lesson, { label, report }) {
    let steps;
    try { steps = buildSteps(ex.steps); } catch (e) { return; } // já reportado na revisão do conteúdo
    for (const [i, s] of steps.entries()) {
      const where = `${label} passo ${i + 1}`;
      await render(pageAt(ex, s.l), s.width);
      if (s.sel) report.check(`${where}: "${s.sel}" encontra elementos`, Number(await measure(s.sel, 'count')) > 0);
      if (s.box) report.check(`${where}: "${s.box}" existe`, Number(await measure(s.box, 'count')) > 0);
      for (const [sel, what, expected] of ex.steps[i].chk || []) {
        const got = await measure(sel, what);
        report.check(`${where}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
      }
    }
  },

  // A página da solução passa todos os testes do exercício.
  async checkExercise(ex, lesson, { label, report }) {
    report.check(label + ': tem testes', Array.isArray(ex.tests) && ex.tests.length > 0);
    await render(ex.solution, ex.width);
    for (const [sel, what, expected] of ex.tests || []) {
      const got = await measure(sel, what);
      report.check(`${label}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
    }
  },

  async finish() {
    if (state.browser) await state.browser.close();
  },
};
