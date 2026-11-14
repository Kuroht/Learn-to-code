// ===== SQL do Zero — conteúdo das lições (parte 2) =====
// Usa os ajudantes e a tabela ALUNOS definidos em lessons1.js.

// ---------------------------------------------------------------- 4
const comBonus = ALUNOS.rows.map(r => (r[4] === 9 ? [r[0], r[1], r[2], r[3], 10] : r));
const naoApagados = ALUNOS.rows.filter(r => r[4] >= 10);

LESSONS.push({
  id: 4,
  title: 'Mudar e apagar: UPDATE e DELETE',
  short: 'SET, o WHERE que não se pode esquecer, e testar antes',
  body: H`
<p>O <code>UPDATE</code> muda valores de linhas que já existem e o <code>DELETE</code> apaga linhas. Os dois usam um <code>WHERE</code> para escolher <strong>que linhas</strong> são afetadas, exatamente como no SELECT.</p>
<pre class="snip"><code>UPDATE alunos
SET nota = nota + 1
WHERE numero = 102;

DELETE FROM alunos
WHERE nota &lt; 10;</code></pre>
<ul>
<li>No <code>SET</code>, o lado direito pode usar o valor atual: <code>nota = nota + 1</code> funciona como <code>x = x + 1</code> em C. Para mudar várias colunas, separa-as com vírgulas: <code>SET curso = 'LEI', ano = 2</code>.</li>
<li><strong>Sem WHERE, o UPDATE muda todas as linhas e o DELETE apaga todas as linhas.</strong> Não há "desfazer".</li>
<li>Um truque seguro: escreve primeiro <code>SELECT * FROM alunos WHERE ...</code> com o mesmo WHERE, confirma que aparecem as linhas certas, e só depois troca o SELECT por UPDATE ou DELETE.</li>
<li><code>DELETE FROM alunos;</code> esvazia a tabela, mas ela continua a existir. Para apagar a própria tabela é <code>DROP TABLE alunos;</code>.</li>
</ul>`,
  analogy: H`O <code>UPDATE</code> é um corretor com caneta: vai às linhas que o <code>WHERE</code> indica, risca o valor antigo e escreve o novo. Se ninguém lhe disser que linhas são, corrige a pauta inteira.`,
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Mudar notas, com e sem WHERE',
    db: { alunos: ALUNOS },
    code: C`
UPDATE alunos
SET nota = nota + 1
WHERE nota = 9;
UPDATE alunos
SET ano = ano + 1;`,
    steps: [
      { l: 1, n: H`<code>UPDATE alunos</code>: vamos mudar linhas da tabela alunos. Ainda não se sabe quais.` },
      { l: 3, tm: { alunos: { 1: 'hit' } }, n: H`O <code>WHERE</code> escolhe as linhas, como num SELECT: só o Rui tem nota 9.` },
      { l: 2, upd: { alunos: { 1: { nota: 10 } } }, n: H`O <code>SET</code> calcula <code>nota + 1</code> com o valor atual (9 + 1) e guarda 10. As outras linhas não mudam.` },
      { l: 4, n: 'Outro UPDATE, também na tabela alunos.' },
      { l: 5, upd: { alunos: Object.fromEntries(comBonus.map((r, i) => [i, { ano: r[3] + 1 }])) }, n: H`Este não tem WHERE, por isso <strong>todas</strong> as linhas mudam: toda a gente subiu um ano. Se fosse um engano, não havia forma de desfazer.` },
    ],
  }, {
    title: 'Apagar quem reprovou',
    db: { alunos: ALUNOS },
    code: C`
DELETE FROM alunos
WHERE nota < 10;
SELECT nome, nota
FROM alunos;`,
    steps: [
      { l: 2, tm: { alunos: { 1: 'drop', 5: 'drop' } }, n: H`O <code>WHERE</code> encontra as linhas a apagar: o Rui (9) e o Pedro (7).` },
      { l: 1, del: { alunos: [1, 5] }, n: H`O <code>DELETE</code> apaga essas duas linhas. A tabela passa a ter 6.` },
      { l: 4, g: { label: 'FROM alunos', cols: ALL, rows: naoApagados }, n: 'Agora um SELECT: a tabela já não tem as linhas apagadas.' },
      { l: 3, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: pick(ALUNOS, naoApagados, ['nome', 'nota']) }, n: 'Ficaram 6 alunos, todos com positiva.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>WHERE</code> num UPDATE ou DELETE: muda ou apaga a tabela toda.`,
    H`Escrever <code>UPDATE alunos SET nota = 18 AND curso = 'LEI'</code>. Para mudar duas colunas usa-se vírgula: <code>SET nota = 18, curso = 'LEI'</code>.`,
    H`Escrever <code>DELETE nome FROM alunos</code>. O DELETE apaga linhas inteiras; para limpar só um valor faz-se <code>UPDATE ... SET nome = NULL</code>.`,
    H`Confundir <code>DELETE FROM alunos</code> (esvazia a tabela) com <code>DROP TABLE alunos</code> (apaga a tabela).`,
    H`Escolher a linha por um valor que se repete (<code>WHERE nome = 'Ana'</code>) quando havia duas Anas. Para mexer numa só linha, usa a chave primária.`,
  ],
  quiz: [
    { q: 'Que resultado dá este script?', code: C`
UPDATE alunos SET nota = 20 WHERE nome = 'Ana';
SELECT nome, nota FROM alunos WHERE nota >= 17;`, opts: [res(['nome', 'nota'], [['Ana', 17], ['Marta', 18]]), res(['nome', 'nota'], [['Ana', 20], ['Marta', 18]]), res(['nome', 'nota'], [['Marta', 18]]), res(['nome', 'nota'], [['Ana', 20]])], ok: 1, mono: true, check: true,
      exp: 'O UPDATE muda a nota da Ana para 20 antes do SELECT correr. Depois, a Ana (20) e a Marta (18) têm nota de 17 ou mais.' },
    { q: 'Que resultado dá este script?', code: C`
UPDATE alunos SET nota = nota + 2;
SELECT nome, nota FROM alunos WHERE nota < 10;`, opts: [res(['nome', 'nota'], [['Rui', 9], ['Pedro', 7]]), res(['nome', 'nota'], [['Rui', 11], ['Pedro', 9]]), res(['nome', 'nota'], [['Pedro', 9]]), res(['nome', 'nota'], [['Pedro', 7]])], ok: 2, mono: true, check: true,
      exp: 'Sem WHERE, todas as notas sobem 2. O Rui passa de 9 a 11 e deixa de ter negativa; o Pedro passa de 7 a 9.' },
    { q: 'Que resultado dá este script?', code: C`
DELETE FROM alunos WHERE curso = 'LEI';
SELECT nome FROM alunos WHERE ano = 1;`, opts: [res(['nome'], [['Marta'], ['Pedro']]), res(['nome'], [['Ana'], ['Rui'], ['Marta'], ['Pedro'], ['Sofia']]), res(['nome'], [['Ana'], ['Rui'], ['Sofia']]), res(['nome'], [['Pedro'], ['Marta']])], ok: 0, mono: true, check: true,
      exp: 'O DELETE apaga os 4 alunos de LEI. Dos que ficam (Ines, Marta, Pedro, Joao), só a Marta e o Pedro estão no 1.º ano.' },
    { q: 'O que faz DELETE FROM alunos; (sem WHERE)?', opts: ['Apaga a tabela, incluindo as colunas', 'Apaga todas as linhas, mas a tabela continua a existir', 'Dá erro, porque falta o WHERE', 'Apaga só a primeira linha'], ok: 1,
      exp: H`Sem WHERE, todas as linhas passam o filtro e são apagadas. A tabela fica vazia, mas existe: ainda podes fazer INSERT. Quem apaga a tabela é o <code>DROP TABLE</code>.` },
  ],
  exercises: [{
    title: 'Passar de ano',
    text: 'Os alunos de LEE do 1.º ano passam para o 2.º ano. Faz o UPDATE e depois mostra o número, o nome e o ano dos alunos de LEE.',
    run: out(['numero', 'nome', 'ano'], [[103, 'Ines', 2], [106, 'Pedro', 2]]),
    hint: H`O WHERE do UPDATE tem duas condições (curso e ano). O SELECT a seguir só precisa de <code>curso = 'LEE'</code>.`,
    solution: C`
UPDATE alunos
SET ano = 2
WHERE curso = 'LEE' AND ano = 1;
SELECT numero, nome, ano
FROM alunos
WHERE curso = 'LEE';`,
  }, {
    title: 'Ficam os aprovados',
    text: 'Apaga os alunos com nota inferior a 10 e depois mostra os nomes dos que ficaram, por ordem alfabética.',
    run: out(['nome'], naoApagados.map(r => [r[1]]).sort((a, b) => a[0].localeCompare(b[0]))),
    hint: H`Um <code>DELETE ... WHERE nota &lt; 10</code> e depois um SELECT com <code>ORDER BY nome</code>.`,
    solution: C`
DELETE FROM alunos
WHERE nota < 10;
SELECT nome
FROM alunos
ORDER BY nome;`,
  }],
});

