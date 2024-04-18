import gsap from 'gsap';


export default class CarregaProjetos {
    constructor(jsonURL, swiperInstance) {
        this.jsonURL = jsonURL;
        this.swiperInstance = swiperInstance;
        this.todosProjetos = [];
        this.projetosFiltrados = [];
    }

    async carregarProjetos(categoriaInicial = 'selecionado') {
        try {
            const response = await fetch(this.jsonURL);
            const projetos = await response.json();
            this.todosProjetos = projetos;
            this.filtrarEExibirProjetos(categoriaInicial, categoriaInicial === 'selecionado');

        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
        }
    }


    filtrarEExibirProjetos(categoria, ocultarPrimeiroBullet = false) {
        this.projetosFiltrados = this.todosProjetos.filter(projeto =>
            categoria === 'all' ? true : (categoria === 'selecionado' ? projeto.selecionado : projeto.categoria === categoria)
        );
        this.exibirProjetos(ocultarPrimeiroBullet);
        if (window.innerWidth > 768) {
            this.construirMenuLateral(this.projetosFiltrados);
        }
    }

    exibirProjetos(ocultarPrimeiroBullet) {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])').forEach(slide => slide.remove());

        this.projetosFiltrados.forEach(projeto => {
            const slide = this.criarSlide(projeto);
            swiperWrapper.appendChild(slide);
            this.animarSlide(slide);
        });

        setTimeout(() => {
            this.swiperInstance.update();
            // window.lazyLoaderInstance.update();
            this.gerenciarPrimeiroBullet(ocultarPrimeiroBullet);
        }, 50);
    }

    criarSlide(projeto) {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
        slideElement.setAttribute('data-hash', projeto.datahash);
    
        // Cria o elemento img para a imagem de fundo com lazy loading
        const backgroundImage = document.createElement('img');
        backgroundImage.className = 'slide-background-img';
        backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagemhome}.webp`;
        backgroundImage.srcset = `
            ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
            ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
            ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
        `;
        backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";
        backgroundImage.alt = `Projeto ${projeto.title}`;
        backgroundImage.loading = "lazy";
    
        // Cortina Preta para animação
        const blackCurtain = document.createElement('div');
        blackCurtain.style.position = 'absolute';
        blackCurtain.style.left = 0;
        blackCurtain.style.top = 0;
        blackCurtain.style.width = '100%';
        blackCurtain.style.height = '100%';
        blackCurtain.style.backgroundColor = 'black';
        blackCurtain.style.transform = 'translateX(-100%)';
    
        // Conteúdo do Slide
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
    
        // Montagem do slide
        slideElement.appendChild(backgroundImage);
        slideElement.appendChild(blackCurtain);
        slideElement.appendChild(slideContent);
    
        return slideElement;
    }

//     criarSlide(projeto) {
//     const slideElement = document.createElement('div');
//     slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
//     slideElement.setAttribute('data-hash', projeto.datahash);

//     // Cria o elemento img para a imagem de fundo com lazy loading
//     const backgroundImage = document.createElement('img');
//     backgroundImage.className = 'slide-background-img lazy';
//     backgroundImage.setAttribute('data-src', `./img/${projeto.datahash}/${projeto.imagemhome}.webp`);
//     backgroundImage.setAttribute('data-srcset', `
//         ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
//         ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
//         ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
//     `);
//     backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";
//     backgroundImage.alt = `Projeto ${projeto.title}`;
//     backgroundImage.loading = "lazy";

//     // Cortina Preta para animação
//     const blackCurtain = document.createElement('div');
//     blackCurtain.style.position = 'absolute';
//     blackCurtain.style.left = 0;
//     blackCurtain.style.top = 0;
//     blackCurtain.style.width = '100%';
//     blackCurtain.style.height = '100%';
//     blackCurtain.style.backgroundColor = 'black';
//     blackCurtain.style.transform = 'translateX(-100%)';

//     // Conteúdo do Slide
//     const slideContent = document.createElement('div');
//     slideContent.className = 'slide-content';
//     slideContent.innerHTML = `
//         <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
//             <span class="subtitle__part2">${projeto.subtitulo1}</span>
//             <span class="subtitle__part3">${projeto.subtitulo2}</span>
//             <div class="slide__title__link subtitle__part1">
//             <h2 class="slide__title">${projeto.title}</h2>
//             <img src="./img/logo-r.svg" class="slide__title__arrow" alt="Seta apontando para a direita">
//         </div>
//         </a>`;

//     // Montagem do slide
//     slideElement.appendChild(backgroundImage);
//     slideElement.appendChild(blackCurtain);
//     slideElement.appendChild(slideContent);

//     return slideElement;
// }

    
    animarSlide(slideElement) {
        const blackCurtain = slideElement.querySelector('div');
        const bgImage = slideElement.querySelector('.slide-background-img');
        const content = slideElement.querySelector('.slide-content');
        const textSpans = content.querySelectorAll('span'); // Selecione as tags <span>
        const titleAndArrow = content.querySelector('.slide__title__link'); // Seleciona tanto o h2 quanto a img juntos   
        // Animação da Cortina Preta
        gsap.to(blackCurtain, {x: '100%', duration: 1, ease: 'power2.inOut', onComplete: () => {
            // Remoção da cortina após a animação
            blackCurtain.style.display = 'none';
        }});
    
        // Animações de Zoom para a Imagem e Fade In para o Texto
        gsap.fromTo(bgImage, {
            scale: 1.1,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.5  // Inicia após a cortina começar a se mover
        });
        // Animação para o título e a seta (imagem)
        gsap.fromTo(titleAndArrow, {
            y: 30,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            delay: 1.2, // Delay para começar a animação depois da imagem de fundo
            ease: 'power2.out'
        });

        // Animação sequencial para cada <span>
        textSpans.forEach((span, index) => {
            gsap.fromTo(span, {
                y: 30,
                autoAlpha: 0
            }, {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                delay: 1.4 + index * 0.2, // Incrementa o delay para cada <span>
                ease: 'power2.out'
            });
        });
    }

    gerenciarPrimeiroBullet(ocultar) {
        const firstBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
        if (firstBullet) firstBullet.style.display = ocultar ? 'none' : '';
    }

    construirMenuLateral(projetosFiltrados) {
        const menuLateral = document.querySelector('.project-menu-hover');
        if (!menuLateral) {
            console.error("Elemento do menu lateral não encontrado.");
            return;
        }

        menuLateral.innerHTML = '';
        projetosFiltrados.forEach(projeto => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'project-menu-item swiper-nav-link';
            a.href = `#` + projeto.datahash;
            a.dataset.filter = projeto.categoria;
            a.innerText = projeto.title;
            li.appendChild(a);
            menuLateral.appendChild(li);
        });
    }
}

