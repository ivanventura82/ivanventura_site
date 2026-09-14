import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MOTION } from './homeMotion.js';

gsap.registerPlugin(CustomEase);
const key = 'ivan-project-entry-v2';
const zoom = CustomEase.create('project-entry-zoom', MOTION.zoomCurve);

export default function installProjectEntrance(owner) {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let leaving = false, leaveTimeline = null, leavingSlide = null;
  if (document.body.id === 'index-page') {
    document.addEventListener('click', event => {
      const link = event.target.closest('a.link__title');
      if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank' || reduced()) return;
      const url = new URL(link.href, location.href);
      const slide = link.closest('.swiper-slide');
      const photo = slide?.querySelector('.slide-background-img');
      if (url.origin !== location.origin || !url.pathname.endsWith('/projeto.html') || !photo) return;
      if (leaving) { event.preventDefault(); return; }
      const id = url.searchParams.get('datahash');
      try { sessionStorage.setItem(key, JSON.stringify({ id, src: photo.currentSrc || photo.src, at: Date.now() })); }
      catch (_) { return; }
      event.preventDefault();
      leaving = true; leavingSlide = slide;
      owner.swiper?.disable();
      const project = owner.carregaProjetosInstance?.todosProjetos.find(p => p.datahash === id);
      if (project) { const preload = new Image(); preload.src = '/img/' + id + '/' + (project.imagemhome || project.imagem1) + '-1024w.webp'; }
      leaveTimeline = gsap.timeline({ onComplete: () => location.assign(url.href) });
      leaveTimeline.to(owner.homeMotion.lines(slide), {
        autoAlpha:0, y:-14, rotation:0,
        transformOrigin:'left center', duration:MOTION.exitDuration, stagger:MOTION.lineStagger,
        ease:'power2.in',
      }, 0);
      leaveTimeline.to(photo, {scale:1.10,duration:.35,ease:zoom}, 0);
    });
    window.addEventListener('pageshow', () => {
      if (!leavingSlide) return;
      leaveTimeline?.kill();
      gsap.set(owner.homeMotion.lines(leavingSlide), {autoAlpha:1,y:0,rotation:0});
      gsap.set(leavingSlide.querySelector('.slide-background-img'), {scale:MOTION.restingScale});
      owner.swiper?.enable(); leaving=false; leavingSlide=null;
    });
    return;
  }
  if (document.body.id !== 'pagina-projeto') return;
  let record;
  try { record=JSON.parse(sessionStorage.getItem(key)); sessionStorage.removeItem(key); } catch (_) {}
  if (!record || reduced() || Date.now()-record.at>15000 || record.id!==new URLSearchParams(location.search).get('datahash') || location.hash) return;
  let source;
  try { source=new URL(record.src,location.href); } catch (_) { return; }
  if (source.origin!==location.origin || !source.pathname.startsWith('/img/')) return;
  const overlay=document.createElement('div');
  overlay.className='project-entry-overlay'; overlay.setAttribute('aria-hidden','true');
  const cover=new Image(); cover.src=source.href; cover.alt='';
  cover.style.transform='scale(1.10)'; overlay.appendChild(cover); document.querySelector('.mySwiper').appendChild(overlay);
  let timeline, finished=false, locked=false;
  const finish=()=>{
    if(finished)return; finished=true;
    clearTimeout(timeout); timeline?.kill(); overlay.remove();
    if(locked && !owner.swiper?.destroyed) owner.swiper?.enable();
    document.removeEventListener('ProjectMotionReady',ready);
  };
  const ready=async()=>{
    const swiper=owner.swiper;
    const slide=swiper?.slides[swiper.activeIndex];
    if(!slide){finish();return;}
    locked=!!swiper.enabled; swiper.disable();
    const photo=slide.querySelector('.slide-background-img');
    try {
      if(photo) { photo.removeAttribute('srcset'); photo.src=source.href; }
      await Promise.race([
        Promise.all([cover.decode(), ...(photo ? [photo.decode()] : [])]),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('Entry image unavailable')),4000))
      ]);
      if(finished)return;
      timeline=gsap.timeline({onComplete:finish});
      // Keep the selected photograph continuous across the navigation.
      timeline.to(cover,{scale:MOTION.restingScale,duration:.7,ease:zoom},0);
      if(photo) timeline.fromTo(photo,{scale:1.10,yPercent:0},{scale:MOTION.restingScale,yPercent:0,duration:.7,ease:zoom},0);
      timeline.to(overlay,{opacity:0,duration:.35,ease:'power1.inOut'},.25);
      timeline.fromTo(owner.projectMotion.lines(slide),{autoAlpha:0,y:14,rotation:0},{autoAlpha:1,y:0,rotation:0,duration:.5,stagger:.06,ease:'power3.out'},.25);
    } catch (_) {finish();}
  };
  const timeout=setTimeout(finish,5000);
  document.addEventListener('ProjectMotionReady',ready,{once:true});
  window.addEventListener('pagehide',finish,{once:true});
}
