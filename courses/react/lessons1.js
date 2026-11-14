// ===== React do Zero — conteúdo das lições (parte 1) =====
// Este curso constrói uma app (uma lista de tarefas) ao longo das lições. Cada versão da app (APP_0, APP_1...)
// é o App.tsx completo nesse ponto; o exemplo de cada lição mostra-o, com as linhas novas a verde (prev).
// Passos: l, n, sel e chk (como no curso de HTML), act (['click', seletor] ou ['input', seletor, texto]),
// rr (os componentes que renderizaram nesse passo: a montagem, ou a ação) e wait (ms extra, para timers).
// O check verifica os tipos (TypeScript + @types/react) e corre cada passo num browser sem janela.
// No código, ‵ quer dizer ` e ¤{ quer dizer ${ (o J troca-os). No texto H`...`, usa &#96; e &#36;.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const J = (s, ...v) => C(s, ...v).replace(/‵/g, '`').replace(/¤\{/g, '${');
const LESSONS = [];

// ---------------------------------------------------------------- versões da app
const APP_0 = J`
export default function App() {
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <p>Ainda não há nada para fazer.</p>
    </main>
  );
}`;

const APP_1 = J`
export default function App() {
  const nome = "Ana";
  const total: number = 3;
  const feitas: number = 1;
  return (
    <main>
      <h1>Tarefas da {nome}</h1>
      <p className="resumo">Faltam {total - feitas} de {total}.</p>
      {feitas === total && <p className="parabens">Tudo feito!</p>}
    </main>
  );
}`;

const APP_2 = J`
interface TarefaProps {
  texto: string;
  feita: boolean;
}

function Tarefa({ texto, feita }: TarefaProps) {
  return <li className={feita ? "feita" : ""}>{texto}</li>;
}

export default function App() {
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <ul>
        <Tarefa texto="Estudar React" feita={false} />
        <Tarefa texto="Fazer o exercício" feita={true} />
      </ul>
    </main>
  );
}`;

