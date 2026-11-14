// ===== Python do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador (l, n, o, push, pop e x são como no C):
//   obj: { o1: [tipo, valor] }   cria ou muda um objeto. Valores simples em forma de repr: 5, 2.5, "'Ana'", 'None'.
//        Listas: ['list', [12, "'Ana'", '@o2']]; dicionários: ['dict', [["'Ana'", 17], ...]].
//        Uma string que começa por @ é uma referência para outro objeto.
//   d / u: { global: { nome: ['', '@o1'] } } / { global: { nome: '@o2' } }   cria um nome / muda para onde aponta.
// O frame de topo chama-se 'global'. Um objeto a que já nenhum nome chega aparece desbotado e desaparece no passo seguinte.
// Para simplificar, os números e textos dentro de listas e dicionários aparecem lá dentro, em vez de serem objetos à parte.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Olá, Python',
  short: 'print, sem main nem ;, e a indentação no lugar das chavetas',
  body: H`
<p>Se já fizeste o C do Zero, vais achar o Python muito mais curto. Compara:</p>
<div class="two">
<pre class="snip"><code>#include &lt;stdio.h&gt;

int main(void) {
    printf("Ola!\n");
    return 0;
}</code></pre>
<pre class="snip"><code>print("Ola!")</code></pre>
</div>
<ul>
<li>Não há <code>main</code>, nem <code>#include</code>, nem <code>;</code>. O programa corre de cima para baixo, a partir da primeira linha.</li>
<li>Não se compila à parte: corre-se logo com <code>python ola.py</code>.</li>
<li><code>print</code> já muda de linha no fim. Com vários valores separados por vírgula, põe um espaço entre eles.</li>
<li><strong>Os blocos marcam-se com a indentação</strong> (os espaços no início da linha), não com chavetas. A linha do <code>if</code> acaba com <code>:</code> e tudo o que está mais à direita pertence-lhe. Usa sempre 4 espaços.</li>
<li>Os comentários começam com <code>#</code>.</li>
</ul>`,
  analogy: 'O C é uma receita com a lista de utensílios, o "comece aqui" e um ponto final em cada passo. O Python é a mesma receita escrita por quem já te conhece: só os passos, e as sub-tarefas indicadas pelo recuo do texto.',
  examples: [{
    title: 'O print',
    code: C`
print("Ola, Python!")
print("2 + 3 =", 2 + 3)
print("A", "B", "C", sep="-")
print("sem mudar", end=" ")
print("de linha")`,
    steps: [
      { l: 1, push: 'global', o: 'Ola, Python!\n', n: H`O programa começa na primeira linha. O <code>print</code> escreve o texto e muda de linha sozinho: não é preciso <code>\n</code>.` },
      { l: 2, o: '2 + 3 = 5\n', n: H`Dois valores separados por vírgula: o texto e o resultado da conta. O print põe um espaço entre eles. Não há <code>%d</code>: o print sabe mostrar números.` },
      { l: 3, o: 'A-B-C\n', n: H`<code>sep="-"</code> troca o espaço entre os valores por um hífen.` },
      { l: 4, o: 'sem mudar ', n: H`<code>end=" "</code> troca a mudança de linha do fim por um espaço.` },
      { l: 5, o: 'de linha\n', n: 'Por isso este texto continua na mesma linha.' },
    ],
  }, {
    title: 'Blocos com indentação',
    code: C`
nota = 14
if nota >= 10:
    print("Aprovado")
    print("Parabens")
print("Fim")`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['int', 14] }, d: { global: { nota: ['', '@o1'] } }, n: H`Uma variável sem declarar o tipo. Na lição seguinte vais ver o que está mesmo a acontecer nos painéis da direita.` },
      { l: 2, n: H`<code>if</code> sem parênteses e com <code>:</code> no fim. 14 &gt;= 10 é verdadeiro.` },
      { l: 3, o: 'Aprovado\n', n: 'Esta linha está mais à direita, por isso pertence ao if.' },
      { l: 4, o: 'Parabens\n', n: 'Esta também: tem a mesma indentação.' },
      { l: 5, o: 'Fim\n', n: H`Esta voltou à esquerda, por isso já não pertence ao if: corre sempre. Em C eram as chavetas que diziam isto.` },
    ],
  }],
  mistakes: [
    H`Pôr <code>;</code> no fim das linhas por hábito do C. Não dá erro, mas não é preciso.`,
    H`Esquecer os <code>:</code> no fim do <code>if</code>, <code>for</code>, <code>while</code> ou <code>def</code>: <em>SyntaxError: expected ':'</em>.`,
    H`Indentação errada: um espaço a mais dá <em>IndentationError: unexpected indent</em>; um bloco vazio dá <em>expected an indented block</em>.`,
    H`Misturar tabs e espaços. Configura o editor para inserir 4 espaços quando carregas na tecla Tab.`,
    H`Escrever <code>Print</code>: tal como o C, o Python distingue maiúsculas de minúsculas.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
print("A", "B")
print("A" + "B")`, opts: ['A B\nAB', 'AB\nAB', 'A B\nA B', 'AB\nA B'], ok: 0, mono: true, check: true,
      exp: H`Com vírgula, o print separa os valores com um espaço. Com <code>+</code>, os dois textos são colados num só antes de serem mostrados.` },
    { q: 'O que aparece no ecrã?', code: C`
print("x", end="")
print("y")
print("z")`, opts: ['x\ny\nz', 'xy\nz', 'xyz', 'x y\nz'], ok: 1, mono: true, check: true,
      exp: H`O primeiro print acaba com <code>end=""</code>, sem mudar de linha, por isso o "y" fica colado. O segundo print já muda de linha normalmente.` },
    { q: 'O que aparece no ecrã?', code: C`
x = 3
if x > 5:
    print("grande")
print("fim")`, opts: ['grande\nfim', 'fim', 'grande', 'Nada'], ok: 1, mono: true, check: true,
      exp: H`3 &gt; 5 é falso, por isso salta o bloco do if. O <code>print("fim")</code> está encostado à esquerda, fora do if, e corre sempre.` },
    { q: 'Em Python, o que diz que linhas pertencem a um if?', opts: ['As chavetas { }', 'A indentação (os espaços no início da linha)', 'O ; no fim do bloco', 'A palavra end'], ok: 1,
      exp: 'As linhas do bloco têm de estar mais à direita do que o if, todas com a mesma indentação. Assim que uma linha volta à esquerda, o bloco acabou.' },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve um programa que mostre o teu nome numa linha e o teu curso na linha seguinte.',
    run: 'Nome: Joao\nCurso: Engenharia Informatica\n',
    hint: 'Dois print, um por linha. Não é preciso \\n.',
    solution: C`
print("Nome: Joao")
print("Curso: Engenharia Informatica")`,
  }, {
    title: 'Contas',
    text: 'Mostra a soma, a diferença e o produto de 8 e 3, exatamente neste formato.',
    run: '8 + 3 = 11\n8 - 3 = 5\n8 * 3 = 24\n',
    hint: H`Podes fazer a conta dentro do print: <code>print("8 + 3 =", 8 + 3)</code>.`,
    solution: C`
print("8 + 3 =", 8 + 3)
print("8 - 3 =", 8 - 3)
print("8 * 3 =", 8 * 3)`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Variáveis são nomes, não caixas',
  short: 'objetos, nomes que apontam para eles, e type()',
  body: H`
<p>Em C, uma variável era uma <strong>caixa</strong> com um tipo: <code>int a = 5;</code> guardava o 5 dentro da caixa <code>a</code>, e <code>b = a</code> copiava o 5 para outra caixa.</p>
<p>Em Python é diferente. <code>a = 5</code> cria um <strong>objeto</strong> (o número 5) e cola-lhe o <strong>nome</strong> <code>a</code>. O nome não é a caixa: é uma etiqueta que aponta para o objeto.</p>
<ul>
<li><code>b = a</code> não copia nada: cola um segundo nome <strong>no mesmo objeto</strong>.</li>
<li><code>a = a + 1</code> calcula 6, cria um objeto novo com o 6 e muda a etiqueta <code>a</code> para lá. O <code>b</code> continua no 5. Os números (e os textos) nunca mudam por dentro: diz-se que são <strong>imutáveis</strong>.</li>
<li>O tipo é do objeto, não do nome. O mesmo nome pode apontar para um número e, mais à frente, para um texto. <code>type(x)</code> diz o tipo do objeto para onde <code>x</code> aponta.</li>
<li>Um objeto a que já nenhum nome aponta é apagado pelo Python sozinho (no visualizador fica desbotado antes de desaparecer).</li>
</ul>
<p>Nos painéis da direita, <code>a → #1</code> quer dizer "o nome a aponta para o objeto #1".</p>`,
  analogy: 'Os objetos são coisas em cima de uma mesa e os nomes são post-its. "a = 5" é pôr o 5 na mesa e colar-lhe um post-it "a". "b = a" é colar um segundo post-it na mesma coisa. "a = a + 1" é pôr um 6 na mesa e mudar o post-it "a" para lá; o post-it "b" fica onde estava.',
  examples: [{
    title: 'Dois nomes, um objeto',
    code: C`
a = 5
b = a
a = a + 1
print(a, b)
a = "cinco"
print(type(a), b)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['int', 5] }, d: { global: { a: ['', '@o1'] } }, n: H`Cria o objeto 5 (o #1) e o nome <code>a</code> passa a apontar para ele.` },
      { l: 2, d: { global: { b: ['', '@o1'] } }, n: H`<code>b = a</code> não copia o 5: o nome <code>b</code> aponta para o <strong>mesmo</strong> objeto #1. Há dois nomes e um só objeto.` },
      { l: 3, obj: { o2: ['int', 6] }, u: { global: { a: '@o2' } }, n: H`Calcula <code>a + 1</code> = 6, que é um objeto <strong>novo</strong> (#2), e muda o nome <code>a</code> para lá. O 5 não mudou, e o <code>b</code> continua a apontar para ele.` },
      { l: 4, o: '6 5\n', n: H`O print segue cada nome até ao seu objeto: <code>a</code> dá 6, <code>b</code> dá 5.` },
      { l: 5, obj: { o3: ['str', "'cinco'"] }, u: { global: { a: '@o3' } }, n: H`Agora <code>a</code> aponta para um texto. Em C não podias trocar o tipo de uma variável; em Python o tipo é do objeto. O 6 ficou sem nomes: o Python vai apagá-lo.` },
      { l: 6, o: "<class 'str'> 5\n", n: H`<code>type(a)</code> diz o tipo do objeto para onde <code>a</code> aponta: <code>str</code> (texto). O 6 já desapareceu.` },
    ],
  }],
  mistakes: [
    H`Usar um nome antes de lhe dar um valor: <em>NameError: name 'nota' is not defined</em>. Também aparece se o nome estiver mal escrito.`,
    H`Achar que <code>b = a</code> faz uma cópia. Com números e textos não se nota, mas com listas vai fazer toda a diferença (lição 6).`,
    H`Escrever decimais com vírgula: <code>x = 14,5</code> não dá erro, mas cria um par de valores (14, 5), e não o número 14.5.`,
    H`Dar a uma variável o nome de uma função do Python (<code>list</code>, <code>str</code>, <code>sum</code>, <code>input</code>): depois a função deixa de funcionar nesse programa.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
x = 3
y = x
x = 7
print(x, y)`, opts: ['7 7', '3 3', '7 3', '3 7'], ok: 2, mono: true, check: true,
      exp: H`<code>y = x</code> pôs o <code>y</code> a apontar para o 3. Depois <code>x = 7</code> muda só o nome <code>x</code> para um objeto novo; o <code>y</code> continua no 3.` },
    { q: 'O que aparece no ecrã?', code: C`
x = 10
x = "dez"
print(x)`, opts: ['10', 'dez', '10 dez', 'TypeError: cannot assign str to int'], ok: 1, mono: true, check: true,
      exp: 'Os nomes não têm tipo: x passou a apontar para um texto. Em C isto não compilava; em Python é permitido.' },
    { q: 'O que aparece no ecrã?', code: C`print(type(3.0), type(3))`, opts: ["<class 'float'> <class 'int'>", "<class 'int'> <class 'int'>", "<class 'float'> <class 'float'>", 'float int'], ok: 0, mono: true, check: true,
      exp: H`<code>3.0</code> tem ponto, por isso é um real (<code>float</code>, o double do C). <code>3</code> é um inteiro (<code>int</code>).` },
    { q: 'Depois de a = 5 e b = a, quantos objetos com o valor 5 há?', opts: ['Nenhum', 'Um, com dois nomes', 'Dois, um para cada nome', 'Depende do computador'], ok: 1,
      exp: H`<code>b = a</code> não cria nada novo: dá um segundo nome ao objeto que já existia.` },
  ],
  exercises: [{
    title: 'Trocar valores',
    text: 'Começa com a = 1 e b = 2, troca os valores das duas variáveis e mostra-os. Em Python consegues fazê-lo numa só linha, sem variável auxiliar.',
    run: 'a = 2 b = 1\n',
    hint: H`<code>a, b = b, a</code> calcula primeiro os dois valores da direita e só depois muda os dois nomes.`,
    solution: C`
a = 1
b = 2
a, b = b, a
print("a =", a, "b =", b)`,
  }, {
    title: 'Para o ano',
    text: 'Cria as variáveis nome = "Ana" e idade = 19 e mostra as duas frases abaixo, usando as variáveis.',
    run: 'Ana tem 19 anos\nPara o ano tem 20\n',
    hint: H`<code>print(nome, "tem", idade, "anos")</code>. A conta <code>idade + 1</code> pode ir dentro do print.`,
    solution: C`
nome = "Ana"
idade = 19
print(nome, "tem", idade, "anos")
print("Para o ano tem", idade + 1)`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Ler do teclado e converter',
  short: 'input() devolve sempre texto, int(), float() e f-strings',
  body: H`
<p><code>input("Pergunta? ")</code> mostra a pergunta, espera que o utilizador escreva e carregue em Enter, e devolve o que ele escreveu. Não há <code>&amp;</code> nem códigos de formato como no <code>scanf</code>.</p>
<p>O ponto importante: <strong><code>input</code> devolve sempre texto</strong> (<code>str</code>), mesmo que o utilizador escreva um número. Para fazer contas, converte:</p>
<table class="t">
<thead><tr><th>Escreves</th><th>Dá</th></tr></thead>
<tbody>
<tr><td><code>int("19")</code></td><td>o inteiro 19</td></tr>
<tr><td><code>float("1.75")</code></td><td>o real 1.75 (com ponto, não vírgula)</td></tr>
<tr><td><code>str(19)</code></td><td>o texto "19"</td></tr>
</tbody>
</table>
<p>Para escrever texto com valores lá dentro, usa uma <strong>f-string</strong>: um <code>f</code> antes das aspas e as expressões entre chavetas. <code>f"{nome} tem {idade} anos"</code>. Para casas decimais: <code>f"{media:.2f}"</code>, como o <code>%.2f</code> do C.</p>`,
  analogy: 'O input é um secretário que anota tudo o que lhe dizem num papel, por escrito. Se lhe ditares "19", ele entrega-te o texto "19", não o número. Para fazer contas tens de lhe pedir que o converta: int().',
  examples: [{
    title: 'Perguntar e responder',
    code: C`
nome = input("Nome? ")
idade = int(input("Idade? "))
print(f"{nome} faz {idade + 1} anos para o ano.")`,
    steps: [
      { l: 1, push: 'global', o: 'Nome? ⟦Rita⟧', obj: { o1: ['str', "'Rita'"] }, d: { global: { nome: ['', '@o1'] } }, n: H`O programa mostra a pergunta e <strong>pára</strong> até o utilizador escrever e carregar em Enter. O texto escrito torna-se um objeto <code>str</code>.` },
      { l: 2, o: 'Idade? ⟦19⟧', obj: { o2: ['int', 19] }, d: { global: { idade: ['', '@o2'] } }, n: H`O <code>input</code> devolve o texto <code>'19'</code> e o <code>int(...)</code> converte-o no número 19. Sem o int, idade seria texto.` },
      { l: 3, o: 'Rita faz 20 anos para o ano.\n', n: H`Na f-string, cada <code>{...}</code> é trocado pelo valor da expressão. <code>idade + 1</code> dá 20.` },
    ],
  }, {
    title: 'Esquecer a conversão',
    code: C`
idade = input("Idade? ")
print(idade + 1)`,
    steps: [
      { l: 1, push: 'global', o: 'Idade? ⟦19⟧', obj: { o1: ['str', "'19'"] }, d: { global: { idade: ['', '@o1'] } }, n: H`Sem <code>int</code>, a <code>idade</code> aponta para o texto <code>'19'</code>. Repara no tipo do objeto #1: <code>str</code>.` },
      { l: 2, o: 'TypeError: can only concatenate str (not "int") to str\n', n: H`Texto + número não faz sentido para o Python: dá erro e o programa pára. A mensagem diz que só se pode juntar (concatenar) texto com texto.` },
    ],
  }],
  mistakes: [
    H`Fazer contas com o resultado do <code>input</code> sem converter: <em>TypeError: can only concatenate str (not "int") to str</em>.`,
    H`Converter texto que não é número: <code>int("abc")</code> dá <em>ValueError: invalid literal for int() with base 10: 'abc'</em>. Também acontece com <code>int("2.5")</code>.`,
    H`Escrever um real com vírgula: <code>float("1,5")</code> dá <em>ValueError: could not convert string to float: '1,5'</em>.`,
    H`Esquecer o <code>f</code> antes das aspas: <code>"{nome}"</code> mostra literalmente <code>{nome}</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
x = "5"
y = 3
print(x * y)`, opts: ['15', '555', '53', 'TypeError: can only concatenate str (not "int") to str'], ok: 1, mono: true, check: true,
      exp: H`<code>x</code> é texto. Texto vezes um inteiro repete o texto: "5" três vezes dá "555". Com <code>+</code> é que dava erro.` },
    { q: 'O que aparece no ecrã?', code: C`print(int("7") + int("3"))`, opts: ['73', '10', '7 3', 'ValueError'], ok: 1, mono: true, check: true,
      exp: H`Os dois textos são convertidos em números antes de somar: 7 + 3 = 10. Sem o <code>int</code>, <code>"7" + "3"</code> dava "73".` },
    { q: 'O que aparece no ecrã?', code: C`print(f"{7 / 2:.2f}")`, opts: ['3.5', '3.50', '3', '3.00'], ok: 1, mono: true, check: true,
      exp: H`7 / 2 dá 3.5 em Python (vês porquê na lição seguinte), e <code>:.2f</code> mostra sempre 2 casas decimais.` },
    { q: 'O que aparece no ecrã?', code: C`print("5" + 3)`, opts: ['8', '53', 'TypeError: can only concatenate str (not "int") to str', '5 3'], ok: 2, mono: true, check: true,
      exp: 'O Python não converte sozinho: texto + inteiro é um erro. Ou convertes o texto (int("5") + 3) ou o número (\"5\" + str(3)).' },
  ],
  exercises: [{
    title: 'Somar dois números',
    text: 'Pede dois inteiros ao utilizador e mostra a soma.',
    run: 'Primeiro: ⟦4⟧Segundo: ⟦9⟧Soma: 13\n',
    hint: H`<code>a = int(input("Primeiro: "))</code>, o mesmo para o segundo, e depois <code>print("Soma:", a + b)</code>.`,
    solution: C`
a = int(input("Primeiro: "))
b = int(input("Segundo: "))
print("Soma:", a + b)`,
  }, {
    title: 'Área de um círculo',
    text: 'Lê o raio (um número real) e mostra a área com 2 casas decimais. Área = 3.14159 × raio × raio.',
    run: 'Raio: ⟦2⟧Area: 12.57\n',
    hint: H`Usa <code>float(...)</code> para o raio poder ter casas decimais, e <code>f"Area: {area:.2f}"</code> para mostrar.`,
    solution: C`
raio = float(input("Raio: "))
area = 3.14159 * raio * raio
print(f"Area: {area:.2f}")`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Contas e decisões',
  short: '/ contra //, %, **, if, elif, else, and e or',
  body: H`
<p>Os operadores são quase os do C, com uma diferença que apanha toda a gente:</p>
<table class="t">
<thead><tr><th>Escreves</th><th>Dá</th><th>Em C</th></tr></thead>
<tbody>
<tr><td><code>7 / 2</code></td><td><code>3.5</code> (sempre real)</td><td>dava 3</td></tr>
<tr><td><code>7 // 2</code></td><td><code>3</code> (divisão inteira)</td><td>era o <code>/</code> com inteiros</td></tr>
<tr><td><code>7 % 2</code></td><td><code>1</code> (resto)</td><td>igual</td></tr>
<tr><td><code>2 ** 10</code></td><td><code>1024</code> (potência)</td><td>não havia</td></tr>
</tbody>
</table>
<p>As decisões usam <code>if</code>, <code>elif</code> (o <code>else if</code> do C) e <code>else</code>, cada um com <code>:</code> e um bloco indentado. Os lógicos escrevem-se por extenso: <code>and</code>, <code>or</code>, <code>not</code>. Verdadeiro e falso são <code>True</code> e <code>False</code>, com maiúscula.</p>
<p>Uma vantagem: <code>0 &lt;= nota &lt;= 20</code> funciona como na matemática (em C não funcionava).</p>`,
  analogy: 'O / é dividir uma piza: 7 pizas por 2 pessoas dá 3,5 a cada uma. O // é dividir bilhetes de concerto: só há bilhetes inteiros, cada um leva 3 e o % diz quantos sobram.',
  examples: [{
    title: 'Aprovado ou reprovado',
    code: C`
nota = int(input("Nota? "))
if nota < 0 or nota > 20:
    print("Nota invalida")
elif nota >= 10:
    print("Aprovado")
else:
    print("Reprovado")
print(nota // 2, nota / 2, nota % 2)`,
    steps: [
      { l: 1, push: 'global', o: 'Nota? ⟦13⟧', obj: { o1: ['int', 13] }, d: { global: { nota: ['', '@o1'] } }, n: 'Lê a nota e converte-a em inteiro.' },
      { l: 2, n: H`13 &lt; 0 é falso, 13 &gt; 20 é falso. Falso <code>or</code> falso dá falso: salta este bloco.` },
      { l: 4, n: H`<code>elif</code>: 13 &gt;= 10 é verdadeiro, entra.` },
      { l: 5, o: 'Aprovado\n', n: H`Só um dos blocos de uma cadeia if / elif / else é executado: o primeiro cuja condição é verdadeira.` },
      { l: 8, o: '6 6.5 1\n', n: H`<code>13 // 2</code> dá 6 (divisão inteira), <code>13 / 2</code> dá 6.5 (divisão normal) e <code>13 % 2</code> dá 1 (o resto).` },
    ],
  }],
  mistakes: [
    H`Esperar um inteiro de <code>/</code>. Em Python, <code>/</code> dá sempre um real; para a divisão inteira é <code>//</code>.`,
    H`Escrever <code>&amp;&amp;</code>, <code>||</code> ou <code>!</code> do C. Em Python é <code>and</code>, <code>or</code> e <code>not</code>.`,
    H`Escrever <code>else if</code> em vez de <code>elif</code>, ou esquecer os <code>:</code>.`,
    H`Escrever <code>true</code> em minúsculas: <em>NameError: name 'true' is not defined</em>.`,
    H`Usar <code>=</code> numa condição: <code>if x = 5:</code> dá <em>SyntaxError</em>. Para comparar é <code>==</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`print(7 / 2, 7 // 2)`, opts: ['3 3', '3.5 3', '3.5 3.5', '3 3.5'], ok: 1, mono: true, check: true,
      exp: H`<code>/</code> é a divisão normal (3.5) e <code>//</code> a divisão inteira (3). É ao contrário do que estavas habituado em C, onde <code>7 / 2</code> dava 3.` },
    { q: 'O que aparece no ecrã?', code: C`print(2 ** 3 * 2)`, opts: ['64', '16', '12', '8'], ok: 1, mono: true, check: true,
      exp: H`A potência vem primeiro: 2 ** 3 = 8, e depois 8 × 2 = 16. Seria 64 se fosse <code>2 ** (3 * 2)</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
x = 15
print(10 <= x <= 20)`, opts: ['True', 'False', '1', 'SyntaxError'], ok: 0, mono: true, check: true,
      exp: H`Em Python as comparações encadeiam-se como na matemática: é o mesmo que <code>10 &lt;= x and x &lt;= 20</code>. E o resultado é <code>True</code>, não 1 como em C.` },
    { q: 'O que aparece no ecrã?', code: C`
x = 7
if x > 5:
    print("A")
elif x > 3:
    print("B")
else:
    print("C")`, opts: ['A', 'AB', 'A\nB', 'B'], ok: 0, mono: true, check: true,
      exp: H`7 &gt; 5 é verdadeiro, por isso escreve A. Também é verdade que 7 &gt; 3, mas o <code>elif</code> só é testado quando as condições anteriores falharam.` },
    { q: 'O que aparece no ecrã? (esta é difícil)', code: C`print(-7 // 2)`, opts: ['-3', '-4', '-3.5', '3'], ok: 1, mono: true, check: true,
      exp: H`O <code>//</code> arredonda sempre para baixo: -3.5 fica -4. Em C, <code>-7 / 2</code> cortava as casas decimais e dava -3.` },
  ],
  exercises: [{
    title: 'Par ou ímpar',
    text: 'Lê um inteiro e diz se é par ou ímpar.',
    run: 'Numero: ⟦7⟧7 e impar\n',
    hint: H`Um número é par quando <code>n % 2 == 0</code>.`,
    solution: C`
n = int(input("Numero: "))
if n % 2 == 0:
    print(n, "e par")
else:
    print(n, "e impar")`,
  }, {
    title: 'Classificação',
    text: 'Lê uma nota (0 a 20) e mostra "Insuficiente" (menos de 10), "Suficiente" (10 a 13), "Bom" (14 a 16) ou "Muito bom" (17 a 20).',
    run: 'Nota: ⟦15⟧Bom\n',
    hint: H`Uma cadeia <code>if</code> / <code>elif</code> / <code>else</code>, começando pela nota mais baixa: <code>if nota &lt; 10</code>, <code>elif nota &lt;= 13</code>, ...`,
    solution: C`
nota = int(input("Nota: "))
if nota < 10:
    print("Insuficiente")
elif nota <= 13:
    print("Suficiente")
elif nota <= 16:
    print("Bom")
else:
    print("Muito bom")`,
  }],
});
