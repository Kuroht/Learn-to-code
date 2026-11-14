// ===== React do Zero — conteúdo das lições (parte 4: perceber os hooks) =====
// Lições 11 a 14: o ciclo de vida, que hook usar, useMemo/useCallback/memo e hooks próprios.
// Estes exemplos usam console.log: o painel "Consola" mostra as linhas, e o check confirma-as (campo log
// dos passos: TODAS as linhas desde que a app abriu). rn conta renders: { App: 2 } = a App renderizou 2 vezes.
// Nas perguntas, ask: ['@consola', 'text'] dá as linhas da consola, separadas por mudanças de linha.
// Lembra-te: nada de acentos no que vai para a consola.

// ---------------------------------------------------------------- 11
const APP_11 = J`
import { useEffect, useState } from "react";

function Inicio() {
  console.log("render Inicio");
  useEffect(() => {
    console.log("montou Inicio");
    return () => console.log("desmontou Inicio");
  }, []);
  return <h2>Bem-vindo</h2>;
}

function Tarefas() {
  const [feitas, setFeitas] = useState(0);
  console.log("render Tarefas");
  useEffect(() => {
    console.log("montou Tarefas");
    return () => console.log("desmontou Tarefas");
  }, []);
  return <button id="mais" onClick={() => setFeitas(feitas + 1)}>Tarefas feitas: {feitas}</button>;
}

type Pagina = "inicio" | "tarefas";

export default function App() {
  const [pagina, setPagina] = useState<Pagina>("inicio");
  return (
    <main>
      <nav>
        <button id="ir-inicio" onClick={() => setPagina("inicio")}>Início</button>
        <button id="ir-tarefas" onClick={() => setPagina("tarefas")}>Tarefas</button>
      </nav>
      {pagina === "inicio" && <Inicio />}
      {pagina === "tarefas" && <Tarefas />}
    </main>
  );
}`;

// A consola do exemplo, do princípio ao fim; cada passo mostra as primeiras N linhas.
const CONSOLA_11 = [
  'render Inicio', 'montou Inicio',
  'render Tarefas', 'desmontou Inicio', 'montou Tarefas',
  'render Tarefas',
  'render Inicio', 'desmontou Tarefas', 'montou Inicio',
  'render Tarefas', 'desmontou Inicio', 'montou Tarefas',
];

const APP_11_DEPS = J`
import { useEffect, useState } from "react";

export default function App() {
  const [nome, setNome] = useState("Ana");
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    console.log("efeito com " + nome);
    return () => console.log("limpeza com " + nome);
  }, [nome]);

  return (
    <div>
      <p>Jogador: {nome}</p>
      <button id="ponto" onClick={() => setPontos(pontos + 1)}>Pontos: {pontos}</button>
      <button id="rui" onClick={() => setNome("Rui")}>Mudar para o Rui</button>
    </div>
  );
}`;

