import gsap from 'gsap';
import HomeMotion from './homeMotion.js';
import CarregaProjetos from './carregaProjetos.js';
import installProjectEntrance from './projectEntrance.js';

// Category navigation keeps the current document and its persistent navigation.
function shortenHandoff(timeline) {
  if (!timeline) return;
  const remaining = Math.max(0, timeline.duration() - timeline.time());
  timeline.timeScale(Math.max(timeline.timeScale(), remaining / 0.12, 1));
}

export default async function transitionCategory(owner, category) {
  owner.pendingCategory = category;
  owner.pendingProjectHash = null;
  if (owner.categoryRequestRunning) {
    shortenHandoff(owner.categoryTimeline);
    return;
  }
  owner.categoryRequestRunning = true;
  try {
    const swiper = owner.swiper;
    if (!swiper || swiper.destroyed) return;
    if (swiper.animating) {
      await new Promise(resolve => {
        swiper.once('transitionEnd', resolve);
        shortenHandoff(owner.motion?.timeline);
      });
    }
    while (owner.pendingCategory !== null && owner.pendingCategory !== undefined) {
      const next = owner.pendingCategory;
      owner.pendingCategory = null;
      await performCategoryTransition(owner, next);
    }
  } finally {
    owner.categoryRequestRunning = false;
    owner.pendingCategory = null;
  }
}

