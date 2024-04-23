import outsideClick from "./outsideclick.js";
import gsap from 'gsap';

export default class MenuProjetos {
  constructor(projetosButton, projetosList, events) {
    this.projetosButton = document.querySelector(projetosButton);
    this.projetosList = document.querySelector(projetosList);
    this.activeClass = "active";

    if (events === undefined) this.events = ["touchstart", "click"];
    else this.events = events;

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.isOpen = false;  // Estado para controlar se o menu está aberto ou fechado
  }

  toggleMenu(event) {
    event.preventDefault();
    if (!this.isOpen) {
      this.openMenu();
    } else {
      this.closeMenu(event, true);  // Chamada direta para fechamento com um segundo argumento
    }
  }

  openMenu() {
    this.projetosList.classList.add(this.activeClass);
    this.projetosButton.classList.add(this.activeClass);
    const items = this.projetosList.querySelectorAll('li');
    gsap.set(items, { opacity: 0 });
    gsap.to(items, {
      opacity: 1,
      duration: 0.3,
      stagger: {
        amount: 0.5,
        from: "end"
      }
    });
    this.isOpen = true;
    document.addEventListener('click', this.closeMenu);
  }

  closeMenu(event, force = false) {
    // Verifica se o clique foi fora ou o fechamento é forçado pelo botão
    if (!this.projetosList.contains(event.target) && !this.projetosButton.contains(event.target) || force) {
      const items = this.projetosList.querySelectorAll('li');
      this.animateMenuClose(items);
      document.removeEventListener('click', this.closeMenu); // Remover o listener para evitar chamadas extras
      this.isOpen = false;
    }
  }

  animateMenuClose(items) {
    gsap.to(items, {
      opacity: 0,
      duration: 0.3,
      stagger: {
        amount: 0.5,
        from: "start"
      },
      onComplete: () => {
        this.projetosList.classList.remove(this.activeClass);
        this.projetosButton.classList.remove(this.activeClass);
        gsap.set(items, { opacity: 0 });
      }
    });
  }

  addMenuMobileEvents() {
    this.events.forEach(event =>
      this.projetosButton.addEventListener(event, this.toggleMenu)
    );
  }

  init() {
    if (this.projetosButton && this.projetosList) {
      this.addMenuMobileEvents();
    }
    return this;
  }
}







