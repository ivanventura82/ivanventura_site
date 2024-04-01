export default class HeaderAnimation {
  constructor(elementsToAnimate, delayIncrement, initialDelay) {
    this.elementsToAnimate = elementsToAnimate;
    this.delayIncrement = delayIncrement;
    this.initialDelay = initialDelay; // Novo parâmetro para delay inicial
  }

  animate() {
    this.elementsToAnimate.forEach((element, index) => {
        const delay = this.initialDelay + index * this.delayIncrement;
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translate(0, 0)';
        }, delay);
      });
    }
  }
