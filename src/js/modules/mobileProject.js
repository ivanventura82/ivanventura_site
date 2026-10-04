import { mobileNavigation } from './mobileSite.js';
// Mobile-only project experience. Desktop initialization remains unchanged.
export default async function mobileProject() {
const host=document.createElement('div');
const root=host.attachShadow({mode:'open'});
document.body.replaceChildren(host);
document.documentElement.style.cssText='height:auto;overflow:auto;touch-action:auto';
document.body.style.cssText='margin:0;height:auto;min-height:100%;overflow:visible;position:static;background:#f5f4f0;touch-action:auto';
document.querySelector('meta[name="viewport"]').content='width=device-width,initial-scale=1,viewport-fit=cover';
root.innerHTML='<p style="padding:24px;font:18px Arial">Carregando projeto…</p>';
const decode=v=>String(v??'').replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[e]);
try {
const response=await fetch('./projetos.json');
if(!response.ok)throw Error('data');
const projects=await response.json();
const data=projects.find(p=>p.datahash===new URLSearchParams(location.search).get('datahash'));
if(!data)throw Error('project');
const title=decode(data.title);
document.title=title;
document.querySelector('meta[name="description"]').content=decode(data.description).slice(0,160);
root.innerHTML="<style>\n*{box-sizing:border-box}:host{scroll-behavior:smooth}:host{display:block;margin:0;background:#f5f4f0;color:#252520;font-family:Arial,Helvetica,sans-serif}button,a{-webkit-tap-highlight-color:transparent}button{font:inherit;color:inherit;cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible{outline:2px solid #527355;outline-offset:4px}header{display:flex;justify-content:space-between;align-items:center;padding:24px;max-width:1200px;margin:auto}header a{text-decoration:none;font-size:14px}header svg{width:66px;height:32px}.hero{position:relative;height:72svh;min-height:430px;max-height:900px;background:#626e72;overflow:hidden}.hero>button{display:block;width:100%;height:100%;padding:0;border:0;background:none}.hero img{width:100%;height:100%;object-fit:cover;object-position:52% center}.hero:after{content:'';position:absolute;inset:40% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.62));pointer-events:none}.hero-copy{position:absolute;bottom:35px;left:24px;right:24px;color:#fff;pointer-events:none;z-index:1}.eyebrow{font-size:14px;letter-spacing:.06em;margin:0 0 14px}h1{font-size:clamp(44px,9vw,88px);line-height:.98;font-weight:400;letter-spacing:-.055em;margin:0;max-width:10ch}.hero-copy p:last-child{font-size:18px;margin-bottom:0}.bar{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #d9d7cf;font-size:14px}.plain{border:0;background:none;padding:12px 0;text-decoration:underline;text-underline-offset:5px}.content{max-width:1000px;margin:auto;padding:46px 24px}h2{font-weight:400;font-size:34px;letter-spacing:-.04em;margin:0 0 24px}.content p{font-size:18px;line-height:1.65;margin:0 0 32px;max-width:62ch}.facts{display:grid;grid-template-columns:1fr 1fr;gap:26px 18px;margin:36px 0 0}.facts div{display:grid;gap:8px}.facts dt{font-size:14px;color:#686960}.facts dd{margin:0;font-size:17px}.gallery{max-width:1200px;margin:auto;padding:0 16px;display:grid;gap:16px}.photo{border:0;padding:0;background:#e5e3dc;display:block;position:relative;width:100%;overflow:hidden}.photo img{display:block;width:100%;height:auto;min-height:100px}.photo span{position:absolute;right:14px;bottom:14px;background:#f5f4f0ed;padding:9px 13px;font-size:14px;border-radius:24px}.credits{border-top:1px solid #d9d7cf;margin-top:40px;padding-top:24px}.credits summary{font-size:20px;cursor:pointer;min-height:44px}.credits dl{display:grid;grid-template-columns:1fr 1fr;gap:18px;font-size:15px;line-height:1.4}.credits dt{color:#666}.credits dd{margin:0}footer{padding:28px 24px 40px;max-width:1000px;margin:auto;display:flex;justify-content:space-between;font-size:14px}dialog{border:0;margin:0;padding:0;width:100%;max-width:none;height:100%;max-height:none;background:#151613;color:#fff;overflow:hidden}dialog::backdrop{background:#151613}.viewer-head{position:absolute;top:0;left:0;right:0;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:calc(10px + env(safe-area-inset-top)) 18px 10px;background:linear-gradient(#151613ee,transparent)}.viewer-head button,.viewer-foot button{min-width:48px;min-height:48px;border:0;background:none;color:inherit;font-size:25px}.viewer-head .thumb-toggle{font-size:14px}.stage{position:absolute;inset:76px 0 96px;display:grid;place-items:center;overflow:hidden;touch-action:none;user-select:none}.stage img{max-width:100%;max-height:100%;object-fit:contain;transform-origin:center;will-change:transform;pointer-events:none}.viewer-foot{position:absolute;bottom:0;left:0;right:0;padding:12px 18px calc(12px + env(safe-area-inset-bottom));display:flex;justify-content:space-between;align-items:center;background:#151613}.hint{font-size:13px;color:#bdbeb7;text-align:center}.thumbs{position:absolute;inset:76px 0 88px;background:#151613;z-index:3;padding:16px;overflow:auto;grid-template-columns:repeat(3,1fr);gap:10px;display:none}.thumbs.open{display:grid;align-content:start}.thumbs button{border:1px solid transparent;background:none;padding:0;aspect-ratio:1}.thumbs button[aria-current=true]{border-color:#fff}.thumbs img{width:100%;height:100%;object-fit:cover}.error{position:absolute;text-align:center;padding:24px;background:#151613}.error[hidden]{display:none}@media(min-width:800px){.hero-copy{left:max(40px,calc((100vw - 1100px)/2))}.hero{height:78svh}.gallery{grid-template-columns:1fr 1fr;align-items:start}.photo:first-child{grid-column:1/-1}.content{padding-block:64px}.facts{grid-template-columns:repeat(4,1fr)}.thumbs{grid-template-columns:repeat(6,1fr)}.stage{inset:76px 40px 96px}}@media(prefers-reduced-motion:reduce){:host{scroll-behavior:auto}}\n</style><header><a href=\"/index.html\" aria-label=\"Ivan Ventura\"><svg viewBox=\"0 0 94 46\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M0 0h5v46H0zM13 0h6l16 46h-6zM47 0h6L37 46h-6zM61 0h6L51 46h-6zM73 0h6l15 46h-6z\"/></svg></a><a href=\"/index.html\">Projetos</a></header><main id=\"top\"><section class=\"hero\"><button data-open=\"0\" aria-label=\"Abrir foto de capa e ampliar\"><img alt=\"\" fetchpriority=\"high\"></button><div class=\"hero-copy\"><p class=\"eyebrow\">VIW · UBATUBA</p><h1>Piscinas<br>sinuosas.</h1><p>Integradas à natureza.</p></div></section><div class=\"bar\"><span>Edifícios · 2023</span><button class=\"plain\" data-open=\"0\">Ver fotos ↗</button></div><section class=\"content\" id=\"sobre\"><h2>Entre mar e montanha.</h2><p>O design deste edifício residencial, que possui um total de 27 apartamentos, foi cuidadosamente concebido para combinar harmoniosamente com o ambiente natural ao seu redor. A sinuosidade das montanhas de Ubatuba serviu como uma fonte de inspiração para o desenho das piscinas exclusivas nas varandas de cada apartamento.</p><dl class=\"facts\"><div><dt>Área</dt><dd>8.500 m²</dd></div><div><dt>Local</dt><dd>Ubatuba · SP</dd></div><div><dt>Coautoria</dt><dd>Yuri Vital</dd></div><div><dt>Estado</dt><dd>Construído</dd></div></dl></section><section class=\"gallery\" aria-label=\"Fotografias do projeto\" id=\"photos\"></section><section class=\"content\"><details class=\"credits\"><summary>Ficha técnica</summary><dl id=\"credits\"></dl></details></section></main><footer><a href=\"/estudio.html\">Estúdio</a><a href=\"https://ivanventura.com.br/contato.html\">Contato ↗</a></footer><dialog id=\"viewer\" aria-label=\"Galeria de fotos VIW\"><div class=\"viewer-head\"><button id=\"close\" aria-label=\"Fechar galeria\">×</button><span id=\"count\" aria-live=\"polite\"></span><button class=\"thumb-toggle\" id=\"toggle\" aria-expanded=\"false\">Miniaturas</button></div><div class=\"stage\" id=\"stage\"><img id=\"large\" alt=\"\"><div class=\"error\" id=\"error\" hidden>Não foi possível carregar esta foto.<br><button id=\"retry\" class=\"plain\">Tentar novamente</button></div></div><div class=\"thumbs\" id=\"thumbs\"></div><div class=\"viewer-foot\"><button id=\"prev\" aria-label=\"Foto anterior\">‹</button><span class=\"hint\">Deslize para trocar<br>Use dois dedos para ampliar</span><button id=\"next\" aria-label=\"Próxima foto\">›</button></div></dialog>";
mobileNavigation(root);
root.querySelector('.eyebrow').textContent=title;
root.querySelector('h1').textContent=[data.subtitulo1 || data.title,data.subtitulo2].filter(Boolean).map(decode).join(' ');
root.querySelector('.hero-copy p:last-child').remove();
const polish=document.createElement('style');
polish.textContent='h1{max-width:100%;font-size:clamp(40px,9vw,72px);line-height:1.04;overflow-wrap:break-word}.facts div{align-content:start;align-self:start}.credits h2{font-size:26px;margin-bottom:24px}';
root.append(polish);
const landscapeStyle=document.createElement('style');
landscapeStyle.textContent='@media(orientation:landscape){#viewer{width:100vw;height:100dvh;max-height:100dvh}#viewer .stage{inset:0}#viewer .stage img{width:100%;height:100%;object-fit:contain}#viewer .viewer-head{padding:env(safe-area-inset-top,0px) max(12px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));background:linear-gradient(#0006,transparent)}#viewer .viewer-foot{padding:0 max(12px,env(safe-area-inset-right)) env(safe-area-inset-bottom,0px) max(12px,env(safe-area-inset-left));background:linear-gradient(transparent,#0006);pointer-events:none}#viewer .viewer-foot button{pointer-events:auto}#viewer .hint{display:none}#viewer .thumbs{inset:54px 0 52px}}';
root.append(landscapeStyle);
const cleanViewerStyle=document.createElement('style');
cleanViewerStyle.textContent='#viewer .stage{inset:0}#viewer .viewer-foot,#viewer #count,#viewer #toggle{display:none}#viewer .viewer-head{background:none;pointer-events:none;opacity:0;transition:opacity .2s}#viewer.controls-visible .viewer-head,#viewer .viewer-head:focus-within{opacity:1}#viewer .viewer-head #close{pointer-events:none;background:#15161380;border-radius:50%}#viewer.controls-visible #close,#viewer #close:focus-visible{pointer-events:auto}#viewer #close:focus:not(:focus-visible){outline:none}';
root.append(cleanViewerStyle);
const immersiveStyle=document.createElement('style');
immersiveStyle.textContent='#viewer[open]{position:fixed;inset:var(--photo-top,0px) auto auto var(--photo-left,0px);width:var(--photo-width,100vw);height:var(--photo-height,100dvh);max-width:none;max-height:none;z-index:1000;outline:none}#viewer .stage{display:block;position:absolute;inset:0;min-width:0;min-height:0;touch-action:pan-y}#viewer.is-zoomed .stage{touch-action:none}#viewer .stage img{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;max-height:none;object-fit:contain}#viewer .viewer-head:focus-within{opacity:0}#viewer.controls-visible .viewer-head,#viewer .viewer-head:has(:focus-visible){opacity:1}@media(orientation:landscape){#viewer .stage img{object-fit:cover}}';
root.append(immersiveStyle);
const disclosure=root.querySelector('.credits'),credits=document.createElement('div'),creditsTitle=document.createElement('h2');
credits.className='credits';creditsTitle.textContent='Ficha técnica';credits.append(creditsTitle,disclosure.querySelector('dl'));disclosure.replaceWith(credits);
root.querySelector('footer').remove();
root.querySelector('.bar').remove();
root.querySelector('#sobre h2').textContent='Sobre o projeto';
root.querySelector('#sobre p').textContent=decode(data.description);
root.querySelector('#sobre p').style.whiteSpace='pre-line';
root.querySelector('.facts').replaceChildren();
for(const [key,label] of [['área','Área'],['local','Local'],['co-autor','Coautoria'],['ano','Ano'],['estado','Estado']]){
 if(!data[key] || data[key]==='-')continue;
 const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
 dt.textContent=label;dd.textContent=decode(data[key])+(key==='área'?' m²':'');item.append(dt,dd);root.querySelector('.facts').append(item);
}
root.querySelector('#viewer').setAttribute('aria-label','Galeria de fotos '+title);
const $=s=>root.querySelector(s),viewer=$('#viewer'),stage=$('#stage'),large=$('#large');
let photos=[],index=0,scale=1,x=0,y=0,lastTap=0,start=null,pinch=null,opener=null,savedScroll=0,bodyPosition='',bodyTop='',bodyWidth='',tapTimer;const points=new Map();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,url=p=>p;
function draw(){viewer.classList.toggle('is-zoomed',scale>1);const mx=Math.max(0,(large.clientWidth*scale-stage.clientWidth)/2),my=Math.max(0,(large.clientHeight*scale-stage.clientHeight)/2);x=Math.max(-mx,Math.min(mx,x));y=Math.max(-my,Math.min(my,y));large.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;}
function reset(){scale=1;x=y=0;pinch=null;points.clear();draw();}
function show(n){index=(n+photos.length)%photos.length;reset();$('#error').hidden=true;large.alt=`${title} — fotografia ${index+1}`;large.src=url(photos[index]);$('#count').textContent=`${String(index+1).padStart(2,'0')} / ${photos.length}`;$('#thumbs').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',i===index));if(!reduced)large.animate([{opacity:.25},{opacity:1}],{duration:260,easing:'ease-out'});const next=new Image();next.src=url(photos[(index+1)%photos.length]);}
function fitViewer(){const viewport=window.visualViewport;viewer.style.setProperty('--photo-width',(viewport?.width||window.innerWidth)+'px');viewer.style.setProperty('--photo-height',(viewport?.height||window.innerHeight)+'px');viewer.style.setProperty('--photo-top',(viewport?.offsetTop||0)+'px');viewer.style.setProperty('--photo-left',(viewport?.offsetLeft||0)+'px');draw();}
window.visualViewport?.addEventListener('resize',fitViewer);window.visualViewport?.addEventListener('scroll',fitViewer);window.addEventListener('resize',fitViewer);
function open(n,el){if(!photos.length||viewer.open)return;opener=el;savedScroll=scrollY;bodyPosition=document.body.style.position;bodyTop=document.body.style.top;bodyWidth=document.body.style.width;viewer.classList.remove('controls-visible');viewer.setAttribute('tabindex','-1');root.querySelector('main').inert=true;root.querySelector('header').inert=true;viewer.show();fitViewer();show(n);viewer.focus({preventScroll:true});}
viewer.addEventListener('close',()=>{clearTimeout(tapTimer);root.querySelector('main').inert=false;root.querySelector('header').inert=false;});
viewer.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();viewer.close();}});
viewer.addEventListener('close',()=>{Object.assign(document.body.style,{position:bodyPosition,top:bodyTop,width:bodyWidth});window.scrollTo({top:savedScroll,behavior:'instant'});$('#thumbs').classList.remove('open');$('#toggle').setAttribute('aria-expanded','false');reset();opener?.focus({preventScroll:true});});
$('#close').onclick=()=>viewer.close();$('#prev').onclick=()=>show(index-1);$('#next').onclick=()=>show(index+1);$('#retry').onclick=()=>show(index);
$('#toggle').onclick=()=>{$('#toggle').setAttribute('aria-expanded',$('#thumbs').classList.toggle('open'));};large.onload=draw;large.onerror=()=>{$('#error').hidden=false;};
root.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)open(Number(b.dataset.open),b);});viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
const distance=()=>{const [a,b]=[...points.values()];return Math.hypot(a.x-b.x,a.y-b.y);};
stage.addEventListener('pointerdown',e=>{stage.setPointerCapture(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===1)start={x:e.clientX,y:e.clientY,px:x,py:y,moved:false,wasPinch:false};if(points.size===2){start.wasPinch=true;pinch={distance:distance(),scale};}});
stage.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2&&pinch){scale=Math.max(1,Math.min(4,pinch.scale*distance()/pinch.distance));draw();return;}if(points.size===1&&start){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>8)start.moved=true;if(scale>1){x=start.px+dx;y=start.py+dy;draw();}}});
stage.addEventListener('pointerup',e=>{if(!points.has(e.pointerId))return;points.delete(e.pointerId);if(points.size){const a=[...points.values()][0];start={x:a.x,y:a.y,px:x,py:y,moved:true,wasPinch:true};pinch=null;return;}if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(!start.wasPinch&&scale===1&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25){clearTimeout(tapTimer);viewer.classList.remove('controls-visible');show(index+(dx<0?1:-1));}else if(!start.moved&&!start.wasPinch){const now=Date.now();if(now-lastTap<320){clearTimeout(tapTimer);scale=scale>1?1:2.5;x=y=0;draw();lastTap=0;}else{lastTap=now;tapTimer=setTimeout(()=>{if(viewer.open)viewer.classList.toggle('controls-visible');},320);}}start=null;pinch=null;});
stage.addEventListener('pointercancel',()=>{points.clear();start=null;pinch=null;});stage.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(1,Math.min(4,scale-e.deltaY*.004));draw();},{passive:false});window.addEventListener('resize',draw);

