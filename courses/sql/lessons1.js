// ===== SQL do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador (l e n são como no C):
//   create: { tabela: { cols: [[nome, definição]], key?: [colunas] } }   cria uma tabela vazia
//   ins:    { tabela: [[valores], ...] }               acrescenta linhas
//   upd:    { tabela: { índice: { coluna: valor } } }  muda células (índice 0 = primeira linha)
//   del:    { tabela: [índices] }                      apaga linhas
//   tm:     { tabela: { índice: 'hit' | 'drop' } }     marca linhas da base de dados só neste passo
//   g:      { label, cols, rows, marks?, groups? } ou null   a grelha de trabalho da consulta (painel Resultado)
//           marks: 'keep' (passa), 'drop' (fica de fora), 'hit' (em destaque); groups: tamanhos dos grupos
//   err:    'mensagem'                                 o SQLite deu erro nesta instrução
// Um exemplo com db começa com essas tabelas. O check corre cada instrução no SQLite e compara,
// no último passo dessa instrução, as tabelas e o resultado com os reais.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);

// ---------- ajudantes para escrever grelhas e resultados ----------
// Nomes das colunas de uma tabela de exemplo.
const colsOf = t => t.cols.map(c => c[0]);
// Uma linha como objeto, para escrever condições legíveis: a => a.nota >= 10
const asObj = (t, r) => Object.fromEntries(colsOf(t).map((c, i) => [c, r[i]]));
// As linhas que cumprem uma condição, e as marcas 'keep'/'drop' que mostram o WHERE a trabalhar.
const rowsWhere = (t, test) => t.rows.filter(r => test(asObj(t, r)));
const marksWhere = (t, test) => t.rows.map(r => (test(asObj(t, r)) ? 'keep' : 'drop'));
// Só algumas colunas das linhas dadas (é o que o SELECT faz).
const pick = (t, rows, names) => rows.map(r => names.map(n => r[colsOf(t).indexOf(n)]));
// Um resultado em texto, como o sqlite3 o mostra com .headers on: res(['nome'], [['Ana'], ['Rui']]).
const res = (cols, rows) => [cols.join('|')].concat(rows.map(r => r.map(v => (v === null ? 'NULL' : String(v))).join('|'))).join('\n');
// O mesmo, com a mudança de linha final (para o "Resultado esperado" dos exercícios).
const out = (cols, rows) => res(cols, rows) + '\n';
// Uma base de dados só com algumas tabelas de outra: only(ESCOLA, 'alunos', 'cursos').
const only = (db, ...names) => Object.fromEntries(names.map(n => [n, db[n]]));

// ---------- bases de dados das lições ----------
const ALUNOS = {
  cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT NOT NULL'], ['curso', 'TEXT'], ['ano', 'INTEGER'], ['nota', 'INTEGER']],
  rows: [
    [101, 'Ana', 'LEI', 1, 17],
    [102, 'Rui', 'LEI', 1, 9],
    [103, 'Ines', 'LEE', 2, 14],
    [104, 'Tiago', 'LEI', 2, 12],
    [105, 'Marta', 'LEM', 1, 18],
    [106, 'Pedro', 'LEE', 1, 7],
    [107, 'Sofia', 'LEI', 1, 15],
    [108, 'Joao', 'LEM', 2, 11],
  ],
};
const ALL = colsOf(ALUNOS);

const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Tabelas e o primeiro SELECT',
  short: 'linhas, colunas e pedir dados com SELECT ... FROM',
  body: H`
<p>Uma <strong>base de dados</strong> guarda a informação em <strong>tabelas</strong>. Cada tabela tem <strong>colunas</strong> (que informação se guarda: número, nome, nota) e <strong>linhas</strong> (um registo cada: um aluno). Em C fazias isto com um array de structs: cada struct era uma linha, cada campo era uma coluna.</p>
<p>Para pedir dados escreve-se em <strong>SQL</strong>. A grande diferença para o C: em SQL dizes <strong>o que queres</strong>, não <strong>como</strong> se faz. Não há <code>for</code> a percorrer as linhas; é o sistema de gestão de base de dados (SGBD) que trata disso.</p>
<pre class="snip"><code>SELECT colunas
FROM tabela;</code></pre>
<ul>
<li><code>FROM alunos</code> diz de que tabela vêm os dados; <code>SELECT nome, nota</code> diz que colunas queres ver. <code>SELECT *</code> mostra todas.</li>
<li>Podes fazer contas nas colunas (<code>nota * 5</code>) e dar-lhes um nome novo com <code>AS</code>.</li>
<li>A instrução acaba com <code>;</code>. As palavras do SQL tanto podem ir em maiúsculas como em minúsculas, mas é costume escrevê-las em maiúsculas.</li>
<li>Repara na ordem: escreve-se <code>SELECT</code> primeiro, mas o SGBD começa pelo <code>FROM</code>. Só depois de ter a tabela é que escolhe as colunas.</li>
</ul>`,
  analogy: H`Uma tabela é a pauta de uma UC afixada no placard: cada linha é um aluno, cada coluna é uma informação sobre ele. Um <code>SELECT</code> é pedir a alguém "lê-me só os nomes e as notas": dizes o que queres e não como procurar.`,
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Escolher colunas',
    db: { alunos: ALUNOS },
    code: C`
SELECT nome, nota
FROM alunos;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: H`O SQL começa pelo <code>FROM</code>, apesar de estar escrito depois: vai buscar a tabela <code>alunos</code> inteira. São 8 linhas e 5 colunas.` },
      { l: 1, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: pick(ALUNOS, ALUNOS.rows, ['nome', 'nota']) }, n: H`Depois o <code>SELECT</code> fica só com as colunas pedidas, pela ordem em que as escreveste. As linhas continuam a ser todas, porque não pedimos nenhum filtro.` },
    ],
  }, {
    title: 'Contas e nomes novos com AS',
    db: { alunos: ALUNOS },
    code: C`
