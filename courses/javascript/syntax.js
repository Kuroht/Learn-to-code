// Realce de sintaxe para JavaScript (e para o HTML das lições do DOM). Cada grupo da regex corresponde,
// pela ordem, a uma classe em "classes".
const SYNTAX = {
  re: /(\/\/.*$|<!--.*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(number|string|boolean|undefined|null|true|false|NaN|Math|JSON|Object|Array|document|console)\b|(<\/?[a-zA-Z][a-zA-Z0-9]*|\/?>|\b(?:let|const|var|function|return|if|else|for|of|in|while|do|switch|case|break|continue|new|class|extends|super|this|typeof|instanceof|async|await|try|catch|throw|static|default)\b)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)(?=\()/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
