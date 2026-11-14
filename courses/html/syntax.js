// Realce de sintaxe para HTML e CSS (no mesmo ficheiro). Cada grupo corresponde a uma classe em "classes":
// comentários, textos entre aspas, etiquetas, nomes de atributos, propriedades CSS e números/cores.
const SYNTAX = {
  re: /(<!--.*?-->|\/\*.*?\*\/)|("[^"]*")|(<!DOCTYPE|<\/?[a-zA-Z][a-zA-Z0-9]*|\/?>)|\b([a-z-]+)(?==)|\b([a-z-]+)(?=\s*:\s*[^;{}<>]*;)|(#[0-9a-fA-F]{3,6}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|fr)?)/g,
  classes: ['com', 'str', 'kw', 'ty', 'fn', 'num'],
};
