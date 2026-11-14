// ===== React do Zero — conteúdo das lições (parte 2) =====
// Para o código de cada lição caber no ecrã, cada versão da app só tem o que essa lição ensina.
// A lição 10 junta tudo na app completa.

const TIPOS_E_DADOS = J`
interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

const TAREFAS: Tarefa[] = [
  { id: 1, texto: "Estudar React", feita: false },
  { id: 2, texto: "Fazer o exercício", feita: true },
  { id: 3, texto: "Ler a cábula", feita: false },
];`;

const APP_4 = J`
import { useState } from "react";

${TIPOS_E_DADOS}

function ItemTarefa({ tarefa }: { tarefa: Tarefa }) {
  return <li className={tarefa.feita ? "feita" : ""}>{tarefa.texto}</li>;
}

export default function App() {
  const [mostrarFeitas, setMostrarFeitas] = useState(true);
  const visiveis = mostrarFeitas ? TAREFAS : TAREFAS.filter((t) => !t.feita);
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <button onClick={() => setMostrarFeitas(!mostrarFeitas)}>
        {mostrarFeitas ? "Esconder as feitas" : "Mostrar todas"}
      </button>
      <ul>
        {visiveis.map((t) => (
          <ItemTarefa key={t.id} tarefa={t} />
        ))}
      </ul>
    </main>
  );
}`;

const APP_5 = J`
import { useState } from "react";
import type { FormEvent } from "react";

${TIPOS_E_DADOS}

function ItemTarefa({ tarefa }: { tarefa: Tarefa }) {
  return <li className={tarefa.feita ? "feita" : ""}>{tarefa.texto}</li>;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS);
  const [texto, setTexto] = useState("");

  function adicionar(e: FormEvent) {
    e.preventDefault();
    if (texto.trim() === "") {
      return;
    }
    setTarefas([...tarefas, { id: tarefas.length + 1, texto: texto.trim(), feita: false }]);
    setTexto("");
  }

  return (
    <main>
      <h1>As minhas tarefas</h1>
      <form onSubmit={adicionar}>
        <input id="nova" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Nova tarefa" aria-label="Nova tarefa" />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {tarefas.map((t) => (
          <ItemTarefa key={t.id} tarefa={t} />
        ))}
      </ul>
    </main>
  );
}`;

const APP_6 = J`
import { useState } from "react";

${TIPOS_E_DADOS}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS);

  function alternar(id: number) {
    setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }

  function remover(id: number) {
    setTarefas(tarefas.filter((t) => t.id !== id));
  }

  return (
    <main>
      <h1>As minhas tarefas</h1>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>
            <span>{t.texto}</span>
            <button className="alternar" onClick={() => alternar(t.id)}>✓</button>
            <button className="remover" onClick={() => remover(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  );
}`;

const APP_7 = J`
import { useState } from "react";

${TIPOS_E_DADOS}

interface ItemProps {
  tarefa: Tarefa;
  onAlternar: (id: number) => void;
}

function ItemTarefa({ tarefa, onAlternar }: ItemProps) {
  return (
    <li className={tarefa.feita ? "feita" : ""}>
      <span>{tarefa.texto}</span>
      <button onClick={() => onAlternar(tarefa.id)}>✓</button>
    </li>
  );
}

function Resumo({ tarefas }: { tarefas: Tarefa[] }) {
  const feitas = tarefas.filter((t) => t.feita).length;
  return <p className="resumo">{feitas} de {tarefas.length} feitas</p>;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS);

  function alternar(id: number) {
    setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }

  return (
    <main>
      <h1>As minhas tarefas</h1>
      <Resumo tarefas={tarefas} />
      <ul>
        {tarefas.map((t) => (
          <ItemTarefa key={t.id} tarefa={t} onAlternar={alternar} />
        ))}
      </ul>
    </main>
  );
}`;

