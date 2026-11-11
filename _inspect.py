import sys
sys.stdout.reconfigure(encoding='utf-8')
css=open('assets/style.css',encoding='utf-8').read().splitlines()
targets = ['.chip','.chips','.switch__btn','.brand','.drawer__item','.search-btn','.theme-opt','.drawer__close','.search__close','.faq-item summary','.glossary-back','.menu-btn']
for i,l in enumerate(css,1):
    s=l.strip()
    for t in targets:
        if s.startswith(t) and '{' in s:
            print(i,s[:160])
            break
    if 'min-height' in l or 'padding:' in l:
        # show relevant ones
        pass
print('---')
# theme blocks
cssf=open('assets/style.css',encoding='utf-8').read()
for name in [':root[data-theme="light"]',':root[data-theme="pumpkin"]',':root[data-theme="blue"]']:
    i=cssf.find(name)
    if i>=0:
        j=cssf.find('}',i)+1
        print(name)
        print(cssf[i:j])
        print()
