// Configuração do curso Python do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'python',
  title: 'Python do Zero',
  mark: '.py',
  description: 'Para quem já fez o C: nomes que apontam para objetos, listas, dicionários e funções.',
  storageKey: 'pythondozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de Python',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'refs', // usa shared/viz-refs.js: painéis "Nomes", "Objetos" e "Ecrã"
  // Cor de laranja, para se distinguir do azul do C e do verde-azulado do SQL.
  theme: {
    light: { accent: '#a14a00', accentSoft: '#fbeee0' },
    dark: { accent: '#ffad5c', accentSoft: '#33230f' },
  },
};
