// ===== Python do Zero — conteúdo das lições (parte 2) =====

// ---------------------------------------------------------------- 4
LESSONS.push({
  id: 4,
  title: 'Ciclos: for e while',
  short: 'range, percorrer texto, while, break e o do-while que não existe',
  body: H`
<p>O <code>while</code> é igual ao do C: repete enquanto a condição for verdadeira. O <code>for</code> é diferente: <strong>percorre uma sequência</strong>, dando ao nome do ciclo cada valor, um de cada vez.</p>
<table class="t">
<thead><tr><th>Python</th><th>Valores</th><th>Em C</th></tr></thead>
<tbody>
<tr><td><code>for i in range(4):</code></td><td>0, 1, 2, 3</td><td><code>for (i = 0; i &lt; 4; i++)</code></td></tr>
<tr><td><code>for i in range(1, 5):</code></td><td>1, 2, 3, 4 (o 5 fica de fora)</td><td><code>for (i = 1; i &lt; 5; i++)</code></td></tr>
<tr><td><code>for i in range(0, 10, 3):</code></td><td>0, 3, 6, 9</td><td><code>for (i = 0; i &lt; 10; i += 3)</code></td></tr>
<tr><td><code>for letra in "ola":</code></td><td>'o', 'l', 'a'</td><td>um ciclo até ao <code>'\0'</code></td></tr>
</tbody>
</table>
<ul>
<li>Não existe <code>i++</code>: escreve-se <code>i += 1</code>.</li>
<li><code>break</code> sai do ciclo; <code>continue</code> salta para a volta seguinte.</li>
<li>Não há <code>do-while</code>. Para "pedir até estar certo", pergunta uma vez antes do <code>while</code> e outra vez no fim do bloco, ou usa <code>while True:</code> com um <code>break</code>.</li>
</ul>`,
  analogy: 'O for do Python é uma fila de pessoas a passar por uma porta: o nome do ciclo é o crachá que vai sendo colado a cada pessoa que passa. Não precisas de contar as pessoas, a fila acaba sozinha.',
  examples: [{
    title: 'Somar de 1 a 3',
    code: C`
soma = 0
for i in range(1, 4):
    soma = soma + i
    print("i =", i, "soma =", soma)
print("Total:", soma)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['int', 0] }, d: { global: { soma: ['', '@o1'] } }, n: 'O acumulador começa em 0, como em C.' },
      { l: 2, obj: { o2: ['int', 1] }, d: { global: { i: ['', '@o2'] } }, n: H`<code>range(1, 4)</code> dá 1, 2 e 3. Na primeira volta, <code>i</code> aponta para o 1.` },
      { l: 3, obj: { o3: ['int', 1] }, u: { global: { soma: '@o3' } }, n: H`<code>soma + i</code> = 0 + 1 = 1, um objeto novo. O <code>soma</code> passa para lá e o 0 fica sem nomes.` },
      { l: 4, o: 'i = 1 soma = 1\n', n: 'Mostra os valores desta volta.' },
      { l: 2, obj: { o4: ['int', 2] }, u: { global: { i: '@o4' } }, n: H`Segunda volta: <code>i</code> passa para o 2. Não há <code>i++</code>: é o for que vai buscar o valor seguinte.` },
      { l: 3, obj: { o5: ['int', 3] }, u: { global: { soma: '@o5' } }, n: 'soma = 1 + 2 = 3' },
      { l: 4, o: 'i = 2 soma = 3\n', n: 'Mostra os valores desta volta.' },
      { l: 2, obj: { o6: ['int', 3] }, u: { global: { i: '@o6' } }, n: H`Terceira e última volta: <code>i</code> passa para o 3.` },
      { l: 3, obj: { o7: ['int', 6] }, u: { global: { soma: '@o7' } }, n: 'soma = 3 + 3 = 6' },
      { l: 4, o: 'i = 3 soma = 6\n', n: 'Mostra os valores desta volta.' },
      { l: 2, n: H`O <code>range</code> não tem mais valores: o ciclo acaba. Ao contrário do C, o <code>i</code> continua a existir depois do ciclo.` },
      { l: 5, o: 'Total: 6\n', n: 'Esta linha já está fora do ciclo.' },
    ],
  }, {
    title: 'Pedir até estar certo',
    code: C`
n = int(input("Positivo? "))
while n <= 0:
    n = int(input("Positivo? "))
print("Obrigado:", n)`,
    steps: [
      { l: 1, push: 'global', o: 'Positivo? ⟦-3⟧', obj: { o1: ['int', -3] }, d: { global: { n: ['', '@o1'] } }, n: H`Como não há <code>do-while</code>, pergunta-se uma primeira vez antes do ciclo.` },
      { l: 2, n: H`-3 &lt;= 0 é verdadeiro: entra no ciclo.` },
      { l: 3, o: 'Positivo? ⟦0⟧', obj: { o2: ['int', 0] }, u: { global: { n: '@o2' } }, n: 'Pergunta outra vez.' },
      { l: 2, n: H`0 &lt;= 0 é verdadeiro: mais uma volta.` },
      { l: 3, o: 'Positivo? ⟦8⟧', obj: { o3: ['int', 8] }, u: { global: { n: '@o3' } }, n: 'Agora escreve 8.' },
      { l: 2, n: H`8 &lt;= 0 é falso: sai do ciclo.` },
      { l: 4, o: 'Obrigado: 8\n', n: 'Só chega aqui com um número positivo.' },
    ],
  }],
  mistakes: [
    H`Achar que <code>range(1, 5)</code> inclui o 5. O segundo número nunca está incluído.`,
    H`Escrever <code>i++</code>: dá <em>SyntaxError</em>. É <code>i += 1</code>.`,
    H`Ciclo infinito num <code>while</code>: esquecer de mudar a variável da condição dentro do bloco.`,
    H`Esquecer os <code>:</code> no fim do <code>for</code> ou do <code>while</code>, ou a indentação do bloco.`,
    H`Escrever <code>for i in 10:</code>. Um número não é uma sequência: <em>TypeError: 'int' object is not iterable</em>. É <code>range(10)</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
for i in range(3):
    print(i, end=" ")`, opts: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], ok: 0, mono: true, check: true,
      exp: H`<code>range(3)</code> começa em 0 e pára antes do 3: 0, 1, 2.` },
    { q: 'O que aparece no ecrã?', code: C`
for i in range(2, 10, 3):
    print(i)`, opts: ['2\n5\n8', '2\n5\n8\n11', '3\n6\n9', '2\n4\n6\n8'], ok: 0, mono: true, check: true,
      exp: 'Começa em 2 e vai de 3 em 3: 2, 5, 8. O 11 já passa do 10, que de qualquer forma nunca está incluído.' },
    { q: 'O que aparece no ecrã?', code: C`
conta = 0
for c in "banana":
    if c == "a":
        conta += 1
print(conta)`, opts: ['3', '2', '6', '1'], ok: 0, mono: true, check: true,
      exp: H`O for dá a <code>c</code> cada letra de "banana", uma a uma. Há três letras a.` },
    { q: 'O que aparece no ecrã?', code: C`
i = 0
while i < 10:
    i += 4
print(i)`, opts: ['8', '12', '10', '4'], ok: 1, mono: true, check: true,
      exp: 'i vale 0, 4, 8 e, na última volta, 12. Só então a condição 12 < 10 falha. O print está fora do ciclo e mostra 12.' },
  ],
  exercises: [{
    title: 'Tabuada',
    text: 'Lê um número e mostra a tabuada dele, de 1 a 10.',
    run: 'Numero: ⟦7⟧' + Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}\n`).join(''),
    hint: H`<code>for i in range(1, 11):</code> e, em cada volta, <code>print(n, "x", i, "=", n * i)</code>.`,
    solution: C`
n = int(input("Numero: "))
for i in range(1, 11):
    print(n, "x", i, "=", n * i)`,
  }, {
    title: 'Somar até aparecer um zero',
    text: 'Lê números até o utilizador escrever 0. No fim mostra a soma e quantos números foram lidos (sem contar o 0).',
    run: 'Numero (0 termina): ⟦5⟧Numero (0 termina): ⟦3⟧Numero (0 termina): ⟦10⟧Numero (0 termina): ⟦0⟧Soma: 18\nLidos: 3\n',
    hint: H`<code>while True:</code>, lê o número, e se for 0 faz <code>break</code>. Senão, soma e conta.`,
    solution: C`
soma = 0
conta = 0
while True:
    n = int(input("Numero (0 termina): "))
    if n == 0:
        break
    soma += n
    conta += 1
print("Soma:", soma)
print("Lidos:", conta)`,
  }],
});