async function performCategoryTransition(owner, category) {
  if (owner.categoryBusy) return;
  const swiper = owner.swiper;
  if (!swiper || swiper.animating) return;
  owner.categoryBusy = true;
  const wasEnabled = swiper.enabled;
  swiper.disable();
  const oldCategory = new URLSearchParams(location.search).get('filter') || document.body.dataset.categoria;
  const links = [...document.querySelectorAll('a[data-filter]')];
  const categories = [...new Set(links.map(a => a.dataset.filter))];
  const direction = categories.indexOf(category) >= categories.indexOf(oldCategory) ? 1 : -1;
  owner.markActiveLink(category);
  let overlay, timeline, changed = false;
  try {
    const loader = owner.carregaProjetosInstance || new CarregaProjetos('./projetos.json', owner);
    if (!loader.todosProjetos.length) {
      const response = await fetch(loader.jsonURL, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('Project list unavailable');
      loader.todosProjetos = await response.json();
    }
    const first = loader.todosProjetos.find(p => category === 'all' || p.categoria === category);
    if (!first) throw new Error('Empty category');
    const cover = new Image();
    cover.sizes = '100vw';
    cover.srcset = [720,1024,1920].map(w => `/img/${first.datahash}/${first.imagemhome}-${w}w.webp ${w}w`).join(',');
    cover.src = `/img/${first.datahash}/${first.imagemhome}.webp`;
    await waitForImage(cover);
    // Superseded loading requests never replace the visible category.
    if (owner.pendingCategory && owner.pendingCategory !== category) return;
    owner.pendingCategory = null;

    owner.markActiveLink(category);
    if (owner.menuProjetos.isOpen) owner.menuProjetos.closeAfterSelection();
    const previous = swiper.slides[swiper.activeIndex];
    overlay = previous.cloneNode(true);
    overlay.removeAttribute('id');
    overlay.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    overlay.className = 'category-transition-cover';
    // Preserve the photo shade without registering this temporary layer as a Swiper slide.
    overlay.classList.toggle('com-imagem-de-fundo', previous.classList.contains('com-imagem-de-fundo'));
    overlay.setAttribute('aria-hidden', 'true'); overlay.inert = true;
    overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:20;overflow:hidden;pointer-events:none;display:flex;align-items:center;justify-content:center;background:' + getComputedStyle(previous).backgroundColor;
    swiper.el.appendChild(overlay);
    document.body.classList.add('category-navigation');
    const fromOtherPage = !owner.isHome;
    owner.motion?.reset();
    if (fromOtherPage) {
      document.body.id = 'index-page';
      delete document.body.dataset.categoria;
      owner.isHome = true;
      owner.projectMotion = null;
      owner.editorialMotion = null;
      document.body.classList.remove('editorial-motion');
      owner.swiper2?.destroy(true, true);
      owner.swiper3?.destroy(true, true);
      document.querySelector('.swiper-pagination')?.classList.remove('pagination-estudio');
      owner.homeMotion = new HomeMotion();
      owner.motion = owner.homeMotion;
      document.getElementById('botao-voltar')?.remove();
      if (!document.querySelector('.menu-lateral')) {
        const nav = document.createElement('nav'); nav.className = 'menu-lateral';
        const list = document.createElement('ul'); list.className = 'project-menu-hover transition-element';
        nav.appendChild(list); swiper.el.appendChild(nav);
        owner.initializeMenuLateral(nav);
      }
      swiper.params.speed = owner.motion.media.matches ? 0 : owner.motion.duration;
      swiper.params.mousewheel.thresholdTime = owner.motion.duration;
      owner.setupEventListeners();
      owner.installResponsiveWheel();
      installProjectEntrance(owner);
    }
    owner.setCarregaProjetosInstance(loader);
    owner.initialHash = '';
    const url = '/index.html?filter=' + encodeURIComponent(category);
    history.pushState({categoryTransition:true}, '', url);
    changed = true;
    owner.currentCategory = category;
    loader.filtrarEExibirProjetos(category);
    owner.setFiltroAtivo(true);
    owner.markActiveLink(category);
    document.title = 'Ivan Ventura Arquitetura';
    const incoming = swiper.slides[swiper.activeIndex];
    const photo = incoming.querySelector('.slide-background-img');
    // Keep the image bound to its own project; never replace it with another cover.
    photo.loading = 'eager';
    await waitForImage(photo);
    const newLines = owner.homeMotion.lines(incoming);
    const oldLines = [...overlay.querySelectorAll('.main__title > span, .link__title > span, .slide__title__link, .bio__project, .detalhes__project')];
    if (!owner.motion.media.matches) {
      await new Promise(resolve => {
        timeline = gsap.timeline({onComplete:resolve});
        owner.categoryTimeline = timeline;
        timeline.to(oldLines,{autoAlpha:0,y:-direction*18,rotation:-direction,duration:.24,stagger:.045,ease:'power2.in'},0);
        timeline.to(overlay,{clipPath:direction === 1 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)',duration:.72,ease:'portfolio-edge'},.10);
        timeline.to(overlay.querySelectorAll('.slide-background-img, .project-photo-window img'),{scale:1.18,duration:.82,ease:'portfolio-zoom'},.06);
        timeline.fromTo(photo,{scale:1.18},{scale:1.08,duration:.94,ease:'portfolio-zoom'},.06);
        timeline.fromTo(newLines,{autoAlpha:0,y:direction*22,rotation:direction*1.2},{autoAlpha:1,y:0,rotation:0,duration:.39,stagger:.065,ease:'portfolio-in'},.61);
        if (owner.pendingCategory) shortenHandoff(timeline);
      });
    }
    if (!owner.categoryHistoryBound) {
      owner.categoryHistoryBound = true;
      window.addEventListener('popstate', () => {
        // Hash-only gallery navigation stays local; page/category history reloads its exact URL.
        if (location.pathname !== '/index.html' || new URLSearchParams(location.search).get('filter') !== owner.currentCategory) location.reload();
      });
    }
    owner.currentCategory = category;
  } catch (error) {
    console.warn('Category transition could not complete', error);
    if (changed) location.assign('/index.html?filter=' + encodeURIComponent(category));
    else if (oldCategory) owner.markActiveLink(oldCategory);
  } finally {
    timeline?.kill(); overlay?.remove();
    if (wasEnabled && !swiper.destroyed) swiper.enable();
    owner.categoryTimeline = null;
    owner.categoryBusy = false;
    if (owner.pendingCategory === category) owner.pendingCategory = null;
  }
}

async function waitForImage(image) {
  let timeout;
  try {
    await Promise.race([image.decode(), new Promise((_,reject) => {
      timeout = setTimeout(() => reject(new Error('Image load timed out')), 12000);
    })]);
  } finally { clearTimeout(timeout); }
}
