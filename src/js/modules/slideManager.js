import gsap from 'gsap';

export default class SlideManager {
  constructor() {
    // Inicialize se necessário
  }

  // Funções específicas para o projeto
  adjustTextVisibility(bioProject) {
    const descricao = bioProject.querySelector('p');
    const expandBtn = bioProject.querySelector('.expand-btn');
    const collapseBtn = bioProject.querySelector('.collapse-btn');
    const ul = bioProject.querySelector('ul');

    if (!descricao || !expandBtn || !collapseBtn || !ul) {
      console.error('Um ou mais elementos necessários não foram encontrados!');
      return;
    }

    const viewportHeight = window.innerHeight;
    const heightLimit = viewportHeight * 0.9;
    const bioHeight = bioProject.offsetHeight;

    if (window.innerWidth <= 800) {
      if (bioHeight > heightLimit) {
        descricao.textContent = descricao.textContent.substring(0, 100) + '...';
        expandBtn.style.display = 'block';
        collapseBtn.style.display = 'none';

        expandBtn.addEventListener('click', () => {
          descricao.textContent = descricao.textContent;
          ul.style.display = 'none';
          expandBtn.style.display = 'none';
          collapseBtn.style.display = 'block';
          bioProject.classList.add('expanded');
        });

        collapseBtn.addEventListener('click', () => {
          descricao.textContent = descricao.textContent.substring(0, 100) + '...';
          ul.style.display = 'block';
          expandBtn.style.display = 'block';
          collapseBtn.style.display = 'none';
          bioProject.classList.remove('expanded');
        });
      } else {
        expandBtn.style.display = 'none';
        collapseBtn.style.display = 'none';
        descricao.textContent = descricao.textContent;
      }
    } else {
      descricao.textContent = descricao.textContent;
      expandBtn.style.display = 'none';
      collapseBtn.style.display = 'none';
      ul.style.display = 'block';
    }
  }

  selectSubtitles() {
    const subtitle1 = document.querySelector('.subtitle__part1');
    const subtitle2 = document.querySelector('.subtitle__part2');
    const subtitle3 = document.querySelector('.subtitle__part3');
    return [subtitle1, subtitle2, subtitle3].filter(sub => sub !== null);
  }

  animateSubtitles() {
    const subtitles = this.selectSubtitles();
    gsap.set(subtitles, { opacity: 0, y: 400 });
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    subtitles.forEach(subtitle => {
      tl.to(subtitle, { opacity: 1, y: "25vh", duration: 0.3 }, "+=0.1");
    });
    tl.to(subtitles, { y: 0, duration: 0.3, stagger: 0.1 });
  }

  startInitialAnimation() {
    const firstSlide = document.querySelector('.swiper-slide');
    if (firstSlide && !firstSlide.dataset.initialAnimated) {
      this.animateSubtitles();
      firstSlide.dataset.initialAnimated = true;
    }
  }

  selectButtons() {
    const botaoLogo = document.querySelector('.nav__button__home');
    const botaoProjetos = document.querySelector('.menu__projetos');
    const botaoMobile = document.querySelector('.nav__button__mobile');
    const botaoEstudio = document.querySelector('.nav__button__estudio');
    const botaoContato = document.querySelector('.nav__button__contato');
    const botaoDown = document.getElementById('botao-down');
    const botaoVoltar = document.getElementById('botao-voltar');
    return [botaoLogo, botaoProjetos, botaoMobile, botaoEstudio, botaoContato, botaoDown, botaoVoltar].filter(btn => btn !== null);
  }

  animateButtons() {
    const buttons = this.selectButtons();
    const menuItems = document.querySelectorAll('.menu__projetos li');
    gsap.set([...buttons, ...menuItems], { opacity: 0 });

    if (buttons.length === 0) {
      console.error('Required button elements not found');
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 2 });
    tl.to(buttons, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, "+=0.1");

    if (this.projetosList && this.projetosList.classList.contains(this.activeClass)) {
      tl.to(menuItems, {
        opacity: 1,
        duration: 0.3,
        stagger: { amount: 0.5, from: "end" }
      }, "-=0.1");
    }
  }

  animateSlideElements(slide) {
    const subtitle1 = slide.querySelector('.subtitle__part2');
    const subtitle2 = slide.querySelector('.subtitle__part3');
    const titleLinkDiv = slide.querySelector('.slide__title__link');

    if (!subtitle1 || !subtitle2 || !titleLinkDiv) {
      console.log('Elementos faltando, animação interrompida.');
      return;
    }

    console.log('Iniciando animação para:', slide);
    gsap.set([titleLinkDiv, subtitle1, subtitle2], { opacity: 0, y: 20 });

    const tl = gsap.timeline({ defaults: { duration: 0.4, ease: "power2.out" } });
    tl.to(subtitle1, { opacity: 1, y: 0 }, "+=0.3")
      .to(subtitle2, { opacity: 1, y: 0 }, "+=0.2")
      .to(titleLinkDiv, { opacity: 1, y: 0 }, "+=0.2");

    tl.eventCallback("onComplete", () => {
      console.log('Animação concluída para:', slide);
    });
  }

  clearSlideAnimations(slide) {
    const elements = slide.querySelectorAll('.slide__title, .slide__title__arrow, .subtitle__part2, .subtitle__part3');
    elements.forEach(el => {
      gsap.set(el, { clearProps: "all" });
    });
  }
}