import outsideClick from "./outsideclick.js";

// export default class MenuMobile {
//   constructor(menuButton, menuList, logoMobile, emailMobile, instagramMobile, arrowMobile, events) {
//     this.menuButton = document.querySelector(menuButton);
//     this.menuList = document.querySelector(menuList);
//     this.logoMobile = document.querySelector(logoMobile);
//     this.emailMobile = document.querySelector(emailMobile);
//     this.instagramMobile = document.querySelector(instagramMobile);
//     this.arrowMobile = document.querySelector(arrowMobile);


//     this.activeClass = "active";
//     this.menuButton.addEventListener('touchstart', this.openMenu, { passive: true });
//     if (events === undefined) this.events = ["touchstart", "click"];
//     else this.events = events;

//     this.openMenu = this.openMenu.bind(this);
//   }

//   openMenu(event) {
//     console.log('Menu button clicked');
//     if (this.menuButton.contains(event.target)) {
//       event.preventDefault();
//       this.menuList.classList.add(this.activeClass);
//       this.menuButton.classList.add(this.activeClass);
//       this.emailMobile.classList.add(this.activeClass);
//       this.instagramMobile.classList.add(this.activeClass);
//       if (this.arrowMobile) this.arrowMobile.classList.add(this.activeClass); // Verifica se arrowMobile existe
//       this.logoMobile.classList.add("white");

   
//       outsideClick(this.menuList, this.events, () => {
//         this.closeMenu();
//       });
//     }
//   }

//   closeMenu() {
//     console.log('Closing menu');
//     this.menuList.classList.remove(this.activeClass);
//     this.menuButton.classList.remove(this.activeClass);
//     this.emailMobile.classList.remove(this.activeClass);
//     this.instagramMobile.classList.remove(this.activeClass);
//     if (this.arrowMobile) this.arrowMobile.classList.remove(this.activeClass); // Verifica se arrowMobile existe
//     this.logoMobile.classList.remove("white");

//   }

//   // addMenuMobileEvents() {
//   //   this.events.forEach((event) =>
//   //     this.menuButton.addEventListener(event, this.openMenu)
//   //   );

//   //   this.menuList.addEventListener('click', (event) => {
//   //     console.log('Menu list item clicked');
//   //     this.closeMenu();
//   //   });
//   // }

//   addMenuMobileEvents() {
//     this.events.forEach((event) => {
//       // Adicionar ouvinte passivo se for um evento que suporta essa opção.
//       const isTouchEvent = event === 'touchstart';
//       this.menuButton.addEventListener(event, this.openMenu, isTouchEvent ? { passive: true } : false);
//     });

//     this.menuList.addEventListener('click', (event) => {
//       console.log('Menu list item clicked');
//       this.closeMenu();
//     });
//   }

//   init() {
//     if (this.menuButton && this.menuList && this.logoMobile && this.emailMobile && this.instagramMobile) {
//       this.addMenuMobileEvents();
//     }
//     return this;
//   }
// }

export default class MenuMobile {
  constructor(menuButton, menuList, logoMobile, emailMobile, instagramMobile, arrowMobile, events) {
    this.menuButton = document.querySelector(menuButton);
    this.menuList = document.querySelector(menuList);
    this.logoMobile = document.querySelector(logoMobile);
    this.emailMobile = document.querySelector(emailMobile);
    this.instagramMobile = document.querySelector(instagramMobile);
    this.arrowMobile = document.querySelector(arrowMobile);


    this.activeClass = "active";
    if (events === undefined) this.events = ["touchstart", "click"];
    else this.events = events;

    this.openMenu = this.openMenu.bind(this);
  }

  openMenu(event) {
    console.log('Menu button clicked');
    if (this.menuButton.contains(event.target)) {
      event.preventDefault();
      this.menuList.classList.add(this.activeClass);
      this.menuButton.classList.add(this.activeClass);
      this.emailMobile.classList.add(this.activeClass);
      this.instagramMobile.classList.add(this.activeClass);
      if (this.arrowMobile) this.arrowMobile.classList.add(this.activeClass); // Verifica se arrowMobile existe
      this.logoMobile.classList.add("white");

   
      outsideClick(this.menuList, this.events, () => {
        this.closeMenu();
      });
    }
  }

  closeMenu() {
    console.log('Closing menu');
    this.menuList.classList.remove(this.activeClass);
    this.menuButton.classList.remove(this.activeClass);
    this.emailMobile.classList.remove(this.activeClass);
    this.instagramMobile.classList.remove(this.activeClass);
    if (this.arrowMobile) this.arrowMobile.classList.remove(this.activeClass); // Verifica se arrowMobile existe
    this.logoMobile.classList.remove("white");

  }

  addMenuMobileEvents() {
    this.events.forEach((event) =>
      this.menuButton.addEventListener(event, this.openMenu)
    );

    this.menuList.addEventListener('click', (event) => {
      console.log('Menu list item clicked');
      this.closeMenu();
    });
  }

  init() {
    if (this.menuButton && this.menuList && this.logoMobile && this.emailMobile && this.instagramMobile) {
      this.addMenuMobileEvents();
    }
    return this;
  }
}









