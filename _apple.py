import sys, re
sys.stdout.reconfigure(encoding='utf-8')

css_path='assets/style.css'
html_path='index.html'
readme_path='README.md'
sw_path='sw.js'

css=open(css_path,encoding='utf-8').read()
html=open(html_path,encoding='utf-8').read()
readme=open(readme_path,encoding='utf-8').read()
sw=open(sw_path,encoding='utf-8').read()

# --- contrast tweaks (Apple/HIG: legible, sufficient contrast for secondary text) ---
repls = [
    (':root{\n  --bg:#0a0c11;\n  --bg-soft:#0f1219;\n  --panel:#141822;\n  --panel-2:#1a1f2b;\n  --line:#242b3a;\n  --line-soft:#1c2230;\n  --text:#e9edf5;\n  --muted:#95a0b6;\n  --dim:#6f7a90;',
     ':root{\n  --bg:#0a0c11;\n  --bg-soft:#0f1219;\n  --panel:#141822;\n  --panel-2:#1a1f2b;\n  --line:#242b3a;\n  --line-soft:#1c2230;\n  --text:#e9edf5;\n  --muted:#a7b3c8;\n  --dim:#8b97ad;'),
    ('  --muted:#53627a;\n  --dim:#6b7a92;',
     '  --muted:#4a586e;\n  --dim:#5f6f86;'),
    ('  --muted:#c7ab8e;\n  --dim:#9d8166;',
     '  --muted:#d3baa0;\n  --dim:#b08f73;'),
    ('  --muted:#9bb2ca;\n  --dim:#7a93ad;',
     '  --muted:#a9bfd6;\n  --dim:#8fa7bf;'),
]
for a,b in repls:
    if a in css:
        css = css.replace(a,b)
        print('contrast ok')
    else:
        print('contrast miss')

# --- body readability ---
if 'body{' in css and 'line-height:1.5;' not in css.split('body{',1)[1][:120]:
    css = css.replace('  font:14px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;', '  font:15px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;')
    print('body font ok')
else:
    print('body font skip/miss')

# --- safe areas ---
if 'padding-left:max(16px, env(safe-area-inset-left));' not in css:
    css = css.replace('  padding:10px 16px 10px;\n  gap:12px;\n}', '  padding:10px max(16px, env(safe-area-inset-right)) 10px max(16px, env(safe-area-inset-left));\n  gap:12px;\n}')
    print('topbar safe ok')
else:
    print('topbar safe miss')
# chips safe area
css = css.replace('  padding:0 16px 10px;\n  gap:6px;\n  overflow-x:auto;', '  padding:0 max(16px, env(safe-area-inset-right)) calc(10px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left));\n  gap:8px;\n  overflow-x:auto;')
# main bottom safe area
css = css.replace('main{max-width:var(--wrap);margin:0 auto;padding:18px 16px 40px}', 'main{max-width:var(--wrap);margin:0 auto;padding:18px max(16px, env(safe-area-inset-right)) calc(40px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))}')
# footer safe
css = css.replace('.foot{max-width:var(--wrap);margin:0 auto;padding:0 16px 30px;color:var(--dim);font-size:12.5px}', '.foot{max-width:var(--wrap);margin:0 auto;padding:0 max(16px, env(safe-area-inset-right)) calc(30px + env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));color:var(--dim);font-size:12.5px}')
print('safe areas applied')

