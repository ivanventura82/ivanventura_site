import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import HomeMotion from './homeMotion.js';

// Ajustes únicos para a ficha horizontal e a descrição de todos os projetos.
export const TEXT_WIPE = Object.freeze({ duration: .6, stagger: .15, distance: 10 });
const textEase = CustomEase.create('project-text-wipe', '0.22,0.75,0.2,1');
const openClip = 'inset(0% 0% 0% 0%)';

export default class ProjectMotion extends HomeMotion {
  constructor() {
    super({ entryDistance: 14, exitDistance: 10, entryRotation: 0, exitRotation: 0 });
  }
  get duration() {
    return Math.max(super.duration, Math.ceil(1000 * (
      this.settings.edgeDelay + this.settings.edgeDuration + TEXT_WIPE.stagger + TEXT_WIPE.duration
    )));
  }
  photos(slide) {
    return slide ? [...slide.querySelectorAll('.slide-background-img, .project-photo-window img')] : [];
  }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .detalhes__project')] : [];
  }
  textBlocks(slide) {
    // Ordem explícita: os dados começam antes da descrição nos dois sentidos.
    return slide ? [slide.querySelector('.bio__project > ul'), slide.querySelector('.bio__project > p')].filter(Boolean) : [];
  }
  prepare(slide) {
    super.prepare(slide);
    slide?.classList.remove('project-text-entering');
    const blocks = this.textBlocks(slide);
    if (blocks.length) gsap.set(blocks, { force3D: true, autoAlpha: 0, y: 0, clipPath: openClip });
  }
  enter(slide, immediate = false, direction = 1, onFinish = null) {
    if (!slide) return;
    const previous = this.activeSlide;
    const blocks = this.textBlocks(slide);
    const animate = !immediate && !this.media.matches && previous && previous !== slide;
    if (blocks.length) gsap.set(blocks, { autoAlpha: animate ? 0 : 1, y: 0, clipPath: openClip });
    // Transformed children must not temporarily enlarge the native scroll area.
    slide.classList.toggle('project-text-entering', !!animate);
    super.enter(slide, immediate, direction, () => {
      slide.classList.remove('project-text-entering');
      onFinish?.();
    });
    if (!animate || !this.timeline || !blocks.length) return;

    // Both reading blocks fade continuously after the page reveal, metadata first.
    const start = this.settings.edgeDelay + this.settings.edgeDuration;
    blocks.forEach((block, index) => {
      this.timeline.fromTo(block, {
        autoAlpha: 0, clipPath: openClip, y: direction * TEXT_WIPE.distance,
      }, {
        autoAlpha: 1, clipPath: openClip, y: 0,
        duration: TEXT_WIPE.duration, ease: textEase,
      }, start + index * TEXT_WIPE.stagger);
    });
    const controls = slide.querySelectorAll('.expand-btn, .collapse-btn');
    if (controls.length) {
      this.timeline.set(controls, { visibility: 'hidden' }, 0);
      this.timeline.set(controls, { visibility: 'visible' }, start + TEXT_WIPE.stagger + TEXT_WIPE.duration);
    }
  }
}
