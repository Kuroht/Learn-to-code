// Realce de sintaxe para Rust. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
// Os macros (println!, vec!) e as funções aparecem com a cor das funções.
const SYNTAX = {
  re: /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])')|\b(i32|i64|u32|u8|usize|f64|bool|char|str|String|Vec|Option|Result|Self|Some|None|Ok|Err)\b|\b(fn|let|mut|if|else|for|in|while|loop|break|continue|return|match|struct|enum|impl|pub|use|mod|as|ref|self|true|false|const|static|move|where|trait|dyn)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*!?)(?=\(|!)/g,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
