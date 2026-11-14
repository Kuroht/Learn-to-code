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

function buildSteps(raw) {
  let frames = [];
  let out = '';
  const res = [];
  raw.forEach((s, idx) => {
    frames = JSON.parse(JSON.stringify(frames));
    const where = ' (passo ' + (idx + 1) + ')';
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
    res.push({ l: s.l, frames, out, n: s.n || '' });
  });
  return res;
}

if (typeof module !== 'undefined') module.exports = { buildSteps, parseVarPath };
