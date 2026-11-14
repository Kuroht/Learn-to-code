// ===== Rust do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Ownership: cada valor tem um dono',
  short: 'String no heap, move, a variável que deixa de valer, clone e Copy',
  body: H`
<p>Em C, a memória pedida com <code>malloc</code> tinha de ser libertada com <code>free</code>, à mão. Esquecer era uma fuga de memória; libertar duas vezes, ou usar depois de libertar, rebentava o programa. O Rust resolve isto com uma regra: <strong>cada valor tem um só dono</strong>, e quando o dono sai de âmbito (no fim do bloco), o valor é libertado sozinho. A isso chama-se <strong>drop</strong>.</p>
<ul>
<li>Uma <code>String</code> guarda o texto no <strong>heap</strong>; a variável, na pilha, é a dona desse texto.</li>
<li><code>let t = s;</code> não copia o texto: <strong>passa a posse</strong> de <code>s</code> para <code>t</code>. Chama-se <strong>move</strong>. Depois disto, <code>s</code> já não vale nada e usá-la é um erro de compilação. Assim nunca há dois donos a libertar a mesma memória.</li>
<li>Dar uma <code>String</code> a uma função também a move: a função passa a ser a dona, e liberta-a quando acaba.</li>
<li>Para ter mesmo uma cópia, pede-se: <code>let t = s.clone();</code>.</li>
<li>Os tipos simples (<code>i32</code>, <code>f64</code>, <code>bool</code>, <code>char</code>) são <strong>Copy</strong>: <code>let b = a;</code> copia, e as duas continuam a valer, como em C.</li>
</ul>`,
  analogy: 'Uma String é um carro, e a variável tem a chave. "let t = s" é dar a chave ao t: o s fica sem chave e já não pode conduzir. Quando o último dono vai embora (sai de âmbito), o carro vai para a sucata. Um i32 é uma fotocópia: dás uma cópia e ficas com a tua.',
  examples: [{
    title: 'Move contra Copy',
    code: C`
fn main() {
    let s = String::from("ola");
    let t = s;
    println!("{t}");
    let a = 5;
    let b = a;
    println!("{a} {b}");
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, obj: { o1: ['String', '"ola"'] }, d: { main: { s: ['String', '@o1'] } }, n: H`<code>String::from</code> pede memória no heap para o texto. A variável <code>s</code> é a <strong>dona</strong> dessa memória.` },
      { l: 3, d: { main: { t: ['String', '@o1'] } }, u: { main: { s: '(movido)' } }, n: H`<code>let t = s</code> não copia o texto: passa a posse para <code>t</code>. A <code>s</code> fica marcada como movida e o compilador não te deixa voltar a usá-la.` },
      { l: 4, o: 'ola\n', n: H`Através de <code>t</code> chega-se ao texto. Se aqui escrevesses <code>{s}</code>, não compilava.` },
      { l: 5, d: { main: { a: ['i32', '5'] } }, n: 'Um i32 vive todo na pilha.' },
      { l: 6, d: { main: { b: ['i32', '5'] } }, n: H`Os <code>i32</code> são <strong>Copy</strong>: <code>let b = a</code> copia o número, e o <code>a</code> continua a valer.` },
      { l: 7, o: '5 5\n', n: 'As duas variáveis podem ser usadas.' },
      { l: 8, x: { main: ['b', 'a', 't', 's'] }, n: H`Fim do main: as variáveis saem de âmbito. A <code>t</code> é a dona do texto, por isso o Rust liberta essa memória (drop), sem nenhum <code>free</code>.` },
    ],
  }, {
    title: 'Dar uma String a uma função',
    code: C`
fn mostra(texto: String) {
    println!("{texto}");
}

fn main() {
    let s = String::from("ola");
    mostra(s.clone());
    mostra(s);
    println!("fim");
}`,
    steps: [
      { l: 5, push: 'main', n: 'Começa o main.' },
      { l: 6, obj: { o1: ['String', '"ola"'] }, d: { main: { s: ['String', '@o1'] } }, n: H`<code>s</code> é a dona do texto.` },
      { l: 1, obj: { o2: ['String', '"ola"'] }, push: 'mostra', d: { mostra: { texto: ['String', '@o2'] } }, n: H`<code>s.clone()</code> cria uma <strong>cópia</strong> do texto (#2), e é essa cópia que a função recebe. O <code>s</code> continua dono do original.` },
      { l: 2, o: 'ola\n', n: 'A função mostra o texto.' },
      { l: 3, pop: true, n: H`A função acaba. O <code>texto</code> era dono da cópia, por isso a cópia é libertada aqui.` },
      { l: 1, push: 'mostra', d: { mostra: { texto: ['String', '@o1'] } }, u: { main: { s: '(movido)' } }, n: H`Agora <code>mostra(s)</code> sem clone: a posse do texto passa para a função, e o <code>s</code> do main fica movido.` },
      { l: 2, o: 'ola\n', n: 'Mostra outra vez.' },
      { l: 3, pop: true, n: 'A função acaba e liberta o texto original. O main já não tinha nada a libertar.' },
      { l: 9, o: 'fim\n', n: H`Daqui para a frente o <code>s</code> não se pode usar.` },
      { l: 10, x: { main: ['s'] }, n: 'Fim do main.' },
    ],
  }],
  mistakes: [
    H`Usar uma variável depois de a mover: <em>error[E0382]: borrow of moved value: &#96;s&#96;</em>. Ou usas <code>clone()</code>, ou emprestas com <code>&amp;</code> (próxima lição).`,
    H`Dar uma String a uma função e querer usá-la a seguir. Se a função só precisa de ler, recebe <code>&amp;String</code>.`,
    H`Usar <code>clone()</code> em todo o lado para calar o compilador: funciona, mas copia memória sem necessidade.`,
    H`Achar que os <code>i32</code> também se movem: são Copy, copiam-se sempre.`,
  ],
  quiz: [
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let s = String::from("a");
    let t = s;
    println!("{s}");
}`, opts: ['a', 'aa', 'error[E0382]: borrow of moved value: `s`', '(nada)'], ok: 2, mono: true, check: true,
      exp: H`<code>let t = s</code> moveu a String para <code>t</code>. A partir daí <code>s</code> não vale nada, e o compilador recusa usá-la.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let a = 5;
    let b = a;
    println!("{a} {b}");
}`, opts: ['5 5', '5', 'error[E0382]: borrow of moved value: `a`', '0 5'], ok: 0, mono: true, check: true,
      exp: H`Um <code>i32</code> é Copy: a atribuição copia o número e as duas variáveis continuam a valer.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let s = String::from("a");
    let t = s.clone();
    println!("{s}{t}");
}`, opts: ['aa', 'a', 'error[E0382]: borrow of moved value: `s`', 'a a'], ok: 0, mono: true, check: true,
      exp: H`<code>clone()</code> faz uma cópia a sério: há dois textos no heap, cada um com o seu dono. Os dois podem ser usados.` },
    { q: 'O que acontece com este programa?', code: C`
