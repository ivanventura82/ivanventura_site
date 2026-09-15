// Rigid logo pieces: translation only, spring return and convex polygon contacts.
const SHAPES = [
  [[0,0],[4.573,0],[4.573,36.582],[0,36.582]],
  [[11.41,0],[16.208,0],[27.438,36.582],[22.638,36.582]],
  [[40.928,0],[45.728,0],[34.498,36.582],[29.7,36.582]],
  [[56.955,0],[61.709,0],[50.481,36.582],[45.727,36.582]],
  [[64.018,0],[68.772,0],[80,36.582],[75.246,36.582]]
];
export function contact(a,b) {
  let depth=Infinity,normal=null;
  for(const shape of [a,b]) for(let i=0;i<shape.length;i++) {
    const p=shape[i],q=shape[(i+1)%shape.length];
    const len=Math.hypot(q[0]-p[0],q[1]-p[1]);
    const axis=[-(q[1]-p[1])/len,(q[0]-p[0])/len];
    const pa=a.map(p=>p[0]*axis[0]+p[1]*axis[1]);
    const pb=b.map(p=>p[0]*axis[0]+p[1]*axis[1]);
    const overlap=Math.min(Math.max(...pa),Math.max(...pb))-Math.max(Math.min(...pa),Math.min(...pb));
    if(overlap<=0)return null;
    if(overlap<depth){depth=overlap;normal=axis;}
  }
  const center=p=>p.reduce((s,v)=>[s[0]+v[0]/p.length,s[1]+v[1]/p.length],[0,0]);
  const ca=center(a),cb=center(b);
  if((cb[0]-ca[0])*normal[0]+(cb[1]-ca[1])*normal[1]<0)normal=normal.map(v=>-v);
  return {depth,normal};
}

