// ===== JavaScript do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Arrays',
  short: 'índices, length, push, pop, includes, e duas variáveis para o mesmo array',
  body: H`
<p>Um array é uma lista que cresce: <code>const notas = [12, 17, 9];</code>. Parece a lista do Python e funciona como o array do C# (vive no heap e a variável guarda uma referência).</p>
<ul>
<li>Os índices começam em 0. <code>notas.length</code> dá o tamanho, e o último é <code>notas[notas.length - 1]</code>. <strong>Não há índices negativos</strong>: <code>notas[-1]</code> dá <code>undefined</code>.</li>
<li>Um índice fora dos limites também dá <code>undefined</code>, sem erro.</li>
<li><code>push</code> acrescenta no fim, <code>pop</code> tira o último, <code>includes</code> diz se um valor existe, <code>indexOf</code> dá a posição (ou -1).</li>
<li>Um array numa <code>const</code> pode mudar por dentro: o <code>const</code> só impede que a variável aponte para outro array.</li>
<li><code>const b = a</code> não copia: as duas variáveis apontam para o mesmo array. Para copiar: <code>const c = [...a];</code> (os três pontos "espalham" os elementos num array novo).</li>
</ul>`,
  analogy: 'O array é uma estante com prateleiras numeradas a partir do 0. A variável é a etiqueta com a morada da estante: b = a dá-te outra etiqueta para a mesma estante, não outra estante.',
  examples: [{
    title: 'Mexer num array',
    code: J`
const notas = [12, 17, 9];
notas.push(15);
notas[2] = 10;
console.log(notas, notas.length);
console.log(notas[0], notas[notas.length - 1]);
const ultima = notas.pop();
console.log(ultima, notas.includes(17), notas.indexOf(99));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Array', ['12', '17', '9']] }, d: { global: { notas: ['Array', '@o1'] } }, n: 'O array vive no heap; a variável guarda a referência.' },
      { l: 2, obj: { o1: ['Array', ['12', '17', '9', '15']] }, n: H`<code>push</code> acrescenta no fim. O array é <code>const</code>, mas pode mudar por dentro.` },
      { l: 3, obj: { o1: ['Array', ['12', '17', '10', '15']] }, n: 'Muda o elemento de índice 2.' },
      { l: 4, o: '[ 12, 17, 10, 15 ] 4\n', n: H`O Node mostra o array com espaços dentro dos parênteses retos. <code>length</code> é 4.` },
      { l: 5, o: '12 15\n', n: H`O último é <code>notas[notas.length - 1]</code>: não há <code>notas[-1]</code> como em Python.` },
      { l: 6, obj: { o1: ['Array', ['12', '17', '10']] }, d: { global: { ultima: ['number', '15'] } }, n: H`<code>pop</code> tira o último e devolve-o.` },
      { l: 7, o: '15 true -1\n', n: H`<code>includes</code> dá true ou false; <code>indexOf</code> dá -1 quando não encontra.` },
    ],
  }, {
    title: 'Duas variáveis, um array',
    code: J`
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a);
const c = [...a];
c.push(5);
console.log(a.length, c.length, a === b, a === c);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Array', ['1', '2', '3']] }, d: { global: { a: ['Array', '@o1'] } }, n: 'Um array.' },
      { l: 2, d: { global: { b: ['Array', '@o1'] } }, n: H`<code>b = a</code> copia a referência: as duas apontam para o #1.` },
      { l: 3, obj: { o1: ['Array', ['1', '2', '3', '4']] }, n: H`O push através de <code>b</code> muda o único array.` },
      { l: 4, o: '[ 1, 2, 3, 4 ]\n', n: H`Por isso <code>a</code> também tem o 4.` },
      { l: 5, obj: { o2: ['Array', ['1', '2', '3', '4']] }, d: { global: { c: ['Array', '@o2'] } }, n: H`<code>[...a]</code> cria um array <strong>novo</strong> com os mesmos elementos: uma cópia.` },
      { l: 6, obj: { o2: ['Array', ['1', '2', '3', '4', '5']] }, n: 'Mudar a cópia não mexe no original.' },
      { l: 7, o: '4 5 true false\n', n: H`<code>===</code> entre arrays pergunta se são o mesmo objeto: a e b são, a e c não (mesmo que tivessem os mesmos valores).` },
    ],
  }],
  mistakes: [
    H`Usar <code>v[-1]</code> para o último: dá <code>undefined</code>. É <code>v[v.length - 1]</code> (ou <code>v.at(-1)</code>).`,
    H`Esperar um erro ao sair dos limites: o JavaScript devolve <code>undefined</code> e continua.`,
    H`Achar que <code>const b = a</code> copia o array. Usa <code>[...a]</code>.`,
    H`Comparar arrays com <code>===</code> para ver se têm os mesmos valores: compara referências.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
const v = [3, 6, 9];
console.log(v[1], v[-1], v[5]);`, opts: ['6 9 undefined', '6 undefined undefined', '3 9 undefined', 'TypeError'], ok: 1, mono: true, check: true,
      exp: H`<code>v[1]</code> é 6. Não há índices negativos (dá undefined), e o índice 5 não existe (também undefined, sem erro).` },
    { q: 'O que aparece no ecrã?', code: J`
const v = [1, 2];
const n = v.push(10);
console.log(n, v);`, opts: ['3 [ 1, 2, 10 ]', '10 [ 1, 2, 10 ]', 'undefined [ 1, 2, 10 ]', '[ 1, 2, 10 ] [ 1, 2, 10 ]'], ok: 0, mono: true, check: true,
      exp: H`O <code>push</code> devolve o novo tamanho do array (3), não o array nem o elemento.` },
    { q: 'O que aparece no ecrã?', code: J`
const x = [1, 2];
const y = x;
y[0] = 99;
console.log(x);`, opts: ['[ 1, 2 ]', '[ 99, 2 ]', '[ 99, 2, 1, 2 ]', 'TypeError: Assignment to constant variable.'], ok: 1, mono: true, check: true,
      exp: H`x e y apontam para o mesmo array. E o <code>const</code> não impede mudar um elemento: só impede <code>y = outroArray</code>.` },
    { q: 'O que aparece no ecrã?', code: J`console.log([1, 2] === [1, 2]);`, opts: ['true', 'false', 'undefined', 'TypeError'], ok: 1, mono: true, check: true,
      exp: 'São dois arrays diferentes, criados em separado. O === compara se são o mesmo objeto, não o conteúdo.' },
  ],
  exercises: [{
    title: 'O maior',
    text: 'Dado o array [4, 8, 15, 16, 23, 42, 7], mostra o maior valor, percorrendo-o com um for...of.',
    run: 'Maior: 42\n',
    hint: H`Começa com <code>let maior = v[0];</code>. (Também existe <code>Math.max(...v)</code>, mas faz à mão.)`,
    solution: J`
const v = [4, 8, 15, 16, 23, 42, 7];
let maior = v[0];
for (const x of v) {
  if (x > maior) {
    maior = x;
  }
}
console.log("Maior:", maior);`,
  }, {
    title: 'Inverter sem estragar',
    text: 'Começa com original = [3, 1, 2]. Mostra o array invertido, sem mudar o original, e depois mostra o original.',
    run: 'invertido: [ 2, 1, 3 ]\noriginal: [ 3, 1, 2 ]\n',
    hint: H`<code>reverse()</code> muda o próprio array. Faz primeiro uma cópia: <code>[...original].reverse()</code>.`,
    solution: J`
const original = [3, 1, 2];
const invertido = [...original].reverse();
console.log("invertido:", invertido);
console.log("original:", original);`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Métodos de arrays',
  short: 'map, filter, reduce, find, forEach e o sort() traiçoeiro',
  body: H`
<p>Em vez de escrever um ciclo para cada coisa, os arrays têm métodos que recebem uma <strong>função</strong> e a aplicam a cada elemento:</p>
<table class="t">
<thead><tr><th>Método</th><th>Dá</th><th>Exemplo</th></tr></thead>
<tbody>
<tr><td><code>map(f)</code></td><td>um array novo, com <code>f</code> aplicada a cada elemento</td><td><code>[1, 2].map(x =&gt; x * 10)</code> → <code>[10, 20]</code></td></tr>
<tr><td><code>filter(f)</code></td><td>um array novo, só com os elementos em que <code>f</code> dá verdadeiro</td><td><code>notas.filter(n =&gt; n &gt;= 10)</code></td></tr>
<tr><td><code>find(f)</code></td><td>o primeiro elemento em que <code>f</code> dá verdadeiro (ou undefined)</td><td><code>alunos.find(a =&gt; a.numero === 102)</code></td></tr>
<tr><td><code>reduce(f, inicial)</code></td><td>um só valor, acumulado elemento a elemento</td><td><code>v.reduce((soma, x) =&gt; soma + x, 0)</code></td></tr>
<tr><td><code>forEach(f)</code></td><td>nada: só corre <code>f</code> para cada elemento</td><td><code>v.forEach(x =&gt; console.log(x))</code></td></tr>
</tbody>
</table>
<p>O <code>map</code>, o <code>filter</code> e o <code>reduce</code> não mudam o array original. Já o <code>sort</code> muda, e tem uma armadilha: <strong>sem argumento, ordena como texto</strong> (por isso 10 vem antes de 9). Para números: <code>v.sort((a, b) =&gt; a - b)</code>.</p>`,
  analogy: 'Os métodos são máquinas numa linha de montagem: o filter é o controlo de qualidade que deita fora as peças más, o map é a máquina que pinta cada peça, e o reduce é a caixa onde tudo acaba junto.',
  examples: [{
    title: 'filter, map e reduce em cadeia',
    code: J`
const notas = [12, 8, 15, 9, 18];
const positivas = notas.filter((n) => n >= 10);
const bonus = positivas.map((n) => n + 1);
const soma = bonus.reduce((total, n) => total + n, 0);
console.log(positivas);
console.log(bonus);
console.log(soma);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Array', ['12', '8', '15', '9', '18']] }, d: { global: { notas: ['Array', '@o1'] } }, n: 'As notas.' },
      { l: 2, obj: { o2: ['Array', ['12', '15', '18']] }, d: { global: { positivas: ['Array', '@o2'] } }, n: H`<code>filter</code> chama a função seta para cada nota e fica com as que dão verdadeiro. É um array <strong>novo</strong>: o original não muda.` },
      { l: 3, obj: { o3: ['Array', ['13', '16', '19']] }, d: { global: { bonus: ['Array', '@o3'] } }, n: H`<code>map</code> cria outro array, com a função aplicada a cada elemento.` },
      { l: 4, d: { global: { soma: ['number', '48'] } }, n: H`<code>reduce</code> começa com 0 e vai somando: 0 + 13 = 13, + 16 = 29, + 19 = 48.` },
      { l: 5, o: '[ 12, 15, 18 ]\n', n: 'As positivas.' },
      { l: 6, o: '[ 13, 16, 19 ]\n', n: 'Com o bónus.' },
      { l: 7, o: '48\n', n: 'A soma. Três linhas, sem nenhum ciclo escrito à mão.' },
    ],
  }, {
    title: 'O sort ordena como texto',
    code: J`
const v = [10, 9, 1, 100];
v.sort();
console.log(v);
v.sort((a, b) => a - b);
console.log(v);
const nomes = ["Rui", "Ana", "Ines"];
console.log(nomes.find((n) => n.startsWith("I")), nomes.join(" - "));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Array', ['10', '9', '1', '100']] }, d: { global: { v: ['Array', '@o1'] } }, n: 'Quatro números.' },
      { l: 2, obj: { o1: ['Array', ['1', '10', '100', '9']] }, n: H`Sem argumento, o <code>sort</code> compara como texto: "10" vem antes de "9", tal como "ab" vem antes de "b". E muda o próprio array.` },
      { l: 3, o: '[ 1, 10, 100, 9 ]\n', n: 'Não é o que se queria.' },
      { l: 4, obj: { o1: ['Array', ['1', '9', '10', '100']] }, n: H`Com uma função de comparação, <code>a - b</code>: negativo põe o a primeiro, positivo põe o b primeiro. Agora ordena por valor.` },
      { l: 5, o: '[ 1, 9, 10, 100 ]\n', n: 'Agora sim.' },
      { l: 6, obj: { o2: ['Array', ['"Rui"', '"Ana"', '"Ines"']] }, d: { global: { nomes: ['Array', '@o2'] } }, n: 'Um array de textos.' },
      { l: 7, o: 'Ines Rui - Ana - Ines\n', n: H`<code>find</code> dá o primeiro nome começado por I; <code>join</code> junta tudo com o texto que lhe dás.` },
    ],
  }],
  mistakes: [
    H`Usar <code>sort()</code> sem função num array de números.`,
    H`Esperar que o <code>map</code> mude o array original: guarda o resultado (<code>const novo = v.map(...)</code>).`,
    H`Esquecer o <code>return</code> numa função com chavetas dentro do map: <code>v.map(x =&gt; { x * 2 })</code> dá um array de undefined.`,
    H`Usar <code>forEach</code> e esperar um resultado: devolve sempre undefined.`,
    H`Esquecer o valor inicial do <code>reduce</code> (o <code>0</code> no fim).`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`console.log([1, 2, 3].map((x) => x * 2));`, opts: ['[ 2, 4, 6 ]', '[ 1, 2, 3 ]', '12', '[ 2 ]'], ok: 0, mono: true, check: true,
      exp: H`O <code>map</code> aplica a função a cada elemento e devolve um array novo com os resultados.` },
    { q: 'O que aparece no ecrã?', code: J`console.log([3, 20, 100].sort());`, opts: ['[ 3, 20, 100 ]', '[ 100, 20, 3 ]', '[ 100, 3, 20 ]', '[ 20, 3, 100 ]'], ok: 1, mono: true, check: true,
      exp: H`Como texto, "100" vem antes de "20" (o 1 é menor do que o 2), e "20" antes de "3". Para números, usa <code>sort((a, b) =&gt; a - b)</code>.` },
    { q: 'O que aparece no ecrã?', code: J`
const v = [5, 10, 15];
console.log(v.reduce((s, x) => s + x, 100));`, opts: ['30', '130', '100', '[ 105, 110, 115 ]'], ok: 1, mono: true, check: true,
      exp: 'O reduce começa no valor inicial (100) e soma cada elemento: 100 + 5 + 10 + 15 = 130.' },
    { q: 'O que aparece no ecrã?', code: J`
const r = [1, 2, 3].forEach((x) => x * 2);
console.log(r);`, opts: ['[ 2, 4, 6 ]', 'undefined', '6', '[ 1, 2, 3 ]'], ok: 1, mono: true, check: true,
      exp: H`O <code>forEach</code> só corre a função para cada elemento; não devolve nada. Para um array novo, é o <code>map</code>.` },
  ],
  exercises: [{
    title: 'Nomes em maiúsculas',
    text: 'Com nomes = ["Ana", "Rui", "Ines"], mostra um array novo com os nomes em maiúsculas.',
    run: "[ 'ANA', 'RUI', 'INES' ]\n",
    hint: H`<code>nomes.map((n) =&gt; n.toUpperCase())</code>`,
    solution: J`
const nomes = ["Ana", "Rui", "Ines"];
console.log(nomes.map((n) => n.toUpperCase()));`,
  }, {
    title: 'Média com reduce',
    text: 'Calcula a média de [12, 8, 15, 9, 18] usando reduce para a soma.',
    run: 'Media: 12.4\n',
    hint: H`Soma com <code>reduce((s, x) =&gt; s + x, 0)</code> e divide por <code>length</code>.`,
    solution: J`
const notas = [12, 8, 15, 9, 18];
const soma = notas.reduce((s, x) => s + x, 0);
console.log("Media:", soma / notas.length);`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Objetos',
  short: 'chaves e valores, ponto e parênteses retos, arrays de objetos',
  body: H`
<p>Um objeto junta valores com nome, como um struct do C mas sem declarar nada antes:</p>
<pre class="snip"><code>const aluno = { nome: "Ana", nota: 17 };</code></pre>
<ul>
<li>Lê-se com ponto, <code>aluno.nome</code>, ou com parênteses retos e um texto, <code>aluno["nome"]</code> (útil quando o nome está numa variável).</li>
<li>Uma propriedade nova cria-se só por lhe dar valor: <code>aluno.curso = "LEI";</code>. Uma que não existe dá <code>undefined</code>.</li>
<li><code>Object.keys(aluno)</code> dá as chaves; <code>for (const chave in aluno)</code> percorre-as.</li>
<li>Um objeto pode ter funções lá dentro (métodos); lá dentro, <code>this</code> é o próprio objeto.</li>
<li>Os dados de uma aplicação são quase sempre <strong>arrays de objetos</strong>: <code>[{ nome: "Ana", nota: 17 }, ...]</code>. É também a forma do JSON, o formato com que os sites trocam dados.</li>
</ul>`,
  analogy: 'Um objeto é uma ficha com campos etiquetados: "nome: Ana", "nota: 17". Podes acrescentar um campo novo a qualquer momento, é só escrevê-lo na ficha.',
  examples: [{
    title: 'Ler, acrescentar e mudar',
    code: J`
const aluno = { nome: "Ana", nota: 17 };
aluno.curso = "LEI";
aluno.nota = 18;
console.log(aluno.nome, aluno["nota"]);
console.log(aluno);
console.log(Object.keys(aluno));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Object', { nome: '"Ana"', nota: '17' }] }, d: { global: { aluno: ['Object', '@o1'] } }, n: 'Um objeto com duas propriedades. Vive no heap, como os arrays.' },
      { l: 2, obj: { o1: ['Object', { nome: '"Ana"', nota: '17', curso: '"LEI"' }] }, n: 'Dar valor a uma propriedade que não existe cria-a.' },
      { l: 3, obj: { o1: ['Object', { nome: '"Ana"', nota: '18', curso: '"LEI"' }] }, n: 'Mudar uma que já existe.' },
      { l: 4, o: 'Ana 18\n', n: H`<code>aluno.nota</code> e <code>aluno["nota"]</code> são a mesma coisa.` },
      { l: 5, o: "{ nome: 'Ana', nota: 18, curso: 'LEI' }\n", n: 'O Node mostra o objeto com as chaves e os textos entre plicas.' },
      { l: 6, o: "[ 'nome', 'nota', 'curso' ]\n", n: H`<code>Object.keys</code> dá um array com os nomes das propriedades, pela ordem em que foram criadas.` },
    ],
  }, {
    title: 'Um array de objetos',
    code: J`
const turma = [
  { nome: "Ana", nota: 17 },
  { nome: "Rui", nota: 9 },
];
for (const a of turma) {
  console.log(‵¤{a.nome}: ¤{a.nota >= 10 ? "aprovado" : "reprovado"}‵);
}`,
    steps: [
      { l: 1, push: 'global', obj: { o2: ['Object', { nome: '"Ana"', nota: '17' }], o3: ['Object', { nome: '"Rui"', nota: '9' }], o1: ['Array', ['@o2', '@o3']] }, d: { global: { turma: ['Array', '@o1'] } }, n: 'O array guarda duas referências, uma para cada objeto.' },
      { l: 5, d: { global: { a: ['Object', '@o2'] } }, n: H`O <code>for...of</code> dá a <code>a</code> cada elemento: uma referência para o objeto da Ana.` },
      { l: 6, o: 'Ana: aprovado\n', n: H`<code>condição ? se_sim : se_não</code> escolhe entre dois valores, como em C.` },
      { l: 5, u: { global: { a: '@o3' } }, n: 'Agora o do Rui.' },
      { l: 6, o: 'Rui: reprovado\n', n: '9 >= 10 é falso.' },
    ],
  }],
  mistakes: [
    H`Ler uma propriedade mal escrita (<code>aluno.nmoe</code>): não há erro, dá undefined.`,
    H`Ler uma propriedade de algo que é undefined: <em>TypeError: Cannot read properties of undefined (reading 'nome')</em>.`,
    H`Usar <code>aluno.chave</code> quando a chave está numa variável: é <code>aluno[chave]</code>.`,
    H`Esquecer as vírgulas entre propriedades, ou pôr <code>=</code> em vez de <code>:</code> dentro das chavetas.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
const o = { a: 1, b: 2 };
console.log(o.c, o["b"]);`, opts: ['undefined 2', 'null 2', 'TypeError 2', '3 2'], ok: 0, mono: true, check: true,
      exp: H`Ler uma propriedade que não existe dá <code>undefined</code>, sem erro.` },
    { q: 'O que aparece no ecrã?', code: J`
const aluno = { nome: "Ana" };
const campo = "nome";
console.log(aluno.campo, aluno[campo]);`, opts: ['Ana Ana', 'undefined Ana', 'Ana undefined', 'campo Ana'], ok: 1, mono: true, check: true,
      exp: H`<code>aluno.campo</code> procura uma propriedade chamada literalmente "campo", que não existe. <code>aluno[campo]</code> usa o valor da variável: "nome".` },
    { q: 'O que aparece no ecrã?', code: J`console.log(JSON.stringify({ nome: "Rui", nota: 9 }));`, opts: ['{"nome":"Rui","nota":9}', "{ nome: 'Rui', nota: 9 }", '[object Object]', 'nome,nota'], ok: 0, mono: true, check: true,
      exp: H`<code>JSON.stringify</code> transforma o objeto em texto JSON: chaves e textos entre aspas, sem espaços. É assim que se envia um objeto para um servidor.` },
    { q: 'O que aparece no ecrã?', code: J`
const conta = {
  saldo: 10,
  depositar(v) {
    this.saldo += v;
  },
};
conta.depositar(5);
conta.depositar(5);
console.log(conta.saldo);`, opts: ['10', '15', '20', 'NaN'], ok: 2, mono: true, check: true,
      exp: H`Dentro do método, <code>this</code> é o objeto <code>conta</code>. Cada chamada soma 5: 10, 15, 20.` },
  ],
  exercises: [{
    title: 'Valor do stock',
    text: 'Com o array de produtos abaixo, mostra o valor total do stock (preço × quantidade de cada um).',
    run: 'Total: 43\n',
    hint: H`<code>const produtos = [{ nome: "Caneta", preco: 0.8, qtd: 10 }, ...]</code> e um for...of (ou um reduce) a somar <code>p.preco * p.qtd</code>.`,
    solution: J`
const produtos = [
  { nome: "Caneta", preco: 0.8, qtd: 10 },
  { nome: "Caderno", preco: 2.5, qtd: 4 },
  { nome: "Mochila", preco: 25, qtd: 1 },
];
let total = 0;
for (const p of produtos) {
  total += p.preco * p.qtd;
}
console.log("Total:", total);`,
  }, {
    title: 'Contar letras',
    text: 'Conta quantas vezes aparece cada letra no texto "banana", usando um objeto como contador.',
    run: '{ b: 1, a: 3, n: 2 }\n',
    hint: H`<code>conta[letra] = (conta[letra] || 0) + 1;</code> (o <code>|| 0</code> trata o caso de a letra ainda não existir).`,
    solution: J`
const conta = {};
for (const letra of "banana") {
  conta[letra] = (conta[letra] || 0) + 1;
}
console.log(conta);`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Referências e cópias',
  short: 'dois nomes para o mesmo objeto, === entre objetos e cópias rasas',
  body: H`
<p>Os valores simples (números, textos, booleanos) ficam na própria variável e copiam-se. Os objetos e os arrays vivem no heap, e uma variável só guarda uma <strong>referência</strong> para eles. É a mesma regra do Python e do C#:</p>
<ul>
<li><code>const q = p</code> não copia o objeto: dá-lhe um segundo nome. Mudar <code>q.nome</code> muda o que <code>p</code> vê.</li>
<li>Uma função que recebe um objeto pode mudá-lo, e a mudança vê-se fora dela.</li>
<li><code>===</code> entre objetos pergunta se são o mesmo objeto. Dois objetos com o mesmo conteúdo não são <code>===</code>.</li>
<li>Para copiar: <code>{ ...p }</code> ou <code>[...v]</code>. Atenção: é uma cópia <strong>rasa</strong>. Se o objeto tiver outro objeto lá dentro, a cópia aponta para o mesmo objeto interior. Para copiar tudo: <code>structuredClone(p)</code>.</li>
<li><code>const</code> não torna o objeto imutável: só impede a variável de apontar para outro.</li>
</ul>`,
  analogy: 'Uma cópia rasa é fotocopiar uma pasta que tem lá dentro um papel a dizer "o contrato está no cacifo 7". Ficas com duas pastas, mas as duas mandam para o mesmo cacifo: se alguém mudar o contrato, as duas pastas veem a mudança.',
  examples: [{
    title: 'O mesmo objeto e a cópia rasa',
    code: J`
const p = { nome: "Ana", morada: { cidade: "Vila Real" } };
const q = p;
q.nome = "Rita";
const r = { ...p };
r.nome = "Ines";
r.morada.cidade = "Porto";
console.log(p.nome, p.morada.cidade);
console.log(p === q, p === r);`,
    steps: [
      { l: 1, push: 'global', obj: { o2: ['Object', { cidade: '"Vila Real"' }], o1: ['Object', { nome: '"Ana"', morada: '@o2' }] }, d: { global: { p: ['Object', '@o1'] } }, n: H`Um objeto com outro objeto lá dentro: a propriedade <code>morada</code> é uma referência para o #2.` },
      { l: 2, d: { global: { q: ['Object', '@o1'] } }, n: H`<code>q = p</code>: um segundo nome para o mesmo objeto #1.` },
      { l: 3, obj: { o1: ['Object', { nome: '"Rita"', morada: '@o2' }] }, n: H`Mudar através de <code>q</code> muda o #1, que é também o <code>p</code>.` },
      { l: 4, obj: { o3: ['Object', { nome: '"Rita"', morada: '@o2' }] }, d: { global: { r: ['Object', '@o3'] } }, n: H`<code>{ ...p }</code> cria um objeto <strong>novo</strong> (#3) com as mesmas propriedades. Mas repara: a <code>morada</code> da cópia aponta para o <strong>mesmo</strong> #2. É uma cópia rasa.` },
      { l: 5, obj: { o3: ['Object', { nome: '"Ines"', morada: '@o2' }] }, n: H`Mudar o nome da cópia não mexe no original: são objetos diferentes.` },
      { l: 6, obj: { o2: ['Object', { cidade: '"Porto"' }] }, n: H`Mas a morada é partilhada: mudar <code>r.morada.cidade</code> muda o #2, que o <code>p</code> também usa.` },
      { l: 7, o: 'Rita Porto\n', n: 'O p tem o nome mudado pelo q e a cidade mudada pela cópia r.' },
      { l: 8, o: 'true false\n', n: 'p e q são o mesmo objeto; p e r não.' },
    ],
  }, {
    title: 'Uma função que muda o objeto',
    code: J`
function aumenta(aluno) {
  aluno.nota += 1;
}
const a = { nome: "Rui", nota: 9 };
aumenta(a);
console.log(a.nota);
const lista = [];
lista.push("x");
console.log(lista);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'aumenta(aluno)'] }, d: { global: { aumenta: ['function', '@o1'] } }, n: 'Uma função.' },
      { l: 4, obj: { o2: ['Object', { nome: '"Rui"', nota: '9' }] }, d: { global: { a: ['Object', '@o2'] } }, n: 'Um aluno com nota 9.' },
      { l: 1, push: 'aumenta', d: { aumenta: { aluno: ['Object', '@o2'] } }, n: H`Na chamada, o parâmetro <code>aluno</code> recebe a referência: aponta para o mesmo objeto #2.` },
      { l: 2, obj: { o2: ['Object', { nome: '"Rui"', nota: '10' }] }, n: 'Muda a nota do objeto #2.' },
      { l: 6, pop: true, o: '10\n', n: 'A mudança ficou, porque a função mexeu no próprio objeto.' },
      { l: 7, obj: { o3: ['Array', []] }, d: { global: { lista: ['Array', '@o3'] } }, n: H`Um array vazio, numa <code>const</code>.` },
      { l: 8, obj: { o3: ['Array', ['"x"']] }, n: H`O <code>push</code> funciona: <code>const</code> não impede mudar o array, só impede <code>lista = outra coisa</code>.` },
      { l: 9, o: "[ 'x' ]\n", n: 'O array mudou.' },
    ],
  }],
  mistakes: [
    H`Fazer <code>const copia = original</code> e mudar a "cópia".`,
    H`Usar <code>{ ...p }</code> com objetos dentro de objetos e estranhar que o original mude: é uma cópia rasa. Usa <code>structuredClone(p)</code>.`,
    H`Comparar objetos com <code>===</code> para ver se têm os mesmos dados.`,
    H`Achar que <code>const</code> protege o objeto de mudanças.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`console.log({ a: 1 } === { a: 1 });`, opts: ['true', 'false', 'undefined', 'TypeError'], ok: 1, mono: true, check: true,
      exp: 'São dois objetos diferentes, cada um criado pelas suas chavetas. O === compara referências.' },
    { q: 'O que aparece no ecrã?', code: J`
const a = { n: 1 };
const b = { ...a };
b.n = 2;
console.log(a.n, b.n);`, opts: ['1 2', '2 2', '1 1', '2 1'], ok: 0, mono: true, check: true,
      exp: H`<code>{ ...a }</code> cria um objeto novo. Mudar o <code>n</code> da cópia não mexe no original (e n é um número, por isso não há nada partilhado).` },
    { q: 'O que aparece no ecrã?', code: J`
const a = { lista: [1] };
const b = { ...a };
b.lista.push(2);
console.log(a.lista);`, opts: ['[ 1 ]', '[ 1, 2 ]', '[ 2 ]', 'undefined'], ok: 1, mono: true, check: true,
      exp: H`A cópia é rasa: <code>b.lista</code> é uma referência para o mesmo array que <code>a.lista</code>. O push muda esse array.` },
    { q: 'O que aparece no ecrã?', code: J`
function zera(o) {
  o = { valor: 0 };
}
const x = { valor: 5 };
zera(x);
console.log(x.valor);`, opts: ['0', '5', 'undefined', 'TypeError'], ok: 1, mono: true, check: true,
      exp: H`<code>o = { valor: 0 }</code> põe o parâmetro a apontar para outro objeto; não mexe no objeto do x. Mudar o objeto (<code>o.valor = 0</code>) é que mudaria.` },
  ],
  exercises: [{
    title: 'Copiar e mudar',
    text: 'Cria o objeto original = { nome: "Ana", nota: 17 }, faz uma cópia, muda o nome da cópia para "Rita" e mostra os dois nomes.',
    run: 'original: Ana\ncopia: Rita\n',
    hint: H`<code>const copia = { ...original };</code>`,
    solution: J`
const original = { nome: "Ana", nota: 17 };
const copia = { ...original };
copia.nome = "Rita";
console.log("original:", original.nome);
console.log("copia:", copia.nome);`,
  }, {
    title: 'Cópia profunda',
    text: 'Cria aluno = { nome: "Rui", morada: { cidade: "Vila Real" } }. Faz uma cópia completa, muda a cidade da cópia para "Braga" e mostra a cidade dos dois.',
    run: 'original: Vila Real\ncopia: Braga\n',
    hint: H`<code>{ ...aluno }</code> não chega (a morada ficava partilhada). Usa <code>structuredClone(aluno)</code>.`,
    solution: J`
const aluno = { nome: "Rui", morada: { cidade: "Vila Real" } };
const copia = structuredClone(aluno);
copia.morada.cidade = "Braga";
console.log("original:", aluno.morada.cidade);
console.log("copia:", copia.morada.cidade);`,
  }],
});
