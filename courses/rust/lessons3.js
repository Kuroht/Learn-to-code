// ===== Rust do Zero — conteúdo das lições (parte 3) =====
// Nota: dentro de H`...` os acentos graves das mensagens do compilador escrevem-se &#96;.

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Enums, Option e match',
  short: 'um valor que é uma de várias coisas, e o fim do NULL',
  body: H`
<p>Um <code>enum</code> é um tipo cujo valor é <strong>uma de várias variantes</strong>: <code>enum Semaforo { Verde, Amarelo, Vermelho }</code>. As variantes podem até levar dados: <code>Quadrado(i32)</code>, <code>Retangulo(i32, i32)</code>.</p>
<p>O <code>match</code> escolhe o que fazer conforme a variante, e é <strong>obrigado a tratar todas</strong>: se faltar uma, não compila. <code>_</code> apanha "todas as outras".</p>
<p>O enum mais importante é o <code>Option&lt;T&gt;</code>, que substitui o <code>NULL</code> do C:</p>
<ul>
<li>Um valor que pode não existir é um <code>Option</code>: <code>Some(valor)</code> ou <code>None</code>.</li>
<li>O compilador não te deixa usar o valor sem tratares o caso <code>None</code>: acabam os acessos a um apontador nulo.</li>
<li><code>if let Some(x) = opcao { ... }</code> trata só o caso que interessa. <code>unwrap_or(0)</code> dá o valor ou 0. <code>unwrap()</code> dá o valor, mas entra em pânico (pára o programa) se for <code>None</code>.</li>
</ul>`,
  analogy: 'Um Option é uma caixa de correio: pode ter uma carta (Some) ou estar vazia (None). Antes de leres a carta, és obrigado a abrir a caixa e ver. Em C, o NULL era uma caixa que às vezes nem existia, e só davas por isso quando a tentavas abrir.',
  examples: [{
    title: 'Um match sobre um enum',
    code: C`
enum Semaforo {
    Verde,
    Amarelo,
    Vermelho,
}

fn mostra(s: Semaforo) {
    match s {
        Semaforo::Verde => println!("passar"),
        Semaforo::Amarelo => println!("abrandar"),
        Semaforo::Vermelho => println!("parar"),
    }
}

fn main() {
    mostra(Semaforo::Amarelo);
    mostra(Semaforo::Vermelho);
}`,
    steps: [
      { l: 15, push: 'main', n: H`O enum <code>Semaforo</code> tem três variantes; um valor deste tipo é sempre exatamente uma delas.` },
      { l: 7, push: 'mostra', d: { mostra: { s: ['Semaforo', 'Amarelo'] } }, n: H`Chama <code>mostra</code> com a variante Amarelo.` },
      { l: 8, n: H`O <code>match</code> compara o valor com cada braço, de cima para baixo.` },
      { l: 10, o: 'abrandar\n', n: 'Encontrou o braço do Amarelo.' },
      { l: 16, pop: true, n: 'Volta ao main.' },
      { l: 7, push: 'mostra', d: { mostra: { s: ['Semaforo', 'Vermelho'] } }, n: 'Agora com Vermelho.' },
      { l: 11, o: 'parar\n', n: H`Se apagasses esta linha, o programa não compilava: o <code>match</code> tem de tratar todas as variantes.` },
      { l: 17, pop: true, n: 'Fim.' },
    ],
  }, {
    title: 'Option: pode não haver resultado',
    code: C`
fn procura(v: &Vec<i32>, alvo: i32) -> Option<usize> {
    for i in 0..v.len() {
        if v[i] == alvo {
            return Some(i);
        }
    }
    None
}

fn main() {
    let v = vec![4, 8, 15];
    match procura(&v, 8) {
        Some(i) => println!("encontrei na posicao {i}"),
        None => println!("nao existe"),
    }
    match procura(&v, 7) {
        Some(i) => println!("encontrei na posicao {i}"),
        None => println!("nao existe"),
    }
}`,
    steps: [
      { l: 10, push: 'main', n: 'Começa o main.' },
      { l: 11, obj: { o1: ['Vec<i32>', ['4', '8', '15']] }, d: { main: { v: ['Vec<i32>', '@o1'] } }, n: H`Um vetor: os elementos vivem no heap e <code>v</code> é o dono.` },
      { l: 1, push: 'procura', d: { procura: { v: ['&Vec<i32>', '→ v (main)'], alvo: ['i32', '8'] } }, n: H`A função recebe o vetor emprestado e devolve um <code>Option&lt;usize&gt;</code>: uma posição, ou nada.` },
      { l: 2, d: { procura: { i: ['usize', '0'] } }, n: 'i = 0' },
      { l: 3, n: 'v[0] é 4. 4 == 8? Não.' },
      { l: 2, u: { procura: { i: '1' } }, n: 'i = 1' },
      { l: 4, n: H`v[1] é 8: encontrou. Devolve <code>Some(1)</code>.` },
      { l: 12, pop: true, n: H`O <code>match</code> recebe <code>Some(1)</code> e entra no braço <code>Some(i)</code>, com i = 1.` },
      { l: 13, o: 'encontrei na posicao 1\n', n: 'Mostra a posição.' },
      { l: 1, push: 'procura', d: { procura: { v: ['&Vec<i32>', '→ v (main)'], alvo: ['i32', '7'] } }, n: 'Agora procura o 7.' },
      { l: 7, n: H`Percorreu os três sem encontrar: chega ao fim e devolve <code>None</code>. Em C devolverias -1 e tinhas de te lembrar de o testar.` },
      { l: 16, pop: true, n: H`O <code>match</code> recebe <code>None</code>.` },
      { l: 18, o: 'nao existe\n', n: H`Sem o braço <code>None</code>, não compilava: o Rust obriga a pensar no caso de não haver resultado.` },
      { l: 20, x: { main: ['v'] }, n: 'Fim do main: o vetor é libertado.' },
    ],
  }],
  mistakes: [
    H`Esquecer uma variante no <code>match</code>: <em>error[E0004]: non-exhaustive patterns</em>. Trata-a, ou usa <code>_</code>.`,
    H`Usar <code>unwrap()</code> em todo o lado: se o valor for <code>None</code>, o programa entra em pânico. Usa <code>match</code>, <code>if let</code> ou <code>unwrap_or</code>.`,
    H`Escrever só <code>Verde</code> em vez de <code>Semaforo::Verde</code>.`,
    H`Tentar somar um <code>Option&lt;i32&gt;</code> a um <code>i32</code>: primeiro tens de tirar o valor de dentro do Some.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let n = 3;
    let nome = match n {
        1 => "um",
        2 => "dois",
        _ => "outro",
    };
    println!("{nome}");
}`, opts: ['outro', 'um', 'dois', 'error[E0004]: non-exhaustive patterns'], ok: 0, mono: true, check: true,
      exp: H`3 não é 1 nem 2, por isso cai no <code>_</code>, que apanha tudo o resto. Como o if, o <code>match</code> devolve um valor.` },
    { q: 'O que acontece com este programa?', code: C`
enum Cor {
    Verde,
    Azul,
    Rosa,
}

fn main() {
    let c = Cor::Rosa;
    match c {
        Cor::Verde => println!("verde"),
        Cor::Azul => println!("azul"),
    }
}`, opts: ['(nada)', 'verde', 'error[E0004]: non-exhaustive patterns: `Cor::Rosa` not covered', 'rosa'], ok: 2, mono: true, check: true,
      exp: H`O <code>match</code> não trata a variante Rosa. Em C, um switch sem esse case passava sem dizer nada; em Rust nem compila.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x: Option<i32> = None;
    let y: Option<i32> = Some(5);
    println!("{} {}", x.unwrap_or(0), y.unwrap_or(0));
}`, opts: ['0 5', '0 0', 'None 5', "thread 'main' panicked: called `Option::unwrap()` on a `None` value"], ok: 0, mono: true, check: true,
      exp: H`<code>unwrap_or(0)</code> dá o valor de dentro do Some, ou 0 se for None.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let x: Option<i32> = None;
    println!("antes");
    println!("{}", x.unwrap());
}`, opts: ['antes\n0', 'antes', "antes\nthread 'main' panicked: called `Option::unwrap()` on a `None` value", 'antes\nNone'], ok: 2, mono: true, check: true,
      exp: H`<code>unwrap()</code> num <code>None</code> entra em pânico: o programa pára com uma mensagem. (Na tua máquina a mensagem diz também a linha e o número da thread.)` },
  ],
  exercises: [{
    title: 'Divisão que pode falhar',
    text: 'Escreve fn divide(a: i32, b: i32) -> Option<i32> que devolve None quando b é 0. Mostra o resultado de divide(10, 2) e de divide(1, 0), escrevendo "impossivel" quando não há resultado.',
    run: '5\nimpossivel\n',
    hint: H`Dentro da função: <code>if b == 0 { None } else { Some(a / b) }</code>. No main, um <code>match</code> para cada chamada.`,
    solution: C`
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn mostra(r: Option<i32>) {
    match r {
        Some(v) => println!("{v}"),
        None => println!("impossivel"),
    }
}

fn main() {
    mostra(divide(10, 2));
    mostra(divide(1, 0));
}`,
  }, {
    title: 'Formas com dados',
    text: 'Cria enum Forma { Quadrado(i32), Retangulo(i32, i32) } e uma função area(f: Forma) -> i32 com um match. Mostra a área de um quadrado de lado 2 e de um retângulo 3 × 4.',
    run: '4\n12\n',
    hint: H`Os braços tiram os dados de dentro da variante: <code>Forma::Quadrado(l) =&gt; l * l</code>.`,
    solution: C`
enum Forma {
    Quadrado(i32),
    Retangulo(i32, i32),
}

fn area(f: Forma) -> i32 {
    match f {
        Forma::Quadrado(l) => l * l,
        Forma::Retangulo(l, a) => l * a,
    }
}

fn main() {
    println!("{}", area(Forma::Quadrado(2)));
    println!("{}", area(Forma::Retangulo(3, 4)));
}`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Result: erros que se tratam',
  short: 'Ok e Err, parse, unwrap, expect e o operador ?',
  body: H`
<p>Em C, um erro era um valor especial que tinhas de te lembrar de testar (o <code>scanf</code> devolvia quantos leu, o <code>fopen</code> devolvia <code>NULL</code>). Em Rust, uma operação que pode falhar devolve um <code>Result</code>, outro enum:</p>
<ul>
<li><code>Ok(valor)</code> quando correu bem, <code>Err(erro)</code> quando não.</li>
<li>Por exemplo, <code>"42".parse::&lt;i32&gt;()</code> dá <code>Ok(42)</code> e <code>"sete".parse::&lt;i32&gt;()</code> dá um <code>Err</code>.</li>
<li>Trata-se com <code>match</code>, como o Option. <code>unwrap()</code> e <code>expect("mensagem")</code> tiram o valor, mas entram em pânico se for um Err: só para quando tens a certeza.</li>
<li>Dentro de uma função que também devolve <code>Result</code>, o <strong><code>?</code></strong> faz "se for Err, devolve já esse erro; se for Ok, continua com o valor". Poupa um match a cada passo.</li>
</ul>`,
  analogy: 'Um Result é a resposta de uma encomenda: ou chega o pacote (Ok), ou chega um aviso a dizer porque não veio (Err). O ? é passar o aviso diretamente a quem te pediu a encomenda, em vez de seres tu a resolver.',
  examples: [{
    title: 'Converter texto em número',
    code: C`
fn main() {
    let textos = ["42", "sete"];
    for t in textos {
        match t.parse::<i32>() {
            Ok(n) => println!("{t} -> {}", n * 2),
            Err(e) => println!("{t} -> erro: {e}"),
        }
    }
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, d: { main: { textos: ['[&str; 2]', ['"42"', '"sete"']] } }, n: 'Um array com dois textos.' },
      { l: 3, d: { main: { t: ['&str', '"42"'] } }, n: 'Primeira volta: t = "42".' },
      { l: 4, n: H`<code>parse</code> consegue converter: devolve <code>Ok(42)</code>.` },
      { l: 5, o: '42 -> 84\n', n: H`O braço <code>Ok(n)</code> tira o 42 de dentro e usa-o.` },
      { l: 3, u: { main: { t: '"sete"' } }, n: 'Segunda volta: t = "sete".' },
      { l: 4, n: H`"sete" não é um número: <code>parse</code> devolve um <code>Err</code>, com a explicação do erro lá dentro.` },
      { l: 6, o: 'sete -> erro: invalid digit found in string\n', n: H`O braço <code>Err(e)</code> trata o erro. O programa não pára: o erro foi tratado.` },
      { l: 9, x: { main: ['t', 'textos'] }, n: 'Fim do main.' },
    ],
  }, {
    title: 'O operador ?',
    code: C`
use std::num::ParseIntError;

fn soma(a: &str, b: &str) -> Result<i32, ParseIntError> {
    let x: i32 = a.parse()?;
    let y: i32 = b.parse()?;
    Ok(x + y)
}

fn main() {
    println!("{:?}", soma("2", "3"));
    println!("{:?}", soma("2", "tres"));
}`,
    steps: [
      { l: 9, push: 'main', n: H`A função <code>soma</code> devolve um Result: a soma, ou o erro de conversão (<code>ParseIntError</code>).` },
      { l: 3, push: 'soma', d: { soma: { a: ['&str', '"2"'], b: ['&str', '"3"'] } }, n: H`<code>soma("2", "3")</code>.` },
      { l: 4, d: { soma: { x: ['i32', '2'] } }, n: H`<code>a.parse()</code> dá <code>Ok(2)</code>, e o <code>?</code> tira o 2 de dentro.` },
      { l: 5, d: { soma: { y: ['i32', '3'] } }, n: 'O mesmo para o b.' },
      { l: 6, n: H`Tudo correu bem: devolve <code>Ok(5)</code>.` },
      { l: 10, pop: true, o: 'Ok(5)\n', n: H`O <code>{:?}</code> mostra o Result tal como é.` },
      { l: 3, push: 'soma', d: { soma: { a: ['&str', '"2"'], b: ['&str', '"tres"'] } }, n: H`Agora <code>soma("2", "tres")</code>.` },
      { l: 4, d: { soma: { x: ['i32', '2'] } }, n: 'O primeiro converte bem.' },
      { l: 5, n: H`"tres" não converte: <code>parse</code> dá um Err, e o <code>?</code> faz a função <strong>devolver já</strong> esse erro. A linha 6 nunca corre.` },
      { l: 11, pop: true, o: 'Err(ParseIntError { kind: InvalidDigit })\n', n: 'O erro chegou ao main sem nenhum match pelo caminho.' },
    ],
  }],
  mistakes: [
    H`Usar <code>unwrap()</code> em dados que vêm do utilizador: um texto errado faz o programa entrar em pânico. Trata o <code>Err</code>.`,
    H`Usar <code>?</code> no <code>main</code> ou numa função que não devolve <code>Result</code> (ou Option): não compila.`,
    H`Esquecer o <code>trim()</code> antes do <code>parse</code> quando o texto vem de <code>read_line</code>: a linha traz o Enter no fim e a conversão falha.`,
    H`Esquecer o tipo: <code>"5".parse()</code> sozinho não sabe para que tipo converter. Escreve <code>parse::&lt;i32&gt;()</code> ou <code>let n: i32 = ...</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let r = match "12".parse::<i32>() {
        Ok(n) => n + 1,
        Err(_) => 0,
    };
    println!("{r}");
}`, opts: ['13', '121', '0', '12'], ok: 0, mono: true, check: true,
      exp: H`"12" converte bem: <code>Ok(12)</code>, e o braço Ok devolve 12 + 1.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let n: i32 = "abc".parse().unwrap();
    println!("{n}");
}`, opts: ['0', 'abc', "thread 'main' panicked: called `Result::unwrap()` on an `Err` value: ParseIntError { kind: InvalidDigit }", 'error[E0308]: mismatched types'], ok: 2, mono: true, check: true,
      exp: H`O <code>parse</code> devolve um Err e o <code>unwrap()</code> entra em pânico. Compila bem; o problema só aparece a correr, com este texto.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let r: Result<i32, String> = Err(String::from("mau"));
    println!("{}", r.unwrap_or(-1));
}`, opts: ['-1', 'mau', 'Err("mau")', "thread 'main' panicked: called `Result::unwrap()` on an `Err` value: \"mau\""], ok: 0, mono: true, check: true,
      exp: H`<code>unwrap_or(-1)</code> dá o valor do Ok, ou -1 se for um Err. Não entra em pânico.` },
    { q: 'O que faz o ? em let x: i32 = a.parse()?; ?', opts: ['Ignora o erro e põe 0 em x', 'Se for Err, a função devolve esse erro logo; se for Ok, x fica com o valor', 'Entra sempre em pânico', 'Pergunta ao utilizador se quer continuar'], ok: 1,
      exp: H`O <code>?</code> é um atalho para um match: o Ok dá o valor e o Err faz <code>return Err(...)</code>. Por isso só se pode usar numa função que devolve Result (ou Option).` },
  ],
  exercises: [{
    title: 'Ler um número',
    text: 'Lê uma linha do teclado e, se for um número inteiro, mostra o dobro; se não for, mostra "nao e um numero".',
    run: 'Numero: ⟦abc⟧nao e um numero\n',
    hint: H`<code>let mut linha = String::new(); std::io::stdin().read_line(&amp;mut linha).unwrap();</code> e depois <code>match linha.trim().parse::&lt;i32&gt;()</code>. Usa <code>print!</code> e <code>std::io::Write</code> para a pergunta aparecer antes de leres.`,
    solution: C`
use std::io::Write;

fn main() {
    print!("Numero: ");
    std::io::stdout().flush().unwrap();
    let mut linha = String::new();
    std::io::stdin().read_line(&mut linha).unwrap();
    match linha.trim().parse::<i32>() {
        Ok(n) => println!("dobro: {}", n * 2),
        Err(_) => println!("nao e um numero"),
    }
}`,
  }, {
    title: 'Validar notas',
    text: 'Escreve fn valida(nota: i32) -> Result<i32, String> que devolve Err("nota fora de 0 a 20") quando a nota está fora do intervalo. Mostra com {:?} o resultado para 15 e para 25.',
    run: 'Ok(15)\nErr("nota fora de 0 a 20")\n',
    hint: H`<code>if nota &gt;= 0 &amp;&amp; nota &lt;= 20 { Ok(nota) } else { Err(String::from("...")) }</code>`,
    solution: C`
fn valida(nota: i32) -> Result<i32, String> {
    if nota >= 0 && nota <= 20 {
        Ok(nota)
    } else {
        Err(String::from("nota fora de 0 a 20"))
    }
}

fn main() {
    println!("{:?}", valida(15));
    println!("{:?}", valida(25));
}`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Vec e String',
  short: 'push, pop, get, percorrer com & e &mut, e construir texto',
  body: H`
<p>O <code>Vec&lt;T&gt;</code> é a lista que cresce (o array do C que precisava de <code>malloc</code> e <code>realloc</code>). Os elementos vivem no heap e a variável é a dona.</p>
<ul>
<li><code>vec![12, 17]</code> cria; <code>push</code> acrescenta; <code>pop()</code> tira o último e devolve um <code>Option</code> (o vetor pode estar vazio); <code>len()</code> dá o tamanho.</li>
<li><code>v[i]</code> fora dos limites entra em pânico; <code>v.get(i)</code> devolve um <code>Option</code>, sem pânico.</li>
<li><code>for x in &amp;v</code> percorre emprestando (o v continua a valer); <code>for x in &amp;mut v</code> deixa mudar cada elemento com <code>*x</code>; <code>for x in v</code> <strong>consome</strong> o vetor (move).</li>
<li><code>v.iter().sum()</code> soma tudo; <code>{:?}</code> mostra o vetor todo.</li>
</ul>
<p>Uma <code>String</code> também é um vetor por dentro (de bytes): cresce com <code>push_str("...")</code> e <code>push('c')</code>. Um texto entre aspas no código é um <code>&amp;str</code>: um empréstimo de um texto fixo, que não se pode mudar.</p>`,
  analogy: 'Um Vec é uma prateleira extensível: acrescentas livros no fim (push) e tiras o último (pop). Emprestar a prateleira (&v) deixa ver; &mut v deixa arrumar; e dá-la (v) é ficar sem ela.',
  examples: [{
    title: 'Mexer num vetor',
    code: C`
fn main() {
    let mut notas = vec![12, 17, 9];
    notas.push(15);
    let ultima = notas.pop();
    println!("{:?} {:?}", notas, ultima);
    for n in &mut notas {
        *n += 1;
    }
    let soma: i32 = notas.iter().sum();
    println!("{:?} soma = {soma}", notas);
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, obj: { o1: ['Vec<i32>', ['12', '17', '9']] }, d: { main: { notas: ['mut Vec<i32>', '@o1'] } }, n: H`O vetor fica no heap; <code>notas</code> é a dona.` },
      { l: 3, obj: { o1: ['Vec<i32>', ['12', '17', '9', '15']] }, n: H`<code>push</code> acrescenta no fim (o vetor cresce sozinho).` },
      { l: 4, obj: { o1: ['Vec<i32>', ['12', '17', '9']] }, d: { main: { ultima: ['Option<i32>', 'Some(15)'] } }, n: H`<code>pop()</code> tira o último e devolve-o dentro de um <code>Some</code>. Num vetor vazio devolvia <code>None</code>.` },
      { l: 5, o: '[12, 17, 9] Some(15)\n', n: H`<code>{:?}</code> mostra o vetor e o Option.` },
      { l: 6, d: { main: { n: ['&mut i32', '→ notas[0]'] } }, n: H`<code>for n in &amp;mut notas</code>: em cada volta, <code>n</code> é um empréstimo mutável de um elemento.` },
      { l: 7, obj: { o1: ['Vec<i32>', ['13', '17', '9']] }, n: H`<code>*n += 1</code>: o <code>*</code> vai ao elemento para onde o n aponta, como em C.` },
      { l: 6, u: { main: { n: '→ notas[1]' } }, n: 'Segundo elemento.' },
      { l: 7, obj: { o1: ['Vec<i32>', ['13', '18', '9']] }, n: '17 passa a 18.' },
      { l: 6, u: { main: { n: '→ notas[2]' } }, n: 'Terceiro elemento.' },
      { l: 7, obj: { o1: ['Vec<i32>', ['13', '18', '10']] }, n: '9 passa a 10.' },
      { l: 9, x: { main: ['n'] }, d: { main: { soma: ['i32', '41'] } }, n: '13 + 18 + 10 = 41' },
      { l: 10, o: '[13, 18, 10] soma = 41\n', n: H`O vetor foi só emprestado ao ciclo, por isso <code>notas</code> continua a valer.` },
      { l: 11, x: { main: ['soma', 'ultima', 'notas'] }, n: 'Fim do main: o vetor é libertado.' },
    ],
  }, {
    title: 'Construir um texto',
    code: C`
fn main() {
    let mut s = String::new();
    for palavra in ["um", "dois", "tres"] {
        s.push_str(palavra);
        s.push(' ');
    }
    let s = s.trim().to_uppercase();
    println!("{s} ({} letras)", s.len());
}`,
    steps: [
      { l: 1, push: 'main', n: 'Começa o main.' },
      { l: 2, obj: { o1: ['String', '""'] }, d: { main: { s: ['mut String', '@o1'] } }, n: H`Uma String vazia, que vai crescer.` },
      { l: 3, d: { main: { palavra: ['&str', '"um"'] } }, n: 'Primeira palavra.' },
      { l: 4, obj: { o1: ['String', '"um"'] }, n: H`<code>push_str</code> acrescenta um texto.` },
      { l: 5, obj: { o1: ['String', '"um "'] }, n: H`<code>push</code> acrescenta um só carácter (entre plicas).` },
      { l: 3, u: { main: { palavra: '"dois"' } }, n: 'Segunda palavra.' },
      { l: 5, obj: { o1: ['String', '"um dois "'] }, n: 'Mais uma palavra e um espaço.' },
      { l: 3, u: { main: { palavra: '"tres"' } }, n: 'Terceira palavra.' },
      { l: 5, obj: { o1: ['String', '"um dois tres "'] }, n: 'Fica um espaço a mais no fim.' },
      { l: 7, x: { main: ['palavra', 's'] }, obj: { o2: ['String', '"UM DOIS TRES"'] }, d: { main: { s: ['String', '@o2'] } }, n: H`<code>trim()</code> tira os espaços das pontas e <code>to_uppercase()</code> cria uma String <strong>nova</strong>, em maiúsculas. O <code>let s</code> sombreia a antiga, que fica sem dono e é libertada.` },
      { l: 8, o: 'UM DOIS TRES (12 letras)\n', n: H`<code>len()</code> conta os bytes: aqui, 12 (com os espaços).` },
      { l: 9, x: { main: ['s'] }, n: 'Fim do main.' },
    ],
  }],
  mistakes: [
    H`Aceder fora dos limites com <code>v[i]</code>: o programa entra em pânico (<em>index out of bounds</em>). Se o índice pode não existir, usa <code>v.get(i)</code>.`,
    H`Percorrer com <code>for x in v</code> e querer usar o <code>v</code> depois: o ciclo consumiu-o (<em>error[E0382]</em>). Percorre com <code>&amp;v</code>.`,
    H`Mudar o vetor enquanto o percorres com <code>&amp;v</code> (por exemplo, fazer <code>push</code> dentro do ciclo): o compilador não deixa.`,
    H`Esquecer que <code>pop()</code> devolve um <code>Option</code>, e não o valor diretamente.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let mut v = vec![1, 2, 3];
    v.push(4);
    println!("{} {}", v.len(), v[0]);
}`, opts: ['4 1', '3 1', '4 4', '4 0'], ok: 0, mono: true, check: true,
      exp: H`Depois do <code>push</code> o vetor tem 4 elementos, e o de índice 0 continua a ser o 1.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let v = vec![1, 2, 3];
    println!("{:?} {:?}", v.get(1), v.get(10));
}`, opts: ['Some(2) None', '2 None', 'Some(1) None', "thread 'main' panicked: index out of bounds: the len is 3 but the index is 10"], ok: 0, mono: true, check: true,
      exp: H`<code>get</code> devolve um Option: <code>Some(2)</code> para o índice 1 e <code>None</code> para um índice que não existe, sem pânico.` },
    { q: 'O que aparece no ecrã?', code: C`
fn main() {
    let v = vec![1, 2, 3];
    let i = 10;
    println!("{}", v[i]);
}`, opts: ['0', 'None', "thread 'main' panicked: index out of bounds: the len is 3 but the index is 10", 'Um valor qualquer (lixo)'], ok: 2, mono: true, check: true,
      exp: 'Com [ ] e um índice que não existe, o programa entra em pânico. Em C lias memória que não era tua; em Rust o acesso é sempre verificado.' },
    { q: 'O que acontece com este programa?', code: C`
fn main() {
    let v = vec![1, 2, 3];
    for x in v {
        print!("{x} ");
    }
    println!("{}", v.len());
}`, opts: ['1 2 3 3', '1 2 3', 'error[E0382]: borrow of moved value: `v`', "thread 'main' panicked: index out of bounds: the len is 3 but the index is 3"], ok: 2, mono: true, check: true,
      exp: H`<code>for x in v</code> consome o vetor: o ciclo fica dono dele. Depois disso, <code>v</code> já não vale. Com <code>for x in &amp;v</code> funcionava.` },
  ],
  exercises: [{
    title: 'O maior',
    text: 'Dado o vetor [4, 8, 15, 16, 23, 42, 7], mostra o maior valor, percorrendo-o com um for.',
    run: 'Maior: 42\n',
    hint: H`Começa com <code>let mut maior = v[0];</code> e percorre com <code>for &amp;x in &amp;v</code> (o <code>&amp;x</code> tira o número de dentro do empréstimo).`,
    solution: C`
fn main() {
    let v = vec![4, 8, 15, 16, 23, 42, 7];
    let mut maior = v[0];
    for &x in &v {
        if x > maior {
            maior = x;
        }
    }
    println!("Maior: {maior}");
}`,
  }, {
    title: 'Contar palavras',
    text: 'Conta as palavras do texto "aprender rust com calma" e mostra também a mais comprida.',
    run: 'Palavras: 4\nMais comprida: aprender\n',
    hint: H`<code>texto.split_whitespace()</code> dá as palavras uma a uma. Guarda a mais comprida num <code>&amp;str</code>.`,
    solution: C`
fn main() {
    let texto = "aprender rust com calma";
    let mut conta = 0;
    let mut maior = "";
    for p in texto.split_whitespace() {
        conta += 1;
        if p.len() > maior.len() {
            maior = p;
        }
    }
    println!("Palavras: {conta}");
    println!("Mais comprida: {maior}");
}`,
  }],
});