const APP_3 = J`
interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

const TAREFAS: Tarefa[] = [
  { id: 1, texto: "Estudar React", feita: false },
  { id: 2, texto: "Fazer o exercício", feita: true },
  { id: 3, texto: "Ler a cábula", feita: false },
];

function ItemTarefa({ tarefa }: { tarefa: Tarefa }) {
  return <li className={tarefa.feita ? "feita" : ""}>{tarefa.texto}</li>;
}

export default function App() {
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <ul>
        {TAREFAS.map((t) => (
          <ItemTarefa key={t.id} tarefa={t} />
        ))}
      </ul>
    </main>
  );
}`;

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'O primeiro componente',
  short: 'o que é o React, um componente é uma função, e o JSX',
  body: H`
<p>No curso de JavaScript mudavas a página à mão: <code>querySelector</code>, <code>textContent</code>, <code>append</code>. Numa app grande isso fica impossível de manter. Com o <strong>React</strong>, descreves <em>como</em> a página deve ficar para cada estado dos dados, e o React trata de a pôr assim.</p>
<ul>
<li>Uma app React é feita de <strong>componentes</strong>. Um componente é uma <strong>função</strong> com nome em maiúscula que devolve o que aparece no ecrã.</li>
<li>O que a função devolve escreve-se em <strong>JSX</strong>: parece HTML, mas está dentro do JavaScript (num ficheiro <code>.tsx</code>). O JSX devolvido tem de ter um só elemento à volta de tudo.</li>
<li>Cria-se um projeto com <code>npm create vite@latest</code> (escolhe React e TypeScript) e corre-se com <code>npm run dev</code>. O componente principal está em <code>src/App.tsx</code>.</li>
<li>O projeto também traz um <code>src/main.tsx</code>, já feito: procura o <code>&lt;div id="root"&gt;</code> do <code>index.html</code> e desenha lá a App, dentro de um <code>&lt;StrictMode&gt;</code> (lição 9). Não precisas de lhe mexer.</li>
<li>Neste curso vais construir uma app de tarefas, lição a lição. O painel "Componentes" mostra a árvore de componentes, como as React DevTools do browser.</li>
</ul>`,
  analogy: 'Com o DOM, eras um pintor que retocava o quadro a cada mudança. Com o React, entregas a descrição do quadro ("um título, uma lista com estas tarefas") e um assistente compara-a com o que está pintado e retoca só o que mudou.',
  examples: [{
    title: 'A app começa assim',
    code: APP_0,
    steps: [
      { l: 1, rr: ['App'], n: H`Um componente é uma função com nome em maiúscula. <code>export default</code> diz que é o que este ficheiro dá ao resto do projeto. O React chamou-a uma vez, para a desenhar: vês o <code>&lt;App&gt;</code> no painel "Componentes".` },
      { l: 2, n: H`A função devolve o que deve aparecer. Os parênteses deixam escrever o JSX em várias linhas.` },
      { l: 4, sel: 'h1', chk: [['h1', 'text', 'As minhas tarefas']], n: H`Isto é JSX: parece HTML, mas é JavaScript. O React transforma-o em elementos a sério na página.` },
      { l: 5, sel: 'p', chk: [['main > *', 'count', 2]], n: H`Tudo está dentro de um só <code>&lt;main&gt;</code>: um componente devolve sempre um só elemento (que pode ter muitos lá dentro).` },
    ],
  }],
  mistakes: [
    H`Dar ao componente um nome com minúscula (<code>function app()</code>): o React trata-o como uma etiqueta HTML desconhecida.`,
    H`Devolver dois elementos lado a lado sem nada à volta. Usa um elemento à volta, ou um fragmento <code>&lt;&gt;...&lt;/&gt;</code>.`,
    H`Esquecer o <code>return</code>: o componente não mostra nada.`,
    H`Esquecer de fechar etiquetas que em HTML podiam ficar abertas: em JSX escreve-se <code>&lt;br /&gt;</code> e <code>&lt;input /&gt;</code>.`,
  ],
  quiz: [
    { q: 'Quantos parágrafos aparecem?', code: J`
export default function App() {
  return (
    <div>
      <p>Um</p>
      <p>Dois</p>
    </div>
  );
}`, ask: ['p', 'count'], opts: ['1', '2', '0', '3'], ok: 1, check: true,
      exp: 'O componente devolve um div com dois parágrafos lá dentro. O que está no return é o que aparece.' },
    { q: 'O que acontece com este componente?', code: J`
export default function App() {
  return (
    <h1>Título</h1>
    <p>Texto</p>
  );
}`, opts: ['Aparecem os dois', 'Só aparece o título', 'Não compila: o JSX devolvido tem de ter um só elemento à volta', 'Só aparece o texto'], ok: 2,
      exp: H`Dois elementos lado a lado, sem nada à volta, não são uma só expressão. Põe-nos dentro de um <code>&lt;div&gt;</code> ou de um fragmento <code>&lt;&gt;...&lt;/&gt;</code>.` },
    { q: 'O que é um componente React?', opts: ['Um ficheiro HTML', 'Uma função com nome em maiúscula que devolve o que aparece no ecrã', 'Uma classe de CSS', 'Um elemento do DOM'], ok: 1,
      exp: 'Um componente é uma função. O React chama-a para saber o que desenhar, e volta a chamá-la quando alguma coisa muda (lição 4).' },
    { q: 'Que texto tem o título?', code: J`
export default function App() {
  return (
    <main>
      <h1>Olá</h1>
    </main>
  );
}`, ask: ['h1', 'text'], opts: ['Olá', 'App', 'main', '(nenhum elemento)'], ok: 0, check: true,
      exp: 'O JSX vira elementos a sério: um main com um h1 lá dentro.' },
  ],
  exercises: [{
    title: 'A tua primeira app',
    text: 'Escreve um componente App que mostre um h1 com "Olá, React" e um parágrafo com o teu nome.',
    hint: H`Um <code>return</code> com um <code>&lt;main&gt;</code> à volta do h1 e do p.`,
    tests: [['h1', 'text', 'Olá, React'], ['p', 'count', 1]],
    solution: J`
export default function App() {
  return (
    <main>
      <h1>Olá, React</h1>
      <p>Ana Silva</p>
    </main>
  );
}`,
  }, {
    title: 'Uma lista fixa',
    text: 'Escreve um componente App com um título "Compras" e uma lista (ul) com três itens: pão, leite e fruta.',
    hint: H`É JSX igual ao HTML: <code>&lt;ul&gt;&lt;li&gt;pão&lt;/li&gt;...&lt;/ul&gt;</code>.`,
    tests: [['h1', 'text', 'Compras'], ['li', 'count', 3]],
    solution: J`
export default function App() {
  return (
    <main>
      <h1>Compras</h1>
      <ul>
        <li>pão</li>
        <li>leite</li>
        <li>fruta</li>
      </ul>
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'JSX: JavaScript dentro do HTML',
  short: 'chavetas, className e mostrar uma coisa só se for verdade',
  body: H`
<p>O JSX parece HTML, mas pode ter <strong>JavaScript lá dentro</strong>, entre chavetas:</p>
<ul>
<li><code>&lt;h1&gt;Tarefas da {nome}&lt;/h1&gt;</code>: o valor de uma variável. Também podes pôr contas e chamadas: <code>{total - feitas}</code>.</li>
<li>O atributo <code>class</code> escreve-se <code>className</code> (porque <code>class</code> é uma palavra do JavaScript). E os atributos de eventos e estilos escrevem-se em camelCase: <code>onClick</code>, <code>style={{ color: "red" }}</code>.</li>
<li>Para mostrar uma coisa só às vezes: <code>{condicao &amp;&amp; &lt;p&gt;...&lt;/p&gt;}</code>. Se a condição for falsa, não aparece nada. Para escolher entre duas: <code>{condicao ? &lt;A /&gt; : &lt;B /&gt;}</code>.</li>
<li>Os valores <code>false</code>, <code>null</code> e <code>undefined</code> não aparecem; o número 0 aparece (cuidado com <code>{lista.length &amp;&amp; ...}</code>).</li>
</ul>`,
  analogy: 'O JSX é um formulário com espaços em branco: o texto fixo já está impresso, e as chavetas são os espaços onde o React escreve os valores do momento.',
  examples: [{
    title: 'Valores e condições no JSX',
    code: APP_1,
    prev: APP_0,
    steps: [
      { l: 2, rr: ['App'], n: H`Variáveis normais de JavaScript, dentro do componente. (As linhas a verde são as novas em relação à lição anterior.) O <code>: number</code> diz que são números quaisquer: sem ele, o TypeScript via que 1 e 3 nunca são iguais e queixava-se da comparação da linha 9.` },
      { l: 7, sel: 'h1', chk: [['h1', 'text', 'Tarefas da Ana']], n: H`<code>{nome}</code> mete o valor da variável no meio do texto.` },
      { l: 8, sel: '.resumo', chk: [['.resumo', 'text', 'Faltam 2 de 3.'], ['.resumo', 'color', 'cinzento']], n: H`Uma conta entre chavetas, e <code>className</code> em vez de <code>class</code> (o CSS da app põe a classe resumo a cinzento).` },
      { l: 9, chk: [['.parabens', 'count', 0]], n: H`<code>feitas === total &amp;&amp; ...</code>: como 1 não é igual a 3, a condição é falsa e o parágrafo não aparece (não está na página nem escondido: simplesmente não existe).` },
    ],
  }],
  mistakes: [
    H`Escrever <code>class=</code> em vez de <code>className=</code>.`,
    H`Usar aspas à volta de uma expressão: <code>title="{nome}"</code> mostra literalmente {nome}. É <code>title={nome}</code>.`,
    H`<code>{lista.length &amp;&amp; &lt;Lista /&gt;}</code> com a lista vazia mostra um 0. Escreve <code>{lista.length &gt; 0 &amp;&amp; ...}</code>.`,
    H`Pôr um <code>if</code> dentro das chavetas: só cabem expressões. Usa <code>&amp;&amp;</code>, <code>? :</code>, ou um <code>if</code> antes do return.`,
  ],
  quiz: [
    { q: 'Que texto aparece no parágrafo?', code: J`
export default function App() {
  const a = 2;
  const b = 3;
  return <p>Soma: {a + b}</p>;
}`, ask: ['p', 'text'], opts: ['Soma: 5', 'Soma: {a + b}', 'Soma: 23', 'Soma: a + b'], ok: 0, check: true,
      exp: 'Dentro das chavetas está JavaScript: a + b é calculado e dá 5.' },
    { q: 'Quantos parágrafos aparecem?', code: J`
export default function App() {
  const logado = false;
  return (
    <div>
      <p>Bem-vindo</p>
      {logado && <p>Olá, Ana</p>}
    </div>
  );
}`, ask: ['p', 'count'], opts: ['0', '1', '2', 'false'], ok: 1, check: true,
      exp: H`Com <code>logado</code> a false, a expressão dá false, e o React não desenha nada para false.` },
    { q: 'Que texto aparece no div? (atenção ao zero)', code: J`
export default function App() {
  const mensagens: string[] = [];
  return <div>{mensagens.length && <p>Tens mensagens</p>}</div>;
}`, ask: ['div', 'text'], opts: ['(texto vazio)', '0', 'Tens mensagens', 'false'], ok: 1, check: true,
      exp: H`<code>0 &amp;&amp; ...</code> dá 0, e o React mostra o número 0 (só esconde false, null e undefined). Escreve <code>mensagens.length &gt; 0 &amp;&amp; ...</code>.` },
    { q: 'Qual destas linhas dá a classe "aviso" a um parágrafo?', opts: ['<p class="aviso">', '<p className="aviso">', '<p class={aviso}>', '<p style="aviso">'], ok: 1, mono: true,
      exp: H`Em JSX é <code>className</code>, porque <code>class</code> é uma palavra reservada do JavaScript.` },
  ],
  exercises: [{
    title: 'Cartão de aluno',
    text: 'Com as constantes nome = "Rui" e nota = 14, mostra um h1 com o nome e um parágrafo "Nota: 14". Se a nota for 10 ou mais, mostra também um parágrafo com a classe parabens e o texto "Aprovado".',
    hint: H`<code>{nota &gt;= 10 &amp;&amp; &lt;p className="parabens"&gt;Aprovado&lt;/p&gt;}</code>`,
    tests: [['h1', 'text', 'Rui'], ['p', 'count', 2], ['.parabens', 'text', 'Aprovado']],
    solution: J`
export default function App() {
  const nome = "Rui";
  const nota = 14;
  return (
    <main>
      <h1>{nome}</h1>
      <p>Nota: {nota}</p>
      {nota >= 10 && <p className="parabens">Aprovado</p>}
    </main>
  );
}`,
  }, {
    title: 'Escolher a mensagem',
    text: 'Com a constante temperatura = 28, mostra "Está calor" se for mais de 25 e "Está fresco" se não for, num só parágrafo.',
    hint: H`<code>&lt;p&gt;{temperatura &gt; 25 ? "Está calor" : "Está fresco"}&lt;/p&gt;</code>`,
    tests: [['p', 'text', 'Está calor']],
    solution: J`
export default function App() {
  const temperatura = 28;
  return <p>{temperatura > 25 ? "Está calor" : "Está fresco"}</p>;
}`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Componentes e props',
  short: 'partir a app em peças e passar-lhes dados',
  body: H`
<p>Em vez de uma função gigante, a app parte-se em <strong>componentes pequenos</strong>, cada um com uma tarefa (como as funções do C). Um componente usa-se como uma etiqueta: <code>&lt;Tarefa /&gt;</code>.</p>
<ul>
<li>Os dados passam-se como atributos, chamados <strong>props</strong>: <code>&lt;Tarefa texto="Estudar" feita={false} /&gt;</code>. Texto vai entre aspas; tudo o resto entre chavetas.</li>
<li>O componente recebe as props num objeto; o costume é desmontá-lo logo nos parâmetros: <code>function Tarefa({ texto, feita }: TarefaProps)</code>.</li>
<li>Em TypeScript, uma interface diz que props o componente aceita. Esquecer uma, ou passar o tipo errado, é um erro de compilação.</li>
<li>As props são só para ler: um componente nunca muda as suas props.</li>
</ul>`,
  analogy: 'Um componente é um carimbo com espaços para preencher; as props são o que escreves em cada espaço. O mesmo carimbo de "tarefa" serve para todas as tarefas, cada uma com o seu texto.',
  examples: [{
    title: 'Um componente Tarefa',
    code: APP_2,
    prev: APP_1,
    steps: [
      { l: 1, n: H`A interface diz que props uma Tarefa recebe: um texto e se está feita.` },
      { l: 6, n: H`O componente <code>Tarefa</code> recebe as props e devolve um <code>&lt;li&gt;</code>. Se estiver feita, ganha a classe "feita" (riscada).` },
      { l: 14, rr: ['App', 'Tarefa'], sel: 'li', chk: [['li', 'count', 2]], n: H`A App usa o componente duas vezes, com props diferentes. No painel "Componentes" vês a App com duas Tarefas lá dentro, cada uma com as suas props.` },
      { l: 15, sel: 'li.feita', chk: [['li.feita', 'text', 'Fazer o exercício'], ['li.feita', 'color', 'cinzento']], n: H`A segunda recebeu <code>feita={true}</code>, por isso aparece riscada.` },
    ],
  }],
  mistakes: [
    H`Passar números ou booleanos entre aspas: <code>feita="false"</code> é o texto "false" (que até é truthy). É <code>feita={false}</code>.`,
    H`Esquecer uma prop obrigatória: <em>error TS2741: Property 'feita' is missing in type...</em>`,
    H`Tentar mudar uma prop dentro do componente: as props são só de leitura. Para mudar dados usa-se estado (lição 4).`,
    H`Escrever o componente dentro de outro componente: define-os sempre ao nível de cima do ficheiro.`,
  ],
  quiz: [
    { q: 'Quantos itens riscados (com a classe feita) aparecem?', code: J`
function Item({ texto, feita }: { texto: string; feita: boolean }) {
  return <li className={feita ? "feita" : ""}>{texto}</li>;
}

export default function App() {
  return (
    <ul>
      <Item texto="A" feita={true} />
      <Item texto="B" feita={false} />
      <Item texto="C" feita={true} />
    </ul>
  );
}`, ask: ['li.feita', 'count'], opts: ['1', '2', '3', '0'], ok: 1, check: true,
      exp: 'O mesmo componente, três vezes, com props diferentes: o A e o C estão feitos.' },
    { q: 'O que acontece com este código?', code: J`
function Ola({ nome }: { nome: string }) {
  return <p>Olá, {nome}</p>;
}

export default function App() {
  return <Ola />;
}`, ask: ['p', 'text'], opts: ['Olá, ', 'Olá, undefined', "error TS2741: Property 'nome' is missing in type '{}' but required in type '{ nome: string; }'.", 'Olá, nome'], ok: 2, check: true,
      exp: H`O componente precisa da prop <code>nome</code> e não a recebeu. Em JavaScript aparecia "Olá, " sem nome; com TypeScript, não compila.` },
    { q: 'Que texto aparece?', code: J`
function Preco({ valor }: { valor: number }) {
  return <p>{valor * 2} euros</p>;
}

export default function App() {
  return <Preco valor={10} />;
}`, ask: ['p', 'text'], opts: ['20 euros', '1010 euros', '10 euros', 'NaN euros'], ok: 0, check: true,
      exp: H`<code>valor={10}</code> passa o número 10 (com chavetas). Com <code>valor="10"</code> seria texto, e o TypeScript não deixava.` },
    { q: 'Um componente pode mudar as props que recebeu?', opts: ['Sim, sempre', 'Não: as props são só de leitura; para dados que mudam usa-se estado', 'Só se forem números', 'Só no primeiro render'], ok: 1,
      exp: 'As props vêm de quem usa o componente e pertencem-lhe. Um componente que muda as suas props torna a app imprevisível.' },
  ],
  exercises: [{
    title: 'Cartões de contacto',
    text: 'Escreve um componente Contacto com as props nome e email (texto), que mostra um h2 com o nome e um parágrafo com o email. Usa-o na App para dois contactos.',
    hint: H`<code>function Contacto({ nome, email }: { nome: string; email: string })</code> e, na App, <code>&lt;Contacto nome="Ana" email="ana@exemplo.pt" /&gt;</code>.`,
    tests: [['h2', 'count', 2], ['h2', 'text', 'Ana'], ['p', 'count', 2]],
    solution: J`
interface ContactoProps {
  nome: string;
  email: string;
}

function Contacto({ nome, email }: ContactoProps) {
  return (
    <div>
      <h2>{nome}</h2>
      <p>{email}</p>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Contacto nome="Ana" email="ana@exemplo.pt" />
      <Contacto nome="Rui" email="rui@exemplo.pt" />
    </main>
  );
}`,
  }, {
    title: 'Botão com cor',
    text: 'Escreve um componente Aviso com as props texto e urgente (boolean). Se for urgente, o parágrafo tem a classe erro (vermelho). Usa-o duas vezes: uma urgente, outra não.',
    hint: H`<code>&lt;p className={urgente ? "erro" : ""}&gt;{texto}&lt;/p&gt;</code>`,
    tests: [['p', 'count', 2], ['p.erro', 'count', 1], ['p.erro', 'color', 'vermelho']],
    solution: J`
interface AvisoProps {
  texto: string;
  urgente: boolean;
}

function Aviso({ texto, urgente }: AvisoProps) {
  return <p className={urgente ? "erro" : ""}>{texto}</p>;
}

export default function App() {
  return (
    <main>
      <Aviso texto="Teste amanhã!" urgente={true} />
      <Aviso texto="Trazer calculadora" urgente={false} />
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Listas e keys',
  short: 'desenhar um array com map e porque é que cada item precisa de uma key',
  body: H`
<p>Os dados de uma app vêm quase sempre num array. Para desenhar um elemento por cada item, usa-se o <code>map</code> que já conheces, dentro de chavetas:</p>
<pre class="snip"><code>{tarefas.map((t) =&gt; (
  &lt;ItemTarefa key={t.id} tarefa={t} /&gt;
))}</code></pre>
<ul>
<li>O <code>map</code> transforma cada tarefa num elemento JSX, e o React desenha o array resultante.</li>
<li>Cada item precisa de uma <strong>key</strong>: um valor único e estável (o id), para o React saber que item é qual quando a lista muda. Não uses o índice do array como key se a lista puder mudar de ordem.</li>
<li>A <code>key</code> não chega ao componente como prop: é só para o React.</li>
<li>Agora os dados (o array <code>TAREFAS</code>) estão separados da forma de os mostrar: para acrescentar uma tarefa, mexe-se no array, não no JSX.</li>
</ul>`,
  analogy: 'A key é o número de aluno numa turma. Se dois alunos trocam de lugar, o professor sabe quem é quem pelo número, não pela cadeira onde estão sentados (o índice).',
  examples: [{
    title: 'Uma tarefa por cada item do array',
    code: APP_3,
    prev: APP_2,
    steps: [
      { l: 1, n: H`Agora uma tarefa é um objeto com id, texto e feita, descrito por uma interface.` },
      { l: 7, n: H`Os dados ficam num array, fora do JSX.` },
      { l: 13, n: H`<code>ItemTarefa</code> recebe a tarefa inteira como prop. (Chama-se ItemTarefa para não se confundir com a interface Tarefa.)` },
      { l: 22, rr: ['App', 'ItemTarefa'], sel: 'li', chk: [['li', 'count', 3], ['li.feita', 'count', 1]], n: H`O <code>map</code> cria um <code>&lt;ItemTarefa&gt;</code> por tarefa: três itens. Repara na árvore: três ItemTarefa, cada um com a sua tarefa.` },
      { l: 22, sel: 'li:last-child', chk: [['li:last-child', 'text', 'Ler a cábula']], n: H`Cada item tem <code>key={t.id}</code>. Se a ordem das tarefas mudar, o React reconhece cada uma pelo id.` },
    ],
  }],
  mistakes: [
    H`Esquecer a <code>key</code>: a consola do browser avisa <em>Each child in a list should have a unique "key" prop</em>, e as listas que mudam podem trocar itens.`,
    H`Usar o índice (<code>key={i}</code>) numa lista que se pode reordenar ou apagar: o React confunde os itens.`,
    H`Esquecer o <code>return</code> numa função seta com chavetas dentro do map: <code>t =&gt; { &lt;li&gt;...&lt;/li&gt; }</code> não devolve nada. Usa parênteses: <code>t =&gt; ( ... )</code>.`,
    H`Tentar usar <code>for</code> dentro do JSX: só cabem expressões. Usa <code>map</code>.`,
  ],
  quiz: [
    { q: 'Quantos itens aparecem?', code: J`
const nomes = ["Ana", "Rui", "Ines", "Tiago"];

export default function App() {
  return (
    <ul>
      {nomes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
}`, ask: ['li', 'count'], opts: ['1', '3', '4', '0'], ok: 2, check: true,
      exp: 'O map cria um li por cada nome do array.' },
    { q: 'Quantos itens aparecem?', code: J`
const notas = [12, 8, 15, 9];

export default function App() {
  return (
    <ul>
      {notas
        .filter((n) => n >= 10)
        .map((n) => (
          <li key={n}>{n}</li>
        ))}
    </ul>
  );
}`, ask: ['li', 'count'], opts: ['4', '2', '0', '1'], ok: 1, check: true,
      exp: H`Primeiro o <code>filter</code> fica com as positivas (12 e 15), depois o <code>map</code> desenha-as. Tudo o que aprendeste sobre arrays serve dentro do JSX.` },
    { q: 'Que texto tem o primeiro item?', code: J`
interface Aluno {
  numero: number;
  nome: string;
}
const turma: Aluno[] = [
  { numero: 101, nome: "Ana" },
  { numero: 102, nome: "Rui" },
];

export default function App() {
  return (
    <ul>
      {turma.map((a) => (
        <li key={a.numero}>
          {a.numero}: {a.nome}
        </li>
      ))}
    </ul>
  );
}`, ask: ['li:first-child', 'text'], opts: ['101: Ana', 'Ana', '0: Ana', '{a.numero}: {a.nome}'], ok: 0, check: true,
      exp: 'Cada item mostra o número e o nome do aluno. O número de aluno é também uma boa key: é único e não muda.' },
    { q: 'Para que serve a key de cada item de uma lista?', opts: ['Para o CSS', 'Para o React saber que item é qual quando a lista muda', 'Para ordenar a lista', 'Para o item receber o id como prop'], ok: 1,
      exp: 'Com uma key estável, o React consegue saber que item foi acrescentado, apagado ou mudado de sítio, e só mexe nesse. A key não chega ao componente como prop.' },
  ],
  exercises: [{
    title: 'Lista de UCs',
    text: 'Com o array ["BD", "SO", "RC"], mostra um título "UCs" e uma lista com um item por UC.',
    hint: H`<code>{ucs.map((uc) =&gt; &lt;li key={uc}&gt;{uc}&lt;/li&gt;)}</code> (os textos são únicos, por isso servem de key).`,
    tests: [['h1', 'text', 'UCs'], ['li', 'count', 3], ['li:first-child', 'text', 'BD']],
    solution: J`
const UCS = ["BD", "SO", "RC"];

export default function App() {
  return (
    <main>
      <h1>UCs</h1>
      <ul>
        {UCS.map((uc) => (
          <li key={uc}>{uc}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }, {
    title: 'Só os aprovados',
    text: 'Com a turma [Ana 17, Rui 9, Ines 14] (com ids 1, 2, 3), mostra só os aprovados, cada um num item "nome (nota)", usando um componente ItemAluno.',
    hint: H`<code>turma.filter((a) =&gt; a.nota &gt;= 10).map((a) =&gt; &lt;ItemAluno key={a.id} aluno={a} /&gt;)</code>`,
    tests: [['li', 'count', 2], ['li:first-child', 'text', 'Ana (17)'], ['li:last-child', 'text', 'Ines (14)']],
    solution: J`
interface Aluno {
  id: number;
  nome: string;
  nota: number;
}

const TURMA: Aluno[] = [
  { id: 1, nome: "Ana", nota: 17 },
  { id: 2, nome: "Rui", nota: 9 },
  { id: 3, nome: "Ines", nota: 14 },
];

function ItemAluno({ aluno }: { aluno: Aluno }) {
  return (
    <li>
      {aluno.nome} ({aluno.nota})
    </li>
  );
}

export default function App() {
  return (
    <ul>
      {TURMA.filter((a) => a.nota >= 10).map((a) => (
        <ItemAluno key={a.id} aluno={a} />
      ))}
    </ul>
  );
}`,
  }],
});
