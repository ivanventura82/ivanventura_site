import gsap from 'gsap';
import HomeMotion, { MOTION } from './homeMotion.js';

// Opening titles share the project typography motion; body sections retain their reveal.
export default class EditorialMotion extends HomeMotion {
  constructor() {
    super({entryDistance:6,exitDistance:6,entryRotation:0,exitRotation:0,lineStagger:.08,entryDuration:.6});
  }
  get duration() { return 1600; }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .texto__ivan > div, .texto__ivan > h3, #foto__ivan, .premios__title, .premios, .awards-list, .awards-viewer, .studio > .mySwiper2, .estudio__onde, .contato > div')] : [];
  }
  photos() { return []; }
  prepare(slide) {
    super.prepare(slide);
    gsap.set(this.lines(slide),{clearProps:'clipPath'});
  }
  enter(slide, immediate=false, direction=1, onFinish=null) {
    const first = !this.activeSlide;
    const isTitle = !!slide?.querySelector('.main__title');
    this.settings = isTitle ? {...MOTION} : {...MOTION,entryDistance:6,exitDistance:6,entryRotation:0,exitRotation:0,lineStagger:.08,entryDuration:.6};
    super.enter(slide,immediate,direction,()=>{
      gsap.set(this.lines(slide),{clearProps:'clipPath'});
      onFinish?.();
    });
    if (!slide || this.media.matches || (immediate && !first)) return;
    if (first) this.timeline = gsap.timeline({onComplete:()=>{
      gsap.set(this.lines(slide),{clearProps:'clipPath'}); this.timeline=null;
    }});
    if (!this.timeline) return;
    if (isTitle) {
      if (first) this.lines(slide).forEach((line,index)=>{
        this.timeline.fromTo(line,{autoAlpha:0,y:direction*MOTION.entryDistance,rotation:direction*MOTION.entryRotation,transformOrigin:'0% 50%',clearProps:'clipPath'},
          {autoAlpha:1,y:0,rotation:0,duration:MOTION.entryDuration,ease:'portfolio-in'},line.closest('.contato') ? .45 + [...line.parentElement.children].indexOf(line)*.09 : .06+index*MOTION.lineStagger);
      });
      return;
    }
    this.lines(slide).forEach((line,index)=>{
      const start = (first ? .06 : this.settings.entryDelay) + index*.08;
      this.timeline.fromTo(line,{clipPath:direction===1?'inset(100% 0% 0% 0%)':'inset(0% 0% 100% 0%)'},
        {clipPath:'inset(0% 0% 0% 0%)',duration:.6,ease:'portfolio-in'},start);
      if (first) this.timeline.fromTo(line,{autoAlpha:0,y:6},{autoAlpha:1,y:0,duration:.6,ease:'portfolio-in'},start);
    });
  }
}
