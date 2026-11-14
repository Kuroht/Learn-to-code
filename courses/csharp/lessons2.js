// ===== C# do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Métodos',
  short: 'parâmetros por valor, arrays que mudam, e ref',
  body: H`
<p>Um método é a função do C: <code>static int Quadrado(int x) { return x * x; }</code>. Num programa com top-level statements, escreve-se <strong>depois</strong> das instruções, e pode ser chamado antes de aparecer no ficheiro.</p>
<ul>
<li>Os parâmetros de <strong>tipos de valor</strong> (<code>int</code>, <code>double</code>, <code>bool</code>...) recebem uma <strong>cópia</strong>, como em C. Mudar o parâmetro não muda a variável de quem chamou.</li>
<li>Num array (ou objeto), o que se copia é a <strong>referência</strong>: o método recebe uma seta para o mesmo array, e se mudar um elemento a mudança vê-se fora.</li>
<li>Para um método mudar um <code>int</code> de quem chama (o que em C fazias com <code>int *</code> e <code>&amp;</code>), usa-se <code>ref</code> nos dois lados: <code>static void Dobra(ref int x)</code> e <code>Dobra(ref a);</code>.</li>
</ul>`,
  analogy: 'Dar um int a um método é dar uma fotocópia de um número. Dar um array é dar o número do armário: o colega não leva o armário, mas pode abrir o teu e mexer lá dentro. O ref é dar-lhe a chave da tua própria gaveta.',
  examples: [{
    title: 'Um método que devolve um valor',
    code: C`
int n = 4;
int q = Quadrado(n);
Console.WriteLine($"{n} {q}");

static int Quadrado(int x)
{
    int r = x * x;
    return r;
}`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { n: ['int', '4'] } }, n: 'Começa pelas instruções do topo.' },
      { l: 2, n: H`Chama <code>Quadrado(n)</code>. O Main fica em pausa.` },
      { l: 5, push: 'Quadrado', d: { Quadrado: { x: ['int', '4'] } }, n: H`O método ganha o seu frame na pilha. O parâmetro <code>x</code> recebe uma <strong>cópia</strong> do valor de n.` },
      { l: 7, d: { Quadrado: { r: ['int', '16'] } }, n: 'r = 4 × 4 = 16' },
      { l: 8, n: H`<code>return</code> devolve 16.` },
      { l: 2, pop: true, d: { Main: { q: ['int', '16'] } }, n: 'O frame do método desaparece e o 16 fica em q.' },
      { l: 3, o: '4 16\n', n: 'Igual ao que farias em C.' },
    ],
  }, {
    title: 'Cópia, referência e ref',
    code: C`
int a = 5;
int[] v = { 5 };
Muda(a, v);
Console.WriteLine($"{a} {v[0]}");
Dobra(ref a);
Console.WriteLine(a);

static void Muda(int x, int[] arr)
{
    x = 100;
    arr[0] = 100;
}

static void Dobra(ref int x)
{
    x = x * 2;
}`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { a: ['int', '5'] } }, n: 'Um int, na pilha.' },
      { l: 2, obj: { o1: ['int[]', ['5']] }, d: { Main: { v: ['int[]', '@o1'] } }, n: 'Um array, no heap, com a referência na pilha.' },
      { l: 8, push: 'Muda', d: { Muda: { x: ['int', '5'], arr: ['int[]', '@o1'] } }, n: H`Na chamada, <code>x</code> recebe uma cópia do 5 e <code>arr</code> uma cópia da <strong>referência</strong>: aponta para o mesmo array #1.` },
      { l: 10, u: { Muda: { x: '100' } }, n: H`Muda só a cópia. O <code>a</code> do Main fica com 5.` },
      { l: 11, obj: { o1: ['int[]', ['100']] }, n: 'Muda o elemento do array #1, que é o mesmo do Main.' },
      { l: 3, pop: true, n: 'O método acaba.' },
      { l: 4, o: '5 100\n', n: 'O int não mudou, o array sim.' },
      { l: 14, push: 'Dobra', d: { Dobra: { x: ['ref int', '→ a do Main'] } }, n: H`Com <code>ref</code>, o <code>x</code> não é uma cópia: é outro nome para a própria variável <code>a</code> do Main. É o que em C fazias com um apontador.` },
      { l: 16, u: { Main: { a: '10' } }, n: H`Mudar <code>x</code> muda o <code>a</code> do Main.` },
      { l: 5, pop: true, n: 'O método acaba.' },
      { l: 6, o: '10\n', n: H`O <code>a</code> passou a 10.` },
    ],
  }],
  mistakes: [
    H`Esperar que um método mude um <code>int</code> recebido sem <code>ref</code>. Ele só muda uma cópia.`,
    H`Esquecer o <code>ref</code> na chamada: <code>Dobra(a)</code> não compila se o método tem <code>ref int</code>.`,
    H`Esquecer o <code>return</code> num método que não é <code>void</code>: <em>error CS0161: not all code paths return a value</em>.`,
    H`Escrever o método no meio das instruções do topo. Os métodos e classes vão depois de todas as instruções.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Console.WriteLine(Dobro(Dobro(3)));

static int Dobro(int n)
{
    return n * 2;
}`, opts: ['6', '9', '12', '3'], ok: 2, mono: true, check: true,
      exp: 'Começa por dentro: Dobro(3) = 6, depois Dobro(6) = 12.' },
    { q: 'O que aparece no ecrã?', code: C`
int a = 1;
F(a);
Console.WriteLine(a);

static void F(int x)
{
    x = x + 1;
}`, opts: ['1', '2', '0', 'error CS0165'], ok: 0, mono: true, check: true,
      exp: H`Um <code>int</code> é passado por cópia, como em C. O F muda a cópia; o <code>a</code> fica com 1.` },
    { q: 'O que aparece no ecrã?', code: C`
int[] a = { 1, 2 };
F(a);
Console.WriteLine(a[0]);

static void F(int[] v)
{
    v[0] = 9;
}`, opts: ['1', '9', '2', '0'], ok: 1, mono: true, check: true,
      exp: H`O array não é copiado: o F recebe uma referência para o mesmo array e muda-lhe o elemento 0.` },
    { q: 'O que aparece no ecrã?', code: C`
int a = 1;
F(ref a);
Console.WriteLine(a);

static void F(ref int x)
{
    x = 7;
}`, opts: ['1', '7', '8', 'error CS1620'], ok: 1, mono: true, check: true,
      exp: H`Com <code>ref</code>, <code>x</code> é outro nome para o próprio <code>a</code>, por isso <code>x = 7</code> muda o a.` },
  ],
  exercises: [{
    title: 'Método EhPar',
    text: 'Escreve um método static bool EhPar(int n) que devolve true se n for par. Usa-o para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`O corpo pode ser só <code>return n % 2 == 0;</code>.`,
    solution: C`
for (int i = 1; i <= 4; i++)
{
    if (EhPar(i))
    {
        Console.WriteLine($"{i}: par");
    }
    else
    {
        Console.WriteLine($"{i}: impar");
    }
}

static bool EhPar(int n)
{
    return n % 2 == 0;
}`,
  }, {
    title: 'Método Media',
    text: 'Escreve um método static double Media(int[] v) que devolve a média dos elementos. Mostra a média de { 12, 15, 14 } com 2 casas decimais.',
    run: 'Media: 13.67\n',
    hint: H`Soma tudo num ciclo e devolve <code>(double)soma / v.Length</code>.`,
    solution: C`
int[] notas = { 12, 15, 14 };
Console.WriteLine($"Media: {Media(notas):F2}");

static double Media(int[] v)
{
    int soma = 0;
    foreach (int x in v)
    {
        soma += x;
    }
    return (double)soma / v.Length;
}`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Classes e objetos',
  short: 'uma classe é o molde, new cria um objeto no heap',
  body: H`
<p>Em C juntavas dados num <code>struct</code>. Em C# usa-se sobretudo uma <strong>classe</strong>, que junta os dados (<strong>campos</strong>) e o que se pode fazer com eles (<strong>métodos</strong>).</p>
<pre class="snip"><code>class Aluno
{
    public string Nome;
    public int Nota;
}</code></pre>
<ul>
<li>A classe é só o <strong>molde</strong>. Para ter um aluno a sério, cria-se um <strong>objeto</strong> com <code>new</code>: <code>Aluno a = new Aluno();</code>.</li>
<li>O objeto vive no <strong>heap</strong>; a variável <code>a</code>, na pilha, guarda a referência para ele.</li>
<li>Os campos começam com um valor por omissão: 0 nos números, <code>false</code> nos bool, <code>null</code> nos textos e objetos. Nunca há lixo.</li>
<li>Um método da classe trabalha sobre o objeto em que é chamado: em <code>c.Depositar(50)</code>, lá dentro <code>Saldo</code> é o saldo do objeto <code>c</code> (que se chama <code>this</code>).</li>
<li><code>public</code> quer dizer que o campo ou método pode ser usado fora da classe.</li>
</ul>`,
  analogy: 'A classe é a planta de uma casa; os objetos são as casas construídas a partir dela. Todas têm as mesmas divisões, mas cada uma tem os seus móveis. A variável é a morada escrita num papel.',
  examples: [{
    title: 'Dois alunos, um molde',
    code: C`
Aluno a = new Aluno();
a.Nome = "Ana";
a.Nota = 17;
Aluno b = new Aluno();
b.Nome = "Rui";
Console.WriteLine($"{a.Nome} {a.Nota} / {b.Nome} {b.Nota}");

class Aluno
{
    public string Nome;
    public int Nota;
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Aluno', { Nome: 'null', Nota: '0' }] }, d: { Main: { a: ['Aluno', '@o1'] } }, n: H`<code>new Aluno()</code> cria um objeto no heap a partir do molde (a classe, no fim do ficheiro). Os campos começam com null e 0. A variável <code>a</code> guarda a referência.` },
      { l: 2, obj: { o1: ['Aluno', { Nome: '"Ana"', Nota: '0' }] }, n: H`<code>a.Nome</code>: segue a referência até ao objeto e muda o campo Nome.` },
      { l: 3, obj: { o1: ['Aluno', { Nome: '"Ana"', Nota: '17' }] }, n: 'O mesmo para a nota.' },
      { l: 4, obj: { o2: ['Aluno', { Nome: 'null', Nota: '0' }] }, d: { Main: { b: ['Aluno', '@o2'] } }, n: H`Outro <code>new</code>, outro objeto (#2), com os seus próprios campos.` },
      { l: 5, obj: { o2: ['Aluno', { Nome: '"Rui"', Nota: '0' }] }, n: H`Só o Nome do #2 muda. A nota do Rui fica 0.` },
      { l: 6, o: 'Ana 17 / Rui 0\n', n: 'Cada objeto tem os seus valores.' },
    ],
  }, {
    title: 'Um método que muda o objeto',
    code: C`
Conta c = new Conta();
c.Depositar(50);
c.Depositar(20);
Console.WriteLine(c.Saldo);

class Conta
{
    public int Saldo;

    public void Depositar(int valor)
    {
        Saldo = Saldo + valor;
    }
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Conta', { Saldo: '0' }] }, d: { Main: { c: ['Conta', '@o1'] } }, n: 'Uma conta nova, com saldo 0.' },
      { l: 10, push: 'Depositar', d: { Depositar: { this: ['Conta', '@o1'], valor: ['int', '50'] } }, n: H`Chamar <code>c.Depositar(50)</code> abre um frame com o parâmetro <code>valor</code> e com <code>this</code>, a referência para o objeto em que o método foi chamado.` },
      { l: 12, obj: { o1: ['Conta', { Saldo: '50' }] }, n: H`<code>Saldo</code> aqui quer dizer <code>this.Saldo</code>: o saldo do objeto #1.` },
      { l: 2, pop: true, n: 'O método acaba; a mudança ficou no objeto.' },
      { l: 10, push: 'Depositar', d: { Depositar: { this: ['Conta', '@o1'], valor: ['int', '20'] } }, n: 'Segunda chamada, no mesmo objeto.' },
      { l: 12, obj: { o1: ['Conta', { Saldo: '70' }] }, n: 'Saldo = 50 + 20 = 70' },
      { l: 3, pop: true, n: 'Acaba.' },
      { l: 4, o: '70\n', n: 'O objeto guardou o saldo entre as duas chamadas.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>new</code>: <code>Aluno a; a.Nome = "Ana";</code> dá <em>error CS0165: Use of unassigned local variable 'a'</em>.`,
    H`Esquecer o <code>public</code> num campo: <em>error CS0122: 'Aluno.Nota' is inaccessible due to its protection level</em>.`,
    H`Pôr a classe antes das instruções do topo. Com top-level statements, as classes vão no fim do ficheiro.`,
    H`Confundir a classe com o objeto: <code>Aluno.Nome = "Ana"</code> não faz sentido; é <code>a.Nome</code>, o nome deste aluno.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Aluno a = new Aluno();
a.Nota = 12;
Console.WriteLine(a.Nota + 1);

class Aluno
{
    public int Nota;
}`, opts: ['12', '13', '1', '121'], ok: 1, mono: true, check: true,
      exp: 'a.Nota é 12, e 12 + 1 = 13. A soma é feita com números, não com texto.' },
    { q: 'O que aparece no ecrã?', code: C`
Aluno a = new Aluno();
Console.WriteLine(a.Nota);

class Aluno
{
    public int Nota;
}`, opts: ['0', 'Um valor qualquer (lixo)', 'null', 'error CS0165'], ok: 0, mono: true, check: true,
      exp: 'Os campos de um objeto começam sempre com o valor por omissão: 0 para um int. Ao contrário das variáveis locais do C, nunca há lixo.' },
    { q: 'O que aparece no ecrã?', code: C`
Contador c = new Contador();
c.Mais();
c.Mais();
c.Mais();
Console.WriteLine(c.Valor);

class Contador
{
    public int Valor;

    public void Mais()
    {
        Valor++;
    }
}`, opts: ['0', '1', '3', 'error CS0120'], ok: 2, mono: true, check: true,
      exp: H`As três chamadas trabalham no mesmo objeto, e cada uma soma 1 ao seu <code>Valor</code>.` },
    { q: 'Qual é a diferença entre uma classe e um objeto?', opts: ['Nenhuma, são duas palavras para a mesma coisa', 'A classe é o molde; um objeto é uma coisa criada a partir dele com new', 'O objeto é o molde; a classe é criada com new', 'A classe guarda os dados e o objeto os métodos'], ok: 1,
      exp: H`A classe diz que campos e métodos existem. Cada <code>new</code> cria um objeto novo, com os seus próprios valores.` },
  ],
  exercises: [{
    title: 'Retângulo',
    text: 'Cria a classe Retangulo com os campos Largura e Altura e um método Area() que devolve a área. Cria um retângulo 3 × 4 e mostra a área.',
    run: 'Area: 12\n',
    hint: H`<code>public int Area() { return Largura * Altura; }</code> dentro da classe.`,
    solution: C`
Retangulo r = new Retangulo();
r.Largura = 3;
r.Altura = 4;
Console.WriteLine($"Area: {r.Area()}");

class Retangulo
{
    public int Largura;
    public int Altura;

    public int Area()
    {
        return Largura * Altura;
    }
}`,
  }, {
    title: 'O livro maior',
    text: 'Cria a classe Livro com Titulo e Paginas. Cria dois livros, "Os Maias" com 500 páginas e "Mensagem" com 100, e mostra o título do que tem mais páginas.',
    run: 'Os Maias tem mais paginas\n',
    hint: H`Compara <code>l1.Paginas &gt; l2.Paginas</code> com um if.`,
    solution: C`
Livro l1 = new Livro();
l1.Titulo = "Os Maias";
l1.Paginas = 500;
Livro l2 = new Livro();
l2.Titulo = "Mensagem";
l2.Paginas = 100;
if (l1.Paginas > l2.Paginas)
{
    Console.WriteLine($"{l1.Titulo} tem mais paginas");
}
else
{
    Console.WriteLine($"{l2.Titulo} tem mais paginas");
}

class Livro
{
    public string Titulo;
    public int Paginas;
}`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Referências e null',
  short: 'duas variáveis para o mesmo objeto, == entre objetos, e a NullReferenceException',
  body: H`
<p>Como o objeto vive no heap e a variável só guarda a referência, <code>Aluno b = a;</code> <strong>não cria um aluno novo</strong>: põe <code>b</code> a apontar para o mesmo objeto. Mudar <code>b.Nota</code> muda o que <code>a</code> vê.</p>
<ul>
<li>Já <code>b = new Aluno();</code> põe o <code>b</code> a apontar para outro objeto, e o <code>a</code> não é afetado.</li>
<li>Entre objetos de uma classe, <code>==</code> compara as <strong>referências</strong> ("é o mesmo objeto?"), não o conteúdo. Dois alunos criados em separado, com o mesmo nome, não são <code>==</code>.</li>
<li>Passar um objeto a um método passa a referência: o método pode mudar os campos do objeto original.</li>
<li><code>null</code> quer dizer "não aponta para nenhum objeto". Usar um campo ou método através de <code>null</code> dá <em>NullReferenceException</em>, um dos erros mais comuns em C#.</li>
</ul>
<p>Lembras-te dos apontadores do C? Uma referência é parecida, mas mais segura: não há aritmética, não há moradas inventadas, e um acesso a <code>null</code> é apanhado em vez de rebentar com o programa.</p>`,
  analogy: 'A variável é uma trela e o objeto é o cão. b = a dá uma segunda trela para o mesmo cão. b = new Aluno() é ir buscar outro cão para a trela b. null é uma trela sem cão: se puxares, não vem nada.',
  examples: [{
    title: 'Duas variáveis, um objeto',
    code: C`
Aluno a = new Aluno();
a.Nota = 12;
Aluno b = a;
b.Nota = 20;
Console.WriteLine(a.Nota);
b = new Aluno();
b.Nota = 5;
Console.WriteLine($"{a.Nota} {b.Nota}");

class Aluno
{
    public int Nota;
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Aluno', { Nota: '0' }] }, d: { Main: { a: ['Aluno', '@o1'] } }, n: 'Um aluno no heap.' },
      { l: 2, obj: { o1: ['Aluno', { Nota: '12' }] }, n: 'Nota 12.' },
      { l: 3, d: { Main: { b: ['Aluno', '@o1'] } }, n: H`<code>b = a</code> copia a <strong>referência</strong>: <code>a</code> e <code>b</code> apontam para o mesmo objeto #1. Não há nenhum aluno novo.` },
      { l: 4, obj: { o1: ['Aluno', { Nota: '20' }] }, n: H`Muda a nota do #1 através de <code>b</code>...` },
      { l: 5, o: '20\n', n: H`...e o <code>a</code> vê a mudança, porque é o mesmo objeto.` },
      { l: 6, obj: { o2: ['Aluno', { Nota: '0' }] }, u: { Main: { b: '@o2' } }, n: H`<code>b = new Aluno()</code> cria outro objeto e muda só para onde o <code>b</code> aponta.` },
      { l: 7, obj: { o2: ['Aluno', { Nota: '5' }] }, n: 'Agora mudar b não mexe no objeto do a.' },
      { l: 8, o: '20 5\n', n: 'Dois objetos, cada um com a sua nota.' },
    ],
  }, {
    title: 'null e a NullReferenceException',
    code: C`
Aluno a = new Aluno();
Aluno b = null;
Console.WriteLine(a == b);
b = a;
Console.WriteLine(a == b);
a = null;
Console.WriteLine(b.Nota);
Console.WriteLine(a.Nota);

class Aluno
{
    public int Nota = 10;
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Aluno', { Nota: '10' }] }, d: { Main: { a: ['Aluno', '@o1'] } }, n: H`O <code>= 10</code> na classe dá um valor inicial ao campo.` },
      { l: 2, d: { Main: { b: ['Aluno', 'null'] } }, n: H`<code>b</code> não aponta para nenhum objeto.` },
      { l: 3, o: 'False\n', n: H`<code>==</code> pergunta se apontam para o mesmo objeto: não.` },
      { l: 4, u: { Main: { b: '@o1' } }, n: 'Agora b aponta para o #1.' },
      { l: 5, o: 'True\n', n: 'É o mesmo objeto.' },
      { l: 6, u: { Main: { a: 'null' } }, n: H`<code>a = null</code> só apaga a seta do <code>a</code>. O objeto continua lá, porque o <code>b</code> ainda aponta para ele.` },
      { l: 7, o: '10\n', n: 'Através do b ainda se chega ao objeto.' },
      { l: 8, o: 'Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.\n', n: H`Através do <code>a</code> não há objeto nenhum. O programa pára com a NullReferenceException.` },
    ],
  }],
  mistakes: [
    H`Fazer <code>Aluno copia = original;</code> a pensar que tem uma cópia. Tem uma segunda referência para o mesmo objeto.`,
    H`Comparar objetos com <code>==</code> para saber se têm os mesmos dados. Compara os campos (<code>a.Nome == b.Nome</code>).`,
    H`Usar um objeto que ficou a <code>null</code>: <em>System.NullReferenceException: Object reference not set to an instance of an object.</em> Confirma com <code>if (a != null)</code>.`,
    H`Esquecer que um método que recebe um objeto pode mudar-lhe os campos.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Ponto p = new Ponto();
Ponto q = p;
q.X = 7;
Console.WriteLine(p.X);

class Ponto
{
    public int X;
}`, opts: ['0', '7', 'null', 'error CS0165'], ok: 1, mono: true, check: true,
      exp: H`<code>q = p</code> copia a referência; os dois apontam para o mesmo objeto, por isso p.X também é 7.` },
    { q: 'O que aparece no ecrã?', code: C`
Aluno a = new Aluno();
a.Nome = "Ana";
Aluno b = new Aluno();
b.Nome = "Ana";
Console.WriteLine(a == b);

class Aluno
{
    public string Nome;
}`, opts: ['True', 'False', 'Ana', 'error CS0019'], ok: 1, mono: true, check: true,
      exp: H`São dois objetos diferentes (dois <code>new</code>), mesmo com o mesmo nome. Entre objetos de uma classe, <code>==</code> compara as referências.` },
    { q: 'O que aparece no ecrã?', code: C`
Aluno a = new Aluno();
Aumenta(a);
Console.WriteLine(a.Nota);

static void Aumenta(Aluno x)
{
    x.Nota = x.Nota + 5;
}

class Aluno
{
    public int Nota = 10;
}`, opts: ['10', '15', '5', '0'], ok: 1, mono: true, check: true,
      exp: H`O método recebe uma cópia da referência, que aponta para o mesmo objeto. Ao mudar <code>x.Nota</code>, muda o aluno original.` },
    { q: 'O que aparece no ecrã?', code: C`
Aluno a = null;
Console.WriteLine(a.Nota);

class Aluno
{
    public int Nota;
}`, opts: ['0', 'null', 'Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.', "error CS0165: Use of unassigned local variable 'a'"], ok: 2, mono: true, check: true,
      exp: H`A variável tem valor (<code>null</code>), por isso compila. Mas a correr não há objeto onde ir buscar a nota, e dá NullReferenceException.` },
  ],
  exercises: [{
    title: 'Bónus',
    text: 'Escreve um método static void DarBonus(Aluno a, int bonus) que soma o bónus à nota do aluno. Cria um aluno com nota 12, dá-lhe um bónus de 3 e mostra a nota.',
    run: 'Nota: 15\n',
    hint: 'O método recebe a referência para o aluno, por isso pode mudar-lhe a nota diretamente.',
    solution: C`
Aluno a = new Aluno();
a.Nota = 12;
DarBonus(a, 3);
Console.WriteLine($"Nota: {a.Nota}");

static void DarBonus(Aluno a, int bonus)
{
    a.Nota = a.Nota + bonus;
}

class Aluno
{
    public int Nota;
}`,
  }, {
    title: 'Trocar as setas',
    text: 'Cria dois alunos, Ana (em a) e Rui (em b). Troca as variáveis a e b (sem criar alunos novos nem mudar os nomes) e mostra-as.',
    run: 'a: Rui, b: Ana\n',
    hint: H`Como no C: uma variável auxiliar <code>Aluno aux = a;</code>. Só as referências trocam; os objetos ficam iguais.`,
    solution: C`
Aluno a = new Aluno();
a.Nome = "Ana";
Aluno b = new Aluno();
b.Nome = "Rui";
Aluno aux = a;
a = b;
b = aux;
Console.WriteLine($"a: {a.Nome}, b: {b.Nome}");

class Aluno
{
    public string Nome;
}`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Construtores e propriedades',
  short: 'criar objetos já preenchidos, private, get e set',
  body: H`
<p>Preencher um objeto campo a campo, depois do <code>new</code>, é cansativo e fácil de esquecer. Um <strong>construtor</strong> é um método especial, com o nome da classe e sem tipo de retorno, que corre no <code>new</code>:</p>
<pre class="snip"><code>public Aluno(string nome, int nota)
{
    Nome = nome;
    Nota = nota;
}
// usar: Aluno a = new Aluno("Ana", 17);</code></pre>
<ul>
<li>Se o parâmetro tiver o mesmo nome que o campo, usa <code>this.Nome = Nome;</code> para dizer qual é qual.</li>
<li><strong>Encapsular</strong> é esconder os campos (<code>private</code>) e deixar mexer só através de métodos ou <strong>propriedades</strong>, que podem validar os valores.</li>
<li>Uma propriedade parece um campo por fora (<code>a.Nota = 15</code>), mas por dentro tem um <code>get</code> (ler) e um <code>set</code> (escrever; o valor novo chama-se <code>value</code>).</li>
<li>Sem validação, escreve-se só <code>public int Nota { get; set; }</code>. Com <code>{ get; private set; }</code>, só a própria classe pode mudar o valor.</li>
</ul>`,
  analogy: 'O construtor é a linha de montagem: o carro sai da fábrica já com rodas e motor. A propriedade com validação é o balcão de um banco: não mexes no cofre (o campo private); pedes ao funcionário (o set), que verifica antes de aceitar.',
  examples: [{
    title: 'Um construtor',
    code: C`
Aluno a = new Aluno("Ana", 17);
Aluno b = new Aluno("Rui", 9);
Console.WriteLine(a.Descricao());
Console.WriteLine(b.Descricao());

class Aluno
{
    public string Nome;
    public int Nota;

    public Aluno(string nome, int nota)
    {
        Nome = nome;
        Nota = nota;
    }

    public string Descricao()
    {
        return $"{Nome} ({Nota})";
    }
}`,
    steps: [
      { l: 1, push: 'Main', n: H`<code>new Aluno("Ana", 17)</code>: primeiro cria o objeto, com os valores por omissão...` },
      { l: 11, obj: { o1: ['Aluno', { Nome: 'null', Nota: '0' }] }, push: 'Aluno', d: { Aluno: { this: ['Aluno', '@o1'], nome: ['string', '"Ana"'], nota: ['int', '17'] } }, n: H`...e depois corre o construtor, com <code>this</code> a apontar para o objeto novo.` },
      { l: 13, obj: { o1: ['Aluno', { Nome: '"Ana"', Nota: '0' }] }, n: H`<code>Nome</code> é o campo do objeto e <code>nome</code> (com minúscula) é o parâmetro.` },
      { l: 14, obj: { o1: ['Aluno', { Nome: '"Ana"', Nota: '17' }] }, n: 'O objeto fica preenchido.' },
      { l: 1, pop: true, d: { Main: { a: ['Aluno', '@o1'] } }, n: H`Só agora a referência é guardada em <code>a</code>: o aluno já está pronto.` },
      { l: 2, obj: { o2: ['Aluno', { Nome: '"Rui"', Nota: '9' }] }, d: { Main: { b: ['Aluno', '@o2'] } }, n: 'O mesmo para o Rui, numa linha só.' },
      { l: 3, o: 'Ana (17)\n', n: H`<code>a.Descricao()</code> devolve o texto do objeto #1.` },
      { l: 4, o: 'Rui (9)\n', n: 'E do #2.' },
    ],
  }, {
    title: 'Uma propriedade que valida',
    code: C`
Aluno a = new Aluno();
a.Nota = 15;
a.Nota = 25;
Console.WriteLine(a.Nota);

class Aluno
{
    private int nota;

    public int Nota
    {
        get { return nota; }
        set
        {
            if (value >= 0 && value <= 20)
            {
                nota = value;
            }
        }
    }
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Aluno', { nota: '0' }] }, d: { Main: { a: ['Aluno', '@o1'] } }, n: H`O campo <code>nota</code> é <code>private</code>: fora da classe não se lhe pode mexer.` },
      { l: 13, push: 'Nota (set)', d: { 'Nota (set)': { this: ['Aluno', '@o1'], value: ['int', '15'] } }, n: H`<code>a.Nota = 15</code> parece mudar um campo, mas chama o <code>set</code> da propriedade, com <code>value</code> = 15.` },
      { l: 15, n: '15 está entre 0 e 20: aceita.' },
      { l: 17, obj: { o1: ['Aluno', { nota: '15' }] }, n: 'Guarda no campo privado.' },
      { l: 2, pop: true, n: 'Volta ao Main.' },
      { l: 13, push: 'Nota (set)', d: { 'Nota (set)': { this: ['Aluno', '@o1'], value: ['int', '25'] } }, n: H`Agora <code>value</code> é 25.` },
      { l: 15, n: H`25 não está entre 0 e 20: o <code>set</code> recusa e não muda nada.` },
      { l: 3, pop: true, n: 'O objeto continua com 15.' },
      { l: 4, o: '15\n', n: H`Ler <code>a.Nota</code> chama o <code>get</code>, que devolve o campo privado.` },
    ],
  }],
  mistakes: [
    H`Escrever <code>Nome = Nome;</code> num construtor cujo parâmetro também se chama Nome: o campo fica igual. Usa <code>this.Nome = Nome;</code> ou parâmetros com minúscula.`,
    H`Pôr um tipo de retorno no construtor (<code>public void Aluno(...)</code>): deixa de ser construtor.`,
    H`Depois de criares um construtor com parâmetros, <code>new Aluno()</code> deixa de compilar, a não ser que também escrevas um sem parâmetros.`,
    H`Tentar mexer num campo private fora da classe: <em>error CS0122: 'Aluno.nota' is inaccessible due to its protection level</em>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Ponto p = new Ponto(3, 4);
Console.WriteLine(p.X + p.Y);

class Ponto
{
    public int X;
    public int Y;

    public Ponto(int x, int y)
    {
        X = x;
        Y = y;
    }
}`, opts: ['34', '7', '0', 'error CS1729'], ok: 1, mono: true, check: true,
      exp: 'O construtor guarda o 3 em X e o 4 em Y, e 3 + 4 = 7. A soma é de números, não de texto.' },
    { q: 'O que acontece com este programa?', code: C`
Aluno a = new Aluno();
a.nota = 15;
Console.WriteLine("ok");

class Aluno
{
    private int nota;
}`, opts: ['ok', '15', "error CS0122: 'Aluno.nota' is inaccessible due to its protection level", 'Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.'], ok: 2, mono: true, check: true,
      exp: H`O campo é <code>private</code>: só o código dentro da classe Aluno lhe pode mexer. O programa nem compila.` },
    { q: 'O que aparece no ecrã? (atenção aos nomes)', code: C`
Aluno a = new Aluno("Ana");
Console.WriteLine(a.Nome == null);

class Aluno
{
    public string Nome;

    public Aluno(string Nome)
    {
        Nome = Nome;
    }
}`, opts: ['True', 'False', 'Ana', 'error CS0103'], ok: 0, mono: true, check: true,
      exp: H`Dentro do construtor, <code>Nome</code> é o parâmetro (o nome mais próximo ganha). <code>Nome = Nome</code> guarda o parâmetro nele próprio, e o campo fica null. Corrige-se com <code>this.Nome = Nome;</code>. O compilador até avisa: <em>warning CS1717: Assignment made to same variable</em>.` },
    { q: 'O que aparece no ecrã?', code: C`
Produto p = new Produto();
p.Preco = 10;
p.Preco = p.Preco * 2;
Console.WriteLine(p.Preco);

class Produto
{
    public int Preco { get; set; }
}`, opts: ['10', '20', '0', 'error CS0200'], ok: 1, mono: true, check: true,
      exp: H`Uma propriedade automática (<code>{ get; set; }</code>) usa-se como um campo: lê 10, multiplica por 2 e guarda 20.` },
  ],
  exercises: [{
    title: 'Retângulo com construtor',
    text: 'Cria a classe Retangulo com um construtor que recebe a largura e a altura, e os métodos Area() e Perimetro(). Cria um retângulo 3 × 4 e mostra os dois valores.',
    run: 'Area: 12, Perimetro: 14\n',
    hint: H`O construtor guarda os dois valores nos campos. <code>Perimetro()</code> devolve <code>2 * (Largura + Altura)</code>.`,
    solution: C`
Retangulo r = new Retangulo(3, 4);
Console.WriteLine($"Area: {r.Area()}, Perimetro: {r.Perimetro()}");

class Retangulo
{
    public int Largura;
    public int Altura;

    public Retangulo(int largura, int altura)
    {
        Largura = largura;
        Altura = altura;
    }

    public int Area()
    {
        return Largura * Altura;
    }

    public int Perimetro()
    {
        return 2 * (Largura + Altura);
    }
}`,
  }, {
    title: 'Conta bancária',
    text: 'Cria a classe Conta com a propriedade Saldo { get; private set; }, um método Depositar(int valor) e um método Levantar(int valor) que só levanta se houver saldo (e diz "Saldo insuficiente" se não houver). Deposita 50, tenta levantar 80, levanta 30 e mostra o saldo.',
    run: 'Saldo insuficiente\nSaldo: 20\n',
    hint: H`Dentro de <code>Levantar</code>: <code>if (valor &gt; Saldo)</code> escreve a mensagem; senão, <code>Saldo -= valor;</code>.`,
    solution: C`
Conta c = new Conta();
c.Depositar(50);
c.Levantar(80);
c.Levantar(30);
Console.WriteLine($"Saldo: {c.Saldo}");

class Conta
{
    public int Saldo { get; private set; }

    public void Depositar(int valor)
    {
        Saldo += valor;
    }

    public void Levantar(int valor)
    {
        if (valor > Saldo)
        {
            Console.WriteLine("Saldo insuficiente");
        }
        else
        {
            Saldo -= valor;
        }
    }
}`,
  }],
});
