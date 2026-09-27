export default class SlideUIManager {
  constructor(swiperInstance) { this.swiper = swiperInstance; }
  isProjetosPage() { return document.body.id === 'pagina-projeto'; }
  updateUIForSlide(index) {
    const home = document.body.id === 'index-page';
    const studio = document.body.id === 'estudio-page';
    if (!this.isProjetosPage() && !home && !studio) return;
    const slide = this.swiper.slides[index];
    if (!slide) return;
    const light = home ? !slide.querySelector('.slide-background-img') : studio ? !slide.classList.contains('office-section') : slide.classList.contains('project-text-slide');
    document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar')
      .forEach(el => el.classList.toggle('white-color', !light));
    document.querySelectorAll('.swiper-pagination-bullet')
      .forEach(el => el.classList.toggle('black', light));
  }
  checkAndUpdateUIForSlideStart() { this.updateUIForSlide(this.swiper.activeIndex); }
  checkAndUpdateUIForSlideEnd() { this.updateUIForSlide(this.swiper.activeIndex); }
  updateUIForLastSlide() { this.updateUIForSlide(this.swiper.activeIndex); }
  updateUIForNonLastSlidesStart(index) { this.updateUIForSlide(index); }
  updateUIForNonLastSlides(index) { this.updateUIForSlide(index); }
}

