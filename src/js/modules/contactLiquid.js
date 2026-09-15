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
export default function installContactLiquid() {
  const svg=document.querySelector('.contact-logo-lines svg');
  if(!svg)return;
  const media=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const pieces=[...svg.querySelectorAll('.contact-logo-bar')].map((path,i)=>({
    path,shape:SHAPES[i],x:0,y:0,vx:0,vy:0
  }));
  let frame=0,last=0,time=0,active=false,mx=0,my=0,disposed=false;
  const vertices=p=>p.shape.map(([x,y])=>[x+p.x,y+p.y]);
  function nearest(poly,c) {
    let best=null,distance=Infinity;
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dy=b[1]-a[1];
      const t=Math.max(0,Math.min(1,((c.x-a[0])*dx+(c.y-a[1])*dy)/(dx*dx+dy*dy)));
      const p={x:a[0]+t*dx,y:a[1]+t*dy},d=Math.hypot(p.x-c.x,p.y-c.y);
      if(d<distance){distance=d;best=p;}
    }
    return {point:best,distance};
  }
  function stop(){
    cancelAnimationFrame(frame);frame=0;last=0;
    pieces.forEach(p=>{p.path.style.removeProperty('animation');p.path.style.removeProperty('transform');p.x=p.y=p.vx=p.vy=0;});
  }
  function tick(now){
    frame=0;
    if(disposed||!svg.isConnected){dispose();return;}
    if(!media.matches||document.hidden){stop();return;}
    const dt=last?Math.min(.033,(now-last)/1000):1/60;last=now;time+=dt;
    const matrix=svg.getScreenCTM();
    const cursor=active&&matrix?new DOMPoint(mx,my).matrixTransform(matrix.inverse()):null;
    pieces.forEach((p,i)=>{
      const tx=Math.sin(time*.24+i*1.3)*1.2,ty=Math.sin(time*.19+i)*.8;
      let ax=(tx-p.x)*5-p.vx*4.5,ay=(ty-p.y)*5-p.vy*4.5;
      if(cursor){
        const near=nearest(vertices(p),cursor);
        if(near.distance<9){
          const dx=near.point.x-cursor.x,dy=near.point.y-cursor.y;
          const d=Math.max(.5,near.distance),force=38*Math.pow(1-near.distance/9,2);
          ax+=dx/d*force;ay+=dy/d*force;
        }
      }
      p.vx+=ax*dt;p.vy+=ay*dt;
      const speed=Math.hypot(p.vx,p.vy);
      if(speed>8){p.vx*=8/speed;p.vy*=8/speed;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;
    });
    for(let pass=0;pass<4;pass++) for(let i=0;i<pieces.length;i++) for(let j=i+1;j<pieces.length;j++){
      const a=pieces[i],b=pieces[j],hit=contact(vertices(a),vertices(b));
      if(!hit)continue;
      const [nx,ny]=hit.normal,correction=(hit.depth+.001)*.5;
      a.x-=nx*correction;a.y-=ny*correction;b.x+=nx*correction;b.y+=ny*correction;
      const velocity=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
      if(velocity<0){
        const impulse=-velocity*.6;
        a.vx-=nx*impulse;a.vy-=ny*impulse;b.vx+=nx*impulse;b.vy+=ny*impulse;
      }
    }
    pieces.forEach(p=>{
      p.path.style.animation='none';
      p.path.style.transform='translate('+p.x.toFixed(3)+'px,'+p.y.toFixed(3)+'px)';
    });
    frame=requestAnimationFrame(tick);
  }
  function start(){if(!disposed&&media.matches&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
  function move(e){if(e.pointerType==='touch')return;mx=e.clientX;my=e.clientY;active=true;}
  function leave(){active=false;}
  function change(){active=false;stop();start();}
  function dispose(){
    if(disposed)return;disposed=true;stop();observer.disconnect();
    document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);
    window.removeEventListener('blur',leave);document.removeEventListener('visibilitychange',change);media.removeEventListener('change',change);
  }
  const observer=new MutationObserver(()=>{if(!svg.isConnected)dispose();});
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',leave,{passive:true});
  window.addEventListener('blur',leave);
  document.addEventListener('visibilitychange',change);media.addEventListener('change',change);
  start();
}
