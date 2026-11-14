// Encontra e carrega os cursos em courses/<slug>/. Usado pelo build, pelo check e pelo smoke test.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COURSES_DIR = path.join(ROOT, 'courses');

// Lista os slugs de todos os cursos, pela ordem em que aparecem na página inicial.
const ORDER = ['c', 'sql', 'python', 'csharp', 'rust', 'typescript'];
function listSlugs() {
  const found = fs.readdirSync(COURSES_DIR).filter(name => fs.existsSync(path.join(COURSES_DIR, name, 'course.js')));
  const rank = slug => (ORDER.includes(slug) ? ORDER.indexOf(slug) : ORDER.length);
  return found.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

// Lê o course.js e os ficheiros do curso.
function loadCourse(slug) {
  const dir = path.join(COURSES_DIR, slug);
  if (!fs.existsSync(path.join(dir, 'course.js'))) throw new Error('curso inexistente: ' + slug);
  const config = require(path.join(dir, 'course.js'));
  const read = file => fs.readFileSync(path.join(dir, file), 'utf8');
  return {
    dir,
    config,
    lessonsSource: config.lessonFiles.map(read).join('\n'),
    syntaxSource: read('syntax.js'),
    homeHtml: read('home.html'),
    cheatHtml: read('cheat.html'),
    runnerPath: path.join(dir, 'runner.js'),
  };
}

// Corre o código das lições (o mesmo que vai para a página) e devolve o array LESSONS.
function evalLessons(course) {
  return new Function(course.lessonsSource + '\nreturn LESSONS;')();
}

// Lê os argumentos da linha de comandos: os slugs pedidos, ou todos se não houver nenhum.
function slugsFromArgs(args) {
  const asked = args.filter(a => !a.startsWith('--'));
  const all = listSlugs();
  asked.forEach(slug => { if (!all.includes(slug)) throw new Error('curso inexistente: ' + slug + ' (há: ' + all.join(', ') + ')'); });
  return asked.length ? asked : all;
}

module.exports = { ROOT, listSlugs, loadCourse, evalLessons, slugsFromArgs };
