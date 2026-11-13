from pathlib import Path
from html.parser import HTMLParser
import subprocess,sys,tempfile,re
ROOT=Path(__file__).resolve().parents[1]
class Scripts(HTMLParser):
 def __init__(self):super().__init__();self.is_js=False;self.blocks=[]
 def handle_starttag(self,tag,attrs):
  if tag=='script':
   attrs=dict(attrs);self.is_js=not attrs.get('src') and attrs.get('type','text/javascript') in ('text/javascript','module');self.blocks.append('') if self.is_js else None
 def handle_endtag(self,tag):
  if tag=='script':self.is_js=False
 def handle_data(self,data):
  if self.is_js and self.blocks:self.blocks[-1]+=data
p=ROOT/'index.html';html=p.read_text(encoding='utf-8');assert '<html' in html and '</html>' in html
assert '<script id="v27-pixel-sim-js">' in html
assert 'window.V34' in html and 'v34-tracker' in html
assert 'WZ27:' in html and 'wanzu_v27_pixel_sanctuary' in html
parser=Scripts();parser.feed(html)
assert len(parser.blocks)>=20,len(parser.blocks)
with tempfile.TemporaryDirectory() as tmp:
 for i,script in enumerate(parser.blocks):
  file=Path(tmp)/'script.js';file.write_text(script)
  check=subprocess.run(['node','--check',str(file)],capture_output=True,text=True)
  if check.returncode:raise SystemExit('JavaScript syntax error in script '+str(i)+':\n'+check.stderr)
print(f'PASS: {len(parser.blocks)} inline scripts; V34 + WZ27 compatibility markers present')