# --- touch targets (aim ~44px) ---
# brand
css = css.replace('.brand{\n  display:flex;align-items:center;gap:9px;font-weight:700;letter-spacing:.02em;flex:0 0 auto;\n  background:transparent;border:0;padding:0;margin:0;color:inherit;font:inherit;cursor:pointer;\n}',
'.brand{\n  display:flex;align-items:center;gap:9px;font-weight:700;letter-spacing:.02em;flex:0 0 auto;\n  background:transparent;border:0;padding:6px 4px;margin:0;color:inherit;font:inherit;cursor:pointer;min-height:44px;\n}')
# switch buttons
css = css.replace('  padding:7px 10px;border:0;border-radius:9px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:13px;font-weight:600;cursor:pointer;',
'  padding:10px 12px;min-height:44px;border:0;border-radius:9px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:14px;font-weight:600;cursor:pointer;')
# search button
css = css.replace('.search-btn{\n  display:flex;align-items:center;justify-content:center;\n  width:34px;height:34px;flex:0 0 auto;\n  border:1px solid var(--line);border-radius:10px;\n  background:var(--panel);color:var(--muted);\n  cursor:pointer;transition:.18s;\n}',
'.search-btn{\n  display:flex;align-items:center;justify-content:center;\n  min-width:44px;min-height:44px;flex:0 0 auto;\n  border:1px solid var(--line);border-radius:10px;\n  background:var(--panel);color:var(--muted);\n  cursor:pointer;transition:.18s;\n}')
# chips links
css = css.replace('.chips a{\n  flex:0 0 auto;display:inline-flex;align-items:center;\n  padding:5px 11px;border-radius:20px;\n  font-size:12.5px;font-weight:600;white-space:nowrap;\n  color:var(--muted);background:var(--panel);\n  border:1px solid var(--line-soft);\n  transition:.18s;\n}',
'.chips a{\n  flex:0 0 auto;display:inline-flex;align-items:center;\n  min-height:36px;padding:8px 12px;border-radius:20px;\n  font-size:13px;font-weight:600;white-space:nowrap;\n  color:var(--muted);background:var(--panel);\n  border:1px solid var(--line-soft);\n  transition:.18s;\n}')
# drawer item
css = css.replace('.drawer__item{\n  width:100%;display:flex;align-items:center;gap:10px;\n  padding:9px 10px;margin-bottom:4px;\n  border:1px solid transparent;border-radius:12px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:14px;font-weight:600;text-align:left;cursor:pointer;\n  transition:.18s;\n}',
'.drawer__item{\n  width:100%;display:flex;align-items:center;gap:10px;\n  min-height:44px;padding:10px 12px;margin-bottom:4px;\n  border:1px solid transparent;border-radius:12px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:15px;font-weight:600;text-align:left;cursor:pointer;\n  transition:.18s;\n}')
# drawer close
css = css.replace('.drawer__close{\n  width:30px;height:30px;border-radius:9px;\n  border:1px solid var(--line);background:transparent;\n  color:var(--muted);cursor:pointer;font-size:16px;line-height:1;\n  display:grid;place-items:center;\n}',
'.drawer__close{\n  min-width:44px;min-height:44px;border-radius:10px;\n  border:1px solid var(--line);background:transparent;\n  color:var(--muted);cursor:pointer;font-size:18px;line-height:1;\n  display:grid;place-items:center;\n}')
# search close
css = css.replace('.search__close{\n  width:30px;height:30px;border-radius:9px;flex:0 0 auto;\n  border:1px solid var(--line);background:transparent;\n  color:var(--muted);cursor:pointer;font-size:16px;line-height:1;\n  display:grid;place-items:center;\n}',
'.search__close{\n  min-width:44px;min-height:44px;border-radius:10px;flex:0 0 auto;\n  border:1px solid var(--line);background:transparent;\n  color:var(--muted);cursor:pointer;font-size:18px;line-height:1;\n  display:grid;place-items:center;\n}')
# theme option
css = css.replace('.theme-opt{\n  display:flex;align-items:center;gap:10px;width:100%;\n  padding:8px 10px;margin-bottom:4px;\n  border:1px solid transparent;border-radius:12px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:14px;font-weight:600;text-align:left;cursor:pointer;\n  transition:.18s;\n}',
'.theme-opt{\n  display:flex;align-items:center;gap:10px;width:100%;\n  min-height:44px;padding:10px 12px;margin-bottom:4px;\n  border:1px solid transparent;border-radius:12px;\n  background:transparent;color:var(--muted);\n  font:inherit;font-size:15px;font-weight:600;text-align:left;cursor:pointer;\n  transition:.18s;\n}')
# faq summary
css = css.replace('.faq-item summary{\n  cursor:pointer;\n  padding:10px 0;\n  font-weight:600;\n  color:var(--text);\n  list-style:none;\n}',
'.faq-item summary{\n  cursor:pointer;\n  min-height:44px;\n  padding:12px 0;\n  font-weight:600;\n  color:var(--text);\n  list-style:none;\n  display:flex;\n  align-items:center;\n}')
# glossary back
css = css.replace('.glossary-back{\n  position:fixed;left:50%;bottom:16px;transform:translateX(-50%);\n  z-index:60;\n  padding:10px 16px;border-radius:999px;\n  border:1px solid var(--line);\n  background:var(--panel);color:var(--text);\n  font:inherit;font-size:14px;font-weight:700;\n  box-shadow:0 10px 30px rgba(0,0,0,.35);\n  cursor:pointer;\n}',
'.glossary-back{\n  position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);\n  z-index:60;\n  min-height:44px;padding:12px 18px;border-radius:999px;\n  border:1px solid var(--line);\n  background:var(--panel);color:var(--text);\n  font:inherit;font-size:15px;font-weight:700;\n  box-shadow:0 10px 30px rgba(0,0,0,.35);\n  cursor:pointer;\n}')
print('touch targets applied')

