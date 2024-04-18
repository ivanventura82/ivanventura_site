import gsap from 'gsap';


// export default class CarregaProjetos {
//     constructor(jsonURL, swiperInstance) {
//         this.jsonURL = jsonURL;
//         this.swiperInstance = swiperInstance; // Garanta que esta é a instância de MySwiper
//         console.log("Swiper instance passed to CarregaProjetos:", this.swiperInstance);
//         this.todosProjetos = []; // Nova propriedade para armazenar todos os projetos
//         this.projetosFiltrados = []; // Adiciona esta linha   
//     }

//     carregarProjetos(categoriaInicial = 'selecionado') {
//         fetch(this.jsonURL)
//             .then(response => response.json())
//             .then(projetos => {
//                 this.todosProjetos = projetos;
//                 // Passa true para ocultarPrimeiroBullet se a categoriaInicial for 'selecionado'
//                 const ocultarPrimeiroBullet = categoriaInicial === 'selecionado';
//                 this.filtrarEExibirProjetos(categoriaInicial, ocultarPrimeiroBullet);
//             })
//             .catch(error => console.error("Erro ao carregar projetos:", error));
//     }

//     // async carregarProjetos(categoriaInicial = 'selecionado') {
//     //     try {
//     //         const response = await fetch(this.jsonURL);
//     //         const projetos = await response.json();
//     //             this.todosProjetos = projetos;
//     //             // Passa true para ocultarPrimeiroBullet se a categoriaInicial for 'selecionado'
//     //             const ocultarPrimeiroBullet = categoriaInicial === 'selecionado';
//     //             this.filtrarEExibirProjetos(categoriaInicial, ocultarPrimeiroBullet);
//     //         } catch (error) {
//     //             console.error("Erro ao carregar projetos:", error);
//     //         }
//     //     }

//     getProjetosFiltrados() {
//         return this.projetosFiltrados;
//     }
 
//     filtrarEExibirProjetos(categoria, ocultarPrimeiroBullet = false) {
//         console.log(`Filtrando por categoria: ${categoria}`);

//         const projetosFiltrados = this.todosProjetos.filter(projeto => 
//             categoria === 'selecionado' ? projeto.selecionado === true :
//             categoria === 'all' ? true : projeto.categoria === categoria);


//         this.projetosFiltrados = projetosFiltrados; // Adiciona esta linha
//         this.exibirProjetos(this.projetosFiltrados, ocultarPrimeiroBullet);
//         if (window.innerWidth > 768) {
//             this.construirMenuLateral(projetosFiltrados); // Atualize para usar os projetos filtrados
//         }
//     }
  
//     construirMenuLateral(projetosFiltrados) {
//         console.log(`Construindo menu lateral com ${projetosFiltrados.length} projetos`, projetosFiltrados.slice(0, 3));

//         const menuLateral = document.querySelector('.project-menu-hover');
//         if (!menuLateral) {
//             console.error("Elemento do menu lateral não encontrado.");
//             return;
//         }
    
//         menuLateral.innerHTML = ''; // Limpa o menu existente antes de adicionar novos itens
    
//         projetosFiltrados.forEach(projeto => {
//             const li = document.createElement('li');
//             const a = document.createElement('a');
//             a.className = 'project-menu-item swiper-nav-link';
//             a.href = "#" + projeto.datahash || "#"; // Assume que você tem um campo `href` em seus objetos de projeto
//             a.dataset.filter = projeto.categoria;
//             a.innerText = projeto.title; // Assume que você tem um campo `nome` em seus objetos de projeto
    
//             li.appendChild(a);
//             menuLateral.appendChild(li);
//         });
//     }
    
//     exibirProjetos(projetos, ocultarPrimeiroBullet = false) {
//         if (document.body.id === "index-page") {
//             const swiperWrapper = document.querySelector('.swiper-wrapper');
//             // Continua com a remoção segura de slides e adição dos novos slides
//         } else {
//             console.log("Não está na página Index, não executa a manipulação de slides.");
//         }
//         const swiperWrapper = document.querySelector('.swiper-wrapper');
        
