import gsap from 'gsap';
import HomeMotion, { MOTION } from './homeMotion.js';

// Titles use the portfolio choreography; reading blocks never rotate.
export default class EditorialMotion extends HomeMotion {
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .profile-title, .premios__title')] : [];
  }
  blocks(slide) {
    return slide ? [...slide.querySelectorAll('.texto__ivan > p, .awards-caption, .awards-viewer, .studio > .mySwiper2, .office-location, .contato > div')] : [];
  }
  photos(slide) {
    return slide ? [...slide.querySelectorAll('.office-section .slide-background-img')] : [];
  }
  prepare(slide) {
    super.prepare(slide);
    gsap.set([...this.blocks(slide), ...slide.querySelectorAll('#foto__ivan')], {autoAlpha:0,y:0,rotation:0,clearProps:'clipPath'});
  }
  enter(slide, immediate=false, direction=1, onFinish=null) {
    const previous=this.activeSlide;
    const first=!previous;
    try {
      super.enter(slide,immediate,direction,onFinish);
      if (!slide) return;
      const blocks=this.blocks(slide), portrait=slide.querySelector('#foto__ivan');
      if (this.media.matches || (immediate && !first)) {
        gsap.set([...blocks,...(portrait?[portrait]:[])],{autoAlpha:1,y:0,rotation:0,clearProps:'clipPath,scale'});
        return;
      }
      if (first) {
        this.timeline=gsap.timeline({onComplete:()=>{this.timeline=null;}});
        this.timeline.fromTo(this.lines(slide),{autoAlpha:0,y:direction*MOTION.entryDistance,rotation:direction*MOTION.entryRotation},
          {autoAlpha:1,y:0,rotation:0,duration:MOTION.entryDuration,stagger:MOTION.lineStagger,ease:'portfolio-in'},.06);
      }
      const timeline=this.timeline;
      if (!timeline) return;
      if (previous && previous!==slide) {
        timeline.to([...this.blocks(previous),...previous.querySelectorAll('#foto__ivan')],
          {autoAlpha:0,y:-direction*10,rotation:0,duration:.28,stagger:.025,ease:'portfolio-out'},0);
      }
      const start=first?.16:MOTION.entryDelay+.08;
      timeline.fromTo(blocks,{autoAlpha:0,y:direction*16,rotation:0},
        {autoAlpha:1,y:0,rotation:0,duration:.48,stagger:.035,ease:'portfolio-in'},start);
      if(portrait) timeline.fromTo(portrait,
        {autoAlpha:1,clipPath:direction===1?'inset(100% 0 0 0)':'inset(0 0 100% 0)',scale:1.035,y:0,rotation:0},
        {clipPath:'inset(0% 0 0 0)',scale:1,duration:.65,ease:'portfolio-edge'},first?.16:.3);
    } finally {
      if(slide) {
        clearTimeout(window.editorialEntryFallback);
        document.documentElement.classList.remove('editorial-entry-pending');
      }
    }
  }
}
