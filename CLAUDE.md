# do Zero: conventions

Interactive programming courses in European Portuguese for a first-year LEI student at UTAD.
C do Zero (`courses/c`) is the reference for structure, style and quality. Read it before writing a new course.

## Course order and workflow

- Order: **C (done) → SQL → Python → C# → Rust → TypeScript.** One course per branch (`course/<slug>`), committed as you go.
- Stop after each course for review. Don't push or open PRs unless asked.
- Before starting a course, check its toolchain (`sqlite3`, `python3`, `dotnet`, `rustc`/`cargo`, `node` + `tsc`).
  If it's missing, say exactly what to install and wait.
- When a course is done, report: the `npm run check -- <slug>` result, what you weren't sure about, and the path of `docs/<slug>/index.html`.
- Later (not yet): React, Tauri, Expo and Electron, probably as step-by-step projects rather than variable traces.

## Commands

- `npm run build [-- slug]` builds `docs/<slug>/index.html` and `docs/index.html`.
- `npm run check -- <slug>` = content review + every program run with the real toolchain. `--smoke` adds the build and browser smoke test.
  It must pass with zero failures before a course is called done. Warnings must be read and either fixed or explained.
- **On the owner's machine, don't run anything that starts new executables or a browser** (compiled programs, gcc, Playwright/Edge):
  it trips their firewall. Running code inside the Node process (e.g. `node:sqlite` for SQL) is fine. Ask before anything else.
- Write everything (content, comments, commits) in **European Portuguese or English, never Brazilian Portuguese**.
- Never edit files in `docs/` by hand: they are build output.

## Content rules

- Everything the student reads is in **European Portuguese**: ecrã, ficheiro, utilizador, carregar em, guardar, tu (never tela, arquivo, usuário, você, salvar, clicar, gerúndio "está fazendo"). `check.js` flags common Brazilian forms, but read the text yourself too.
- Code identifiers may be in Portuguese (`nota`, `soma`, `aluno`). **No accents inside program output** (strings printed to the screen, table data shown as output): some consoles show garbage.
- 10 to 11 lessons per course (`id` 0..N, equal to the position). Each lesson has:
  `title`, `short` (lowercase, no final full stop), `body` (short HTML), `analogy` (one "Pensa assim" box),
  `examples` (1 or 2 step-through examples), `mistakes`, `quiz`, `exercises` (2, each with `run`, `hint`, `solution`).
- Assume the student already did C do Zero. Compare with C where it helps ("em C fazias X, aqui...").
- Quizzes: mostly "O que aparece no ecrã?" with `check: true` (the code is run and must match exactly one option).
  Wrong options come from real beginner mistakes. Every question has an `exp`.
- Every course has a cheat sheet (`cheat.html`, root element `.cheat`) with the common compiler/runtime error messages and what they usually mean.

## Lesson data format (`courses/<slug>/lessons*.js`)

Helpers at the top of the first file: `` C`...` `` for code (trims the first/last newline), `` H`...` `` for HTML.
`const LESSONS = []` and one `LESSONS.push({...})` per lesson. The files are concatenated in the order of `course.js → lessonFiles`.

Step format for `examples[].steps`:

| Key | Meaning |
|---|---|
| `l` | line being executed (1 = first line of `code`); must be a non-empty line |
| `push` / `pop` | create a function frame by name / remove the last one |
| `d` | declare: `{ frame: { name: [type, value, address?] } }` (value may be an array, an array of objects or an object) |
| `u` | update: `{ frame: { name: v, 'v[2]': v, 's.field': v } }` |
| `x` | delete: `{ frame: ['i'] }` |
| `o` | text appended to the screen. `⟦...⟧` marks what the user types; it is also the stdin used by the check |
| `n` | explanation of the step (HTML) |

Exercise `run` uses the same `⟦...⟧` convention. All of `o` joined together must equal the real program output.

## Code layout

