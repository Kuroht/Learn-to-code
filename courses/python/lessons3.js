// ===== Python do Zero — conteúdo das lições (parte 3) =====

// ---------------------------------------------------------------- 8
LESSONS.push({
  id: 8,
  title: 'Texto (strings)',
  short: "índices e fatias, métodos que devolvem texto novo, e porque é que s[0] = 'x' dá erro",
  body: H`
<p>Em C uma string era um array de <code>char</code> com um <code>'\0'</code> no fim, e precisavas de <code>strcpy</code>, <code>strcmp</code> e <code>strlen</code>. Em Python é um objeto <code>str</code> e tudo fica mais simples: copias com <code>=</code>, comparas com <code>==</code>, juntas com <code>+</code>.</p>
<ul>
<li>Índices e fatias funcionam como nas listas: <code>s[0]</code>, <code>s[-1]</code>, <code>s[1:3]</code>, <code>s[::-1]</code> (ao contrário). <code>len(s)</code> dá o tamanho.</li>
<li>As strings são <strong>imutáveis</strong>: <code>s[0] = "p"</code> dá erro. Para "mudar" um texto, crias outro: <code>"p" + s[1:]</code>.</li>
<li>Por isso os métodos <strong>devolvem um texto novo</strong> e deixam o original igual: <code>s.upper()</code>, <code>s.lower()</code>, <code>s.strip()</code> (tira espaços das pontas), <code>s.replace("a", "o")</code>.</li>
<li><code>s.split()</code> parte o texto numa lista de palavras; <code>"-".join(lista)</code> faz o contrário.</li>
<li><code>"an" in s</code> diz se aparece; <code>s.count("a")</code> conta; <code>s.find("n")</code> dá a posição (ou -1).</li>
</ul>`,
  analogy: 'Uma string é uma frase gravada numa placa de metal: não se apaga uma letra. Para ter outra frase, gravas uma placa nova (o upper, o replace...), e a antiga fica como estava até ninguém precisar dela.',
  examples: [{
    title: 'Limpar e partir um nome',
    code: C`
nome = "  ana silva "
limpo = nome.strip()
maiusc = limpo.upper()
print(maiusc, len(limpo))
partes = limpo.split()
print(partes, partes[1])`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['str', "'  ana silva '"] }, d: { global: { nome: ['', '@o1'] } }, n: 'Um texto com espaços a mais nas pontas, como acontece muito com o que o utilizador escreve.' },
      { l: 2, obj: { o2: ['str', "'ana silva'"] }, d: { global: { limpo: ['', '@o2'] } }, n: H`<code>strip()</code> devolve um texto <strong>novo</strong>, sem os espaços das pontas. O <code>nome</code> continua igual.` },
      { l: 3, obj: { o3: ['str', "'ANA SILVA'"] }, d: { global: { maiusc: ['', '@o3'] } }, n: H`<code>upper()</code> também cria um texto novo, em maiúsculas.` },
      { l: 4, o: 'ANA SILVA 9\n', n: H`"ana silva" tem 9 caracteres (o espaço do meio conta). Não há <code>'\0'</code> para descontar.` },
      { l: 5, obj: { o4: ['list', ["'ana'", "'silva'"]] }, d: { global: { partes: ['', '@o4'] } }, n: H`<code>split()</code> parte o texto pelos espaços e devolve uma lista de palavras.` },
      { l: 6, o: "['ana', 'silva'] silva\n", n: H`<code>partes[1]</code> é a segunda palavra.` },
    ],
  }, {
    title: 'Texto não se muda por dentro',
    code: C`
s = "gato"
t = "p" + s[1:]
print(s, t)
s[0] = "p"`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['str', "'gato'"] }, d: { global: { s: ['', '@o1'] } }, n: 'Um texto.' },
      { l: 2, obj: { o2: ['str', "'pato'"] }, d: { global: { t: ['', '@o2'] } }, n: H`<code>s[1:]</code> é "ato", e "p" + "ato" é um texto novo: "pato".` },
      { l: 3, o: 'gato pato\n', n: 'O s continua a ser "gato".' },
      { l: 4, o: "TypeError: 'str' object does not support item assignment\n", n: H`Em C podias fazer <code>s[0] = 'p'</code>. Em Python, um <code>str</code> não pode ser mudado por dentro, e o programa pára com este erro.` },
    ],
  }],
  mistakes: [
    H`Tentar mudar uma letra: <em>TypeError: 'str' object does not support item assignment</em>. Cria um texto novo.`,
    H`Chamar o método e esquecer de guardar o resultado: <code>nome.upper()</code> sozinho não muda o <code>nome</code>. É <code>nome = nome.upper()</code>.`,
    H`Juntar texto com número: <code>"Nota: " + 15</code> dá TypeError. Usa uma f-string ou <code>str(15)</code>.`,
    H`Comparar sem pensar nas maiúsculas: <code>"Ana" == "ana"</code> é False. Compara <code>a.lower() == b.lower()</code>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
s = "Porto"
print(s[0], s[-1], len(s))`, opts: ['P o 5', 'P o 6', 'P t 5', 'o P 5'], ok: 0, mono: true, check: true,
      exp: H`<code>s[0]</code> é a primeira letra e <code>s[-1]</code> a última. "Porto" tem 5 letras, sem nenhum <code>'\0'</code> a contar.` },
    { q: 'O que aparece no ecrã?', code: C`print("utad".upper().replace("T", "-"))`, opts: ['U-AD', 'u-ad', 'UTAD', 'U-A-D'], ok: 0, mono: true, check: true,
      exp: H`Primeiro <code>upper()</code> dá "UTAD"; depois <code>replace</code> troca o T por um hífen. Cada método trabalha sobre o texto devolvido pelo anterior.` },
    { q: 'O que aparece no ecrã?', code: C`print("-".join(["a", "b", "c"]))`, opts: ['a-b-c', '-a-b-c-', 'abc', "['a', 'b', 'c']"], ok: 0, mono: true, check: true,
      exp: H`O <code>join</code> cola os elementos da lista com o texto da esquerda <strong>entre</strong> eles, não nas pontas.` },
    { q: 'O que aparece no ecrã?', code: C`
s = "banana"
print(s.count("an"), s.find("n"))`, opts: ['2 2', '2 3', '3 2', '1 2'], ok: 0, mono: true, check: true,
      exp: '"an" aparece duas vezes (b-an-an-a). O primeiro n está no índice 2: b é o 0, a o 1, n o 2.' },
    { q: 'O que aparece no ecrã?', code: C`
a = "ola"
b = a.upper()
print(a)`, opts: ['ola', 'OLA', 'ola OLA', 'None'], ok: 0, mono: true, check: true,
      exp: H`<code>upper()</code> devolve um texto novo (que fica no <code>b</code>) e não muda o original.` },
  ],
  exercises: [{
    title: 'Palavra ao contrário',
    text: 'Lê uma palavra e mostra-a ao contrário.',
    run: 'Palavra: ⟦vila⟧aliv\n',
    hint: H`A fatia <code>[::-1]</code> percorre o texto do fim para o princípio.`,
    solution: C`
palavra = input("Palavra: ")
print(palavra[::-1])`,
  }, {
    title: 'Contar vogais',
    text: 'Lê uma palavra e conta quantas vogais tem, quer estejam em maiúsculas quer em minúsculas.',
    run: 'Palavra: ⟦Engenharia⟧Vogais: 5\n',
    hint: H`Percorre <code>palavra.lower()</code> com um for e testa <code>if letra in "aeiou":</code>.`,
    solution: C`
palavra = input("Palavra: ")
vogais = 0
for letra in palavra.lower():
    if letra in "aeiou":
        vogais += 1
print("Vogais:", vogais)`,
  }],
});

