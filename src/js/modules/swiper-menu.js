export default class UIController {
  constructor() {
    this.projectMenu = document.querySelector('.project-menu-hover');
    this.pagination = document.querySelector('.pagination');
  }

  toggleElementVisibility(element, isVisible) {
    if (element) {
      element.classList[isVisible ? 'add' : 'remove']('show-element');
    }
  }

  setPaginationDisplay(isVisible) {
    if (this.pagination) {
      this.pagination.style.display = isVisible ? 'flex' : 'none';
    }
  }

  toggleProjectMenu(isVisible) {
    this.toggleElementVisibility(this.projectMenu, isVisible);
    this.setPaginationDisplay(!isVisible);
  }

  togglePagination(isVisible) {
    this.toggleElementVisibility(this.pagination, isVisible);
  }

  init() {
   
  }

}


