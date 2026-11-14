// ===== JavaScript do Zero — conteúdo das lições (parte 3) =====
// As lições 9 e 10 (o DOM e os eventos) usam viz: 'page' em cada exemplo: a página desenhada, a árvore DOM
// e o inspetor, como no curso de HTML. Campos extra dos passos:
//   act: ['click', seletor] ou ['input', seletor, texto]   uma ação do utilizador, feita nesse passo
//   chk: [[seletor, o quê, valor], ...]                     afirmações verificadas no browser
// As perguntas com ask (e acts) e os exercícios com tests (e acts) são verificados no browser.

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Classes',
  short: 'class, constructor, this, métodos, extends e instanceof',
  body: H`
<p>Uma <strong>classe</strong> é um molde para criar objetos com as mesmas propriedades e os mesmos métodos, como no C#:</p>
<pre class="snip"><code>class Conta {
  constructor(titular) {
    this.titular = titular;
    this.saldo = 0;
  }
  depositar(valor) {
    this.saldo += valor;
  }
}
const c = new Conta("Ana");</code></pre>
<ul>
<li>O <code>constructor</code> corre no <code>new</code> e prepara o objeto novo, a que se chama <code>this</code>.</li>
<li>Os métodos escrevem-se sem <code>function</code>. Lá dentro, <code>this</code> é o objeto em que foram chamados.</li>
<li>Esquecer o <code>new</code> é um erro: <em>TypeError: Class constructor Conta cannot be invoked without 'new'</em>.</li>
<li><code>class Cao extends Animal</code> herda tudo do Animal e pode substituir métodos. <code>obj instanceof Cao</code> diz se o objeto foi criado a partir dessa classe.</li>
</ul>`,
  analogy: 'A classe é a forma de fazer bolachas; cada new é uma bolacha feita com essa forma. Todas têm o mesmo feitio, mas cada uma pode ter cobertura diferente (os valores das propriedades).',
  examples: [{
    title: 'Uma conta bancária',
    code: J`
class Conta {
  constructor(titular) {
    this.titular = titular;
    this.saldo = 0;
  }

  depositar(valor) {
    this.saldo += valor;
  }
}

const c = new Conta("Ana");
c.depositar(50);
c.depositar(20);
console.log(c.titular, c.saldo);
console.log(c);`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['class', 'Conta'] }, d: { global: { Conta: ['class', '@o1'] } }, n: 'A classe é o molde. Por agora não existe nenhuma conta.' },
      { l: 2, obj: { o2: ['Conta', {}] }, push: 'constructor', d: { constructor: { this: ['Conta', '@o2'], titular: ['string', '"Ana"'] } }, n: H`<code>new Conta("Ana")</code> cria um objeto vazio e corre o <code>constructor</code>, com <code>this</code> a apontar para ele.` },
      { l: 3, obj: { o2: ['Conta', { titular: '"Ana"' }] }, n: H`<code>this.titular = titular</code> cria a propriedade no objeto novo.` },
      { l: 4, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '0' }] }, n: 'E o saldo começa em 0.' },
      { l: 12, pop: true, d: { global: { c: ['Conta', '@o2'] } }, n: H`O objeto pronto fica em <code>c</code>.` },
      { l: 7, push: 'depositar', d: { depositar: { this: ['Conta', '@o2'], valor: ['number', '50'] } }, n: H`<code>c.depositar(50)</code>: lá dentro, <code>this</code> é o <code>c</code>.` },
      { l: 8, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '50' }] }, n: 'O saldo do objeto passa a 50.' },
      { l: 14, pop: true, push: 'depositar', d: { depositar: { this: ['Conta', '@o2'], valor: ['number', '20'] } }, n: 'Segundo depósito, no mesmo objeto.' },
      { l: 8, obj: { o2: ['Conta', { titular: '"Ana"', saldo: '70' }] }, n: 'saldo = 50 + 20' },
      { l: 15, pop: true, o: 'Ana 70\n', n: 'As propriedades leem-se com ponto, como num objeto qualquer.' },
      { l: 16, o: "Conta { titular: 'Ana', saldo: 70 }\n", n: 'O Node mostra o nome da classe antes do objeto.' },
    ],
  }, {
    title: 'Herança com extends',
    code: J`
class Animal {
  constructor(nome) {
    this.nome = nome;
  }
  falar() {
    return ‵¤{this.nome} faz ...‵;
  }
}

class Cao extends Animal {
  falar() {
    return ‵¤{this.nome} faz au au‵;
  }
}

const bichos = [new Animal("Rex"), new Cao("Bobi")];
for (const b of bichos) {
  console.log(b.falar(), b instanceof Cao);
}`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['class', 'Animal'], o2: ['class', 'Cao extends Animal'] }, d: { global: { Animal: ['class', '@o1'], Cao: ['class', '@o2'] } }, n: H`O Cao herda tudo do Animal (incluindo o constructor) e substitui o método <code>falar</code>.` },
      { l: 16, obj: { o4: ['Animal', { nome: '"Rex"' }], o5: ['Cao', { nome: '"Bobi"' }], o3: ['Array', ['@o4', '@o5']] }, d: { global: { bichos: ['Array', '@o3'] } }, n: 'Um array com um Animal e um Cao. O Cao usou o constructor herdado do Animal.' },
      { l: 17, d: { global: { b: ['Animal', '@o4'] } }, n: 'Primeiro, o Rex.' },
      { l: 18, o: 'Rex faz ... false\n', n: H`Corre o <code>falar</code> do Animal. O Rex não foi criado com <code>new Cao</code>, por isso <code>instanceof Cao</code> dá false.` },
      { l: 17, u: { global: { b: '@o5' } }, n: 'Agora o Bobi.' },
      { l: 18, o: 'Bobi faz au au true\n', n: H`O Bobi é um Cao: corre o <code>falar</code> do Cao. A mesma linha, um resultado diferente para cada objeto.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>new</code>: <em>TypeError: Class constructor Conta cannot be invoked without 'new'</em>.`,
    H`Esquecer o <code>this.</code> dentro dos métodos: <code>saldo += valor</code> procura uma variável chamada saldo, que não existe.`,
    H`Escrever <code>function</code> antes dos métodos de uma classe.`,
    H`Numa classe com <code>extends</code> e constructor próprio, esquecer o <code>super(...)</code> antes de usar <code>this</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: J`
class Ponto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const p = new Ponto(3, 4);
console.log(p.x + p.y);`, opts: ['7', '34', 'NaN', 'undefined'], ok: 0, mono: true, check: true,
      exp: 'O constructor guarda o 3 e o 4 no objeto, e 3 + 4 = 7.' },
    { q: 'O que aparece no ecrã?', code: J`
class Conta {
  constructor() {
    this.saldo = 0;
  }
}
const c = Conta();
console.log(c);`, opts: ['Conta { saldo: 0 }', 'undefined', "TypeError: Class constructor Conta cannot be invoked without 'new'", '{ saldo: 0 }'], ok: 2, mono: true, check: true,
      exp: H`Uma classe só se pode usar com <code>new</code>. Sem ele, o programa pára com um erro.` },
    { q: 'O que aparece no ecrã?', code: J`
class Contador {
  constructor() {
    this.n = 0;
  }
  mais() {
    this.n++;
  }
}
const a = new Contador();
const b = new Contador();
a.mais();
a.mais();
b.mais();
console.log(a.n, b.n);`, opts: ['2 1', '3 3', '1 1', '3 0'], ok: 0, mono: true, check: true,
      exp: H`Cada <code>new</code> cria um objeto com o seu próprio <code>n</code>. O a foi aumentado duas vezes e o b uma.` },
    { q: 'O que aparece no ecrã?', code: J`
class Forma {
  area() {
    return 0;
  }
}
class Quadrado extends Forma {
  constructor(lado) {
    super();
    this.lado = lado;
  }
  area() {
    return this.lado * this.lado;
  }
}
console.log(new Quadrado(3).area(), new Forma().area());`, opts: ['9 0', '0 0', '9 9', '3 0'], ok: 0, mono: true, check: true,
      exp: H`O Quadrado substitui o <code>area</code> da Forma. O <code>super()</code> chama o constructor da classe mãe antes de usar <code>this</code>.` },
  ],
  exercises: [{
    title: 'Retângulo',
    text: 'Escreve a classe Retangulo com um constructor(largura, altura) e os métodos area() e perimetro(). Mostra os valores de um retângulo 3 × 4.',
    run: 'Area: 12, Perimetro: 14\n',
    hint: H`Guarda os dois valores em <code>this.largura</code> e <code>this.altura</code>.`,
    solution: J`
class Retangulo {
  constructor(largura, altura) {
    this.largura = largura;
    this.altura = altura;
  }
  area() {
    return this.largura * this.altura;
  }
  perimetro() {
    return 2 * (this.largura + this.altura);
  }
}

const r = new Retangulo(3, 4);
console.log(‵Area: ¤{r.area()}, Perimetro: ¤{r.perimetro()}‵);`,
  }, {
    title: 'Turma',
    text: 'Escreve a classe Turma com um array de alunos, um método adicionar(nome, nota) e um método media(). Adiciona Ana (17), Rui (9) e Ines (14) e mostra a média.',
    run: 'Alunos: 3\nMedia: 13.33\n',
    hint: H`No constructor, <code>this.alunos = [];</code>. A média pode usar <code>reduce</code> e <code>toFixed(2)</code>.`,
    solution: J`
class Turma {
  constructor() {
    this.alunos = [];
  }
  adicionar(nome, nota) {
    this.alunos.push({ nome, nota });
  }
  media() {
    const soma = this.alunos.reduce((s, a) => s + a.nota, 0);
    return soma / this.alunos.length;
  }
}

const t = new Turma();
t.adicionar("Ana", 17);
t.adicionar("Rui", 9);
t.adicionar("Ines", 14);
console.log("Alunos:", t.alunos.length);
console.log("Media:", t.media().toFixed(2));`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'O DOM: mudar a página',
  short: 'querySelector, textContent, style, classList e criar elementos',
  body: H`
<p>No browser, o JavaScript tem acesso à página através do <strong>DOM</strong>, a árvore de elementos que viste no curso de HTML. Pões o código num <code>&lt;script&gt;</code>, no fim do body (para os elementos já existirem quando ele corre).</p>
<table class="t">
<thead><tr><th>Código</th><th>Faz</th></tr></thead>
<tbody>
<tr><td><code>document.querySelector("#titulo")</code></td><td>o primeiro elemento que encaixa no seletor CSS (ou <code>null</code>)</td></tr>
<tr><td><code>document.querySelectorAll("li")</code></td><td>todos os que encaixam</td></tr>
<tr><td><code>el.textContent = "Olá"</code></td><td>troca o texto do elemento</td></tr>
<tr><td><code>el.style.color = "blue"</code></td><td>muda uma propriedade de CSS</td></tr>
<tr><td><code>el.classList.add("ativo")</code></td><td>acrescenta uma classe (também há <code>remove</code> e <code>toggle</code>)</td></tr>
<tr><td><code>document.createElement("li")</code> e <code>pai.append(el)</code></td><td>cria um elemento novo e põe-no na página</td></tr>
</tbody>
</table>
<p>Neste exemplo, o visualizador corre o script só até à linha em destaque, para veres a página a mudar instrução a instrução.</p>`,
  analogy: 'O DOM é o comando da televisão que é a página: o querySelector escolhe o canal (o elemento), e o textContent, o style e o classList são os botões que mudam o que aparece.',
  examples: [{
    title: 'Mudar a página instrução a instrução',
    viz: 'page',
    build: [5, 14],
    code: J`
<h1 id="titulo">Olá</h1>
<ul id="lista"></ul>
<p class="nota">Ainda nada.</p>
<script>
  const titulo = document.querySelector("#titulo");
  titulo.textContent = "Lista de compras";
  titulo.style.color = "blue";
  const lista = document.querySelector("#lista");
  for (const item of ["pão", "leite", "fruta"]) {
    const li = document.createElement("li");
    li.textContent = item;
    lista.append(li);
  }
  document.querySelector(".nota").classList.add("escondida");
<\/script>
<style>.escondida { display: none; }</style>`,
    steps: [
      { l: 4, sel: 'h1', chk: [['h1', 'text', 'Olá'], ['li', 'count', 0]], n: H`A página antes de o script correr: o HTML tal como foi escrito.` },
      { l: 5, sel: '#titulo', n: H`<code>querySelector("#titulo")</code> encontra o elemento com esse id e guarda-o numa variável. A página ainda não muda.` },
      { l: 6, sel: '#titulo', chk: [['h1', 'text', 'Lista de compras']], n: H`<code>textContent</code> troca o texto do h1.` },
      { l: 7, sel: '#titulo', box: '#titulo', chk: [['h1', 'color', 'azul']], n: H`<code>style.color</code> muda o CSS do elemento (repara na cor no inspetor).` },
      { l: 8, sel: '#lista', n: 'Guarda a lista, ainda vazia.' },
      { l: 13, sel: 'li', chk: [['li', 'count', 3], ['li', 'text', 'pão']], n: H`O ciclo cria um <code>&lt;li&gt;</code> por cada item, dá-lhe o texto e põe-no dentro da lista com <code>append</code>. Repara na árvore DOM: há três filhos novos.` },
      { l: 14, chk: [['.nota', 'display', 'none']], n: H`<code>classList.add</code> dá a classe "escondida" ao parágrafo, e a regra de CSS esconde-o. Mudar classes é a forma mais limpa de mudar o aspeto: o CSS fica no CSS.` },
    ],
  }],
  mistakes: [
    H`Pôr o <code>&lt;script&gt;</code> antes dos elementos: o <code>querySelector</code> ainda não os encontra e devolve <code>null</code>, e a linha seguinte dá <em>TypeError: Cannot set properties of null</em>.`,
    H`Esquecer o <code>#</code> ou o <code>.</code> no seletor: <code>querySelector("titulo")</code> procura um elemento &lt;titulo&gt;.`,
    H`Esperar que o <code>querySelector</code> mude todos os elementos: só devolve o primeiro. Para todos, <code>querySelectorAll</code> e um ciclo.`,
    H`Usar <code>innerHTML</code> com texto escrito pelo utilizador: pode meter HTML (e scripts) na página. Para texto, usa <code>textContent</code>.`,
  ],
  quiz: [
    { q: 'Que texto fica no parágrafo?', code: J`
<p id="a">velho</p>
<script>
  document.querySelector("#a").textContent = "novo";
<\/script>`, ask: ['#a', 'text'], opts: ['velho', 'novo', 'velhonovo', '#a'], ok: 1, check: true,
      exp: H`O script corre depois de o parágrafo existir, encontra-o pelo id e troca-lhe o texto.` },
    { q: 'Que texto fica no segundo parágrafo?', code: J`
<p>um</p>
<p>dois</p>
<script>
  document.querySelector("p").textContent = "mudei";
<\/script>`, ask: ['p:nth-of-type(2)', 'text'], opts: ['mudei', 'dois', 'um', 'umdois'], ok: 1, check: true,
      exp: H`<code>querySelector</code> devolve só o <strong>primeiro</strong> parágrafo. O segundo fica como estava.` },
    { q: 'De que cor fica o texto?', code: J`
<style>.alerta { color: red; }</style>
<p id="msg">Atenção</p>
<script>
  const msg = document.querySelector("#msg");
  msg.classList.toggle("alerta");
  msg.classList.toggle("alerta");
<\/script>`, ask: ['#msg', 'color'], opts: ['vermelho', 'preto', 'azul', 'verde'], ok: 1, check: true,
      exp: H`<code>toggle</code> acrescenta a classe se ela não estiver e tira-a se estiver. Duas vezes seguidas, fica como começou: sem a classe, a preto.` },
    { q: 'O script está no head, antes do <p id="t">. O que acontece com document.querySelector("#t").textContent = "x"?', opts: ['O texto muda para x', 'Dá TypeError: o querySelector devolveu null, porque o parágrafo ainda não existia', 'Muda quando a página acabar de carregar', 'Não faz nada, sem erro'], ok: 1,
      exp: H`O browser lê a página de cima para baixo e corre o script logo que o encontra. Nesse momento o parágrafo ainda não existe. Por isso o script vai no fim do body (ou leva o atributo <code>defer</code>).` },
  ],
  exercises: [{
    title: 'Título e destaque',
    text: 'Numa página com um h1 "Rascunho" e um parágrafo, escreve um script que mude o título para "Versão final" e dê ao parágrafo a classe destaque (que o põe a laranja).',
    hint: H`<code>document.querySelector("h1").textContent = ...</code> e <code>classList.add("destaque")</code>.`,
    tests: [['h1', 'text', 'Versão final'], ['p', 'color', 'laranja']],
    solution: J`
<style>.destaque { color: orange; }</style>
<h1>Rascunho</h1>
<p>Este texto vai ficar em destaque.</p>
<script>
  document.querySelector("h1").textContent = "Versão final";
  document.querySelector("p").classList.add("destaque");
<\/script>`,
  }, {
    title: 'Lista a partir de um array',
    text: 'Com o array ["BD", "SO", "RC", "ED"], cria um item de lista para cada UC dentro de um ul vazio.',
    hint: H`Um <code>for...of</code> com <code>createElement("li")</code>, <code>textContent</code> e <code>append</code>.`,
    tests: [['ul li', 'count', 4], ['ul li', 'text', 'BD'], ['ul li:last-child', 'text', 'ED']],
    solution: J`
<h1>As minhas UCs</h1>
<ul id="ucs"></ul>
<script>
  const ul = document.querySelector("#ucs");
  for (const uc of ["BD", "SO", "RC", "ED"]) {
    const li = document.createElement("li");
    li.textContent = uc;
    ul.append(li);
  }
<\/script>`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Eventos: reagir ao utilizador',
  short: 'addEventListener, botões, o que se escreve num campo e o estado',
  body: H`
<p>Uma página interativa espera que o utilizador faça alguma coisa e reage. Para isso, regista-se uma função para um <strong>evento</strong>:</p>
<pre class="snip"><code>botao.addEventListener("click", () =&gt; {
  // corre sempre que se carregar no botão
});</code></pre>
<ul>
<li>A função não corre logo: fica guardada e o browser chama-a <strong>sempre</strong> que o evento acontecer.</li>
<li>Eventos comuns: <code>"click"</code>, <code>"input"</code> (cada vez que o texto de um campo muda), <code>"submit"</code> (enviar um formulário), <code>"keydown"</code>.</li>
<li>O valor de um campo lê-se com <code>campo.value</code> (é sempre texto).</li>
<li>Passa-se a função, <strong>sem a chamar</strong>: <code>addEventListener("click", soma)</code>, não <code>soma()</code>.</li>
<li>O que tem de ser lembrado de uma vez para a outra (um contador, uma lista) fica numa variável fora da função: é o <strong>estado</strong> da página.</li>
</ul>
<p>No visualizador, alguns passos carregam no botão ou escrevem no campo por ti, e vês a página reagir.</p>`,
  analogy: 'Registar um evento é deixar o teu número ao porteiro: "se alguém tocar à campainha, liga-me". Não ficas à porta à espera; o porteiro liga sempre que tocarem.',
  examples: [{
    title: 'Um contador',
    viz: 'page',
    code: J`
<button id="mais">+1</button>
<p>Contagem: <span id="conta">0</span></p>
<script>
  let contagem = 0;
  const botao = document.querySelector("#mais");
  const conta = document.querySelector("#conta");
  botao.addEventListener("click", () => {
    contagem++;
    conta.textContent = contagem;
  });
<\/script>`,
    steps: [
      { l: 1, sel: '#mais', n: 'Um botão e um texto com a contagem.' },
      { l: 4, chk: [['#conta', 'text', '0']], n: H`<code>contagem</code> é o estado: vive fora da função, por isso lembra-se do valor de uma vez para a outra.` },
      { l: 7, sel: '#mais', chk: [['#conta', 'text', '0']], n: H`<code>addEventListener</code> regista a função para o evento "click". A função <strong>ainda não correu</strong>: o contador continua a 0.` },
      { l: 8, act: ['click', '#mais'], sel: '#conta', chk: [['#conta', 'text', '1']], n: 'Carregaste no botão: o browser chama a função, que soma 1 e mostra o valor.' },
      { l: 9, act: ['click', '#mais'], sel: '#conta', chk: [['#conta', 'text', '2']], n: 'Carregaste outra vez: a mesma função corre de novo. O estado passou a 2.' },
      { l: 9, act: ['click', '#mais'], sel: '#conta', chk: [['#conta', 'text', '3']], n: 'E outra. O script principal só correu uma vez; quem corre agora é a função registada.' },
    ],
  }, {
    title: 'Reagir ao que se escreve',
    viz: 'page',
    code: J`
<label for="nome">Nome</label>
<input id="nome">
<p id="ola">Olá, desconhecido!</p>
<script>
  const campo = document.querySelector("#nome");
  const ola = document.querySelector("#ola");
  campo.addEventListener("input", () => {
    const nome = campo.value.trim();
    ola.textContent = nome ? "Olá, " + nome + "!" : "Olá, desconhecido!";
  });
<\/script>`,
    steps: [
      { l: 2, sel: '#nome', chk: [['#ola', 'text', 'Olá, desconhecido!']], n: 'Um campo de texto, ainda vazio.' },
      { l: 7, sel: '#nome', n: H`O evento <code>"input"</code> acontece cada vez que o texto do campo muda.` },
      { l: 9, act: ['input', '#nome', 'Ana'], sel: '#ola', chk: [['#ola', 'text', 'Olá, Ana!'], ['#nome', 'value', 'Ana']], n: H`Escreveste "Ana": a função lê <code>campo.value</code> e atualiza o parágrafo.` },
      { l: 9, act: ['input', '#nome', ''], sel: '#ola', chk: [['#ola', 'text', 'Olá, desconhecido!']], n: 'Apagaste o texto: o nome vazio é falsy, por isso volta à mensagem inicial.' },
    ],
  }],
  mistakes: [
    H`Chamar a função ao registar: <code>addEventListener("click", soma())</code> corre o <code>soma</code> uma vez logo ali e regista o que ele devolver (undefined). Escreve <code>soma</code>, sem parênteses.`,
    H`Guardar o estado dentro da função do evento (<code>let contagem = 0</code> lá dentro): volta a zero de cada vez.`,
    H`Esquecer que <code>campo.value</code> é texto: para contas, <code>Number(campo.value)</code>.`,
    H`Num formulário, esquecer o <code>evento.preventDefault()</code> no "submit": a página recarrega e perde tudo.`,
  ],
  quiz: [
    { q: 'Depois de carregar duas vezes no botão, que número aparece?', code: J`
<button id="b">+</button>
<p id="c">0</p>
<script>
  let n = 0;
  document.querySelector("#b").addEventListener("click", () => {
    n += 5;
    document.querySelector("#c").textContent = n;
  });
<\/script>`, acts: [['click', '#b'], ['click', '#b']], ask: ['#c', 'text'], opts: ['0', '5', '10', '15'], ok: 2, check: true,
      exp: 'De cada vez que se carrega no botão, a função soma 5 ao estado n e mostra-o: 5, depois 10.' },
    { q: 'Depois de carregar duas vezes no botão, que número aparece? (atenção aos parênteses)', code: J`
<button id="b">+</button>
<p id="p">0</p>
<script>
  let n = 0;
  function soma() {
    n++;
    document.querySelector("#p").textContent = n;
  }
  document.querySelector("#b").addEventListener("click", soma());
<\/script>`, acts: [['click', '#b'], ['click', '#b']], ask: ['#p', 'text'], opts: ['0', '1', '2', '3'], ok: 1, check: true,
      exp: H`<code>soma()</code> com parênteses <strong>chama</strong> a função logo, ao registar (o n passa a 1), e o que fica registado é o que ela devolve: <code>undefined</code>, que não faz nada. Carregar no botão não muda nada.` },
    { q: 'Depois de escrever "olá mundo" no campo, que número aparece?', code: J`
<input id="t">
<p id="n">0</p>
<script>
  const t = document.querySelector("#t");
  t.addEventListener("input", () => {
    document.querySelector("#n").textContent = t.value.length;
  });
<\/script>`, acts: [['input', '#t', 'olá mundo']], ask: ['#n', 'text'], opts: ['0', '8', '9', '2'], ok: 2, check: true,
      exp: 'O length conta todos os caracteres, incluindo o espaço e a letra acentuada: 9.' },
    { q: 'Para que serve evento.preventDefault() no evento "submit" de um formulário?', opts: ['Para o formulário não ser enviado nem a página recarregar, e o JavaScript tratar dos dados', 'Para apagar os campos', 'Para validar o email', 'Para impedir o utilizador de escrever'], ok: 0,
      exp: H`Por omissão, enviar um formulário recarrega a página (ou vai para outra). Com <code>preventDefault()</code>, fica tudo na mesma página e o teu código decide o que fazer.` },
  ],
  exercises: [{
    title: 'Modo escuro',
    text: 'Faz um botão que, sempre que se carrega nele, liga ou desliga a classe escuro no body (fundo preto, texto branco). O teste carrega uma vez no botão.',
    hint: H`<code>document.body.classList.toggle("escuro")</code> dentro da função do evento "click".`,
    acts: [['click', '#tema']],
    tests: [['body', 'background-color', 'preto'], ['body', 'color', 'branco']],
    solution: J`
<style>
  .escuro { background-color: black; color: white; }
</style>
<button id="tema">Mudar tema</button>
<p>Um texto qualquer.</p>
<script>
  document.querySelector("#tema").addEventListener("click", () => {
    document.body.classList.toggle("escuro");
  });
<\/script>`,
  }, {
    title: 'Contador de caracteres',
    text: 'Faz um campo de texto e um parágrafo que mostra quantos caracteres já foram escritos, sempre atualizado. O teste escreve "ola mundo".',
    hint: H`O evento <code>"input"</code> e <code>campo.value.length</code>.`,
    acts: [['input', '#texto', 'ola mundo']],
    tests: [['#total', 'text', '9']],
    solution: J`
<label for="texto">Mensagem</label>
<input id="texto">
<p>Caracteres: <span id="total">0</span></p>
<script>
  const campo = document.querySelector("#texto");
  campo.addEventListener("input", () => {
    document.querySelector("#total").textContent = campo.value.length;
  });
<\/script>`,
  }],
});