// ---------------------------------------------------------------- 9
LESSONS.push({
  id: 9,
  title: 'Dicionários',
  short: 'chave → valor, get, in, items() e contar coisas',
  body: H`
<p>Um <strong>dicionário</strong> guarda pares <strong>chave → valor</strong>: <code>notas = {"Ana": 17, "Rui": 9}</code>. Numa lista chegas a um valor pela posição (<code>[0]</code>); num dicionário chegas pela chave (<code>notas["Ana"]</code>).</p>
<ul>
<li><code>notas["Ines"] = 14</code> acrescenta um par; se a chave já existir, troca o valor. As chaves não se repetem.</li>
<li>Pedir uma chave que não existe dá <em>KeyError</em>. Para evitar: <code>"Tiago" in notas</code>, ou <code>notas.get("Tiago", 0)</code>, que devolve 0 se não existir.</li>
<li><code>for nome in notas:</code> percorre as chaves; <code>for nome, nota in notas.items():</code> percorre os pares.</li>
<li>É mutável, tal como as listas (e os mesmos cuidados da lição 6 aplicam-se).</li>
</ul>
<p>Os pares que o <code>items()</code> dá são <strong>tuplos</strong>: <code>("Ana", 17)</code>. Um tuplo é como uma lista que não se pode mudar, escrito com parênteses.</p>`,
  analogy: 'Um dicionário é uma agenda de contactos: procuras pelo nome (a chave) e encontras o número (o valor). Não tens de saber em que página está, e não podes ter duas entradas com o mesmo nome.',
  examples: [{
    title: 'Notas por nome',
    code: C`
notas = {"Ana": 17, "Rui": 9}
notas["Ines"] = 14
notas["Rui"] = 10
print(notas["Ana"], len(notas))
print(notas.get("Tiago", 0))
for nome, nota in notas.items():
    print(nome, nota)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['dict', [["'Ana'", 17], ["'Rui'", 9]]] }, d: { global: { notas: ['', '@o1'] } }, n: 'Um dicionário com duas chaves (os nomes) e os seus valores (as notas).' },
      { l: 2, obj: { o1: ['dict', [["'Ana'", 17], ["'Rui'", 9], ["'Ines'", 14]]] }, n: 'A chave "Ines" não existia: acrescenta um par novo, no mesmo objeto.' },
      { l: 3, obj: { o1: ['dict', [["'Ana'", 17], ["'Rui'", 10], ["'Ines'", 14]]] }, n: 'A chave "Rui" já existia: troca só o valor. Continua a haver um só Rui.' },
      { l: 4, o: '17 3\n', n: H`<code>notas["Ana"]</code> vai buscar o valor pela chave. Há 3 pares.` },
      { l: 5, o: '0\n', n: H`Não há nenhum Tiago. <code>notas["Tiago"]</code> dava KeyError; o <code>get</code> devolve o valor por omissão, 0.` },
      { l: 6, obj: { o2: ['str', "'Ana'"], o3: ['int', 17] }, d: { global: { nome: ['', '@o2'], nota: ['', '@o3'] } }, n: H`<code>items()</code> dá os pares por ordem de inserção. Na primeira volta, <code>nome</code> e <code>nota</code> apontam para "Ana" e 17.` },
      { l: 7, o: 'Ana 17\n', n: 'Mostra o par.' },
      { l: 6, obj: { o4: ['str', "'Rui'"], o5: ['int', 10] }, u: { global: { nome: '@o4', nota: '@o5' } }, n: 'Segunda volta: o par do Rui.' },
      { l: 7, o: 'Rui 10\n', n: 'Mostra o par.' },
      { l: 6, obj: { o6: ['str', "'Ines'"], o7: ['int', 14] }, u: { global: { nome: '@o6', nota: '@o7' } }, n: 'Terceira e última volta.' },
      { l: 7, o: 'Ines 14\n', n: 'Mostra o par. O ciclo acaba.' },
    ],
  }, {
    title: 'Contar palavras',
    code: C`
texto = "a b a c a"
conta = {}
for p in texto.split():
    conta[p] = conta.get(p, 0) + 1
print(conta)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['str', "'a b a c a'"] }, d: { global: { texto: ['', '@o1'] } }, n: 'Um texto com palavras repetidas.' },
      { l: 2, obj: { o2: ['dict', []] }, d: { global: { conta: ['', '@o2'] } }, n: H`<code>{}</code> é um dicionário vazio.` },
      { l: 3, obj: { o3: ['str', "'a'"] }, d: { global: { p: ['', '@o3'] } }, n: H`<code>split()</code> dá as palavras: a, b, a, c, a. Primeira: "a".` },
      { l: 4, obj: { o2: ['dict', [["'a'", 1]]] }, n: H`"a" ainda não é chave, por isso <code>get</code> dá 0. Guarda 0 + 1 = 1.` },
      { l: 3, obj: { o4: ['str', "'b'"] }, u: { global: { p: '@o4' } }, n: 'Segunda palavra: "b".' },
      { l: 4, obj: { o2: ['dict', [["'a'", 1], ["'b'", 1]]] }, n: 'Também é nova: fica com 1.' },
      { l: 3, obj: { o5: ['str', "'a'"] }, u: { global: { p: '@o5' } }, n: 'Terceira: "a" outra vez.' },
      { l: 4, obj: { o2: ['dict', [["'a'", 2], ["'b'", 1]]] }, n: H`Agora <code>get</code> encontra o 1 e guarda 2.` },
      { l: 3, obj: { o6: ['str', "'c'"] }, u: { global: { p: '@o6' } }, n: 'Quarta: "c".' },
      { l: 4, obj: { o2: ['dict', [["'a'", 2], ["'b'", 1], ["'c'", 1]]] }, n: 'Nova: fica com 1.' },
      { l: 3, obj: { o7: ['str', "'a'"] }, u: { global: { p: '@o7' } }, n: 'Quinta e última: "a".' },
      { l: 4, obj: { o2: ['dict', [["'a'", 3], ["'b'", 1], ["'c'", 1]]] }, n: 'O "a" passa a 3.' },
      { l: 5, o: "{'a': 3, 'b': 1, 'c': 1}\n", n: 'O print mostra o dicionário entre chavetas, com os pares chave: valor.' },
    ],
  }],
  mistakes: [
    H`Pedir uma chave que não existe: <em>KeyError: 'Tiago'</em>. Testa com <code>in</code> ou usa <code>get</code>.`,
    H`Esperar que <code>for x in notas:</code> dê os valores. Dá as chaves; para os pares usa <code>.items()</code>, para os valores <code>.values()</code>.`,
    H`Usar uma lista como chave: <em>TypeError: unhashable type: 'list'</em>. As chaves têm de ser imutáveis (números, textos, tuplos).`,
    H`Achar que <code>1 in notas</code> procura nos valores. O <code>in</code> procura nas chaves.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
d = {"a": 1, "b": 2}
d["a"] = 5
print(d)`, opts: ["{'a': 5, 'b': 2}", "{'a': 1, 'b': 2, 'a': 5}", "{'b': 2, 'a': 5}", "{'a': 6, 'b': 2}"], ok: 0, mono: true, check: true,
      exp: 'A chave "a" já existia, por isso só o valor muda. As chaves não se repetem e mantêm o lugar.' },
    { q: 'O que aparece no ecrã?', code: C`
d = {"x": 1}
print(d["y"])`, opts: ['None', '0', "KeyError: 'y'", "{'x': 1}"], ok: 2, mono: true, check: true,
      exp: H`Com <code>[ ]</code>, uma chave que não existe é um erro. Para ter None ou 0 em vez do erro, usa <code>d.get("y")</code> ou <code>d.get("y", 0)</code>.` },
    { q: 'O que aparece no ecrã?', code: C`
d = {"x": 1, "y": 2}
print("x" in d, 1 in d)`, opts: ['True False', 'True True', 'False True', 'False False'], ok: 0, mono: true, check: true,
      exp: H`O <code>in</code> procura nas chaves: "x" é uma chave, 1 não é (é um valor).` },
    { q: 'O que aparece no ecrã?', code: C`
d = {}
d["a"] = d.get("a", 0) + 1
d["a"] = d.get("a", 0) + 1
print(d)`, opts: ["{'a': 2}", "{'a': 1}", "{'a': 1, 'a': 2}", "KeyError: 'a'"], ok: 0, mono: true, check: true,
      exp: 'Da primeira vez, "a" não existe e o get dá 0, por isso fica 1. Da segunda, o get encontra o 1 e fica 2. É o padrão para contar coisas.' },
  ],
  exercises: [{
    title: 'Consultar uma nota',
    text: 'Com notas = {"Ana": 17, "Rui": 9, "Ines": 14}, lê um nome e mostra a nota dessa pessoa, ou "nao existe" se o nome não estiver no dicionário.',
    run: 'Nome: ⟦Tiago⟧Tiago nao existe\n',
    hint: H`<code>if nome in notas:</code> para escolher entre mostrar a nota e mostrar a mensagem.`,
    solution: C`
notas = {"Ana": 17, "Rui": 9, "Ines": 14}
nome = input("Nome: ")
if nome in notas:
    print(nome, notas[nome])
else:
    print(nome, "nao existe")`,
  }, {
    title: 'Alunos por curso',
    text: 'Para a lista ["LEI", "LEE", "LEI", "LEM", "LEI"], conta quantos alunos há em cada curso e mostra um curso por linha.',
    run: 'LEI 3\nLEE 1\nLEM 1\n',
    hint: H`O padrão do segundo exemplo: <code>conta[c] = conta.get(c, 0) + 1</code>. No fim, percorre <code>conta.items()</code>.`,
    solution: C`
cursos = ["LEI", "LEE", "LEI", "LEM", "LEI"]
conta = {}
for c in cursos:
    conta[c] = conta.get(c, 0) + 1
for curso, n in conta.items():
    print(curso, n)`,
  }],
});