fn consome(x: String) {
    println!("{x}");
}

fn main() {
    let s = String::from("ola");
    consome(s);
    println!("{s}");
}`, opts: ['ola\nola', 'ola', 'error[E0382]: borrow of moved value: `s`', 'error[E0308]: mismatched types'], ok: 2, mono: true, check: true,
      exp: H`Passar a String à função move-a: a função fica dona e liberta-a no fim. O <code>println!("{s}")</code> seguinte já não compila.` },
  ],
  exercises: [{
    title: 'Duas cópias',
    text: 'Cria a String "Ana" em a, faz uma cópia em b e mostra as duas variáveis. Sem a cópia, o programa não compilava.',
    run: 'Ana Ana\n',
    hint: H`<code>let b = a.clone();</code>`,
    solution: C`
fn main() {
    let a = String::from("Ana");
    let b = a.clone();
    println!("{a} {b}");
}`,
  }, {
    title: 'Dar e receber de volta',
    text: 'Escreve fn exclama(mut s: String) -> String, que acrescenta "!" ao texto e o devolve. Usa-a com "ola" e mostra o resultado.',
    run: 'ola!\n',
    hint: H`Dentro da função: <code>s.push_str("!");</code> e depois <code>s</code> sem ponto e vírgula, para o devolver (e devolver a posse).`,
    solution: C`
fn exclama(mut s: String) -> String {
    s.push_str("!");
    s
}

fn main() {
    let texto = String::from("ola");
    let texto = exclama(texto);
    println!("{texto}");
}`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Emprestar: & e &mut',
  short: 'referências que não levam a posse, e a regra de um &mut de cada vez',
  body: H`
