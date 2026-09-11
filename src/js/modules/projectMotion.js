import HomeMotion from './homeMotion.js';

// Mesmo ritmo da home, aplicado à composição inteira e a cada foto dentro dela.
export default class ProjectMotion extends HomeMotion {
  constructor() {
    super({ entryDistance: 14, exitDistance: 10, entryRotation: 0, exitRotation: 0 });
  }
  photos(slide) {
    return slide ? [...slide.querySelectorAll('.slide-background-img, .project-photo-window img')] : [];
  }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .bio__project, .detalhes__project')] : [];
  }
}