# --- typography readability ---
css = css.replace('.card p,.card li{line-height:1.55}', '.card p,.card li{line-height:1.65}')
css = css.replace('.skill p{margin:0;font-size:13.8px;color:#c4cddf}', '.skill p{margin:0;font-size:14px;line-height:1.6;color:#c4cddf}')
css = css.replace('.hero__sub{margin:0 0 10px;color:var(--muted);font-size:14.5px}', '.hero__sub{margin:0 0 10px;color:var(--muted);font-size:15px;line-height:1.55}')
print('typography applied')

# --- reduced motion (Apple/HIG accessibility) ---
motion_block = r'''

/* Respect reduced motion preference (Apple HIG / accessibility) */
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration:0.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:0.01ms !important;
    scroll-behavior:auto !important;
  }
}
'''
if 'prefers-reduced-motion' not in css:
    css += motion_block
    print('reduced motion added')
else:
    print('reduced motion exists')

open(css_path,'w',encoding='utf-8').write(css)

# --- html/cache bump ---
if 'href="assets/style.css?v=25"' in html:
    html = html.replace('href="assets/style.css?v=25"', 'href="assets/style.css?v=26"')
if 'src="assets/app.js?v=25"' in html:
    html = html.replace('src="assets/app.js?v=25"', 'src="assets/app.js?v=26"')
# add color-scheme meta if missing
if 'name="color-scheme"' not in html:
    html = html.replace('<meta name="theme-color" content="#0b0d12">', '<meta name="theme-color" content="#0b0d12">\n<meta name="color-scheme" content="dark light">')
open(html_path,'w',encoding='utf-8').write(html)

# --- sw bump ---
sw = sw.replace('const CACHE = "aion2-guides-v10";', 'const CACHE = "aion2-guides-v11";')
open(sw_path,'w',encoding='utf-8').write(sw)

# --- readme note ---
note = '\n\n**Обновление (Apple design/HIG):** усилены доступность и читаемость — увеличены области касания, учтены safe-area отступы, скорректирован контраст вторичного текста в темах, улучшены интервалы/типографика, добавлена поддержка `prefers-reduced-motion`.\n'
if 'Apple design/HIG' not in readme:
    # append near end, before Примечание if possible
    if '\n## Примечание' in readme:
        readme = readme.replace('\n## Примечание', note + '\n## Примечание')
    else:
        readme += note
open(readme_path,'w',encoding='utf-8').write(readme)

print('done')