SELECT nome,
       nota * 5 AS percentagem
FROM alunos;`,
    steps: [
      { l: 3, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'Primeiro, a tabela inteira.' },
      { l: 1, g: { label: 'SELECT nome', cols: ['nome'], rows: pick(ALUNOS, ALUNOS.rows, ['nome']) }, n: H`A primeira coluna pedida é o <code>nome</code>.` },
      { l: 2, g: { label: 'nota * 5 AS percentagem', cols: ['nome', 'percentagem'], rows: ALUNOS.rows.map(r => [r[1], r[4] * 5]) }, n: H`A segunda coluna é uma conta, feita linha a linha: a nota de 0 a 20 vezes 5 dá a percentagem. O <code>AS</code> dá o nome <code>percentagem</code> à coluna nova. A tabela <code>alunos</code> não muda: o SELECT só lê.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>FROM</code>: o SGBD não sabe de que tabela queres as colunas.`,
    H`Escrever o nome de uma coluna que não existe ou mal escrito. O SQLite responde <em>no such column: idade</em>.`,
    H`Separar as colunas com espaços em vez de vírgulas: <code>SELECT nome nota</code> não mostra duas colunas (o SQL lê o <code>nota</code> como um nome novo para a coluna <code>nome</code>).`,
    H`Pôr uma vírgula a mais antes do <code>FROM</code>: <code>SELECT nome, nota, FROM alunos</code> dá erro de sintaxe.`,
    H`Achar que o <code>SELECT</code> muda a tabela. Ele só lê; para mudar dados há o <code>UPDATE</code> (lição 4).`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`SELECT 10 / 4 AS a, 10 / 4.0 AS b;`,
      opts: [res(['a', 'b'], [[2, 2.5]]), res(['a', 'b'], [[2.5, 2.5]]), res(['a', 'b'], [[2, 2]]), res(['a', 'b'], [[3, 2.5]])], ok: 0, mono: true, check: true,
      exp: H`Tal como em C, inteiro a dividir por inteiro dá inteiro: <code>10 / 4</code> dá 2 (as casas decimais são cortadas). Basta um dos lados ser real (<code>4.0</code>) para dar 2.5.` },
    { q: 'Qual destas consultas mostra só os nomes dos alunos?', opts: ['SELECT nome FROM alunos;', 'SELECT alunos FROM nome;', 'SELECT * FROM alunos;', 'FROM alunos SELECT nome;'], ok: 0, mono: true,
      exp: H`Depois do <code>SELECT</code> vêm as colunas e depois do <code>FROM</code> a tabela. <code>SELECT *</code> mostra todas as colunas, e a ordem <code>FROM ... SELECT</code> não é válida, apesar de ser a ordem em que o SGBD trabalha.` },
    { q: 'Quantas linhas dá SELECT nome FROM alunos; com a tabela desta lição?', opts: ['1', '5', '8', '40'], ok: 2,
      exp: 'Sem filtro, o SELECT devolve uma linha por cada linha da tabela: 8 alunos, 8 linhas. O 5 é o número de colunas da tabela, e o SELECT só mostra uma delas.' },
    { q: 'Que resultado dá esta consulta?', code: C`SELECT 'Ola' AS msg, 2 + 3 * 4 AS conta;`,
      opts: [res(['msg', 'conta'], [['Ola', 14]]), res(['msg', 'conta'], [['Ola', 20]]), res(["'Ola'", 'conta'], [['Ola', 14]]), res(['msg', 'conta'], [['msg', 14]])], ok: 0, mono: true, check: true,
      exp: H`Um SELECT nem precisa de tabela para fazer contas. A multiplicação vem antes da soma, como em C e na matemática: 3 × 4 = 12, mais 2 dá 14. O <code>AS</code> dá o nome às colunas.` },
  ],
  exercises: [{
    title: 'Número e nome',
    text: 'Mostra o número e o nome de todos os alunos.',
    run: out(['numero', 'nome'], pick(ALUNOS, ALUNOS.rows, ['numero', 'nome'])),
    hint: H`As colunas vão separadas por vírgula, depois do <code>SELECT</code>.`,
    solution: C`
