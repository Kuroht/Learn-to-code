// Realce de sintaxe para C#. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
const SYNTAX = {
  re: /(\/\/.*$)|(\$?"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])')|\b(int|double|bool|char|string|void|var|object|decimal|long|List|Dictionary)\b|\b(class|interface|struct|enum|new|return|if|else|for|foreach|while|do|switch|case|break|default|continue|public|private|protected|static|virtual|override|abstract|this|base|null|true|false|in|out|ref|get|set|using|try|catch|throw)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
