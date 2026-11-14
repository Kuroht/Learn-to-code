// Verifica o curso de HTML e CSS num browser a sério (Edge ou Chrome, sem janela).
// O trabalho está em shared/page-check.js, partilhado com as lições do DOM do curso de JavaScript:
// cada passo de cada exemplo é desenhado e as afirmações das explicações (chk) são medidas na página;
// as perguntas (ask) e os testes dos exercícios (tests) também.
const pageCheck = require('../../shared/page-check.js');

module.exports = {
  toolName: 'Edge/Chrome (sem janela)',
  installHint: 'É preciso o Chrome ou o Edge instalado (ou o caminho na variável CHROME_PATH), e "npm install".',
  isAvailable: pageCheck.isAvailable,
  wrapQuiz: code => code,

  // Uma pergunta com ask: [seletor, o quê] desenha o código e devolve a medição (que tem de ser a opção certa).
  run(code, stdin, tmpDir, item) {
    if (!item.ask) return { error: 'pergunta com check: true mas sem ask' };
    return pageCheck.ask(code, item);
  },
  checkExample: (ex, lesson, ctx) => pageCheck.checkExample(ex, ctx),
  checkExercise: (ex, lesson, ctx) => pageCheck.checkExercise(ex, ctx),
  finish: pageCheck.close,
};
