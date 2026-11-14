// ===== Rust do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador (l, n, o, push, pop, d, u e x são como no C):
//   d: { main: { idade: ['i32', '19'] } }            um valor simples guarda-se na pilha
//   d: { main: { s: ['String', '@o1'] } } + obj: { o1: ['String', '"ola"'] }   o texto de uma String vive no heap
//   u: { main: { s: '(movido)' } }                    depois de um move, a variável já não se pode usar
//   d: { f: { r: ['&String', '→ s (main)'] } }        uma referência (empréstimo) aponta para outra variável
//   x: { main: ['s'] }                                fim do âmbito: a variável desaparece; se era dona de
//                                                     memória no heap, essa memória é libertada (drop)
// O frame de topo chama-se main.
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Olá, Rust',
  short: 'fn main, println! e {} no lugar do %d',
  body: H`
<p>O Rust tem a velocidade do C, mas o compilador apanha os erros de memória que em C só davam problemas a correr (apontadores para o vazio, memória libertada duas vezes, arrays fora dos limites). O programa começa em <code>fn main()</code>, como o <code>main</code> do C:</p>
<pre class="snip"><code>fn main() {
    println!("Ola!");
}</code></pre>
<ul>
<li><code>println!</code> escreve e muda de linha; <code>print!</code> não muda. O <code>!</code> quer dizer que é uma <strong>macro</strong>, não uma função normal: por agora, basta saber que se escreve assim.</li>
<li>Os valores entram com <code>{}</code>, pela ordem: <code>println!("{} tem {} anos", nome, idade)</code>. Também podes pôr o nome da variável lá dentro: <code>"{nome}"</code>. Não há <code>%d</code> nem <code>%s</code>: o Rust sabe o tipo.</li>
<li>As variáveis criam-se com <code>let</code>. Cada instrução acaba em <code>;</code>.</li>
<li>Cria-se um projeto com <code>cargo new ola</code> e corre-se com <code>cargo run</code>, dentro da pasta.</li>
</ul>`,
  analogy: 'O compilador do Rust é o colega chato que revê o teu trabalho antes da entrega e recusa assiná-lo se houver um erro. Custa mais a passar, mas o que passa raramente rebenta no dia do teste.',
  examples: [{
    title: 'Escrever no ecrã',
    code: C`
fn main() {
    println!("Ola, Rust!");
    let nome = "Rita";
    let idade = 19;
    println!("{} tem {} anos", nome, idade);
    println!("{nome} para o ano tem {}", idade + 1);
}`,
    steps: [
      { l: 1, push: 'main', n: H`O programa começa em <code>fn main()</code>.` },
      { l: 2, o: 'Ola, Rust!\n', n: H`<code>println!</code> escreve e muda de linha.` },
      { l: 3, d: { main: { nome: ['&str', '"Rita"'] } }, n: H`<code>let</code> cria uma variável. O compilador descobre o tipo sozinho: um texto fixo (<code>&amp;str</code>).` },
      { l: 4, d: { main: { idade: ['i32', '19'] } }, n: H`Um inteiro: <code>i32</code> é o <code>int</code> do C (32 bits, com sinal).` },
      { l: 5, o: 'Rita tem 19 anos\n', n: H`Cada <code>{}</code> é trocado por um valor, pela ordem.` },
      { l: 6, o: 'Rita para o ano tem 20\n', n: H`<code>{nome}</code> vai buscar a variável pelo nome; o <code>{}</code> recebe <code>idade + 1</code>.` },
      { l: 7, x: { main: ['nome', 'idade'] }, n: 'Fim do main: as variáveis desaparecem.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>!</code>: <code>println("Ola")</code> não compila.`,
    H`Usar <code>%d</code> como no C. Em Rust é sempre <code>{}</code>.`,
    H`Dar menos valores do que <code>{}</code>: é um erro de compilação, não um valor estranho no ecrã como no printf.`,
    H`Esquecer o <code>;</code> no fim de uma instrução.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    print!("A");
    println!("B");
    print!("C");
}`, opts: ['A\nB\nC', 'AB\nC', 'ABC', 'A B C'], ok: 1, mono: true, check: true,
      exp: H`Só o <code>println!</code> muda de linha, depois de escrever o B.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x = 3;
    println!("{x} + {x} = {}", x + x);
}`, opts: ['3 + 3 = 6', '{x} + {x} = 6', 'x + x = 6', '3 + 3 = x + x'], ok: 0, mono: true, check: true,
      exp: H`<code>{x}</code> mostra a variável x; o <code>{}</code> vazio recebe o valor que vem a seguir ao texto, <code>x + x</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    println!("{}{}", 1, 2);
}`, opts: ['12', '3', '1 2', '{}{}'], ok: 0, mono: true, check: true,
      exp: 'Os dois {} estão colados, por isso os valores aparecem colados. Não há soma: são dois valores mostrados lado a lado.' },
    { q: 'Porque é que println! tem um ponto de exclamação?', opts: ['Para escrever mais alto', 'Porque é uma macro, não uma função normal', 'Porque é obrigatório no fim das linhas', 'Para mudar de linha'], ok: 1,
      exp: H`O <code>!</code> marca uma macro: código que o compilador expande antes de compilar. É o que lhe permite aceitar um número variável de valores e verificar os <code>{}</code>.` },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve um programa que mostre o teu nome numa linha e o teu curso na linha seguinte.',
    run: 'Nome: Joao\nCurso: Engenharia Informatica\n',
    hint: H`Dois <code>println!</code> dentro do <code>main</code>.`,
    solution: C`
fn main() {
    println!("Nome: Joao");
    println!("Curso: Engenharia Informatica");
}`,
  }, {
    title: 'Contas',
    text: 'Cria as variáveis a = 8 e b = 3 e mostra a soma, a diferença e o produto, exatamente neste formato.',
    run: '8 + 3 = 11\n8 - 3 = 5\n8 * 3 = 24\n',
    hint: H`<code>println!("{a} + {b} = {}", a + b);</code>`,
    solution: C`
fn main() {
    let a = 8;
    let b = 3;
    println!("{a} + {b} = {}", a + b);
    println!("{a} - {b} = {}", a - b);
    println!("{a} * {b} = {}", a * b);
}`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Variáveis: imutáveis por omissão',
  short: 'let, mut, sombrear com let, tipos e conversões com as',
  body: H`
<p>Em Rust, uma variável criada com <code>let</code> <strong>não pode mudar</strong>. Para poder mudar, diz-se logo à partida: <code>let mut x = 5;</code>. Parece uma chatice, mas obriga-te a pensar no que muda, e o compilador avisa se puseres <code>mut</code> sem precisar.</p>
<table class="t">
<thead><tr><th>Tipo</th><th>Guarda</th><th>Em C era</th></tr></thead>
<tbody>
<tr><td><code>i32</code></td><td>inteiro com sinal (também há <code>i64</code>, <code>u32</code>...)</td><td><code>int</code></td></tr>
<tr><td><code>f64</code></td><td>real</td><td><code>double</code></td></tr>
<tr><td><code>bool</code></td><td><code>true</code> ou <code>false</code></td><td>um <code>int</code> 0 ou 1</td></tr>
<tr><td><code>char</code></td><td>um carácter, <code>'A'</code></td><td><code>char</code></td></tr>
</tbody>
</table>
<ul>
<li>O compilador descobre o tipo, mas podes escrevê-lo: <code>let nota: i32 = 17;</code>.</li>
<li>Não há conversões automáticas. Inteiro e real não se misturam: <code>a as f64</code> converte, e <code>7 / 2</code> é 3, como em C.</li>
<li>Podes criar outra variável com o mesmo nome: <code>let x = x * 2;</code>. Chama-se <strong>sombrear</strong> (shadowing): a antiga fica escondida, não muda.</li>
</ul>`,
  analogy: 'Uma variável sem mut é um valor escrito a caneta: não se apaga. Com mut é a lápis. Sombrear é escrever um valor novo noutro papel com o mesmo título e pôr o antigo por baixo, sem lhe mexer.',
  examples: [{
    title: 'let, mut e sombrear',
    code: C`
fn main() {
    let x = 5;
    let mut y = 10;
    y = y + x;
    let x = x * 2;
    println!("x = {x}, y = {y}");
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, d: { main: { x: ['i32', '5'] } }, n: H`<code>x</code> sem <code>mut</code>: este valor não vai mudar.` },
      { l: 3, d: { main: { y: ['mut i32', '10'] } }, n: H`<code>y</code> com <code>mut</code>: pode mudar.` },
      { l: 4, u: { main: { y: '15' } }, n: H`<code>y = y + x</code> = 10 + 5 = 15. Com o <code>x</code> isto não compilava.` },
      { l: 5, x: { main: ['x'] }, d: { main: { x: ['i32', '10'] } }, n: H`<code>let x = x * 2</code> não muda o x antigo: cria uma variável <strong>nova</strong>, também chamada x, com 10. A antiga fica escondida (no visualizador, desaparece).` },
      { l: 6, o: 'x = 10, y = 15\n', n: H`O <code>x</code> que se vê agora é o novo.` },
      { l: 7, x: { main: ['y', 'x'] }, n: 'Fim do main.' },
    ],
  }, {
    title: 'Divisões e conversões',
    code: C`
fn main() {
    let a = 7;
    let b = 2;
    let q = a / b;
    let d = a as f64 / b as f64;
    println!("{q} {d}");
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, d: { main: { a: ['i32', '7'] } }, n: 'Dois inteiros...' },
      { l: 3, d: { main: { b: ['i32', '2'] } }, n: '...7 e 2.' },
      { l: 4, d: { main: { q: ['i32', '3'] } }, n: H`Inteiro a dividir por inteiro: 3, como em C.` },
      { l: 5, d: { main: { d: ['f64', '3.5'] } }, n: H`<code>as f64</code> converte cada inteiro num real. Em Rust tens de converter os <strong>dois</strong>: <code>a as f64 / b</code> não compila, porque não se divide um real por um inteiro.` },
      { l: 6, o: '3 3.5\n', n: 'Os dois resultados.' },
      { l: 7, x: { main: ['a', 'b', 'q', 'd'] }, n: 'Fim do main.' },
    ],
  }],
  mistakes: [
    H`Mudar uma variável sem <code>mut</code>: <em>error[E0384]: cannot assign twice to immutable variable</em>.`,
    H`Misturar inteiros e reais: <code>let m = soma / 3.0;</code> com <code>soma</code> inteira não compila. Converte com <code>soma as f64</code>.`,
    H`Guardar um real numa variável <code>i32</code>: <em>error[E0308]: mismatched types</em>.`,
    H`Confundir sombrear com mudar: <code>let x = x + 1;</code> cria outra variável (e pode até mudar o tipo); <code>x = x + 1;</code> muda a mesma e precisa de <code>mut</code>.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let x = 5;
    x = 6;
    println!("{x}");
}`, opts: ['6', '5', 'error[E0384]: cannot assign twice to immutable variable `x`', '11'], ok: 2, mono: true, check: true,
      exp: H`Sem <code>mut</code>, x não pode receber outro valor. É um erro de compilação; o programa nem chega a correr. Corrige-se com <code>let mut x = 5;</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x = 2;
    let x = x * 3;
    let x = x + 1;
    println!("{x}");
}`, opts: ['7', '2', '3', 'error[E0384]: cannot assign twice to immutable variable `x`'], ok: 0, mono: true, check: true,
      exp: H`Cada <code>let</code> cria uma variável nova a partir da anterior: 2, depois 6, depois 7. Não há nenhuma variável a mudar, por isso não é preciso <code>mut</code>.` },
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let x: i32 = 2.5;
    println!("{x}");
}`, opts: ['2', '2.5', '3', 'error[E0308]: mismatched types'], ok: 3, mono: true, check: true,
      exp: H`Em C guardava 2. Em Rust não há conversões escondidas: um real não cabe num <code>i32</code> sem pedires com <code>as</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let a = 7;
    let b = 2;
    println!("{} {}", a / b, a % b);
}`, opts: ['3 1', '3.5 1', '3 0', '3.5 0'], ok: 0, mono: true, check: true,
      exp: 'Exatamente como em C: divisão inteira (3) e resto (1).' },
  ],
  exercises: [{
    title: 'Média de três notas',
    text: 'Com as notas 12, 15 e 14 (inteiros), calcula a média e mostra-a com 2 casas decimais.',
    run: 'Media: 13.67\n',
    hint: H`Soma os três e converte: <code>soma as f64 / 3.0</code>. Para 2 casas: <code>{:.2}</code>.`,
    solution: C`