SELECT numero, nome
FROM alunos;`,
  }, {
    title: 'Nota de 0 a 10',
    text: 'Mostra o nome de cada aluno e a nota numa escala de 0 a 10, com uma casa decimal (por exemplo 8.5). Chama nota10 a essa coluna.',
    run: out(['nome', 'nota10'], ALUNOS.rows.map(r => [r[1], String(r[4] / 2).includes('.') ? String(r[4] / 2) : r[4] / 2 + '.0'])),
    hint: H`Dividir por <code>2</code> dava divisão inteira (17 / 2 = 8). Divide por <code>2.0</code> para ter casas decimais.`,
    solution: C`
SELECT nome, nota / 2.0 AS nota10
FROM alunos;`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Criar tabelas e inserir dados',
  short: 'CREATE TABLE, tipos, NOT NULL e INSERT INTO',
  body: H`
<p>Antes de ter dados é preciso criar a tabela: dizer que colunas tem e de que tipo é cada uma. É parecido com definir um <code>struct</code> em C: crias o molde, ainda sem nenhuma linha.</p>
<pre class="snip"><code>CREATE TABLE alunos (
    numero INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    nota INTEGER
);</code></pre>
<table class="t">
<thead><tr><th>Tipo (SQLite)</th><th>Guarda</th><th>Em C era</th></tr></thead>
<tbody>
<tr><td><code>INTEGER</code></td><td>números inteiros</td><td><code>int</code></td></tr>
<tr><td><code>REAL</code></td><td>números com casas decimais</td><td><code>double</code></td></tr>
<tr><td><code>TEXT</code></td><td>texto, escrito entre plicas: <code>'Ana'</code></td><td><code>char[]</code></td></tr>
</tbody>
</table>
<ul>
<li><code>NOT NULL</code> obriga a coluna a ter sempre um valor. <code>PRIMARY KEY</code> diz que a coluna identifica cada linha: não se pode repetir (vês isto a fundo na lição 8).</li>
<li><code>INSERT INTO alunos VALUES (101, 'Ana', 17);</code> acrescenta uma linha. Os valores vão pela ordem das colunas.</li>
<li>Se só deres algumas colunas, escreve-as: <code>INSERT INTO alunos (numero, nome) VALUES (102, 'Rui');</code>. As que faltam ficam com <code>NULL</code> (sem valor).</li>
<li>Um só INSERT pode meter várias linhas: <code>VALUES (...), (...);</code></li>
</ul>
<p>Noutros SGBD (MySQL, PostgreSQL, Oracle) os nomes dos tipos mudam um pouco (<code>INT</code>, <code>VARCHAR(50)</code>, <code>DECIMAL</code>), mas a ideia é a mesma.</p>`,
  analogy: H`O <code>CREATE TABLE</code> é desenhar as colunas numa folha de pauta em branco. Cada <code>INSERT</code> é escrever uma linha nessa folha. As regras (<code>NOT NULL</code>, <code>PRIMARY KEY</code>) são o funcionário que recusa uma linha mal preenchida.`,
  examples: [{
    title: 'Criar a tabela e pôr lá alunos',
    code: C`
CREATE TABLE alunos (
    numero INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    nota INTEGER
);
INSERT INTO alunos VALUES (101, 'Ana', 17);
INSERT INTO alunos (numero, nome) VALUES (102, 'Rui');
INSERT INTO alunos VALUES (103, 'Ines', 14), (104, 'Tiago', 12);
SELECT * FROM alunos;`,
    steps: [
      { l: 1, create: { alunos: { cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT NOT NULL'], ['nota', 'INTEGER']] } }, n: H`<code>CREATE TABLE</code> cria a tabela <code>alunos</code>, ainda sem nenhuma linha. A base de dados passa a ter uma tabela.` },
      { l: 2, n: H`<code>numero</code> é um inteiro e é a <strong>chave primária</strong> (PK): cada aluno tem um número diferente.` },
      { l: 3, n: H`<code>nome</code> é texto e <code>NOT NULL</code>: não pode ficar vazio.` },
      { l: 4, n: H`<code>nota</code> é um inteiro sem regras extra: pode ficar sem valor.` },
      { l: 6, ins: { alunos: [[101, 'Ana', 17]] }, n: H`O <code>INSERT</code> acrescenta uma linha. Os três valores vão pela ordem das colunas: numero, nome, nota. O texto vai entre plicas.` },
      { l: 7, ins: { alunos: [[102, 'Rui', null]] }, n: H`Aqui só se dão duas colunas, escritas entre parênteses. A <code>nota</code> fica com <code>NULL</code>: não tem valor (não é zero!).` },
      { l: 8, ins: { alunos: [[103, 'Ines', 14], [104, 'Tiago', 12]] }, n: 'Um só INSERT com duas linhas, separadas por vírgula.' },
      { l: 9, g: { label: 'SELECT * FROM alunos', cols: ['numero', 'nome', 'nota'], rows: [[101, 'Ana', 17], [102, 'Rui', null], [103, 'Ines', 14], [104, 'Tiago', 12]] }, n: H`<code>SELECT *</code> mostra todas as colunas e todas as linhas. Lá está o <code>NULL</code> do Rui.` },
    ],
  }, {
    title: 'Quando o INSERT é recusado',
    code: C`
