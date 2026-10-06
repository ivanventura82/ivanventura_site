// One owner per gesture: the stage changes slides, the separate rail previews them.
export default function mobileHomeMotion(root, stage, changed){
 const slides=[...stage.children];
 const style=document.createElement('style');
 style.textContent=`
 main{position:fixed;inset:0;width:100%;height:100dvh;overflow:hidden;touch-action:pinch-zoom;overscroll-behavior:none}
 main .slide{position:absolute;inset:0;width:100%;height:100%!important;min-height:0;display:none;scroll-snap-align:none;overflow:hidden}
 main .slide.active{display:block}
 main .cover{filter:none;transform:none!important;transition:none!important;backface-visibility:hidden}
 main .slogan-line>span,main .project-meta{transition:none!important;transform:none;opacity:1;transform-origin:0 100%}
 main .project-link{user-select:none;-webkit-user-select:none}
 :host .scrub{right:0;width:44px}:host .scrub button{width:44px;padding-right:12px}:host .scrub-preview{right:52px;touch-action:manipulation}
 `;
 root.append(style);
 let index=0,busy=false,destroyed=false,serial=0,gesture=null,suppressClickUntil=0,wheelSum=0,wheelTimer,queued=null;
 const running=new Set();
 const ease='cubic-bezier(.22,.68,.2,1)';
 const animate=(el,frames,options)=>{const a=el.animate(frames,options);running.add(a);a.finished.catch(()=>{}).then(()=>running.delete(a));return a;};
 const prepare=i=>{const image=slides[i]?.querySelector('.cover');if(!image)return Promise.resolve();image.loading='eager';return image.decode().catch(()=>{});};
 const neighbours=()=>{prepare(index-1);prepare(index+1);};
 const textIn=(slide,dir)=>{
  [...slide.querySelectorAll('.slogan-line>span'),slide.querySelector('.project-meta')].filter(Boolean).forEach((el,n)=>{
   animate(el,[{opacity:0,transform:`translate3d(0,${dir*110}%,0) rotate(${dir*3}deg)`},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg)'}],{duration:760,delay:130+n*75,easing:ease,fill:'backwards'});
  });
 };
 async function go(next){
  next=Math.max(0,Math.min(slides.length-1,next));
  if(destroyed||next===index)return;
  if(busy){queued=next;return;}
  busy=true;const token=++serial;
  await prepare(next);
  if(destroyed||token!==serial)return;
  const outgoing=slides[index],incoming=slides[next],dir=next>index?1:-1;
  incoming.style.display='block';incoming.style.zIndex='2';outgoing.style.zIndex='1';
  incoming.inert=false;outgoing.inert=true;
  const full='inset(0% 0% 0% 0%)';
  const clip=animate(incoming,[{clipPath:dir>0?'inset(100% 0% 0% 0%)':'inset(0% 0% 100% 0%)'},{clipPath:full}],{duration:820,easing:ease,fill:'both'});
  const cover=incoming.querySelector('.cover');
  // Animate a wrapper-free image translation; the wipe always covers the viewport.
  animate(cover,[{translate:`0 ${dir*8}%`,scale:'1.18'},{translate:'0 0',scale:'1'}],{duration:1000,easing:ease});
  const oldCover=outgoing.querySelector('.cover');
  animate(oldCover,[{translate:'0 0'},{translate:`0 ${dir*-12}%`}],{duration:820,easing:ease});
  outgoing.querySelectorAll('.slogan-line>span,.project-meta').forEach((el,n)=>animate(el,[{opacity:1,transform:'translate3d(0,0,0) rotate(0deg)'},{opacity:0,transform:`translate3d(0,${dir*-85}%,0) rotate(${dir*-3}deg)`}],{duration:420,delay:n*30,easing:ease,fill:'forwards'}));
  incoming.classList.add('active');textIn(incoming,dir);index=next;changed(index);neighbours();
  await clip.finished.catch(()=>{});
  if(destroyed||token!==serial)return;
  outgoing.classList.remove('active');outgoing.style.display='none';outgoing.style.zIndex='';
  outgoing.getAnimations({subtree:true}).forEach(a=>a.cancel());
  incoming.style.display='';incoming.style.zIndex='';clip.cancel();busy=false;
  if(queued!==null){const target=queued;queued=null;go(target);}
 }
 function down(e){
  if(e.button!==0||!e.isPrimary||busy)return;
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,fired:false};
 }
 function move(e){
  if(!gesture||gesture.id!==e.pointerId)return;
  const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
  if(Math.max(Math.abs(dx),Math.abs(dy))<22||gesture.fired)return;
  gesture.fired=true;suppressClickUntil=performance.now()+700;
  stage.setPointerCapture(e.pointerId);
  // Both orientations accept their natural swipe direction.
  const distance=Math.abs(dy)>=Math.abs(dx)?dy:dx;
  go(index+(distance<0?1:-1));
 }
 function up(e){if(gesture?.id!==e.pointerId)return;if(gesture.fired)suppressClickUntil=performance.now()+400;gesture=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);}
 function click(e){if(performance.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();}}
 function wheel(e){e.preventDefault();if(busy)return;wheelSum+=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>wheelSum=0,160);if(Math.abs(wheelSum)>45){const dir=Math.sign(wheelSum);wheelSum=0;go(index+dir);}}
 function key(e){if(root.querySelector('.sheet').open)return;const direction={ArrowDown:1,ArrowRight:1,PageDown:1,ArrowUp:-1,ArrowLeft:-1,PageUp:-1}[e.key];if(direction){e.preventDefault();go(index+direction);}}
 stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move);stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);stage.addEventListener('click',click,true);stage.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);
 slides.forEach((slide,i)=>{slide.classList.toggle('active',i===0);slide.inert=i!==0;});
 if(slides.length){textIn(slides[0],1);neighbours();}
 return {go,destroy(){destroyed=true;serial++;clearTimeout(wheelTimer);running.forEach(a=>a.cancel());style.remove();stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerup',up);stage.removeEventListener('pointercancel',up);stage.removeEventListener('click',click,true);stage.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);}};
}
