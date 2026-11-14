// Realce de sintaxe para C. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
const SYNTAX = {
  re: /(\/\/.*$)|(^\s*#.*$)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])')|\b(int|double|float|char|void|long|short|unsigned|signed|const|struct|FILE|size_t)\b|\b(return|if|else|for|while|do|switch|case|break|default|continue|sizeof|typedef|NULL)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\s*\()/g,
  classes: ['com', 'pp', 'str', 'str', 'ty', 'kw', 'num', 'fn'],
};
