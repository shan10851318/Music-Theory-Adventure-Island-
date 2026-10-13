const QZ={
 art(q){try{return questionIllustration(q)}catch(e){return "🎼"}},
 shuf(b){const o=b.a.map((_,i)=>i).sort(()=>Math.random()-.5);return{...b,a:o.map(i=>b.a[i]),c:o.indexOf(b.c)}},
 pick(max=3){const p=questions.filter(q=>q.l<=max);return this.shuf(p[Math.random()*p.length|0])},
 card(el,q,onPick){
  el.innerHTML=`<div class="qa"><span class="badge">${["","初級","中級","高級"][q.l]||""}</span> <span class="badge">🎼 ${TL[q.t]||q.t}</span><div class="art">${q.snd?'<button class="sun" id="qPlay">🔊 播放聲音</button>':QZ.art(q)}</div><div class="qt">${q.q}</div><div class="ans">${q.a.map((a,i)=>`<button data-i="${i}">${"ABCD"[i]}. ${a}</button>`).join("")}</div><div id="qExp"></div></div>`;
  const B=[...el.querySelectorAll(".ans button")];
  if(q.snd){const p=()=>Snd.play(q.snd);el.querySelector("#qPlay").onclick=p;setTimeout(p,300)}
  B.forEach((b,i)=>b.onclick=()=>onPick&&onPick(i));
  return{B,mark:(i,c)=>B[i].classList.add(c),lock:v=>B.forEach(b=>b.disabled=v),
   reveal:()=>{B.forEach((b,i)=>{b.disabled=true;if(i===q.c)b.classList.add("ok")});el.querySelector("#qExp").innerHTML=`<div class="exp">💡 ${q.e}</div>`}}}};