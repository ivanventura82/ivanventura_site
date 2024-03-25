import outsideClick from "./outsideclick.js";

export default class MenuProjetos {
  constructor(projetosButton, projetosList, events) {
    this.projetosButton = document.querySelector(projetosButton);
    this.projetosList = document.querySelector(projetosList);


    this.activeClass = "active";

    // define touchstart e click como argumento padrão
    // de events caso o usuário não define
    if (events === undefined) this.events = ["touchstart", "click"];
    else this.events = events;

    this.openMenu = this.openMenu.bind(this);
  }

  openMenu(event) {
    event.preventDefault();
    this.projetosList.classList.add(this.activeClass);
    this.projetosButton.classList.add(this.activeClass);


    outsideClick(this.projetosList, this.events, () => {
      this.projetosList.classList.remove(this.activeClass);
      this.projetosButtonButton.classList.remove(this.activeClass);
     
    });
  }

  addMenuMobileEvents() {
    this.events.forEach((evento) =>
      this.projetosButton.addEventListener(evento, this.openMenu)
    );
  }

  init() {
    if (this.projetosButton && this.projetosList) {
      this.addMenuMobileEvents();
    }
    return this;
  }
}