<p>Mover a posse para uma função só para ela ler o texto é incómodo. Em vez disso, <strong>empresta-se</strong>: <code>&amp;s</code> é uma referência para <code>s</code>, que deixa usar o valor sem ficar com ele. O dono continua a ser o <code>s</code>.</p>
<ul>
<li><code>fn tamanho(texto: &amp;String) -&gt; usize</code> recebe um empréstimo; chama-se com <code>tamanho(&amp;s)</code>. Depois da chamada, <code>s</code> continua a valer.</li>
<li>Uma referência <code>&amp;</code> só deixa ler. Para mudar, é preciso um empréstimo <strong>mutável</strong>: <code>&amp;mut s</code> (e a variável tem de ser <code>let mut</code>).</li>
<li>A regra de ouro: num dado momento, ou há <strong>vários <code>&amp;</code></strong>, ou há <strong>um só <code>&amp;mut</code></strong>, nunca as duas coisas. Assim ninguém lê um valor enquanto outro o está a mudar.</li>
<li>Uma referência nunca pode durar mais do que o valor para onde aponta (vês isto na próxima lição).</li>
</ul>
<p>É parecido com os apontadores do C (<code>&amp;</code> para a morada, <code>*</code> para lá chegar), mas o compilador verifica estas regras todas antes de o programa correr.</p>`,
  analogy: 'Emprestar um livro: quem o pede pode lê-lo, mas o livro continua a ser teu e volta para ti. Podes emprestá-lo a vários amigos para lerem ao mesmo tempo (vários &), mas se um o vai sublinhar (&mut), mais ninguém lhe pode mexer enquanto isso.',
  examples: [{
    title: 'Emprestar para ler',
    code: C`
fn tamanho(texto: &String) -> usize {
    texto.len()
}

fn main() {
    let s = String::from("ola");
    let n = tamanho(&s);
    println!("{s} tem {n} letras");
}`,
    steps: [
      { l: 5, push: 'main', n: 'Começa o main.' },
      { l: 6, obj: { o1: ['String', '"ola"'] }, d: { main: { s: ['String', '@o1'] } }, n: H`<code>s</code> é a dona do texto.` },
      { l: 1, push: 'tamanho', d: { tamanho: { texto: ['&String', '→ s (main)'] } }, n: H`<code>tamanho(&amp;s)</code> empresta o <code>s</code>. O parâmetro <code>texto</code> é uma referência para a variável <code>s</code>: não é dono de nada.` },
      { l: 2, n: H`Através da referência lê o tamanho: 3.` },
      { l: 7, pop: true, d: { main: { n: ['usize', '3'] } }, n: H`A função acaba. Como o <code>texto</code> não era dono, nada é libertado. (<code>usize</code> é o tipo dos tamanhos e índices.)` },
      { l: 8, o: 'ola tem 3 letras\n', n: H`O <code>s</code> continua a valer, porque só foi emprestado.` },
      { l: 9, x: { main: ['n', 's'] }, n: H`Fim do main: o dono, <code>s</code>, sai de âmbito e o texto é libertado.` },
    ],
  }, {
    title: 'Emprestar para mudar',
    code: C`
fn acrescenta(texto: &mut String) {
    texto.push_str(" mundo");
}

