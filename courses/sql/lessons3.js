// ===== SQL do Zero — conteúdo das lições (parte 3) =====
// Usa os ajudantes definidos em lessons1.js.

// A base de dados da escola, com relações: cursos 1:N alunos, e alunos N:M ucs (através de inscricoes).
const ESCOLA = {
  cursos: {
    cols: [['sigla', 'TEXT PRIMARY KEY'], ['nome', 'TEXT NOT NULL']],
    rows: [['LEI', 'Engenharia Informatica'], ['LEE', 'Engenharia Eletrotecnica'], ['LEM', 'Engenharia Mecanica'], ['LB', 'Bioengenharia']],
  },
  alunos: {
    cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT NOT NULL'], ['curso', 'TEXT REFERENCES cursos(sigla)']],
    rows: [[101, 'Ana', 'LEI'], [102, 'Rui', 'LEI'], [103, 'Ines', 'LEE'], [104, 'Tiago', 'LEI'], [105, 'Marta', 'LEM'], [106, 'Pedro', 'LEE']],
  },
  ucs: {
    cols: [['codigo', 'TEXT PRIMARY KEY'], ['nome', 'TEXT NOT NULL'], ['ects', 'INTEGER']],
    rows: [['BD', 'Bases de Dados', 6], ['SO', 'Sistemas Operativos', 6], ['ED', 'Estruturas de Dados', 6], ['RC', 'Redes de Computadores', 4]],
  },
  inscricoes: {
    cols: [['aluno', 'INTEGER REFERENCES alunos(numero)'], ['uc', 'TEXT REFERENCES ucs(codigo)'], ['nota', 'INTEGER']],
    key: ['aluno', 'uc'],
    rows: [[101, 'BD', 16], [101, 'SO', 13], [102, 'BD', 9], [103, 'ED', 14], [104, 'BD', 12], [104, 'ED', 11], [105, 'SO', 18]],
  },
};

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Chaves e relações',
  short: 'chave primária, chave estrangeira, 1:N e N:M',
  body: H`
<p>Uma base de dados a sério tem várias tabelas ligadas entre si. As ligações fazem-se com chaves.</p>
<ul>
<li>A <strong>chave primária</strong> (PK) identifica cada linha: não se repete e não pode ser NULL. Pode ser uma coluna (<code>numero</code>) ou um par de colunas (<code>PRIMARY KEY (aluno, uc)</code>).</li>
<li>Uma <strong>chave estrangeira</strong> (FK) é uma coluna que guarda a chave primária de uma linha <em>de outra tabela</em>: <code>curso TEXT REFERENCES cursos(sigla)</code>. É assim que o aluno "aponta" para o seu curso. Lembras-te dos apontadores em C? A ideia é parecida: em vez da morada, guarda-se a chave.</li>
<li>O SGBD não deixa a FK apontar para o vazio: inserir um aluno num curso que não existe, ou apagar um curso que ainda tem alunos, dá <em>FOREIGN KEY constraint failed</em>. <strong>No SQLite</strong> esta verificação vem desligada; liga-se com <code>PRAGMA foreign_keys = ON;</code>.</li>
</ul>
<p>Num <strong>diagrama ER</strong> (entidade-relação), cada entidade (Curso, Aluno, UC) vira uma tabela e as relações dizem como se ligam:</p>
<table class="t">
<thead><tr><th>Relação</th><th>Exemplo</th><th>Como fica nas tabelas</th></tr></thead>
<tbody>
<tr><td>1:N (um para muitos)</td><td>um curso tem muitos alunos; cada aluno tem um curso</td><td>uma FK do lado N: <code>alunos.curso</code></td></tr>
<tr><td>N:M (muitos para muitos)</td><td>um aluno tem muitas UCs; uma UC tem muitos alunos</td><td>uma tabela de ligação com as duas FK: <code>inscricoes(aluno, uc)</code>, que pode guardar dados da relação (a <code>nota</code>)</td></tr>
</tbody>
</table>`,
  analogy: 'A ficha de inscrição numa UC não volta a escrever o nome, a morada e o curso do aluno: escreve só o número de aluno. Esse número é a chave estrangeira, e quem quiser o resto vai à ficha do aluno.',
  db: ESCOLA,
  examples: [{
    title: 'A chave estrangeira a proteger os dados',
    db: only(ESCOLA, 'cursos', 'alunos'),
    code: C`
PRAGMA foreign_keys = ON;
INSERT INTO alunos VALUES (107, 'Carla', 'LEI');
INSERT INTO alunos VALUES (108, 'Bruno', 'MED');
DELETE FROM cursos WHERE sigla = 'LEM';
DELETE FROM cursos WHERE sigla = 'LB';`,
    steps: [
      { l: 1, n: H`No SQLite as FK só são verificadas depois desta linha. Noutros SGBD estão sempre ligadas.` },
      { l: 2, tm: { cursos: { 0: 'hit' } }, ins: { alunos: [[107, 'Carla', 'LEI']] }, n: H`A Carla é de LEI, e LEI existe na tabela <code>cursos</code> (a amarelo). A linha entra.` },
      { l: 3, err: 'FOREIGN KEY constraint failed', n: H`Não há nenhum curso MED. A FK não deixa um aluno apontar para um curso que não existe: a linha é recusada.` },
      { l: 4, tm: { cursos: { 2: 'hit' }, alunos: { 4: 'hit' } }, err: 'FOREIGN KEY constraint failed', n: H`Apagar LEM deixava a Marta a apontar para o vazio, por isso também é recusado.` },
      { l: 5, tm: { cursos: { 3: 'drop' } }, n: H`LB (Bioengenharia) não tem nenhum aluno...` },
      { l: 5, del: { cursos: [3] }, n: '...por isso pode ser apagado.' },
    ],
  }, {
    title: 'Uma relação N:M: a tabela de ligação',
    db: only(ESCOLA, 'alunos', 'ucs'),
    code: C`
CREATE TABLE inscricoes (
    aluno INTEGER REFERENCES alunos(numero),
    uc TEXT REFERENCES ucs(codigo),
    nota INTEGER,
    PRIMARY KEY (aluno, uc)
);
INSERT INTO inscricoes VALUES (101, 'BD', 16), (101, 'SO', 13), (102, 'BD', 9);
INSERT INTO inscricoes VALUES (101, 'BD', 18);`,
    steps: [
      { l: 1, create: { inscricoes: { cols: [['aluno', 'INTEGER REFERENCES alunos(numero)'], ['uc', 'TEXT REFERENCES ucs(codigo)'], ['nota', 'INTEGER']], key: ['aluno', 'uc'] } }, n: 'Um aluno tem muitas UCs e uma UC tem muitos alunos. Isto não cabe numa coluna de nenhuma das duas tabelas: precisa de uma tabela própria.' },
      { l: 2, n: H`<code>aluno</code> é uma FK para <code>alunos</code>.` },
      { l: 3, n: H`<code>uc</code> é uma FK para <code>ucs</code>.` },
      { l: 4, n: H`A <code>nota</code> não é do aluno nem da UC: é da inscrição de um aluno numa UC. Por isso vive nesta tabela.` },
      { l: 5, n: H`A chave primária é o <strong>par</strong> (aluno, uc): o mesmo aluno pode aparecer várias vezes, com UCs diferentes, mas não duas vezes na mesma UC.` },
      { l: 7, ins: { inscricoes: [[101, 'BD', 16], [101, 'SO', 13], [102, 'BD', 9]] }, n: 'A Ana (101) aparece duas vezes e a BD também. O que não se repete é o par.' },
      { l: 8, err: 'UNIQUE constraint failed: inscricoes.aluno, inscricoes.uc', n: H`O par (101, BD) já existe. A chave primária recusa a linha.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>PRAGMA foreign_keys = ON;</code> no SQLite e achar que as FK estão a proteger os dados. Sem ele, o SQLite aceita tudo.`,
    H`Guardar várias coisas numa célula para evitar uma tabela de ligação: <code>ucs = 'BD, SO'</code>. Depois é quase impossível pesquisar e manter (vês porquê na lição 10).`,
    H`Pôr a FK do lado errado num 1:N. É o lado "muitos" que guarda a chave do lado "um": cada aluno diz o seu curso, não o curso que lista os alunos.`,
    H`Dar à FK um tipo diferente da PK para onde aponta (<code>INTEGER</code> contra <code>TEXT</code>).`,
    H`Usar como chave primária uma coluna que se pode repetir ou mudar, como o nome.`,
  ],
  quiz: [
    { q: 'Qual é a chave primária da tabela inscricoes?', opts: ['aluno', 'uc', 'O par (aluno, uc)', 'nota'], ok: 2,
      exp: 'Sozinho, o aluno repete-se (uma linha por UC) e a UC também. O que identifica uma linha é a combinação dos dois.' },
    { q: 'Numa relação 1:N entre cursos e alunos, onde fica a chave estrangeira?', opts: ['Em alunos: cada aluno guarda a sigla do seu curso', 'Em cursos: cada curso guarda os números dos alunos', 'Numa tabela nova, só para a ligação', 'Nas duas tabelas'], ok: 0,
      exp: 'Cada aluno tem um só curso, por isso cabe numa coluna de alunos. Ao contrário, um curso tem muitos alunos, e muitos valores não cabem numa célula. A tabela nova só é precisa nas relações N:M.' },
    { q: 'Que resultado dá este script?', code: C`
PRAGMA foreign_keys = ON;
INSERT INTO inscricoes VALUES (106, 'XX', 15);
SELECT COUNT(*) AS n FROM inscricoes;`, opts: [res(['n'], [[8]]), 'Erro: FOREIGN KEY constraint failed\n\n' + res(['n'], [[7]]), 'Erro: FOREIGN KEY constraint failed\n\n' + res(['n'], [[8]]), res(['n'], [[7]])], ok: 1, mono: true, check: true,
      exp: 'Não há nenhuma UC XX, e com as FK ligadas a linha é recusada. O SELECT corre na mesma e conta as 7 inscrições que já existiam.' },
    { q: 'E sem o PRAGMA? Que resultado dá este script?', code: C`
INSERT INTO inscricoes VALUES (106, 'XX', 15);
SELECT COUNT(*) AS n FROM inscricoes;`, opts: [res(['n'], [[8]]), 'Erro: FOREIGN KEY constraint failed\n\n' + res(['n'], [[7]]), 'Erro: FOREIGN KEY constraint failed\n\n' + res(['n'], [[8]]), res(['n'], [[7]])], ok: 0, mono: true, check: true,
      exp: H`No SQLite, as FK só são verificadas com <code>PRAGMA foreign_keys = ON</code>. Sem ele, a inscrição numa UC que não existe entra sem erro. É uma surpresa comum.` },
    { q: 'Os alunos inscrevem-se em várias UCs e cada UC tem vários alunos. Como se guarda isto?', opts: ['Uma coluna uc na tabela alunos', 'Uma coluna aluno na tabela ucs', 'Uma tabela de ligação com as chaves das duas', "Uma coluna com as UCs separadas por vírgulas, como 'BD, SO'"], ok: 2,
      exp: 'É uma relação N:M. Uma coluna só guarda um valor por linha, por isso as duas primeiras não chegam. A lista com vírgulas parte a 1.ª forma normal (lição 10).' },
  ],
  exercises: [{
    title: 'Turmas',
    text: 'Liga as FK, cria a tabela turmas (id inteiro chave primária, uc que aponta para ucs(codigo), sala texto), insere as turmas 1 (BD, sala A1) e 2 (SO, sala B2), tenta inserir a turma 3 da UC XX na sala C3 e, no fim, mostra todas as turmas.',
    run: 'Erro: FOREIGN KEY constraint failed\n\n' + out(['id', 'uc', 'sala'], [[1, 'BD', 'A1'], [2, 'SO', 'B2']]),
    hint: H`Começa com <code>PRAGMA foreign_keys = ON;</code>. A FK escreve-se na coluna: <code>uc TEXT REFERENCES ucs(codigo)</code>. A turma 3 tem de dar erro.`,
    solution: C`
PRAGMA foreign_keys = ON;
CREATE TABLE turmas (
    id INTEGER PRIMARY KEY,
    uc TEXT REFERENCES ucs(codigo),
    sala TEXT
);
INSERT INTO turmas VALUES (1, 'BD', 'A1'), (2, 'SO', 'B2');
INSERT INTO turmas VALUES (3, 'XX', 'C3');
SELECT * FROM turmas;`,
  }, {
    title: 'Inscritos por UC',
    text: 'Usando só a tabela inscricoes, mostra quantos alunos estão inscritos em cada UC (colunas uc e n), por ordem do código da UC.',
    run: out(['uc', 'n'], [['BD', 3], ['ED', 2], ['SO', 2]]),
    hint: H`É um <code>GROUP BY uc</code> com <code>COUNT(*)</code>, como na lição 7.`,
    solution: C`
SELECT uc, COUNT(*) AS n
FROM inscricoes
GROUP BY uc
ORDER BY uc;`,
  }],
});

// ---------------------------------------------------------------- 9
// O JOIN de alunos com cursos: cada aluno junto com a linha do seu curso.
const cursoDe = sigla => ESCOLA.cursos.rows.find(c => c[0] === sigla);
const alunoComCurso = ESCOLA.alunos.rows.map(a => a.concat(cursoDe(a[2])));
const JOIN_COLS = ['a.numero', 'a.nome', 'a.curso', 'c.sigla', 'c.nome'];
const nomeECurso = alunoComCurso.map(r => [r[1], r[4]]);
// O LEFT JOIN de alunos com inscricoes: uma linha por inscrição, e NULL para quem não tem nenhuma.
const LEFT_COLS = ['a.numero', 'a.nome', 'a.curso', 'i.aluno', 'i.uc', 'i.nota'];
const alunoComInscricoes = ESCOLA.alunos.rows.flatMap(a => {
  const mine = ESCOLA.inscricoes.rows.filter(i => i[0] === a[0]);
  return mine.length ? mine.map(i => a.concat(i)) : [a.concat([null, null, null])];
});

LESSONS.push({
  id: 9,
  title: 'Juntar tabelas: JOIN',
  short: 'INNER JOIN, LEFT JOIN e como as linhas fazem par',
  body: H`
<p>Os dados estão espalhados por várias tabelas: o aluno guarda a sigla do curso, mas o nome do curso está noutra tabela. O <code>JOIN</code> junta as duas: para cada linha de uma tabela, procura as linhas da outra que fazem <strong>par</strong> segundo a condição do <code>ON</code> (quase sempre FK = PK) e cola-as numa linha só.</p>
<pre class="snip"><code>SELECT a.nome, c.nome AS curso
FROM alunos a
JOIN cursos c ON a.curso = c.sigla;</code></pre>
<ul>
<li><code>alunos a</code> dá a alcunha <code>a</code> à tabela. Escreve-se <code>a.nome</code> para dizer de que tabela é a coluna, o que é obrigatório quando as duas têm uma coluna com o mesmo nome.</li>
<li><code>JOIN</code> (ou <code>INNER JOIN</code>) só mostra as linhas que têm par. Um curso sem alunos não aparece.</li>
<li><code>LEFT JOIN</code> mostra <strong>todas</strong> as linhas da tabela da esquerda; quando não há par, as colunas da direita vêm a NULL. Com <code>WHERE ... IS NULL</code> descobres "quem não tem nenhum".</li>
<li>Podes juntar mais tabelas, uma de cada vez: <code>FROM alunos a JOIN inscricoes i ON ... JOIN ucs u ON ...</code></li>
</ul>`,
  analogy: H`Tens a lista de alunos com a sigla do curso e uma tabela de siglas com o nome de cada curso. O JOIN vai a cada aluno, procura a sigla dele na outra lista e escreve o nome do curso ao lado. O <code>LEFT JOIN</code> não risca da lista os alunos cuja sigla não encontra: deixa o espaço em branco.`,
  db: ESCOLA,
  examples: [{
    title: 'Cada aluno com o nome do seu curso',
    db: only(ESCOLA, 'cursos', 'alunos'),
    code: C`
SELECT a.nome, c.nome AS curso
FROM alunos a
JOIN cursos c ON a.curso = c.sigla
ORDER BY a.nome;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos a', cols: ['numero', 'nome', 'curso'], rows: ESCOLA.alunos.rows }, n: H`Começa pelos alunos. A partir daqui, <code>a</code> quer dizer <code>alunos</code>.` },
      { l: 3, tm: { alunos: { 0: 'hit' }, cursos: { 0: 'hit' } }, g: { label: 'JOIN cursos c ON a.curso = c.sigla', cols: JOIN_COLS, rows: alunoComCurso.slice(0, 1) }, n: H`A Ana tem <code>curso = 'LEI'</code>. O JOIN procura em cursos a linha com <code>sigla = 'LEI'</code>, encontra-a e cola as duas numa linha só.` },
      { l: 3, tm: { alunos: { 1: 'hit' }, cursos: { 0: 'hit' } }, g: { label: 'JOIN cursos c ON a.curso = c.sigla', cols: JOIN_COLS, rows: alunoComCurso.slice(0, 2) }, n: 'O Rui também é de LEI: a mesma linha de cursos serve outra vez.' },
      { l: 3, tm: { alunos: { 2: 'hit' }, cursos: { 1: 'hit' } }, g: { label: 'JOIN cursos c ON a.curso = c.sigla', cols: JOIN_COLS, rows: alunoComCurso.slice(0, 3) }, n: 'A Ines é de LEE.' },
      { l: 3, tm: { alunos: { 3: 'hit', 4: 'hit', 5: 'hit' }, cursos: { 0: 'hit', 1: 'hit', 2: 'hit' } }, g: { label: 'JOIN cursos c ON a.curso = c.sigla', cols: JOIN_COLS, rows: alunoComCurso }, n: H`E o mesmo para os restantes. Repara que LB (Bioengenharia) nunca fez par com ninguém, por isso não aparece: o <code>JOIN</code> só mostra linhas com par.` },
      { l: 1, g: { label: 'SELECT a.nome, c.nome AS curso', cols: ['nome', 'curso'], rows: nomeECurso }, n: H`As duas tabelas têm uma coluna <code>nome</code>, por isso é preciso dizer qual: <code>a.nome</code> é o do aluno e <code>c.nome</code> o do curso.` },
      { l: 4, g: { label: 'ORDER BY a.nome', cols: ['nome', 'curso'], rows: nomeECurso.slice().sort((x, y) => x[0].localeCompare(y[0])) }, n: 'Por fim, ordena pelo nome do aluno.' },
    ],
  }, {
    title: 'Quem não está inscrito em nada (LEFT JOIN)',
    db: only(ESCOLA, 'alunos', 'inscricoes'),
    code: C`
SELECT a.nome, i.uc
FROM alunos a
LEFT JOIN inscricoes i ON i.aluno = a.numero
WHERE i.uc IS NULL;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos a', cols: ['numero', 'nome', 'curso'], rows: ESCOLA.alunos.rows }, n: 'Começa pelos 6 alunos.' },
      { l: 3, g: { label: 'LEFT JOIN inscricoes i ON i.aluno = a.numero', cols: LEFT_COLS, rows: alunoComInscricoes, marks: alunoComInscricoes.map(r => (r[3] === null ? 'hit' : null)) }, n: H`Cada aluno junta-se a cada inscrição sua: a Ana tem duas, por isso aparece duas vezes. O Pedro não tem nenhuma; com <code>LEFT JOIN</code> aparece à mesma, com NULL nas colunas de inscricoes (a amarelo). Com um JOIN normal desaparecia.` },
      { l: 4, g: { label: 'WHERE i.uc IS NULL', cols: LEFT_COLS, rows: alunoComInscricoes, marks: alunoComInscricoes.map(r => (r[4] === null ? 'keep' : 'drop')) }, n: H`Ficam só as linhas que não fizeram par, ou seja, os alunos sem inscrições.` },
      { l: 1, g: { label: 'SELECT a.nome, i.uc', cols: ['nome', 'uc'], rows: [['Pedro', null]] }, n: 'O Pedro é o único aluno que não está inscrito em nenhuma UC.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>ON</code>, ou pôr a condição errada (<code>a.numero = c.sigla</code>). Sem uma condição certa, cada linha junta-se com linhas que não são o seu par.`,
    H`Escrever <code>nome</code> quando as duas tabelas têm essa coluna: <em>ambiguous column name: nome</em>. Usa <code>a.nome</code> ou <code>c.nome</code>.`,
    H`Usar <code>JOIN</code> para "quem não tem": esses não fazem par e desaparecem. É preciso <code>LEFT JOIN</code> e <code>IS NULL</code>.`,
    H`Contar com <code>COUNT(*)</code> depois de um LEFT JOIN: a linha com NULL também conta. Para contar só os pares, usa <code>COUNT(coluna_da_direita)</code>.`,
    H`Estranhar linhas repetidas: um aluno com três inscrições aparece três vezes depois do JOIN. É normal.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT a.nome
FROM alunos a
JOIN inscricoes i ON i.aluno = a.numero
WHERE i.uc = 'BD'
ORDER BY a.nome;`, opts: [res(['nome'], [['Ana'], ['Rui'], ['Tiago']]), res(['nome'], [['Ana'], ['Ana'], ['Rui'], ['Tiago']]), res(['nome'], [['Ana'], ['Pedro'], ['Rui'], ['Tiago']]), res(['nome'], [['BD'], ['BD'], ['BD']])], ok: 0, mono: true, check: true,
      exp: 'Há três inscrições em BD: 101 (Ana), 102 (Rui) e 104 (Tiago). A Ana também está em SO, mas o WHERE tira essa linha. O Pedro não está inscrito em nada.' },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT c.sigla, COUNT(a.numero) AS n
FROM cursos c
LEFT JOIN alunos a ON a.curso = c.sigla
GROUP BY c.sigla
ORDER BY c.sigla;`, opts: [res(['sigla', 'n'], [['LEE', 2], ['LEI', 3], ['LEM', 1]]), res(['sigla', 'n'], [['LB', 0], ['LEE', 2], ['LEI', 3], ['LEM', 1]]), res(['sigla', 'n'], [['LB', 1], ['LEE', 2], ['LEI', 3], ['LEM', 1]]), res(['sigla', 'n'], [['LB', null], ['LEE', 2], ['LEI', 3], ['LEM', 1]])], ok: 1, mono: true, check: true,
      exp: H`O LEFT JOIN mantém LB, com NULL no lugar do aluno. <code>COUNT(a.numero)</code> não conta NULL, por isso dá 0. Com <code>COUNT(*)</code> dava 1, e com um JOIN normal LB nem aparecia.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome
FROM alunos
JOIN cursos ON alunos.curso = cursos.sigla;`, opts: ['Erro: ambiguous column name: nome', res(['nome'], [['Ana'], ['Rui'], ['Ines'], ['Tiago'], ['Marta'], ['Pedro']]), res(['nome'], [['Engenharia Informatica'], ['Engenharia Informatica'], ['Engenharia Eletrotecnica'], ['Engenharia Informatica'], ['Engenharia Mecanica'], ['Engenharia Eletrotecnica']])], ok: 0, mono: true, check: true,
      exp: H`As duas tabelas têm uma coluna <code>nome</code> e o SQL não adivinha qual queres. Tens de escrever <code>alunos.nome</code> ou <code>cursos.nome</code>.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT COUNT(*) AS n
FROM alunos a
JOIN inscricoes i ON i.aluno = a.numero;`, opts: [res(['n'], [[6]]), res(['n'], [[7]]), res(['n'], [[42]]), res(['n'], [[8]])], ok: 1, mono: true, check: true,
      exp: 'O JOIN dá uma linha por cada par aluno-inscrição, ou seja, uma por inscrição: 7. O Pedro não tem par e não conta. 42 seria juntar todos com todos (6 × 7), sem ON.' },
  ],
  exercises: [{
    title: 'A pauta completa',
    text: 'Para todas as inscrições, mostra o nome do aluno (aluno), o nome da UC (uc) e a nota, ordenado pelo nome do aluno e depois pelo nome da UC.',
    run: out(['aluno', 'uc', 'nota'], [['Ana', 'Bases de Dados', 16], ['Ana', 'Sistemas Operativos', 13], ['Ines', 'Estruturas de Dados', 14], ['Marta', 'Sistemas Operativos', 18], ['Rui', 'Bases de Dados', 9], ['Tiago', 'Bases de Dados', 12], ['Tiago', 'Estruturas de Dados', 11]]),
    hint: H`São três tabelas: <code>alunos a JOIN inscricoes i ON i.aluno = a.numero JOIN ucs u ON u.codigo = i.uc</code>. Usa AS para dar os nomes aluno e uc.`,
    solution: C`
SELECT a.nome AS aluno, u.nome AS uc, i.nota
FROM alunos a
JOIN inscricoes i ON i.aluno = a.numero
JOIN ucs u ON u.codigo = i.uc
ORDER BY a.nome, u.nome;`,
  }, {
    title: 'UCs vazias',
    text: 'Mostra o código e o nome das UCs que não têm nenhum aluno inscrito.',
    run: out(['codigo', 'nome'], [['RC', 'Redes de Computadores']]),
    hint: H`Como no segundo exemplo, mas a tabela da esquerda é <code>ucs</code>: <code>ucs u LEFT JOIN inscricoes i ON i.uc = u.codigo</code>, e depois <code>IS NULL</code>.`,
    solution: C`
SELECT u.codigo, u.nome
FROM ucs u
LEFT JOIN inscricoes i ON i.uc = u.codigo
WHERE i.aluno IS NULL;`,
  }],
});

// ---------------------------------------------------------------- 10
const PAUTA = {
  cols: [['aluno', 'INTEGER'], ['uc', 'TEXT'], ['nome_uc', 'TEXT'], ['nota', 'INTEGER']],
  key: ['aluno', 'uc'],
  rows: [[101, 'BD', 'Bases de Dados', 16], [101, 'SO', 'Sistemas Operativos', 13], [102, 'BD', 'Bases de Dados', 9], [104, 'BD', 'Bases de Dados', 12]],
};
const pautaMudada = [['BD', 'Bases de Dados I'], ['SO', 'Sistemas Operativos'], ['BD', 'Bases de Dados'], ['BD', 'Bases de Dados']];
const UCS_NORMAL = { cols: [['codigo', 'TEXT PRIMARY KEY'], ['nome', 'TEXT NOT NULL']], rows: [['BD', 'Bases de Dados'], ['SO', 'Sistemas Operativos']] };
const NOTAS_NORMAL = {
  cols: [['aluno', 'INTEGER'], ['uc', 'TEXT REFERENCES ucs(codigo)'], ['nota', 'INTEGER']],
  key: ['aluno', 'uc'],
  rows: [[101, 'BD', 16], [101, 'SO', 13], [102, 'BD', 9], [104, 'BD', 12]],
};
const ALUNOS_CURSOS = {
  cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT'], ['curso', 'TEXT'], ['nome_curso', 'TEXT']],
  rows: [[101, 'Ana', 'LEI', 'Engenharia Informatica'], [102, 'Rui', 'LEI', 'Engenharia Informatica'], [103, 'Ines', 'LEE', 'Engenharia Eletrotecnica'], [105, 'Marta', 'LEM', 'Engenharia Mecanica']],
};

LESSONS.push({
  id: 10,
  title: 'Normalização: cada coisa no seu sítio',
  short: 'repetição, anomalias e as três primeiras formas normais',
  body: H`
<p>Uma tabela mal desenhada repete informação. A repetição gasta espaço, mas o pior são as <strong>anomalias</strong>: mudas um dado numa linha e esqueces as outras (atualização), não consegues guardar uma UC sem ter um aluno inscrito (inserção), ou apagas o último aluno e perdes o nome da UC (remoção).</p>
<p><strong>Normalizar</strong> é partir as tabelas até cada informação estar num só sítio. Para isso olha-se para as <strong>dependências funcionais</strong>: <code>uc → nome_uc</code> quer dizer "sabendo a UC, sabe-se o nome da UC".</p>
<table class="t">
<thead><tr><th>Forma normal</th><th>Regra</th><th>Exemplo que falha</th></tr></thead>
<tbody>
<tr><td>1FN</td><td>cada célula tem um só valor (nada de listas)</td><td><code>telefones = '912..., 934...'</code></td></tr>
<tr><td>2FN</td><td>1FN, e cada coluna que não é chave depende da chave <strong>toda</strong></td><td><code>pauta(aluno, uc, nome_uc, nota)</code> com chave (aluno, uc): <code>nome_uc</code> só depende de <code>uc</code></td></tr>
<tr><td>3FN</td><td>2FN, e nenhuma coluna que não é chave depende de outra que também não é</td><td><code>alunos(numero, nome, curso, nome_curso)</code>: <code>nome_curso</code> depende de <code>curso</code></td></tr>
</tbody>
</table>
<p>A solução é quase sempre a mesma: tirar as colunas que dependem da coisa errada para uma tabela nova, cuja chave é essa coisa, e deixar uma FK no lugar.</p>`,
  analogy: 'Normalizar é arrumar o quarto: cada coisa tem uma gaveta. Se o nome da UC estiver escrito em 30 linhas, um dia alguém corrige 29 e esquece-se de uma. Com o nome numa só gaveta, corrige-se uma vez.',
  db: { pauta: PAUTA },
  examples: [{
    title: 'A anomalia de atualização',
    db: { pauta: PAUTA },
    code: C`
UPDATE pauta
SET nome_uc = 'Bases de Dados I'
WHERE aluno = 101 AND uc = 'BD';
SELECT DISTINCT uc, nome_uc
FROM pauta
ORDER BY uc, nome_uc;`,
    steps: [
      { l: 1, n: H`A tabela <code>pauta</code> repete o nome da UC em cada inscrição: "Bases de Dados" aparece três vezes.` },
      { l: 3, tm: { pauta: { 0: 'hit' } }, n: 'Alguém quer mudar o nome da UC, mas o WHERE só apanha uma das linhas de BD...' },
      { l: 2, upd: { pauta: { 0: { nome_uc: 'Bases de Dados I' } } }, n: '...e o nome muda só nessa linha.' },
      { l: 5, g: { label: 'FROM pauta', cols: colsOf(PAUTA), rows: PAUTA.rows.map((r, i) => (i === 0 ? [101, 'BD', 'Bases de Dados I', 16] : r)) }, n: 'Vamos ver que nomes tem cada UC.' },
      { l: 4, g: { label: 'SELECT DISTINCT uc, nome_uc', cols: ['uc', 'nome_uc'], rows: pautaMudada, marks: ['keep', 'keep', 'keep', 'drop'] }, n: 'Sem repetidos...' },
      { l: 4, g: { label: 'SELECT DISTINCT uc, nome_uc', cols: ['uc', 'nome_uc'], rows: pautaMudada.slice(0, 3) }, n: H`...a BD aparece com <strong>dois</strong> nomes. Os dados ficaram contraditórios: é a anomalia de atualização.` },
      { l: 6, g: { label: 'ORDER BY uc, nome_uc', cols: ['uc', 'nome_uc'], rows: [['BD', 'Bases de Dados'], ['BD', 'Bases de Dados I'], ['SO', 'Sistemas Operativos']] }, n: H`A culpa é do desenho: <code>nome_uc</code> depende só de <code>uc</code>, que é só parte da chave (aluno, uc). A tabela não está na 2FN.` },
    ],
  }, {
    title: 'Normalizar: partir em duas tabelas',
    db: { pauta: PAUTA },
    code: C`
CREATE TABLE ucs (
    codigo TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);
INSERT INTO ucs
SELECT DISTINCT uc, nome_uc FROM pauta;
CREATE TABLE notas (
    aluno INTEGER,
    uc TEXT REFERENCES ucs(codigo),
    nota INTEGER,
    PRIMARY KEY (aluno, uc)
);
INSERT INTO notas
SELECT aluno, uc, nota FROM pauta;`,
    steps: [
      { l: 1, create: { ucs: { cols: [['codigo', 'TEXT PRIMARY KEY'], ['nome', 'TEXT NOT NULL']] } }, n: H`O nome da UC depende da UC, por isso vai para uma tabela cuja chave é a UC.` },
      { l: 6, g: { label: 'SELECT DISTINCT uc, nome_uc FROM pauta', cols: ['uc', 'nome_uc'], rows: [['BD', 'Bases de Dados'], ['SO', 'Sistemas Operativos']] }, n: H`Um <code>INSERT</code> pode receber as linhas de um <code>SELECT</code>, em vez de <code>VALUES</code>. Este SELECT dá cada UC uma só vez.` },
      { l: 5, ins: { ucs: [['BD', 'Bases de Dados'], ['SO', 'Sistemas Operativos']] }, n: 'Essas linhas entram na tabela nova. Agora o nome de cada UC está escrito uma só vez.' },
      { l: 7, g: null, create: { notas: { cols: [['aluno', 'INTEGER'], ['uc', 'TEXT REFERENCES ucs(codigo)'], ['nota', 'INTEGER']], key: ['aluno', 'uc'] } }, n: H`A nota depende do aluno <strong>e</strong> da UC: fica numa tabela com a chave (aluno, uc).` },
      { l: 9, n: H`No lugar do nome da UC fica só o código, como chave estrangeira para <code>ucs</code>.` },
      { l: 14, g: { label: 'SELECT aluno, uc, nota FROM pauta', cols: ['aluno', 'uc', 'nota'], rows: NOTAS_NORMAL.rows }, n: 'As notas vêm da pauta, sem o nome da UC.' },
      { l: 13, ins: { notas: NOTAS_NORMAL.rows }, n: H`Pronto: mudar o nome de uma UC passa a ser um UPDATE a uma só linha de <code>ucs</code>. Para voltar a ver tudo junto, faz-se um JOIN.` },
    ],
  }],
  mistakes: [
    H`Guardar listas numa célula (<code>'BD, SO'</code>). Parte a 1FN; usa uma linha por valor, noutra tabela.`,
    H`Copiar o nome (do curso, da UC, do cliente) para todas as linhas "para não ter de fazer JOIN". É exatamente isso que causa as anomalias.`,
    H`Achar que a 2FN importa em todas as tabelas. Só pode falhar quando a chave tem mais do que uma coluna.`,
    H`Partir as tabelas e esquecer a FK que as volta a ligar.`,
  ],
  quiz: [
    { q: 'A tabela alunos(numero, nome, telefones) guarda telefones = "912345678, 934567890". Que forma normal falha?', opts: ['1FN', '2FN', '3FN', 'Nenhuma'], ok: 0,
      exp: 'A 1FN pede um só valor por célula, e aqui há uma lista. A solução é uma tabela telefones(numero_aluno, telefone), com uma linha por telefone.' },
    { q: 'Em pauta(aluno, uc, nome_uc, nota), com chave (aluno, uc), qual é o problema?', opts: ['nota depende só do aluno', 'nome_uc depende só de uc, que é só parte da chave', 'A chave devia ser só aluno', 'Não há problema nenhum'], ok: 1,
      exp: 'O nome da UC não muda com o aluno: depende só de parte da chave. Isso parte a 2FN. A nota depende do par (aluno, uc), e essa está bem.' },
    { q: 'Em alunos(numero, nome, curso, nome_curso), com chave numero, que forma normal falha?', opts: ['1FN', '2FN', '3FN', 'Nenhuma'], ok: 2,
      exp: 'A chave tem uma só coluna, por isso a 2FN cumpre-se. Mas nome_curso depende de curso, que não é chave: é uma dependência transitiva (numero → curso → nome_curso), e isso parte a 3FN.' },
    { q: 'Que resultado dá este script?', code: C`
UPDATE pauta SET nome_uc = 'BD I' WHERE aluno = 102;
SELECT COUNT(DISTINCT nome_uc) AS nomes
FROM pauta WHERE uc = 'BD';`, opts: [res(['nomes'], [[1]]), res(['nomes'], [[2]]), res(['nomes'], [[3]]), res(['nomes'], [[0]])], ok: 1, mono: true, check: true,
      exp: H`Só a linha do aluno 102 muda. A BD fica com dois nomes diferentes: "Bases de Dados" (alunos 101 e 104) e "BD I" (aluno 102). <code>COUNT(DISTINCT ...)</code> conta os valores diferentes: 2.` },
  ],
  exercises: [{
    title: 'Tirar os cursos para fora',
    text: 'A tabela alunos_cursos(numero, nome, curso, nome_curso) repete o nome do curso. Cria a tabela cursos(sigla chave primária, nome obrigatório), preenche-a com INSERT ... SELECT DISTINCT a partir de alunos_cursos e mostra-a, ordenada pela sigla.',
    db: { alunos_cursos: ALUNOS_CURSOS },
    run: out(['sigla', 'nome'], [['LEE', 'Engenharia Eletrotecnica'], ['LEI', 'Engenharia Informatica'], ['LEM', 'Engenharia Mecanica']]),
    hint: H`Depois do CREATE TABLE: <code>INSERT INTO cursos SELECT DISTINCT curso, nome_curso FROM alunos_cursos;</code>`,
    solution: C`
CREATE TABLE cursos (
    sigla TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);
INSERT INTO cursos
SELECT DISTINCT curso, nome_curso FROM alunos_cursos;
SELECT * FROM cursos
ORDER BY sigla;`,
  }, {
    title: 'Voltar a juntar',
    text: 'Esta base de dados já está normalizada, em ucs(codigo, nome) e notas(aluno, uc, nota). Mostra o aluno, o nome da UC (coluna uc) e a nota, ordenado pelo aluno e pelo nome da UC.',
    db: { ucs: UCS_NORMAL, notas: NOTAS_NORMAL },
    run: out(['aluno', 'uc', 'nota'], [[101, 'Bases de Dados', 16], [101, 'Sistemas Operativos', 13], [102, 'Bases de Dados', 9], [104, 'Bases de Dados', 12]]),
    hint: H`Um JOIN entre notas e ucs: <code>ON u.codigo = n.uc</code>.`,
    solution: C`
SELECT n.aluno, u.nome AS uc, n.nota
FROM notas n
JOIN ucs u ON u.codigo = n.uc
ORDER BY n.aluno, u.nome;`,
  }],
});
