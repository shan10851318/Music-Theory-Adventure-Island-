const Snd={ctx:null,out:null,bus:null,
 CH:{大:[0,4,7],小:[0,3,7],減:[0,3,6],增:[0,4,8],屬七:[0,4,7,10],大七:[0,4,7,11],小七:[0,3,7,10],掛四:[0,5,7]},
 SC:{大調:[0,2,4,5,7,9,11,12],自然小調:[0,2,3,5,7,8,10,12],和聲小調:[0,2,3,5,7,8,11,12],五聲:[0,2,4,7,9,12],藍調:[0,3,5,6,7,10,12],全音:[0,2,4,6,8,10,12],半音:[0,1,2,3,4,5,6,7,8,9,10,11,12],多利安:[0,2,3,5,7,9,10,12],弗里吉亞:[0,1,3,5,7,8,10,12],利底亞:[0,2,4,6,7,9,11,12],混合利底亞:[0,2,4,5,7,9,10,12]},
 init(){if(this.ctx)return;const c=this.ctx=new(window.AudioContext||window.webkitAudioContext)(),m=this.out=c.createGain();m.gain.value=.9;
  const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=5000;const L=c.sampleRate*1.4|0,ir=c.createBuffer(2,L,c.sampleRate);
  for(let h=0;h<2;h++){const d=ir.getChannelData(h);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}
  const cv=c.createConvolver(),w=c.createGain();cv.buffer=ir;w.gain.value=.22;m.connect(f);f.connect(c.destination);f.connect(cv);cv.connect(w);w.connect(c.destination)},
 /* 類鋼琴音色：多個泛音疊加，高泛音衰減較快，並加上輕微殘響 */
 tone(f,t,d,v=.3){const c=this.ctx,g=c.createGain();g.connect(this.bus||this.out);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*.5,t+.006);g.gain.exponentialRampToValueAtTime(v*.18,t+Math.min(d,.8));g.gain.exponentialRampToValueAtTime(.0005,t+d+.4);
  [[1,1],[2,.5],[3,.3],[4,.18],[5,.1],[6,.06]].forEach(([k,a])=>{const o=c.createOscillator(),og=c.createGain();o.frequency.value=f*k*(1+.0002*k*k);og.gain.setValueAtTime(a,t);og.gain.exponentialRampToValueAtTime(a*.05,t+Math.max(.2,1.6/k));o.connect(og);og.connect(g);o.start(t);o.stop(t+d+.45)})},
 /* 節拍器木魚聲 */
 click(t,acc,v=.4){const c=this.ctx;[acc?1320:990,acc?1980:1485].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;g.gain.setValueAtTime(v/(i+1),t);g.gain.exponentialRampToValueAtTime(.0005,t+.09);o.connect(g);g.connect(this.bus||this.out);o.start(t);o.stop(t+.1)})},
 /* 持續音：用於節奏題，音符長度與休止都聽得出來 */
 hold(f,t,d,v=.25){const c=this.ctx,g=c.createGain();g.connect(this.bus||this.out);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v,t+Math.max(d-.04,.02));g.gain.linearRampToValueAtTime(0,t+d);
  [[1,1],[2,.35],[3,.15]].forEach(([k,a])=>{const o=c.createOscillator(),og=c.createGain();o.frequency.value=f*k;og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+d+.05)})},
 /* 停止上一段聲音，避免新舊聲音重疊 */
 stop(){const c=this.ctx,b=this.bus;if(!c||!b)return;this.bus=null;try{b.gain.cancelScheduledValues(c.currentTime);b.gain.setTargetAtTime(0,c.currentTime,.03)}catch(e){}setTimeout(()=>{try{b.disconnect()}catch(e){}},500)},
 play(s){this.init();const c=this.ctx;if(c.state==="suspended"&&c.resume)c.resume();this.stop();this.bus=c.createGain();this.bus.connect(this.out);let t=c.currentTime+.08;const F=m=>440*2**((m-69)/12);
  if(s.k==="note"){if(s.ref){this.tone(F(60),t,.9);t+=1.4}this.tone(F(s.m),t,1.6)}
  else if(s.k==="iv"){const a=s.root,b=s.root+s.semi;if(s.dir==="har"){this.tone(F(a),t,1.8);this.tone(F(b),t,1.8)}else if(s.dir==="down"){this.tone(F(b),t,.9);this.tone(F(a),t+1,1.2)}else{this.tone(F(a),t,.9);this.tone(F(b),t+1,1.2)}}
  else if(s.k==="ch"){const I=(this.CH[s.type]||[0,4,7]).slice();for(let i=0;i<(s.inv||0);i++)I.push(I.shift()+12);if(s.arp){(s.arp==="down"?I.slice().reverse():I).forEach((i,k)=>this.tone(F(s.root+i),t+k*.4,1.4,.22))}else I.forEach(i=>this.tone(F(s.root+i),t,2,.2))}
  else if(s.k==="iv2"){[[s.a,0],[s.b,2.8]].forEach(([m,o])=>{this.tone(F(s.root),t+o,.8);this.tone(F(s.root+m),t+o+.9,1.1)})}
  else if(s.k==="mel"){const d=s.dur||.6;s.notes.forEach((m,k)=>this.tone(F(m),t+k*d,d*1.4))}
  else if(s.k==="sc"){let A=this.SC[s.type];if(s.dir==="down")A=A.slice().reverse();A.forEach((i,k)=>this.tone(F(s.root+i),t+k*.45,.7))}
  else if(s.k==="dir"){s.notes.forEach((m,k)=>this.tone(F(m),t+k*.6,.9))}
  else{const U=.55;let x=t,tot=0;s.pat.forEach((d,k)=>{const L=Math.abs(d)*U;if(d>0)this.hold(F(72),x,L-.05,k===0?.3:.22);x+=L;tot+=Math.abs(d)});if(s.beat)for(let k=0;k<tot;k++)this.click(t+k*U,k===0,.14)}}};