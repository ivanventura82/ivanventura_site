export default class SlideUIManager {
  constructor(swiperInstance) {
    this.swiper = swiperInstance;
  }

  checkAndUpdateUIForSlideStart() {
    if (!this.isProjetosPage()) return;
    let currentSlideIndex = this.swiper.realIndex;
    console.log("Início da transição de slide: ", currentSlideIndex);
    if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
      this.updateUIForLastSlide();
    } else {
      this.updateUIForNonLastSlidesStart(currentSlideIndex);
    }
  }

  checkAndUpdateUIForSlideEnd() {
    if (!this.isProjetosPage()) return;
    let currentSlideIndex = this.swiper.realIndex;
    console.log("Fim da transição de slide: ", currentSlideIndex);
    if (!(currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica')) {
      this.updateUIForNonLastSlides(currentSlideIndex);
    }
  }

  updateUIForSlide(currentSlideIndex) {
    if (!this.isProjetosPage()) return;
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
    console.log("Atualizando UI para o slide:", currentSlideIndex);

    menuElements.forEach(el => el.classList.remove('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.remove('black'));

    if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
      menuElements.forEach(el => el.classList.remove('white-color'));
      paginationBullets.forEach(bullet => bullet.classList.add('black'));
    } else if (this.isProjetosPage()) {
      menuElements.forEach(el => {
        if (currentSlideIndex === 0) {
          el.classList.add('white-color');
        } else if (currentSlideIndex === 1) {
          el.classList.remove('white-color');
        } else {
          el.classList.add('white-color');
        }
      });
      if (currentSlideIndex === 1) {
        paginationBullets.forEach(bullet => bullet.classList.add('black'));
      }
    } else {
      menuElements.forEach(el => el.classList.add('white-color'));
    }
  }

  updateUIForLastSlide() {
    if (!this.isProjetosPage()) return;
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');

    menuElements.forEach(el => el.classList.remove('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.add('black'));
  }

  updateUIForNonLastSlidesStart(currentSlideIndex) {
    if (!this.isProjetosPage()) return;
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    console.log("Atualizando UI para slides não finais no início da transição: ", currentSlideIndex);

    if (this.isProjetosPage()) {
      menuElements.forEach(el => {
        if (currentSlideIndex === 0) {
          el.classList.add('white-color');
        }
        if (currentSlideIndex === 1) {
          el.classList.remove('white-color');
        }
      });
    } else {
      menuElements.forEach(el => el.classList.add('white-color'));
    }
  }

  updateUIForNonLastSlides(currentSlideIndex) {
    if (!this.isProjetosPage()) return;
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
    console.log("Atualizando UI para slides não finais no final da transição: ", currentSlideIndex);

    if (this.isProjetosPage()) {
      menuElements.forEach(el => {
        if (currentSlideIndex === 0) {
          el.classList.add('white-color');
        }
        if (currentSlideIndex === 1) {
          el.classList.remove('white-color');
        }
      });

      paginationBullets.forEach(bullet => bullet.classList.remove('black'));

      if (currentSlideIndex === 1) {
        paginationBullets.forEach(bullet => bullet.classList.add('black'));
      }
    } else {
      menuElements.forEach(el => el.classList.add('white-color'));
      paginationBullets.forEach(bullet => bullet.classList.remove('black'));
    }
  }

  isProjetosPage() {
    return window.location.pathname.includes('/projeto.html');
  }
}