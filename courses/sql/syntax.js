// Realce de sintaxe para SQL. Cada grupo da regex corresponde, pela ordem, a uma classe em "classes".
// A regex não distingue maiúsculas de minúsculas (flag i), tal como o SQL.
const SYNTAX = {
  re: /(--.*$)|('(?:''|[^'])*')|\b(INTEGER|TEXT|REAL)\b|\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|IS|NULL|LIKE|BETWEEN|ORDER|BY|ASC|DESC|LIMIT|DISTINCT|AS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|DEFAULT|DROP|JOIN|INNER|LEFT|ON|GROUP|HAVING|PRAGMA|CASE|WHEN|THEN|ELSE|END)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/gi,
  classes: ['com', 'str', 'ty', 'kw', 'num', 'fn'],
};
