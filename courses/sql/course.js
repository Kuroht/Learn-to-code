// Configuração do curso SQL do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'sql',
  title: 'SQL do Zero',
  mark: '.sql',
  description: 'Tabelas, consultas, chaves e JOIN, vendo que linhas passam em cada passo. Para Bases de Dados.',
  storageKey: 'sqldozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de SQL',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'tables', // usa shared/viz-tables.js: painel "Base de dados + Resultado" em vez de "Memória + Ecrã"
  // Verde-azulado, para se distinguir do azul do C.
  theme: {
    light: { accent: '#0a7468', accentSoft: '#dff2ef' },
    dark: { accent: '#4fd1bf', accentSoft: '#14302c' },
  },
};
