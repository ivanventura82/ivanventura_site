import gsap from 'gsap';
import { MOTION } from './homeMotion.js';

export default function installHomeReturn(owner) {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let leaving=false, overlay, timeline, oldLines=[];
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[data-menu="logo"], a.nav__button__home');
    if(!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target==='_blank')return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin)return;
    event.preventDefault();
    if(leaving || owner.categoryBusy)return;
    leaving=true;
    if(reduced()){location.assign('/index.html?return=logo');return;}
    owner.motion?.timeline?.progress(1);
    owner.swiper?.disable();
    const slide=owner.swiper?.slides[owner.swiper.activeIndex];
    oldLines=slide ? [...slide.querySelectorAll('.main__title > span,.link__title > span,.slide__title__link,.bio__project,.detalhes__project,.contato,.texto__ivan,.premios__title')] : [];
    overlay=document.createElement('div');overlay.className='home-return-wipe';overlay.setAttribute('aria-hidden','true');
    overlay.style.cssText='position:fixed;inset:0;background:#fff;z-index:2;pointer-events:none;clip-path:inset(100% 0 0 0)';
    document.body.appendChild(overlay);
    timeline=gsap.timeline({onComplete:()=>location.assign('/index.html?return=logo')});
    timeline.to(oldLines,{autoAlpha:0,y:-12,rotation:0,duration:.22,stagger:.035,ease:'power2.in'},0);
    timeline.to(overlay,{clipPath:'inset(0% 0 0 0)',duration:.48,ease:'power3.inOut'},.08);
    timeline.call(()=>document.querySelectorAll('.menu-principal .white-color').forEach(el=>el.classList.remove('white-color')),null,.42);
  });
  window.addEventListener('pageshow',()=>{
    if(!leaving)return;
    timeline?.kill();overlay?.remove();
    gsap.set(oldLines,{autoAlpha:1,y:0,rotation:0});
    owner.swiper?.enable();owner.slideChange?.();
    owner.slideUIManager?.updateUIForSlide(owner.swiper?.activeIndex || 0);
    leaving=false;
  });
  if(new URLSearchParams(location.search).get('return')!=='logo')return;
  let started=false;
  const reveal=()=>{
    if(started)return;
    const intro=document.querySelector('.mySwiper [data-hash="slide1"]');
    if(!intro)return;
    started=true;clearTimeout(fallback);
    const lines=[...intro.querySelectorAll('.main__title > span')];
    const finish=()=>{
      document.documentElement.classList.remove('home-return-pending');
      gsap.set(lines,{clearProps:'clipPath',autoAlpha:1,y:0,rotation:0});
    };
    if(reduced()){finish();return;}
    // Install the hidden starting pose before lifting the first-paint guard.
    gsap.set(lines,{autoAlpha:0,clearProps:'clipPath',y:MOTION.entryDistance,rotation:MOTION.entryRotation,transformOrigin:'0% 50%'});
    document.documentElement.classList.remove('home-return-pending');
    const introTimeline=gsap.timeline({onComplete:()=>{ if(owner.homeMotion?.timeline===introTimeline) owner.homeMotion.timeline=null; finish(); }});
    if(owner.homeMotion) owner.homeMotion.timeline=introTimeline;
    introTimeline.to(lines,{autoAlpha:1,y:0,rotation:0,duration:MOTION.entryDuration,stagger:MOTION.lineStagger,ease:'portfolio-in'});
  };
  document.addEventListener('HomeMotionReady',reveal,{once:true});
  const fallback=setTimeout(reveal,2500);
}
