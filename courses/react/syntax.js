// Realce de sintaxe para TSX (TypeScript com JSX). Cada grupo da regex corresponde, pela ordem, a uma classe.
// As etiquetas do JSX (<li>, <Tarefa ...>) aparecem com a cor das palavras-chave.
const SYNTAX = {
  re: /(\/\/.*$|\{\/\*.*?\*\/\})|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(number|string|boolean|void|undefined|null|true|false|React|FormEvent|ChangeEvent)\b|(<\/?[A-Za-z][\w.]*|\/?>|\b(?:import|from|export|default|const|let|function|return|if|else|for|of|new|interface|type|async|await|try|catch)\b)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\(|<\w+>\()/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
