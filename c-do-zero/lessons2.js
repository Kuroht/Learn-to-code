// ===== C do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Funções',
  short: 'parâmetros, return, void e a passagem por valor',
  body: H`
<p>Uma <strong>função</strong> é um pedaço de código com nome, que podes usar sempre que quiseres. Recebe valores (os <strong>parâmetros</strong>), faz o seu trabalho e pode devolver um resultado com <code>return</code>.</p>
<pre class="snip"><code>tipo_que_devolve nome(tipo parametro1, tipo parametro2) {
    ...
    return resultado;
}</code></pre>
<ul>
<li>Se a função não devolve nada, o tipo é <code>void</code>.</li>
<li>O <code>return</code> termina a função de imediato e entrega o valor a quem a chamou.</li>
<li>Escreve as funções <strong>antes</strong> do main, ou declara o protótipo lá em cima (<code>int quadrado(int x);</code>).</li>
</ul>
<p>O ponto mais importante: em C, os parâmetros recebem <strong>cópias</strong> dos valores (passagem por valor). Se a função mudar o parâmetro, a variável original no main não muda.</p>`,
  analogy: 'Chamar uma função é como mandar uma fotocópia a um colega para ele fazer as contas. Ele pode rabiscar a cópia à vontade: o teu original não muda. Só recebes de volta o que ele te devolver (return).',
  examples: [{
    title: 'Uma função que devolve um valor',
    code: C`
#include <stdio.h>

int quadrado(int x) {
    int r = x * x;
    return r;
}

int main(void) {
    int n = 4;
    int q = quadrado(n);
    printf("%d ao quadrado = %d\n", n, q);
    printf("%d\n", quadrado(3) + 1);
    return 0;
}`,
    steps: [
      { l: 8, push: 'main', n: H`O programa começa no <code>main</code>, mesmo que a função <code>quadrado</code> esteja escrita antes. Escrever uma função não a executa.` },
      { l: 9, d: { main: { n: ['int', '4'] } }, n: 'Cria n com 4.' },
      { l: 10, n: H`Chama <code>quadrado(n)</code>. O main fica em pausa à espera da resposta.` },
      { l: 3, push: 'quadrado', d: { quadrado: { x: ['int', '4'] } }, n: H`A função ganha as suas próprias caixas. O parâmetro <code>x</code> recebe uma <strong>cópia</strong> do valor de n: 4.` },
      { l: 4, d: { quadrado: { r: ['int', '16'] } }, n: 'r = 4 × 4 = 16' },
      { l: 5, n: H`<code>return r</code> devolve 16 a quem chamou.` },
      { l: 10, pop: true, d: { main: { q: ['int', '16'] } }, n: H`A função terminou e as caixas dela (x e r) desapareceram. O valor devolvido, 16, fica guardado em <code>q</code>.` },
      { l: 11, o: '4 ao quadrado = 16\n', n: 'Mostra o resultado.' },
      { l: 12, n: H`Pode-se chamar a função dentro de uma conta. Primeiro calcula <code>quadrado(3)</code>.` },
      { l: 3, push: 'quadrado', d: { quadrado: { x: ['int', '3'] } }, n: 'Nova chamada, caixas novas: agora x recebe 3.' },
      { l: 4, d: { quadrado: { r: ['int', '9'] } }, n: 'r = 3 × 3 = 9' },
      { l: 5, n: 'Devolve 9.' },
      { l: 12, pop: true, o: '10\n', n: H`<code>quadrado(3) + 1</code> = 9 + 1 = 10.` },
      { l: 13, n: 'Fim do programa.' },
    ],
  }, {
    title: 'Porque é que a função não muda a variável',
    code: C`
#include <stdio.h>

void tentaMudar(int x) {
    x = 100;
    printf("dentro: x=%d\n", x);
}

int main(void) {
    int a = 5;
    tentaMudar(a);
    printf("fora: a=%d\n", a);
    return 0;
}`,
    steps: [
      { l: 8, push: 'main', n: 'Começa o main.' },
      { l: 9, d: { main: { a: ['int', '5'] } }, n: 'a vale 5.' },
      { l: 10, n: H`Chama <code>tentaMudar(a)</code>. Vai o <strong>valor</strong> 5, não a caixa a.` },
      { l: 3, push: 'tentaMudar', d: { tentaMudar: { x: ['int', '5'] } }, n: H`<code>x</code> é uma caixa nova, só desta função, com uma cópia: 5.` },
      { l: 4, u: { tentaMudar: { x: '100' } }, n: H`Muda a cópia. A caixa <code>a</code> do main não é tocada.` },
      { l: 5, o: 'dentro: x=100\n', n: 'Dentro da função, x vale 100.' },
      { l: 6, n: H`Fim da função. Como é <code>void</code>, não devolve nada. O x vai desaparecer.` },
      { l: 11, pop: true, o: 'fora: a=5\n', n: H`a continua com 5. Para uma função conseguir mudar uma variável do main são precisos apontadores (lição 9).` },
      { l: 12, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>return</code> numa função que não é void. O valor devolvido fica a ser lixo.`,
    H`Confundir <code>printf</code> com <code>return</code>. Uma função que faz printf mostra o valor no ecrã, mas não o entrega a quem a chamou.`,
    H`Usar a função antes de ela estar escrita ou declarada (aparece <em>implicit declaration</em>).`,
    H`Esperar que a função mude a variável que recebeu. Com parâmetros normais, ela só mexe numa cópia.`,
    H`Usar variáveis de outra função. As variáveis do main não existem dentro de quadrado, nem vice-versa.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
#include <stdio.h>

int dobro(int n) {
    return n * 2;
}

int main(void) {
    printf("%d", dobro(dobro(3)));
    return 0;
}`, opts: ['6', '9', '12', '3'], ok: 2, mono: true, check: true,
      exp: 'Começa por dentro: dobro(3) = 6, e depois dobro(6) = 12.' },
    { q: 'O que significa uma função ser void?', opts: ['Que não recebe parâmetros', 'Que não devolve nenhum valor', 'Que está vazia', 'Que só pode ser chamada uma vez'], ok: 1,
      exp: H`<code>void</code> antes do nome quer dizer que a função não devolve nada. Pode à mesma receber parâmetros e fazer printf.` },
    { q: 'O que aparece no ecrã?', code: C`
#include <stdio.h>

void f(int x) {
    x = x + 1;
}

int main(void) {
    int a = 1;
    f(a);
    printf("%d", a);
    return 0;
}`, opts: ['1', '2', '0', 'Lixo'], ok: 0, mono: true, check: true,
      exp: 'f recebe uma cópia de a e muda só essa cópia. O a do main continua com 1.' },
    { q: 'O que aparece no ecrã?', code: C`
#include <stdio.h>

int maior(int a, int b) {
    if (a > b)
        return a;
    return b;
}

int main(void) {
    printf("%d", maior(3, 8) + maior(5, 2));
    return 0;
}`, opts: ['11', '13', '10', '18'], ok: 1, mono: true, check: true,
      exp: H`maior(3, 8) devolve 8 e maior(5, 2) devolve 5. 8 + 5 = 13. Repara que o <code>return</code> sai logo da função.` },
  ],
  exercises: [{
    title: 'Função ehPar',
    text: 'Escreve uma função int ehPar(int n) que devolve 1 se n for par e 0 se não for. No main, usa-a para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`Dentro da função: <code>if (n % 2 == 0) return 1; return 0;</code>. No main, um for de 1 a 4 com um if a usar <code>ehPar(i)</code>.`,
    solution: C`
#include <stdio.h>

int ehPar(int n) {
    if (n % 2 == 0) {
        return 1;
    }
    return 0;
}

int main(void) {
    for (int i = 1; i <= 4; i++) {
        if (ehPar(i)) {
            printf("%d: par\n", i);
        } else {
            printf("%d: impar\n", i);
        }
    }
    return 0;
}`,
  }, {
    title: 'Função media',
    text: 'Escreve uma função double media(int a, int b, int c) que devolve a média dos três. No main, mostra a média de 12, 15 e 14.',
    run: 'Media: 13.67\n',
    hint: H`Dentro da função, <code>return (a + b + c) / 3.0;</code>. O 3.0 evita a divisão inteira.`,
    solution: C`
#include <stdio.h>

double media(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

int main(void) {
    printf("Media: %.2f\n", media(12, 15, 14));
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Arrays (vetores)',
  short: 'filas de caixas, índices a começar em 0 e percorrer com for',
  body: H`
<p>Um <strong>array</strong> (vetor) é uma fila de caixas do mesmo tipo, lado a lado, com um só nome. Cada caixa tem um <strong>índice</strong> e acedes-lhe com <code>[ ]</code>.</p>
<ul>
<li><code>int notas[4];</code> cria 4 caixas int: <code>notas[0]</code>, <code>notas[1]</code>, <code>notas[2]</code> e <code>notas[3]</code>.</li>
<li><strong>O primeiro índice é 0 e o último é tamanho − 1.</strong> Não existe <code>notas[4]</code>.</li>
<li>Para percorrer um array usa-se quase sempre um for: <code>for (int i = 0; i &lt; 4; i++)</code>.</li>
<li>O C <strong>não avisa</strong> se saíres dos limites: lê ou estraga memória que não é tua.</li>
</ul>
<p><strong>Matrizes</strong> são arrays de arrays: <code>int m[2][3];</code> tem 2 linhas e 3 colunas, e acedes com <code>m[linha][coluna]</code>. Percorre-se com dois for, um dentro do outro.</p>`,
  analogy: 'Um array é uma fila de cacifos numerados. O número do primeiro cacifo é 0, por isso numa fila de 4 cacifos o último é o 3.',
  examples: [{
    title: 'Encontrar a maior nota',
    code: C`
#include <stdio.h>

int main(void) {
    int notas[4] = {12, 17, 9, 15};
    int maior = notas[0];
    for (int i = 1; i < 4; i++) {
        if (notas[i] > maior) {
            maior = notas[i];
        }
    }
    notas[2] = 10;
    printf("Maior: %d\n", maior);
    printf("Terceira nota: %d\n", notas[2]);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { notas: ['int[4]', ['12', '17', '9', '15']] } }, n: H`Cria 4 caixas int seguidas e preenche-as pela ordem. Os índices são 0, 1, 2 e 3.` },
      { l: 5, d: { main: { maior: ['int', '12'] } }, n: H`Começamos por supor que a primeira, <code>notas[0]</code>, é a maior.` },
      { l: 6, d: { main: { i: ['int', '1'] } }, n: 'O i começa em 1 porque a de índice 0 já está em maior.' },
      { l: 7, n: H`<code>notas[1]</code> é 17. 17 &gt; 12? Sim.` },
      { l: 8, u: { main: { maior: '17' } }, n: 'Encontrámos uma maior: guarda 17.' },
      { l: 6, u: { main: { i: '2' } }, n: H`i++ → 2. 2 &lt; 4? Sim, continua.` },
      { l: 7, n: H`<code>notas[2]</code> é 9. 9 &gt; 17? Não, salta o if.` },
      { l: 6, u: { main: { i: '3' } }, n: H`i++ → 3. 3 &lt; 4? Sim.` },
      { l: 7, n: H`<code>notas[3]</code> é 15. 15 &gt; 17? Não.` },
      { l: 6, u: { main: { i: '4' } }, n: H`i++ → 4. 4 &lt; 4? Falso: o ciclo acaba. Repara que nunca se chegou a usar <code>notas[4]</code>.` },
      { l: 11, x: { main: ['i'] }, u: { main: { 'notas[2]': '10' } }, n: H`Muda só a caixa de índice 2, que é a <strong>terceira</strong>.` },
      { l: 12, o: 'Maior: 17\n', n: 'Mostra a maior nota.' },
      { l: 13, o: 'Terceira nota: 10\n', n: 'notas[2] é a terceira caixa.' },
      { l: 14, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Achar que o primeiro elemento é <code>v[1]</code>. É <code>v[0]</code>.`,
    H`<code>for (i = 0; i &lt;= 4; i++)</code> num array de 4: a última volta acede a <code>v[4]</code>, que não existe.`,
    H`Tentar copiar um array inteiro com <code>a = b;</code>. Tem de ser elemento a elemento, com um for.`,
    H`Esquecer que o tamanho é fixo: <code>int v[5]</code> tem sempre 5 caixas.`,
    H`Nas matrizes, trocar linha com coluna: é sempre <code>m[linha][coluna]</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
int v[5] = {3, 6, 9, 12, 15};
printf("%d", v[3]);`, opts: ['9', '12', '15', '3'], ok: 1, mono: true, check: true,
      exp: 'Os índices começam em 0: v[0]=3, v[1]=6, v[2]=9, v[3]=12.' },
    { q: 'O que aparece no ecrã?', code: C`
int v[4] = {2, 4, 6, 8};
int s = 0;
for (int i = 0; i < 4; i++)
    s += v[i];
printf("%d", s);`, opts: ['8', '12', '20', '14'], ok: 2, mono: true, check: true,
      exp: 'O for passa por todos os elementos: 2 + 4 + 6 + 8 = 20.' },
    { q: 'Num array int a[10], quais são os índices válidos?', opts: ['1 a 10', '0 a 10', '0 a 9', '1 a 9'], ok: 2,
      exp: 'Começa em 0 e acaba em tamanho − 1, ou seja, 0 a 9. São 10 caixas.' },
    { q: 'O que aparece no ecrã?', code: C`
int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
printf("%d", m[1][0]);`, opts: ['2', '4', '1', '5'], ok: 1, mono: true, check: true,
      exp: 'm[1] é a segunda linha, {4, 5, 6}, e [0] é a primeira coluna dessa linha: 4.' },
    { q: 'O que aparece no ecrã?', code: C`
int v[3] = {5, 2, 4};
v[0] = v[1] + v[2];
printf("%d %d %d", v[0], v[1], v[2]);`, opts: ['5 2 4', '6 2 4', '11 2 4', '6 6 6'], ok: 1, mono: true, check: true,
      exp: 'v[0] passa a ser v[1] + v[2] = 2 + 4 = 6. As outras caixas não mudam.' },
  ],
  exercises: [{
    title: 'Ao contrário',
    text: 'Lê 5 inteiros para um array e mostra-os pela ordem inversa.',
    run: 'Cinco numeros: ⟦1 2 3 4 5⟧5 4 3 2 1 \n',
    hint: H`Um for de 0 a 4 para ler (<code>scanf("%d", &amp;v[i]);</code>) e outro de 4 até 0 para mostrar: <code>for (int i = 4; i &gt;= 0; i--)</code>.`,
    solution: C`
#include <stdio.h>

int main(void) {
    int v[5];
    printf("Cinco numeros: ");
    for (int i = 0; i < 5; i++) {
        scanf("%d", &v[i]);
    }
    for (int i = 4; i >= 0; i--) {
        printf("%d ", v[i]);
    }
    printf("\n");
    return 0;
}`,
  }, {
    title: 'Acima da média',
    text: 'Dado o array {4, 8, 15, 16, 23, 42}, calcula a média e conta quantos valores estão acima dela.',
    run: 'Media: 18.00\nAcima da media: 2\n',
    hint: 'Precisas de dois ciclos: o primeiro soma tudo para calcular a média; o segundo conta os valores maiores do que a média.',
    solution: C`
#include <stdio.h>

int main(void) {
    int v[6] = {4, 8, 15, 16, 23, 42};
    int soma = 0;
    for (int i = 0; i < 6; i++) {
        soma += v[i];
    }
    double media = soma / 6.0;
    int acima = 0;
    for (int i = 0; i < 6; i++) {
        if (v[i] > media) {
            acima++;
        }
    }
    printf("Media: %.2f\n", media);
    printf("Acima da media: %d\n", acima);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Strings (texto)',
  short: "arrays de char, o '\\0', strlen, strcmp e companhia",
  body: H`
<p>Em C não existe um tipo "texto". Uma <strong>string</strong> é um array de <code>char</code> que acaba com um carácter especial, o <code>'\0'</code>, que marca o fim. A palavra <code>"Ana"</code> ocupa <strong>4</strong> caixas: <code>'A'</code>, <code>'n'</code>, <code>'a'</code> e <code>'\0'</code>.</p>
<ul>
<li>Declarar: <code>char nome[20];</code> (cabem 19 letras + o <code>'\0'</code>).</li>
<li>Ler uma palavra: <code>scanf("%s", nome);</code>, <strong>sem &amp;</strong>, porque o nome de um array já é um endereço. Atenção: o <code>%s</code> pára no primeiro espaço.</li>
<li>Ler uma linha inteira com espaços: <code>fgets(nome, 20, stdin);</code></li>
<li>Para usar as funções abaixo é preciso <code>#include &lt;string.h&gt;</code>.</li>
</ul>
<table class="t">
<thead><tr><th>Função</th><th>O que faz</th></tr></thead>
<tbody>
<tr><td><code>strlen(s)</code></td><td>número de caracteres (sem contar o <code>'\0'</code>)</td></tr>
<tr><td><code>strcpy(dest, orig)</code></td><td>copia orig para dest (o <code>=</code> não funciona com strings)</td></tr>
<tr><td><code>strcat(dest, orig)</code></td><td>junta orig ao fim de dest</td></tr>
<tr><td><code>strcmp(a, b)</code></td><td>devolve 0 se forem iguais (o <code>==</code> não funciona com strings)</td></tr>
</tbody>
</table>`,
  analogy: H`Uma string é uma fila de cacifos com uma letra em cada um. O <code>'\0'</code> é um cacifo com a placa "FIM": quem lê o texto pára quando o encontra.`,
  examples: [{
    title: "As letras e o '\\0' na memória",
    code: C`
#include <stdio.h>
#include <string.h>

int main(void) {
    char nome[8] = "Ana";
    int tam = strlen(nome);
    nome[0] = 'E';
    strcat(nome, "!");
    printf("%s tem %d letras\n", nome, tam);
    if (strcmp(nome, "Ena!") == 0) {
        printf("Iguais\n");
    }
    return 0;
}`,
    steps: [
      { l: 4, push: 'main', n: H`Começa o main. Desta vez incluímos <code>string.h</code> para ter strlen, strcat e strcmp.` },
      { l: 5, d: { main: { nome: ['char[8]', chars('Ana', 8)] } }, n: H`Cria 8 caixas char. "Ana" ocupa 4: as 3 letras e o <code>'\0'</code>, que marca o fim. As caixas que sobram também ficam com <code>'\0'</code>.` },
      { l: 6, d: { main: { tam: ['int', '3'] } }, n: H`<code>strlen</code> conta as letras até ao <code>'\0'</code>, sem o contar: 3.` },
      { l: 7, u: { main: { 'nome[0]': "'E'" } }, n: 'Uma string é um array: podes mudar uma letra pelo índice.' },
      { l: 8, u: { main: { 'nome[3]': "'!'" } }, n: H`<code>strcat</code> junta "!" ao fim. Escreve o <code>'!'</code> por cima do <code>'\0'</code> antigo e a caixa seguinte já tem um <code>'\0'</code>. Tem de haver espaço no array!` },
      { l: 9, o: 'Ena! tem 3 letras\n', n: H`<code>%s</code> escreve letras até encontrar <code>'\0'</code>. O <code>tam</code> continua 3, porque foi calculado antes do strcat.` },
      { l: 10, n: H`<code>strcmp</code> devolve 0 quando as duas strings são iguais. "Ena!" e "Ena!" são iguais, por isso entra no if.` },
      { l: 11, o: 'Iguais\n', n: 'As strings eram iguais.' },
      { l: 13, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Não deixar espaço para o <code>'\0'</code>: para guardar "Ana" precisas de pelo menos <code>char s[4]</code>.`,
    H`Comparar strings com <code>==</code>. Usa <code>strcmp(a, b) == 0</code>.`,
    H`Copiar com <code>=</code>: <code>nome = "Rui";</code> não compila. Usa <code>strcpy(nome, "Rui");</code>.`,
    H`Esperar que <code>scanf("%s", ...)</code> leia "Joao Silva". Lê só "Joao". Para linhas com espaços usa <code>fgets</code>.`,
    H`Confundir <code>'A'</code> (um char, 1 caixa) com <code>"A"</code> (uma string, 2 caixas: <code>'A'</code> e <code>'\0'</code>).`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
char s[] = "Porto";
printf("%d", (int) strlen(s));`, opts: ['5', '6', '4', '20'], ok: 0, mono: true, check: true,
      exp: H`strlen conta as letras sem o <code>'\0'</code>: P, o, r, t, o = 5.` },
    { q: 'Quantas caixas char ocupa a string "Porto"?', opts: ['5', '6', '4', '1'], ok: 1,
      exp: H`5 letras + o <code>'\0'</code> do fim = 6 caixas.` },
    { q: 'O que aparece no ecrã?', code: C`
char s[] = "gato";
s[0] = 'p';
printf("%s", s);`, opts: ['gato', 'pato', 'p', 'pgato'], ok: 1, mono: true, check: true,
      exp: 's[0] é a primeira letra. Trocar o g por p dá "pato".' },
    { q: 'Como verificas se as strings a e b são iguais?', opts: ['a == b', 'strcmp(a, b) == 0', 'strcmp(a, b) == 1', 'a = b'], ok: 1, mono: true,
      exp: H`<code>strcmp</code> devolve 0 quando são iguais. <code>a == b</code> compara endereços e quase sempre dá falso.` },
    { q: 'O que aparece no ecrã?', code: C`
char s[] = "UTAD";
printf("%c%c", s[1], s[3]);`, opts: ['UA', 'TD', 'TA', 'UD'], ok: 1, mono: true, check: true,
      exp: 's[0]=U, s[1]=T, s[2]=A, s[3]=D.' },
  ],
  exercises: [{
    title: 'Palavra ao contrário',
    text: 'Lê uma palavra e mostra-a ao contrário.',
    run: 'Palavra: ⟦vila⟧aliv\n',
    hint: H`Descobre o tamanho com <code>strlen</code> e faz um for desde <code>tam - 1</code> até 0, a escrever cada letra com <code>%c</code>.`,
    solution: C`
#include <stdio.h>
#include <string.h>

int main(void) {
    char p[50];
    printf("Palavra: ");
    scanf("%s", p);
    int tam = strlen(p);
    for (int i = tam - 1; i >= 0; i--) {
        printf("%c", p[i]);
    }
    printf("\n");
    return 0;
}`,
  }, {
    title: 'Contar vogais',
    text: 'Lê uma palavra (em minúsculas) e conta quantas vogais tem.',
    run: 'Palavra: ⟦engenharia⟧Vogais: 5\n',
    hint: H`Percorre a string até ao <code>'\0'</code> e, para cada letra, testa <code>c == 'a' || c == 'e' || ...</code>`,
    solution: C`
#include <stdio.h>

int main(void) {
    char p[50];
    printf("Palavra: ");
    scanf("%s", p);
    int vogais = 0;
    for (int i = 0; p[i] != '\0'; i++) {
        char c = p[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vogais++;
        }
    }
    printf("Vogais: %d\n", vogais);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Apontadores (ponteiros)',
  short: '& é a morada, * é ir lá: mudar variáveis dentro de funções',
  body: H`
<p>Cada caixa na memória tem um <strong>endereço</strong>, como o número da porta de uma casa. Um <strong>apontador</strong> é uma variável que guarda um endereço.</p>
<table class="t">
<thead><tr><th>Escreves</th><th>Lê-se</th></tr></thead>
<tbody>
<tr><td><code>int *p;</code></td><td>p é um apontador para um int (guarda a morada de um int)</td></tr>
<tr><td><code>&amp;x</code></td><td>o endereço de x</td></tr>
<tr><td><code>p = &amp;x;</code></td><td>p fica a apontar para x</td></tr>
<tr><td><code>*p</code></td><td>a caixa para onde p aponta (neste caso, o próprio x)</td></tr>
</tbody>
</table>
<p>Para que serve, no 1.º ano? Sobretudo para uma função conseguir <strong>mudar variáveis do main</strong>. Em vez de uma cópia do valor, envias a morada (<code>&amp;x</code>) e a função vai lá mexer (<code>*p</code>). Chama-se passagem por referência, e é exatamente o que o <code>scanf</code> faz quando lhe dás <code>&amp;idade</code>.</p>
<p>Os endereços no visualizador (1000, 1004, ...) são inventados para ser fáceis de ler. Os reais são números grandes, como <code>0x7ffd5c1e</code>.</p>`,
  analogy: H`<code>p</code> é um papel com uma morada escrita. <code>&amp;x</code> é perguntar "qual é a morada do x?". <code>*p</code> é ir a essa morada e abrir a porta.`,
  examples: [{
    title: 'Mudar uma variável através do apontador',
    code: C`
#include <stdio.h>

int main(void) {
    int x = 7;
    int *p = &x;
    *p = 20;
    printf("x=%d\n", x);
    printf("*p=%d\n", *p);
    return 0;
}`,
    steps: [
      { l: 3, push: 'main', n: 'Começa o main.' },
      { l: 4, d: { main: { x: ['int', '7', '1000'] } }, n: H`Cada caixa tem um endereço. Vamos fingir que o x está no endereço <strong>1000</strong>.` },
      { l: 5, d: { main: { p: ['int *', '1000 → x', '1008'] } }, n: H`<code>&amp;x</code> é a morada do x (1000). O p guarda essa morada: diz-se que <strong>p aponta para x</strong>.` },
      { l: 6, u: { main: { x: '20' } }, n: H`<code>*p</code> quer dizer "a caixa para onde p aponta". <code>*p = 20</code> vai à morada 1000 e guarda lá 20. Ou seja, muda o x, sem nunca escrever x!` },
      { l: 7, o: 'x=20\n', n: 'O x mudou mesmo.' },
      { l: 8, o: '*p=20\n', n: H`<code>*p</code> lê o que está na morada 1000: 20.` },
      { l: 9, n: 'Fim do programa.' },
    ],
  }, {
    title: 'A função troca (muito comum em testes)',
    code: C`
#include <stdio.h>

void troca(int *a, int *b) {
    int aux = *a;
    *a = *b;
    *b = aux;
}

int main(void) {
    int x = 3, y = 8;
    troca(&x, &y);
    printf("x=%d y=%d\n", x, y);
    return 0;
}`,
    steps: [
      { l: 9, push: 'main', n: 'Começa o main.' },
      { l: 10, d: { main: { x: ['int', '3', '1000'], y: ['int', '8', '1004'] } }, n: 'x está na morada 1000 e y na 1004.' },
      { l: 11, n: H`Envia as <strong>moradas</strong> de x e y (<code>&amp;x</code>, <code>&amp;y</code>), não os valores.` },
      { l: 3, push: 'troca', d: { troca: { a: ['int *', '1000 → x', '2000'], b: ['int *', '1004 → y', '2008'] } }, n: 'a e b recebem moradas. Agora a função sabe onde estão as caixas do main.' },
      { l: 4, d: { troca: { aux: ['int', '3', '2016'] } }, n: H`<code>*a</code> é o que está na morada 1000, ou seja 3. Guarda-se em aux.` },
      { l: 5, u: { main: { x: '8' } }, n: H`<code>*a = *b</code>: vai buscar o que está na morada de y (8) e guarda na morada de x. O x do main mudou!` },
      { l: 6, u: { main: { y: '3' } }, n: H`<code>*b = aux</code>: guarda 3 na morada de y.` },
      { l: 7, n: 'A função acaba e a, b e aux desaparecem. Mas as mudanças foram feitas nas caixas do main, por isso ficam.' },
      { l: 12, pop: true, o: 'x=8 y=3\n', n: 'Os valores foram trocados. Compara com a lição 6, em que a função só mexia numa cópia.' },
      { l: 13, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Confundir os dois usos do <code>*</code>. Na declaração (<code>int *p</code>) diz "isto é um apontador"; no uso (<code>*p = 5</code>) diz "vai à caixa apontada".`,
    H`Esquecer o <code>&amp;</code> ao chamar: <code>troca(x, y)</code> em vez de <code>troca(&amp;x, &amp;y)</code>.`,
    H`Usar um apontador sem lhe dar uma morada (<code>int *p; *p = 5;</code>). Aponta para um sítio qualquer e o programa pode rebentar.`,
    H`Esquecer o <code>*</code> dentro da função: <code>a = b;</code> troca as moradas guardadas nos papéis, não os valores.`,
    H`Esquecer que o nome de um array já é um endereço (o do primeiro elemento). É por isso que <code>scanf("%s", nome)</code> não leva &amp;.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
int a = 5;
int *p = &a;
*p = *p + 1;
printf("%d", a);`, opts: ['5', '6', '1', 'Um endereço'], ok: 1, mono: true, check: true,
      exp: 'p aponta para a, por isso *p + 1 é 5 + 1 e o 6 é guardado no próprio a.' },
    { q: 'Se int *p = &x;, qual destas afirmações é verdadeira?', opts: ['*p e x são a mesma caixa', 'p e x guardam o mesmo valor', '&p é o mesmo que &x', 'p é uma cópia de x'], ok: 0,
      exp: H`<code>*p</code> é a caixa para onde p aponta, que é o x. O p guarda a morada do x, não o valor.` },
    { q: 'O que aparece no ecrã?', code: C`
#include <stdio.h>

void f(int *n) {
    *n = *n * 2;
}

int main(void) {
    int v = 4;
    f(&v);
    f(&v);
    printf("%d", v);
    return 0;
}`, opts: ['4', '8', '16', '32'], ok: 2, mono: true, check: true,
      exp: 'Cada chamada duplica o próprio v, porque a função recebe a morada: 4 → 8 → 16.' },
    { q: 'O que aparece no ecrã?', code: C`
int x = 1, y = 2;
int *p = &x;
p = &y;
*p = 9;
printf("%d %d", x, y);`, opts: ['9 2', '1 9', '9 9', '1 2'], ok: 1, mono: true, check: true,
      exp: H`<code>p = &amp;y</code> faz o p passar a apontar para o y. Por isso o <code>*p = 9</code> muda o y, e o x fica com 1.` },
  ],
  exercises: [{
    title: 'Quociente e resto de uma vez',
    text: 'Escreve void dividir(int a, int b, int *q, int *r), que guarda em *q o quociente e em *r o resto de a / b. Testa no main com 17 e 5.',
    run: 'Quociente: 3, Resto: 2\n',
    hint: H`Dentro da função: <code>*q = a / b;</code> e <code>*r = a % b;</code>. No main: <code>dividir(17, 5, &amp;quoc, &amp;resto);</code>`,
    solution: C`
#include <stdio.h>

void dividir(int a, int b, int *q, int *r) {
    *q = a / b;
    *r = a % b;
}

int main(void) {
    int quoc, resto;
    dividir(17, 5, &quoc, &resto);
    printf("Quociente: %d, Resto: %d\n", quoc, resto);
    return 0;
}`,
  }, {
    title: 'Mínimo e máximo de um array',
    text: 'Escreve void minmax(int v[], int n, int *min, int *max), que encontra o menor e o maior valor do array. Testa com {7, 2, 9, 4}.',
    run: 'Min: 2, Max: 9\n',
    hint: H`Começa com <code>*min = v[0]; *max = v[0];</code> e percorre o resto do array com um for, a atualizar quando encontras um menor ou um maior.`,
    solution: C`
#include <stdio.h>

void minmax(int v[], int n, int *min, int *max) {
    *min = v[0];
    *max = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] < *min) {
            *min = v[i];
        }
        if (v[i] > *max) {
            *max = v[i];
        }
    }
}

int main(void) {
    int v[4] = {7, 2, 9, 4};
    int mn, mx;
    minmax(v, 4, &mn, &mx);
    printf("Min: %d, Max: %d\n", mn, mx);
    return 0;
}`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Estruturas (struct)',
  short: 'juntar dados de tipos diferentes e tabelas de structs',
  body: H`
<p>Um <code>struct</code> junta várias variáveis relacionadas numa só, mesmo que sejam de tipos diferentes. Um aluno tem número (int), nome (string) e nota (double): em vez de três variáveis soltas, crias um molde <code>Aluno</code>.</p>
<pre class="snip"><code>struct Aluno {
    int numero;
    char nome[20];
    double nota;
};   // atenção ao ; no fim</code></pre>
<ul>
<li>Criar uma variável: <code>struct Aluno a;</code></li>
<li>Aceder a um campo com ponto: <code>a.nota = 15.5;</code></li>
<li>Strings dentro do struct copiam-se com <code>strcpy(a.nome, "Rui");</code></li>
<li>Um <strong>array de structs</strong> (<code>struct Aluno turma[30];</code>) é como uma tabela: cada posição é uma linha, cada campo é uma coluna.</li>
<li>Com um apontador para struct usa-se a seta: <code>p-&gt;nota</code>, que é o mesmo que <code>(*p).nota</code>.</li>
</ul>`,
  analogy: 'Um struct é uma ficha de inscrição: um só papel com vários campos para preencher. Um array de structs é a pasta com as fichas da turma toda.',
  examples: [{
    title: 'Um aluno',
    code: C`
#include <stdio.h>

struct Aluno {
    int numero;
    char nome[20];
    double nota;
};

int main(void) {
    struct Aluno a = {1234, "Rui", 13.5};
    a.nota = a.nota + 1.0;
    printf("%d %s %.1f\n", a.numero, a.nome, a.nota);
    return 0;
}`,
    steps: [
      { l: 3, n: H`<code>struct Aluno</code> define um <strong>molde</strong>: diz que um Aluno tem número, nome e nota. Ainda não cria nenhuma variável, e a execução vai começar no main.` },
      { l: 9, push: 'main', n: 'Começa o main.' },
      { l: 10, d: { main: { a: ['struct Aluno', { numero: '1234', nome: '"Rui"', nota: '13.5' }] } }, n: 'Cria a variável a do tipo struct Aluno e preenche os campos pela ordem do molde.' },
      { l: 11, u: { main: { 'a.nota': '14.5' } }, n: H`<code>a.nota</code> lê-se "a nota do a". O ponto dá acesso a um campo.` },
      { l: 12, o: '1234 Rui 14.5\n', n: 'Cada campo usa o formato do seu tipo: %d, %s e %.1f.' },
      { l: 13, n: 'Fim do programa.' },
    ],
  }, {
    title: 'Uma turma (array de structs)',
    code: C`
#include <stdio.h>

struct Aluno {
    char nome[20];
    int nota;
};

int main(void) {
    struct Aluno turma[3] = {{"Rui", 12}, {"Ines", 17}, {"Tiago", 8}};
    int aprovados = 0;
    for (int i = 0; i < 3; i++) {
        if (turma[i].nota >= 10) {
            printf("%s aprovado\n", turma[i].nome);
            aprovados++;
        }
    }
    printf("Aprovados: %d\n", aprovados);
    return 0;
}`,
    steps: [
      { l: 8, push: 'main', n: 'Começa o main.' },
      { l: 9, d: { main: { turma: ['struct Aluno[3]', [{ nome: '"Rui"', nota: '12' }, { nome: '"Ines"', nota: '17' }, { nome: '"Tiago"', nota: '8' }]] } }, n: 'Um array de 3 structs: uma tabela com 3 linhas (índices 0 a 2), cada uma com nome e nota.' },
      { l: 10, d: { main: { aprovados: ['int', '0'] } }, n: 'Contador de aprovados, a começar em 0.' },
      { l: 11, d: { main: { i: ['int', '0'] } }, n: H`i = 0. 0 &lt; 3? Sim.` },
      { l: 12, n: H`<code>turma[0].nota</code> é 12. 12 &gt;= 10? Sim.` },
      { l: 13, o: 'Rui aprovado\n', n: H`<code>turma[0].nome</code> é "Rui".` },
      { l: 14, u: { main: { aprovados: '1' } }, n: 'Conta mais um.' },
      { l: 11, u: { main: { i: '1' } }, n: H`i++ → 1. 1 &lt; 3? Sim.` },
      { l: 12, n: H`<code>turma[1].nota</code> é 17. 17 &gt;= 10? Sim.` },
      { l: 13, o: 'Ines aprovado\n', n: 'Escreve o nome da linha 1.' },
      { l: 14, u: { main: { aprovados: '2' } }, n: 'Conta mais um.' },
      { l: 11, u: { main: { i: '2' } }, n: H`i++ → 2. 2 &lt; 3? Sim.` },
      { l: 12, n: H`<code>turma[2].nota</code> é 8. 8 &gt;= 10? Não, salta o bloco.` },
      { l: 11, u: { main: { i: '3' } }, n: H`i++ → 3. 3 &lt; 3? Falso: o ciclo acaba.` },
      { l: 17, x: { main: ['i'] }, o: 'Aprovados: 2\n', n: 'Mostra o total.' },
      { l: 18, n: 'Fim do programa.' },
    ],
  }],
  mistakes: [
    H`Esquecer o <code>;</code> depois da chaveta final do struct.`,
    H`Escrever <code>a.nome = "Rui";</code>. Strings copiam-se com <code>strcpy(a.nome, "Rui");</code>.`,
    H`Esquecer a palavra <code>struct</code> ao declarar (<code>Aluno a;</code>), a não ser que tenhas usado <code>typedef</code>.`,
    H`Escrever <code>turma.nota[i]</code> em vez de <code>turma[i].nota</code>. Primeiro escolhes a linha, depois o campo.`,
    H`Usar <code>.</code> com um apontador. Com apontador é <code>p-&gt;nota</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
#include <stdio.h>

struct Ponto {
    int x;
    int y;
};

int main(void) {
    struct Ponto p = {3, 4};
    p.x = p.y * 2;
    printf("%d %d", p.x, p.y);
    return 0;
}`, opts: ['3 4', '8 4', '6 4', '8 8'], ok: 1, mono: true, check: true,
      exp: 'p.y vale 4, e 4 × 2 = 8 é guardado em p.x. O p.y não muda.' },
    { q: 'Como mudas o nome do aluno a para "Ana"?', opts: ['a.nome = "Ana";', 'strcpy(a.nome, "Ana");', 'a->nome = "Ana";', 'nome.a = "Ana";'], ok: 1, mono: true,
      exp: H`O nome é uma string (um array de char), e os arrays não se copiam com <code>=</code>. Usa-se <code>strcpy</code>.` },
    { q: 'Tens struct Aluno turma[30]. Como chegas à nota do quinto aluno?', opts: ['turma.nota[4]', 'turma[5].nota', 'turma[4].nota', 'turma[4]->nota'], ok: 2, mono: true,
      exp: 'O quinto aluno é o índice 4 (começa em 0). Primeiro escolhes a linha, turma[4], depois o campo, .nota.' },
  ],
  exercises: [{
    title: 'Valor do stock',
    text: 'Define struct Produto com nome, preço (double) e quantidade (int). Cria um array com estes 3 produtos e mostra o valor total do stock (a soma de preço × quantidade). Caneta 0.80 € × 10, Caderno 2.50 € × 4, Mochila 25.00 € × 1.',
    run: 'Total em stock: 43.00 euros\n',
    hint: H`Cria <code>struct Produto loja[3] = {{"Caneta", 0.80, 10}, ...};</code> e soma <code>loja[i].preco * loja[i].quantidade</code> num for.`,
    solution: C`
#include <stdio.h>

struct Produto {
    char nome[30];
    double preco;
    int quantidade;
};

int main(void) {
    struct Produto loja[3] = {
        {"Caneta", 0.80, 10},
        {"Caderno", 2.50, 4},
        {"Mochila", 25.00, 1}
    };
    double total = 0;
    for (int i = 0; i < 3; i++) {
        total += loja[i].preco * loja[i].quantidade;
    }
    printf("Total em stock: %.2f euros\n", total);
    return 0;
}`,
  }],
});

if (typeof module !== 'undefined') module.exports = { LESSONS };