// ---------------------------------------------------------------- 5
const ALUNOS_NULL = {
  cols: [['numero', 'INTEGER PRIMARY KEY'], ['nome', 'TEXT NOT NULL'], ['curso', 'TEXT'], ['nota', 'INTEGER'], ['email', 'TEXT']],
  rows: [
    [101, 'Ana', 'LEI', 17, 'ana@exemplo.pt'],
    [102, 'Rui', 'LEI', null, null],
    [103, 'Ines', 'LEE', 14, 'ines@exemplo.pt'],
    [104, 'Tiago', 'LEI', 12, null],
    [105, 'Marta', 'LEM', null, 'marta@exemplo.pt'],
    [106, 'Pedro', 'LEE', 7, 'pedro@exemplo.pt'],
  ],
};
const ALL_N = colsOf(ALUNOS_NULL);
const semNota = a => a.nota === null;

LESSONS.push({
  id: 5,
  title: 'NULL: o valor que falta',
  short: 'IS NULL, porque é que = NULL nunca dá, e COALESCE',
  body: H`
<p><code>NULL</code> quer dizer "não há valor" ou "não se sabe". Não é zero nem texto vazio: o aluno que faltou ao exame não tem nota 0, tem nota <strong>desconhecida</strong>. Em C, uma variável sem valor tinha lixo; em SQL fica explicitamente <code>NULL</code>.</p>
<ul>
<li>Qualquer comparação com NULL dá "desconhecido", que não é verdadeiro. Por isso <code>WHERE nota = NULL</code> <strong>nunca</strong> encontra nada, e <code>WHERE nota &lt; 10</code> deixa de fora quem tem NULL.</li>
<li>Para perguntar se falta o valor usa-se <code>IS NULL</code>, e para o contrário <code>IS NOT NULL</code>.</li>
<li>Contas com NULL dão NULL: <code>NULL + 1</code> é NULL.</li>
<li><code>COALESCE(nota, 0)</code> devolve a nota, ou 0 se ela for NULL. Serve para trocar o NULL por um valor à escolha.</li>
</ul>`,
  analogy: 'NULL é um "?" escrito na pauta. Se perguntares "a nota dele é menor do que 10?", a resposta não é sim nem não: é "não sei". E o WHERE só deixa passar as linhas cuja resposta é sim.',
  db: { alunos: ALUNOS_NULL },
  examples: [{
    title: 'Quem não tem nota',
    db: { alunos: ALUNOS_NULL },
    code: C`
SELECT nome, nota
FROM alunos
WHERE nota = NULL;
SELECT nome, nota
FROM alunos
WHERE nota IS NULL;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL_N, rows: ALUNOS_NULL.rows }, n: 'A tabela tem dois alunos sem nota: o Rui e a Marta.' },
      { l: 3, g: { label: 'WHERE nota = NULL', cols: ALL_N, rows: ALUNOS_NULL.rows, marks: ALUNOS_NULL.rows.map(() => 'drop') }, n: H`<code>17 = NULL</code>? Não se sabe. <code>NULL = NULL</code>? Também não se sabe! Nenhuma linha dá verdadeiro, por isso nenhuma passa.` },
      { l: 1, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: [] }, n: 'Resultado vazio, e sem nenhum erro. É por isso que este engano é tão traiçoeiro.' },
      { l: 5, g: { label: 'FROM alunos', cols: ALL_N, rows: ALUNOS_NULL.rows }, n: 'Agora da forma certa.' },
      { l: 6, g: { label: 'WHERE nota IS NULL', cols: ALL_N, rows: ALUNOS_NULL.rows, marks: marksWhere(ALUNOS_NULL, semNota) }, n: H`<code>IS NULL</code> pergunta mesmo "falta o valor?", e a resposta é sim ou não.` },
      { l: 4, g: { label: 'SELECT nome, nota', cols: ['nome', 'nota'], rows: pick(ALUNOS_NULL, rowsWhere(ALUNOS_NULL, semNota), ['nome', 'nota']) }, n: 'Aparecem o Rui e a Marta.' },
    ],
  }, {
    title: 'Contas com NULL e COALESCE',
    db: { alunos: ALUNOS_NULL },
    code: C`
SELECT nome,
       nota + 1 AS mais_um,
       COALESCE(nota, 0) AS nota_ou_zero
FROM alunos;`,
    steps: [
      { l: 4, g: { label: 'FROM alunos', cols: ALL_N, rows: ALUNOS_NULL.rows }, n: 'A tabela inteira.' },
      { l: 1, g: { label: 'SELECT nome', cols: ['nome'], rows: pick(ALUNOS_NULL, ALUNOS_NULL.rows, ['nome']) }, n: 'Primeira coluna: o nome.' },
      { l: 2, g: { label: 'nota + 1 AS mais_um', cols: ['nome', 'mais_um'], rows: ALUNOS_NULL.rows.map(r => [r[1], r[3] === null ? null : r[3] + 1]) }, n: H`Uma conta com NULL dá NULL: não se sabe a nota, por isso também não se sabe a nota mais um.` },
      { l: 3, g: { label: 'COALESCE(nota, 0) AS nota_ou_zero', cols: ['nome', 'mais_um', 'nota_ou_zero'], rows: ALUNOS_NULL.rows.map(r => [r[1], r[3] === null ? null : r[3] + 1, r[3] === null ? 0 : r[3]]) }, n: H`<code>COALESCE</code> devolve o primeiro valor que não é NULL: a nota, se existir, senão 0.` },
    ],
  }],
  mistakes: [
    H`Escrever <code>WHERE nota = NULL</code>. Não dá erro, mas nunca encontra nada. É <code>IS NULL</code>.`,
    H`Achar que NULL é 0 ou <code>''</code>. "Não tem email" e "o email é texto vazio" são coisas diferentes.`,
    H`Esquecer os NULL num filtro: <code>WHERE nota &lt; 10</code> não apanha os alunos sem nota. Se também os queres, junta <code>OR nota IS NULL</code>.`,
    H`Fazer contas com colunas que podem ser NULL e estranhar o resultado vazio. Usa <code>COALESCE</code> se fizer sentido trocar o NULL por um valor.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE nota < 10;`, opts: [res(['nome'], [['Pedro']]), res(['nome'], [['Rui'], ['Marta'], ['Pedro']]), res(['nome'], [['Rui'], ['Pedro']]), res(['nome'], [['Pedro'], ['Rui'], ['Marta']])], ok: 0, mono: true, check: true,
      exp: H`<code>NULL &lt; 10</code> dá "desconhecido", e só passam as linhas com verdadeiro. Por isso o Rui e a Marta ficam de fora: só o Pedro (7) passa.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nome FROM alunos
WHERE email IS NOT NULL AND nota IS NULL;`, opts: [res(['nome'], [['Marta']]), res(['nome'], [['Rui']]), res(['nome'], [['Rui'], ['Marta']]), res(['nome'], [['Ana'], ['Ines'], ['Marta'], ['Pedro']])], ok: 0, mono: true, check: true,
      exp: 'Tem de ter email e não ter nota. O Rui não tem nenhum dos dois; a Marta tem email mas não tem nota.' },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT nota * 2 AS dobro FROM alunos
WHERE curso = 'LEI';`, opts: [res(['dobro'], [[34], [0], [24]]), res(['dobro'], [[34], [24]]), res(['dobro'], [[34], [null], [24]]), res(['dobro'], [[17], [null], [12]])], ok: 2, mono: true, check: true,
      exp: H`Há três alunos de LEI, por isso há três linhas. O Rui não tem nota, e <code>NULL * 2</code> é NULL: a linha aparece, mas com NULL.` },
    { q: 'Como escolhes os alunos sem email?', opts: ['WHERE email = NULL', 'WHERE email IS NULL', "WHERE email = ''", 'WHERE email = 0'], ok: 1, mono: true,
      exp: H`Para NULL usa-se sempre <code>IS NULL</code>. <code>= NULL</code> nunca é verdadeiro, e <code>''</code> (texto vazio) ou 0 são valores, não falta de valor.` },
  ],
  exercises: [{
    title: 'Quem tem email',
    text: 'Mostra o nome e o email dos alunos que têm email, por ordem alfabética do nome.',
    run: out(['nome', 'email'], pick(ALUNOS_NULL, rowsWhere(ALUNOS_NULL, a => a.email !== null), ['nome', 'email']).sort((a, b) => a[0].localeCompare(b[0]))),
    hint: H`<code>IS NOT NULL</code> no WHERE e <code>ORDER BY nome</code> no fim.`,
    solution: C`
SELECT nome, email
FROM alunos
WHERE email IS NOT NULL
ORDER BY nome;`,
  }, {
    title: 'Faltou',
    text: 'Mostra o nome e a nota de cada aluno, mas com o texto falta no lugar da nota quando ela é NULL. A segunda coluna deve chamar-se nota.',
    run: out(['nome', 'nota'], ALUNOS_NULL.rows.map(r => [r[1], r[3] === null ? 'falta' : r[3]])),
    hint: H`<code>COALESCE(nota, 'falta')</code> devolve a nota ou, se for NULL, o texto. Dá-lhe o nome com <code>AS nota</code>.`,
    solution: C`
SELECT nome, COALESCE(nota, 'falta') AS nota
FROM alunos;`,
  }],
});