//         // Seleciona todos os slides exceto o slide1
//         const slidesParaRemover = Array.from(swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])'));
        
//         // Remove todos os slides exceto o slide1
//         slidesParaRemover.forEach(slide => swiperWrapper.removeChild(slide));
    
//         projetos.forEach(projeto => {
//             // Criação do elemento do slide
//             const slideElement = document.createElement('div');
//             slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
//             slideElement.setAttribute('data-hash', projeto.datahash);
        
//             // Cria o elemento img para a imagem de fundo
//             const backgroundImage = document.createElement('img');
//             backgroundImage.className = 'slide-background-img'; // Classe para estilizar e posicionar a imagem
//             // Usa a imagem de menor resolução como 'src' para fallback
//             backgroundImage.setAttribute('src', `./img/${projeto.datahash}/${projeto.imagemhome}.webp`);
//             // Define 'srcset' com todas as versões da imagem nos três tamanhos especificados
//             backgroundImage.setAttribute('srcset', `
//                 ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
//                 ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
//                 ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
//             `);
//             // O 'sizes' define como a imagem será exibida em diferentes larguras de viewport
//             backgroundImage.setAttribute('sizes', `
//                 (max-width: 720px) 100vw,
//                 (max-width: 1024px) 100vw,
//                 100vw
//             `);
//             backgroundImage.setAttribute('alt', `Projeto ${projeto.title}`);
//             backgroundImage.loading = "lazy"; // Habilita o lazy loading nativo
        
//             // Adiciona a imagem de fundo ao slideElement antes do conteúdo do slide
//             slideElement.appendChild(backgroundImage);

//             document.addEventListener("DOMContentLoaded", function() {
//                 var link = document.querySelector(".link__title");
//                 if (link) {
//                     link.style.cursor = "pointer";
//                 }
//             });
        
//             const slideContent = `
//                 <div class="slide-content">
//                     <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
                        
//                         <span class="subtitle__part2">${projeto.subtitulo1}</span>
//                         <span class="subtitle__part3">${projeto.subtitulo2}</span>
//                         <div class="slide__title__link subtitle__part1">
//                             <h2 class="slide__title">${projeto.title}</h2>
//                             <img src="./img/logo-r.svg" class="slide__title__arrow" alt="Seta apontando para a direita, indicando link para a página do projeto.">
//                         </div>
//                     </a>
//                 </div>
//             `;

//             // Aplicar animações GSAP aqui
//     gsap.from(slideElement.querySelector('.slide-background-img'), {
//         duration: 1.5,
//         scale: 1.1,
//         autoAlpha: 0,
//         ease: 'power2.out'
//     });
        
//             // Adiciona o conteúdo do slide
//             slideElement.insertAdjacentHTML('beforeend', slideContent);
//             swiperWrapper.appendChild(slideElement);
//         });
        

//         if (this.swiperInstance) {
//             setTimeout(() => {
//                 this.swiperInstance.update(); // Atualiza o Swiper para refletir as mudanças
//                 window.lazyLoaderInstance.update();

//                 // Condicionalmente oculta o primeiro bullet
//                 if (ocultarPrimeiroBullet) {
//                     this.swiperInstance.applyDisplayNoneToFirstBullet();
//                 } else {
//                     // Se não precisar ocultar, certifique-se de que ele está visível
//                     const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
//                     if (firstPaginationBullet) {
//                         firstPaginationBullet.style.display = ''; // Ou 'flex', dependendo do seu layout
//                     }
//                 }
//             }, 50); // Ajuste o tempo conforme necessário
//         } else {
//             console.error("Swiper instance is not defined in CarregaProjetos.");
//         }

//         // this.swiperInstance.update();
//         window.lazyLoaderInstance.update();
//     }

   
//     // exibirProjetos(projetos, ocultarPrimeiroBullet = false) {
//     //     if (document.body.id === "index-page") {
//     //         const swiperWrapper = document.querySelector('.swiper-wrapper');
//     //         // Remove os slides existentes, exceto o primeiro slide fixo.
//     //         Array.from(swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])'))
//     //              .forEach(slide => swiperWrapper.removeChild(slide));
    
