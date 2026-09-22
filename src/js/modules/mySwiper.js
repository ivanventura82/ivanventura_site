import Swiper from 'swiper';
import transitionCategory from './categoryTransition.js';
import { Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation, Keyboard, A11y } from 'swiper/modules';
import HomeMotion from './homeMotion.js';
import EditorialMotion from './editorialMotion.js';
import ProjectMotion from './projectMotion.js';
import SlideUIManager from './slideUIManager.js';
import SlideManager from './slideManager.js';
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
    this.isHome = document.body.id === 'index-page';
    this.homeMotion = this.isHome ? new HomeMotion() : null;
    this.projectMotion = document.body.id === 'pagina-projeto' ? new ProjectMotion() : null;
    this.editorialMotion = /\/(estudio|contato)(\.html)?\/?$/.test(location.pathname) ? new EditorialMotion() : null;
    if (this.editorialMotion) document.body.classList.add('editorial-motion');
    this.motion = this.homeMotion || this.projectMotion || this.editorialMotion;
    this.slideUIManager = null;  // Adiciona a instância de SlideUIManager aqui
    this.slideManager = new SlideManager();  // Instancia SlideAnimationManager
    this.allSlides = [];
    this.allMenuItems = [];
    this.filtroAtivo = false;
    this.setupResizeListener();
    this.initialHash = window.location.hash.slice(1);
}

  initialize() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeSwiper(); // Certifique-se de que está sendo chamado corretamente
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
      menuLateral.style.display = this.isEstudioPage() ? 'flex' : 'none';
    }

    // Collect slides and menu items
    this.allSlides = Array.from(document.querySelectorAll('.swiper-slide'));
    this.allMenuItems = Array.from(document.querySelectorAll('.project-menu-item'));

    // Setup filter links
    this.setupFilterLinks();
    if (this.editorialMotion) {
      document.querySelectorAll('.premios, .editorial-motion .slide-content').forEach(panel => {
        panel.addEventListener('wheel', event => {
          const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
          if ((event.deltaY > 0 && remaining > 1) || (event.deltaY < 0 && panel.scrollTop > 1)) event.stopPropagation();
        }, {passive:true});
        panel.addEventListener('touchstart', () => panel.classList.toggle('swiper-no-swiping', panel.scrollHeight > panel.clientHeight + 1), {passive:true});
      });
    }
    if (!this.isHome) this.applyFilterFromURL();
     // Inicializa o SlideUIManager com a instância do Swiper após a inicialização do Swiper
     this.slideUIManager = new SlideUIManager(this.swiper);
  }

  initializeSwiperInstance() {
      console.log("Inicializando Swiper...");

      this.swiper = new Swiper(".mySwiper", {
        modules: [Navigation, Pagination, Scrollbar, Mousewheel, HashNavigation, Manipulation, Keyboard, A11y],
        init: false,
        direction: "vertical",
        speed: this.motion?.media.matches ? 0 : (this.motion ? this.motion.duration : 1000),
        preventInteractionOnTransition: !!this.motion,
        keyboard: { enabled: !!this.motion, onlyInViewport: true },
        a11y: { enabled: true, paginationBulletMessage: 'Ir para o projeto {{index}}' },
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        threshold: 10,
        allowTouchMove: true,
        followFinger: !this.motion,
        virtualTranslate: !!this.motion,
        mousewheel: this.motion ? { forceToAxis: true, thresholdDelta: 18, thresholdTime: this.projectMotion ? 100 : this.motion.duration } : true,
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

      this.slideUIManager = new SlideUIManager(this.swiper);
      this.swiper.init();
      this.installResponsiveWheel();
      if (this.motion) {
        this.motion.media.addEventListener('change', () => {
          this.swiper.params.speed = this.motion.media.matches ? 0 : this.motion.duration;
          this.motion.enter(this.swiper.slides[this.swiper.activeIndex], true);
        });
      }
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
    if (this.motion) this.motion.enter(this.swiper.slides[this.swiper.activeIndex], true);
    else this.slideManager.startInitialAnimation();
    this.setupEventListeners();
    this.slideManager.animateButtons();
    if (this.slides && this.slides.length > 1) {
      this.preload(this);
    }

  }

  handleSlideChangeStart() {
    if (this.categoryBusy) return;
    let currentSlide = this.swiper.slides[this.swiper.activeIndex];
    if (this.motion) {
      const direction = this.swiper.activeIndex >= this.swiper.previousIndex ? 1 : -1;
      this.motion.enter(currentSlide, false, direction, () => {
        if (this.swiper.animating) this.swiper.transitionEnd();
        const pendingHash = this.pendingProjectHash;
        this.pendingProjectHash = null;
        if (pendingHash) { this.pendingWheelDirection = 0; this.navigateToSlide(pendingHash); }
        else this.flushWheelNavigation();
      });
    } else if (currentSlide) {
      this.slideManager.clearSlideAnimations(currentSlide);
      this.slideManager.animateSlideElements(currentSlide);
    }
    console.log("Início da transição de slide:", this.swiper.realIndex);
    this.precarregarImagens(this.swiper);
    this.slideUIManager.updateUIForSlide(this.swiper.realIndex);
    this.updatePagination(); // Garante que a função esteja definida
  }


  handleSlideChangeEnd() {
    console.log("Fim da transição de slide:", this.swiper.realIndex);
    this.slideUIManager.updateUIForSlide(this.swiper.realIndex);
    this.updatePagination(); // Garante que a função esteja definida
  }

    handleImagesReady() {
      console.log("All images have loaded.");
      this.precarregarImagens(this.swiper);
    }

    navegarParaProximoSlide() {
      if (this.swiper) {
        this.swiper.slideNext();
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
    if (!navigator.connection?.saveData && !['slow-2g', '2g'].includes(connectionType)) {
      const slidesToPreload = ['4g', 'wifi'].includes(connectionType) ? 2 : 1; // Ajuste conforme necessário
      for (let i = 1; i <= slidesToPreload; i++) {
        let nextSlideIndex = swiper.realIndex + i;
        if (nextSlideIndex >= swiper.slides.length) {
          nextSlideIndex -= swiper.slides.length; // Considerar looping
        }

        let nextSlideElement = swiper.slides[nextSlideIndex];
        if (nextSlideElement) {
          const images = nextSlideElement.querySelectorAll('.slide-background-img, .project-photo-window img');
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

  setupEventListeners() {
    if ((this.isHome || this.isEstudioPage()) && !this.lateralClicksBound) {
      this.lateralClicksBound = true;
      document.addEventListener('click', event => {
        const link = event.target.closest?.('.project-menu-item');
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        this.navigateToSlide(link.getAttribute('href').slice(1));
      });
    }
    const botaoProximo = document.getElementById('botao-down');
    if (botaoProximo) {
      botaoProximo.addEventListener('click', (event) => {
        event.preventDefault();
        this.navegarParaProximoSlide();
      });
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
    const container = document.querySelector('.mySwiper3');
    if (!container) return;
    const gallery = new HomeMotion({restingScale:1.02,transitionScale:1.10,photoTravel:0});
    container.classList.add('editorial-gallery');
    container.querySelectorAll('.estudio').forEach(slide => {
      const background = slide.style.backgroundImage;
      const match = background.match(/url\(["']?(.*?)["']?\)/);
      if (match) {
        const image = new Image(); image.src = match[1]; image.alt = 'Escritório Ivan Ventura';
        image.className = 'slide-background-img'; slide.appendChild(image);
      }
    });
    this.swiper3 = new Swiper(container, {
      modules:[Pagination,A11y], init:false, nested:true,
      speed:gallery.media.matches?0:gallery.duration, virtualTranslate:true, followFinger:false,
      preventInteractionOnTransition:true, slidesPerView:1,
      pagination:{el:container.querySelector('.swiper-pagination-2'),bulletClass:'custom-pagination-bullet-2',clickable:true},
      on:{
        init:swiper=>gallery.enter(swiper.slides[swiper.activeIndex],true),
        slideChangeTransitionStart:swiper=>gallery.enter(swiper.slides[swiper.activeIndex],false,
          swiper.activeIndex>=swiper.previousIndex?1:-1,()=>{if(swiper.animating)swiper.transitionEnd();})
      }
    });
    this.swiper3.init();
    gallery.media.addEventListener('change',()=>{
      this.swiper3.params.speed=gallery.media.matches?0:gallery.duration;
      gallery.enter(this.swiper3.slides[this.swiper3.activeIndex],true);
    });
  }

  isEstudioPage() {
    return window.location.pathname.includes('/estudio');
  }

  isProjetosPage() {
    return window.location.pathname.includes('/projeto');
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

  refreshHomeSlides(filtered) {
    if (!this.swiper) return;
    this.filtroAtivo = filtered;
    this.swiper.update();
    this.allSlides = [...this.swiper.slides];
    const hashIndex = this.swiper.slides.findIndex(slide => slide.dataset.hash === this.initialHash);
    this.initialHash = '';
    // Category transitions temporarily disable user input; this reset is internal.
    this.swiper.slideTo(hashIndex >= 0 ? hashIndex : 0, 0, true, true);
    this.homeMotion.enter(this.swiper.slides[this.swiper.activeIndex], true);
    this.slideChange();
    this.precarregarImagens(this.swiper);
    document.dispatchEvent(new CustomEvent('HomeMotionReady'));
    if (!filtered) this.applyDisplayNoneToFirstBullet();
    else {
      const category = new URLSearchParams(window.location.search).get('filter');
      if (category) this.markActiveLink(category);
    }
  }

  refreshProjectSlides() {
    if (!this.swiper || !this.projectMotion) return;
    this.projectMotion.reset();
    this.swiper.update();
    this.swiper.slides.forEach(slide => this.projectMotion.prepare(slide));
    const index = this.swiper.slides.findIndex(slide => slide.dataset.hash === this.initialHash);
    this.initialHash = '';
    this.swiper.slideTo(index >= 0 ? index : 0, 0);
    this.projectMotion.enter(this.swiper.slides[this.swiper.activeIndex], true);
    this.precarregarImagens(this.swiper);
    this.slideUIManager.updateUIForSlide(this.swiper.activeIndex);
    document.dispatchEvent(new CustomEvent('ProjectMotionReady'));
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

    const deveExibir = this.isEstudioPage() || currentSlideIndex > 0 || this.filtroAtivo;
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
    if (this.filtersBound) return;
    this.filtersBound = true;
    const filterLinks = document.querySelectorAll(('.nav__menu__projetos-mobile a[data-filter], .nav__menu__projetos-desktop a[data-filter]'));
    filterLinks.forEach(link => {
      link.href = '/index.html?filter=' + encodeURIComponent(link.dataset.filter);
      link.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const category = link.getAttribute('data-filter');
        if (this.isHome || this.projectMotion || this.editorialMotion) {
          transitionCategory(this, category);
        } else {
          window.location.href = `/index.html?filter=${encodeURIComponent(category)}`;
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

  installResponsiveWheel() {
    if (this.responsiveWheelBound || !(this.isHome || this.projectMotion || this.isEstudioPage())) return;
    this.responsiveWheelBound = true;
    let accumulated = 0, lastEvent = 0, lastAccepted = -Infinity;
    this.swiper.el.addEventListener('wheel', event => {
      if (this.awardsGallery?.wheel(event)) return;
      // Preserve independently scrollable nested studio carousels.
      const nestedSwiper = event.target.closest?.('.swiper')?.swiper;
      if (nestedSwiper && nestedSwiper !== this.swiper && nestedSwiper.mousewheel?.enabled) return;
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      const direction = Math.sign(event.deltaY);
      // Let overflowing descriptions and menus scroll normally.
      for (let node = event.target; node && node !== this.swiper.el; node = node.parentElement) {
        if (node.nodeType !== 1) continue;
        const overflow = getComputedStyle(node).overflowY;
        if (/auto|scroll/.test(overflow) && node.scrollHeight > node.clientHeight + 1 &&
          (direction > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 1 : node.scrollTop > 1)) {
          event.stopImmediatePropagation();
          return;
        }
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!this.swiper.enabled || this.categoryBusy || this.categoryRequestRunning) {
        this.pendingWheelDirection = 0; accumulated = 0; return;
      }
      const now = performance.now();
      if (now - lastEvent > 180 || Math.sign(accumulated) !== direction) accumulated = 0;
      lastEvent = now;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(accumulated) < 18) return;
      // Coalesce high-frequency trackpad events without imposing the animation duration.
      if (now - lastAccepted < 100) { accumulated = 0; return; }
      accumulated = 0;
      this.wheelBurst = now - lastAccepted < 260;
      lastAccepted = now;
      this.pendingProjectHash = null;
      this.pendingWheelDirection = direction;
      const timeline = this.motion?.timeline;
      if (this.swiper.animating && timeline) {
        // Increase gently per tick, preserving the wipe instead of rushing its remainder.
        timeline.timeScale(Math.min(1.6, Math.max(1, timeline.timeScale()) + 0.12));
      } else this.flushWheelNavigation();
    }, {capture:true, passive:false});
  }

  flushWheelNavigation() {
    const direction = this.pendingWheelDirection;
    this.pendingWheelDirection = 0;
    if (!direction || !this.swiper?.enabled || this.categoryBusy || this.categoryRequestRunning) return;
    const target = Math.max(0, Math.min(this.swiper.slides.length - 1, this.swiper.activeIndex + direction));
    if (target === this.swiper.activeIndex) return;
    this.swiper.slideTo(target, this.swiper.params.speed);
    const timeline = this.motion?.timeline;
    if (this.wheelBurst && timeline) timeline.timeScale(1.35);
  }

  navigateToSlide(hash) {
    this.pendingWheelDirection = 0;
    if (!this.swiper || !this.swiper.enabled || this.categoryBusy) return;
    const targetSlideIndex = this.swiper.slides.findIndex(slide =>
      slide.getAttribute('data-hash') === hash
    );
    if (targetSlideIndex === -1) return;
    this.pendingProjectHash = null;
    if (targetSlideIndex === this.swiper.activeIndex) return;
    const timeline = (this.homeMotion || this.editorialMotion)?.timeline;
    if (this.swiper.animating && timeline) {
      // Latest choice wins; complete the current handoff within 120ms.
      this.pendingProjectHash = hash;
      const remaining = Math.max(0, timeline.duration() - timeline.time());
      timeline.timeScale(Math.max(timeline.timeScale(), remaining / 0.12, 1));
      return;
    }
    this.swiper.slideTo(targetSlideIndex, this.swiper.params.speed);
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
      this.slideManager.adjustTextVisibility(bioProject);  // Use SlideManager
    }
  }


  slideChange() {

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
      const displayStyle = this.isEstudioPage() || currentSlideIndex >= 1 ? 'flex' : 'none';
      menuLateral.style.display = displayStyle;
    }

    if (pagination && menuLateral) {
      const deveExibir = this.isEstudioPage() || currentSlideIndex > 0 || this.filtroAtivo;
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

  getSwiperInstance() {
    console.log(this.swiper);
    return this.swiper;
  }
}




