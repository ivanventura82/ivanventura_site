export default class HoverInteraction {
  constructor() {
      this.init();
  }

  init() {
    // Find all elements with the class 'conteudo-premio'
    const contentPremioElements = document.querySelectorAll('.conteudo-premio');

    // Attach event listeners to each element
    contentPremioElements.forEach(element => {
        element.addEventListener('mouseover', () => this.handleMouseOver(element));
        element.addEventListener('mouseleave', () => this.handleMouseLeave(element));
    });
}
  handleMouseOver(element) {
      // Find the corresponding 'imagem__premio' element
      const imagemPremio = this.findCorrespondingImagemPremio(element);

      // Add the 'active-premio' class
      if (imagemPremio) {
          imagemPremio.classList.add('active-premio');
      }
  }

  handleMouseLeave(element) {
      // Find the corresponding 'imagem__premio' element
      const imagemPremio = this.findCorrespondingImagemPremio(element);

      // Remove the 'active-premio' class
      if (imagemPremio) {
          imagemPremio.classList.remove('active-premio');
      }
  }

  findCorrespondingImagemPremio(element) {
      // Logic to find the corresponding 'imagem__premio' element
      // This depends on your HTML structure. 
      // For example, if 'imagem__premio' is next to 'content-premio':
      return element.nextElementSibling;
  }
}
