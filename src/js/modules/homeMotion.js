import gsap from 'gsap';

// Animate only the visible project, cancelling the previous timeline.
export default class HomeMotion {
  constructor() {
    this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.activeSlide = null;
    this.timelines = new Map();
  }

  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .link__title > span, .slide__title__link')] : [];
  }

  stop(slide) {
    this.timelines.get(slide)?.kill();
    this.timelines.delete(slide);
    if (!slide) return;
    gsap.killTweensOf([...this.lines(slide), ...slide.querySelectorAll('.slide-background-img')]);
  }

  prepare(slide) {
    this.stop(slide);
    gsap.set(this.lines(slide), { autoAlpha: 0, y: 0 });
  }

  reset() {
    for (const slide of this.timelines.keys()) this.stop(slide);
    this.activeSlide = null;
  }

  enter(slide, immediate = false) {
    if (!slide) return;
    const previous = this.activeSlide;
    if (previous && previous !== slide) {
      this.stop(previous);
      gsap.to(this.lines(previous), {
        autoAlpha: 0, y: -12, duration: this.media.matches ? 0 : 0.18,
        overwrite: true,
      });
    }
    this.stop(slide);
    this.activeSlide = slide;
    const lines = this.lines(slide);
    const photo = slide.querySelector('.slide-background-img');
    if (this.media.matches) {
      gsap.set(lines, { autoAlpha: 1, y: 0 });
      if (photo) gsap.set(photo, { scale: 1 });
      return;
    }
    const timeline = gsap.timeline();
    this.timelines.set(slide, timeline);
    timeline.fromTo(lines, { autoAlpha: 0, y: 26 }, {
      autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.11,
      ease: 'power3.out', overwrite: true,
    }, immediate ? 0.08 : 0.24);
    if (photo) {
      timeline.fromTo(photo, { scale: window.innerWidth <= 800 ? 1.012 : 1.025 }, {
        scale: 1, duration: 5.5, ease: 'power1.out', overwrite: true,
      }, 0);
    }
  }
}
