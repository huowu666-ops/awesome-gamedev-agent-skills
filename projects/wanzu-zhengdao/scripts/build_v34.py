from pathlib import Path
import re
BASE=Path(__file__).resolve().parents[1]/'baseline/V33.html'
OUT=Path(__file__).resolve().parents[1]/'index.html'
s=BASE.read_text(encoding='utf-8')
m=re.search(r'(<script id="v27-pixel-sim-js">)(.*?)(</script>)',s,re.S)
assert m
js=m.group(2)
def rep(a,b,count=1):
 global js
 c=js.count(a)
 if c!=count:raise Exception(f'{c} occurrences, expected {count}: {a[:80]}')
 js=js.replace(a,b)
rep('riverQuestSince:0,\n farmScore:',"riverQuestSince:0,trackedQuest:'main',\n farmScore:")
rep('a.riverTeaDate=Math.floor(cap(x.riverTeaDate,0,a.day));',"a.trackedQuest=(x.trackedQuest==='main'||x.trackedQuest==='river'||NPC.some(n=>x.trackedQuest==='npc:'+n.id))?x.trackedQuest:'main';\n a.riverTeaDate=Math.floor(cap(x.riverTeaDate,0,a.day));")
rep("['河岸限次',s.riverGatherCount>=0&&s.riverGatherCount<=2&&s.riverTeaDate<=s.day]", "['河岸限次',s.riverGatherCount>=0&&s.riverGatherCount<=2&&s.riverTeaDate<=s.day],\n ['因果路引',!!trackedInfo(s).detail&&['main','river',...NPC.map(n=>'npc:'+n.id)].includes(s.trackedQuest)]")
rep("'<div class=\"quickbar\" aria-label=\"生活工具栏\">'", "'<div class=\"v34-tracker\"><div><b>◎ '+esc(trackedInfo(s).title)+' <small>'+esc(trackedInfo(s).progress)+'</small></b><span>'+esc(trackedInfo(s).detail)+'</span></div><button data-do=\"trackMenu\">更换追踪</button><button data-do=\"guide\" '+(dungeon?'disabled':'')+'>寻路 ›</button></div>'+\n '<div class=\"quickbar\" aria-label=\"生活工具栏\">'")
rep("if(action==='help'){return modalBox", "if(action==='trackMenu')return trackMenu();\n if(action==='guide')return guideTarget();\n if(action.startsWith('track:'))return changeTracked(action.slice(6));\n if(action==='help'){return modalBox")
rep("window.V33=window.V32", "window.V34=window.V33=window.V32")
rep('万族争道 · V33 灵溪四时','万族争道 · V34 山海路引',2)
rep('四时山居 · 灵溪四时 V33','四时山居 · 山海路引 V34')
rep('灵溪河岸 · 河神旧誓 · 五族人物委托','七线因果追踪 · 寻路 · 万族生活')
rep('万族争道 · 灵溪四时','万族争道 · 山海路引')
rep('V33 · 灵溪四时 · 原创像素修仙','V34 · 山海路引 · 原创像素修仙')
rep('万族争道 V33 灵溪四时','万族争道 V34 山海路引')
rep('assetCount:()=>Object.keys(imageSources).length,', 'assetCount:()=>Object.keys(imageSources).length,trackedInfo:()=>trackedInfo(),trackMenu,trackQuest:changeTracked,guideTarget,')
rep("img('characters/'+n.id+'_'+f,tr.px*T+6,tr.py*T+5,52,52);if(s.area", "img('characters/'+n.id+'_'+f,tr.px*T+6,tr.py*T+5,52,52);if(s.trackedQuest==='npc:'+n.id){ctx.strokeStyle='#ead88b';ctx.lineWidth=3;ctx.strokeRect(tr.px*T+7,tr.py*T+4,48,55)}if(s.area")
addon=r'''
// V34 · 因果追踪：只存任务ID，进度始终由权威存档数据推导。
function trackedInfo(s=state){
 const id=s.trackedQuest||'main';
 if(id==='river'){
  const stage=s.riverQuestStage||0;
  return {title:'灵溪旧誓',detail:['探访灵溪河岸古祠，记下旧誓','带2木2石或45灵石修碑','隔日至古祠归还水印','水誓已解，河岸复归清宁'][stage],progress:stage+'/3'};
 }
 if(id.startsWith('npc:')){
  const name=id.slice(4),n=NMAP[name];if(!n)return trackedInfo({...s,trackedQuest:'main'});
  const step=s.storyStages?.[name]||0,friend=s.fav[name]||0;
  const quest=NPC_STORIES[name],sub=step>=2?quest.second:quest.first;
  let detail='';
  if(step===0)detail='与'+n.name+'交谈、赠礼，提高好感至25（当前'+friend+'）';
  else if(step===1||step===3)detail=s.day<=s.storySince[name]?'已接取「'+sub.title+'」，翌日才能交付':'交付'+storyNeedsText(sub.requirements)+'，或资助'+sub.fee+'灵石';
  else if(step===2)detail=friend<45?'结缘至好感45（当前'+friend+'）':'靠近'+n.name+'接取第二章';
  else detail='两章完结，纪念物「'+quest.keepsake+'」已解锁';
  return {title:n.name+' · '+quest.title,detail,progress:step+'/4'};
 }
 const o=objective(s);return {title:'今日山居',detail:o.detail,progress:s.wonFarm?'经营圆满':s.farmScore+'/220'};
}
function trackMenu(){
 const s=state,chosen=s.trackedQuest||'main';
 const quests=[{id:'main',name:'今日山居',desc:'跟随当前生活目标'},
 {id:'river',name:'灵溪旧誓',desc:'阶段 '+s.riverQuestStage+'/3'},
 ...NPC.map(n=>({id:'npc:'+n.id,name:n.name+' · '+NPC_STORIES[n.id].title,desc:'阶段 '+(s.storyStages[n.id]||0)+'/4 · 好感 '+s.fav[n.id]}))];
 const body='<p>选定要追踪的因果。更换目标不会重置进度。</p><div class="v34-tracklist">'+quests.map(q=>'<button data-do="track:'+q.id+'" class="v34-trackchoice" aria-pressed="'+(chosen===q.id)+'"><b>'+(chosen===q.id?'◎ ':'○ ')+esc(q.name)+'</b><small>'+esc(q.desc)+'</small></button>').join('')+'</div>';
 modalBox('山海路引 · 因果追踪',body,[{label:'收起路引',on:'close'}]);
}
function changeTracked(id){
 if(!['main','river',...NPC.map(n=>'npc:'+n.id)].includes(id))return false;
 const ok=change(s=>{s.trackedQuest=id;s.log='已改换山海路引。';});
 if(ok){modal=null;render()}return ok;
}
function guideTarget(){
 if(state.mode==='dungeon')return notify('秘境中暂不可寻访，先撤退归山。');
 const id=state.trackedQuest||'main';let target=null,label='';
 const set=(p,l)=>{target=p;label=l};
 if(id==='river'){
  if(state.area==='river')set(RIVER_SITES.shrine,'河神旧祠');
  else if(state.area==='village')set(VILLAGE_SITES.river,'灵溪石拱');
  else if(state.area==='farm')set([10,3],'万族小镇东路');
 }else if(id.startsWith('npc:')){
  const npc=NMAP[id.slice(4)];if(npc&&npcHere(npc))set(npcPos(npc),npc.name);
  else if(state.area==='farm')set([10,3],'万族小镇东路');
  else if(state.area==='river')set(RIVER_SITES.gate,'返回小镇的石拱');
 }else{
  if(state.area==='farm')set([2,2],'今日乡约告示');
  else if(state.area==='river')set(RIVER_SITES.gate,'返回小镇的石拱');
 }
 if(!target)return notify('此地暂无通向当前任务的直达路引。先返回灵圃或万族小镇。');
 const [x,y]=target,dist=Math.abs(state.x-x)+Math.abs(state.y-y);
 if(dist<=1){if(isTargetTile(x,y))interactAt(x,y);else notify('已抵达'+label+'。');return true}
 if(!pathTo(x,y).length)return notify('路上暂有障碍，请稍候重试。');
 clickTile(x,y);notify('正沿山海路引前往'+label+'。');return true;
}
'''
rep('function journal(){const s=state,o=objective(s);',addon+'function journal(){const s=state,o=objective(s);')
css='''<style id="v34-tracker-style">
#v27-app .v34-tracker{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:9px;padding:10px 11px;background:#203b35;border:3px solid #a98b60;color:#f7eace;font-size:12px}
#v27-app .v34-tracker>div{flex:1 1 190px;min-width:0;display:flex;flex-direction:column;gap:4px}
#v27-app .v34-tracker b{font-size:13px;color:#e7c783}
#v27-app .v34-tracker b small{font-size:11px;color:#c3d7ca;margin-left:8px}
#v27-app .v34-tracker span{color:#e8e7d7;line-height:1.55}
#v27-app .v34-tracker button{font:inherit;font-weight:bold;min-height:42px;padding:6px 11px;border:2px solid #b3a077;background:#e2d5ba;color:#4a4932;cursor:pointer}
#v27-app .v34-tracker button:last-child{background:#628874;color:white;border-color:#99b39c}
#v27-app .v34-tracklist{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px}
#v27-app .v34-trackchoice{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:4px;background:#e8ddc7;color:#4c3d2d;border:2px solid #927657;min-height:57px;padding:9px 11px;cursor:pointer}
#v27-app .v34-trackchoice[aria-pressed="true"]{border-color:#3e765b;background:#d6e3d5}
#v27-app .v34-trackchoice small{font-size:11px;color:#655d4c}
@media(max-width:375px){#v27-app .v34-tracker{padding:8px 7px;gap:5px}#v27-app .v34-tracker>div{flex-basis:100%}#v27-app .v34-tracker button{flex:1 1 110px}}
</style>'''
# replace script once using recorded match positions and then add a standalone style
s=s[:m.start()]+m.group(1)+js+m.group(3)+s[m.end():]
s=s.replace('</head>',css+'\n</head>',1)
OUT.write_text(s,encoding='utf-8')
(Path(__file__).resolve().parents[1]/'source/V34_pixel_module.js').write_text(js,encoding='utf-8')
print('V34 created',OUT,OUT.stat().st_size)