// ---------------------------------------------------------------- 6
const lei = rowsWhere(ALUNOS, a => a.curso === 'LEI');

LESSONS.push({
  id: 6,
  title: 'Contar, somar e fazer médias',
  short: 'COUNT, SUM, AVG, MIN e MAX',
  body: H`
<p>As <strong>funções de agregação</strong> recebem uma coluna de muitas linhas e devolvem um só valor. Em C fazias isto com um ciclo e um acumulador; em SQL é uma função.</p>
<table class="t">
<thead><tr><th>Função</th><th>Dá</th></tr></thead>
<tbody>
<tr><td><code>COUNT(*)</code></td><td>quantas linhas há</td></tr>
<tr><td><code>COUNT(nota)</code></td><td>quantas linhas têm nota (não conta os NULL)</td></tr>
<tr><td><code>SUM(nota)</code></td><td>a soma</td></tr>
<tr><td><code>AVG(nota)</code></td><td>a média (sempre um número real)</td></tr>
<tr><td><code>MIN(nota)</code>, <code>MAX(nota)</code></td><td>o menor e o maior</td></tr>
</tbody>
</table>
<ul>
<li>As funções trabalham sobre as linhas que passaram o <code>WHERE</code>. O resultado tem <strong>uma só linha</strong>.</li>
<li>Todas, menos <code>COUNT(*)</code>, ignoram os NULL.</li>
<li>Não podes usá-las no WHERE (<code>WHERE AVG(nota) &gt; 12</code> dá erro). Isso fica para o <code>HAVING</code>, na lição seguinte.</li>
<li><code>ROUND(AVG(nota), 2)</code> arredonda a 2 casas decimais.</li>
</ul>`,
  analogy: 'Agregar é espremer uma coluna inteira num só número. O professor olha para a pauta toda e anuncia apenas "a média foi 12,9" ou "houve 6 positivas".',
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Resumo de LEI numa só linha',
    db: { alunos: ALUNOS },
    code: C`
SELECT COUNT(*) AS alunos,
       MAX(nota) AS melhor,
       ROUND(AVG(nota), 2) AS media
FROM alunos
WHERE curso = 'LEI';`,
    steps: [
      { l: 4, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 5, g: { label: "WHERE curso = 'LEI'", cols: ALL, rows: ALUNOS.rows, marks: marksWhere(ALUNOS, a => a.curso === 'LEI') }, n: 'Primeiro o WHERE: ficam os 4 alunos de LEI. As funções só vão ver estas linhas.' },
      { l: 5, g: { label: 'as linhas de LEI', cols: ALL, rows: lei }, n: 'Notas de LEI: 17, 9, 12 e 15.' },
      { l: 1, g: { label: 'COUNT(*)', cols: ['alunos'], rows: [[4]] }, n: H`<code>COUNT(*)</code> conta as linhas: 4. As 4 linhas espremem-se numa só.` },
      { l: 2, g: { label: 'MAX(nota)', cols: ['alunos', 'melhor'], rows: [[4, 17]] }, n: 'A maior nota: 17.' },
      { l: 3, g: { label: 'ROUND(AVG(nota), 2)', cols: ['alunos', 'melhor', 'media'], rows: [[4, 17, 13.25]] }, n: '(17 + 9 + 12 + 15) / 4 = 53 / 4 = 13.25. Já tem 2 casas, por isso o ROUND não muda nada.' },
    ],
  }, {
    title: 'A armadilha da divisão (outra vez)',
    db: { alunos: ALUNOS },
    code: C`
SELECT SUM(nota) AS soma,
       COUNT(*) AS n,
       SUM(nota) / COUNT(*) AS media_errada,
       AVG(nota) AS media
FROM alunos;`,
    steps: [
      { l: 5, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'Todas as linhas: não há WHERE.' },
      { l: 1, g: { label: 'SUM(nota)', cols: ['soma'], rows: [[103]] }, n: '17 + 9 + 14 + 12 + 18 + 7 + 15 + 11 = 103.' },
      { l: 2, g: { label: 'COUNT(*)', cols: ['soma', 'n'], rows: [[103, 8]] }, n: '8 alunos.' },
      { l: 3, g: { label: 'SUM(nota) / COUNT(*)', cols: ['soma', 'n', 'media_errada'], rows: [[103, 8, 12]] }, n: H`103 / 8 com dois inteiros dá divisão inteira, tal como em C: 12, e não 12.875.` },
      { l: 4, g: { label: 'AVG(nota)', cols: ['soma', 'n', 'media_errada', 'media'], rows: [[103, 8, 12, 12.875]] }, n: H`O <code>AVG</code> faz a conta com reais e dá a média certa.` },
    ],
  }],
  mistakes: [
    H`Usar uma função no WHERE: <em>misuse of aggregate function COUNT()</em>. Filtrar por agregados é no <code>HAVING</code>.`,
    H`Fazer <code>SUM(x) / COUNT(*)</code> com inteiros e ter divisão inteira. Usa <code>AVG(x)</code>.`,
    H`Achar que <code>COUNT(nota)</code> e <code>COUNT(*)</code> dão sempre o mesmo. Se houver notas NULL, o primeiro dá menos.`,
    H`Juntar colunas normais com funções sem GROUP BY: <code>SELECT nome, MAX(nota)</code>. O SQLite aceita, mas outros SGBD (MySQL, PostgreSQL) dão erro, e o resultado raramente é o que queres.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT COUNT(*) AS n FROM alunos
WHERE nota >= 10;`, opts: [res(['n'], [[6]]), res(['n'], [[8]]), res(['n'], [[2]]), res(['n'], [[5]])], ok: 0, mono: true, check: true,
      exp: 'O COUNT conta as linhas que passaram o WHERE: 17, 14, 12, 18, 15 e 11 são 6 positivas.' },
    { q: 'Com a tabela da lição 5 (alguns alunos sem nota), que resultado dá esta consulta?', db: { alunos: ALUNOS_NULL }, code: C`
SELECT COUNT(*) AS a, COUNT(nota) AS b
FROM alunos;`, opts: [res(['a', 'b'], [[6, 4]]), res(['a', 'b'], [[6, 6]]), res(['a', 'b'], [[4, 4]]), res(['a', 'b'], [[4, 6]])], ok: 0, mono: true, check: true,
      exp: H`<code>COUNT(*)</code> conta as 6 linhas. <code>COUNT(nota)</code> só conta as que têm nota, e o Rui e a Marta não têm: 4.` },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT MIN(nota) AS pior, MAX(nota) AS melhor