// O número da linha de um bocado de código numa versão da app (para os passos não terem números "mágicos").
const linhaDe = (app, texto) => app.split('\n').findIndex(l => l.includes(texto)) + 1;

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Estado com useState',
  short: 'dados que mudam, o setter e o componente a renderizar outra vez',
  body: H`
<p>Até aqui a app mostrava sempre o mesmo. Para dados que mudam com o tempo (o que o utilizador escreve, um filtro, a lista de tarefas) usa-se <strong>estado</strong>:</p>
<pre class="snip"><code>const [mostrarFeitas, setMostrarFeitas] = useState(true);</code></pre>
<ul>
<li><code>useState(valorInicial)</code> devolve dois valores: o valor atual e uma função para o mudar (o <strong>setter</strong>). Os nomes escolhes tu; o costume é <code>x</code> e <code>setX</code>.</li>
<li>Quando chamas o setter, o React guarda o valor novo e <strong>volta a chamar a função do componente</strong> (renderiza outra vez). Desta vez, <code>useState</code> devolve o valor novo, e o JSX sai diferente.</li>
<li>Quando um componente renderiza, os filhos também renderizam. O painel "Componentes" marca a amarelo quem renderizou em cada passo.</li>
<li>Uma variável normal (<code>let</code>) não serve: volta ao valor inicial em cada render e mudá-la não faz o React desenhar outra vez.</li>
<li>O estado de cada componente fica guardado pelo React entre renders. Chama os hooks (<code>useState</code> e companhia) sempre no topo do componente, nunca dentro de ifs ou ciclos.</li>
</ul>`,
  analogy: 'O estado é a memória do componente. A função do componente é uma fotografia tirada com os valores do momento; quando chamas o setter, o React guarda o valor novo e tira outra fotografia.',
  examples: [{
    title: 'Esconder as tarefas feitas',
    code: APP_4,
    prev: APP_3,
    steps: [
      { l: linhaDe(APP_4, 'useState(true)'), rr: ['App', 'ItemTarefa'], n: H`<code>useState(true)</code>: o estado começa a true. Vê no painel "Componentes": a App tem agora um estado <code>mostrarFeitas: true</code>.` },
      { l: linhaDe(APP_4, 'const visiveis'), sel: 'li', chk: [['li', 'count', 3]], n: H`Com <code>mostrarFeitas</code> a true, as visíveis são todas: três itens.` },
      { l: linhaDe(APP_4, '<button onClick'), sel: 'button', n: H`O <code>onClick</code> recebe a função a correr quando se carregar no botão. Ainda não aconteceu nada.` },
      { l: linhaDe(APP_4, '<button onClick'), act: ['click', 'button'], rr: ['App', 'ItemTarefa'], chk: [['li', 'count', 2], ['button', 'text', 'Mostrar todas']], n: H`Carregaste no botão: <code>setMostrarFeitas(false)</code>. O React volta a chamar a função <code>App</code> (a amarelo), agora com o estado a false. O botão mudou de texto e a tarefa feita desapareceu. Os ItemTarefa também renderizaram, porque o pai renderizou.` },
      { l: linhaDe(APP_4, 'const visiveis'), n: H`Nesse render novo, <code>visiveis</code> foi calculada outra vez, com o estado novo. Não é estado: é calculada a partir dele.` },
      { l: linhaDe(APP_4, '<button onClick'), act: ['click', 'button'], rr: ['App', 'ItemTarefa'], chk: [['li', 'count', 3], ['button', 'text', 'Esconder as feitas']], n: 'Outra vez: o estado volta a true e as três tarefas voltam.' },
    ],
  }, {
    title: 'Porque é que uma variável normal não serve',
    code: J`
import { useState } from "react";

export default function App() {
  let semEstado = 0;
  const [comEstado, setComEstado] = useState(0);

  function carregar() {
    semEstado = semEstado + 1;
    setComEstado(comEstado + 1);
  }

  return (
    <div>
      <button onClick={carregar}>+1</button>
      <p id="sem">Sem estado: {semEstado}</p>
      <p id="com">Com estado: {comEstado}</p>
    </div>
  );
}`,
    steps: [
      { l: 4, rr: ['App'], n: H`Uma variável normal, criada de novo cada vez que a função App corre.` },
      { l: 5, n: 'E um estado, guardado pelo React entre renders.' },
      { l: 9, act: ['click', 'button'], rr: ['App'], chk: [['#sem', 'text', 'Sem estado: 0'], ['#com', 'text', 'Com estado: 1']], n: H`Carregaste: as duas sobem para 1, mas o setter faz a App renderizar outra vez, e nesse render novo a linha 4 volta a pôr <code>semEstado</code> a 0. Só o estado se lembra.` },
      { l: 9, act: ['click', 'button'], rr: ['App'], chk: [['#sem', 'text', 'Sem estado: 0'], ['#com', 'text', 'Com estado: 2']], n: 'A variável normal fica sempre em 0 no ecrã; o estado vai contando.' },
    ],
  }],
  mistakes: [
    H`Mudar o estado diretamente (<code>mostrarFeitas = false</code>): o React não sabe que mudou. Usa sempre o setter.`,
    H`Usar uma variável <code>let</code> para dados que mudam: volta ao início em cada render.`,
    H`Chamar o setter diretamente no corpo do componente (fora de um evento): cada render muda o estado, que provoca outro render, sem fim.`,
    H`Escrever <code>onClick={setX(true)}</code>: isso chama o setter logo ao desenhar. É <code>onClick={() =&gt; setX(true)}</code>.`,
    H`Chamar <code>useState</code> dentro de um if ou de um ciclo: os hooks vão sempre no topo do componente.`,
  ],
  quiz: [
    { q: 'Depois de carregar 3 vezes no botão, que número aparece?', code: J`
import { useState } from "react";

export default function App() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`, acts: [['click', 'button'], ['click', 'button'], ['click', 'button']], ask: ['button', 'text'], opts: ['0', '1', '3', '4'], ok: 2, check: true,
      exp: 'Cada vez que carregas, o botão chama o setter com o valor atual + 1, e o componente renderiza outra vez com o valor novo.' },
    { q: 'Depois de carregar 2 vezes no botão, que número aparece?', code: J`
export default function App() {
  let n = 0;
  return <button onClick={() => { n = n + 1; }}>{n}</button>;
}`, acts: [['click', 'button'], ['click', 'button']], ask: ['button', 'text'], opts: ['0', '1', '2', 'NaN'], ok: 0, check: true,
      exp: H`Mudar uma variável normal não faz o React desenhar outra vez, por isso o ecrã continua com 0. Para isso é preciso <code>useState</code>.` },
    { q: 'Depois de carregar 1 vez no botão, que texto tem o parágrafo?', code: J`
import { useState } from "react";

export default function App() {
  const [aberto, setAberto] = useState(false);
  return (
    <div>
      <button onClick={() => setAberto(!aberto)}>Mais</button>
      <p>{aberto ? "Detalhes visíveis" : "Carrega em Mais"}</p>
    </div>
  );
}`, acts: [['click', 'button']], ask: ['p', 'text'], opts: ['Carrega em Mais', 'Detalhes visíveis', 'Mais', 'false'], ok: 1, check: true,
      exp: H`O estado passa de false para true, e no render novo o <code>? :</code> escolhe o outro texto.` },
    { q: 'O que acontece quando se chama o setter (por exemplo, setN(5))?', opts: ['O valor muda logo na variável n, e nada mais', 'O React guarda o valor novo e volta a chamar a função do componente, que desenha com n a 5', 'A página recarrega', 'O componente é apagado e criado de novo, perdendo o estado'], ok: 1,
      exp: 'O setter não muda a variável do render atual: pede ao React um render novo, e nesse render o useState devolve o valor novo.' },
  ],
  exercises: [{
    title: 'Contador com dois botões',
    text: 'Faz um contador com um parágrafo (id conta) que começa em 0 e dois botões: "+1" e "-1". O teste carrega em +1, +1 e -1.',
    hint: H`Um <code>useState(0)</code> e dois botões com <code>onClick={() =&gt; setN(n + 1)}</code> e <code>n - 1</code>.`,
    acts: [['click', '#mais'], ['click', '#mais'], ['click', '#menos']],
    tests: [['#conta', 'text', '1']],
    solution: J`
import { useState } from "react";

export default function App() {
  const [n, setN] = useState(0);
  return (
    <main>
      <p id="conta">{n}</p>
      <button id="mais" onClick={() => setN(n + 1)}>+1</button>
      <button id="menos" onClick={() => setN(n - 1)}>-1</button>
    </main>
  );
}`,
  }, {
    title: 'Mostrar e esconder',
    text: 'Faz um botão "Ver resposta" que, ao ser carregado, mostra um parágrafo com a classe resposta e o texto "42". Antes de carregar, o parágrafo não existe. O teste carrega uma vez.',
    hint: H`Um estado booleano e <code>{visivel &amp;&amp; &lt;p className="resposta"&gt;42&lt;/p&gt;}</code>.`,
    acts: [['click', 'button']],
    tests: [['.resposta', 'count', 1], ['.resposta', 'text', '42']],
    solution: J`
import { useState } from "react";

export default function App() {
  const [visivel, setVisivel] = useState(false);
  return (
    <main>
      <button onClick={() => setVisivel(true)}>Ver resposta</button>
      {visivel && <p className="resposta">42</p>}
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Formulários: o que o utilizador escreve',
  short: 'inputs controlados, onChange, onSubmit e acrescentar ao estado',
  body: H`
<p>Para ler o que o utilizador escreve, o React usa <strong>inputs controlados</strong>: o valor do campo vem do estado, e cada tecla atualiza o estado.</p>
<pre class="snip"><code>&lt;input value={texto} onChange={(e) =&gt; setTexto(e.target.value)} /&gt;</code></pre>
<ul>
<li><code>value={texto}</code>: o campo mostra sempre o que está no estado. <code>onChange</code> corre em cada tecla, com o texto novo em <code>e.target.value</code> (sempre uma string).</li>
<li>O <code>&lt;form onSubmit={...}&gt;</code> trata o Enter e o botão de enviar. Começa sempre com <code>e.preventDefault()</code>, senão a página recarrega.</li>
<li>Para acrescentar à lista, cria-se um array <strong>novo</strong>: <code>setTarefas([...tarefas, nova])</code> (a próxima lição explica porquê).</li>
<li>Depois de acrescentar, limpar o campo é só pôr o estado a <code>""</code>.</li>
</ul>
<p>Para o código caber, esta versão da app só tem o formulário e a lista. Tudo junto, só na lição 10.</p>`,
  analogy: 'Um input controlado é um quadro branco que só mostra o que está escrito no caderno do componente (o estado). Cada tecla é escrita primeiro no caderno, e o quadro copia o caderno.',
  examples: [{
    title: 'Acrescentar uma tarefa',
    code: APP_5,
    prev: APP_3,
    steps: [
      { l: linhaDe(APP_5, 'useState<Tarefa[]>'), rr: ['App', 'ItemTarefa'], n: H`A lista passou a ser estado (para poder crescer). <code>useState&lt;Tarefa[]&gt;</code> diz o tipo do estado.` },
      { l: linhaDe(APP_5, 'useState("")'), n: 'O texto do campo também é estado, começando vazio.' },
      { l: linhaDe(APP_5, '<input id="nova"'), act: ['input', '#nova', 'Comprar pão'], rr: ['App', 'ItemTarefa'], chk: [['#nova', 'value', 'Comprar pão']], n: H`Escreveste "Comprar pão": o <code>onChange</code> chamou <code>setTexto</code>, e a App renderizou com o texto novo (vê o estado no painel). Os ItemTarefa renderizaram também, porque o pai renderizou.` },
      { l: linhaDe(APP_5, 'e.preventDefault()'), act: ['click', 'button[type="submit"]'], rr: ['App', 'ItemTarefa'], chk: [['li', 'count', 4], ['li:last-child', 'text', 'Comprar pão'], ['#nova', 'value', '']], n: H`Carregaste em Adicionar: o <code>onSubmit</code> corre o <code>adicionar</code>. O <code>preventDefault</code> impede a página de recarregar; o setTarefas recebe um array novo com a tarefa a mais, e o campo é limpo.` },
      { l: linhaDe(APP_5, 'texto.trim() === ""'), act: ['click', 'button[type="submit"]'], rr: [], chk: [['li', 'count', 4]], n: H`Com o campo vazio, o <code>adicionar</code> sai logo no <code>return</code>: nenhum setter é chamado, por isso nada renderiza (o painel não tem nada a amarelo).` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>e.preventDefault()</code> no onSubmit: a página recarrega e perde-se tudo.`,
    H`Pôr <code>value={texto}</code> sem <code>onChange</code>: o campo fica bloqueado (o React mantém-no igual ao estado).`,
    H`Esquecer que <code>e.target.value</code> é sempre texto: para números, <code>Number(e.target.value)</code>.`,
    H`Acrescentar com <code>tarefas.push(nova)</code>: muda o array antigo e o React não repara (lição 6).`,
  ],
  quiz: [
    { q: 'Depois de escrever "Rita" no campo, que texto tem o parágrafo?', code: J`
import { useState } from "react";

export default function App() {
  const [nome, setNome] = useState("");
  return (
    <div>
      <input value={nome} onChange={(e) => setNome(e.target.value)} aria-label="Nome" />
      <p>Olá, {nome || "desconhecido"}</p>
    </div>
  );
}`, acts: [['input', 'input', 'Rita']], ask: ['p', 'text'], opts: ['Olá, Rita', 'Olá, desconhecido', 'Olá, ', 'Rita'], ok: 0, check: true,
      exp: 'Cada mudança no campo atualiza o estado, e o parágrafo, que usa o mesmo estado, é desenhado com o nome novo.' },
    { q: 'Depois de escrever "A" e carregar no botão, e depois escrever "B" e carregar outra vez, quantos itens há?', code: J`
import { useState } from "react";
import type { FormEvent } from "react";

export default function App() {
  const [itens, setItens] = useState<string[]>([]);
  const [texto, setTexto] = useState("");
  function enviar(e: FormEvent) {
    e.preventDefault();
    setItens([...itens, texto]);
    setTexto("");
  }
  return (
    <form onSubmit={enviar}>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Item" />
      <button type="submit">+</button>
      <ul>{itens.map((i) => <li key={i}>{i}</li>)}</ul>
    </form>
  );
}`, acts: [['input', 'input', 'A'], ['click', 'button'], ['input', 'input', 'B'], ['click', 'button']], ask: ['li', 'count'], opts: ['0', '1', '2', '4'], ok: 2, check: true,
      exp: 'Cada envio cria um array novo com o item a mais: primeiro ["A"], depois ["A", "B"].' },
    { q: 'O que acontece com este código?', code: J`
import { useState } from "react";

export default function App() {
  const [idade, setIdade] = useState(0);
  return <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} aria-label="Idade" />;
}`, ask: ['input', 'value'], opts: ['Funciona: o campo mostra a idade', "error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'.", 'O campo fica com NaN', "error TS2322: Type 'number' is not assignable to type 'string'."], ok: 1, check: true,
      exp: H`<code>e.target.value</code> é sempre uma string, mesmo num campo numérico, e o estado é um number. O TypeScript apanha a mistura; a correção é <code>setIdade(Number(e.target.value))</code>.` },
    { q: 'Para que serve o e.preventDefault() no onSubmit?', opts: ['Para validar os campos', 'Para o browser não enviar o formulário à moda antiga (recarregando a página); o React trata dos dados', 'Para limpar os campos', 'Para impedir o utilizador de escrever'], ok: 1,
      exp: 'Sem ele, o browser faz o que os formulários sempre fizeram: envia e recarrega a página, e o estado da app perde-se.' },
  ],
  exercises: [{
    title: 'Saudação ao enviar',
    text: 'Faz um formulário com um campo de nome e um botão "Entrar". Só quando se envia, aparece um h2 "Bem-vindo, " seguido do nome. O teste escreve "Ana" e carrega no botão.',
    hint: H`Dois estados: o texto do campo e o nome "confirmado" (que só muda no onSubmit). Mostra o h2 só se o nome confirmado não estiver vazio.`,
    acts: [['input', 'input', 'Ana'], ['click', 'button']],
    tests: [['h2', 'text', 'Bem-vindo, Ana']],
    solution: J`
import { useState } from "react";
import type { FormEvent } from "react";

export default function App() {
  const [texto, setTexto] = useState("");
  const [nome, setNome] = useState("");

  function entrar(e: FormEvent) {
    e.preventDefault();
    setNome(texto.trim());
  }

  return (
    <main>
      <form onSubmit={entrar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Nome" />
        <button type="submit">Entrar</button>
      </form>
      {nome !== "" && <h2>Bem-vindo, {nome}</h2>}
    </main>
  );
}`,
  }, {
    title: 'Lista de compras',
    text: 'Faz uma lista de compras: um campo, um botão "Adicionar" e uma lista. Itens vazios não entram. O teste acrescenta "pão", tenta acrescentar um item vazio e acrescenta "leite".',
    hint: H`Como no exemplo: no onSubmit, se <code>texto.trim() === ""</code> faz return; senão <code>setItens([...itens, texto.trim()])</code> e limpa o campo.`,
    acts: [['input', 'input', 'pão'], ['click', 'button'], ['click', 'button'], ['input', 'input', 'leite'], ['click', 'button']],
    tests: [['li', 'count', 2], ['li:last-child', 'text', 'leite']],
    solution: J`
import { useState } from "react";
import type { FormEvent } from "react";

export default function App() {
  const [itens, setItens] = useState<string[]>([]);
  const [texto, setTexto] = useState("");

  function adicionar(e: FormEvent) {
    e.preventDefault();
    if (texto.trim() === "") {
      return;
    }
    setItens([...itens, texto.trim()]);
    setTexto("");
  }

  return (
    <main>
      <h1>Compras</h1>
      <form onSubmit={adicionar}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Item" />
        <button type="submit">Adicionar</button>
      </form>
      <ul>
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Mudar arrays no estado sem os estragar',
  short: 'map e filter para criar arrays novos, e porque é que o push não funciona',
  body: H`
<p>Lembras-te das referências do curso de JavaScript? É aqui que fazem toda a diferença. Quando chamas o setter, o React compara o valor novo com o antigo com <code>Object.is</code> (como um <code>===</code>). Se for <strong>o mesmo objeto</strong>, conclui que nada mudou e não desenha nada.</p>
<ul>
<li>Por isso nunca se muda o estado por dentro (<code>push</code>, <code>splice</code>, <code>tarefa.feita = true</code>). Cria-se sempre um array (ou objeto) <strong>novo</strong>.</li>
<li>Acrescentar: <code>[...tarefas, nova]</code>. Apagar: <code>tarefas.filter(t =&gt; t.id !== id)</code>.</li>
<li>Mudar um item: <code>tarefas.map(t =&gt; t.id === id ? { ...t, feita: !t.feita } : t)</code>: um array novo onde o item mudado é um objeto novo, e os outros ficam iguais.</li>
<li>Estes são os métodos da lição 5 do curso de JavaScript: agora sabes para que servem.</li>
</ul>`,
  analogy: 'O React é um revisor preguiçoso: só relê o documento se lhe deres uma folha nova. Se rabiscares a folha que ele já tem e lha devolveres, ele vê que é a mesma folha e nem olha.',
  examples: [{
    title: 'Concluir e apagar tarefas',
    code: APP_6,
    prev: APP_3,
    steps: [
      { l: linhaDe(APP_6, 'useState<Tarefa[]>'), rr: ['App'], chk: [['li.feita', 'count', 1]], n: H`A lista é estado. Desta vez cada item é um <code>&lt;li&gt;</code> desenhado diretamente na App, com dois botões.` },
      { l: linhaDe(APP_6, 'tarefas.map((t) => (t.id === id'), act: ['click', 'li:first-child .alternar'], rr: ['App'], chk: [['li.feita', 'count', 2], ['li:first-child', 'color', 'cinzento']], n: H`Carregaste no ✓ da primeira: o <code>map</code> cria um array novo, onde essa tarefa é um objeto novo (<code>{ ...t, feita: !t.feita }</code>) e as outras são as mesmas. Como o array é novo, o React renderiza.` },
      { l: linhaDe(APP_6, 'tarefas.filter'), act: ['click', 'li:nth-child(2) .remover'], rr: ['App'], chk: [['li', 'count', 2]], n: H`Carregaste no ✕ da segunda: o <code>filter</code> cria um array novo sem ela.` },
      { l: linhaDe(APP_6, 'tarefas.filter'), act: ['click', 'li:first-child .remover'], rr: ['App'], chk: [['li', 'count', 1], ['li span', 'text', 'Ler a cábula']], n: 'Mais uma. O array original nunca foi mudado: cada passo criou um novo.' },
    ],
  }, {
    title: 'O push que não faz nada',
    code: J`
import { useState } from "react";

export default function App() {
  const [itens, setItens] = useState<string[]>(["A", "B"]);

  function errado() {
    itens.push("X");
    setItens(itens);
  }

  function certo() {
    setItens([...itens, "Y"]);
  }

  return (
    <div>
      <button id="errado" onClick={errado}>push</button>
      <button id="certo" onClick={certo}>cópia</button>
      <p>{itens.join(", ")}</p>
    </div>
  );
}`,
    steps: [
      { l: 4, rr: ['App'], chk: [['p', 'text', 'A, B']], n: 'Um array no estado.' },
      { l: 8, act: ['click', '#errado'], rr: [], chk: [['p', 'text', 'A, B']], n: H`O <code>push</code> mete o X no array <strong>antigo</strong>, e o setter recebe esse mesmo array. O React compara: é o mesmo objeto, logo "nada mudou". Nenhum componente renderizou e o ecrã continua com A, B, apesar de o array já ter o X.` },
      { l: 12, act: ['click', '#certo'], rr: ['App'], chk: [['p', 'text', 'A, B, X, Y']], n: H`Agora um array novo, com o Y a mais: o React renderiza. E aparece também o X, que estava escondido no array desde o push. Bugs destes são dos mais difíceis de encontrar.` },
    ],
  }],
  mistakes: [
    H`Usar <code>push</code>, <code>pop</code>, <code>splice</code> ou <code>sort</code> no estado: mudam o array antigo. Usa <code>[...]</code>, <code>filter</code>, <code>map</code>, ou faz primeiro uma cópia.`,
    H`Mudar um objeto do estado por dentro (<code>tarefa.feita = true</code>) e depois chamar o setter com o mesmo array.`,
    H`Esquecer o <code>...t</code> ao mudar um item: <code>{ feita: true }</code> perde o texto e o id.`,
    H`Usar o índice do array como id: depois de apagar um item, os índices mudam.`,
  ],
  quiz: [
    { q: 'Depois de carregar uma vez no botão, quantos itens aparecem?', code: J`
import { useState } from "react";

export default function App() {
  const [v, setV] = useState<number[]>([1, 2]);
  function mais() {
    v.push(3);
    setV(v);
  }
  return (
    <div>
      <button onClick={mais}>+</button>
      <ul>{v.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}`, acts: [['click', 'button']], ask: ['li', 'count'], opts: ['2', '3', '1', '0'], ok: 0, check: true,
      exp: H`O push mudou o array antigo e o setter recebeu o mesmo array: o React não renderiza, e o ecrã continua com 2. A versão certa é <code>setV([...v, 3])</code>.` },
    { q: 'Depois de carregar uma vez no botão, quantos itens aparecem?', code: J`
import { useState } from "react";

export default function App() {
  const [v, setV] = useState<number[]>([5, 12, 8, 15]);
  return (
    <div>
      <button onClick={() => setV(v.filter((x) => x >= 10))}>Só positivas</button>
      <ul>{v.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}`, acts: [['click', 'button']], ask: ['li', 'count'], opts: ['4', '2', '0', '1'], ok: 1, check: true,
      exp: H`O <code>filter</code> cria um array novo só com 12 e 15, e o setter recebe-o: o React renderiza com 2 itens.` },
    { q: 'Depois de carregar no botão do Rui, quantos itens têm a classe feita?', code: J`
import { useState } from "react";

interface T {
  id: number;
  nome: string;
  feita: boolean;
}

export default function App() {
  const [l, setL] = useState<T[]>([
    { id: 1, nome: "Ana", feita: true },
    { id: 2, nome: "Rui", feita: false },
  ]);
  function alternar(id: number) {
    setL(l.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }
  return (
    <ul>
      {l.map((t) => (
        <li key={t.id} className={t.feita ? "feita" : ""}>
          <button id={"b" + t.id} onClick={() => alternar(t.id)}>{t.nome}</button>
        </li>
      ))}
    </ul>
  );
}`, acts: [['click', '#b2']], ask: ['li.feita', 'count'], opts: ['0', '1', '2', '3'], ok: 2, check: true,
      exp: 'O map cria um array novo em que o Rui é um objeto novo com feita a true; a Ana fica como estava (já feita). Ficam as duas feitas.' },
    { q: 'Porque é que não se deve fazer tarefas.push(nova) e depois setTarefas(tarefas)?', opts: ['Porque o push é lento', 'Porque o setter recebe o mesmo array: o React compara com Object.is, conclui que nada mudou e não desenha', 'Porque o TypeScript não deixa', 'Porque apaga a lista'], ok: 1,
      exp: 'O React decide se tem de desenhar outra vez comparando referências. Um array mudado por dentro continua a ser o mesmo array.' },
  ],
  exercises: [{
    title: 'Limpar as feitas',
    text: 'Com a lista [Estudar (por fazer), Exercício (feita), Cábula (feita)], faz um botão "Limpar feitas" que apaga as tarefas feitas. O teste carrega no botão.',
    hint: H`<code>setTarefas(tarefas.filter((t) =&gt; !t.feita))</code>`,
    acts: [['click', 'button']],
    tests: [['li', 'count', 1], ['li', 'text', 'Estudar']],
    solution: J`
import { useState } from "react";

interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 1, texto: "Estudar", feita: false },
    { id: 2, texto: "Exercício", feita: true },
    { id: 3, texto: "Cábula", feita: true },
  ]);

  return (
    <main>
      <button onClick={() => setTarefas(tarefas.filter((t) => !t.feita))}>Limpar feitas</button>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>{t.texto}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }, {
    title: 'Marcar todas',
    text: 'Com três tarefas por fazer, faz um botão "Marcar todas" que as põe todas feitas. O teste carrega no botão.',
    hint: H`<code>setTarefas(tarefas.map((t) =&gt; ({ ...t, feita: true })))</code>. Os parênteses à volta do objeto são para a seta devolver o objeto.`,
    acts: [['click', 'button']],
    tests: [['li.feita', 'count', 3]],
    solution: J`
import { useState } from "react";

interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 1, texto: "A", feita: false },
    { id: 2, texto: "B", feita: false },
    { id: 3, texto: "C", feita: false },
  ]);

  return (
    <main>
      <button onClick={() => setTarefas(tarefas.map((t) => ({ ...t, feita: true })))}>Marcar todas</button>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>{t.texto}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Levantar o estado',
  short: 'o estado vive no pai, os filhos recebem dados e funções por props',
  body: H`
<p>Quando dois componentes precisam dos mesmos dados (a lista de itens e o resumo "1 de 3 feitas"), o estado sobe para o <strong>pai comum</strong>. A isto chama-se <strong>levantar o estado</strong> (lifting state up).</p>
<ul>
<li>O pai guarda o estado e passa os dados aos filhos por props.</li>
<li>Um filho não pode mudar o estado do pai diretamente. Em vez disso, o pai passa-lhe uma <strong>função</strong> por props (o costume é chamar-lhe <code>onAlgumaCoisa</code>), e o filho chama-a quando acontece algo.</li>
<li>Em TypeScript, o tipo da prop diz a forma da função: <code>onAlternar: (id: number) =&gt; void</code>.</li>
<li>Os dados descem (props) e os eventos sobem (funções). É sempre neste sentido, e por isso uma app React é fácil de seguir.</li>
</ul>`,
  analogy: 'O pai é a secretaria da escola, que guarda a pauta (o estado). As turmas (os filhos) recebem cópias da pauta para mostrar, e quando querem mudar uma nota não a rabiscam: enviam um pedido à secretaria (a função), que muda a pauta e manda cópias novas a todos.',
  examples: [{
    title: 'Itens e resumo partilham o estado',
    code: APP_7,
    prev: APP_6,
    steps: [
      { l: linhaDe(APP_7, 'onAlternar: (id: number) => void'), n: H`A prop <code>onAlternar</code> é uma função que recebe um id. O ItemTarefa não sabe o que ela faz: só a chama.` },
      { l: linhaDe(APP_7, 'function Resumo'), n: H`O Resumo recebe a lista e conta as feitas. Não tem estado próprio.` },
      { l: linhaDe(APP_7, 'useState<Tarefa[]>'), rr: ['App', 'ItemTarefa', 'Resumo'], chk: [['.resumo', 'text', '1 de 3 feitas']], n: H`O estado vive na App, o pai dos dois. Na árvore, vê que a App passa <code>tarefas</code> ao Resumo e <code>onAlternar=ƒ</code> (uma função) a cada item.` },
      { l: linhaDe(APP_7, 'onClick={() => onAlternar(tarefa.id)}'), act: ['click', 'li:first-child button'], rr: ['App', 'ItemTarefa', 'Resumo'], chk: [['.resumo', 'text', '2 de 3 feitas'], ['li.feita', 'count', 2]], n: H`Carregaste no ✓ da primeira: o ItemTarefa chama <code>onAlternar(1)</code>, que é o <code>alternar</code> da App. O estado da App muda, a App renderiza, e os filhos renderizam com os dados novos: o resumo atualizou-se sozinho.` },
      { l: linhaDe(APP_7, 'onClick={() => onAlternar(tarefa.id)}'), act: ['click', 'li:nth-child(2) button'], rr: ['App', 'ItemTarefa', 'Resumo'], chk: [['.resumo', 'text', '1 de 3 feitas']], n: 'A segunda estava feita e deixa de estar. Os dados descem, os eventos sobem.' },
    ],
  }],
  mistakes: [
    H`Guardar o mesmo dado em dois componentes (um estado no item e outro no resumo): ficam dessincronizados. Um só estado, no pai.`,
    H`Escrever <code>onAlternar={alternar(t.id)}</code>: chama a função logo ao desenhar. É <code>onAlternar={alternar}</code> (ou uma seta).`,
    H`Esquecer de passar a função ao filho: <em>error TS2741: Property 'onAlternar' is missing...</em>`,
    H`Pôr todo o estado no componente de topo "por via das dúvidas": põe-no no pai comum mais próximo de quem o usa.`,
  ],
  quiz: [
    { q: 'Depois de carregar uma vez no botão do filho, que texto tem o parágrafo do pai?', code: J`
import { useState } from "react";

function Botao({ onCarregar }: { onCarregar: () => void }) {
  return <button onClick={onCarregar}>Mais</button>;
}

export default function App() {
  const [n, setN] = useState(10);
  return (
    <div>
      <p>Total: {n}</p>
      <Botao onCarregar={() => setN(n + 5)} />
    </div>
  );
}`, acts: [['click', 'button']], ask: ['p', 'text'], opts: ['Total: 10', 'Total: 15', 'Total: 5', 'Total: 105'], ok: 1, check: true,
      exp: 'O filho chama a função que recebeu por props; essa função muda o estado do pai, que renderiza com 15.' },
    { q: 'O que acontece com este código?', code: J`
function Item({ texto, onApagar }: { texto: string; onApagar: () => void }) {
  return <li>{texto} <button onClick={onApagar}>✕</button></li>;
}

export default function App() {
  return <ul><Item texto="A" /></ul>;
}`, ask: ['li', 'count'], opts: ['Mostra o item A', "error TS2741: Property 'onApagar' is missing in type '{ texto: string; }' but required in type '{ texto: string; onApagar: () => void; }'.", 'Mostra o item, mas o botão dá erro ao carregar', '0'], ok: 1, check: true,
      exp: 'O Item diz que precisa de uma função onApagar, e a App não a passou. Em JavaScript só darias por isso ao carregar no botão.' },
    { q: 'Dois componentes irmãos precisam do mesmo estado. Onde fica?', opts: ['Duplicado nos dois', 'No pai comum, que o passa aos dois por props', 'Numa variável global', 'No primeiro irmão, que o empresta ao segundo'], ok: 1,
      exp: 'O estado sobe para o pai comum mais próximo. Assim há uma só fonte de verdade e os dois mostram sempre o mesmo.' },
    { q: 'Depois de carregar no botão "Rosa", que texto tem a amostra?', code: J`
import { useState } from "react";

function Escolha({ cor, onEscolher }: { cor: string; onEscolher: (c: string) => void }) {
  return <button onClick={() => onEscolher(cor)}>{cor}</button>;
}

export default function App() {
  const [cor, setCor] = useState("Azul");
  return (
    <div>
      <Escolha cor="Verde" onEscolher={setCor} />
      <Escolha cor="Rosa" onEscolher={setCor} />
      <p id="amostra">Cor: {cor}</p>
    </div>
  );
}`, acts: [['click', 'button:nth-of-type(2)']], ask: ['#amostra', 'text'], opts: ['Cor: Azul', 'Cor: Verde', 'Cor: Rosa', 'Cor: '], ok: 2, check: true,
      exp: H`O próprio setter pode ser passado como função: <code>onEscolher={setCor}</code>. O segundo botão chama-o com "Rosa".` },
  ],
  exercises: [{
    title: 'Contador com botão filho',
    text: 'Faz um componente BotaoMais com uma prop onMais. A App guarda um número (começa em 0) e mostra-o num parágrafo com id total; o BotaoMais soma 1. O teste carrega duas vezes.',
    hint: H`<code>function BotaoMais({ onMais }: { onMais: () =&gt; void })</code> e, na App, <code>&lt;BotaoMais onMais={() =&gt; setN(n + 1)} /&gt;</code>.`,
    acts: [['click', 'button'], ['click', 'button']],
    tests: [['#total', 'text', '2']],
    solution: J`
import { useState } from "react";

function BotaoMais({ onMais }: { onMais: () => void }) {
  return <button onClick={onMais}>+1</button>;
}

export default function App() {
  const [n, setN] = useState(0);
  return (
    <main>
      <p id="total">{n}</p>
      <BotaoMais onMais={() => setN(n + 1)} />
    </main>
  );
}`,
  }, {
    title: 'Apagar a partir do item',
    text: 'Com a lista ["BD", "SO", "RC"] no estado da App, faz um componente ItemUC com as props nome e onApagar, que mostra o nome e um botão ✕. O teste apaga o "SO".',
    hint: H`Na App: <code>onApagar={() =&gt; setUcs(ucs.filter((u) =&gt; u !== nome))}</code>. Dá ao botão um id ou uma classe para o teste o encontrar.`,
    acts: [['click', 'li:nth-child(2) button']],
    tests: [['li', 'count', 2], ['li:last-child span', 'text', 'RC']],
    solution: J`
import { useState } from "react";

interface ItemProps {
  nome: string;
  onApagar: () => void;
}

function ItemUC({ nome, onApagar }: ItemProps) {
  return (
    <li>
      <span>{nome}</span>
      <button onClick={onApagar}>✕</button>
    </li>
  );
}

export default function App() {
  const [ucs, setUcs] = useState<string[]>(["BD", "SO", "RC"]);
  return (
    <ul>
      {ucs.map((nome) => (
        <ItemUC key={nome} nome={nome} onApagar={() => setUcs(ucs.filter((u) => u !== nome))} />
      ))}
    </ul>
  );
}`,
  }],
});
