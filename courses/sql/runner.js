// Corre SQL com o SQLite que vem dentro do Node (node:sqlite): não arranca nenhum programa novo.
// Usado pelo shared/check.js para comparar o que a página mostra com o que o SQLite faz mesmo.
const { DatabaseSync } = require('node:sqlite');
const { buildSteps } = require('../../shared/engine.js');
const { dbToSql, cellText } = require('../../shared/viz-tables.js');

// Divide um script em instruções, com a linha onde cada uma começa e acaba (1 = primeira linha).
// Respeita texto entre plicas/aspas e comentários "--", onde um ";" não termina nada.
function splitStatements(script) {
  const statements = [];
  let current = '';
  let line = 1;
  let start = null;
  let quote = null;
  for (let i = 0; i < script.length; i++) {
    const c = script[i];
    if (!quote && c === '-' && script[i + 1] === '-') {
      while (i < script.length && script[i] !== '\n') i++;
      i--;
      continue;
    }
    if (c === '\n') line++;
    if (start === null && !/\s/.test(c)) start = line;
    current += c;
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"') { quote = c; continue; }
    if (c === ';') {
      statements.push({ sql: current.trim(), start, end: line });
      current = '';
      start = null;
    }
  }
  if (current.trim()) statements.push({ sql: current.trim(), start, end: line });
  return statements;
}

// Um valor do SQLite em texto, como o sqlite3 o mostra: os REAL levam sempre casa decimal (14.0).
// Com setReadBigInts, os INTEGER chegam como BigInt e os REAL como number.
function valueText(value) {
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value + '.0';
    return String(Number(value.toPrecision(15)));
  }
  return cellText(value);
}

// Corre uma instrução. Devolve { cols, rows } se for uma consulta, {} se não for, ou { error }.
function execute(db, sql) {
  try {
    const stmt = db.prepare(sql);
    stmt.setReadBigInts(true);
    stmt.setReturnArrays(true);
    const cols = stmt.columns().map(c => c.name);
    if (!cols.length) { stmt.run(); return {}; }
    return { cols, rows: stmt.all().map(r => r.map(valueText)) };
  } catch (e) {
    return { error: e.message };
  }
}

// Uma consulta em texto: "col1|col2" e uma linha por resultado.
const resultText = r => [r.cols.join('|')].concat(r.rows.map(row => row.join('|'))).join('\n');

// A base de dados real, no mesmo formato das tabelas do motor (só nomes de colunas e texto das células).
function realTables(db) {
  const names = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all().map(r => r.name);
  const tables = {};
  names.forEach(name => {
    const cols = db.prepare(`PRAGMA table_info(${name})`).all().map(c => c.name);
    tables[name] = { cols, rows: execute(db, `SELECT * FROM ${name}`).rows };
  });
  return tables;
}

// A base de dados com que um exemplo, pergunta ou exercício começa.
function setupFor(item, lesson) {
  if (item.db === false) return null;
  return item.db || (lesson && lesson.db) || null;
}

// O node:sqlite liga as chaves estrangeiras por omissão; o sqlite3 (e o SQLite em geral) não.
// Desligamos para o comportamento ser o mesmo que o aluno vai ver: só com PRAGMA foreign_keys = ON.
function openDb(setup) {
  const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: false });
  if (setup) db.exec(dbToSql(setup));
  return db;
}

// Compara as tabelas que o visualizador mostra num passo com as do SQLite. A ordem das linhas
// não conta (uma tabela não tem ordem); a das colunas sim.
function compareTables(shown, real) {
  const problems = [];
  const shownNames = Object.keys(shown).sort();
  const realNames = Object.keys(real).sort();
  if (shownNames.join() !== realNames.join()) return ['tabelas: página ' + shownNames.join(', ') + ' / real ' + realNames.join(', ')];
  shownNames.forEach(name => {
    const cols = shown[name].cols.map(c => c.name);
    if (cols.join('|') !== real[name].cols.join('|')) problems.push(`${name}: colunas ${cols.join(', ')} / real ${real[name].cols.join(', ')}`);
    const shownRows = shown[name].rows.map(r => r.cells.map(cellText).join('|')).sort();
    const realRows = real[name].rows.map(r => r.join('|')).sort();
    if (shownRows.join('\n') !== realRows.join('\n')) problems.push(`${name}:\n  página: ${JSON.stringify(shownRows)}\n  real:   ${JSON.stringify(realRows)}`);
  });
  return problems;
}