fn main() {
    let a = 12;
    let b = 15;
    let c = 14;
    let soma = a + b + c;
    let media = soma as f64 / 3.0;
    println!("Media: {:.2}", media);
}`,
  }, {
    title: 'Minutos em horas',
    text: 'Para total = 135 minutos, mostra quantas horas e minutos são.',
    run: '2 h e 15 min\n',
    hint: H`<code>total / 60</code> e <code>total % 60</code>, como em C.`,
    solution: C`
fn main() {
    let total = 135;
    let horas = total / 60;
    let minutos = total % 60;
    println!("{horas} h e {minutos} min");
}`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Decisões e ciclos',
  short: 'if que devolve valor, loop, while e for com intervalos',
  body: H`
<p>O <code>if</code> e o <code>while</code> são como em C, sem parênteses à volta da condição e com chavetas obrigatórias. A condição tem de ser um <code>bool</code>: <code>if x</code> com um número não compila.</p>
<ul>
<li>O <code>if</code> é uma <strong>expressão</strong>: devolve um valor. <code>let r = if nota &gt;= 10 { "aprovado" } else { "reprovado" };</code> (é o <code>? :</code> do C, mas legível).</li>
<li><code>for i in 0..4</code> dá 0, 1, 2, 3 (o 4 fica de fora); <code>for i in 1..=4</code> inclui o 4.</li>
<li><code>loop { ... }</code> repete para sempre, até um <code>break</code>. O <code>break</code> pode até devolver um valor: <code>break n;</code>.</li>
<li>Não há <code>i++</code>: escreve-se <code>i += 1</code>.</li>
</ul>`,
  analogy: 'O if do Rust é uma pergunta com resposta: "se choveu, guarda-chuva, senão óculos de sol" dá-te um objeto na mão, em vez de só te mandar fazer uma coisa ou outra.',
  examples: [{
    title: 'if com valor e for',
    code: C`
