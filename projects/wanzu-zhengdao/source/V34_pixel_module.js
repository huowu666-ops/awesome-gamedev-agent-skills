(function(){'use strict';
/* 《万族争道》 V27 · 独立像素洞府。与旧版 S / SAVE_KEY / FT 完全隔离，防止破坏 V26。 */
const SAVE='wanzu_v27_pixel_sanctuary',MANUAL='wanzu_v27_manual_backup',W=12,H=8,T=64;
const CROPS=[
 {id:'dewleaf',name:'凝露叶',days:1,cost:8,yield:2,price:9,score:7,desc:'滋养灵田，初学炼丹必备'},
 {id:'flamebud',name:'赤焰花',days:2,cost:14,yield:2,price:17,score:14,desc:'火行丹材，炼器师喜用'},
 {id:'frostroot',name:'霜魄根',days:2,cost:15,yield:2,price:18,score:14,effect:'温养灵台：收获恢复4灵力',desc:'安定灵台，入药清心'},
 {id:'stargrain',name:'星穗谷',days:3,cost:18,yield:3,price:16,score:21,effect:'晒制灵麦：收获额外获得1份干粮',desc:'灵禽与修士皆可食'},
 {id:'shadowvine',name:'幽影藤',days:3,cost:20,yield:2,price:25,score:21,desc:'能遮蔽一缕行踪'},
 {id:'goldblossom',name:'金纹菊',days:3,cost:22,yield:2,price:26,score:21,desc:'暖脉祛寒，可赠长者'},
 {id:'moonorchid',name:'月华兰',days:4,cost:28,yield:2,price:35,score:28,desc:'月夜开花，青妩喜爱'},
 {id:'thundergrass',name:'引雷草',days:4,cost:30,yield:2,price:37,score:28,effect:'引雷养元：收获恢复10灵力',desc:'雷道修行者采集之物'},
 {id:'spiritlotus',name:'碧心莲',days:5,cost:35,yield:3,price:29,score:35,effect:'莲息补神：收获恢复12体力',desc:'滋养神识，适合入定'},
 {id:'bloodginseng',name:'赤参',days:5,cost:38,yield:2,price:45,score:35,effect:'赤参养身：收获恢复20气血',desc:'气血大补，炼体佳品'}
];
const CROP=Object.fromEntries(CROPS.map(c=>[c.id,c]));
const NPC=[
 {id:'qingwu',name:'青妩',race:'青丘狐族',job:'古坛守誓人',base:[7,1],love:'moonorchid',habits:['清晨巡察古坛','午后在池边听水','夜里守旧誓铜铃'],talk:['青狐火未熄，旧誓尚在。','莫急着取宝，先问问为何封存。','九曜宗的人，总是这般匆匆么？'],gift:'月华兰'},
 {id:'shennong',name:'沈禾',race:'人族',job:'灵田药师',base:[2,3],love:'dewleaf',habits:['黎明育苗','午后整理药箓','薄暮检查灌渠'],talk:['灵草认时令，道心认四季。','叶上有露，根底不可积水。','一株灵草，救得一人，已是善果。'],gift:'凝露叶'},
 {id:'yuchi',name:'鱼迟',race:'灵族',job:'池渊钓师',base:[9,2],love:'fish',habits:['晨钓寻灵鳞','午间晒网','夜观池面月色'],talk:['鱼不争钩，钓者自争心。','收竿早一息，鱼便多一分命。','听水响，便知灵鱼近岸。'],gift:'灵鱼'},
 {id:'moyu',name:'墨羽',race:'魔族',job:'行脚委托人',base:[9,5],love:'shadowvine',habits:['早上核对契书','午后发布委托','夜里回信宗门'],talk:['契书写得清，魔修也讲道理。','贵物不必亲取，重在不欺人。','秘境里面的债，最好记在纸上。'],gift:'幽影藤'},
 {id:'tiebai',name:'铁柏',race:'妖族',job:'守山铁匠',base:[2,6],love:'goldblossom',habits:['清晨劈木烧炉','午后淬炼兵刃','夜里养炉听火'],talk:['剑要磨，人也一样。','老夫铁骨未锈，尚可替你修刃。','火候七分，莫贪十分。'],gift:'金纹菊'}
];
const NMAP=Object.fromEntries(NPC.map(n=>[n.id,n]));
const MONSTERS=[
 {id:'bamboo',name:'竹魇',hp:35,atk:7,score:13,gold:10,ai:'patrol',drop:'灵竹节',desc:'沿竹径巡游，受惊后追击'},
 {id:'lizard',name:'岩甲蜥',hp:52,atk:9,score:16,gold:15,ai:'charge',drop:'岩甲片',desc:'蓄势沿直线冲撞'},
 {id:'fox',name:'青焰狐',hp:42,atk:8,score:17,gold:14,ai:'kite',drop:'青狐焰',desc:'遇敌保持距离，灵焰远袭'},
 {id:'corpse',name:'旧祠尸傀',hp:66,atk:11,score:20,gold:18,ai:'guard',drop:'镇魂丝',desc:'守护禁门，近身重击'},
 {id:'mist',name:'雾魇',hp:78,atk:13,score:25,gold:22,ai:'blink',drop:'魇核',desc:'雾中挪移，间歇突袭'}
];
const MMAP=Object.fromEntries(MONSTERS.map(m=>[m.id,m]));
const DUNGEONS=[
 {name:'竹隐兽径',level:'炼气·试境',desc:'浅竹寒雾，竹魇与青焰狐争守一汪灵泉。',boss:'fox',map:[
 '############','##..E......#','#..........#','#....##....#','#...C......#','#.....E....#','#S.......B.#','############'],reward:'风竹符',score:42,unlocks:'风竹残诗：古坛第七柱有人守望'},
 {name:'赤砂地宫',level:'金丹·中境',desc:'岩甲蜥匍匐于旧矿道；石匣曾藏九曜矿符。',boss:'lizard',map:[
 '############','#...E.....C#','#.##.......#','#.....##...#','#...E......#','#......##..#','#S.......B.#','############'],reward:'朱砂矿印',score:54,unlocks:'赤砂矿符：通向璇玑祭坛的矿井旧图'},
 {name:'璇玑残坛',level:'金丹·险境',desc:'古坛崩裂，尸傀守誓，雾魇偷走第七柱的名字。',boss:'mist',map:[
 '############','#...C.....E#','#..##......#','#..........#','#..E....##.#','#......C...#','#S.......B.#','############'],reward:'七柱铭钥',score:70,unlocks:'七柱铭钥：古誓只约束立誓者，不当牵连后人'}
];
const EVENTS=[
 {id:'dew',name:'夜露入田',desc:'山风收声，灵田各畦皆生霜光。若借露养药，可催一夜生机；若以瓶取露，亦是小小机缘。',choices:['引露入田','收取凝露'],results:['活着的灵草额外生长半日，田园道业+6','凝露叶×2，田园道业+3']},
 {id:'caravan',name:'云商路过',desc:'行脚灵商叩门，掌中一枚旧篆漾着青光。其价十五灵石，不求你信，只问是否愿一赌。',choices:['购下旧篆','婉拒交易'],results:['灵石−15，获得隐踪古篆，解锁交易线索','守住灵石，记下灵商行踪']},
 {id:'letter',name:'青丘夜信',desc:'一只灵狐将旧纸放在窗前，尾端系着青妩惯用的铜线。信中只写：第七柱下，先寻名字，后谈恩仇。',choices:['保存信笺','焚去信笺'],results:['青妩好感+4，获得七柱旧纸情报','避免卷入争端，道心自明，田园道业+4']},
 {id:'water',name:'妖部落争泉',desc:'两名山妖在灵圃外争一汪活水。你若分水，两边可得生路；若收取过水之资，亦合坊市规矩。',choices:['赠泉息争','收取过水钱'],results:['灵鱼+1，田园道业+8','灵石+18，田园道业+1']},
 {id:'dream',name:'古道人托梦',desc:'半夜有灰衣道人立于门外，影不落地。其语不明：“守一株草与护一盏灯，俱是修行。”',choices:['记下梦语','追问其名'],results:['获得归田道偈，田园道业+6','解锁旧道影线索，但耗去灵力5']},
 {id:'pearl',name:'灵鱼浮珠',desc:'池中有鳞光掠过，一枚夜珠沉沉随波。捧出可留作奇物，投回则润养满池。',choices:['留取夜珠','投珠养鱼'],results:['获得灵池月珠','鱼苗生长加一日；若空池，则得一尾灵鱼']},
 {id:'seedwind',name:'风送异种',desc:'东风穿林，卷来一枚带金纹的种荚。种与土相逢，或可改一畦春秋。',choices:['播留异种','以种换资'],results:['星穗谷种子+2，田园道业+4','灵石+22']},
 {id:'ironbell',name:'山道铁铃',desc:'夜间古铃无风自鸣，铁柏提灯来访，说是旧时守山人的示警。',choices:['同守山门','谨慎封铃'],results:['铁柏好感+5，木材+2','道心自守，灵力+8']},
 {id:'springs',name:'泉下石简',desc:'雨后灵泉吐出半截石简，刻有前朝取水之规。其言虽古，仍可为今日乡邻所用。',choices:['献于山门','私藏残简'],results:['经营道业+9，鱼迟好感+3','获得泉规残简，矿石+1']},
 {id:'midnight',name:'子夜观星',desc:'夜幕之下，九曜星纹映入山池。你一时忘却饥寒，似闻万族生息皆在一息之间。',choices:['默记星位','闭目静修'],results:['获得九曜星位线索，灵力+10','体力+12，田园道业+4']}
];
const NPC_QUESTS={qingwu:['青丘铜线','青妩愿与你共查古坛族誓'],shennong:['药师手札','沈禾传你照料灵田的旧方'],yuchi:['渔师青钩','鱼迟说灵池深处另有旧洞'],moyu:['秘境散契','墨羽替你查到一条公平交易之路'],tiebai:['守山铁纹','铁柏愿为你见证重铸之誓']};
// V32 人物支线：五位邻人各两章，接受委托->隔日交付->提升好感->续章。
// 两种完成方式皆可全靠经营资源完成，不要求打秘境；单章奖励只能结算一次。
const NPC_STORIES={
 qingwu:{title:'狐火照旧誓',first:{title:'古坛残灯',intro:'青妩压低声音：“旧坛的灯油，需月华兰的香露养着。替我寻一枝来。”',requirements:{goods:{moonorchid:1}},fee:32,notes:'青妩发现灯芯里藏着青丘的誓纹'},second:{title:'七柱无名',intro:'她捧出一片断碑：“若以两枝月华兰续火，或许便能看清那被抹去的名字。”',requirements:{goods:{moonorchid:2}},fee:70,notes:'旧坛第七柱之名被人故意磨去；不应以旁人之命偿旧债'},keepsake:'青丘守灯结'},
 shennong:{title:'药庐春信',first:{title:'叶上晨露',intro:'沈禾眉间隐有倦色：“寒潮已近，旧药园缺三株凝露叶。可否借我一用？”',requirements:{goods:{dewleaf:3}},fee:25,notes:'药庐旧册载着一次万族共救山疫的方子'},second:{title:'药方不问族',intro:'“我想把药方刻在路口，让所有族人都识得。”沈禾需要两株霜魄根稳住药性。',requirements:{goods:{frostroot:2}},fee:55,notes:'沈禾将不问族属的救疫古方贴在山门'},keepsake:'山门药师手札'},
 yuchi:{title:'池渊旧网',first:{title:'渔歌慢',intro:'鱼迟捻起断网，望池良久：“灵潮将至，可借两尾灵鱼让我重织活网么？”',requirements:{fish:2},fee:27,notes:'灵池暗渠与山外古河相通'},second:{title:'放生归河',intro:'“人只知捞鱼，却不知给水留命。”他想放三尾灵鱼归旧河，恢复来年的水脉。',requirements:{fish:3},fee:50,notes:'山门旧河恢复灵息，鱼迟许你一张灵渊水图'},keepsake:'灵渊水图'},
 moyu:{title:'契书与旧债',first:{title:'明账',intro:'墨羽展开旧契：“把一株幽影藤交来，我便能照出这笔账上被遮掉的字。”',requirements:{goods:{shadowvine:1}},fee:40,notes:'行脚委托行曾有人在契书上故意涂改损失'},second:{title:'契不欺人',intro:'“要把真相公之于众，得有两朵金纹菊定下印泥。”墨羽不再卖关子。',requirements:{goods:{goldblossom:2}},fee:65,notes:'墨羽重立公契，承诺无论人魔妖灵皆依同一契规'},keepsake:'四族公契副本'},
 tiebai:{title:'赤炉守山',first:{title:'旧炉余火',intro:'铁柏拾起焦黑石料：“给我三份木、两块矿石，我便能修好街头那盏旧炉。”',requirements:{wood:3,stone:2},fee:35,notes:'赤炉原为守护万族山路而筑，并非杀伐之器'},second:{title:'四时同灯',intro:'“再添五木四石，便能铸一盏四时灯，照得夜行人归家。”',requirements:{wood:5,stone:4},fee:80,notes:'铁柏铸成四时灯，万族山路从此不分夜行者族裔'},keepsake:'赤炉四时灯印'}
};
const storyStage=s=>s.storyStages||{};
function storyNeedsText(req){let out=[];if(req.goods)for(const [id,v] of Object.entries(req.goods))out.push(CROP[id].name+'×'+v);if(req.wood)out.push('木材×'+req.wood);if(req.stone)out.push('矿石×'+req.stone);if(req.fish)out.push('灵鱼×'+req.fish);return out.join('、')}
function storyHas(s,req){if(req.goods)for(const [id,n] of Object.entries(req.goods))if(goodCount(s,id)<n)return false;for(const k of ['wood','stone','fish'])if(req[k]&&(s[k]||0)<req[k])return false;return true}
function storySpend(s,req){if(!storyHas(s,req))throw Error('交付材料不足');if(req.goods)for(const [id,n] of Object.entries(req.goods))s.goods[id]-=n;for(const k of ['wood','stone','fish'])if(req[k])s[k]-=req[k]}

const PLOTS=[[3,4],[4,4],[5,4],[6,4],[3,5],[4,5],[5,5],[6,5]];
const NODES=[{x:1,y:6,type:'木',key:'木材'},{x:8,y:7,type:'石',key:'矿石'},{x:9,y:6,type:'药',key:'灵露'},{x:1,y:3,type:'木',key:'木材'},{x:10,y:4,type:'石',key:'矿石'}];
const LOCS={home:'九曜灵圃',dungeon:'秘境'};
const VILLAGE_MAP=[
 '############','#...#......#','#..........#','#..##......#',
 '#..........#','#..........#','#..........#','############'];
const HOUSE_MAP=[
 '############','#..........#','#..........#','#..........#',
 '#..........#','#..........#','#..........#','############'];
const RIVER_MAP=[
 '############','#....~~....#','#....~~....#','#....~~....#','#..........#','#....~~....#','#....~~....#','############'];
const RIVER_SITES={gate:[1,4],dock:[4,5],reeds:[3,2],stone:[8,2],tea:[8,5],shrine:[9,3]};
const AREAS={river:'灵溪河岸',farm:'九曜灵圃',village:'万族小镇',house:'山居内室',apothecary:'青禾药庐',forge:'赤炉铁坊'};
// V31: 原创两间可进入商铺，共用 12x8 室内碰撞模板。
const SHOP_MAP=[
 '############','#..........#','#..........#','#..........#',
 '#..........#','#..........#','#..........#','############'];
const SHOP_SITES={vendor:[5,2],shelf:[8,4],service:[3,4],exit:[5,6]};
const SHOP_INFO={
 apothecary:{title:'青禾药庐',owner:'shennong',intro:'药师沈禾晨起理药，向修士出售种囊，也为受伤者煎汤温养。'},
 forge:{title:'赤炉铁坊',owner:'tiebai',intro:'妖族匠人铁柏守着不灭丹炉。购置山材、改良灵田工具，皆须付出实价。'}
};
function isShop(area){return !!SHOP_INFO[area]}
function shopOpen(s=state){return s.minute>=480&&s.minute<1260}

const VILLAGE_SITES={gate:[1,6],market:[9,3],bulletin:[4,5],festival:[6,2],river:[10,4],apothecary:[3,1],forge:[9,1]};
const HOUSE_SITES={bed:[3,2],workbench:[7,2],chest:[9,3],hearth:[7,5],exit:[5,6]};
function spot(p,x,y){return p[0]===x&&p[1]===y}
function atSite(obj,x,y){return Object.values(obj).some(pos=>spot(pos,x,y))}
function areaName(s){return s.mode==='dungeon'?DUNGEONS[s.dungeon].name:AREAS[s.area]||AREAS.farm}

const SEASONS=['春','夏','秋','冬'];
const TOOLS=[{id:'hand',name:'交互',symbol:'✦',desc:'交谈／收获'},{id:'hoe',name:'灵种',symbol:'❀',desc:'在空田播种'},{id:'water',name:'浇水',symbol:'◈',desc:'引泉催生'},{id:'sickle',name:'收割',symbol:'♧',desc:'采收成熟灵草'},{id:'rod',name:'钓竿',symbol:'♧',desc:'临池垂钓'},{id:'food',name:'干粮',symbol:'●',desc:'恢复体力'}];
const seasonOf=day=>SEASONS[Math.floor((day-1)/7)%4];
const weatherOf=day=>day%13===0?'雷雨':day%5===0||day%7===3?'细雨':day%4===0?'多云':'晴朗';
const clockStr=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function questFor(day){const ids=['dewleaf','flamebud','frostroot','stargrain','shadowvine','goldblossom','moonorchid'];
 const id=ids[(day-1)%ids.length],fish=day%6===0;
 return fish?{id:'fish',need:1,name:'灵鱼',reward:33,score:10,npc:'yuchi'}:
 {id,need:1,name:CROP[id].name,reward:Math.max(24,CROP[id].cost+15),score:8,npc:['shennong','qingwu','moyu','tiebai'][day%4]};
}
function cost(s,energy,minutes){if(s.mode==='farm'){
 const need=Math.max(0,energy-(s.toolGrade&&s.area==='farm'&&energy>=2?1:0));
 if(s.energy<need)throw Error('体力不足，请食用干粮或回洞府安寝');
 if(s.minute>=1380)throw Error('夜已深，请回洞府休息');
 s.energy-=need;s.minute=Math.min(1380,s.minute+minutes);
}}
function applyTool(i){const tool=state.tool;if(tool==='water')return waterPlotAt(i);
 if(tool==='sickle')return harvestPlot(i);
 if(tool==='rod')return notify('请到东侧灵池使用钓竿。');
 if(tool==='food')return eatFood();
 return usePlot(i);
}

const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const cap=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
const clone=v=>JSON.parse(JSON.stringify(v));
const now=()=>Date.now();
const seedCount=(s,id)=>Number(s.seeds[id]||0);
const goodCount=(s,id)=>Number(s.goods[id]||0);
const goodName=id=>CROP[id]?.name||id;
const fresh=()=>({v:27,day:1,mode:'farm',area:'farm',x:6,y:3,face:'down',gold:180,hp:100,mp:50,wood:0,stone:0,food:1,fish:0,fishDaily:0,gatherDaily:0,pond:{stock:0,age:0},farmLv:0,minute:360,energy:100,tool:'hand',bulletinDate:0,riverGatherDate:0,riverGatherCount:0,riverTeaDate:0,riverQuestStage:0,riverQuestSince:0,trackedQuest:'main',
 farmScore:0,battleScore:0,houseLv:0,festivalDate:0,meals:0,wards:0,toolGrade:0,clinicDate:0,packDate:0,seeds:{dewleaf:3,flamebud:2},goods:{},plots:PLOTS.map(()=>null),selected:'dewleaf',fav:Object.fromEntries(NPC.map(n=>[n.id,0])),talkToday:{},giftToday:{},
 commission:null,pendingEvent:null,npcQuest:{},storyStages:Object.fromEntries(NPC.map(n=>[n.id,0])),storySince:Object.fromEntries(NPC.map(n=>[n.id,0])),notes:[],items:[],cleared:[],opened:[],pendingNodes:[],monsterDrops:[],dungeon:0,foes:[],enemyTurn:0,rescues:0,
 wonFarm:false,wonFight:false,lastSave:0,log:'山门早钟三响。灵田有土，秘境有路，今日当由你自择。'});
function validated(x){
 // V29 file safety: accept V27's version and schema, but never trust nested imported payloads.
 if(!x||typeof x!=='object'||Array.isArray(x)||x.v!==27||!Number.isFinite(Number(x.day))||
    !Array.isArray(x.plots)||x.plots.length!==8||!x.seeds||typeof x.seeds!=='object'||
    !x.goods||typeof x.goods!=='object'||!Array.isArray(x.foes)||!Array.isArray(x.cleared))return null;
 const a={...fresh(),...x};
 a.day=Math.floor(cap(a.day,1,5000));a.gold=Math.floor(cap(a.gold,0,1e8));a.hp=cap(a.hp,1,100);a.mp=cap(a.mp,0,50);
 a.x=Math.floor(cap(a.x,1,10));a.y=Math.floor(cap(a.y,1,6));
 for(const k of ['farmScore','battleScore','fishDaily','gatherDaily','wood','stone','food','fish','dungeon','rescues'])
   a[k]=Math.floor(cap(a[k],0,999999));
 a.fishDaily=Math.min(3,a.fishDaily);a.gatherDaily=Math.min(3,a.gatherDaily);
 // Only declared crop ids may be imported. The original V27 payload remains accepted.
 a.seeds=Object.fromEntries(CROPS.map(c=>[c.id,Math.floor(cap(x.seeds[c.id],0,999999))]));
 a.goods=Object.fromEntries(CROPS.map(c=>[c.id,Math.floor(cap(x.goods[c.id],0,999999))]));
 a.plots=x.plots.map(p=>{
   if(p==null)return null;
   if(typeof p!=='object'||Array.isArray(p)||!Object.prototype.hasOwnProperty.call(CROP,p.crop))return null;
   return {crop:p.crop,progress:cap(p.progress,0,9999),watered:Math.floor(cap(p.watered??-1,-1,5000))};
 });
 a.fav=Object.fromEntries(NPC.map(n=>[n.id,Math.floor(cap(x.fav?.[n.id],0,100))]));
 a.talkToday=Object.fromEntries(NPC.filter(n=>x.talkToday?.[n.id]).map(n=>[n.id,true]));
 a.giftToday=Object.fromEntries(NPC.filter(n=>x.giftToday?.[n.id]).map(n=>[n.id,true]));
 a.npcQuest=Object.fromEntries(NPC.filter(n=>x.npcQuest?.[n.id]).map(n=>[n.id,true]));
 a.storyStages=Object.fromEntries(NPC.map(n=>[n.id,Math.floor(cap(x.storyStages?.[n.id],0,4))]));
 a.storySince=Object.fromEntries(NPC.map(n=>[n.id,Math.floor(cap(x.storySince?.[n.id],0,a.day))]));
 a.notes=Array.isArray(x.notes)?x.notes.filter(n=>typeof n==='string').slice(-350).map(n=>n.slice(0,240)):[];
 a.items=Array.isArray(x.items)?x.items.filter(n=>typeof n==='string').slice(-500).map(n=>n.slice(0,80)):[];
 a.monsterDrops=Array.isArray(x.monsterDrops)?x.monsterDrops.filter(n=>typeof n==='string').slice(-500):[];
 a.cleared=[...new Set(x.cleared.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<DUNGEONS.length))].sort();
 a.opened=Array.isArray(x.opened)?[...new Set(x.opened.filter(v=>typeof v==='string'&&/^[012]:[0-9]{1,2}:[0-9]{1,2}$/.test(v)))].slice(0,300):[];
 a.foes=x.foes.slice(0,30).filter(e=>e&&typeof e==='object'&&Object.prototype.hasOwnProperty.call(MMAP,e.id)).map(e=>({
   id:e.id,x:Math.floor(cap(e.x,1,10)),y:Math.floor(cap(e.y,1,6)),homeX:Math.floor(cap(e.homeX??e.x,1,10)),
   homeY:Math.floor(cap(e.homeY??e.y,1,6)),hp:Math.floor(cap(e.hp,0,5000)),max:Math.floor(cap(e.max??MMAP[e.id].hp,1,5000)),
   boss:!!e.boss,step:Math.floor(cap(e.step,0,100000))
 }));
 if(!['farm','dungeon'].includes(a.mode))a.mode='farm';
 a.area=Object.prototype.hasOwnProperty.call(AREAS,x.area)?x.area:'farm';
 if(a.mode==='dungeon')a.area='farm';
 a.riverGatherDate=Math.floor(cap(x.riverGatherDate,0,a.day));a.riverGatherCount=Math.floor(cap(x.riverGatherCount,0,2));
 a.trackedQuest=(x.trackedQuest==='main'||x.trackedQuest==='river'||NPC.some(n=>x.trackedQuest==='npc:'+n.id))?x.trackedQuest:'main';
 a.riverTeaDate=Math.floor(cap(x.riverTeaDate,0,a.day));a.riverQuestStage=Math.floor(cap(x.riverQuestStage,0,3));a.riverQuestSince=Math.floor(cap(x.riverQuestSince,0,a.day));
 a.houseLv=Math.floor(cap(x.houseLv,0,1));a.festivalDate=Math.floor(cap(x.festivalDate,0,a.day));
 a.meals=Math.floor(cap(x.meals,0,1000));a.wards=Math.floor(cap(x.wards,0,9));
 a.toolGrade=Math.floor(cap(x.toolGrade,0,1));a.clinicDate=Math.floor(cap(x.clinicDate,0,a.day));a.packDate=Math.floor(cap(x.packDate,0,a.day));
 if(a.mode==='farm'){if(!Number.isFinite(Number(x.x))||!Number.isFinite(Number(x.y))||Number(x.x)<1||Number(x.x)>10||Number(x.y)<1||Number(x.y)>6){a.x=(a.area==='house'||isShop(a.area))?5:a.area==='village'?2:6;a.y=(a.area==='house'||isShop(a.area))?5:a.area==='village'?6:3}
  if(a.area==='house'&&HOUSE_MAP[a.y]?.[a.x]==='#'){a.x=5;a.y=5}
  else if(a.area==='village'&&VILLAGE_MAP[a.y]?.[a.x]==='#'){a.x=2;a.y=6}
  else if(a.area==='river'&&RIVER_MAP[a.y]?.[a.x]!=='.'){a.x=2;a.y=4}
  else if(isShop(a.area)&&(SHOP_MAP[a.y]?.[a.x]==='#'||atSite(SHOP_SITES,a.x,a.y))){a.x=5;a.y=5}
   else if(a.area==='farm'&&(a.x===0||a.x===11||a.y===0||a.y===7||a.x===1&&a.y===1||a.x===9&&a.y===1)){a.x=6;a.y=3}}
 if(!Object.prototype.hasOwnProperty.call(CROP,a.selected))a.selected='dewleaf';if(a.dungeon>DUNGEONS.length-1)a.dungeon=0;
 a.pond=(a.pond&&typeof a.pond==='object')?{stock:Math.floor(cap(a.pond.stock,0,2)),age:cap(a.pond.age,0,10)}:{stock:0,age:0};
 a.farmLv=Math.floor(cap(a.farmLv,0,1));a.minute=Math.floor(cap(a.minute??360,360,1380));a.energy=cap(a.energy??100,0,100);
 a.bulletinDate=Math.floor(cap(a.bulletinDate||0,0,5000));if(!TOOLS.some(t=>t.id===a.tool))a.tool='hand';
 a.pendingEvent=EVENTS.some(e=>e.id===a.pendingEvent)?a.pendingEvent:null;
 a.commission=(a.commission&&typeof a.commission==='object'&&Number.isFinite(Number(a.commission.due)))?
   {due:Math.floor(cap(a.commission.due,a.day,5002)),name:String(a.commission.name||'璇玑外围勘探').slice(0,50)}:null;
 a.wonFarm=!!a.wonFarm;a.wonFight=!!a.wonFight;
 a.log=typeof a.log==='string'?a.log.slice(0,350):'山居风平，今日修行如常。';
 a.lastSave=cap(a.lastSave,0,1e15);
 return a;
}
function getSaved(key){try{return validated(JSON.parse(localStorage.getItem(key)||'null'))}catch{return null}}
let state=getSaved(SAVE)||getSaved(MANUAL)||fresh(),root=null,canvas=null,ctx=null,tab='farm',modal=null,keys=new Set(),images={},renderCount=0,fishMotion=null,held=null;
const imageSources={"characters/cultivator_4x4":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAH0ElEQVR4nO2dX2gcRRzHvyf3IEoPpEpLqej1CldRmwpHtAm+1FoLIqiN9KF9iAg+RDFQsQ8ipfTBFzFwopX2xXvoS7B/xFKoTRV8aGnCQZuqaDDpRYSaUEVIDRYsrA/tXvbu9s/M7PzZ2fl94Mjldne+85uZnZmd3d9vAYIgCMJRCiIH7Rra7YX9fuL4uFB6pG9O/x7eAzZv6Q8V97fFbZcB6cvV52oAldpAZOKbKuuZ9ksD6cvXL4pk5NfZFtNvqiB9efrcQwCRL5Q0gPtv31aRLOkr0JfWAJaLQqOJNEhfTD9Vrm01mvRTUKkNeH9PHff8v8FPcBvp26FPk0BNfPvzeamNonl4H9NvSQg3AFkZcEX/uce2a1kl5EVoEPll+of29019T0rLDOnr16chwHGoATgO87gkMrOda16UNu6Rvhr92B3CREvVMgDg/Idvd/y+/f1PO/5fmuldm+YtENJXr584CfQFoxJVdSzp69GnOYDjcF8GvnrvnwCAw4cO4oUdj/T87tNIlS3S16VPPYDjJPYA342+0v5eGxnDyVsPAuidhJz8unMSAtzsOVYE0lerH9sDdM8ag5OKJLr3FbkkIn31+ok9QG1kDKVqGeUN61DesA4A0Lp2nSkT2+qnsDTTSnU9TPpq9WN7AFm3NUXTIX31+twLQaKInAWkr16fOVM7X3o5NDNnT39VYNmeFtJXo8+0DrCxNhjZEuO2yYL01enTOgBBEARBEISDWBkfwDR5sp/7dnCSfzoAXL0ypbQgTFZA3uy3Kj4AYDZAQx7ttyo+QKU24CHC83VTZX07D5XagCfzgcxu8mS/We9GQUwHaDBN5gNEmPaPN41N9ucmPkAQExVgq/1WxwcIslwsaq/4PNjP1QPMNS8WlotFfH90P5aLRTQP7+v4BLfpYLlYbH90kEf7rbobmLUK0I0K+62ND2CavNhvZXwAwGwF5Ml+K/vKLFSASShABCEN5h4guL6998hEYMtEyN7ql2N1k1f7QzMYdTMj6G3C4p8+17xYCEtL1yPSohXgkv2RPYAM33Y/02nTCjN+6sTHHf/7FRBM3z9OpMBdsd+aSSBPIcqovKyhyn7mBjDctwrAig96kn86+lahMX2TNfnMk1f7rekBuomqgIaZ7GhHlv2RDSDKL90n2T8dAG6GpmUDrtgf2gDuTBr2KXmsSTRSVnchjhw42LHfSgWkD8zgkv2RPcAD/UMFPwO+f7oPq396qVrG0kyrnZYs4gIl8ARRiMMV+2PnADL909MsipSqZbxxepJ5/231U6JSHbhgP9MkcGmmhemuy4n+Xe8yi4iSlQrIs/2Zjg9gOkBDkLzan+n4AN2ZDivkuAqQFZwhz/ZbsQ4gWgEba4PebPNC5m/IJKHSfqYGMNu8UJhN2oclIUtx3X6CIAgil1gZH4D0DbmHA2bds0lfvr5V8QFIX76+VfEBZOkvzJ/1xhcXAACjTw9zd5u22x/EioUgWdQnGx4AjC8uCFV8HlHSAOK8VP1KUFkBYfoL82c9AFj76E7lFW86PoA29/AgrO7Ju9esBQCMyhJm1Fdd8Sbc02Xoa40PUJ9seDK7X9NewE7qp3l/fX2y4flDgAl9GeRNX2sTUtX924DOOQgPwg2A1z1Zdvdv2j8/Sd9/ltBncOgQ3vnsTdQnG56MMjDqHm7aPZv05elrGQL+Wpz2AOC/f//Q1v0/tWdPexw8P7YfALB6TZ/R7jeLQ6DWOUDWxj/d+KuPWYK5QtK4J/s9QJozkFe/w5VbQg+QZmY/debztr7oQpiq8k/0C+j2NOV5f32wGxZBVH9ppiXFKzit/YGHOtvlwDMMyC7/sMfDcxkiJlhoJqN0hJ2144sLmRoKnLoZlAWydhOKuwHwvL9eRXAGVn1V/vm26DfAVv6JDUC0EofvFsDdLlh4LmA6woet+mHlHzYcJnZHYXFugORJCLCS+TTjcB70g1cBWdPP5SSQWOHC8QOx25kaQPD99UE/eZbjZGC7/uo1fYU0axBp9AeHDuHY/GUcm7+MsDuxsQ1Ax/vrSV+9/idvHY3cFtsqTbtnk756/UzHByB99fqZjg9A+ur16SqAIAiCIAjCAtI+Vt8NxQewUP/F+keRjeDM6HsFniePuW8HJ/mnA8DVK1PKCoL072jseOahnm3nLt3A5i39XI+dU3wAAf1bz9ZCPw+//poWfZ/nH3+i/YnbLw4n4wPIIOoMlIksJ5I4aCEoBVFnoCxkVH7SpFF7fAAduKI/8dOPifpJjUh7fAAZ+GNtGL9/8aWWPJhG1nCjNT6ATHSMwUlEnYGq8Rt5d/mLnIBccwDTr2/39X3CxmBd+ucu3ej56NKXWf7kFyDAsa1l1EbGetyxayNjwFa7XiEvfBVg2j/fNCrtZ1nudTo+gI+pMVi1/Ukzd63xAcIcFFkIOiZ2OUpyEaWfNOFTrZ9EFvXDFpasnAN8cN8/7e8meyDbCOtZhBrA3iMTgf8mIvdTBenL0xdqAKVqOdE/XyWkL0+f+b2BvMgsBNJXp594GRicvJSqZSZ3q+4ADWmcM0lfrT5Txiq1AW+4b1XP70H/9G/O/dazPeCenArSV6dPt4Mdh+IDOK5PPYDjMF0F+P7pPq1r15kSL1XLUmbDpK9On+IDOK5P8QEc16f4AI7rU3wAx/XpKoAgXOZ/ep9w4TG5bskAAAAASUVORK5CYII=","characters/cultivator_attack_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w9OuYknF/yfeHIBPIrIigJs4CsLC16LYSBcXIKBgYGBIR/KpygEvrKwwDExYOLJBf9XvnzBIKHgAc+uJDng7pljjF9ZWBgOzipj+MrCwnBmWhEKRpYjFlAtCogB6MHPwEBBFJyZVkSUGAxgC34GBjJD4MbFy3C2hr4uOUZQ5gBSwduXF/8zMDAw/P7+HCX4GRjoXBChBz8DAwm1ISnlOwzcPXOMkYEBEQLC4voY9uGNAmUTq/986opw/qeb9xlg/D1tOShqXaqmoPA/3bzPYBgdTdDRw7MuIAWQnAuCON4wMDAwMExramBwd5PHEIeBBQyQaKDYAcQYgg0k6PMyLLj4GZYQcaYFgrkAlvqREyMDA+FEyMCAcDwsN2ADQyMN8KkrMigqScH59+89I8pwPnVFglGINwTIKXxINQdvGqCWAxgYcKcDootiD98ArI7ZsXkDIzHyuABRaUDFxBpnSOCTIwYMeC4YcAAAwXyVItoIoM8AAAAASUVORK5CYII=","characters/cultivator_attack_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABlUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixHCBFw92/F/58gX5DiAXTDy54D8DAwPDypcvGPLNExhp5gDuP38wxF482PGfgYGBQULBAyWhUs0BX1lYsFoMA+gWU8UBX1noGoMQoGxi9f/9qTX/YTQyRpYj1jySywFqA7IdcGZaEVFihABZkXjj4mU4W0NflxwjKHMAMcAwOhqeDvb0lTEwMDAwCIvrY+SEAU8DRIcAcsqOmbkbSWY3FtVUcoCyidV/PnVFOP/TzfsMMP6ethwUtS5VU1DUfbpJXN1AkyhAdvTdM8fwthGGThqAgSCONwwMDAwM05oaGNzd5DHE4UCfl2HBxc+UO4DYuCQXEGzDwVI/crwyMOBPhDAAczy+dDA00gCfuiKDopIUnH//3jOiDOdTVyQYhXhDgJRqlVxz8KYBajmAgQF3OiC6I+HhG4DVMTs2b2AkRh4XICoNqJhY4wwJfHLEgAHPBQMOADHpjpx0etPjAAAAAElFTkSuQmCC","characters/cultivator_attack_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABvElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5dEuELx7s+P/iwQ4Mh5FccimbWP0/M60IrxqTrD4GBgYGBj51RbjYp5v3GfKmpjEwMDAw5JsnwO0lKxJvXLwMZ2vo65JjBBzQNRWFi0swMDAwMOQPlANWvnyBIUZ0GiAlZaODU1unMzAwMDAIi+szTjy54D8DAyId4A0BZROr/+gJCcbf05aDotalagoK/9PN+wx3zxyDeRDuePRooGk2xBZqK1++QIkKuhdlyFmQLAcEcbxhYGBgYJjW1MDg7iaPIQ4H+rwMCy5+JmgeQQd8uklePU8swOuAu2eOMcLiEZb41v2AyKEnwnWbUBMhBHwmmHsGvEFCVBrgU1dkUFSSgvPv33tGlOF86ooMn27eZxAW18dZ3uANAUoKH2LNwVsSUssBDAwMyIUS8Q5ABh6+AVgds2PzBkZi5HEBotKAiok1zpDAJ0cMGPBcMOAAAHPQlWYfh6tAAAAAAElFTkSuQmCC","characters/cultivator_attack_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABk0lEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccIOBi6UUAtQHTtRUrKhoG7Z44xMjAwMLx9efE/AwMDg7C4PoZ9eNOAsonVfz51RTj/0837DDD+nrYcFLUuVVNQ+J9u3mcwjI5GcbSyidV/mKNgYMCjYMAdQHI2DOJ4w8DAwMAwramBwd1NHkMcBhYwQKKBYgcQYwg2kKDPy7Dg4mdYQvzPwIBIlEQ74O6ZY4yw1A9LfOt+QOTQE+G6TaiJEAI+E8w9NE8DR9fU4ZUnygF86ooMikpScEws4FNXZLAOaWJY8uA8w5IH5xkmnlyAERp4HUBO4YMNTMqehVMOb0lILQcwMGBPgAQdgAw8fAOwOmbH5g2MxMjjAkSVAyom1jhDAp8cMWDAS8IBBwBuKY3TWC7BkgAAAABJRU5ErkJggg==","characters/cultivator_cast_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccI4h2gbGL1n09dEc7/dJO4AscwOhqeDj7dvM9w98wxrPXEgKcBsqIgZuZuJN5unOpo5gA+dUWGPW05KGIuVVPgbGKjiWgHkGIgqXoIpgHkxMOnrsiAnCBxAWQ1d88cY8SVABkYiGwRKZtY/U/Q58UQd3eTh7N37nqIIb/g4mecqR8GBjwXEAwBWLmOHvT4EiEMwNIBvlAY8BAgKhfwqSsyKCpJwfn37z0jynA+dUWCuQFvCJBSrZJrDt40QC0HMDDgTgdEdyQ8fAOwOmbH5g2MxMjjAkSlARUTa5whgU+OGDDguWDAAQAdJ4UoGMTdxAAAAABJRU5ErkJggg==","characters/cultivator_cast_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABjUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/RasmKAtnEUJxyj+evJsksshzAwMDA4GYhiiG268Rrks0hKQrunjnG+JUF4WZXbR04hoGDs8oYkNVQ1QG0AAPuALLTAAMDA8Puq1do7wBlE6v/fOqKcP6nm5ACh1CCM4yOhpeGn27eZ7h75hjWeoKsEKjh+gJna+jrkmMEZQ6ImbkbibcbpzqaOYBPXZFhT1sOiphL1RQ4GxZNVHMAKQaSqodgNkROPHzqigzICRIXQFZz98wxRlwJkIGByBaRsonV/wR9Xgxxdzd5OHvnrocY8gsufsaZ+mFgwAsigiEAa92gBz2+RAgDsHSALxQGPASIygV86ooMikpScP79e8+IMpxPXZFgbsAbAqQ0Lsk1B28aoJYDGBhwpwOiOxIevgFYHbNj8wZGYuRxAaLSgIqJNc6QwCdHDBjwXDDgAAAPinbSt4YZzQAAAABJRU5ErkJggg==","characters/cultivator_cast_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABn0lEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZPHBkhysbKJ1X/uP38YZBNDcap5PH81w1cWFoa7Z44RZTYLKQ5ABm4Wohhiu068Jtkcsh3AwMDA4KqtA2fvvnqFLDNITgPEAO4/fwbWAaQAiqKA3GBHBiTnW2UTq/8asYE45ZdYKjKYZPXRNhfALDkzrQhF3CSrj4HBsgiHLuyA7DSAbjkuMUKArBC4cfEynK2hr0uOEcQ7QNnE6j+fuiKc/+nmfaIMNoyOhhfJn27ex5kmhmY2jJm5G4m3G6c6mjmAT12RYU9bDoqYS9UUOJvYaCLaAaQYSKoegmkAOfHwqSsyICdIXABZzd0zxxjxFUpElVbKJlb/E/R5McTd3eTh7J27HmLIL7j4mWCJOOC5gGAIKJtY/WdgYMAIenyJEAZg6QBfKAx4CBCVC/jUFRkUlaTg/Pv3nhFlOJ+6IsHcgDcEYMFPKcBnDt40QC0HMDDgTgdEN0g8fAOwOmbH5g2MxMjjAkSlARUTa5whgU+OGDDguWDAAQCBv38gFJadVQAAAABJRU5ErkJggg==","characters/cultivator_cast_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABt0lEQVR4nGNgGAUkgoknF/ynpnmM5GjyntiN0xFb80sZJ55c8D/fPIEos1lItVzPwOw/AwMDg5uFKIbcrhOvGfQMzIi2nGQHKJtY/Wf48wfOd9XWgbN3X72Cou7umWNEOYIJnyS145tkB5ASlLgAIU+QnAaQAXKwIwNupGgi5AmyHbDrxGtytVLugMfzVzMwMDAwfGVB1Y7sc5oBZROr/+9PrfkPo5Exshyx5uFNhPQAWB1ATPY7M62IKDFCAGsaIJRyb1y8DGdr6OuSbClBByADZROr/3zqinD+p5v3iTLYMDoaHoqfbt5nuHvmGNY6gq5pAFvIkpUNY2buRuLtxqmOGECWA/jUFRn2tOWgiLlUTYGziY0moh1AioGk6iGYBpCrVT51RQbkBIkLIKu5e+YYI76qmajaTtnE6n+CPi+GuLubPJy9c9dDDPkFFz8zEGoXDHhJSDAEYOU6etDjS4QwAEsH+EJhwEOAqFzAp67IoKgkBeffv/eMKMP51BUJ5ga8IUBKtUquOXjTALUcwMCAOx0Q3ej08A3A6pgdmzcwEiOPCxCVBlRMrHGGBD45YsCA54IBBwBQJ6l7gzQjpAAAAABJRU5ErkJggg==","characters/cultivator_idle_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccIOBi6UUAtQHTtRUrKhoG7Z44RNB+vAmyW8qkrMjAwMDDsactBEXepmoLC/3QTs27A5iCCiRBmIS5DKdU74GmA5GwYxPGGgYGBgWFaUwODu5s8hjgMLCDSvMEfAvvyA+Fsk6w+hnU/RBgYGDAT4bpNqImQgeEzhl5sAG8IoKda5ERFCKCrxZUlCYaASVYfA5+6IoOikhSDopIUAwMDA8P9e8+IcoTTxPUMn27ex1se4A0BcgofUs0huSAiF+AKBaKLYg/fAKyO2bF5AyMx8rgAUeWAiok1zpDAJ0cMGPByYMABAPquf0nIbuU7AAAAAElFTkSuQmCC","characters/cultivator_idle_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccIOBi6UUAtQHTtRUrKhoG7Z44RNB+vAmyW8qkrMjAwMDDsactBEXepmoLC/3QTs27A5iCCiRBmIS5DKdU74GmA5GwYxPGGgYGBgWFaUwODu5s8hjgMLCDSvMEfAvvyA+Fsk6w+hnU/RBgYGDAT4bpNqImQgeEzhl5sAG8IoKda5ERFCKCrxZUlCYaASVYfA5+6IoOikhSDopIUAwMDA8P9e8+IcoTTxPUMn27ex1se4A0BcgofUs0huSAiF+AKBaKLYg/fAKyO2bF5AyMx8rgAUeWAiok1zpDAJ0cMGPByYMABAPquf0nIbuU7AAAAAElFTkSuQmCC","characters/cultivator_idle_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABdklEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5dEuEe6/vweoosh1wZloRUWIw4KzpgrWUJCsSb1y8DGdr6OuSYwQcDM9ygBRAdO1FSsqGgbtnjhE0H68CbJbyqSsyMDAwMOxpy0ERd6magsL/dBOzbsDmIIKJEGYhLkMp1TvgaYDkbBjE8YaBgYGBYVpTA4O7mzyGOAwsINK8wR8C+/ID4WyTrD6GdT9EGBgYMBPhuk2oiZCB4TOGXmwAbwigp1rkREUIoKvFlSUJhoBJVh8Dn7oig6KSFIOikhQDAwMDw/17z4hyhNPE9Qyfbt7HWx7gDQFyCh9SzSG5ICIX4AoFootiD98ArI7ZsXkDIzHyuABR5YCKiTXOkMAnRwwY8HJgwAEAScaDSZuiaOIAAAAASUVORK5CYII=","characters/cultivator_idle_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaklEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5ZEfBmWlFRInRzAHUAmRF4o2Ll+FsDX1dihww4CEw4A4guvYiJWXDwN0zxwiaj1cBNkv51BUZGBgYGPa05aCIu1RNQeF/uolZN2BzEMFECLMQl6GU6h3wNEByNgzieMPAwMDAMK2pgcHdTR5DHAYWEGne4A+BffmBcLZJVh/Duh8iDAwMmIlw3SbURMjA8BlDLzaANwTQUy1yoiIE0NXiypIEQ8Akq4+BT12RQVFJikFRSYqBgYGB4f69Z0Q5wmnieoZPN+/jLQ/whgA5hQ+p5pBcEJELcIUC0UWxh28AVsfs2LyBkRh5XICockDFxBpnSOCTIwYMeDkw4AAA0nR/SQeAfIcAAAAASUVORK5CYII=","characters/cultivator_walk_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccIOBi6UUAtQHTtRUrKhoG7Z44RNB9rGsBlGZ+6Ipy9py0HRc6lagoK/9PN+zjNQnYYzkSIbBnMMFIBzHJ8Zg14GiA6Gybo8zIwMLyB86c1NTC4u8nD+UEcb1A16PMyLLj4maC5gzcE9uUHwtkmWX0M636IoMijJ8J1m1ATIQR8xmoWMsAaAsRkH3IButk4Q0DQLISRgQGSkvnUFRkUlaTgcvfvPSPKMj51RYZPN+/DzcIG8KYBcgofUs3BG9TUcgADA+5oJTquPXwDsDpmx+YNjMTI4wJElQMqJtY4QwKfHDFgwMuBAQcAJSCBpd7cvwMAAAAASUVORK5CYII=","characters/cultivator_walk_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABTUlEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnTAQooDYOD2nftEiREDSI4CagOaOID7zx/6O+ArC1mxSV4aoNRSioCyidX/96fW/IfRyBhZjljzhm4iPDOtiCgxQoCsSLxx8TKcraGvS44RcDB0o4BagOjai5SUDQN3zxwjaD5RDsBm+am1vSh8l6opDAwMDAyfbmLWCfgcQnQi5FNXhLOxWUKu2gFPA2SXpdOaGhjc3eTh/CCONwwMDAwMC0g0Z/CHACwB7ssPhIuZZPUxZNU1oKhbt2kKlPUZQy0+QFYIICcyUuSwAaLSAJ+6IkPy5pNEG+o0cT3RavGGADmFD6nm4C2IqOUABgbchRFJHQkP3wAMB+3YvIGRkBw+QFQaUDGxxhkShOTunDmK1xEDXg4AAOxYdO9OIWbRAAAAAElFTkSuQmCC","characters/cultivator_walk_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQFNHMD95w/9HfCVhazYJC8NUGopRUDZxOr/+1Nr/sNoZIwsR6x5QzcRnplWRJQYIUBWJN64eBnO1tDXJccIOBi6UUAtQHTtRUrKhoG7Z44RNB9rGsBlGZ+6Ipy9py0HRc6lagoK/9PN+zjNQnYYzkSIbBnMMFIBzHJ8Zg14GiA6Gybo8zIwMLyB86c1NTC4u8nD+UEcb1A16PMyLLj4maC5gzcE9uUHwtkmWX0M636IoMijJ8J1m1ATIQR8xmoWMsAaAsRkH3IButk4Q0DQLISRgQGSkvnUFRkUlaTgcvfvPSPKMj51RYZPN+/DzcIG8KYBcgofUs3BG9TUcgADA+5oJTquPXwDsDpmx+YNjMTI4wJElQMqJtY4QwKfHDFgwMuBAQcAJSCBpd7cvwMAAAAASUVORK5CYII=","characters/cultivator_walk_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABTUlEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnTAQooDYOD2nftEiREDSI4CagOaOID7zx/6O+ArC1mxSV4aoNRSioCyidX/96fW/IfRyBhZjljzhm4iPDOtiCgxQoCsSLxx8TKcraGvS44RcDB0o4BagOjai5SUDQN3zxwjaD5RDsBm+am1vSh8l6opDAwMDAyfbmLWCfgcQnQi5FNXhLOxWUKu2gFPA2SXpdOaGhjc3eTh/CCONwwMDAwMC0g0Z/CHACwB7ssPhIuZZPUxZNU1oKhbt2kKlPUZQy0+QFYIICcyUuSwAaLSAJ+6IkPy5pNEG+o0cT3RavGGADmFD6nm4C2IqOUABgbchRFJHQkP3wAMB+3YvIGRkBw+QFQaUDGxxhkShOTunDmK1xEDXg4AAOxYdO9OIWbRAAAAAElFTkSuQmCC","characters/moyu_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABXElEQVR4nGNgGAUDDBiJVViR3PifVMM75tYTNJ+JVEOpDQbcAURHAQMDA4OyidV/7j9/CKr7ysLCcPfMMaLMHvAQoIkDiAklqjvgKwsLWfrI00WhpRQBZROr/7e3LfwPo5Exshyx5g3dRLijKZ0oMUKArEh88/QenC0irUSOEXAwdKOAWoDoopiUlA0DxBTHeBVgs9RZTouBgYGBob0/GUW8snAuCn/vo2tEOYhgIoRZiMtQSvUOeBogORvKCj5mYGBgYJjW1MDg7iaPIQ4Hj4gzb/CHQGmKLZy9t+4aw+P3sgwMDJiJ8PFK1ETIwHANQy82gDcE0FMtcqIiBNDV4sqSBEPAo24mg7OcFsMbbUEGBm1BBgYGBgaRq++JckT3nMMMex9dw1se4A0BcgofUs0huSAiF+AKBaKLYg/fAKyO2bF5AyMx8rgAUeWAiok1zpDAJ0cMGPByYMABAK70eRBv8vpHAAAAAElFTkSuQmCC","characters/moyu_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABXUlEQVR4nGNgGAUDDBiJVViR3PifVMM75tYTNJ+JVEOpDQbcAURHAQMDA4OyidV/7j9/GFRVFDHkNJRlGDbvPMzAwMDA8JWFheHumWNEmc1CigNg4Pad+0SJEQMGPApo4gDuP3/o74CvLGTFJnlpgFJLKQLKJlb/b29b+B9GI2NkOWLNG7qJcEdTOlFihABZkfjm6T04W0RaiRwj4GDoRgG1ANF1ASkpGwaIqQ+IcgA2y0+t7UXhVxbOZWBgYGDY++gaSQ4hOhE6y2nB2dgsIVftgKcBssvSaU0NDO5u8nC+rOBjCOMRaeYM/hCAJcDSFFu42N66awxZdQ0o6h6vnAtlXcNQiw+QFQLIiYwUOWyAqDTgLKfFUH78CpwvQkB995zDRDsAbwiQU/iQag7egohaDmBgwF0YkdQs9/ANwHDQjs0bGAnJ4QNEpQEVE2ucIUFI7s6Zo3gdMeDlAADtzHeFQRiKEAAAAABJRU5ErkJggg==","characters/moyu_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaklEQVR4nGNgGAUDDBiJVViR3PifVMM75tYTNJ+JVEOpDQbcAURHAQMDA4OyidV/7j9/CKr7ysLCcPfMMaLMHvAQoIkDiAklqjvgKwsLWfrI00WhpRQBZROr/7e3LfwPo5Exshyx5tEtEe69vgero8h2wI6mdKLEYMBZ0wVrtiQrEt88vQdni0grkWMEHAzPcoAUQHRRTErKhgFiimO8CrBZ6iynxcDAwMDQ3p+MIl5ZOBeFv/fRNaIcRDARwizEZSilegc8DZCcDWUFHzMwMDAwTGtqYHB3k8cQh4NHxJk3+EOgNMUWzt5bd43h8XtZBgYGzET4eCVqImRguIahFxvAGwLoqRY5UREC6GpxZUmCIeBRN5PBWU6L4Y22IAODtiADAwMDg8jV90Q5onvOYYa9j67hLQ/whgA5hQ+p5pBcEJELcIUC0UWxh28AVsfs2LyBkRh5XICockDFxBpnSOCTIwYMeDkw4AAA/f19EI/ZELsAAAAASUVORK5CYII=","characters/moyu_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABXUlEQVR4nGNgGAUDDBiJVViR3PifVMM75tYTNJ+JVEOpDQbcAURHAQMDA4OyidV/7j9/GFRVFDHkNJRlGDbvPMzAwMDA8JWFheHumWNEmc1CigNg4Pad+0SJEQMGPApo4gDuP3/o74CvLGTFJnlpgFJLKQLKJlb/b29b+B9GI2NkOWLNG7qJcEdTOlFihABZkfjm6T04W0RaiRwj4GDoRgG1ANF1ASkpGwaIqQ+IcgA2y0+t7UXhVxbOZWBgYGDY++gaSQ4hOhE6y2nB2dgsIVftgKcBssvSaU0NDO5u8nC+rOBjCOMRaeYM/hCAJcDSFFu42N66awxZdQ0o6h6vnAtlXcNQiw+QFQLIiYwUOWyAqDTgLKfFUH78CpwvQkB995zDRDsAbwiQU/iQag7egohaDmBgwF0YkdQs9/ANwHDQjs0bGAnJ4QNEpQEVE2ucIUFI7s6Zo3gdMeDlAADtzHeFQRiKEAAAAABJRU5ErkJggg==","characters/qingwu_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABkElEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZPHBlgIKbh5fC3cQK/cXgaGP3+wqtNQlmG4fec+AwMDA4OyidX/bZOL4XLqlsE4Q4agA7ABmEWExIgBJEcBtQFNHMCNI5qwAZJSrbKJ1X9chn9lYUGx+NKFU0SZTVYaQLaU7kDZxOr/o51L/sNoZIwsR6x5QzcR7m/NIkqMECArEp8+ug1nS8upkmMEHAzdKKAWILocICVlw8DdM8cImo9XATZLHd2VGBgYGBg607JRxMtnTUXh7995jygHEUyEMAtxGUqp3gFPAyRnQ/kXrxkYGBgYpjU1MLi7yWOIkwoGfwjU2XnA2ft3TmN4KCHKwMCAmQgfXkJNhAwXP2PoxQbwhgB6qkVOVIQAulpcWZJwLqiexuDorsTwjkmSgYFJkoGBgYFB6N9zohzRdGgHw/6d9/CWB3hDgJzCh1RzSC6IyAW4QoHootjDNwCrY3Zs3sBIjDwuQFQ5oGJijTMk8MkRAwa8HBhwAADjsZLOdbjCOQAAAABJRU5ErkJggg==","characters/qingwu_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABb0lEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4LIQU3j6+FW6ZuGcyoZ2CG1XIGBgYGmNylC6cY0fXh0sNEvFsZGJRNrHBarqEsQ5Q6dEAwBLCB23fuEyVGDCApBGgBSEo0yiZW/7n//CFK7aULp4gym2oh8JWFrNgkLw1QailFQNnE6v+jnUv+w2hkjCxHrHkDngjJdsD+1iyixAgBsiLx6aPbcLa0nCo5RsDB0I0CagGiCyJSUjYM3D1zjKD5RDkAm+Wn1vai8MtnTWVgYGBg2L/zHkkOIToROrorwdnYLCFX7YCnAbLL0mlNDQzubvJwvvyL12SZM/hDAJYA6+w84GL7d05jyKprQFH38BIkETJc/IyhFh8gKwSQExkpctgAUWnA0V2JoeDIRThfiID6pkM7iHYA3hAgp/Ah1Ry8BRG1HMDAgLswIqlN6OEbgOGgHZs3MBKSwweISgMqJtY4Q4KQ3J0zR/E6YsDLAQCrHIRGhkAo2AAAAABJRU5ErkJggg==","characters/qingwu_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABnklEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZPHBlgIKbh5fC3cQK/cXgaGP3+wqtNQlmG4fec+AwMDA4OyidX/bZOL4XLqlsE4Q4agA7ABmEWExIgBJEcBtQFNHMCNI5qwAZJSrbKJ1X9chn9lYUGx+NKFU0SZTVYaQLaU7kDZxOr/o51L/sNoZIwsR6x5dEuEe6/vweoosh2wvzWLKDEYcNZ0wZomyIrEp49uw9nScqrkGAEHw7McIAUQXQ6QkrJh4O6ZYwTNx6sAm6WO7koMDAwMDJ1p2Sji5bOmovD377xHlIMIJkKYhbgMpVTvgKcBkrOh/IvXDAwMDAzTmhoY3N3kMcRJBYM/BOrsPODs/TunMTyUEGVgYMBMhA8voSZChoufMfRiA3hDAD3VIicqQgBdLa4sSTgXVE9jcHRXYnjHJMnAwCTJwMDAwCD07zlRjmg6tINh/857eMsDvCFATuFDqjkkF0TkAlyhQHRR7OEbgNUxOzZvYCRGHhcgqhxQMbHGGRL45IgBA14ODDgAADLJls7liS9hAAAAAElFTkSuQmCC","characters/qingwu_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABb0lEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4LIQU3j6+FW6ZuGcyoZ2CG1XIGBgYGmNylC6cY0fXh0sNEvFsZGJRNrHBarqEsQ5Q6dEAwBLCB23fuEyVGDCApBGgBSEo0yiZW/7n//CFK7aULp4gym2oh8JWFrNgkLw1QailFQNnE6v+jnUv+w2hkjCxHrHkDngjJdsD+1iyixAgBsiLx6aPbcLa0nCo5RsDB0I0CagGiCyJSUjYM3D1zjKD5RDkAm+Wn1vai8MtnTWVgYGBg2L/zHkkOIToROrorwdnYLCFX7YCnAbLL0mlNDQzubvJwvvyL12SZM/hDAJYA6+w84GL7d05jyKprQFH38BIkETJc/IyhFh8gKwSQExkpctgAUWnA0V2JoeDIRThfiID6pkM7iHYA3hAgp/Ah1Ry8BRG1HMDAgLswIqlN6OEbgOGgHZs3MBKSwweISgMqJtY4Q4KQ3J0zR/E6YsDLAQCrHIRGhkAo2AAAAABJRU5ErkJggg==","characters/shennong_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaUlEQVR4nGNgGOmAkVQNixZU/CdGXVxCB1FmM5FieVN1AFGWk6KWhRQHMDAwMDy4fYNULXgBSSFAC0BSGlA2sfrP/ecPQXVfWVgY7p45Rv00QAtAEwcQE0pUd8BXFpLTMwMDAxm5gBqWUgSUTaz+39w89T+MRsbIcsSaN3QT4bb6aKLECAGyIvHdi1dwtpCEGDlGwMHQjQJqAaKLYlJSNgwQUxzjVYDN0nJHYQYGBgaG4JwqFPG1U9pQ+J373xLlIIKJEGYhLkMp1TvgaYDkbPjy3S8GBgYGhmlNDQzubvIY4qSCwR8C9nYecHbn/qUM4kJsDAwMmIlQ/AxqIsSmFxvAGwLoqRY5UREC6GpxZUmCIeDVuJSh3FGYYQeHBgMDhwYDAwMDg8cP4hqmBw/tYOjc/xZveYA3BMgpfEg1h+SCiFyAKxSILoo9fLF3NHZs3sBIjDwuQFQ5oGJijTMk8MkRAwa8HBhwAAAWlX6rOhAyNQAAAABJRU5ErkJggg==","characters/shennong_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABcUlEQVR4nGNgGOmAkVQNixZU/CdGXVxCB1FmM5FieVN1AFGWk6KWhRQHMDAwMDy4fYNULXgBSSFAC0BSGlA2sfrP/ecPg6qKIoachrIMw+adhxkYGBgYvrKwMNw9c4wos0mOAgYGBobbd+4TJUYMGPAooIkDuP/8ob8DvrKQFZvkpQFKLaUIKJtY/b+5eep/GI2MkeWINW/oJsJt9dFEiRECZEXiuxev4GwhCTFyjICDoRsF1AJE1wWkpGwYIKY+IMoB2Cw/tbYXhb92ShsDAwMDQ+f+tyQ5hOhEWO4oDGdjs4RctQOeBsguS6c1NTC4u8nD+S/f/SLLnMEfArAEaG/nARfr3L+UIauuAUWd+Jk2OBtdLT5AVgggJzJS5LABotJAuaMwQ+WpB3C+B26lDAwMDAwHD+0g2gF4Q4CcwodUc/AWRNRyAAMD7sKIpGa5hy9mb2fH5g2MhOTwAaLSgIqJNc6QICR358xRvI4Y8HIAAKKRfeAZSpCDAAAAAElFTkSuQmCC","characters/shennong_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABd0lEQVR4nGNgGOmAkVQNixZU/CdGXVxCB1FmM5FieVN1AFGWk6KWhRQHMDAwMDy4fYNULXgBSSFAC0BSGlA2sfrP/ecPQXVfWVgY7p45Rv00QAtAEwcQE0pUd8BXFpLTMwMDAxm5gBqWUgSUTaz+39w89T+MRsbIcsSaR7dEuPf6HqyOItsB2+qjiRKDAWdNF6zZkqxIfPfiFZwtJCFGjhFwMDzLAVIA0UUxKSkbBogpjvEqwGZpuaMwAwMDA0NwThWK+NopbSj8zv1viXIQwUQIsxCXoZTqHfA0QHI2fPnuFwMDAwPDtKYGBnc3eQxxUsHgDwF7Ow84u3P/UgZxITYGBgbMRCh+BjURYtOLDeANAfRUi5yoCAF0tbiyJMEQ8GpcylDuKMywg0ODgYFDg4GBgYHB4wdxDdODh3YwdO5/i7c8wBsC5BQ+pJpDckFELsAVCkQXxR6+2DsaOzZvYCRGHhcgqhxQMbHGGRL45IgBA14ODDgAAGWegqui39tfAAAAAElFTkSuQmCC","characters/shennong_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABcUlEQVR4nGNgGOmAkVQNixZU/CdGXVxCB1FmM5FieVN1AFGWk6KWhRQHMDAwMDy4fYNULXgBSSFAC0BSGlA2sfrP/ecPg6qKIoachrIMw+adhxkYGBgYvrKwMNw9c4wos0mOAgYGBobbd+4TJUYMGPAooIkDuP/8ob8DvrKQFZvkpQFKLaUIKJtY/b+5eep/GI2MkeWINW/oJsJt9dFEiRECZEXiuxev4GwhCTFyjICDoRsF1AJE1wWkpGwYIKY+IMoB2Cw/tbYXhb92ShsDAwMDQ+f+tyQ5hOhEWO4oDGdjs4RctQOeBsguS6c1NTC4u8nD+S/f/SLLnMEfArAEaG/nARfr3L+UIauuAUWd+Jk2OBtdLT5AVgggJzJS5LABotJAuaMwQ+WpB3C+B26lDAwMDAwHD+0g2gF4Q4CcwodUc/AWRNRyAAMD7sKIpGa5hy9mb2fH5g2MhOTwAaLSgIqJNc6QICR358xRvI4Y8HIAAKKRfeAZSpCDAAAAAElFTkSuQmCC","characters/tiebai_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABfUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixKjmgK0ru+E+qmxfTZZFuADJaYAYwP3nD/0d8JWFrNgkLRsqm1j9R/YduqXIcpcunCIrixPliJeHF/2H0cgYWY5Y82iSBkgBZDvgWH8GUWKEAFkp596Nu3C2koYyOUbAwdCNAmoBorMKKSkbBu6eOUbQfLwKsFnqbgaJ8+byLBTx2s5pKPydp+4yoANsDiKYCGEW4jKUUr0DngZIzoaSP18xMDAwMExramBwd5PHECcVDP4QqI90hbN3nrrL8JxdjIGBATMRPj+ImggZGD5j6MUG8IYAeqpFTlSEALpaXFmSYAhYFc5gcDdTZnghLMHAICzBwMDAwCDx9gVRjmhcvpth56m7eMsDvCFATuFDqjkkF0TkAlyhQHRR7OEbgNUxOzZvYCRGHhcgqhxQMbHGGRL45IgBA14ODDgAAJgPjbzi3bjYAAAAAElFTkSuQmCC","characters/tiebai_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYklEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnRAVJBtXdkNN7CyfTVB9V9ZWBjunjlGlNkkRwG1AU0cwP3nD9FqSUq1yiZW/3EZ/pWFBcXiSxdOEWU2CykOwGYp3YGyidX/l4cX/YfRyBhZjljzhm4iPNafQZQYIUBWJN67cRfOVtJQJscIOBi6UUAtQHQ5QErKhgFiimOiHIDN8lNre1H4tZ3TGBgYGBh2nrqLrhSvQ4hOhO5miMSGzRJy1Q54GiC7LJ3W1MDg7iYP50v+fEWWOYM/BGAJsD7SFS6289Rdhqy6BhR1zw9Og7I+Y6jFB8gKAeRERoocNkBUGnA3U2bI3HUZzpcgoL5x+W6iHYA3BMgpfEg1B29BRC0HMDDgLoxIapJ5+AZgOGjH5g2MhOTwAaLSgIqJNc6QICR358xRvI4Y8HIAAHNdgn7QErApAAAAAElFTkSuQmCC","characters/tiebai_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABiUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixKjmgK0ru+E+qmxfTZZFuADJaYAYwP3nD/0d8JWFrNgkLRsqm1j9R/YduqXIcpcunCIrixPliJeHF/2H0cgYWY5Y82iSBrCBvdf3YHUU2Q441p9BlBgMOGu6YI0SslLOvRt34WwlDWVyjIADukXBoHUA0VmFlJQNA3fPHCNoPl4F2Cx1N4PEeXN5Fop4bec0FP7OU3cZ0AE2BxFMhDALcRlKqd4BTwMkZ0PJn68YGBgYGKY1NTC4u8ljiJMKBn8I1Ee6wtk7T91leM4uxsDAgJkInx9ETYQMDJ8x9GIDeEMAPdUiJypCAF0trixJMASsCmcwuJspM7wQlmBgEJZgYGBgYJB4+4IoRzQu382w89RdvOUB3hAgp/Ah1RySCyJyAa5QILoo9vANwOqYHZs3MBIjjwsQVQ6omFjjDAl8csSAAS8HBhwAAOcYkbz39oybAAAAAElFTkSuQmCC","characters/tiebai_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYklEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnRAVJBtXdkNN7CyfTVB9V9ZWBjunjlGlNkkRwG1AU0cwP3nD9FqSUq1yiZW/3EZ/pWFBcXiSxdOEWU2CykOwGYp3YGyidX/l4cX/YfRyBhZjljzhm4iPNafQZQYIUBWJN67cRfOVtJQJscIOBi6UUAtQHQ5QErKhgFiimOiHIDN8lNre1H4tZ3TGBgYGBh2nrqLrhSvQ4hOhO5miMSGzRJy1Q54GiC7LJ3W1MDg7iYP50v+fEWWOYM/BGAJsD7SFS6289Rdhqy6BhR1zw9Og7I+Y6jFB8gKAeRERoocNkBUGnA3U2bI3HUZzpcgoL5x+W6iHYA3BMgpfEg1B29BRC0HMDDgLoxIapJ5+AZgOGjH5g2MhOTwAaLSgIqJNc6QICR358xRvI4Y8HIAAHNdgn7QErApAAAAAElFTkSuQmCC","characters/yuchi_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABi0lEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQHBEKjdtBEenMuaOokylPvPH6IdQLUQ+MpCVmySlwYotRQZkBQCd88cY/zKwsKwqSWB4SsLC8PehhgUjCxHEwfQAhB0arOfP9bSbW9DDFFiFDsAG3j+/CWcLSkpTo4RcDDgUTDgDiC69iKlfIeBu2eOETQfrwJslipZWDAwMDAwrCgNRRGP6F6Nwr934gRRDiKYCGEW4jKUUr0DngZIzoZ2368yMDAwMExrusrg7iaPJP4QRd09Is0b/CEw20MFznY+cYLhEKc2AwMDZiI8dBg1ETIwnMDQiw3gDQH0VIucqAgBdLW4siTBEHBuWMKgZGHBwCvIzMAryMzAwMDA8Pn9X6IckbrjDsO9Eyfwlgd4Q4CcwodUc0guiMgFuEKB6KLYwzcAq2N2bN7ASIw8LkBUOaBiYo0zJPDJEQMGvBwYcAAA1Gx8bG9HA2kAAAAASUVORK5CYII=","characters/yuchi_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbElEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnTAQooDYOD2nftEiVHFAbWbNsJ9s6ypkyxL8AGS0wAxgPvPH/o74CsLWbFJXhqg1FJkQFII3D1zjPErCwvDppYEhq8sLAx7G2JQMLIcsYCgymY/f7IKK2IB2Wlgb0MMUWKEAFmR+Pz5SzhbUlKcHCPggCbZcEg5gOgERkr5DgN3zxwjaD5RDsBm+am1vSj8iO7VDAwMDAz3TpwgySFEJ0IlCws4G5sl5Kod8DRAdlk6ramBwd1NHs63+/6QgYGBgeEeieYM/hCAJcDZHipwMecTJxiy6hpQ1B06vBrKOoGhFh8gKwSQExkpctgAUWlAycKCoegk8U2u1B13iFaLNwTIKXxINQdvQUQtBzAw4C6MSKrrPXwDMBy0Y/MGRkJy+ABRaUDFxBpnSBCSu3PmKF5HDHg5AADoeHJxy40AeQAAAABJRU5ErkJggg==","characters/yuchi_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABlUlEQVR4nGNgGAUDDBjJ0RQcEv4fm/jaNStJNo+JVA16BmZYLYfJ4ZOn2AHKJlY4DddQliFKHTpgIcUBMHD7zn2ixIgBJEcBtQHBEKjdtBEenMuaOokylPvPH6IdQLUQ+MpCVmySlwYotRQZkBQCd88cY/zKwsKwqSWB4SsLC8PehhgUjCxHEwdQAvZe34M1a5JccimbWP3f2xCDV41zwxKGu2eOEWU2WZH4/PlLOFtSUpwcI+BgwMuBAXcA0WmAlPIdBohJB3gVYLNUycKCgYGBgWFFaSiKeET3ahT+vRMniHIQwUQIsxCXoZTqHfA0QHI2tPt+lYGBgYFhWtNVBnc3eSTxhyjq7hFp3uAPgdkeKnC284kTDIc4tRkYGDAT4aHDqImQgeEEhl5sAG8IoKda5ERFCKCrxZUlCYaAc8MSBiULCwZeQWYGXkFmBgYGBobP7/8S5YjUHXcY7p04gbc8wBsC5BQ+pJpDckFELsAVCkQXxR6+AVgds2PzBkZi5HEBosoBFRNrnCGBT44YMODlwIADAFUwgmWhzyb2AAAAAElFTkSuQmCC","characters/yuchi_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbElEQVR4nGNgGAUjHTCSoyk4JPw/NvG1a1aSbB4TqRr0DMywWg6TwydPsQOUTaxwGq6hLEOUOnTAQooDYOD2nftEiVHFAbWbNsJ9s6ypkyxL8AGS0wAxgPvPH/o74CsLWbFJXhqg1FJkQFII3D1zjPErCwvDppYEhq8sLAx7G2JQMLIcsYCgymY/f7IKK2IB2Wlgb0MMUWKEAFmR+Pz5SzhbUlKcHCPggCbZcEg5gOgERkr5DgN3zxwjaD5RDsBm+am1vSj8iO7VDAwMDAz3TpwgySFEJ0IlCws4G5sl5Kod8DRAdlk6ramBwd1NHs63+/6QgYGBgeEeieYM/hCAJcDZHipwMecTJxiy6hpQ1B06vBrKOoGhFh8gKwSQExkpctgAUWlAycKCoegk8U2u1B13iFaLNwTIKXxINQdvQUQtBzAw4C6MSKrrPXwDMBy0Y/MGRkJy+ABRaUDFxBpnSBCSu3PmKF5HDHg5AADoeHJxy40AeQAAAABJRU5ErkJggg==","crops/bloodginseng_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/bloodginseng_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/bloodginseng_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABR0lEQVR4nGNgGAWjYIABIzGK1mam/mdgYGBwrPJm2N+2lYGBgYEhePpsRmLl8QEmbILZ03L/YxOHGb5PlwOrYTB5UgALLgmYI6ZmTcbqE5i8kgQ3A8Putzgt6F1X8b84qANnaOCUQA4Fp8s/MOSRQwGb/ANXYTgbnwOwRgE+y8gBvesqsEYpAwOeKMDlCCUJbgYFtCCHyU3NmsyIzTKyogAZoCdK9CBHDiElCW6iLWdgIDIKcCVEZAehW0yM5QwMJEQBMsAV5MiOIMZyBgYiowAZ9K6r+H/vxVc4n1yfk+0AZJA9Lfc/Ob6mKuhdV/EfXzajKggsj/0fWB77H5mPbDm6PDGAqFyADxw5+ZQi/RQ7gFIw6oBRB4w6YNQBA+4AnLVXQZgdRpn+UFGegYGBgUH+/kOi+MhgwqpDWO0iqUGCbjAh/pAAAEI5fuPw/tMHAAAAAElFTkSuQmCC","crops/dewleaf_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/dewleaf_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/dewleaf_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQ0lEQVR4nGNgGAWjYIABIzGKOnZU/mdgYGBI0zZnmHX1JAMDAwNDhUc7I7Hy+AATNsHsabn/sYnDDH987wtWw2DypAAWXBIwR0zNmozVJzB5JQluht94LOhdV/G/OKgDZ2jglEAOBVklHgx55FDAJs/6DRGI+ByANQrwWUYO6F1XgTVKiXYAzBGP731B8Rm6XIVHOyPrt/8YasiKAmSAnijRgxw5hJQkuIm2nIGByBDAlRCRHYRuMTGWE+0AdIAryJEdQYzlDAxERgEy6F1X8f/ei69wPrk+J9sByCB7Wu5/cnxNVdC7ruI/vmxGVRBYHvs/sDz2PzIf2XJ0eWIAWYkQGRw5+ZQi/RQ7gFIw6oBRB4w6YNQBA+4AnLVXQZgdRpn+UFGegYGBgUH+/kOi+MhgwqpDWO3C2SzHBtANJsQfEgAAtPOOsDmAYLoAAAAASUVORK5CYII=","crops/flamebud_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/flamebud_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/flamebud_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRElEQVR4nGNgGAWjYIABIzGKTrdE/mdgYGBQjg9nuLtwJQMDAwODac1yRmLl8QEmbILZ03L/YxOHGb5ASASrYTB5UgALLgmYI6ZmTcbqE5i8kgQ3A8O1hzgt6F1X8b84qANnaOCUQA6FhHdvMOSRQwGb/CEteTgbnwOwRgE+y8gBvesqsEYpAwOeKMDlCCUJbgY7tCCHyU3NmsyIzTKyogAZoCdK9CBHDiElCW6iLWdgIDIKcCVEZAehW0yM5QwMJEQBMsAV5MiOIMZyBgYiowAZ9K6r+H/vxVc4n1yfk+0AZJA9Lfc/Ob6mKuhdV/EfXzajKggsj/0fWB77H5mPbDm6PDGAqFyADxw5+ZQi/RQ7gFIw6oBRB4w6YNQBA+4AnLVXQZgdRpn+UBHS0JS//5AoPjKYsOoQVrtIapCgG0yIPyQAAHP5fsXq99tuAAAAAElFTkSuQmCC","crops/frostroot_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/frostroot_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/frostroot_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQ0lEQVR4nGNgGAWjYIABIzGKFpy6+J+BgYHBT/I+w6bnigwMDAwMCWb6jMTK4wNM2ASzp+X+xyYOM/z0mTlYDYPJkwJYcEnAHDE1azJWn8DklSS48VrQu67if3FQB87QwCmBHAqmJikY8sihgE3+7ZPlcDY+B2CNAnyWkQN611VgjVIGBjxRgMsRShLcDMIykVjlpmZNZsRmGVlRgAzQEyV6kCOHEHqawGc5AwORUYArISI7CFtiJGQ5AwMJUYAMcAU5siOIsZyBgcgoQAa96yr+33vxFc4n1+dkOwAZZE/L/U+Or6kKetdV/MeXzagKAstj/weWx/5H5iNbji5PDCAqF+ADR04+pUg/xQ6gFIw6YNQBow4YdcCAOwBn7VUQZodRpj9UlGdgYGBgkL//kCg+Mpiw6hBWu0hqkKAbTIg/JAAAtheAe8jN0lcAAAAASUVORK5CYII=","crops/goldblossom_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/goldblossom_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/goldblossom_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRUlEQVR4nGNgGAWjYIABIzGKLm+I/8/AwMAgbRzI8PTsegYGBgYG3YCFjMTK4wNM2ASzp+X+xyYOM3zGMz6shsHkSQEsuCRgjpiaNRmrT2DyShLcDAwMz3Fa0Luu4n9xUAfO0MApgRwKGVKfMOSRQwGb/K5/knA2PgdgjQJ8lpEDetdVYI1Soh0Ac8SMZ3woPkOX0w1YyLjrnySGGrKiABmgJ0r0IEcOIUiaIM5yBgYiQwBXQkR2ELrFxFhOtAPQAa4gR3YEMZYzMBAZBcigd13F/3svvsL55PqcbAcgg+xpuf/J8TVVQe+6iv/4shlVQWB57P/A8tj/yHxky9HliQFkJUJkcOTkU4r0U+wASsGoA0YdMOqAUQcMuANw1l4FYXYYZfpDRXkGBgYGBvn7D4niI4MJqw5htQtnsxwbQDeYEH9IAACOHoawdEidawAAAABJRU5ErkJggg==","crops/moonorchid_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/moonorchid_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/moonorchid_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQ0lEQVR4nGNgGAWjYIABIzGKDhy9+5+BgYFBT+4yw6VHugwMDAwMDtbKjMTK4wNM2ASzp+X+xyYOM3z1xQlYDYPJkwJYcEnAHDE1azJWn8DklSS48VrQu67if3FQB87QwCmBHAqh+gUY8sihgE3+7MvZcDY+B2CNAnyWkQN611VgjVIGBjxRgMsRShLcDMbiqVjlpmZNZsRmGVlRgAzQEyV6kCOHEHqawGc5AwORUYArISI7CFtiJGQ5AwMJUYAMcAU5siOIsZyBgcgoQAa96yr+33vxFc4n1+dkOwAZZE/L/U+Or6kKetdV/MeXzagKAstj/weWx/5H5iNbji5PDCAqF+ADR04+pUg/xQ6gFIw6YNQBow4YdcCAOwBn7VUQZodRpj9UlGdgYGBgkL//kCg+Mpiw6hBWu0hqkKAbTIg/JAAAYySAVPLPGUQAAAAASUVORK5CYII=","crops/shadowvine_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/shadowvine_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/shadowvine_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVR4nGNgGAWjYIABIzGKWpoW/mdgYGDISuRnmDb/IwMDAwNDTV08I7Hy+AATNsHsabn/sYnDDH8ucgarYTB5UgALLgmYI6ZmTcbqE5i8kgQ3w/cruC3oXVfxvzioA2do4JRADgXJNyYY8sihgE2eU+c6nI3PAVijAJ9l5IDedRVYo5SBAU8U4HIEJMg1scpNzZrMiM0ysqIAGaAnSvQgRw4hJQluoi1nYCAyCnAlRGQHoVtMjOVEOwAdPBc5w/Bc5AxDTV08I6fOdXiCQ3YEMZYzMBAZBcigd13F/3svvsL55PqcbAcgg+xpuf/J8TVVQe+6iv/4shlVQWB57P/A8tj/yHxky9HliQFkJUJkcOTkU4r0U+wASsGoA0YdMOqAUQcMuANw1l4FYXYYZfpDRXkGBgYGBvn7D4niI4MJqw5htYvoNiE2gwnxhwQAAPbGgszXMrj3AAAAAElFTkSuQmCC","crops/spiritlotus_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/spiritlotus_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/spiritlotus_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVR4nGNgGAWjYIABIzGK5uze8p+BgYEhSOMPw7obLAwMDAwMKa4+jMTK4wNM2ASzp+X+xyYOM/z87Z1YDYPJkwJw6oA5YmrWZKw+gckrSXDjtaB3XcX/4qAOnKGBUwI5FAxV3THkkUMBm/zHz0fgbHwOwBoF+CwjB/Suq8AapQwMeKIAlyOUJLgZ+HltsMpNzZrMiM0ysqIAGaAnSvQgRw4h9DSBz3IGBiKjAFdCRHYQtsRIyHKiHYAOzt/eyXD+9k6GFFcfxo+fj8ATHLIjiLGcgYHIKEAGvesq/t978RXOJ9fnZDsAGWRPy/1Pjq+pCnrXVfzHl82oCgLLY/8Hlsf+R+YjW44uTwwgKxEigyMnn1Kkn2IHUApGHTDqgFEHjDpgwB2As/YqCLPDKNMfKsozMDAwMMjff0gUHxlMWHUIq10kNeTRDSbEHxIAADZ0hQ0Zm1chAAAAAElFTkSuQmCC","crops/stargrain_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/stargrain_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/stargrain_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUElEQVR4nGNgGAWjYIABIzGKbh7s+M/AwMAgqqTB8PreDQYGBgYGdfsKRmLl8QEmbILZ03L/YxOHGT7p6lOshsHkSQEsuCRgjpiaNRmrT2DyShLceC3oXVfxvzioA2do4JRADoU8bWkMeeRQwCa/5e0HOBufA7BGAT7LyAG96yqwRikDA54owOUIJQluBh9hAaxyU7MmM2KzjKwoQAboiRI9yJFDCD1N4LOcgYHIKMCVEJEdhC0xErKcaAegg0lXnzJMuvqUQd2+gnHL2w/wBIfsCGIsZ2AgMgqQQe+6iv/3XnyF88n1OdkOQAbZ03L/k+NrqoLedRX/8WUzqoLA8tj/geWx/5H5yJajyxMDyEqEyODIScoKKYodQCkYdcCoA0YdMOqAAXcAztqrIMwOo0x/qCjPwMDAwCB//yFRfGQwYdUhrHYR3SbEZjAh/pAAAMH+hpqBJw/bAAAAAElFTkSuQmCC","crops/thundergrass_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAqElEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2Awguxpuf/pZRcTPkcQ45DedRUUOZYRnwPQxaZmTYarR7a4OKgDpzmEAM4QwAV611X8R/c1JaFAkgMCy2OxWkRJCBClETk6lCS4qWY50Q5AdgiyAyi1nIGBxCh49vADVS1nYMATAgVhdhjx/VBRnsHGXJrh8YpjJFs0YdUhrHaxkGKI/P2HDI/vPyTZ8kENABLDNhnFCK7JAAAAAElFTkSuQmCC","crops/thundergrass_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nGNgGAWjYBSMglEwCkYBFpA9Lfc/vexiwucIYhzSu66CIscy4nMAutjUrMlw9cgWFwd14DSHEMAZArhA77qK/+i+piQUSHIArihBDgFSHUNU0OGyWEmCG245uVFCtEJcaQKXj4l1BMlpABkElsdSZDlJDpiaNZnx2cMPDEoS3HAxKXkBiixnYGBgYCFFMQMDA8ORk08Z1ncuZmRgwIwWcrIjRVHw7OEHiiyn2AGUWk4VBxw5+ZQi/VQJgSHtAJxxVxBmh5HHHyrKMzAwMDDI33+IlY8PTFh1CKtdJGVDdIuIsXjQAwDrwVfBf3NY0wAAAABJRU5ErkJggg==","crops/thundergrass_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPklEQVR4nGNgGAWjYIABIzGK5p/r+c/AwMDgL6rCsPH1HQYGBgaGRKMSRmLl8QEmbILZ03L/YxOHGX7mxEOshsHkSQEsuCRgjpiaNRmrT2DyShLceC3oXVfxvzioA2do4JRADgUTC3kMeeRQwCb/7sEbOBufA7BGAT7LyAG96yqwRinRDoA54syJhyg+Q5dLNCphfPfgDYYasqIAGaAnSvQgRw4h9DSBz3IGBiJDAFdCRHYQtsRIyHKiHYAOcAU5siOIsZyBgcgoQAa96yr+33vxFc4n1+dkOwAZZE/L/U+Or6kKetdV/MeXzagKAstj/weWx/5H5iNbji5PDCArESKDIyefUqSfYgdQCkYdMOqAUQeMOmDAHYCz9ioIs8Mo0x8qQlpC8vcfEsVHBhNWHcJqF85mOTaAbjAh/pAAAPmTkLX+YyKXAAAAAElFTkSuQmCC","icons/bag":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR4nGNgGPKAEZvg0VWF/3FpsA7rR9HDRKkLKDYAxTl9Bb7/GRgYGMytVHBqOHnsDkPRhM1wfSy4FBELsBoAA8tvfYOzI9W4sKoZ+EDE6wVczqaqCyg2YOABAFu8EQ9kJPkvAAAAAElFTkSuQmCC","icons/chest":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVR4nGNgGPKAEZvg0VWF/3FpsA7rR9HDRKkLKDYAxTl9Bb7/GRgYGMytVHBqOHnsDkPRhM1wfSy4FBELsBoAA8tvfYOzI9W4sKoZ+EDE6wVczqaqCyg2YOABAFu8EQ9kJPkvAAAAAElFTkSuQmCC","icons/coin":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZUlEQVR4nGNgGGjAiEvC1Mv5PzL/9La9WNViCKJrRAfoBqFwkDVPSNBD0Viw4BJWQ5iw2YKuGZcYigEw23EpRJZDdilWF5ACBpEBsJBFDm10AJMjGAvYDMFlMHUTEj6DcCXlgQcAeB4rFI/xxrQAAAAASUVORK5CYII=","icons/fish":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYUlEQVR4nGNgGAUEQdPyLf/xyTMRoxmbIaZezv/xGoCuCZkP08zAwMDASKqTNy/uh7NPb9vLiOICmGZkRbg0U80FGAbgM6gu0oeRgQERBhhewKYYG//0tr04LSbKJcMMAAA9mTXj2epgFQAAAABJRU5ErkJggg==","icons/fishpond":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYUlEQVR4nGNgGAUEQdPyLf/xyTMRoxmbIaZezv/xGoCuCZkP08zAwMDASKqTNy/uh7NPb9vLiOICmGZkRbg0U80FGAbgM6gu0oeRgQERBhhewKYYG//0tr04LSbKJcMMAAA9mTXj2epgFQAAAABJRU5ErkJggg==","icons/harvest":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYklEQVR4nGNgGGjAiEvi6KrC/+hi1mH9GOqZKHUBfQ3IXlz7P3txLYrXWNAVIHhfiDKUBZfEsp88RBkw8IGI0wswcGr5MYbT2/biTC94gamX839TL2eMBIUMBj4MKDaAYgAAnzIWU2AOhLMAAAAASUVORK5CYII=","icons/heart":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUUlEQVR4nGNgGJ5gb0X2f2LFmXApQleMS5wJmyJiDWNgYGBgJNb5yMC5YypcH4YXSAUYBiCbTsh2nC7AZQg2cep7AZdtuFxFsQsIAmKidWABAF5cKS3LN0acAAAAAElFTkSuQmCC","icons/herb":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVR4nGNgGAUUA0ZCCrIX1/5HF5sa2wzXx0JIMSHARKqGwWcACyEFp5YfYzi9bS/BwMYKTL2c/5t6OeMN2IEPA4oNoBgAACXgDpjchi24AAAAAElFTkSuQmCC","icons/pick":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVR4nGNgGAUUA0ZCCrIX1/5HF5sa2wzXx0JIMSHARKqGwWcACyEFp5YfYzi9bS/BwMYKTL2c/5t6OeMN2IEPA4oNoBgAACXgDpjchi24AAAAAElFTkSuQmCC","icons/quest":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPUlEQVR4nGNgGGjAiC7w7tH+/4Q0Cck5wvUxUeoCig1gwSVx/cQmDDFNCz86ugCbbdjAaBgMhoREsQEUAwBuIQuABk15iQAAAABJRU5ErkJggg==","icons/return":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPElEQVR4nGNgGAWM6AJHVxX+x6fBOqwfRQ8TpS5gwSVRsOASCn9Cgh5WdRS7YOANwBkGuPxMdReMAgYGAMPiCDK/tmsAAAAAAElFTkSuQmCC","icons/save":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPUlEQVR4nGNgGGjAiC7w7tH+/4Q0Cck5wvUxUeoCig1gwSVx/cQmDDFNCz86ugCbbdjAaBgMhoREsQEUAwBuIQuABk15iQAAAABJRU5ErkJggg==","icons/scroll":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPUlEQVR4nGNgGGjAiC7w7tH+/4Q0Cck5wvUxUeoCig1gwSVx/cQmDDFNCz86ugCbbdjAaBgMhoREsQEUAwBuIQuABk15iQAAAABJRU5ErkJggg==","icons/seed":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVR4nGNgGAUUA0ZCCrIX1/5HF5sa2wzXx0JIMSHARKqGwWcACyEFp5YfYzi9bS/BwMYKTL2c/5t6OeMN2IEPA4oNoBgAACXgDpjchi24AAAAAElFTkSuQmCC","icons/spell":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVR4nGNgGGjAiE/y6KrC/zC2dVg/VrVMlLqAYgOwOit7ce1/BgYGhij2L3CxZT95GBgYGBimxjaj6KGeC5ADjFhgHdbPOBqIwyIlUgwAfjoaFib++8QAAAAASUVORK5CYII=","icons/stone":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPElEQVR4nGNgGAWM6AJHVxX+x6fBOqwfRQ8TpS5gwSVRsOASCn9Cgh5WdRS7YOANwBkGuPxMdReMAgYGAMPiCDK/tmsAAAAAAElFTkSuQmCC","icons/sword":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVR4nGNgGGjAiE/y6KrC/zC2dVg/VrVMlLpg1IBhYQBG4jD1cv6PTSEyOL1tL1wfCz6FExL04OyCBZeIcwEyoEtSphgAAIAfDxoxrO+JAAAAAElFTkSuQmCC","icons/talk":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPElEQVR4nGNgGAWM6AJHVxX+x6fBOqwfRQ8TpS5gwSVRsOASCn9Cgh5WdRS7YOANwBkGuPxMdReMAgYGAMPiCDK/tmsAAAAAAElFTkSuQmCC","icons/water":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVR4nGNgGAUUA0Zsgk3Lt/xH5tdF+jCaejmjiJ3etpeRgYGBgYmqLkC3GRlsXtyPwoe5gIVYm3xjCxkYGCDeQRan2AvDwIBhAABtWhFQSfzYyQAAAABJRU5ErkJggg==","icons/wood":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPElEQVR4nGNgGAWM6AJHVxX+x6fBOqwfRQ8TpS5gwSVRsOASCn9Cgh5WdRS7YOANwBkGuPxMdReMAgYGAMPiCDK/tmsAAAAAAElFTkSuQmCC","monsters/bamboo_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0ElEQVR4nGNgGAWjYIABI7kad1/s/o9N3FW/lCQzmch1ALXAgDuAhVQNht42WIMeXf781iNERcXQCwEY2Hz6FlUcMOAhMOqAAXcAySXhzRdr/jMwMDBM3bITq3y2jzsDAwMDg7pECFFmE5UL8uak/j+8/jpxLkTSA2NPSpmN0zEkZ8OI5AkMtoGaOOVxhQwuMHTSAHoRjCsUYFE1ZIpioh1wfusRRmJ9RRMH0AqMOoDocoBQQ4SQHlzph+z2AKklIy5AlgOomRsGPA0MuANGAQAyCjXjRY6XvQAAAABJRU5ErkJggg==","monsters/bamboo_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA0UlEQVR4nGNgGAWjYKQDRnI17r7Y/R+buKt+KUlmMpHrAGqBAXcAC6kaDL1tsAY9uvz5rUeIioqhFwIwsPn0Lao4YMBDYNQBA+4AkkvCmy/W/GdgYGCYumUnVvlsH3cGBgYGBnWJEKLMJioX5M1J/X94/XXiXIikB8aelDIbp2NIzoYRyRMYbAM1ccrjChlcYOikAfQiGFcowKJqyBTFRDvg/NYjjMT6iiYOoBUYdQDR5QChhgghPbjSD9ntAVJLRlyALAdQMzcMeBoYcAcMOAAACZM142Jw0JEAAAAASUVORK5CYII=","monsters/bamboo_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4nGNgGAWjYIABI7kad1/s/o9N3FW/lCQzmch1ALXAgDuAhVQNht42WIMeXf781iNERcXQCwEY2Hz6FlUcMOAhMOAOIDsKSAXI5QZyWTH0QmDF3AIGBgYGhqlbduKVV5c4Qj0H5M1J/X94/XWiDETWA2NPSpmNs0wgOQQikicw2AZq4pTHFTJUcwC5AFclRXTNhV4E4woFWFQNmaKYaAec33qEkVhf0cQBtAKjDiA6GxJqiBDSgyv9kF0OkFoy4gJkOYCauWHA08CAO2AUAAAznzpD4PFMAgAAAABJRU5ErkJggg==","monsters/bamboo_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA00lEQVR4nGNgGAWjYKQDRnI17r7Y/R+buKt+KUlmMpHrAGqBAXcAC6kaDL1tsAY9uvz5rUeIioqhFwIwsPn0Lao4YMBDYMAdQHYUkAqQyw3ksmLohcCKuQUMDAwMDFO37MQrry5xhHoOyJuT+v/w+utEGYisB8aelDIbZ5lAcghEJE9gsA3UxCmPK2So5gByAa5KiuiaC70IxhUKsKgaMkUx0Q44v/UII7G+ookDaAVGHUB0NiTUECGkB1f6IbscILVkxAXIcgA1c8OAp4EBd8CAAwDWmzpD8olkjwAAAABJRU5ErkJggg==","monsters/bamboo_4frames":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAABeklEQVR4nO2ZoY4CMRCGu4SH4A0uKIIHeerUOfyBJRieAkNITgH+HIJDECTrEARFwsuAgmwIhXZ2lu38nU9u06Y//7+z7WCMoiiKoiiKEh0JdeLmMDo/ev7ZGJLXlASK/mrZG6CCYgAVLv0Vnu0oUvGuAM2v1sPk3Y/vVynkm4imX9wnAM0AX7j1kwOw3J2oUyFA0S+uAlxBMYAKl349BEaO2Aogjey1LaSrqgYgEmwB9A7A33xgjDHm93/9dPyjlvouLQI0/U4B6M965+3i6LVwf9a7JW7SnbKVvDIMQNbvXQE6P2PT/q5bx20by0NIBqDpF3cGKMMADrgOftz6nQIw6U6TbAdquzhaN3FNKlInDkG/LYAiKgCCAXkoUr9zI2i/ShOkH9UXVP1iOoGoBrhSlH4xAVCKQQMQOc6HwFf/Q7+aI718o+on3wJ8GxN5Cc0AFP2kAISQ5ncbkAVJv4g+wD0hGFAmnPr1EBg5zhWAkjqkNzV2/QooF3R69wz4k5WCAAAAAElFTkSuQmCC","monsters/corpse_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVR4nGNgGAWjYBQMMGAkVqGlu9d/Ug0/vnMbQfNZSDW0piSDoJqWnhlEm8dEqgOoDUYdMOqAoecAFd1fDCq6v/DKL1iYRLR5BMuB0tpqrAXQgUMncTjAkIGBgYHBxsyQwcbM8D8DAwNDd3MrzgKJ5IJoztTzFMmjgwFPAziDZuvuTRhBjyvYcQEHO3MMMW9XPxQ7BzwERh0w6gCCLRZcBREpgCoF0ZFTqAWMjZkhWWrQweCPAhhAb5Ria3ASowYdDHgIDLgDBhwAACN9MsvtfGnFAAAAAElFTkSuQmCC","monsters/corpse_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR4nGNgGAWjYBSMdMBIrEJLd6//pBp+fOc2guazkGpoTUkGQTUtPTOINo+JVAdQG4w6YNQBQ88BKrq/GFR0f+GVX7AwiWjzCJYDpbXVWAugA4dO4nCAIQMDAwODjZkhg42Z4X8GBgaG7uZWnAUSyQXRnKnnKZJHBwOeBnAGzdbdmzCCHlew4wIOduYYYt6ufih2DngIjDpg1AEEWyy4CiJSAFUKoiOnUAsYGzNDstSgg8EfBTCA3ijF1uAkRg06GPAQGHAAAIkrMsmmxuI3AAAAAElFTkSuQmCC","monsters/corpse_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3UlEQVR4nGNgGAWjYBQMMGAkVqGlu9d/Ug0/vnMbQfNZSDW0piSDoJqWnhlEm8dEqgOoDUYdMOAOIDkRkgu27t4Ez0Xern7w3DHgIUCyA1R0fzGo6P7CK79gYRLR5hGMgtLaaqwF0IFDJ3E4wJCBgYGBwcbMkMHGzPA/AwMDQ3dzK84CieQ0MGfqeYrkKXYAuQA54SEDnEGDnGphAFew4wIOduYEHTL0csGoA4adAwi2WHAVRKQAqhRER06hFjA2ZoZkqUEHgz8KYAC9UYqtwUmMGnQw4CEw4A4YcAAAp5g3rvQk3p4AAAAASUVORK5CYII=","monsters/corpse_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2klEQVR4nGNgGAWjYBSMdMBIrEJLd6//pBp+fOc2guazkGpoTUkGQTUtPTOINo+JVAdQG4w6YMAdQHIiJBds3b0Jnou8Xf3guWPAQ4BkB6jo/mJQ0f2FV37BwiSizSMYBaW11VgLoAOHTuJwgCEDAwMDg42ZIYONmeF/BgYGhu7mVpwFEslpYM7U8xTJU+wAcgFywkMGOIMGOdXCAK5gxwUc7MwJOmTo5YJRBww7BxBsseAqiEgBVCmIjpxCLWBszAzJUoMOBn8UwAB6oxRbg5MYNehgwENgwAEAlsU3rD2VFV4AAAAASUVORK5CYII=","monsters/corpse_4frames":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAABhUlEQVR4nO2asUoDQRCGRwk+ybVXXHNBOMRGhAh5BSWVD6CVWqlVbAWLIMkrCAqSRkQQbSxsfZI0sZAVDbd3u8nmMjvzf02Kndztn/nZ++cIEQAAAAAAAAAARay5Fm7udqa+F399fHC+Pnek6m/5fuH06LC25uLqZq7NVMGlAdL0extg1ayqAVwIrX99kc2A+IEBlAMDKCe6DBAr9+O73xC3t9NlMx3AAEqwGdD7EZCkE0rSSeX6cNTz3mAsSNNfewIcn52Uzp9Pz2+l9UmaERFRkWdU5NmUiKh/fhnsyDM//tfnhnV9OOrRwf5tkPtJ1+/9CBhcfyy07gu3BkjTH10GaLoBoQgV/ELrtxrgb2gw2FxnY3ur/fPJNAFXIU2/7b5sTwBpDfClKf14EaQcGEA5MIByYADlWEOgCQu2OdQFE1pCzuFNoUW/8xTw8v5/vizybK4aV7g1QKp+tmPgLE03gBvL0l9rAOOe2f+klbnKpSY2pOtnfwJIb0Ady9aPKQAAzXwDZ3jwgHveULEAAAAASUVORK5CYII=","monsters/fox_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4nGNgGAWjgEig6+L8nxbqmWhhKCmOJcoByAbGN+ThNVzXxfm/kY020Q4hKQQIOQLZcmIBSQ5ANhzdEeiWE+sQgg7AF4wwR+BTQygaiA4BXD6COQKbPDGhgNcBxKZmQhbhM4eoECA1YVFLL10AIzGKCOV9fGBhwyS8drCQYliYtw2Diiwk1u48/odVDUy+bcYhoswkqyCiJiApBBgYcPscWX7V1iNEmzfgITDqAJplwzBvG5xy3qZhcHtxJkJK8j4pYMCjYMAdQHI5QCyAlQWEiuIBrwtGwSgYcAAAD+xJydQlUmkAAAAASUVORK5CYII=","monsters/fox_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA3klEQVR4nGNgGAWjYKgAXRfn/7RQz0QLQ0lxLFEOQDYwviEPr+G6Ls7/jWy0iXYISSFAyBHIlhMLSHIAsuHojkC3nFiHEHQAvmCEOQKfGkLRQHQI4PIRzBHY5IkJBbwOIDY1E7IInzlEhQCpCYtaeukCGIlRRCjv4wMLGybhtYOFFMPCvG0YVGQhsXbn8T+samDybTMOEWUmWQURNQFJIcDAgNvnyPKrth4h2rwBD4FRB9AsG4Z52+CU8zYNg9uLMxFSkvdJAQMeBQPuAJLLAWIBrCwgVBQPeF0wCkYBAN/qScnpDDcqAAAAAElFTkSuQmCC","monsters/fox_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9UlEQVR4nGNgGAWjgEig6+L8nxbqmWhhKCmOJcoByAbGN+ThNVzXxfm/kY020Q4hKQQIOQLZcmIBSQ5ANhzdEeiWE+sQgg7AF4wwR+BTQygaiA4BXD6COQKbPDGhgNcBxKZmQhbhM4eoECA1YZGil5Fsk0kEW0+vgoeCt2kY3F4WYjQTyvv4wMKGSXg9SZQDYCDM24ZBRRYSa3ce/8OqBibfNuMQUWaSVRBRE5AUAgwMuH2OLL9q6xHaOYBcgJzwkMGAR8GAO4CocoCcbBjmbYNTjqhygJK8TwoY8CgYcAfQLBvCygJCRTHNEiEMEHLAKBgFAw4AcOJOpiCzptIAAAAASUVORK5CYII=","monsters/fox_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9ElEQVR4nGNgGAWjYKgAXRfn/7RQz0QLQ0lxLFEOQDYwviEPr+G6Ls7/jWy0iXYISSFAyBHIlhMLSHIAsuHojkC3nFiHEHQAvmCEOQKfGkLRQHQI4PIRzBHY5IkJBbwOIDY1E7IInzlEhQCpCYsUvYxkm0wi2Hp6FTwUvE3D4PayEKOZUN7HBxY2TMLrSaIcAANh3jYMKrKQWLvz+B9WNTD5thmHiDKTrIKImoCkEGBgwO1zZPlVW4/QzgHkAuSEhwwGPAoG3AFElQPkZMMwbxucckSVA5TkfVLAgEfBgDuAZtkQVhYQKopplghhgJADRsEoAADNZU6mp7J0lgAAAABJRU5ErkJggg==","monsters/fox_4frames":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAABrUlEQVR4nO2ZoW7DMBCGvWmvUTY2lUwaC2tZeOjeYM9QtAcoGi0tL9vIVDZpZBob23usBZUnq40dn322z+f7SEFc537/fy5OopQgCIIgCIKD+XJxSDmeOlz1X0MG+4pKIZ6CARz1ewXAnOxx9eSceL5cHO67O1ARvpQygLN+UAfQ2BbBFI8JFQOmaqhRPygAprjzQs7Fp1gI27ltNWDDUf9kAFwp0oW4xmBehSUM4K7fuwPYJtSFjB3HMIGKAVz1OwPgu3hTQjFMKGFAC/q9OkDMQsb8l4oBnPVfAWvKii489kr+3H+rr9e3olp3H9t/E/qHwauWHPq9Cpl69HCxWa1Jh8wHDP0hAcDEdv4byCRD36nb2emu8fP7NzpGH39+eQ8ocxwqAeSoHxSA0pQygAop9IMDYDuxeXy720OnrQZu+qvqAErVawDWfR9bf3UBEMKwBTDoY5DAB1AHgLSWoe/078UOtsRjEAYc9VsDEPPokYqcBrSin+wegKIBOcmlX/YAjZOsA+h2xeFVcAi16LcGwCy8xnYca0Ar+kmnU0PlW0ApWtcvCIIgCAI+R0rIRslXzU9+AAAAAElFTkSuQmCC","monsters/lizard_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA20lEQVR4nGNgGAWjYBSMglEwCgYDqKzM/k8rsy18XPGazYjugPb2qYzUtAAGTmzZjdVcuCA2RyAb7qirxsDAwMCQkO/IwMDAwLBg4n6sFqHL7798C68jWLAZAnNMe/tURlw+NNDTwOoAUgETPklsaePC/ucMF/Y/x6kHnzw2z6AECS0SI3IUwAByVOANAXyGkAvQ0wHWNIAOYAmQHICsF5tHUEIAOQuSmh2JAUTnAnyWExsdxIYaRhqghc/xAaLSADLAVaKhA0ddNaJyFFG5gJZg1AED7oBRMOAAAIqeUF3SWN8JAAAAAElFTkSuQmCC","monsters/lizard_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA2UlEQVR4nO2UIRLCQAxF/zKcpYMpg8RW4DgEHoHuCVYj6jkEDrEW2RkcF+gxQC2TLtlM2mEHkyeb2eQn+SlgGIZhGAaAtj2+SuXe7ndibpcK8L5zvywQuV9vbN7PR04ETd7UFQDgcGoAAJdzYAul8fB4iiKWXJIoxvvO5TrcrFesgKkspCDnjT4M6MOQfSPFuWZGIylhRrqCCF2FOAEpyVxSH7AeSIkGnAN9yzUymgA9wannqEF9BVJx7Tq0U/vyQInOJVQeoOT+aClNXakuSnUFJTEBfxdgvAEJ6lBduw0cPwAAAABJRU5ErkJggg==","monsters/lizard_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA7UlEQVR4nO2TrQ7CMBRGD2TPsmAgSOwEjmAJweAJIcg9wTQheBzB4xCzSBIcL8BjDNXlrnRb12QZoiepanvv990f8Hg8Ho/nH4jjTdZW7MlsmgFcL8dMHXkf6CKS5NRzSeD6Jk8mq6BEyI/RMARgvYsAOB9SY0D9Pn29Adiv5vmbxXKb5w0wIKtRpn48GpSZaoRRgBSiHCie6acyYN29TqHfbQyjbgDgcbvnefuuQVyRyaGmBQo1gC7IvyYjhQrIFWy6jjbo7qGkAlXJbdthW7WfGWjDeRVWMyAxldFENAytNspqC9rEC+hcgKdzvmVzVFAXvejxAAAAAElFTkSuQmCC","monsters/lizard_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA60lEQVR4nO2TrQoCQRRGj7LPIhbFaN1gE6uIxS4iRp/ALGK3id1m2GoUbL6Aj7GmGa7j7O7swGK5BybNzL3fd39AURRFURRgu13mTcUejkc5wOV8yM2R94krYrc7tmISxL6xyWQVjAj5Me11AFisUwBO+8wb0L3Pni8ANvOJfTOdrWzeBA+yGkXqB/1ukalaeAVIIcaB4ZG9SwNW3bt89buJYXQNANyvN5u3HRskFpkcKlpgMAMYg/zrM/JVAbmCddcxBNc9FFSgLHloO0Kr9jMDTTgvI2gGJL4y+kh7naCNCtqCJlEBfxegfADnH1RQcmZWCwAAAABJRU5ErkJggg==","monsters/lizard_4frames":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAABxklEQVR4nO2Yv07DMBDGr6jPUrEUMXbt0K1iRYiFPUKI0U+QGaHubIidjSErY0UX1BfgMcJ0kSn+czZ2GpzvJ0WKlPS++3Jn51IiAAAAAAAAAAAAAAAAAAAAUDZKVW2u2Iv1KlvsVPTh/+X5seUjl1YMUz7hh1DXm0lIAEmBF+tV+/76Zo2rVNWG6krxaes5EOXz79PO7V9vvMur206rO9FXASejJ76cz4iI6OZuSURETw+NUfDwerPbd9dshTBpS5HuML4myO3//vqiu0cvgE1bitS/TX9qullfDTaB87PTkDyd1PVmwpr6akhZAOlOwDlwXqX4t2FsAEapqj0MsG2+nAFd12O24z4K4Mojpf8QXaJ+/Fu3olSYOtDUBDZt/j2vAKnx7cenUd83i4iCBzAU/7ZXgKgBmt2+SyCU/1IAl37J/k8kQWLN82/5iMX3HgtBOgfolOz/RwPoE2iOz5KYh0/UXwHG6N84BLrMS7sxJml9GtbPUyEtwJj8/2qAXH9IhHCsAvi0+6JP/87PQBPSVbScz6K6dwgFcFGa/+AGODa5CzB0UvsXfQWAckEDjBw0wMhxzgB/GUiGPsxJGLt/AEDpfAPWqG2HOrfXWAAAAABJRU5ErkJggg==","monsters/mist_0":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA+klEQVR4nGNgGAVDHWjYuP+nRD8jNS2/cWQnyeaR5QBCvibFISQ7gJQgJ8YhJDmA3PjG5xAWWlpMDCAYAjDLNYSUyLJgw6bpeO0gKgTQgWOXI0E1+8v2E2UWEyEF5GQtUgBBB9AaEO27AL9MshIioTQw4CFAsgM6ZzkzdM5yJlueLAdQUg4Q0ktUGtCwcf9Pbjlw4909vDmJYAhQoxTEZ8bgToTUrANwmTXgIYAzcZDre+tgGxT+0bVHGBgYcBfpOCujG0d2MuJyBC5LyAF4o4BaFRFF2fDGkZ2MtKwRiW4P4IsSZEBqdJCUC8gJCVq3J/ACWrYlRwHVAAAVPltTNZDTiAAAAABJRU5ErkJggg==","monsters/mist_1":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA+klEQVR4nGNgGAWjgEKgYeP+nxL9jNS0/MaRnSSbR5YDCPmaFIeQ7ABSgpwYh5DkAHLjG59DWGhpMTGAYAjALNcQUiLLgg2bpuO1g6gQQAeOXY4E1ewv20+UWUyEFJCTtUgBBB1Aa0C07wL8MslKiITSwICHAMkO6JzlzNA5y5lsebIcQEk5QEgvUWlAw8b9P7nlwI139/DmJIIhQI1SEJ8ZgzsRUrMOwGXWgIcAzsRBru+tg21Q+EfXHmFgYMBdpOOsjG4c2cmIyxG4LCEH4I0CalVEFGXDG0d2MtKyRiS6PYAvSpABqdFBUi4gJyRo3Z7AC2jZlhw+AAAOOltThA2AOwAAAABJRU5ErkJggg==","monsters/mist_2":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR4nGNgGAVDHWjYuP+nRD8jNS2/cWQnyeaR5QBCvibFISQ7gJQgJ8YhJDmA3PjG5xAWWlpMDCAYAjDLNYSUyLJgw6bpeO0gKgTQgWOXI0E1+8v2E2UWEyEF5GQtUgBBB9AaEO27AL9MshIiLA1MvLEKrj9fIwxu74CHAMkO6JzlzNA5y5lsebIcQEk5QEgvydmwPG0vRfLogOYF0Y139yA0juw8uBMhNesAXGYNeAjgTAPk+t462AaFf3TtEQYGBtxpAGcuuHFkJyMuR+CyhByANwqoVRHhM4eo2pCWNSLRBRG+KEEGpEYHSbmAnJCgdXsCL6BlW3IUUA0AAAINXzUvMdMoAAAAAElFTkSuQmCC","monsters/mist_3":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/klEQVR4nGNgGAWjgEKgYeP+nxL9jNS0/MaRnSSbR5YDCPmaFIeQ7ABSgpwYh5DkAHLjG59DWGhpMTGAYAjALNcQUiLLgg2bpuO1g6gQQAeOXY4E1ewv20+UWUyEFJCTtUgBBB1Aa0C07wL8MslKiLA0MPHGKrj+fI0wuL0DHgIkO6BzljND5yxnsuXJcgAl5QAhvSRnw/K0vRTJowOaF0Q33t2D0Diy8+BOhNSsA3CZNeAhgDMNkOt762AbFP7RtUcYGBhwpwGcueDGkZ2MuByByxJyAN4ooFZFhM8compDWtaIRBdE+KIEGZAaHSTlAnJCgtbtCbyAlm3J4QMABglfNegygRIAAAAASUVORK5CYII=","monsters/mist_4frames":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAB5klEQVR4nO2aMU5DMQyG30OcgCMw5Q59S9WhGwsSR6jExAZnKBsTUo+AVAmxvQF1CXfI1CNwhTJAK3ilL4njxInjf2xfYn+xk/i5bRqRSCQSiWBS3XxH7QOlSuc/Cxm8h1fdfEe1EJQB4MDfxjBqdA+aN9QPKrtDlcTvPcAn42ItBGUAuPF7OQg9bjAXgjIAHPmdHAu9Z7AWgCoAnPnPXY2qi0uI7eb17TkYPotCjym/NQH+0/Rxan1mc7+BTH2kHAIwFCd+awIY3be5veumDAB3/qA+QAqleqXKVbH5na4Ao/tWXd0edgHW7ipFGPxP5uUw/k7dZJPUoBogtSQB4yWg9xWwXM2a5WoG/r50ceN3SoCQIgi7gKIIAGd+7yvgYfEe9D1EoQHALKS48Ts3gkKEGYTUAcDixyr8sPmzLwJzS8DUip2AozUA5v2VWzPFRTXwZ90IqiEAY0rBf/IKOPqzwefWydDkuvv7wfp7XGlHcC38JxNgrAc+hPxYa2S36ANQC/9oEYj1Qwgk+6kDYPPBdx5M25j81hrA6L6lOr6w7IbMw53f+TXQdTdg78a989RFHFd+rz4A5EjEzGKKAEB8GI5JaduX37sR9HMkOj2LnbWUAfg9X838RYn62qBW7fwikcimL0eCnWDNfgR/AAAAAElFTkSuQmCC","tiles/altar":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABe0lEQVR4nO2asU4CQRCGR8Mj0GgpHU9AK6URGhISSwoTKx/BwjfQysQCYmNiYiOEEiuMhYWVnVZGG9/hrCgwmjBzc/uzzv91EG733//+GXYvJ0IIIYQQQmKykWKSvcFBob1mOrxOom0zxSTrTHgDamgBVk5ebpfK6rTZM5VM+ATQALQANO49wKs2UxE+ATQALQCNWw8YXZ0VIiJvv3x/c/9oHu8vfs5jJduNkFdzZQlYLjo8GqhOd/3dlmUalYbLiyG3whbce8DO07v3kJUSPgHhDXArgfnDs9dQSQmfABqAFoCGBqAFoKEBaAFoaABaABrTTnDreH/p8+f5xEUMgvAJoAFoAWhoAFoAGhqAFoAmvAHqZ+ntbqdobNer0FKK148vERGZ3Y1Va1IloN3tqF93S41W48oG5LD4BRqtprPAIm7/gfBNkAas+kNtd0Wi0apKQA4maDWaF7Ru/wrWm1P6jqKNKJtK10inMsOzFCuv6bKm5NB3CCH58g3x7FGsg6a9WwAAAABJRU5ErkJggg==","tiles/cave":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACCUlEQVR4nO1bu26EMBB0ouuBjjLdKf+TNPnxKF3K64AvSCpfDms3frBPYCp0lsAe786OF+7p/e3jJxwYz9oT0MZJgPYEIEzLHKZlFnnWBRsYx/5+fbvN6Dg05gnkESC5exRAI+Dz6/t+PXS9wFT+QPm8uBnYPVECcsBCX5qsrUAJiAtJQ9rbAnNojgAvyG0YKoKYmMXfxrFfVQqvMOkDJIESMHQ9eb5bLJHkVcAbVgRA7s6z6qfRBq1FtApYJFNFBC1pwSoC9pLXEVDEpWmuYoQspcLunCCUWv8RvjsCcoin3EjKZhGsFbRWAeSy3oe3wptToFbQWgWwtELl7p+Oi2hArTC1ItfHhKCWAlaO06wREBdoxfVBAAmQaIHVuM5cY7PlnhGsERAnZMn5pUAJeL2+hBDkzwfSR3JQBC3vGDVOI4QNcIR+iZhJpxyLCJaqdglSr0BNkGgK1HaaJfxDNgJKGouc4H5Jy5ICnqpIlgDNxUg8+/Bl8CRAewLacNsUpapOLgjg9ANVBOzxUxkXEQCBagOqCNjLrj/CRQSIN0SOhJMA7Qloo5gAS191UMJ0BEi8PTJNgASKy6CEB9BIMTIf0PJm9hFa+nKmwNYbcImUlO0mt8KtfXutcwZIwNZ8lgBLQ6QmnOMEpmUOQ9eTvg2SBBgBVnedA2TfCnv9a12zCHoLdQyH9wG/3BLDTqIGXu4AAAAASUVORK5CYII=","tiles/cavewall":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACF0lEQVR4nO1aLXPDMAxVd8UFRaVhCRoa2ND2y8fKi1pWGhSQP7Ah73Ku6g/ZljTb766k5zbO09OnvXt7//yBhrE/HQ/OBfOygm9NDnA9x8YL+xOVwUnAvKxc+xBD8wrYY1+2YHkDlAAb0zgAAMD1dveu8a2jwjZKroCJErD989rVEKQAY9FSVpBEEAEhKCH7LUqRnY0AbuSKOVEE1CB5G6IKSAmwuVyuF0Ihi7aW+vp4BYDyQY8Loi7wrN7YBjiAsmTv+jwgMbLbZfJ/mx80HwSTCTCWt/2WE/Oy/n1i0bwCsmQB6ZSYEgtE0qCmrrK7gMRDNTVVLAQYyZd+cUoF2V1AegMx2Fp4Pl+y/CcLAVw+T0nH1brANA5B1akqF/AFMYqFfbPDahVwvd0fXhjrFfo8IOR+AED+QGbL/ft8ESmQVMUAg61US5MiRoB0B2kQRACnNKdxgAmeE5T7FLraLIABmxqJzgMwZfmsSrG6a1SWTEDJ4UbpSxcACrIAxwUMl1GSCaBYPPQ3HJlCPAiejoc+E5REFAGhLWZp5NxH8wqICoJaytfYfbjqjqYUgFWCfR5gy8LX//taVXNuX7qlpdwPwN6NXAj57gppOv0xwPYUTYDGF0vBAwGaylQONJUFMHQCpDcgjaoIoPQIqgmg3vyKIUKEAC1dJYByBcQCOw/0QXwm6AK16IohQYQATUVUVS5AQfME/AKXd93Bb74MrAAAAABJRU5ErkJggg==","tiles/chest":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAyElEQVR4nO3YMQ6CQBCFYTS2HsGOxsrGGCu9gJ7AzoPRcQK9gFaG0Fh5EA8ghb0K+7IT8/6vBWaHl9mwoSgAAAAAAAAAAAAAC6OhD27Xq5eykVSXWzPoXcbqRv7NRFHksJwqyvRWt8/kGkxA7gV3x/3H6+fqlKmTN0kAi81cUaZ3rbptktez3wL2AUi2wP36+PneWVnKainYTwABRDcQzT6A7Aeh3Aedb+wngACiG4hGANENRJN8BRQ/JqLYT4B9AAAAAAAAGOoAF1gXQZigo0MAAAAASUVORK5CYII=","tiles/fence":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA1UlEQVR4nO3YvQ3CMBRF4RgqKsQK9FkBiQFoaBmBlpI1kDIFQ7ACPSsgKioEE7wUrznBPl9r2e/qylJ+uk6SJEmSpOaUscXjfvON1i7X2+jefzl3lh1WCwugA9AsgA5AswA6AM0C6AA0C6AD0Mr5sA3fn5/vT7hxtZinh07p3OZvgAXQAWgWQAegNV+Av8Syw2phAXQAmgXQAWgWQAegleG0C5+d98cr3Nivl+mhUzq3+RtgAXQAmgXQAWh+DWaH1cIC6AA0C6AD0CyADkCzADqAJEmcH0IsOsHJfTwtAAAAAElFTkSuQmCC","tiles/flower":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAElEQVR4nO3YsQ3CMBAF0B/EANTULJOKmiyBlEGQaBgBiZKKZaipmQBTIaWj8Nl3p/9fRYFi6+s7ORkQEREREU6D9wYA4P28l9/vzW7fdU+rnotFRB+A2xFY1v5wuQEAHqfr0Ps4hGnAceuzlTABnF8fl3X1Fei5WET0AYQwzlMZ56n8/6c9+gasrR7k+SKrQd8A+gCqqhplnK1h2gCvcbaG6Y69xtkaZvXMVPulfJ01Rh+AGc9xtgZ9AxSA9wa80QcgQi7NyAq0GbfpX4L0AYQ/Aq0vXdI1wPrSJV0A1pcu4Y/Akr4CDdAHkEqLSxf6BigA7w14ow9AREREREQ4fQG8gU67jOdFLAAAAABJRU5ErkJggg==","tiles/forest":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACu0lEQVR4nO1bvU4DMQw2iJUJie4VW2cegGdB4jl4Mx6AuRvq3kqd+gAwBeVy9sWO7cRw/SZ0pInv80/sxHfz9v76DSvG7WgBRmP1BNxxB57Ol9+/Hx/uZ8/zZ6Ow224AAGB/OLJ/c7WA0QIA8DVHWWGL5hPEBKSFKWEwSMb2hqsFJM3kBGDgak5KHscy2AS0Lg4A8PL8VBVEA828zRYQzZQxfHx+AcCyrG4u4KVta1QJiBzAMEjlFeUBuV9zx0t/04q0Voo3GE7nyywgVy1gacL/APMYUNvyWpBbERVb8ucSV50QgPnPXwlmrTC3AI9AaaUETLbVF0OrJyBENZijFvC45w/cCnFCQLREp0cSJraAnNlyy5OUxZzxGnADZzgXSIJT+YQ1aWICWhMO6fhe7th1F+hZG1Ao6wE3ArDCIyK6xoAIaXXpWtdEyGviETlFGV84FjfUAiLEifAu4E3S0ETI2k1agizbAiKYqwfCpcIlrKyEqjLFBJzOF3bRQ41ridZeEF2NUS5APY/0otTaLi4Q+VwBYCqfiID8jkCjTa0lWHalmFpAKRD2oiPcwuxylBLW0+S9j8XCb4MYNESU7qMmQKohzUkvgK4fCIO6Tc4Su+1m8mK1zBM7XUpNEQA8OUO4AHYDnR+f5S+l1XxJikkihE0sQe2lqLn3h6P6jFFkAdESHIA5eVgXK/a/BLULeJHCNXVtbCIJ4DQlRIS0ZB8eBD13F7NdoGYN1nuzBHnrbirVJfKQBOQ/9rzNsczqEiSKMHEB7EKzFMr7u4LWeVkERA+CmjiiigGlVqnFvbSPte5L1xy+C7QiV0pJgGQrVBHA1ah3BsntFwKYuzOrWRo7CR659dXWbe4UHYEeX52ZfDEimVTTDNWzkQqAQUCkCtDD7Ya7QElwb8JXcTGyhOEWIIHHjhO+QcIbP8dJZGcOc6/8AAAAAElFTkSuQmCC","tiles/grass":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACzUlEQVR4nOVbO27DMAxViy5ZshpZa/QSPVaP0GP0QL1EkayBVy8Z2yFQKjP6kOJHsvOmDLIpPz1SJKU8fX59/LoHxnPrCbTGwxPwIvWiab4455wb9jupV7Lm4VGaD4sAaGyNEHWB2tWf5osamaX3irlALwgXAUMqiwALf099BMY2ZoyJAkoBkkrk+9vr7fdxOhfHj8MhOVYsBozD4WZoTTBRAMdVJNwsp5JVJkIY2WMhpgCKL2LHW0DNBSTiQS54ShFongf0svIeLAJy2wvE988JFdA0a4pYnaCmAE8KJ8W1SLRYBGBWvnV1GGLY7+4U1l0twCUsVFz4Lu+u03xajO+OAG1AgjdBQLjlhis8zZe6hggluseQkqEFvD0YfFPfsiDAPzTNp0XFJQVqu4qDWF8gZq/oAjCjK6niWhXaJjwcWwsCQoZ6y9hyiK1wKi5ANAmCreJCDEUCjtPZ1Hed4wdhyrPiCsgZThEHCR4HvL3wWcy2B4EioKd0VhpkBUjIswTLANxFJtiyZ0gmoOftsablRiKA26zA7iaWu466C1BJG4dDNnHJoUadpLZ4qtBYM0yDICxQUlUjLMQk4k4qPqgTEJO+L5icuzZLQ4STszhqIxOwtaSoeR6QI1Ryy0U1RLQRNlxaKQkG8FUejkoiScBaz/upUHGBUlOUm0lK1g4P7wJJBcCoSW2OakAjcKq4AOcyFOdMocZF0ARg2uGYcRBSx+G19cnmYoBKTzAGWFxIxYRaJdQ+13UqbIEsAT3e6pJGlQKutfx/GQtXUaNzrNUmyxKw1VUPgVJAaYuBJzIU4lreJXAOeTwOm5TUO/kS0CInSgAlOWkdxT1qYwTKBaj38zGgKkfrAiXqeFwbLVUUJQA7Iet7A6FNaKvLTDCXSFEnHN7y5MwFzqObYojSguMoDdpQ/dfYGhKpbhSAwbDfVa9+F+cCOVioJWbjD1KPVdsXkb7DAAAAAElFTkSuQmCC","tiles/house":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABuElEQVR4nO2ZPU5DMRCEDUKiQ5yAihPQRiA6GoRogBNwA47BDTgB0CBEkw6B0nICKk6A6GiAAjkY6z3HsXd3kuf5miSK4zczGm/+nCOEEEIgHOyNvtEaVlEX9ubRIUACiE0jQ1ixvmBo9nR70928vv97fvw0MdVk2oDYfHjbtcYCswC6zPc9tgxBvW6xmdhsTHgkLI6DagPmNR+vsWiCWsKpyudg1QSVjWvNeyzeIcQ3lDIfotkG0RmgYT7eS3ouiAWgZb5rT8kQRALQNt+1t1QI1efJynyMnwu1M6HqxSjzHonhWByAN48wHlIbQtEMWBTzsYaSuTBXYujKz6JkLmQvXHTzHh/C1sZvua8enpMes47Asph37k/f28dX1vqZDUD/ZidB6kgkGzAE886lffQGMBTznj4/2UPw/HB3usHx0UhCkxp395PpfZEhOGQYAFoAmuYDWEMLyOXy5bP3uYud9eJ9m29A8wGYHoHr28fstWcn+2o6QppvAANAC0DDANAC0CzNB6GaDzspmm8AA0ALQMMA0ALQMAC0ADQMAC0ADQNAC0BT9F0g/OdFC4trOMcGEEIIaZof2ceRuF1KdIEAAAAASUVORK5CYII=","tiles/night":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAClklEQVR4nO1aO1bDMBB0ePQuTBqXcADuQMMNuDcHgDJNksIngEo8RbFWu9pZrUwyTZKXZGWNRvuTdu9vHz/DDePB+wG8cfMEPCKMnJbjxeencY8w2wTuCjgtxysCW8KdAG9AtoBG8t7bpRsFjNM8jNPc3G43BEiB8h3kFgjMLeeDeqCcbSv7XEB8AAJWJJTsVhMQy0/ryMZpFhOAcp4kAZbSDLYtHJ8EZlsgVYjGnwRb2lVfs1NNAEqCng5wGBo6QctIwrW9tmhmBKwNVitly2yxmzCowWk5kiRR1SokDKZGc0Cv5HI+qLNBNwWgPLuW+CwBJQeDXE0UGTXYbDGEgltLzLsPEJAlgIqtnpJFw70jhPi/BlcEcKo8RPUXwzMdvjvB0g8su0IUWp01XBGwNtDX9yf0QbwrwBhFBcSTlwLZ97OKPKIo0NJbp2NZnR41c4KlCXgdkRUVoFn1IHvExJ7G/QVJ4bP2Ge9hsMUgFr5jnGZSWdxkS00AlTlaee6X59e/V210ad4QyREW3nMSIM6kucSYEoBe+ZK9mrxDTQC6w9u6MqwmwLpGaFULiMIgddnA+65PDMmiVCkAPVHPDpOIAEQfnkKwHcKcFDXbEeYD1sJYvKLxKqfbSENq7r9cNYkJqF0dCunDtuwX7O6XpW8c0FpgGPo8K6ByFpKALUxOi39xP6AEyqma1QLahig3OSrV/SU7JAE1kpdce0PeNazFJrZAqibKqUmTKjYBXElyDlE054/Sc8XS85q2xOLvEd1lzvaSjgPfApaXI2pTZEo1bAJaOCmPvMO8JdZD8mSaByDBjfnphDQXLtipcA8raQGXajD0D7kxO/0t8orNpsphi0YJPBXmwMJuLTldOcEcYsLQKvgFhH9Wqm/vIKcAAAAASUVORK5CYII=","tiles/path":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACBUlEQVR4nO2bMW7DMAxF2aJL5gwBHHTt1qV36l16lh6mS7esgQNk8JyxnYQ6qpSQpih+23pj4tjS5ydNyc7D58f7D62YR+8BeNME8B6ANzAC9MOF+uFS/bpPFieNJ7LfbiwuUwQTAabgJZKJAMgRj4FxQCnG6ccJBEwR9GIxDth1z0RE1A+H5Pc5ZyxGgMDb6wsREZ1PR9bxxQUIkQhwB+LFYhxwT+hcQWxFsPQJ0S0fA58C1jVl9SkALUAcfQtcUyA0J6FChwnHNresK6YC5CbEpUZBdXUAwqrRVABuBLVO0ZAUQLqknDMQRXDX+Y0hKUAcdWtHfH0fzM59j1YEvQcwhZKOZAkw5SJxk4PKLB1QUlQzAdAjH4BeDE1B+ogNIgU0a35tFwkhQAqpKH/Hy4SAEECzBjifjqp9g8XVACliB4zVTkWu1MpO8nvNtZoDpD+Yy7Y3t11mC8Btba0FKr1NLnZASgjEvp87FpYAHi8v5XB9MJJTdb/dQEVfgjgFNBNFTJUrAXIPKnbddOshTnoMRCusQbs7dCWARZTG5/R0Qc6JNx0QbI9s4yp7gpZ4v1brLkAtcsKa7Qpz8U4rtQPm9lpcjPnr8uiNk1qAuUU8BroI1qgPcP8XqN1z/BMglb/IjZCWticYf1AjyrdunZCd4BKtH3C5CyDdOldfA5oA3gPw5heHUr9A5WLxWAAAAABJRU5ErkJggg==","tiles/pond":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAB/0lEQVR4nO2bMVLEMAxFDcMRuAA9LQUVw13gVMvsNSgZqi22pd8LcAeoMuPV2rJk2Za81iszSaz/YyuxrYTgOI7jrMvNyMZe3t7/qOd+f+yGxNa1EY7gEr0MaX7TlqJztDSj2Y1GCIe0MEJ8A47wh+cn8n1PhyP5XIkRIgNK4jmCS5QMqTWh2gBMfEvhEMyIGhPYF2gJh7QygmVATvxI4ZCcEVQTbqkNWRSPtU9NziQDrIrfkJhA7gHURrWojac4TlIuaoh/fbwnnbfffV4cw/IBaoAV8VxSiTFnAmsIzCA+BF6cWQPg059F/AaMN5cQ76QNUcfm18+vtKkuJMfF7E8/BuYDmAuqX4PXwoUB1/T0QyjnAu8B2gFogxowe/ffwHScGaCxrqdBrNOHgHYA2rgB2gFo4wZoB6CNeDbYEo2ZJWrA6XAc+jHUa8qM7SGcDYFRe/LaxDqXzwFFAzi7tBYpxe89AB5I5YFZewFledx7QOrgNfQC6uYIqwfMYgInzqwBuW8C6yZw6wWqcoBVE2riQg3AvgytmVBbMlPsATOYIKkXEr8GtU2Qtk+e/FBWjK1UiW1QJndNqsQgWnWCMdSZbdM6QcjIStGYbnWCMTWbKL1qhTeGVIrGWNpJql3MEb0FrKwgqVWLxyz7vwBk2T9GUiz5zxCGxb/GHGdx/gE6Yen4r8lbNAAAAABJRU5ErkJggg==","tiles/portal":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACE0lEQVR4nO2bu1EEMQyGBb1QAAER4aWXkEINEDEUcUMENUBKQkoFBJQE0TJgJFuW9cvLrL4ZAtjzQ78ey621REmSJEmSbJWj6AVfng6ftesXV3ehewpZrGW0RIQYx+gFrMaPjtUCU9h786hogEzaMv7++Z39++3lWXVehAjuE0rGS0ZLSGJ4i+A6mdb40+s9O/7j8fXX7xEiuE3EGc95XTJ+oRSBiBfCSwSXSTTGtwwv0USDhwiQ26DG+P35yfcPRzmmt4ZoGRYg4l6NXNs9AkZDvzYWEQVDApQesBr/9vC38ElzlGuMRgH8X2EOzuCaCEjMAli9XzNUuoaMgtAI0Hg5OhIgAnDe7zGM++xIMa1hEqAV/hF4pcGUIrgmQgSw5HVULXAXAJWrqLm7BVhD/ktrW+oAPAVGQjkiDbIIzt7AbFKA2RuYTQowewOzSQFmb2A2KUDvgPJZfPm8njvY8KJ1VmA5J4BHwO7G/gVmZKyWTIHZG5iNSYDeOmAJ5XIMIv+JMgJwAnjeDZB3lqHj5d7DEe0DjqjwJwKngKUWtIz3ZkiAVjEk6hNBY7yn94kAEdDq9CLiRdBEh2buXiAtMpbeoJII7xOBaoCUCpp8lj6H8D6RkwCcJ6QN10SQrq2+S2zBq0lyIaJP0DUFpI1ZwvdfdooubLpXeGHT3eI/GRUC/dIE/NvgiAERb4xs/p2hJNk4Xyk0EdaYlSTwAAAAAElFTkSuQmCC","tiles/reed":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAzUlEQVR4nO3YMQqDQBRFUROyx1TBzkW4gFlEupAqq9QqnU38hjvy7ikF4fn48xkcBkmSJEmSlOZCB9jr3e7L1vPH/Pnpm67HxDkvC6AD0OILuFVePmoRkeInwALoALT4AkpLkPRdtGObltf83L104yfAAugAtK52AHGxKhVw1CIixR8BC6AD0CyADkCzADoALb6Arm6CxMUqfgIsgA5AswA6QFV1WZ6+gCoLoAPQ4gvo0timzX+D/xA/ARZAB6BZAB2AZgF0AFp8AZIUbQVGxyDhUQhJyQAAAABJRU5ErkJggg==","tiles/rock":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABd0lEQVR4nO2ZQY7DIAxFPaO5UnbJKbLleN3OKdrdHCpdVUqn0Njxx0D13zKqAD9/IGpECCGEEEIIIYQQQgghJIA1pa31GkREvqInzBX+e7mEr+NByMSabreSUHXSMzGPFgGfDLG3IyXAJvIWPi+T3K5/T88iRLgm8BQ9L1P2ebSEMAGlgnP8lyBST8TpQY+KtxScI0rCN3pAFPMyvUhcU9rQL1BVBHi7fzQWUkK3CdhTkoAQcUpAi/f4Uqq8a4EnABl/7dieNAyxBfagBZuvlXema3Y/B+KqHC4BexDChxYg8irBehbABETHHzX3j+XHvfyN9SB3BlgxCegBTdFrSpv2MIQIqB1/RKdLqK+M6OsPUbQmBe4EIIuv2ekSkC3QYuEaNGeB+xrstXgtKgG9XX9Ihn8TPOKoeSoBLT9d1UadgJElvEuBaQuMLKFEtb/Fe0DTsGZfhmpiSao70r1IOLs9IXu6pQTvudTN12ELn3gYE0IIISSeO8m8kthJaRr+AAAAAElFTkSuQmCC","tiles/soil":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAB+klEQVR4nO1aO04DMRA1iJIuEqGJOAElR+EmHIY7UeYEEU2IRJceKkfOYrzz8Xjerv2qRPE69ps342evb97fXn9Cx7j1HoA3uifgznsAWhxP58vnx4d79vNDAd4D0EIS9RRDAVYd77aby+fPr2+rv1FjKMCq41LUqZU7ttPmeQksBey2mytprwEuqwA1opaRj3BdBqdq8iiWLAKkA9S6NUu4KqBWxFOCX56fWP2yCLCUbIuKnwOLgI/94eo7UjGL4AalagpooqghSfPscIKcxnNMo1V4CsgEpJU2hGVONgfYFDiezn9I/w8aiw5LgAQc0iLIKRAlz/0DKTgppvEjiz8SSyGpS2wCtMUv5irKKdGqaoAEpgRIilJrVK8Bc3aYKv1Wm6PuU8B0FfDa4HBAIoBqg2M77qGEJ0wUMJ18N0diaJOjgESAdGLoS2AIDa0wqjpgV4FW6N4HZAlAsLCtxtC9ArI1IOauxdYV4X1gCtgDESgrXBOUixMtV48iAd7ybIFRBL0HkMLDOA0FaDtY+iuzoYDSj+mylDvUkFpVpAOSakXQeyJSQN8TnENOgdybp0UC0oa5jpca9RRuPgDlNjmUEeKCq8Bc+yIBKFGyRDMFTJc+FEK73w3C1wBr0wTzXsDr5oiIgJZW1rp/mBTwqjdjNyh5aA0WOOIXuLy4zWlXP98AAAAASUVORK5CYII=","tiles/stone":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACNElEQVR4nO2bMXbDIAyGlT6P3bp292q/HqFzT9AD5ICZc4S8ZM3u1Zv3dikpwTYIkEDGfFOewwP5R4AkksP38fgDO6Z5f3u1NhjGCVxtKEg1jslL8hGF0VB00nctAABcb3dUO0zbVFQPoOgEO5tSZl2nekBuAzgYxunx2XWyFCmAji4GwFyQogQwXxZDUQIofAKqogQIiSR3fwpUAXIbgGUYp6BNzsVmBOCiwajKoXzoONS2oOoBCr2t7TlXXq9nnbZxlG0YO5zHYI4iRUo2FQdgs8moQEgvWtgGLsUz6ilg+1JiAYOamQBcL+2To/v2GdNfXQKpBuLYNCn6ZBeAw/UpEREH5BRpVQBXLc1ExQ/D+QJ91z42U4mzriPCA9aI8QwzoFs73Z4EoDhWQsjpJase4GuUrvCWAqhD/X2AMdPmusPk99jbYRu+dQSq5VojQfNBiKKqQhPTxxrKu07nC3nfAMKPQQyYpWCLacgEoJyZJ4OZA6rNeoASBFMltoknUgCf2V5q6xPG11MgtwEciLwexyYnqalLINVAUmbcZPcesHsBWJeA1I1Pp9YDqGNsPa9f8gDfYitmnBhYl8D1dp8VS6RVibNugn3XLl7Hp4Q9DuDc+Cg22SABtrC7Y0maDJlls1jhKIT3EkC9wPBXn/v6/Ig2IDdRHuCagVw3TQpMud5LgNgXoRKi79qHF8ZSZEFEgdkjWAXgcv3YGyiAf9uSeIDkY7Omw7kNSE2Wf41JcnmTX9eU6Qmo3inEAAAAAElFTkSuQmCC","tiles/swamp":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACpElEQVR4nO1by3ECMQxdMrlzgBqABrgw9JAKUkHazOSSBoAa4EAFyWl3vMaWJfvJlkneaWcBf56ePlacxdvH+8/wh/HSegGt8U9A6wW0xmvrBQzDMNyu9+l5tV6Kfrvdbabn8+mSHN+fQ0QAZ7LYxNKNScYugYoCpItDkyPBApkGqY233CQF1RiwWi8nt+G4TAuoETBa3N+4G0dCn2tiVGh2EEzBqswpsAmgUolkjK/Pb3IMtMuk1h0kICSVGihJbe6aJeNULYQ4hI4KqUX+jICY5RHy56BkXPe3knGgZ4Hb9Q6r0GphpgBt2cVSoLTERoIVA3KJaRVMJVA7C0g2XWr1FNHU5+qlsAuL5fADASWybSV1at5UUDbRENGC348I9Sf+W2L+C20ZhySpMSfXlZ/aBXyEyOjSBba7zUNRlYuqCpB2cFPypY7OXLdSI0DzABUqoXNhoivswiUqlsaQZHZdCXLHo/qQKgRwLZSyqP9eI112mQWQmClAo4eveSTmjk3tJ+kCmhuw0CeYEWDxuKoN9UKIY+VY8eO+Pxz30/NoKISCkgSEJumh1cWtKE0chjhEarmnOA2myk9Ua9xVmaSukM6fVQccjnvxorQR6zPA+wE9ZQpOXUMSwA12nCgubZWHoj6F3IAML4VRjQoEzqdLkjxSAZbTHAqQNOjeBaLeS+IH9V3kmQVWB6CDY63LVeo3RDQ2gBzTRCUoBfIGapAAC8GPa+VStZruCMX6/0gDVSVAUhanvocioYkCLN0lMh0EU1fmqjREkBgXzLF+k3uCFJCph+oyoebg4iEGWPJPJGIZha0AV74aPUHEWDkqMh0EfcT+xleiWPEVGQtVIoXY+mKVJasOeNa4MAyduUDMitL/EXChele4B3SlAApPeRqsgV/kBFpH67Z2cgAAAABJRU5ErkJggg==","tiles/tilled":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACIElEQVR4nO1bO3LCMBCVM+5paWGGhjonSG6Qk+QwXCc5QWoaZkzrlhMkRUbE1g9J3p+8eRUDSKyf9vNWEt3p/e3bKMYTtwHc+CeA2wBuqCegd9/YHQ/319fzhdQYDngE5GAYb/fX++0GzBgOeARIWnXrjZg2FXuAXf3WV96iKgRyAEEUhTf203guQe642vmpoL4Mqiegd2N0qgMscmMxZ2wss2P/bgzFZTCV3JYkLa6xaFUgBkk6w5gKAtZS/y3QdYCFVOK8KrA7HoJJZa1A8wCpK+5CdDNEgeaEEHSIVvcCXBjGL9D5mvMAaKgnYNYLDOPNvL48e19aosk/Pv9cNlUZuHqBbnoyFBMvOXuArhHX8yW4F4BdHks3dWchAG3cfrsRrwc8HRAyuPQhpm6fi5AH1aB0HJgSTP2wZC8AI2C+gu2oSZReoMadMSR4TvIm3xCBAtTpFEkO4EIOMc31AiEseQb1Ulg9ASDnAtYFofsIjLFu8uy03RJzCRBdBjF2lt051OcA9QSIDgGKJko0ASmIk8IWUH29MTT3kZr1AChSwHsB6H373znx+hX1VUA9ASC9QOqsDvpcIHTHiPSOUAqhsbZBejRv03eEUga4n0m7aotaBjEuO0NvvZHrACkrb9GkEIp5Vk37jEpA7q6MC8p/rTTpATFSasKLhYBHhlKeMaziXGAJ1Eth9QSQ/19A2liUcwFpcjcFlCrQwoNb/ACPkw29ONgYcAAAAABJRU5ErkJggg==","tiles/tower":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABaklEQVR4nO2ZrW4CQRRGt6S6T0BwTRMET1C7Ao3DUoNG8QQodE1rcWjEWp6hSYPlPVpB1sACmZ0792yY70gCe7979s7sD0UhBMr4vfwj6/fI4nXzpARMwHnTlAREwLVmCQlPnsVCGtztK5dsbhMQena9psFFQNtmPCQkFxDbRGoJSQVYhU8pIZkA69CpJJjvtB7r1vIKYToBXju3ZR0zAd43MVb1TARQt7EWdaMF0E9zsfWjBNDN18TkaLWbdqXxJkKvEMET0OXmiyI8X5CArjdfE5Kz1RL4Wi87K+JjsUq7BB4NCaAD0GQvIPqpaj6bXmyIr2/92MM2cvg9Xnz2+b2J6iH7CZAAOgCNBNABaCSADkAjAXQAmuwFPHsX3FY/d78zKYcOSU5kPwESQAegkQA6AI0E0AFoJIAOQCMBdAAaCaAD0EgAHYBGAugANEneCDX9ien5+xA0Ad4FR4MX75I3yX4ChBAia/4B3LtXU1iJdigAAAAASUVORK5CYII=","tiles/tree":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACpklEQVR4nO1bPU5DMQxOgaWdegbUperYhQ7oibUSp2DgGlyBA3AIhGCtqg6wMKIuiDN0ajfKgILCI3Ecx3HySr4JwXuO/b3PjvODUhUVFRX/GL0cg47mzd73zPvTUsQ3kUEwAfuQipCkBLgCHwz73ne3m53199xEJCGgHTgmYB/ahHARwU6AGTw18IvmzPm3x/vFz88cJBzFGjDBEbwPpl2O2sJGgHZmMOwnC17DHCOWBBYCzOAlwUHCSYwDHBK0YbF8SWHWiuAiEjO1pYKeIShFEa0AW+CDYd85X7swHp+inluvP4LsUuElAJrTdfA5v74ef7vZqdG82YeqACRAYlrDIlRpWDjZwgSPVUCI89PZRCn1nQIxQWOVYH0IO625CEjxtXy+QN3j7fWNk4w/KUCd2qCgQ9LHZWe72SVJQ2cNiHE6xlFITdSiCxVHcidom85StME2m5QUcym7Z3sotKhJzhCUsc132koIVoBpTGLh00Z7TIwaIB+DFNAOnhNQFXetDUx/prOJt3u0tcxoBZgFKHdTpGH68vr8RrKBIqCUltcF7RelOP4iQEsjVdtZIryLIamvH7sHoBdEoQ2TMwW0MW28C6CkArgWaBumQnIPwLc+QfUBUsdSUoAU4Z0FuiJ/DSgNbB82alO0dEAtsAbrwUipgFJaRAFSG5w2+OrZQSsAU8wPmgAMKgGuP3R1XRB6SlQVkNuB3AAJ6FoaUA5JvQroCgnUE+KaApiHSldBzP2AoBdKOi1WCrfY8SEoBcxBcquBI3iliPcEU1yExIL7wmTUy5JEFHtT1HV3iAvYnR0q2AxB9wo47gcolWavUuSydAxSb9AW9/8CzfGnuntYie1Ki2yJ6a94dXme5GZpDGornNuB3KgE5HYgNyoBuR2oqMiLLwWZWRB7SEo9AAAAAElFTkSuQmCC","tiles/wall":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACEUlEQVR4nO1aO27DMAxVipzBg+EhQ4AcpnOX3rVLx9ygQIcOhodcol2qQmBlmaJImpL1tgCKKT8+fkT59Pzy+u0OjPM0DskF8/JwW2s4oGUH4kndojF0AvbegCRu14u7XS/JNUUEYAxYR9MKwOBc8uePzy+mbcggtr95eTjn3F/FKSJgT4ShV+KIagmgAvYaYgRAqWHW5oAr/JpPgvPySBLcHAFbLwwhFgKh9GGvAOU7jQMpDHL3EUNTSRA2Zpg80VwI5OLU5wEgRnLKVwyUcz3FJtf84F8ITONAfrCPv5oOSCZyAJV0jsrBSoDPutYPSSGqLoNeNVt9RgomQmBPVK0Aj34c/gVMipjEWg0B4ctx3h9UQwAGFGKqIUDq1sgMAVIST9lxrpdBOwrYAtcUGMIMAVo3w9BOnwfU8n2AVJLsSbDkz1KJKQaVPkCrFltCD4HwB9brXvo1TX7WcHgFZBHg793e3u9S+1EHuQpQ5M8dOhxV6PAhkKWA0tJoMWlmEVB6bcYNDkJVToMcxFEGnhgkc4A3KvXxwppNjD2/rnRvKjlAM2Ry2/k+D+D2Tu78IBXbKW/m2En1H7uPxKZxWN2gRujsTgA3QjIxnaIIATXNFaIEYGou50tydojhszDPFVGAda+HaOYwRG2KogrAeLAmL6fQjAKoaKYMUhXZFaBprORzNil0BWgas+BxiMMr4AeTZeMc1ubVJQAAAABJRU5ErkJggg==","tiles/water":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACIElEQVR4nO1aS27CMBA1VU+A2HAH9uzgCkhIPValHqRSr5DusucObBBXaFeRjHEcj8cz8xL8dnwUO2/efO3Vx+fXn3thvFlvwBqNAOsN+Lhd7+52vauuCUWABV6egHfrDfjYbNfqazYF+B/8AGRhDQuwXOC432X/t+svyd/D6D8YoOYaMbAI+P75dc7JqqXkpSh4IKDmiwyWk34BLp4UMCbFFGrEDquYw3KBzXY9WrnVsHzo/xJqIhOgXapK44kAqhTnni6hKsEQOZIfFFlqCDIBkha3yBzQCsgB1yCL7AUoc4VJBXB9jAKLogmmF4g9s+svRWtQjMUiQMNiqr1ADOfTQW0zFoDLAjGSS/qTXJCyAMUf54LoRMi6vA0DoeR+Jl1giX7vo7gQsjjEkIDYRIiDWfQCKGTlYiyTwKTBWIbRUAIMAVRQM9bY/2C7Qa71c4O0iAI0Bhu1YhCMC1jVGyIEIBRPuQpRUYBkM8OF2kBkOEfUWINC8Cp1TQ7tfC+1n1KViaZBzX6h1K3ECJCYHXT9pboakzGAu9j5dFB1nxIVwFaCx/1OZQIllgZRAucUYCpB5x4bHC0CYV1AC40A6w1YI0nAUgafKUAFwXZX2ABJBVAsgnKqRAXc/YAw5vin07XW8NHuB4g+vQDaLsQioKbfW43NWhaIfZl7+7umlWo9K7xbMAVxBaBXk+pBULpeoGaNKAGI0pZCC4LaC6Ip4h+ufuFtnRX/SQAAAABJRU5ErkJggg==","tiles/waterfall":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA4ElEQVR4nO3YwQnCQBgFYSMWYwciVmAFFmENXu3AIixExA7sRs9uThLiJ/u/uWVhwzDs6Q370/m1+ILddj06u92fs92b+5/LSQYdkABaQJMAWkCTAFpAkwBaQJMAWkCTAFpAkwBaQJMAWkCTAFpAM7Sb4PGwUS4/4XJ9fHyXfwHlA6zag/aJtGQW74wE0AKaBNACmgTQApoE0AKaBNACmgTQApoE0AKaBNACmgTQAprM4sjjbygfILP4JIMOSAAtoEkALaBJAC2gSQAtoEkALaBJAC2gSQAtoCkfYLQJVuMNHwIuuzeRXRMAAAAASUVORK5CYII=","ui/wood_frame_64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABb0lEQVR4nO2bsUoDQRRF3wb/IYVdSGWQgIawTSpry3xBwI8S/IKU1lZpRDRNwErsLPwKU2WZTDSzC9k97r57qgw7gfPuzgwJzMvy8ejHHNOjBWjcB3AWDvJh3+4Ws2J8/7BqXKgO4pqeP76Lce+vib+N20iqJm2B1ISry/MmPDD2VkC8519fPhuVqYO4hrjGLPwdkA/7xYOuvfn15qv4HB6CyS1gZrZ8ej+9UQPMby6Sc9wfgu4DKLUFQh5Xb1kdIqfidnZd6b+N+xWgAGgBGgVAC9AoAFqARgHQAjQKgBagUQC0AI0CoAVoFAAtQKMAaAEaBUAL0CgAWoBGAdACNAqAFqBRALQAjQKgBWgUAC1AowBoARoFQAvQKABagKbyPcGq9/D+O+5XgPsASm2BMreu28pBAGFPTRcaJszMJtOBTaYDMztsmDjaNLX7UpuJa4hrTG6BsNOijaReovtD8GjTVBcaJ1M1ZWqedo77ALYNlz/Xa+piaAAAAABJRU5ErkJggg=="};
imageSources['tiles/v33_bridge']='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABIElEQVR4nO2XsQ0CMQxFHUTNAgzABFSsQEPPAJSMQ0NHiyhgBCgQEhUSYgAWYAGoOEWgRIEU9vn/V50usuN85aR7Yb+cPyVitTk0z9PJSLyQOldHYxhLwAfQvZyvycXcWpuJz8UbkFu83R8iIjLo94obvmtiLNfD3wD4ALKfwC9Xr6ZGsx7+BsAHED5fzMbD5td4sTt9rbeV1LkCXQAc+ADoAopzmIAuUNzZKfAB0AWqdnMAfAB0AboAOPAB0AUU5zABXaC4s1PgA6ALVO3mAPgA6AJ0AXDgA6ALKM5hArpAcWenwAdAF6jazQHwAdAF6ALgwAdAF1CcwwR0geLOToEPgC5QtZsD4AOgC9AFwIEPIOsC6+1RRGz/yf1TH5/5BRan1TiLM0IVAAAAAElFTkSuQmCC';
imageSources['tiles/v33_reeds']='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABPElEQVR4nO2ZsQ3CQAxFc4iGAZiGKWiAlo4yLQwAC6RAaWiBhg3oGAGJBZgDKpDIEZELzn2f/J+UBgnOefK3E5FlhBBCCCGEEEIIIcZwoV/Yb6aP6mez5SH4d7TQRx6uQWYv5mEaMS8gOALnwbCLOmBAZ4AGmeYjYF4ANAJtkF6dngANuzkm5iNgXkByM0B6dXoCpA5IZZaYjwAFoAtAEzwEy7xwo8XYy3cVDc/5TYBugaYyu8R8BCgAXQCaVgIu29PHAw06x/8A7wC0TLgANMm9DEmvTk+Aht0ckyQjIDk3vgpAD6aYJNkBkrQW8KtLyrxwZV646+2eva66TkJ2HDsAXQCaWgHaB6FUfeyArg/Q3knsAHQBaP4SINneqKh4/9TMVxNVGe2C3fr4vm9GAF0AGgpAF4DGvABinSfaeWPqHpQ7iwAAAABJRU5ErkJggg==';
imageSources['tiles/v33_teahouse']='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAByklEQVR4nO2au0rEQBSGj5feYl9B2EaEIFaLzYLFEhufYUEs0wg+gmCTchF8BqtlC8FGthIJiM2Cr7CPILGKrGMmmZmcmT/LnK8Mczn/NydsNoRIEARBwDFNxyVy/13k5lV4pIQdxKZNgR/nL0FrCt4BbacduhuC2dYFS4YDKlbr2jkhuiGIgLrwyXDwb1ydCN8SvC5uGlwlpAhvAtTwJsFVVBE+JLAv6HrqOnx3A6sAjlPX4asbWBbxGVyFW0RnAZvhfQZX2RTRRYLzRFRwla4inARU4ZHBVSoRthKsBvfl1HW4dIOxgD6eug6bbmgdsE3BVUxENAqYpuNyG4OrFKu1VsKfi5PRKfTtTCgWy7ff3NA3Qn1ABKALQBO9AOPngOeHrCQiOjxKGsflyw/jzbPRsfFYG74+CyIiOr/KW/Pte6nAkfu7mdG4m9trtj2jvwVEALoANCIAXQAaEYAuAI0IQBeApldPgpxPeKZE3wEiAF0AGhGALgBN9AKsfwarty169hjX8k/0HSAC0AWgEQHoAtCw/xm6OPjmXtIr0gEuk+aLd+46WEgnJ9ZznD6Syi7PevkdQf70ap0n+ltABKALQBO9AEEQ4uYH2wCPviQDnrEAAAAASUVORK5CYII=';
imageSources['tiles/v33_waterfall']='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABFklEQVR4nO2bsQnCQBRAT3EEF0llkSWsxTIbuIG94ACWDuASFlYu4giCVoGQS6JBzSPee+VF5PH4F7wDJ6vt/hEqrJeLUOd4ukRr//L5aeuTRDAALUBjAFqAxgC0AI0BaAEaA9ACNAagBWgMQAvQzOoL2TxaClmRd37J9Xb/ntHAJD8BBqAFaKIN37Sf+97BjYnkJ8AAtACNAWgBGgPQAjTxD/+BqJ45Xp01Sn5x5kh+AgxAC9Bg74DqfibPGslPgAFoARoD0AI0BqAFaAxAC9AYgBagMQAtQGMAWoDGALQADXYj9Am7N2+RS7IiD5vDufFZ8hNgAFqAZpTvgLb9HIL/GuuNAWgBGgPQAjQGoAVoDEAL0DwBNn0tqQojwtQAAAAASUVORK5CYII=';
for(const [name,src] of Object.entries(imageSources)){
 const im=new Image();im.onload=()=>{images[name]=im;draw()};im.onerror=()=>console.warn('V27 missing asset',name);im.src=src;
}
function persist(next,manual=false){
 const good=validated(next);if(!good)throw Error('非法游戏状态，拒绝写入。');good.lastSave=now();
 // Write-before-swap: no memory reward if localStorage failed.
 localStorage.setItem(manual?MANUAL:SAVE,JSON.stringify(good));
 if(!manual)state=good;
 return good;
}
function change(fn,{quiet=false}={}){
 try{const draft=clone(state);fn(draft);persist(draft)}
 catch(e){notify('存档未能写入，本次行动未执行：'+(e.message||e),true);return false}
 try{if(!quiet)render();else{draw();syncHUD()}}catch(e){console.error('V30 UI刷新失败（数据已保存）',e);notify('行动已保存，但界面刷新异常，请重新打开洞府。',true)}
 return true;
}
function notify(t,bad=false){if(bad)console.warn(t);const el=root?.querySelector('.log');if(el)el.textContent=t;state.log=t;
 if(bad&&modal){const host=root?.querySelector('#v27-modalhost .modal');if(host){let err=host.querySelector('.v29-modalerror');if(!err){err=document.createElement('p');err.className='v29-modalerror';host.insertBefore(err,host.querySelector('.modalactions')||null)}err.textContent=t}}}
function modalBox(title,body,actions=[{label:'继续',on:'close',primary:true}]){modal={title,body,actions};renderModal();requestAnimationFrame(()=>root?.querySelector('#v27-modalhost .modal [data-do]')?.focus({preventScroll:true}))}
function closeModal(){modal=null;renderModal()}
function icon(id){return imageSources['icons/'+id]?'<img alt="" width="16" height="16" style="image-rendering:pixelated;vertical-align:-3px" src="'+imageSources['icons/'+id]+'">':''}
function makeButton(label,fn){const n=({help:'scroll',saves:'save',sell:'coin',inventory:'bag',fishing:'fish',pond:'fishpond',farmUpgrade:'wood',commission:'quest',dungeons:'sword',sleep:'return',attack:'sword',cast:'spell'})[fn]||'';return '<button data-do="'+esc(fn)+'">'+(n?icon(n)+' ':'')+label+'</button>'}
const V31_NPC_PHASES={
 qingwu:[[[7,1],[8,1]],[[8,2],[8,3]],[[9,5],[10,5]]],
 shennong:[[[3,2],[3,3]],[[5,2],[5,3]],[[6,4],[6,3]]],
 yuchi:[[[9,2],[10,2]],[[8,4],[9,4]],[[8,5],[8,4]]],
 moyu:[[[9,5],[10,5]],[[7,5],[7,4]],[[5,5],[5,4]]],
 tiebai:[[[2,5],[2,4]],[[2,4],[2,5]],[[3,5],[3,4]]]
};
// V32: 不再每4.8秒瞬间闪到另一格。站立、行走、回身组成可连续播放的巡游周期。
// NPC碰撞及交谈仍使用npcPos的整数格坐标，不把纯视觉位置写进存档。
function npcTrack(n,t=performance.now()){
 if(state.mode!=='farm')return null;
 if(isShop(state.area))return SHOP_INFO[state.area].owner===n.id?{x:5,y:2,px:5,py:2,walking:false}:null;
 const phase=state.minute<720?0:state.minute<1080?1:2;
 if(state.area==='farm'){
  if(n.id==='shennong'&&phase===0)return {x:2,y:3,px:2,py:3,walking:false};
  if(n.id==='yuchi'&&phase===0)return {x:9,y:2,px:9,py:2,walking:false};
  if(n.id==='qingwu'&&phase===2)return {x:7,y:1,px:7,py:1,walking:false};
  return null;
 }
 if(state.area==='river'){
  if(n.id==='yuchi'&&phase!==2){const t2=(t%5000)/5000;const x=2+Math.abs(Math.sin(t2*Math.PI*2));return {x:Math.round(x),y:3,px:x,py:3,walking:true};}
  if(n.id==='qingwu'&&phase===2)return {x:9,y:6,px:9,py:6,walking:false};
  return null;
 }
 if(state.area!=='village')return null;
 const route=V31_NPC_PHASES[n.id]?.[phase];if(!route)return null;
 const off=(NPC.findIndex(q=>q.id===n.id)*1279)%8000;
 const tt=(t+off)%8000;
 let alpha=0,walking=false;
 if(tt>=1700&&tt<3200){alpha=(tt-1700)/1500;walking=true}
 else if(tt>=3200&&tt<5600)alpha=1;
 else if(tt>=5600&&tt<7100){alpha=1-(tt-5600)/1500;walking=true}
 const px=route[0][0]+(route[1][0]-route[0][0])*alpha;
 const py=route[0][1]+(route[1][1]-route[0][1])*alpha;
 const p=alpha>=.5?route[1]:route[0],candidate=(p[0]===state.x&&p[1]===state.y)?route.find(q=>q[0]!==state.x||q[1]!==state.y)||p:p;
 return {x:candidate[0],y:candidate[1],px,py,walking};
}
function npcPos(n){const a=npcTrack(n);return a?[a.x,a.y]:[-8,-8]}
function npcHere(n){return npcPos(n)[0]>=0;}
function quickbar(){return TOOLS.map((tool,i)=>'<button type="button" data-tool="'+tool.id+'" title="'+tool.desc+' · '+(i+1)+'" class="quick '+(state.tool===tool.id?'chosen':'')+'"><span class="tool-icon">'+tool.symbol+'</span><small>'+tool.name+'</small><em>'+(i+1)+'</em></button>').join('');}

function scoreBar(score){return '<div class="progress"><i style="width:'+Math.min(100,score/220*100)+'%"></i></div>'}
function objective(s){
 if(s.mode==='dungeon'){
   const alive=s.foes.filter(e=>e.hp>0).length;
   return {title:'秘境试炼',detail:alive?'尚有 '+alive+' 只妖兽 · J挥剑／K御术，先破守卫':'守卫已清 · E靠近宝箱，或撤离归山',hint:'战道 '+s.battleScore+'/220 · '+s.cleared.length+'/3 境已破'};
 }
 if(s.area==='house')return {title:'洞府内室',detail:'床榻安歇、灶台烹制灵食、符案绘制护身符；近门可返回灵圃',hint:'熟食 '+s.meals+' · 护符 '+s.wards+' · 洞府 '+(s.houseLv?'已扩建':'初建')};
 if(s.area==='river')return {title:'灵溪河岸',detail:'小镇东街通向灵溪：沿桥过河，采集芦叶与溪石、钓灵鱼、在茶摊歇脚或探访河神古祠',hint:'水誓 '+(['未启','记下旧誓','待封水印','旧誓已解'][s.riverQuestStage]||'未启')+' · 今日河岸采集 '+(s.riverGatherDate===s.day?s.riverGatherCount:0)+'/2'};
 if(s.area==='village')return {title:'万族小镇',detail:'北街可进药庐与铁坊；接近巡游村民，了解各自的两章人物旧事',hint:'人物委托完成 '+Object.values(s.storyStages||{}).filter(v=>v===4).length+'/5 · 店铺08:00—21:00'};
 if(isShop(s.area))return {title:SHOP_INFO[s.area].title,detail:SHOP_INFO[s.area].intro,hint:'走近掌柜谈话，点货架选购；出门回到小镇'};
 if(s.energy<=15)return {title:'体力告急',detail:'吃干粮回复体力，或回洞府休息至明日',hint:'体力 '+Math.round(s.energy)+'/100'};
 if(s.minute>=1260)return {title:'夜色渐深',detail:'可收拾工具，返回洞府安寝；灵草隔夜生长',hint:clockStr(s.minute)};
 const ready=s.plots.filter(p=>p&&p.progress>=CROP[p.crop]?.days).length;
 if(ready)return {title:'灵草成熟',detail:'有 '+ready+' 畦灵草可收获 · 切换收割工具靠近田地',hint:'经营道业 '+s.farmScore+'/220'};
 const planted=s.plots.filter(Boolean).length;
 if(!planted)return {title:'今日修行 · 开垦灵田',detail:'选择「灵种」工具，点击空田播下第一粒种子',hint:'目前有 '+Object.values(s.seeds).reduce((a,b)=>a+b,0)+' 粒种子'};
 if(s.bulletinDate!==s.day)return {title:'今日乡约待交',detail:'到山门告示板查看订单，或继续种田、钓鱼',hint:'已播种 '+planted+'/8 畦'};
 if(s.commission)return {title:'委托进行中',detail:'墨羽外出探秘 · 第 '+s.commission.due+' 日带回材料',hint:'经营道业 '+s.farmScore+'/220'};
 return {title:'山居自由日',detail:'照料灵田、垂钓、采集或结识万族邻人',hint:'经营道业 '+s.farmScore+'/220'};
}

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
function journal(){const s=state,o=objective(s);
 const npcList=NPC.map(n=>'<li>'+esc(n.name)+' · 好感 '+(s.fav[n.id]||0)+'/100'+(s.npcQuest?.[n.id]?' · 已解锁旧事':'')+' · '+['委托未启','待交第一章','第一章已结','待交第二章','两章完结'][s.storyStages?.[n.id]||0]+'</li>').join('');
 modalBox('山海手记 · 今日目标',
  '<p><strong>【'+esc(o.title)+'】</strong> '+esc(o.detail)+'</p>'+ '<p>经营道业：'+s.farmScore+'/220'+(s.wonFarm?'　【万家灯火】已达成':'')+'<br>战斗道业：'+s.battleScore+'/220，'+s.cleared.length+'/3座秘境'+(s.wonFight?'　【剑破三关】已达成':'')+'</p>'+ 
  '<h3>灵溪旧誓</h3><p>探访阶段：'+(['未发现','残碑待祭','待隔日归流','水誓完成'][s.riverQuestStage]||'未发现')+' · 河岸每日采集：'+(s.riverGatherDate===s.day?s.riverGatherCount:0)+'/2</p>'+
  '<h3>山居近况</h3><p>当前位置：'+areaName(s)+' · 灵糕 '+s.meals+'份 · 护身符 '+s.wards+'枚<br>第'+s.day+'日 · '+seasonOf(s.day)+' · '+weatherOf(s.day)+' · '+clockStr(s.minute)+'<br>灵田 '+s.plots.filter(Boolean).length+'/8 畦 · '+(s.commission?'委托第'+s.commission.due+'日完成':'暂无外出委托')+'</p>'+ 
  '<h3>万族友人</h3><ul>'+npcList+'</ul>'+ 
  '<h3>旅途线索</h3>'+(s.notes.length?'<ul>'+s.notes.slice(-9).map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>':'<p>尚未收集到秘境旧闻。</p>')+
  '<p class="v29-note">此手记随本地洞府自动存档；原版文字篇另有独立存档。</p>');
}
function audit(){
 const s=state,results=[
 ['作物图鉴',CROPS.length===10&&CROPS.every(c=>c.cost>0&&c.days>=1&&c.yield>=1)],
 ['地图尺寸',DUNGEONS.every(d=>d.map.length===H&&d.map.every(r=>r.length===W))],
 ['灵田状态',s.plots.length===8&&s.plots.every(p=>!p||CROP[p.crop]&&Number.isFinite(p.progress))],
 ['道业独立',s.farmScore>=0&&s.battleScore>=0],
 ['每日交货状态',s.bulletinDate<=s.day],
 ['人物数据',NPC.every(n=>s.fav[n.id]>=0&&s.fav[n.id]<=100)],
 ['存档可序列化',!!validated(clone(s))],
 ['玩法与素材',Object.keys(imageSources).length===141],
 ['角色位置',!isWall(s.x,s.y)],
 ['库存非负',CROPS.every(c=>goodCount(s,c.id)>=0&&seedCount(s,c.id)>=0)],
 ['村落与居室碰撞',VILLAGE_MAP.length===8&&HOUSE_MAP.length===8&&VILLAGE_MAP.every(r=>r.length===12)&&HOUSE_MAP.every(r=>r.length===12)],
 ['可继承建筑',s.meals>=0&&s.wards>=0&&s.houseLv<=1&&!!AREAS[s.area]],
 ['双商铺地图',SHOP_MAP.length===8&&SHOP_MAP.every(r=>r.length===12)],
 ['商铺事务',s.toolGrade>=0&&s.toolGrade<=1&&s.clinicDate<=s.day&&s.packDate<=s.day],
 ['五族因缘',NPC.every(n=>Number.isInteger(s.storyStages?.[n.id])&&s.storyStages[n.id]>=0&&s.storyStages[n.id]<=4&&s.storySince[n.id]<=s.day)],
 ['河岸连通',RIVER_MAP.length===8&&RIVER_MAP.every(r=>r.length===12)&&s.riverQuestStage>=0&&s.riverQuestStage<=3],
 ['河岸限次',s.riverGatherCount>=0&&s.riverGatherCount<=2&&s.riverTeaDate<=s.day],
 ['因果路引',!!trackedInfo(s).detail&&['main','river',...NPC.map(n=>'npc:'+n.id)].includes(s.trackedQuest)]
 ];
 return {passed:results.filter(x=>x[1]).length,total:results.length,results};
}
function auditModal(){const r=audit();modalBox('九曜自检 · 系统巡查',
 '<p>当前存档与关键配置：'+r.passed+'/'+r.total+' 项通过。</p><ul>'+r.results.map(([name,pass])=>'<li>'+(pass?'✓ ':'✕ ')+esc(name)+'</li>').join('')+'</ul><p class="v29-note">此为运行时基础巡查，不能代替完整通关测试或实体 iPhone 测试。</p>');}

function render(){
 if(!root)return;const s=state,dungeon=s.mode==='dungeon';renderCount++;
 root.innerHTML='<div class="page"><header class="top"><div class="brand"><small>WANZU · PIXEL SANCTUARY</small><strong>万族争道 · 山海路引</strong></div><div class="topright"><button class="woodbtn" data-do="manual">手动存档</button><button class="woodbtn" data-do="exit">返回文字篇</button></div></header>'+ 
 '<nav class="tabs" aria-label="玩法分区">'+[['farm','灵田'],['npc','人物'],['mission','委托'],['adventure','秘境']].map(([k,v])=>'<button type="button" class="tab" role="tab" aria-selected="'+(tab===k)+'" data-tab="'+k+'">'+v+'</button>').join('')+'</nav>'+ 
 '<div class="lifehud"><div class="calendar"><span class="skyicon">'+(weatherOf(s.day)==='晴朗'?'☀':weatherOf(s.day)==='多云'?'☁':'☂')+'</span><div><strong>'+seasonOf(s.day)+' · 第 '+(((s.day-1)%7)+1)+' 日</strong><small>修仙历 第 '+s.day+' 日 · '+weatherOf(s.day)+'</small></div><b class="clock">'+clockStr(s.minute)+'</b></div><div class="wallet"><span>✧ '+s.gold+' 灵石</span><span>♥ '+s.hp+' 气血</span><span>✦ '+s.mp+' 灵力</span></div><div class="energyrow"><span>体力</span><div class="energy-track"><i style="width:'+s.energy+'%"></i></div><strong>'+Math.round(s.energy)+'/100</strong></div></div>'+ 
 '<div class="mapframe"><canvas id="v27-map" width="768" height="512" aria-label="可点击的像素洞府或秘境地图" role="img"></canvas><div class="mapbadge">'+(dungeon?DUNGEONS[s.dungeon].name:areaName(s)+' · '+seasonOf(s.day)+'日村居')+'</div><div class="maphint">'+(dungeon?'J 斩妖 · K 御术 · E 开箱':(s.area==='farm'?'点格子行走／操作 · 1-6 换工具':s.area==='river'?'渡桥探祠 · 采芦寻石 · 钓鱼歇茶':s.area==='village'?'北街药庐／铁坊 · 东至灵溪':isShop(s.area)?'货架选购 · 掌柜交谈 · 门口离店':'床榻休息 · 符案炼物 · 门口出入'))+'</div></div>'+ 
 '<div class="v29-objective" role="status"><div><b>'+esc(objective(s).title)+'</b><span>'+esc(objective(s).detail)+'</span></div><small>'+esc(objective(s).hint)+'</small><button data-do="journal" aria-label="查看山海手记与目标">手记 ›</button></div>'+
 '<div class="v34-tracker"><div><b>◎ '+esc(trackedInfo(s).title)+' <small>'+esc(trackedInfo(s).progress)+'</small></b><span>'+esc(trackedInfo(s).detail)+'</span></div><button data-do="trackMenu">更换追踪</button><button data-do="guide" '+(dungeon?'disabled':'')+'>寻路 ›</button></div>'+
 '<div class="quickbar" aria-label="生活工具栏">'+(dungeon?'<div class="dungeonquick">⚔ 秘境征途　｜　J 挥剑　K 施法　E 交互</div>':s.area==='farm'?quickbar():'<div class="dungeonquick">'+(s.area==='river'?'≈ 灵溪河岸 · 桥畔采集／溪钓／古祠':s.area==='village'?'◈ 万族街市 · 双商铺与巡游邻人':isShop(s.area)?'▣ '+SHOP_INFO[s.area].title+' · 靠近货架选购':'⌂ 洞府内室 · 灶台与符案')+'</div>')+'</div>'+ 
 '<div class="controls"><div class="pad"><span></span><button data-move="up" aria-label="向上">▲</button><span></span><button data-move="left" aria-label="向左">◀</button><button class="act" data-do="interact">交互</button><button data-move="right" aria-label="向右">▶</button><span></span><button data-move="down" aria-label="向下">▼</button><span></span></div><div class="actions"><button data-do="'+(dungeon?'attack':'interact')+'">'+(dungeon?'⚔ 挥剑 / J':s.area==='farm'?'✦ 使用工具 / E':'✦ 靠近交互 / E')+'</button><button data-do="'+(dungeon?'cast':s.area==='farm'?'water':s.area==='house'?'workshop':isShop(s.area)?'shop':'bulletin')+'">'+(dungeon?'✧ 施法 / K':s.area==='farm'?'◉ 浇灌灵田':s.area==='house'?'✧ 符案工坊':isShop(s.area)?'▤ 货架选购':'▤ 每日乡约')+'</button><button data-do="'+(dungeon?'retreat':s.area==='farm'?'fishing':s.area==='house'?'kitchen':isShop(s.area)?'shopService':'festival')+'">'+(dungeon?'↩ 撤离':s.area==='farm'?'⤷ 灵池垂钓':s.area==='house'?'♨ 灵食灶台':isShop(s.area)?'✧ 掌柜服务':'✧ 四时集会')+'</button><button data-do="'+(dungeon?'heal':s.area==='village'?'worldmap':isShop(s.area)?'shopExit':'sleep')+'">'+(dungeon?'♥ 调息疗伤':s.area==='village'?'◈ 山河路引':isShop(s.area)?'↩ 离开店铺':'☾ 入夜休息')+'</button></div></div>'+ 
 '<div class="toolbar">'+(!dungeon?makeButton('每日乡约','bulletin'):'')+makeButton('山海手记','journal')+makeButton('山河路引','worldmap')+makeButton('游玩说明','help')+makeButton('存档卷宗','saves')+makeButton(dungeon?'回洞府':'九曜坊市',dungeon?'retreat':'sell')+'</div><div class="log" aria-live="polite">'+esc(s.log)+'</div><div id="v27-tabcontent">'+section()+'</div>'+ 
 '<div class="mini"><span>修行成就：经营 '+s.farmScore+' / 220　·　战斗 '+s.battleScore+' / 220</span><span>木材 '+s.wood+' · 矿石 '+s.stone+' · 灵鱼 '+s.fish+'</span></div>'+ 
 '<footer class="footer">V34 · 山海路引 · 原创像素修仙 · 五族人物双章委托 · 兼容 V27 存档</footer></div><div id="v27-modalhost"></div>';
 canvas=root.querySelector('canvas');ctx=canvas?.getContext('2d',{alpha:false});if(ctx)ctx.imageSmoothingEnabled=false;draw();renderModal();
}
function section(){const s=state;
 if(tab==='farm'&&s.mode==='farm'&&isShop(s.area))return '<section class="panel"><h3>'+SHOP_INFO[s.area].title+' · 百工之所</h3><p>'+SHOP_INFO[s.area].intro+'</p><div class="dailyhint">'+(s.area==='apothecary'?'问诊：'+(s.clinicDate===s.day?'今日已用':'可用'):'灵锄：'+(s.toolGrade?'已精锻':'未精锻'))+' · 掌柜 '+NMAP[SHOP_INFO[s.area].owner].name+'</div><div class="flex">'+makeButton('查看店铺商品','shop')+makeButton('查看掌柜服务','shopService')+makeButton('今日目标','journal')+makeButton('出门回小镇','shopExit')+'</div></section>';
 if(tab==='farm'&&s.mode==='farm'&&s.area==='river')return '<section class="panel"><h3>灵溪河岸 · 水声入梦</h3><p>桥西有灵鱼钓点与芦草，桥东可采溪石、煮茶休憩，沿古祠追索遗失的河神誓约。每日采集最多两次，奖励不能重复领取。</p><div class="dailyhint">水誓阶段 '+s.riverQuestStage+'/3 · 今日采集 '+(s.riverGatherDate===s.day?s.riverGatherCount:0)+'/2</div>'+makeButton('查看河岸地图','worldmap')+'</section>';
 if(tab==='farm'&&s.mode==='farm'&&s.area==='village')return '<section class="panel"><h3>万族小镇 · 百家烟火</h3><p>北街两家店铺可进入，东街石拱通往灵溪河岸：青禾药庐（药种与问诊）、赤炉铁坊（矿材与精锻灵锄）。五族邻人会沿街短程巡游，也可接取告示乡约。</p><div class="dailyhint">第'+s.day+'日 · '+seasonOf(s.day)+'令 · '+(s.day%7===0?'今日开放四时集会':'季末第七日有集会')+'</div><div class="flex">'+makeButton('与人物结缘','worldmap')+makeButton('查看乡约','bulletin')+makeButton('小镇坊市','sell')+makeButton('四时集会','festival')+'</div></section>';
 if(tab==='farm'&&s.mode==='farm'&&s.area==='house')return '<section class="panel"><h3>山居内室 · 一盏归灯</h3><p>木榻让你休息调息，符案可以用木材与矿石制作护符，灶台可将收获的灵草熬为滋养灵食；洞府扩建使安寝恢复更丰。</p><div class="dailyhint">灵糕 '+s.meals+'份 · 护符 '+s.wards+'枚 · 洞府 '+(s.houseLv?'已修葺':'可扩建')+'</div><div class="flex">'+makeButton('符案制作','workshop')+makeButton('灵食灶台','kitchen')+makeButton('查看背囊','inventory')+makeButton('安歇至明日','sleep')+'</div></section>';
 if(tab==='farm')return '<section class="panel"><div class="sectionlead"><h3>今日山居 · 四时物候</h3><button data-do="bulletin">▤ 山门告示</button></div><p>地图现有六处区域：灵圃种田、东侧进万族小镇、西北房门入洞府内室。可在镇内与五族相识，也可在灶台与符案制作灵食护符。</p><div class="dailyhint">今日天气：'+weatherOf(s.day)+'　·　作息：'+clockStr(s.minute)+'　·　'+(s.bulletinDate===s.day?'今日交货已完成':'每日可完成一份乡邻订单')+'</div><details class="v29-seedfold"><summary>种子行囊 · 选择／购买十种灵草 <span>展开种子图鉴 ▾</span></summary><div class="flex">'+CROPS.map(c=>'<div class="item"><b>'+c.name+' '+(s.selected===c.id?'✓':'')+'</b><small>'+c.days+'日成熟 · 收'+c.yield+'株 · 售'+c.price+'/株 · 功德'+c.score+'</small><small>'+(c.effect||c.desc)+'</small><small>种子 '+seedCount(s,c.id)+' · 已采 '+goodCount(s,c.id)+'</small>'+makeButton(s.selected===c.id?'已选中':'选此种', 'seed:'+c.id)+' '+makeButton('购种 '+c.cost,'buy:'+c.id)+'</div>').join('')+'</div></details>'+scoreBar(s.farmScore)+'<p>田园道业 '+s.farmScore+' / 220。完成后可独立达成「万家灯火」的经营毕业。</p><div class="flex">'+makeButton('灵鱼养殖 · '+s.pond.stock+'尾 / '+(s.pond.age>=2?'可收获':'成长'+s.pond.age.toFixed(1)+'日'),'pond')+makeButton('升级灵田阵法 · '+(s.farmLv?'已启':'需木8石8灵石50'),'farmUpgrade')+'</div></section>';
 if(tab==='npc')return '<section class="panel"><h3>山门人物 · 万族共居</h3><p>五名邻人多在万族小镇巡游；清晨沈禾、鱼迟或夜间青妩也会来访灵圃。地图走近交谈或馈赠，每日可获得一次交谈与一次馈赠好感。</p><div class="grid2">'+NPC.map(n=>'<div class="item"><b>'+n.name+' <span class="badge">'+n.race+'</span></b><small>'+n.job+' · 好感 '+(s.fav[n.id]||0)+'</small><small>'+n.habits[s.minute<720?0:s.minute<1080?1:2]+'</small>'+makeButton('查看并交谈','npc:'+n.id)+'</div>').join('')+'</div></section>';
 if(tab==='mission')return '<section class="panel"><h3>委托行 · 契书无欺</h3><p>花费灵石委托其他修士探访秘境；两日后收取情报与灵材。经营路线可通过委托积累道业，不必亲自战斗。</p><div class="item"><b>墨羽的秘境委托</b><small>费用：45灵石 / 耗时：2日 / 奖励：灵石70 + 随机灵材 + 经营功德18</small>'+(s.commission?'<small>委托中 · 余 '+Math.max(0,s.commission.due-s.day)+' 日</small>'+makeButton('查看委托进度','commission'):makeButton('签署委托','commission'))+'</div><h3 style="margin-top:14px">收集与物资</h3><p>资源点每日可采集三次，每日重置。灵草可售予坊市，以供购种、委托或修复伤势。</p><div class="flex">'+makeButton('打开坊市货箱','sell')+makeButton('查看收获背囊','inventory')+makeButton('保存与恢复','saves')+makeButton('运行自检','audit')+'</div></section>';
 const levels=DUNGEONS.map((d,i)=>'<div class="item"><b>'+['一','二','三'][i]+' · '+d.name+'</b><small>'+d.level+' · '+d.desc+'</small><small>首次通关功德 '+d.score+' · 宝物 '+d.reward+'</small>'+makeButton(s.cleared.includes(i)?'重入秘境':'进入挑战','dungeon:'+i)+'</div>').join('');
 return '<section class="panel"><h3>独立战斗线 · 闯荡三境</h3><p>WASD / 方向键移动，J 挥剑，K 施法，E 开宝箱。妖兽具有巡游、冲锋、游击、守门与闪现行为；战败可在山门复活。</p><div class="grid2">'+levels+'</div>'+scoreBar(s.battleScore)+'<p>斩妖道业 '+s.battleScore+' / 220；通关三境且功德足额即可独立获得「剑破三关」毕业印。</p>'+ 
 (s.wonFarm||s.wonFight?'<div class="endbanner"><strong>已取得证道印</strong><p>'+(s.wonFarm?'【万家灯火】经营圆满　':'')+(s.wonFight?'【剑破三关】战道告成':'')+'</p></div>':'')+'</section>';
}
let lastDraw=0,heroAnim='idle',heroUntil=0,walkPath=[],walkGoal=null,lastWalk=0,lastAI=0,lastAttack=0,lastCast=0,lastInvuln=0,active=false;
function img(key,x,y,w,h){const o=images[key];if(o){ctx.drawImage(o,Math.round(x),Math.round(y),w,h);return true}return false}
function ground(x,y){
 if(state.mode==='dungeon')return 'tiles/'+(state.dungeon===0?'forest':state.dungeon===1?'cave':'stone');
 if(state.area==='river'){
  if(RIVER_MAP[y][x]==='#')return 'tiles/forest';
  if(RIVER_MAP[y][x]==='~')return 'tiles/water';
  return y===4?'tiles/path':(x%3===0?'tiles/soil':'tiles/grass');
 }
 if(state.area==='village'){
  if(VILLAGE_MAP[y][x]==='#')return 'tiles/forest';
  if(y===2||x===5&&y>=2&&y<=6||y===5)return 'tiles/path';
  if(y===1||y===4)return 'tiles/grass';return 'tiles/soil';
 }
 if(state.area==='house'||isShop(state.area)){
   if((isShop(state.area)?SHOP_MAP:HOUSE_MAP)[y][x]==='#')return 'tiles/wall';
  return (x+y)%5===0?'tiles/soil':'tiles/path';
 }
 if(x===0||y===0||x===11)return 'tiles/forest';
 if(y===7)return 'tiles/grass';
 if((y===3&&x<8)||(x===7&&y>=3&&y<=6))return 'tiles/path';
 if((x>=3&&x<=6)&&(y===4||y===5))return 'tiles/soil';
 return 'tiles/grass';
}
function inBounds(x,y){return x>=0&&y>=0&&x<W&&y<H}
function isWall(x,y){if(!inBounds(x,y))return true;if(state.mode==='dungeon')return DUNGEONS[state.dungeon].map[y][x]==='#';if(state.area==='river')return RIVER_MAP[y][x]!=='.';if(state.area==='village')return VILLAGE_MAP[y][x]==='#';if(state.area==='house')return HOUSE_MAP[y][x]==='#';if(isShop(state.area))return SHOP_MAP[y][x]==='#';return x===0||x===11||y===0||y===7||x===1&&y===1||x===9&&y===1}
function drawLocale(x,y){
 const area=state.area;
 if(area==='river'){
  if(y===4&&(x===5||x===6))img('tiles/v33_bridge',x*T,y*T,T,T);
  if(spot(RIVER_SITES.gate,x,y))img('tiles/portal',x*T,y*T,T,T);
  if(spot(RIVER_SITES.reeds,x,y))img('tiles/v33_reeds',x*T,y*T,T,T);
  if(spot(RIVER_SITES.stone,x,y))img('tiles/rock',x*T,y*T,T,T);
  if(spot(RIVER_SITES.dock,x,y))img('tiles/pond',x*T,y*T,T,T);
  if(spot(RIVER_SITES.tea,x,y))img('tiles/v33_teahouse',x*T,y*T,T,T);
  if(spot(RIVER_SITES.shrine,x,y))img('tiles/altar',x*T,y*T,T,T);
  if(x===7&&y===1)img('tiles/v33_waterfall',x*T,y*T,T,T);
 }
 if(area==='village'){
  if(spot(VILLAGE_SITES.gate,x,y))img('tiles/portal',x*T,y*T,T,T);
  if(spot(VILLAGE_SITES.market,x,y))img('tiles/house',x*T,y*T,T,T);
   for(const name of ['apothecary','forge'])if(spot(VILLAGE_SITES[name],x,y)){
    img('tiles/house',x*T,y*T,T,T);ctx.fillStyle=name==='apothecary'?'#4e7866':'#8b563e';ctx.fillRect(x*T+8,y*T+7,48,12);
    ctx.fillStyle='#fff1d2';ctx.font='bold 15px serif';ctx.fillText(name==='apothecary'?'药':'铁',x*T+24,y*T+18);
   }
  if(spot(VILLAGE_SITES.bulletin,x,y))img('tiles/altar',x*T,y*T,T,T);
  if(spot(VILLAGE_SITES.river,x,y))img('tiles/portal',x*T,y*T,T,T);
  if(spot(VILLAGE_SITES.festival,x,y)){
   img('tiles/stone',x*T,y*T,T,T);ctx.fillStyle=state.day%7===0?'#e6c18a':'#7eaa8b';ctx.fillRect(x*T+23,y*T+18,17,10);
  }
  if([[2,1],[2,4],[9,5]].some(p=>spot(p,x,y)))img('tiles/'+(x===9?'house':'tree'),x*T,y*T,T,T);
  if(x===7&&y===4)img('tiles/flower',x*T,y*T,T,T);
 }
 if(isShop(area)){
  const sprites={vendor:'tiles/altar',shelf:area==='apothecary'?'tiles/flower':'tiles/stone',service:area==='apothecary'?'tiles/pond':'tiles/rock',exit:'tiles/portal'};
  for(const [name,pos] of Object.entries(SHOP_SITES))if(spot(pos,x,y))img(sprites[name],x*T,y*T,T,T);
  if(x===7&&y===1)img('tiles/fence',x*T,y*T,T,T);
 }
 if(area==='house'){
   const sprites={bed:'tiles/house',workbench:'tiles/altar',chest:'tiles/chest',hearth:'tiles/stone',exit:'tiles/portal'};
  for(const [name,pos] of Object.entries(HOUSE_SITES))if(spot(pos,x,y)){
   img(sprites[name],x*T,y*T,T,T);
   if(name==='hearth'){ctx.fillStyle='#e4a364';ctx.fillRect(x*T+26,y*T+27,13,10)}
  }
  if(x===6&&y===1)img('tiles/fence',x*T,y*T,T,T);
 }
}
function draw(){
 if(!active||!root||!ctx||root.hidden)return;
 ctx.imageSmoothingEnabled=false;ctx.fillStyle='#6e8d73';ctx.fillRect(0,0,W*T,H*T);
 const s=state,dungeon=s.mode==='dungeon',map=dungeon?DUNGEONS[s.dungeon].map:null;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const tile=dungeon?(map[y][x]==='#'?'tiles/'+(s.dungeon===0?'wall':'cavewall'):ground(x,y)):ground(x,y);
  img(tile,x*T,y*T,T,T);
  if(!dungeon&&s.area!=='farm'){drawLocale(x,y)}
  if(!dungeon&&s.area==='farm'){
   const p=PLOTS.findIndex(q=>q[0]===x&&q[1]===y);
   if(p>=0){img('tiles/tilled',x*T,y*T,T,T);const plot=s.plots[p];if(plot){const c=CROP[plot.crop],st=Math.min(2,Math.floor((plot.progress/c.days)*3));img('crops/'+plot.crop+'_'+st,x*T+12,y*T+18,40,40);if(plot.progress>=c.days){ctx.fillStyle='#e1d28e';ctx.fillRect(x*T+42,y*T+7,12,4)}}}
   if(x===1&&y===1)img('tiles/house',x*T,y*T,T,T);
   if(x===9&&y===1)img('tiles/pond',x*T,y*T,T,T);
   if(x===10&&y===6)img('tiles/portal',x*T,y*T,T,T);
   if(x===10&&y===2)img('tiles/tree',x*T,y*T,T,T);
   if(x===4&&y===1)img('tiles/altar',x*T,y*T,T,T);
   if(x===2&&y===2){img('tiles/fence',x*T,y*T,T,T);ctx.fillStyle='#a47b53';ctx.fillRect(x*T+15,y*T+13,34,26);ctx.strokeStyle='#523d2e';ctx.lineWidth=3;ctx.strokeRect(x*T+15,y*T+13,34,26);ctx.fillStyle='#ead6ac';ctx.fillRect(x*T+22,y*T+17,22,17);ctx.fillStyle='#7f533c';ctx.fillRect(x*T+26,y*T+22,14,2)}
   for(const n of NODES){if(n.x===x&&n.y===y)img('tiles/'+(n.type==='木'?'tree':n.type==='石'?'rock':'flower'),x*T,y*T,T,T)}
  }else if(dungeon){
   const m=map[y][x];if(m==='C')img('tiles/'+(s.opened.includes(s.dungeon+':'+x+':'+y)?'rock':'chest'),x*T,y*T,T,T);
   if(m==='B'&&!s.foes.some(e=>e.boss&&e.hp>0))img('tiles/altar',x*T,y*T,T,T);
   if(m==='E'&&s.foes.some(e=>e.x===x&&e.y===y&&e.hp>0)){
    // enemy sprite will be rendered atop terrain below
   }
  }
 }
 if(!dungeon)for(const n of NPC){const tr=npcTrack(n);if(!tr)continue;const f=Math.floor(performance.now()/(tr.walking?175:620))%4;img('characters/'+n.id+'_'+f,tr.px*T+6,tr.py*T+5,52,52);if(s.trackedQuest==='npc:'+n.id){ctx.strokeStyle='#ead88b';ctx.lineWidth=3;ctx.strokeRect(tr.px*T+7,tr.py*T+4,48,55)}if(s.area==='village'&&(s.storyStages?.[n.id]||0)<4){ctx.fillStyle='#41382b';ctx.fillRect(tr.px*T+9,tr.py*T-3,44,10);ctx.fillStyle='#f0d5a4';ctx.font='9px sans-serif';ctx.fillText(n.name,tr.px*T+12,tr.py*T+5)}}
 else for(const e of s.foes){if(e.hp<=0)continue;let f=Math.floor(performance.now()/220)%4;
  img('monsters/'+e.id+'_'+f,e.x*T+5,e.y*T+5,54,54);
  const p=e.hp/e.max;ctx.fillStyle='#2e3937';ctx.fillRect(e.x*T+10,e.y*T+4,44,5);ctx.fillStyle=e.boss?'#d49b72':'#97bd81';ctx.fillRect(e.x*T+11,e.y*T+5,Math.max(1,Math.floor(42*p)),3)
 }
 const step=Math.floor(performance.now()/190)%4,action=performance.now()<heroUntil?heroAnim:(walkPath.length?'walk':'idle');
 if(s.face==='left'){
  ctx.save();ctx.translate((s.x+1)*T,0);ctx.scale(-1,1);
  img('characters/cultivator_'+action+'_'+step,5,s.y*T+5,54,54);ctx.restore();
 }else img('characters/cultivator_'+action+'_'+step,s.x*T+5,s.y*T+5,54,54);
 if(s.mode==='dungeon'&&performance.now()<lastInvuln){ctx.strokeStyle='#f5e7b5';ctx.lineWidth=4;ctx.strokeRect(s.x*T+6,s.y*T+5,52,52)}
 if(walkGoal){ctx.strokeStyle='#f7e29d';ctx.lineWidth=2;ctx.strokeRect(walkGoal.x*T+4,walkGoal.y*T+4,56,56)}
 if(!dungeon){
  const season=seasonOf(s.day),tm=performance.now();
  if(season==='秋'){ctx.fillStyle='rgba(154,100,42,.11)';ctx.fillRect(0,0,W*T,H*T)}
  if(season==='冬'){ctx.fillStyle='rgba(141,170,183,.16)';ctx.fillRect(0,0,W*T,H*T)}
  if(season==='夏'){ctx.fillStyle='rgba(221,178,81,.08)';ctx.fillRect(0,0,W*T,H*T)}
  if(s.minute>=1080){ctx.fillStyle='rgba(18,22,53,'+(Math.min(.42,.12+(s.minute-1080)/1300))+')';ctx.fillRect(0,0,W*T,H*T)}
  if(['细雨','雷雨'].includes(weatherOf(s.day))){ctx.fillStyle='rgba(164,218,222,.54)';
   for(let i=0;i<47;i++){const x=(i*139+Math.floor(tm/60)*3)%(W*T),y=(i*113+Math.floor(tm/60)*9)%(H*T);ctx.fillRect(x,y,2,10)}}
  else{ctx.fillStyle=season==='秋'?'#d8b672':'#eff5d0';
   for(let i=0;i<15;i++){const x=(i*157+Math.floor(tm/90))%(W*T),y=(i*83+Math.floor(tm/120))%(H*T);ctx.fillRect(x,y,3,3)}}
 }
}
function syncHUD(){if(!root)return;const s=state;
 const clock=root.querySelector('.clock');if(clock)clock.textContent=clockStr(s.minute);
 const wallet=root.querySelectorAll('.wallet span');if(wallet.length===3){wallet[0].textContent='✧ '+s.gold+' 灵石';wallet[1].textContent='♥ '+s.hp+' 气血';wallet[2].textContent='✦ '+s.mp+' 灵力'}
 const energy=root.querySelector('.energyrow strong'),bar=root.querySelector('.energy-track i');if(energy)energy.textContent=Math.round(s.energy)+'/100';if(bar)bar.style.width=s.energy+'%';
 const log=root.querySelector('.log');if(log)log.textContent=s.log;
 const obj=root.querySelector('.v29-objective');if(obj){const o=objective(s);const b=obj.querySelector('b'),span=obj.querySelector('span'),small=obj.querySelector('small');if(b)b.textContent=o.title;if(span)span.textContent=o.detail;if(small)small.textContent=o.hint;}
}
function isTargetTile(x,y){
 if(state.mode==='dungeon')return DUNGEONS[state.dungeon].map[y]?.[x]==='C'||
     DUNGEONS[state.dungeon].map[y]?.[x]==='B'||state.foes.some(e=>e.hp>0&&e.x===x&&e.y===y);
 if(state.area==='house')return atSite(HOUSE_SITES,x,y);
  if(isShop(state.area))return atSite(SHOP_SITES,x,y);
 if(state.area==='village')return atSite(VILLAGE_SITES,x,y)||NPC.some(n=>{const [a,b]=npcPos(n);return a===x&&b===y});
 if(state.area==='river')return atSite(RIVER_SITES,x,y)||NPC.some(n=>{const [a,b]=npcPos(n);return a===x&&b===y});
 return PLOTS.some(([a,b])=>a===x&&b===y)||NPC.some(n=>{const [a,b]=npcPos(n);return a===x&&b===y})||
        NODES.some(n=>n.x===x&&n.y===y)||[[9,1],[10,6],[2,2],[4,1],[1,1],[10,3]].some(([a,b])=>a===x&&b===y);
}
function canStep(x,y){
 if(isWall(x,y))return false;
 if(state.mode==='dungeon')return !state.foes.some(e=>e.hp>0&&e.x===x&&e.y===y);
 if(state.area==='house'&&atSite(HOUSE_SITES,x,y))return false;
  if(isShop(state.area)&&atSite(SHOP_SITES,x,y))return false;
 if(state.area==='village'&&atSite(VILLAGE_SITES,x,y))return false;
 if(state.area==='river'&&atSite(RIVER_SITES,x,y))return false;
 return !NPC.some(n=>{const [a,b]=npcPos(n);return a===x&&b===y});
}
function move(dir){if(!active||modal||root?.hidden)return;
 const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!delta)return;
 walkPath=[];walkGoal=null;const [dx,dy]=delta,x=state.x+dx,y=state.y+dy;
 if(!canStep(x,y)){notify('前方有人物、妖兽或障碍，无法通行。');return}
 const ok=change(s=>{s.x=x;s.y=y;s.face=dir;if(s.mode==='farm')s.minute=Math.min(1380,s.minute+3);},{quiet:true});
 if(ok){lastWalk=performance.now();heroAnim='walk';heroUntil=lastWalk+230}
}
function pathTo(tx,ty){
 const start=[state.x,state.y],q=[start],parent=new Map([[start.join(','),null]]),moves=[[1,0],[-1,0],[0,1],[0,-1]];
 const interaction=isTargetTile(tx,ty);const goals=new Set();
 if(interaction||!canStep(tx,ty))for(const [dx,dy] of moves){const nx=tx+dx,ny=ty+dy;if(canStep(nx,ny))goals.add(nx+','+ny)}
 else goals.add(tx+','+ty);
 if(!goals.size)return [];
 let found=null;
 while(q.length){const [x,y]=q.shift(),k=x+','+y;if(goals.has(k)){found=k;break}
  for(const [dx,dy] of moves){const a=x+dx,b=y+dy,kk=a+','+b;if(!canStep(a,b)||parent.has(kk))continue;parent.set(kk,k);q.push([a,b])}}
 if(!found)return [];
 const res=[];while(found&&found!==start.join(',')){const [x,y]=found.split(',').map(Number);res.unshift([x,y]);found=parent.get(found)}return res;
}
function clickTile(x,y){if(!active||modal||!inBounds(x,y))return;
 const dist=Math.abs(state.x-x)+Math.abs(state.y-y),target=isTargetTile(x,y);
 if(dist<=1){
  if(target){interactAt(x,y);return}
  if(dist===1){const dir=x>state.x?'right':x<state.x?'left':y>state.y?'down':'up';move(dir)}
  return;
 }
 const p=pathTo(x,y);
 if(p.length){const chasing=NPC.find(n=>{const [nx,ny]=npcPos(n);return nx===x&&ny===y});walkPath=p;walkGoal={x,y,interact:target,npc:chasing?.id||null,retries:0};state.log=target?'走近目标，准备交互……':'沿山道前往所选位置……';syncHUD()}
 else notify('此处有禁墙或守卫，无法抵达。');
}
function moveQueued(time){if(!walkPath.length||modal||root?.hidden)return;if(time-lastWalk<135)return;
 const [x,y]=walkPath[0];
 if(!canStep(x,y)){walkPath=[];walkGoal=null;return}
 const dx=x-state.x,dy=y-state.y;
 const ok=change(s=>{s.x=x;s.y=y;s.face=dx>0?'right':dx<0?'left':dy>0?'down':'up';if(s.mode==='farm')s.minute=Math.min(1380,s.minute+3);},{quiet:true});
 if(!ok){walkPath=[];walkGoal=null;return}
 walkPath.shift();lastWalk=time;heroAnim='walk';heroUntil=time+230;
 if(!walkPath.length){const goal=walkGoal;walkGoal=null;
  if(goal?.npc){const n=NMAP[goal.npc],pos=npcPos(n);if(Math.abs(state.x-pos[0])+Math.abs(state.y-pos[1])<=1)speak(n.id);else if(goal.retries<2){clickTile(pos[0],pos[1]);if(walkGoal)walkGoal.retries=goal.retries+1;}else notify(n.name+'已沿街走远，请再靠近。')}
   else if(goal?.interact&&Math.abs(state.x-goal.x)+Math.abs(state.y-goal.y)<=1)interactAt(goal.x,goal.y)}
}
function nearby(x,y,r=1){return Math.abs(state.x-x)+Math.abs(state.y-y)<=r}
function targetNear(){if(state.mode==='dungeon'){
  const ds=DUNGEONS[state.dungeon],spots=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(ds.map[y][x]==='C'&&!state.opened.includes(state.dungeon+':'+x+':'+y))spots.push({x,y});
  return spots.sort((a,b)=>Math.abs(state.x-a.x)+Math.abs(state.y-a.y)-Math.abs(state.x-b.x)-Math.abs(state.y-b.y))[0]||null;
 }
 if(state.area!=='farm'){const targets=state.area==='river'?[...Object.values(RIVER_SITES).map(([x,y])=>({x,y,dist:Math.abs(state.x-x)+Math.abs(state.y-y)})),...NPC.filter(n=>npcHere(n)).map(n=>{const [x,y]=npcPos(n);return{x,y,dist:Math.abs(state.x-x)+Math.abs(state.y-y)}})]: (state.area==='house'||isShop(state.area))?Object.values(isShop(state.area)?SHOP_SITES:HOUSE_SITES).map(([x,y])=>({x,y,dist:Math.abs(state.x-x)+Math.abs(state.y-y)})):
  [...Object.values(VILLAGE_SITES).map(([x,y])=>({x,y,dist:Math.abs(state.x-x)+Math.abs(state.y-y)})),...NPC.filter(n=>npcHere(n)).map(n=>{const [x,y]=npcPos(n);return {x,y,dist:Math.abs(state.x-x)+Math.abs(state.y-y)}})];
  return targets.filter(v=>v.dist<=1).sort((a,b)=>a.dist-b.dist)[0]||null;}
 const t=[...PLOTS.map(([x,y],i)=>({x,y,p:i,dist:Math.abs(state.x-x)+Math.abs(state.y-y)})),...NPC.map(n=>{const [x,y]=npcPos(n);return{x,y,npc:n.id,dist:Math.abs(state.x-x)+Math.abs(state.y-y)}}),{x:9,y:1,dist:Math.abs(state.x-9)+Math.abs(state.y-1)},{x:10,y:6,dist:Math.abs(state.x-10)+Math.abs(state.y-6)},...NODES.map(n=>({...n,dist:Math.abs(state.x-n.x)+Math.abs(state.y-n.y)}))];
 return t.filter(t=>t.dist<=1).sort((a,b)=>(a.p===undefined?1:0)-(b.p===undefined?1:0))[0]||null;
}
function interact(){if(state.mode==='farm'&&state.tool==='rod')return fishing();if(state.mode==='farm'&&state.tool==='food')return eatFood();const t=targetNear();if(!t){notify('身旁暂未发现可交互之物。');return}interactAt(t.x,t.y)}
function interactAt(x,y){
 if(state.mode==='dungeon'){
  const d=DUNGEONS[state.dungeon];if(d.map[y]?.[x]==='C')return chest(x,y);
  const foe=state.foes.find(e=>e.hp>0&&e.x===x&&e.y===y);if(foe)return attack();
  if(d.map[y]?.[x]==='B'&&state.foes.some(e=>e.hp>0))return notify('古坛守卫尚在，先清除妖兽。');
  return notify('石道幽深，未见可取之物。')
 }
 if(state.area==='house')return houseInteract(x,y);
  if(isShop(state.area))return shopInteract(x,y);
 if(state.area==='village')return villageInteract(x,y);
 if(state.area==='river')return riverInteract(x,y);
 const plot=PLOTS.findIndex(p=>p[0]===x&&p[1]===y);if(plot>=0)return applyTool(plot);
 const n=NPC.find(n=>{const p=npcPos(n);return p[0]===x&&p[1]===y});if(n)return speak(n.id);
 if(x===9&&y===1)return state.tool==='rod'?fishing():pondMenu();if(x===10&&y===6)return chooseDungeon();
 const node=NODES.find(n=>n.x===x&&n.y===y);if(node)return gather(node);
 if(x===2&&y===2)return showBulletin();
 if(x===4&&y===1)return modalBox('残坛一念','旧碑模糊，似有九曜星纹。若想追索青妩的旧誓，请返回原版文字篇，进入璇玑秘境触发《空坛旧誓》。');
 if(x===10&&y===3)return transfer('village');
 if(x===1&&y===1)return transfer('house');
 notify('此处一片清宁，暂无可取之物。');
}
function transfer(area){
 if(state.mode!=='farm'||!AREAS[area]||state.area===area)return false;
 if(isShop(area)&&state.area!=='village')return false;
 if(area==='river'&&state.area!=='village')return false;
 if(area==='village'&&!['farm','river','apothecary','forge'].includes(state.area))return false;
  if(isShop(area)&&(state.minute<480||state.minute>=1260)){notify('商铺每日08:00至21:00开门，眼下门扉已闭。');return false}
  const oldArea=state.area;
  const dest=area==='farm'?(state.area==='house'?[2,1]:[9,3]):area==='house'?[5,5]:area==='river'?[2,4]:area==='village'?(oldArea==='river'?[9,4]:oldArea==='apothecary'?[3,2]:oldArea==='forge'?[9,2]:[2,6]):[5,5];
 const ok=change(s=>{s.area=area;s.x=dest[0];s.y=dest[1];s.face='down';s.minute=Math.min(1380,s.minute+5);
  s.log=area==='river'?'穿过东街石拱，灵溪水声拂面。':area==='house'?'推开洞府木门，炉香未冷。':isShop(area)?'推门进入'+SHOP_INFO[area].title+'。':area==='village'?'回到万族小镇，市井烟火正好。':'沿石阶归山，灵田清风如旧。';},{quiet:true});
 if(ok){walkPath=[];walkGoal=null;modal=null;render();}return ok;
}
function villageInteract(x,y){
 const n=NPC.find(n=>{const p=npcPos(n);return p[0]===x&&p[1]===y});if(n)return speak(n.id);
 if(spot(VILLAGE_SITES.gate,x,y))return transfer('farm');
  if(spot(VILLAGE_SITES.apothecary,x,y))return transfer('apothecary');
  if(spot(VILLAGE_SITES.forge,x,y))return transfer('forge');
 if(spot(VILLAGE_SITES.market,x,y))return sell();
 if(spot(VILLAGE_SITES.bulletin,x,y))return showBulletin();
 if(spot(VILLAGE_SITES.festival,x,y))return festival();
 if(spot(VILLAGE_SITES.river,x,y))return transfer('river');
 notify('街巷中有风铃轻响，山民往来不绝。');
}
function houseInteract(x,y){
 if(spot(HOUSE_SITES.exit,x,y))return transfer('farm');
 if(spot(HOUSE_SITES.bed,x,y))return modalBox('山居安歇 · 木榻','入夜心静，归床便可调息。安歇至翌日，恢复体力，并推进灵田与委托。',[{label:'安寝至明日',on:'sleep',primary:true},{label:'暂且不睡',on:'close'}]);
 if(spot(HOUSE_SITES.workbench,x,y))return workshop();
 if(spot(HOUSE_SITES.chest,x,y))return inventory();
 if(spot(HOUSE_SITES.hearth,x,y))return kitchen();
 notify('屋内灯火温然，窗纸映着草木之影。');
}

// V33 灵溪河岸：采集、茶摊与三阶段水誓。所有奖励都在 change() 的持久化事务中结算。
function riverInteract(x,y){
 const n=NPC.find(n=>{const p=npcPos(n);return p[0]===x&&p[1]===y});if(n)return speak(n.id);
 if(spot(RIVER_SITES.gate,x,y))return transfer('village');
 if(spot(RIVER_SITES.reeds,x,y))return riverForage('reeds');
 if(spot(RIVER_SITES.stone,x,y))return riverForage('stone');
 if(spot(RIVER_SITES.dock,x,y))return fishing();
 if(spot(RIVER_SITES.tea,x,y))return riverTea();
 if(spot(RIVER_SITES.shrine,x,y))return riverShrine();
 notify('灵溪流水自东而来，隔岸云林未歇。');
}
function riverForage(type){
 if(state.mode!=='farm'||state.area!=='river')return notify('须亲临灵溪采集。');
 const count=state.riverGatherDate===state.day?state.riverGatherCount:0;
 if(count>=2)return notify('河岸灵物今日已采足两次，明日再来。');
 if(state.energy<5||state.minute>=1380)return notify('采集需5点体力，夜深请休息。');
 const rain=['细雨','雷雨'].includes(weatherOf(state.day));
 return change(s=>{
  cost(s,5,18);
  if(s.riverGatherDate!==s.day){s.riverGatherDate=s.day;s.riverGatherCount=0}
  if(s.riverGatherCount>=2)throw Error('今日采集次数耗尽');s.riverGatherCount++;
  if(type==='reeds'){s.wood+=rain?2:1;s.gold+=4;s.farmScore+=3;s.log='采得灵溪芦木 '+(rain?2:1)+'、灵石4，道业+3。';}
  else {s.stone+=1;s.gold+=rain?8:5;s.farmScore+=3;s.log='拾得溪底水纹石，矿石+1、灵石+'+(rain?8:5)+'，道业+3。'}
  checkWin(s);
 });
}
function riverTea(){
 if(state.mode!=='farm'||state.area!=='river')return notify('须前往河岸茶摊。');
 modalBox('烟波茶摊 · 岁月一盏','<p>竹篷下茶烟轻浮。老茶客言：“求仙者多忘饮水，今日不妨歇一歇。”</p><p>一盏灵溪暖茶需18灵石，恢复体力22、灵力8，每日最多一次。未饮茶也可在此歇望流水。</p><p>今日：'+(state.riverTeaDate===state.day?'已饮':'可饮')+' · 灵石 '+state.gold+'</p>',[{label:'温茶一盏 · 18灵石',on:'riverTeaDrink',primary:true},{label:'坐听溪声',on:'close'}]);
}
function riverTeaDrink(){
 if(state.mode!=='farm'||state.area!=='river'||state.riverTeaDate===state.day||state.gold<18)return notify('茶已售罄，或灵石不足。');
 if(state.energy>=100&&state.mp>=50)return notify('精神尚足，不必浪费好茶。');
 const ok=change(s=>{if(s.riverTeaDate===s.day||s.gold<18)throw Error('今日已饮茶或资金不足');s.gold-=18;s.riverTeaDate=s.day;s.energy=Math.min(100,s.energy+22);s.mp=Math.min(50,s.mp+8);s.minute=Math.min(1380,s.minute+15);s.log='饮一盏溪茶，体力+22、灵力+8，灵石−18。'});
 if(ok){modal=null;render()}return ok;
}
function riverShrine(){
 if(state.mode!=='farm'||state.area!=='river')return notify('须走近河岸旧祠。');
 const q=state.riverQuestStage;
 if(q===0)return modalBox('灵溪旧祠 · 无名水誓','半塌祠门悬着一道旧符，碑上仅余“救一河，勿争一日”。水中藏着几缕残魂，似待有人重书旧约。',[{label:'记下古誓',on:'riverPledge',primary:true},{label:'暂且离开',on:'close'}]);
 if(q===1)return modalBox('灵溪旧祠 · 修碑','欲修残祠，需木材2与矿石2，也可捐灵石45代为采办。'+(state.day<=state.riverQuestSince?'<p>古祠仍带今日灵气，可立即修碑，待明日再来归流。</p>':''),[{label:'献木材2、矿石2',on:'riverOffer:materials',primary:true},{label:'资助灵石45',on:'riverOffer:gold'},{label:'先去筹备',on:'close'}]);
 if(q===2){if(state.day<=state.riverQuestSince)return modalBox('灵溪旧祠 · 静候潮声','木石新立，水纹尚未归位。需过一夜，方能复读古誓。');
 return modalBox('灵溪旧祠 · 归流水印','隔日溪涨三寸，古符重现最后一笔。此番若放归水灵，便可收取守护河道的信物。',[{label:'放归水灵 · 完成支线',on:'riverRelease',primary:true},{label:'暂且不动',on:'close'}]);}
 return modalBox('灵溪旧祠 · 旧誓已解','碑上朱纹归静，河水依旧东流。你的行囊中藏有「灵溪水誓」，此祠不再重复赠礼。');
}
function riverPledge(){if(state.area!=='river'||state.riverQuestStage!==0)return notify('古誓已记。');
 const ok=change(s=>{s.riverQuestStage=1;s.riverQuestSince=s.day;s.notes.push('灵溪旧祠：旧誓未尽，修碑需木材二、矿石二，或45灵石。');s.log='你记下失落古誓。河岸残魂似有所应。'});
 if(ok){modal=null;riverShrine()}return ok;
}
function riverOffer(method){if(state.area!=='river'||state.riverQuestStage!==1)return notify('须先探明旧誓。');
 if(method==='materials'&&(state.wood<2||state.stone<2))return notify('木材或矿石不足。');
 if(method==='gold'&&state.gold<45)return notify('赎旧约需45灵石。');
 const ok=change(s=>{if(method==='materials'){if(s.wood<2||s.stone<2)throw Error('材料不足');s.wood-=2;s.stone-=2;}else{if(s.gold<45)throw Error('灵石不足');s.gold-=45;}
  s.riverQuestStage=2;s.riverQuestSince=s.day;s.log='旧祠残碑重立。静候一夜，听水灵复鸣。';});
 if(ok){modal=null;riverShrine()}return ok;
}
function riverRelease(){if(state.area!=='river'||state.riverQuestStage!==2||state.day<=state.riverQuestSince)return notify('水灵尚未应誓，须过一夜。');
 const ok=change(s=>{if(s.riverQuestStage!==2||s.day<=s.riverQuestSince)throw Error('古誓条件尚未满足');s.riverQuestStage=3;s.items.push('灵溪水誓');s.notes.push('灵溪河神旧约：以木石重立残祠，隔夜放归水灵；誓言不以族别论善恶。');s.fish+=2;s.farmScore+=25;s.log='【灵溪水誓】水灵得归，灵鱼+2、田园道业+25，古祠再无回报。';checkWin(s)});
 if(ok){modal=null;render()}return ok;
}

// V31 商铺：购买、问诊、精锻均通过 change() 先写磁盘，失败不扣款。
const SHOP_PRODUCTS={
 dewpack:{area:'apothecary',name:'凝露种囊×3',price:23,crop:'dewleaf',qty:3},
 frostpack:{area:'apothecary',name:'霜魄种囊×2',price:28,crop:'frostroot',qty:2},
 moonpack:{area:'apothecary',name:'月华种囊×2',price:52,crop:'moonorchid',qty:2}
};
function showShop(){
 const area=state.area;if(!isShop(area))return notify('请走入药庐或铁坊查看货架。');
 if(area==='apothecary')return modalBox('青禾药庐 · 灵种铺',
  '<p>晨露育苗，药香满架。货品皆明码标价；购买不额外赠送道业。</p><p>你有 '+state.gold+' 灵石。</p><div class="grid2">'+
  Object.entries(SHOP_PRODUCTS).map(([id,p])=>makeButton(p.name+' · '+p.price+'灵石','shopBuy:'+id)).join('')+'</div>',[{label:'收起货架',on:'close'}]);
 return modalBox('赤炉铁坊 · 山材铺',
  '<p>铁柏说：“矿木有价，锻器更不可偷工。”购买急供只可每日一次，避免以买卖循环刷资财。</p><p>木 '+state.wood+' · 石 '+state.stone+' · 灵石 '+state.gold+' · 今日急供 '+(state.packDate===state.day?'已领取':'可购买')+'</p><div class="grid2">'+makeButton('山材包 木2石2 · 45灵石','shopPack')+makeButton('精锻灵锄 · 升级','shopService')+'</div>',[{label:'离开货架',on:'close'}]);
}
function shopBuy(id){const p=SHOP_PRODUCTS[id];if(!p||state.mode!=='farm'||state.area!==p.area)return notify('须在对应店铺选购。');
 if(!shopOpen())return notify('打烊之后不能购买，明日再来。');
 if(state.gold<p.price)return notify('灵石不足，不能购买。');
 const ok=change(s=>{if(s.gold<p.price)throw Error('余资不足');s.gold-=p.price;s.seeds[p.crop]=(s.seeds[p.crop]||0)+p.qty;s.log='从药庐买到'+p.name+'，支出'+p.price+'灵石。'});
 if(ok)showShop();return ok;
}
function shopService(){if(!isShop(state.area))return notify('请先进入商铺。');
 if(state.area==='apothecary')return modalBox('沈禾 · 青禾问诊',
  '<p>药师以灵泉煎汤，可恢复气血35、灵力15。每日限一次，需20灵石。若气血灵力皆满便无需问诊。</p><p>今日：'+(state.clinicDate===state.day?'已问诊':'尚可问诊')+' · 灵石 '+state.gold+'</p>',
  [{label:'煎汤问诊 · 20灵石',on:'shopClinic',primary:true},{label:'离开药案',on:'close'}]);
 return modalBox('铁柏 · 精锻灵锄',
  '<p>灵锄一次改良，之后在灵圃种植、浇水、收割等需要至少2体力的行动，消耗体力减少1点。不直接影响秘境攻击力。</p><p>费用：灵石90、木材6、矿石5。当前：'+(state.toolGrade?'精锻完成':'尚未精锻')+'</p>',
  [{label:'精锻农具',on:'shopForge',primary:true},{label:'暂且不锻',on:'close'}]);
}
function shopClinic(){if(!shopOpen())return notify('药庐已打烊，明日辰时再来。');if(state.area!=='apothecary'||state.mode!=='farm'||state.clinicDate===state.day||state.gold<20||(state.hp>=100&&state.mp>=50))return notify('问诊需在药庐、当日未用、灵石足够且有伤耗。');
 const ok=change(s=>{if(s.clinicDate===s.day)throw Error('当日已问诊');s.gold-=20;s.hp=Math.min(100,s.hp+35);s.mp=Math.min(50,s.mp+15);s.clinicDate=s.day;s.minute=Math.min(1380,s.minute+20);s.log='沈禾温汤诊脉：气血+35、灵力+15，灵石−20。'});
 if(ok)shopService();return ok;
}
function shopPack(){if(!shopOpen())return notify('铁坊已打烊，明日再来。');if(state.area!=='forge'||state.mode!=='farm'||state.packDate===state.day||state.gold<45)return notify('山材包需在铁坊购买，每日限一次，费用45灵石。');
 const ok=change(s=>{if(s.packDate===s.day)throw Error('今日急供已售');s.gold-=45;s.wood+=2;s.stone+=2;s.packDate=s.day;s.log='购得山材包：木材2、矿石2；灵石−45。'});
 if(ok)showShop();return ok;
}
function shopForge(){if(!shopOpen())return notify('铁坊已打烊，明日再来。');if(state.area!=='forge'||state.mode!=='farm'||state.toolGrade||state.gold<90||state.wood<6||state.stone<5)return notify('精锻需要灵石90、木材6、矿石5；不可重复升级。');
 const ok=change(s=>{if(s.toolGrade)throw Error('已有精锻农具');s.gold-=90;s.wood-=6;s.stone-=5;s.toolGrade=1;s.notes.push('赤炉铁坊：铁柏重铸灵锄，减轻灵圃劳作负担。');s.log='精锻灵锄完工，往后农事劳作省去1点体力。'});
 if(ok)shopService();return ok;
}
function shopInteract(x,y){
 if(spot(SHOP_SITES.exit,x,y))return transfer('village');
 if(spot(SHOP_SITES.vendor,x,y))return speak(SHOP_INFO[state.area].owner);
 if(spot(SHOP_SITES.shelf,x,y))return showShop();
 if(spot(SHOP_SITES.service,x,y))return shopService();
 notify('木窗透入晨光，店中货物摆放齐整。');
}
function worldmap(){
 modalBox('山河路引 · 六处可访之地',
 '<div class="v30-region-list"><p><b>一 · 九曜灵圃</b>　灵田八畦、灵池、资源点、秘境门、乡约告示与洞府门。</p>'+ 
 '<p><b>二 · 万族小镇</b>　从灵圃东侧石径入镇。青丘狐族、妖族铁匠、灵族渔师及人魔修士各有昼夜作息，中央广场七日一会。</p>'+ 
 '<p><b>三 · 山居内室</b>　从灵圃西北房门入内。木榻休息、灶台炼食、符案绘符、箱柜查看背囊。</p>'+
  '<p><b>四 · 青禾药庐</b>　小镇北街西侧，08:00—21:00开放。种囊和每日问诊。</p>'+
  '<p><b>五 · 赤炉铁坊</b>　小镇北街东侧，08:00—21:00开放。山材包与永久精锻灵锄。</p>'+
 '<p><b>六 · 灵溪河岸</b>　小镇东街石拱外，跨溪木桥、每日采集、河岸溪钓、烟波茶摊、河神旧誓。返回西岸石拱即可入镇。</p></div>'+ 
 '<p>当前所在：<strong>'+areaName(state)+'</strong>。在地图上点击入口可自动寻路并跨区域；跨区域只在存档成功时生效。</p>');
}
function festival(){
 if(state.day%7!==0)return modalBox('四时广场','木台尚空，灯绳未挂。每七日逢季末，五族邻人会在此交换食粮、故事与器物。');
 if(state.festivalDate===state.day)return modalBox('四时集会','今季集会已经参加。灯火犹在，重礼却不能领取第二次。');
 modalBox('四时集会 · '+seasonOf(state.day)+'末','七日一会，千家灯火聚于石台。铁柏打铁，鱼迟分茶，墨羽展契，青妩听歌。今日与邻人共饮一盏，记作丰年善因。',[{label:'参加集会',on:'claimFestival',primary:true},{label:'改日再来',on:'close'}]);
}
function claimFestival(){
 if(state.mode!=='farm'||state.area!=='village'||state.day%7!==0||state.festivalDate===state.day)return notify('今日不能再领取集会奖励。');
 const ok=change(s=>{s.festivalDate=s.day;s.farmScore+=12;s.gold+=12;s.energy=Math.min(100,s.energy+10);
 for(const n of NPC)s.fav[n.id]=Math.min(100,(s.fav[n.id]||0)+2);
 s.notes.push('四时集会·第'+s.day+'日：万族共饮一盏青茶，旧俗得续。');s.log='四时集会圆满：灵石+12、经营道业+12、全员好感+2。';checkWin(s)});
 if(ok){modal=null;render()}
}
function workshop(){
 const s=state;
 modalBox('符案 · 守山百工','<p>从矿石与山木中炼取护身符，一次受击可减免一半伤害（最多持有九枚）。亦可将洞府修葺成真正可居之所。</p>'+ 
 '<p>持有：护身符 '+s.wards+'/9 · 洞府扩建 '+(s.houseLv?'已完成':'未完成')+'</p><div class="grid2">'+
 makeButton('绘护身符 · 木2石2灵石20','craftWard')+makeButton('洞府扩建 · 木12石10灵石150','upgradeHouse')+'</div>',[{label:'收起工具',on:'close'}]);
}
function craftWard(){
 if(state.mode!=='farm'||state.area!=='house'||state.wards>=9||state.wood<2||state.stone<2||state.gold<20){notify('绘符需在屋内符案，备木2、矿石2、灵石20，且最多持九枚。');return}
 const ok=change(s=>{s.wood-=2;s.stone-=2;s.gold-=20;s.wards++;s.log='绘成一枚避祸符，秘境受击时可减半伤害。';});
 if(ok)workshop();
}
function upgradeHouse(){
 if(state.mode!=='farm'||state.area!=='house'||state.houseLv||state.wood<12||state.stone<10||state.gold<150){notify('扩建需在洞府内，备木12、矿石10与灵石150。');return}
 const ok=change(s=>{s.wood-=12;s.stone-=10;s.gold-=150;s.houseLv=1;s.farmScore+=24;s.notes.push('洞府扩建：山木为梁，旧石为基，山居能更安定地调息修行。');s.log='九曜洞府扩建完成：经营道业+24。安寝时额外恢复体力与养心。';checkWin(s)});
 if(ok)workshop();
}
function kitchen(){
 modalBox('山居灶台 · 灵食','每两份星穗谷与一份凝露叶，皆可熬炼成两份静心灵糕。每份可恢复45点体力；不替代正常种田与修行。<p>已有灵糕 '+state.meals+' 份，星穗谷 '+goodCount(state,'stargrain')+'、凝露叶 '+goodCount(state,'dewleaf')+'。</p>',
 [{label:'熬制灵糕×2',on:'cook',primary:true},{label:'食用一份灵糕',on:'eatMeal'},{label:'收起灶火',on:'close'}]);
}
function cook(){
 if(state.mode!=='farm'||state.area!=='house'||goodCount(state,'stargrain')<2||goodCount(state,'dewleaf')<1){notify('需星穗谷×2及凝露叶×1，才能开炉炼食。');return}
 const ok=change(s=>{cost(s,5,25);s.goods.stargrain-=2;s.goods.dewleaf-=1;s.meals+=2;s.log='灶烟升起，炼成静心灵糕×2。'});
 if(ok)kitchen();
}
function eatMeal(){if(state.mode!=='farm'||state.meals<=0||state.energy>=100){notify('暂无灵糕，或体力已充盈。');return}
 const ok=change(s=>{s.meals--;s.energy=Math.min(100,s.energy+45);s.log='食下一份静心灵糕，体力恢复45。'});
 if(ok){if(state.area==='house')kitchen();else render()}
}
function showBulletin(){if(state.mode!=='farm')return;const q=questFor(state.day),done=state.bulletinDate===state.day;
 modalBox('山门告示 · '+seasonOf(state.day)+'日乡约','<p>第 '+state.day+' 日 · '+weatherOf(state.day)+'</p><p>【乡邻求购】'+q.name+' ×'+q.need+'。完成可获灵石 '+q.reward+'、田园道业 '+q.score+'，并提升乡邻好感。</p><p>现有存货：'+(q.id==='fish'?state.fish:goodCount(state,q.id))+'　·　'+(done?'今日已交货':'每日仅可结算一次')+'</p>',[{label:done?'已完成':('交付 '+q.name),on:done?'close':'deliver',primary:!done},{label:'稍后再来',on:'close'}]);}
function deliver(){if(state.mode!=='farm')return;const q=questFor(state.day);
 if(state.bulletinDate===state.day){notify('今日订单已交，不可重复领取奖励。');return}
 if((q.id==='fish'?state.fish:goodCount(state,q.id))<q.need){notify('交货数量不足：需要 '+q.name+' ×'+q.need);return}
 const ok=change(s=>{if(s.bulletinDate===s.day)throw Error('今日已交货');
 if(q.id==='fish')s.fish-=q.need;else s.goods[q.id]-=q.need;
 s.bulletinDate=s.day;s.gold+=q.reward;s.farmScore+=q.score;s.fav[q.npc]=Math.min(100,(s.fav[q.npc]||0)+3);cost(s,0,20);
 s.log='乡约交货完成：'+q.name+' ×'+q.need+'，灵石 +'+q.reward+'，道业 +'+q.score+'。';checkWin(s)});
 if(ok){modal=null;render()}}
function eatFood(){if(state.mode!=='farm')return;if(state.food<=0){notify('干粮已用尽，坊市可购买。');return}
 if(state.energy>=100){notify('体力充沛，无须进食。');return}
 change(s=>{s.food--;s.energy=Math.min(100,s.energy+28);s.minute=Math.min(1380,s.minute+10);s.log='吃下一份灵麦干粮，体力恢复28。'})}
function buyFood(){if(state.mode!=='farm'||state.gold<16){notify('购买干粮需16灵石。');return}
 change(s=>{s.gold-=16;s.food++;s.log='从山门坊市购得灵麦干粮一份。'})}
function usePlot(i){if(state.mode!=='farm'||state.area!=='farm')return notify('灵田只可在九曜灵圃耕作。');const p=state.plots[i];if(!p){const c=CROP[state.selected];if(seedCount(state,c.id)<1){notify(c.name+'的种子不足，可在灵田面板购买。');return}
  change(s=>{cost(s,3,15);s.seeds[c.id]-=1;s.plots[i]={crop:c.id,progress:0,watered:-1};s.log='埋下一粒'+c.name+'，静候日月轮转。'});return
 }
 const c=CROP[p.crop];if(p.progress<c.days){notify(c.name+'尚需'+Math.ceil(c.days-p.progress)+'日成熟，可浇灌后休息。');return}
 change(s=>{cost(s,2,10);s.plots[i]=null;s.goods[c.id]=(s.goods[c.id]||0)+c.yield;s.farmScore+=c.score;let bonus='';if(c.id==='stargrain'){s.food++;bonus='，灵麦干粮 +1'}else if(c.id==='frostroot'){s.mp=Math.min(50,s.mp+4);bonus='，灵力恢复4'}else if(c.id==='thundergrass'){s.mp=Math.min(50,s.mp+10);bonus='，灵力恢复10'}else if(c.id==='spiritlotus'){s.energy=Math.min(100,s.energy+12);bonus='，体力恢复12'}else if(c.id==='bloodginseng'){s.hp=Math.min(100,s.hp+20);bonus='，气血恢复20'}s.log='收取'+c.name+' ×'+c.yield+'，田园道业 +'+c.score+bonus+'。';checkWin(s)});
}
function harvestPlot(i){if(state.mode!=='farm'||state.area!=='farm')return notify('灵草尚在灵圃，需先回田边。');const p=state.plots[i];if(!p){notify('这畦土地尚未播种。');return}
 if(p.progress<CROP[p.crop].days){notify('作物还未长成，需继续等待。');return}return usePlot(i)}
function waterPlotAt(i){if(state.mode!=='farm'||state.area!=='farm')return notify('须回灵圃才能浇灌。');const p=state.plots[i];if(!p||p.progress>=CROP[p.crop].days){notify('此田无需浇灌。');return}
 if(p.watered===state.day){notify('这畦灵田今日已经浇过。');return}
 change(s=>{cost(s,3,10);s.plots[i].progress+=.5;s.plots[i].watered=s.day;s.log='引一瓢灵泉，'+CROP[p.crop].name+'得半日滋养。'})}
function waterPlot(){if(state.mode!=='farm'||state.area!=='farm')return notify('须回灵圃才能浇灌。');
 const spots=PLOTS.map(([x,y],i)=>({i,x,y,p:state.plots[i]})).filter(q=>q.p&&q.p.progress<CROP[q.p.crop].days&&nearby(q.x,q.y));
 const p=spots.find(t=>t.p.watered!==state.day);
 if(!p){notify('身旁没有今日可浇灌的灵草。');return}
 waterPlotAt(p.i);
}
function gather(node){if(state.mode!=='farm'||state.area!=='farm')return notify('此处暂无灵圃采集点。');if(state.gatherDaily>=3){notify('今日至多采集三次，翌日再来。');return}
 change(s=>{cost(s,5,20);s.gatherDaily++;if(node.key==='木材')s.wood+=2;else if(node.key==='矿石')s.stone+=2;else s.goods.dewleaf=(s.goods.dewleaf||0)+1;
  s.farmScore+=4;s.log='收集'+node.key+'，田园道业 +4。';checkWin(s)});
}
function checkWin(s){if(s.farmScore>=220&&!s.wonFarm){s.wonFarm=true;s.items.push('朱印·万家灯火');s.notes.push('经营毕业：万家灯火——不曾拔剑，亦能以丰年泽众生。');s.log+='【经营圆满：万家灯火】'}
 if(s.battleScore>=220&&s.cleared.length===3&&!s.wonFight){s.wonFight=true;s.items.push('朱印·剑破三关');s.notes.push('战斗毕业：剑破三关——凭一剑破三境，不以田亩为门槛。');s.log+='【战道圆满：剑破三关】'}
}
function rest(){if(state.mode==='dungeon'||!['farm','house'].includes(state.area)){notify('需返回灵圃或洞府内室，方可安寝。');return}
 const finished=state.commission&&state.commission.due<=state.day+1;
 const ok=change(s=>{const inHouse=s.area==='house';s.day++;s.minute=360;s.energy=100;s.hp=Math.min(100,s.hp+(inHouse&&s.houseLv?55:40));s.mp=50;s.fishDaily=0;s.gatherDaily=0;s.riverGatherDate=s.day;s.riverGatherCount=0;s.talkToday={};s.giftToday={};
  for(const p of s.plots)if(p)p.progress+=1+(s.farmLv?.25:0)+(['细雨','雷雨'].includes(weatherOf(s.day))?.5:0);if(s.pond.stock>0)s.pond.age+=1;
  s.log='天色微明，灵田又生新绿。气血与灵力渐复。'+(inHouse&&s.houseLv?' 洞府丹香养身，气血恢复更丰。':'');
  if(s.commission&&s.commission.due<=s.day){s.gold+=70;s.farmScore+=18;s.items.push('委托·古境灵材');s.notes.push('委托回报：'+s.commission.name+'查得一处秘闻（尚待玩家求证）');s.commission=null;s.log+='墨羽带回委托灵材：灵石 +70，道业 +18。'}
  if(!s.pendingEvent && s.day>=7 && Math.random()<.28)s.pendingEvent=EVENTS[Math.floor(Math.random()*EVENTS.length)].id;
  checkWin(s);
 });
 if(ok&&state.pendingEvent)return showEvent();
 if(ok&&finished)modalBox('委托归来','墨羽将契书与密封木匣递给你。灵石已到账，灵材入袋；若想辨其旧案，仍须亲往调查。');
}
function showEvent(){const event=EVENTS.find(e=>e.id===state.pendingEvent);if(!event)return;
 modalBox('随机奇遇 · '+event.name,'<p>'+esc(event.desc)+'</p><p>【判定】此为心性抉择，不消耗额外日数。具体后果将在选择后结算。</p>',event.choices.map((txt,i)=>({label:txt,on:'event:'+i,primary:i===0})));
}
function resolveEvent(i){const ev=EVENTS.find(e=>e.id===state.pendingEvent);if(!ev||![0,1].includes(i))return;
 const ok=change(s=>{const id=ev.id;s.pendingEvent=null;
  if(id==='dew'){if(i===0){for(const p of s.plots)if(p)p.progress+=.5;s.farmScore+=6}else{s.goods.dewleaf=(s.goods.dewleaf||0)+2;s.farmScore+=3}}
  if(id==='caravan'){if(i===0&&s.gold>=15){s.gold-=15;s.items.push('隐踪古篆');s.notes.push('灵商所持古篆似与旧坛同源')}else if(i===0){s.notes.push('交易未成：灵石不足')}else s.notes.push('曾有云商携古篆路过山门')}
  if(id==='letter'){if(i===0){s.fav.qingwu=Math.min(100,(s.fav.qingwu||0)+4);s.notes.push('七柱旧纸：先寻名字，后谈恩仇')}else{s.farmScore+=4}}
  if(id==='water'){if(i===0){s.fish++;s.farmScore+=8}else{s.gold+=18;s.farmScore+=1}}
  if(id==='dream'){if(i===0){s.items.push('归田道偈');s.farmScore+=6}else{s.notes.push('旧道影：梦中灰衣道人没有足迹');s.mp=Math.max(0,s.mp-5)}}
  if(id==='pearl'){if(i===0){s.items.push('灵池月珠')}else if(s.pond.stock){s.pond.age+=1}else s.fish++}
  if(id==='seedwind'){if(i===0){s.seeds.stargrain=(s.seeds.stargrain||0)+2;s.farmScore+=4}else s.gold+=22}
  if(id==='ironbell'){if(i===0){s.fav.tiebai=Math.min(100,(s.fav.tiebai||0)+5);s.wood+=2}else s.mp=Math.min(50,s.mp+8)}
  if(id==='springs'){if(i===0){s.farmScore+=9;s.fav.yuchi=Math.min(100,(s.fav.yuchi||0)+3)}else{s.items.push('泉规残简');s.stone++}}
  if(id==='midnight'){if(i===0){s.notes.push('九曜星位：山池天影与残坛七柱暗暗相合');s.mp=Math.min(50,s.mp+10)}else{s.energy=Math.min(100,s.energy+12);s.farmScore+=4}}
  s.log=ev.name+'：'+ev.results[i]+'。';checkWin(s);
 });if(ok){modal=null;render()}
}
function buySeed(id){const c=CROP[id];if(!c)return;if(state.gold<c.cost){notify('灵石不足。');return}change(s=>{s.gold-=c.cost;s.seeds[id]=(s.seeds[id]||0)+1;s.selected=id;s.log='购得'+c.name+'种子一枚。'});}
function giftNpc(id){const n=NMAP[id];if(!n)return;
 const source=n.love==='fish'?'fish':'goods',has=source==='fish'?state.fish:goodCount(state,n.love);
 if(!has){notify('背囊没有'+n.gift+'，尚不能馈赠。');return}if(state.giftToday[id]){notify('今日已经赠过礼，请翌日再来。');return}
 return change(s=>{if(source==='fish')s.fish--;else s.goods[n.love]--;s.giftToday[id]=true;s.fav[id]=Math.min(100,(s.fav[id]||0)+10);s.farmScore+=5;s.log=n.name+'收下'+n.gift+'，好感 +10，道业 +5。';checkWin(s)});
}
function speak(id){const n=NMAP[id];if(!n)return;const idx=state.minute<720?0:state.minute<1080?1:2,near=nearby(...npcPos(n));const line=n.talk[idx];
 if(!near){modalBox(n.name+' · '+n.job,'此刻 '+n.habits[idx]+'。请先到万族小镇寻找'+n.name+'；少数邻人在特定时辰会来灵圃。靠近人物方可交谈。');return}
 if(!state.talkToday[id])change(s=>{cost(s,0,10);s.talkToday[id]=true;s.fav[id]=Math.min(100,(s.fav[id]||0)+3);s.log='与'+n.name+'攀谈，好感 +3。';},{quiet:true});
 if((state.fav[id]||0)>=25&&!state.npcQuest?.[id])change(s=>{s.npcQuest=s.npcQuest||{};s.npcQuest[id]=true;s.items.push(NPC_QUESTS[id][0]);s.notes.push(NPC_QUESTS[id][1]);s.log=n.name+'将一件旧物托付你，并说起未了的因果。';},{quiet:true});
 modalBox(n.name+' · '+n.race,'<p>“'+esc(line)+'”</p><p>今日作息：'+n.habits[idx]+'。好感：'+(state.fav[id]||0)+'/100。最喜：'+n.gift+'。</p>'+(state.fav[id]>=25?'<p>【好感支线】'+n.name+'愿透露一段祖传旧事。线索已留于心，不会强行接入原版主线。</p>':''),[
 {label:'人物委托 · '+NPC_STORIES[id].title,on:'npcStory:'+id,primary:true},{label:'馈赠 '+n.gift,on:'gift:'+id},{label:'暂别',on:'close'}]);
}
function storyEligible(id){const n=NMAP[id];return !!n&&state.mode==='farm'&&nearby(...npcPos(n))}
function npcStory(id){
 const n=NMAP[id],q=NPC_STORIES[id];if(!n||!q)return;
 if(!storyEligible(id))return notify('须走近'+n.name+'才能谈及私事。');
 const step=state.storyStages?.[id]||0,friend=state.fav[id]||0;
 let body='<div class="v32-story"><p>【'+q.title+'】 · '+n.race+' · 好感 '+friend+'/100</p>';
 let actions=[];
 if(step===4){body+='<p>两章旧事已了。'+q.second.notes+'。你所做的选择，已记入山海手记。</p>';actions=[{label:'暂别',on:'close',primary:true}]}
 else if(step===0||step===2){
  const next=step===0?q.first:q.second,requireFriend=step===0?10:30;
  body+='<h3>'+next.title+'</h3><p>'+next.intro+'</p><p>所需：'+storyNeedsText(next.requirements)+'；亦可资助 '+next.fee+' 灵石。</p>';
  if(friend<requireFriend)body+='<p>【心契未深】还需好感 '+requireFriend+'；请在小镇交谈、馈赠以结信任。</p>';
  else actions.push({label:'接下'+(step===0?'第一章':'第二章')+'委托',on:'npcStoryAccept:'+id,primary:true});
  actions.push({label:'以后再谈',on:'close'});
 }else{
  const req=step===1?q.first:q.second,since=state.storySince?.[id]||0;
  body+='<h3>'+req.title+'</h3><p>'+req.intro+'</p><p>需交：'+storyNeedsText(req.requirements)+'，或资助 '+req.fee+' 灵石。</p>';
  if(state.day<=since)body+='<p>【暮春有约】今日新立约，至少安歇一夜，再来交付。</p>';
  else{
   body+='<p>山居库存：'+(storyHas(state,req.requirements)?'已备齐所需物资':'尚缺交付材料')+'；灵石 '+state.gold+'。</p>';
   actions.push({label:'交付材料 · 结旧缘',on:'npcStoryDeliver:'+id+':goods',primary:true});
   actions.push({label:'资助 '+req.fee+' 灵石 · 另解其难',on:'npcStoryDeliver:'+id+':gold'});
  }
  actions.push({label:'回头再来',on:'close'});
 }
 modalBox(n.name+' · '+q.title,body+'</div>',actions);
}
function npcStoryAccept(id){
 if(!storyEligible(id))return notify('请先靠近委托人。');
 const stage=state.storyStages?.[id]||0,friend=state.fav[id]||0;
 if(!((stage===0&&friend>=10)||(stage===2&&friend>=30)))return notify('当前尚不具备接取条件。');
 const ok=change(s=>{
  const current=s.storyStages[id]||0;if(current!==stage)throw Error('委托阶段已变化');
  s.storyStages[id]=stage+1;s.storySince[id]=s.day;
  s.log='与'+NMAP[id].name+'立下约定：'+(stage===0?NPC_STORIES[id].first:NPC_STORIES[id].second).title+'。明日可来交付。';
  s.notes.push('【'+NMAP[id].name+'】'+(stage===0?'第一章':'第二章')+'已受托，次日起可以交付。');
 });if(ok)npcStory(id);return ok;
}
function npcStoryDeliver(id,method){
 if(!storyEligible(id))return notify('请靠近人物再交付。');
 const stage=state.storyStages?.[id]||0,q=NPC_STORIES[id];if(!q||![1,3].includes(stage)||!['goods','gold'].includes(method))return notify('此委托不能再领取。');
 const req=stage===1?q.first:q.second;
 if(state.day<=(state.storySince?.[id]||0))return notify('委托刚刚接下，明日再来交付。');
 if(method==='goods'&&!storyHas(state,req.requirements))return notify('材料未备齐：'+storyNeedsText(req.requirements));
 if(method==='gold'&&state.gold<req.fee)return notify('灵石不足，不能资助。');
 const ok=change(s=>{
  if(s.storyStages[id]!==stage||s.day<=s.storySince[id])throw Error('委托已经变化');
  if(method==='goods')storySpend(s,req.requirements);
  else{if(s.gold<req.fee)throw Error('灵石不足');s.gold-=req.fee}
  s.storyStages[id]=stage+1;
  const gained=method==='goods'?stage===1?7:13:stage===1?3:6;
  const fav=method==='goods'?stage===1?11:15:stage===1?5:8;
  s.fav[id]=Math.min(100,(s.fav[id]||0)+fav);
  s.farmScore+=gained;
  if(stage===3)s.items.push(q.keepsake);
  s.notes.push('【'+NMAP[id].name+'·'+req.title+'】'+req.notes+'；'+(method==='goods'?'交付灵材':'灵石相助')+'。');
  s.log=req.title+'：'+NMAP[id].name+'好感+'+fav+'、经营道业+'+gained+(stage===3?'，获「'+q.keepsake+'」':'')+'。';
  checkWin(s);
 });if(ok)npcStory(id);return ok;
}
function pondMenu(){if(state.mode!=='farm'||state.area!=='farm')return notify('请回灵圃东侧灵池。');
 const p=state.pond,body='<p>小灵池水声潺潺。可先垂钓取得灵鱼，再花费6灵石投放一尾鱼苗。鱼苗两日后可得三尾成鱼，亦可作为送礼之物。</p><p>在养：'+p.stock+' 尾 · 生长：'+p.age.toFixed(1)+'/2日 · 库存灵鱼：'+state.fish+'</p>';
 modalBox('灵池 · 养殖与垂钓',body,[{label:'垂钓（每日限三次）',on:'fishing',primary:true},{label:'投放鱼苗（1鱼+6灵石）',on:'stockFish'},{label:'起塘收鱼',on:'harvestFish'},{label:'离开池边',on:'close'}]);
}
function stockFish(){if(state.fish<1||state.gold<6){notify('投苗须携一尾灵鱼及6灵石。');return}if(state.pond.stock>=2){notify('小池只能同时养两尾鱼苗。');return}
 const ok=change(s=>{s.fish--;s.gold-=6;s.pond.stock++;s.pond.age=0;s.log='放入一尾灵鱼苗，添6灵石为饵。两日后可起塘。'});if(ok){modal=null;render()}
}
function harvestFish(){if(state.pond.stock<1||state.pond.age<2){notify('灵鱼尚未长成，需满两日。');return}const ok=change(s=>{let n=s.pond.stock;s.fish+=3*n;s.farmScore+=12*n;s.pond={stock:0,age:0};s.log='起塘得灵鱼 '+3*n+' 尾，经营道业 +'+12*n+'。';checkWin(s)});if(ok){modal=null;render()}
}
function upgradeFarm(){if(state.mode!=='farm'||state.area!=='farm')return notify('须在灵田边布下阵法。');if(state.farmLv){notify('九曜灵田阵法已开启。');return}if(state.wood<8||state.stone<8||state.gold<50){notify('升级需要木材8、矿石8、灵石50。');return}
 change(s=>{s.wood-=8;s.stone-=8;s.gold-=50;s.farmLv=1;s.farmScore+=25;s.log='架起聚灵法阵，今后灵草每日额外生长四分之一日。经营道业 +25。';checkWin(s)});
}
function fishing(){if(state.mode!=='farm'||!['farm','river'].includes(state.area)){notify('须到灵圃灵池或灵溪钓点下钩。');return}if(state.energy<7||state.minute>=1380){notify('垂钓需要7点体力，且须在夜深前进行。');return}if(!(state.area==='river'?nearby(4,5,2):nearby(9,1,2))){notify('请靠近当前地图的钓点。');return}if(state.fishDaily>=3){notify('今日灵池已扰，不宜再下钩。翌日可再试。');return}
 fishMotion={start:performance.now(),pos:0.1,target:0.2+Math.random()*.55};modal={type:'fishing',title:state.area==='river'?'灵溪垂钓':'灵池垂钓',body:'观浮标起落，待白线落入青绿区域时收竿。每日最多三次。',actions:[{label:'收竿！',on:'reel',primary:true},{label:'暂不垂钓',on:'close'}]};renderModal();
}
function fishTick(t){if(!fishMotion||modal?.type!=='fishing')return;fishMotion.pos=(Math.sin((t-fishMotion.start)/520)+1)/2;const needle=root?.querySelector('.fishneedle');if(needle)needle.style.left=(fishMotion.pos*100)+'%'}
function reel(){if(!fishMotion||modal?.type!=='fishing')return;const dist=Math.abs(fishMotion.pos-fishMotion.target),success=dist<=.13,perfect=dist<=.045;
 const oldModal=modal;
 const accepted=change(s=>{cost(s,7,25);s.fishDaily++;if(success){s.fish+=perfect?2:1;s.farmScore+=perfect?11:7;s.gold+=perfect?10:4;s.log=perfect?'浮标恰入钩中，一尾双灵！灵鱼 +2，功德 +11。':'灵鱼上钩，灵鱼 +1，功德 +7。'}else{s.mp=Math.max(0,s.mp-3);s.log='浮标轻晃，灵鱼已遁。灵力 −3。'}checkWin(s)});
 if(accepted){fishMotion=null;modal=null;render();}else{modal=oldModal;renderModal()}
}
function commission(){if(state.commission){notify('现有委托将于第 '+state.commission.due+' 日完成。');return}
 if(state.gold<45){notify('委托须付45灵石，现银不足。');return}
 modalBox('委托 · 无须亲履险地','墨羽递上两日契书：“你只须支付45灵石，我遣修士勘验古境。两日后带回70灵石与灵材，另记经营道业18。”<p>此委托不增加战斗道业；战斗线路同样无需通过经营才能进入。</p>',[{label:'签署（45灵石）',on:'acceptcommission',primary:true},{label:'再想想',on:'close'}]);
}
function acceptCommission(){if(state.commission||state.gold<45){notify('委托条件已发生变化。');return}
 const ok=change(s=>{s.gold-=45;s.commission={due:s.day+2,name:'璇玑外围勘探'};s.log='以45灵石托付墨羽，二日后取回讯息。'});if(ok){modal=null;render()}
}
function inventory(){const s=state;modalBox('行囊 · 灵物记',
 '<p>灵石 '+s.gold+'　灵锄 '+(s.toolGrade?'精锻':'普通')+'　灵鱼 '+s.fish+'　木材 '+s.wood+'　矿石 '+s.stone+'　干粮 '+s.food+'　灵糕 '+s.meals+'　护身符 '+s.wards+'</p><p>采收的灵草：</p><div class="grid2">'+CROPS.map(c=>'<span>'+c.name+' × '+goodCount(s,c.id)+'</span>').join('')+'</div><p>珍稀宝物：'+(s.items.length?esc(s.items.join('、')):'暂无')+'</p>');
}
function sell(){modalBox('山门坊市 · 柴米有价','<p>灵草和灵鱼可以出售；田园道业只在收获时增加，出售不会重复加分。灵麦干粮售价16灵石，食用恢复28体力。</p><button class="cta" data-do="buyFood">购买灵麦干粮 · 16灵石</button><div class="grid2">'+CROPS.filter(c=>goodCount(state,c.id)>0).map(c=>'<button class="cta" data-do="sell:'+c.id+'">'+c.name+'×'+goodCount(state,c.id)+' 售'+c.price+'/株</button>').join('')+'<button class="cta" data-do="sell:fish">灵鱼×'+state.fish+' 售15/尾</button></div>',[{label:'收起货箱',on:'close'}]);}
function sellGood(id){if(id==='fish'&&state.fish<1||id!=='fish'&&goodCount(state,id)<1){notify('存货不足。');return}
 const c=CROP[id];const ok=change(s=>{if(id==='fish'){s.fish--;s.gold+=15;s.log='售出一尾灵鱼，得15灵石。'}else{s.goods[id]--;s.gold+=c.price;s.log='售出'+c.name+'，得'+c.price+'灵石。'}});if(ok&&modal){modal=null;render()}
}
function chooseDungeon(){const s=state;
 modalBox('三境历险 · 秘境通道',DUNGEONS.map((d,i)=>'<p><b>'+['一','二','三'][i]+' · '+d.name+'</b>：'+d.desc+'</p><button class="cta" data-do="dungeon:'+i+'" '+(i>0&&!s.cleared.includes(i-1)?'disabled':'')+'>入境 '+(i>0&&!s.cleared.includes(i-1)?'（前一秘境未破）':' →')+'</button>').join(''),[{label:'返回灵圃',on:'close'}]);
}
function startDungeon(i){if(!DUNGEONS[i]||i>0&&!state.cleared.includes(i-1)){notify('前一秘境尚未破关，禁制未解。');return}
 const d=DUNGEONS[i],foes=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const ch=d.map[y][x];if(ch==='E'||ch==='B'){
   const types=[['bamboo','fox'],['lizard','lizard'],['corpse','mist']][i],m=MMAP[types[ch==='B'?1:0]],boss=ch==='B';
   foes.push({id:m.id,x,y,homeX:x,homeY:y,hp:Math.round(m.hp*(boss?1.55:1)),max:Math.round(m.hp*(boss?1.55:1)),boss,step:0});
  }
 }
 walkPath=[];walkGoal=null;
 const entered=change(s=>{s.mode='dungeon';s.area='farm';s.dungeon=i;s.foes=foes;s.x=1;s.y=6;s.mp=Math.max(35,s.mp);s.log='踏入'+d.name+'，妖气微鸣。敌人接近时会主动攻击。';});
 if(!entered)return;modal=null;tab='adventure';lastAI=performance.now();render();
}
function retreat(){if(state.mode!=='dungeon')return;
 modalBox('暂离秘境','保存当前已经获得的灵石、道具与击杀功德；秘境中未清的守卫会在下次入境时重新集结。', [{label:'撤回洞府',on:'doRetreat',primary:true},{label:'继续征战',on:'close'}]);
}
function doRetreat(){const ok=change(s=>{s.mode='farm';s.area='farm';s.x=6;s.y=3;s.mp=Math.min(50,s.mp+10);s.log='你收剑归山，携所获之物回到九曜灵圃。';});if(ok){modal=null;tab='farm';render();}}
function attack(){if(state.mode!=='dungeon')return;const t=performance.now();if(t-lastAttack<225)return;lastAttack=t;
 const e=state.foes.filter(e=>e.hp>0&&nearby(e.x,e.y)).sort((a,b)=>(a.boss?1:0)-(b.boss?1:0))[0];heroAnim='attack';heroUntil=t+420;
 if(!e){notify('剑锋未及，需靠近妖兽一格。');return}
 hit([{target:e,damage:23+Math.floor(Math.random()*7)}],'剑');
}
function cast(){if(state.mode!=='dungeon')return;const t=performance.now();if(t-lastCast<650)return;if(state.mp<12){notify('灵力不足12，无法施法。');return}
 const targets=state.foes.filter(e=>e.hp>0&&(Math.abs(state.x-e.x)+Math.abs(state.y-e.y)<=3));
 if(!targets.length){notify('施法范围三格内没有妖兽。');return}
 lastCast=t;heroAnim='cast';heroUntil=t+700;
 hit(targets.map(e=>({target:e,damage:25+Math.floor(Math.random()*6)})),'术');
}
function hit(targets,type){const costs=type==='术'?12:0;const oldIds=targets.map(x=>({x:x.target.x,y:x.target.y,id:x.target.id,damage:x.damage}));
 const ok=change(s=>{if(s.mp<costs)throw Error('灵力不足');s.mp-=costs;
  const kills=[];for(const a of oldIds){const e=s.foes.find(e=>e.hp>0&&e.id===a.id&&e.x===a.x&&e.y===a.y);if(!e)continue;e.hp-=a.damage;if(e.hp<=0){e.hp=0;kills.push(e);const def=MMAP[e.id];s.gold+=def.gold;s.battleScore+=def.score;s.monsterDrops.push(def.drop);s.items.push(def.drop)}}
  s.log=type==='剑'?'剑意斩落，妖影震退。':'五行术光洒落，符纹随之燃起。';
  if(kills.length)s.log+=' 斩除'+kills.map(k=>MMAP[k.id].name).join('、')+'；战斗道业 +'+kills.reduce((n,k)=>n+MMAP[k.id].score,0)+'。';
  if(s.foes.length&&s.foes.every(e=>e.hp<=0)){
   const i=s.dungeon,d=DUNGEONS[i];if(!s.cleared.includes(i)){s.cleared.push(i);s.battleScore+=d.score;s.items.push(d.reward);s.notes.push(d.unlocks);s.log+='【'+d.name+'通关】获'+d.reward+'，战斗道业 +'+d.score+'。'}else s.log+='【'+d.name+'再破】';
  }
  checkWin(s);
 },{quiet:true});
 if(ok){const cleared=state.foes.length&&state.foes.every(e=>e.hp<=0);if(cleared){modalBox('秘境破阵', '<p>'+DUNGEONS[state.dungeon].name+'的妖气已散，古灯清明。所得奖励已入背囊。</p>'+(state.wonFight?'<p>【朱印·剑破三关】你已凭战斗路线独立毕业。</p>':''),[{label:'返回洞府',on:'doRetreat',primary:true},{label:'搜寻宝箱',on:'close'}]);}
  else{draw();syncHUD()}}
}
function chest(x,y){if(state.mode!=='dungeon'||!nearby(x,y,1)){notify('靠近宝箱方能开启。');return}
 const key=state.dungeon+':'+x+':'+y;if(state.opened.includes(key)){notify('木匣已启，此处再无遗宝。');return}
 change(s=>{s.opened.push(key);s.gold+=35;s.items.push('秘境铜钱匣');s.battleScore+=5;s.log='开启一只封尘木匣，灵石 +35，战道记功 +5。';checkWin(s)});
}
function heal(){if(state.mode!=='dungeon'){notify('回到洞府安寝，便可自行调息。');return}
 if(state.hp>=100&&state.mp>=50){notify('气血与灵力已盈，无需疗伤。');return}
 if(state.fish<1&&state.gold<15){notify('疗伤需一尾灵鱼或15灵石。');return}
 change(s=>{if(s.fish>=1)s.fish--;else s.gold-=15;s.hp=Math.min(100,s.hp+45);s.mp=Math.min(50,s.mp+20);s.log='安坐调息，气血 +45，灵力 +20。';},{quiet:true});
}
let aiRunning=false;
function enemyTick(t){if(state.mode!=='dungeon'||modal||tab!=='adventure'||t-lastAI<820||aiRunning)return;lastAI=t;aiRunning=true;
 let died=false,damage=0;const previousInvuln=lastInvuln;
 const ok=change(s=>{
  s.enemyTurn=(s.enemyTurn||0)+1;
  for(const e of s.foes){if(e.hp<=0)continue;const def=MMAP[e.id],dx=s.x-e.x,dy=s.y-e.y,dist=Math.abs(dx)+Math.abs(dy);
   const mage=def.ai==='kite';
   if((dist===1||mage&&dist<=3)&&damage===0&&t-lastInvuln>=740){damage=def.atk+(e.boss?3:0);if(s.wards>0){damage=Math.ceil(damage/2);s.wards--;}s.hp-=damage;lastInvuln=t+700}
   if(dist===1)continue;
   let mx=0,my=0;
   if(def.ai==='blink'&&e.step%3===0&&dist>2){const spots=[[s.x+2,s.y],[s.x-2,s.y],[s.x,s.y+2],[s.x,s.y-2]].filter(([x,y])=>!isWall(x,y));if(spots.length){[e.x,e.y]=spots[Math.floor(Math.random()*spots.length)];e.step++;continue}}
   if(mage&&dist<=2){mx=dx?-(dx>0?1:-1):0;my=mx?0:dy?-(dy>0?1:-1):0}
   else if(def.ai==='guard'&&dist>4){e.step++;continue}
   else if(dist<=6){if(Math.abs(dx)>Math.abs(dy))mx=Math.sign(dx);else my=Math.sign(dy)}
   if(def.ai==='charge'&&dist<=5&&(dx===0||dy===0)&&e.step%3===0){const tx=e.x+mx*2,ty=e.y+my*2;if(!isWall(tx,ty)&&!isWall(e.x+mx,e.y+my)){e.x=tx;e.y=ty;e.step++;continue}}
   const nx=e.x+mx,ny=e.y+my;
   if((mx||my)&&!isWall(nx,ny)&&!(nx===s.x&&ny===s.y)&&!s.foes.some(o=>o!==e&&o.hp>0&&o.x===nx&&o.y===ny)){e.x=nx;e.y=ny}
   e.step++;
  }
  if(s.hp<=0){died=true;s.mode='farm';s.area='farm';s.x=6;s.y=3;s.hp=60;s.mp=25;s.gold=Math.max(0,s.gold-25);s.rescues++;s.log='你于秘境中重伤，九曜护身符将你带回洞府。扣除至多25灵石，未丢失既得道业。'}
  else if(damage)s.log='妖兽袭来，气血 −'+damage+'。可施法击退或使用调息。';
 },{quiet:true});
 aiRunning=false;if(!ok)lastInvuln=previousInvuln;if(ok&&died){walkPath=[];walkGoal=null;tab='farm';render();modalBox('护命归山','半缕护身道光裹住你，将你送回九曜灵圃。败局保留已得战道功德与宝物，不会删除进度。', [{label:'重整旗鼓',on:'close',primary:true}]);}else if(ok){draw();syncHUD()}
}
function saveCenter(){let manual=getSaved(MANUAL);modalBox('存档卷宗 · 双重保险',
 '<p>自动存档在每次有效操作后写入本地浏览器。手动备份单独保存，可在误操作后恢复。</p><p>最近存档：'+(state.lastSave?new Date(state.lastSave).toLocaleString('zh-CN'):'首次入山')+'<br>手动备份：'+(manual?'第'+manual.day+'日 · '+manual.gold+'灵石':'尚未创建')+'</p><div class="grid2">'+makeButton('手动存档','manual')+makeButton('恢复手动备份','restore')+makeButton('导出存档码','export')+makeButton('导入存档码','import')+'</div><p>实体 iPhone 浏览器可能限制本地文件存储。重要进度建议定期导出。</p>');
}
function exportCode(){const data=JSON.stringify(state),bytes=new TextEncoder().encode(data);let binary='';for(const x of bytes)binary+=String.fromCharCode(x);const code='WZ27:'+btoa(binary);
 modalBox('导出完整存档码','<p>复制以下存档码，留存于备忘录；它不依赖本机 localStorage。</p><textarea id="v27-export" readonly style="width:100%;height:130px;word-break:break-all">'+code+'</textarea>',[{label:'复制存档码',on:'copy',primary:true},{label:'返回',on:'saves'}]);
}
function importPrompt(){modalBox('导入存档码','<p>粘贴以 WZ27: 开头的完整存档码。导入前将验证结构，失败不会覆盖当前存档。</p><textarea id="v27-import" style="width:100%;height:130px" placeholder="WZ27:..."></textarea>',[{label:'验证并导入',on:'importConfirm',primary:true},{label:'取消',on:'close'}]);}
function importConfirm(){let val=root?.querySelector('#v27-import')?.value.trim()||'';if(!val.startsWith('WZ27:')){notify('不是 WZ27 存档码。');return}
 try{const raw=atob(val.slice(5));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const data=validated(JSON.parse(new TextDecoder().decode(bytes)));if(!data)throw Error('存档结构无效');
  persist(data);modal=null;tab='farm';render();notify('WZ27 存档已恢复。')
 }catch(e){notify('导入失败，原存档保持不变：'+e.message,true)}
}
function renderModal(){if(!root)return;const h=root.querySelector('#v27-modalhost');if(!h)return;
 if(!modal){h.innerHTML='';return}
 let text=modal.body;
 if(modal.type==='fishing')text='<p>'+esc(modal.body)+'</p><div class="fishtrack"><div class="fishzone" style="left:'+((fishMotion?.target||.5)*100-12)+'%"></div><div class="fishneedle"></div></div><p>青绿色区域为上钩窗口，正中收竿可得双鱼。</p>';
 h.innerHTML='<div class="overlay" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-label="'+esc(modal.title)+'"><h2>'+esc(modal.title)+'</h2>'+text+'<div class="modalactions">'+(modal.actions||[]).map(a=>'<button data-do="'+esc(a.on)+'" class="'+(a.primary?'primary':'')+'">'+esc(a.label)+'</button>').join('')+'</div></section></div>';
}
function doAction(action){if(!action)return;
 if(action==='close'){closeModal();return}if(action==='exit'){closeV27();return}if(action==='manual'){
  try{persist(clone(state),true);notify('手动备份已写入，和自动存档分开保存。');if(modal)saveCenter()}catch(e){notify('手动备份失败：'+e.message,true)}return
 }
 if(action==='riverTeaDrink')return riverTeaDrink();if(action==='riverPledge')return riverPledge();if(action==='riverRelease')return riverRelease();if(action.startsWith('riverOffer:'))return riverOffer(action.slice(11));
 if(action==='shop')return showShop();if(action==='shopService')return shopService();if(action==='shopExit')return transfer('village');
 if(action==='shopClinic')return shopClinic();if(action==='shopForge')return shopForge();if(action==='shopPack')return shopPack();
 if(action.startsWith('shopBuy:'))return shopBuy(action.slice(8));
 if(action.startsWith('npcStoryAccept:'))return npcStoryAccept(action.slice(15));
 if(action.startsWith('npcStoryDeliver:')){const [id,method]=action.slice(16).split(':');return npcStoryDeliver(id,method)}
 if(action.startsWith('npcStory:'))return npcStory(action.slice(9));
 if(action==='journal')return journal();if(action==='worldmap')return worldmap();if(action==='audit')return auditModal();
 if(action==='festival')return festival();if(action==='workshop')return workshop();if(action==='kitchen')return kitchen();if(action==='claimFestival')return claimFestival();if(action==='craftWard')return craftWard();if(action==='upgradeHouse')return upgradeHouse();if(action==='cook')return cook();if(action==='eatMeal')return eatMeal();
 if(action==='bulletin')return showBulletin();if(action==='deliver')return deliver();if(action==='buyFood')return buyFood();if(action==='eat')return eatFood();
 if(action==='saves')return saveCenter();if(action==='restore'){
  const back=getSaved(MANUAL);if(!back){notify('尚无有效的手动备份。');return}
  modalBox('恢复手动备份？','<p>将恢复至第'+back.day+'日，灵石 '+back.gold+'。现有自动进度会被替换。建议先导出当前存档码。</p>',[{label:'确认恢复',on:'doRestore',primary:true},{label:'取消',on:'saves'}]);return
 }
 if(action==='doRestore'){const back=getSaved(MANUAL);if(!back){notify('手动备份不存在。');return}try{persist(back);modal=null;tab='farm';render();notify('已恢复手动备份。')}catch(e){notify('恢复失败：'+e.message,true)}return}
 if(action==='export')return exportCode();if(action==='import')return importPrompt();if(action==='importConfirm')return importConfirm();
 if(action==='copy'){const field=root?.querySelector('#v27-export'),v=field?.value;if(!v)return;
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(v).then(()=>notify('存档码已复制。')).catch(()=>{field.select();notify('请长按已选中的存档码复制。')});
  else{field.focus();field.select();notify('已选中存档码，请在手机上选择复制。')}return}
 if(action==='reset'){modalBox('重置像素洞府？','这是不可撤销的操作，自动存档将被新局覆盖。请先导出或手动备份。',[{label:'确认重开',on:'doReset',primary:true},{label:'取消',on:'close'}]);return}
 if(action==='doReset'){try{persist(fresh());modal=null;tab='farm';render()}catch(e){notify('重开失败：'+e.message,true)}return}
 if(action==='trackMenu')return trackMenu();
 if(action==='guide')return guideTarget();
 if(action.startsWith('track:'))return changeTracked(action.slice(6));
 if(action==='help'){return modalBox('游玩与操作','<p>原创像素修仙生活：方向键或 WASD 移动，点选下方六格工具栏，再点击田地进行播种、浇水、收割；E 交互，J 挥剑，K 施法。地图直接点击也可寻路。</p><p>每7天轮转春夏秋冬；阴雨催生灵草。灵圃东侧可到万族小镇，西北房门可进入家中；小镇北街可进入药庐与铁坊（08:00—21:00营业），从东街石拱可进入灵溪河岸，探河神旧祠，店内真实支付灵石购种或升级农具。村民会在街头巡游，可走近交谈。集会七日一次，奖励不可重复领取。</p><p>灵田收获、钓鱼、委托可积累经营功德。秘境击杀及首次通关积累战斗功德。各达220点可以独立毕业，战斗路线另外需通关三境。</p><p>界面为32像素人物、64像素瓦片、16像素图标；原版剧情和实时肉鸽仍在返回后的文字篇中。</p>')}
 if(action.startsWith('event:'))return resolveEvent(Number(action.slice(6)));
 if(action==='pond')return pondMenu();if(action==='stockFish')return stockFish();if(action==='harvestFish')return harvestFish();if(action==='farmUpgrade')return upgradeFarm();
 if(action==='interact')return interact();if(action==='water')return waterPlot();if(action==='fishing')return fishing();if(action==='sleep'){const hasSleepModal=modal?.title?.startsWith('山居安歇');const oldModal=modal;const before=state.day;rest();if(hasSleepModal&&state.day!==before&&!state.pendingEvent){modal=null;render()}else if(hasSleepModal&&state.day===before){modal=oldModal;renderModal()}return}
 if(action==='attack')return attack();if(action==='cast')return cast();if(action==='heal')return heal();if(action==='retreat')return retreat();if(action==='doRetreat')return doRetreat();
 if(action==='reel')return reel();if(action==='commission')return commission();if(action==='acceptcommission')return acceptCommission();
 if(action==='inventory')return inventory();if(action==='sell')return sell();if(action==='dungeons')return chooseDungeon();
 if(action.startsWith('seed:'))return change(s=>{s.selected=action.slice(5);s.log='当前使用'+CROP[s.selected].name+'种子。'});
 if(action.startsWith('buy:'))return buySeed(action.slice(4));
 if(action.startsWith('npc:'))return speak(action.slice(4));
 if(action.startsWith('gift:')){const oldModal=modal,ok=giftNpc(action.slice(5));if(ok){modal=null;render()}else{modal=oldModal;renderModal()}return}
 if(action.startsWith('dungeon:'))return startDungeon(Number(action.slice(8)));
 if(action.startsWith('sell:'))return sellGood(action.slice(5));
}
function onClick(e){const tool=e.target.closest('[data-tool]');if(tool){e.preventDefault();if(state.mode==='farm')change(s=>{s.tool=tool.dataset.tool;s.log='执起'+TOOLS.find(t=>t.id===s.tool).name+'，可点击地图使用。'});return}const action=e.target.closest('[data-do]');if(action){e.preventDefault();doAction(action.dataset.do);return}const tabBtn=e.target.closest('[data-tab]');if(tabBtn){tab=tabBtn.dataset.tab;render();return}}
function onPointerDown(e){const b=e.target.closest('[data-move]');if(!b)return;e.preventDefault();clearInterval(held);move(b.dataset.move);held=setInterval(()=>move(b.dataset.move),145)}
function stopHeld(){if(held){clearInterval(held);held=null}}
function onMapClick(e){if(!canvas||modal)return;const box=canvas.getBoundingClientRect();const x=Math.floor((e.clientX-box.left)/box.width*W),y=Math.floor((e.clientY-box.top)/box.height*H);clickTile(x,y)}
function onKey(e){if(!active||root?.hidden)return;if(e.key==='Escape'&&modal){e.preventDefault();closeModal();return}
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(modal&&e.key!=='Tab')return;
 const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','e','j','k','f','escape','1','2','3','4','5','6'].includes(key))e.stopImmediatePropagation();const mv={'w':'up','arrowup':'up','a':'left','arrowleft':'left','s':'down','arrowdown':'down','d':'right','arrowright':'right'}[key];
 if(mv){e.preventDefault();if(performance.now()-lastWalk>115)move(mv);return}
 if(e.repeat)return;
 if('123456'.includes(key)&&!e.shiftKey&&!modal&&state.mode==='farm'){e.preventDefault();const tool=TOOLS[Number(key)-1];change(s=>{s.tool=tool.id;s.log='已选择'+tool.name+'。'});return}
 if(key==='e'){e.preventDefault();interact()}else if(key==='j'){e.preventDefault();attack()}
 else if(key==='k'){e.preventDefault();cast()}
 else if(key==='f'){e.preventDefault();fishing()}
 else if(key==='escape'&&modal){closeModal()}
 else if(e.shiftKey&&'1234'.includes(key)&&!modal){tab=['farm','npc','mission','adventure'][Number(key)-1];render()}
}
function loop(t){requestAnimationFrame(loop);if(!active||root.hidden||document.hidden)return;
 if(t-lastDraw>58){lastDraw=t;draw();fishTick(t);moveQueued(t)}enemyTick(t);
}
function openV27(){if(typeof FT!=='undefined'&&FT.on){console.warn('V27: 战斗中无法打开洞府，避免覆盖旧战斗控制。');return false}
 active=true;root.hidden=false;document.title='万族争道 · V34 山海路引';document.body.classList.add('v27-open');tab=state.mode==='dungeon'?'adventure':'farm';render();if(state.pendingEvent)showEvent();return true}
