// Configuração do curso Rust do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'rust',
  title: 'Rust do Zero',
  mark: '.rs',
  description: 'Para quem já fez o C: ownership, move, empréstimos, drop, Option, Result e match.',
  storageKey: 'rustdozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de Rust',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'refs',
  vizLabels: { names: 'Pilha (stack)', objects: 'Heap', moved: '(movido)', orphan: 'sem dono: memória libertada (drop)' },
  // Vermelho-ferrugem, para se distinguir das outras cores.
  theme: {
    light: { accent: '#b0390c', accentSoft: '#fbe9e2' },
    dark: { accent: '#ff9b73', accentSoft: '#3a1f14' },
  },
};