FROM alunos WHERE curso = 'LEM';`, opts: [res(['pior', 'melhor'], [[11, 18]]), res(['pior', 'melhor'], [[18, 11]]), res(['pior', 'melhor'], [[7, 18]]), res(['pior', 'melhor'], [[11, 11]])], ok: 0, mono: true, check: true,
      exp: 'Em LEM só há a Marta (18) e o Joao (11). O 7 é a pior nota de todos, mas o WHERE já o tinha deixado de fora.' },
    { q: 'Com a tabela da lição 5 (alguns alunos sem nota), que resultado dá esta consulta?', db: { alunos: ALUNOS_NULL }, code: C`SELECT AVG(nota) AS media FROM alunos;`,
      opts: [res(['media'], [['12.5']]), res(['media'], [['8.33333333333333']]), res(['media'], [[12]]), res(['media'], [[null]])], ok: 0, mono: true, check: true,
      exp: H`O AVG ignora os NULL: (17 + 14 + 12 + 7) / 4 = 12.5. Se os NULL contassem como 0, dividia por 6 e dava 8.33.` },
  ],
  exercises: [{
    title: 'Primeiro ano',
    text: 'Mostra quantos alunos há no 1.º ano (coluna n) e a média das notas deles arredondada a uma casa decimal (coluna media).',
    run: out(['n', 'media'], [[5, '13.2']]),
    hint: H`<code>WHERE ano = 1</code>, e no SELECT <code>COUNT(*)</code> e <code>ROUND(AVG(nota), 1)</code>.`,
    solution: C`
