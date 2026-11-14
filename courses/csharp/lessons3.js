// ===== C# do Zero — conteúdo das lições (parte 3) =====

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Tipos de valor e tipos de referência',
  short: 'struct contra class, o que vai para a pilha e o que vai para o heap',
  body: H`
<p>Já viste os dois comportamentos: <code>int y = x;</code> copia o número, e <code>Aluno b = a;</code> copia a referência. Isto não depende da variável, depende do <strong>tipo</strong>:</p>
<table class="t">
<thead><tr><th></th><th>Tipos de valor</th><th>Tipos de referência</th></tr></thead>
<tbody>
<tr><td>Exemplos</td><td><code>int</code>, <code>double</code>, <code>bool</code>, <code>char</code>, <code>struct</code></td><td><code>class</code>, arrays, <code>List&lt;T&gt;</code>, <code>string</code></td></tr>
<tr><td>A variável guarda</td><td>o próprio valor</td><td>uma referência para um objeto no heap</td></tr>
<tr><td><code>b = a</code></td><td>copia o valor todo</td><td>copia a referência (mesmo objeto)</td></tr>
<tr><td>Passar a um método</td><td>o método recebe uma cópia</td><td>o método pode mudar o objeto</td></tr>
</tbody>
</table>
<p>Um <code>struct</code> escreve-se como uma classe, mas é um tipo de valor, como o <code>struct</code> do C: atribuir copia todos os campos. Usa-se para coisas pequenas, como um ponto ou uma cor.</p>
<p>O <code>string</code> é de referência, mas <strong>nunca muda por dentro</strong>: <code>b = b + "!"</code> cria um texto novo. Por isso, na prática, comporta-se como um valor.</p>`,
  analogy: 'Um tipo de valor é uma folha de papel: dar uma cópia é fotocopiá-la, e o que escreves na cópia não aparece no original. Um tipo de referência é um documento partilhado na nuvem: dar o link não copia o documento, e quem o editar muda-o para todos.',
  examples: [{
    title: 'struct contra class',
    code: C`
PontoS s1 = new PontoS();
s1.X = 1;
PontoS s2 = s1;
s2.X = 9;
PontoC c1 = new PontoC();
c1.X = 1;
PontoC c2 = c1;
c2.X = 9;
Console.WriteLine($"struct: {s1.X} {s2.X}");
Console.WriteLine($"class: {c1.X} {c2.X}");

struct PontoS
{
    public int X;
}

class PontoC
{
    public int X;
}`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { s1: ['PontoS', { X: '0' }] } }, n: H`<code>PontoS</code> é um <strong>struct</strong>: os campos ficam dentro da própria variável, na pilha. Não há nada no heap.` },
      { l: 2, u: { Main: { 's1.X': '1' } }, n: 'Muda o X dentro de s1.' },
      { l: 3, d: { Main: { s2: ['PontoS', { X: '1' }] } }, n: H`<code>s2 = s1</code> copia o struct <strong>todo</strong>: s2 é um ponto novo, com os mesmos valores.` },
      { l: 4, u: { Main: { 's2.X': '9' } }, n: H`Mudar s2 não mexe em s1. É o que acontecia com um <code>struct</code> em C.` },
      { l: 5, obj: { o1: ['PontoC', { X: '0' }] }, d: { Main: { c1: ['PontoC', '@o1'] } }, n: H`<code>PontoC</code> é uma <strong>classe</strong>: o objeto vai para o heap e c1 guarda a referência.` },
      { l: 6, obj: { o1: ['PontoC', { X: '1' }] }, n: 'Muda o X do objeto #1.' },
      { l: 7, d: { Main: { c2: ['PontoC', '@o1'] } }, n: H`<code>c2 = c1</code> copia a referência: os dois apontam para o #1.` },
      { l: 8, obj: { o1: ['PontoC', { X: '9' }] }, n: 'Mudar através de c2 muda o único objeto.' },
      { l: 9, o: 'struct: 1 9\n', n: 'Com o struct, cada variável tem o seu valor.' },
      { l: 10, o: 'class: 9 9\n', n: 'Com a classe, as duas variáveis veem o mesmo objeto.' },
    ],
  }, {
    title: 'int e string: cópias sem surpresas',
    code: C`
string a = "ola";
string b = a;
b = b + "!";
Console.WriteLine($"{a} {b}");
int x = 5;
int y = x;
y++;
Console.WriteLine($"{x} {y}");`,
    steps: [
      { l: 1, push: 'Main', d: { Main: { a: ['string', '"ola"'] } }, n: H`Um texto. (Aqui o texto aparece direto na variável, para simplificar; na verdade está no heap.)` },
      { l: 2, d: { Main: { b: ['string', '"ola"'] } }, n: 'b fica com o mesmo texto.' },
      { l: 3, u: { Main: { b: '"ola!"' } }, n: H`Um <code>string</code> nunca muda por dentro: <code>b + "!"</code> cria um texto novo, e só o b passa a ser esse.` },
      { l: 4, o: 'ola ola!\n', n: 'O a não mudou.' },
      { l: 5, d: { Main: { x: ['int', '5'] } }, n: 'Um int.' },
      { l: 6, d: { Main: { y: ['int', '5'] } }, n: 'y recebe uma cópia do 5.' },
      { l: 7, u: { Main: { y: '6' } }, n: 'Só o y muda.' },
      { l: 8, o: '5 6\n', n: 'Igual ao C.' },
    ],
  }],
  mistakes: [
    H`Esperar que mudar uma cópia de um <code>struct</code> mude o original: são dois valores separados.`,
    H`Esperar o contrário com uma classe: <code>b = a</code> não copia o objeto.`,
    H`Achar que <code>string</code> se comporta como um array de char do C: <code>s[0] = 'x'</code> dá <em>error CS0200: Property or indexer 'string.this[int]' cannot be assigned to -- it is read only</em>.`,
    H`Usar <code>struct</code> para tudo "porque é mais rápido": structs grandes são copiados inteiros a cada atribuição e chamada.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Cor a = new Cor();
a.R = 10;
Cor b = a;
b.R = 200;
Console.WriteLine(a.R);

struct Cor
{
    public int R;
}`, opts: ['10', '200', '0', 'error CS0165'], ok: 0, mono: true, check: true,
      exp: H`<code>Cor</code> é um struct: <code>b = a</code> copia os campos. Mudar b não mexe em a.` },
    { q: 'O que aparece no ecrã?', code: C`
Cor a = new Cor();
a.R = 10;
Cor b = a;
b.R = 200;
Console.WriteLine(a.R);

class Cor
{
    public int R;
}`, opts: ['10', '200', '0', 'error CS0165'], ok: 1, mono: true, check: true,
      exp: H`O mesmo código, mas <code>Cor</code> agora é uma classe: a e b apontam para o mesmo objeto, por isso a.R também é 200.` },
    { q: 'O que aparece no ecrã?', code: C`
Ponto p = new Ponto();
Mover(p);
Console.WriteLine(p.X);

static void Mover(Ponto q)
{
    q.X = 5;
}

struct Ponto
{
    public int X;
}`, opts: ['0', '5', 'null', 'error CS0165'], ok: 0, mono: true, check: true,
      exp: H`Um struct passado a um método é copiado, como um int. O <code>Mover</code> muda a cópia; o p fica com X = 0.` },
    { q: 'Qual destes é um tipo de referência?', opts: ['int', 'double', 'bool', 'int[]'], ok: 3,
      exp: H`Os arrays são sempre de referência, mesmo que os elementos sejam <code>int</code>. Por isso <code>int[] b = a;</code> partilha o mesmo array.` },
  ],
  exercises: [{
    title: 'Copiar um struct',
    text: 'Cria um struct Ponto com X e Y. Cria o ponto (1, 2), copia-o para outra variável, soma 5 ao X da cópia e mostra os dois pontos.',
    run: 'original: (1, 2)\ncopia: (6, 2)\n',
    hint: H`<code>Ponto copia = original;</code> e depois <code>copia.X += 5;</code>.`,
    solution: C`
Ponto original = new Ponto();
original.X = 1;
original.Y = 2;
Ponto copia = original;
copia.X += 5;
Console.WriteLine($"original: ({original.X}, {original.Y})");
Console.WriteLine($"copia: ({copia.X}, {copia.Y})");

struct Ponto
{
    public int X;
    public int Y;
}`,
  }, {
    title: 'E se fosse uma classe?',
    text: 'Repete o exercício anterior com Ponto como class em vez de struct. Mostra os dois pontos e repara na diferença.',
    run: 'original: (6, 2)\ncopia: (6, 2)\n',
    hint: H`Basta trocar <code>struct</code> por <code>class</code>. Agora as duas variáveis apontam para o mesmo objeto.`,
    solution: C`
Ponto original = new Ponto();
original.X = 1;
original.Y = 2;
Ponto copia = original;
copia.X += 5;
Console.WriteLine($"original: ({original.X}, {original.Y})");
Console.WriteLine($"copia: ({copia.X}, {copia.Y})");

class Ponto
{
    public int X;
    public int Y;
}`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Herança',
  short: 'class Cao : Animal, base, virtual e override',
  body: H`
<p>Com <strong>herança</strong>, uma classe aproveita tudo o que outra já tem e acrescenta ou muda o que precisa. <code>class Cao : Animal</code> lê-se "um Cão é um Animal": o Cão tem os campos e métodos do Animal sem os escrever outra vez.</p>
<ul>
<li>O construtor da classe filha chama o da mãe com <code>: base(...)</code>.</li>
<li>Um método marcado <code>virtual</code> na classe mãe pode ser substituído na filha com <code>override</code>.</li>
<li>Uma variável do tipo da mãe pode apontar para um objeto da filha: <code>Animal a = new Cao("Bobi");</code>. Ao chamar <code>a.Som()</code>, corre a versão do <strong>objeto</strong> (a do Cão), não a do tipo da variável. Chama-se <strong>polimorfismo</strong>.</li>
<li>É isto que permite ter uma <code>List&lt;Animal&gt;</code> com cães e gatos, e um só ciclo que pede o som a cada um.</li>
<li><code>protected</code>: como <code>private</code>, mas as classes filhas também podem usar.</li>
</ul>`,
  analogy: 'A classe mãe é uma receita base de bolo; as filhas são variações. O bolo de chocolate segue a base toda e só troca um passo (override). Se pedires "faz um bolo" a quem tem a receita de chocolate, sai de chocolate.',
  examples: [{
    title: 'Um Cão é um Animal',
    code: C`
Animal a = new Animal("Rex");
Cao c = new Cao("Bobi");
Console.WriteLine(a.Apresentar());
Console.WriteLine(c.Apresentar());

class Animal
{
    public string Nome;

    public Animal(string nome)
    {
        Nome = nome;
    }

    public virtual string Som()
    {
        return "...";
    }

    public string Apresentar()
    {
        return $"{Nome} faz {Som()}";
    }
}

class Cao : Animal
{
    public Cao(string nome) : base(nome)
    {
    }

    public override string Som()
    {
        return "Au au";
    }
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['Animal', { Nome: '"Rex"' }] }, d: { Main: { a: ['Animal', '@o1'] } }, n: 'Um Animal, criado pelo construtor do Animal.' },
      { l: 2, obj: { o2: ['Cao', { Nome: '"Bobi"' }] }, d: { Main: { c: ['Cao', '@o2'] } }, n: H`Um Cão. Tem o campo <code>Nome</code> sem o declarar, porque o herda do Animal. O construtor do Cão passou o nome ao do Animal com <code>: base(nome)</code>.` },
      { l: 3, o: 'Rex faz ...\n', n: H`<code>a.Apresentar()</code> chama o <code>Som()</code> do Animal: "...".` },
      { l: 21, push: 'Apresentar', d: { Apresentar: { this: ['Cao', '@o2'] } }, n: H`Agora <code>c.Apresentar()</code>. O Cão não tem este método, por isso corre o que herdou do Animal, com <code>this</code> a apontar para o Bobi.` },
      { l: 23, n: H`Lá dentro chama <code>Som()</code>. O método é <code>virtual</code> e o objeto é um Cão...` },
      { l: 34, push: 'Som', d: { Som: { this: ['Cao', '@o2'] } }, n: H`...por isso corre o <code>override</code> do Cão, e não o do Animal.` },
      { l: 36, n: 'Devolve "Au au".' },
      { l: 23, pop: true, n: 'De volta ao Apresentar, que monta o texto.' },
      { l: 4, pop: true, o: 'Bobi faz Au au\n', n: 'O mesmo método Apresentar dá resultados diferentes, conforme o objeto.' },
    ],
  }, {
    title: 'Uma lista de animais',
    code: C`
List<Animal> animais = new List<Animal>();
animais.Add(new Cao());
animais.Add(new Gato());
foreach (Animal a in animais)
{
    Console.WriteLine(a.Som());
}

class Animal
{
    public virtual string Som()
    {
        return "...";
    }
}

class Cao : Animal
{
    public override string Som()
    {
        return "Au";
    }
}

class Gato : Animal
{
    public override string Som()
    {
        return "Miau";
    }
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['List<Animal>', []] }, d: { Main: { animais: ['List<Animal>', '@o1'] } }, n: 'Uma lista que aceita qualquer Animal.' },
      { l: 2, obj: { o2: ['Cao', {}], o1: ['List<Animal>', ['@o2']] }, n: 'Um Cão é um Animal, por isso pode entrar na lista.' },
      { l: 3, obj: { o3: ['Gato', {}], o1: ['List<Animal>', ['@o2', '@o3']] }, n: 'Um Gato também.' },
      { l: 4, d: { Main: { a: ['Animal', '@o2'] } }, n: H`O <code>foreach</code> dá a cada elemento o nome <code>a</code>, do tipo Animal. O primeiro objeto é um Cão.` },
      { l: 6, o: 'Au\n', n: H`<code>a.Som()</code> corre a versão do objeto (Cão), apesar de a variável ser do tipo Animal.` },
      { l: 4, u: { Main: { a: '@o3' } }, n: 'O segundo é um Gato.' },
      { l: 6, o: 'Miau\n', n: 'A mesma linha, outro resultado: polimorfismo.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>virtual</code> na classe mãe: o <code>override</code> na filha não compila (<em>error CS0506</em>).`,
    H`Esquecer o <code>override</code> na filha: o método da filha não substitui o da mãe quando chamado através de uma variável do tipo da mãe.`,
    H`Esquecer o <code>: base(...)</code> quando a classe mãe só tem construtores com parâmetros.`,
    H`Usar herança só para reaproveitar código, quando a frase "um X é um Y" não faz sentido (um Carro não é um Motor).`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
Animal a = new Gato();
Console.WriteLine(a.Som());

class Animal
{
    public virtual string Som()
    {
        return "...";
    }
}

class Gato : Animal
{
    public override string Som()
    {
        return "Miau";
    }
}`, opts: ['...', 'Miau', '...Miau', 'error CS0029'], ok: 1, mono: true, check: true,
      exp: H`A variável é do tipo Animal, mas o objeto é um Gato. Com <code>virtual</code> e <code>override</code>, corre a versão do objeto.` },
    { q: 'O que aparece no ecrã?', code: C`
B obj = new B();

class A
{
    public A()
    {
        Console.WriteLine("A");
    }
}

class B : A
{
    public B()
    {
        Console.WriteLine("B");
    }
}`, opts: ['B', 'A\nB', 'B\nA', 'A'], ok: 1, mono: true, check: true,
      exp: 'Ao criar um B, primeiro corre o construtor da classe mãe (A), e só depois o da filha. A base é construída primeiro.' },
    { q: 'O que aparece no ecrã? (esta é difícil)', code: C`
Animal a = new Cao();
Console.WriteLine(a.Som());

class Animal
{
    public string Som()
    {
        return "...";
    }
}

class Cao : Animal
{
    public new string Som()
    {
        return "Au";
    }
}`, opts: ['...', 'Au', 'error CS0506', '...Au'], ok: 0, mono: true, check: true,
      exp: H`Sem <code>virtual</code>/<code>override</code>, o método do Cão não substitui o do Animal: só o esconde (é o que diz o <code>new</code>). Através de uma variável do tipo Animal, corre o do Animal.` },
    { q: 'O que quer dizer class Cao : Animal?', opts: ['Que um Cão tem um Animal lá dentro', 'Que Cao herda de Animal: um Cão é um Animal', 'Que Animal herda de Cao', 'Que Cao e Animal são a mesma classe'], ok: 1,
      exp: 'Os dois pontos dizem de que classe se herda. O Cão fica com tudo o que o Animal tem e pode acrescentar ou substituir métodos.' },
  ],
  exercises: [{
    title: 'Gerente',
    text: 'Cria a classe Funcionario (Nome, SalarioBase e um método virtual Salario() que devolve o SalarioBase) e a classe Gerente, que herda de Funcionario e devolve o SalarioBase mais 500. Mostra o salário da Ana (funcionária, 1000) e do Rui (gerente, 1000).',
    run: 'Ana: 1000\nRui: 1500\n',
    hint: H`Em Gerente: <code>public override int Salario() { return SalarioBase + 500; }</code>. Podes guardar os dois numa <code>List&lt;Funcionario&gt;</code>.`,
    solution: C`
List<Funcionario> equipa = new List<Funcionario>();
equipa.Add(new Funcionario("Ana", 1000));
equipa.Add(new Gerente("Rui", 1000));
foreach (Funcionario f in equipa)
{
    Console.WriteLine($"{f.Nome}: {f.Salario()}");
}

class Funcionario
{
    public string Nome;
    public int SalarioBase;

    public Funcionario(string nome, int salarioBase)
    {
        Nome = nome;
        SalarioBase = salarioBase;
    }

    public virtual int Salario()
    {
        return SalarioBase;
    }
}

class Gerente : Funcionario
{
    public Gerente(string nome, int salarioBase) : base(nome, salarioBase)
    {
    }

    public override int Salario()
    {
        return SalarioBase + 500;
    }
}`,
  }, {
    title: 'Contar rodas',
    text: 'Cria a classe Veiculo com um método virtual Rodas() que devolve 0, e as filhas Carro (4 rodas) e Mota (2 rodas). Numa lista com dois carros e uma mota, mostra o total de rodas.',
    run: 'Total de rodas: 10\n',
    hint: 'Percorre uma List<Veiculo> e soma v.Rodas(). Cada objeto responde com o seu próprio override.',
    solution: C`
List<Veiculo> garagem = new List<Veiculo>();
garagem.Add(new Carro());
garagem.Add(new Carro());
garagem.Add(new Mota());
int total = 0;
foreach (Veiculo v in garagem)
{
    total += v.Rodas();
}
Console.WriteLine($"Total de rodas: {total}");

class Veiculo
{
    public virtual int Rodas()
    {
        return 0;
    }
}

class Carro : Veiculo
{
    public override int Rodas()
    {
        return 4;
    }
}

class Mota : Veiculo
{
    public override int Rodas()
    {
        return 2;
    }
}`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Interfaces',
  short: 'um contrato que várias classes cumprem, e listas de interfaces',
  body: H`
<p>Uma <strong>interface</strong> é uma lista de métodos que uma classe promete ter, sem dizer como são feitos. Funciona como um contrato:</p>
<pre class="snip"><code>interface IForma
{
    string Nome();
    int Area();
}</code></pre>
<ul>
<li><code>class Quadrado : IForma</code> diz que o Quadrado cumpre o contrato. Se faltar algum método, não compila.</li>
<li>Não se pode fazer <code>new IForma()</code>: uma interface não é uma coisa, é uma promessa.</li>
<li>Mas podes ter variáveis e listas do tipo da interface: <code>List&lt;IForma&gt;</code> aceita qualquer objeto de uma classe que a cumpra, e <code>f.Area()</code> corre a versão desse objeto.</li>
<li>Uma classe só pode herdar de <strong>uma</strong> classe, mas pode cumprir <strong>várias</strong> interfaces: <code>class Pato : Animal, IVoa, INada</code>.</li>
<li>Por convenção, os nomes das interfaces começam por I.</li>
</ul>`,
  analogy: 'Uma interface é como a tomada elétrica: define a forma e a voltagem, e qualquer aparelho com a ficha certa funciona, seja uma torradeira ou um carregador. A parede não precisa de saber que aparelho é.',
  examples: [{
    title: 'Formas diferentes, o mesmo contrato',
    code: C`
List<IForma> formas = new List<IForma>();
formas.Add(new Retangulo(3, 4));
formas.Add(new Quadrado(2));
int total = 0;
foreach (IForma f in formas)
{
    Console.WriteLine($"{f.Nome()}: {f.Area()}");
    total += f.Area();
}
Console.WriteLine($"Total: {total}");

interface IForma
{
    string Nome();
    int Area();
}

class Retangulo : IForma
{
    public int Largura;
    public int Altura;

    public Retangulo(int largura, int altura)
    {
        Largura = largura;
        Altura = altura;
    }

    public string Nome()
    {
        return "Retangulo";
    }

    public int Area()
    {
        return Largura * Altura;
    }
}

class Quadrado : IForma
{
    public int Lado;

    public Quadrado(int lado)
    {
        Lado = lado;
    }

    public string Nome()
    {
        return "Quadrado";
    }

    public int Area()
    {
        return Lado * Lado;
    }
}`,
    steps: [
      { l: 1, push: 'Main', obj: { o1: ['List<IForma>', []] }, d: { Main: { formas: ['List<IForma>', '@o1'] } }, n: H`Uma lista do tipo da interface: aceita qualquer objeto cuja classe cumpra o contrato <code>IForma</code>.` },
      { l: 2, obj: { o2: ['Retangulo', { Largura: '3', Altura: '4' }], o1: ['List<IForma>', ['@o2']] }, n: 'Um Retangulo cumpre IForma: pode entrar.' },
      { l: 3, obj: { o3: ['Quadrado', { Lado: '2' }], o1: ['List<IForma>', ['@o2', '@o3']] }, n: 'Um Quadrado também. São classes diferentes, sem nenhuma herança entre elas.' },
      { l: 4, d: { Main: { total: ['int', '0'] } }, n: 'O acumulador.' },
      { l: 5, d: { Main: { f: ['IForma', '@o2'] } }, n: H`Primeira volta: <code>f</code> é do tipo IForma e aponta para o Retangulo.` },
      { l: 7, o: 'Retangulo: 12\n', n: H`<code>f.Nome()</code> e <code>f.Area()</code> correm os métodos do Retangulo: 3 × 4 = 12.` },
      { l: 8, u: { Main: { total: '12' } }, n: 'total = 12' },
      { l: 5, u: { Main: { f: '@o3' } }, n: 'Segunda volta: o Quadrado.' },
      { l: 7, o: 'Quadrado: 4\n', n: 'Agora correm os métodos do Quadrado: 2 × 2 = 4. O ciclo não precisa de saber que formas existem.' },
      { l: 8, u: { Main: { total: '16' } }, n: 'total = 16' },
      { l: 10, x: { Main: ['f'] }, o: 'Total: 16\n', n: H`Se amanhã criares um <code>Circulo : IForma</code>, este ciclo funciona com ele sem mudar uma linha.` },
    ],
  }],
  mistakes: [
    H`Tentar criar uma interface: <em>error CS0144: Cannot create an instance of the abstract type or interface 'IForma'</em>.`,
    H`Esquecer um método do contrato: <em>error CS0535</em>, a dizer que a classe não implementa esse membro da interface.`,
    H`Esquecer o <code>public</code> nos métodos que cumprem a interface.`,
    H`Tentar herdar de duas classes (<code>class Pato : Animal, Ave</code>). Só uma classe; o resto têm de ser interfaces.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: C`
IForma f = new IForma();
Console.WriteLine("ok");

interface IForma
{
    int Area();
}`, opts: ['ok', '0', "error CS0144: Cannot create an instance of the abstract type or interface 'IForma'", 'Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.'], ok: 2, mono: true, check: true,
      exp: H`Uma interface só diz que métodos têm de existir; não tem código para correr. Cria-se um objeto de uma classe que a cumpra: <code>IForma f = new Quadrado(2);</code>.` },
    { q: 'O que acontece com este programa?', code: C`
Console.WriteLine("ok");

interface IForma
{
    int Area();
}

class Circulo : IForma
{
}`, opts: ['ok', "error CS0535: 'Circulo' does not implement interface member 'IForma.Area()'", "error CS0144: Cannot create an instance of the abstract type or interface 'IForma'", 'Nada'], ok: 1, mono: true, check: true,
      exp: 'O Circulo diz que cumpre IForma, mas não tem o método Area(). O contrato não está cumprido e o programa não compila, mesmo sem nunca criar um Circulo.' },
    { q: 'O que aparece no ecrã?', code: C`
ISom s = new Pato();
Console.WriteLine(s.Fazer());
s = new Vaca();
Console.WriteLine(s.Fazer());

interface ISom
{
    string Fazer();
}

class Pato : ISom
{
    public string Fazer()
    {
        return "Qua";
    }
}

class Vaca : ISom
{
    public string Fazer()
    {
        return "Mu";
    }
}`, opts: ['Qua\nMu', 'Qua\nQua', 'Mu\nMu', 'error CS0029'], ok: 0, mono: true, check: true,
      exp: H`A variável <code>s</code> é do tipo ISom e pode apontar para qualquer objeto que cumpra o contrato. Cada chamada corre o método do objeto para onde aponta nesse momento.` },
    { q: 'Qual é a diferença principal entre herdar de uma classe e cumprir uma interface?', opts: ['Não há diferença', 'Uma classe herda de uma só classe, mas pode cumprir várias interfaces', 'Uma classe pode herdar de várias classes, mas só cumprir uma interface', 'As interfaces têm campos e as classes não'], ok: 1,
      exp: H`Em C# só há herança de uma classe. As interfaces não trazem código, só obrigações, por isso uma classe pode cumprir as que quiser: <code>class Pato : Animal, IVoa, INada</code>.` },
  ],
  exercises: [{
    title: 'Sons',
    text: 'Cria a interface ISom com o método string Fazer(), e as classes Cao ("Au") e Gato ("Miau") que a cumprem. Numa List<ISom> com um cão, um gato e outro cão, mostra os sons, um por linha.',
    run: 'Au\nMiau\nAu\n',
    hint: H`<code>class Cao : ISom</code> e <code>public string Fazer() { return "Au"; }</code>. Depois um <code>foreach</code> pela lista.`,
    solution: C`
List<ISom> sons = new List<ISom>();
sons.Add(new Cao());
sons.Add(new Gato());
sons.Add(new Cao());
foreach (ISom s in sons)
{
    Console.WriteLine(s.Fazer());
}

interface ISom
{
    string Fazer();
}

class Cao : ISom
{
    public string Fazer()
    {
        return "Au";
    }
}

class Gato : ISom
{
    public string Fazer()
    {
        return "Miau";
    }
}`,
  }, {
    title: 'Total a pagar',
    text: 'Cria a interface IPagavel com int Valor(). A classe Fatura guarda um montante e devolve-o; a classe Salario guarda horas e devolve horas × 10. Com uma fatura de 250 e um salário de 100 horas, mostra o total a pagar.',
    run: 'Total a pagar: 1250\n',
    hint: H`Cada classe tem um construtor que guarda o seu número e um <code>Valor()</code> diferente. Soma <code>p.Valor()</code> num <code>foreach</code> sobre uma <code>List&lt;IPagavel&gt;</code>.`,
    solution: C`
List<IPagavel> contas = new List<IPagavel>();
contas.Add(new Fatura(250));
contas.Add(new Salario(100));
int total = 0;
foreach (IPagavel p in contas)
{
    total += p.Valor();
}
Console.WriteLine($"Total a pagar: {total}");

interface IPagavel
{
    int Valor();
}

class Fatura : IPagavel
{
    public int Montante;

    public Fatura(int montante)
    {
        Montante = montante;
    }

    public int Valor()
    {
        return Montante;
    }
}

class Salario : IPagavel
{
    public int Horas;

    public Salario(int horas)
    {
        Horas = horas;
    }

    public int Valor()
    {
        return Horas * 10;
    }
}`,
  }],
});
