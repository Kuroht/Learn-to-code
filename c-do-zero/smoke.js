const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text()) && !/ERR_/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/home.png', fullPage: false });
  const n = await page.evaluate(() => LESSONS.length);
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => { location.hash = 'licao-' + i; }, i);
    await page.waitForTimeout(80);
    const vizCount = await page.$$eval('.viz', v => v.length);
    for (let v = 0; v < vizCount; v++) {
      const viz = (await page.$$('.viz'))[v];
      for (let k = 0; k < 40; k++) {
        const next = await viz.$('[data-a="next"]');
        if (await next.isDisabled()) break;
        await next.click();
      }
      const count = await viz.$eval('.viz-count', e => e.textContent);
      const term = await viz.$eval('.term', e => e.textContent);
      if (!/Passo (\d+) de \1/.test(count)) errors.push(`L${i} viz${v}: não chegou ao fim (${count})`);
    }
    // responder ao quiz: sempre a opção certa
    const qn = await page.$$eval('.q', q => q.length);
    for (let q = 0; q < qn; q++) {
      const ok = await page.evaluate(([i, q]) => LESSONS[i].quiz[q].ok, [i, q]);
      await page.click(`[data-q="${q}"] [data-o="${ok}"]`);
    }
    const score = await page.$eval('.score', e => e.textContent);
    if (!score.startsWith(qn + '/' + qn)) errors.push(`L${i} quiz score: ${score}`);
  }
  // capturas
  await page.evaluate(() => { location.hash = 'licao-6'; });
  await page.waitForTimeout(100);
  const viz = (await page.$$('.viz'))[0];
  for (let k = 0; k < 4; k++) await (await viz.$('[data-a="next"]')).click();
  await viz.scrollIntoViewIfNeeded();
  await viz.screenshot({ path: 'shots/viz-funcoes.png' });
  await page.evaluate(() => { location.hash = 'licao-10'; });
  await page.waitForTimeout(100);
  const v2 = (await page.$$('.viz'))[1];
  for (let k = 0; k < 6; k++) await (await v2.$('[data-a="next"]')).click();
  await v2.screenshot({ path: 'shots/viz-structs.png' });
  await page.evaluate(() => { location.hash = 'licao-8'; });
  await page.waitForTimeout(100);
  const v3 = (await page.$$('.viz'))[0];
  for (let k = 0; k < 4; k++) await (await v3.$('[data-a="next"]')).click();
  await v3.screenshot({ path: 'shots/viz-strings.png' });
  await page.evaluate(() => { location.hash = 'licao-3'; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'shots/lesson-top.png' });
  const q = await page.$('.quiz');
  await q.screenshot({ path: 'shots/quiz.png' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.evaluate(() => { location.hash = 'licao-9'; });
  await page.waitForTimeout(100);
  const v4 = (await page.$$('.viz'))[1];
  for (let k = 0; k < 5; k++) await (await v4.$('[data-a="next"]')).click();
  await v4.screenshot({ path: 'shots/viz-dark.png' });
  await page.evaluate(() => { location.hash = 'cabula'; });
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'shots/cabula-dark.png' });
  await page.emulateMedia({ colorScheme: 'light' });
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  m.on('pageerror', e => errors.push('mobile pageerror: ' + e.message));
  await m.goto('file://' + __dirname + '/index.html#licao-5');
  await m.waitForTimeout(200);
  const mv = (await m.$$('.viz'))[0];
  for (let k = 0; k < 6; k++) await (await mv.$('[data-a="next"]')).click();
  await mv.screenshot({ path: 'shots/mobile-viz.png' });
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) errors.push('mobile: a página tem scroll horizontal');
  await browser.close();
  console.log(errors.length ? errors.join('\n') : 'SEM ERROS');
})();