// ---------------------------------------------------------------- 5
LESSONS.push({
  id: 5,
  title: 'Listas',
  short: 'índices, len, append, fatias, e listas que mudam por dentro',
  body: H`
<p>Uma <strong>lista</strong> guarda vários valores por ordem: <code>notas = [12, 17, 9]</code>. Parece um array do C, mas é muito mais prática:</p>
<ul>
<li>Os índices começam em 0, como em C: <code>notas[0]</code> é o 12. E podes contar do fim: <code>notas[-1]</code> é o último.</li>
<li><code>len(notas)</code> dá o tamanho. A lista <strong>cresce</strong>: <code>notas.append(15)</code> acrescenta no fim. Também há <code>insert</code>, <code>pop</code>, <code>remove</code> e <code>sort</code>.</li>
<li>Uma <strong>fatia</strong> dá uma lista nova com parte dos elementos: <code>notas[1:3]</code> são os índices 1 e 2 (o 3 fica de fora, como no <code>range</code>).</li>
<li><code>x in notas</code> diz se o valor está na lista. <code>for n in notas:</code> percorre-a.</li>
<li>Ao contrário dos números e dos textos, as listas são <strong>mutáveis</strong>: o <code>append</code> e o <code>notas[2] = 10</code> mudam o próprio objeto, em vez de criarem um novo.</li>
</ul>`,
  analogy: 'Uma lista é um comboio de carruagens numeradas a partir do 0. Podes engatar mais carruagens no fim (append), trocar a carga de uma (notas[2] = 10) ou tirar uma (pop), e continua a ser o mesmo comboio.',
  examples: [{
    title: 'Mexer numa lista',
    code: C`
notas = [12, 17, 9]
notas.append(15)
notas[2] = 10
print(notas, len(notas))
print(notas[0], notas[-1])
print(notas[1:3])`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['list', [12, 17, 9]] }, d: { global: { notas: ['', '@o1'] } }, n: 'Uma lista com 3 elementos, nos índices 0, 1 e 2.' },
      { l: 2, obj: { o1: ['list', [12, 17, 9, 15]] }, n: H`O <code>append</code> acrescenta no fim do <strong>mesmo</strong> objeto #1. Não se cria uma lista nova: em C, um array nunca podia crescer.` },
      { l: 3, obj: { o1: ['list', [12, 17, 10, 15]] }, n: 'Muda o elemento de índice 2, outra vez dentro da mesma lista.' },
      { l: 4, o: '[12, 17, 10, 15] 4\n', n: H`O print mostra a lista toda, com os parênteses retos. <code>len</code> dá 4.` },
      { l: 5, o: '12 15\n', n: H`<code>notas[-1]</code> é o último elemento, sem precisares de saber o tamanho.` },
      { l: 6, obj: { o2: ['list', [17, 10]] }, o: '[17, 10]\n', n: H`A fatia <code>[1:3]</code> cria uma lista <strong>nova</strong> (#2) com os índices 1 e 2. Como nenhum nome aponta para ela, vai ser apagada logo a seguir.` },
    ],
  }, {
    title: 'Uma fila de espera',
    code: C`
fila = ["Ana", "Rui"]
fila.insert(0, "Ines")
fila.append("Tiago")
primeiro = fila.pop(0)
print(primeiro, fila)
print("Rui" in fila, len(fila))`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['list', ["'Ana'", "'Rui'"]] }, d: { global: { fila: ['', '@o1'] } }, n: 'Uma lista de textos.' },
      { l: 2, obj: { o1: ['list', ["'Ines'", "'Ana'", "'Rui'"]] }, n: H`<code>insert(0, ...)</code> põe a Ines na posição 0; os outros andam uma posição.` },
      { l: 3, obj: { o1: ['list', ["'Ines'", "'Ana'", "'Rui'", "'Tiago'"]] }, n: H`<code>append</code> põe o Tiago no fim.` },
      { l: 4, obj: { o1: ['list', ["'Ana'", "'Rui'", "'Tiago'"]], o2: ['str', "'Ines'"] }, d: { global: { primeiro: ['', '@o2'] } }, n: H`<code>pop(0)</code> tira o elemento da posição 0 e devolve-o: a Ines sai da fila e fica com o nome <code>primeiro</code>.` },
      { l: 5, o: "Ines ['Ana', 'Rui', 'Tiago']\n", n: 'Repara nas plicas: o print de uma lista mostra os textos entre plicas.' },
      { l: 6, o: 'True 3\n', n: H`<code>"Rui" in fila</code> dá <code>True</code>. Ficaram 3 pessoas.` },
    ],
  }],
  mistakes: [
    H`Aceder a um índice que não existe: <em>IndexError: list index out of range</em>. Numa lista de 4, o último é <code>[3]</code> (ou <code>[-1]</code>).`,
    H`Escrever <code>x = notas.sort()</code>. O <code>sort</code> ordena a própria lista e devolve <code>None</code>. Para ter uma cópia ordenada, usa <code>sorted(notas)</code>.`,
    H`Usar <code>push</code> (de outras linguagens): <em>AttributeError: 'list' object has no attribute 'push'. Did you mean '.append'?</em>`,
    H`Esquecer que a fatia <code>[a:b]</code> não inclui o índice <code>b</code>.`,
    H`Fazer <code>notas.append(15, 16)</code>. O append recebe um só valor; para vários usa <code>notas.extend([15, 16])</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
v = [3, 6, 9, 12]
print(v[1], v[-1])`, opts: ['3 12', '6 12', '6 9', '3 9'], ok: 1, mono: true, check: true,
      exp: H`Os índices começam em 0, por isso <code>v[1]</code> é o 6. <code>v[-1]</code> é o último, o 12.` },
    { q: 'O que aparece no ecrã?', code: C`
v = [1, 2, 3]
v.append([4, 5])
print(len(v))`, opts: ['5', '4', '3', 'TypeError'], ok: 1, mono: true, check: true,
      exp: H`O append acrescenta <strong>um</strong> elemento, e esse elemento é a lista [4, 5] inteira. A lista fica [1, 2, 3, [4, 5]], com 4 elementos.` },
    { q: 'O que aparece no ecrã?', code: C`
v = [10, 20, 30, 40, 50]
print(v[1:3])`, opts: ['[20, 30]', '[20, 30, 40]', '[10, 20, 30]', '[30, 40]'], ok: 0, mono: true, check: true,
      exp: 'A fatia começa no índice 1 (o 20) e pára antes do índice 3: ficam o 20 e o 30.' },
    { q: 'O que aparece no ecrã?', code: C`
v = [5, 1, 4]
x = v.sort()
print(x, v)`, opts: ['[1, 4, 5] [1, 4, 5]', 'None [1, 4, 5]', '[1, 4, 5] [5, 1, 4]', 'None [5, 1, 4]'], ok: 1, mono: true, check: true,
      exp: H`O <code>sort</code> muda a própria lista e não devolve nada (devolve <code>None</code>). Por isso <code>x</code> fica com None, e <code>v</code> fica ordenada.` },
  ],
  exercises: [{
    title: 'Ao contrário',
    text: 'Lê 5 inteiros, um por linha, para uma lista. Mostra a lista ao contrário e a soma dos números.',
    run: '⟦1⟧⟦2⟧⟦3⟧⟦4⟧⟦5⟧[5, 4, 3, 2, 1]\nSoma: 15\n',
    hint: H`Começa com <code>numeros = []</code> e faz <code>append</code> num for de 5 voltas. <code>numeros[::-1]</code> dá a lista ao contrário e <code>sum(numeros)</code> a soma.`,
    solution: C`
numeros = []
for i in range(5):
    numeros.append(int(input()))
print(numeros[::-1])
print("Soma:", sum(numeros))`,
  }, {
    title: 'Acima da média',
    text: 'Para a lista [4, 8, 15, 16, 23, 42], calcula a média e conta quantos valores estão acima dela.',
    run: 'Media: 18.0\nAcima da media: 2\n',
    hint: H`<code>media = sum(v) / len(v)</code>. Depois percorre a lista com um for e conta os maiores do que a média.`,
    solution: C`
v = [4, 8, 15, 16, 23, 42]
media = sum(v) / len(v)
acima = 0
for x in v:
    if x > media:
        acima += 1
print("Media:", media)
print("Acima da media:", acima)`,
  }],
});

