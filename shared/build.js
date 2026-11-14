// Junta o template, o motor e os ficheiros de um curso numa só página: docs/<slug>/index.html.
// Também gera docs/index.html, a lista de todos os cursos.
// Uso: node shared/build.js            (todos os cursos)
//      node shared/build.js c sql      (só estes)
const fs = require('fs');
const path = require('path');
const { ROOT, listSlugs, loadCourse, slugsFromArgs } = require('./courses.js');

const DOCS = path.join(ROOT, 'docs');
const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Troca um marcador por texto. Usa split/join para o texto poder ter "$" sem surpresas.
function fill(text, marker, value) {
  if (!text.includes(marker)) throw new Error('marcador em falta no template: ' + marker);
  return text.split(marker).join(value);
}

// A cor de destaque de cada curso. Gera CSS que sobrepõe as variáveis do template (claro e escuro).
function themeCss(theme) {
  if (!theme) return '';
  const vars = t => `--accent: ${t.accent}; --accent-soft: ${t.accentSoft}; --t-fn: ${t.accent};`;
  return '<style>\n' +
    `:root { ${vars(theme.light)} }\n` +
    `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${vars(theme.dark)} } }\n` +
    `:root[data-theme="dark"] { ${vars(theme.dark)} }\n` +
    '</style>';
}

function buildCourse(slug) {
  const course = loadCourse(slug);
  const { config } = course;
  const engine = read('engine.js');
  // O objeto COURSE dá ao código da página o que muda de curso para curso.
  // Um curso com viz: 'tables' (SQL) leva também o visualizador de tabelas e o seu CSS.
  const vizJs = config.viz ? '\n' + read('viz-' + config.viz + '.js') : '';
  const vizCss = config.viz ? '<style>\n' + read('viz-' + config.viz + '.css') + '</style>\n' : '';
  const courseJs = 'const COURSE = ' + JSON.stringify({ slug, title: config.title, storageKey: config.storageKey, cheatTitle: config.cheatTitle, vizLabels: config.vizLabels || null }) + ';\n' + course.syntaxSource + vizJs;
  const inlined = engine + courseJs + course.lessonsSource;
  if (inlined.includes('</script')) throw new Error(slug + ': o texto "</script" partia a página');

  let page = read('template.html');
  page = fill(page, '{{TITLE}}', esc(config.title));
  page = fill(page, '{{MARK}}', esc(config.mark));
  const theme = themeCss(config.theme);
  page = fill(page, '<!--__THEME__-->\n', vizCss + (theme ? theme + '\n' : ''));
  page = fill(page, '<!--__HOME__-->\n', course.homeHtml);
  page = fill(page, '<!--__CHEAT__-->\n', course.cheatHtml);
  page = fill(page, '/*__COURSE__*/', courseJs);
  page = fill(page, '/*__ENGINE__*/', engine);
  page = fill(page, '/*__LESSONS__*/', course.lessonsSource);

  const outDir = path.join(DOCS, slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  console.log(`ok  docs/${slug}/index.html  (${Math.round(page.length / 1024)} KB)`);
}

// A página inicial do site: um cartão por curso.
function buildCatalog() {
  const cards = listSlugs().map(slug => {
    const { config } = loadCourse(slug);
    const style = config.theme ? ` style="--card-light: ${config.theme.light.accent}; --card-dark: ${config.theme.dark.accent}"` : '';
    return `      <a class="course" href="${slug}/"${style}>\n` +
      `        <span class="course-mark">${esc(config.mark)}</span>\n` +
      `        <strong>${esc(config.title)}</strong>\n` +
      `        <span>${esc(config.description)}</span>\n` +
      '      </a>';
  }).join('\n');
  const page = fill(read('catalog.html'), '<!--__COURSES__-->', cards);
  fs.writeFileSync(path.join(DOCS, 'index.html'), page);
  console.log('ok  docs/index.html');
}

try {
  slugsFromArgs(process.argv.slice(2)).forEach(buildCourse);
  buildCatalog();
} catch (e) {
  console.error('ERRO: ' + e.message);
  process.exit(1);
}
