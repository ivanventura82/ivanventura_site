import gsap from 'gsap';

export default class MenuProjetos {
  constructor(projetosButton, projetosList, events) {
    this.projetosButton = document.querySelector(projetosButton);
    this.projetosList = document.querySelector(projetosList);
    this.activeClass = 'active';
    this.events = events || ['click'];
    this.isOpen = false;
    this.openTimer = null;
    this.closeTimer = null;
    this.hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  clearTimers() {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
  }
  toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clearTimers();
    // Clicking confirms the hover opening instead of reversing it.
    if (!this.isOpen) this.openMenu();
  }
  openMenu() {
    this.clearTimers();
    const items = this.projetosList.querySelectorAll('li');
    // Cancel a closing tween, including its pending completion callback.
    gsap.killTweensOf(items);
    this.projetosList.classList.add(this.activeClass);
    this.projetosButton.classList.add(this.activeClass);
    this.projetosButton.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    gsap.to(items, {opacity:1,duration:.22,stagger:.025,overwrite:true});
  }
  closeAfterSelection() {
    const region = this.projetosButton.closest('nav') || this.projetosButton.parentElement;
    if (this.hoverMedia.matches && region.matches(':hover')) {
      this.openMenu();
      return;
    }
    this.closeMenu();
  }
  closeMenu() {
    this.clearTimers();
    this.isOpen = false;
    this.projetosButton.setAttribute('aria-expanded', 'false');
    this.animateMenuClose(this.projetosList.querySelectorAll('li'));
  }
  animateMenuClose(items) {
    gsap.killTweensOf(items);
    gsap.to(items,{opacity:0,duration:.18,overwrite:true,onComplete:()=>{
      if (this.isOpen) return;
      this.projetosList.classList.remove(this.activeClass);
      this.projetosButton.classList.remove(this.activeClass);
    }});
  }
  addMenuMobileEvents() {
    this.events.forEach(event=>this.projetosButton.addEventListener(event,this.toggleMenu));
  }
  init() {
    if (!this.projetosButton || !this.projetosList || this.initialized) return this;
    this.initialized = true;
    this.addMenuMobileEvents();
    const region = this.projetosButton.closest('nav') || this.projetosButton.parentElement;
    region.addEventListener('pointerenter', event=>{
      if (!this.hoverMedia.matches || event.pointerType === 'touch') return;
      this.clearTimers();
      if (this.isOpen) return;
      this.openTimer = setTimeout(()=>this.openMenu(),100);
    });
    region.addEventListener('pointerleave', event=>{
      if (!this.hoverMedia.matches || event.pointerType === 'touch') return;
      this.clearTimers();
      this.closeTimer = setTimeout(()=>{
        this.closeMenu();
      },400);
    });
    region.addEventListener('focusin',()=>clearTimeout(this.closeTimer));
    region.addEventListener('focusout',event=>{
      if (!region.contains(event.relatedTarget)) {
        this.clearTimers();
        this.closeTimer=setTimeout(()=>{if(!region.matches(':hover'))this.closeMenu();},400);
      }
    });
    document.addEventListener('pointerdown', event=>{
      if (this.isOpen && !region.contains(event.target)) this.closeMenu();
    });
    region.addEventListener('keydown',event=>{
      if(event.key==='Escape') { this.closeMenu(); this.projetosButton.focus(); }
    });
    return this;
  }
}
