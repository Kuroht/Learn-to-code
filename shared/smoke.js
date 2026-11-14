// Smoke test no browser: abre docs/<slug>/index.html e, em modo claro, escuro e telemóvel,
// percorre todos os passos de todos os exemplos, responde a todas as perguntas, abre as soluções
// e confirma que não há erros de JavaScript nem scroll horizontal. Guarda capturas em out/<slug>/shots/.
// Uso: node shared/smoke.js [slug...]      (o browser pode ser escolhido com a variável CHROME_PATH)
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, slugsFromArgs } = require('./courses.js');

// Procura um browser Chromium já instalado (Chrome ou Edge), para não ter de descarregar nenhum.
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  const found = candidates.find(p => p && fs.existsSync(p));
  if (!found) throw new Error('Não encontrei o Chrome nem o Edge. Indica o caminho na variável CHROME_PATH.');
  return found;
}

const MODES = [
  { name: 'claro', viewport: { width: 1360, height: 900 }, colorScheme: 'light' },
  { name: 'escuro', viewport: { width: 1360, height: 900 }, colorScheme: 'dark' },
  { name: 'telemovel', viewport: { width: 390, height: 844 }, colorScheme: 'light', isMobile: true, hasTouch: true },
];

async function runSmoke(slug) {
  const { chromium } = require('playwright-core');
  const errors = [];
  const shotsDir = path.join(ROOT, 'out', slug, 'shots');
  fs.mkdirSync(shotsDir, { recursive: true });
  const url = pathToFileURL(path.join(ROOT, 'docs', slug, 'index.html')).href;
  const browser = await chromium.launch({ executablePath: findBrowser() });

  try {
    for (const mode of MODES) {
      const context = await browser.newContext({ viewport: mode.viewport, colorScheme: mode.colorScheme, isMobile: !!mode.isMobile, hasTouch: !!mode.hasTouch });
      const page = await context.newPage();
      const fail = msg => errors.push(`[${mode.name}] ${msg}`);
      page.on('pageerror', e => fail('erro de JavaScript: ' + e.message));
      // As fontes do Google podem falhar sem internet; isso não é um erro da página.
      page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_/.test(m.text())) fail('consola: ' + m.text()); });
      const checkOverflow = async where => {
        const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        if (wide) fail(where + ': a página tem scroll horizontal');
      };
      const goTo = async (hash, readyText) => {
        await page.evaluate(h => { location.hash = h; }, hash);
        await page.waitForFunction(t => document.querySelector('#view').textContent.includes(t), readyText);
      };

      await page.goto(url);
      const lessonCount = await page.evaluate(() => LESSONS.length);
      const cards = await page.$$eval('#home-lessons .card-lesson', els => els.length);
      if (cards !== lessonCount) fail(`página inicial com ${cards} cartões, esperava ${lessonCount}`);
      // O tema escuro está mesmo ligado? (o fundo deve ser escuro só no modo escuro)
      const darkBackground = await page.evaluate(() => {
        const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
        return r + g + b < 200;
      });
      if (darkBackground !== (mode.colorScheme === 'dark')) fail('o fundo não corresponde ao tema ' + mode.colorScheme);
      await checkOverflow('início');
      await page.screenshot({ path: path.join(shotsDir, `${mode.name}-inicio.png`) });

      for (let i = 0; i < lessonCount; i++) {
        try {
          await checkLesson(i);
        } catch (e) {
          fail(`lição ${i}: ${e.message.split('\n')[0]}`);
        }
      }

      // Uma lição: todos os passos, todas as perguntas, soluções abertas.
      async function checkLesson(i) {
        await goTo('licao-' + i, 'Lição ' + i + ' de');
        const stepCounts = await page.evaluate(i => LESSONS[i].examples.map(ex => ex.steps.length), i);
        const vizList = await page.$$('.viz');
        if (vizList.length !== stepCounts.length) fail(`lição ${i}: ${vizList.length} visualizadores, esperava ${stepCounts.length}`);

        for (let v = 0; v < vizList.length; v++) {
          const viz = vizList[v];
          const total = stepCounts[v];
          const count = () => viz.$eval('.viz-count', e => e.textContent);
          // As setas do teclado também avançam.
          await viz.focus();
          await page.keyboard.press('ArrowRight');
          if (total > 1 && (await count()) !== `Passo 2 de ${total}`) fail(`lição ${i} exemplo ${v + 1}: a seta → não avançou`);
          await page.keyboard.press('Home');
          const next = await viz.$('[data-a="next"]');
          for (let k = 1; k < total; k++) {
            await next.click();
            if (mode.isMobile) await checkOverflow(`lição ${i} exemplo ${v + 1} passo ${k + 1}`);
            if (v === 0 && k === Math.floor(total / 2)) await viz.screenshot({ path: path.join(shotsDir, `${mode.name}-licao-${i}.png`) });
          }
          if ((await count()) !== `Passo ${total} de ${total}`) fail(`lição ${i} exemplo ${v + 1}: não chegou ao fim (${await count()})`);
          if (!(await next.isDisabled())) fail(`lição ${i} exemplo ${v + 1}: o botão Seguinte devia estar desligado no fim`);
        }

        // Responde a todas as perguntas com a opção certa e confirma a pontuação.
        const answers = await page.evaluate(i => LESSONS[i].quiz.map(q => q.ok), i);
        for (let q = 0; q < answers.length; q++) {
          await page.click(`[data-q="${q}"] [data-o="${answers[q]}"]`);
          if (!(await page.isVisible(`[data-q="${q}"] .q-exp`))) fail(`lição ${i} pergunta ${q + 1}: a explicação não apareceu`);
        }
        const score = await page.$eval('.score', e => e.textContent);
        if (!score.startsWith(answers.length + '/' + answers.length)) fail(`lição ${i}: pontuação errada (${score})`);

        // Abre as dicas e as soluções (é aí que o código comprido pode alargar a página).
        await page.$$eval('.ex details', list => list.forEach(d => { d.open = true; }));
        await checkOverflow(`lição ${i}`);
      }

      await page.evaluate(() => { location.hash = 'cabula'; });
      await page.waitForSelector('#view .cheat');
      await checkOverflow('cábula');
      await page.screenshot({ path: path.join(shotsDir, `${mode.name}-cabula.png`), fullPage: true });
      const doneText = await page.$eval('#progress', e => e.textContent);
      if (!doneText.startsWith(lessonCount + ' de ' + lessonCount)) fail('progresso na barra lateral: ' + doneText);
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return errors;
}

module.exports = { runSmoke };

if (require.main === module) {
  (async () => {
    let failed = false;
    for (const slug of slugsFromArgs(process.argv.slice(2))) {
      const errors = await runSmoke(slug);
      console.log(`${slug}: ` + (errors.length ? '\n' + errors.join('\n') : 'SEM ERROS'));
      failed = failed || errors.length > 0;
    }
    process.exit(failed ? 1 : 0);
  })();
}
