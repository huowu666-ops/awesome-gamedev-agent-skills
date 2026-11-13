from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()
BOOT="""() => {const m=new Map();window.__mockStore=m;window.__denyWrites=false;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>{if(window.__denyWrites)throw Error('SIMULATED_QUOTA');m.set(k,String(v))},removeItem:k=>m.delete(k),clear:()=>m.clear()}})}"""
checks=[]
def ck(size,title,ok,details=''):
 checks.append({'viewport':size,'check':title,'passed':bool(ok),'detail':'' if ok else str(details)[:500]})
 if not ok: print('FAIL',size,title,details,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=None if not Path('/usr/bin/chromium').exists() else '/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(390,844),(375,667),(320,640)]:
  c=browser.new_context(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=True,is_mobile=True)
  page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.evaluate(BOOT);page.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  page.wait_for_function('!!window.V34');page.evaluate('V34.open()');page.wait_for_timeout(200)
  js=page.evaluate;size=f'{w}x{h}'
  ck(size,'game starts',js('V34.getState().mode')=='farm')
  ck(size,'V27 through V34 aliases',js('V34===V33&&V34===V27'))
  ck(size,'default quest safe',js("V34.getState().trackedQuest==='main'"))
  ck(size,'tracker UI present',page.locator('.v34-tracker').count()==1)
  ck(size,'no sideways scroll',js('document.querySelector("#v27-app").scrollWidth<=innerWidth+5'))
  ck(size,'audit',js('V34.audit().passed===V34.audit().total'),js('V34.audit()'))
  page.locator('.v34-tracker [data-do="trackMenu"]').click()
  ck(size,'seven quest choices',page.locator('.v34-trackchoice').count()==7)
  page.locator('.v34-trackchoice[data-do="track:river"]').click()
  ck(size,'quest click saved',js("V34.getState().trackedQuest==='river'"))
  ck(size,'river progress shown',js("V34.trackedInfo().progress==='0/3'"))
  stored=js("window.__mockStore.get('wanzu_v27_pixel_sanctuary')")
  ck(size,'persisted in old save key',bool(stored) and json.loads(stored)['trackedQuest']=='river')
  prev=js('V34.getState()');js('window.__denyWrites=true');js("V34.trackQuest('npc:qingwu')");js('window.__denyWrites=false')
  ck(size,'quota rollback',js('V34.getState().trackedQuest')==prev['trackedQuest'])
  ck(size,'unknown id rejected',js("V34.trackQuest('npc:UNTRUSTED')") is False and js('V34.getState().trackedQuest')=='river')
  # legacy V33 state (no new field) must load as normal
  migrated=js("""() => {const s=V34.getState();delete s.trackedQuest;V34.debugState(s);return V34.getState().trackedQuest==='main'}""")
  ck(size,'V33 save migration',migrated)
  mal=js("""()=>{const s=V34.getState();s.trackedQuest='__proto__';V34.debugState(s);return V34.getState().trackedQuest==='main'}""")
  ck(size,'malicious id normalized',mal)
  js("V34.trackQuest('npc:qingwu')")
  ck(size,'NPC quest',js("V34.trackedInfo().title.includes('青妩')"))
  ck(size,'NPC progress',js("V34.trackedInfo().progress==='0/4'"))
  if w==390:
   page.screenshot(path=str(ROOT/'previews/wz_v34_tracker.png'),animations='disabled',full_page=False)
   page.locator('.v34-tracker [data-do="trackMenu"]').click()
   page.screenshot(path=str(ROOT/'previews/wz_v34_quest_panel.png'),animations='disabled',full_page=False)
   page.locator('.v34-trackchoice[data-do="track:river"]').click()
   # actual click-based auto navigation, beginning at the farm
   page.locator('.v34-tracker [data-do="guide"]').click()
   page.wait_for_timeout(2500)
   ck(size,'real quest-guided zone switch',js("V34.getState().area==='village'"),js('V34.getState()'))
  ck(size,'no JS runtime errors',not errors,errors)
  c.close()
 browser.close()
print('V34 RESULTS',sum(c['passed'] for c in checks),'/',len(checks))
(ROOT/'tests/v34_checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
if not all(x['passed'] for x in checks):sys.exit(1)