fn main() {
    let mut s = String::from("ola");
    acrescenta(&mut s);
    println!("{s}");
}`,
    steps: [
      { l: 5, push: 'main', n: 'Começa o main.' },
      { l: 6, obj: { o1: ['String', '"ola"'] }, d: { main: { s: ['mut String', '@o1'] } }, n: H`Para emprestar com <code>&amp;mut</code>, a variável tem de ser <code>mut</code>.` },
      { l: 1, push: 'acrescenta', d: { acrescenta: { texto: ['&mut String', '→ s (main)'] } }, n: H`Um empréstimo mutável: a função pode mudar o texto do <code>s</code>. Enquanto durar, mais ninguém pode usar o <code>s</code>.` },
      { l: 2, obj: { o1: ['String', '"ola mundo"'] }, n: H`<code>push_str</code> acrescenta texto, no heap do próprio <code>s</code>.` },
      { l: 3, pop: true, n: 'O empréstimo acaba com a função.' },
      { l: 8, o: 'ola mundo\n', n: H`O <code>s</code> vê a mudança, e voltou a poder ser usado.` },
      { l: 9, x: { main: ['s'] }, n: 'Fim do main: o texto é libertado.' },
    ],
  }],
  mistakes: [
    H`Mudar um valor enquanto há uma referência para ele: <em>error[E0502]: cannot borrow &#96;v&#96; as mutable because it is also borrowed as immutable</em>.`,
    H`Pedir <code>&amp;mut</code> de uma variável sem <code>mut</code>: <em>error[E0596]: cannot borrow &#96;s&#96; as mutable, as it is not declared as mutable</em>.`,
    H`Esquecer o <code>&amp;</code> na chamada (<code>tamanho(s)</code>): a função quer uma referência e recebe a String.`,
    H`Dois <code>&amp;mut</code> ao mesmo tempo para a mesma variável: <em>error[E0499]</em>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let s = String::from("ab");
    let r1 = &s;
    let r2 = &s;
    println!("{r1}{r2}{s}");
}`, opts: ['ababab', 'ab', 'error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable', 'abab'], ok: 0, mono: true, check: true,
      exp: H`Vários empréstimos só de leitura (<code>&amp;</code>) ao mesmo tempo são permitidos. Ninguém muda nada, por isso não há perigo.` },
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let mut s = String::from("a");
    let r = &s;
    s.push_str("b");
    println!("{r}");
}`, opts: ['a', 'ab', 'error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable', 'error[E0596]: cannot borrow `s` as mutable, as it is not declared as mutable'], ok: 2, mono: true, check: true,
      exp: H`O <code>r</code> está emprestado (e ainda vai ser usado no println). O <code>push_str</code> precisava de um empréstimo mutável do <code>s</code> ao mesmo tempo, e isso a regra não deixa. Em C isto podia deixar o r a apontar para memória já mudada de sítio.` },
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let s = String::from("a");
    let r = &mut s;
    r.push_str("b");
    println!("{r}");
}`, opts: ['ab', 'a', 'error[E0596]: cannot borrow `s` as mutable, as it is not declared as mutable', 'error[E0382]: borrow of moved value: `s`'], ok: 2, mono: true, check: true,
      exp: H`Só se pode emprestar para mudar uma variável declarada com <code>let mut</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let mut v = vec![1, 2];
    {
        let r = &mut v;
        r.push(3);
    }
    println!("{}", v.len());
}`, opts: ['2', '3', 'error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable', '1'], ok: 1, mono: true, check: true,
      exp: H`O empréstimo mutável acaba no fim do bloco interior. Depois disso, o <code>v</code> pode voltar a ser usado, e já tem 3 elementos.` },
  ],
  exercises: [{
    title: 'Contar vogais',
    text: 'Escreve fn conta_vogais(texto: &String) -> usize e usa-a com "engenharia". Depois da chamada, mostra também o próprio texto (que tem de continuar a valer).',
    run: 'engenharia tem 5 vogais\n',
    hint: H`Percorre <code>texto.chars()</code> com um for e conta quando <code>"aeiou".contains(c)</code>.`,
    solution: C`
fn conta_vogais(texto: &String) -> usize {
    let mut n = 0;
    for c in texto.chars() {
        if "aeiou".contains(c) {
            n += 1;
        }
    }
    n
}

fn main() {
    let s = String::from("engenharia");
    let n = conta_vogais(&s);
    println!("{s} tem {n} vogais");
}`,
  }, {
    title: 'Duplicar no sítio',
    text: 'Escreve fn duplica(v: &mut Vec<i32>), que multiplica por 2 cada elemento do vetor. Usa-a com [1, 2, 3] e mostra o vetor com {:?}.',
    run: '[2, 4, 6]\n',
    hint: H`<code>for x in v.iter_mut() { *x *= 2; }</code>. O <code>*</code> vai ao valor para onde a referência aponta, como em C.`,
    solution: C`
fn duplica(v: &mut Vec<i32>) {
    for x in v.iter_mut() {
        *x *= 2;
    }
}

fn main() {
    let mut numeros = vec![1, 2, 3];
    duplica(&mut numeros);
    println!("{:?}", numeros);
}`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Âmbito e drop',
  short: 'quando a memória é libertada, a ordem do drop, e referências que não podem durar mais',
  body: H`
<p>Cada par de chavetas <code>{ }</code> é um <strong>âmbito</strong>. Uma variável vive desde o <code>let</code> até à chaveta que fecha o seu bloco. Quando sai de âmbito, o Rust chama o <strong>drop</strong> do valor: se ela era dona de memória no heap, essa memória é libertada ali mesmo.</p>
<ul>
<li>As variáveis de um bloco são libertadas pela <strong>ordem inversa</strong> da criação: a última a ser criada é a primeira a sair.</li>
<li>Podes abrir um bloco só para limitar quanto tempo um valor (ou um empréstimo) dura.</li>
<li>Um bloco também é uma expressão: <code>let x = { let a = 2; a * 3 };</code> dá 6.</li>
<li>Uma referência não pode durar mais do que o valor para onde aponta. Se o compilador vir que podia ficar a apontar para memória já libertada, recusa: <em>error[E0597]: &#96;x&#96; does not live long enough</em>. É o "apontador pendurado" do C, apanhado antes de correr.</li>
</ul>
<p>Para veres o drop a acontecer, um tipo pode ter código próprio que corre nesse momento (<code>impl Drop</code>), como no exemplo.</p>`,
  analogy: 'Cada bloco é uma sala que alugas. Tudo o que levaste para lá é recolhido quando a sala fecha, pela ordem inversa à que entrou. E não podes deixar um bilhete a dizer "o meu casaco está na sala 3" depois de a sala 3 ter sido esvaziada.',
  examples: [{
    title: 'Ver o drop acontecer',
    code: C`
struct Barulho {
    nome: String,
}

impl Drop for Barulho {
    fn drop(&mut self) {
        println!("adeus {}", self.nome);
    }
}

fn main() {
    let a = Barulho { nome: String::from("a") };
    {
        let b = Barulho { nome: String::from("b") };
        println!("dentro do bloco");
    }
    println!("fora do bloco");
}`,
    steps: [
      { l: 11, push: 'main', n: H`O <code>impl Drop</code> diz que código corre quando um Barulho é libertado: escreve "adeus" e o nome.` },
      { l: 12, obj: { o1: ['String', '"a"'] }, d: { main: { a: ['Barulho', { nome: '@o1' }] } }, n: H`Um <code>Barulho</code> é um struct: fica na pilha, e o campo <code>nome</code> é dono de um texto no heap.` },
      { l: 13, n: 'Abre um bloco: um âmbito novo.' },
      { l: 14, obj: { o2: ['String', '"b"'] }, d: { main: { b: ['Barulho', { nome: '@o2' }] } }, n: H`<code>b</code> só existe dentro deste bloco.` },
      { l: 15, o: 'dentro do bloco\n', n: 'Ainda dentro do bloco.' },
      { l: 6, push: 'drop', d: { drop: { self: ['&mut Barulho', '→ b (main)'] } }, n: H`A chaveta da linha 16 fecha o bloco, e o <code>b</code> sai de âmbito. O Rust chama sozinho o <code>drop</code> do b.` },
      { l: 7, o: 'adeus b\n', n: 'É aqui que aparece a mensagem.' },
      { l: 16, pop: true, x: { main: ['b'] }, n: 'Depois do drop, o b desaparece e o texto dele é libertado.' },
      { l: 17, o: 'fora do bloco\n', n: H`O <code>a</code> continua vivo: pertence ao bloco do main.` },
      { l: 6, push: 'drop', d: { drop: { self: ['&mut Barulho', '→ a (main)'] } }, n: H`A chaveta da linha 18 fecha o main: agora é a vez do <code>a</code>.` },
      { l: 7, o: 'adeus a\n', n: 'A mensagem do a.' },
      { l: 18, pop: true, x: { main: ['a'] }, n: H`Ninguém escreveu <code>free</code> e não houve nenhuma fuga de memória.` },
    ],
  }],
  mistakes: [
    H`Guardar uma referência para uma variável de um bloco interior e usá-la fora: <em>error[E0597]: &#96;x&#96; does not live long enough</em>.`,
    H`Devolver de uma função uma referência para uma variável local da função: a variável morre quando a função acaba. Devolve o valor (a posse), não uma referência.`,
    H`Achar que é preciso libertar memória à mão: em Rust não há <code>free</code>.`,
    H`Estranhar a ordem das mensagens de drop: é a inversa da criação.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
struct B {
    nome: String,
}

impl Drop for B {
    fn drop(&mut self) {
        println!("adeus {}", self.nome);
    }
}

fn main() {
    let a = B { nome: String::from("a") };
    let b = B { nome: String::from("b") };
    println!("fim");
}`, opts: ['fim\nadeus a\nadeus b', 'fim\nadeus b\nadeus a', 'adeus a\nadeus b\nfim', 'fim'], ok: 1, mono: true, check: true,
      exp: H`Os dois saem de âmbito no fim do main, depois do "fim", pela ordem inversa da criação: primeiro o <code>b</code>, depois o <code>a</code>.` },
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{r}");
}`, opts: ['5', '0', 'error[E0597]: `x` does not live long enough', 'error[E0382]: borrow of moved value: `x`'], ok: 2, mono: true, check: true,
      exp: H`O <code>x</code> morre na chaveta que fecha o bloco, mas o <code>r</code>, que aponta para ele, ainda ia ser usado depois. Em C isto compilava e lia memória já libertada; o Rust recusa.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x = {
        let a = 2;
        a * 3
    };
    println!("{x}");
}`, opts: ['6', '2', '3', 'error[E0425]: cannot find value `a` in this scope'], ok: 0, mono: true, check: true,
      exp: H`Um bloco é uma expressão: a última linha, sem <code>;</code>, é o seu valor. O <code>a</code> só existe lá dentro, mas o resultado (6) sai para o x.` },
    { q: 'Quando é libertada a memória de uma String?', opts: ['Quando chamas free', 'Quando o seu dono sai de âmbito', 'Quando o programa acaba', 'Quando o garbage collector passa'], ok: 1,
      exp: 'No momento em que a variável dona sai de âmbito (a chaveta do seu bloco fecha), o Rust liberta a memória. Não há free à mão, nem um garbage collector a correr de vez em quando.' },
  ],
  exercises: [{
    title: 'A ordem do drop',
    text: 'Usando um struct com impl Drop que escreve "adeus" e o nome, cria três valores (um, dois e tres) no main e escreve "fim" no fim. Repara na ordem.',
    run: 'fim\nadeus tres\nadeus dois\nadeus um\n',
    hint: 'O mesmo struct Barulho do exemplo. Os três saem de âmbito no fim do main, ao contrário da ordem em que foram criados.',
    solution: C`
