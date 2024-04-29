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
    console.log('MenuProjetos Initialized');
  }

  toggleMenu(event) {
    console.log('toggleMenu Called', 'Is Open:', this.isOpen);
    event.preventDefault();
    event.stopPropagation();  // Impede que o evento se propague e dispare outros listeners

    if (this.isOpen && event.currentTarget === this.projetosButton) {
        console.log('Button Clicked, Menu is Open, Calling closeMenu');
        this.closeMenu(event, true);
    } else if (!this.isOpen) {
        console.log('Menu is Closed, Calling openMenu');
        this.openMenu();
    }
  }

  openMenu() {
    console.log('Opening Menu');
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
    console.log('Menu Opened');
  }

  closeMenu(event, force = false) {
    console.log('closeMenu Called', 'Event Target:', event.target, 'Force:', force);
    if (!this.projetosList.contains(event.target) && !this.projetosButton.contains(event.target) || force) {
        console.log('Closing Menu');
        this.animateMenuClose(this.projetosList.querySelectorAll('li'));
        document.removeEventListener('click', this.closeMenu);
        this.isOpen = false;
        console.log('Menu Closed');
    } else {
        console.log('Clicked Inside Menu, Not Closing');
    }
  }

  animateMenuClose(items) {
    console.log('Animating Menu Close');
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
        console.log('Menu Animation Complete, Menu Closed');
      }
    });
  }

  addMenuMobileEvents() {
    this.events.forEach(event => {
      console.log('Adding Event Listener:', event);
      this.projetosButton.addEventListener(event, this.toggleMenu);
    });
  }

  init() {
    console.log('Initializing MenuProjetos');
    if (this.projetosButton && this.projetosList) {
      this.addMenuMobileEvents();
    }
    return this;
  }
}






