SELECT COUNT(*) AS n, ROUND(AVG(nota), 1) AS media
FROM alunos
WHERE ano = 1;`,
  }, {
    title: 'Amplitude',
    text: 'Mostra a melhor nota, a pior e a diferença entre as duas, nas colunas melhor, pior e amplitude.',
    run: out(['melhor', 'pior', 'amplitude'], [[18, 7, 11]]),
    hint: H`Podes fazer contas com os resultados das funções: <code>MAX(nota) - MIN(nota)</code>.`,
    solution: C`
SELECT MAX(nota) AS melhor,
       MIN(nota) AS pior,
       MAX(nota) - MIN(nota) AS amplitude
FROM alunos;`,
  }],
});

// ---------------------------------------------------------------- 7
// Os alunos arrumados por curso (LEE, LEI, LEM), como o GROUP BY os junta.
const porCurso = ['LEE', 'LEI', 'LEM'].flatMap(c => ALUNOS.rows.filter(r => r[2] === c));
const positivos = rowsWhere(ALUNOS, positiva);
const positivosPorCurso = ['LEE', 'LEI', 'LEM'].flatMap(c => positivos.filter(r => r[2] === c));

LESSONS.push({
  id: 7,
  title: 'Agrupar: GROUP BY e HAVING',
  short: 'uma linha por grupo, e o WHERE contra o HAVING',
  body: H`
