export default class LazyLoader {
  constructor() {
    this.images = [];
    this.observer = null;
    this.init();
    // this.addResizeListener();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this));
      this.update(); // Inicializa a observação das imagens atuais no DOM.
    } else {
      this.loadImagesFallback();
    }
  }

  update() {
    const unobservedImages = [].slice.call(document.querySelectorAll("img.lazy:not(.observed)"));
    unobservedImages.forEach(image => {
      if (this.observer) {
        this.observer.observe(image);
        image.classList.add("observed");
      } else {
        image.src = image.dataset.src;
        image.classList.remove("lazy");
      }
    });
    this.images = this.images.concat(unobservedImages);
  }

  onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        // Aqui, ao invés de alterar o src baseado na largura da tela,
        // apenas assegure que a imagem comece a carregar se ainda não começou.
        // O navegador decidirá qual imagem carregar baseado em srcset e sizes.
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }
        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
        }
        image.classList.remove("lazy", "observed");
        this.observer.unobserve(image);
      }
    });
  }
  

  loadImagesFallback() {
    document.querySelectorAll("img.lazy").forEach(image => {
      image.src = image.dataset.src;
      image.classList.remove("lazy");
    });
  }
}





