import gsap from "gsap";

export default class MenuMobile {
  constructor(menuButton, menuList, logoMobile, emailMobile, instagramMobile, events) {
    // this.menuMobileBack = document.querySelector(menuMobileBack);
    this.menuButton = document.querySelector(menuButton);
    this.menuList = document.querySelector(menuList);
    this.logoMobile = document.querySelector(logoMobile);
    this.emailMobile = document.querySelector(emailMobile);
    this.instagramMobile = document.querySelector(instagramMobile);
    this.botaoDown = document.querySelector('#botao-down');
    this.botaoVoltar = document.querySelector('#botao-voltar');

    this.activeClass = "active";
    if (events === undefined) this.events = ["touchstart", "click"];
    else this.events = events;

    this.openMenu = this.openMenu.bind(this);
  }

  openMenu(event) {
    event.stopPropagation(); // Impede a propagação do evento para o documento
    console.log('Menu button clicked');
  
    if (this.menuList.classList.contains(this.activeClass)) {
      this.closeMenu(); // Se o menu já estiver aberto, feche-o
    } else {
      this.menuOpened = true; // Flag para controle de estado
      this.menuList.classList.add(this.activeClass);
      this.menuButton.classList.add(this.activeClass);
      this.emailMobile.classList.add(this.activeClass);
      this.instagramMobile.classList.add(this.activeClass);
      if (this.botaoDown) this.botaoDown.classList.add(this.activeClass);
      if (this.botaoVoltar) this.botaoVoltar.classList.add(this.activeClass);
      this.logoMobile.classList.add("white");

      // Animação dos itens do menu e elementos adicionais
      this.animateMenuItems();
  this.toggleMenuAnimation(true);
  // Para fechar
    }
  }
  
  closeMenu() {
    this.menuOpened = false; // Resetar a flag
    console.log('Closing menu');
    // this.mobileMenuBack.classList.remove(this.activeClass);
    this.menuList.classList.remove(this.activeClass);
    this.menuButton.classList.remove(this.activeClass);
    this.emailMobile.classList.remove(this.activeClass);
    this.instagramMobile.classList.remove(this.activeClass);
    if (this.botaoDown) this.botaoDown.classList.remove(this.activeClass);
    if (this.botaoVoltar) this.botaoVoltar.classList.remove(this.activeClass);
    this.logoMobile.classList.remove("white");
 
  this.toggleMenuAnimation(false);
  }

  addMenuMobileEvents() {
    this.menuButton.addEventListener('click', this.openMenu);
  
    // Fechar o menu quando um item do menuList é clicado
    this.menuList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {  // Garante que o menu feche apenas quando os links são clicados
        console.log('Menu list item clicked');
        this.closeMenu();
      }
    });
  }

  animateMenuItems() {
    // Seleciona todos os itens do menu principal que você deseja animar
    const menuItems = document.querySelectorAll('.menu li');
    const totalItems = menuItems.length + 2; // +2 para email e Instagram
  
    // Animação para cada item do menu principal
    menuItems.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power1.out",
        delay: 0.1 + index * 0.1,
        onComplete: function() {
          gsap.set(item, { clearProps: "all" }); // Limpa os estilos aplicados pela animação
        }
      });
    });
  
    // Animação para o email e Instagram com delay baseado no último item do menu
    gsap.from(this.emailMobile, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: "power1.out",
      delay: 0.1 + menuItems.length * 0.1 // Começa após o último item do menu
    });
  
    gsap.from(this.instagramMobile, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: "power1.out",
      delay: 0.1 + (menuItems.length + 1) * 0.1 // Começa após o email
    });
  }

  toggleMenuAnimation(show) {
    const menuList = document.querySelector('.js [data-menu="list"]');
    if (show) {
      gsap.to(menuList, {
        duration: 0.5,
        opacity: 1,
        visibility: 'visible',
        ease: 'power1.inOut',
        onStart: function() {
          menuList.style.display = 'flex'; // Mude para flex para iniciar a animação
        }
      });
    } else {
      gsap.to(menuList, {
        duration: 0.5,
        opacity: 0,
        visibility: 'hidden',
        ease: 'power1.inOut',
        onComplete: function() {
          menuList.style.display = 'none'; // Esconde novamente após animar
        }
      });
    }
  }
  

  

  init() {
    if (this.menuButton && this.menuList && this.logoMobile && this.emailMobile && this.instagramMobile) {
      this.addMenuMobileEvents();
    }
    return this;
  }
}                                                                                       
                                                                              

                                                                              