<p>Na lição anterior, as funções davam um só valor para a tabela toda. Com <code>GROUP BY curso</code>, as linhas juntam-se em <strong>grupos</strong> (uma por cada curso diferente) e as funções são calculadas <strong>para cada grupo</strong>. O resultado tem uma linha por grupo.</p>
<pre class="snip"><code>SELECT curso, COUNT(*) AS n, AVG(nota) AS media
FROM alunos
GROUP BY curso;</code></pre>
<ul>
<li>No SELECT só deves pôr as colunas do <code>GROUP BY</code> e funções de agregação. Pôr outra coluna (como <code>nome</code>) não faz sentido: qual dos nomes do grupo havia de aparecer?</li>
<li><code>WHERE</code> filtra <strong>linhas</strong>, antes de agrupar. <code>HAVING</code> filtra <strong>grupos</strong>, depois de agrupar, e por isso já pode usar funções: <code>HAVING COUNT(*) &gt;= 2</code>.</li>
<li>Se a ordem dos grupos interessa, junta <code>ORDER BY</code>.</li>
</ul>
<p>A ordem de trabalho completa: <code>FROM</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → <code>SELECT</code> → <code>ORDER BY</code> → <code>LIMIT</code>.</p>`,
  analogy: H`O <code>GROUP BY</code> é separar os testes em montes, um por curso, e depois contar ou fazer a média de cada monte. O <code>WHERE</code> tira testes antes de fazer os montes; o <code>HAVING</code> deita fora montes inteiros depois de feitos.`,
  db: { alunos: ALUNOS },
  examples: [{
    title: 'Quantos alunos e que média, por curso',
    db: { alunos: ALUNOS },
    code: C`