// ---------------------------------------------------------------- 6
LESSONS.push({
  id: 6,
  title: 'Dois nomes, uma lista',
  short: 'b = a não copia: aliasing, copy(), is contra ==',
  body: H`
<p>Lembras-te de que <code>b = a</code> não copia nada, só cola um segundo nome no mesmo objeto? Com números e textos isso não se notava, porque eles nunca mudam. Com <strong>listas</strong>, que mudam por dentro, nota-se muito:</p>
<ul>
<li>Depois de <code>b = a</code>, <code>b.append(4)</code> muda o único objeto que existe, por isso <code>a</code> também "muda". Diz-se que <code>a</code> e <code>b</code> são <strong>aliases</strong> (dois nomes para a mesma coisa).</li>
<li>Já <code>b = [9]</code> não mexe em <code>a</code>: cria uma lista nova e muda só a etiqueta <code>b</code>.</li>
<li>Para ter uma cópia a sério: <code>c = a.copy()</code> (ou <code>a[:]</code>, ou <code>list(a)</code>).</li>
<li><code>a == b</code> pergunta se têm o mesmo conteúdo; <code>a is b</code> pergunta se são o mesmo objeto.</li>
</ul>
<p>Se fizeste a lição dos apontadores do C, é a mesma ideia: em C, dois apontadores para a mesma variável; aqui, dois nomes para o mesmo objeto.</p>`,
  analogy: 'Dois comandos da mesma televisão: se mudas de canal com um, a televisão muda para os dois, porque só há uma televisão. Comprar uma televisão nova e ficar com um dos comandos para ela (b = [9]) já não mexe na antiga.',
  examples: [{
    title: 'Mudar através do outro nome',
    code: C`
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(a is b)
b = [9]
print(a, b)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['list', [1, 2, 3]] }, d: { global: { a: ['', '@o1'] } }, n: H`Uma lista, o objeto #1, com o nome <code>a</code>.` },
      { l: 2, d: { global: { b: ['', '@o1'] } }, n: H`<code>b = a</code>: o <code>b</code> aponta para o <strong>mesmo</strong> objeto #1. Repara nas duas setas para o #1. Não há nenhuma lista nova.` },
      { l: 3, obj: { o1: ['list', [1, 2, 3, 4]] }, n: H`O append através de <code>b</code> muda o objeto #1, o único que existe.` },
      { l: 4, o: '[1, 2, 3, 4]\n', n: H`Por isso, quem segue o nome <code>a</code> também vê o 4.` },
      { l: 5, o: 'True\n', n: H`<code>is</code> pergunta "são o mesmo objeto?". São.` },
      { l: 6, obj: { o2: ['list', [9]] }, u: { global: { b: '@o2' } }, n: H`Agora é diferente: <code>b = [9]</code> cria uma lista nova (#2) e muda só a etiqueta <code>b</code>. O objeto #1 não é tocado.` },
      { l: 7, o: '[1, 2, 3, 4] [9]\n', n: H`<code>a</code> continua na lista antiga. Mudar o objeto (append) e mudar o nome (=) são coisas diferentes.` },
    ],
  }, {
    title: 'Uma cópia a sério',
    code: C`
a = [1, 2, 3]
c = a.copy()
c.append(4)
print(a, c)
print(a == [1, 2, 3], a is c)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['list', [1, 2, 3]] }, d: { global: { a: ['', '@o1'] } }, n: 'A mesma lista de antes.' },
      { l: 2, obj: { o2: ['list', [1, 2, 3]] }, d: { global: { c: ['', '@o2'] } }, n: H`<code>copy()</code> cria uma lista <strong>nova</strong> (#2) com os mesmos valores. Agora há dois objetos.` },
      { l: 3, obj: { o2: ['list', [1, 2, 3, 4]] }, n: 'O append muda só a cópia.' },
      { l: 4, o: '[1, 2, 3] [1, 2, 3, 4]\n', n: 'A original ficou como estava.' },
      { l: 5, o: 'True False\n', n: H`<code>==</code> compara o conteúdo (é igual a [1, 2, 3]); <code>is</code> compara se é o mesmo objeto (a e c não são).` },
    ],
  }],
  mistakes: [
    H`Fazer <code>backup = lista</code> antes de mudar a lista, a pensar que guardou uma cópia. Guardou um segundo nome; usa <code>lista.copy()</code>.`,
    H`Passar uma lista a uma função e estranhar que ela mude no programa principal (lição 7).`,
    H`Usar <code>is</code> para comparar valores (<code>if nome is "Ana"</code>). Para valores é <code>==</code>; o <code>is</code> só serve para saber se é o mesmo objeto (e para <code>is None</code>).`,
    H`Criar uma matriz com <code>[[0] * 3] * 3</code>: são três nomes para a mesma linha. Usa <code>[[0] * 3 for _ in range(3)]</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
x = [1, 2]
y = x
y[0] = 99
print(x)`, opts: ['[1, 2]', '[99, 2]', '[99, 2] [99, 2]', 'TypeError'], ok: 1, mono: true, check: true,
      exp: H`<code>x</code> e <code>y</code> apontam para a mesma lista. Mudar um elemento através de <code>y</code> muda o único objeto que existe.` },
    { q: 'O que aparece no ecrã?', code: C`
x = [1, 2]
y = x[:]
y[0] = 99
print(x)`, opts: ['[1, 2]', '[99, 2]', '[99, 1, 2]', '[]'], ok: 0, mono: true, check: true,
      exp: H`A fatia <code>[:]</code> (do princípio ao fim) cria uma lista nova com os mesmos valores, ou seja, uma cópia. Mudar a cópia não mexe na original.` },
    { q: 'O que aparece no ecrã?', code: C`
x = 5
y = x
y = y + 1
print(x)`, opts: ['5', '6', '5 6', 'None'], ok: 0, mono: true, check: true,
      exp: H`Os números não mudam por dentro: <code>y + 1</code> cria um objeto novo e só o nome <code>y</code> passa para lá. O <code>x</code> continua no 5.` },
    { q: 'O que aparece no ecrã?', code: C`
a = [1, 2]
b = [1, 2]
print(a == b, a is b)`, opts: ['True True', 'True False', 'False False', 'False True'], ok: 1, mono: true, check: true,
      exp: H`São duas listas criadas em separado, com o mesmo conteúdo: <code>==</code> dá True, <code>is</code> dá False.` },
    { q: 'O que aparece no ecrã? (esta é difícil)', code: C`
m = [[0] * 2] * 2
m[0][0] = 1
print(m)`, opts: ['[[1, 0], [0, 0]]', '[[1, 0], [1, 0]]', '[[1, 1], [0, 0]]', '[[1, 1], [1, 1]]'], ok: 1, mono: true, check: true,
      exp: H`<code>[linha] * 2</code> não copia a linha: faz uma lista com duas referências para a <strong>mesma</strong> linha. Mudar <code>m[0][0]</code> muda essa linha, que também é a <code>m[1]</code>.` },
  ],
  exercises: [{
    title: 'Ordenar sem estragar',
    text: 'Começa com original = [3, 1, 2]. Faz uma cópia, ordena a cópia e mostra as duas listas.',
    run: 'original: [3, 1, 2]\nordenada: [1, 2, 3]\n',
    hint: H`<code>ordenada = original.copy()</code> e depois <code>ordenada.sort()</code>. (Também podias usar <code>sorted(original)</code>, que devolve uma lista nova.)`,
    solution: C`
original = [3, 1, 2]
ordenada = original.copy()
ordenada.sort()
print("original:", original)
print("ordenada:", ordenada)`,
  }, {
    title: 'Cópia de segurança',
    text: 'Tens compras = ["pao", "leite"]. Guarda uma cópia de segurança em backup, esvazia a lista compras com compras.clear() e mostra as duas listas. O backup tem de continuar com os dois produtos.',
    run: "[] ['pao', 'leite']\n",
    hint: H`Se fizeres <code>backup = compras</code>, o <code>clear</code> esvazia as duas, porque é a mesma lista. Usa <code>compras.copy()</code>.`,
    solution: C`
compras = ["pao", "leite"]
backup = compras.copy()
compras.clear()
print(compras, backup)`,
  }],
});

