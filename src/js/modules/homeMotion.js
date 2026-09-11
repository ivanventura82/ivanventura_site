import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

// Ajustes compartilhados por todos os projetos da página inicial (segundos/graus).
export const MOTION = Object.freeze({
  edgeDelay: .18, edgeDuration: .65, edgeCurve: '0.65,0,0.3,1',
  exitDuration: .29, entryDelay: .57, entryDuration: .48,
  lineStagger: .065, captionDelay: .12,
  exitDistance: 30, entryDistance: 43, exitRotation: 2, entryRotation: 3,
  restingScale: 1.08, transitionScale: 1.18, photoTravel: 3,
  zoomDuration: .82, zoomCurve: '0.25,0.1,0.25,1',
  exitCurve: '0.55,0,0.8,0.45', entryCurve: '0.16,1,0.3,1',
});
const edgeEase = CustomEase.create('portfolio-edge', MOTION.edgeCurve);
const zoomEase = CustomEase.create('portfolio-zoom', MOTION.zoomCurve);
const exitEase = CustomEase.create('portfolio-out', MOTION.exitCurve);
const entryEase = CustomEase.create('portfolio-in', MOTION.entryCurve);

export default class HomeMotion {
  constructor(settings = {}) {
    this.settings = { ...MOTION, ...settings };
    this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.activeSlide = null;
    this.timeline = null;
    this.onFinish = null;
  }
  get duration() {
    return Math.ceil(1000 * Math.max(this.settings.edgeDelay + this.settings.zoomDuration,
      this.settings.entryDelay + this.settings.captionDelay + this.settings.entryDuration));
  }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .link__title > span, .slide__title__link')] : [];
  }
  photos(slide) {
    return slide ? [...slide.querySelectorAll('.slide-background-img')] : [];
  }
  prepare(slide) {
    gsap.set(slide, { visibility: 'hidden', clipPath: 'inset(0% 0% 0% 0%)', zIndex: 0 });
    slide.inert = true;
    const lines = this.lines(slide);
    if (lines.length) gsap.set(lines, { autoAlpha: 0, y: 0, rotation: 0, transformOrigin: '0% 50%' });
    const photo = this.photos(slide);
    if (photo.length) gsap.set(photo, { scale: this.settings.restingScale, yPercent: 0 });
  }
  reset() {
    this.timeline?.kill();
    this.timeline = null;
    this.onFinish?.();
    this.onFinish = null;
    this.activeSlide = null;
  }
  enter(slide, immediate = false, direction = 1, onFinish = null) {
    if (!slide) return;
    const previous = this.activeSlide;
    this.timeline?.kill();
    this.onFinish?.();
    this.onFinish = onFinish;
    this.activeSlide = slide;
    const finish = () => {
      if (previous && previous !== slide) this.prepare(previous);
      gsap.set(slide, { visibility: 'visible', clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 });
      this.timeline = null;
      const callback = this.onFinish;
      this.onFinish = null;
      callback?.();
    };
    if (immediate || this.media.matches || !previous || previous === slide) {
      [...slide.parentElement.children].forEach(other => {
        if (other !== slide && other.classList.contains('swiper-slide')) this.prepare(other);
      });
      slide.inert = false;
      const lines = this.lines(slide);
      if (lines.length) gsap.set(lines, { autoAlpha: 1, y: 0, rotation: 0 });
      const photo = this.photos(slide);
      if (photo.length) gsap.set(photo, { scale: this.settings.restingScale, yPercent: 0 });
      finish();
      return;
    }
    previous.inert = true;
    slide.inert = false;
    gsap.set(previous, { zIndex: 1 });
    gsap.set(slide, { visibility: 'visible', zIndex: 2,
      clipPath: direction === 1 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' });
    const timeline = gsap.timeline({ onComplete: finish });
    this.timeline = timeline;
    const stagger = (line, i, lines) => line.classList.contains('slide__title__link')
      ? this.settings.captionDelay
      : (direction === 1 ? i : lines.filter(el => !el.classList.contains('slide__title__link')).length - 1 - i) * this.settings.lineStagger;
    const oldLines = this.lines(previous), newLines = this.lines(slide);
    oldLines.forEach((line, i) => timeline.to(line, {
      autoAlpha: 0, y: -direction * this.settings.exitDistance,
      rotation: -direction * this.settings.exitRotation, transformOrigin: '0% 50%',
      duration: this.settings.exitDuration, ease: exitEase,
    }, stagger(line, i, oldLines)));
    timeline.to(slide, { clipPath: 'inset(0% 0% 0% 0%)',
      duration: this.settings.edgeDuration, ease: edgeEase }, this.settings.edgeDelay);
    const outgoingPhoto = this.photos(previous);
    const incomingPhoto = this.photos(slide);
    if (outgoingPhoto.length) timeline.to(outgoingPhoto, {
      scale: this.settings.transitionScale, yPercent: -direction * this.settings.photoTravel,
      duration: this.settings.edgeDuration, ease: edgeEase,
    }, this.settings.edgeDelay);
    if (incomingPhoto.length) timeline.fromTo(incomingPhoto, {
      scale: this.settings.transitionScale, yPercent: direction * this.settings.photoTravel,
    }, { scale: this.settings.restingScale, yPercent: 0,
      duration: this.settings.zoomDuration, ease: zoomEase }, this.settings.edgeDelay);
    newLines.forEach((line, i) => timeline.fromTo(line, {
      autoAlpha: 0, y: direction * this.settings.entryDistance,
      rotation: direction * this.settings.entryRotation, transformOrigin: '0% 50%',
    }, { autoAlpha: 1, y: 0, rotation: 0, duration: this.settings.entryDuration, ease: entryEase,
    }, this.settings.entryDelay + stagger(line, i, newLines)));
  }
}

