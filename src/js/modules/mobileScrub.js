let cancelScroll;
export function animateScroll(target, duration=520){
 cancelScroll?.();
 const from=window.scrollY,to=Math.max(0,target),start=performance.now();
 const html=document.documentElement,previous=html.style.scrollSnapType;html.style.scrollSnapType='none';
 let frame,stopped=false;
 const stop=()=>{stopped=true;cancelAnimationFrame(frame);html.style.scrollSnapType=previous;window.removeEventListener('touchstart',stop);cancelScroll=null;};cancelScroll=stop;
 window.addEventListener('touchstart',stop,{once:true,passive:true});
 const tick=now=>{if(stopped)return;const t=Math.min(1,(now-start)/duration);window.scrollTo({top:from+(to-from)*(1-Math.pow(1-t,4)),behavior:'instant'});if(t<1)frame=requestAnimationFrame(tick);else stop();};frame=requestAnimationFrame(tick);
}
export default function mobileScrub(root,items,select,{parent=root}={}){
 if(!root.querySelector('[data-scrub-style]')){const style=document.createElement('style');style.dataset.scrubStyle='';style.textContent='.scrub{position:fixed;right:8px;top:50%;transform:translateY(-50%);width:36px;max-height:42svh;z-index:25;display:flex;flex-direction:column;touch-action:none;user-select:none}.scrub button{flex:1 1 22px;min-height:5px;max-height:22px;width:36px;padding:0 4px;border:0;background:none;display:flex;align-items:center;justify-content:flex-end;color:inherit}.scrub button:after{content:"";width:12px;height:1px;background:currentColor;opacity:.5}.scrub button[aria-current=true]:after{width:25px;height:2px;opacity:1;background:#b7ed83}.scrub-preview{position:fixed;right:52px;width:132px;height:94px;padding:0;border:1px solid #fff;background:#eee;z-index:26;box-shadow:0 3px 16px #0002;overflow:hidden}.scrub-preview[hidden]{display:none}.scrub-preview img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;pointer-events:none}#viewer .scrub{position:absolute;color:white}';root.append(style);}
 const nav=document.createElement('nav');nav.className='scrub';nav.setAttribute('aria-label','Prévia por imagens');
 const preview=document.createElement('button');preview.className='scrub-preview';preview.hidden=true;const image=document.createElement('img');image.alt='';preview.append(image);parent.append(nav,preview);
 let chosen=0,drag=false,timer;
 const display=(i,y)=>{clearTimeout(timer);chosen=i;image.src=items[i].src;preview.setAttribute('aria-label','Abrir '+items[i].label);preview.style.top=Math.max(80,Math.min(window.innerHeight-130,y-47))+'px';preview.hidden=false;};
 const hide=()=>{timer=setTimeout(()=>preview.hidden=true,1600);};
 const active=i=>[...nav.children].forEach((b,n)=>b.setAttribute('aria-current',n===i));
 const pick=y=>{const rect=nav.getBoundingClientRect();return Math.max(0,Math.min(items.length-1,Math.floor((y-rect.top)/rect.height*items.length)));};
 items.forEach((item,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',item.label);b.onclick=e=>{if(e.detail===0){select(i);active(i);}};b.onpointerenter=e=>{if(e.pointerType==='mouse')display(i,e.clientY);};b.onpointerleave=()=>{if(!drag)hide();};nav.append(b);});
 nav.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();drag=true;nav.setPointerCapture(e.pointerId);display(pick(e.clientY),e.clientY);};
 nav.onpointermove=e=>{if(drag)display(pick(e.clientY),e.clientY);};
 nav.onpointerup=e=>{if(!drag)return;drag=false;select(chosen);active(chosen);hide();};
 nav.onpointercancel=()=>{drag=false;preview.hidden=true;};
 preview.onclick=()=>{select(chosen);active(chosen);preview.hidden=true;};active(0);
 return {nav,active,destroy(){clearTimeout(timer);nav.remove();preview.remove();}};
}
