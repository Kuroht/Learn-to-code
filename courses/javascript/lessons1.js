// ===== JavaScript do Zero — conteúdo das lições (parte 1) =====
// Os exemplos usam o visualizador de referências (como o do C#): os valores simples (number, string, boolean)
// ficam na própria variável, os objetos e os arrays vão para o heap (obj) e a variável guarda '@o1'.
//   d: { global: { idade: ['number', '19'] } }   u: { global: { idade: '20' } }
//   obj: { o1: ['Array', ['1', '2']] }   d: { global: { v: ['Array', '@o1'] } }
// As lições do DOM (9 e 10) usam viz: 'page' (ver lessons3.js).
// O código vive dentro de templates do JavaScript, por isso uma crase ou um ${ no código partiam este ficheiro.
// No código das lições, ‵ quer dizer ` e ¤{ quer dizer ${ (o J troca-os). No texto H`...`, usa &#96; e &#36;.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
// E o fecho do script escreve-se <\/script> (um fecho a sério acabava com o script da própria página).
const J = (s, ...v) => C(s, ...v).replace(/‵/g, '`').replace(/¤\{/g, '${').replace(/<\\\/script>/g, '</' + 'script>');
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Olá, JavaScript',
  short: 'console.log, let, const e texto com `...`',
  body: H`
<p>O JavaScript é a linguagem que corre nos browsers: é ela que torna as páginas interativas. Também corre fora do browser, com o <strong>Node.js</strong>: escreves o programa num ficheiro <code>ola.js</code> e corres <code>node ola.js</code>. Nas lições 0 a 8 é assim que os exemplos correm.</p>
<ul>
<li><code>console.log(...)</code> escreve e muda de linha (é o <code>printf</code> / <code>print</code>). Com vários valores, separa-os com um espaço.</li>
<li>As variáveis criam-se com <code>let</code> (pode mudar) ou <code>const</code> (não pode). Usa <code>const</code> sempre que puderes. Não se escreve o tipo: como no Python, o tipo é do valor.</li>
<li>Texto com valores lá dentro: entre crases, com <code>&#36;{...}</code>: <code>&#96;&#36;{nome} tem &#36;{idade} anos&#96;</code>. São os <em>template literals</em>, a f-string do JavaScript.</li>
<li>As instruções acabam em <code>;</code> e os blocos usam chavetas, como no C.</li>
</ul>`,
  analogy: 'Se o HTML é o esqueleto da página e o CSS é a roupa, o JavaScript são os músculos: é o que a faz mexer.',
  examples: [{
    title: 'Escrever e guardar valores',
    code: J`
// O meu primeiro programa
console.log("Ola, JavaScript!");
let nome = "Rita";
const idade = 19;
console.log("Nome:", nome);
console.log(‵¤{nome} tem ¤{idade} anos‵);
nome = "Rita Silva";
console.log(nome);`,
    steps: [
      { l: 2, push: 'global', o: 'Ola, JavaScript!\n', n: H`O programa corre de cima para baixo, desde a primeira linha. A linha 1 é um comentário. <code>console.log</code> escreve e muda de linha.` },
      { l: 3, d: { global: { nome: ['string', '"Rita"'] } }, n: H`<code>let</code> cria uma variável que pode mudar. O tipo (<code>string</code>, texto) vem do valor.` },
      { l: 4, d: { global: { idade: ['number', '19'] } }, n: H`<code>const</code> cria uma variável que não pode mudar. Os números são do tipo <code>number</code>.` },
      { l: 5, o: 'Nome: Rita\n', n: 'Com dois valores, o console.log põe um espaço entre eles.' },
      { l: 6, o: 'Rita tem 19 anos\n', n: H`Entre crases, cada <code>&#36;{...}</code> é trocado pelo valor da expressão.` },
      { l: 7, u: { global: { nome: '"Rita Silva"' } }, n: H`<code>nome</code> foi criado com <code>let</code>, por isso pode receber outro valor. Com a <code>idade</code> isto dava erro.` },
      { l: 8, o: 'Rita Silva\n', n: 'O valor novo.' },
    ],
  }],
  mistakes: [
    H`Mudar uma variável <code>const</code>: <em>TypeError: Assignment to constant variable.</em>`,
    H`Usar aspas normais com <code>&#36;{...}</code>: <code>"&#36;{nome}"</code> mostra o texto tal e qual. São precisas crases.`,
    H`Escrever <code>Console.log</code>: o JavaScript distingue maiúsculas de minúsculas.`,
    H`Usar <code>var</code> por o ver em exemplos antigos na internet. Usa <code>let</code> e <code>const</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
console.log("A", "B");
console.log("A" + "B");`, opts: ['A B\nAB', 'AB\nAB', 'A B\nA B', 'AB\nA B'], ok: 0, mono: true, check: true,
      exp: H`Com vírgula, o console.log separa os valores com um espaço. Com <code>+</code>, os dois textos são colados antes.` },
    { q: 'O que aparece no ecrã?', code: J`
const x = 5;
x = 6;
console.log(x);`, opts: ['6', '5', 'TypeError: Assignment to constant variable.', '11'], ok: 2, mono: true, check: true,
      exp: H`Uma variável <code>const</code> não pode receber outro valor. O programa pára com um erro antes do console.log.` },
    { q: 'O que aparece no ecrã?', code: J`
let a = 2;
console.log(‵a vale ¤{a * 3}‵);`, opts: ['a vale 6', 'a vale ${a * 3}', 'a vale a * 3', 'a vale 2 * 3'], ok: 0, mono: true, check: true,
      exp: H`Dentro de <code>&#36;{...}</code> pode ir qualquer expressão: <code>a * 3</code> é calculado e dá 6.` },
    { q: 'Quando usas let em vez de const?', opts: ['Sempre, é mais moderno', 'Quando a variável vai receber outro valor mais tarde', 'Para números', 'Para texto'], ok: 1,
      exp: H`Usa <code>const</code> por omissão e <code>let</code> só quando precisas de mudar a variável (um contador, um acumulador). O tipo do valor não interessa.` },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve um programa que mostre o teu nome numa linha e o teu curso na linha seguinte.',
    run: 'Nome: Joao\nCurso: Engenharia Informatica\n',
    hint: H`Dois <code>console.log</code>.`,
    solution: J`
console.log("Nome: Joao");
console.log("Curso: Engenharia Informatica");`,
  }, {
    title: 'Contas',
    text: 'Cria as constantes a = 8 e b = 3 e mostra a soma, a diferença e o produto, exatamente neste formato.',
    run: '8 + 3 = 11\n8 - 3 = 5\n8 * 3 = 24\n',
    hint: H`<code>console.log(&#96;&#36;{a} + &#36;{b} = &#36;{a + b}&#96;);</code>`,
    solution: J`
const a = 8;
const b = 3;
console.log(‵¤{a} + ¤{b} = ¤{a + b}‵);
console.log(‵¤{a} - ¤{b} = ¤{a - b}‵);
console.log(‵¤{a} * ¤{b} = ¤{a * b}‵);`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Tipos e conversões traiçoeiras',
  short: 'number, string, "5" + 3, == contra === e undefined',
  body: H`
<p>O JavaScript tenta "ajudar" convertendo tipos sozinho, e é daí que vêm as surpresas mais famosas:</p>
<table class="t">
<thead><tr><th>Escreves</th><th>Dá</th><th>Porquê</th></tr></thead>
<tbody>
<tr><td><code>7 / 2</code></td><td><code>3.5</code></td><td>só há um tipo de número, <code>number</code> (não há int)</td></tr>
<tr><td><code>"5" + 3</code></td><td><code>"53"</code></td><td>com um texto, o <code>+</code> junta texto</td></tr>
<tr><td><code>"5" * 3</code></td><td><code>15</code></td><td>o <code>*</code> só faz contas, por isso converte o texto</td></tr>
<tr><td><code>Number("abc")</code></td><td><code>NaN</code></td><td>"Not a Number": uma conversão que falhou</td></tr>
<tr><td><code>5 == "5"</code></td><td><code>true</code></td><td>o <code>==</code> converte antes de comparar</td></tr>
<tr><td><code>5 === "5"</code></td><td><code>false</code></td><td>o <code>===</code> compara também o tipo</td></tr>
</tbody>
</table>
<ul>
<li><strong>Usa sempre <code>===</code> e <code>!==</code>.</strong> O <code>==</code> tem regras de conversão que quase ninguém sabe de cor.</li>
<li>Para converter de propósito: <code>Number("12")</code>, <code>String(12)</code>. <code>typeof x</code> diz o tipo.</li>
<li>Uma variável sem valor é <code>undefined</code>. <code>null</code> é "nada", posto de propósito.</li>
</ul>`,
  analogy: 'O == é um empregado que, para comparar uma maçã com uma pera, primeiro transforma as duas em fruta. O === não transforma nada: maçã é maçã, pera é pera.',
  examples: [{
    title: 'O + com texto',
    code: J`
let a = "5";
let b = 3;
console.log(typeof a, typeof b);
console.log(a + b);
console.log(a * b);
let c = Number(a) + b;
console.log(c, 7 / 2);`,
    steps: [
      { l: 1, push: 'global', d: { global: { a: ['string', '"5"'] } }, n: H`<code>a</code> é o texto "5", não o número (repara nas aspas).` },
      { l: 2, d: { global: { b: ['number', '3'] } }, n: H`<code>b</code> é um número.` },
      { l: 3, o: 'string number\n', n: H`<code>typeof</code> confirma os tipos.` },
      { l: 4, o: '53\n', n: H`Com um texto de um dos lados, o <code>+</code> junta texto: "5" e "3" dá "53". Não há erro, como haveria em Python.` },
      { l: 5, o: '15\n', n: H`O <code>*</code> não serve para texto, por isso o JavaScript converte o "5" em 5 e multiplica.` },
      { l: 6, d: { global: { c: ['number', '8'] } }, n: H`Converter de propósito com <code>Number(...)</code> resolve: 5 + 3 = 8.` },
      { l: 7, o: '8 3.5\n', n: H`E <code>7 / 2</code> dá 3.5: em JavaScript não há divisão inteira com o <code>/</code>.` },
    ],
  }, {
    title: '== contra ===, undefined e null',
    code: J`
console.log(5 == "5");
console.log(5 === "5");
console.log(0 == false, 0 === false);
let x;
console.log(x, typeof x);
let y = null;
console.log(y === undefined, y == undefined);`,
    steps: [
      { l: 1, push: 'global', o: 'true\n', n: H`<code>==</code> converte o texto "5" em número antes de comparar.` },
      { l: 2, o: 'false\n', n: H`<code>===</code> não converte: um número e um texto nunca são iguais.` },
      { l: 3, o: 'true false\n', n: H`Com <code>==</code>, até o 0 é "igual" a <code>false</code>. Com <code>===</code>, não.` },
      { l: 4, d: { global: { x: ['undefined', 'undefined'] } }, n: H`Uma variável sem valor fica <code>undefined</code> (em C tinha lixo).` },
      { l: 5, o: 'undefined undefined\n', n: H`<code>undefined</code> é um valor e também um tipo.` },
      { l: 6, d: { global: { y: ['object', 'null'] } }, n: H`<code>null</code> é "nada", posto de propósito. (O <code>typeof null</code> dá "object": é um erro antigo da linguagem que ficou.)` },
      { l: 7, o: 'false true\n', n: H`Com <code>===</code>, null e undefined são diferentes; com <code>==</code>, são "iguais". Mais uma razão para usar <code>===</code>.` },
    ],
  }],
  mistakes: [
    H`Somar números lidos de um campo de texto ou de um prompt sem os converter: dá texto colado ("4" + "9" = "49").`,
    H`Usar <code>==</code> em vez de <code>===</code>.`,
    H`Testar <code>x === NaN</code>: nunca é verdade (nem <code>NaN === NaN</code> é). Usa <code>Number.isNaN(x)</code>.`,
    H`Esperar resultados exatos com casas decimais: <code>0.1 + 0.2</code> dá 0.30000000000000004. Arredonda ao mostrar, com <code>toFixed(2)</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`console.log("10" - 2);`, opts: ['8', '102', '"8"', 'NaN'], ok: 0, mono: true, check: true,
      exp: H`O <code>-</code> só faz contas, por isso converte o "10" em número: 10 - 2 = 8.` },
    { q: 'O que aparece no ecrã?', code: J`console.log("10" + 2);`, opts: ['12', '102', '8', 'NaN'], ok: 1, mono: true, check: true,
      exp: H`Com um texto, o <code>+</code> junta texto: "10" e "2" dá "102". É o mesmo operador do exercício anterior a fazer uma coisa diferente.` },
    { q: 'O que aparece no ecrã?', code: J`console.log(0.1 + 0.2 === 0.3);`, opts: ['true', 'false', '0.3', 'NaN'], ok: 1, mono: true, check: true,
      exp: 'Os números com casas decimais são guardados em binário, como o double do C. 0.1 + 0.2 dá 0.30000000000000004, que não é exatamente 0.3.' },
    { q: 'O que aparece no ecrã?', code: J`console.log(Number("12abc"), Number("12"));`, opts: ['12 12', 'NaN 12', '0 12', 'NaN NaN'], ok: 1, mono: true, check: true,
      exp: H`<code>Number</code> só converte se o texto todo for um número. "12abc" não é, por isso dá <code>NaN</code>.` },
  ],
  exercises: [{
    title: 'Média com duas casas',
    text: 'Calcula a média das notas 12, 15 e 14 e mostra-a com 2 casas decimais.',
    run: 'Media: 13.67\n',
    hint: H`Em JavaScript a divisão já dá casas decimais. Para mostrar com 2: <code>media.toFixed(2)</code>.`,
    solution: J`
const media = (12 + 15 + 14) / 3;
console.log("Media:", media.toFixed(2));`,
  }, {
    title: 'Somar textos como números',
    text: 'Tens os textos "4" e "9" (como viriam de um formulário). Mostra o que dá somá-los diretamente e somá-los depois de os converter.',
    run: 'Sem converter: 49\nConvertidos: 13\n',
    hint: H`<code>Number(a) + Number(b)</code>.`,
    solution: J`
const a = "4";
const b = "9";
console.log("Sem converter:", a + b);
console.log("Convertidos:", Number(a) + Number(b));`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Decisões e ciclos',
  short: 'if, for, while, for...of e o que conta como verdadeiro',
  body: H`
<p><code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>switch</code>, <code>&amp;&amp;</code>, <code>||</code> e <code>!</code> escrevem-se como no C. O que muda:</p>
<ul>
<li>As comparações fazem-se com <code>===</code> e <code>!==</code>.</li>
<li>Qualquer valor pode servir de condição. Contam como <strong>falsos</strong> (<em>falsy</em>): <code>false</code>, <code>0</code>, <code>""</code> (texto vazio), <code>null</code>, <code>undefined</code> e <code>NaN</code>. Tudo o resto é verdadeiro, até o texto <code>"0"</code> e um array vazio.</li>
<li><code>for (const x of lista)</code> percorre os elementos de um array ou as letras de um texto, como o <code>for ... in</code> do Python.</li>
<li>No <code>for</code> clássico, a variável cria-se com <code>let</code>: <code>for (let i = 0; i &lt; 3; i++)</code>.</li>
</ul>`,
  analogy: 'Um valor falsy é uma caixa que, ao abanar, parece vazia: o zero, o texto sem nada, o "não sei" (undefined). Tudo o que tem alguma coisa lá dentro conta como verdadeiro.',
  examples: [{
    title: 'if e for',
    code: J`
const nota = 13;
if (nota >= 10) {
  console.log("Aprovado");
} else {
  console.log("Reprovado");
}
let soma = 0;
for (let i = 1; i <= 3; i++) {
  soma += i;
}
console.log("Soma:", soma);`,
    steps: [
      { l: 1, push: 'global', d: { global: { nota: ['number', '13'] } }, n: 'A nota.' },
      { l: 2, n: '13 >= 10 é verdadeiro.' },
      { l: 3, o: 'Aprovado\n', n: 'Entra no if.' },
      { l: 7, d: { global: { soma: ['number', '0'] } }, n: H`O acumulador, com <code>let</code> porque vai mudar.` },
      { l: 8, d: { global: { i: ['number', '1'] } }, n: 'Igual ao C: i começa em 1.' },
      { l: 9, u: { global: { soma: '1' } }, n: 'soma = 1' },
      { l: 8, u: { global: { i: '2' } }, n: 'i = 2' },
      { l: 9, u: { global: { soma: '3' } }, n: 'soma = 3' },
      { l: 8, u: { global: { i: '3' } }, n: 'i = 3' },
      { l: 9, u: { global: { soma: '6' } }, n: 'soma = 6' },
      { l: 8, u: { global: { i: '4' } }, n: H`i = 4: 4 &lt;= 3 é falso, o ciclo acaba.` },
      { l: 11, x: { global: ['i'] }, o: 'Soma: 6\n', n: H`O <code>i</code>, criado com <code>let</code> no for, só existe dentro do ciclo.` },
    ],
  }, {
    title: 'for...of e valores falsy',
    code: J`
const nomes = ["Ana", "", "Rui"];
for (const n of nomes) {
  if (n) {
    console.log("Ola,", n);
  } else {
    console.log("(nome vazio)");
  }
}`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['Array', ['"Ana"', '""', '"Rui"']] }, d: { global: { nomes: ['Array', '@o1'] } }, n: 'Um array com três textos; o do meio está vazio. Os arrays vivem no heap (lição 4).' },
      { l: 2, d: { global: { n: ['string', '"Ana"'] } }, n: H`<code>for...of</code> dá cada elemento, um de cada vez. Primeiro "Ana".` },
      { l: 4, o: 'Ola, Ana\n', n: H`<code>if (n)</code>: um texto com letras conta como verdadeiro.` },
      { l: 2, u: { global: { n: '""' } }, n: 'Agora o texto vazio.' },
      { l: 6, o: '(nome vazio)\n', n: H`O texto vazio é <em>falsy</em>: conta como falso, por isso vai para o else.` },
      { l: 2, u: { global: { n: '"Rui"' } }, n: 'Último elemento.' },
      { l: 4, o: 'Ola, Rui\n', n: 'Verdadeiro outra vez.' },
    ],
  }],
  mistakes: [
    H`Usar <code>==</code> nas condições.`,
    H`Esquecer que <code>0</code> é falsy: <code>if (quantidade)</code> trata o 0 como "não há valor". Se o 0 é um valor válido, escreve <code>if (quantidade !== undefined)</code>.`,
    H`Confundir <code>for...of</code> (os elementos) com <code>for...in</code> (os índices, como texto). Para arrays usa <code>for...of</code>.`,
    H`Esquecer o <code>let</code> no <code>for</code>: <code>for (i = 0; ...)</code> cria uma variável global sem quereres.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
if ("0") {
  console.log("sim");
} else {
  console.log("nao");
}`, opts: ['sim', 'nao', '0', 'TypeError'], ok: 0, mono: true, check: true,
      exp: H`<code>"0"</code> é um texto com uma letra, e qualquer texto não vazio é verdadeiro. Só o <strong>número</strong> 0 é falsy.` },
    { q: 'O que aparece no ecrã?', code: J`
const valores = [0, 1, "", "a", null];
let conta = 0;
for (const v of valores) {
  if (v) conta++;
}
console.log(conta);`, opts: ['2', '3', '5', '1'], ok: 0, mono: true, check: true,
      exp: H`São falsy o 0, o "" e o null. Ficam o 1 e o "a": 2.` },
    { q: 'O que aparece no ecrã?', code: J`
let texto = "";
for (const letra of "ola") {
  texto = letra + texto;
}
console.log(texto);`, opts: ['ola', 'alo', 'o l a', 'ooo'], ok: 1, mono: true, check: true,
      exp: 'Cada letra é posta à frente do que já havia: "o", depois "lo", depois "alo". O texto fica ao contrário.' },
    { q: 'O que aparece no ecrã?', code: J`
let i = 10;
while (i > 0) {
  i -= 4;
}
console.log(i);`, opts: ['0', '-2', '2', '-4'], ok: 1, mono: true, check: true,
      exp: 'i vale 10, 6, 2 e depois -2. Só então a condição i > 0 falha.' },
  ],
  exercises: [{
    title: 'Tabuada do 7',
    text: 'Mostra a tabuada do 7, de 1 a 10.',
    run: Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}\n`).join(''),
    hint: H`Um <code>for (let i = 1; i &lt;= 10; i++)</code> e um template literal.`,
    solution: J`
for (let i = 1; i <= 10; i++) {
  console.log(‵7 x ¤{i} = ¤{7 * i}‵);
}`,
  }, {
    title: 'Positivas',
    text: 'Para o array de notas [12, 8, 15, 9, 18], mostra as positivas (10 ou mais), uma por linha, e no fim quantas foram.',
    run: '12\n15\n18\nPositivas: 3\n',
    hint: H`Um <code>for...of</code> com um if e um contador.`,
    solution: J`
const notas = [12, 8, 15, 9, 18];
let positivas = 0;
for (const nota of notas) {
  if (nota >= 10) {
    console.log(nota);
    positivas++;
  }
}
console.log("Positivas:", positivas);`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Funções',
  short: 'function, funções seta, return, parâmetros por omissão e âmbito',
  body: H`
<p>Há duas formas de escrever uma função:</p>
<pre class="snip"><code>function quadrado(x) {
  return x * x;
}

const dobro = (x) => x * 2;   // função seta (arrow function)</code></pre>
<ul>
<li>Não há tipos nos parâmetros nem no resultado. Sem <code>return</code>, a função devolve <code>undefined</code>.</li>
<li>Uma função seta com uma só expressão devolve-a sem <code>return</code>. Com chavetas, precisa de <code>return</code>: <code>(x) =&gt; { return x * 2; }</code>.</li>
<li>Se chamares com menos argumentos, os que faltam ficam <code>undefined</code>. Um valor por omissão resolve: <code>function ola(nome = "aluno")</code>.</li>
<li>As variáveis criadas com <code>let</code>/<code>const</code> dentro de uma função (ou de um bloco) só existem lá dentro.</li>
<li>As funções são valores: podem ser guardadas em variáveis e passadas a outras funções. Vais usar muito isto com os arrays (lição 5) e os eventos (lição 10).</li>
</ul>`,
  analogy: 'Uma função é uma receita com nome. A função seta é a mesma receita escrita num post-it: mais curta, boa para coisas pequenas.',
  examples: [{
    title: 'Duas formas de escrever uma função',
    code: J`
function quadrado(x) {
  return x * x;
}

const dobro = (x) => x * 2;

console.log(quadrado(4));
console.log(dobro(quadrado(3)));
console.log(quadrado());`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'quadrado(x)'] }, d: { global: { quadrado: ['function', '@o1'] } }, n: H`Uma função também é um objeto, guardado numa variável com o seu nome. Escrita assim, existe desde o início do programa.` },
      { l: 5, obj: { o2: ['function', '(x) => x * 2'] }, d: { global: { dobro: ['function', '@o2'] } }, n: H`Uma função seta, guardada numa <code>const</code>. É só uma forma mais curta de escrever uma função.` },
      { l: 1, push: 'quadrado', d: { quadrado: { x: ['number', '4'] } }, n: H`Chama <code>quadrado(4)</code>: abre um frame com o parâmetro <code>x</code>.` },
      { l: 2, n: 'Devolve 16.' },
      { l: 7, pop: true, o: '16\n', n: 'O frame desaparece e o 16 é escrito.' },
      { l: 8, o: '18\n', n: H`Primeiro <code>quadrado(3)</code> = 9, depois <code>dobro(9)</code> = 18. A seta devolve <code>x * 2</code> sem precisar de <code>return</code>.` },
      { l: 1, push: 'quadrado', d: { quadrado: { x: ['undefined', 'undefined'] } }, n: H`Chamada sem argumento: o JavaScript não reclama, e <code>x</code> fica <code>undefined</code>.` },
      { l: 2, n: H`<code>undefined * undefined</code> não é um número: dá <code>NaN</code>.` },
      { l: 9, pop: true, o: 'NaN\n', n: 'Em C ou C# isto nem compilava. Em JavaScript, o erro passa em silêncio.' },
    ],
  }, {
    title: 'Valor por omissão e âmbito',
    code: J`
function saudacao(nome = "aluno") {
  const msg = "Ola, " + nome;
  return msg;
}
console.log(saudacao("Ana"));
console.log(saudacao());
console.log(typeof msg);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'saudacao(nome = "aluno")'] }, d: { global: { saudacao: ['function', '@o1'] } }, n: 'Uma função com um valor por omissão.' },
      { l: 1, push: 'saudacao', d: { saudacao: { nome: ['string', '"Ana"'] } }, n: H`<code>saudacao("Ana")</code>: o parâmetro recebe "Ana".` },
      { l: 2, d: { saudacao: { msg: ['string', '"Ola, Ana"'] } }, n: H`Uma <code>const</code> dentro da função: só existe aqui.` },
      { l: 5, pop: true, o: 'Ola, Ana\n', n: 'Devolve e escreve.' },
      { l: 1, push: 'saudacao', d: { saudacao: { nome: ['string', '"aluno"'] } }, n: H`Sem argumento, o <code>nome</code> fica com o valor por omissão.` },
      { l: 2, d: { saudacao: { msg: ['string', '"Ola, aluno"'] } }, n: 'A mensagem.' },
      { l: 6, pop: true, o: 'Ola, aluno\n', n: H`Em vez de <code>undefined</code>, aparece "aluno".` },
      { l: 7, o: 'undefined\n', n: H`Fora da função, <code>msg</code> não existe. (O <code>typeof</code> de uma variável que não existe dá "undefined"; usá-la diretamente daria um ReferenceError.)` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>return</code>: a função devolve <code>undefined</code>.`,
    H`Pôr chavetas numa função seta e esquecer o <code>return</code>: <code>(x) =&gt; { x * 2 }</code> devolve undefined.`,
    H`Chamar com argumentos a menos e não reparar: os que faltam ficam undefined e as contas dão NaN.`,
    H`Usar uma variável de dentro de uma função fora dela: <em>ReferenceError: msg is not defined</em>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
function f(x) {
  x * 2;
}
console.log(f(5));`, opts: ['10', 'undefined', '5', 'NaN'], ok: 1, mono: true, check: true,
      exp: H`A conta é feita, mas não há <code>return</code>: a função devolve <code>undefined</code>.` },
    { q: 'O que aparece no ecrã?', code: J`
const soma = (a, b) => a + b;
console.log(soma(2, 3), soma(2));`, opts: ['5 2', '5 NaN', '5 undefined', '5 TypeError'], ok: 1, mono: true, check: true,
      exp: H`Em <code>soma(2)</code>, o <code>b</code> fica undefined, e 2 + undefined dá <code>NaN</code>. Sem nenhum erro.` },
    { q: 'O que aparece no ecrã?', code: J`
function ola(nome = "mundo") {
  return "Ola, " + nome;
}
console.log(ola("Rui"));
console.log(ola());`, opts: ['Ola, Rui\nOla, mundo', 'Ola, Rui\nOla, undefined', 'Ola, Rui\nOla, ', 'Ola, mundo\nOla, mundo'], ok: 0, mono: true, check: true,
      exp: 'O valor por omissão só é usado quando o argumento falta.' },
    { q: 'O que aparece no ecrã?', code: J`
if (true) {
  let x = 5;
}
console.log(x);`, opts: ['5', 'undefined', 'ReferenceError: x is not defined', 'null'], ok: 2, mono: true, check: true,
      exp: H`Um <code>let</code> só existe dentro do bloco (das chavetas) onde foi criado. Fora dele, a variável não existe.` },
  ],
  exercises: [{
    title: 'Função ehPar',
    text: 'Escreve uma função ehPar(n) que devolve true se n for par. Usa-a para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`Como função seta: <code>const ehPar = (n) =&gt; n % 2 === 0;</code>`,
    solution: J`
const ehPar = (n) => n % 2 === 0;

for (let i = 1; i <= 4; i++) {
  if (ehPar(i)) {
    console.log(‵¤{i}: par‵);
  } else {
    console.log(‵¤{i}: impar‵);
  }
}`,
  }, {
    title: 'Área com valor por omissão',
    text: 'Escreve uma função area(largura, altura = largura) que dá a área de um retângulo; se só passares a largura, é um quadrado. Mostra area(3, 4) e area(5).',
    run: '12\n25\n',
    hint: H`Um parâmetro por omissão pode usar os anteriores: <code>altura = largura</code>.`,
    solution: J`
function area(largura, altura = largura) {
  return largura * altura;
}

console.log(area(3, 4));
console.log(area(5));`,
  }],
});