struct Barulho {
    nome: String,
}

impl Drop for Barulho {
    fn drop(&mut self) {
        println!("adeus {}", self.nome);
    }
}

fn main() {
    let a = Barulho { nome: String::from("um") };
    let b = Barulho { nome: String::from("dois") };
    let c = Barulho { nome: String::from("tres") };
    println!("fim");
}`,
  }, {
    title: 'Uma função que consome',
    text: 'Com o mesmo struct, escreve fn usa(b: Barulho) que escreve "a usar" e o nome. Chama-a com um Barulho chamado x e, a seguir, escreve "fim". O drop acontece antes ou depois do "fim"?',
    run: 'a usar x\nadeus x\nfim\n',
    hint: H`A função recebe o valor (move): passa a ser a dona, e o drop acontece quando <strong>ela</strong> acaba.`,
    solution: C`
struct Barulho {
    nome: String,
}

impl Drop for Barulho {
    fn drop(&mut self) {
        println!("adeus {}", self.nome);
    }
}

fn usa(b: Barulho) {
    println!("a usar {}", b.nome);
}

fn main() {
    let x = Barulho { nome: String::from("x") };
    usa(x);
    println!("fim");
}`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Structs e métodos',
  short: 'struct, impl, new, &self e &mut self, e #[derive(Debug)]',
  body: H`
