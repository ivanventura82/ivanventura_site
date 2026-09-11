import gsap from 'gsap';
import HomeMotion from './homeMotion.js';

// Studio and contact share the portfolio reveal, with short, unrotated text movement.
export default class EditorialMotion extends HomeMotion {
  constructor() {
    super({entryDistance:6,exitDistance:6,entryRotation:0,exitRotation:0,lineStagger:.08,entryDuration:.6});
  }
  get duration() { return 1600; }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .texto__ivan > div, .texto__ivan > h3, #foto__ivan, .premios__title, .premios, .studio > .mySwiper2, .estudio__onde, .contato > div')] : [];
  }
  photos() { return []; }
  prepare(slide) {
    super.prepare(slide);
    gsap.set(this.lines(slide),{clearProps:'clipPath'});
  }
  enter(slide, immediate=false, direction=1, onFinish=null) {
    const first = !this.activeSlide;
    super.enter(slide,immediate,direction,()=>{
      gsap.set(this.lines(slide),{clearProps:'clipPath'});
      onFinish?.();
    });
    if (!slide || this.media.matches || (immediate && !first)) return;
    if (first) this.timeline = gsap.timeline({onComplete:()=>{
      gsap.set(this.lines(slide),{clearProps:'clipPath'}); this.timeline=null;
    }});
    if (!this.timeline) return;
    this.lines(slide).forEach((line,index)=>{
      const start = (first ? .06 : this.settings.entryDelay) + index*.08;
      this.timeline.fromTo(line,{clipPath:direction===1?'inset(100% 0% 0% 0%)':'inset(0% 0% 100% 0%)'},
        {clipPath:'inset(0% 0% 0% 0%)',duration:.6,ease:'portfolio-in'},start);
      if (first) this.timeline.fromTo(line,{autoAlpha:0,y:6},{autoAlpha:1,y:0,duration:.6,ease:'portfolio-in'},start);
    });
  }
}
