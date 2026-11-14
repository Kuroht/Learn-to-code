// Configuração do curso TypeScript do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'typescript',
  title: 'TypeScript do Zero',
  mark: '.ts',
  description: 'JavaScript com tipos: o compilador apanha os erros antes de o programa correr. Interfaces, uniões, classes, genéricos e async.',
  storageKey: 'typescriptdozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de TypeScript',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'refs',
  vizLabels: { names: 'Variáveis', objects: 'Objetos', orphan: 'sem variáveis: vai ser apagado' },
  // Azul-aço (a cor do TypeScript), mais escuro do que o azul do C.
  theme: {
    light: { accent: '#1f5c99', accentSoft: '#e3eef9' },
    dark: { accent: '#7fb6ef', accentSoft: '#172a3e' },
  },
};
