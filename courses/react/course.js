// Configuração do curso React do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'react',
  title: 'React do Zero',
  mark: '.tsx',
  description: 'Uma lista de tarefas construída passo a passo, e depois o ciclo de vida e quando usar cada hook (useEffect, useRef, useMemo, useCallback).',
  storageKey: 'reactdozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de React',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js', 'lessons4.js'],
  viz: 'react', // usa shared/viz-react.js: a app a correr e a árvore de componentes
  // O CSS de todas as apps do curso (o App.css do projeto). A cábula mostra a parte que interessa: mantém as duas iguais.
  previewCss: `
body { font-family: system-ui, sans-serif; margin: 12px; color: #1d2433; }
h1 { font-size: 1.4rem; margin: 0 0 8px; }
ul { padding-left: 0; list-style: none; margin: 8px 0; }
li { display: flex; gap: 8px; align-items: center; padding: 3px 0; }
li span { flex: 1; }
li.feita, li.feita span { text-decoration: line-through; color: gray; }
button { font: inherit; padding: 2px 10px; cursor: pointer; }
button[aria-pressed="true"] { font-weight: bold; }
input { font: inherit; padding: 2px 6px; }
form { display: flex; gap: 6px; margin: 8px 0; }
.parabens { color: green; font-weight: bold; }
.erro { color: red; }
.resumo { color: gray; }
`,
  // Azul-céu (a cor do React).
  theme: {
    light: { accent: '#0a6f8f', accentSoft: '#e2f4fa' },
    dark: { accent: '#5cc8e6', accentSoft: '#12313a' },
  },
};
