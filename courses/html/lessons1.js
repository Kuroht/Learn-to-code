// ===== HTML e CSS do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador da página:
//   l: linha em destaque   n: explicação
//   sel: seletor dos elementos com contorno amarelo na página e na árvore DOM
//   box: seletor do elemento mostrado no inspetor (modelo de caixa)
//   chk: [[seletor, o quê, valor esperado], ...]  afirmações verificadas no browser pelo check
//        o quê: 'count', 'text', 'width', 'height' ou uma propriedade CSS (as cores com nome em português)
//   width: largura da página em px (para as media queries)
// Um exemplo com build: [de, até] mostra as linhas desse intervalo a aparecer até à linha do passo.
// Perguntas com check: true têm ask: [seletor, o quê], e a resposta certa é a medição no browser.
// Os exercícios têm tests: [[seletor, o quê, valor], ...] em vez de "run".
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'O que é uma página web',
  short: 'etiquetas, elementos e o esqueleto de um ficheiro HTML',
  body: H`
<p>Uma página web é um ficheiro de texto (por exemplo <code>index.html</code>) que o browser lê e desenha. O <strong>HTML</strong> não é uma linguagem de programação como o C: não tem variáveis nem ciclos. É uma linguagem de <strong>marcação</strong>: diz o que cada pedaço de texto <em>é</em> (um título, um parágrafo, uma lista).</p>
<ul>
<li>Marca-se com <strong>etiquetas</strong> (tags): <code>&lt;p&gt;</code> abre um parágrafo e <code>&lt;/p&gt;</code> fecha-o. Tudo junto, <code>&lt;p&gt;Olá&lt;/p&gt;</code>, é um <strong>elemento</strong>.</li>
<li>Os elementos encaixam uns dentro dos outros, como caixas: fecha-se sempre primeiro o que se abriu por último.</li>
<li>Todo o ficheiro tem um esqueleto: <code>&lt;!DOCTYPE html&gt;</code>, depois <code>&lt;html&gt;</code> com um <code>&lt;head&gt;</code> (informação sobre a página, que não aparece) e um <code>&lt;body&gt;</code> (o que aparece).</li>
<li>Os espaços e as mudanças de linha a mais no texto não contam: o browser junta-os num só espaço.</li>
</ul>
<p>Para ver uma página, basta abrir o ficheiro no browser. Não há compilação.</p>`,
  analogy: 'O HTML é como as marcas que um professor faz num texto antes de o mandar para a gráfica: "isto é título", "isto é um parágrafo", "isto é uma lista". O browser é a gráfica: lê as marcas e imprime cada coisa com o aspeto certo.',
  examples: [{
    title: 'O esqueleto de uma página',
    build: [8, 10],
    code: C`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <title>A minha página</title>
</head>
<body>
  <h1>Olá, mundo!</h1>
  <p>Esta é a minha primeira página.</p>
  <p>O browser lê o HTML e desenha-o.</p>
</body>
</html>`,
    steps: [
      { l: 1, n: H`<code>&lt;!DOCTYPE html&gt;</code> diz ao browser que este é um documento HTML moderno. Vai sempre na primeira linha.` },
      { l: 2, n: H`<code>&lt;html&gt;</code> embrulha a página toda. <code>lang="pt"</code> é um <strong>atributo</strong>: uma informação extra sobre o elemento (aqui, a língua).` },
      { l: 4, n: H`Dentro do <code>&lt;head&gt;</code> fica o que não aparece na página. <code>charset="utf-8"</code> faz os acentos aparecerem bem.` },
      { l: 5, n: H`O <code>&lt;title&gt;</code> é o texto que aparece no separador do browser, não na página.` },
      { l: 7, n: H`O <code>&lt;body&gt;</code> é o corpo: o que se vê. Por enquanto está vazio, por isso a página está em branco.` },
      { l: 8, sel: 'h1', chk: [['h1', 'count', 1]], n: H`<code>&lt;h1&gt;</code> é o título principal. O browser desenha-o grande e em negrito, sem lhe pedirmos.` },
      { l: 9, sel: 'p', chk: [['p', 'count', 1]], n: H`<code>&lt;p&gt;</code> é um parágrafo. Repara na árvore DOM: o h1 e o p estão os dois dentro do body.` },
      { l: 10, sel: 'p', chk: [['p', 'count', 2]], n: 'Outro parágrafo. Cada parágrafo começa numa linha nova, com um espaço por cima e por baixo.' },
      { l: 11, n: H`<code>&lt;/body&gt;</code> e <code>&lt;/html&gt;</code> fecham o que foi aberto, pela ordem inversa.` },
    ],
  }],
  mistakes: [
    H`Esquecer de fechar uma etiqueta (<code>&lt;p&gt;texto</code> sem <code>&lt;/p&gt;</code>). O browser tenta adivinhar, e às vezes adivinha mal.`,
    H`Fechar pela ordem errada: <code>&lt;p&gt;&lt;strong&gt;olá&lt;/p&gt;&lt;/strong&gt;</code>. Fecha-se primeiro o último que se abriu.`,
    H`Pôr conteúdo visível dentro do <code>&lt;head&gt;</code>: tudo o que se quer ver vai no <code>&lt;body&gt;</code>.`,
    H`Esperar que vários espaços ou linhas em branco apareçam na página: o browser junta-os num só espaço.`,
    H`Esquecer o <code>&lt;meta charset="utf-8"&gt;</code> e ver os acentos aparecerem trocados.`,
  ],
  quiz: [
    { q: 'Quantos elementos <li> tem esta página?', code: C`
<ul>
  <li>Pão</li>
  <li>Leite</li>
</ul>
<p>Fim da lista</p>`, ask: ['li', 'count'], opts: ['1', '2', '3', '4'], ok: 1, check: true,
      exp: H`Há dois <code>&lt;li&gt;</code> (itens de lista). O <code>&lt;ul&gt;</code> é a lista que os contém, e o <code>&lt;p&gt;</code> é um parágrafo à parte.` },
    { q: 'Que texto aparece na página?', code: C`<p>Um    espaço       largo</p>`, ask: ['p', 'text'], opts: ['Um    espaço       largo', 'Um espaço largo', 'Umespaçolargo', 'Um\nespaço\nlargo'], ok: 1, mono: true, check: true,
      exp: 'O browser junta qualquer sequência de espaços (e mudanças de linha) num só espaço.' },
    { q: 'Onde fica o conteúdo que se vê na página?', opts: ['No <head>', 'No <body>', 'No <title>', 'Antes do <!DOCTYPE html>'], ok: 1, mono: true,
      exp: H`O <code>&lt;head&gt;</code> tem informação sobre a página (o título do separador, o charset); o que se vê vai no <code>&lt;body&gt;</code>.` },
    { q: 'Qual destas linhas está bem escrita?', opts: ['<p>Olá <strong>mundo</strong></p>', '<p>Olá <strong>mundo</p></strong>', '<p>Olá <strong>mundo<p></strong>', 'p>Olá mundo</p'], ok: 0, mono: true,
      exp: H`O <code>&lt;strong&gt;</code> foi aberto dentro do <code>&lt;p&gt;</code>, por isso tem de fechar antes dele. Cada etiqueta fecha com uma barra: <code>&lt;/p&gt;</code>.` },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve uma página completa (com o esqueleto) com o título "Ana Silva" num h1 e dois parágrafos: um com o curso e outro com o ano.',
    hint: H`Copia o esqueleto do exemplo e troca o conteúdo do <code>&lt;body&gt;</code>.`,
    tests: [['h1', 'text', 'Ana Silva'], ['p', 'count', 2]],
    solution: C`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <title>Sobre mim</title>
</head>
<body>
  <h1>Ana Silva</h1>
  <p>Engenharia Informática</p>
  <p>1.º ano</p>
</body>
</html>`,
  }, {
    title: 'Título do separador',
    text: 'Escreve uma página cujo separador do browser diga "O meu curso" e cujo título principal (h1) diga "Engenharia Informática".',
    hint: H`O texto do separador vai no <code>&lt;title&gt;</code>, dentro do head; o da página vai no <code>&lt;h1&gt;</code>, dentro do body.`,
    tests: [['title', 'text', 'O meu curso'], ['h1', 'text', 'Engenharia Informática']],
    solution: C`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <title>O meu curso</title>
</head>
<body>
  <h1>Engenharia Informática</h1>
</body>
</html>`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Texto, títulos e listas',
  short: 'h1 a h6, p, strong, em, br, listas ul e ol',
  body: H`
<p>A partir daqui, para poupar espaço, os exemplos mostram só o conteúdo do <code>&lt;body&gt;</code>. O browser acrescenta o resto do esqueleto sozinho, mas nos teus ficheiros escreve-o sempre.</p>
<table class="t">
<thead><tr><th>Elemento</th><th>Serve para</th></tr></thead>
<tbody>
<tr><td><code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code></td><td>títulos, do mais importante (h1) ao menos importante (h6)</td></tr>
<tr><td><code>&lt;p&gt;</code></td><td>um parágrafo</td></tr>
<tr><td><code>&lt;strong&gt;</code></td><td>texto importante (aparece em negrito)</td></tr>
<tr><td><code>&lt;em&gt;</code></td><td>ênfase (aparece em itálico)</td></tr>
<tr><td><code>&lt;br&gt;</code></td><td>muda de linha dentro de um parágrafo (não se fecha)</td></tr>
<tr><td><code>&lt;ul&gt;</code> / <code>&lt;ol&gt;</code></td><td>lista com marcas / lista numerada, com um <code>&lt;li&gt;</code> por item</td></tr>
<tr><td><code>&lt;!-- ... --&gt;</code></td><td>comentário: o browser ignora-o</td></tr>
</tbody>
</table>
<p>Escolhe o elemento pelo que o texto <strong>é</strong>, não pelo aspeto: o aspeto muda-se depois com CSS. Um h2 é um subtítulo, mesmo que o queiras pequeno.</p>`,
  analogy: 'Os títulos h1 a h6 são como o índice de um livro: capítulo (h1), secção (h2), subsecção (h3). Quem lê (e o Google, e um leitor de ecrã para cegos) usa-os para perceber como o texto está organizado.',
  examples: [{
    title: 'Uma receita',
    build: [1, 13],
    code: C`
<h1>Receita de panquecas</h1>
<p>Uma receita <strong>fácil</strong> e <em>rápida</em>.</p>
<h2>Ingredientes</h2>
<ul>
  <li>2 ovos</li>
  <li>1 chávena de farinha</li>
  <li>1 chávena de leite</li>
</ul>
<h2>Passos</h2>
<ol>
  <li>Mistura tudo.</li>
  <li>Frita em lume brando.</li>
</ol>`,
    steps: [
      { l: 1, sel: 'h1', n: 'O título principal da página.' },
      { l: 2, sel: 'strong', chk: [['strong', 'font-weight', '700']], n: H`<code>&lt;strong&gt;</code> marca a palavra como importante; o browser mostra-a em negrito (peso 700).` },
      { l: 2, sel: 'em', chk: [['em', 'font-style', 'italic']], n: H`<code>&lt;em&gt;</code> dá ênfase, em itálico. Os dois ficam <strong>dentro</strong> do parágrafo: são elementos em linha (inline), não começam linha nova.` },
      { l: 3, sel: 'h2', n: 'Um subtítulo, menor do que o h1.' },
      { l: 8, sel: 'ul li', chk: [['ul li', 'count', 3]], n: H`Uma lista com marcas: o <code>&lt;ul&gt;</code> é a lista e cada <code>&lt;li&gt;</code> é um item.` },
      { l: 13, sel: 'ol li', chk: [['ol li', 'count', 2]], n: H`Com <code>&lt;ol&gt;</code> a lista fica numerada. O browser conta sozinho: não escreves os números.` },
    ],
  }],
  mistakes: [
    H`Usar <code>&lt;h1&gt;</code> só porque o texto é grande: a escolha do título é pela importância; o tamanho trata-se com CSS.`,
    H`Pôr texto solto dentro de um <code>&lt;ul&gt;</code> sem <code>&lt;li&gt;</code>.`,
    H`Usar muitos <code>&lt;br&gt;</code> para afastar parágrafos. Usa <code>&lt;p&gt;</code> diferentes (e CSS para os espaços).`,
    H`Escrever os números à mão numa lista: usa <code>&lt;ol&gt;</code>.`,
  ],
  quiz: [
    { q: 'Quantos elementos <li> tem esta página?', code: C`
<ol>
  <li>Programação</li>
  <li>Matemática
    <ul>
      <li>Álgebra</li>
      <li>Cálculo</li>
    </ul>
  </li>
</ol>`, ask: ['li', 'count'], opts: ['2', '3', '4', '5'], ok: 2, check: true,
      exp: H`Uma lista pode estar dentro de um item de outra lista. Há 2 itens na lista de fora e 2 na de dentro: 4 <code>&lt;li&gt;</code> ao todo.` },
    { q: 'Que texto aparece na página?', code: C`<p>Olá <!-- não mostrar --> mundo</p>`, ask: ['p', 'text'], opts: ['Olá mundo', 'Olá <!-- não mostrar --> mundo', 'Olá não mostrar mundo', 'Olá'], ok: 0, mono: true, check: true,
      exp: 'O comentário é ignorado, e os espaços que ficam à volta dele juntam-se num só.' },
    { q: 'Que texto aparece na página?', code: C`<p>Rua das Flores, 12<br>Vila Real</p>`, ask: ['p', 'text'], opts: ['Rua das Flores, 12 Vila Real', 'Rua das Flores, 12\nVila Real', 'Rua das Flores, 12<br>Vila Real', 'Vila Real'], ok: 1, mono: true, check: true,
      exp: H`O <code>&lt;br&gt;</code> muda de linha dentro do mesmo parágrafo. Repara que não tem etiqueta de fecho.` },
    { q: 'Que lista usas para os passos de uma receita, que têm ordem?', opts: ['<ul>', '<ol>', '<li>', '<p>'], ok: 1, mono: true,
      exp: H`A ordem importa, por isso é uma lista numerada: <code>&lt;ol&gt;</code> (ordered list). <code>&lt;ul&gt;</code> é para itens sem ordem, como ingredientes.` },
  ],
  exercises: [{
    title: 'Lista de compras',
    text: 'Faz uma página com o título "Compras" (h1) e uma lista com marcas com três itens: pão, leite e fruta.',
    hint: H`Um <code>&lt;ul&gt;</code> com três <code>&lt;li&gt;</code>.`,
    tests: [['h1', 'text', 'Compras'], ['ul li', 'count', 3], ['li', 'text', 'pão']],
    solution: C`
<h1>Compras</h1>
<ul>
  <li>pão</li>
  <li>leite</li>
  <li>fruta</li>
</ul>`,
  }, {
    title: 'O meu top 3',
    text: 'Faz uma lista numerada com as tuas três UCs preferidas. Na primeira, marca o nome da UC como importante.',
    hint: H`Um <code>&lt;ol&gt;</code> e, dentro do primeiro <code>&lt;li&gt;</code>, um <code>&lt;strong&gt;</code>.`,
    tests: [['ol li', 'count', 3], ['li:first-child strong', 'count', 1]],
    solution: C`
<h1>As minhas UCs preferidas</h1>
<ol>
  <li><strong>Programação</strong></li>
  <li>Bases de Dados</li>
  <li>Sistemas Digitais</li>
</ol>`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Ligações e imagens',
  short: 'a com href, caminhos relativos, img com src e alt',
  body: H`
<p>A "web" é feita de ligações entre páginas. Uma ligação escreve-se com <code>&lt;a&gt;</code> e o atributo <code>href</code> diz para onde vai:</p>
<ul>
<li><code>&lt;a href="https://www.utad.pt"&gt;UTAD&lt;/a&gt;</code>: um endereço completo, para outro site.</li>
<li><code>&lt;a href="contactos.html"&gt;Contactos&lt;/a&gt;</code>: um <strong>caminho relativo</strong>, um ficheiro na mesma pasta. <code>fotos/praia.jpg</code> estaria na subpasta fotos; <code>../index.html</code>, na pasta de cima.</li>
<li><code>&lt;a href="#fim"&gt;</code>: salta para o elemento com <code>id="fim"</code> na mesma página.</li>
</ul>
<p>Uma imagem escreve-se com <code>&lt;img src="logo.png" alt="Logótipo da UTAD"&gt;</code> (não tem etiqueta de fecho). O <code>alt</code> é o texto que aparece se a imagem não carregar e o que um leitor de ecrã lê a quem não vê: é obrigatório.</p>`,
  analogy: 'Um href é a morada escrita num envelope. Uma morada completa (https://...) funciona de qualquer lado; uma relativa ("no 2.º andar") só faz sentido a partir de onde estás.',
  examples: [{
    title: 'Ligações e uma imagem',
    code: C`
<h1>Os meus links</h1>
<p>Visita a <a href="https://www.utad.pt">página da UTAD</a>.</p>
<p><a href="contactos.html">Contactos</a> (outra página do mesmo site)</p>
<p><a href="#fim">Saltar para o fim</a></p>
<img src="logo.png" alt="Logótipo da UTAD">
<p id="fim">Fim da página.</p>`,
    steps: [
      { l: 2, sel: 'a[href^="https"]', n: H`Uma ligação para outro site: o <code>href</code> tem o endereço completo. O texto entre as etiquetas é o que aparece (sublinhado, a azul).` },
      { l: 3, sel: 'a[href="contactos.html"]', n: H`Um caminho relativo: o browser procura <code>contactos.html</code> na mesma pasta desta página.` },
      { l: 4, sel: 'a[href="#fim"]', chk: [['a', 'count', 3]], n: H`<code>#fim</code> salta para o elemento com <code>id="fim"</code>, nesta mesma página.` },
      { l: 5, sel: 'img', n: H`Não existe nenhum <code>logo.png</code> ao lado deste exemplo, por isso a imagem não carrega e o browser mostra o texto do <code>alt</code>. É exatamente para isto que ele serve.` },
      { l: 6, sel: '#fim', n: H`O destino da terceira ligação. Um <code>id</code> não se pode repetir na mesma página.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>https://</code> num endereço de outro site: <code>href="www.utad.pt"</code> é lido como um ficheiro na mesma pasta.`,
    H`Esquecer o <code>alt</code> nas imagens, ou escrever <code>alt="imagem"</code>, que não diz nada.`,
    H`Usar caminhos do teu computador (<code>C:\Users\...\foto.jpg</code>): só funcionam no teu computador. Usa caminhos relativos.`,
    H`Escrever "clica aqui" como texto da ligação: o texto deve dizer para onde vai.`,
  ],
  quiz: [
    { q: 'Que texto aparece na página?', code: C`<a href="horario.html">Ver o horário</a>`, ask: ['a', 'text'], opts: ['horario.html', 'Ver o horário', 'a', 'href'], ok: 1, check: true,
      exp: H`O que aparece é o conteúdo do elemento. O <code>href</code> não se vê: é para onde se vai ao carregar.` },
    { q: 'Quantas ligações tem esta página?', code: C`
<p>Ver <a href="a.html">A</a> e <a href="b.html">B</a>.</p>
<img src="foto.jpg" alt="Foto">
<p>Contacto: aluno@utad.pt</p>`, ask: ['a', 'count'], opts: ['1', '2', '3', '4'], ok: 1, check: true,
      exp: H`Só os elementos <code>&lt;a&gt;</code> são ligações. Um email escrito no texto não é uma ligação (para isso seria <code>&lt;a href="mailto:..."&gt;</code>).` },
    { q: 'Para que serve o atributo alt de uma imagem?', opts: ['Para mudar o tamanho', 'Para dar o texto que aparece se a imagem não carregar, e que os leitores de ecrã leem', 'Para dizer onde está o ficheiro', 'Para pôr uma legenda por baixo'], ok: 1,
      exp: H`O <code>src</code> diz onde está o ficheiro; o <code>alt</code> descreve a imagem por palavras, para quem não a consegue ver.` },
    { q: 'Uma página em site/index.html liga para a fotografia em site/fotos/praia.jpg. Que href usa?', opts: ['fotos/praia.jpg', '../fotos/praia.jpg', 'C:/site/fotos/praia.jpg', 'praia.jpg'], ok: 0, mono: true,
      exp: H`A partir da pasta <code>site</code>, a fotografia está na subpasta <code>fotos</code>. O <code>../</code> subia uma pasta, e o caminho do disco só funcionava no teu computador.` },
  ],
  exercises: [{
    title: 'Menu de navegação',
    text: 'Faz um parágrafo com três ligações: Início (index.html), Horário (horario.html) e UTAD (https://www.utad.pt).',
    hint: H`Três elementos <code>&lt;a&gt;</code>, cada um com o seu <code>href</code>.`,
    tests: [['a', 'count', 3], ['a[href="horario.html"]', 'text', 'Horário'], ['a[href^="https"]', 'text', 'UTAD']],
    solution: C`
<p>
  <a href="index.html">Início</a>
  <a href="horario.html">Horário</a>
  <a href="https://www.utad.pt">UTAD</a>
</p>`,
  }, {
    title: 'Saltar para uma secção',
    text: 'Faz uma página com uma ligação "Ir para os contactos" que salta para um título h2 "Contactos" mais abaixo, na mesma página.',
    hint: H`O h2 leva <code>id="contactos"</code> e a ligação <code>href="#contactos"</code>.`,
    tests: [['a[href="#contactos"]', 'count', 1], ['h2#contactos', 'text', 'Contactos']],
    solution: C`
<p><a href="#contactos">Ir para os contactos</a></p>
<h1>A minha página</h1>
<p>Algum texto.</p>
<h2 id="contactos">Contactos</h2>
<p>aluno@utad.pt</p>`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Estrutura e a árvore DOM',
  short: 'header, nav, main, footer, div, span e pais e filhos',
  body: H`
<p>Uma página tem zonas: o cabeçalho, o menu, o conteúdo principal, o rodapé. O HTML tem elementos para cada uma, chamados <strong>semânticos</strong> (dizem o que a zona é):</p>
<table class="t">
<thead><tr><th>Elemento</th><th>Zona</th></tr></thead>
<tbody>
<tr><td><code>&lt;header&gt;</code></td><td>o cabeçalho (logótipo, título)</td></tr>
<tr><td><code>&lt;nav&gt;</code></td><td>o menu de navegação</td></tr>
<tr><td><code>&lt;main&gt;</code></td><td>o conteúdo principal (só um por página)</td></tr>
<tr><td><code>&lt;article&gt;</code>, <code>&lt;section&gt;</code></td><td>um artigo independente; uma secção de um tema</td></tr>
<tr><td><code>&lt;footer&gt;</code></td><td>o rodapé</td></tr>
<tr><td><code>&lt;div&gt;</code>, <code>&lt;span&gt;</code></td><td>caixas sem significado, só para agrupar (div em bloco, span dentro do texto)</td></tr>
</tbody>
</table>
<p>O browser transforma o HTML numa <strong>árvore</strong>, o <strong>DOM</strong>: cada elemento é um nó, e os que estão lá dentro são os seus <strong>filhos</strong>. Vais usar esta árvore no CSS (para escolher elementos) e no JavaScript (para os mudar). No visualizador, o painel "Árvore (DOM)" mostra-a.</p>`,
  analogy: 'O DOM é uma árvore genealógica: o body é o avô, o main é o pai, o article é o filho, e o h2 e o p dentro dele são irmãos.',
  examples: [{
    title: 'Um blogue',
    build: [1, 13],
    code: C`
<header>
  <h1>Blogue da Ana</h1>
  <nav><a href="#">Início</a> <a href="#">Sobre</a></nav>
</header>
<main>
  <article>
    <h2>Primeiro artigo</h2>
    <p>Hoje aprendi <span>HTML</span>.</p>
  </article>
</main>
<footer>
  <p>Feito por Ana</p>
</footer>`,
    steps: [
      { l: 1, sel: 'header', n: H`O <code>&lt;header&gt;</code> ainda está vazio. Repara na árvore DOM: é filho do body.` },
      { l: 3, sel: 'nav a', chk: [['header nav a', 'count', 2]], n: H`O menu: um <code>&lt;nav&gt;</code> com duas ligações. Na árvore, o h1 e o nav são irmãos, filhos do header.` },
      { l: 7, sel: 'article h2', n: H`O conteúdo principal vai no <code>&lt;main&gt;</code>; cada artigo num <code>&lt;article&gt;</code>.` },
      { l: 8, sel: 'span', chk: [['article p span', 'count', 1]], n: H`Um <code>&lt;span&gt;</code> agrupa um bocado de texto, sem mudar o aspeto. Serve para depois lhe dar estilo com CSS.` },
      { l: 13, sel: 'footer', chk: [['body > *', 'count', 3]], n: 'O rodapé. O body tem 3 filhos diretos (header, main e footer), e cada um tem os seus.' },
    ],
  }],
  mistakes: [
    H`Fazer tudo com <code>&lt;div&gt;</code>: funciona, mas um <code>&lt;nav&gt;</code> ou um <code>&lt;footer&gt;</code> dizem ao browser (e a quem lê o código) o que cada zona é.`,
    H`Pôr mais do que um <code>&lt;main&gt;</code> na página.`,
    H`Confundir pai com antepassado: o pai é só o elemento imediatamente à volta.`,
    H`Usar <code>&lt;span&gt;</code> para blocos grandes ou <code>&lt;div&gt;</code> no meio de uma frase.`,
  ],
  quiz: [
    { q: 'Quantos elementos <p> há dentro do <main>?', code: C`
<header><p>Topo</p></header>
<main>
  <p>Um</p>
  <section><p>Dois</p></section>
</main>
<footer><p>Rodapé</p></footer>`, ask: ['main p', 'count'], opts: ['1', '2', '3', '4'], ok: 1, check: true,
      exp: H`Contam todos os descendentes, não só os filhos diretos: o "Um" e o "Dois" (que está dentro de uma section, dentro do main). Os do header e do footer ficam de fora.` },
    { q: 'Que texto tem o h2 que está dentro do article?', code: C`
<h2>Notícias</h2>
<article>
  <h2>Exames na próxima semana</h2>
</article>`, ask: ['article h2', 'text'], opts: ['Notícias', 'Exames na próxima semana', 'Notícias Exames na próxima semana', '(nenhum elemento)'], ok: 1, check: true,
      exp: H`<code>article h2</code> quer dizer "um h2 dentro de um article". O primeiro h2 está fora.` },
    { q: 'Em que elemento pões o menu com as ligações principais do site?', opts: ['<nav>', '<menu-site>', '<header>', '<span>'], ok: 0, mono: true,
      exp: H`O menu de navegação vai num <code>&lt;nav&gt;</code> (que pode estar dentro do header). <code>&lt;menu-site&gt;</code> não existe.` },
    { q: 'Em <main><article><p>Olá</p></article></main>, quem é o pai do <p>?', opts: ['O main', 'O article', 'O body', 'Não tem pai'], ok: 1, mono: true,
      exp: 'O pai é o elemento imediatamente à volta: o article. O main é o avô.' },
  ],
  exercises: [{
    title: 'Esqueleto de um site',
    text: 'Faz uma página com um header (com um h1 "O meu site"), um main com dois parágrafos e um footer com um parágrafo de copyright.',
    hint: H`Três zonas seguidas, filhas do body: <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> e <code>&lt;footer&gt;</code>.`,
    tests: [['header h1', 'text', 'O meu site'], ['main p', 'count', 2], ['footer p', 'count', 1]],
    solution: C`
<header>
  <h1>O meu site</h1>
</header>
<main>
  <p>Bem-vindo ao meu site.</p>
  <p>Aqui falo do que aprendo.</p>
</main>
<footer>
  <p>© 2026 Ana Silva</p>
</footer>`,
  }, {
    title: 'Dois artigos',
    text: 'Dentro de um main, põe dois article, cada um com um h2 e um parágrafo.',
    hint: H`<code>&lt;article&gt;&lt;h2&gt;...&lt;/h2&gt;&lt;p&gt;...&lt;/p&gt;&lt;/article&gt;</code>, duas vezes.`,
    tests: [['main article', 'count', 2], ['article h2', 'count', 2], ['article p', 'count', 2]],
    solution: C`
<main>
  <article>
    <h2>Aula de HTML</h2>
    <p>Aprendi as etiquetas principais.</p>
  </article>
  <article>
    <h2>Aula de CSS</h2>
    <p>Aprendi a mudar as cores.</p>
  </article>
</main>`,
  }],
});