//     //         // Adiciona novos slides baseados nos projetos filtrados.
//     //         projetos.forEach(projeto => {
//     //             const slideElement = criarSlide(projeto);
//     //             swiperWrapper.appendChild(slideElement);
//     //             animarSlide(slideElement);
//     //         });
    
//     //         // Agendar atualizações do Swiper após as animações estarem configuradas.
//     //         setTimeout(() => {
//     //             this.swiperInstance.update();
//     //             window.lazyLoaderInstance.update();
//     //             if (ocultarPrimeiroBullet) {
//     //                 this.swiperInstance.applyDisplayNoneToFirstBullet();
//     //             } else {
//     //                 const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
//     //                 if (firstPaginationBullet) {
//     //                     firstPaginationBullet.style.display = '';
//     //                 }
//     //             }
//     //         }, 50);
//     //     } else {
//     //         console.log("Não está na página Index, não executa a manipulação de slides.");
//     //     }
//     // }
    
//     // criarSlide(projeto) {
//     //     const slideElement = document.createElement('div');
//     //     slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
//     //     slideElement.setAttribute('data-hash', projeto.datahash);
    
//     //     const backgroundImage = document.createElement('img');
//     //     backgroundImage.className = 'slide-background-img';
//     //     backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagemhome}.webp`;
//     //     backgroundImage.srcset = `
//     //         ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
//     //         ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
//     //         ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
//     //     `;
//     //     backgroundImage.sizes = "100vw";
//     //     backgroundImage.alt = `Projeto ${projeto.title}`;
//     //     backgroundImage.loading = "lazy";
    
//     //     slideElement.appendChild(backgroundImage);
    
//     //     const slideContentHTML = `
//     //         <div class="slide-content">
//     //             <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
//     //                 <span class="subtitle__part2">${projeto.subtitulo1}</span>
//     //                 <span class="subtitle__part3">${projeto.subtitulo2}</span>
//     //                 <div class="slide__title__link subtitle__part1">
//     //                     <h2 class="slide__title">${projeto.title}</h2>
//     //                     <img src="./img/logo-r.svg" class="slide__title__arrow" alt="Seta apontando para a direita">
//     //                 </div>
//     //             </a>
//     //         </div>
//     //     `;
    
//     //     slideElement.insertAdjacentHTML('beforeend', slideContentHTML);
//     //     return slideElement;
//     // }
    
//     animarSlide(slideElement) {
//         // Animação da "cortina" preta
//         const cortina = document.createElement('div');
//         cortina.style.position = 'absolute';
//         cortina.style.width = '100%';
//         cortina.style.height = '100%';
//         cortina.style.backgroundColor = 'black';
//         cortina.style.left = '0';
//         cortina.style.top = '0';
//         cortina.style.zIndex = '10'; // Certifique-se de que está acima da imagem
//         slideElement.appendChild(cortina);
    
//         const tl = gsap.timeline();
    
//         tl.to(cortina, {
//             duration: 0.8,
//             x: '100%', // Move a cortina para a direita
//             ease: 'power2.inOut'
//         })
//         .from(slideElement.querySelector('.slide-background-img'), {
//             duration: 1.5,
//             scale: 1.1,
//             autoAlpha: 0,
//             ease: 'power2.out',
//             onComplete: () => slideElement.removeChild(cortina) // Remove a cortina após a animação
//         })
//         .from(slideElement.querySelector('.slide-content'), {
//             duration: 1.2,
//             y: 30,
//             autoAlpha: 0,
//             ease: 'power2.out',
//             stagger: 0.1
//         }, '-=1.2'); // Inicia esta animação um pouco antes de a imagem terminar de animar
//     }
    
   
   
//     setSwiperInstance(swiperInstance) {
//         this.swiperInstance = swiperInstance;
//     }
// }

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

