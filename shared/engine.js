// ===== Motor do visualizador: transforma a lista de passos de um exemplo em fotografias da memória. =====
// É partilhado por todos os cursos e corre tanto na página como nos testes (shared/check.js).
function parseVarPath(key) {
  const m = key.match(/^([A-Za-z_]\w*)(.*)$/);
  if (!m) throw new Error('caminho inválido: ' + key);
  const path = [];
  const re = /\[(\d+)\]|\.([A-Za-z_]\w*)/g;
  let t;
  let consumed = 0;
  while ((t = re.exec(m[2]))) {
    path.push(t[1] !== undefined ? Number(t[1]) : t[2]);
    consumed += t[0].length;
  }
  if (consumed !== m[2].length) throw new Error('caminho inválido: ' + key);
  return { name: m[1], path };
}

// ---------- tabelas (cursos de SQL) ----------
// Uma coluna escreve-se como no CREATE TABLE: ['numero', 'INTEGER PRIMARY KEY'] ou ['curso', 'INTEGER REFERENCES cursos(id)'].
function parseColumn(spec) {
  const [name, def] = spec;
  const fk = /REFERENCES\s+(\w+)\s*\((\w+)\)/i.exec(def);
  return {
    name,
    def,
    type: def.split(/\s+/)[0].toUpperCase(),
    pk: /PRIMARY\s+KEY/i.test(def),
    fk: fk ? fk[1] + '.' + fk[2] : null,
  };
}

// Transforma { cols, key?, rows? } numa tabela do motor. Cada linha leva um id interno,
// para o visualizador saber que linha é qual mesmo depois de outras serem apagadas.
function makeTable(spec, nextId) {
  const cols = spec.cols.map(parseColumn);
  (spec.key || []).forEach(k => {
    const col = cols.find(c => c.name === k);
    if (!col) throw new Error('chave com coluna inexistente: ' + k);
    col.pk = true;
  });
  const table = { cols, rows: [] };
  (spec.rows || []).forEach(cells => addRow(table, cells, nextId));
  return table;
}

function addRow(table, cells, nextId) {
  if (cells.length !== table.cols.length) throw new Error('linha com ' + cells.length + ' valores numa tabela com ' + table.cols.length + ' colunas');
  table.rows.push({ id: nextId(), cells: cells.slice() });
}

// Aplica as operações de tabelas de um passo: create, ins, upd, del, drop.
function applyTableOps(tables, s, where, nextId) {
  const find = name => {
    if (!tables[name]) throw new Error('tabela inexistente: ' + name + where);
    return tables[name];
  };
  if (s.create) {
    for (const [name, spec] of Object.entries(s.create)) {
      if (tables[name]) throw new Error('tabela repetida: ' + name + where);
      tables[name] = makeTable(spec, nextId);
    }
  }
  if (s.ins) {
    for (const [name, rows] of Object.entries(s.ins)) rows.forEach(cells => addRow(find(name), cells, nextId));
  }
  if (s.upd) {
    for (const [name, changes] of Object.entries(s.upd)) {
      const t = find(name);
      for (const [index, sets] of Object.entries(changes)) {
        const row = t.rows[Number(index)];
        if (!row) throw new Error('linha inexistente: ' + name + '[' + index + ']' + where);
        for (const [col, value] of Object.entries(sets)) {
          const c = t.cols.findIndex(x => x.name === col);
          if (c < 0) throw new Error('coluna inexistente: ' + name + '.' + col + where);
          row.cells[c] = value;
        }
      }
    }
  }
  if (s.del) {
    for (const [name, indexes] of Object.entries(s.del)) {
      const t = find(name);
      indexes.forEach(i => { if (!t.rows[i]) throw new Error('apagar linha inexistente: ' + name + '[' + i + ']' + where); });
      t.rows = t.rows.filter((_, i) => !indexes.includes(i));
    }
  }
  if (s.drop) s.drop.forEach(name => { find(name); delete tables[name]; });
  // tm: marcas que só valem neste passo, por exemplo as linhas que o WHERE de um UPDATE encontrou.
  if (s.tm) {
    for (const [name, marks] of Object.entries(s.tm)) {
      const t = find(name);
      Object.keys(marks).forEach(i => { if (!t.rows[i]) throw new Error('marca em linha inexistente: ' + name + '[' + i + ']' + where); });
    }
  }
}

// g: a grelha de trabalho de uma consulta (o que o FROM, o WHERE, o GROUP BY... já construíram).
function checkGrid(g, where) {
  if (g === null) return;
  if (!Array.isArray(g.cols) || !Array.isArray(g.rows)) throw new Error('grelha sem cols ou rows' + where);
  g.rows.forEach(r => { if (r.length !== g.cols.length) throw new Error('linha da grelha com ' + r.length + ' valores e ' + g.cols.length + ' colunas' + where); });
  if (g.marks && g.marks.length !== g.rows.length) throw new Error('marks da grelha com tamanho diferente das linhas' + where);
  if (g.groups && g.groups.reduce((a, b) => a + b, 0) !== g.rows.length) throw new Error('groups da grelha não somam o número de linhas' + where);
}

