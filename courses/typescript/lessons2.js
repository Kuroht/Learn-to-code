// ===== TypeScript do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Objetos e interfaces',
  short: 'interface, type, propriedades opcionais e o que o compilador verifica',
  body: H`
<p>Em JavaScript, um objeto podia ter qualquer forma. Em TypeScript descreves a forma com uma <strong>interface</strong> (ou um <code>type</code>, quase igual), e o compilador verifica cada objeto:</p>
<pre class="snip"><code>interface Aluno {
  nome: string;
  nota: number;
  email?: string;   // opcional
}</code></pre>
<ul>
<li>Um objeto do tipo <code>Aluno</code> tem de ter todas as propriedades obrigatórias, com os tipos certos.</li>
<li>Escrever uma propriedade que não está na interface, ou ler uma mal escrita, é um erro antes de correr.</li>
<li>Uma propriedade com <code>?</code> pode faltar; ler uma que falta dá <code>undefined</code>, como em JavaScript.</li>
<li><code>type Aluno = { nome: string; nota: number };</code> faz o mesmo. Usa um ou outro, mas sê consistente.</li>
<li>A interface desaparece ao compilar: é só uma descrição para o compilador.</li>
</ul>`,
  analogy: 'Uma interface é o formulário em branco com os campos obrigatórios marcados com asterisco. O compilador é o funcionário que não aceita um formulário com um campo obrigatório vazio, ou com um campo que nem existe no impresso.',
  examples: [{
    title: 'Uma interface com um campo opcional',
    code: J`
interface Aluno {
  nome: string;
  nota: number;
  email?: string;
}

const a: Aluno = { nome: "Ana", nota: 17 };
const b: Aluno = { nome: "Rui", nota: 9, email: "rui@exemplo.pt" };
console.log(a.nome, a.email);
console.log(b.email);`,
    steps: [
      { l: 1, push: 'global', n: 'A interface descreve a forma de um aluno. Não cria nada a correr.' },
      { l: 7, obj: { o1: ['Aluno', { nome: '"Ana"', nota: '17' }] }, d: { global: { a: ['Aluno', '@o1'] } }, n: H`Tem o nome e a nota; o email é opcional e pode faltar.` },
      { l: 8, obj: { o2: ['Aluno', { nome: '"Rui"', nota: '9', email: '"rui@exemplo.pt"' }] }, d: { global: { b: ['Aluno', '@o2'] } }, n: 'Este tem o email.' },
      { l: 9, o: 'Ana undefined\n', n: H`Ler o email que falta dá <code>undefined</code>. O compilador sabe que <code>a.email</code> é <code>string | undefined</code>.` },
      { l: 10, o: 'rui@exemplo.pt\n', n: 'O do Rui.' },
    ],
  }, {
    title: 'Falta uma propriedade',
    code: J`
interface Aluno {
  nome: string;
  nota: number;
}

const c: Aluno = { nome: "Ines" };`,
    steps: [
      { l: 1, n: 'Um aluno tem de ter nome e nota.' },
      { l: 6, o: "error TS2741: Property 'nota' is missing in type '{ nome: string; }' but required in type 'Aluno'.\n", n: 'Falta a nota, que é obrigatória. O compilador diz qual é e onde foi declarada.' },
    ],
  }],
  mistakes: [
    H`Esquecer uma propriedade obrigatória: <em>error TS2741: Property 'nota' is missing...</em>`,
    H`Escrever uma propriedade que não está na interface: <em>error TS2353: Object literal may only specify known properties...</em>`,
    H`Usar uma propriedade opcional como se existisse sempre: trata o caso de ser undefined.`,
    H`Separar as propriedades da interface com vírgulas e esquecer o tipo: dentro da interface é <code>nome: string;</code>.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
interface Aluno {
  nome: string;
  nota: number;
}
const a: Aluno = { nome: "Ana", nota: 17, curso: "LEI" };
console.log(a.nome);`, opts: ['Ana', "error TS2353: Object literal may only specify known properties, and 'curso' does not exist in type 'Aluno'.", "error TS2741: Property 'curso' is missing in type 'Aluno'.", 'LEI'], ok: 1, mono: true, check: true,
      exp: H`A interface não tem <code>curso</code>. Provavelmente é um engano (ou falta acrescentá-lo à interface), e o compilador avisa.` },
    { q: 'O que acontece com este programa?', code: J`
interface Aluno {
  nome: string;
  nota: number;
}
const a: Aluno = { nome: "Ana", nota: 17 };
console.log(a.notas);`, opts: ['17', 'undefined', "error TS2551: Property 'notas' does not exist on type 'Aluno'. Did you mean 'nota'?", 'NaN'], ok: 2, mono: true, check: true,
      exp: 'Em JavaScript, a.notas dava undefined sem aviso. O compilador conhece as propriedades de um Aluno e sugere a certa.' },
    { q: 'O que aparece no ecrã?', code: J`
type Ponto = { x: number; y: number };
function soma(p: Ponto): number {
  return p.x + p.y;
}
console.log(soma({ x: 3, y: 4 }));`, opts: ['7', '34', "error TS2345: Argument of type '{ x: number; y: number; }' is not assignable to parameter of type 'Ponto'.", 'undefined'], ok: 0, mono: true, check: true,
      exp: H`O objeto tem exatamente a forma de um Ponto, por isso é aceite (não precisa de ser "declarado" como Ponto antes).` },
    { q: 'Qual é a diferença entre nome: string e nome?: string numa interface?', opts: ['Nenhuma', 'Com ? a propriedade pode faltar, e o seu tipo passa a incluir undefined', 'Com ? a propriedade não pode mudar', 'Com ? é um número'], ok: 1,
      exp: H`O <code>?</code> torna a propriedade opcional. Quem a lê tem de contar com <code>undefined</code>.` },
  ],
  exercises: [{
    title: 'Produtos',
    text: 'Define a interface Produto (nome: string, preco: number, qtd: number) e mostra o valor total de [Caneta 0.8 × 10, Caderno 2.5 × 4, Mochila 25 × 1].',
    run: 'Total: 43\n',
    hint: H`<code>const produtos: Produto[] = [...]</code> e um <code>reduce</code> ou um for...of.`,
    solution: J`
interface Produto {
  nome: string;
  preco: number;
  qtd: number;
}

const produtos: Produto[] = [
  { nome: "Caneta", preco: 0.8, qtd: 10 },
  { nome: "Caderno", preco: 2.5, qtd: 4 },
  { nome: "Mochila", preco: 25, qtd: 1 },
];
const total = produtos.reduce((s, p) => s + p.preco * p.qtd, 0);
console.log("Total:", total);`,
  }, {
    title: 'Quem passou',
    text: 'Com a interface Aluno (nome, nota) e a turma [Ana 17, Rui 9, Ines 14], escreve aprovado(a: Aluno): boolean e mostra os nomes dos aprovados.',
    run: "[ 'Ana', 'Ines' ]\n",
    hint: H`<code>turma.filter(aprovado).map((a) =&gt; a.nome)</code>`,
    solution: J`
interface Aluno {
  nome: string;
  nota: number;
}

const aprovado = (a: Aluno): boolean => a.nota >= 10;

const turma: Aluno[] = [
  { nome: "Ana", nota: 17 },
  { nome: "Rui", nota: 9 },
  { nome: "Ines", nota: 14 },
];
console.log(turma.filter(aprovado).map((a) => a.nome));`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Uniões e estreitamento',
  short: 'number | string, typeof, valores que podem ser undefined e tipos literais',
  body: H`
<p>Um valor que pode ser de vários tipos escreve-se com uma <strong>união</strong>: <code>number | string</code>. O compilador só te deixa usar o que é comum a todos os tipos da união, até provares qual é.</p>
<ul>
<li>Um <code>if (typeof valor === "number")</code> <strong>estreita</strong> o tipo: lá dentro, o compilador sabe que é um number; depois, que é uma string.</li>
<li>Muitas funções podem não encontrar nada e devolvem <code>T | undefined</code> (o <code>find</code>, por exemplo). Usar o resultado sem testar é um erro: <em>'r' is possibly 'undefined'</em>. É o "apontador nulo" do C, apanhado antes de correr.</li>
<li><code>r?.length</code> só lê se <code>r</code> existir (senão dá undefined), e <code>r ?? "nada"</code> dá um valor por omissão.</li>
<li>Uma união de textos fixos é um <strong>tipo literal</strong>: <code>type Tema = "claro" | "escuro";</code> só aceita esses dois valores.</li>
</ul>`,
  analogy: 'Uma variável number | string é uma caixa fechada que pode ter uma maçã ou uma laranja. Não a podes descascar como laranja sem primeiro espreitar lá para dentro: o typeof é o espreitar.',
  examples: [{
    title: 'Estreitar com typeof',
    code: J`
function descreve(valor: number | string): string {
  if (typeof valor === "number") {
    return "numero com dobro " + valor * 2;
  }
  return "texto com " + valor.length + " letras";
}
console.log(descreve(21));
console.log(descreve("ola"));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'descreve(valor: number | string): string'] }, d: { global: { descreve: ['function', '@o1'] } }, n: H`O parâmetro pode ser um número ou um texto.` },
      { l: 1, push: 'descreve', d: { descreve: { valor: ['number | string', '21'] } }, n: H`<code>descreve(21)</code>.` },
      { l: 3, n: H`Dentro do <code>if (typeof valor === "number")</code>, o compilador sabe que é um number, por isso deixa fazer <code>valor * 2</code>.` },
      { l: 7, pop: true, o: 'numero com dobro 42\n', n: 'Devolve o texto.' },
      { l: 1, push: 'descreve', d: { descreve: { valor: ['number | string', '"ola"'] } }, n: 'Agora um texto.' },
      { l: 5, n: H`Depois do if, só pode ser uma string: o compilador deixa usar <code>valor.length</code>. Fora destes testes, nem um nem outro era permitido.` },
      { l: 8, pop: true, o: 'texto com 3 letras\n', n: 'Os dois casos tratados, sem erros.' },
    ],
  }, {
    title: 'Pode ser undefined',
    code: J`
function procura(nomes: string[], letra: string): string | undefined {
  return nomes.find((n) => n.startsWith(letra));
}
const r = procura(["Ana", "Rui"], "Z");
console.log(r.toUpperCase());`,
    steps: [
      { l: 1, n: H`O <code>find</code> pode não encontrar nada, por isso a função devolve <code>string | undefined</code>.` },
      { l: 4, n: H`<code>r</code> é <code>string | undefined</code>.` },
      { l: 5, o: "error TS18048: 'r' is possibly 'undefined'.\n", n: H`Usar <code>r</code> como texto sem testar é recusado. Em JavaScript, isto só falhava a correr, com "Cannot read properties of undefined". A correção: <code>if (r !== undefined)</code>, ou <code>r?.toUpperCase()</code>.` },
    ],
  }],
  mistakes: [
    H`Usar um método de um só dos tipos da união sem estreitar: <em>error TS2339: Property 'toFixed' does not exist on type 'string | number'.</em>`,
    H`Ignorar o <em>possibly 'undefined'</em> com um <code>!</code> (<code>r!.length</code>): calas o compilador, mas o erro a correr continua possível.`,
    H`Escrever um valor fora de um tipo literal (<code>"azul"</code> num <code>Tema</code>).`,
    H`Testar com <code>if (r)</code> quando um 0 ou um "" são valores válidos: são falsy. Compara com <code>!== undefined</code>.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
type Tema = "claro" | "escuro";
let t: Tema = "claro";
t = "azul";
console.log(t);`, opts: ['azul', 'claro', "error TS2322: Type '\"azul\"' is not assignable to type 'Tema'.", 'escuro'], ok: 2, mono: true, check: true,
      exp: H`Um <code>Tema</code> só pode ser "claro" ou "escuro". Um engano de escrita num destes valores é apanhado logo.` },
    { q: 'O que aparece no ecrã?', code: J`
function tamanho(t: string | undefined): number {
  if (t === undefined) {
    return 0;
  }
  return t.length;
}
console.log(tamanho("ola"), tamanho(undefined));`, opts: ['3 0', '3 undefined', "error TS18048: 't' is possibly 'undefined'.", '3 NaN'], ok: 0, mono: true, check: true,
      exp: H`Depois do <code>if</code> que trata o undefined, o compilador sabe que <code>t</code> é uma string: compila e corre.` },
    { q: 'O que acontece com este programa?', code: J`
function arredonda(v: number | string): string {
  return v.toFixed(1);
}
console.log(arredonda(2.345));`, opts: ['2.3', '2.345', "error TS2339: Property 'toFixed' does not exist on type 'string | number'.", "error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'."], ok: 2, mono: true, check: true,
      exp: H`<code>toFixed</code> só existe nos números, e <code>v</code> pode ser texto. Primeiro estreita com <code>typeof v === "number"</code>.` },
    { q: 'O que aparece no ecrã?', code: J`
const nomes: string[] = ["Ana", "Rui"];
const r = nomes.find((n) => n.startsWith("Z"));
console.log(r?.length, r ?? "nenhum");`, opts: ['undefined nenhum', '0 nenhum', "error TS18048: 'r' is possibly 'undefined'.", 'null nenhum'], ok: 0, mono: true, check: true,
      exp: H`<code>r?.length</code> só lê se <code>r</code> existir; como não existe, dá undefined. <code>r ?? "nenhum"</code> dá o valor por omissão quando r é undefined (ou null).` },
  ],
  exercises: [{
    title: 'Formatar um valor',
    text: 'Escreve formata(v: number | string): string, que mostra os números com 2 casas decimais e os textos em maiúsculas. Mostra formata(3.14159) e formata("ola").',
    run: '3.14\nOLA\n',
    hint: H`<code>if (typeof v === "number") return v.toFixed(2);</code> e depois <code>return v.toUpperCase();</code>.`,
    solution: J`
function formata(v: number | string): string {
  if (typeof v === "number") {
    return v.toFixed(2);
  }
  return v.toUpperCase();
}

console.log(formata(3.14159));
console.log(formata("ola"));`,
  }, {
    title: 'Trocar de tema',
    text: 'Define type Tema = "claro" | "escuro" e escreve troca(t: Tema): Tema, que devolve o outro tema. Mostra troca("claro") e troca(troca("claro")).',
    run: 'escuro\nclaro\n',
    hint: H`<code>return t === "claro" ? "escuro" : "claro";</code>`,
    solution: J`
type Tema = "claro" | "escuro";

function troca(t: Tema): Tema {
  return t === "claro" ? "escuro" : "claro";
}

console.log(troca("claro"));
console.log(troca(troca("claro")));`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Referências e readonly',
  short: 'objetos partilhados, cópias e propriedades que não podem mudar',
  body: H`
<p>Os tipos não mudam a forma como os objetos funcionam a correr: continuam a ser <strong>referências</strong>, como em JavaScript. <code>const q = p</code> dá um segundo nome ao mesmo objeto, e uma função que recebe um objeto pode mudá-lo.</p>
<p>O que o TypeScript acrescenta é a possibilidade de dizer que algo <strong>não deve mudar</strong>, e de o compilador o garantir:</p>
<ul>
<li><code>readonly</code> numa propriedade: só se pode dar valor ao criar o objeto. Mudar depois é um erro.</li>
<li><code>readonly number[]</code> (ou <code>ReadonlyArray&lt;number&gt;</code>): um array sem <code>push</code>, <code>pop</code> nem <code>sort</code>.</li>
<li><code>Readonly&lt;Aluno&gt;</code> torna todas as propriedades de um tipo readonly.</li>
</ul>
<p>Uma função que recebe um <code>readonly</code> promete não mudar os teus dados, e o compilador obriga-a a cumprir.</p>`,
  analogy: 'Passar um objeto a uma função é emprestar o caderno. readonly é emprestá-lo plastificado: pode ser lido à vontade, mas ninguém lhe consegue escrever por cima.',
  examples: [{
    title: 'Um objeto, dois nomes, e uma cópia',
    code: J`
interface Ponto {
  x: number;
  y: number;
}
const p: Ponto = { x: 1, y: 2 };
const q = p;
q.x = 10;
const r: Ponto = { ...p };
r.y = 20;
console.log(p, r);`,
    steps: [
      { l: 5, push: 'global', obj: { o1: ['Ponto', { x: '1', y: '2' }] }, d: { global: { p: ['Ponto', '@o1'] } }, n: 'Um ponto, no heap.' },
      { l: 6, d: { global: { q: ['Ponto', '@o1'] } }, n: H`<code>q = p</code>: um segundo nome para o mesmo objeto. Os tipos não mudam isto.` },
      { l: 7, obj: { o1: ['Ponto', { x: '10', y: '2' }] }, n: H`Mudar através do <code>q</code> muda o objeto do <code>p</code>.` },
      { l: 8, obj: { o2: ['Ponto', { x: '10', y: '2' }] }, d: { global: { r: ['Ponto', '@o2'] } }, n: H`<code>{ ...p }</code> cria um objeto novo com as mesmas propriedades.` },
      { l: 9, obj: { o2: ['Ponto', { x: '10', y: '20' }] }, n: 'Mudar a cópia não mexe no original.' },
      { l: 10, o: '{ x: 10, y: 2 } { x: 10, y: 20 }\n', n: 'O p tem o x mudado pelo q; o r é independente.' },
    ],
  }, {
    title: 'readonly não deixa mudar',
    code: J`
interface Config {
  readonly versao: number;
  nome: string;
}
const c: Config = { versao: 1, nome: "app" };
c.nome = "site";
c.versao = 2;`,
    steps: [
      { l: 2, n: H`<code>versao</code> só pode receber valor quando o objeto é criado.` },
      { l: 5, n: 'Criar o objeto com os dois valores: certo.' },
      { l: 6, n: H`Mudar o <code>nome</code> é permitido.` },
      { l: 7, o: "error TS2540: Cannot assign to 'versao' because it is a read-only property.\n", n: H`Mudar a <code>versao</code> não. Atenção: isto só existe para o compilador; a correr, o JavaScript deixaria.` },
    ],
  }],
  mistakes: [
    H`Achar que os tipos fazem cópias: <code>const q: Ponto = p</code> continua a ser o mesmo objeto.`,
    H`Achar que <code>readonly</code> protege a correr: é só uma verificação do compilador.`,
    H`Esquecer que <code>{ ...p }</code> é uma cópia rasa: objetos dentro de objetos continuam partilhados.`,
    H`Confundir <code>const</code> (a variável não aponta para outro objeto) com <code>readonly</code> (a propriedade não muda).`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
interface Aluno {
  nome: string;
  nota: number;
}
function aumenta(a: Aluno): void {
  a.nota += 1;
}
const x: Aluno = { nome: "Rui", nota: 9 };
aumenta(x);
console.log(x.nota);`, opts: ['9', '10', "error TS2540: Cannot assign to 'nota' because it is a read-only property.", 'undefined'], ok: 1, mono: true, check: true,
      exp: 'A função recebe uma referência para o mesmo objeto e muda-o. Os tipos não impedem isso (a não ser que uses readonly).' },
    { q: 'O que acontece com este programa?', code: J`
const notas: readonly number[] = [12, 15];
notas.push(18);
console.log(notas.length);`, opts: ['3', '2', "error TS2339: Property 'push' does not exist on type 'readonly number[]'.", "error TS2540: Cannot assign to 'notas' because it is a read-only property."], ok: 2, mono: true, check: true,
      exp: H`Um <code>readonly number[]</code> simplesmente não tem os métodos que mudam o array. Pode ser lido (<code>notas[0]</code>, <code>map</code>, <code>filter</code>), mas não mudado.` },
    { q: 'O que aparece no ecrã?', code: J`
const a = { n: 1 };
const b = { n: 1 };
console.log(a === b, a.n === b.n);`, opts: ['true true', 'false true', 'false false', 'true false'], ok: 1, mono: true, check: true,
      exp: 'São dois objetos diferentes (=== compara referências), com propriedades iguais (=== entre números compara valores).' },
    { q: 'O que aparece no ecrã?', code: J`
interface Ponto {
  readonly x: number;
}
const p: Ponto = { x: 1 };
const q: Ponto = { ...p, x: 5 };
console.log(p.x, q.x);`, opts: ['1 5', '5 5', "error TS2540: Cannot assign to 'x' because it is a read-only property.", '1 1'], ok: 0, mono: true, check: true,
      exp: H`Não se muda o <code>x</code> do p: cria-se um objeto <strong>novo</strong>, com as propriedades do p e um x diferente. É a forma normal de "mudar" dados readonly.` },
  ],
  exercises: [{
    title: 'Dar bónus sem estragar',
    text: 'Com a interface Aluno (nome, nota), escreve comBonus(a: Readonly<Aluno>, bonus: number): Aluno, que devolve um aluno novo com a nota aumentada, sem mudar o original. Mostra os dois.',
    run: "{ nome: 'Rui', nota: 9 } { nome: 'Rui', nota: 11 }\n",
    hint: H`<code>return { ...a, nota: a.nota + bonus };</code>. Com <code>Readonly</code>, o compilador nem te deixava fazer <code>a.nota += bonus</code>.`,
    solution: J`
interface Aluno {
  nome: string;
  nota: number;
}

function comBonus(a: Readonly<Aluno>, bonus: number): Aluno {
  return { ...a, nota: a.nota + bonus };
}

const rui: Aluno = { nome: "Rui", nota: 9 };
const novo = comBonus(rui, 2);
console.log(rui, novo);`,
  }, {
    title: 'Soma sem mudar',
    text: 'Escreve soma(v: readonly number[]): number e mostra a soma de [4, 8, 15]. A função não pode mudar o array (o compilador garante-o).',
    run: '27\n',
    hint: H`<code>v.reduce((s, x) =&gt; s + x, 0)</code> funciona num array readonly: não o muda.`,
    solution: J`
function soma(v: readonly number[]): number {
  return v.reduce((s, x) => s + x, 0);
}

console.log(soma([4, 8, 15]));`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Classes com tipos',
  short: 'propriedades tipadas, private, readonly e implements',
  body: H`
<p>As classes são as do JavaScript, com tipos e com controlo de acesso, como no C#:</p>
<pre class="snip"><code>class Conta {
  titular: string;
  private saldo: number = 0;

  constructor(titular: string) {
    this.titular = titular;
  }
  depositar(valor: number): void {
    this.saldo += valor;
  }
}</code></pre>
<ul>
<li>As propriedades declaram-se no topo da classe, com o tipo.</li>
<li><code>private</code>: só o código da classe lhe pode mexer. <code>readonly</code>: só se dá valor no constructor.</li>
<li><code>class Quadrado implements Forma</code> promete cumprir uma interface; se faltar um método, não compila.</li>
<li>Como os tipos, o <code>private</code> só existe para o compilador. (O JavaScript moderno tem campos realmente privados, com <code>#saldo</code>.)</li>
</ul>`,
  analogy: 'Uma classe com private é uma caixa multibanco: tens botões públicos (depositar, ver o saldo), mas não tens acesso ao cofre lá dentro. O compilador é o segurança que não te deixa abrir a parte de trás.',
  examples: [{
    title: 'Uma conta com saldo privado',
    code: J`
class Conta {
  titular: string;
  private saldo: number = 0;

  constructor(titular: string) {
    this.titular = titular;
  }

  depositar(valor: number): void {
    this.saldo += valor;
  }

  verSaldo(): number {
    return this.saldo;
  }
}

const c = new Conta("Ana");
c.depositar(50);
c.depositar(20);
console.log(c.titular, c.verSaldo());`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['class', 'Conta'] }, d: { global: { Conta: ['class', '@o1'] } }, n: 'A classe, com as propriedades declaradas e tipadas no topo.' },
      { l: 5, obj: { o2: ['Conta', { titular: 'undefined', saldo: '0' }] }, push: 'constructor', d: { constructor: { this: ['Conta', '@o2'], titular: ['string', '"Ana"'] } }, n: H`<code>new Conta("Ana")</code> cria o objeto (o saldo já começa em 0, pelo <code>= 0</code>) e corre o constructor.` },
      { l: 6, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '0' }] }, n: 'O titular fica guardado.' },
      { l: 18, pop: true, d: { global: { c: ['Conta', '@o2'] } }, n: 'A conta pronta.' },
      { l: 10, push: 'depositar', d: { depositar: { this: ['Conta', '@o2'], valor: ['number', '50'] } }, n: H`Dentro da classe, o código pode mexer no <code>saldo</code> privado.` },
      { l: 10, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '50' }] }, n: 'saldo = 50' },
      { l: 20, pop: true, push: 'depositar', d: { depositar: { this: ['Conta', '@o2'], valor: ['number', '20'] } }, n: 'Segundo depósito.' },
      { l: 10, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '70' }] }, n: 'saldo = 70' },
      { l: 21, pop: true, o: 'Ana 70\n', n: H`Fora da classe, o saldo só se lê através do método público <code>verSaldo()</code>.` },
    ],
  }, {
    title: 'Mexer no que é privado',
    code: J`
class Conta {
  private saldo: number = 0;

  depositar(valor: number): void {
    this.saldo += valor;
  }
}

const c = new Conta();
c.saldo = 1000000;`,
    steps: [
      { l: 2, n: H`O saldo é <code>private</code>.` },
      { l: 9, n: 'Uma conta nova.' },
      { l: 10, o: "error TS2341: Property 'saldo' is private and only accessible within class 'Conta'.\n", n: 'Fora da classe, não se pode mudar o saldo diretamente: só através dos métodos, que podem validar o que entra.' },
    ],
  }],
  mistakes: [
    H`Esquecer de declarar a propriedade no topo da classe: <em>error TS2339: Property 'titular' does not exist on type 'Conta'.</em>`,
    H`Declarar uma propriedade sem valor e sem a preencher no constructor: com strict, <em>error TS2564: Property ... has no initializer</em>.`,
    H`Mexer num campo private fora da classe: <em>error TS2341</em>.`,
    H`Escrever <code>implements</code> e esquecer um método da interface: <em>error TS2420: Class ... incorrectly implements interface ...</em>`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
interface Forma {
  area(): number;
}
class Quadrado implements Forma {
  constructor(private lado: number) {}
}
console.log(new Quadrado(2));`, opts: ['Quadrado { lado: 2 }', "error TS2420: Class 'Quadrado' incorrectly implements interface 'Forma'.", '4', "error TS2341: Property 'lado' is private and only accessible within class 'Quadrado'."], ok: 1, mono: true, check: true,
      exp: H`O Quadrado promete cumprir a interface Forma, mas não tem o método <code>area()</code>. (O <code>private lado</code> no constructor é um atalho que declara e preenche a propriedade.)` },
    { q: 'O que acontece com este programa?', code: J`
class Aluno {
  readonly numero: number;
  constructor(numero: number) {
    this.numero = numero;
  }
}
const a = new Aluno(101);
a.numero = 102;`, opts: ['(nada)', "error TS2540: Cannot assign to 'numero' because it is a read-only property.", "error TS2341: Property 'numero' is private and only accessible within class 'Aluno'.", '102'], ok: 1, mono: true, check: true,
      exp: H`Um campo <code>readonly</code> só pode receber valor no constructor. Depois, é só para ler.` },
    { q: 'O que aparece no ecrã?', code: J`
class Contador {
  private valor: number = 0;
  mais(): void {
    this.valor++;
  }
  ler(): number {
    return this.valor;
  }
}
const k = new Contador();
k.mais();
k.mais();
console.log(k.ler());`, opts: ['2', '0', "error TS2341: Property 'valor' is private and only accessible within class 'Contador'.", 'undefined'], ok: 0, mono: true, check: true,
      exp: H`O <code>valor</code> é privado, mas os métodos da própria classe podem usá-lo. Por fora, lê-se com <code>ler()</code>.` },
    { q: 'O que acontece a um campo private quando o TypeScript é compilado para JavaScript?', opts: ['Fica escondido a correr', 'Passa a ser um campo normal: o private só existia para o compilador', 'É apagado', 'Passa a readonly'], ok: 1,
      exp: H`Tal como os tipos, o <code>private</code> é uma verificação do compilador. Para um campo escondido mesmo a correr, o JavaScript tem a sintaxe <code>#campo</code>.` },
  ],
  exercises: [{
    title: 'Formas',
    text: 'Define a interface Forma com area(): number e as classes Retangulo (largura, altura) e Quadrado (lado) que a cumprem. Mostra a soma das áreas de um retângulo 3 × 4 e de um quadrado 2 × 2, guardados num Forma[].',
    run: 'Area total: 16\n',
    hint: H`<code>class Quadrado implements Forma</code>, com um constructor e o método <code>area()</code>. Depois um reduce sobre o <code>Forma[]</code>.`,
    solution: J`
interface Forma {
  area(): number;
}

class Retangulo implements Forma {
  constructor(private largura: number, private altura: number) {}
  area(): number {
    return this.largura * this.altura;
  }
}

class Quadrado implements Forma {
  constructor(private lado: number) {}
  area(): number {
    return this.lado * this.lado;
  }
}

const formas: Forma[] = [new Retangulo(3, 4), new Quadrado(2)];
const total = formas.reduce((s, f) => s + f.area(), 0);
console.log("Area total:", total);`,
  }, {
    title: 'Pilha',
    text: 'Escreve a classe Pilha com um array privado de números e os métodos empilhar(n), desempilhar() (que devolve number | undefined) e tamanho(). Empilha 1, 2 e 3, desempilha um e mostra o que saiu e o tamanho.',
    run: 'Saiu: 3\nTamanho: 2\n',
    hint: H`<code>private itens: number[] = [];</code> e <code>desempilhar(): number | undefined { return this.itens.pop(); }</code>.`,
    solution: J`
class Pilha {
  private itens: number[] = [];

  empilhar(n: number): void {
    this.itens.push(n);
  }

  desempilhar(): number | undefined {
    return this.itens.pop();
  }

  tamanho(): number {
    return this.itens.length;
  }
}

const p = new Pilha();
p.empilhar(1);
p.empilhar(2);
p.empilhar(3);
console.log("Saiu:", p.desempilhar());
console.log("Tamanho:", p.tamanho());`,
  }],
});
