import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import HomeMotion from './homeMotion.js';

// Ajustes únicos para a ficha horizontal e a descrição de todos os projetos.
export const TEXT_WIPE = Object.freeze({ duration: .76, stagger: .15, distance: 6 });
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
    const blocks = this.textBlocks(slide);
    if (blocks.length) gsap.set(blocks, { autoAlpha: 0, y: 0, clipPath: openClip });
  }
  enter(slide, immediate = false, direction = 1, onFinish = null) {
    const previous = this.activeSlide;
    const blocks = this.textBlocks(slide);
    const animate = !immediate && !this.media.matches && previous && previous !== slide;
    if (blocks.length) gsap.set(blocks, { autoAlpha: animate ? 0 : 1, y: 0, clipPath: openClip });
    super.enter(slide, immediate, direction, onFinish);
    if (!animate || !this.timeline || !blocks.length) return;

    // Começa com a página descoberta para a máscara da página não cortar o wipe do texto.
    const start = this.settings.edgeDelay + this.settings.edgeDuration;
    const closedClip = direction === 1 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';
    blocks.forEach((block, index) => {
      this.timeline.fromTo(block, {
        autoAlpha: 1, clipPath: closedClip, y: direction * TEXT_WIPE.distance,
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