// Drag-and-throw rigid logo, with angular collision impulses.
export default function installContactLiquid() {
 const svg=document.querySelector('.contact-logo-lines svg');
 if(!svg)return;
 const media=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
 const pieces=[...svg.querySelectorAll('.contact-logo-bar')].map((path,i)=>{
  const shape=SHAPES[i],cx=shape.reduce((s,p)=>s+p[0]/4,0),cy=18.291;
  return {path,shape,cx,cy,x:0,y:0,vx:0,vy:0,a:0,w:0};
 });
 let frame=0,last=0,disposed=false,drag=null,cursor=null,returnAt=0;
 const clamp=(v,n)=>Math.max(-n,Math.min(n,v));
 const vertices=p=>p.shape.map(([x,y])=>{
  const c=Math.cos(p.a),s=Math.sin(p.a),dx=x-p.cx,dy=y-p.cy;
  return [p.cx+p.x+dx*c-dy*s,p.cy+p.y+dx*s+dy*c];
 });
 function point(e){
  const m=svg.getScreenCTM();
  return m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()):null;
 }
 function nearest(poly,c){
  let distance=Infinity,point=null;
  for(let i=0;i<4;i++){
   const a=poly[i],b=poly[(i+1)%4],dx=b[0]-a[0],dy=b[1]-a[1];
   const t=Math.max(0,Math.min(1,((c.x-a[0])*dx+(c.y-a[1])*dy)/(dx*dx+dy*dy)));
   const q={x:a[0]+dx*t,y:a[1]+dy*t},d=Math.hypot(q.x-c.x,q.y-c.y);
   if(d<distance){distance=d;point=q;}
  }
  return {distance,point};
 }
 function pick(c){
  if(!c)return null;
  for(const p of [...pieces].reverse()){
   const poly=vertices(p);
   const sides=poly.map((a,i)=>{const b=poly[(i+1)%4];return (b[0]-a[0])*(c.y-a[1])-(b[1]-a[1])*(c.x-a[0]);});
   if(sides.every(v=>v>=0)||sides.every(v=>v<=0)||nearest(poly,c).distance<.65)return p;
  }
  return null;
 }
 const blocked=e=>e.target instanceof Element&&e.target.closest('a,button,input,textarea,select,[role="button"]');
 function down(e){
  if(!media.matches||e.button!==0||blocked(e))return;
  const c=point(e),p=pick(c);if(!p)return;
  e.preventDefault();
  const dx=c.x-p.cx-p.x,dy=c.y-p.cy-p.y;
  drag={p,id:e.pointerId,gx:dx*Math.cos(p.a)+dy*Math.sin(p.a),gy:-dx*Math.sin(p.a)+dy*Math.cos(p.a),target:c};
  cursor=c;returnAt=performance.now()+2200;
  document.documentElement.style.cursor='grabbing';
  try{svg.setPointerCapture(e.pointerId);}catch{}
 }
 function move(e){
  if(e.pointerType==='touch')return;
  cursor=point(e);
  if(drag&&e.pointerId===drag.id){drag.target=cursor;returnAt=performance.now()+2200;}
 }
 function release(){
  if(drag){try{svg.releasePointerCapture(drag.id);}catch{}}
  drag=null;document.documentElement.style.removeProperty('cursor');returnAt=performance.now()+2200;
 }
 function tick(now){
  frame=0;
  if(disposed||!svg.isConnected){dispose();return;}
  if(!media.matches||document.hidden)return;
  const dt=last?Math.min(.025,(now-last)/1000):1/60;last=now;
  // Small substeps keep thrown slender pieces from tunnelling through one another.
  for(let step=0;step<4;step++){
   const h=dt/4;
   for(const p of pieces){
    const held=drag&&drag.p===p,returning=now>returnAt;
    let ax=-p.vx*1.3-(returning?p.x*.7:0),ay=-p.vy*1.3-(returning?p.y*.7:0);
    let aw=-p.w*1.4-(returning?Math.atan2(Math.sin(p.a),Math.cos(p.a))*.7:0);
    if(held){
     const c=Math.cos(p.a),s=Math.sin(p.a),rx=drag.gx*c-drag.gy*s,ry=drag.gx*s+drag.gy*c;
     const fx=clamp((drag.target.x-p.cx-p.x-rx)*110-(p.vx-p.w*ry)*14,650);
     const fy=clamp((drag.target.y-p.cy-p.y-ry)*110-(p.vy+p.w*rx)*14,650);
     ax+=fx;ay+=fy;aw+=(rx*fy-ry*fx)/125;
    }else if(cursor&&!drag){
     const near=nearest(vertices(p),cursor);
     if(near.distance<7&&near.distance>.01){
      const force=12*Math.pow(1-near.distance/7,2);
      ax+=(near.point.x-cursor.x)/near.distance*force;
      ay+=(near.point.y-cursor.y)/near.distance*force;
     }
    }
    p.vx=clamp(p.vx+ax*h,55);p.vy=clamp(p.vy+ay*h,55);p.w=clamp(p.w+aw*h,3);
    p.x+=p.vx*h;p.y+=p.vy*h;p.a+=p.w*h;
    // Keep every piece within reach even after an energetic throw.
    if(Math.abs(p.x)>24){p.x=clamp(p.x,24);p.vx*=-.3;}
    if(Math.abs(p.y)>16){p.y=clamp(p.y,16);p.vy*=-.3;}
   }
   for(let pass=0;pass<3;pass++)for(let i=0;i<pieces.length;i++)for(let j=i+1;j<pieces.length;j++){
    const a=pieces[i],b=pieces[j],va=vertices(a),vb=vertices(b),hit=contact(va,vb);
    if(!hit)continue;
    const [nx,ny]=hit.normal;
    const support=(v,sign)=>{
     const dots=v.map(p=>sign*(p[0]*nx+p[1]*ny)),max=Math.max(...dots);
     const face=v.filter((p,k)=>max-dots[k]<.05);
     return face.reduce((s,p)=>[s[0]+p[0]/face.length,s[1]+p[1]/face.length],[0,0]);
    };
    const sa=support(va,1),sb=support(vb,-1),qx=(sa[0]+sb[0])/2,qy=(sa[1]+sb[1])/2;
    const arx=qx-a.cx-a.x,ary=qy-a.cy-a.y,brx=qx-b.cx-b.x,bry=qy-b.cy-b.y;
    const ra=arx*ny-ary*nx,rb=brx*ny-bry*nx;
    const speed=(b.vx-b.w*bry-a.vx+a.w*ary)*nx+(b.vy+b.w*brx-a.vy-a.w*arx)*ny;
    if(speed<0){
     const impulse=-1.35*speed/(2+(ra*ra+rb*rb)/125);
     a.vx-=nx*impulse;a.vy-=ny*impulse;a.w-=ra*impulse/125;
     b.vx+=nx*impulse;b.vy+=ny*impulse;b.w+=rb*impulse/125;
    }
    const correction=Math.max(0,hit.depth-.003)*.48;
    a.x-=nx*correction;a.y-=ny*correction;b.x+=nx*correction;b.y+=ny*correction;
   }
  }
  for(const p of pieces){
   p.path.style.animation='none';
   p.path.style.transform='translate('+p.x.toFixed(3)+'px,'+p.y.toFixed(3)+'px) rotate('+p.a.toFixed(5)+'rad)';
  }
  frame=requestAnimationFrame(tick);
 }
 function stop(){
  cancelAnimationFrame(frame);frame=0;last=0;release();cursor=null;
  for(const p of pieces){p.x=p.y=p.vx=p.vy=p.a=p.w=0;p.path.style.removeProperty('animation');p.path.style.removeProperty('transform');}
 }
 function change(){stop();if(media.matches&&!document.hidden&&!disposed)frame=requestAnimationFrame(tick);}
 function leave(){cursor=null;release();}
 function up(e){if(drag&&e.pointerId===drag.id)release();}
 function dispose(){
  if(disposed)return;disposed=true;stop();observer.disconnect();
  document.removeEventListener('pointerdown',down);document.removeEventListener('pointermove',move);
  document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
  window.removeEventListener('blur',leave);document.removeEventListener('visibilitychange',change);media.removeEventListener('change',change);
 }
 const observer=new MutationObserver(()=>{if(!svg.isConnected)dispose();});
 observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('pointerdown',down);document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
 window.addEventListener('blur',leave);document.addEventListener('visibilitychange',change);media.addEventListener('change',change);
 change();
}
