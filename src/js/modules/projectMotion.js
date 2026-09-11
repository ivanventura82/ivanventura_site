import HomeMotion from './homeMotion.js';

// Mesmo ritmo da home, aplicado à composição inteira e a cada foto dentro dela.
export default class ProjectMotion extends HomeMotion {
  photos(slide) {
    return slide ? [...slide.querySelectorAll('.slide-background-img, .project-photo-window img')] : [];
  }
  lines(slide) {
    return slide ? [...slide.querySelectorAll('.main__title > span, .bio__project > ul, .bio__project > p, .detalhes__project > ul')] : [];
  }
}
