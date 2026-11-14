# do Zero

Interactive programming courses in European Portuguese, for first-year Engenharia Informática students.
Each course is a single, self-contained HTML page: short lessons, a step-by-step visualizer
(code | memory | screen), "o que aparece no ecrã?" quizzes, exercises with solutions, and a cheat sheet.

| Course | Folder | Status |
|---|---|---|
| C do Zero | `courses/c` | done |
| SQL do Zero | `courses/sql` | next |
| Python, C#, Rust, TypeScript | | planned, in that order |

## Commands

```sh
npm install              # once: installs playwright-core (drives your installed Chrome/Edge)
npm run build            # builds every course into docs/<slug>/index.html, plus docs/index.html
npm run build -- c       # builds one course
npm run check -- c       # check one course: content + every program run with the real toolchain
npm run check -- c --smoke        # same, plus build + browser smoke test (opt-in: opens Edge/Chrome)
npm run smoke -- c       # only the browser smoke test
```

`npm run check` exits with an error if anything fails, **including when the course's toolchain is
not installed**: a course is never reported as verified without actually running its code.
Extra output goes to `out/<slug>/` (git-ignored): `line-report.txt` (every step next to the line
it highlights, for manual review) and `shots/` (screenshots in light, dark and mobile).

## Requirements

- Node.js 18+ and Chrome or Edge (set `CHROME_PATH` if neither is found automatically).
- The toolchain of each course you check:

| Course | Needs |
|---|---|
| C | `gcc` |
| SQL | `sqlite3` |
| Python | `python3` (or `python`) |
| C# | `dotnet` |
| Rust | `rustc` / `cargo` |
| TypeScript | `node` + `tsc` |

## Layout

```
shared/                 # used by every course
  template.html         # design, visualizer, quiz, exercises, routes, progress (localStorage)
  engine.js             # turns a list of steps into memory snapshots (page + tests)
  build.js              # inlines everything into docs/<slug>/index.html
  check.js              # content review + runs every program with the real toolchain
  smoke.js              # Playwright: every step, every quiz, light/dark/mobile, no horizontal scroll
  catalog.html          # docs/index.html (list of courses)
  courses.js            # finds and loads courses
courses/<slug>/
  course.js             # title, mark, accent colour, localStorage key, lesson files
  lessons*.js           # the lessons (see CLAUDE.md for the format)
  home.html             # course home page
  cheat.html            # cheat sheet ("cábula"), incl. common error messages
  syntax.js             # syntax highlighting regex
  runner.js             # how to run a program with the real toolchain
docs/                   # built pages, served by GitHub Pages (Settings → Pages → /docs)
```

## Adding a course

Copy `courses/c` to `courses/<slug>`, change `course.js` (new `slug`, `title`, `mark`,
`storageKey`, and a `theme` accent colour), write `runner.js` for the toolchain, then replace the
lessons, home page, cheat sheet and syntax file. Run `npm run check -- <slug>` until it passes.
The conventions are in [CLAUDE.md](CLAUDE.md).