CREATE TABLE alunos (
    numero INTEGER PRIMARY KEY,
    nome TEXT NOT NULL
);
INSERT INTO alunos VALUES (101, 'Ana');
INSERT INTO alunos VALUES (101, 'Rui');
INSERT INTO alunos VALUES (102, NULL);
INSERT INTO alunos VALUES (102, 'Rui');`,
    steps: [
      { l: 1, create: { alunos: { cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT NOT NULL']] } }, n: 'Uma tabela com duas regras: o número não se repete e o nome é obrigatório.' },
      { l: 5, ins: { alunos: [[101, 'Ana']] }, n: 'A Ana entra sem problemas.' },
      { l: 6, err: 'UNIQUE constraint failed: alunos.numero', n: H`O 101 já existe e o <code>numero</code> é chave primária. O SQLite recusa a linha inteira: a tabela fica igual.` },
      { l: 7, err: 'NOT NULL constraint failed: alunos.nome', n: H`O nome é <code>NOT NULL</code>, por isso também esta é recusada.` },
      { l: 8, ins: { alunos: [[102, 'Rui']] }, n: 'Com um número novo e um nome, o Rui já entra. Uma instrução recusada não estraga as outras.' },
    ],
  }],
  mistakes: [
    H`Escrever texto com aspas: <code>"Ana"</code>. Em SQL o texto vai entre <strong>plicas</strong>: <code>'Ana'</code>. O SQLite queixa-se com <em>no such column: "Ana"</em>.`,
    H`Esquecer as plicas no texto: <code>VALUES (101, Ana)</code>. O SQL acha que <code>Ana</code> é o nome de uma coluna.`,
    H`Dar menos valores do que as colunas sem dizer quais são: <em>table alunos has 3 columns but 2 values were supplied</em>.`,
    H`Esquecer o <code>;</code> entre instruções, ou a vírgula entre colunas no CREATE TABLE.`,
    H`Criar a tabela duas vezes: <em>table alunos already exists</em>.`,
    H`Pôr uma vírgula depois da última coluna do CREATE TABLE, antes do <code>)</code>.`,
  ],
  quiz: [
    { q: 'Que resultado dá este script?', db: false, code: C`
CREATE TABLE t (a INTEGER, b TEXT);
INSERT INTO t VALUES (1, 'x');
INSERT INTO t (b) VALUES ('y');
SELECT * FROM t;`, opts: [res(['a', 'b'], [[1, 'x'], [null, 'y']]), res(['a', 'b'], [[1, 'x'], [0, 'y']]), res(['a', 'b'], [[1, 'x']]), 'Erro: NOT NULL constraint failed: t.a'], ok: 0, mono: true, check: true,
      exp: H`A coluna <code>a</code> não foi dada no segundo INSERT, por isso fica <code>NULL</code> (sem valor, que não é o mesmo que 0). Não há erro porque <code>a</code> não tem <code>NOT NULL</code>.` },
    { q: 'Que resultado dá este script?', db: false, code: C`
CREATE TABLE t (n INTEGER PRIMARY KEY, nome TEXT);
INSERT INTO t VALUES (1, 'Ana');
INSERT INTO t VALUES (1, 'Rui');
SELECT nome FROM t;`, opts: [res(['nome'], [['Ana'], ['Rui']]), res(['nome'], [['Rui']]), 'Erro: UNIQUE constraint failed: t.n\n\n' + res(['nome'], [['Ana']]), res(['nome'], [['Ana']])], ok: 2, mono: true, check: true,
      exp: H`O segundo INSERT repete a chave primária, por isso dá erro e o Rui não entra. O SQLite continua para a instrução seguinte, e o SELECT só encontra a Ana.` },
    { q: 'Que tipo usas para guardar o nome de um aluno?', opts: ['INTEGER', 'REAL', 'TEXT', 'NAME'], ok: 2,
      exp: H`Texto guarda-se em <code>TEXT</code>. <code>INTEGER</code> e <code>REAL</code> são para números.` },
    { q: 'Qual destes INSERT está certo?', opts: ["INSERT INTO alunos VALUES (105, 'Marta', 18);", 'INSERT INTO alunos VALUES (105, "Marta", 18);', "INSERT alunos VALUES (105, 'Marta', 18);", "INSERT INTO alunos (105, 'Marta', 18);"], ok: 0, mono: true,
      exp: H`É <code>INSERT INTO tabela VALUES (...)</code>, com o texto entre plicas. Com aspas o SQLite procura uma coluna chamada Marta, sem <code>INTO</code> é erro de sintaxe e sem <code>VALUES</code> os valores são lidos como nomes de colunas.` },
  ],
  exercises: [{
    title: 'Tabela de UCs',
    text: 'Cria a tabela ucs com as colunas codigo (texto, chave primária), nome (texto, obrigatório) e ects (inteiro). Insere as UCs BD "Bases de Dados" com 6 ECTS, SO "Sistemas Operativos" com 6 e RC "Redes de Computadores" com 4. No fim mostra a tabela toda.',
    run: out(['codigo', 'nome', 'ects'], [['BD', 'Bases de Dados', 6], ['SO', 'Sistemas Operativos', 6], ['RC', 'Redes de Computadores', 4]]),
    hint: H`Primeiro o <code>CREATE TABLE ucs (...)</code>, com as colunas separadas por vírgula. Depois um INSERT (ou três) e um <code>SELECT * FROM ucs;</code>`,
    solution: C`
