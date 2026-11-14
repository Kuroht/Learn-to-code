// ===== HTML e CSS do Zero — conteúdo das lições (parte 3) =====

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Display: bloco, em linha e escondido',
  short: 'block, inline, inline-block e display: none',
  body: H`
<p>Cada elemento tem um modo de se arrumar na página, a propriedade <code>display</code>:</p>
<table class="t">
<thead><tr><th>display</th><th>Comportamento</th><th>Exemplos</th></tr></thead>
<tbody>
<tr><td><code>block</code></td><td>começa numa linha nova e ocupa a largura toda; aceita width e height</td><td><code>div</code>, <code>p</code>, <code>h1</code>, <code>ul</code></td></tr>
<tr><td><code>inline</code></td><td>fica dentro da linha de texto; ignora width e height</td><td><code>span</code>, <code>a</code>, <code>strong</code></td></tr>
<tr><td><code>inline-block</code></td><td>fica na linha, como o inline, mas aceita width e height</td><td>botões, itens de menu</td></tr>
<tr><td><code>none</code></td><td>desaparece: não se vê nem ocupa espaço</td><td>menus escondidos</td></tr>
</tbody>
</table>
<p>Qualquer elemento pode mudar de modo: <code>a { display: block; }</code> faz uma ligação ocupar a linha toda. O <code>display: flex</code>, para arrumar caixas lado a lado, fica para a próxima lição.</p>`,
  analogy: 'Os elementos block são parágrafos de um livro: cada um começa numa linha nova. Os inline são palavras: seguem-se umas às outras na mesma linha. Os inline-block são emojis: ficam na linha, mas têm um tamanho fixo.',
  examples: [{
    title: 'Os quatro modos',
    code: C`
<style>
  .bloco { background-color: orange; }
  .linha { background-color: orange; width: 300px; }
  .ib { display: inline-block; width: 100px; background-color: green; }
  .escondido { display: none; }
</style>
<div class="bloco">Um div ocupa a linha toda</div>
<p>Texto com um <span class="linha">span</span> no meio.</p>
<span class="ib">A</span> <span class="ib">B</span>
<p class="escondido">Não me vês</p>`,
    steps: [
      { l: 7, sel: '.bloco', box: '.bloco', chk: [['.bloco', 'display', 'block'], ['.bloco', 'width', '784px']], n: 'Um div é um bloco: ocupa a largura toda (784px) e o elemento seguinte começa por baixo.' },
      { l: 8, sel: '.linha', box: '.linha', chk: [['.linha', 'display', 'inline']], n: H`Um span é inline: fica no meio do texto. O <code>width: 300px</code> da regra é ignorado; o span só tem a largura da palavra.` },
      { l: 9, sel: '.ib', box: '.ib', chk: [['.ib', 'width', '100px']], n: H`Com <code>inline-block</code>, os spans ficam lado a lado na mesma linha, mas agora o <code>width</code> já conta: 100px cada.` },
      { l: 10, sel: '.escondido', chk: [['.escondido', 'display', 'none'], ['.escondido', 'height', '0px']], n: H`<code>display: none</code>: o parágrafo existe no HTML (e na árvore DOM), mas não aparece nem ocupa espaço.` },
    ],
  }],
  mistakes: [
    H`Pôr <code>width</code> ou <code>height</code> num elemento inline (um span, uma ligação) e não ver diferença: muda-o para <code>inline-block</code> ou <code>block</code>.`,
    H`Confundir <code>display: none</code> com <code>visibility: hidden</code>: o segundo esconde, mas deixa o espaço vazio.`,
    H`Pôr um bloco (um div, um p) dentro de um parágrafo: o browser fecha o parágrafo antes.`,
    H`Esperar que dois divs fiquem lado a lado sem mais nada: são blocos, cada um na sua linha.`,
  ],
  quiz: [
    { q: 'Que largura tem o div? (a página tem 800px e o body tem 8px de margem de cada lado)', code: C`<div>Olá</div>`, ask: ['div', 'width'], opts: ['800px', '784px', '24px', '0px'], ok: 1, check: true,
      exp: 'Um bloco ocupa toda a largura disponível: 800 menos os 8px de margem do body de cada lado, ou seja 784px. Não depende do tamanho do texto.' },
    { q: 'Que display tem um <strong> por omissão?', code: C`<p>Uma <strong>palavra</strong>.</p>`, ask: ['strong', 'display'], opts: ['block', 'inline', 'inline-block', 'none'], ok: 1, check: true,
      exp: 'Um strong é parte de uma frase: é inline, por isso não parte a linha.' },
    { q: 'Que altura tem o parágrafo?', code: C`
<style>
  .fora { display: none; }
</style>
<p class="fora">Escondido</p>`, ask: ['p', 'height'], opts: ['0px', '16px', '18px', '(nenhum elemento)'], ok: 0, check: true,
      exp: H`O elemento existe (o seletor encontra-o), mas com <code>display: none</code> não é desenhado: não ocupa espaço nenhum.` },
    { q: 'Que largura tem a ligação?', code: C`
<style>
  a { display: inline-block; width: 150px; }
</style>
<a href="#">Início</a>`, ask: ['a', 'width'], opts: ['150px', '784px', '0px', 'A largura da palavra'], ok: 0, check: true,
      exp: H`Uma ligação é inline e ignoraria o <code>width</code>, mas com <code>inline-block</code> passa a aceitá-lo.` },
  ],
  exercises: [{
    title: 'Botões de menu',
    text: 'Faz três ligações lado a lado, cada uma com 120px de largura, fundo laranja e o texto centrado.',
    hint: H`<code>display: inline-block</code> para o <code>width</code> funcionar, mais <code>text-align: center</code>.`,
    tests: [['a', 'count', 3], ['a', 'width', '120px'], ['a', 'display', 'inline-block'], ['a', 'text-align', 'center']],
    solution: C`
<style>
  a {
    display: inline-block;
    width: 120px;
    background-color: orange;
    text-align: center;
  }
</style>
<a href="#">Início</a>
<a href="#">Aulas</a>
<a href="#">Contactos</a>`,
  }, {
    title: 'Esconder uma mensagem',
    text: 'Faz dois parágrafos: um normal e outro com a classe secreto, que não deve aparecer nem ocupar espaço.',
    hint: H`<code>.secreto { display: none; }</code>`,
    tests: [['p', 'count', 2], ['.secreto', 'display', 'none'], ['.secreto', 'height', '0px']],
    solution: C`
<style>
  .secreto { display: none; }
</style>
<p>Isto vê-se.</p>
<p class="secreto">Isto não.</p>`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Flexbox: caixas lado a lado',
  short: 'display: flex, gap, justify-content, align-items e flex: 1',
  body: H`
<p>Arrumar caixas lado a lado era difícil em CSS, até aparecer o <strong>flexbox</strong>. Pões <code>display: flex</code> no <strong>pai</strong>, e os filhos passam a arrumar-se numa linha:</p>
<table class="t">
<thead><tr><th>No pai</th><th>Faz</th></tr></thead>
<tbody>
<tr><td><code>display: flex</code></td><td>os filhos ficam lado a lado</td></tr>
<tr><td><code>gap: 20px</code></td><td>espaço entre os filhos</td></tr>
<tr><td><code>flex-direction: column</code></td><td>em coluna, em vez de em linha</td></tr>
<tr><td><code>justify-content</code></td><td>como se distribuem na direção principal: <code>flex-start</code>, <code>center</code>, <code>space-between</code>...</td></tr>
<tr><td><code>align-items</code></td><td>como se alinham na outra direção: <code>center</code>, <code>stretch</code>...</td></tr>
</tbody>
</table>
<p>Num <strong>filho</strong>, <code>flex: 1</code> diz "cresce e ocupa o espaço que sobrar". Dois filhos com <code>flex: 1</code> dividem o espaço ao meio.</p>`,
  analogy: 'O pai com display: flex é uma prateleira: os livros (os filhos) ficam lado a lado. O gap é o espaço entre livros, o justify-content decide se ficam encostados a um lado ou espalhados, e o flex: 1 é um livro elástico que estica até encher a prateleira.',
  examples: [{
    title: 'Três caixas numa linha',
    build: [3, 8],
    code: C`
<style>
  .linha {
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }
  .item { width: 100px; padding: 10px; background-color: orange; }
  .meio { flex: 1; }
</style>
<div class="linha">
  <div class="item">A</div>
  <div class="item meio">B</div>
  <div class="item">C</div>
</div>`,
    steps: [
      { l: 2, sel: '.item', chk: [['.linha', 'display', 'block']], n: 'Sem regras ainda: os três divs são blocos, um por baixo do outro.' },
      { l: 3, sel: '.linha', box: '.linha', chk: [['.linha', 'display', 'flex']], n: H`<code>display: flex</code> no pai: os filhos ficam lado a lado, encostados à esquerda.` },
      { l: 4, sel: '.item', n: 'O gap mete 20px de espaço entre eles.' },
      { l: 5, sel: '.item', n: H`<code>space-between</code> espalha-os: o primeiro encosta à esquerda, o último à direita, e o espaço que sobra fica no meio.` },
      { l: 7, sel: '.item', box: '.item', chk: [['.item', 'width', '120px']], n: 'Cada item tem 100px de conteúdo e 10px de padding de cada lado: 120px.' },
      { l: 8, sel: '.meio', box: '.meio', chk: [['.meio', 'width', '504px']], n: H`<code>flex: 1</code> faz o B crescer e ocupar todo o espaço livre: 784 - 120 - 120 - 40 (os dois gaps) = 504px. Como já não sobra espaço, o <code>space-between</code> deixa de se notar.` },
    ],
  }],
  mistakes: [
    H`Pôr <code>display: flex</code> nos filhos em vez de no pai.`,
    H`Confundir <code>justify-content</code> com <code>align-items</code>: o primeiro é na direção da linha (horizontal, normalmente), o segundo na outra.`,
    H`Usar margens nos filhos para os afastar, quando <code>gap</code> faz isso num só sítio.`,
    H`Esquecer que, com <code>flex-direction: column</code>, as duas direções trocam.`,
  ],
  quiz: [
    { q: 'Que largura tem cada caixa?', code: C`
<style>
  body { margin: 0; }
  .pai { display: flex; width: 600px; }
  .filho { flex: 1; }
</style>
<div class="pai">
  <div class="filho">A</div>
  <div class="filho">B</div>
</div>`, ask: ['.filho', 'width'], opts: ['600px', '300px', '290px', 'A largura da letra'], ok: 1, check: true,
      exp: H`Os dois têm <code>flex: 1</code>, por isso dividem os 600px em partes iguais: 300px cada.` },
    { q: 'Que largura tem cada caixa?', code: C`
<style>
  body { margin: 0; }
  .pai { display: flex; width: 600px; gap: 20px; }
  .filho { flex: 1; }
</style>
<div class="pai">
  <div class="filho">A</div>
  <div class="filho">B</div>
</div>`, ask: ['.filho', 'width'], opts: ['300px', '290px', '280px', '310px'], ok: 1, check: true,
      exp: 'O gap de 20px fica entre as duas caixas, e o que sobra (580px) divide-se ao meio: 290px cada.' },
    { q: 'Que largura tem a caixa?', code: C`
<style>
  body { margin: 0; }
  .pai { display: flex; flex-direction: column; width: 400px; }
</style>
<div class="pai">
  <div class="filho">A</div>
</div>`, ask: ['.filho', 'width'], opts: ['400px', 'A largura da letra', '0px', '200px'], ok: 0, check: true,
      exp: H`Em coluna, o <code>align-items</code> por omissão (<code>stretch</code>) estica cada filho na outra direção: fica com a largura toda do pai.` },
    { q: 'Que propriedade, no pai, centra os filhos na horizontal (com flex-direction normal)?', opts: ['justify-content: center', 'align-items: center', 'text-align: center', 'margin: center'], ok: 0, mono: true,
      exp: H`A direção principal de uma linha é a horizontal, e é essa que o <code>justify-content</code> controla. O <code>align-items</code> centrava na vertical.` },
  ],
  exercises: [{
    title: 'Três colunas iguais',
    text: 'Faz um div com a classe colunas, com 600px de largura e 30px de espaço entre filhos, com três filhos de largura igual. (Põe body { margin: 0; } para as contas serem certas.)',
    hint: H`<code>display: flex; gap: 30px;</code> no pai e <code>flex: 1</code> nos filhos. Cada um fica com (600 - 60) / 3 = 180px.`,
    tests: [['.colunas', 'display', 'flex'], ['.colunas > div', 'count', 3], ['.colunas > div', 'width', '180px']],
    solution: C`
<style>
  body { margin: 0; }
  .colunas {
    display: flex;
    width: 600px;
    gap: 30px;
  }
  .colunas > div {
    flex: 1;
    background-color: orange;
  }
</style>
<div class="colunas">
  <div>Um</div>
  <div>Dois</div>
  <div>Três</div>
</div>`,
  }, {
    title: 'Cabeçalho com menu',
    text: 'Faz um header com flexbox: o título (h1) encostado à esquerda e um nav com duas ligações encostado à direita.',
    hint: H`<code>header { display: flex; justify-content: space-between; align-items: center; }</code>`,
    tests: [['header', 'display', 'flex'], ['header', 'justify-content', 'space-between'], ['header nav a', 'count', 2]],
    solution: C`
<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
<header>
  <h1>O meu site</h1>
  <nav>
    <a href="#">Início</a>
    <a href="#">Contactos</a>
  </nav>
</header>`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Unidades e páginas que se adaptam',
  short: 'px, %, rem, max-width e media queries',
  body: H`
<p>Uma página vai ser vista num ecrã grande e num telemóvel. Em vez de medidas fixas, usam-se medidas que se adaptam:</p>
<table class="t">
<thead><tr><th>Unidade</th><th>Quer dizer</th></tr></thead>
<tbody>
<tr><td><code>px</code></td><td>píxeis, um tamanho fixo</td></tr>
<tr><td><code>%</code></td><td>percentagem do pai (<code>width: 50%</code> é metade da largura do pai)</td></tr>
<tr><td><code>rem</code></td><td>múltiplos da letra da página (normalmente 16px): <code>2rem</code> = 32px</td></tr>
<tr><td><code>em</code></td><td>múltiplos da letra do próprio elemento (ou do pai, no font-size)</td></tr>
<tr><td><code>vw</code></td><td>percentagem da largura do ecrã: <code>100vw</code> é o ecrã todo</td></tr>
</tbody>
</table>
<ul>
<li><code>max-width: 600px</code> deixa uma caixa encolher em ecrãs pequenos, mas nunca passar de 600px nos grandes. Com <code>margin: 0 auto</code>, fica centrada.</li>
<li>Uma <strong>media query</strong> aplica regras só em certas condições: <code>@media (max-width: 500px) { ... }</code> só vale em ecrãs com 500px ou menos.</li>
<li>Para os telemóveis respeitarem isto, a página precisa de <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> no head.</li>
</ul>
<p>No visualizador, alguns passos mudam a largura da página para veres a media query a funcionar.</p>`,
  analogy: 'Uma página com medidas fixas é um fato feito à medida de uma pessoa; uma página que se adapta é uma camisola de malha: estica e encolhe, e a media query é a etiqueta que diz "em tamanho S, dobra as mangas".',
  examples: [{
    title: 'Metade num ecrã grande, tudo num pequeno',
    code: C`
<style>
  .coluna {
    width: 50%;
    background-color: orange;
  }
  @media (max-width: 500px) {
    .coluna { width: 100%; }
  }
</style>
<div class="coluna">Metade (ou tudo, num ecrã estreito)</div>`,
    steps: [
      { l: 3, sel: '.coluna', box: '.coluna', chk: [['.coluna', 'width', '392px']], n: H`Com a página a 800px, o pai (o body) tem 784px, e <code>50%</code> dá 392px.` },
      { l: 6, width: 400, sel: '.coluna', box: '.coluna', chk: [['.coluna', 'width', '384px']], n: H`A página passou a ter 400px de largura. Como 400 é menos do que 500, a media query aplica-se e a coluna ocupa 100% do body: 384px.` },
      { l: 7, width: 600, sel: '.coluna', box: '.coluna', chk: [['.coluna', 'width', '292px']], n: 'Com 600px já não se aplica: volta a ser metade (50% de 584 = 292px).' },
    ],
  }, {
    title: 'Letra em rem e uma página com largura máxima',
    code: C`
<style>
  .pagina { max-width: 600px; margin: 0 auto; }
  h1 { font-size: 2rem; }
  p { font-size: 1.25rem; }
</style>
<div class="pagina">
  <h1>Título</h1>
  <p>Um texto que nunca fica demasiado largo.</p>
</div>`,
    steps: [
      { l: 2, sel: '.pagina', box: '.pagina', chk: [['.pagina', 'width', '600px']], n: H`A página tem 784px disponíveis, mas o <code>max-width</code> não deixa a caixa passar de 600px. O <code>margin: 0 auto</code> centra-a.` },
      { l: 2, width: 400, sel: '.pagina', box: '.pagina', chk: [['.pagina', 'width', '384px']], n: 'Num ecrã de 400px, a caixa encolhe para caber (384px). Com um width fixo de 600px, aparecia uma barra de scroll.' },
      { l: 3, sel: 'h1', chk: [['h1', 'font-size', '32px']], n: H`<code>2rem</code> = 2 × 16px = 32px.` },
      { l: 4, sel: 'p', chk: [['p', 'font-size', '20px']], n: H`<code>1.25rem</code> = 1,25 × 16px = 20px. Se quem lê aumentar a letra do browser, tudo cresce em proporção.` },
    ],
  }],
  mistakes: [
    H`Usar larguras fixas grandes (<code>width: 900px</code>): num telemóvel a página fica cortada ou com scroll para o lado. Usa <code>max-width</code>.`,
    H`Esquecer o <code>&lt;meta name="viewport"&gt;</code>: o telemóvel finge ter um ecrã largo e encolhe a página toda.`,
    H`Escrever a media query antes da regra normal: a regra normal vem depois e ganha. Põe as media queries no fim.`,
    H`Confundir <code>em</code> com <code>rem</code>: os em multiplicam-se quando os elementos estão uns dentro dos outros.`,
  ],
  quiz: [
    { q: 'Que tamanho de letra tem o h2?', code: C`
<style>
  html { font-size: 16px; }
  h2 { font-size: 1.5rem; }
</style>
<h2>Secção</h2>`, ask: ['h2', 'font-size'], opts: ['1.5px', '16px', '24px', '15px'], ok: 2, check: true,
      exp: H`1,5 × 16px = 24px. O <code>rem</code> conta sempre a partir da letra do html.` },
    { q: 'Que largura tem o filho?', code: C`
<style>
  .pai { width: 400px; }
  .filho { width: 50%; }
</style>
<div class="pai"><div class="filho">Olá</div></div>`, ask: ['.filho', 'width'], opts: ['200px', '392px', '400px', '50px'], ok: 0, check: true,
      exp: H`A percentagem é do <strong>pai</strong>, não da página: 50% de 400px.` },
    { q: 'Com a página a 400px de largura, que display tem o menu?', code: C`
<style>
  .menu { display: block; }
  @media (max-width: 600px) {
    .menu { display: none; }
  }
</style>
<nav class="menu">Menu</nav>`, width: 400, ask: ['.menu', 'display'], opts: ['block', 'none', 'flex', 'inline'], ok: 1, check: true,
      exp: '400px é menos do que 600px, por isso a regra dentro da media query aplica-se e o menu esconde-se. Num ecrã largo continuava visível.' },
    { q: 'Que tamanho de letra tem o span?', code: C`
<style>
  p { font-size: 20px; }
  span { font-size: 1.5em; }
</style>
<p>Texto <span>maior</span></p>`, ask: ['span', 'font-size'], opts: ['24px', '30px', '20px', '1.5px'], ok: 1, check: true,
      exp: H`No font-size, o <code>em</code> conta a partir da letra do pai (o p, com 20px): 1,5 × 20 = 30px. Com <code>rem</code> seriam 24px.` },
  ],
  exercises: [{
    title: 'Conteúdo centrado',
    text: 'Faz um div com a classe conteudo que nunca passe de 500px de largura e fique centrado na página.',
    hint: H`<code>max-width: 500px; margin: 0 auto;</code>`,
    tests: [['.conteudo', 'width', '500px'], ['.conteudo', 'max-width', '500px']],
    solution: C`
<style>
  .conteudo {
    max-width: 500px;
    margin: 0 auto;
  }
</style>
<div class="conteudo">
  <h1>Artigo</h1>
  <p>Um texto confortável de ler, mesmo num ecrã grande.</p>
</div>`,
  }, {
    title: 'Letra maior no telemóvel',
    text: 'O texto dos parágrafos tem 16px, mas em ecrãs com 600px ou menos deve passar a 20px. (O teste é feito com a página a 400px de largura.)',
    hint: H`A regra normal primeiro e, no fim, <code>@media (max-width: 600px) { p { font-size: 20px; } }</code>.`,
    width: 400,
    tests: [['p', 'font-size', '20px']],
    solution: C`
<style>
  p { font-size: 16px; }
  @media (max-width: 600px) {
    p { font-size: 20px; }
  }
</style>
<p>Num telemóvel, este texto fica maior.</p>`,
  }],
});
