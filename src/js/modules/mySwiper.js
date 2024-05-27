import gsap from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cards';
import 'swiper/css/mousewheel';

export default class MySwiper {
  constructor(menuProjetosInstance) {
    this.menuProjetos = menuProjetosInstance;
    this.swiper = null;
    this.allSlides = [];
    this.allMenuItems = [];
    this.filtroAtivo = false;
    this.setupResizeListener();
}

  initialize() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeSwiper();
      this.setupFilterLinks();
      this.applyFilterFromURL(); // Certifique-se de que está sendo chamado corretamente
      // Verifica se está na página de projeto e abre o menu
    });
  }

  initializeSwiper() {
    const pagination = document.querySelector('.swiper-pagination');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
    const menuLateral = document.querySelector('.menu-lateral');
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu-projetos="list"] a, [data-menu="button"], #hamburguer, #botao-voltar');

    // Initialize Swiper instance
    this.initializeSwiperInstance();
    if (this.isEstudioPage()) {
      this.initializeSwiper2();
      this.initializeSwiper3();
    }

    // Initialize pagination and menu lateral if they exist, and hide them initially
    if (this.isProjetosPage()) {
      menuElements.forEach(el => el.classList.add('white-color'));
    }

  if (pagination) {
    this.initializePagination(pagination, !!menuLateral);
    pagination.style.display = 'none'; // Inicia com a paginação escondida.
    if (this.isEstudioPage() || this.isProjetosPage() ) {
      pagination.style.opacity = '1';
      pagination.style.display = 'flex';
      paginationBullets.forEach(bullet => bullet.classList.add('black'));

    } else {
      // pagination.style.opacity = '0'; 
      pagination.style.display = 'none'; // Esconde inicialmente a paginação usando display none
    }
  }  

    if (menuLateral) {
      this.initializeMenuLateral(menuLateral);
      menuLateral.style.display = 'none'; // Hide menu lateral initially
    }
  
    // Collect slides and menu items
    this.allSlides = Array.from(document.querySelectorAll('.swiper-slide'));
    this.allMenuItems = Array.from(document.querySelectorAll('.project-menu-item'));
  
    // Setup filter links
    this.setupFilterLinks();
    this.applyFilterFromURL();

    if (!this.isNotIndexPage()) {
      this.applyFilterFromURL();
    }
  }

  initializeSwiperInstance() {
      console.log("Inicializando Swiper...");

      this.swiper = new Swiper(".mySwiper", {
        modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation],
        direction: "vertical",
        speed: 1000,
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        threshold: 10,
        allowTouchMove: true,
        followFinger: true,
        mousewheel: true,
        passiveListeners: true,
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        preloadImages: false,
        watchSlidesVisibility: true,
        watchSlidesProgress: true, 
        lazy: {
          loadPrevNext: true,
          loadPrevNextAmount: 5,
          loadOnTransitionStart: true,
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
        effect: 'slide',
        preventClicksPropagation: false,
        hashNavigation: {
          watchState: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        on: {
          slideChangeTransitionStart: this.handleSlideChangeStart.bind(this),
          slideChangeTransitionEnd: this.handleSlideChangeEnd.bind(this),
          slideChange: this.slideChange.bind(this),
          init: this.handleSwiperInit.bind(this),
          imagesReady: this.handleImagesReady.bind(this),
        },
      });

      console.log("Swiper inicializado:", this.swiper);
      document.dispatchEvent(new CustomEvent('SwiperReady')); // Event indicating Swiper is ready
  }

  handleSwiperInit() {
    console.log("Swiper instance initialization complete.");

    if (this.isEstudioPage()) {
      const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
      paginationBullets.forEach(bullet => bullet.classList.add('black'));
    }
    if (!this.isNotIndexPage()) { // Assuming this method checks if it's not the index page
      this.applyDisplayNoneToFirstBullet();
    }
    this.startInitialAnimation();
    this.setupEventListeners();
    this.animateButtons();
    if (this.slides && this.slides.length > 1) {
      this.preload(this);
    }
    if (this.isProjetosPage()) {
      this.menuProjetos.openMenu();
    }
  }

  handleImagesReady() {
    console.log("All images have loaded.");
    this.precarregarImagens(this.swiper);
  }

  // handleSlideChangeStart() {
  //   let currentSlide = this.swiper.slides[this.swiper.activeIndex];
  //   this.clearSlideAnimations(currentSlide); // Limpeza opcional de animações anteriores
  //   this.animateSlideElements(currentSlide); // Inicia a animação dos elementos
  //   console.log("Evento de início de transição de slide disparado.");
  //   this.precarregarImagens(this.swiper); 
  // }

  // handleSlideChangeEnd() {
  //   let currentSlideIndex = this.swiper.realIndex;
  //   if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
  //     this.updateUIForLastSlide();
  //   }
  // }



//   handleSlideChangeStart() {
//     let currentSlide = this.swiper.slides[this.swiper.activeIndex];
//     this.clearSlideAnimations(currentSlide);
//     this.animateSlideElements(currentSlide);
//     console.log("Evento de início de transição de slide disparado.");
//     this.precarregarImagens(this.swiper);
//     this.checkAndUpdateUIForSlide();
//     this.updatePagination();  // Adiciona a chamada aqui
// }

// handleSlideChangeEnd() {
//   this.checkAndUpdateUIForSlide();
//   console.log("Slide Change End: ", currentSlideIndex);
//     this.updatePagination();  // Adiciona a chamada aqui
// }


// checkAndUpdateUIForSlide() {
//   let currentSlideIndex = this.swiper.realIndex;
//   if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
//       this.updateUIForLastSlide();
//   } else {
//       this.updateUIForNonLastSlides(currentSlideIndex);
//   }
// }

// updateUIForLastSlide() {
//   const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
//   const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');

//   menuElements.forEach(el => el.classList.remove('white-color'));
//   paginationBullets.forEach(bullet => bullet.classList.add('black'));
// }

// updateUIForLastSlide() {
//   const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
//   const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');

//   menuElements.forEach(el => el.classList.remove('white-color'));
//   paginationBullets.forEach(bullet => bullet.classList.add('black'));
// }

// updateUIForNonLastSlides(currentSlideIndex) {
//   const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
//   const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');

//   menuElements.forEach(el => el.classList.add('white-color'));
//   paginationBullets.forEach(bullet => bullet.classList.remove('black'));

//   // Lógica específica para páginas com "projetos" no URL
//   if (this.isProjetosPage()) {
//       // Remove 'white-color' class only on the second slide
//       menuElements.forEach(el => {
//           if (currentSlideIndex === 0) {
//               el.classList.add('white-color');
//           }
//           if (currentSlideIndex === 1) {
//               el.classList.remove('white-color');
//           }
//       });

//       paginationBullets.forEach(bullet => bullet.classList.remove('black'));

//       // Adiciona a classe 'black' apenas no slide 2 (índice 1)
//       if (currentSlideIndex === 1) { // Lembre-se que os índices começam em 0
//           paginationBullets.forEach(bullet => bullet.classList.add('black'));
//       }
//   }
// }


handleSlideChangeStart() {
  let currentSlide = this.swiper.slides[this.swiper.activeIndex];
  this.clearSlideAnimations(currentSlide);
  this.animateSlideElements(currentSlide);
  console.log("Início da transição de slide:", this.swiper.realIndex);
  this.precarregarImagens(this.swiper);
  this.updateUIForSlide(this.swiper.realIndex);
  this.updatePagination(); // Garante que a função esteja definida
}


handleSlideChangeEnd() {
  console.log("Fim da transição de slide:", this.swiper.realIndex);
  this.updateUIForSlide(this.swiper.realIndex);
  this.updatePagination(); // Garante que a função esteja definida
}


checkAndUpdateUIForSlideStart() {
  let currentSlideIndex = this.swiper.realIndex;
  console.log("Início da transição de slide: ", currentSlideIndex);
  if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
    this.updateUIForLastSlide();
  } else {
    this.updateUIForNonLastSlidesStart(currentSlideIndex);
  }
}