CREATE TABLE ucs (
    codigo TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    ects INTEGER
);
INSERT INTO ucs VALUES
    ('BD', 'Bases de Dados', 6),
    ('SO', 'Sistemas Operativos', 6),
    ('RC', 'Redes de Computadores', 4);
SELECT * FROM ucs;`,
  }, {
    title: 'Livros',
    text: 'Cria a tabela livros com id (inteiro, chave primária), titulo (texto, obrigatório) e ano (inteiro). Insere Os Maias (1888), Mensagem (1934) e Ensaio sobre a Cegueira (1995), com os ids 1, 2 e 3. Mostra só o título e o ano.',
    run: out(['titulo', 'ano'], [['Os Maias', 1888], ['Mensagem', 1934], ['Ensaio sobre a Cegueira', 1995]]),
    hint: H`No fim não uses <code>*</code>: escreve as duas colunas que queres, <code>SELECT titulo, ano</code>.`,
    solution: C`
CREATE TABLE livros (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL,
    ano INTEGER
);
INSERT INTO livros VALUES (1, 'Os Maias', 1888), (2, 'Mensagem', 1934), (3, 'Ensaio sobre a Cegueira', 1995);
SELECT titulo, ano FROM livros;`,
  }],
});

// ---------------------------------------------------------------- 2
const positiva = a => a.nota >= 10;
const leiPrimeiro = a => a.curso === 'LEI' && a.ano === 1;

LESSONS.push({
  id: 2,
  title: 'Filtrar linhas com WHERE',
  short: 'condições, AND e OR, BETWEEN, IN e LIKE',
  body: H`
<p>O <code>WHERE</code> escolhe <strong>que linhas</strong> ficam no resultado. A condição é testada linha a linha: as que dão verdadeiro passam, as outras ficam de fora. A ordem de trabalho é <code>FROM</code> → <code>WHERE</code> → <code>SELECT</code>.</p>
<table class="t">
<thead><tr><th>Escreves</th><th>Quer dizer</th></tr></thead>
<tbody>
<tr><td><code>nota = 10</code></td><td>igual (só um <code>=</code>, ao contrário do C)</td></tr>
<tr><td><code>nota &lt;&gt; 10</code> ou <code>nota != 10</code></td><td>diferente</td></tr>
<tr><td><code>&lt; &gt; &lt;= &gt;=</code></td><td>menor, maior, ...</td></tr>
<tr><td><code>AND</code>, <code>OR</code>, <code>NOT</code></td><td>e, ou, não (como <code>&amp;&amp;</code>, <code>||</code> e <code>!</code> em C)</td></tr>
<tr><td><code>nota BETWEEN 10 AND 14</code></td><td>entre 10 e 14, <strong>incluindo</strong> os dois</td></tr>
<tr><td><code>curso IN ('LEI', 'LEM')</code></td><td>igual a um destes</td></tr>
<tr><td><code>nome LIKE 'M%'</code></td><td>começa por M (<code>%</code> = qualquer texto, <code>_</code> = um carácter)</td></tr>
</tbody>
</table>
<p>O texto vai entre plicas e, com <code>=</code>, as maiúsculas contam: <code>'lei'</code> não é <code>'LEI'</code>. Quando juntas <code>AND</code> e <code>OR</code>, usa parênteses para não haver dúvidas.</p>`,
  analogy: 'O WHERE é uma peneira. As linhas da tabela passam uma a uma e só ficam as que cumprem a condição. A tabela original não perde nada: a peneira só decide o que vai para o resultado.',
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Quem teve positiva',
    db: { alunos: ALUNOS },
    code: C`
