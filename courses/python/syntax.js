// Realce de sintaxe para Python. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
const SYNTAX = {
  re: /(#.*$)|([fF]?"(?:\\.|[^"\\])*"|[fF]?'(?:\\.|[^'\\])*')|\b(int|float|str|bool|list|dict|tuple|None|True|False)\b|\b(def|return|if|elif|else|for|while|in|not|and|or|is|import|from|as|with|try|except|finally|raise|break|continue|pass|lambda|class|global)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