<p>Um <code>struct</code> junta campos, como em C. Os métodos escrevem-se à parte, num bloco <code>impl</code>:</p>
<pre class="snip"><code>struct Conta {
    titular: String,
    saldo: i32,
}

impl Conta {
    fn new(titular: &amp;str) -&gt; Conta { ... }
    fn depositar(&amp;mut self, valor: i32) { ... }
}</code></pre>
<ul>
<li>O primeiro parâmetro diz como o método usa o objeto: <code>&amp;self</code> só lê; <code>&amp;mut self</code> pode mudar; <code>self</code> consome-o (move).</li>
<li>Um método sem <code>self</code> chama-se com <code>::</code>: <code>Conta::new("Ana")</code>. É o costume para criar valores (o "construtor").</li>
<li>Para chamar um método <code>&amp;mut self</code>, a variável tem de ser <code>let mut</code>.</li>
<li><code>#[derive(Debug)]</code> antes do struct deixa mostrá-lo com <code>{:?}</code>. Sem isso, o <code>println!</code> não sabe como o escrever.</li>
</ul>`,
  analogy: 'O struct é a ficha com os campos; o impl é o manual de instruções dessa ficha. &self é "consultar a ficha", &mut self é "corrigir a ficha", e self é "entregar a ficha a alguém para sempre".',
  examples: [{
    title: 'Uma conta bancária',
    code: C`