module.exports = {
  toolName: 'SQLite do Node (node:sqlite)',
  installHint: 'O node:sqlite vem com o Node 22.13 ou mais recente. Atualiza o Node.',

  isAvailable() {
    try { return typeof new DatabaseSync(':memory:').prepare('SELECT 1').setReturnArrays === 'function'; } catch (e) { return false; }
  },

  // As perguntas são só a consulta: a base de dados da lição é criada antes, no run.
  wrapQuiz(code) {
    return code;
  },

  // Corre um script e devolve o texto dos resultados. Um erro aparece como "Erro: ..." e o script continua,
  // como no sqlite3. Cada resultado vem separado do seguinte por uma linha vazia.
  run(code, stdin, tmpDir, item, lesson) {
    let db;
    try { db = openDb(setupFor(item, lesson)); } catch (e) { return { error: 'A BASE DE DADOS INICIAL FALHOU: ' + e.message }; }
    const blocks = [];
    splitStatements(code).forEach(st => {
      const r = execute(db, st.sql);
      if (r.error) blocks.push('Erro: ' + r.error);
      else if (r.cols) blocks.push(resultText(r));
    });
    db.close();
    return { out: blocks.length ? blocks.join('\n\n') + '\n' : '' };
  },

  // Verifica um exemplo passo a passo. Para cada instrução do código, o último passo com uma linha
  // dessa instrução tem de mostrar: as tabelas iguais às do SQLite; se for uma consulta, a grelha igual
  // ao resultado real (sem linhas riscadas); se der erro, a mensagem de erro real.
  checkExample(ex, lesson, { label, report }) {
    let steps;
    try { steps = buildSteps(ex.steps, ex.db); } catch (e) { return; } // o erro já foi reportado na revisão do conteúdo
    const statements = splitStatements(ex.code);
    let db;
    try { db = openDb(ex.db || null); } catch (e) { report.check(label + ': base de dados inicial', false, e.message); return; }
    const stepOf = steps.map(s => statements.findIndex(st => s.l >= st.start && s.l <= st.end));
    stepOf.forEach((st, i) => report.check(`${label} passo ${i + 1}: a linha ${steps[i].l} pertence a uma instrução`, st >= 0));
    // As instruções correm por ordem: os passos de uma instrução vêm todos antes dos da seguinte.
    report.check(`${label}: passos pela ordem das instruções`, stepOf.every((st, i) => i === 0 || st >= stepOf[i - 1]));

    statements.forEach((st, si) => {
      const where = `${label}, instrução da linha ${st.start}`;
      const indexes = stepOf.map((x, i) => (x === si ? i : -1)).filter(i => i >= 0);
      const result = execute(db, st.sql);
      if (!indexes.length) { report.check(where + ': tem passos', false, st.sql); return; }
      const last = steps[indexes[indexes.length - 1]];
      const shownError = indexes.map(i => steps[i].err).find(Boolean) || '';
      report.check(where + ': erro igual ao real', shownError === (result.error || ''), `página: ${JSON.stringify(shownError)}\nreal: ${JSON.stringify(result.error || '')}`);
      const problems = compareTables(last.tables, realTables(db));
      report.check(where + ': tabelas iguais às do SQLite', problems.length === 0, problems.join('\n'));
      if (result.cols) {
        const g = last.grid;
        const shown = g ? resultText({ cols: g.cols, rows: g.rows.map(r => r.map(cellText)) }) : '(sem grelha)';
        const clean = g && !(g.marks || []).some(m => m === 'drop');
        report.check(where + ': resultado igual ao real', shown === resultText(result) && clean,
          `página:\n${shown}${clean ? '' : '\n(ainda com linhas riscadas)'}\nreal:\n${resultText(result)}`);
      }
    });
    db.close();
  },

  splitStatements,
};
