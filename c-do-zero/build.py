import re, pathlib
d = pathlib.Path(__file__).parent
t = (d / 'template.html').read_text(encoding='utf-8')
engine = (d / 'engine.js').read_text(encoding='utf-8')
lessons = (d / 'lessons1.js').read_text(encoding='utf-8') + '\n' + (d / 'lessons2.js').read_text(encoding='utf-8')
assert '</script' not in engine + lessons
t = t.replace('/*__ENGINE__*/', engine).replace('/*__LESSONS__*/', lessons)
(d / 'index.html').write_text(t, encoding='utf-8')
print('ok', len(t))