// ---------------------------------------------------------------- 7
LESSONS.push({
  id: 7,
  title: 'Funções',
  short: 'def, return, None, e parâmetros que apontam para os mesmos objetos',
  body: H`
<p>Uma função define-se com <code>def</code>, sem tipos: <code>def quadrado(x):</code>, e um bloco indentado. Devolve um valor com <code>return</code>; se não tiver <code>return</code>, devolve <code>None</code> (o "nada" do Python).</p>
<p>Como são passados os argumentos? Nem cópia, como no C, nem apontador: <strong>o parâmetro é um nome novo que aponta para o mesmo objeto</strong> que o argumento. Isto tem duas consequências:</p>
<ul>
<li>Se a função <strong>muda o objeto</strong> (por exemplo, <code>lista.append(...)</code>), quem chamou vê a mudança, porque é o mesmo objeto.</li>
<li>Se a função <strong>muda o nome</strong> (<code>valor = 0</code>), só o nome local muda. Com números e textos, que nunca mudam por dentro, o resultado é o mesmo que a passagem por valor do C.</li>
</ul>
<p>As funções também são objetos: <code>def</code> cria um objeto função e cola-lhe o nome.</p>`,
  analogy: 'Chamar uma função é dar ao colega a morada do teu armário, com um post-it novo com o nome que ele quiser. Se ele arrumar o armário, quando lá fores vês a diferença. Se ele colar o post-it noutro armário, o teu fica igual.',
  examples: [{
    title: 'Uma função que devolve um valor',
    code: C`
def quadrado(x):
    r = x * x
    return r

n = 4
q = quadrado(n)
print(n, q)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'quadrado(x)'] }, d: { global: { quadrado: ['', '@o1'] } }, n: H`O <code>def</code> não corre a função: cria um objeto função e cola-lhe o nome <code>quadrado</code>. O corpo só corre quando a função for chamada.` },
      { l: 5, obj: { o2: ['int', 4] }, d: { global: { n: ['', '@o2'] } }, n: 'O programa continua depois da função: n aponta para o 4.' },
      { l: 6, push: 'quadrado', d: { quadrado: { x: ['', '@o2'] } }, n: H`Chama a função. Cria-se um frame novo, e o parâmetro <code>x</code> aponta para o <strong>mesmo</strong> objeto 4 que o <code>n</code>.` },
      { l: 2, obj: { o3: ['int', 16] }, d: { quadrado: { r: ['', '@o3'] } }, n: 'r = 4 × 4 = 16' },
      { l: 3, n: H`<code>return r</code> devolve o objeto 16 a quem chamou.` },
      { l: 6, pop: true, d: { global: { q: ['', '@o3'] } }, n: H`O frame da função desaparece (e com ele os nomes x e r), mas o objeto 16 não: agora é o <code>q</code> que aponta para ele.` },
      { l: 7, o: '4 16\n', n: 'Mostra os dois valores.' },
    ],
  }, {
    title: 'Mudar o objeto contra mudar o nome',
    code: C`
def junta(lista, valor):
    lista.append(valor)
    valor = 0

notas = [12, 15]
v = 18
junta(notas, v)
print(notas, v)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['function', 'junta(lista, valor)'] }, d: { global: { junta: ['', '@o1'] } }, n: 'Define a função.' },
      { l: 5, obj: { o2: ['list', [12, 15]] }, d: { global: { notas: ['', '@o2'] } }, n: 'Uma lista com duas notas.' },
      { l: 6, obj: { o3: ['int', 18] }, d: { global: { v: ['', '@o3'] } }, n: 'E um número.' },
      { l: 7, push: 'junta', d: { junta: { lista: ['', '@o2'], valor: ['', '@o3'] } }, n: H`Na chamada, <code>lista</code> aponta para o mesmo objeto que <code>notas</code> (#2) e <code>valor</code> para o mesmo que <code>v</code> (#3).` },
      { l: 2, obj: { o2: ['list', [12, 15, 18]] }, n: H`O append muda o objeto #2, que é o mesmo do <code>notas</code>. Esta mudança vai ficar.` },
      { l: 3, obj: { o4: ['int', 0] }, u: { junta: { valor: '@o4' } }, n: H`<code>valor = 0</code> só muda o nome local <code>valor</code> para outro objeto. O <code>v</code> do programa principal continua no 18.` },
      { l: 7, pop: true, n: 'A função acaba e os seus nomes desaparecem. O 0 fica sem nomes.' },
      { l: 8, o: '[12, 15, 18] 18\n', n: 'A lista mudou (a função mexeu no objeto), o v não (a função só mudou um nome dela).' },
    ],
  }],
  mistakes: [
    H`Confundir <code>print</code> com <code>return</code>. Uma função que só faz print devolve <code>None</code> a quem a chama.`,
    H`Esquecer os parênteses ao chamar: <code>x = quadrado</code> dá a própria função, não o resultado.`,
    H`Chamar a função antes do <code>def</code>: <em>NameError</em>. O def tem de correr primeiro.`,
    H`Mudar uma lista recebida como parâmetro sem querer. Se a função não a deve mudar, trabalha numa cópia.`,
    H`Esquecer que o <code>return</code> sai logo da função: o código a seguir, no mesmo bloco, não corre.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
def dobro(n):
    return n * 2

print(dobro(dobro(3)))`, opts: ['6', '9', '12', '3'], ok: 2, mono: true, check: true,
      exp: 'Começa por dentro: dobro(3) = 6, e depois dobro(6) = 12.' },
    { q: 'O que aparece no ecrã?', code: C`
def f(x):
    x = x + 1

a = 1
f(a)
print(a)`, opts: ['1', '2', 'None', '0'], ok: 0, mono: true, check: true,
      exp: H`<code>x = x + 1</code> cria um objeto novo e muda só o nome local <code>x</code>. O <code>a</code> continua no 1, como no C.` },
    { q: 'O que aparece no ecrã?', code: C`
def f(v):
    v.append(0)

a = [1]
f(a)
print(a)`, opts: ['[1]', '[1, 0]', '[0]', 'None'], ok: 1, mono: true, check: true,
      exp: H`<code>v</code> e <code>a</code> apontam para a mesma lista. O append muda esse objeto, e a mudança vê-se fora da função.` },
    { q: 'O que aparece no ecrã?', code: C`
def f():
    print("ola")

x = f()
print(x)`, opts: ['ola', 'ola\nNone', 'None', 'ola\nola'], ok: 1, mono: true, check: true,
      exp: H`Chamar <code>f()</code> escreve "ola". Como a função não tem <code>return</code>, devolve <code>None</code>, e é isso que <code>x</code> recebe.` },
  ],
  exercises: [{
    title: 'Função eh_par',
    text: 'Escreve uma função eh_par(n) que devolve True se n for par e False se não for. Usa-a para classificar os números de 1 a 4.',
    run: '1: impar\n2: par\n3: impar\n4: par\n',
    hint: H`A função pode ser uma só linha: <code>return n % 2 == 0</code>. No ciclo: <code>if eh_par(i):</code>.`,
    solution: C`
def eh_par(n):
    return n % 2 == 0

for i in range(1, 5):
    if eh_par(i):
        print(f"{i}: par")
    else:
        print(f"{i}: impar")`,
  }, {
    title: 'Função media',
    text: 'Escreve uma função media(lista) que devolve a média dos números da lista. Mostra a média de [12, 15, 14] com 2 casas decimais.',
    run: 'Media: 13.67\n',
    hint: H`<code>return sum(lista) / len(lista)</code>. Em Python o <code>/</code> já dá real.`,
    solution: C`
def media(lista):
    return sum(lista) / len(lista)

print(f"Media: {media([12, 15, 14]):.2f}")`,
  }],
});
