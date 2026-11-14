// ===== TypeScript do Zero — conteúdo das lições (parte 1) =====
// Formato dos passos: o do visualizador de referências (ver o curso de JavaScript).
// Um exemplo com um erro de tipos não chega a correr: não tem frames (push) e o último passo mostra o erro
// do compilador no ecrã, com o: 'error TS2345: ...\n'. O check confirma que o compilador dá esse erro.
// No código, ‵ quer dizer ` e ¤{ quer dizer ${ (o J troca-os). No texto H`...`, usa &#96; e &#36;.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const J = (s, ...v) => C(s, ...v).replace(/‵/g, '`').replace(/¤\{/g, '${');
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Porquê TypeScript',
  short: 'JavaScript com tipos: o erro aparece antes de o programa correr',
  body: H`
<p>Lembras-te de que, em JavaScript, <code>"5" + 3</code> dava "53" sem nenhum aviso, e de que uma função chamada com os argumentos errados dava <code>NaN</code> em silêncio? O <strong>TypeScript</strong> é JavaScript com <strong>tipos</strong>: escreves o tipo de cada variável e parâmetro, e um <strong>compilador</strong> (o <code>tsc</code>) verifica tudo antes de o programa correr.</p>
<ul>
<li>Os tipos escrevem-se depois de dois pontos: <code>let idade: number = 19;</code>, <code>function soma(a: number, b: number): number</code>.</li>
<li>Se algo não bater certo, o compilador dá um erro (com um código, como <code>TS2345</code>) e o programa <strong>não corre</strong>. É como no C e no C#.</li>
<li>Se estiver tudo certo, o compilador tira os tipos e dá JavaScript normal, que corre no browser ou no Node. Os tipos só existem antes de correr.</li>
<li>Instala-se com <code>npm install -g typescript</code>; compila-se com <code>tsc programa.ts</code> e corre-se o <code>programa.js</code> que aparece.</li>
</ul>`,
  analogy: 'O TypeScript é um revisor que lê o teu trabalho antes da entrega. O JavaScript entregava tudo e só descobrias o erro quando o professor corrigia; o TypeScript devolve-to logo, com a linha marcada.',
  examples: [{
    title: 'O erro é apanhado antes de correr',
    code: J`
function soma(a: number, b: number): number {
  return a + b;
}

console.log(soma(2, 3));
console.log(soma("2", 3));`,
    steps: [
      { l: 1, n: H`A função diz que recebe dois <code>number</code> e devolve um <code>number</code>.` },
      { l: 5, n: H`<code>soma(2, 3)</code> está certo: dois números.` },
      { l: 6, o: "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.\n", n: H`Mas <code>"2"</code> é texto. O compilador recusa, e o programa <strong>não chega a correr</strong>: nem a linha 5, que estava certa, escreve nada (repara que a memória continua vazia). Em JavaScript isto dava "23" sem aviso.` },
    ],
  }, {
    title: 'Corrigido, já corre',
    code: J`
function soma(a: number, b: number): number {
  return a + b;
}

console.log(soma(2, 3));
console.log(soma(Number("2"), 3));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'soma(a: number, b: number): number'] }, d: { global: { soma: ['function', '@o1'] } }, n: 'Sem erros de tipos, o programa compila e corre.' },
      { l: 1, push: 'soma', d: { soma: { a: ['number', '2'], b: ['number', '3'] } }, n: H`<code>soma(2, 3)</code>.` },
      { l: 5, pop: true, o: '5\n', n: 'Devolve 5.' },
      { l: 1, push: 'soma', d: { soma: { a: ['number', '2'], b: ['number', '3'] } }, n: H`<code>Number("2")</code> converte o texto em número antes da chamada: agora o tipo bate certo.` },
      { l: 6, pop: true, o: '5\n', n: 'O resultado certo.' },
    ],
  }],
  mistakes: [
    H`Achar que os tipos existem a correr: o TypeScript tira-os todos ao compilar. Um <code>number</code> que vem de um formulário continua a ser texto se não o converteres.`,
    H`Ignorar os erros do compilador e correr o JavaScript na mesma: o objetivo é corrigi-los.`,
    H`Usar <code>any</code> para calar o compilador (lição 1): perde-se toda a verificação.`,
    H`Confundir o ficheiro <code>.ts</code> (o que escreves) com o <code>.js</code> (o que o compilador gera e o que corre).`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
let x: number = 5;
x = "cinco";
console.log(x);`, opts: ['cinco', '5', "error TS2322: Type 'string' is not assignable to type 'number'.", 'NaN'], ok: 2, mono: true, check: true,
      exp: H`<code>x</code> é um <code>number</code>, e o compilador não deixa guardar lá um texto. Em JavaScript, aparecia "cinco".` },
    { q: 'O que aparece no ecrã? (a primeira linha está certa)', code: J`
console.log("antes");
const n: number = "x";
console.log(n);`, opts: ['antes', "antes\nerror TS2322: Type 'string' is not assignable to type 'number'.", "error TS2322: Type 'string' is not assignable to type 'number'.", 'antes\nx'], ok: 2, mono: true, check: true,
      exp: 'O compilador verifica o ficheiro todo antes de qualquer coisa correr. Com um erro, nada corre: nem o "antes".' },
    { q: 'O que aparece no ecrã?', code: J`
const nota: number = 17;
console.log(nota + 1);`, opts: ['18', '171', "error TS2322: Type 'number' is not assignable to type 'string'.", 'nota + 1'], ok: 0, mono: true, check: true,
      exp: 'Os tipos batem certo: compila e corre como JavaScript normal.' },
    { q: 'Depois de compilado, o que acontece aos tipos (: number, : string...)?', opts: ['Ficam no JavaScript e são verificados a correr', 'Desaparecem: o JavaScript gerado não tem tipos', 'Passam a ser comentários', 'Tornam o programa mais rápido'], ok: 1,
      exp: 'Os tipos servem só ao compilador. O JavaScript que corre é igual ao que escreverias à mão, sem tipos.' },
  ],
  exercises: [{
    title: 'Função dobro',
    text: 'Escreve a função dobro(n: number): number e mostra dobro(4) e dobro(10).',
    run: '8\n20\n',
    hint: H`<code>function dobro(n: number): number { return n * 2; }</code>`,
    solution: J`
function dobro(n: number): number {
  return n * 2;
}

console.log(dobro(4));
console.log(dobro(10));`,
  }, {
    title: 'Média de três',
    text: 'Escreve media(a: number, b: number, c: number): number e mostra a média de 12, 15 e 14 com 2 casas decimais.',
    run: 'Media: 13.67\n',
    hint: H`Devolve <code>(a + b + c) / 3</code> e usa <code>toFixed(2)</code> ao mostrar.`,
    solution: J`
function media(a: number, b: number, c: number): number {
  return (a + b + c) / 3;
}

console.log("Media:", media(12, 15, 14).toFixed(2));`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Tipos básicos e inferência',
  short: 'string, number, boolean, o tipo que o compilador adivinha, e any',
  body: H`
<table class="t">
<thead><tr><th>Tipo</th><th>Valores</th></tr></thead>
<tbody>
<tr><td><code>number</code></td><td>todos os números (inteiros e reais, como em JavaScript)</td></tr>
<tr><td><code>string</code></td><td>texto</td></tr>
<tr><td><code>boolean</code></td><td><code>true</code> e <code>false</code></td></tr>
<tr><td><code>any</code></td><td>qualquer coisa, sem verificação nenhuma (evita)</td></tr>
</tbody>
</table>
<ul>
<li>Não precisas de escrever o tipo sempre: em <code>let idade = 19;</code> o compilador <strong>infere</strong> que é <code>number</code>, e a partir daí trata-a como tal.</li>
<li>Escreve os tipos onde o compilador não os consegue adivinhar (parâmetros de funções) e onde ajudam a ler.</li>
<li>O compilador também conhece os métodos de cada tipo: escrever <code>texto.toUppercase()</code> (com o C minúsculo) é um erro antes de correr, com uma sugestão do nome certo.</li>
<li><code>any</code> desliga a verificação para aquela variável. É uma porta de saída, não uma solução.</li>
</ul>`,
  analogy: 'A inferência é como um colega que vê o que pões numa caixa e lhe cola a etiqueta sozinho: se puseste livros, a etiqueta diz "livros", e daí para a frente avisa-te se tentares meter lá um sapato.',
  examples: [{
    title: 'Tipos escritos e tipos inferidos',
    code: J`
let nome: string = "Rita";
let idade = 19;
const ativo: boolean = true;
idade = idade + 1;
console.log(nome, idade, ativo);
console.log(typeof idade);`,
    steps: [
      { l: 1, push: 'global', d: { global: { nome: ['string', '"Rita"'] } }, n: H`O tipo escrito à mão: <code>: string</code>.` },
      { l: 2, d: { global: { idade: ['number', '19'] } }, n: H`Sem tipo escrito, o compilador infere <code>number</code> a partir do 19.` },
      { l: 3, d: { global: { ativo: ['boolean', 'true'] } }, n: 'Um booleano.' },
      { l: 4, u: { global: { idade: '20' } }, n: 'number + number é um number: tudo certo.' },
      { l: 5, o: 'Rita 20 true\n', n: 'Corre como JavaScript.' },
      { l: 6, o: 'number\n', n: H`O <code>typeof</code> é do JavaScript e corre a correr; os tipos do TypeScript já não existem nessa altura, mas aqui coincidem.` },
    ],
  }, {
    title: 'A inferência também protege',
    code: J`
let pontos = 10;
pontos = pontos + 5;
pontos = "dez";`,
    steps: [
      { l: 1, n: H`Ninguém escreveu o tipo, mas o compilador infere <code>number</code>.` },
      { l: 2, n: 'Somar um número a um number: certo.' },
      { l: 3, o: "error TS2322: Type 'string' is not assignable to type 'number'.\n", n: H`Guardar um texto numa variável que é number é um erro, mesmo sem nunca teres escrito <code>: number</code>. Em JavaScript isto passava, e o problema só aparecia mais tarde.` },
    ],
  }],
  mistakes: [
    H`Usar <code>any</code> quando o compilador se queixa: o erro deixa de aparecer, mas o problema continua lá.`,
    H`Escrever os tipos com maiúscula (<code>String</code>, <code>Number</code>): usa sempre <code>string</code>, <code>number</code>, <code>boolean</code>.`,
    H`Achar que <code>let x;</code> sem valor nem tipo fica com um tipo útil: fica <code>any</code>. Dá-lhe um tipo.`,
    H`Nomes mal escritos de métodos: <em>error TS2551: Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?</em> Lê a sugestão.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
let total = 0;
total = "zero";
console.log(total);`, opts: ['zero', '0', "error TS2322: Type 'string' is not assignable to type 'number'.", 'undefined'], ok: 2, mono: true, check: true,
      exp: H`O compilador inferiu <code>number</code> a partir do 0, por isso um texto não pode entrar.` },
    { q: 'O que aparece no ecrã?', code: J`
let v: any = 5;
v = "texto";
console.log(v.toUpperCase());`, opts: ['TEXTO', "error TS2322: Type 'string' is not assignable to type 'number'.", 'texto', "error TS2339: Property 'toUpperCase' does not exist on type 'any'."], ok: 0, mono: true, check: true,
      exp: H`Com <code>any</code>, o compilador não verifica nada: aceita a mudança de tipo e qualquer método. Aqui calhou funcionar.` },
    { q: 'O que acontece com este programa?', code: J`
let texto = "ola";
console.log(texto.toUppercase());`, opts: ['OLA', 'ola', "error TS2551: Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?", 'TypeError: texto.toUppercase is not a function'], ok: 2, mono: true, check: true,
      exp: H`O compilador sabe que métodos tem um texto, apanha o nome mal escrito e até sugere o certo. Em JavaScript só davas por isso a correr, com um TypeError.` },
    { q: 'O que aparece no ecrã?', code: J`
const n: number = 7 / 2;
console.log(n);`, opts: ['3', '3.5', "error TS2322: Type 'number' is not assignable to type 'int'.", '4'], ok: 1, mono: true, check: true,
      exp: H`Em TypeScript, como em JavaScript, só há <code>number</code>: 7 / 2 dá 3.5.` },
  ],
  exercises: [{
    title: 'Ficha de aluno',
    text: 'Cria as variáveis nome (string), numero (number) e inscrito (boolean) com tipos escritos, e mostra-as numa linha.',
    run: 'Ana 2026123 true\n',
    hint: H`<code>const nome: string = "Ana";</code>, e o mesmo para as outras.`,
    solution: J`
const nome: string = "Ana";
const numero: number = 2026123;
const inscrito: boolean = true;
console.log(nome, numero, inscrito);`,
  }, {
    title: 'Converter com tipos',
    text: 'Tens texto = "42" (como viria de um formulário). Cria valor: number com o número correspondente e mostra o dobro.',
    run: 'Dobro: 84\n',
    hint: H`<code>const valor: number = Number(texto);</code>. Sem o <code>Number</code>, o compilador não deixava.`,
    solution: J`
const texto: string = "42";
const valor: number = Number(texto);
console.log("Dobro:", valor * 2);`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Funções com tipos',
  short: 'tipos dos parâmetros e do resultado, parâmetros opcionais e void',
  body: H`
<pre class="snip"><code>function area(largura: number, altura: number): number {
  return largura * altura;
}
const dobro = (x: number): number =&gt; x * 2;</code></pre>
<ul>
<li>Os parâmetros levam sempre tipo (o compilador não os consegue adivinhar). O tipo do resultado vem depois dos parênteses, e também pode ser inferido.</li>
<li>Chamar com argumentos a mais ou a menos é um erro: <em>error TS2554: Expected 2 arguments, but got 1.</em></li>
<li>Um parâmetro <strong>opcional</strong> leva <code>?</code>: <code>function ola(nome: string, pontos?: number)</code>. Lá dentro pode ser <code>undefined</code>.</li>
<li>Uma função que não devolve nada tem resultado <code>void</code>.</li>
<li>Se prometes um <code>number</code>, todos os caminhos têm de devolver um: o compilador avisa se faltar um <code>return</code>.</li>
</ul>`,
  analogy: 'A assinatura de uma função tipada é a etiqueta de uma tomada: diz que ficha entra (os parâmetros) e que corrente sai (o resultado). O compilador não te deixa ligar a ficha errada.',
  examples: [{
    title: 'Um parâmetro opcional',
    code: J`
function saudacao(nome: string, pontos?: number): string {
  if (pontos === undefined) {
    return "Ola, " + nome;
  }
  return ‵Ola, ¤{nome}: ¤{pontos} pontos‵;
}
console.log(saudacao("Ana"));
console.log(saudacao("Rui", 12));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'saudacao(nome: string, pontos?: number): string'] }, d: { global: { saudacao: ['function', '@o1'] } }, n: H`O <code>?</code> diz que <code>pontos</code> pode não ser dado.` },
      { l: 1, push: 'saudacao', d: { saudacao: { nome: ['string', '"Ana"'], pontos: ['number | undefined', 'undefined'] } }, n: H`Sem o segundo argumento, <code>pontos</code> fica <code>undefined</code>. O tipo dele, lá dentro, é <code>number | undefined</code>.` },
      { l: 3, n: 'O if trata o caso de não haver pontos.' },
      { l: 7, pop: true, o: 'Ola, Ana\n', n: 'Devolve só a saudação.' },
      { l: 1, push: 'saudacao', d: { saudacao: { nome: ['string', '"Rui"'], pontos: ['number | undefined', '12'] } }, n: 'Agora com pontos.' },
      { l: 5, n: 'Passa o if e devolve o texto completo.' },
      { l: 8, pop: true, o: 'Ola, Rui: 12 pontos\n', n: 'As duas chamadas são válidas.' },
    ],
  }, {
    title: 'Argumentos a menos',
    code: J`
function area(largura: number, altura: number): number {
  return largura * altura;
}
console.log(area(3));`,
    steps: [
      { l: 1, n: 'A função precisa de dois números.' },
      { l: 4, o: 'error TS2554: Expected 2 arguments, but got 1.\n', n: H`Em JavaScript, <code>area(3)</code> dava NaN em silêncio (a altura ficava undefined). O TypeScript não deixa: ou passas os dois, ou marcas a altura como opcional.` },
    ],
  }],
  mistakes: [
    H`Esquecer o tipo de um parâmetro: com <code>strict</code>, dá <em>error TS7006: Parameter 'x' implicitly has an 'any' type.</em>`,
    H`Esquecer um <code>return</code> num dos caminhos: <em>error TS2366: Function lacks ending return statement...</em>`,
    H`Usar um parâmetro opcional sem tratar o caso <code>undefined</code>.`,
    H`Pôr os parâmetros opcionais antes dos obrigatórios: os opcionais vão no fim.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
function sinal(x: number): string {
  if (x > 0) {
    return "positivo";
  }
}
console.log(sinal(3));`, opts: ['positivo', 'undefined', "error TS2366: Function lacks ending return statement and return type does not include 'undefined'.", 'error TS2554: Expected 2 arguments, but got 1.'], ok: 2, mono: true, check: true,
      exp: 'Se x não for positivo, a função chega ao fim sem devolver nada, e prometeu sempre uma string. O compilador obriga a tratar esse caso.' },
    { q: 'O que aparece no ecrã?', code: J`
const dobro = (x: number): number => x * 2;
console.log(dobro(4), dobro(dobro(1)));`, opts: ['8 4', '8 2', '4 4', 'error TS2554: Expected 1 arguments, but got 2.'], ok: 0, mono: true, check: true,
      exp: 'dobro(4) = 8 e dobro(dobro(1)) = dobro(2) = 4. Os tipos batem certo.' },
    { q: 'O que acontece com este programa?', code: J`
function ola(nome: string): string {
  return "Ola, " + nome;
}
console.log(ola(42));`, opts: ['Ola, 42', "error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.", 'Ola, nome', 'NaN'], ok: 1, mono: true, check: true,
      exp: H`O parâmetro é <code>string</code> e recebeu um número. Em JavaScript dava "Ola, 42"; aqui é um erro, porque provavelmente não era isso que querias.` },
    { q: 'O que aparece no ecrã?', code: J`
function mostra(texto: string): void {
  console.log("-> " + texto);
}
const r = mostra("ola");
console.log(r);`, opts: ['-> ola\nundefined', '-> ola\nvoid', '-> ola', 'undefined'], ok: 0, mono: true, check: true,
      exp: H`Uma função <code>void</code> não devolve nada; a correr, isso é <code>undefined</code>.` },
  ],
  exercises: [{
    title: 'Função ehPar',
    text: 'Escreve ehPar(n: number): boolean e usa-a para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`<code>const ehPar = (n: number): boolean =&gt; n % 2 === 0;</code>`,
    solution: J`
const ehPar = (n: number): boolean => n % 2 === 0;

for (let i = 1; i <= 4; i++) {
  console.log(‵¤{i}: ¤{ehPar(i) ? "par" : "impar"}‵);
}`,
  }, {
    title: 'Preço com desconto opcional',
    text: 'Escreve preco(valor: number, desconto?: number): number, que aplica a percentagem de desconto se ela for dada. Mostra preco(50) e preco(50, 20).',
    run: '50\n40\n',
    hint: H`Se <code>desconto === undefined</code>, devolve o valor; senão, <code>valor * (1 - desconto / 100)</code>.`,
    solution: J`
function preco(valor: number, desconto?: number): number {
  if (desconto === undefined) {
    return valor;
  }
  return valor * (1 - desconto / 100);
}

console.log(preco(50));
console.log(preco(50, 20));`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Arrays e tuplos',
  short: 'number[], métodos com tipos e pares com tipos fixos',
  body: H`
<ul>
<li>Um array de números é <code>number[]</code> (ou <code>Array&lt;number&gt;</code>); de textos, <code>string[]</code>. Só aceita elementos desse tipo.</li>
<li>Os métodos sabem os tipos: <code>notas.map(n =&gt; n.toFixed(1))</code> dá um <code>string[]</code>, e o compilador sabe-o sem lho dizeres.</li>
<li>Dentro de um <code>filter</code> ou <code>map</code>, o parâmetro da função seta já tem o tipo dos elementos: não precisas de o escrever.</li>
<li>Um <strong>tuplo</strong> é um array de tamanho fixo em que cada posição tem o seu tipo: <code>const par: [string, number] = ["Ana", 17];</code>.</li>
<li>Os arrays continuam a ser objetos no heap: <code>const b = a</code> partilha o mesmo array, como em JavaScript.</li>
</ul>`,
  analogy: 'Um number[] é uma caixa de ovos: só leva ovos, quantos couberem. Um tuplo [string, number] é uma caixa de almoço com dois compartimentos de formas diferentes: um para a sandes, outro para a fruta.',
  examples: [{
    title: 'Métodos que sabem os tipos',
    code: J`
const notas: number[] = [12, 17, 9];
notas.push(15);
const positivas = notas.filter((n) => n >= 10);
const textos = positivas.map((n) => ‵nota ¤{n}‵);
console.log(positivas, textos);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['number[]', ['12', '17', '9']] }, d: { global: { notas: ['number[]', '@o1'] } }, n: 'Um array que só aceita números.' },
      { l: 2, obj: { o1: ['number[]', ['12', '17', '9', '15']] }, n: H`<code>push(15)</code>: um number, certo.` },
      { l: 3, obj: { o2: ['number[]', ['12', '17', '15']] }, d: { global: { positivas: ['number[]', '@o2'] } }, n: H`O <code>filter</code> de um <code>number[]</code> dá um <code>number[]</code>. Dentro da seta, <code>n</code> já é number sem o escreveres.` },
      { l: 4, obj: { o3: ['string[]', ['"nota 12"', '"nota 17"', '"nota 15"']] }, d: { global: { textos: ['string[]', '@o3'] } }, n: H`O <code>map</code> que devolve texto dá um <code>string[]</code>: o compilador inferiu-o.` },
      { l: 5, o: "[ 12, 17, 15 ] [ 'nota 12', 'nota 17', 'nota 15' ]\n", n: 'A correr, é JavaScript normal.' },
    ],
  }, {
    title: 'O tipo errado não entra',
    code: J`
const nomes: string[] = ["Ana", "Rui"];
nomes.push("Ines");
nomes.push(3);`,
    steps: [
      { l: 1, n: H`Um <code>string[]</code>.` },
      { l: 2, n: 'Um texto: certo.' },
      { l: 3, o: "error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.\n", n: H`Um número num array de textos é recusado. Em JavaScript entrava, e um <code>toUpperCase()</code> mais à frente rebentava.` },
    ],
  }],
  mistakes: [
    H`Criar um array vazio sem tipo (<code>const v = [];</code>) e depois estranhar os erros: escreve <code>const v: number[] = [];</code>.`,
    H`Confundir <code>string[]</code> (array de textos) com <code>[string]</code> (tuplo com um só texto).`,
    H`Aceder a um índice que pode não existir e usar o resultado como se existisse: <code>v[10]</code> continua a dar undefined a correr.`,
    H`Esperar que o tipo impeça o <code>push</code> num array <code>const</code>: só impede o tipo errado. Para um array que não muda, usa <code>readonly number[]</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
const par: [string, number] = ["Ana", 17];
console.log(par[0], par[1] + 1);`, opts: ['Ana 18', 'Ana 171', 'error TS2322', '[ Ana, 17 ] 1'], ok: 0, mono: true, check: true,
      exp: H`No tuplo, a posição 0 é texto e a 1 é número: <code>par[1] + 1</code> é uma soma, 18.` },
    { q: 'O que acontece com este programa?', code: J`
const par: [string, number] = ["Ana", "17"];
console.log(par);`, opts: ["[ 'Ana', '17' ]", "error TS2322: Type 'string' is not assignable to type 'number'.", "[ 'Ana', 17 ]", 'error TS2345'], ok: 1, mono: true, check: true,
      exp: 'A segunda posição do tuplo tem de ser um number, e "17" é texto.' },
    { q: 'O que aparece no ecrã?', code: J`
const v = [1, 2, 3];
const t = v.map((x) => x.toFixed(1));
console.log(t);`, opts: ["[ '1.0', '2.0', '3.0' ]", '[ 1, 2, 3 ]', '[ 1.0, 2.0, 3.0 ]', 'error TS2339'], ok: 0, mono: true, check: true,
      exp: H`<code>toFixed</code> devolve texto, por isso o resultado é um <code>string[]</code> (e o Node mostra os textos entre plicas).` },
    { q: 'O que acontece com este programa?', code: J`
const notas: number[] = [];
notas.push(12);
notas.push("treze");
console.log(notas.length);`, opts: ['2', '1', "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.", '0'], ok: 2, mono: true, check: true,
      exp: H`O array é <code>number[]</code>, por isso o compilador recusa o texto. Como há um erro, nada corre.` },
  ],
  exercises: [{
    title: 'Média de um array',
    text: 'Escreve media(v: number[]): number e mostra a média de [12, 8, 15, 9, 18].',
    run: 'Media: 12.4\n',
    hint: H`<code>v.reduce((s, x) =&gt; s + x, 0) / v.length</code>.`,
    solution: J`
function media(v: number[]): number {
  return v.reduce((s, x) => s + x, 0) / v.length;
}

console.log("Media:", media([12, 8, 15, 9, 18]));`,
  }, {
    title: 'Nomes e tamanhos',
    text: 'Com nomes: string[] = ["Ana", "Rui", "Ines"], cria um array de tuplos [string, number] com cada nome e o seu número de letras, e mostra-o.',
    run: "[ [ 'Ana', 3 ], [ 'Rui', 3 ], [ 'Ines', 4 ] ]\n",
    hint: H`<code>const pares: [string, number][] = nomes.map((n) =&gt; [n, n.length]);</code>`,
    solution: J`
const nomes: string[] = ["Ana", "Rui", "Ines"];
const pares: [string, number][] = nomes.map((n) => [n, n.length]);
console.log(pares);`,
  }],
});