// ---------------------------------------------------------------- 10
LESSONS.push({
  id: 10,
  title: 'Erros e ficheiros',
  short: 'try / except, e ler e escrever ficheiros com with open',
  body: H`
<p>Quando algo corre mal (converter "vinte" para inteiro, dividir por zero, abrir um ficheiro que não existe), o Python lança uma <strong>exceção</strong> e, se ninguém a apanhar, o programa pára com uma mensagem. Com <code>try</code> / <code>except</code> apanhas o erro e decides o que fazer:</p>
<pre class="snip"><code>try:
    idade = int(texto)
except ValueError:
    print("Isso nao e um numero.")</code></pre>
<p>Para ficheiros usa-se <code>with open(...) as f:</code>. O ficheiro fecha-se sozinho no fim do bloco (não há <code>fclose</code> para esquecer):</p>
<table class="t">
<thead><tr><th>Python</th><th>Em C era</th></tr></thead>
<tbody>
<tr><td><code>with open("notas.txt", "w") as f:</code></td><td><code>FILE *f = fopen("notas.txt", "w");</code></td></tr>
<tr><td><code>f.write("Ana 17\n")</code></td><td><code>fprintf(f, "Ana 17\n");</code></td></tr>
<tr><td><code>for linha in f:</code></td><td>um ciclo com <code>fgets</code> ou <code>fscanf</code></td></tr>
<tr><td>fecha no fim do bloco</td><td><code>fclose(f);</code></td></tr>
</tbody>
</table>
<p>Os modos são os mesmos: <code>"r"</code> ler (o normal), <code>"w"</code> escrever (apaga o que lá estava), <code>"a"</code> acrescentar. Se o ficheiro não existir, ler dá <em>FileNotFoundError</em>.</p>`,
  analogy: 'O try é um trapezista com rede: tenta o salto e, se cair, a rede (o except) apanha-o e o espetáculo continua. Sem rede, uma queda acaba com o espetáculo todo.',
  examples: [{
    title: 'Pedir até ser um número',
    code: C`
while True:
    texto = input("Idade? ")
    try:
        idade = int(texto)
        break
    except ValueError:
        print("Isso nao e um numero.")
print("Idade:", idade)`,
    steps: [
      { l: 1, push: 'global', n: H`<code>while True</code> repete para sempre, até um <code>break</code>.` },
      { l: 2, o: 'Idade? ⟦vinte⟧', obj: { o1: ['str', "'vinte'"] }, d: { global: { texto: ['', '@o1'] } }, n: 'O utilizador escreve a idade por extenso.' },
      { l: 3, n: H`Entra no <code>try</code>: o que lá estiver vai ser "tentado".` },
      { l: 4, n: H`<code>int("vinte")</code> não consegue converter e lança um <code>ValueError</code>. O resto do try (o break) é saltado.` },
      { l: 6, n: H`Este <code>except</code> apanha precisamente o ValueError.` },
      { l: 7, o: 'Isso nao e um numero.\n', n: 'Em vez de o programa parar com um erro, mostra uma mensagem e o ciclo continua.' },
      { l: 2, o: 'Idade? ⟦20⟧', obj: { o2: ['str', "'20'"] }, u: { global: { texto: '@o2' } }, n: 'Segunda tentativa.' },
      { l: 4, obj: { o3: ['int', 20] }, d: { global: { idade: ['', '@o3'] } }, n: 'Agora a conversão funciona.' },
      { l: 5, n: H`O <code>break</code> sai do ciclo. O except não corre, porque não houve erro.` },
      { l: 8, o: 'Idade: 20\n', n: 'Já fora do ciclo.' },
    ],
  }, {
    title: 'Escrever e ler um ficheiro',
    code: C`
with open("notas.txt", "w") as f:
    f.write("Ana 17\n")
    f.write("Rui 9\n")
total = 0
with open("notas.txt") as f:
    for linha in f:
        nome, nota = linha.split()
        total += int(nota)
print("Total:", total)`,
    steps: [
      { l: 1, push: 'global', obj: { o1: ['ficheiro', "notas.txt, aberto para escrever ('w')"] }, d: { global: { f: ['', '@o1'] } }, n: H`Abre (ou cria) o ficheiro para escrever. O <code>f</code> aponta para o objeto ficheiro.` },
      { l: 2, n: H`<code>write</code> escreve texto no ficheiro. Ao contrário do print, não muda de linha sozinho: o <code>\n</code> é preciso.` },
      { l: 3, n: 'Segunda linha do ficheiro.' },
      { l: 4, obj: { o1: ['ficheiro', 'notas.txt, fechado'], o2: ['int', 0] }, d: { global: { total: ['', '@o2'] } }, n: H`O bloco do <code>with</code> acabou, por isso o ficheiro já foi fechado e gravado.` },
      { l: 5, obj: { o3: ['ficheiro', "notas.txt, aberto para ler ('r')"] }, u: { global: { f: '@o3' } }, n: H`Abre o mesmo ficheiro para ler (sem modo, é <code>"r"</code>).` },
      { l: 6, obj: { o4: ['str', "'Ana 17\\n'"] }, d: { global: { linha: ['', '@o4'] } }, n: H`O <code>for</code> percorre o ficheiro linha a linha. Cada linha traz o <code>\n</code> no fim.` },
      { l: 7, obj: { o5: ['str', "'Ana'"], o6: ['str', "'17'"] }, d: { global: { nome: ['', '@o5'], nota: ['', '@o6'] } }, n: H`<code>split()</code> parte a linha em duas palavras (e deita fora o <code>\n</code>). Uma lista de dois valores pode ser dada a dois nomes de uma vez.` },
      { l: 8, obj: { o7: ['int', 17] }, u: { global: { total: '@o7' } }, n: H`A nota é texto ('17'): é preciso <code>int</code> antes de somar.` },
      { l: 6, obj: { o8: ['str', "'Rui 9\\n'"] }, u: { global: { linha: '@o8' } }, n: 'A segunda linha.' },
      { l: 7, obj: { o9: ['str', "'Rui'"], o10: ['str', "'9'"] }, u: { global: { nome: '@o9', nota: '@o10' } }, n: 'Parte-a em nome e nota.' },
      { l: 8, obj: { o11: ['int', 26] }, u: { global: { total: '@o11' } }, n: 'total = 17 + 9 = 26' },
      { l: 9, obj: { o3: ['ficheiro', 'notas.txt, fechado'] }, o: 'Total: 26\n', n: H`O ficheiro acabou, o ciclo e o <code>with</code> também (o ficheiro fechou-se). Mostra o total.` },
    ],
  }],
  mistakes: [
    H`Um <code>except:</code> sem tipo de erro apanha tudo, até os teus enganos (um nome mal escrito). Escreve o erro que esperas: <code>except ValueError:</code>.`,
    H`Abrir com <code>"w"</code> um ficheiro que querias ler: o <code>"w"</code> apaga o conteúdo logo ao abrir.`,
    H`Esquecer que cada linha lida traz o <code>\n</code> no fim. Usa <code>linha.strip()</code> ou <code>split()</code>.`,
    H`Esquecer o <code>\n</code> no <code>write</code>: fica tudo numa linha só.`,
    H`O ficheiro não está na pasta onde o programa corre: <em>FileNotFoundError: [Errno 2] No such file or directory: 'notas.txt'</em>.`,
  ],
  quiz: [
    { q: 'O que aparece no ecrã?', code: C`
try:
    print(int("12a"))
except ValueError:
    print("erro")`, opts: ['12', 'erro', '12\nerro', "ValueError: invalid literal for int() with base 10: '12a'"], ok: 1, mono: true, check: true,
      exp: H`"12a" não é um número, por isso o <code>int</code> lança ValueError antes de o print correr. O except apanha-o e escreve "erro".` },
    { q: 'O que aparece no ecrã?', code: C`
try:
    x = 10 / 0
    print("A")
except ZeroDivisionError:
    print("B")
print("C")`, opts: ['A\nC', 'B\nC', 'A\nB\nC', 'B'], ok: 1, mono: true, check: true,
      exp: H`A divisão por zero lança o erro logo, por isso o <code>print("A")</code> nunca corre. O except escreve B e, como o erro foi apanhado, o programa continua para o C.` },
    { q: 'O que aparece no ecrã?', code: C`
try:
    v = [1, 2]
    print(v[5])
except ValueError:
    print("valor")`, opts: ['valor', 'IndexError: list index out of range', 'None', '2'], ok: 1, mono: true, check: true,
      exp: H`O erro é um <code>IndexError</code>, não um ValueError. Este except não o apanha, e o programa pára com a mensagem do erro.` },
    { q: 'Porque é que se usa with open(...) as f: em vez de só f = open(...)?', opts: ['Porque é mais rápido a ler', 'Porque fecha o ficheiro sozinho no fim do bloco, mesmo que haja um erro', 'Porque sem with não se pode escrever', 'Porque cria o ficheiro se não existir'], ok: 1,
      exp: H`O <code>with</code> garante que o ficheiro é fechado (e o que escreveste é gravado) quando o bloco acaba, até se houver uma exceção. É o <code>fclose</code> do C, mas automático.` },
  ],
  exercises: [{
    title: 'Divisão segura',
    text: 'Lê dois inteiros e mostra a divisão inteira do primeiro pelo segundo. Se o segundo for 0, mostra "Nao se pode dividir por zero" em vez de o programa parar.',
    run: 'Dividendo: ⟦7⟧Divisor: ⟦0⟧Nao se pode dividir por zero\n',
    hint: H`Põe a conta dentro de um <code>try</code> e apanha o <code>ZeroDivisionError</code>.`,
    solution: C`
a = int(input("Dividendo: "))
b = int(input("Divisor: "))
try:
    print("Resultado:", a // b)
except ZeroDivisionError:
    print("Nao se pode dividir por zero")`,
  }, {
    title: 'Contar linhas',
    text: 'Escreve as palavras um, dois e cinco no ficheiro palavras.txt, uma por linha. Depois lê o ficheiro e mostra quantas linhas tem e qual é a palavra mais comprida.',
    run: 'Linhas: 3\nMais comprida: cinco\n',
    hint: H`Escreve com um for e <code>f.write(p + "\n")</code>. Ao ler, usa <code>linha.strip()</code> e guarda a palavra se <code>len(p) &gt; len(maior)</code>.`,
    solution: C`
with open("palavras.txt", "w") as f:
    for p in ["um", "dois", "cinco"]:
        f.write(p + "\n")
linhas = 0
maior = ""
with open("palavras.txt") as f:
    for linha in f:
        p = linha.strip()
        linhas += 1
        if len(p) > len(maior):
            maior = p
print("Linhas:", linhas)
print("Mais comprida:", maior)`,
  }],
});