checkAndUpdateUIForSlideEnd() {
  let currentSlideIndex = this.swiper.realIndex;
  console.log("Fim da transição de slide: ", currentSlideIndex);
  if (!(currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica')) {
    this.updateUIForNonLastSlides(currentSlideIndex);
  }
}




updateUIForSlide(currentSlideIndex) {
  const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
  const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  console.log("Atualizando UI para o slide:", currentSlideIndex);

  // Remove todas as classes antes de adicionar as corretas
  menuElements.forEach(el => el.classList.remove('white-color'));
  paginationBullets.forEach(bullet => bullet.classList.remove('black'));

  // Lógica para o último slide
  if (currentSlideIndex === this.swiper.slides.length - 1 && window.location.hash === '#ficha-tecnica') {
    menuElements.forEach(el => el.classList.remove('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.add('black'));
  } 
  // Lógica específica para páginas com "projetos" no URL
  else if (this.isProjetosPage()) {
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


updateUIForNonLastSlidesStart(currentSlideIndex) {
  const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
  console.log("Atualizando UI para slides não finais no início da transição: ", currentSlideIndex);

  // Lógica específica para páginas com "projetos" no URL
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
  const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
  const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  console.log("Atualizando UI para slides não finais no final da transição: ", currentSlideIndex);

  // Lógica específica para páginas com "projetos" no URL
  if (this.isProjetosPage()) {
    // Remove 'white-color' class only on the second slide
    menuElements.forEach(el => {
      if (currentSlideIndex === 0) {
        el.classList.add('white-color');
      }
      if (currentSlideIndex === 1) {
        el.classList.remove('white-color');
      }
    });

    paginationBullets.forEach(bullet => bullet.classList.remove('black'));

    // Adiciona a classe 'black' apenas no slide 2 (índice 1)
    if (currentSlideIndex === 1) { // Lembre-se que os índices começam em 0
      paginationBullets.forEach(bullet => bullet.classList.add('black'));
    }
  } else {
    menuElements.forEach(el => el.classList.add('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.remove('black'));
  }
}


updatePagination() {
  const paginationBullets = document.querySelectorAll('.swiper-pagination .swiper-pagination-bullet');
  if (paginationBullets.length === 0) {
    console.warn("Nenhum bullet de paginação encontrado.");
    return;
  }

  paginationBullets.forEach(bullet => {
    bullet.classList.remove('swiper-pagination-bullet-active');
  });

  const activeBullet = paginationBullets[this.swiper.realIndex];
  if (activeBullet) {
    activeBullet.classList.add('swiper-pagination-bullet-active');
  } else {
    console.warn("Nenhum bullet ativo encontrado para o índice:", this.swiper.realIndex);
  }
}





  precarregarImagens(swiper) {
    const connectionType = navigator.connection && navigator.connection.effectiveType;
    if (['4g', 'wifi'].includes(connectionType)) {
      const slidesToPreload = 2; // Ajuste conforme necessário
      for (let i = 1; i <= slidesToPreload; i++) {
        let nextSlideIndex = swiper.realIndex + i;
        if (nextSlideIndex >= swiper.slides.length) {
          nextSlideIndex -= swiper.slides.length; // Considerar looping
        }
  
        let nextSlideElement = swiper.slides[nextSlideIndex];
        if (nextSlideElement) {
          const images = nextSlideElement.querySelectorAll('.slide-background-img');
          images.forEach(img => {
            if (img.loading === "lazy") {
              img.loading = "eager"; // Forçar o carregamento imediato
              console.log(`Alterando carregamento para eager: ${img.src}`);
            }
          });
        }
      }
    } else {
      console.log("Condições de rede não favorecem carregamento antecipado.");
    }
  }

// Função para selecionar os subtítulos
selectSubtitles() {
  // Selecionar elementos
  const subtitle1 = document.querySelector('.subtitle__part1');
  const subtitle2 = document.querySelector('.subtitle__part2');
  const subtitle3 = document.querySelector('.subtitle__part3');

  return [subtitle1, subtitle2, subtitle3].filter(sub => sub !== null);
}

// Função para animar os subtítulos na inicialização
animateSubtitles() {
  const subtitles = this.selectSubtitles();
  gsap.set(subtitles, {opacity: 0, y: 400});

  const tl = gsap.timeline({defaults: {ease: "power2.out"}});
  subtitles.forEach(subtitle => {
      tl.to(subtitle, {opacity: 1, y: "25vh", duration: 0.3}, "+=0.1");
  });
      tl.to(subtitles, {y: 0, duration: 0.3, stagger: 0.1});
}

// Função para iniciar a animação dos subtítulos apenas uma vez na inicialização
startInitialAnimation() {
  const firstSlide = document.querySelector('.swiper-slide'); // Ajuste o seletor conforme necessário
  if (firstSlide && !firstSlide.dataset.initialAnimated) {
      this.animateSubtitles();
      firstSlide.dataset.initialAnimated = true; // Marca o slide como tendo a animação inicial aplicada
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
    const menuItems = document.querySelectorAll('.menu__projetos li'); // Seleciona os itens do menu projetos

    // Define opacidade inicial para todos os botões e itens do menu
    gsap.set([...buttons, ...menuItems], { opacity: 0 });

    if (buttons.length === 0) {
        console.error('Required button elements not found');
        return; // Encerra a função se não houver elementos suficientes
    }

    const tl = gsap.timeline({defaults: {ease: "power2.out"}, delay: 2});

    // Anima os botões para aparecerem
    tl.to(buttons, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, "+=0.1");

    // Verifica se o menu está ativo ao iniciar a timeline e adiciona a animação dos itens de menu
    if (this.projetosList && this.projetosList.classList.contains(this.activeClass)) {
        tl.to(menuItems, {
            opacity: 1,
            duration: 0.3,
            stagger: {
                amount: 0.5,
                from: "end"
            }
        }, "-=0.1"); // Sincroniza com o final da animação dos botões
    }
  }

  // Função para animar os elementos do slide durante a troca de slides
  animateSlideElements(slide) {
  const subtitle1 = slide.querySelector('.subtitle__part2');
  const subtitle2 = slide.querySelector('.subtitle__part3');
  const titleLinkDiv = slide.querySelector('.slide__title__link');

  // Verificação se os elementos existem antes de prosseguir com a animação
  if (!subtitle1 || !subtitle2 || !titleLinkDiv) {
      console.log('Elementos faltando, animação interrompida.');
      return; // Interrompe a execução da função se algum elemento for null
  }

  // Adiciona logs para monitorar a execução
  console.log('Iniciando animação para:', slide);

  gsap.set([titleLinkDiv, subtitle1, subtitle2], {opacity: 0, y: 20});

  // Cria uma linha do tempo para a animação
  const tl = gsap.timeline({defaults: {duration: 0.4, ease: "power2.out"}});

  // Animação dos elementos com delays ajustados
  tl.to(subtitle1, {opacity: 1, y: 0}, "+=0.3")  // Inicia com delay inicial
    .to(subtitle2, {opacity: 1, y: 0}, "+=0.2")  // Inicia logo após subtitle1
    .to(titleLinkDiv, {opacity: 1, y: 0}, "+=0.2"); // Inicia logo após subtitle2

  // Log após animação
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

  updateUIForLastSlide() {
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  
    menuElements.forEach(el => el.classList.remove('white-color'));
    paginationBullets.forEach(bullet => bullet.classList.add('black'));
  }

  navegarParaProximoSlide() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
  
  setupEventListeners() {
    const botaoProximo = document.getElementById('botao-down');
    if (botaoProximo) {
      botaoProximo.addEventListener('click', () => this.navegarParaProximoSlide());
    }
  }
  
  initializeSwiper2() {
    // Lógica para inicializar swiper2 aqui
    this.swiper2 = new Swiper(".mySwiper2", {
      modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation],
      mousewheel: true,
      spaceBetween: 10,
      grabCursor: true,
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        800: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }

  initializeSwiper3() {
    // Lógica para inicializar swiper3 aqui
    this.swiper3 = new Swiper(".mySwiper3", {
      modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation],
      mousewheel: false,
      slidesPerView: 1,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination-2',
        bulletClass: 'custom-pagination-bullet-2',
        clickable: true,
      },
    });
  }

  isEstudioPage() {
    return window.location.pathname.includes('/estudio');
  }

  isProjetosPage() {
    return window.location.pathname.includes('/projeto.html');
  }
  
  isFichaTecnicaSlide() {
    return window.location.hash.includes('#ficha-tecnica');
  }

  isNotIndexPage() {
    const path = window.location.pathname;
    // Adicione aqui a lógica para verificar corretamente se está na página index
    return !(path === '/' || path.endsWith('index.html') || path === '/index/');
  }

  applyDisplayNoneToFirstBullet() {
    const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
    if (firstPaginationBullet) {
      firstPaginationBullet.style.display = 'none';
    }
  }

  initializePagination(pagination, hasMenuLateral) {
    if (hasMenuLateral) {
      // Logic for pages with menu lateral (like index.html)
      pagination.addEventListener('mouseenter', () => {
        this.hidePagination();
        this.showProjectMenu();
      });
      pagination.addEventListener('mouseleave', () => {
        this.hideProjectMenu();
        this.showPagination();
      });
    } else {
      this.showPagination();
    }
  }

  initializeMenuLateral(menuLateral) {
    // Setup for menu lateral
    menuLateral.addEventListener('mouseenter', () => {
      this.hidePagination();
      this.showProjectMenu();
    });

    menuLateral.addEventListener('mouseleave', () => {
      this.hideProjectMenu();
      this.showPagination();
    });
  }

  hasMenuLateral() {
    return !!document.querySelector('.menu-lateral');
  }

  update() {
    if (this.swiper) {
        this.swiper.update();
    }
  }
 
  updatePaginationAndMenuVisibility(currentSlideIndex) {
    const pagination = document.querySelector('.swiper-pagination');
    const menuLateral = document.querySelector('.menu-lateral');
  
    if (!pagination || !menuLateral) return;
  
    const deveExibir = currentSlideIndex > 0 || this.filtroAtivo;
    pagination.style.display = menuLateral.style.display = deveExibir ? 'flex' : 'none';
    pagination.style.opacity = deveExibir ? '1' : '0';
    if (this.filtroAtivo) {
      const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"],[data-menu="button"], #hamburguer');
      menuElements.forEach(el => el.classList.add('white-color'));
    }
  }

  setFiltroAtivo(ativo) {
    this.filtroAtivo = ativo;
    this.updatePaginationAndMenuVisibility(this.swiper ? this.swiper.realIndex : 0);
    this.slideChange(); // Chame slideChange ou uma função dedicada para atualizar a visibilidade da seta aqui
    let indiceSlideAtivo = ativo ? 0 : this.swiper.realIndex;

    // Atualiza o menu de projetos para refletir o slide ativo.
    this.updateProjectMenu(indiceSlideAtivo);
  }

  applyFilterFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterCategory = urlParams.get('filter');
    if (filterCategory) {
        this.filterSlides(filterCategory);
        this.navigateToFirstSlideOfCategory(filterCategory);
        this.setFiltroAtivo(true);
        this.markActiveLink(filterCategory); 
        this.menuProjetos.openMenu();  
    }
  }

  setupFilterLinks() {
    const filterLinks = document.querySelectorAll(('.nav__menu__projetos-mobile a[data-filter], .nav__menu__projetos-desktop a[data-filter]'));
    filterLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir a ação padrão

        // Pega a categoria do atributo data-filter do link clicado
        const category = link.getAttribute('data-filter');
        this.applyFilter(category); // Isso deveria chamar o console.log
        this.navigateToFirstSlideOfCategory(category); // Navega para o primeiro slide da categoria
        this.markActiveLink(category); // Marca o link como ativo ao clicar

        if (this.isNotIndexPage()) {
          // Se não estiver na página index, redireciona para a index com o parâmetro de filtragem
          window.location.href = `/index.html?filter=${category}`;
        } else {
          // Está na página index, aplica a filtragem como antes
          this.filterSlides(category);
        }
      });
    });
  }


  filterSlides(category) {
    let filteredSlides;

    // Filtra os slides baseado na categoria, excluindo o slide de apresentação (#slide1)
    if (category === 'all') {
        // Se a categoria for 'all', adiciona todos os slides exceto o slide de apresentação
        filteredSlides = this.allSlides.filter(slide => slide.getAttribute('data-hash') !== 'slide1');
    } else {
        // Filtra slides que correspondem à categoria, excluindo o slide de apresentação
        filteredSlides = this.allSlides.filter(slide => 
            slide.getAttribute('data-filter') === category && slide.getAttribute('data-hash') !== 'slide1'
        );
    }

    this.swiper.removeAllSlides();
    this.swiper.appendSlide(filteredSlides);
    this.swiper.update();
    this.updateProjectMenu(0);

    // Navega automaticamente para o primeiro slide do filtro, que agora é o primeiro slide nos slides filtrados
    if (filteredSlides.length > 0) {
        this.swiper.slideTo(0, 0); // Navega sem delay
    }
  } 

  handleHashChange() {
    const hash = window.location.hash;
    const category = this.mapHashToCategory(hash);

    if (category) {
        this.filterSlides(category);
    }
}

mapHashToCategory(hash) {
    switch (hash) {
      case '#viw':
            return 'all';
        case '#quadritone':
            return 'residencias';
        case '#viw':
            return 'edificios';
        case '#teatrosescatalaia':
            return 'institucionais';
        default:
            return null;
    }
}

  applyFilter(filterCategory) {
    console.log(`Aplicando filtro: ${filterCategory}`);

    // Verifica se está na página index e a instância de CarregaProjetos está disponível
    if (document.body.id === "index-page" && this.carregaProjetosInstance && typeof this.carregaProjetosInstance.filtrarEExibirProjetos === 'function') {
      // Aplica o filtro
      this.carregaProjetosInstance.filtrarEExibirProjetos(filterCategory);
      this.setFiltroAtivo(true);

      // Atualiza a URL sem recarregar a página
      const novaUrl = `${window.location.pathname}?filter=${filterCategory}`;
      window.history.pushState({ path: novaUrl }, '', novaUrl);
    } else if (this.isNotIndexPage()) {
      // Se não estiver na página index, redireciona para a index com o parâmetro de filtragem
      window.location.href = `/index.html?filter=${filterCategory}`;
      
    } else {
      console.log('A instância de CarregaProjetos ou o método filtrarEExibirProjetos não está disponível.');
    }
  }

  markActiveLink(filterCategory) {
    const links = document.querySelectorAll('.nav__menu__projetos-mobile a[data-filter], .nav__menu__projetos-desktop a[data-filter]');
    links.forEach(link => link.classList.remove('active-link'));
  
    const activeLink = Array.from(links).find(link => link.getAttribute('data-filter') === filterCategory);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }
  }
  
  navigateToFirstSlideOfCategory(category) {
    if (category === 'all') {
        // Se 'all', navega para o segundo slide, assumindo que o primeiro é sempre o slide1
        this.swiper.slideTo(1);
        return;
    }
    // Encontra o índice do primeiro slide que corresponde à categoria após o slide1.
    const startIndex = 1; // Ignora o slide1 presumindo que ele sempre é o primeiro slide.
    for (let i = startIndex; i < this.swiper.slides.length; i++) {
        const slide = this.swiper.slides[i];
        if (slide.getAttribute('data-filter') === category) {
            this.swiper.slideTo(i); // Move para o primeiro slide da categoria.
            break; // Interrompe o loop após encontrar o primeiro slide correspondente.
        }
    }
  }


  navigateToSlide(hash) {
    const targetSlideIndex = this.swiper.slides.findIndex(slide =>
        slide.getAttribute('data-hash') === hash
    );

    // Se um slide válido for encontrado, navega para esse slide
    if (targetSlideIndex !== -1) {
        this.swiper.slideTo(targetSlideIndex, 1000); // 1000 é o tempo da animação em milissegundos
    }
  }

  
   // Método para definir a instância de CarregaProjetos
  setCarregaProjetosInstance(carregaProjetosInstance) {
    this.carregaProjetosInstance = carregaProjetosInstance;
    // Agora você pode usar this.carregaProjetosInstance dentro de MySwiper
  }

  setupResizeListener() {
    // Associa o listener de resize ao método da classe, garantindo o contexto correto com bind
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
      // Método chamado em cada evento de redimensionamento da janela
      // Atualizar a visibilidade do texto conforme necessário
      const bioProject = document.querySelector('.bio__project');
      if (bioProject) {
          this.adjustTextVisibility(bioProject);
      }
  }

  adjustTextVisibility(bioProject) {
    const descricao = bioProject.querySelector('p');
    const expandBtn = bioProject.querySelector('.expand-btn');
    const collapseBtn = bioProject.querySelector('.collapse-btn');
    const ul = bioProject.querySelector('ul');

    // Adiciona verificações para garantir que os elementos existem
    if (!descricao || !expandBtn || !collapseBtn || !ul) {
        console.error('Um ou mais elementos necessários não foram encontrados!');
        return; // Encerra a função se algum elemento não for encontrado
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

  slideChange() {
    // this.carregarImagensDosProximosSlides(this.swiper, 3);

    // First, check if swiper is defined and initialized
    if (!this.swiper || !this.swiper.slides) return;
  
    // Get the current and previous slide indexes
    let currentSlideIndex = this.swiper.realIndex;
    let previousSlideIndex = this.swiper.previousIndex;

    const navButtonArrow = document.getElementById('botao-down');
    if (navButtonArrow) {
      if (currentSlideIndex === 0 && !this.filtroAtivo) {
        // Mostra a seta apenas no primeiro slide e se o filtro não estiver aplicado
        navButtonArrow.style.display = '';
      } else {
        // Esconde a seta nos outros slides ou quando o filtro está aplicado
        navButtonArrow.style.display = 'none';
      }
    }
    
    // Update UI elements based on the current slide index
    this.updatePaginationAndMenu(currentSlideIndex);
    // this.updateSlideTitlesAndSubtitles(currentSlideIndex, previousSlideIndex);
    this.updateProjectMenu(currentSlideIndex);
    this.updatePaginationAndMenuVisibility(this.swiper.realIndex);
  }

  /**
  * Updates pagination and menu based on the current slide index.
  * @param {number} currentSlideIndex - The index of the current slide.
  */
  updatePaginationAndMenu(currentSlideIndex) {
    const pagination = document.querySelector('.swiper-pagination');
    const menuLateral = document.querySelector('.menu-lateral');
    const menuElements = document.querySelectorAll('.nav__button, .nav__menu__projetos-desktop a, .nav__menu__projetos-mobile a, .nav__button__projetos p, [data-menu-projetos="button"], [data-menu="button"], #hamburguer, #botao-voltar');
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet');
  
    if (pagination) {
      if (this.isEstudioPage() || this.isProjetosPage()) {
        pagination.style.opacity = '1';
        pagination.style.display = 'flex';
      } else {
        pagination.style.opacity = currentSlideIndex >= 1 ? '1' : '0';
        const displayStyle = currentSlideIndex >= 1 ? 'flex' : 'none';
        pagination.style.display = displayStyle;
      }
    }
  
    if (menuLateral) {
      const displayStyle = currentSlideIndex >= 1 ? 'flex' : 'none';
      menuLateral.style.display = displayStyle;
    }
 
    if (pagination && menuLateral) {
      const deveExibir = currentSlideIndex > 0 || this.filtroAtivo;
      pagination.style.display = deveExibir ? 'flex' : 'none';
      menuLateral.style.display = deveExibir ? 'flex' : 'none';
      // Ajusta a opacidade da paginação para 1 quando deve ser exibida, e para 0 quando não
      pagination.style.opacity = deveExibir ? '1' : '0';
      if (this.filtroAtivo) {
        menuElements.forEach(el => el.classList.add('white-color'));
    } else {
        menuElements.forEach(el => el.classList.remove('white-color'));
    }
  }

  // Supondo que menuElements já esteja definido e acessível aqui
  if (this.isEstudioPage()) {
    menuElements.forEach(el => {
      const classNameAction = 'remove';
      el.classList[classNameAction]('white-color');
    });
  } else {
    menuElements.forEach(el => {
      const classNameAction = currentSlideIndex >= 1 ? 'add' : 'remove';
      el.classList[classNameAction]('white-color');
    });
  }


    // Specific logic for pages with "projetos" in the URL
  // if (this.isProjetosPage()) {
  //   // Remove 'white-color' class only on the second slide
  //   menuElements.forEach(el => {
  //     if (currentSlideIndex === 0) {
  //       el.classList.add('white-color');
  //     }
  //     if (currentSlideIndex === 1) {
  //       el.classList.remove('white-color');
  //     }
  //   });

  //   paginationBullets.forEach(bullet => bullet.classList.remove('black'));

  //   // Adiciona a classe 'black' apenas no slide 2 (índice 1)
  //   if (currentSlideIndex === 1) { // Lembre-se que os índices começam em 0
  //     paginationBullets.forEach(bullet => bullet.classList.add('black'));
  //   }  
  // }


    // Update pagination opacity if pagination exists
    if (pagination && this.swiper.pagination.el) {

      if (this.isEstudioPage() || this.isProjetosPage()) {
        this.swiper.pagination.el.style.opacity = '1';

      } else {
        this.swiper.pagination.el.style.opacity = currentSlideIndex >= 1 ? '1' : '0';
      }
    }
  }

  /**
  * Updates the project menu based on the current slide index.
  * @param {number} currentSlideIndex - The index of the current slide.
  */
  updateProjectMenu(currentSlideIndex) {
    // Update project menu items
    document.querySelectorAll('.project-menu-item').forEach(el => el.classList.remove('active'));

    let currentSlide = this.swiper.slides[currentSlideIndex];
    if (currentSlide) {
        let currentSlideHash = currentSlide.getAttribute('data-hash');
        let correspondingMenuItem = document.querySelector(`.project-menu-item[href="#${currentSlideHash}"]`);
        if (correspondingMenuItem) correspondingMenuItem.classList.add('active');
    }
  }

  /**
  * Updates titles and subtitles for the current and previous slides.
  * @param {number} currentSlideIndex - The index of the current slide.
  * @param {number} previousSlideIndex - The index of the previous slide.
  */
  // updateSlideTitlesAndSubtitles(currentSlideIndex, previousSlideIndex) {
  //   // Handling titles and subtitles animation
  //   const allTitlesAndSubtitles = document.querySelectorAll('.page__title, .page__subtitle');
  //   this.clearAnimationClasses(allTitlesAndSubtitles);

  //   // If there are no slides, return early
  //   const activeSlide = this.swiper.slides[currentSlideIndex];
  //   const previousSlide = this.swiper.slides[previousSlideIndex];
  //   if (!activeSlide || !previousSlide) return;

  //   // Adding animation classes to active slide's titles and subtitles
  //   this.addAnimationClassesToSlide(activeSlide, currentSlideIndex > previousSlideIndex);
  //   this.clearAnimationClasses(previousSlide.querySelectorAll('.slide__title, .subtitle__part1, .subtitle__part2, .subtitle__part3'));
  // }

  /**
  * Clears animation classes from the given elements.
  * @param {NodeListOf<Element>} elements - The elements to clear classes from.
  */
  // clearAnimationClasses(elements) {
  //   elements.forEach(el => {
  //       el.classList.remove('anime-up-text-active', 'anime-up-text-down', 'anime-up-active-title', 'anime-down-active-title', 'anime-up-active-sub', 'anime-down-active-sub');
  //   });
  // }

  /**
  * Adds animation classes to titles and subtitles in a slide.
  * @param {Element} slide - The slide to add animation classes to.
  * @param {boolean} isScrollingDown - Indicates if the slide is scrolling down.
  */
  // addAnimationClassesToSlide(slide, isScrollingDown) {
  //   const animationClass = isScrollingDown ? 'anime-up-active' : 'anime-down-active';
  //   slide.querySelectorAll('.slide__title, .subtitle__part1, .subtitle__part2, .subtitle__part3').forEach(el => {
  //       el.classList.add(`${animationClass}-${el.classList.contains('slide__title') ? 'title' : 'sub'}`);
  //   });
  // }
  
  // animateSubtitleParts() {
  //   var subtitleParts = document.querySelectorAll('.subtitle__part1, .subtitle__part2, .subtitle__part3');

  //   anime ({
  //     targets: subtitleParts,
  //     translateY: [100, 0], // Slide in from the bottom
  //     opacity: [0, 1], // Fade-in effect
  //     duration: 1000, // Animation duration in milliseconds
  //     easing: 'easeInOutQuad', // Easing function
  //     delay: anime.stagger(200), // Delay between animations for each element
  //   });
  // }

  hideProjectMenu() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const projectMenu = document.querySelector('.project-menu-hover');
      const pagination = document.querySelector('.pagination');
  
      if (projectMenu) {
        projectMenu.classList.remove('show-element');
        pagination.style.display = 'flex';
      }
    }
  }
  
  showProjectMenu() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const projectMenu = document.querySelector('.project-menu-hover');
      const pagination = document.querySelector('.pagination');
  
      if (projectMenu) {
        projectMenu.classList.add('show-element');
        pagination.style.display = 'none';
      }
    }
  }
  
  hidePagination() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.classList.remove('show-element');
      }
    }
  }
  
  showPagination() {
    // Verifica se a largura da tela é maior que 800px
    if (window.innerWidth > 800) {
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.classList.add('show-element');
      }
    }
  }
  
  slideChangeTransitionStart() {   
  }

  getSwiperInstance() {
    console.log(this.swiper);
    return this.swiper;
  }
}
 


 
















 


 
















