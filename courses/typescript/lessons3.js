// ===== TypeScript do Zero — conteúdo das lições (parte 3) =====

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Genéricos',
  short: 'funções e tipos que servem para qualquer tipo, sem perder a verificação',
  body: H`
<p>Uma função que devolve o primeiro elemento de um array serve para números, textos ou alunos. Com <code>any</code> perdias os tipos; com um <strong>genérico</strong> não:</p>
<pre class="snip"><code>function primeiro&lt;T&gt;(lista: T[]): T | undefined {
  return lista[0];
}</code></pre>
<ul>
<li><code>&lt;T&gt;</code> é um "tipo em branco", preenchido em cada chamada: com <code>primeiro([1, 2])</code>, o T é <code>number</code> e o resultado é <code>number | undefined</code>.</li>
<li>Normalmente o compilador descobre o T sozinho; também o podes escrever: <code>primeiro&lt;string&gt;(nomes)</code>.</li>
<li>Os tipos também podem ser genéricos: <code>interface Caixa&lt;T&gt; { valor: T }</code>. Já usaste vários sem saber: <code>Array&lt;number&gt;</code> (o mesmo que <code>number[]</code>) e <code>Promise&lt;number&gt;</code> (lição 9).</li>
</ul>`,
  analogy: 'Um genérico é uma forma de bolos com a etiqueta em branco: serve para massa de chocolate ou de laranja, e o bolo que sai tem o sabor da massa que puseste. Com any, saía um bolo sem etiqueta, e ninguém sabia o que era.',
  examples: [{
    title: 'Uma função genérica',
    code: J`
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}

const n = primeiro([12, 17, 9]);
const s = primeiro(["Ana", "Rui"]);
console.log(n, s);
console.log(primeiro([]));`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'primeiro<T>(lista: T[]): T | undefined'] }, d: { global: { primeiro: ['function', '@o1'] } }, n: H`<code>T</code> é preenchido em cada chamada.` },
      { l: 1, obj: { o2: ['number[]', ['12', '17', '9']] }, push: 'primeiro', d: { primeiro: { lista: ['number[]', '@o2'] } }, n: H`Com um array de números, o compilador conclui que T é <code>number</code>.` },
      { l: 5, pop: true, d: { global: { n: ['number | undefined', '12'] } }, n: H`Por isso <code>n</code> é <code>number | undefined</code>, sem precisares de dizer nada.` },
      { l: 1, obj: { o3: ['string[]', ['"Ana"', '"Rui"']] }, push: 'primeiro', d: { primeiro: { lista: ['string[]', '@o3'] } }, n: H`Agora T é <code>string</code>: a mesma função, outro tipo.` },
      { l: 6, pop: true, d: { global: { s: ['string | undefined', '"Ana"'] } }, n: H`<code>s</code> é <code>string | undefined</code>.` },
      { l: 7, o: '12 Ana\n', n: 'A correr, é JavaScript normal.' },
      { l: 8, o: 'undefined\n', n: H`Num array vazio não há primeiro elemento: é por isso que o tipo inclui <code>undefined</code>.` },
    ],
  }, {
    title: 'Um tipo genérico',
    code: J`
interface Caixa<T> {
  valor: T;
}
const a: Caixa<number> = { valor: 5 };
const b: Caixa<string> = { valor: "ola" };
const c: Caixa<number> = { valor: "cinco" };`,
    steps: [
      { l: 1, n: H`Uma Caixa guarda um valor de um tipo à escolha.` },
      { l: 4, n: H`<code>Caixa&lt;number&gt;</code>: o valor tem de ser um número.` },
      { l: 5, n: H`<code>Caixa&lt;string&gt;</code>: um texto.` },
      { l: 6, o: "error TS2322: Type 'string' is not assignable to type 'number'.\n", n: 'Uma caixa de números com um texto lá dentro é recusada. A verificação continua a funcionar, para qualquer tipo.' },
    ],
  }],
  mistakes: [
    H`Usar <code>any</code> onde um genérico servia: perdes a verificação e a ajuda do editor.`,
    H`Esquecer o <code>&lt;T&gt;</code> a seguir ao nome da função e usar <code>T</code> nos parâmetros: <em>error TS2304: Cannot find name 'T'.</em>`,
    H`Esquecer que <code>primeiro(lista)</code> pode dar undefined.`,
    H`Escrever genéricos complicados cedo demais: usa-os quando a mesma função serve mesmo para vários tipos.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}
const x = primeiro<string>([1, 2]);
console.log(x);`, opts: ['1', "error TS2322: Type 'number' is not assignable to type 'string'.", "'1'", 'undefined'], ok: 1, mono: true, check: true,
      exp: H`Escreveste <code>&lt;string&gt;</code>, por isso a lista tinha de ser de textos, e tem números.` },
    { q: 'O que aparece no ecrã?', code: J`
function ultimo<T>(lista: T[]): T | undefined {
  return lista[lista.length - 1];
}
console.log(ultimo([4, 8, 15]), ultimo(["a", "b"]));`, opts: ['15 b', '4 a', 'undefined undefined', "error TS2322: Type 'string' is not assignable to type 'number'."], ok: 0, mono: true, check: true,
      exp: 'Em cada chamada o T é um tipo diferente (number, depois string), e a mesma função serve para os dois.' },
    { q: 'O que aparece no ecrã?', code: J`
const notas: Array<number> = [12, 15];
notas.push(18);
console.log(notas);`, opts: ['[ 12, 15, 18 ]', "error TS2315: Type 'Array' is not generic.", '[ 12, 15 ]', '3'], ok: 0, mono: true, check: true,
      exp: H`<code>Array&lt;number&gt;</code> é exatamente o mesmo que <code>number[]</code>, escrito como tipo genérico.` },
    { q: 'O que acontece com este programa?', code: J`
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}
const n = primeiro([10, 20]);
console.log(n + 1);`, opts: ['11', "error TS18048: 'n' is possibly 'undefined'.", 'NaN', '101'], ok: 1, mono: true, check: true,
      exp: H`O resultado é <code>number | undefined</code>: com uma lista vazia seria undefined, e <code>undefined + 1</code> dava NaN. O compilador obriga a tratar esse caso.` },
  ],
  exercises: [{
    title: 'Contém',
    text: 'Escreve contem<T>(lista: T[], x: T): boolean e mostra contem([1, 2, 3], 2) e contem(["a", "b"], "z").',
    run: 'true false\n',
    hint: H`O corpo é <code>return lista.includes(x);</code>.`,
    solution: J`
function contem<T>(lista: T[], x: T): boolean {
  return lista.includes(x);
}

console.log(contem([1, 2, 3], 2), contem(["a", "b"], "z"));`,
  }, {
    title: 'Pares',
    text: 'Define interface Par<A, B> { primeiro: A; segundo: B } e uma função trocar<A, B>(p: Par<A, B>): Par<B, A>. Mostra o resultado de trocar o par { primeiro: "Ana", segundo: 17 }.',
    run: "{ primeiro: 17, segundo: 'Ana' }\n",
    hint: H`Um tipo pode ter dois parâmetros genéricos. A função devolve <code>{ primeiro: p.segundo, segundo: p.primeiro }</code>.`,
    solution: J`
interface Par<A, B> {
  primeiro: A;
  segundo: B;
}

function trocar<A, B>(p: Par<A, B>): Par<B, A> {
  return { primeiro: p.segundo, segundo: p.primeiro };
}

console.log(trocar({ primeiro: "Ana", segundo: 17 }));`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Esperar sem bloquear: async e await',
  short: 'Promise, async, await, a ordem do que aparece e try/catch',
  body: H`
<p>Muitas coisas demoram: pedir dados a um servidor, ler um ficheiro, esperar um temporizador. O JavaScript não fica parado à espera: regista o que fazer quando acabar e continua com o resto. O resultado "que há de vir" é uma <strong>Promise</strong>.</p>
<ul>
<li>Uma função <code>async</code> devolve sempre uma <code>Promise</code>. Em TypeScript, o tipo diz o que vem lá dentro: <code>Promise&lt;number&gt;</code>.</li>
<li>Dentro de uma função <code>async</code>, <code>await</code> espera pela Promise e dá o valor. A função fica em pausa nesse ponto, e o resto do programa continua a correr.</li>
<li>Por isso a ordem do que aparece no ecrã não é a ordem das linhas: o que vem depois de um <code>await</code> aparece mais tarde.</li>
<li>Uma Promise que falha trata-se com <code>try</code> / <code>catch</code> à volta do <code>await</code>.</li>
<li>Esquecer o <code>await</code> é um erro clássico; o TypeScript apanha-o, porque uma <code>Promise&lt;number&gt;</code> não é um <code>number</code>.</li>
</ul>`,
  analogy: 'Uma Promise é o talão de levantamento de uma lavandaria. Deixas a roupa, ficas com o talão e vais à tua vida. O await é voltar à lavandaria e esperar ao balcão até a roupa estar pronta, mas sem impedir os outros clientes de serem atendidos.',
  examples: [{
    title: 'O que vem depois do await aparece mais tarde',
    code: J`
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function principal(): Promise<void> {
  console.log("a comecar");
  await esperar(100);
  console.log("passaram 100 ms");
}

principal();
console.log("isto aparece antes");`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'esperar(ms: number): Promise<void>'], o2: ['function', 'principal(): Promise<void>'] }, d: { global: { esperar: ['function', '@o1'], principal: ['function', '@o2'] } }, n: H`<code>esperar</code> devolve uma Promise que só fica pronta passados <code>ms</code> milissegundos.` },
      { l: 5, push: 'principal', n: H`Chama <code>principal()</code>.` },
      { l: 6, o: 'a comecar\n', n: 'A primeira linha corre logo.' },
      { l: 7, pop: true, n: H`<code>await esperar(100)</code>: a função fica <strong>em pausa</strong> à espera da Promise, e devolve o controlo a quem a chamou. O programa não fica bloqueado.` },
      { l: 12, o: 'isto aparece antes\n', n: 'Por isso esta linha, que vem depois no código, corre já.' },
      { l: 8, push: 'principal', o: 'passaram 100 ms\n', n: H`Passados 100 ms a Promise fica pronta e a função continua a partir do <code>await</code>.` },
    ],
  }, {
    title: 'Uma Promise que falha',
    code: J`
function buscarNota(numero: number): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (numero === 101) {
        resolve(17);
      } else {
        reject(new Error("aluno nao existe"));
      }
    }, 50);
  });
}

async function mostra(numero: number): Promise<void> {
  try {
    const nota = await buscarNota(numero);
    console.log(numero, "->", nota);
  } catch (e) {
    console.log(numero, "->", (e as Error).message);
  }
}

async function principal(): Promise<void> {
  await mostra(101);
  await mostra(999);
}
principal();`,
    steps: [
      { l: 1, push: 'global', n: H`<code>buscarNota</code> finge um pedido a um servidor: passados 50 ms, dá a nota (<code>resolve</code>) ou um erro (<code>reject</code>).` },
      { l: 23, push: 'principal', n: H`<code>principal</code> espera por cada <code>mostra</code>, uma de cada vez.` },
      { l: 15, push: 'mostra', d: { mostra: { numero: ['number', '101'] } }, n: H`<code>await buscarNota(101)</code>: espera.` },
      { l: 16, d: { mostra: { nota: ['number', '17'] } }, o: '101 -> 17\n', n: H`A Promise ficou pronta com 17. Como <code>buscarNota</code> devolve <code>Promise&lt;number&gt;</code>, o compilador sabe que <code>nota</code> é um number.` },
      { l: 24, pop: true, n: 'A primeira chamada acabou; agora a segunda.' },
      { l: 15, push: 'mostra', d: { mostra: { numero: ['number', '999'] } }, n: 'Espera outra vez.' },
      { l: 18, o: '999 -> aluno nao existe\n', n: H`Desta vez a Promise falhou: o <code>await</code> lança o erro, e o <code>catch</code> apanha-o. Em TypeScript, o erro do catch é <code>unknown</code>, por isso diz-se que é um <code>Error</code> (<code>as Error</code>) para ler a mensagem.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>await</code>: ficas com uma Promise em vez do valor. O TypeScript costuma avisar (por exemplo, em <code>r + 1</code>: <em>error TS2365: Operator '+' cannot be applied to types 'Promise&lt;number&gt;' and '1'</em>).`,
    H`Usar <code>await</code> fora de uma função <code>async</code>.`,
    H`Esperar que o código depois da chamada de uma função async espere por ela: não espera, a não ser que lhe faças <code>await</code>.`,
    H`Não tratar os erros: um <code>await</code> que falha sem <code>try</code>/<code>catch</code> rebenta a função toda.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");`, opts: ['1\n2\n3', '1\n3\n2', '2\n1\n3', '1\n3'], ok: 1, mono: true, check: true,
      exp: H`Mesmo com 0 ms, o <code>setTimeout</code> só corre a função depois de acabar o código que está a correr. O "3" aparece antes do "2".` },
    { q: 'O que acontece com este programa?', code: J`
async function dobro(x: number): Promise<number> {
  return x * 2;
}
const r = dobro(4);
console.log(r + 1);`, opts: ['9', '[object Promise]1', "error TS2365: Operator '+' cannot be applied to types 'Promise<number>' and '1'.", 'NaN'], ok: 2, mono: true, check: true,
      exp: H`Faltou o <code>await</code>: <code>r</code> é uma <code>Promise&lt;number&gt;</code>, não um número. Em JavaScript aparecia "[object Promise]1"; o TypeScript não deixa.` },
    { q: 'O que aparece no ecrã?', code: J`
async function dobro(x: number): Promise<number> {
  return x * 2;
}
async function principal(): Promise<void> {
  const r = await dobro(4);
  console.log(r + 1);
}
principal();`, opts: ['9', '8', "error TS2365: Operator '+' cannot be applied to types 'Promise<number>' and '1'.", '5'], ok: 0, mono: true, check: true,
      exp: H`Com <code>await</code>, <code>r</code> é o número 8 que estava dentro da Promise: 8 + 1 = 9.` },
    { q: 'O que aparece no ecrã?', code: J`
async function f(): Promise<void> {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
f();
console.log("C");`, opts: ['A\nB\nC', 'A\nC\nB', 'C\nA\nB', 'A\nC'], ok: 1, mono: true, check: true,
      exp: H`O "A" aparece logo. O <code>await</code> põe a função em pausa (mesmo com uma Promise já pronta), o "C" corre, e só depois a função continua e escreve o "B".` },
  ],
  exercises: [{
    title: 'Contagem decrescente',
    text: 'Usando a função esperar(ms) do exemplo, escreve uma função async que mostra 3, 2 e 1, esperando 10 ms entre cada número, e no fim "partida!".',
    run: '3\n2\n1\npartida!\n',
    hint: H`Um <code>for</code> de 3 até 1, com <code>console.log(i)</code> e <code>await esperar(10)</code> lá dentro.`,
    solution: J`
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function contagem(): Promise<void> {
  for (let i = 3; i >= 1; i--) {
    console.log(i);
    await esperar(10);
  }
  console.log("partida!");
}

contagem();`,
  }, {
    title: 'Somar dois valores que demoram',
    text: 'Escreve valorDepois(v: number): Promise<number>, que devolve v passados 20 ms. Numa função async, espera por valorDepois(10) e por valorDepois(20) e mostra a soma.',
    run: 'Total: 30\n',
    hint: H`<code>new Promise((resolve) =&gt; setTimeout(() =&gt; resolve(v), 20))</code>. Depois, <code>const a = await valorDepois(10);</code>.`,
    solution: J`
function valorDepois(v: number): Promise<number> {
  return new Promise((resolve) => setTimeout(() => resolve(v), 20));
}

async function principal(): Promise<void> {
  const a = await valorDepois(10);
  const b = await valorDepois(20);
  console.log("Total:", a + b);
}

principal();`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Juntar tudo: uma lista de tarefas',
  short: 'tipos literais, interfaces, arrays de objetos e funções num programa pequeno',
  body: H`
<p>Esta lição junta o curso num programa pequeno, do género que vais escrever em React mais tarde: uma lista de tarefas.</p>
<ul>
<li>Um <strong>tipo literal</strong> para o estado: <code>type Estado = "por fazer" | "feita";</code>. Um engano de escrita ("feito") é apanhado pelo compilador.</li>
<li>Uma <strong>interface</strong> para a forma de cada tarefa.</li>
<li>Um <strong>array de objetos</strong>, partilhado por várias funções (referências!).</li>
<li>Funções com tipos nos parâmetros e no resultado, e o <code>find</code>, que pode devolver undefined.</li>
</ul>
<p>Repara que quase todas as linhas usam alguma coisa das lições anteriores, e que o compilador apanharia logo os enganos mais comuns.</p>`,
  analogy: 'Os tipos de um programa são como as plantas de uma casa: não fazem a casa, mas mostram onde fica cada coisa e impedem que alguém ponha uma porta onde devia estar uma janela.',
  examples: [{
    title: 'Tarefas com tipos',
    code: J`
type Estado = "por fazer" | "feita";

interface Tarefa {
  id: number;
  titulo: string;
  estado: Estado;
}

const tarefas: Tarefa[] = [];

function adicionar(titulo: string): Tarefa {
  const t: Tarefa = { id: tarefas.length + 1, titulo, estado: "por fazer" };
  tarefas.push(t);
  return t;
}

function concluir(id: number): void {
  const t = tarefas.find((x) => x.id === id);
  if (t !== undefined) {
    t.estado = "feita";
  }
}

adicionar("Estudar TypeScript");
adicionar("Fazer o exercicio");
concluir(1);
const porFazer = tarefas.filter((t) => t.estado === "por fazer");
console.log(porFazer.map((t) => t.titulo));
console.log(tarefas.length, "tarefas");`,
    steps: [
      { l: 9, push: 'global', obj: { o1: ['Tarefa[]', []] }, d: { global: { tarefas: ['Tarefa[]', '@o1'] } }, n: H`Os tipos (Estado e Tarefa) não existem a correr. O array começa vazio, e só aceita objetos com a forma de uma Tarefa.` },
      { l: 12, obj: { o2: ['Tarefa', { id: '1', titulo: '"Estudar TypeScript"', estado: '"por fazer"' }] }, push: 'adicionar', d: { adicionar: { titulo: ['string', '"Estudar TypeScript"'], t: ['Tarefa', '@o2'] } }, n: H`<code>adicionar</code> cria uma tarefa. <code>{ titulo }</code> é um atalho para <code>{ titulo: titulo }</code>.` },
      { l: 13, obj: { o1: ['Tarefa[]', ['@o2']] }, n: 'E guarda-a no array partilhado.' },
      { l: 25, pop: true, obj: { o3: ['Tarefa', { id: '2', titulo: '"Fazer o exercicio"', estado: '"por fazer"' }], o1: ['Tarefa[]', ['@o2', '@o3']] }, n: 'A segunda tarefa, da mesma forma.' },
      { l: 18, push: 'concluir', d: { concluir: { id: ['number', '1'], t: ['Tarefa | undefined', '@o2'] } }, n: H`<code>find</code> devolve <code>Tarefa | undefined</code>. Encontrou a tarefa 1: <code>t</code> aponta para o mesmo objeto que está no array.` },
      { l: 20, obj: { o2: ['Tarefa', { id: '1', titulo: '"Estudar TypeScript"', estado: '"feita"' }] }, n: H`Depois do <code>if (t !== undefined)</code>, o compilador deixa mudar o estado. E só aceita "por fazer" ou "feita".` },
      { l: 27, pop: true, obj: { o4: ['Tarefa[]', ['@o3']] }, d: { global: { porFazer: ['Tarefa[]', '@o4'] } }, n: H`O <code>filter</code> dá um array novo com as que faltam. Repara que guarda a mesma referência (#3), não uma cópia.` },
      { l: 28, o: "[ 'Fazer o exercicio' ]\n", n: 'Os títulos das tarefas por fazer.' },
      { l: 29, o: '2 tarefas\n', n: 'O array original continua com as duas.' },
    ],
  }],
  mistakes: [
    H`Escrever um estado que não existe (<code>"feito"</code>): <em>error TS2820: Type '"feito"' is not assignable to type 'Estado'. Did you mean '"feita"'?</em> (o compilador até sugere o valor certo)`,
    H`Usar o resultado do <code>find</code> sem testar: <em>'t' is possibly 'undefined'</em>.`,
    H`Esquecer que <code>filter</code> e <code>find</code> devolvem referências para os mesmos objetos: mudar um muda-o no array original.`,
    H`Usar o tamanho do array como id depois de apagar tarefas: os ids podem repetir-se. Guarda um contador à parte.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: J`
type Estado = "por fazer" | "feita";
interface Tarefa {
  titulo: string;
  estado: Estado;
}
const t: Tarefa = { titulo: "Estudar", estado: "por fazer" };
t.estado = "feito";`, opts: ['(nada)', "error TS2820: Type '\"feito\"' is not assignable to type 'Estado'. Did you mean '\"feita\"'?", "error TS2540: Cannot assign to 'estado' because it is a read-only property.", 'feito'], ok: 1, mono: true, check: true,
      exp: H`"feito" não é um dos valores do tipo Estado. Num programa grande, um engano destes podia passar meses sem ninguém reparar.` },
    { q: 'O que acontece com este programa?', code: J`
interface Tarefa {
  id: number;
  feita: boolean;
}
const tarefas: Tarefa[] = [{ id: 1, feita: false }];
const t = tarefas.find((x) => x.id === 7);
t.feita = true;`, opts: ['(nada)', "error TS18048: 't' is possibly 'undefined'.", "TypeError: Cannot set properties of undefined (setting 'feita')", 'true'], ok: 1, mono: true, check: true,
      exp: H`Não há nenhuma tarefa 7, e o compilador sabe que isso pode acontecer. Em JavaScript, isto rebentava a correr com o TypeError (a opção C).` },
    { q: 'O que aparece no ecrã?', code: J`
interface Tarefa {
  titulo: string;
  feita: boolean;
}
const lista: Tarefa[] = [
  { titulo: "A", feita: true },
  { titulo: "B", feita: false },
  { titulo: "C", feita: true },
];
const feitas = lista.filter((t) => t.feita).length;
console.log(‵¤{feitas} de ¤{lista.length}‵);`, opts: ['2 de 3', '1 de 3', '3 de 3', 'error TS2339'], ok: 0, mono: true, check: true,
      exp: H`O <code>filter</code> fica com as duas feitas (A e C), e <code>length</code> conta-as.` },
    { q: 'O que aparece no ecrã?', code: J`
interface Tarefa {
  titulo: string;
  feita: boolean;
}
const lista: Tarefa[] = [{ titulo: "A", feita: false }];
const t = lista[0];
t.feita = true;
console.log(lista[0].feita);`, opts: ['true', 'false', "error TS18048: 't' is possibly 'undefined'.", 'undefined'], ok: 0, mono: true, check: true,
      exp: H`<code>t</code> é uma referência para o mesmo objeto que está no array. Mudar <code>t.feita</code> muda-o lá.` },
  ],
  exercises: [{
    title: 'Contar por estado',
    text: 'Com o tipo Estado e a interface Tarefa da lição, escreve contar(lista: Tarefa[], estado: Estado): number. Para as tarefas [A por fazer, B feita, C feita], mostra quantas estão feitas e quantas por fazer.',
    run: 'feitas: 2\npor fazer: 1\n',
    hint: H`<code>lista.filter((t) =&gt; t.estado === estado).length</code>.`,
    solution: J`
type Estado = "por fazer" | "feita";

interface Tarefa {
  titulo: string;
  estado: Estado;
}

function contar(lista: Tarefa[], estado: Estado): number {
  return lista.filter((t) => t.estado === estado).length;
}

const lista: Tarefa[] = [
  { titulo: "A", estado: "por fazer" },
  { titulo: "B", estado: "feita" },
  { titulo: "C", estado: "feita" },
];
console.log("feitas:", contar(lista, "feita"));
console.log("por fazer:", contar(lista, "por fazer"));`,
  }, {
    title: 'Remover sem mudar',
    text: 'Escreve remover(lista: readonly Tarefa[], id: number): Tarefa[], que devolve uma lista nova sem a tarefa com esse id. Remove a tarefa 2 de [1 "A", 2 "B", 3 "C"] e mostra os títulos das duas listas.',
    run: "[ 'A', 'B', 'C' ]\n[ 'A', 'C' ]\n",
    hint: H`<code>return lista.filter((t) =&gt; t.id !== id);</code>. O <code>readonly</code> garante que não mudas a original.`,
    solution: J`
interface Tarefa {
  id: number;
  titulo: string;
}

function remover(lista: readonly Tarefa[], id: number): Tarefa[] {
  return lista.filter((t) => t.id !== id);
}

const lista: Tarefa[] = [
  { id: 1, titulo: "A" },
  { id: 2, titulo: "B" },
  { id: 3, titulo: "C" },
];
const nova = remover(lista, 2);
console.log(lista.map((t) => t.titulo));
console.log(nova.map((t) => t.titulo));`,
  }],
});
