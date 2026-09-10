
export default class CarregaProjetos {
    constructor(jsonURL, swiperInstance) {
        this.jsonURL = jsonURL;
        this.swiperInstance = swiperInstance; // Garanta que esta é a instância de MySwiper
        console.log("Swiper instance passed to CarregaProjetos:", this.swiperInstance);
        this.introSlide = document.querySelector('[data-hash="slide1"]');
        this.todosProjetos = []; // Nova propriedade para armazenar todos os projetos
        this.projetosFiltrados = []; // Adiciona esta linha   
    }

    carregarProjetos(categoriaInicial = 'selecionado') {
        fetch(this.jsonURL)
            .then(response => response.json())
            .then(projetos => {
                this.todosProjetos = projetos;
                // Passa true para ocultarPrimeiroBullet se a categoriaInicial for 'selecionado'
                const ocultarPrimeiroBullet = categoriaInicial === 'selecionado';
                this.filtrarEExibirProjetos(categoriaInicial, ocultarPrimeiroBullet);
            })
            .catch(error => console.error("Erro ao carregar projetos:", error));
    }

    getProjetosFiltrados() {
        return this.projetosFiltrados;
    }
 
    filtrarEExibirProjetos(categoria, ocultarPrimeiroBullet = false) {
        console.log(`Filtrando por categoria: ${categoria}`);

        const projetosFiltrados = this.todosProjetos.filter(projeto => 
            categoria === 'selecionado' ? projeto.selecionado === true :
            categoria === 'all' ? true : projeto.categoria === categoria);


        this.projetosFiltrados = projetosFiltrados; // Adiciona esta linha
        this.construirMenuLateral(projetosFiltrados);
        this.exibirProjetos(this.projetosFiltrados, ocultarPrimeiroBullet); // Atualize para usar os projetos filtrados
    }
  
    construirMenuLateral(projetosFiltrados) {
        console.log(`Construindo menu lateral com ${projetosFiltrados.length} projetos`, projetosFiltrados.slice(0, 3));

        const menuLateral = document.querySelector('.project-menu-hover');
        if (!menuLateral) {
            console.error("Elemento do menu lateral não encontrado.");
            return;
        }
    
        menuLateral.innerHTML = ''; // Limpa o menu existente antes de adicionar novos itens
    
        projetosFiltrados.forEach(projeto => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'project-menu-item swiper-nav-link';
            a.href = "#" + projeto.datahash || "#"; // Assume que você tem um campo `href` em seus objetos de projeto
            a.dataset.filter = projeto.categoria;
            a.innerText = projeto.title; // Assume que você tem um campo `nome` em seus objetos de projeto
    
            li.appendChild(a);
            menuLateral.appendChild(li);
        });
    }
    
    exibirProjetos(projetos, ocultarPrimeiroBullet = false) {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        if (document.body.id === "index-page") {
            // Continua com a remoção segura de slides e adição dos novos slides
        } else {
            console.log("Não está na página Index, não executa a manipulação de slides.");
            return; // Termina a execução se não estiver na página correta
        }
    
        // Seleciona todos os slides exceto o slide1
        const slidesParaRemover = Array.from(swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])'));
    
        // Remove todos os slides exceto o slide1
        slidesParaRemover.forEach(slide => swiperWrapper.removeChild(slide));
    
        this.swiperInstance.homeMotion?.reset();
        if (ocultarPrimeiroBullet && this.introSlide) swiperWrapper.prepend(this.introSlide);
        else this.introSlide?.remove();
        projetos.forEach((projeto, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'swiper-slide com-imagem-de-fundo';
            slideElement.setAttribute('data-filter', projeto.categoria); 
            slideElement.setAttribute('data-hash', projeto.datahash);

            const backgroundImage = document.createElement('img');
            backgroundImage.className = 'slide-background-img';
            backgroundImage.src = `../img/${projeto.datahash}/${projeto.imagemhome}.webp`;
            backgroundImage.srcset = `
            ../img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
            ../img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
            ../img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
            `;
            backgroundImage.sizes = "100vw";
            backgroundImage.alt = `Projeto ${projeto.title}`;
            backgroundImage.loading = index === 0 ? "eager" : "lazy";
            backgroundImage.fetchPriority = index === 0 ? "high" : "low";
            backgroundImage.decoding = "async";
    
            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';
            slideContent.innerHTML = `
                <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
                    <span class="subtitle__part2">${projeto.subtitulo1}</span>
                    <span class="subtitle__part3">${projeto.subtitulo2}</span>
                    <div class="slide__title__link subtitle__part1">
                    <h2 class="slide__title">${projeto.title}</h2>
                    <img src="./img/logo-r.svg" class="slide__title__arrow" alt="Seta apontando para a direita">
                </div>
                </a>`;
    
            slideElement.appendChild(backgroundImage);
            slideElement.appendChild(slideContent);
            swiperWrapper.appendChild(slideElement); // Adiciona o slide ao swiperWrapper

            // Chamar a animação para o slide
            this.swiperInstance.homeMotion?.prepare(slideElement);

        });
    
        this.swiperInstance.refreshHomeSlides(!ocultarPrimeiroBullet);
    }

    // Dentro de CarregaProjetos
    setSwiperInstance(swiperInstance) {
        this.swiperInstance = swiperInstance;
    }
}