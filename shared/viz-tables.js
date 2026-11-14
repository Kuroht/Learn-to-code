// ===== Visualizador de tabelas (cursos de SQL) =====
// Troca o painel "Memória + Ecrã" por "Base de dados + Resultado". Só entra nas páginas cujo
// course.js diz viz: 'tables'. Também corre em Node (o runner de SQL usa o dbToSql).

// Texto de uma célula, igual ao que o check gera a partir do SQLite: NULL aparece como NULL.
function cellText(value) {
  if (value === null) return 'NULL';
  return String(value);
}

// O SQL que cria uma base de dados descrita como { tabela: { cols, key?, rows } }.
function dbToSql(db) {
  const literal = v => {
    if (v === null) return 'NULL';
    if (typeof v === 'number') return String(v);
    if (/^-?\d+\.\d+$/.test(v)) return v; // reais escritos como texto ('14.0') para manter o .0
    return "'" + String(v).replace(/'/g, "''") + "'";
  };
  return Object.entries(db).map(([name, spec]) => {
    const lines = spec.cols.map(([col, def]) => '    ' + col + ' ' + def);
    if (spec.key) lines.push('    PRIMARY KEY (' + spec.key.join(', ') + ')');
    const create = 'CREATE TABLE ' + name + ' (\n' + lines.join(',\n') + '\n);';
    const inserts = (spec.rows || []).map(r => 'INSERT INTO ' + name + ' VALUES (' + r.map(literal).join(', ') + ');');
    return [create].concat(inserts).join('\n');
  }).join('\n\n');
}

// Cada visualizador regista-se em VIZ_MODES com o seu nome; um curso (ou um exemplo) escolhe qual usa.
if (typeof VIZ_MODES === 'undefined') var VIZ_MODES = {};
VIZ_MODES.tables = (function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function cellHtml(value, changed) {
    const cls = (value === null ? 'null' : '') + (changed ? ' chg' : '');
    return '<td><span class="' + cls.trim() + '">' + esc(cellText(value)) + '</span></td>';
  }

  // Cabeçalho de uma tabela da base de dados: nome, tipo e as etiquetas PK / FK.
  function colHead(col) {
    const tags = (col.pk ? '<span class="tag tag-pk" title="chave primária">PK</span>' : '') +
      (col.fk ? '<span class="tag tag-fk" title="chave estrangeira: aponta para ' + esc(col.fk) + '">FK→' + esc(col.fk) + '</span>' : '');
    return '<th><span class="col-name">' + esc(col.name) + '</span>' + tags + '<span class="col-type">' + esc(col.type) + '</span></th>';
  }

  // Uma tabela da base de dados. prev é a mesma tabela no passo anterior (para pintar o que mudou);
  // undefined quer dizer que a tabela acabou de ser criada.
  function tableHtml(name, table, prev, marks) {
    const prevRows = {};
    if (prev) prev.rows.forEach(r => { prevRows[r.id] = r; });
    const isNewTable = prev === undefined;
    const body = table.rows.length
      ? table.rows.map((row, i) => {
        const old = prevRows[row.id];
        const mark = marks && marks[i] ? ' row-' + marks[i] : '';
        const isNew = !isNewTable && !old ? ' row-new' : '';
        return '<tr class="' + (mark + isNew).trim() + '">' +
          row.cells.map((v, c) => cellHtml(v, old && cellText(old.cells[c]) !== cellText(v))).join('') + '</tr>';
      }).join('')
      : '<tr><td class="empty" colspan="' + table.cols.length + '">(sem linhas)</td></tr>';
    return '<div class="dbt' + (isNewTable ? ' is-new' : '') + '"><div class="dbt-name">' + esc(name) +
      '<span>' + table.rows.length + (table.rows.length === 1 ? ' linha' : ' linhas') + '</span></div>' +
      '<div class="t-wrap"><table class="grid"><thead><tr>' + table.cols.map(colHead).join('') + '</tr></thead><tbody>' + body + '</tbody></table></div></div>';
  }

  function tablesHtml(tables, prevTables, tmarks) {
    const names = Object.keys(tables);
    if (!names.length) return '<p class="mem-empty">A base de dados ainda não tem tabelas.</p>';
    // No primeiro passo não há passo anterior: compara a tabela consigo própria, para nada aparecer como novo.
    return names.map(n => tableHtml(n, tables[n], prevTables ? prevTables[n] : tables[n], tmarks[n])).join('');
  }

  // A grelha de trabalho da consulta. marks por linha: 'keep' (passa), 'drop' (fica de fora), 'hit' (em destaque).
  // groups: tamanhos dos grupos do GROUP BY, pela ordem das linhas.
  function gridHtml(g, err) {
    if (err) return '<div class="sql-err"><strong>Erro</strong><code>' + esc(err) + '</code></div>';
    if (!g) return '<p class="mem-empty">Nenhuma consulta a correr.</p>';
    const groupOf = [];
    (g.groups || []).forEach((size, gi) => { for (let k = 0; k < size; k++) groupOf.push(gi); });
    const rows = g.rows.length
      ? g.rows.map((r, i) => {
        const cls = [];
        if (g.marks && g.marks[i]) cls.push('row-' + g.marks[i]);
        if (g.groups) {
          cls.push(groupOf[i] % 2 ? 'grp-b' : 'grp-a');
          if (i > 0 && groupOf[i] !== groupOf[i - 1]) cls.push('grp-start');
        }
        return '<tr class="' + cls.join(' ') + '">' + r.map(v => cellHtml(v, false)).join('') + '</tr>';
      }).join('')
      : '<tr><td class="empty" colspan="' + g.cols.length + '">(nenhuma linha)</td></tr>';
    const count = g.rows.filter((_, i) => !(g.marks && g.marks[i] === 'drop')).length;
    return (g.label ? '<div class="grid-label"><code>' + esc(g.label) + '</code><span>' + count + (count === 1 ? ' linha' : ' linhas') + '</span></div>' : '') +
      '<div class="t-wrap"><table class="grid"><thead><tr>' + g.cols.map(c => '<th><span class="col-name">' + esc(c) + '</span></th>').join('') +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  // Resultado em texto (como o sqlite3 com .headers on: "nome|nota" e uma linha por resultado)
  // mostrado como tabelinhas. Os conjuntos de resultados vêm separados por uma linha vazia.
  function outputHtml(text) {
    const blocks = text.replace(/\n+$/, '').split(/\n\n/);
    return '<div class="out-grids">' + blocks.map(block => {
      if (block.indexOf('Erro: ') === 0) return '<div class="sql-err"><strong>Erro</strong><code>' + esc(block.slice(6)) + '</code></div>';
      const lines = block.split('\n');
      const head = lines[0].split('|');
      const body = lines.slice(1).map(l => l.split('|'));
      return '<table class="grid mini-grid"><thead><tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
        (body.length ? body.map(r => '<tr>' + r.map(v => '<td' + (v === 'NULL' ? ' class="null"' : '') + '>' + esc(v) + '</td>').join('') + '</tr>').join('')
          : '<tr><td class="empty" colspan="' + head.length + '">(nenhuma linha)</td></tr>') +
        '</tbody></table>';
    }).join('') + '</div>';
  }

  // A base de dados de uma lição, mostrada antes dos exemplos.
  function dbHtml(db) {
    let id = 0;
    const html = Object.entries(db).map(([name, spec]) => {
      const table = makeTable(spec, () => ++id);
      return tableHtml(name, table, table, null);
    }).join('');
    return '<div class="db-tables">' + html + '</div>' +
      '<details><summary>Ver o SQL que cria estas tabelas</summary><div class="det-body"><pre class="snip"><code>' + esc(dbToSql(db)) + '</code></pre></div></details>';
  }

  return {
    panelsHtml() {
      return '<div class="panel"><div class="panel-label"><span>Base de dados</span><span>amarelo = mudou agora</span></div><div class="mem db"></div></div>' +
        '<div class="panel"><div class="panel-label"><span>Resultado</span></div><div class="mem res"></div></div>';
    },
    render(host, step, prev) {
      host.querySelector('.db').innerHTML = tablesHtml(step.tables, prev ? prev.tables : null, step.tmarks);
      host.querySelector('.res').innerHTML = gridHtml(step.grid, step.err);
    },
    outputHtml,
    dbHtml,
  };
})();

if (typeof module !== 'undefined') module.exports = { dbToSql, cellText };