photos=[...new Set([data.imagemhome||data.imagem1,data.imagem1,...data.slides.flat()].filter(Boolean))].map(name=>'./img/'+data.datahash+'/'+name+'-1920w.webp');
const cover=root.querySelector('.hero img');cover.src=photos[0];cover.alt=title;cover.srcset=photos[0].replace('-1920w','-720w')+' 720w, '+photos[0].replace('-1920w','-1024w')+' 1024w, '+photos[0]+' 1920w';cover.sizes='100vw';
for(let i=1;i<photos.length;i++){
 const b=document.createElement('button');b.className='photo';b.dataset.open=i;b.setAttribute('aria-label','Ampliar fotografia '+(i+1)+' — '+title);
 const img=document.createElement('img');img.src=photos[i].replace('-1920w','-1024w');img.alt=title+' — fotografia '+(i+1);img.loading='lazy';img.decoding='async';b.append(img);
 $('#photos').append(b);
}
photos.forEach((p,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Abrir fotografia '+(i+1));const img=document.createElement('img');img.src=p.replace('-1920w','-720w');img.alt='';img.loading='lazy';b.append(img);b.onclick=()=>{show(i);$('#thumbs').classList.remove('open');$('#toggle').setAttribute('aria-expanded','false');$('#toggle').focus();};$('#thumbs').append(b);});
// Remember the visible photograph before rotation changes the page geometry.
const orientation=matchMedia('(orientation: landscape)');
let visiblePhoto=null,openedByRotation=false,photoFrame=0;
function rememberPhoto(){
 if(viewer.open||orientation.matches)return;
 const height=window.innerHeight,headerBottom=root.querySelector('header').getBoundingClientRect().bottom;
 let nearest=Infinity;visiblePhoto=null;
 root.querySelectorAll('main [data-open]').forEach(button=>{
  const rect=button.getBoundingClientRect(),visible=Math.min(rect.bottom,height)-Math.max(rect.top,headerBottom);
  if(visible<Math.min(rect.height,height-headerBottom)*.35)return;
  const distance=Math.abs((rect.top+rect.bottom)/2-height/2);
  if(distance<nearest){nearest=distance;visiblePhoto=button;}
 });
}
window.addEventListener('scroll',()=>{if(photoFrame)return;photoFrame=requestAnimationFrame(()=>{photoFrame=0;rememberPhoto();});},{passive:true});
orientation.addEventListener?.('change',event=>{
 if(event.matches){if(!viewer.open&&visiblePhoto){openedByRotation=true;open(Number(visiblePhoto.dataset.open),visiblePhoto);}reset();}
 else if(openedByRotation&&viewer.open){viewer.close();}
 requestAnimationFrame(()=>{draw();rememberPhoto();});
});
viewer.addEventListener('close',()=>{openedByRotation=false;});
requestAnimationFrame(rememberPhoto);
(data.detalhes||[]).forEach(d=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=decode(d.titulo);dd.textContent=decode(d.valor);$('#credits').append(dt,dd);});
if(!data.detalhes?.length)root.querySelector('.credits').hidden=true;
} catch(error){root.innerHTML='<div style="padding:32px;font:18px Arial;line-height:1.6">Não foi possível abrir este projeto. <a href="">Tentar novamente</a> ou <a href="/index.html">voltar aos projetos</a>.</div>';console.error(error);}
}
