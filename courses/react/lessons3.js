// ===== React do Zero — conteúdo das lições (parte 3) =====

const APP_8 = J`
import { useState } from "react";

type Filtro = "todas" | "por fazer" | "feitas";

${TIPOS_E_DADOS}

const FILTROS: Filtro[] = ["todas", "por fazer", "feitas"];

function passaFiltro(tarefa: Tarefa, filtro: Filtro): boolean {
  if (filtro === "feitas") {
    return tarefa.feita;
  }
  if (filtro === "por fazer") {
    return !tarefa.feita;
  }
  return true;
}

export default function App() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const visiveis = TAREFAS.filter((t) => passaFiltro(t, filtro));
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <div>
        {FILTROS.map((f) => (
          <button key={f} aria-pressed={f === filtro} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </div>
      <p className="resumo">A mostrar {visiveis.length} de {TAREFAS.length}</p>
      <ul>
        {visiveis.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>{t.texto}</li>
        ))}
      </ul>
    </main>
  );
}`;

const APP_9 = J`
import { useEffect, useState } from "react";

interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

function carregarTarefas(): Promise<Tarefa[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, texto: "Estudar React", feita: false },
        { id: 2, texto: "Fazer o exercício", feita: true },
      ]);
    }, 500);
  });
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarTarefas()
      .then((lista) => setTarefas(lista))
      .catch(() => setErro("Não foi possível carregar as tarefas."))
      .finally(() => setACarregar(false));
  }, []);

  if (aCarregar) {
    return <p className="a-carregar">A carregar...</p>;
  }
  if (erro !== "") {
    return <p className="erro">{erro}</p>;
  }
  if (tarefas.length === 0) {
    return <p>Ainda não há tarefas.</p>;
  }
  return (
    <ul>
      {tarefas.map((t) => (
        <li key={t.id} className={t.feita ? "feita" : ""}>{t.texto}</li>
      ))}
    </ul>
  );
}`;

const APP_10 = J`
import { useState } from "react";
import type { FormEvent } from "react";

${TIPOS_E_DADOS}

function useTarefas(iniciais: Tarefa[]) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(iniciais);

  function adicionar(texto: string) {
    const id = Math.max(0, ...tarefas.map((t) => t.id)) + 1;
    setTarefas([...tarefas, { id, texto, feita: false }]);
  }
  function alternar(id: number) {
    setTarefas(tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }
  function remover(id: number) {
    setTarefas(tarefas.filter((t) => t.id !== id));
  }

  return { tarefas, adicionar, alternar, remover };
}

function FormNova({ onAdicionar }: { onAdicionar: (texto: string) => void }) {
  const [texto, setTexto] = useState("");

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (texto.trim() === "") {
      return;
    }
    onAdicionar(texto.trim());
    setTexto("");
  }

  return (
    <form onSubmit={enviar}>
      <input id="nova" value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Nova tarefa" />
      <button type="submit">Adicionar</button>
    </form>
  );
}

interface ItemProps {
  tarefa: Tarefa;
  onAlternar: (id: number) => void;
  onRemover: (id: number) => void;
}

function ItemTarefa({ tarefa, onAlternar, onRemover }: ItemProps) {
  return (
    <li className={tarefa.feita ? "feita" : ""}>
      <span>{tarefa.texto}</span>
      <button className="alternar" onClick={() => onAlternar(tarefa.id)}>✓</button>
      <button className="remover" onClick={() => onRemover(tarefa.id)}>✕</button>
    </li>
  );
}

export default function App() {
  const { tarefas, adicionar, alternar, remover } = useTarefas(TAREFAS);
  const feitas = tarefas.filter((t) => t.feita).length;
  return (
    <main>
      <h1>As minhas tarefas</h1>
      <FormNova onAdicionar={adicionar} />
      <p className="resumo">{feitas} de {tarefas.length} feitas</p>
      <ul>
        {tarefas.map((t) => (
          <ItemTarefa key={t.id} tarefa={t} onAlternar={alternar} onRemover={remover} />
        ))}
      </ul>
    </main>
  );
}`;

