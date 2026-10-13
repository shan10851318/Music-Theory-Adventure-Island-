const Store={d:null,
 load(){if(this.d)return this.d;try{this.d=JSON.parse(localStorage.getItem("mtg")||"null")}catch(e){}return this.d=this.d||{cur:"",users:{}}},
 save(){try{localStorage.setItem("mtg",JSON.stringify(this.d))}catch(e){}},
 key(q){return q.q+(q.snd?JSON.stringify(q.snd):"")},
 cur(){return this.load().cur||"同學"},
 setCur(n){this.load().cur=String(n).replace(/[<>&"'`]/g,"").trim().slice(0,8);this.save()},
 u(n){const d=this.load();return d.users[n]=d.users[n]||{wrong:{},stats:{}}},
 wrong(q,n=this.cur()){const w=this.u(n).wrong,k=this.key(q),o=w[k]||{n:0};w[k]={q:q.q,a:q.a,c:q.c,e:q.e,t:q.t,l:q.l,snd:q.snd,g:q.g,n:o.n+1};this.save()},
 master(k,n=this.cur()){delete this.u(n).wrong[k];this.save()},
 clear(n=this.cur()){this.u(n).wrong={};this.save()},
 list(n=this.cur()){return Object.values(this.u(n).wrong)},
 users(){return Object.keys(this.load().users)},
 stat(m,v,n=this.cur()){const s=this.u(n).stats,o=s[m]||{best:0,plays:0};s[m]={best:Math.max(o.best,v),plays:o.plays+1};this.save();return s[m]},
 stats(n=this.cur()){return this.u(n).stats}};
/* 練習時間紀錄：只計算分頁在前景且最近 2 分鐘內有操作的時間，依週（週一開始）與遊戲分別累計 */
const Track={
 names:{monopoly:"🎲 樂理大富翁",arena:"⚡ 搶答擂台",ear:"👂 聽音練習",keyboard:"🎹 鍵盤與五線譜",survival:"🧠 連對挑戰",memory:"🃏 記憶配對",review:"📝 複習專區"},
 wk(d){const x=d?new Date(d):new Date();x.setDate(x.getDate()-(x.getDay()+6)%7);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")},
 add(mode,sec){Store.d=null;const u=Store.u(Store.cur());u.time=u.time||{};const k=this.wk(),t=u.time[k]=u.time[k]||{};t[mode]=(t[mode]||0)+sec;const ks=Object.keys(u.time).sort();while(ks.length>12)delete u.time[ks.shift()];Store.save()},
 week(n){Store.d=null;return(Store.u(n||Store.cur()).time||{})[this.wk()]||{}},
 start(mode){let act=Date.now();const bump=()=>{act=Date.now()};["pointerdown","keydown","touchstart","wheel","mousemove"].forEach(e=>addEventListener(e,bump,{passive:true}));
  setInterval(()=>{if(document.visibilityState==="visible"&&Date.now()-act<120000)this.add(mode,5)},5000)}};