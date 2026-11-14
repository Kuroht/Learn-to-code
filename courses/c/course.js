// Configuração do curso C do Zero. Lida por shared/build.js, shared/check.js e shared/smoke.js.
module.exports = {
  slug: 'c',
  title: 'C do Zero',
  mark: '.c',                       // etiqueta ao lado do nome, na barra lateral
  description: 'Do primeiro printf aos apontadores e structs. Para quem nunca programou.',
  storageKey: 'cdozero-progresso-v1', // não mudar: apagava o progresso guardado de quem já usa a página
  cheatTitle: 'Cábula de C',
  lessonFiles: ['lessons1.js', 'lessons2.js'],
  // Cor de destaque. O C usa a cor por omissão do template (azul), por isso não define "theme".
  theme: null,
};
