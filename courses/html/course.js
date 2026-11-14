// Configuração do curso HTML e CSS do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'html',
  title: 'HTML e CSS do Zero',
  mark: '.html',
  description: 'Construir páginas web: estrutura com HTML, aspeto com CSS, o modelo de caixa e o flexbox.',
  storageKey: 'htmldozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de HTML e CSS',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'page', // usa shared/viz-page.js: a página desenhada, a árvore DOM e o inspetor
  // Magenta, para se distinguir das outras cores.
  theme: {
    light: { accent: '#a8246f', accentSoft: '#fbe6f2' },
    dark: { accent: '#ff8fca', accentSoft: '#3b1a2e' },
  },
};