SELECT curso, COUNT(*) AS n, AVG(nota) AS media
FROM alunos
GROUP BY curso;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 3, g: { label: 'GROUP BY curso', cols: ALL, rows: porCurso, groups: [2, 4, 2] }, n: H`O <code>GROUP BY</code> junta as linhas com o mesmo curso. Ficam 3 grupos: LEE (2 alunos), LEI (4) e LEM (2). As cores alternadas mostram onde começa cada grupo.` },
      { l: 1, g: { label: 'SELECT curso, COUNT(*), AVG(nota)', cols: ['curso', 'n', 'media'], rows: [['LEE', 2, 10.5], ['LEI', 4, 13.25], ['LEM', 2, 14.5]] }, n: 'Cada grupo dá uma linha. LEE: (14 + 7) / 2 = 10.5. LEI: 53 / 4 = 13.25. LEM: (18 + 11) / 2 = 14.5.' },
    ],
  }, {
    title: 'WHERE antes, HAVING depois',
    db: { alunos: ALUNOS },
    code: C`
SELECT curso, COUNT(*) AS positivas
FROM alunos
WHERE nota >= 10
GROUP BY curso
HAVING COUNT(*) >= 2
ORDER BY positivas;`,
    steps: [
      { l: 2, g: { label: 'FROM alunos', cols: ALL, rows: ALUNOS.rows }, n: 'A tabela inteira.' },
      { l: 3, g: { label: 'WHERE nota >= 10', cols: ALL, rows: ALUNOS.rows, marks: marksWhere(ALUNOS, positiva) }, n: H`O <code>WHERE</code> trabalha linha a linha, antes de haver grupos: saem o Rui e o Pedro.` },
      { l: 4, g: { label: 'GROUP BY curso', cols: ALL, rows: positivosPorCurso, groups: [1, 3, 2] }, n: 'Com as 6 linhas que ficaram: LEE tem 1, LEI tem 3, LEM tem 2.' },
      { l: 5, g: { label: 'HAVING COUNT(*) >= 2', cols: ALL, rows: positivosPorCurso, groups: [1, 3, 2], marks: positivosPorCurso.map(r => (r[2] === 'LEE' ? 'drop' : 'keep')) }, n: H`O <code>HAVING</code> testa cada <strong>grupo</strong>: LEE só tem 1 linha, por isso o grupo inteiro sai.` },
      { l: 1, g: { label: 'SELECT curso, COUNT(*) AS positivas', cols: ['curso', 'positivas'], rows: [['LEI', 3], ['LEM', 2]] }, n: 'Uma linha por cada grupo que sobrou.' },
      { l: 6, g: { label: 'ORDER BY positivas', cols: ['curso', 'positivas'], rows: [['LEM', 2], ['LEI', 3]] }, n: H`Ordena pela coluna <code>positivas</code>, do menor para o maior. O ORDER BY já pode usar o nome dado com AS, porque vem depois do SELECT.` },
    ],
  }],
  mistakes: [
    H`Usar <code>WHERE COUNT(*) &gt; 2</code>. As funções vão no <code>HAVING</code>; o SQLite diz <em>misuse of aggregate function COUNT()</em>.`,
    H`Usar <code>HAVING</code> sem <code>GROUP BY</code> para filtrar linhas normais: <em>HAVING clause on a non-aggregate query</em>. Para linhas é o WHERE.`,
    H`Pôr no SELECT uma coluna que não está no GROUP BY (<code>SELECT curso, nome, COUNT(*)</code>). O SQLite escolhe um nome qualquer do grupo; outros SGBD dão erro.`,
    H`Escrever <code>GROUP BY</code> depois do <code>ORDER BY</code>. A ordem é WHERE, GROUP BY, HAVING, ORDER BY.`,
  ],
  quiz: [
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT ano, COUNT(*) AS n
FROM alunos
GROUP BY ano;`, opts: [res(['ano', 'n'], [[1, 5], [2, 3]]), res(['ano', 'n'], [[1, 8], [2, 8]]), res(['n'], [[5], [3]]), res(['ano', 'n'], [[1, 1], [2, 1]])], ok: 0, mono: true, check: true,
      exp: 'Há dois anos diferentes, logo dois grupos: 5 alunos no 1.º ano e 3 no 2.º.' },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT curso, MAX(nota) AS m
FROM alunos
GROUP BY curso
HAVING MAX(nota) > 15;`, opts: [res(['curso', 'm'], [['LEM', 18]]), res(['curso', 'm'], [['LEI', 17], ['LEM', 18]]), res(['curso', 'm'], [['LEE', 14], ['LEI', 17], ['LEM', 18]]), res(['curso', 'm'], [['LEI', 17], ['LEI', 15], ['LEM', 18]])], ok: 1, mono: true, check: true,
      exp: 'As melhores notas por curso são LEE 14, LEI 17 e LEM 18. O HAVING deixa os grupos com mais de 15: LEI e LEM. Cada grupo dá uma linha só.' },
    { q: 'Que resultado dá esta consulta?', code: C`
SELECT curso, COUNT(*) AS n
FROM alunos
WHERE ano = 2
GROUP BY curso;`, opts: [res(['curso', 'n'], [['LEE', 2], ['LEI', 4], ['LEM', 2]]), res(['curso', 'n'], [['LEE', 1], ['LEI', 1], ['LEM', 1]]), res(['curso', 'n'], [['LEI', 1]]), res(['n'], [[3]])], ok: 1, mono: true, check: true,
      exp: 'O WHERE corre primeiro e deixa só os 3 alunos do 2.º ano (Ines, Tiago, Joao), um de cada curso. Depois agrupa-os: cada curso tem 1.' },
    { q: 'Queres os cursos com média acima de 12. Onde fica a condição AVG(nota) > 12?', opts: ['No WHERE', 'No HAVING', 'No SELECT', 'No ORDER BY'], ok: 1,
      exp: H`A média só existe depois de agrupar, e o WHERE corre antes disso. Condições sobre grupos vão no <code>HAVING</code>.` },
  ],
  exercises: [{
    title: 'Ranking de cursos',
    text: 'Para cada curso, mostra a melhor nota (melhor) e a média (media), começando pelo curso com a maior média.',
    run: out(['curso', 'melhor', 'media'], [['LEM', 18, 14.5], ['LEI', 17, 13.25], ['LEE', 14, 10.5]]),
    hint: H`<code>GROUP BY curso</code>, e no fim <code>ORDER BY media DESC</code>.`,
    solution: C`
SELECT curso, MAX(nota) AS melhor, AVG(nota) AS media
FROM alunos
GROUP BY curso
ORDER BY media DESC;`,
  }, {
    title: 'Anos cheios',
    text: 'Mostra os anos que têm mais de 3 alunos, e quantos alunos tem cada um (coluna n).',
    run: out(['ano', 'n'], [[1, 5]]),
    hint: H`Agrupa por ano e filtra os grupos com <code>HAVING COUNT(*) &gt; 3</code>.`,
    solution: C`
SELECT ano, COUNT(*) AS n
FROM alunos
GROUP BY ano
HAVING COUNT(*) > 3;`,
  }],
});