fn main() {
    let nota = 13;
    let resultado = if nota >= 10 { "aprovado" } else { "reprovado" };
    println!("{resultado}");
    let mut soma = 0;
    for i in 1..=4 {
        soma += i;
    }
    println!("soma = {soma}");
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, d: { main: { nota: ['i32', '13'] } }, n: 'A nota.' },
      { l: 3, d: { main: { resultado: ['&str', '"aprovado"'] } }, n: H`13 &gt;= 10 é verdadeiro, por isso o <code>if</code> <strong>devolve</strong> "aprovado", que fica na variável.` },
      { l: 4, o: 'aprovado\n', n: 'Mostra o resultado.' },
      { l: 5, d: { main: { soma: ['mut i32', '0'] } }, n: H`O acumulador tem de ser <code>mut</code>, porque vai mudar.` },
      { l: 6, d: { main: { i: ['i32', '1'] } }, n: H`<code>1..=4</code> dá 1, 2, 3 e 4. Primeira volta: i = 1.` },
      { l: 7, u: { main: { soma: '1' } }, n: 'soma = 0 + 1' },
      { l: 6, u: { main: { i: '2' } }, n: 'i = 2' },
      { l: 7, u: { main: { soma: '3' } }, n: 'soma = 1 + 2' },
      { l: 6, u: { main: { i: '3' } }, n: 'i = 3' },
      { l: 7, u: { main: { soma: '6' } }, n: 'soma = 3 + 3' },
      { l: 6, u: { main: { i: '4' } }, n: H`i = 4, o último, porque o <code>..=</code> inclui o 4.` },
      { l: 7, u: { main: { soma: '10' } }, n: 'soma = 6 + 4' },
      { l: 9, x: { main: ['i'] }, o: 'soma = 10\n', n: H`O <code>i</code> só existia dentro do for.` },
      { l: 10, x: { main: ['nota', 'resultado', 'soma'] }, n: 'Fim do main.' },
    ],
  }, {
    title: 'loop com break que devolve valor',
    code: C`
fn main() {
    let mut n = 1;
    let resultado = loop {
        n = n * 2;
        if n > 20 {
            break n;
        }
    };
    println!("{resultado}");
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, d: { main: { n: ['mut i32', '1'] } }, n: 'n começa em 1.' },
      { l: 3, n: H`<code>loop</code> repete para sempre, até um <code>break</code>.` },
      { l: 4, u: { main: { n: '2' } }, n: 'n = 2. 2 > 20? Não.' },
      { l: 4, u: { main: { n: '4' } }, n: 'n = 4. Não.' },
      { l: 4, u: { main: { n: '8' } }, n: 'n = 8. Não.' },
      { l: 4, u: { main: { n: '16' } }, n: 'n = 16. Ainda não.' },
      { l: 4, u: { main: { n: '32' } }, n: 'n = 32.' },
      { l: 5, n: '32 > 20? Sim.' },
      { l: 6, d: { main: { resultado: ['i32', '32'] } }, n: H`<code>break n</code> sai do ciclo e devolve o 32, que fica em <code>resultado</code>.` },
      { l: 9, o: '32\n', n: 'Mostra o resultado.' },
      { l: 10, x: { main: ['n', 'resultado'] }, n: 'Fim do main.' },
    ],
  }],
  mistakes: [
    H`Usar um número como condição (<code>if n { }</code>): <em>error[E0308]: mismatched types</em>. Escreve <code>if n != 0</code>.`,
    H`Esquecer que <code>0..4</code> não inclui o 4. Para incluir: <code>0..=4</code>.`,
    H`Esquecer o <code>mut</code> num acumulador ou contador.`,
    H`Nos dois ramos de um <code>if</code> que devolve valor, os tipos têm de ser iguais (os dois texto, ou os dois números).`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    for i in 0..3 {
        print!("{i} ");
    }
}`, opts: ['0 1 2', '1 2 3', '0 1 2 3', '0 1'], ok: 0, mono: true, check: true,
      exp: H`<code>0..3</code> começa em 0 e pára antes do 3.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let mut s = 0;
    for i in 1..=3 {
        s += i;
    }
    println!("{s}");
}`, opts: ['3', '6', '10', '0'], ok: 1, mono: true, check: true,
      exp: H`<code>1..=3</code> inclui o 3: 1 + 2 + 3 = 6.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x = 7;
    let tipo = if x % 2 == 0 { "par" } else { "impar" };
    println!("{x} e {tipo}");
}`, opts: ['7 e impar', '7 e par', 'x e tipo', '1 e impar'], ok: 0, mono: true, check: true,
      exp: H`7 % 2 é 1, por isso a condição é falsa e o <code>if</code> devolve "impar".` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let mut i = 10;
    while i > 0 {
        print!("*");
        i -= 3;
    }
}`, opts: ['***', '****', '*****', 'Infinitas estrelas'], ok: 1, mono: true, check: true,
      exp: 'i vale 10, 7, 4 e 1: quatro estrelas. Depois passa a -2 e o ciclo pára.' },
  ],
  exercises: [{
    title: 'Tabuada do 7',
    text: 'Mostra a tabuada do 7, de 1 a 10.',
    run: Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}\n`).join(''),
    hint: H`<code>for i in 1..=10</code> e <code>println!("7 x {i} = {}", 7 * i);</code>`,
    solution: C`
fn main() {
    for i in 1..=10 {
        println!("7 x {i} = {}", 7 * i);
    }
}`,
  }, {
    title: 'Par ou ímpar',
    text: 'Para cada número de 1 a 5, diz se é par ou ímpar, usando um if que devolve o texto.',
    run: '1 e impar\n2 e par\n3 e impar\n4 e par\n5 e impar\n',
    hint: H`Dentro do for: <code>let tipo = if i % 2 == 0 { "par" } else { "impar" };</code>`,
    solution: C`
fn main() {
    for i in 1..=5 {
        let tipo = if i % 2 == 0 { "par" } else { "impar" };
        println!("{i} e {tipo}");
    }
}`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Funções',
  short: 'fn com tipos, -> e a última expressão sem ponto e vírgula',
  body: H`
<p>Uma função escreve-se com <code>fn</code>, e os tipos dos parâmetros e do resultado são obrigatórios:</p>
<pre class="snip"><code>fn quadrado(x: i32) -> i32 {
    x * x
}</code></pre>
<ul>
<li><code>-&gt; i32</code> diz o tipo do valor devolvido. Sem <code>-&gt;</code>, a função não devolve nada (como o <code>void</code> do C).</li>
<li>A <strong>última expressão, sem <code>;</code></strong>, é o valor devolvido. <code>x * x</code> devolve; <code>x * x;</code> (com ponto e vírgula) passa a ser uma instrução e a função não devolve nada, o que dá erro.</li>
<li><code>return</code> também existe, para sair mais cedo.</li>
<li>As funções podem estar escritas antes ou depois do <code>main</code>. Os parâmetros <code>i32</code> recebem uma cópia, como em C.</li>
</ul>`,
  analogy: 'Em Rust, um bloco de código é como uma conta numa calculadora: o último valor que fica no visor é a resposta. O ; é carregar em "limpar": se o puseres no fim, a resposta perde-se.',
  examples: [{
    title: 'Uma função que devolve um valor',
    code: C`
fn quadrado(x: i32) -> i32 {
    x * x
}

fn main() {
    let n = 4;
    let q = quadrado(n);
    println!("{n} {q}");
}`,
    steps: [
      { l: 5, push: 'main', n: H`O programa começa no <code>main</code>, mesmo que a função esteja escrita antes.` },
      { l: 6, d: { main: { n: ['i32', '4'] } }, n: 'n = 4' },
      { l: 1, push: 'quadrado', d: { quadrado: { x: ['i32', '4'] } }, n: H`Chama <code>quadrado(n)</code>. O parâmetro <code>x</code> recebe uma cópia do 4.` },
      { l: 2, n: H`<code>x * x</code> é a última expressão e não tem <code>;</code>: é o valor devolvido, 16.` },
      { l: 7, pop: true, d: { main: { q: ['i32', '16'] } }, n: 'O frame da função desaparece e o 16 fica em q.' },
      { l: 8, o: '4 16\n', n: 'Mostra os dois.' },
      { l: 9, x: { main: ['n', 'q'] }, n: 'Fim do main.' },
    ],
  }, {
    title: 'Um if como valor devolvido',
    code: C`
fn maior(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}

fn main() {
    println!("{}", maior(3, 8) + maior(5, 2));
}`,
    steps: [
      { l: 9, push: 'main', n: 'Começa o main.' },
      { l: 1, push: 'maior', d: { maior: { a: ['i32', '3'], b: ['i32', '8'] } }, n: H`Primeiro <code>maior(3, 8)</code>.` },
      { l: 2, n: '3 > 8? Não.' },
      { l: 5, n: H`O <code>if</code> devolve <code>b</code>, e como o <code>if</code> é a última expressão da função, a função devolve 8.` },
      { l: 10, pop: true, n: 'Devolveu 8. Agora a segunda chamada.' },
      { l: 1, push: 'maior', d: { maior: { a: ['i32', '5'], b: ['i32', '2'] } }, n: H`<code>maior(5, 2)</code>.` },
      { l: 3, n: '5 > 2: devolve a, o 5.' },
      { l: 10, pop: true, o: '13\n', n: '8 + 5 = 13' },
    ],
  }],
  mistakes: [
    H`Pôr <code>;</code> na última linha de uma função que devolve um valor: <em>error[E0308]: mismatched types</em> (a função ficou a devolver <code>()</code>, "nada").`,
    H`Esquecer os tipos dos parâmetros (<code>fn f(x)</code>): em Rust são obrigatórios.`,
    H`Esquecer o <code>-&gt; i32</code> e tentar devolver um valor.`,
    H`Esperar que a função mude um <code>i32</code> recebido: recebe uma cópia.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn dobro(n: i32) -> i32 {
    n * 2
}

fn main() {
    println!("{}", dobro(dobro(3)));
}`, opts: ['6', '9', '12', '3'], ok: 2, mono: true, check: true,
      exp: 'Começa por dentro: dobro(3) = 6, depois dobro(6) = 12.' },
    { q: 'O que acontece com este programa?', code: C`
fn dobro(n: i32) -> i32 {
    n * 2;
}

fn main() {
    println!("{}", dobro(3));
}`, opts: ['6', '3', 'error[E0308]: mismatched types', '0'], ok: 2, mono: true, check: true,
      exp: H`O <code>;</code> transforma <code>n * 2</code> numa instrução, e a função fica sem valor para devolver, quando prometeu um <code>i32</code>. O compilador até sugere tirar o ponto e vírgula.` },
    { q: 'O que aparece no ecrã?', code: C`
fn f(mut x: i32) {
    x = x + 1;
}

fn main() {
    let a = 1;
    f(a);
    println!("{a}");
}`, opts: ['1', '2', '0', 'error[E0384]: cannot assign twice to immutable variable `a`'], ok: 0, mono: true, check: true,
      exp: H`O <code>f</code> recebe uma cópia (que ele declara como <code>mut</code> para a poder mudar). O <code>a</code> do main não é tocado.` },
    { q: 'O que aparece no ecrã?', code: C`
fn sinal(n: i32) -> &'static str {
    if n < 0 {
        return "negativo";
    }
    "positivo ou zero"
}

fn main() {
    println!("{}", sinal(-4));
}`, opts: ['negativo', 'positivo ou zero', 'negativo\npositivo ou zero', '-4'], ok: 0, mono: true, check: true,
      exp: H`O <code>return</code> sai logo da função com "negativo"; a última linha nunca chega a ser avaliada. (Ignora o <code>&amp;'static str</code>: é o tipo de um texto fixo.)` },
  ],
  exercises: [{
    title: 'Função eh_par',
    text: 'Escreve fn eh_par(n: i32) -> bool, que devolve true se n for par. Usa-a para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`O corpo pode ser só <code>n % 2 == 0</code>, sem <code>;</code>.`,
    solution: C`
fn eh_par(n: i32) -> bool {
    n % 2 == 0
}

fn main() {
    for i in 1..=4 {
        if eh_par(i) {
            println!("{i}: par");
        } else {
            println!("{i}: impar");
        }
    }
}`,
  }, {
    title: 'Área de um retângulo',
    text: 'Escreve fn area(largura: i32, altura: i32) -> i32 e mostra a área de um retângulo 3 × 4.',
    run: 'Area: 12\n',
    hint: H`A função é uma linha: <code>largura * altura</code>.`,
    solution: C`
fn area(largura: i32, altura: i32) -> i32 {
    largura * altura
}

fn main() {
    println!("Area: {}", area(3, 4));
}`,
  }],
});
