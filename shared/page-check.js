// Verifica páginas num browser a sério (Edge ou Chrome, sem janela), com o playwright-core.
// Usado pelos runners dos cursos de HTML e de JavaScript (lições do DOM).
// Uma medição é [seletor, o quê]: 'count' (quantos elementos), 'text' (o texto visível), 'width' e 'height'
// (tamanho total em px), 'value' (o valor de um campo) ou o nome de uma propriedade CSS (o valor calculado).
// As ações (act) são as mesmas do visualizador: ['click', seletor] ou ['input', seletor, texto].
const { buildSteps } = require('./engine.js');
const { pageAt, applyActsSource } = require('./viz-page.js');
const { findBrowser } = require('./smoke.js');

// As cores usadas nos cursos, com o nome em português (é assim que aparecem nas opções das perguntas).
const COLOR_NAMES = {
  'rgb(255, 0, 0)': 'vermelho', 'rgb(0, 0, 255)': 'azul', 'rgb(0, 128, 0)': 'verde',
  'rgb(255, 165, 0)': 'laranja', 'rgb(128, 0, 128)': 'roxo', 'rgb(0, 0, 0)': 'preto',
  'rgb(128, 128, 128)': 'cinzento', 'rgb(255, 255, 255)': 'branco', 'rgba(0, 0, 0, 0)': 'transparente',
};

const state = { browser: null, page: null, key: null, errors: [] };

function isAvailable() {
  try { findBrowser(); require('playwright-core'); return true; } catch (e) { return false; }
}

async function open() {
  if (state.browser) return;
  const { chromium } = require('playwright-core');
  state.browser = await chromium.launch({ executablePath: findBrowser() });
}

// Cada página é desenhada num separador novo. Reaproveitar o mesmo separador mantinha as variáveis
// globais (let/const) da página anterior, e o script seguinte falhava com "already been declared".
async function freshPage() {
  if (state.page) await state.page.close();
  state.page = await state.browser.newPage();
  // Os erros de JavaScript da página ficam guardados: um exemplo com um erro no script tem de falhar.
  state.page.on('pageerror', e => state.errors.push(e.message));
}

async function close() {
  if (state.browser) await state.browser.close();
  state.browser = null;
  state.page = null;
  state.key = null;
}

// Desenha uma página, faz as ações e devolve os erros de JavaScript que houve (só recarrega se algo mudou).
// opts.settle: ms à espera depois de carregar e depois de cada ação (o React desenha um pouco depois);
// com settle, as ações são feitas uma a uma e as marcas de renderização são limpas antes de cada uma.
// opts.wait: ms extra no fim (para timers da própria app).
async function render(html, width, acts, opts = {}) {
  const w = width || 800;
  const key = JSON.stringify([html, w, acts || [], opts]);
  if (state.key === key) return [];
  state.errors = [];
  await freshPage();
  await state.page.setViewportSize({ width: w, height: 600 });
  await state.page.setContent(html, { waitUntil: 'load' });
  const apply = list => state.page.evaluate(([src, l]) => {
    if (window.__dozero) window.__dozero.reset();
    new Function('return ' + src)()(document, l);
  }, [applyActsSource, list]);
  if (opts.settle) {
    await state.page.waitForTimeout(opts.settle);
    for (const act of acts || []) {
      await apply([act]);
      await state.page.waitForTimeout(opts.settle);
    }
  } else if (acts && acts.length) {
    await apply(acts);
  }
  if (opts.wait) await state.page.waitForTimeout(opts.wait);
  state.key = key;
  return state.errors.slice();
}

// Corre uma função dentro da página desenhada (o runner de React usa-a para ler quem renderizou).
const evaluate = (fn, arg) => state.page.evaluate(fn, arg);

// Mede uma coisa na página desenhada e devolve-a como texto.
async function measure(sel, what) {
  const value = await state.page.evaluate(([s, w]) => {
    const all = document.querySelectorAll(s);
    if (w === 'count') return String(all.length);
    const el = all[0];
    if (!el) return '(nenhum elemento)';
    if (w === 'text') return el.innerText.trim();
    if (w === 'value') return el.value;
    if (w === 'width') return el.offsetWidth + 'px';
    if (w === 'height') return el.offsetHeight + 'px';
    return getComputedStyle(el).getPropertyValue(w);
  }, [sel, what]);
  return COLOR_NAMES[value] || value;
}

// Uma pergunta: desenha o código (com as ações da pergunta) e devolve a medição pedida em ask.
async function ask(code, item) {
  await open();
  const errors = await render(code, item.width, item.acts);
  if (errors.length) return { error: 'ERRO DE JAVASCRIPT NA PÁGINA: ' + errors.join('; ') };
  return { out: await measure(item.ask[0], item.ask[1]) };
}

// Cada passo de um exemplo: sem erros de JavaScript, o que está em destaque existe, e as afirmações (chk) batem certo.
async function checkExample(ex, { label, report }) {
  await open();
  let steps;
  try { steps = buildSteps(ex.steps); } catch (e) { return; } // já reportado na revisão do conteúdo
  for (const [i, s] of steps.entries()) {
    const where = `${label} passo ${i + 1}`;
    const errors = await render(pageAt(ex, s.l), s.width, s.acts);
    report.check(`${where}: sem erros de JavaScript`, errors.length === 0, errors.join('\n'));
    if (s.sel) report.check(`${where}: "${s.sel}" encontra elementos`, Number(await measure(s.sel, 'count')) > 0);
    if (s.box) report.check(`${where}: "${s.box}" existe`, Number(await measure(s.box, 'count')) > 0);
    for (const [sel, what, expected] of ex.steps[i].chk || []) {
      const got = await measure(sel, what);
      report.check(`${where}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
    }
  }
}

// A página da solução (depois das ações do exercício, se tiver) passa todos os testes.
async function checkExercise(ex, { label, report }) {
  await open();
  report.check(label + ': tem testes', Array.isArray(ex.tests) && ex.tests.length > 0);
  const errors = await render(ex.solution, ex.width, ex.acts);
  report.check(label + ': sem erros de JavaScript', errors.length === 0, errors.join('\n'));
  for (const [sel, what, expected] of ex.tests || []) {
    const got = await measure(sel, what);
    report.check(`${label}: ${sel} ${what} = ${expected}`, got === String(expected), `real: ${got}`);
  }
}

module.exports = { isAvailable, open, close, ask, checkExample, checkExercise, render, measure, evaluate };