function closeV27(){stopHeld();active=false;root.hidden=true;modal=null;document.body.classList.remove('v27-open');queueMicrotask(insertLauncher);return true}
function insertLauncher(){
 if(!root||root.hidden===false)return;
 const home=document.querySelector('#feed .w11home');
 if(home&&!home.querySelector('.v27-title-entry')){document.title='万族争道 · V34 山海路引';
  const btn=document.createElement('button');btn.className='w11entry v27-title-entry';btn.type='button';btn.innerHTML='<span class="w11entry-icon">田</span><span class="w11entry-text"><b>四时山居 · 山海路引 V34</b><small>七线因果追踪 · 寻路 · 万族生活</small></span><span class="w11entry-arrow">›</span>';btn.addEventListener('click',openV27);
  const all=home.querySelectorAll('.w11entry');all[all.length-1]?.after(btn);
 }
 const top=document.getElementById('top');if(top&&top.style.display!=='none'&&!top.querySelector('#v27-launch-small')&&!(typeof FT!=='undefined'&&FT.on)){
  const row=top.querySelector('.row');if(row){const b=document.createElement('button');b.type='button';b.id='v27-launch-small';b.textContent='◈ 洞府';b.addEventListener('click',openV27);row.appendChild(b)}
 }
}
function init(){
 if(root)return;root=document.createElement('section');root.id='v27-app';root.hidden=true;root.setAttribute('aria-label','万族争道 V34 山海路引');document.body.appendChild(root);
 root.addEventListener('click',e=>{if(e.target.closest('#v27-map'))return;onClick(e)});
 root.addEventListener('pointerdown',onPointerDown);root.addEventListener('pointerup',stopHeld);root.addEventListener('pointercancel',stopHeld);root.addEventListener('pointerleave',stopHeld);
 root.addEventListener('click',e=>{if(e.target.id==='v27-map')onMapClick(e)});
 document.addEventListener('keydown',onKey,true);
 const oldTitle=renderTitle;renderTitle=function(){oldTitle();queueMicrotask(insertLauncher)};
 const oldTop=renderTop;renderTop=function(){oldTop();queueMicrotask(insertLauncher)};
 const oldRenderAll=renderAll;renderAll=function(){oldRenderAll();queueMicrotask(insertLauncher)};
 const feed=document.getElementById('feed');if(feed)new MutationObserver(()=>{if(!root.hidden)return;if(feed.querySelector('.w11home:not(:has(.v27-title-entry))'))queueMicrotask(insertLauncher)}).observe(feed,{childList:true,subtree:true});
 queueMicrotask(insertLauncher);requestAnimationFrame(loop);
}
window.V34=window.V33=window.V32=window.V31=window.V30=window.V29=window.V28=window.V27={open:openV27,close:closeV27,getState:()=>clone(state),data:{CROPS,NPC,MONSTERS,DUNGEONS,EVENTS,PLOTS,NODES,VILLAGE_MAP,HOUSE_MAP,SHOP_MAP,SHOP_SITES,AREAS,NPC_STORIES,RIVER_MAP,RIVER_SITES},
 transfer,riverInteract,riverForage,riverTea,riverTeaDrink,riverShrine,riverPledge,riverOffer,riverRelease,showShop,shopBuy,shopClinic,shopPack,shopForge,shopService,npcPos,npcTrack,npcStory,npcStoryAccept,npcStoryDeliver,festival,claimFestival,workshop,craftWard,upgradeHouse,kitchen,cook,eatMeal,worldmap,startDungeon,interactAt,usePlot,waterPlot,waterPlotAt,harvestPlot,showBulletin,deliver,buyFood,eatFood,rest,buySeed,speak,giftNpc,gather,fishing,reel,commission,acceptCommission,showEvent,resolveEvent,retreat,heal,attack,cast,
 backup:()=>persist(clone(state),true),restore:()=>{const s=getSaved(MANUAL);if(!s)throw Error('no backup');persist(s);render()},
 save:()=>persist(clone(state)),debugState:(data)=>{const good=validated(data);if(!good)throw Error('bad debug state');persist(good);render()},assetCount:()=>Object.keys(imageSources).length,trackedInfo:()=>trackedInfo(),trackMenu,trackQuest:changeTracked,guideTarget,journal,audit,clickTile,pathTo,isTargetTile,selectTool:id=>{if(!TOOLS.some(t=>t.id===id))throw Error('非法工具');return change(s=>{s.tool=id;s.log='执起'+TOOLS.find(t=>t.id===id).name+'。'})},
 diagnose:()=>({mapSize:DUNGEONS.every(d=>d.map.length===H&&d.map.every(r=>r.length===W)),cropCount:CROPS.length,clock:clockStr(state.minute),weather:weatherOf(state.day),season:seasonOf(state.day),energy:state.energy,npcCount:NPC.length,storyCompleted:Object.values(state.storyStages||{}).filter(n=>n===4).length,monsterCount:MONSTERS.length,assetCount:Object.keys(imageSources).length,mode:state.mode,area:state.area,toolGrade:state.toolGrade,shopCount:Object.keys(SHOP_INFO).length,houseLv:state.houseLv,wards:state.wards,meals:state.meals,day:state.day})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
