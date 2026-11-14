// Configuração do curso C# do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'csharp',
  title: 'C# do Zero',
  mark: '.cs',
  description: 'Para quem já fez o C: pilha e heap, classes e objetos, referências, herança, interfaces e List<T>.',
  storageKey: 'csharpdozero-progresso-v1', // não mudar depois de publicado: apagava o progresso guardado
  cheatTitle: 'Cábula de C#',
  lessonFiles: ['lessons1.js', 'lessons2.js', 'lessons3.js'],
  viz: 'refs', // usa shared/viz-refs.js, com os nomes dos painéis do C#
  vizLabels: { names: 'Pilha (stack)', objects: 'Heap' },
  // Roxo, para se distinguir do azul do C, do verde-azulado do SQL e do laranja do Python.
  theme: {
    light: { accent: '#6a3cc2', accentSoft: '#efe8fb' },
    dark: { accent: '#c3a3ff', accentSoft: '#2a2045' },
  },
};