SELECT nome, nota
FROM alunos
WHERE nota >= 10;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: H`Primeiro o <code>FROM</code>: a tabela inteira, 8 linhas.` },
      { l: 3, g: { label: 'WHERE nota >= 10', cols: ALL, rows: ALUNOS.rows, marks: marksWhere(ALUNOS, positiva) }, n: H`O <code>WHERE</code> testa cada linha: 17 &gt;= 10 sim, 9 &gt;= 10 não, ... A verde as que passam, riscadas as que ficam de fora (o Rui e o Pedro).` },
      { l: 1, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: pick(ALUNOS, rowsWhere(ALUNOS, positiva), ['nome', 'nota']) }, n: H`Só no fim o <code>SELECT</code> escolhe as colunas, e só das 6 linhas que passaram.` },
    ],
  }, {
    title: 'Duas condições com AND',
    db: { alunos: ALUNOS },
    code: C`
SELECT nome, curso, ano
FROM alunos
WHERE curso = 'LEI' AND ano = 1;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 3, g: { label: "WHERE curso = 'LEI' AND ano = 1", cols: ALL, rows: ALUNOS.rows, marks: marksWhere(ALUNOS, leiPrimeiro) }, n: H`Com <code>AND</code> têm de ser verdade as duas. O Tiago é de LEI mas está no 2.º ano, por isso fica de fora. A Marta está no 1.º ano mas é de LEM.` },
      { l: 1, g: { label: 'SELECT nome, curso, ano', cols: ['nome', 'curso', 'ano'], rows: pick(ALUNOS, rowsWhere(ALUNOS, leiPrimeiro), ['nome', 'curso', 'ano']) }, n: 'Ficam três alunos: os de LEI do 1.º ano.' },
    ],
  }],
  mistakes: [
    H`Escrever o texto sem plicas: <code>WHERE curso = LEI</code> dá <em>no such column: LEI</em>.`,
    H`Escrever <code>WHERE 'curso' = 'LEI'</code>: com plicas, <code>'curso'</code> é texto e não a coluna, e o texto "curso" nunca é igual a "LEI". Não dá erro, mas o resultado vem vazio.`,
    H`Confundir <code>AND</code> com <code>OR</code>. "Alunos de LEI e de LEM" é <code>curso = 'LEI' OR curso = 'LEM'</code> (ou <code>IN</code>): nenhum aluno é dos dois cursos ao mesmo tempo.`,
    H`Escrever <code>WHERE nota &gt;= 10 AND &lt;= 14</code>. Cada lado do AND é uma condição completa: <code>nota &gt;= 10 AND nota &lt;= 14</code>, ou <code>BETWEEN 10 AND 14</code>.`,
    H`Esquecer que o <code>BETWEEN</code> inclui os extremos.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE nota > 15;`, opts: [res(['nome'], [['Ana'], ['Marta']]), res(['nome'], [['Ana'], ['Marta'], ['Sofia']]), res(['nome'], [['Marta']]), res(['nome'], [['Marta'], ['Ana']])], ok: 0, mono: true, check: true,
      exp: H`Só passam as notas maiores do que 15: 17 (Ana) e 18 (Marta). A Sofia tem 15, e 15 &gt; 15 é falso. As linhas aparecem pela ordem da tabela, porque não pedimos outra.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE curso = 'LEE' OR nota < 10;`, opts: [res(['nome'], [['Pedro']]), res(['nome'], [['Rui'], ['Ines'], ['Pedro']]), res(['nome'], [['Ines'], ['Pedro'], ['Rui']]), res(['nome'], [['Rui'], ['Ines'], ['Pedro'], ['Pedro']])], ok: 1, mono: true, check: true,
      exp: H`Com <code>OR</code> basta uma das condições: a Ines é de LEE, o Rui tem 9 e o Pedro cumpre as duas. Cada linha aparece uma só vez, mesmo que cumpra as duas condições. Só o Pedro seria a resposta com <code>AND</code>.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE nota BETWEEN 12 AND 15;`, opts: [res(['nome'], [['Ines']]), res(['nome'], [['Ines'], ['Tiago'], ['Sofia']]), res(['nome'], [['Tiago'], ['Ines'], ['Sofia']]), res(['nome'], [['Ines'], ['Sofia']])], ok: 1, mono: true, check: true,
      exp: H`O <code>BETWEEN</code> inclui os extremos: 14 (Ines), 12 (Tiago) e 15 (Sofia) passam. Saem pela ordem da tabela, não por nota.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE nome LIKE '%a';`, opts: [res(['nome'], [['Ana']]), res(['nome'], [['Ana'], ['Marta'], ['Sofia']]), res(['nome'], [['Marta'], ['Sofia']]), res(['nome'], [['Ana'], ['Marta'], ['Sofia'], ['Joao']])], ok: 1, mono: true, check: true,
      exp: H`<code>'%a'</code> é "qualquer coisa e depois um a no fim": Ana, Marta e Sofia. <code>'A%'</code> seria "começa por A".` },
    { q: 'Como escreves "o curso é LEI"?', opts: ["WHERE curso = 'LEI'", 'WHERE curso = LEI', "WHERE 'curso' = 'LEI'", 'WHERE curso = "LEI"'], ok: 0, mono: true,
      exp: H`A coluna escreve-se sem nada e o texto entre plicas. Sem plicas, LEI seria uma coluna. Com plicas em <code>'curso'</code>, compara dois textos que nunca são iguais. E as aspas, em SQL, são para nomes de colunas.` },
  ],
  exercises: [{
    title: 'Positivas de LEI',
    text: 'Mostra o nome e a nota dos alunos de LEI que tiveram positiva (nota de 10 ou mais).',
    run: out(['nome', 'nota'], pick(ALUNOS, rowsWhere(ALUNOS, a => a.curso === 'LEI' && a.nota >= 10), ['nome', 'nota'])),
    hint: H`Duas condições que têm de ser verdade ao mesmo tempo: junta-as com <code>AND</code>.`,
    solution: C`
SELECT nome, nota
FROM alunos
WHERE curso = 'LEI' AND nota >= 10;`,
  }, {
    title: 'Começa por M ou P',
    text: 'Mostra o número e o nome dos alunos cujo nome começa por M ou por P.',
    run: out(['numero', 'nome'], pick(ALUNOS, rowsWhere(ALUNOS, a => /^[MP]/.test(a.nome)), ['numero', 'nome'])),
    hint: H`<code>nome LIKE 'M%'</code> apanha os que começam por M. Junta outra condição para o P com <code>OR</code>.`,
    solution: C`
SELECT numero, nome
FROM alunos
WHERE nome LIKE 'M%' OR nome LIKE 'P%';`,
  }],
});

// ---------------------------------------------------------------- 3
const porNotaDesc = ALUNOS.rows.slice().sort((a, b) => b[4] - a[4]);
const cursoAno = ALUNOS.rows.map(r => [r[2], r[3]]);
const cursoAnoMarks = cursoAno.map((p, i) => (cursoAno.findIndex(q => q[0] === p[0] && q[1] === p[1]) < i ? 'drop' : 'keep'));
const cursoAnoUnicos = cursoAno.filter((p, i) => cursoAnoMarks[i] === 'keep');
const cursoAnoOrdenados = cursoAnoUnicos.slice().sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);

LESSONS.push({
  id: 3,
  title: 'Ordenar, limitar e tirar repetidos',
  short: 'ORDER BY, ASC e DESC, LIMIT e DISTINCT',
  body: H`
<p>Sem indicação, a ordem das linhas de um resultado <strong>não é garantida</strong>. Se a ordem interessa, pede-a com <code>ORDER BY</code>.</p>
<ul>
<li><code>ORDER BY nota</code> ordena do menor para o maior (<code>ASC</code>, o normal). <code>ORDER BY nota DESC</code> ordena do maior para o menor.</li>
<li>Podes ordenar por várias colunas: <code>ORDER BY curso, nota DESC</code> ordena por curso e, dentro do mesmo curso, pela nota. O <code>DESC</code> só se aplica à coluna onde está.</li>
<li><code>LIMIT 3</code> fica só com as 3 primeiras linhas do resultado (e só faz sentido depois de ordenar).</li>
<li><code>SELECT DISTINCT curso</code> tira as linhas repetidas do resultado.</li>
</ul>
<p>A ordem de trabalho fica assim: <code>FROM</code> → <code>WHERE</code> → <code>SELECT</code> → <code>DISTINCT</code> → <code>ORDER BY</code> → <code>LIMIT</code>.</p>`,
  analogy: H`O <code>ORDER BY</code> é ordenar a pauta antes de a afixar. O <code>LIMIT 3</code> é o pódio: depois de ordenar, ficas só com os três primeiros. O <code>DISTINCT</code> é riscar da lista os nomes repetidos.`,
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Os três melhores',
    db: { alunos: ALUNOS },
    code: C`
SELECT nome, nota
FROM alunos
ORDER BY nota DESC
LIMIT 3;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 1, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: pick(ALUNOS, ALUNOS.rows, ['nome', 'nota']) }, n: 'Escolhe as colunas. Ainda estão pela ordem da tabela.' },
      { l: 3, g: { label: 'ORDER BY nota DESC', cols: ['nome', 'nota'], rows: pick(ALUNOS, porNotaDesc, ['nome', 'nota']) }, n: H`Ordena pela nota, da maior para a menor (<code>DESC</code>).` },
      { l: 4, g: { label: 'LIMIT 3', cols: ['nome', 'nota'], rows: pick(ALUNOS, porNotaDesc, ['nome', 'nota']), marks: porNotaDesc.map((_, i) => (i < 3 ? 'keep' : 'drop')) }, n: H`O <code>LIMIT 3</code> fica com as três primeiras linhas, as outras saem.` },
      { l: 4, g: { label: 'LIMIT 3', cols: ['nome', 'nota'], rows: pick(ALUNOS, porNotaDesc.slice(0, 3), ['nome', 'nota']) }, n: H`O resultado: o pódio. Sem o <code>ORDER BY</code>, o LIMIT dava as três primeiras da tabela, que não são as melhores.` },
    ],
  }, {
    title: 'DISTINCT e ordenar por duas colunas',
    db: { alunos: ALUNOS },
    code: C`
SELECT DISTINCT curso, ano
FROM alunos
ORDER BY curso, ano;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 1, g: { label: 'SELECT curso, ano', cols: ['curso', 'ano'], rows: cursoAno }, n: H`Com só estas duas colunas há linhas repetidas: <code>LEI | 1</code> aparece três vezes.` },
      { l: 1, g: { label: 'DISTINCT', cols: ['curso', 'ano'], rows: cursoAno, marks: cursoAnoMarks }, n: H`O <code>DISTINCT</code> risca as linhas que já apareceram antes. Conta a linha inteira: <code>LEI | 1</code> e <code>LEI | 2</code> são diferentes.` },
      { l: 1, g: { label: 'DISTINCT', cols: ['curso', 'ano'], rows: cursoAnoUnicos }, n: 'Ficam 6 combinações diferentes.' },
      { l: 3, g: { label: 'ORDER BY curso, ano', cols: ['curso', 'ano'], rows: cursoAnoOrdenados }, n: H`Ordena primeiro pelo curso (por ordem alfabética: LEE, LEI, LEM) e, dentro de cada curso, pelo ano.` },
    ],
  }],
  mistakes: [
    H`Contar com uma ordem sem <code>ORDER BY</code>. Pode calhar bem hoje e mudar amanhã.`,
    H`Pôr o <code>ORDER BY</code> antes do <code>WHERE</code>. A ordem das partes é fixa: SELECT, FROM, WHERE, ORDER BY, LIMIT.`,
    H`Achar que <code>ORDER BY curso, nota DESC</code> ordena as duas colunas ao contrário. O <code>DESC</code> só vale para a <code>nota</code>.`,
    H`Usar <code>LIMIT</code> sem <code>ORDER BY</code> para "os melhores": dá as primeiras linhas da tabela, sejam quais forem.`,
    H`Escrever <code>SELECT nome, DISTINCT curso</code>. O <code>DISTINCT</code> vem logo a seguir ao <code>SELECT</code> e vale para a linha toda.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
ORDER BY nota
LIMIT 2;`, opts: [res(['nome'], [['Pedro'], ['Rui']]), res(['nome'], [['Marta'], ['Ana']]), res(['nome'], [['Ana'], ['Rui']]), res(['nome'], [['Rui'], ['Pedro']])], ok: 0, mono: true, check: true,
      exp: H`Sem <code>DESC</code>, a ordem é crescente: as notas mais baixas primeiro, 7 (Pedro) e 9 (Rui). O LIMIT fica com essas duas.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT DISTINCT curso FROM alunos
ORDER BY curso;`, opts: [res(['curso'], [['LEE'], ['LEI'], ['LEM']]), res(['curso'], [['LEE'], ['LEE'], ['LEI'], ['LEI'], ['LEI'], ['LEI'], ['LEM'], ['LEM']]), res(['curso'], [['LEI'], ['LEE'], ['LEM']]), res(['curso'], [['LEM'], ['LEI'], ['LEE']])], ok: 0, mono: true, check: true,
      exp: H`O <code>DISTINCT</code> deixa cada curso uma só vez e o <code>ORDER BY</code> põe-nos por ordem alfabética. Sem DISTINCT apareciam as 8 linhas.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome, ano FROM alunos
WHERE curso = 'LEI'
ORDER BY ano DESC, nome;`, opts: [res(['nome', 'ano'], [['Tiago', 2], ['Sofia', 1], ['Rui', 1], ['Ana', 1]]), res(['nome', 'ano'], [['Tiago', 2], ['Ana', 1], ['Rui', 1], ['Sofia', 1]]), res(['nome', 'ano'], [['Ana', 1], ['Rui', 1], ['Sofia', 1], ['Tiago', 2]]), res(['nome', 'ano'], [['Ana', 1], ['Rui', 1], ['Tiago', 2], ['Sofia', 1]])], ok: 1, mono: true, check: true,
      exp: H`Primeiro pelo ano, do maior para o menor: o Tiago (2.º ano) vem à frente. Entre os do 1.º ano desempata o nome, por ordem crescente, porque o <code>DESC</code> só se aplica ao ano.` },
    { q: 'Numa consulta completa, onde fica o ORDER BY?', opts: ['Logo a seguir ao SELECT', 'Antes do FROM', 'Depois do WHERE e antes do LIMIT', 'Depois do LIMIT'], ok: 2,
      exp: 'A ordem das partes é sempre SELECT, FROM, WHERE, ORDER BY, LIMIT. Faz sentido: primeiro escolhes as linhas, depois ordenas, e só no fim cortas.' },
  ],
  exercises: [{
    title: 'Pauta por curso',
    text: 'Mostra o curso, o nome e a nota de todos os alunos, ordenados por curso e, dentro de cada curso, da maior para a menor nota.',
    run: out(['curso', 'nome', 'nota'], pick(ALUNOS, ALUNOS.rows.slice().sort((a, b) => a[2].localeCompare(b[2]) || b[4] - a[4]), ['curso', 'nome', 'nota'])),
    hint: H`Duas colunas no <code>ORDER BY</code>, e o <code>DESC</code> só na segunda.`,
    solution: C`
SELECT curso, nome, nota
FROM alunos
ORDER BY curso, nota DESC;`,
  }, {
    title: 'A nota mais baixa',
    text: 'Mostra o nome e a nota do aluno com a nota mais baixa, usando só ORDER BY e LIMIT.',
    run: out(['nome', 'nota'], [['Pedro', 7]]),
    hint: 'Ordena da menor para a maior nota e fica só com a primeira linha.',
    solution: C`
SELECT nome, nota
FROM alunos
ORDER BY nota
LIMIT 1;`,
  }],
});
