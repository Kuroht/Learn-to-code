// ===== C do Zero — conteúdo das lições (parte 1) =====
// Formato de um passo do visualizador:
//   l: linha do código (1 = primeira)
//   push: cria uma nova "caixa de função" (frame)   pop: true remove a última
//   d: declara variáveis   { frame: { nome: [tipo, valor, endereço?] } }
//   u: atualiza valores    { frame: { nome: valor, 'v[2]': valor, 's.campo': valor } }
//   x: apaga variáveis     { frame: ['i'] }
//   o: texto acrescentado ao ecrã (⟦...⟧ = o que o utilizador escreve)
//   n: explicação do passo
const C = (s, ...v) => String.raw(s, ...v).replace(/^\n/, '').replace(/\n\s*$/, '');
const H = (s, ...v) => String.raw(s, ...v);
const chars = (str, size) => {
  const a = [...str].map(c => `'${c}'`);
  a.push("'\\0'");
  while (a.length < size) a.push("'\\0'");
  return a;
};

const LESSONS = [];

// ---------------------------------------------------------------- 0
LESSONS.push({
  id: 0,
  title: 'Como é um programa em C',
  short: 'main, printf, ; e como o computador lê o código',
  body: H`
<p>Um programa em C é um ficheiro de texto (por exemplo <code>ola.c</code>). O computador não percebe C diretamente: um programa chamado <strong>compilador</strong> (o <code>gcc</code>) traduz o texto para linguagem máquina. Só depois é que o programa corre.</p>
<p>Quando corre, o computador faz <strong>uma instrução de cada vez, de cima para baixo</strong>, a começar sempre na função <code>main</code>. Não salta linhas, não adivinha, não faz nada que não esteja escrito. Quase todos os erros de quem está a começar vêm de esperar que o computador "perceba a ideia".</p>
<ul>
<li><code>#include &lt;stdio.h&gt;</code> vai buscar a biblioteca de entrada/saída, onde vivem o <code>printf</code> e o <code>scanf</code>.</li>
<li><code>int main(void) { ... }</code> é o ponto de partida. Tudo o que está entre as chavetas <code>{ }</code> é o corpo do programa.</li>
<li>Cada instrução acaba com <code>;</code>, como uma frase acaba com ponto final.</li>
<li><code>return 0;</code> termina o programa e diz ao sistema que correu tudo bem.</li>
</ul>`,
  analogy: H`Um programa é uma receita lida por alguém que segue tudo à letra. O <code>#include</code> é ir buscar os utensílios, o <code>main</code> é "começa aqui", e cada <code>;</code> é o fim de um passo.`,
  examples: [{
    title: 'O primeiro programa',
    code: C`
#include <stdio.h>

int main(void) {
    printf("Bem-vindo ao C!\n");
    printf("Estou a aprender C.\n");
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: H`O programa começa sempre no <code>main</code>. O <code>#include</code> da linha 1 não "corre": só avisa o compilador de que vamos usar o <code>printf</code>.` },
      { l: 4, o: 'Bem-vindo ao C!\n', n: H`<code>printf</code> escreve no ecrã o que está entre aspas. O <code>\n</code> não aparece: significa "muda de linha".` },
      { l: 5, o: 'Estou a aprender C.\n', n: H`A instrução seguinte. As instruções correm por ordem, de cima para baixo, e cada uma acaba com <code>;</code>.` },
      { l: 6, n: H`<code>return 0;</code> termina o <code>main</code>. O programa acabou.` },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>;</code> no fim da instrução. O compilador queixa-se com <em>expected ';'</em>, muitas vezes a apontar para a linha <strong>seguinte</strong>.`,
    H`Escrever <code>Printf</code> ou <code>Main</code>. O C distingue maiúsculas de minúsculas.`,
    H`Esquecer o <code>#include &lt;stdio.h&gt;</code>. Aparece <em>implicit declaration of function 'printf'</em>.`,
    H`Esquecer o <code>\n</code>: o texto do <code>printf</code> seguinte fica colado na mesma linha.`,
    H`Texto vai entre aspas <code>"assim"</code>. Plicas <code>'a'</code> são só para um carácter.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
printf("A");
printf("B\n");
printf("C");`, opts: ['A\nB\nC', 'AB\nC', 'ABC', 'A B C'], ok: 1, mono: true, check: true,
      exp: H`Só o segundo <code>printf</code> tem <code>\n</code>. O "A" e o "B" ficam na mesma linha e a mudança de linha acontece depois do "B".` },
    { q: 'Onde começa a execução de um programa em C?', opts: ['Na primeira linha do ficheiro', 'Na função main', 'No #include', 'Na última linha'], ok: 1,
      exp: 'Seja qual for a ordem das coisas no ficheiro, a execução começa sempre na função main.' },
    { q: 'Para que serve o ; ?', opts: ['Para fazer um comentário', 'Para terminar uma instrução', 'Para mudar de linha no ecrã', 'Para separar o main do resto'], ok: 1,
      exp: H`O <code>;</code> marca o fim de cada instrução. Para mudar de linha no ecrã usa-se <code>\n</code> dentro do texto do printf.` },
  ],
  exercises: [{
    title: 'Apresenta-te',
    text: 'Escreve um programa que mostre o teu nome numa linha e o teu curso na linha seguinte.',
    run: 'Nome: Joao\nCurso: Engenharia Informatica\n',
    hint: H`Precisas de dois <code>printf</code>, cada um terminado com <code>\n</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    printf("Nome: Joao\n");
    printf("Curso: Engenharia Informatica\n");
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 1
LESSONS.push({
  id: 1,
  title: 'Variáveis e tipos',
  short: 'caixas na memória: int, double, char e o sinal =',
  body: H`
<p>Uma <strong>variável</strong> é uma caixa na memória com três coisas: um <strong>nome</strong>, um <strong>tipo</strong> (o que cabe lá dentro) e um <strong>valor</strong>. Em C tens de criar (declarar) a caixa antes de a usar.</p>
<table class="t">
<thead><tr><th>Tipo</th><th>Guarda</th><th>Exemplos</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td>números inteiros</td><td><code>7</code>, <code>-3</code>, <code>0</code></td></tr>
<tr><td><code>double</code></td><td>números com casas decimais</td><td><code>14.5</code>, <code>-0.25</code></td></tr>
<tr><td><code>float</code></td><td>o mesmo, com menos precisão</td><td><code>3.14</code></td></tr>
<tr><td><code>char</code></td><td>um só carácter</td><td><code>'A'</code>, <code>'7'</code>, <code>'?'</code></td></tr>
</tbody>
</table>
<p>O sinal <code>=</code> <strong>não é igualdade matemática</strong>. Lê-se "guarda": calcula o que está à direita e guarda o resultado na caixa da esquerda. Por isso <code>a = a + 1</code> faz todo o sentido: vê quanto vale <code>a</code>, soma 1 e guarda de volta em <code>a</code>.</p>
<p>E <code>b = a</code> <strong>copia</strong> o valor. Se depois mudares <code>a</code>, o <code>b</code> não muda. São duas caixas diferentes.</p>`,
  analogy: 'Pensa em caixas com etiqueta. A etiqueta é o nome, o tamanho da caixa é o tipo, e lá dentro está um valor de cada vez. Guardar um valor novo deita fora o antigo.',
  examples: [{
    title: 'Caixas, cópias e o sinal =',
    code: C`
#include <stdio.h>

int main(void) {
    int a = 5;
    int b = a;
    a = 10;
    a = a + 1;
    char letra = 'C';
    double media = 14.5;
    printf("a=%d b=%d\n", a, b);
    printf("%c %.1f\n", letra, media);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main. Ainda não existe nenhuma variável.' },
      { l: 4, d: { main: { a: ['int', '5'] } }, n: H`Cria uma caixa chamada <code>a</code>, do tipo <code>int</code>, e guarda lá o 5.` },
      { l: 5, d: { main: { b: ['int', '5'] } }, n: H`<code>b = a</code> copia o valor de <code>a</code> (5) para uma caixa nova, <code>b</code>.` },
      { l: 6, u: { main: { a: '10' } }, n: H`O <code>a</code> passa a 10. Repara: o <code>b</code> continua com 5, porque só recebeu uma cópia.` },
      { l: 7, u: { main: { a: '11' } }, n: H`Primeiro calcula a direita: <code>a + 1</code> = 10 + 1 = 11. Depois guarda o 11 em <code>a</code>.` },
      { l: 8, d: { main: { letra: ['char', "'C'"] } }, n: H`Um <code>char</code> guarda um só carácter, sempre entre plicas.` },
      { l: 9, d: { main: { media: ['double', '14.5'] } }, n: H`<code>double</code> guarda números com casas decimais. Em C escreve-se com ponto: <code>14.5</code>, nunca <code>14,5</code>.` },
      { l: 10, o: 'a=11 b=5\n', n: H`Cada <code>%d</code> é trocado por um inteiro, pela ordem da lista: o primeiro por <code>a</code>, o segundo por <code>b</code>.` },
      { l: 11, o: 'C 14.5\n', n: H`<code>%c</code> mostra um char. <code>%.1f</code> mostra um número real com 1 casa decimal.` },
      { l: 12, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Usar uma variável sem lhe dar valor. Ela tem "lixo": um número qualquer que estava naquela parte da memória.`,
    H`Escrever decimais com vírgula (<code>14,5</code>). Em C é sempre com ponto.`,
    H`Guardar um real num <code>int</code>: <code>int x = 2.9;</code> guarda 2. As casas decimais são cortadas, não arredondadas.`,
    H`Nomes de variáveis com espaços, acentos ou a começar por número (<code>2nota</code>, <code>média</code>).`,
    H`Confundir <code>=</code> (guardar) com <code>==</code> (comparar). Vais ver isto na lição das decisões.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
int x = 3;
int y = x;
x = 7;
printf("%d %d", x, y);`, opts: ['7 7', '3 3', '7 3', '3 7'], ok: 2, mono: true, check: true,
      exp: H`<code>y = x</code> copiou o 3. Quando <code>x</code> passa a 7, o <code>y</code> não muda.` },
    { q: 'O que aparece no ecrã?', code: C`
int n = 2.9;
printf("%d", n);`, opts: ['2.9', '3', '2', 'Dá erro'], ok: 2, mono: true, check: true,
      exp: H`Um <code>int</code> só guarda inteiros. A parte decimal é cortada (não arredonda), por isso fica 2.` },
    { q: 'O que aparece no ecrã?', code: C`
int x = 4;
x = x * 2;
x = x - 1;
printf("%d", x);`, opts: ['4', '8', '7', '3'], ok: 2, mono: true, check: true,
      exp: 'Passo a passo: x = 4, depois x = 4 × 2 = 8, depois x = 8 − 1 = 7.' },
    { q: "Qual é o tipo certo para guardar a letra de uma turma, por exemplo 'B'?", opts: ['int', 'double', 'char', 'letra'], ok: 2,
      exp: H`Um só carácter guarda-se num <code>char</code>, escrito entre plicas: <code>char turma = 'B';</code>` },
  ],
  exercises: [{
    title: 'Contas com duas variáveis',
    text: 'Cria duas variáveis inteiras com os valores 8 e 3 e mostra a soma, a diferença e o produto, exatamente neste formato:',
    run: '8 + 3 = 11\n8 - 3 = 5\n8 * 3 = 24\n',
    hint: H`Podes pôr a conta diretamente no printf: <code>printf("%d + %d = %d\n", a, b, a + b);</code>`,
    solution: C`
#include <stdio.h>

int main(void) {
    int a = 8;
    int b = 3;
    printf("%d + %d = %d\n", a, b, a + b);
    printf("%d - %d = %d\n", a, b, a - b);
    printf("%d * %d = %d\n", a, b, a * b);
    return 0;
}`,
  }, {
    title: 'Trocar valores (pergunta clássica de teste)',
    text: 'Começa com a = 1 e b = 2. Troca os valores das duas variáveis e mostra o resultado. Dica: se fizeres a = b logo à primeira, perdes o valor de a.',
    run: 'a=2 b=1\n',
    hint: H`Usa uma terceira variável, <code>aux</code>, para guardar o valor de <code>a</code> antes de o perderes.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int a = 1, b = 2, aux;
    aux = a;
    a = b;
    b = aux;
    printf("a=%d b=%d\n", a, b);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 2
LESSONS.push({
  id: 2,
  title: 'Ler do teclado: printf e scanf',
  short: '%d, %lf, %c e porque é que o scanf leva &',
  body: H`
<p><code>printf</code> escreve no ecrã; <code>scanf</code> lê o que o utilizador escreve no teclado. Os dois usam <strong>códigos de formato</strong> para saber de que tipo é o valor:</p>
<table class="t">
<thead><tr><th>Tipo</th><th>printf</th><th>scanf</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td><code>%d</code></td><td><code>%d</code></td></tr>
<tr><td><code>double</code></td><td><code>%f</code> (ou <code>%.2f</code> para 2 casas)</td><td><code>%lf</code></td></tr>
<tr><td><code>float</code></td><td><code>%f</code></td><td><code>%f</code></td></tr>
<tr><td><code>char</code></td><td><code>%c</code></td><td><code>" %c"</code> (com espaço antes)</td></tr>
<tr><td>texto</td><td><code>%s</code></td><td><code>%s</code> (sem &amp;)</td></tr>
</tbody>
</table>
<p>Porque é que o scanf precisa de <code>&amp;</code>? O <code>printf</code> só precisa de saber o <strong>valor</strong> para o mostrar. O <code>scanf</code> tem de saber <strong>onde guardar</strong> o que leu, e <code>&amp;idade</code> quer dizer "o endereço da caixa idade". Vais perceber isto a fundo na lição dos apontadores.</p>`,
  analogy: H`O <code>scanf</code> é um estafeta: não lhe chega saber o nome da caixa, precisa da morada para lá deixar a encomenda. O <code>&amp;</code> dá-lhe a morada.`,
  examples: [{
    title: 'Perguntar e responder',
    code: C`
#include <stdio.h>

int main(void) {
    int idade;
    double altura;
    printf("Idade? ");
    scanf("%d", &idade);
    printf("Altura (m)? ");
    scanf("%lf", &altura);
    printf("Daqui a 5 anos tens %d anos.\n", idade + 5);
    printf("Medes %.2f m.\n", altura);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { idade: ['int', '?'] } }, n: H`Declarar sem dar valor: a caixa existe, mas tem lixo. Por isso mostramos <code>?</code>.` },
      { l: 5, d: { main: { altura: ['double', '?'] } }, n: 'O mesmo para a altura.' },
      { l: 6, o: 'Idade? ', n: H`Sem <code>\n</code>, o cursor fica na mesma linha, à espera da resposta.` },
      { l: 7, u: { main: { idade: '19' } }, o: '⟦19⟧', n: H`O programa <strong>pára</strong> até o utilizador escrever algo e carregar em Enter. <code>%d</code> diz "espero um inteiro" e <code>&amp;idade</code> diz "guarda-o na caixa idade".` },
      { l: 8, o: 'Altura (m)? ', n: 'Nova pergunta.' },
      { l: 9, u: { main: { altura: '1.75' } }, o: '⟦1.75⟧', n: H`Para ler um <code>double</code> usa-se <code>%lf</code>. Com <code>%f</code> o valor guardado sai errado.` },
      { l: 10, o: 'Daqui a 5 anos tens 24 anos.\n', n: H`Podes fazer contas dentro do printf. <code>idade + 5</code> dá 24, mas a variável <code>idade</code> continua com 19.` },
      { l: 11, o: 'Medes 1.75 m.\n', n: H`<code>%.2f</code> mostra o número com 2 casas decimais.` },
      { l: 12, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>&amp;</code>: <code>scanf("%d", idade);</code>. O programa pode rebentar ou guardar o valor num sítio qualquer.`,
    H`Usar <code>%f</code> para ler um <code>double</code>. No scanf é <code>%lf</code>.`,
    H`Pôr <code>\n</code> dentro do scanf (<code>"%d\n"</code>): o programa fica à espera de mais input.`,
    H`Ler um <code>char</code> depois de um número: o Enter que ficou para trás é lido como carácter. Usa <code>scanf(" %c", &amp;c);</code> com um espaço antes do <code>%c</code>.`,
  ],
  quiz: [
    { q: 'Qual destas linhas lê corretamente um inteiro para a variável n?', opts: ['scanf("%d", n);', 'scanf("%d", &n);', 'scanf("&d", n);', 'scanf(%d, &n);'], ok: 1, mono: true,
      exp: H`O formato vai entre aspas e a variável leva <code>&amp;</code> para o scanf saber onde guardar.` },
    { q: 'Que formato usas no scanf para ler um double?', opts: ['%d', '%f', '%lf', '%c'], ok: 2,
      exp: H`No scanf, <code>double</code> é <code>%lf</code>. No printf, <code>%f</code> serve para float e double.` },
    { q: 'O que aparece no ecrã?', code: C`
double p = 2.5;
printf("%.2f", p * 2);`, opts: ['5', '5.0', '5.00', '2.50'], ok: 2, mono: true, check: true,
      exp: H`2.5 × 2 = 5.0, e <code>%.2f</code> mostra sempre 2 casas decimais: 5.00.` },
    { q: 'O que aparece no ecrã?', code: C`
int a = 10;
printf("a + 1 = %d\n", a + 1);
printf("a = %d", a);`, opts: ['a + 1 = 11\na = 11', 'a + 1 = 11\na = 10', 'a + 1 = 10\na = 10', '11\n10'], ok: 1, mono: true, check: true,
      exp: H`Calcular <code>a + 1</code> dentro do printf não muda a variável. Só um <code>=</code> muda o valor de <code>a</code>.` },
  ],
  exercises: [{
    title: 'Somar dois números',
    text: 'Pede dois inteiros ao utilizador e mostra a soma.',
    run: 'Primeiro numero: ⟦4⟧Segundo numero: ⟦9⟧Soma: 13\n',
    hint: H`Declara duas variáveis <code>int</code>, faz um printf + scanf para cada uma e no fim mostra <code>a + b</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int a, b;
    printf("Primeiro numero: ");
    scanf("%d", &a);
    printf("Segundo numero: ");
    scanf("%d", &b);
    printf("Soma: %d\n", a + b);
    return 0;
}`,
  }, {
    title: 'Área de um círculo',
    text: 'Lê o raio (um número real) e mostra a área com 2 casas decimais. Área = 3.14159 × raio × raio.',
    run: 'Raio: ⟦2⟧Area: 12.57\n',
    hint: H`O raio pode ter casas decimais: usa <code>double</code>, lê com <code>%lf</code> e mostra com <code>%.2f</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    double raio;
    printf("Raio: ");
    scanf("%lf", &raio);
    double area = 3.14159 * raio * raio;
    printf("Area: %.2f\n", area);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 3
LESSONS.push({
  id: 3,
  title: 'Operadores e contas',
  short: 'divisão inteira, resto %, ++ e +=',
  body: H`
<p>Os operadores básicos são <code>+</code> <code>-</code> <code>*</code> <code>/</code> e <code>%</code>. Há duas regras que aparecem em <strong>todos</strong> os testes:</p>
<ul>
<li><strong>int / int dá int.</strong> <code>7 / 2</code> dá <code>3</code>: as casas decimais são cortadas, não arredondadas. Para obteres 3.5, pelo menos um dos lados tem de ser real: <code>7.0 / 2</code> ou <code>(double) 7 / 2</code>.</li>
<li><strong><code>%</code> é o resto da divisão inteira.</strong> <code>7 % 2</code> dá <code>1</code>, porque 7 = 2 × 3 + 1. Serve para saber se um número é par (<code>n % 2 == 0</code>) ou para tirar o último algarismo (<code>n % 10</code>).</li>
</ul>
<p>A ordem das operações é a da matemática: <code>*</code> <code>/</code> <code>%</code> primeiro, depois <code>+</code> <code>-</code>. Em caso de dúvida, usa parênteses.</p>
<p>Atalhos: <code>x++</code> é <code>x = x + 1</code>; <code>x--</code> é <code>x = x - 1</code>; <code>x += 3</code> é <code>x = x + 3</code> (e há também <code>-=</code>, <code>*=</code>, <code>/=</code>).</p>`,
  analogy: 'A divisão inteira é dividir rebuçados por pessoas: 7 rebuçados por 2 pessoas dá 3 a cada uma, e o % diz-te quantos sobram (1).',
  examples: [{
    title: 'A armadilha da divisão',
    code: C`
#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    int q = a / b;
    int r = a % b;
    double d = (double) a / b;
    double errado = a / b;
    a++;
    b += 3;
    printf("q=%d r=%d\n", q, r);
    printf("d=%.1f errado=%.1f\n", d, errado);
    printf("a=%d b=%d\n", a, b);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { a: ['int', '7'], b: ['int', '2'] } }, n: 'Duas variáveis declaradas na mesma linha, separadas por vírgula.' },
      { l: 5, d: { main: { q: ['int', '3'] } }, n: H`<code>int / int</code> dá sempre <code>int</code>. 7 / 2 seria 3,5, mas as casas decimais são cortadas: fica 3.` },
      { l: 6, d: { main: { r: ['int', '1'] } }, n: H`<code>%</code> é o resto: 7 = 2 × 3 + 1, logo sobra 1.` },
      { l: 7, d: { main: { d: ['double', '3.5'] } }, n: H`<code>(double) a</code> transforma o 7 em 7.0 <strong>antes</strong> de dividir. Real / inteiro dá real: 3.5.` },
      { l: 8, d: { main: { errado: ['double', '3.0'] } }, n: H`A armadilha clássica: <code>a / b</code> é calculado primeiro, como inteiro (3), e só depois é guardado no double. Fica 3.0, não 3.5.` },
      { l: 9, u: { main: { a: '8' } }, n: H`<code>a++</code> soma 1 ao a. É o mesmo que <code>a = a + 1</code>.` },
      { l: 10, u: { main: { b: '5' } }, n: H`<code>b += 3</code> é o mesmo que <code>b = b + 3</code>.` },
      { l: 11, o: 'q=3 r=1\n', n: 'Mostra o quociente e o resto.' },
      { l: 12, o: 'd=3.5 errado=3.0\n', n: 'Compara os dois resultados da divisão.' },
      { l: 13, o: 'a=8 b=5\n', n: 'Os valores depois dos atalhos.' },
      { l: 14, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Esperar 3.5 de <code>7 / 2</code>. Com dois inteiros a divisão é inteira.`,
    H`Guardar num double não resolve: <code>double m = soma / 3;</code> continua a ser divisão inteira se <code>soma</code> for int. Escreve <code>soma / 3.0</code>.`,
    H`Esquecer a ordem das operações: <code>2 + 3 * 4</code> dá 14, não 20.`,
    H`Usar <code>%</code> com números reais. Só funciona com inteiros.`,
    H`Dividir por zero: com inteiros o programa rebenta.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`printf("%d", 9 / 4);`, opts: ['2.25', '2', '3', '2.0'], ok: 1, mono: true, check: true,
      exp: '9 / 4 com inteiros: 4 cabe 2 vezes em 9. As casas decimais são cortadas.' },
    { q: 'O que aparece no ecrã?', code: C`printf("%d", 17 % 5);`, opts: ['3', '2', '3.4', '0'], ok: 1, mono: true, check: true,
      exp: '17 = 5 × 3 + 2, por isso o resto é 2.' },
    { q: 'O que aparece no ecrã?', code: C`printf("%d", 2 + 3 * 4);`, opts: ['20', '14', '24', '9'], ok: 1, mono: true, check: true,
      exp: 'A multiplicação vem primeiro: 3 × 4 = 12, e depois 2 + 12 = 14.' },
    { q: 'O que aparece no ecrã?', code: C`
int x = 5;
x += 2;
x *= 3;
printf("%d", x);`, opts: ['21', '17', '10', '15'], ok: 0, mono: true, check: true,
      exp: 'x = 5, depois x = 5 + 2 = 7, depois x = 7 × 3 = 21.' },
    { q: 'O que aparece no ecrã? (esta é difícil)', code: C`printf("%.1f", 5 / 2 * 1.0);`, opts: ['2.5', '2.0', '2', '3.0'], ok: 1, mono: true, check: true,
      exp: H`Faz-se da esquerda para a direita: <code>5 / 2</code> é divisão inteira e dá 2. Só depois se multiplica por 1.0, o que dá 2.0. Para obter 2.5 seria preciso <code>5 * 1.0 / 2</code>.` },
  ],
  exercises: [{
    title: 'Segundos para minutos',
    text: 'Lê um número inteiro de segundos e mostra-o em minutos e segundos.',
    run: 'Segundos: ⟦135⟧2 min e 15 s\n',
    hint: H`Os minutos são <code>total / 60</code> (divisão inteira) e os segundos que sobram são <code>total % 60</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int total;
    printf("Segundos: ");
    scanf("%d", &total);
    int min = total / 60;
    int seg = total % 60;
    printf("%d min e %d s\n", min, seg);
    return 0;
}`,
  }, {
    title: 'Média de três notas',
    text: 'Lê três notas inteiras e mostra a média com 2 casas decimais. Atenção à divisão inteira!',
    run: 'Notas: ⟦12 15 14⟧Media: 13.67\n',
    hint: H`Um só scanf pode ler os três: <code>scanf("%d %d %d", &amp;a, &amp;b, &amp;c);</code>. Para a média divide por <code>3.0</code>, não por <code>3</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int a, b, c;
    printf("Notas: ");
    scanf("%d %d %d", &a, &b, &c);
    double media = (a + b + c) / 3.0;
    printf("Media: %.2f\n", media);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Decisões: if, else e switch',
  short: 'condições, && e ||, = contra ==, e o break',
  body: H`
<p>O <code>if</code> executa um bloco só se a condição for verdadeira. O <code>else</code> é o "senão". Com <code>else if</code> encadeias vários testes, e só <strong>um</strong> dos blocos é executado: o primeiro cuja condição seja verdadeira.</p>
<table class="t">
<thead><tr><th>Comparar</th><th>Significa</th><th>Combinar</th><th>Significa</th></tr></thead>
<tbody>
<tr><td><code>==</code></td><td>igual</td><td><code>&amp;&amp;</code></td><td>e (as duas verdadeiras)</td></tr>
<tr><td><code>!=</code></td><td>diferente</td><td><code>||</code></td><td>ou (pelo menos uma)</td></tr>
<tr><td><code>&lt;</code> <code>&gt;</code></td><td>menor, maior</td><td><code>!</code></td><td>não (inverte)</td></tr>
<tr><td><code>&lt;=</code> <code>&gt;=</code></td><td>menor ou igual, maior ou igual</td><td></td><td></td></tr>
</tbody>
</table>
<p>Em C, <strong>0 é falso e qualquer outro número é verdadeiro</strong>. É por isso que <code>if (x = 5)</code> (com um só <code>=</code>) é sempre verdadeiro: guarda 5 em x e o resultado é 5, que não é zero.</p>
<p>O <code>switch</code> compara uma variável com vários valores fixos (<code>case</code>). Cada <code>case</code> deve acabar com <code>break</code>; sem ele, o programa continua pelo <code>case</code> seguinte.</p>`,
  analogy: 'Um if / else if / else é uma bifurcação com várias saídas: segues a primeira placa que diz "é por aqui" e ignoras as restantes.',
  examples: [{
    title: 'Aprovado ou reprovado',
    code: C`
#include <stdio.h>

int main(void) {
    int nota;
    printf("Nota (0-20)? ");
    scanf("%d", &nota);
    if (nota < 0 || nota > 20) {
        printf("Nota invalida\n");
    } else if (nota >= 10) {
        printf("Aprovado\n");
    } else {
        printf("Reprovado\n");
    }
    printf("Fim\n");
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { nota: ['int', '?'] } }, n: 'Caixa para a nota, ainda com lixo.' },
      { l: 5, o: 'Nota (0-20)? ', n: 'Pergunta.' },
      { l: 6, u: { main: { nota: '13' } }, o: '⟦13⟧', n: 'O utilizador escreve 13.' },
      { l: 7, n: H`Testa: 13 &lt; 0? Falso. 13 &gt; 20? Falso. Falso <code>||</code> falso = falso, por isso salta este bloco.` },
      { l: 9, n: H`Próximo teste: 13 &gt;= 10? Verdadeiro! Entra neste bloco.` },
      { l: 10, o: 'Aprovado\n', n: H`Escreve "Aprovado". Numa cadeia if / else if / else só é executado <strong>um</strong> bloco.` },
      { l: 14, o: 'Fim\n', n: H`Depois do bloco escolhido, salta o resto da cadeia (o <code>else</code>) e continua aqui.` },
      { l: 15, n: 'Fim do programa.' },
    ],
  }, {
    title: 'O switch e o break esquecido',
    code: C`
#include <stdio.h>

int main(void) {
    int opcao = 2;
    switch (opcao) {
        case 1:
            printf("Somar\n");
            break;
        case 2:
            printf("Subtrair\n");
        case 3:
            printf("Multiplicar\n");
            break;
        default:
            printf("Opcao invalida\n");
    }
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { opcao: ['int', '2'] } }, n: 'Escolhemos a opção 2.' },
      { l: 5, n: H`O <code>switch</code> compara <code>opcao</code> com cada <code>case</code> e salta diretamente para o que for igual.` },
      { l: 9, n: H`Encontrou <code>case 2</code>.` },
      { l: 10, o: 'Subtrair\n', n: 'Executa o que está no case 2.' },
      { l: 12, o: 'Multiplicar\n', n: H`Não há <code>break</code> no fim do case 2! O programa "cai" para o case 3 e executa-o também. É um erro muito comum.` },
      { l: 13, n: H`Aqui há <code>break</code>: sai do switch.` },
      { l: 17, n: H`Resultado: apareceu "Subtrair" <strong>e</strong> "Multiplicar". Com um <code>break</code> na linha 11 só apareceria "Subtrair".` },
    ],
  }],
  mistakes: [
    H`<code>if (x = 5)</code> em vez de <code>if (x == 5)</code>. O primeiro guarda 5 em x e é sempre verdadeiro.`,
    H`Pôr <code>;</code> logo a seguir ao if: <code>if (x &gt; 0); { ... }</code>. O bloco passa a ser executado sempre.`,
    H`Esquecer as chavetas quando o bloco tem mais do que uma instrução. Sem <code>{ }</code>, só a primeira linha pertence ao if.`,
    H`Escrever <code>10 &lt;= nota &lt;= 20</code>. Em C isto não faz o que parece; escreve <code>nota &gt;= 10 &amp;&amp; nota &lt;= 20</code>.`,
    H`Esquecer o <code>break</code> num case do switch.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
int x = 5;
if (x > 3)
    printf("A");
else
    printf("B");
printf("C");`, opts: ['A', 'AC', 'BC', 'ABC'], ok: 1, mono: true, check: true,
      exp: H`5 &gt; 3 é verdadeiro, por isso escreve "A". O <code>printf("C")</code> está fora do if/else e corre sempre.` },
    { q: 'O que aparece no ecrã? (atenção ao sinal)', code: C`
int x = 0;
if (x = 0)
    printf("zero");
else
    printf("outro");`, opts: ['zero', 'outro', 'zerooutro', 'Nada'], ok: 1, mono: true, check: true,
      exp: H`<code>x = 0</code> guarda 0 em x, e o valor da expressão é 0, que conta como falso. Por isso vai para o else. Para comparar é <code>==</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
int a = 4, b = 9;
if (a > 5 && b > 5)
    printf("1");
else if (a > 5 || b > 5)
    printf("2");
else
    printf("3");`, opts: ['1', '2', '3', '12'], ok: 1, mono: true, check: true,
      exp: H`<code>&amp;&amp;</code> precisa das duas: 4 &gt; 5 é falso, logo falha. <code>||</code> só precisa de uma: 9 &gt; 5 é verdadeiro, por isso escreve 2.` },
    { q: 'Como escreves "x está entre 1 e 10, inclusive"?', opts: ['1 <= x <= 10', 'x >= 1 && x <= 10', 'x >= 1 || x <= 10', 'x == 1..10'], ok: 1, mono: true,
      exp: H`Têm de ser verdade as duas condições ao mesmo tempo, por isso é <code>&amp;&amp;</code>. Com <code>||</code>, qualquer número passava.` },
  ],
  exercises: [{
    title: 'Par ou ímpar',
    text: 'Lê um inteiro e diz se é par ou ímpar.',
    run: 'Numero: ⟦7⟧7 e impar\n',
    hint: H`Um número é par quando o resto da divisão por 2 é zero: <code>n % 2 == 0</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int n;
    printf("Numero: ");
    scanf("%d", &n);
    if (n % 2 == 0) {
        printf("%d e par\n", n);
    } else {
        printf("%d e impar\n", n);
    }
    return 0;
}`,
  }, {
    title: 'O maior de três',
    text: 'Lê três inteiros e mostra o maior.',
    run: 'Tres numeros: ⟦4 9 2⟧Maior: 9\n',
    hint: H`Guarda o primeiro numa variável <code>maior</code>. Depois compara-a com o segundo e com o terceiro, e troca se encontrares um maior.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int a, b, c;
    printf("Tres numeros: ");
    scanf("%d %d %d", &a, &b, &c);
    int maior = a;
    if (b > maior) {
        maior = b;
    }
    if (c > maior) {
        maior = c;
    }
    printf("Maior: %d\n", maior);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Ciclos: for, while e do-while',
  short: 'repetir código, acumuladores e o erro de uma volta a mais',
  body: H`
<p>Um ciclo repete um bloco de código enquanto uma condição for verdadeira.</p>
<ul>
<li><code>for</code> é para quando sabes quantas vezes queres repetir. Tem três partes: <code>for (início; condição; passo)</code>. Por exemplo, <code>for (int i = 1; i &lt;= 4; i++)</code> dá 4 voltas, com i = 1, 2, 3, 4.</li>
<li><code>while (condição) { ... }</code> testa <strong>antes</strong> de cada volta. Se a condição for falsa logo de início, não dá nenhuma volta.</li>
<li><code>do { ... } while (condição);</code> testa <strong>depois</strong>, por isso dá sempre pelo menos uma volta. É o ideal para menus e para validar input.</li>
</ul>
<p>Um padrão que vais usar sempre: o <strong>acumulador</strong>. Começa em 0 (para somas) ou 1 (para produtos) e em cada volta junta-se-lhe um valor.</p>`,
  analogy: 'O for é dar 10 voltas à pista com um contador na mão: no fim de cada volta somas 1 ao contador e vês se já chegaste a 10.',
  examples: [{
    title: 'Somar de 1 a 4',
    code: C`
#include <stdio.h>

int main(void) {
    int soma = 0;
    for (int i = 1; i <= 4; i++) {
        soma = soma + i;
        printf("i=%d soma=%d\n", i, soma);
    }
    printf("Total: %d\n", soma);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { soma: ['int', '0'] } }, n: 'O acumulador começa em 0. Sem isto, começava com lixo e a soma saía errada.' },
      { l: 5, d: { main: { i: ['int', '1'] } }, n: H`Início do for: cria <code>i = 1</code>. Depois testa a condição: 1 &lt;= 4? Sim, entra no ciclo.` },
      { l: 6, u: { main: { soma: '1' } }, n: 'soma = 0 + 1 = 1' },
      { l: 7, o: 'i=1 soma=1\n', n: 'Mostra os valores desta volta.' },
      { l: 5, u: { main: { i: '2' } }, n: H`Fim da volta: faz <code>i++</code> (i passa a 2) e testa 2 &lt;= 4. Verdadeiro, mais uma volta.` },
      { l: 6, u: { main: { soma: '3' } }, n: 'soma = 1 + 2 = 3' },
      { l: 7, o: 'i=2 soma=3\n', n: 'Mostra os valores desta volta.' },
      { l: 5, u: { main: { i: '3' } }, n: H`<code>i++</code>: i passa a 3. 3 &lt;= 4? Sim.` },
      { l: 6, u: { main: { soma: '6' } }, n: 'soma = 3 + 3 = 6' },
      { l: 7, o: 'i=3 soma=6\n', n: 'Mostra os valores desta volta.' },
      { l: 5, u: { main: { i: '4' } }, n: H`<code>i++</code>: i passa a 4. 4 &lt;= 4? Sim (é menor <strong>ou igual</strong>).` },
      { l: 6, u: { main: { soma: '10' } }, n: 'soma = 6 + 4 = 10' },
      { l: 7, o: 'i=4 soma=10\n', n: 'Mostra os valores desta volta.' },
      { l: 5, u: { main: { i: '5' } }, n: H`<code>i++</code>: i passa a 5. 5 &lt;= 4? <strong>Falso</strong>. O ciclo termina.` },
      { l: 9, x: { main: ['i'] }, o: 'Total: 10\n', n: H`O <code>i</code> foi criado dentro do for, por isso desaparece quando o ciclo acaba. A soma ficou com 10.` },
      { l: 10, n: 'Fim do programa.' },
    ],
  }, {
    title: 'Validar input com do-while',
    code: C`
#include <stdio.h>

int main(void) {
    int n;
    do {
        printf("Numero positivo? ");
        scanf("%d", &n);
    } while (n <= 0);
    printf("Obrigado: %d\n", n);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { n: ['int', '?'] } }, n: H`Caixa para o número.` },
      { l: 5, n: H`<code>do</code>: entra no bloco sem testar nada. O teste fica no fim.` },
      { l: 6, o: 'Numero positivo? ', n: 'Pergunta.' },
      { l: 7, u: { main: { n: '-3' } }, o: '⟦-3⟧', n: 'O utilizador escreve -3.' },
      { l: 8, n: H`-3 &lt;= 0? Verdadeiro, por isso volta ao início do bloco.` },
      { l: 6, o: 'Numero positivo? ', n: 'Pergunta outra vez.' },
      { l: 7, u: { main: { n: '0' } }, o: '⟦0⟧', n: 'Agora escreve 0.' },
      { l: 8, n: H`0 &lt;= 0? Verdadeiro, repete.` },
      { l: 6, o: 'Numero positivo? ', n: 'Mais uma vez.' },
      { l: 7, u: { main: { n: '8' } }, o: '⟦8⟧', n: 'Escreve 8.' },
      { l: 8, n: H`8 &lt;= 0? Falso, sai do ciclo.` },
      { l: 9, o: 'Obrigado: 8\n', n: 'Só chega aqui com um número positivo.' },
      { l: 10, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Ciclo infinito: num <code>while</code>, esquecer de mudar a variável da condição (por exemplo, esquecer o <code>i++</code>).`,
    H`Uma volta a mais ou a menos: <code>i &lt; 10</code> e <code>i &lt;= 10</code> não são a mesma coisa. Conta as voltas com valores pequenos.`,
    H`<code>for (...);</code> com ponto e vírgula no fim: o ciclo repete "nada" e o bloco corre só uma vez.`,
    H`Acumulador sem valor inicial (<code>int soma;</code> em vez de <code>int soma = 0;</code>).`,
    H`O <code>do-while</code> leva <code>;</code> depois do <code>while (...)</code>. O for e o while não levam.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
for (int i = 0; i < 3; i++)
    printf("%d ", i);`, opts: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], ok: 0, mono: true, check: true,
      exp: H`Começa em 0 e continua enquanto i &lt; 3: dá i = 0, 1, 2. Quando i chega a 3, a condição falha.` },
    { q: 'Quantas estrelas aparecem?', code: C`
int i = 10;
while (i > 0) {
    printf("*");
    i = i - 3;
}`, opts: ['***', '****', '*****', 'Infinitas'], ok: 1, mono: true, check: true,
      exp: 'i vale 10, 7, 4 e 1 (quatro estrelas). Depois passa a -2 e a condição i > 0 falha.' },
    { q: 'O que aparece no ecrã?', code: C`
int i = 5;
do {
    printf("%d", i);
    i++;
} while (i < 3);`, opts: ['Nada', '5', '56', '345'], ok: 1, mono: true, check: true,
      exp: 'O do-while dá sempre a primeira volta antes de testar. Escreve 5, depois testa 6 < 3, que é falso, e pára.' },
    { q: 'O que aparece no ecrã?', code: C`
int s = 0;
for (int i = 1; i <= 5; i += 2)
    s += i;
printf("%d", s);`, opts: ['15', '9', '6', '5'], ok: 1, mono: true, check: true,
      exp: 'i salta de 2 em 2: 1, 3, 5. A soma é 1 + 3 + 5 = 9.' },
  ],
  exercises: [{
    title: 'Tabuada',
    text: 'Lê um número e mostra a tabuada dele, de 1 a 10.',
    run: 'Numero: ⟦7⟧7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n',
    hint: H`Um <code>for</code> com i de 1 a 10. Em cada volta, <code>printf("%d x %d = %d\n", n, i, n * i);</code>`,
    solution: C`
#include <stdio.h>

int main(void) {
    int n;
    printf("Numero: ");
    scanf("%d", &n);
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", n, i, n * i);
    }
    return 0;
}`,
  }, {
    title: 'Somar até aparecer um zero',
    text: 'Lê números até o utilizador escrever 0. No fim mostra a soma e quantos números foram lidos (sem contar o 0).',
    run: 'Numero (0 termina): ⟦5⟧Numero (0 termina): ⟦3⟧Numero (0 termina): ⟦10⟧Numero (0 termina): ⟦0⟧Soma: 18\nLidos: 3\n',
    hint: H`Não sabes quantas voltas vão ser, por isso usa <code>while</code> ou <code>do-while</code>. Precisas de dois acumuladores: <code>soma</code> e <code>conta</code>, ambos a começar em 0.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int n, soma = 0, conta = 0;
    do {
        printf("Numero (0 termina): ");
        scanf("%d", &n);
        if (n != 0) {
            soma += n;
            conta++;
        }
    } while (n != 0);
    printf("Soma: %d\n", soma);
    printf("Lidos: %d\n", conta);
    return 0;
}`,
  }],
});