// A mesma app da lição 9, mas o "servidor" falha: para ver o estado de erro a acontecer.
const APP_9_ERRO = APP_9.replace(/function carregarTarefas[\s\S]*?\n}\n/, J`
function carregarTarefas(): Promise<Tarefa[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("sem rede")), 500);
  });
}` + '\n');

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Filtros e dados calculados',
  short: 'um tipo união para o filtro, e o que não precisa de ser estado',
  body: H`
<p>A app vai ter botões para escolher que tarefas ver: todas, por fazer ou feitas. Duas ideias novas:</p>
<ul>
<li>Um <strong>tipo união</strong> do TypeScript (curso de TypeScript, lição 3) diz os valores possíveis do filtro: <code>type Filtro = "todas" | "por fazer" | "feitas"</code>. Escrever <code>setFiltro("feita")</code> é logo um erro.</li>
<li>A lista visível <strong>não é estado</strong>: calcula-se em cada render a partir do estado (o filtro) e dos dados. Guardar só o mínimo em estado; tudo o que se pode calcular, calcula-se.</li>
<li>Se guardasses <code>visiveis</code> num estado à parte, terias de o atualizar sempre que o filtro ou as tarefas mudassem, e mais cedo ou mais tarde ficava desatualizado.</li>
<li>O atributo <code>aria-pressed</code> diz aos leitores de ecrã qual botão está escolhido (e o CSS da app põe-no a negrito).</li>
</ul>`,
  analogy: 'O estado é a matéria-prima; os dados calculados são o prato. Guardas na despensa a farinha e os ovos, não o bolo já feito: se a receita mudar, fazes outro bolo na hora.',
  examples: [{
    title: 'Botões de filtro',
    code: APP_8,
    prev: APP_3,
    steps: [
      { l: linhaDe(APP_8, 'type Filtro'), n: H`Os três valores possíveis do filtro, como um tipo. Também serve de documentação: quem lê sabe logo as opções.` },
      { l: linhaDe(APP_8, 'function passaFiltro'), n: H`Uma função normal (nome em minúscula: não é um componente) que diz se uma tarefa passa no filtro.` },
      { l: linhaDe(APP_8, 'useState<Filtro>'), rr: ['App'], chk: [['li', 'count', 3], ['button[aria-pressed="true"]', 'text', 'todas']], n: H`O único estado é o filtro, que começa em "todas". Vê no painel: <code>filtro: "todas"</code>.` },
      { l: linhaDe(APP_8, 'const visiveis'), sel: '.resumo', chk: [['.resumo', 'text', 'A mostrar 3 de 3']], n: H`<code>visiveis</code> é calculada em cada render. Não aparece no painel como estado, porque não é.` },
      { l: linhaDe(APP_8, 'onClick={() => setFiltro(f)}'), act: ['click', 'main > div button:nth-child(3)'], rr: ['App'], chk: [['li', 'count', 1], ['.resumo', 'text', 'A mostrar 1 de 3'], ['button[aria-pressed="true"]', 'text', 'feitas']], n: H`Carregaste em "feitas": o filtro muda, a App renderiza, e <code>visiveis</code> é calculada outra vez, agora só com a tarefa feita.` },
      { l: linhaDe(APP_8, 'onClick={() => setFiltro(f)}'), act: ['click', 'main > div button:nth-child(2)'], rr: ['App'], chk: [['li', 'count', 2], ['li.feita', 'count', 0]], n: H`Agora "por fazer": as duas que faltam.` },
    ],
  }],
  mistakes: [
    H`Guardar em estado o que se pode calcular (a lista filtrada, um total, o número de feitas): fica desatualizado.`,
    H`Usar <code>string</code> para um valor que só tem algumas opções: com um tipo união o TypeScript apanha os erros de escrita.`,
    H`Escrever o filtro duas vezes de maneiras diferentes ("feitas" num sítio, "feita" noutro): com o tipo união, não compila.`,
    H`Apagar as tarefas que não passam no filtro (<code>setTarefas(tarefas.filter(...))</code>): perde-las de vez. O filtro só escolhe o que se mostra.`,
  ],
  quiz: [
    { q: 'Depois de carregar no botão, quantos itens aparecem?', code: J`
import { useState } from "react";

const NOTAS = [12, 7, 15, 9, 18];

export default function App() {
  const [soPositivas, setSoPositivas] = useState(false);
  const visiveis = soPositivas ? NOTAS.filter((n) => n >= 10) : NOTAS;
  return (
    <div>
      <button onClick={() => setSoPositivas(true)}>Positivas</button>
      <ul>{visiveis.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}`, acts: [['click', 'button']], ask: ['li', 'count'], opts: ['5', '3', '2', '0'], ok: 1, check: true,
      exp: H`O estado é só o booleano; a lista visível é calculada a partir dele em cada render: 12, 15 e 18.` },
    { q: 'O que acontece com este código?', code: J`
import { useState } from "react";

type Tamanho = "P" | "M" | "G";

export default function App() {
  const [tamanho, setTamanho] = useState<Tamanho>("M");
  return <button onClick={() => setTamanho("XL")}>{tamanho}</button>;
}`, ask: ['button', 'text'], opts: ['Mostra M e, ao carregar, XL', "error TS2345: Argument of type '\"XL\"' is not assignable to parameter of type 'SetStateAction<Tamanho>'.", 'Mostra M e o botão não faz nada', "error TS2322: Type 'string' is not assignable to type 'Tamanho'."], ok: 1, check: true,
      exp: H`"XL" não é um dos valores do tipo <code>Tamanho</code>. O TypeScript apanha o erro antes de a app correr.` },
    { q: 'Depois de escrever "ri" no campo, quantos itens aparecem?', code: J`
import { useState } from "react";

const NOMES = ["Ana", "Rui", "Rita", "Maria"];

export default function App() {
  const [procura, setProcura] = useState("");
  const encontrados = NOMES.filter((n) => n.toLowerCase().includes(procura));
  return (
    <div>
      <input value={procura} onChange={(e) => setProcura(e.target.value)} aria-label="Procurar" />
      <ul>{encontrados.map((n) => <li key={n}>{n}</li>)}</ul>
    </div>
  );
}`, acts: [['input', 'input', 'ri']], ask: ['li', 'count'], opts: ['1', '2', '3', '4'], ok: 1, check: true,
      exp: H`"rita" e "maria" têm "ri"; "ana" e "rui" não. A lista encontrada é calculada a cada tecla, não é estado.` },
    { q: 'Numa app com um estado tarefas, qual destas coisas também devia ser estado?', opts: ['O número de tarefas feitas', 'A lista de tarefas filtrada', 'O texto que o utilizador está a escrever no campo', 'O total de tarefas'], ok: 2,
      exp: 'O texto do campo muda por si e não se calcula de mais nada: é estado. O resto calcula-se a partir das tarefas (e do filtro) em cada render.' },
  ],
  exercises: [{
    title: 'Filtro de notas',
    text: 'Com as notas [12, 7, 15, 9, 18], faz dois botões, "todas" e "positivas", e uma lista. Usa um tipo união para o filtro. O teste carrega em "positivas".',
    hint: H`<code>type Filtro = "todas" | "positivas"</code>, um <code>useState&lt;Filtro&gt;("todas")</code> e <code>const visiveis = filtro === "positivas" ? NOTAS.filter(...) : NOTAS</code>.`,
    acts: [['click', '#positivas']],
    tests: [['li', 'count', 3], ['li:first-child', 'text', '12']],
    solution: J`
import { useState } from "react";

type Filtro = "todas" | "positivas";

const NOTAS = [12, 7, 15, 9, 18];

export default function App() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const visiveis = filtro === "positivas" ? NOTAS.filter((n) => n >= 10) : NOTAS;
  return (
    <main>
      <button id="todas" onClick={() => setFiltro("todas")}>todas</button>
      <button id="positivas" onClick={() => setFiltro("positivas")}>positivas</button>
      <ul>
        {visiveis.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }, {
    title: 'Procurar contactos',
    text: 'Com os nomes ["Ana", "Rui", "Sara", "Rita"], faz um campo de procura e mostra só os nomes que contêm o texto (sem ligar a maiúsculas). Mostra também um parágrafo "3 encontrados". O teste escreve "r".',
    hint: H`Estado só para o texto; <code>NOMES.filter((n) =&gt; n.toLowerCase().includes(procura.toLowerCase()))</code>, e <code>{encontrados.length} encontrados</code>.`,
    acts: [['input', 'input', 'r']],
    tests: [['li', 'count', 3], ['p', 'text', '3 encontrados']],
    solution: J`
import { useState } from "react";

const NOMES = ["Ana", "Rui", "Sara", "Rita"];

export default function App() {
  const [procura, setProcura] = useState("");
  const encontrados = NOMES.filter((n) => n.toLowerCase().includes(procura.toLowerCase()));
  return (
    <main>
      <input value={procura} onChange={(e) => setProcura(e.target.value)} aria-label="Procurar" />
      <p>{encontrados.length} encontrados</p>
      <ul>
        {encontrados.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Efeitos: carregar dados',
  short: 'useEffect, as dependências e os estados a carregar, erro e vazio',
  body: H`
<p>Um componente só deve calcular o que mostra. Coisas "de fora" (pedir dados a um servidor, ligar um temporizador, mudar o título da janela) chamam-se <strong>efeitos</strong> e vão dentro de <code>useEffect</code>:</p>
<pre class="snip"><code>useEffect(() =&gt; {
  // corre DEPOIS de o componente aparecer no ecrã
}, [dependencias]);</code></pre>
<ul>
<li>A lista no fim são as <strong>dependências</strong>: o efeito corre depois do primeiro render e outra vez sempre que uma delas mudar. Com <code>[]</code>, corre uma só vez, quando o componente aparece.</li>
<li>Pedir dados demora (uma Promise, curso de JavaScript, lição 8). Enquanto se espera, a app tem de mostrar alguma coisa. Há sempre três casos além do normal: <strong>a carregar</strong>, <strong>erro</strong> e <strong>vazio</strong>.</li>
<li>O efeito pode devolver uma função de <strong>limpeza</strong>, que o React corre quando o componente desaparece (por exemplo, <code>return () =&gt; clearInterval(id)</code>).</li>
<li>No <code>npm run dev</code>, o <code>&lt;StrictMode&gt;</code> do <code>main.tsx</code> corre de propósito cada componente e cada efeito duas vezes (o efeito corre, é limpo e volta a correr), para apanhar efeitos sem limpeza. Se um <code>console.log</code> aparece duas vezes, é isso, não é um erro teu. Na versão final (<code>npm run build</code>) corre uma vez só. As apps deste curso correm sem StrictMode.</li>
<li>Numa app a sério usavas <code>fetch("/api/tarefas")</code>; aqui, <code>carregarTarefas</code> faz de conta, com um <code>setTimeout</code> de meio segundo.</li>
</ul>`,
  analogy: 'O render é pôr a mesa; o efeito é o que fazes depois de a mesa estar posta, como telefonar a encomendar a comida. Enquanto a comida não chega, a mesa diz "a carregar"; se a pizzaria estiver fechada, diz porquê.',
  examples: [{
    title: 'Carregar as tarefas',
    code: APP_9,
    prev: APP_3,
    steps: [
      { l: linhaDe(APP_9, 'function carregarTarefas'), n: H`Faz de conta que pede as tarefas a um servidor: devolve uma Promise que só se cumpre passado meio segundo.` },
      { l: linhaDe(APP_9, 'useState(true)'), n: H`Três estados: as tarefas, se ainda está a carregar (começa a true) e a mensagem de erro.` },
      { l: linhaDe(APP_9, 'if (aCarregar)'), rr: ['App'], sel: '.a-carregar', chk: [['.a-carregar', 'text', 'A carregar...'], ['li', 'count', 0]], n: H`Primeiro render: ainda a carregar, por isso a App devolve logo o parágrafo "A carregar...". Um <code>return</code> mais cedo, como num <code>if</code> de C.` },
      { l: linhaDe(APP_9, 'carregarTarefas()'), n: H`Depois de esse primeiro render aparecer no ecrã, o React corre o efeito: o pedido começa. Com <code>[]</code>, isto só acontece uma vez.` },
      { l: linhaDe(APP_9, '.finally('), wait: 600, rr: ['App'], sel: 'li', chk: [['li', 'count', 2], ['.a-carregar', 'count', 0]], n: H`Meio segundo depois, a Promise cumpre-se: <code>setTarefas</code> recebe a lista e o <code>finally</code> põe <code>aCarregar</code> a false. A App renderiza com os dados (vê o estado no painel).` },
      { l: linhaDe(APP_9, 'tarefas.length === 0'), wait: 600, n: H`Se o servidor devolvesse uma lista vazia, aparecia "Ainda não há tarefas." em vez de uma lista sem nada. E se a Promise falhasse? É o exemplo seguinte.` },
    ],
  }, {
    title: 'Quando o servidor falha',
    code: APP_9_ERRO,
    prev: APP_9,
    steps: [
      { l: linhaDe(APP_9_ERRO, 'reject(new Error'), n: H`A mesma app, mas agora o "servidor" falha passado meio segundo, como se não houvesse rede: a Promise é rejeitada com <code>reject</code> em vez de cumprida com <code>resolve</code>.` },
      { l: linhaDe(APP_9_ERRO, 'if (aCarregar)'), rr: ['App'], chk: [['.a-carregar', 'count', 1]], n: 'O começo é igual: primeiro render, a carregar.' },
      { l: linhaDe(APP_9_ERRO, '.catch('), wait: 600, rr: ['App'], sel: '.erro', chk: [['.erro', 'text', 'Não foi possível carregar as tarefas.'], ['.erro', 'color', 'vermelho'], ['li', 'count', 0]], n: H`A Promise falhou: o <code>then</code> é saltado, o <code>catch</code> guarda a mensagem no estado <code>erro</code>, e o <code>finally</code> corre na mesma, pondo <code>aCarregar</code> a false.` },
      { l: linhaDe(APP_9_ERRO, 'if (erro !== "")'), wait: 600, n: H`No render novo, já não está a carregar, mas há erro: a App devolve o parágrafo vermelho. Sem o <code>catch</code>, a app ficava para sempre em "A carregar...", e o utilizador nunca sabia porquê.` },
    ],
  }],
  mistakes: [
    H`Pedir dados diretamente no corpo do componente (fora do useEffect): o pedido repete-se a cada render, e cada resposta provoca outro render.`,
    H`Esquecer a lista de dependências: sem ela, o efeito corre depois de <em>todos</em> os renders.`,
    H`Esquecer uma dependência: o efeito fica com o valor antigo. Põe na lista tudo o que o efeito usa e pode mudar.`,
    H`Esquecer o estado "a carregar" ou o de erro: o utilizador vê uma lista vazia e não sabe se não há tarefas ou se falhou.`,
    H`Esquecer a limpeza de um temporizador (<code>setInterval</code>): continua a correr depois de o componente desaparecer.`,
  ],
  quiz: [
    { q: 'Logo depois de a app aparecer (antes de passar meio segundo), que texto tem o parágrafo?', code: J`
import { useEffect, useState } from "react";

function pedirNome(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve("Ana"), 500));
}

export default function App() {
  const [nome, setNome] = useState("");
  useEffect(() => {
    pedirNome().then((n) => setNome(n));
  }, []);
  return <p>{nome === "" ? "A carregar..." : "Olá, " + nome}</p>;
}`, ask: ['p', 'text'], opts: ['A carregar...', 'Olá, Ana', 'Olá, ', '(nada: a app espera pelos dados)'], ok: 0, check: true,
      exp: 'O primeiro render acontece logo, com o estado inicial. O efeito só pede o nome depois, e a resposta demora meio segundo.' },
    { q: 'E passado um segundo?', code: J`
import { useEffect, useState } from "react";

function pedirNome(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve("Ana"), 500));
}

export default function App() {
  const [nome, setNome] = useState("");
  useEffect(() => {
    pedirNome().then((n) => setNome(n));
  }, []);
  return <p>{nome === "" ? "A carregar..." : "Olá, " + nome}</p>;
}`, wait: 1000, ask: ['p', 'text'], opts: ['A carregar...', 'Olá, Ana', 'Olá, ', 'Olá, undefined'], ok: 1, check: true,
      exp: H`A Promise cumpriu-se, o <code>then</code> chamou o setter, e a App renderizou outra vez com o nome.` },
    { q: 'Depois de carregar 2 vezes no botão, qual é o título da janela (document.title)?', code: J`
import { useEffect, useState } from "react";

export default function App() {
  const [n, setN] = useState(0);
  useEffect(() => {
    document.title = "Contagem: " + n;
  }, []);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`, acts: [['click', 'button'], ['click', 'button']], ask: ['title', 'text'], opts: ['Contagem: 0', 'Contagem: 2', 'Contagem: 1', '(sem título)'], ok: 0, check: true,
      exp: H`Com <code>[]</code>, o efeito só correu depois do primeiro render, com n a 0. O efeito usa <code>n</code>, por isso <code>n</code> devia estar nas dependências: <code>[n]</code>.` },
    { q: 'O que acontece se a Promise falhar?', code: J`
import { useEffect, useState } from "react";

function pedirNotas(): Promise<number[]> {
  return Promise.reject(new Error("sem rede"));
}

export default function App() {
  const [erro, setErro] = useState("");
  useEffect(() => {
    pedirNotas().catch((e: Error) => setErro(e.message));
  }, []);
  if (erro !== "") {
    return <p className="erro">Erro: {erro}</p>;
  }
  return <p>A carregar...</p>;
}`, ask: ['p', 'text'], opts: ['A carregar...', 'Erro: sem rede', 'Erro: ', 'A app rebenta com um erro'], ok: 1, check: true,
      exp: H`O <code>catch</code> apanha a falha e guarda a mensagem no estado; a App renderiza o parágrafo de erro. Sem o catch, o utilizador ficava para sempre a ver "A carregar...".` },
    { q: 'Num projeto Vite, com npm run dev, um console.log("efeito") dentro de useEffect(..., []) aparece quantas vezes na consola do browser?', opts: ['0', '1', '2: o StrictMode corre o efeito, limpa-o e volta a corrê-lo, de propósito', 'Uma vez por cada render, para sempre'], ok: 2,
      exp: H`Em desenvolvimento, o <code>&lt;StrictMode&gt;</code> do <code>main.tsx</code> repete o efeito para mostrar logo os efeitos que se esquecem da limpeza. Na versão final (<code>npm run build</code>) aparece uma vez só.` },
  ],
  exercises: [{
    title: 'Mensagem do dia',
    text: 'Escreve uma função pedirMensagem que devolve uma Promise com "Bom estudo!" passados 300 ms. A App mostra "A carregar..." e, quando chegar, a mensagem num parágrafo. O teste espera meio segundo.',
    hint: H`Um estado <code>mensagem</code> a começar em <code>""</code>, um <code>useEffect(() =&gt; { pedirMensagem().then(setMensagem); }, [])</code> e um <code>if</code> antes do return.`,
    wait: 500,
    tests: [['p', 'text', 'Bom estudo!']],
    solution: J`
import { useEffect, useState } from "react";

function pedirMensagem(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve("Bom estudo!"), 300));
}

export default function App() {
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    pedirMensagem().then((m) => setMensagem(m));
  }, []);

  if (mensagem === "") {
    return <p>A carregar...</p>;
  }
  return <p>{mensagem}</p>;
}`,
  }, {
    title: 'Os três estados',
    text: 'A função pedirUcs devolve uma Promise que se cumpre com uma lista vazia passados 200 ms. Mostra "A carregar..." enquanto espera, um parágrafo com a classe erro se falhar, "Não há UCs." se a lista vier vazia, e a lista se tiver UCs. O teste espera meio segundo.',
    hint: H`Como no exemplo: estados <code>ucs</code>, <code>aCarregar</code> e <code>erro</code>, e três <code>if</code> antes do return final.`,
    wait: 500,
    tests: [['p', 'text', 'Não há UCs.'], ['li', 'count', 0]],
    solution: J`
import { useEffect, useState } from "react";

function pedirUcs(): Promise<string[]> {
  return new Promise((resolve) => setTimeout(() => resolve([]), 200));
}

export default function App() {
  const [ucs, setUcs] = useState<string[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    pedirUcs()
      .then((lista) => setUcs(lista))
      .catch(() => setErro("Não foi possível carregar as UCs."))
      .finally(() => setACarregar(false));
  }, []);

  if (aCarregar) {
    return <p>A carregar...</p>;
  }
  if (erro !== "") {
    return <p className="erro">{erro}</p>;
  }
  if (ucs.length === 0) {
    return <p>Não há UCs.</p>;
  }
  return (
    <ul>
      {ucs.map((uc) => (
        <li key={uc}>{uc}</li>
      ))}
    </ul>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Hooks próprios e a app completa',
  short: 'juntar tudo, tirar a lógica para um hook e o que aprender a seguir',
  body: H`
<p>Está na hora de juntar as peças: formulário, lista, concluir, apagar e resumo. Para a App não ficar enorme, a lógica das tarefas sai para um <strong>hook próprio</strong>:</p>
<ul>
<li>Um hook próprio é uma função cujo nome começa por <code>use</code> e que usa outros hooks (<code>useState</code>, <code>useEffect</code>). Devolve o que quiseres: aqui, as tarefas e as funções para as mudar.</li>
<li>Cada componente que chama o hook tem o <strong>seu</strong> estado: o hook partilha a lógica, não os dados.</li>
<li>O texto do formulário vive no <code>FormNova</code>, perto de onde é usado. Repara no painel: enquanto escreves, só o FormNova renderiza.</li>
<li>Próximos passos: guardar as tarefas no <code>localStorage</code> com um efeito; pedir dados a uma API a sério com <code>fetch</code>; várias páginas com o React Router; e as React DevTools no browser (o painel "Componentes" deste curso imita-as).</li>
</ul>`,
  analogy: 'Um hook próprio é uma receita escrita num cartão: a App e outro componente qualquer podem seguir a mesma receita, mas cada um cozinha na sua panela.',
  examples: [{
    title: 'A app de tarefas completa',
    code: APP_10,
    prev: APP_7,
    steps: [
      { l: linhaDe(APP_10, 'function useTarefas'), n: H`O hook próprio: o estado das tarefas e as três funções que o mudam, tudo num sítio. Para o TypeScript, é só uma função.` },
      { l: linhaDe(APP_10, 'return { tarefas, adicionar'), n: 'Devolve um objeto com os dados e as funções.' },
      { l: linhaDe(APP_10, '= useTarefas(TAREFAS)'), rr: ['App', 'FormNova', 'ItemTarefa'], chk: [['li', 'count', 3], ['.resumo', 'text', '1 de 3 feitas']], n: H`A App chama o hook e desmonta o objeto. No painel, o estado do hook aparece na App: o estado é sempre de quem chama o hook.` },
      { l: linhaDe(APP_10, '<input id="nova"'), act: ['input', '#nova', 'Rever a matéria'], rr: ['FormNova'], chk: [['#nova', 'value', 'Rever a matéria']], n: H`Escreveste no campo: só o <code>FormNova</code> renderizou, porque o estado do texto é dele. A App e os itens nem souberam.` },
      { l: linhaDe(APP_10, 'onAdicionar(texto.trim())'), act: ['click', 'button[type="submit"]'], rr: ['App', 'FormNova', 'ItemTarefa'], chk: [['li', 'count', 4], ['li:last-child span', 'text', 'Rever a matéria'], ['.resumo', 'text', '1 de 4 feitas']], n: H`Carregaste em Adicionar: o FormNova chama <code>onAdicionar</code>, que é o <code>adicionar</code> do hook. As tarefas mudam e a App renderiza com os filhos.` },
      { l: linhaDe(APP_10, 'onClick={() => onAlternar(tarefa.id)}'), act: ['click', 'li:last-child .alternar'], rr: ['App', 'FormNova', 'ItemTarefa'], chk: [['.resumo', 'text', '2 de 4 feitas']], n: 'Concluir: o item chama a função que veio do hook, pela App.' },
      { l: linhaDe(APP_10, 'onClick={() => onRemover(tarefa.id)}'), act: ['click', 'li:first-child .remover'], rr: ['App', 'FormNova', 'ItemTarefa'], chk: [['li', 'count', 3], ['.resumo', 'text', '2 de 3 feitas']], n: H`Apagar a primeira. Componentes, props, estado, eventos, listas, keys e atualizações sem estragar o array: está tudo nesta app.` },
    ],
  }],
  mistakes: [
    H`Dar ao hook um nome sem <code>use</code> no início: funciona, mas as ferramentas (e quem lê) já não sabem que tem as regras dos hooks.`,
    H`Achar que dois componentes que chamam o mesmo hook partilham os dados: cada um tem o seu estado. Para partilhar, levanta o estado (lição 7).`,
    H`Chamar um hook dentro de um if, de um ciclo ou de uma função normal: só no topo de um componente ou de outro hook.`,
    H`Pôr todo o estado na App: o texto de um formulário pertence ao formulário.`,
  ],
  quiz: [
    { q: 'Depois de carregar uma vez no primeiro botão, que texto tem o segundo?', code: J`
import { useState } from "react";

function useContador() {
  const [n, setN] = useState(0);
  return { n, mais: () => setN(n + 1) };
}

function Contador() {
  const { n, mais } = useContador();
  return <button onClick={mais}>{n}</button>;
}

export default function App() {
  return (
    <div>
      <Contador />
      <Contador />
    </div>
  );
}`, acts: [['click', 'button']], ask: ['button:last-child', 'text'], opts: ['0', '1', '2', 'NaN'], ok: 0, check: true,
      exp: 'Cada Contador chama o hook e tem o seu próprio estado. O hook partilha a lógica, não os dados.' },
    { q: 'Depois de carregar 2 vezes em +, que texto tem o parágrafo?', code: J`
import { useState } from "react";

function useLista() {
  const [itens, setItens] = useState<string[]>([]);
  function juntar(item: string) {
    setItens([...itens, item]);
  }
  return { itens, juntar };
}

export default function App() {
  const { itens, juntar } = useLista();
  return (
    <div>
      <button onClick={() => juntar("x")}>+</button>
      <p>{itens.length} itens: {itens.join("")}</p>
    </div>
  );
}`, acts: [['click', 'button'], ['click', 'button']], ask: ['p', 'text'], opts: ['2 itens: xx', '0 itens: ', '1 itens: x', '2 itens: x,x'], ok: 0, check: true,
      exp: H`O hook guarda o array e cria um novo a cada <code>juntar</code>; a App usa o que o hook devolve. <code>join("")</code> junta sem separador.` },
    { q: 'Porque é que o nome de um hook próprio começa por "use"?', opts: ['É obrigatório para o JavaScript', 'É a convenção que diz que a função usa hooks e por isso segue as regras dos hooks (só no topo de componentes ou de outros hooks)', 'Para o React a chamar sozinho', 'Para ser mais rápido'], ok: 1,
      exp: 'O React não olha para o nome, mas as ferramentas (o ESLint, por exemplo) e quem lê usam-no para saber que a função tem de seguir as regras dos hooks.' },
    { q: 'Na app completa, escreves no campo de nova tarefa. Que componentes renderizam?', opts: ['Todos', 'Só a App', 'Só o FormNova, porque o estado do texto é dele', 'Nenhum: os inputs não renderizam'], ok: 2,
      exp: 'Só renderiza quem tem o estado que mudou (e os seus filhos). Guardar o estado perto de onde é usado evita trabalho ao resto da app.' },
  ],
  exercises: [{
    title: 'Um hook useAlternar',
    text: 'Escreve um hook useAlternar(inicial: boolean) que devolve { ligado, alternar }. Usa-o num componente Interruptor (um botão que mostra "Ligado" ou "Desligado") e põe dois na App. O teste carrega no primeiro.',
    hint: H`Dentro do hook, um <code>useState(inicial)</code>; devolve <code>{ ligado, alternar: () =&gt; setLigado(!ligado) }</code>. No Interruptor, <code>const { ligado, alternar } = useAlternar(false)</code>.`,
    acts: [['click', 'button']],
    tests: [['button:first-child', 'text', 'Ligado'], ['button:last-child', 'text', 'Desligado']],
    solution: J`
import { useState } from "react";

function useAlternar(inicial: boolean) {
  const [ligado, setLigado] = useState(inicial);
  return { ligado, alternar: () => setLigado(!ligado) };
}

function Interruptor() {
  const { ligado, alternar } = useAlternar(false);
  return <button onClick={alternar}>{ligado ? "Ligado" : "Desligado"}</button>;
}

export default function App() {
  return (
    <div>
      <Interruptor />
      <Interruptor />
    </div>
  );
}`,
  }, {
    title: 'Limpar as feitas na app',
    text: 'Pega na app de tarefas e acrescenta ao hook uma função limparFeitas, ligada a um botão "Limpar feitas" (com id limpar). Começa com Estudar (por fazer), Exercício (feita) e Cábula (feita). O teste carrega no botão.',
    hint: H`No hook: <code>function limparFeitas() { setTarefas(tarefas.filter((t) =&gt; !t.feita)); }</code> e devolve-a no objeto.`,
    acts: [['click', '#limpar']],
    tests: [['li', 'count', 1], ['li span', 'text', 'Estudar']],
    solution: J`
import { useState } from "react";

interface Tarefa {
  id: number;
  texto: string;
  feita: boolean;
}

function useTarefas(iniciais: Tarefa[]) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(iniciais);
  function limparFeitas() {
    setTarefas(tarefas.filter((t) => !t.feita));
  }
  return { tarefas, limparFeitas };
}

export default function App() {
  const { tarefas, limparFeitas } = useTarefas([
    { id: 1, texto: "Estudar", feita: false },
    { id: 2, texto: "Exercício", feita: true },
    { id: 3, texto: "Cábula", feita: true },
  ]);
  return (
    <main>
      <button id="limpar" onClick={limparFeitas}>Limpar feitas</button>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id} className={t.feita ? "feita" : ""}>
            <span>{t.texto}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
  }],
});
