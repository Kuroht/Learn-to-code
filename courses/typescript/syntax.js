// Realce de sintaxe para TypeScript. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
const SYNTAX = {
  re: /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(number|string|boolean|void|any|unknown|never|undefined|null|true|false|NaN|Promise|Array|Math|JSON|console)\b|\b(let|const|var|function|return|if|else|for|of|in|while|do|switch|case|break|continue|new|class|extends|implements|super|this|typeof|instanceof|async|await|try|catch|throw|type|interface|private|public|protected|readonly|as|keyof|enum|static|default)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\(|<\w+>\()/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