struct Conta {
    titular: String,
    saldo: i32,
}

impl Conta {
    fn new(titular: &str) -> Conta {
        Conta { titular: String::from(titular), saldo: 0 }
    }

    fn depositar(&mut self, valor: i32) {
        self.saldo += valor;
    }
}

fn main() {
    let mut c = Conta::new("Ana");
    c.depositar(50);
    c.depositar(20);
    println!("{}: {}", c.titular, c.saldo);
}`,
    steps: [
      { l: 16, push: 'main', n: 'Começa o main.' },
      { l: 7, push: 'new', d: { new: { titular: ['&str', '"Ana"'] } }, n: H`<code>Conta::new("Ana")</code> chama a função associada <code>new</code>, que não tem <code>self</code>.` },
      { l: 8, n: H`Constrói a Conta: o titular passa a ser uma String (no heap) e o saldo começa em 0. É a última expressão: é o valor devolvido.` },
      { l: 17, pop: true, obj: { o1: ['String', '"Ana"'] }, d: { main: { c: ['Conta', { titular: '@o1', saldo: '0' }] } }, n: H`A conta fica em <code>c</code> (que é <code>mut</code>, para os depósitos poderem mudar o saldo).` },
      { l: 11, push: 'depositar', d: { depositar: { self: ['&mut Conta', '→ c (main)'], valor: ['i32', '50'] } }, n: H`<code>c.depositar(50)</code>: o método recebe <code>&amp;mut self</code>, um empréstimo mutável do <code>c</code>.` },
      { l: 12, u: { main: { 'c.saldo': '50' } }, n: H`<code>self.saldo += valor</code> muda o saldo do próprio <code>c</code>.` },
      { l: 18, pop: true, n: 'O empréstimo acaba.' },
      { l: 11, push: 'depositar', d: { depositar: { self: ['&mut Conta', '→ c (main)'], valor: ['i32', '20'] } }, n: 'Segundo depósito.' },
      { l: 12, u: { main: { 'c.saldo': '70' } }, n: 'saldo = 50 + 20' },
      { l: 19, pop: true, n: 'Acaba.' },
      { l: 20, o: 'Ana: 70\n', n: 'Mostra os campos.' },
      { l: 21, x: { main: ['c'] }, n: H`Fim do main: o <code>c</code> sai de âmbito e o texto do titular é libertado.` },
    ],
  }, {
    title: 'Mostrar com {:?}',
    code: C`
#[derive(Debug)]
struct Ponto {
    x: i32,
    y: i32,
}