- `shared/` is the same for every course: `template.html` (design + UI), `engine.js`, `build.js`, `check.js`, `smoke.js`.
  Course-specific text goes in the course folder, never in the template. If a language needs a new kind of
  visualization (tables for SQL, references for Python/C#, ownership for Rust), add it to the shared template/engine
  in a way that doesn't change existing courses, then re-run `npm run check` for **every** course.
- Each course: `course.js`, `lessons*.js`, `home.html`, `cheat.html`, `syntax.js`, `runner.js`.
- `runner.js` exports `toolName`, `installHint`, `isAvailable()`, `wrapQuiz(code, quiz, lesson)` and `run(code, stdin, tmpDir, item, lesson)` → `{ out }` or `{ error }` (+ optional `warnings`).
  Optional `checkExample(example, lesson, { label, report })` replaces the default "compare `o` with stdout" check for examples.
- `course.js → viz: 'tables'` swaps the Memory + Screen panel for Database + Result (`shared/viz-tables.js/.css`).
- `course.js → viz: 'refs'` swaps it for Names + Objects + Screen (`shared/viz-refs.js/.css`), for languages with references
  (Python now; meant to be reused for C# and TypeScript). Steps add `obj: { o1: [type, value] }` to create or change heap objects;
  a variable whose value is `'@o1'` points to object o1 (shown as a coloured `→ #1` tag, no drawn arrows). Objects no name can reach
  fade for one step, then disappear. Frame `global` is shown as is; other frames get `()`.

## C# course specifics (`courses/csharp`)

- Programs use top-level statements: statements first, then static methods (local functions), then classes/interfaces at the end.
- The runner's `prepare` compiles **all** programs in one `dotnet build` (each in its own namespace `P<n>`, with a generated
  `Dispatcher` Main), then runs the one exe per program. Invariant culture (reals print `3.5`; on a pt-PT Windows students see `3,5`),
  English compiler messages, nullable off.
- A program that doesn't compile outputs its first error, e.g. `error CS0029: Cannot implicitly convert type 'int' to 'bool'`,
  so "isto compila?" quizzes are verified. An uncaught exception outputs `Unhandled exception. System.X: message`.
- Never print an object without `ToString`: in the checker its type name would include the wrapper namespace (`P12.Aluno`).
- Visualizer: `viz: 'refs'` with `vizLabels` Pilha (stack) / Heap. Value types sit in the stack (`['int', '19']`), structs as
  inline objects (`['Ponto', { X: '1' }]`), strings inline (simplification, said in lesson 8), classes/arrays/lists in the heap.

## HTML e CSS course specifics (`courses/html`)

- `viz: 'page'` (`shared/viz-page.js/.css`): the right side shows the rendered page (iframe), the DOM tree and a box-model
  inspector, all computed live by the browser. Step fields: `sel` (highlighted elements), `box` (inspector), `width` (page width,
  for media queries), `chk` (claims verified by the check). Example `build: [from, to]` reveals those lines up to the step's line.
- Verified in headless Edge/Chrome (the owner allowed this for this course). A measurement is `[selector, what]` with `what` =
  `count`, `text`, `width`/`height` (offset px) or a CSS property; named colours come back in Portuguese (`vermelho`, `azul`...).
  Quizzes use `ask: [selector, what]` (and optional `width`); exercises use `tests: [[selector, what, expected]]` instead of `run`.
- Examples after lesson 0 omit the skeleton (the browser adds it). Page text may use accents (the pages are UTF-8).
- The default page is 800px wide with the body's 8px margin, so a block is 784px wide; keep that in mind for width claims.

## TypeScript course specifics (`courses/typescript`)

- The `typescript@6.0.3` dev dependency (pure JavaScript; TypeScript 7 ships a native .exe, avoid it here) type-checks each program
  in-process with `strict`, lib es2022 + dom. If there are errors, the output is the first one (`error TS2322: ...`) and nothing runs;
  otherwise it is transpiled and run with `shared/run-js.js` (the same runner as JavaScript).
- An example with a type error has no frames and shows the error with `o` on its last step (the screen colours `error ...:` lines red).
- Don't name variables like DOM globals (`name`, `status`, `length`...): lib.dom declares them and the program would not compile.
- Copy compiler messages from a real run: literal types change them (`const x = "ola"` is type `"ola"`, `r + 1` mentions `'1'`).

## JavaScript course specifics (`courses/javascript`)

- Programs run inside Node with the `vm` module (no new processes); output is `util.format`, i.e. exactly Node's console.log
  (`[ 1, 2 ]`, `{ nome: 'Ana' }`). An uncaught error prints `Name: message`. setTimeout and Promises are awaited.
- `viz: ['refs', 'page']`: a course can list several visualizers (registered in `VIZ_MODES`); the first is the default and an
  example or exercise picks another with `viz: 'page'`. The DOM lessons (9, 10) use the page visualizer and are checked in headless
  Edge through `shared/page-check.js` (allowed by the owner for these lessons). Steps can have `act: ['click', sel]` or
  `act: ['input', sel, text]`; quizzes and exercises can have `acts`.
- Lesson code lives inside JS template strings, so write `‵` for a backtick, `¤{` for `${` and `<\/script>` for a closing script
  tag; the `J` helper converts them. In `` H`...` `` text use `&#96;` and `&#36;`.
- Avoid "clique"/"clicar" in text: say "carregar no botão".

## Rust course specifics (`courses/rust`)

- **Windows on the owner's machine blocks the .exe files rustc produces.** The runner compiles for `wasm32-wasip1`
  and runs the program inside Node with `node:wasi` (no executable is ever started). Needs `rustup target add wasm32-wasip1`.
- Like C#, all programs go into one crate (one module `p<n>` per program, a generated `main` picks one). The crate is rebuilt
  without the programs that fail, because rustc stops before borrow checking when any module has type errors.
- Compile errors become the output (`error[E0382]: borrow of moved value: ...`), with the `p<n>::` module prefix stripped.
  A panic becomes `thread 'main' panicked: <message>` (the real one also shows the thread id and line).
- Don't use a constant out-of-range index (`v[5]` with a literal): rustc rejects it at compile time. Use a variable index.
- Visualizer: `vizLabels` with `moved: '(movido)'` (a moved-from variable is shown struck out) and an orphan note saying the
  memory was freed (drop). References to other variables are plain text values like `'→ s (main)'`.
- Inside `` H`...` `` strings, write backticks as `&#96;` (a `` \` `` would keep the backslash in String.raw).

## Python course specifics (`courses/python`)

- Runs `python -I` (or `python3`). If the program ends with an exception, the last stderr line (e.g. `TypeError: ...`)
  is appended to stdout, so examples and quiz options can show errors as the student sees them.
- Every name points to an object (lesson 1's model). Numbers and texts inside lists/dicts are shown inline to keep the panel readable.

## SQL course specifics (`courses/sql`)

- Runs inside Node with `node:sqlite` (no executables). Foreign keys are **off** unless the script says `PRAGMA foreign_keys = ON`, like the real `sqlite3`.
- A lesson, example, quiz or exercise can have `db: { table: { cols: [[name, 'TYPE ...']], key?, rows } }`: the starting database
  (shown as grids, and turned into SQL for the check). Quizzes and exercises use the lesson's `db` unless they set their own (`db: false` = empty).
- Output format (quiz options, exercise `run`): like `sqlite3` with `.headers on`: `col1|col2` then one line per row, `NULL` for null,
  REAL always with a decimal (`14.0`), result sets separated by a blank line, errors as `Erro: <SQLite message>`. Use the `res()` / `out()` helpers.
- Example steps use `create`, `ins`, `upd`, `del`, `tm` (row marks), `g` (working grid) and `err` (see the top of `lessons1.js`).
  The check runs each statement in SQLite and compares, at the statement's last step, the tables and (for queries) the final grid.
- Write queries in examples with one clause per line, and step through them in execution order (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT).
- `course.js → storageKey` is where student progress lives in localStorage: never change it once a course is published.
- Design: keep the layout, light/dark, mobile, keyboard arrows and the highlighted current line. Each course only
  changes its accent colour (`course.js → theme`: `light`/`dark` × `accent`/`accentSoft`). Check contrast in both themes.
- Files use LF line endings (`.gitattributes`). CRLF inside lesson files would break the code line numbers.