// ---------- referências e objetos (cursos de Python, C#, ...) ----------
// Um valor que começa por @ é uma referência para um objeto do heap: '@o1'.
const isRef = v => typeof v === 'string' && v.charAt(0) === '@';

// Todas as referências que um valor contém (o próprio valor, os elementos de uma lista, os campos de um objeto).
function refsIn(value) {
  if (isRef(value)) return [value.slice(1)];
  if (Array.isArray(value)) return value.flatMap(refsIn);
  if (value && typeof value === 'object') return Object.values(value).flatMap(refsIn);
  return [];
}

// Os objetos a que já ninguém chega, partindo dos nomes de todos os frames.
function unreachable(frames, heap) {
  const seen = new Set();
  const visit = id => {
    if (seen.has(id) || !heap[id]) return;
    seen.add(id);
    refsIn(heap[id].value).forEach(visit);
  };
  frames.forEach(f => f.vars.forEach(v => refsIn(v.value).forEach(visit)));
  return Object.keys(heap).filter(id => !seen.has(id));
}

// initialTables: a base de dados com que o exemplo começa ({ nome: { cols, rows } }), ou nada.
function buildSteps(raw, initialTables) {
  let frames = [];
  let out = '';
  let lastId = 0;
  const nextId = () => ++lastId;
  let tables = {};
  for (const [name, spec] of Object.entries(initialTables || {})) tables[name] = makeTable(spec, nextId);
  let grid = null;
  // heap: os objetos ({ id: { type, value } }). Um objeto sem nomes aparece desbotado num passo e desaparece no seguinte.
  let heap = {};
  let orphans = [];
  const res = [];
  raw.forEach((s, idx) => {
    frames = JSON.parse(JSON.stringify(frames));
    tables = JSON.parse(JSON.stringify(tables));
    heap = JSON.parse(JSON.stringify(heap));
    orphans.forEach(id => { delete heap[id]; });
    const where = ' (passo ' + (idx + 1) + ')';
    applyTableOps(tables, s, where, nextId);
    // obj: cria ou muda objetos: { o1: ['list', ['@o2', 3]] }
    if (s.obj) {
      for (const [id, spec] of Object.entries(s.obj)) heap[id] = { type: spec[0], value: JSON.parse(JSON.stringify(spec[1])) };
    }
    if (s.g !== undefined) {
      checkGrid(s.g, where);
      grid = JSON.parse(JSON.stringify(s.g));
    }
    const findFrame = name => {
      for (let i = frames.length - 1; i >= 0; i--) if (frames[i].name === name) return frames[i];
      throw new Error('frame inexistente: ' + name + where);
    };
    if (s.pop) {
      if (!frames.length) throw new Error('pop sem frames' + where);
      frames.pop();
    }
    if (s.push) frames.push({ name: s.push, vars: [] });
    if (s.x) {
      for (const [fn, names] of Object.entries(s.x)) {
        const f = findFrame(fn);
        names.forEach(n => {
          if (!f.vars.some(v => v.name === n)) throw new Error('apagar variável inexistente: ' + n + where);
        });
        f.vars = f.vars.filter(v => !names.includes(v.name));
      }
    }
    if (s.d) {
      for (const [fn, vars] of Object.entries(s.d)) {
        const f = findFrame(fn);
        for (const [name, spec] of Object.entries(vars)) {
          if (f.vars.some(v => v.name === name)) throw new Error('variável repetida: ' + name + where);
          const [type, value, addr] = spec;
          f.vars.push({ name, type, value: JSON.parse(JSON.stringify(value)), addr: addr || null });
        }
      }
    }
    if (s.u) {
      for (const [fn, sets] of Object.entries(s.u)) {
        const f = findFrame(fn);
        for (const [key, value] of Object.entries(sets)) {
          const { name, path } = parseVarPath(key);
          const v = f.vars.find(x => x.name === name);
          if (!v) throw new Error('atualizar variável inexistente: ' + name + where);
          if (!path.length) { v.value = value; continue; }
          let target = v.value;
          for (let i = 0; i < path.length - 1; i++) {
            target = target[path[i]];
            if (target === undefined) throw new Error('caminho inexistente: ' + key + where);
          }
          const last = path[path.length - 1];
          if (target[last] === undefined) throw new Error('caminho inexistente: ' + key + where);
          target[last] = value;
        }
      }
    }
    if (s.o) out += s.o;
    // Todas as referências têm de apontar para objetos que existem.
    const allValues = frames.flatMap(f => f.vars.map(v => v.value)).concat(Object.values(heap).map(o => o.value));
    allValues.flatMap(refsIn).forEach(id => { if (!heap[id]) throw new Error('referência para um objeto inexistente: @' + id + where); });
    orphans = unreachable(frames, heap);
    // sel, box, chk e width são do curso de HTML: o visualizador da página lê-os de cada passo.
    res.push({ l: s.l, frames, out, n: s.n || '', tables, tmarks: s.tm || {}, grid, err: s.err || '', heap, orphans, sel: s.sel || null, box: s.box || null, width: s.width || null });
  });
  return res;
}

if (typeof module !== 'undefined') module.exports = { buildSteps, parseVarPath, makeTable };