fn main() {
    let p = Ponto { x: 1, y: 2 };
    let q = Ponto { x: 5, ..p };
    println!("{:?}", p);
    println!("{:?}", q);
}`,
    steps: [
      { l: 7, push: 'main', n: H`O <code>#[derive(Debug)]</code> pede ao compilador que escreva sozinho o código para mostrar um Ponto.` },
      { l: 8, d: { main: { p: ['Ponto', { x: '1', y: '2' }] } }, n: 'Um Ponto, na pilha (só tem números).' },
      { l: 9, d: { main: { q: ['Ponto', { x: '5', y: '2' }] } }, n: H`<code>..p</code> quer dizer "os outros campos vêm do p": o y é 2.` },
      { l: 10, o: 'Ponto { x: 1, y: 2 }\n', n: H`<code>{:?}</code> mostra o struct com os nomes dos campos. Com <code>{}</code> não compilava.` },
      { l: 11, o: 'Ponto { x: 5, y: 2 }\n', n: 'O q.' },
      { l: 12, x: { main: ['q', 'p'] }, n: 'Fim do main.' },
    ],
  }],
  mistakes: [
    H`Chamar um método <code>&amp;mut self</code> numa variável sem <code>mut</code>: <em>error[E0596]: cannot borrow &#96;c&#96; as mutable, as it is not declared as mutable</em>.`,
    H`Mostrar um struct com <code>{}</code>: <em>error[E0277]: &#96;Ponto&#96; doesn't implement &#96;std::fmt::Display&#96;</em>. Usa <code>#[derive(Debug)]</code> e <code>{:?}</code>.`,
    H`Esquecer o <code>self.</code> dentro de um método: <code>saldo += valor</code> não encontra a variável.`,
    H`Escrever <code>Conta.new(...)</code>: as funções associadas chamam-se com <code>::</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
struct Retangulo {
    largura: i32,
    altura: i32,
}

impl Retangulo {
    fn area(&self) -> i32 {
        self.largura * self.altura
    }
}

fn main() {
    let r = Retangulo { largura: 3, altura: 4 };
    println!("{}", r.area());
}`, opts: ['12', '7', '34', 'error[E0599]'], ok: 0, mono: true, check: true,
      exp: H`O método recebe <code>&amp;self</code> (só lê) e devolve 3 × 4.` },
    { q: 'O que acontece com este programa?', code: C`
struct Contador {
    valor: i32,
}

impl Contador {
    fn mais(&mut self) {
        self.valor += 1;
    }
}

fn main() {
    let c = Contador { valor: 0 };
    c.mais();
    println!("{}", c.valor);
}`, opts: ['1', '0', 'error[E0596]: cannot borrow `c` as mutable, as it is not declared as mutable', 'error[E0384]: cannot assign twice to immutable variable `c`'], ok: 2, mono: true, check: true,
      exp: H`O <code>mais</code> precisa de <code>&amp;mut self</code>, e só se pode emprestar para mudar uma variável <code>let mut</code>. Com <code>let mut c</code> dava 1.` },
    { q: 'O que acontece com este programa?', code: C`
struct Ponto {
    x: i32,
}

fn main() {
    let p = Ponto { x: 1 };
    println!("{}", p);
}`, opts: ['Ponto { x: 1 }', '1', "error[E0277]: `Ponto` doesn't implement `std::fmt::Display`", 'p'], ok: 2, mono: true, check: true,
      exp: H`O <code>{}</code> precisa de saber mostrar o tipo "para pessoas" (Display), e um struct novo não sabe. Com <code>#[derive(Debug)]</code> e <code>{:?}</code> aparecia <code>Ponto { x: 1 }</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
struct Contador {
    valor: i32,
}

impl Contador {
    fn new() -> Contador {
        Contador { valor: 10 }
    }

    fn mais(&mut self, n: i32) {
        self.valor += n;
    }
}

fn main() {
    let mut c = Contador::new();
    c.mais(5);
    c.mais(1);
    println!("{}", c.valor);
}`, opts: ['16', '6', '10', '15'], ok: 0, mono: true, check: true,
      exp: H`O <code>new</code> começa em 10, e os dois métodos somam 5 e 1.` },
  ],
  exercises: [{
    title: 'Retângulo',
    text: 'Cria o struct Retangulo com largura e altura, e um impl com new, area e perimetro. Mostra os valores para um retângulo 3 × 4.',
    run: 'Area: 12, Perimetro: 14\n',
    hint: H`<code>fn new(largura: i32, altura: i32) -&gt; Retangulo { Retangulo { largura, altura } }</code>: quando o parâmetro tem o nome do campo, basta escrevê-lo uma vez.`,
    solution: C`
struct Retangulo {
    largura: i32,
    altura: i32,
}

impl Retangulo {
    fn new(largura: i32, altura: i32) -> Retangulo {
        Retangulo { largura, altura }
    }

    fn area(&self) -> i32 {
        self.largura * self.altura
    }

    fn perimetro(&self) -> i32 {
        2 * (self.largura + self.altura)
    }
}

fn main() {
    let r = Retangulo::new(3, 4);
    println!("Area: {}, Perimetro: {}", r.area(), r.perimetro());
}`,
  }, {
    title: 'Aluno com Debug',
    text: 'Cria o struct Aluno (nome: String, nota: i32) com #[derive(Debug)] e um método aprovado(&self) -> bool. Mostra o aluno com {:?} e se está aprovado.',
    run: 'Aluno { nome: "Ana", nota: 17 } aprovado: true\n',
    hint: H`O método é <code>self.nota &gt;= 10</code>. O <code>{:?}</code> mostra os textos entre aspas.`,
    solution: C`
#[derive(Debug)]
struct Aluno {
    nome: String,
    nota: i32,
}

impl Aluno {
    fn aprovado(&self) -> bool {
        self.nota >= 10
    }
}

fn main() {
    let a = Aluno { nome: String::from("Ana"), nota: 17 };
    println!("{:?} aprovado: {}", a, a.aprovado());
}`,
  }],
});
