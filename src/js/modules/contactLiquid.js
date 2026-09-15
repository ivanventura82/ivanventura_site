// Gentle local bending of the existing logo outlines; no canvas or input interception.
export function liquidOffset(point, cursor, radius = 13, strength = 2.1) {
  const dx = point.x - cursor.x, dy = point.y - cursor.y;
  const distance = Math.hypot(dx, dy);
  if (distance >= radius) return {x:0,y:0};
  const influence = Math.pow(1 - distance / radius, 2);
  const divisor = Math.max(distance, 0.8);
  return {x:dx / divisor * strength * influence, y:dy / divisor * strength * influence};
}

export default function installContactLiquid() {
  const svg = document.querySelector('.contact-logo-lines svg');
  if (!svg) return;
  const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const paths = [...svg.querySelectorAll('.contact-logo-bar')].map(path => {
    const length = path.getTotalLength();
    const points = Array.from({length:96}, (_,i) => {
      const p = path.getPointAtLength(length * i / 96);
      return {x:p.x,y:p.y,dx:0,dy:0};
    });
    return {path,original:path.getAttribute('d'),points};
  });
  let frame=0, last=0, active=false, x=0, y=0, disposed=false;
  function restore() {
    cancelAnimationFrame(frame); frame=0; last=0;
    paths.forEach(({path,original,points}) => {
      path.setAttribute('d',original);
      points.forEach(p=>{p.dx=0;p.dy=0;});
    });
  }
  function tick(now) {
    frame=0;
    if(disposed || !svg.isConnected) { dispose(); return; }
    if(!media.matches || document.hidden) {active=false;restore();return;}
    const slide=svg.closest('.swiper-slide');
    if(slide?.inert) active=false;
    const dt=last ? Math.min(40,now-last) : 16.7; last=now;
    const blend=1-Math.exp(-dt / (active ? 105 : 240));
    let residual=0;
    paths.forEach(({path,points})=>{
      const matrix=path.getScreenCTM();
      const cursor=active && matrix ? new DOMPoint(x,y).matrixTransform(matrix.inverse()) : null;
      const coordinates=points.map(p=>{
        const target=cursor ? liquidOffset(p,cursor) : {x:0,y:0};
        p.dx+=(target.x-p.dx)*blend; p.dy+=(target.y-p.dy)*blend;
        residual=Math.max(residual,Math.abs(p.dx),Math.abs(p.dy));
        return (p.x+p.dx).toFixed(3)+','+(p.y+p.dy).toFixed(3);
      });
      path.setAttribute('d','M'+coordinates.join(' L')+' Z');
    });
    if(active || residual>.002) frame=requestAnimationFrame(tick);
    else restore();
  }
  function wake() { if(!frame && !disposed) frame=requestAnimationFrame(tick); }
  function move(event) {
    if(!media.matches || event.pointerType==='touch') return;
    x=event.clientX;y=event.clientY;active=true;wake();
  }
  function leave() {active=false;wake();}
  function preference() {active=false;restore();}
  function visibility() {if(document.hidden){active=false;restore();}}
  function dispose() {
    if(disposed)return;disposed=true;restore();observer.disconnect();
    document.removeEventListener('pointermove',move);
    document.documentElement.removeEventListener('pointerleave',leave);
    window.removeEventListener('blur',leave);
    document.removeEventListener('visibilitychange',visibility);
    media.removeEventListener('change',preference);
  }
  const observer=new MutationObserver(()=>{if(!svg.isConnected)dispose();});
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',leave,{passive:true});
  window.addEventListener('blur',leave);
  document.addEventListener('visibilitychange',visibility);
  media.addEventListener('change',preference);
}
