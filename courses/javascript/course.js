// Configuração do curso JavaScript do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'javascript',
  title: 'JavaScript do Zero',
  mark: '.js',
  description: 'A linguagem da web: tipos traiçoeiros, funções, arrays, objetos e referências, classes, o DOM e eventos.',
  storageKey: 'javascriptdozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de JavaScript',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  // Os exemplos usam o visualizador de referências; os das lições do DOM escolhem viz: 'page'.
  viz: ['refs', 'page'],
  vizLabels: { names: 'Variáveis', objects: 'Objetos', orphan: 'sem variáveis: vai ser apagado' },
  // Amarelo-torrado (a cor tradicional do JavaScript), escuro o suficiente para ler em fundo claro.
  theme: {
    light: { accent: '#8a6400', accentSoft: '#fbf1d6' },
    dark: { accent: '#f5cc4c', accentSoft: '#33290d' },
  },
};