LESSONS.push({
  id: 11,
  title: 'O ciclo de vida: nascer, viver, desaparecer',
  short: 'montar, atualizar e desmontar um componente, e o que acontece quando se muda de página',
  body: H`
<p>A app de tarefas está feita. Estas últimas lições explicam a parte que mais confunde no React: <strong>quando</strong> acontece cada coisa e <strong>que hook usar</strong>. Começa pela vida de um componente, que tem três momentos:</p>
<ol>
<li><strong>Montar</strong> (nascer): o componente aparece no ecrã pela primeira vez. O React chama a função (o <em>render</em>), põe o resultado na página, e <em>só depois</em> corre os efeitos.</li>
<li><strong>Atualizar</strong> (viver): o estado ou as props mudam. O React chama a função outra vez e muda na página só o que ficou diferente. Os efeitos só voltam a correr se uma das suas dependências mudou.</li>
<li><strong>Desmontar</strong> (desaparecer): o componente sai do ecrã (uma condição ficou falsa, mudaste de página). O React corre as funções de limpeza dos efeitos, e <strong>o estado desse componente perde-se</strong>.</li>
</ol>
<p>A app inteira também tem uma vida: o browser abre o <code>index.html</code>, corre o <code>main.tsx</code>, que monta a App; depois, cada ação do utilizador provoca atualizações; quando fechas o separador, tudo desaparece (e o estado também, a não ser que o guardes, por exemplo no <code>localStorage</code>).</p>
<p>E uma <strong>página</strong>? Numa app com várias páginas (com o React Router, por exemplo), cada página é um componente. Mudar de página = desmontar o componente da página antiga e montar o da nova. O exemplo faz isso à mão, com um estado <code>pagina</code>.</p>
<p>No código, os três momentos ficam assim:</p>
<pre class="snip"><code>useEffect(() =&gt; {
  // corre depois de montar (e quando as dependências mudam)
  return () =&gt; {
    // limpeza: corre antes de desmontar (e antes de o efeito correr outra vez)
  };
}, [dependencias]);</code></pre>`,
  analogy: 'Um componente é como um aluno numa sala. Montar é entrar e sentar-se (e só depois de sentado tira os livros da mochila: o efeito). Atualizar é a aula a decorrer. Desmontar é sair: arruma os livros (a limpeza), e o que estava escrito no caderno da carteira fica para trás (o estado).',
  examples: [{
    title: 'Mudar de página',
    code: APP_11,
    steps: [
      { l: linhaDe(APP_11, 'console.log("render Inicio")'), n: H`Cada componente escreve na consola quando renderiza, quando monta (no efeito) e quando desmonta (na limpeza). Vê o painel "Consola".` },
      { l: linhaDe(APP_11, '{pagina === "inicio" && <Inicio />}'), rr: ['App', 'Inicio'], log: CONSOLA_11.slice(0, 2), chk: [['h2', 'text', 'Bem-vindo']], n: H`A app abriu: o Inicio <strong>montou</strong>. Repara na ordem: primeiro o render, e só depois de estar no ecrã, o efeito ("montou Inicio").` },
      { l: linhaDe(APP_11, 'onClick={() => setPagina("tarefas")}'), act: ['click', '#ir-tarefas'], rr: ['App', 'Tarefas'], log: CONSOLA_11.slice(0, 5), chk: [['h2', 'count', 0], ['#mais', 'count', 1]], n: H`Mudaste de página: o Tarefas renderiza, o Inicio <strong>desmonta</strong> (a limpeza corre) e o Tarefas <strong>monta</strong>. No painel "Componentes", o Inicio desapareceu da árvore.` },
      { l: linhaDe(APP_11, 'setFeitas(feitas + 1)'), act: ['click', '#mais'], rr: ['Tarefas'], log: CONSOLA_11.slice(0, 6), chk: [['#mais', 'text', 'Tarefas feitas: 1']], n: H`Uma <strong>atualização</strong>: o estado do Tarefas muda e ele renderiza outra vez. O efeito não corre: as dependências (<code>[]</code>) não mudaram. Só montar e desmontar o fazem correr.` },
      { l: linhaDe(APP_11, 'onClick={() => setPagina("inicio")}'), act: ['click', '#ir-inicio'], rr: ['App', 'Inicio'], log: CONSOLA_11.slice(0, 9), n: H`De volta ao Início: o Tarefas desmonta e o Inicio monta outra vez, como se fosse novo.` },
      { l: linhaDe(APP_11, 'useState(0)'), act: ['click', '#ir-tarefas'], rr: ['App', 'Tarefas'], log: CONSOLA_11, chk: [['#mais', 'text', 'Tarefas feitas: 0']], n: H`E de novo às Tarefas: o contador voltou a 0! O Tarefas desmontou, e o estado foi com ele. Um componente montado de novo começa com o <code>useState(0)</code>. Se quisesses guardar as tarefas feitas entre páginas, o estado tinha de viver na App (lição 7), que nunca desmonta.` },
    ],
  }, {
    title: 'Um efeito com dependências',
    code: APP_11_DEPS,
    steps: [
      { l: linhaDe(APP_11_DEPS, '}, [nome]);'), rr: ['App'], log: ['efeito com Ana'], n: H`Ao montar, o efeito corre uma vez, com o nome "Ana". As dependências são <code>[nome]</code>: o efeito volta a correr sempre que <code>nome</code> mudar, e só nessa altura.` },
      { l: linhaDe(APP_11_DEPS, 'setPontos(pontos + 1)'), act: ['click', '#ponto'], rr: ['App'], log: ['efeito com Ana'], chk: [['#ponto', 'text', 'Pontos: 1']], n: H`Os pontos mudaram e a App renderizou, mas a consola não tem nada de novo: <code>nome</code> não mudou, por isso o efeito não corre.` },
      { l: linhaDe(APP_11_DEPS, 'return () => console.log'), act: ['click', '#rui'], rr: ['App'], log: ['efeito com Ana', 'limpeza com Ana', 'efeito com Rui'], chk: [['p', 'text', 'Jogador: Rui']], n: H`O nome mudou: primeiro corre a limpeza do efeito <strong>antigo</strong> (que ainda vê "Ana"), depois o efeito novo, com "Rui". É assim que um efeito "desliga" o que fez antes de "ligar" com os valores novos.` },
    ],
  }],
  mistakes: [
    H`Achar que o efeito corre antes de o componente aparecer: corre sempre <em>depois</em> do render, com a página já desenhada.`,
    H`Guardar num componente que desmonta (uma página, um painel que se fecha) um estado que querias manter: perde-se. Põe-no no pai.`,
    H`Esquecer a limpeza de um temporizador ou de um <code>addEventListener</code>: o componente desaparece, mas aquilo continua a correr.`,
    H`Achar que o <code>[]</code> quer dizer "nunca": quer dizer "só ao montar" (e a limpeza só ao desmontar).`,
  ],
  quiz: [
    { q: 'O que aparece na consola quando a app abre?', code: J`
import { useEffect } from "react";

export default function App() {
  console.log("A");
  useEffect(() => {
    console.log("B");
  }, []);
  console.log("C");
  return <p>Olá</p>;
}`, ask: ['@consola', 'text'], mono: true, opts: ['A\nB\nC', 'A\nC\nB', 'B\nA\nC', 'A\nC'], ok: 1, check: true,
      exp: H`O render corre a função de cima a baixo (A e C); o efeito fica guardado e só corre depois de a página estar desenhada (B).` },
    { q: 'Depois de carregar 2 vezes em Alternar, o que aparece na consola?', code: J`
import { useEffect, useState } from "react";

function Aviso() {
  useEffect(() => {
    console.log("apareceu");
    return () => console.log("desapareceu");
  }, []);
  return <p>Aviso!</p>;
}

export default function App() {
  const [visivel, setVisivel] = useState(true);
  return (
    <div>
      <button onClick={() => setVisivel(!visivel)}>Alternar</button>
      {visivel && <Aviso />}
    </div>
  );
}`, acts: [['click', 'button'], ['click', 'button']], ask: ['@consola', 'text'], mono: true, opts: ['apareceu', 'apareceu\ndesapareceu', 'apareceu\ndesapareceu\napareceu', 'apareceu\napareceu\napareceu'], ok: 2, check: true,
      exp: 'O Aviso monta ao abrir, desmonta no primeiro Alternar (limpeza) e monta outra vez no segundo.' },
    { q: 'Depois de carregar 2 vezes no botão, o que aparece na consola?', code: J`
import { useEffect, useState } from "react";

export default function App() {
  const [n, setN] = useState(0);
  console.log("render");
  useEffect(() => {
    console.log("efeito");
  }, []);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`, acts: [['click', 'button'], ['click', 'button']], ask: ['@consola', 'text'], mono: true, opts: ['render\nefeito', 'render\nefeito\nrender\nrender', 'render\nefeito\nrender\nefeito\nrender\nefeito', 'efeito\nrender\nrender\nrender'], ok: 1, check: true,
      exp: H`Três renders (ao abrir e de cada vez que carregaste), mas o efeito com <code>[]</code> só corre ao montar.` },
    { q: 'Carregas 2 vezes em +1, depois em Esconder e depois em Mostrar. Que texto tem o botão do contador?', code: J`
import { useState } from "react";

function Contador() {
  const [n, setN] = useState(0);
  return <button id="mais" onClick={() => setN(n + 1)}>{n}</button>;
}

export default function App() {
  const [visivel, setVisivel] = useState(true);
  return (
    <div>
      <button id="alternar" onClick={() => setVisivel(!visivel)}>{visivel ? "Esconder" : "Mostrar"}</button>
      {visivel && <Contador />}
    </div>
  );
}`, acts: [['click', '#mais'], ['click', '#mais'], ['click', '#alternar'], ['click', '#alternar']], ask: ['#mais', 'text'], opts: ['2', '0', '1', '3'], ok: 1, check: true,
      exp: 'Esconder desmontou o Contador e o estado perdeu-se. Ao mostrar, é um Contador novo, que começa em 0.' },
  ],
  exercises: [{
    title: 'Aparecer e desaparecer',
    text: 'Faz um componente Aviso com um efeito que escreve "apareceu" na consola ao montar e "desapareceu" ao desmontar. A App tem um botão que mostra e esconde o Aviso (começa visível). O teste carrega uma vez no botão.',
    hint: H`No Aviso: <code>useEffect(() =&gt; { console.log("apareceu"); return () =&gt; console.log("desapareceu"); }, [])</code>. Na App: <code>{visivel &amp;&amp; &lt;Aviso /&gt;}</code>.`,
    acts: [['click', 'button']],
    tests: [['@consola', 'text', 'apareceu\ndesapareceu'], ['p', 'count', 0]],
    solution: J`
import { useEffect, useState } from "react";

function Aviso() {
  useEffect(() => {
    console.log("apareceu");
    return () => console.log("desapareceu");
  }, []);
  return <p>Tens um teste amanhã!</p>;
}

export default function App() {
  const [visivel, setVisivel] = useState(true);
  return (
    <main>
      <button onClick={() => setVisivel(!visivel)}>Mostrar / esconder</button>
      {visivel && <Aviso />}
    </main>
  );
}`,
  }, {
    title: 'Registo de páginas',
    text: 'Faz duas "páginas", Perfil e Definições, com dois botões para mudar entre elas (ids perfil e definicoes). Um efeito com a página nas dependências escreve "pagina: perfil" ou "pagina: definicoes" na consola sempre que a página muda (e ao abrir). O teste vai às Definições e volta ao Perfil.',
    hint: H`Um estado <code>pagina</code> com um tipo união, e <code>useEffect(() =&gt; { console.log("pagina: " + pagina); }, [pagina])</code>.`,
    acts: [['click', '#definicoes'], ['click', '#perfil']],
    tests: [['@consola', 'text', 'pagina: perfil\npagina: definicoes\npagina: perfil'], ['h2', 'text', 'O meu perfil']],
    solution: J`
import { useEffect, useState } from "react";

type Pagina = "perfil" | "definicoes";

export default function App() {
  const [pagina, setPagina] = useState<Pagina>("perfil");

  useEffect(() => {
    console.log("pagina: " + pagina);
  }, [pagina]);

  return (
    <main>
      <nav>
        <button id="perfil" onClick={() => setPagina("perfil")}>Perfil</button>
        <button id="definicoes" onClick={() => setPagina("definicoes")}>Definições</button>
      </nav>
      {pagina === "perfil" ? <h2>O meu perfil</h2> : <h2>Definições</h2>}
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 12
const APP_12 = J`
import { useEffect, useState } from "react";

const PRECO = 3;

export default function App() {
  const [quantidade, setQuantidade] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(quantidade * PRECO);
  }, [quantidade]);

  return (
    <div>
      <button onClick={() => setQuantidade(quantidade + 1)}>+1</button>
      <p id="quantidade">Quantidade: {quantidade}</p>
      <p id="total">Total: {total} euros</p>
    </div>
  );
}`;

const APP_12_REF = J`
import { useRef, useState } from "react";

export default function App() {
  const [mostrado, setMostrado] = useState(0);
  const contagem = useRef(0);
  const campo = useRef<HTMLInputElement>(null);

  function contarEmSilencio() {
    contagem.current = contagem.current + 1;
  }

  function mostrar() {
    setMostrado(contagem.current);
    campo.current?.focus();
  }

  return (
    <div>
      <button id="contar" onClick={contarEmSilencio}>Contar</button>
      <button id="mostrar" onClick={mostrar}>Mostrar</button>
      <p>Contagem: {mostrado}</p>
      <input ref={campo} aria-label="Nota" />
    </div>
  );
}`;

LESSONS.push({
  id: 12,
  title: 'Que hook uso? Um guia de perguntas',
  short: 'useState, um cálculo, useRef, useEffect ou código no evento: como escolher',
  body: H`
<p>A pergunta mais difícil no React não é <em>como</em> se usa um hook, é <em>qual</em> usar. Para cada valor ou ação, faz estas perguntas, por esta ordem, e para na primeira resposta "sim":</p>
<div class="t-wrap"><table class="t">
<thead><tr><th>Pergunta</th><th>Se sim</th></tr></thead>
<tbody>
<tr><td>1. Acontece por causa de uma ação do utilizador (carregar, escrever, enviar)?</td><td>Código no <strong>evento</strong> (<code>onClick</code>, <code>onSubmit</code>). Não é preciso hook.</td></tr>
<tr><td>2. Dá para calcular a partir das props ou do estado que já tens?</td><td>Um <strong>cálculo</strong> normal no render: <code>const total = quantidade * PRECO</code>. Não é preciso hook.</td></tr>
<tr><td>3. Aparece no ecrã e muda com o tempo?</td><td><strong>useState</strong>.</td></tr>
<tr><td>4. Tens de te lembrar de um valor entre renders, mas mudá-lo não deve redesenhar nada (o id de um temporizador, um elemento da página)?</td><td><strong>useRef</strong>.</td></tr>
<tr><td>5. Tens de manter algo de fora do React a par do componente (um servidor, um temporizador, o título da janela) quando ele aparece ou um valor muda?</td><td><strong>useEffect</strong>.</td></tr>
<tr><td>6. Algo ficou lento, ou um filho renderiza sem precisar?</td><td><strong>useMemo / useCallback / memo</strong> (lição 13). Quase nunca.</td></tr>
<tr><td>7. Estás a copiar a mesma mistura de hooks para outro componente?</td><td>Um <strong>hook próprio</strong> (lição 14).</td></tr>
</tbody></table></div>
<p>Repara que as duas primeiras respostas são "nenhum hook". O erro mais comum é usar um <code>useEffect</code> para calcular um valor ou para reagir a um botão: funciona, mas renderiza duas vezes e mostra, por um instante, um valor errado.</p>
<p>O <code>useRef</code> é novo: <code>const caixa = useRef(valorInicial)</code> dá um objeto <code>{ current: ... }</code> que o React guarda entre renders. Podes mudar <code>caixa.current</code> à vontade: o React não repara, não redesenha. Também serve para chegar a um elemento da página: <code>&lt;input ref={campo} /&gt;</code> e depois <code>campo.current?.focus()</code>.</p>`,
  analogy: 'O estado é o quadro da sala: quando o mudas, todos olham e a aula continua com o valor novo (render). Um ref é o teu caderno: podes escrever nele o que quiseres, que ninguém repara. Um cálculo é uma conta de cabeça: não precisas de a escrever em lado nenhum, fazes outra vez quando precisares.',
  examples: [{
    title: 'O efeito que estava a mais',
    code: APP_12,
    steps: [
      { l: linhaDe(APP_12, 'useState(0)'), n: H`O total parece "dados", por isso alguém o pôs num estado, e usou um efeito para o atualizar quando a quantidade muda. Vamos ver o que isso custa.` },
      { l: linhaDe(APP_12, 'setTotal(quantidade * PRECO)'), rr: ['App'], rn: { App: 2 }, chk: [['#total', 'text', 'Total: 3 euros']], n: H`Ao abrir, a App renderizou <strong>2 vezes</strong> (vê o "2×" no painel): primeiro com total 0, depois o efeito corre, muda o total para 3, e outra vez.` },
      { l: linhaDe(APP_12, 'setQuantidade(quantidade + 1)'), act: ['click', 'button'], rr: ['App'], rn: { App: 2 }, chk: [['#quantidade', 'text', 'Quantidade: 2'], ['#total', 'text', 'Total: 6 euros']], n: H`Cada vez que carregas, 2 renders outra vez: o primeiro com quantidade 2 e total 3 (errado, durante um instante), e o segundo já certo.` },
      { l: linhaDe(APP_12, 'const [total, setTotal]'), n: H`A pergunta 2 do guia: o total calcula-se a partir da quantidade? Sim. Então a versão certa é só <code>const total = quantidade * PRECO;</code>, sem o estado e sem o efeito: menos código, um só render, e nunca um total errado. É o exercício 1.` },
    ],
  }, {
    title: 'useRef: lembrar sem redesenhar',
    code: APP_12_REF,
    steps: [
      { l: linhaDe(APP_12_REF, 'useRef(0)'), rr: ['App'], n: H`Dois refs: <code>contagem</code> guarda um número, e <code>campo</code> vai guardar o elemento <code>&lt;input&gt;</code> (por causa do <code>ref={campo}</code>). No painel aparecem com "(ref)".` },
      { l: linhaDe(APP_12_REF, 'contagem.current = contagem.current + 1'), act: ['click', '#contar'], rr: [], chk: [['p', 'text', 'Contagem: 0']], n: H`Carregaste em Contar: o ref passou a 1 (vê no painel), mas <strong>nada renderizou</strong> e o ecrã continua com 0. Mudar um ref não avisa o React.` },
      { l: linhaDe(APP_12_REF, 'contagem.current = contagem.current + 1'), act: ['click', '#contar'], rr: [], chk: [['p', 'text', 'Contagem: 0']], n: 'Outra vez: o ref vai em 2, o ecrã continua igual.' },
      { l: linhaDe(APP_12_REF, 'setMostrado(contagem.current)'), act: ['click', '#mostrar'], rr: ['App'], chk: [['p', 'text', 'Contagem: 2']], n: H`Mostrar copia o ref para o estado: agora sim, a App renderiza com 2. E <code>campo.current?.focus()</code> pôs o cursor no campo de texto: é para isto que um ref de um elemento serve.` },
    ],
  }],
  mistakes: [
    H`Usar <code>useEffect</code> para calcular um valor a partir de outro estado: renderiza duas vezes. Calcula-o no render.`,
    H`Usar <code>useEffect</code> para reagir a um botão ("quando <code>enviado</code> mudar, envia"): põe o código no próprio <code>onClick</code>.`,
    H`Mostrar no ecrã um valor que está num ref: o ecrã não se atualiza quando ele muda. O que aparece no ecrã é estado.`,
    H`Criar um estado para cada coisa "por via das dúvidas": cada estado a mais é mais uma coisa que pode ficar desatualizada.`,
  ],
  quiz: [
    { q: 'Depois de carregar 3 vezes no botão, que texto tem?', code: J`
import { useRef } from "react";

export default function App() {
  const vezes = useRef(0);
  return (
    <button onClick={() => { vezes.current = vezes.current + 1; }}>
      Carregaste {vezes.current} vezes
    </button>
  );
}`, acts: [['click', 'button'], ['click', 'button'], ['click', 'button']], ask: ['button', 'text'], opts: ['Carregaste 3 vezes', 'Carregaste 0 vezes', 'Carregaste 1 vezes', 'Carregaste undefined vezes'], ok: 1, check: true,
      exp: H`O ref chegou a 3, mas mudar um ref não renderiza, e o botão continua a mostrar o valor do primeiro render. Para aparecer no ecrã, tinha de ser estado.` },
    { q: 'O que aparece na consola quando a app abre?', code: J`
import { useEffect, useState } from "react";

export default function App() {
  const [nome] = useState("ana");
  const [maiusculas, setMaiusculas] = useState("");
  console.log("render");
  useEffect(() => {
    setMaiusculas(nome.toUpperCase());
  }, [nome]);
  return <p>{maiusculas}</p>;
}`, ask: ['@consola', 'text'], mono: true, opts: ['render', 'render\nrender', 'render\nrender\nrender', '(nada)'], ok: 1, check: true,
      exp: H`Um render com <code>maiusculas</code> vazio, o efeito muda o estado, e outro render. Com <code>const maiusculas = nome.toUpperCase()</code> era um render só.` },
    { q: 'Queres mostrar quantas tarefas faltam fazer. O que usas?', opts: ['Um useState e um useEffect que o atualiza', 'Um cálculo no render: tarefas.filter((t) => !t.feita).length', 'Um useRef', 'Um useMemo, sempre'], ok: 1,
      exp: 'Pergunta 2 do guia: calcula-se a partir do estado que já tens. Nenhum hook.' },
    { q: 'Quando o utilizador carrega em Guardar, queres enviar a tarefa para o servidor. Onde fica esse código?', opts: ['Num useEffect que vigia um estado "aGuardar"', 'Na função do onClick (ou do onSubmit) do botão', 'No corpo do componente', 'Num useRef'], ok: 1,
      exp: 'Pergunta 1 do guia: acontece por causa de uma ação do utilizador, por isso vai no evento. Os efeitos são para coisas que acontecem por o componente estar no ecrã.' },
    { q: 'Queres guardar o id de um setInterval, para o parares mais tarde, sem redesenhar nada. O que usas?', opts: ['useState', 'useRef', 'Uma variável let dentro do componente', 'useMemo'], ok: 1,
      exp: H`Pergunta 4: lembrar entre renders sem redesenhar. Uma variável <code>let</code> não serve: volta ao início em cada render.` },
  ],
  exercises: [{
    title: 'Sem o efeito a mais',
    text: 'Reescreve o primeiro exemplo sem useEffect e sem o estado total: um botão +1, um parágrafo com id quantidade e outro com id total ("Total: 3 euros" para 1 unidade, a 3 euros cada). O teste carrega 2 vezes.',
    hint: H`Só um estado (<code>quantidade</code>) e <code>const total = quantidade * PRECO;</code> antes do return.`,
    acts: [['click', 'button'], ['click', 'button']],
    tests: [['#quantidade', 'text', 'Quantidade: 3'], ['#total', 'text', 'Total: 9 euros']],
    solution: J`
import { useState } from "react";

const PRECO = 3;

export default function App() {
  const [quantidade, setQuantidade] = useState(1);
  const total = quantidade * PRECO;

  return (
    <div>
      <button onClick={() => setQuantidade(quantidade + 1)}>+1</button>
      <p id="quantidade">Quantidade: {quantidade}</p>
      <p id="total">Total: {total} euros</p>
    </div>
  );
}`,
  }, {
    title: 'Contar em silêncio',
    text: 'Faz um botão "Guardar" (id guardar) que conta, num ref, quantas vezes foi carregado, sem redesenhar; e um botão "Ver" (id ver) que mostra a contagem num parágrafo com id visto (começa em 0). O teste carrega 3 vezes em Guardar e depois em Ver.',
    hint: H`<code>const vezes = useRef(0)</code>; Guardar faz <code>vezes.current = vezes.current + 1</code>; Ver faz <code>setVisto(vezes.current)</code>.`,
    acts: [['click', '#guardar'], ['click', '#guardar'], ['click', '#guardar'], ['click', '#ver']],
    tests: [['#visto', 'text', '3']],
    solution: J`
import { useRef, useState } from "react";

export default function App() {
  const vezes = useRef(0);
  const [visto, setVisto] = useState(0);

  return (
    <main>
      <button id="guardar" onClick={() => { vezes.current = vezes.current + 1; }}>Guardar</button>
      <button id="ver" onClick={() => setVisto(vezes.current)}>Ver</button>
      <p id="visto">{visto}</p>
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 13
const APP_13 = J`
import { useMemo, useState } from "react";

const NUMEROS = [5, 3, 8, 1, 9, 2];

function ordenar(lista: number[], crescente: boolean): number[] {
  console.log("a ordenar...");
  const copia = [...lista].sort((a, b) => a - b);
  return crescente ? copia : copia.reverse();
}

export default function App() {
  const [crescente, setCrescente] = useState(true);
  const [tema, setTema] = useState("claro");
  const ordenados = useMemo(() => ordenar(NUMEROS, crescente), [crescente]);

  return (
    <main>
      <button id="tema" onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>Tema: {tema}</button>
      <button id="ordem" onClick={() => setCrescente(!crescente)}>Inverter</button>
      <ul>
        {ordenados.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </main>
  );
}`;

const APP_13_MEMO = J`
import { memo, useCallback, useState } from "react";

interface BotaoProps {
  texto: string;
  onCarregar: () => void;
}

const Botao = memo(function Botao({ texto, onCarregar }: BotaoProps) {
  return <button onClick={onCarregar}>{texto}</button>;
});

export default function App() {
  const [total, setTotal] = useState(0);
  const [nota, setNota] = useState("");

  const somar = useCallback(() => {
    setTotal(total + 1);
  }, [total]);

  return (
    <div>
      <input value={nota} onChange={(e) => setNota(e.target.value)} aria-label="Nota" />
      <p>Total: {total}</p>
      <Botao texto="+1" onCarregar={somar} />
    </div>
  );
}`;

LESSONS.push({
  id: 13,
  title: 'useMemo, useCallback e memo: só quando é preciso',
  short: 'guardar cálculos e funções entre renders, e porque é que quase nunca precisas',
  body: H`
<p>Já viste que, quando um componente renderiza, os filhos também renderizam, e que cada render volta a fazer todas as contas do componente. Quase sempre isso <strong>não faz mal nenhum</strong>: o React é rápido. Mas há três ferramentas para os raros casos em que faz:</p>
<ul>
<li><strong><code>useMemo(() =&gt; calculo, [deps])</code></strong> guarda o <em>resultado</em> de um cálculo e só o refaz quando uma dependência muda. Usa quando um cálculo é mesmo pesado (ordenar ou filtrar milhares de itens) e o componente renderiza muitas vezes por outras razões.</li>
<li><strong><code>memo(Componente)</code></strong> faz um componente saltar o render se as props forem as mesmas da última vez (compara cada prop com <code>Object.is</code>, como na lição 6). Usa num filho pesado que o pai faz renderizar sem precisar.</li>
<li><strong><code>useCallback(funcao, [deps])</code></strong> guarda a mesma <em>função</em> entre renders. Sozinho não serve para nada! Cada render cria funções novas, e para o <code>memo</code> uma função nova é uma prop diferente. O <code>useCallback</code> só serve para passar funções a um componente com <code>memo</code> (ou para uma função que está nas dependências de um efeito).</li>
</ul>
<p><strong>Quando usar?</strong> Escreve sempre primeiro sem nada disto. Só se notares que algo está lento (e as React DevTools mostrarem quem demora) é que acrescentas. Usar em todo o lado deixa o código mais difícil de ler e pode até ser mais lento. Os projetos mais recentes podem usar o React Compiler, que faz isto sozinho.</p>`,
  analogy: 'O useMemo é escrever o resultado de uma conta comprida num post-it: enquanto os números da conta não mudarem, lês o post-it em vez de fazer a conta outra vez. Mas fazer um post-it para 2 + 2 é perder tempo.',
  examples: [{
    title: 'useMemo: não ordenar outra vez sem precisar',
    code: APP_13,
    steps: [
      { l: linhaDe(APP_13, 'console.log("a ordenar...")'), n: H`Uma função que ordena e escreve na consola cada vez que corre, para vermos quando é chamada.` },
      { l: linhaDe(APP_13, 'useMemo(() => ordenar'), rr: ['App'], log: ['a ordenar...'], chk: [['li:first-child', 'text', '1']], n: H`Ao montar, o <code>useMemo</code> corre o cálculo e guarda o resultado (no painel: <code>ordenados (memo)</code>).` },
      { l: linhaDe(APP_13, 'setTema(tema === "claro"'), act: ['click', '#tema'], rr: ['App'], log: ['a ordenar...'], chk: [['#tema', 'text', 'Tema: escuro']], n: H`Mudaste o tema: a App renderizou, mas a consola não tem nada novo. <code>crescente</code> não mudou, por isso o <code>useMemo</code> devolveu o resultado guardado, sem ordenar.` },
      { l: linhaDe(APP_13, 'setCrescente(!crescente)'), act: ['click', '#ordem'], rr: ['App'], log: ['a ordenar...', 'a ordenar...'], chk: [['li:first-child', 'text', '9']], n: H`Agora a dependência mudou: o cálculo corre outra vez. Sem o <code>useMemo</code>, ordenava em <em>todos</em> os renders, até ao mudar o tema. Com 6 números isso não se nota (aqui o useMemo nem valia a pena); com 100 000, notava-se.` },
    ],
  }, {
    title: 'memo e useCallback: saltar o render de um filho',
    code: APP_13_MEMO,
    steps: [
      { l: linhaDe(APP_13_MEMO, 'const Botao = memo('), n: H`O <code>memo</code> à volta do componente diz: "se as props forem as mesmas, não me renderizes".` },
      { l: linhaDe(APP_13_MEMO, 'useCallback(() => {'), rr: ['App', 'Botao'], n: H`O <code>useCallback</code> guarda a função <code>somar</code> e só cria uma nova quando <code>total</code> muda.` },
      { l: linhaDe(APP_13_MEMO, 'onChange={(e) => setNota(e.target.value)}'), act: ['input', 'input', 'ola'], rr: ['App'], n: H`Escreveste no campo: a App renderizou, mas o Botao <strong>não</strong> (não está a amarelo). O texto e a função que recebe são os mesmos de antes, por isso o <code>memo</code> saltou o render. Sem o <code>useCallback</code>, <code>somar</code> seria uma função nova a cada render, e o Botao renderizava sempre.` },
      { l: linhaDe(APP_13_MEMO, 'setTotal(total + 1)'), act: ['click', 'button'], rr: ['App', 'Botao'], chk: [['p', 'text', 'Total: 1']], n: H`Carregaste em +1: <code>total</code> mudou, por isso o <code>useCallback</code> criou uma função nova, e o Botao renderizou. Está certo: precisava da função nova, que conhece o total novo.` },
    ],
  }],
  mistakes: [
    H`Pôr <code>useMemo</code> em todas as contas "por via das dúvidas": o código fica mais difícil de ler e não ganhas nada.`,
    H`Usar <code>useCallback</code> sem um <code>memo</code> no filho que recebe a função: não serve para nada.`,
    H`Esquecer uma dependência no <code>useMemo</code> ou no <code>useCallback</code>: o valor guardado fica com dados antigos.`,
    H`Achar que o <code>memo</code> funciona com props que são objetos ou arrays criados no render (<code>style={{ ... }}</code>, <code>[1, 2]</code>): são novos a cada render, logo "diferentes".`,
  ],
  quiz: [
    { q: 'Escreves "abc" no campo de uma vez. O que aparece na consola?', code: J`
import { useMemo, useState } from "react";

const NOTAS = [12, 15, 9];

function somar(lista: number[]): number {
  console.log("a somar");
  return lista.reduce((a, b) => a + b, 0);
}

export default function App() {
  const [texto, setTexto] = useState("");
  const soma = useMemo(() => somar(NOTAS), []);
  return (
    <div>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Texto" />
      <p>Soma: {soma}</p>
    </div>
  );
}`, acts: [['input', 'input', 'abc']], ask: ['@consola', 'text'], mono: true, opts: ['a somar', 'a somar\na somar', 'a somar\na somar\na somar\na somar', '(nada)'], ok: 0, check: true,
      exp: H`A soma é calculada ao montar; quando escreves, a App renderiza, mas as dependências (<code>[]</code>) não mudaram, e o <code>useMemo</code> devolve o valor guardado.` },
    { q: 'Escreves "a" no campo. O que aparece na consola?', code: J`
import { memo, useState } from "react";

const Filho = memo(function Filho({ onLimpar }: { onLimpar: () => void }) {
  console.log("render Filho");
  return <button onClick={onLimpar}>Limpar</button>;
});

export default function App() {
  const [texto, setTexto] = useState("");
  return (
    <div>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Texto" />
      <Filho onLimpar={() => setTexto("")} />
    </div>
  );
}`, acts: [['input', 'input', 'a']], ask: ['@consola', 'text'], mono: true, opts: ['render Filho', 'render Filho\nrender Filho', '(nada)', 'render Filho\nrender Filho\nrender Filho'], ok: 1, check: true,
      exp: H`A seta <code>() =&gt; setTexto("")</code> é uma função nova a cada render da App, por isso para o <code>memo</code> a prop mudou e o Filho renderiza outra vez. O <code>memo</code> sozinho não chegou.` },
    { q: 'E agora, com useCallback? Escreves "a" no campo. O que aparece na consola?', code: J`
import { memo, useCallback, useState } from "react";

const Filho = memo(function Filho({ onLimpar }: { onLimpar: () => void }) {
  console.log("render Filho");
  return <button onClick={onLimpar}>Limpar</button>;
});

export default function App() {
  const [texto, setTexto] = useState("");
  const limpar = useCallback(() => setTexto(""), []);
  return (
    <div>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Texto" />
      <Filho onLimpar={limpar} />
    </div>
  );
}`, acts: [['input', 'input', 'a']], ask: ['@consola', 'text'], mono: true, opts: ['render Filho', 'render Filho\nrender Filho', '(nada)', 'render Filho\nrender Filho\nrender Filho'], ok: 0, check: true,
      exp: H`O <code>useCallback</code> devolve a mesma função em todos os renders (as dependências, <code>[]</code>, nunca mudam). As props do Filho ficam iguais e o <code>memo</code> salta o render: só aparece o render de quando montou.` },
    { q: 'Quando deves acrescentar um useMemo?', opts: ['Sempre, em todos os cálculos', 'Quando um cálculo é pesado e notas que a app está lenta por o repetir', 'Sempre que usas useState', 'Para guardar dados entre páginas'], ok: 1,
      exp: 'Primeiro escreve sem ele. Só se medires um problema é que vale a pena: cada useMemo também tem um custo (guardar e comparar as dependências).' },
  ],
  exercises: [{
    title: 'Média calculada uma vez',
    text: 'Com as notas [10, 12, 14, 16, 11, 12], mostra a média num parágrafo com id media ("Média: 12.5"), calculada por uma função calcularMedia que escreve "a calcular" na consola. Um botão Tema muda um estado de tema sem voltar a calcular a média. O teste carrega 2 vezes em Tema.',
    hint: H`<code>const media = useMemo(() =&gt; calcularMedia(NOTAS), [])</code>: as notas são uma constante fora do componente, por isso não há dependências.`,
    acts: [['click', 'button'], ['click', 'button']],
    tests: [['@consola', 'text', 'a calcular'], ['#media', 'text', 'Média: 12.5']],
    solution: J`
import { useMemo, useState } from "react";

const NOTAS = [10, 12, 14, 16, 11, 12];

function calcularMedia(notas: number[]): number {
  console.log("a calcular");
  const soma = notas.reduce((a, b) => a + b, 0);
  return soma / notas.length;
}

export default function App() {
  const [tema, setTema] = useState("claro");
  const media = useMemo(() => calcularMedia(NOTAS), []);

  return (
    <main>
      <button onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>Tema: {tema}</button>
      <p id="media">Média: {media}</p>
    </main>
  );
}`,
  }, {
    title: 'Uma lista que não renderiza sem precisar',
    text: 'Faz um componente Lista, com memo, que recebe os itens ["pão", "leite"] e uma função onLimpar, e escreve "render Lista" na consola quando renderiza. A App tem também um campo de texto. Escrever no campo não pode fazer a Lista renderizar. O teste escreve "abc".',
    hint: H`Na App: <code>const limpar = useCallback(() =&gt; setItens([]), [])</code> e <code>&lt;Lista itens={itens} onLimpar={limpar} /&gt;</code>. Os itens estão num estado, por isso o array é o mesmo entre renders.`,
    acts: [['input', 'input', 'abc']],
    tests: [['@consola', 'text', 'render Lista'], ['li', 'count', 2]],
    solution: J`
import { memo, useCallback, useState } from "react";

interface ListaProps {
  itens: string[];
  onLimpar: () => void;
}

const Lista = memo(function Lista({ itens, onLimpar }: ListaProps) {
  console.log("render Lista");
  return (
    <div>
      <ul>
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={onLimpar}>Limpar</button>
    </div>
  );
});

export default function App() {
  const [itens, setItens] = useState<string[]>(["pão", "leite"]);
  const [nota, setNota] = useState("");
  const limpar = useCallback(() => setItens([]), []);

  return (
    <main>
      <input value={nota} onChange={(e) => setNota(e.target.value)} aria-label="Nota" />
      <Lista itens={itens} onLimpar={limpar} />
    </main>
  );
}`,
  }],
});

// ---------------------------------------------------------------- 14
const APP_14 = J`
import { useEffect, useState } from "react";

function useCarregar<T>(carregar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar()
      .then((resultado) => setDados(resultado))
      .catch(() => setErro("Não foi possível carregar."));
  }, [carregar]);

  return { dados, erro };
}

function pedirTarefas(): Promise<string[]> {
  return new Promise((resolve) => setTimeout(() => resolve(["Estudar", "Treinar"]), 300));
}

function pedirUcs(): Promise<string[]> {
  return new Promise((resolve) => setTimeout(() => resolve(["BD", "SO", "RC"]), 800));
}

function ListaTarefas() {
  const { dados, erro } = useCarregar(pedirTarefas);
  if (erro !== "") {
    return <p className="erro">{erro}</p>;
  }
  if (dados === null) {
    return <p>A carregar as tarefas...</p>;
  }
  return <ul id="tarefas">{dados.map((t) => <li key={t}>{t}</li>)}</ul>;
}

function ListaUcs() {
  const { dados, erro } = useCarregar(pedirUcs);
  if (erro !== "") {
    return <p className="erro">{erro}</p>;
  }
  if (dados === null) {
    return <p>A carregar as UCs...</p>;
  }
  return <ul id="ucs">{dados.map((uc) => <li key={uc}>{uc}</li>)}</ul>;
}

export default function App() {
  return (
    <main>
      <ListaTarefas />
      <ListaUcs />
    </main>
  );
}`;

LESSONS.push({
  id: 14,
  title: 'Hooks próprios: quando e porquê',
  short: 'quando vale a pena criar um hook, as regras dos hooks e cada chamada com o seu estado',
  body: H`
<p>Na lição 10 tiraste a lógica das tarefas para um <code>useTarefas</code>. Mas quando é que vale a pena criar um hook próprio? Um hook próprio é só uma função cujo nome começa por <code>use</code> e que chama outros hooks. Cria um quando:</p>
<ul>
<li><strong>Copiaste a mesma mistura de hooks</strong> (por exemplo um <code>useState</code> para os dados, outro para o erro, e um <code>useEffect</code> que os carrega) para um segundo componente. É o caso mais comum: a regra das duas vezes.</li>
<li><strong>Um componente ficou comprido</strong> por causa de lógica que não tem a ver com o ecrã. O componente passa a dizer <em>o que</em> mostra; o hook trata do <em>como</em>.</li>
<li><strong>Queres dar um nome a uma ideia</strong>: <code>useCarregar</code> diz mais do que quinze linhas de efeitos.</li>
</ul>
<p><strong>Quando não:</strong> se a função não chama nenhum hook, não é um hook: é uma função normal (<code>formatarPreco</code>, <code>passaFiltro</code>) e não deve começar por <code>use</code>. E um hook que só embrulha um <code>useState</code> raramente ajuda.</p>
<p><strong>As regras dos hooks</strong> (valem para todos, os do React e os teus):</p>
<ol>
<li>Chama-os sempre no topo de um componente ou de outro hook. Nunca dentro de um <code>if</code>, de um ciclo, de um evento, nem depois de um <code>return</code>. O React reconhece cada hook pela <em>ordem</em> em que é chamado; se a ordem mudar, troca os estados.</li>
<li>Os nomes começam por <code>use</code>, para quem lê (e as ferramentas) saber que estas regras se aplicam.</li>
<li>Cada chamada tem o seu estado: dois componentes que usam o mesmo hook partilham o código, não os dados.</li>
</ol>`,
  analogy: 'Um hook próprio é uma receita escrita num cartão. Sempre que vês duas pessoas a fazer o mesmo bolo de cabeça, escreves o cartão; cada uma continua a cozinhar na sua panela, mas agora ninguém se engana nos passos.',
  examples: [{
    title: 'Um hook para carregar dados, usado duas vezes',
    code: APP_14,
    steps: [
      { l: linhaDe(APP_14, 'function useCarregar<T>'), n: H`O hook junta o que a lição 9 fazia à mão: os dados, o erro e o efeito que os carrega. É genérico (<code>&lt;T&gt;</code>, do curso de TypeScript): serve para carregar qualquer coisa.` },
      { l: linhaDe(APP_14, '}, [carregar]);'), n: H`A função de carregar está nas dependências. Como as passamos já definidas fora dos componentes (<code>pedirTarefas</code>, <code>pedirUcs</code>), são sempre as mesmas, e o efeito só corre ao montar.` },
      { l: linhaDe(APP_14, 'useCarregar(pedirTarefas)'), rr: ['App', 'ListaTarefas', 'ListaUcs'], chk: [['p', 'count', 2]], n: H`Os dois componentes usam o mesmo hook, cada um com a sua função de carregar. Agora são curtos e só dizem o que mostram. No painel, cada um tem o <strong>seu</strong> <code>dados</code> e o seu <code>erro</code>.` },
      { l: linhaDe(APP_14, 'if (dados === null)'), n: H`Repara que "a carregar" não é um estado: calcula-se (<code>dados === null</code> e sem erro). Lição 12, pergunta 2.` },
      { l: linhaDe(APP_14, '<ul id="tarefas">'), wait: 450, rr: ['App', 'ListaTarefas', 'ListaUcs'], chk: [['#tarefas li', 'count', 2], ['#ucs', 'count', 0]], n: H`As tarefas chegaram primeiro: a ListaTarefas mostra a lista, e a ListaUcs ainda está a carregar. Estados separados, tempos separados.` },
      { l: linhaDe(APP_14, '<ul id="ucs">'), wait: 1000, rr: ['App', 'ListaTarefas', 'ListaUcs'], chk: [['#tarefas li', 'count', 2], ['#ucs li', 'count', 3]], n: H`E depois as UCs. Se amanhã precisares de carregar as notas, é mais um componente de 8 linhas: a lógica já está escrita, e testada, num sítio só.` },
    ],
  }],
  mistakes: [
    H`Chamar um hook dentro de um <code>if</code> ou depois de um <code>return</code> antecipado: quando a condição muda, o React dá o erro <em>Rendered more hooks than during the previous render</em>.`,
    H`Começar por <code>use</code> o nome de uma função que não usa hooks: confunde quem lê. É só uma função.`,
    H`Esperar que dois componentes com o mesmo hook partilhem dados: cada um tem o seu estado. Para partilhar, levanta o estado (lição 7).`,
    H`Criar um hook para código que só existe num sítio e é curto: espera pela segunda vez que precisas dele.`,
  ],
  quiz: [
    { q: 'Carregas 2 vezes no botão A. Que texto tem o botão B?', code: J`
import { useState } from "react";

function useContador() {
  const [valor, setValor] = useState(0);
  return { valor, mais: () => setValor(valor + 1) };
}

export default function App() {
  const a = useContador();
  const b = useContador();
  return (
    <div>
      <button id="a" onClick={a.mais}>A: {a.valor}</button>
      <button id="b" onClick={b.mais}>B: {b.valor}</button>
    </div>
  );
}`, acts: [['click', '#a'], ['click', '#a']], ask: ['#b', 'text'], opts: ['B: 2', 'B: 0', 'B: 1', 'B: undefined'], ok: 1, check: true,
      exp: 'Até no mesmo componente, cada chamada do hook tem o seu próprio estado.' },
    { q: 'Passado meio segundo, que texto tem o parágrafo?', code: J`
import { useEffect, useState } from "react";

function useMensagemAtrasada(texto: string): string {
  const [mensagem, setMensagem] = useState("...");
  useEffect(() => {
    const id = setTimeout(() => setMensagem(texto), 300);
    return () => clearTimeout(id);
  }, [texto]);
  return mensagem;
}

export default function App() {
  const mensagem = useMensagemAtrasada("Pronto");
  return <p>{mensagem}</p>;
}`, wait: 600, ask: ['p', 'text'], opts: ['...', 'Pronto', 'texto', '(vazio)'], ok: 1, check: true,
      exp: H`O hook começa com "..." e, passados 300 ms, o temporizador muda o estado. Um hook próprio pode devolver um valor simples, não tem de ser um objeto. A limpeza cancela o temporizador se o componente desaparecer antes.` },
    { q: 'Qual destas funções deve ser um hook próprio (com um nome começado por use)?', opts: ['formatarPreco(valor), que devolve "3,50 €"', 'A que guarda a largura da janela num useState e a atualiza num useEffect', 'soma(a, b)', 'passaFiltro(tarefa, filtro)'], ok: 1,
      exp: 'Só é um hook se chamar outros hooks. As outras são funções normais: podem ser chamadas em qualquer lado, até dentro de um if.' },
    { q: 'Porque é que não se pode chamar um hook dentro de um if?', opts: ['Porque o TypeScript não deixa', 'Porque o React reconhece cada hook pela ordem em que é chamado; se um render salta um hook, os estados trocam de sítio', 'Porque os ifs são lentos', 'Pode, desde que tenha else'], ok: 1,
      exp: H`O React não sabe os nomes das tuas variáveis: guarda "o 1.º hook, o 2.º hook...". Se um <code>if</code> salta um, o 3.º passa a ser o 2.º, e o React dá o erro <em>Rendered fewer hooks than expected</em> (ou mais).` },
  ],
  exercises: [{
    title: 'Usar o useCarregar',
    text: 'Copia o hook useCarregar do exemplo e usa-o num componente ListaNotas que carrega as notas [12, 15, 9] (uma função pedirNotas que responde passados 200 ms). Mostra "A carregar..." e depois uma lista. O teste espera meio segundo.',
    hint: H`<code>const { dados, erro } = useCarregar(pedirNotas);</code> e os mesmos três <code>if</code> do exemplo (erro, a carregar, lista).`,
    wait: 500,
    tests: [['li', 'count', 3], ['li:first-child', 'text', '12']],
    solution: J`
import { useEffect, useState } from "react";

function useCarregar<T>(carregar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar()
      .then((resultado) => setDados(resultado))
      .catch(() => setErro("Não foi possível carregar."));
  }, [carregar]);

  return { dados, erro };
}

function pedirNotas(): Promise<number[]> {
  return new Promise((resolve) => setTimeout(() => resolve([12, 15, 9]), 200));
}

function ListaNotas() {
  const { dados, erro } = useCarregar(pedirNotas);
  if (erro !== "") {
    return <p className="erro">{erro}</p>;
  }
  if (dados === null) {
    return <p>A carregar...</p>;
  }
  return (
    <ul>
      {dados.map((nota) => (
        <li key={nota}>{nota}</li>
      ))}
    </ul>
  );
}

export default function App() {
  return <ListaNotas />;
}`,
  }, {
    title: 'useContador com valor inicial',
    text: 'Escreve um hook useContador(inicial: number) que devolve { valor, mais, repor } (repor volta ao valor inicial). Faz um componente Contador com as props id e inicial, que mostra o valor num parágrafo e tem os botões +1 e Repor. Põe dois na App: um a começar em 0 (id a) e outro em 10 (id b). O teste carrega 2 vezes em +1 no primeiro e uma vez em +1 e Repor no segundo.',
    hint: H`No hook: <code>const [valor, setValor] = useState(inicial)</code> e <code>repor: () =&gt; setValor(inicial)</code>. Dá ids aos botões, por exemplo <code>id={id + "-mais"}</code>.`,
    acts: [['click', '#a-mais'], ['click', '#a-mais'], ['click', '#b-mais'], ['click', '#b-repor']],
    tests: [['#a', 'text', '2'], ['#b', 'text', '10']],
    solution: J`
import { useState } from "react";

function useContador(inicial: number) {
  const [valor, setValor] = useState(inicial);
  return {
    valor,
    mais: () => setValor(valor + 1),
    repor: () => setValor(inicial),
  };
}

function Contador({ id, inicial }: { id: string; inicial: number }) {
  const { valor, mais, repor } = useContador(inicial);
  return (
    <div>
      <p id={id}>{valor}</p>
      <button id={id + "-mais"} onClick={mais}>+1</button>
      <button id={id + "-repor"} onClick={repor}>Repor</button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Contador id="a" inicial={0} />
      <Contador id="b" inicial={10} />
    </main>
  );
}`,
  }],
});
