// ===== C# do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador (l, n, o, push, pop, d, u e x são como no C):
//   d: { Main: { idade: ['int', '19'] } }       uma variável de tipo de valor guarda o valor na pilha
//   d: { Main: { a: ['Aluno', '@o1'] } }         uma variável de tipo de referência guarda uma referência para o heap
//   obj: { o1: ['Aluno', { Nome: '"Ana"', Nota: '17' }] }   cria ou muda um objeto no heap
//        arrays e listas: ['int[]', ['12', '17']]; um struct guarda-se na própria variável: ['Ponto', { X: '1', Y: '2' }]
// O frame de topo chama-se Main (os programas usam top-level statements). Os textos (string) aparecem
// direto na variável, para não encher o heap: são de referência, mas nunca mudam por dentro.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Olá, C#',
  short: 'Console.WriteLine, top-level statements e texto com $"{...}"',
  body: H`
<p>O C# tem a cara do C (chavetas, <code>;</code>, <code>if</code>, <code>for</code>), mas vem com muito mais coisas feitas. O programa mais curto é uma linha:</p>
<pre class="snip"><code>Console.WriteLine("Ola!");</code></pre>
<ul>
<li>Não há <code>#include</code> nem <code>main</code> escrito à mão: as instruções escritas no topo do ficheiro (<em>top-level statements</em>) são o programa, e correm de cima para baixo.</li>
<li><code>Console.WriteLine</code> escreve e muda de linha; <code>Console.Write</code> escreve sem mudar.</li>
<li>Para pôr valores no meio do texto, usa <strong>interpolação</strong>: um <code>$</code> antes das aspas e as expressões entre chavetas, <code>$"{nome} tem {idade} anos"</code>. Não há <code>%d</code>.</li>
<li>Cada instrução acaba em <code>;</code>, como em C. Para correr: <code>dotnet run</code>, dentro da pasta do projeto (cria-se com <code>dotnet new console</code>).</li>
</ul>`,
  analogy: 'Se o C é uma cozinha onde fazes tudo à mão, o C# é a mesma cozinha com eletrodomésticos: as regras de segurança são as mesmas (tipos, chavetas, ponto e vírgula), mas muita coisa já vem feita.',
  examples: [{
    title: 'Escrever no ecrã',
    code: C`
Console.WriteLine("Ola, C#!");
string nome = "Rita";
int idade = 19;
Console.WriteLine($"{nome} tem {idade} anos");
Console.Write("sem mudar ");
Console.WriteLine("de linha");`,
    steps: [
      { l: 1, push: 'Main', o: 'Ola, C#!\n', n: H`O programa começa na primeira instrução. <code>WriteLine</code> escreve o texto e muda de linha.` },
      { l: 2, d: { Main: { nome: ['string', '"Rita"'] } }, n: H`Uma variável de texto: em C# há o tipo <code>string</code>, sem arrays de char nem <code>'\0'</code>.` },
      { l: 3, d: { Main: { idade: ['int', '19'] } }, n: H`Um <code>int</code>, como em C. Fica guardado na pilha (o painel "Pilha").` },
      { l: 4, o: 'Rita tem 19 anos\n', n: H`Com o <code>$</code> antes das aspas, cada <code>{...}</code> é trocado pelo valor lá dentro.` },
      { l: 5, o: 'sem mudar ', n: H`<code>Write</code> não muda de linha...` },
      { l: 6, o: 'de linha\n', n: '...por isso este texto continua na mesma linha.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>;</code>: <em>error CS1002: ; expected</em>.`,
    H`Esquecer o <code>$</code> antes das aspas: aparece literalmente <code>{nome}</code> no ecrã.`,
    H`Escrever <code>console.writeline</code>: o C# distingue maiúsculas de minúsculas, e os métodos começam por maiúscula.`,
    H`Usar plicas para texto: <code>'ola'</code> é erro; plicas são só para um <code>char</code>, como em C.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Console.Write("A");
Console.WriteLine("B");
Console.Write("C");`, opts: ['A\nB\nC', 'AB\nC', 'ABC', 'A B C'], ok: 1, mono: true, check: true,
      exp: H`Só o <code>WriteLine</code> muda de linha, e muda depois de escrever o "B".` },
    { q: 'O que aparece no ecrã? (esta é difícil)', code: C`Console.WriteLine(1 + 2 + "3" + 4 + 5);`, opts: ['12345', '15', '3345', '339'], ok: 2, mono: true, check: true,
      exp: H`Faz-se da esquerda para a direita. 1 + 2 são dois números: dá 3. Depois 3 + "3" já envolve texto, por isso junta: "33". A partir daí é tudo texto: "334", "3345".` },
    { q: 'O que aparece no ecrã?', code: C`
int x = 4;
Console.WriteLine($"x = {x * 2}");`, opts: ['x = 8', 'x = {x * 2}', 'x = 4 * 2', 'x = x * 2'], ok: 0, mono: true, check: true,
      exp: H`Dentro das chavetas pode ir qualquer expressão: <code>x * 2</code> é calculado e dá 8.` },
    { q: 'Num programa com top-level statements, onde começa a execução?', opts: ['Na primeira instrução do ficheiro', 'Na função main, que tens de escrever', 'Na última linha', 'Na primeira classe'], ok: 0,
      exp: 'As instruções soltas no topo do ficheiro são o programa: correm de cima para baixo. O compilador cria o Main por ti.' },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve um programa que mostre o teu nome numa linha e o teu curso na linha seguinte.',
    run: 'Nome: Joao\nCurso: Engenharia Informatica\n',
    hint: H`Dois <code>Console.WriteLine</code>.`,
    solution: C`
Console.WriteLine("Nome: Joao");
Console.WriteLine("Curso: Engenharia Informatica");`,
  }, {
    title: 'Contas',
    text: 'Cria as variáveis a = 8 e b = 3 e mostra a soma, a diferença e o produto, exatamente neste formato.',
    run: '8 + 3 = 11\n8 - 3 = 5\n8 * 3 = 24\n',
    hint: H`<code>Console.WriteLine($"{a} + {b} = {a + b}");</code>`,
    solution: C`
int a = 8;
int b = 3;
Console.WriteLine($"{a} + {b} = {a + b}");
Console.WriteLine($"{a} - {b} = {a - b}");
Console.WriteLine($"{a} * {b} = {a * b}");`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Tipos, variáveis e ler do teclado',
  short: 'int, double, bool, string, var, int.Parse e conversões',
  body: H`
<p>Tal como em C, cada variável tem um tipo fixo, e o compilador recusa misturas sem sentido.</p>
<table class="t">
<thead><tr><th>Tipo</th><th>Guarda</th><th>Exemplo</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td>inteiros</td><td><code>19</code></td></tr>
<tr><td><code>double</code></td><td>reais</td><td><code>14.5</code></td></tr>
<tr><td><code>bool</code></td><td>verdadeiro ou falso</td><td><code>true</code>, <code>false</code></td></tr>
<tr><td><code>char</code></td><td>um carácter</td><td><code>'A'</code></td></tr>
<tr><td><code>string</code></td><td>texto</td><td><code>"Ana"</code></td></tr>
</tbody>
</table>
<ul>
<li><code>var x = 5;</code> deixa o compilador descobrir o tipo (aqui, <code>int</code>). O tipo continua fixo: depois não podes guardar texto em <code>x</code>.</li>
<li><code>Console.ReadLine()</code> lê uma linha e devolve sempre um <code>string</code>. Para um número: <code>int.Parse(Console.ReadLine())</code>.</li>
<li>Inteiro a dividir por inteiro dá inteiro, como em C: <code>7 / 2</code> é 3. <code>(double)7 / 2</code> dá 3.5 e <code>(int)2.9</code> dá 2.</li>
<li>Guardar um <code>double</code> num <code>int</code> sem conversão é um <strong>erro de compilação</strong> (em C só dava um aviso).</li>
</ul>
<p>Atenção: num Windows em português, o C# escreve os reais com vírgula (<code>3,5</code>). Nos exemplos aparece o ponto, como nos compiladores online.</p>`,
  analogy: 'O compilador do C# é um porteiro mais rigoroso do que o do C: se a etiqueta da caixa diz int, não deixa entrar um 2.5, nem que seja "só desta vez".',
  examples: [{
    title: 'Perguntar e responder',
    code: C`
Console.Write("Nome? ");
string nome = Console.ReadLine();
Console.Write("Idade? ");
int idade = int.Parse(Console.ReadLine());
Console.WriteLine($"{nome} faz {idade + 1} anos para o ano.");`,
    steps: [
      { l: 1, push: 'Main', o: 'Nome? ', n: H`<code>Write</code>, para o cursor ficar à frente da pergunta.` },
      { l: 2, o: '⟦Rita⟧', d: { Main: { nome: ['string', '"Rita"'] } }, n: H`<code>ReadLine</code> espera que o utilizador escreva e carregue em Enter, e devolve o texto. Não há <code>&amp;</code> nem formatos como no scanf.` },
      { l: 3, o: 'Idade? ', n: 'Segunda pergunta.' },
      { l: 4, o: '⟦19⟧', d: { Main: { idade: ['int', '19'] } }, n: H`O <code>ReadLine</code> devolve o texto "19" e o <code>int.Parse</code> converte-o no número 19.` },
      { l: 5, o: 'Rita faz 20 anos para o ano.\n', n: H`<code>idade + 1</code> é feito dentro das chavetas.` },
    ],
  }, {
    title: 'Divisões e conversões',
    code: C`
int a = 7, b = 2;
int q = a / b;
double d = (double)a / b;
int corte = (int)2.9;
Console.WriteLine($"{q} {d} {corte}");`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { a: ['int', '7'], b: ['int', '2'] } }, n: 'Duas variáveis na mesma linha, como em C.' },
      { l: 2, d: { Main: { q: ['int', '3'] } }, n: H`<code>int / int</code> dá <code>int</code>: 3. É igual ao C.` },
      { l: 3, d: { Main: { d: ['double', '3.5'] } }, n: H`<code>(double)a</code> converte o 7 em 7.0 antes de dividir, e dá 3.5.` },
      { l: 4, d: { Main: { corte: ['int', '2'] } }, n: H`<code>(int)2.9</code> corta as casas decimais (não arredonda). Sem o <code>(int)</code>, era erro de compilação.` },
      { l: 5, o: '3 3.5 2\n', n: 'Num Windows em português, o 3.5 aparece como 3,5.' },
    ],
  }],
  mistakes: [
    H`Guardar um real num int: <em>error CS0266: Cannot implicitly convert type 'double' to 'int'</em>. Usa <code>(int)</code> se é mesmo isso que queres.`,
    H`Fazer contas com o resultado de <code>ReadLine</code> sem converter: é texto.`,
    H`Converter texto que não é número: <em>System.FormatException: The input string 'abc' was not in a correct format.</em>`,
    H`Usar uma variável sem lhe dar valor: <em>error CS0165: Use of unassigned local variable 'x'</em>. Em C dava lixo; em C# nem compila.`,
    H`Esperar 3.5 de <code>7 / 2</code>. Tal como em C, a divisão é inteira.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`Console.WriteLine(7 / 2 + " " + 7 / 2.0);`, opts: ['3 3.5', '3.5 3.5', '3 3', '3.5 3'], ok: 0, mono: true, check: true,
      exp: H`<code>7 / 2</code> é divisão inteira (3); <code>7 / 2.0</code> tem um real e dá 3.5. Tal como em C.` },
    { q: 'O que acontece com este programa?', code: C`
int x = 2.5;
Console.WriteLine(x);`, opts: ['2', '2.5', '3', "error CS0266: Cannot implicitly convert type 'double' to 'int'. An explicit conversion exists (are you missing a cast?)"], ok: 3, mono: true, check: true,
      exp: H`Em C, <code>int x = 2.5;</code> guardava 2. Em C# não compila: perder as casas decimais tem de ser pedido de propósito, com <code>(int)2.5</code>.` },
    { q: 'O que acontece com este programa?', code: C`
var x = 5;
x = "cinco";
Console.WriteLine(x);`, opts: ['cinco', '5', "error CS0029: Cannot implicitly convert type 'string' to 'int'", '5cinco'], ok: 2, mono: true, check: true,
      exp: H`<code>var</code> não quer dizer "qualquer tipo": o compilador vê o 5 e decide que <code>x</code> é <code>int</code>, para sempre. Ao contrário do Python, não se pode mudar.` },
    { q: 'O que aparece no ecrã?', code: C`
int n = int.Parse("12") + 1;
Console.WriteLine(n);`, opts: ['121', '13', '12', 'error CS0029'], ok: 1, mono: true, check: true,
      exp: H`<code>int.Parse("12")</code> dá o número 12, e 12 + 1 = 13. Sem o Parse, <code>"12" + 1</code> juntava texto e dava "121".` },
  ],
  exercises: [{
    title: 'Somar dois números',
    text: 'Pede dois inteiros ao utilizador e mostra a soma.',
    run: 'Primeiro: ⟦4⟧Segundo: ⟦9⟧Soma: 13\n',
    hint: H`<code>int a = int.Parse(Console.ReadLine());</code> depois de cada <code>Console.Write</code>.`,
    solution: C`
Console.Write("Primeiro: ");
int a = int.Parse(Console.ReadLine());
Console.Write("Segundo: ");
int b = int.Parse(Console.ReadLine());
Console.WriteLine($"Soma: {a + b}");`,
  }, {
    title: 'Média de três notas',
    text: 'Lê três notas inteiras (uma por linha) e mostra a média com 2 casas decimais. Atenção à divisão inteira.',
    run: 'Nota 1: ⟦12⟧Nota 2: ⟦15⟧Nota 3: ⟦14⟧Media: 13.67\n',
    hint: H`Divide por <code>3.0</code>. Para 2 casas: <code>$"Media: {media:F2}"</code>.`,
    solution: C`
Console.Write("Nota 1: ");
int a = int.Parse(Console.ReadLine());
Console.Write("Nota 2: ");
int b = int.Parse(Console.ReadLine());
Console.Write("Nota 3: ");
int c = int.Parse(Console.ReadLine());
double media = (a + b + c) / 3.0;
Console.WriteLine($"Media: {media:F2}");`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Decisões e ciclos: quase igual ao C',
  short: 'if, switch sem cair para o seguinte, for, while e foreach',
  body: H`
<p>Esta lição é curta porque já sabes quase tudo: <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>do-while</code>, <code>&amp;&amp;</code>, <code>||</code> e <code>!</code> escrevem-se como em C. As diferenças:</p>
<ul>
<li>As condições têm de ser <code>bool</code>. <code>if (x = 5)</code> e <code>if (1)</code> não compilam, o que acaba com o erro clássico do <code>=</code> no lugar do <code>==</code>.</li>
<li>No <code>switch</code>, cada <code>case</code> tem de acabar com <code>break</code> (ou <code>return</code>). Esquecer o break é erro de compilação, em vez de "cair" para o case seguinte.</li>
<li>Há <code>foreach</code>, que percorre todos os elementos de um array, lista ou texto: <code>foreach (char c in "ola")</code>.</li>
<li>Por convenção, em C# as chavetas abrem numa linha própria.</li>
</ul>`,
  analogy: 'É como mudar de carro com caixa manual para um com sensores: os pedais estão no mesmo sítio, mas agora o carro apita antes de bateres (o = num if, o break esquecido).',
  examples: [{
    title: 'Somar os pares',
    code: C`
int soma = 0;
for (int i = 1; i <= 4; i++)
{
    if (i % 2 == 0)
    {
        soma += i;
    }
}
Console.WriteLine($"Soma dos pares: {soma}");`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { soma: ['int', '0'] } }, n: 'O acumulador começa em 0.' },
      { l: 2, d: { Main: { i: ['int', '1'] } }, n: H`Igual ao C: cria <code>i = 1</code> e testa 1 &lt;= 4.` },
      { l: 4, n: H`1 % 2 == 0? Não: salta o bloco do if.` },
      { l: 2, u: { Main: { i: '2' } }, n: H`<code>i++</code>: 2. 2 &lt;= 4, continua.` },
      { l: 4, n: '2 % 2 == 0? Sim.' },
      { l: 6, u: { Main: { soma: '2' } }, n: 'soma = 0 + 2 = 2' },
      { l: 2, u: { Main: { i: '3' } }, n: 'i passa a 3.' },
      { l: 4, n: '3 é ímpar: salta.' },
      { l: 2, u: { Main: { i: '4' } }, n: 'i passa a 4.' },
      { l: 6, u: { Main: { soma: '6' } }, n: '4 é par: soma = 2 + 4 = 6.' },
      { l: 2, u: { Main: { i: '5' } }, n: H`i passa a 5. 5 &lt;= 4 é falso: o ciclo acaba.` },
      { l: 9, x: { Main: ['i'] }, o: 'Soma dos pares: 6\n', n: H`O <code>i</code> só existia dentro do for, como em C.` },
    ],
  }, {
    title: 'O switch obriga ao break',
    code: C`
int opcao = 2;
switch (opcao)
{
    case 1:
        Console.WriteLine("Somar");
        break;
    case 2:
        Console.WriteLine("Subtrair");
        break;
    default:
        Console.WriteLine("Opcao invalida");
        break;
}`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { opcao: ['int', '2'] } }, n: 'A opção escolhida.' },
      { l: 2, n: H`O <code>switch</code> salta para o case igual a <code>opcao</code>.` },
      { l: 9, o: 'Subtrair\n', n: 'Executa o case 2.' },
      { l: 10, n: H`O <code>break</code> sai do switch. Em C, esquecê-lo fazia correr também o case seguinte; em C# o programa nem compila sem ele.` },
    ],
  }],
  mistakes: [
    H`<code>if (x = 5)</code>: <em>error CS0029: Cannot implicitly convert type 'int' to 'bool'</em>. Para comparar é <code>==</code>.`,
    H`Esquecer o <code>break</code> num case: <em>error CS0163: Control cannot fall through from one case label</em>.`,
    H`Pôr <code>;</code> logo depois do <code>if (...)</code> ou do <code>for (...)</code>, tal como em C.`,
    H`Tentar mudar a variável do <code>foreach</code> (<code>c = 'x'</code>): não é permitido.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
for (int i = 0; i < 3; i++)
{
    Console.Write(i + " ");
}`, opts: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], ok: 0, mono: true, check: true,
      exp: 'Igual ao C: começa em 0 e pára quando i chega a 3.' },
    { q: 'O que acontece com este programa?', code: C`
int x = 0;
if (x = 5)
{
    Console.WriteLine("cinco");
}`, opts: ['cinco', 'Nada', "error CS0029: Cannot implicitly convert type 'int' to 'bool'", '5'], ok: 2, mono: true, check: true,
      exp: H`Em C isto compilava e era sempre verdadeiro. Em C# a condição tem de ser um <code>bool</code>, e <code>x = 5</code> dá um int: não compila.` },
    { q: 'O que acontece com este programa?', code: C`
int x = 1;
switch (x)
{
    case 1:
        Console.WriteLine("um");
    case 2:
        Console.WriteLine("dois");
        break;
}`, opts: ['um\ndois', 'um', "error CS0163: Control cannot fall through from one case label ('case 1:') to another", 'dois'], ok: 2, mono: true, check: true,
      exp: H`Em C, sem o break, escrevia "um" e "dois". Em C# não compila: cada case tem de acabar com <code>break</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
foreach (char c in "ola")
{
    Console.Write(c + "-");
}`, opts: ['o-l-a-', 'ola-', 'o-l-a', '-o-l-a'], ok: 0, mono: true, check: true,
      exp: H`O <code>foreach</code> dá cada letra do texto, uma de cada vez. Cada uma é seguida de um hífen, incluindo a última.` },
  ],
  exercises: [{
    title: 'Tabuada',
    text: 'Lê um número e mostra a tabuada dele, de 1 a 10.',
    run: 'Numero: ⟦7⟧' + Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}\n`).join(''),
    hint: H`Um <code>for</code> com i de 1 a 10 e <code>Console.WriteLine($"{n} x {i} = {n * i}");</code>`,
    solution: C`
Console.Write("Numero: ");
int n = int.Parse(Console.ReadLine());
for (int i = 1; i <= 10; i++)
{
    Console.WriteLine($"{n} x {i} = {n * i}");
}`,
  }, {
    title: 'Somar até aparecer um zero',
    text: 'Lê números até o utilizador escrever 0. No fim mostra a soma e quantos números foram lidos (sem contar o 0).',
    run: 'Numero (0 termina): ⟦5⟧Numero (0 termina): ⟦3⟧Numero (0 termina): ⟦10⟧Numero (0 termina): ⟦0⟧Soma: 18\nLidos: 3\n',
    hint: H`Um <code>do { ... } while (n != 0);</code>, como no C, com dois acumuladores.`,
    solution: C`
int n, soma = 0, conta = 0;
do
{
    Console.Write("Numero (0 termina): ");
    n = int.Parse(Console.ReadLine());
    if (n != 0)
    {
        soma += n;
        conta++;
    }
} while (n != 0);
Console.WriteLine($"Soma: {soma}");
Console.WriteLine($"Lidos: {conta}");`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Arrays e List<T>: o primeiro contacto com o heap',
  short: 'new int[3], Length, duas variáveis para o mesmo array, e List<T>',
  body: H`
<p>Em C, um array vivia dentro da função. Em C# vive noutra zona da memória, o <strong>heap</strong>, e a variável guarda só uma <strong>referência</strong> para ele (no visualizador: <code>→ #1</code>). Parece um pormenor, mas muda o que acontece numa atribuição:</p>
<ul>
<li><code>int[] v = { 12, 17, 9 };</code> ou <code>int[] v = new int[3];</code> (fica com zeros, nunca com lixo). <code>v.Length</code> dá o tamanho.</li>
<li><code>int[] w = v;</code> <strong>não copia o array</strong>: põe <code>w</code> a apontar para o mesmo. Mudar <code>w[0]</code> muda o que <code>v</code> vê. (Em C, <code>w = v</code> nem compilava com arrays.)</li>
<li>Sair dos limites não estraga memória como em C: o programa pára com <em>IndexOutOfRangeException</em>.</li>
</ul>
<p>Um array tem tamanho fixo. Quando não sabes quantos elementos vais ter, usa uma <strong>lista</strong>: <code>List&lt;int&gt; notas = new List&lt;int&gt;();</code>. O <code>&lt;int&gt;</code> diz o tipo dos elementos. Tem <code>Add</code>, <code>Insert</code>, <code>Remove</code>, <code>RemoveAt</code>, <code>Count</code>, <code>Contains</code> e acede-se com <code>notas[0]</code>, como num array.</p>`,
  analogy: 'O array é um armário num armazém (o heap). A variável não é o armário: é um papel com o número do armário. Copiar o papel (w = v) dá-te outro papel com o mesmo número, não outro armário.',
  examples: [{
    title: 'Duas variáveis, um array',
    code: C`
int[] notas = { 12, 17, 9 };
int[] outra = notas;
outra[2] = 10;
Console.WriteLine(notas[2]);
Console.WriteLine(notas.Length);`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['int[]', ['12', '17', '9']] }, d: { Main: { notas: ['int[]', '@o1'] } }, n: H`O array é criado no heap (objeto #1). Na pilha, <code>notas</code> guarda só a referência para ele.` },
      { l: 2, d: { Main: { outra: ['int[]', '@o1'] } }, n: H`<code>outra = notas</code> copia a <strong>referência</strong>, não o array. As duas variáveis apontam para o #1.` },
      { l: 3, obj: { o1: ['int[]', ['12', '17', '10']] }, n: H`Muda o elemento de índice 2 do único array que existe.` },
      { l: 4, o: '10\n', n: H`Por isso <code>notas[2]</code> também dá 10.` },
      { l: 5, o: '3\n', n: H`<code>Length</code> dá o tamanho, sem teres de o guardar à parte como em C.` },
    ],
  }, {
    title: 'Uma lista que cresce',
    code: C`
List<string> fila = new List<string>();
fila.Add("Ana");
fila.Add("Rui");
fila.Insert(0, "Ines");
fila.Remove("Ana");
Console.WriteLine($"{fila.Count}: {string.Join(", ", fila)}");`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['List<string>', []] }, d: { Main: { fila: ['List<string>', '@o1'] } }, n: H`Uma lista vazia, no heap. O <code>&lt;string&gt;</code> diz que só leva texto.` },
      { l: 2, obj: { o1: ['List<string>', ['"Ana"']] }, n: H`<code>Add</code> acrescenta no fim.` },
      { l: 3, obj: { o1: ['List<string>', ['"Ana"', '"Rui"']] }, n: 'A lista cresce: um array não podia.' },
      { l: 4, obj: { o1: ['List<string>', ['"Ines"', '"Ana"', '"Rui"']] }, n: H`<code>Insert(0, ...)</code> põe no início e empurra os outros.` },
      { l: 5, obj: { o1: ['List<string>', ['"Ines"', '"Rui"']] }, n: H`<code>Remove</code> tira a primeira "Ana" que encontrar.` },
      { l: 6, o: '2: Ines, Rui\n', n: H`<code>Count</code> é o tamanho da lista e <code>string.Join</code> junta os elementos com ", " no meio.` },
    ],
  }],
  mistakes: [
    H`Achar que <code>int[] b = a;</code> faz uma cópia. Para copiar: <code>int[] b = (int[])a.Clone();</code>.`,
    H`Sair dos limites: <em>System.IndexOutOfRangeException: Index was outside the bounds of the array.</em> Numa lista é <em>ArgumentOutOfRangeException</em>.`,
    H`Usar <code>Length</code> numa lista ou <code>Count</code> num array: é <code>Length</code> nos arrays e <code>Count</code> nas listas.`,
    H`Escrever <code>Console.WriteLine(lista)</code> à espera dos elementos: aparece o nome do tipo. Usa <code>string.Join(", ", lista)</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
int[] v = new int[3];
v[1] = 5;
Console.WriteLine(string.Join(" ", v));`, opts: ['0 5 0', '5 0 0', '? 5 ?', '0 5'], ok: 0, mono: true, check: true,
      exp: H`<code>new int[3]</code> cria 3 elementos a zero (em C teriam lixo). Só o de índice 1 muda.` },
    { q: 'O que aparece no ecrã?', code: C`
int[] a = { 1, 2, 3 };
int[] b = a;
b[0] = 99;
Console.WriteLine(a[0]);`, opts: ['1', '99', '0', 'error CS0029'], ok: 1, mono: true, check: true,
      exp: H`<code>a</code> e <code>b</code> apontam para o mesmo array no heap. Mudar através de um vê-se pelo outro.` },
    { q: 'O que aparece no ecrã?', code: C`
var l = new List<int> { 3, 1, 2 };
l.Add(5);
l.RemoveAt(0);
Console.WriteLine(l.Count + " " + l[0]);`, opts: ['3 1', '4 3', '3 3', '4 1'], ok: 0, mono: true, check: true,
      exp: H`Depois do Add a lista é 3, 1, 2, 5. <code>RemoveAt(0)</code> tira o elemento da <strong>posição</strong> 0 (o 3): fica 1, 2, 5, com 3 elementos.` },
    { q: 'O que aparece no ecrã?', code: C`
int[] v = { 1, 2 };
Console.WriteLine(v[2]);`, opts: ['0', '2', 'Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.', 'Um valor qualquer (lixo)'], ok: 2, mono: true, check: true,
      exp: 'Em C lias memória que não era tua. Em C#, o acesso fora dos limites é apanhado e o programa pára com uma exceção.' },
  ],
  exercises: [{
    title: 'O maior',
    text: 'Dado o array { 4, 8, 15, 16, 23, 42, 7 }, mostra o maior valor e a posição onde está.',
    run: 'Maior: 42 na posicao 5\n',
    hint: H`Como em C: começa com o primeiro e percorre com um <code>for</code> até <code>v.Length</code>, guardando o maior e o índice.`,
    solution: C`
int[] v = { 4, 8, 15, 16, 23, 42, 7 };
int maior = v[0];
int posicao = 0;
for (int i = 1; i < v.Length; i++)
{
    if (v[i] > maior)
    {
        maior = v[i];
        posicao = i;
    }
}
Console.WriteLine($"Maior: {maior} na posicao {posicao}");`,
  }, {
    title: 'Notas até zero',
    text: 'Lê notas para uma List<int> até aparecer um 0. Mostra quantas notas foram lidas e quantas são positivas (10 ou mais).',
    run: 'Nota: ⟦12⟧Nota: ⟦8⟧Nota: ⟦15⟧Nota: ⟦0⟧Lidas: 3\nPositivas: 2\n',
    hint: H`Um ciclo que lê e faz <code>notas.Add(n)</code> enquanto n não for 0. Depois um <code>foreach</code> para contar as positivas.`,
    solution: C`
List<int> notas = new List<int>();
Console.Write("Nota: ");
int n = int.Parse(Console.ReadLine());
while (n != 0)
{
    notas.Add(n);
    Console.Write("Nota: ");
    n = int.Parse(Console.ReadLine());
}
int positivas = 0;
foreach (int nota in notas)
{
    if (nota >= 10)
    {
        positivas++;
    }
}
Console.WriteLine($"Lidas: {notas.Count}");
Console.WriteLine($"Positivas: {positivas}");`,
  }],
});
