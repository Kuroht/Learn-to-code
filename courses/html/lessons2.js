// ===== HTML e CSS do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Formulários e tabelas',
  short: 'form, label, input, button, e tabelas com tr, th e td',
  body: H`
<p>Um <strong>formulário</strong> recolhe dados do utilizador. Cada campo é um <code>&lt;input&gt;</code> (sem etiqueta de fecho), e o atributo <code>type</code> diz que tipo de dado espera:</p>
<ul>
<li><code>type="text"</code>, <code>"email"</code>, <code>"password"</code>, <code>"number"</code>, <code>"checkbox"</code>... O browser adapta o campo (num telemóvel, um email mostra o teclado com @).</li>
<li>Cada campo tem um <code>&lt;label&gt;</code>: <code>&lt;label for="nome"&gt;</code> liga-se ao <code>&lt;input id="nome"&gt;</code>. Carregar no texto da label põe o cursor no campo, e os leitores de ecrã sabem o que o campo pede.</li>
<li>Um <code>&lt;button&gt;</code> dentro do <code>&lt;form&gt;</code> envia-o. (O que acontece depois é trabalho de JavaScript ou do servidor.)</li>
</ul>
<p>Uma <strong>tabela</strong> é para dados em linhas e colunas: <code>&lt;table&gt;</code>, uma <code>&lt;tr&gt;</code> por linha, e dentro dela <code>&lt;th&gt;</code> (célula de cabeçalho) ou <code>&lt;td&gt;</code> (célula normal). <code>&lt;thead&gt;</code> e <code>&lt;tbody&gt;</code> separam o cabeçalho do corpo.</p>`,
  analogy: 'Um formulário HTML é um impresso em papel: cada caixa para escrever é um input, e o texto ao lado ("Nome:") é a label. Sem label, ninguém sabe o que escrever em cada caixa.',
  examples: [{
    title: 'Um formulário de inscrição',
    build: [2, 7],
    code: C`
<form>
  <label for="nome">Nome</label>
  <input id="nome" type="text" placeholder="O teu nome">
  <label for="email">Email</label>
  <input id="email" type="email">
  <label><input type="checkbox"> Aceito as regras</label>
  <button type="submit">Enviar</button>
</form>`,
    steps: [
      { l: 1, n: H`O <code>&lt;form&gt;</code> agrupa os campos. Ainda está vazio.` },
      { l: 2, sel: 'label', n: H`Uma label, ligada ao campo com <code>id="nome"</code> pelo atributo <code>for</code>.` },
      { l: 3, sel: '#nome', n: H`Um campo de texto. O <code>placeholder</code> é a dica que aparece lá dentro enquanto está vazio.` },
      { l: 5, sel: '#email', n: H`<code>type="email"</code>: o browser já sabe que é um email e, ao enviar, avisa se faltar o @.` },
      { l: 6, sel: 'input[type="checkbox"]', chk: [['input', 'count', 3]], n: H`Uma caixa para marcar. Aqui a label está à volta do input, o que também os liga, sem precisar de <code>for</code>.` },
      { l: 7, sel: 'button', chk: [['button', 'text', 'Enviar']], n: 'O botão que envia o formulário.' },
    ],
  }, {
    title: 'Uma pauta em tabela',
    code: C`
<table>
  <thead>
    <tr><th>Aluno</th><th>Nota</th></tr>
  </thead>
  <tbody>
    <tr><td>Ana</td><td>17</td></tr>
    <tr><td>Rui</td><td>9</td></tr>
  </tbody>
</table>`,
    steps: [
      { l: 3, sel: 'th', chk: [['th', 'count', 2], ['th', 'font-weight', '700']], n: H`A linha de cabeçalho: dois <code>&lt;th&gt;</code>, que o browser mostra em negrito e centrados.` },
      { l: 6, sel: 'tbody tr:first-child td', n: H`Uma linha (<code>&lt;tr&gt;</code>) com duas células (<code>&lt;td&gt;</code>). A tabela não tem colunas escritas: são as células de cada linha que formam as colunas.` },
      { l: 7, sel: 'tbody tr:last-child td', chk: [['td', 'count', 4], ['tbody tr:last-child td', 'text', 'Rui']], n: 'Outra linha. Há 4 células normais ao todo: 2 linhas × 2 colunas.' },
    ],
  }],
  mistakes: [
    H`Campos sem <code>&lt;label&gt;</code>: quem usa um leitor de ecrã não sabe o que o campo pede.`,
    H`O <code>for</code> da label não bater certo com o <code>id</code> do input (por exemplo, uma maiúscula diferente).`,
    H`Usar tabelas para arrumar a página em colunas: as tabelas são para dados; o arranjo da página faz-se com CSS.`,
    H`Linhas com números de células diferentes: a tabela fica desalinhada.`,
    H`Pôr o <code>&lt;td&gt;</code> diretamente dentro do <code>&lt;table&gt;</code>, sem <code>&lt;tr&gt;</code>.`,
  ],
  quiz: [
    { q: 'Quantas células <td> tem esta tabela?', code: C`
<table>
  <tr><th>Dia</th><th>UC</th><th>Sala</th></tr>
  <tr><td>2.ª</td><td>BD</td><td>A1</td></tr>
  <tr><td>4.ª</td><td>SO</td><td>B2</td></tr>
</table>`, ask: ['td', 'count'], opts: ['3', '6', '9', '2'], ok: 1, check: true,
      exp: H`A primeira linha tem <code>&lt;th&gt;</code> (cabeçalho), não <code>&lt;td&gt;</code>. As outras duas têm 3 cada: 6.` },
    { q: 'Que texto tem a segunda célula da última linha?', code: C`
<table>
  <tr><td>Ana</td><td>17</td></tr>
  <tr><td>Rui</td><td>9</td></tr>
</table>`, ask: ['tr:last-child td:nth-child(2)', 'text'], opts: ['Rui', '9', '17', 'Ana'], ok: 1, check: true,
      exp: 'A última linha é a do Rui, e a segunda célula dessa linha é a nota: 9.' },
    { q: 'Quantos campos de texto (input) tem este formulário?', code: C`
<form>
  <label for="a">A</label> <input id="a">
  <label for="b">B</label> <input id="b" type="password">
  <button>Entrar</button>
</form>`, ask: ['input', 'count'], opts: ['1', '2', '3', '4'], ok: 1, check: true,
      exp: H`Dois <code>&lt;input&gt;</code> (o segundo esconde o que se escreve). As labels e o botão não são campos.` },
    { q: 'Como ligas uma label ao campo <input id="idade">?', opts: ['<label for="idade">Idade</label>', '<label id="idade">Idade</label>', '<label name="idade">Idade</label>', '<label href="#idade">Idade</label>'], ok: 0, mono: true,
      exp: H`O <code>for</code> da label tem o mesmo valor que o <code>id</code> do campo.` },
  ],
  exercises: [{
    title: 'Formulário de entrada',
    text: 'Faz um formulário com um campo "Utilizador" (texto), um campo "Palavra-passe" (que esconde o que se escreve), cada um com a sua label, e um botão "Entrar".',
    hint: H`<code>type="password"</code> esconde o texto. Liga cada label ao seu campo com <code>for</code> e <code>id</code>.`,
    tests: [['input', 'count', 2], ['input[type="password"]', 'count', 1], ['label', 'count', 2], ['button', 'text', 'Entrar']],
    solution: C`
<form>
  <label for="utilizador">Utilizador</label>
  <input id="utilizador" type="text">
  <label for="passe">Palavra-passe</label>
  <input id="passe" type="password">
  <button type="submit">Entrar</button>
</form>`,
  }, {
    title: 'Horário',
    text: 'Faz uma tabela com uma linha de cabeçalho (Dia e UC) e três linhas: segunda com Programação, terça com Matemática e quarta com Física.',
    hint: H`Uma <code>&lt;tr&gt;</code> com dois <code>&lt;th&gt;</code>, e três <code>&lt;tr&gt;</code> com dois <code>&lt;td&gt;</code> cada.`,
    tests: [['th', 'count', 2], ['tr', 'count', 4], ['td', 'count', 6], ['tr:nth-child(3) td:nth-child(2)', 'text', 'Matemática']],
    solution: C`
<table>
  <tr><th>Dia</th><th>UC</th></tr>
  <tr><td>Segunda</td><td>Programação</td></tr>
  <tr><td>Terça</td><td>Matemática</td></tr>
  <tr><td>Quarta</td><td>Física</td></tr>
</table>`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'CSS: o primeiro estilo',
  short: 'regras, seletores, propriedades e valores',
  body: H`
<p>O HTML diz o que cada coisa <em>é</em>; o <strong>CSS</strong> diz que <em>aspeto</em> tem. Uma regra de CSS tem um <strong>seletor</strong> (a que elementos se aplica) e, entre chavetas, declarações <code>propriedade: valor;</code>:</p>
<pre class="snip"><code>p {
  color: gray;
  font-size: 20px;
}</code></pre>
<ul>
<li>O CSS pode ir num <code>&lt;style&gt;</code> no head, num ficheiro à parte (<code>&lt;link rel="stylesheet" href="estilo.css"&gt;</code>, o melhor para um site inteiro) ou num atributo <code>style="..."</code> de um elemento (evita).</li>
<li>Algumas propriedades: <code>color</code> (cor do texto), <code>background-color</code>, <code>font-size</code>, <code>font-family</code>, <code>text-align</code>.</li>
<li>Cada declaração acaba em <code>;</code>. Se uma estiver mal escrita, o browser ignora-a em silêncio e continua: não há mensagens de erro como no C.</li>
</ul>`,
  analogy: 'O HTML é a casa já construída; o CSS é a decoração. Cada regra é uma instrução para o decorador: "todos os quartos (seletor) pintados de azul (propriedade: valor)".',
  examples: [{
    title: 'As regras a aplicarem-se, uma a uma',
    build: [2, 11],
    code: C`
<style>
  h1 {
    color: blue;
  }
  p {
    color: gray;
    font-size: 20px;
  }
  body {
    background-color: orange;
  }
</style>
<h1>Título</h1>
<p>Um parágrafo.</p>`,
    steps: [
      { l: 1, sel: 'h1', chk: [['h1', 'color', 'preto'], ['p', 'font-size', '16px']], n: H`Ainda sem regras: o browser usa o seu estilo por omissão (texto preto, 16px).` },
      { l: 2, sel: 'h1', n: H`O seletor <code>h1</code> escolhe todos os elementos h1 da página.` },
      { l: 3, sel: 'h1', chk: [['h1', 'color', 'azul']], n: H`<code>color: blue;</code> muda a cor do texto. A página muda logo.` },
      { l: 6, sel: 'p', chk: [['p', 'color', 'cinzento']], n: H`Uma regra para os <code>p</code>: texto cinzento...` },
      { l: 7, sel: 'p', box: 'p', chk: [['p', 'font-size', '20px']], n: '...e com 20 píxeis de altura de letra. Uma regra pode ter várias declarações.' },
      { l: 10, sel: 'body', chk: [['body', 'background-color', 'laranja']], n: H`<code>background-color</code> pinta o fundo. Aplicado ao body, pinta a página toda.` },
    ],
  }, {
    title: 'Um ponto e vírgula esquecido',
    code: C`
<style>
  p {
    color: red
    font-size: 30px;
  }
  h2 {
    color: green;
  }
</style>
<h2>Subtítulo</h2>
<p>Este texto devia estar vermelho e grande.</p>`,
    steps: [
      { l: 3, sel: 'p', chk: [['p', 'color', 'preto'], ['p', 'font-size', '16px']], n: H`Falta o <code>;</code> depois de <code>red</code>. O browser lê "color: red font-size: 30px" como uma só declaração, que não faz sentido, e deita-a fora. O parágrafo fica preto e com o tamanho normal.` },
      { l: 7, sel: 'h2', chk: [['h2', 'color', 'verde']], n: 'O resto do CSS continua a funcionar. Não aparece nenhum erro: tens de reparar que o estilo não se aplicou.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>;</code> entre declarações: a declaração estraga-se e é ignorada sem aviso.`,
    H`Esquecer uma chaveta <code>}</code>: as regras seguintes deixam de funcionar.`,
    H`Escrever o seletor com um ponto a mais (<code>.p</code> em vez de <code>p</code>): o ponto quer dizer uma classe (próxima lição).`,
    H`Escrever <code>colour</code> ou <code>font size</code>: as propriedades têm nomes exatos, em inglês, com hífen.`,
    H`Esquecer a unidade: <code>font-size: 20;</code> é ignorado. Escreve <code>20px</code>.`,
  ],
  quiz: [
    { q: 'De que cor fica o parágrafo?', code: C`
<style>
  p {
    color: red
    font-size: 30px;
  }
</style>
<p>Olá</p>`, ask: ['p', 'color'], opts: ['vermelho', 'preto', 'azul', 'cinzento'], ok: 1, check: true,
      exp: H`Falta o <code>;</code> depois de <code>red</code>, por isso a declaração fica inválida e é ignorada. O texto fica com a cor por omissão: preto.` },
    { q: 'Que tamanho de letra tem o h1?', code: C`
<style>
  h1 { font-size: 40px; }
  p { font-size: 12px; }
</style>
<h1>Título</h1>`, ask: ['h1', 'font-size'], opts: ['12px', '16px', '32px', '40px'], ok: 3, check: true,
      exp: H`A regra do <code>h1</code> dá-lhe 40px. A do p não se aplica ao h1.` },
    { q: 'De que cor fica o parágrafo?', code: C`
<style>
  .p { color: red; }
</style>
<p>Olá</p>`, ask: ['p', 'color'], opts: ['vermelho', 'preto', 'verde', 'branco'], ok: 1, check: true,
      exp: H`<code>.p</code> escolhe elementos com <code>class="p"</code>, e este parágrafo não tem nenhuma classe. Para todos os parágrafos, o seletor é <code>p</code>, sem ponto.` },
    { q: 'Qual destas regras está bem escrita?', opts: ['h1 { color: blue; }', 'h1 ( color = blue )', 'h1 { color blue }', '{ h1: color: blue; }'], ok: 0, mono: true,
      exp: H`Seletor, chaveta, <code>propriedade: valor;</code>, chaveta. Os dois pontos separam a propriedade do valor.` },
  ],
  exercises: [{
    title: 'Título e texto',
    text: 'Dá estilo a esta página: o h1 em azul e centrado, os parágrafos em cinzento com 18px de letra.',
    hint: H`Duas regras: <code>h1 { color: blue; text-align: center; }</code> e outra para o <code>p</code>.`,
    tests: [['h1', 'color', 'azul'], ['h1', 'text-align', 'center'], ['p', 'color', 'cinzento'], ['p', 'font-size', '18px']],
    solution: C`
<style>
  h1 {
    color: blue;
    text-align: center;
  }
  p {
    color: gray;
    font-size: 18px;
  }
</style>
<h1>A minha página</h1>
<p>Primeiro parágrafo.</p>
<p>Segundo parágrafo.</p>`,
  }, {
    title: 'Modo escuro',
    text: 'Faz uma página com fundo preto e texto branco, e com as ligações em laranja.',
    hint: H`O fundo e a cor do texto vão no <code>body</code>. As ligações têm cor própria por omissão, por isso precisam de uma regra para o <code>a</code>.`,
    tests: [['body', 'background-color', 'preto'], ['p', 'color', 'branco'], ['a', 'color', 'laranja']],
    solution: C`
<style>
  body {
    background-color: black;
    color: white;
  }
  a {
    color: orange;
  }
</style>
<p>Texto claro em fundo escuro.</p>
<p><a href="#">Uma ligação</a></p>`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Seletores, cascata e herança',
  short: 'classes, id, descendentes, quem ganha quando duas regras discordam',
  body: H`
<table class="t">
<thead><tr><th>Seletor</th><th>Escolhe</th></tr></thead>
<tbody>
<tr><td><code>p</code></td><td>todos os parágrafos</td></tr>
<tr><td><code>.aviso</code></td><td>os elementos com <code>class="aviso"</code> (vários podem ter a mesma classe)</td></tr>
<tr><td><code>#topo</code></td><td>o elemento com <code>id="topo"</code> (só um)</td></tr>
<tr><td><code>nav a</code></td><td>as ligações que estão dentro de um nav</td></tr>
<tr><td><code>h1, h2</code></td><td>os h1 e os h2</td></tr>
</tbody>
</table>
<p>Quando duas regras dão valores diferentes à mesma propriedade, há uma <strong>cascata</strong> de critérios:</p>
<ol>
<li>Ganha o seletor mais <strong>específico</strong>: um id vale mais do que uma classe, e uma classe mais do que um nome de elemento.</li>
<li>Com a mesma especificidade, ganha a regra que vem <strong>depois</strong>.</li>
</ol>
<p>Algumas propriedades são <strong>herdadas</strong> pelos filhos (a cor e a letra do texto); outras não (bordas, fundos, margens).</p>`,
  analogy: 'A cascata é como as regras de uma escola: a regra para "todos os alunos" (p) perde para a regra da turma (.classe), que perde para uma regra só para ti (#id). Entre duas regras do mesmo nível, vale a mais recente.',
  examples: [{
    title: 'Quem ganha',
    build: [2, 5],
    code: C`
<style>
  p { color: gray; }
  .aviso { color: red; }
  #especial { color: green; }
  p { color: blue; }
</style>
<p>Normal</p>
<p class="aviso">Aviso</p>
<p class="aviso" id="especial">Especial</p>`,
    steps: [
      { l: 1, sel: 'p', chk: [['p', 'color', 'preto']], n: 'Ainda sem regras: os três parágrafos estão pretos.' },
      { l: 2, sel: 'p', chk: [['p', 'color', 'cinzento'], ['#especial', 'color', 'cinzento']], n: H`A regra para <code>p</code> aplica-se aos três.` },
      { l: 3, sel: '.aviso', chk: [['.aviso', 'color', 'vermelho'], ['#especial', 'color', 'vermelho']], n: H`<code>.aviso</code> é mais específico do que <code>p</code>: os dois parágrafos com essa classe ficam vermelhos.` },
      { l: 4, sel: '#especial', chk: [['#especial', 'color', 'verde']], n: 'Um id é ainda mais específico: o terceiro fica verde, apesar de também ter a classe aviso.' },
      { l: 5, sel: 'p', chk: [['p', 'color', 'azul'], ['.aviso', 'color', 'vermelho'], ['#especial', 'color', 'verde']], n: H`Outra regra para <code>p</code>, mais abaixo. Ganha à primeira regra de <code>p</code> (mesma especificidade, vem depois), mas <strong>não</strong> ganha à classe nem ao id: só o primeiro parágrafo fica azul.` },
    ],
  }, {
    title: 'O que os filhos herdam',
    code: C`
<style>
  article {
    color: purple;
    border: 2px solid black;
  }
</style>
<article>
  <h2>Título</h2>
  <p>Texto com <strong>destaque</strong>.</p>
</article>`,
    steps: [
      { l: 2, sel: 'article', box: 'article', chk: [['article', 'border-top-width', '2px']], n: 'A regra é só para o article: texto roxo e uma borda.' },
      { l: 3, sel: 'strong', chk: [['strong', 'color', 'roxo'], ['h2', 'color', 'roxo']], n: H`A cor do texto é <strong>herdada</strong>: o h2, o p e até o strong, lá dentro, ficam roxos sem nenhuma regra para eles.` },
      { l: 4, sel: 'p', box: 'p', chk: [['p', 'border-top-width', '0px']], n: 'A borda não se herda: só o article a tem. Se se herdasse, cada parágrafo e cada palavra em negrito teriam uma borda.' },
    ],
  }],
  mistakes: [
    H`Esquecer o ponto da classe ou o cardinal do id no seletor (<code>aviso { }</code> procura elementos &lt;aviso&gt;, que não existem).`,
    H`Pôr um ponto no HTML: é <code>class="aviso"</code>, sem ponto; o ponto só se usa no CSS.`,
    H`Escrever uma regra mais abaixo e estranhar que não ganhe: um seletor mais específico ganha, venha antes ou depois.`,
    H`Usar o mesmo id em vários elementos. Para vários, usa uma classe.`,
    H`Resolver tudo com <code>!important</code>: torna o CSS impossível de manter.`,
  ],
  quiz: [
    { q: 'De que cor fica o texto?', code: C`
<style>
  p { color: blue; }
  p { color: red; }
</style>
<p>Olá</p>`, ask: ['p', 'color'], opts: ['azul', 'vermelho', 'preto', 'roxo'], ok: 1, check: true,
      exp: 'As duas regras têm o mesmo seletor (a mesma especificidade), por isso ganha a que vem depois.' },
    { q: 'De que cor fica o texto?', code: C`
<style>
  .nota { color: green; }
  p { color: red; }
</style>
<p class="nota">Olá</p>`, ask: ['p', 'color'], opts: ['verde', 'vermelho', 'preto', 'azul'], ok: 0, check: true,
      exp: H`A regra do <code>p</code> vem depois, mas uma classe é mais específica do que um nome de elemento. Ganha a classe.` },
    { q: 'De que cor fica o texto da ligação?', code: C`
<style>
  nav a { color: orange; }
  a { color: purple; }
</style>
<nav><a href="#">Início</a></nav>`, ask: ['a', 'color'], opts: ['laranja', 'roxo', 'azul', 'preto'], ok: 0, check: true,
      exp: H`<code>nav a</code> tem dois nomes de elemento, por isso é mais específico do que <code>a</code> sozinho. Ganha, mesmo vindo antes.` },
    { q: 'De que cor fica a palavra em negrito?', code: C`
<style>
  p { color: green; }
</style>
<p>Uma <strong>palavra</strong>.</p>`, ask: ['strong', 'color'], opts: ['verde', 'preto', 'vermelho', 'azul'], ok: 0, check: true,
      exp: H`Não há nenhuma regra para o strong, mas a cor do texto herda-se do pai, o <code>p</code>.` },
  ],
  exercises: [{
    title: 'Mensagens',
    text: 'Faz três parágrafos: um normal, um com a classe sucesso (texto verde) e um com a classe erro (texto vermelho e negrito).',
    hint: H`Duas regras de classe: <code>.sucesso { ... }</code> e <code>.erro { ... }</code>. No HTML, <code>class="erro"</code>, sem ponto.`,
    tests: [['p', 'count', 3], ['.sucesso', 'color', 'verde'], ['.erro', 'color', 'vermelho'], ['.erro', 'font-weight', '700']],
    solution: C`
<style>
  .sucesso { color: green; }
  .erro {
    color: red;
    font-weight: bold;
  }
</style>
<p>Uma mensagem normal.</p>
<p class="sucesso">Guardado com sucesso.</p>
<p class="erro">Não foi possível guardar.</p>`,
  }, {
    title: 'O menu',
    text: 'Faz um nav com três ligações e um parágrafo com outra ligação. Só as ligações do menu devem ficar laranja; a do parágrafo fica com a cor normal.',
    hint: H`O seletor <code>nav a</code> escolhe só as ligações dentro do nav.`,
    tests: [['nav a', 'count', 3], ['nav a', 'color', 'laranja'], ['p a', 'color', 'rgb(0, 0, 238)']],
    solution: C`
<style>
  nav a { color: orange; }
</style>
<nav>
  <a href="#">Início</a>
  <a href="#">Aulas</a>
  <a href="#">Contactos</a>
</nav>
<p>Ver também a <a href="#">página da UTAD</a>.</p>`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'O modelo de caixa',
  short: 'conteúdo, padding, border, margin e box-sizing',
  body: H`
<p>Para o browser, <strong>cada elemento é uma caixa</strong>, feita de quatro camadas, de dentro para fora:</p>
<ol>
<li><strong>conteúdo</strong>: o texto ou a imagem (é aqui que se aplicam <code>width</code> e <code>height</code>);</li>
<li><strong>padding</strong> (enchimento): espaço entre o conteúdo e a borda, com a cor de fundo;</li>
<li><strong>border</strong>: a borda, por exemplo <code>border: 5px solid black;</code>;</li>
<li><strong>margin</strong>: espaço por fora da borda, que afasta a caixa das outras (transparente).</li>
</ol>
<p>A armadilha: por omissão, <code>width: 200px</code> é só a largura do <strong>conteúdo</strong>. A caixa ocupa 200 + padding + borda dos dois lados. Com <code>box-sizing: border-box;</code> o <code>width</code> passa a incluir o padding e a borda, o que torna as contas muito mais fáceis.</p>
<p>No visualizador, o painel "Inspetor" desenha as quatro camadas do elemento em destaque, com os valores calculados pelo browser.</p>`,
  analogy: 'Uma caixa é um quadro na parede: o conteúdo é a pintura, o padding é o passe-partout à volta, a borda é a moldura, e a margem é o espaço que deixas até ao quadro seguinte.',
  examples: [{
    title: 'Camada a camada',
    build: [3, 7],
    code: C`
<style>
  .caixa {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    margin: 30px;
    background-color: orange;
  }
</style>
<div class="caixa">Uma caixa</div>`,
    steps: [
      { l: 2, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'width', '784px']], n: 'Sem regras, um div ocupa a largura toda que tem disponível (aqui 784px).' },
      { l: 3, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'width', '200px']], n: H`<code>width: 200px</code>: o conteúdo passa a ter 200px de largura.` },
      { l: 4, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'width', '240px']], n: H`Com 20px de padding de cada lado, a caixa ocupa 20 + 200 + 20 = 240px. O conteúdo continua com 200.` },
      { l: 5, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'width', '250px']], n: 'Mais 5px de borda de cada lado: 250px no total.' },
      { l: 6, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'width', '250px']], n: 'A margem afasta a caixa das outras coisas (vê como desceu), mas não conta para a largura da caixa.' },
      { l: 7, sel: '.caixa', box: '.caixa', chk: [['.caixa', 'background-color', 'laranja']], n: 'O fundo pinta o conteúdo e o padding, mas não a margem.' },
    ],
  }, {
    title: 'box-sizing: border-box',
    code: C`
<style>
  .a, .b {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    margin-bottom: 10px;
  }
  .b {
    box-sizing: border-box;
  }
</style>
<div class="a">content-box</div>
<div class="b">border-box</div>`,
    steps: [
      { l: 12, sel: '.a', box: '.a', chk: [['.a', 'width', '250px']], n: H`A primeira caixa usa o modo normal: 200 de conteúdo + 40 de padding + 10 de borda = 250px.` },
      { l: 13, sel: '.b', box: '.b', chk: [['.b', 'width', '200px']], n: H`Com <code>border-box</code>, os 200px são a caixa toda: o browser encolhe o conteúdo para 150px para caberem o padding e a borda. Muita gente põe <code>* { box-sizing: border-box; }</code> no início de todo o CSS.` },
    ],
  }],
  mistakes: [
    H`Contar só o <code>width</code> e estranhar que as caixas não caibam lado a lado: soma o padding e a borda (ou usa <code>border-box</code>).`,
    H`Confundir padding com margin: o padding fica dentro da borda (com fundo), a margin fica fora (transparente).`,
    H`Escrever <code>border: 5px</code> e não ver nada: falta o estilo da linha, por exemplo <code>border: 5px solid black;</code>.`,
    H`Esquecer que as margens verticais de dois blocos seguidos se juntam: 20px + 30px dá 30px de distância, não 50.`,
  ],
  quiz: [
    { q: 'Que largura total tem a caixa?', code: C`
<style>
  div {
    width: 200px;
    padding: 10px;
    border: 2px solid black;
  }
</style>
<div>Caixa</div>`, ask: ['div', 'width'], opts: ['200px', '210px', '224px', '220px'], ok: 2, check: true,
      exp: '200 de conteúdo + 10 + 10 de padding + 2 + 2 de borda = 224px.' },
    { q: 'Que largura total tem a caixa?', code: C`
<style>
  div {
    box-sizing: border-box;
    width: 200px;
    padding: 10px;
    border: 2px solid black;
  }
</style>
<div>Caixa</div>`, ask: ['div', 'width'], opts: ['200px', '224px', '176px', '212px'], ok: 0, check: true,
      exp: H`Com <code>border-box</code>, o <code>width</code> é a caixa toda, borda incluída: 200px.` },
    { q: 'Que largura total tem a caixa?', code: C`
<style>
  div {
    width: 100px;
    padding: 0 20px;
    margin: 50px;
  }
</style>
<div>Caixa</div>`, ask: ['div', 'width'], opts: ['100px', '140px', '240px', '200px'], ok: 1, check: true,
      exp: H`<code>padding: 0 20px</code> quer dizer 0 em cima e em baixo, 20 à esquerda e à direita: 100 + 40 = 140px. A margem não conta para a largura da caixa.` },
    { q: 'Que camada da caixa fica pintada pelo background-color, além do conteúdo?', opts: ['A margin', 'O padding', 'Nenhuma', 'Só a borda'], ok: 1,
      exp: 'O fundo pinta o conteúdo e o padding (e fica por baixo da borda). A margem é sempre transparente.' },
  ],
  exercises: [{
    title: 'Um cartão de 300px',
    text: 'Faz um div com a classe cartao, com 20px de padding, uma borda de 1px cinzenta, e exatamente 300px de largura total.',
    hint: H`Ou fazes as contas (300 - 40 - 2 = 258px de width), ou usas <code>box-sizing: border-box;</code> com <code>width: 300px</code>.`,
    tests: [['.cartao', 'width', '300px'], ['.cartao', 'padding-left', '20px'], ['.cartao', 'border-top-color', 'cinzento']],
    solution: C`
<style>
  .cartao {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 1px solid gray;
  }
</style>
<div class="cartao">
  <h2>Ana Silva</h2>
  <p>Engenharia Informática</p>
</div>`,
  }, {
    title: 'Dois blocos afastados',
    text: 'Faz dois div com a classe bloco, cada um com fundo laranja, 10px de padding e uma margem de 20px por baixo.',
    hint: H`<code>margin-bottom: 20px;</code> afasta só por baixo.`,
    tests: [['.bloco', 'count', 2], ['.bloco', 'margin-bottom', '20px'], ['.bloco', 'padding-top', '10px'], ['.bloco', 'background-color', 'laranja']],
    solution: C`
<style>
  .bloco {
    background-color: orange;
    padding: 10px;
    margin-bottom: 20px;
  }
</style>
<div class="bloco">Primeiro</div>
<div class="bloco">Segundo</div>`,
  }],
});
