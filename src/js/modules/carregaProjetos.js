import gsap from 'gsap';

export default class CarregaProjetos {
    constructor(jsonURL, swiperInstance) {
        this.jsonURL = jsonURL;
        this.swiperInstance = swiperInstance; // Garanta que esta é a instância de MySwiper
        console.log("Swiper instance passed to CarregaProjetos:", this.swiperInstance);
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
        this.exibirProjetos(this.projetosFiltrados, ocultarPrimeiroBullet);
        this.construirMenuLateral(projetosFiltrados); // Atualize para usar os projetos filtrados
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
    
        projetos.forEach(projeto => {
            const slideElement = document.createElement('div');
            slideElement.className = 'swiper-slide com-imagem-de-fundo';
            slideElement.setAttribute('data-filter', projeto.categoria); 
            slideElement.setAttribute('data-hash', projeto.datahash);

            // Adicionando a cortina preta
            const blackCurtain = document.createElement('div');
            blackCurtain.className = 'black-curtain';
            blackCurtain.style.width = '100%';
            blackCurtain.style.height = '100%';
            blackCurtain.style.backgroundColor = 'rgba(0,0,0,0.7)'; // Ajuste a cor e a opacidade conforme necessário
            blackCurtain.style.position = 'absolute';
            blackCurtain.style.top = '0';
            blackCurtain.style.left = '0';
            
            const backgroundImage = document.createElement('img');
            backgroundImage.className = 'slide-background-img';
            backgroundImage.src = `../img/${projeto.datahash}/${projeto.imagemhome}.webp`;
            backgroundImage.srcset = `
            ../img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
            ../img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
            ../img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
            `;
            backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";
            backgroundImage.alt = `Projeto ${projeto.title}`;
            backgroundImage.loading = "lazy";
    
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
            slideElement.appendChild(blackCurtain);
            swiperWrapper.appendChild(slideElement); // Adiciona o slide ao swiperWrapper

            // Chamar a animação para o slide
            this.animarSlide(slideElement);

        });
    
        if (this.swiperInstance) {
            setTimeout(() => {
                this.swiperInstance.update(); // Atualiza o Swiper para refletir as mudanças
                if (ocultarPrimeiroBullet) {
                    this.swiperInstance.applyDisplayNoneToFirstBullet();
                } else {
                    const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
                    if (firstPaginationBullet) {
                        firstPaginationBullet.style.display = ''; // Ou 'flex', dependendo do seu layout
                    }
                }
            }, 50); // Ajuste o tempo conforme necessário
        } else {
            console.error("Swiper instance is not defined in CarregaProjetos.");
        }
    }

    animarSlide(slideElement) {
        const blackCurtain = slideElement.querySelector('.black-curtain');
        const bgImage = slideElement.querySelector('.slide-background-img');
        const content = slideElement.querySelector('.slide-content');
        const textSpans = content.querySelectorAll('span');
        const titleAndArrow = content.querySelector('.slide__title__link');
    
        // Animação da Cortina Preta
        gsap.to(blackCurtain, {
            x: '100%',
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                blackCurtain.style.display = 'none';
            }
        });
    
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
    
  

    // Dentro de CarregaProjetos
    setSwiperInstance(swiperInstance) {
        this.swiperInstance = swiperInstance;
    }
}







// export default class CarregaProjetos {
//     constructor(jsonURL, swiperInstance) {
//         this.jsonURL = jsonURL;
//         this.swiperInstance = swiperInstance;
//         this.todosProjetos = [];
//         this.projetosFiltrados = [];
//     }

//     async carregarProjetos(categoriaInicial = 'selecionado') {
//         try {
//             const response = await fetch(this.jsonURL);
//             const projetos = await response.json();
//             this.todosProjetos = projetos;
//             this.filtrarEExibirProjetos(categoriaInicial, categoriaInicial === 'selecionado');

//         } catch (error) {
//             console.error("Erro ao carregar projetos:", error);
//         }
//     }

//     filtrarEExibirProjetos(categoria, ocultarPrimeiroBullet = false) {
//         this.projetosFiltrados = this.todosProjetos.filter(projeto =>
//             categoria === 'all' ? true : (categoria === 'selecionado' ? projeto.selecionado : projeto.categoria === categoria)
//         );
//         this.exibirProjetos(ocultarPrimeiroBullet);
//         if (window.innerWidth > 768) {
//             this.construirMenuLateral(this.projetosFiltrados);
//         }
//     }


//     exibirProjetos(ocultarPrimeiroBullet) {
//         const swiperWrapper = document.querySelector('.swiper-wrapper');
//         swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])').forEach(slide => slide.remove());

//         this.projetosFiltrados.forEach(projeto => {
//             const slide = this.criarSlide(projeto);
//             swiperWrapper.appendChild(slide);
//             this.animarSlide(slide);
//         });

//         setTimeout(() => {
//             this.swiperInstance.update();
//             // window.lazyLoaderInstance.update();
//             this.gerenciarPrimeiroBullet(ocultarPrimeiroBullet);
//         }, 50);
//     }

//     criarSlide(projeto) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
//         slideElement.setAttribute('data-hash', projeto.datahash);

//         // Cria o elemento img para a imagem de fundo com lazy loading
//         const backgroundImage = document.createElement('img');
//         backgroundImage.className = 'slide-background-img';
//         backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagemhome}.webp`;
//         backgroundImage.srcset = `
//             ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
//             ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
//             ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
//         `;
//         backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";
//         backgroundImage.alt = `Projeto ${projeto.title}`;
//         backgroundImage.loading = "lazy";
    
//         // Cortina Preta para animação
//         const blackCurtain = document.createElement('div');
//         blackCurtain.style.position = 'absolute';
//         blackCurtain.style.left = 0;
//         blackCurtain.style.top = 0;
//         blackCurtain.style.width = '100%';
//         blackCurtain.style.height = '100%';
//         blackCurtain.style.backgroundColor = 'black';
//         blackCurtain.style.transform = 'translateX(-100%)';
    
//         // Conteúdo do Slide
//         const slideContent = document.createElement('div');
//         slideContent.className = 'slide-content';
//         slideContent.innerHTML = `
//             <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
//                 <span class="subtitle__part2">${projeto.subtitulo1}</span>
//                 <span class="subtitle__part3">${projeto.subtitulo2}</span>
//                 <div class="slide__title__link subtitle__part1">
//                 <h2 class="slide__title">${projeto.title}</h2>
//                 <img src="./img/logo-r.svg" class="slide__title__arrow" alt="Seta apontando para a direita">
//             </div>
//             </a>`;
    
//         // Montagem do slide
//         slideElement.appendChild(backgroundImage);
//         slideElement.appendChild(blackCurtain);
//         slideElement.appendChild(slideContent);
    
//         return slideElement;
//     }

//     animarSlide(slideElement) {
//         const blackCurtain = slideElement.querySelector('div');
//         const bgImage = slideElement.querySelector('.slide-background-img');
//         const content = slideElement.querySelector('.slide-content');
//         const textSpans = content.querySelectorAll('span'); // Selecione as tags <span>
//         const titleAndArrow = content.querySelector('.slide__title__link'); // Seleciona tanto o h2 quanto a img juntos   
//         // Animação da Cortina Preta
//         gsap.to(blackCurtain, {x: '100%', duration: 1, ease: 'power2.inOut', onComplete: () => {
//             // Remoção da cortina após a animação
//             blackCurtain.style.display = 'none';
//         }});
    
//         // Animações de Zoom para a Imagem e Fade In para o Texto
//         gsap.fromTo(bgImage, {
//             scale: 1.1,
//             autoAlpha: 0
//         }, {
//             scale: 1,
//             autoAlpha: 1,
//             duration: 1.5,
//             ease: 'power2.out',
//             delay: 0.5  // Inicia após a cortina começar a se mover
//         });
//         // Animação para o título e a seta (imagem)
//         gsap.fromTo(titleAndArrow, {
//             y: 30,
//             autoAlpha: 0
//         }, {
//             y: 0,
//             autoAlpha: 1,
//             duration: 1,
//             delay: 1.2, // Delay para começar a animação depois da imagem de fundo
//             ease: 'power2.out'
//         });

//         // Animação sequencial para cada <span>
//         textSpans.forEach((span, index) => {
//             gsap.fromTo(span, {
//                 y: 30,
//                 autoAlpha: 0
//             }, {
//                 y: 0,
//                 autoAlpha: 1,
//                 duration: 1,
//                 delay: 1.4 + index * 0.2, // Incrementa o delay para cada <span>
//                 ease: 'power2.out'
//             });
//         });
//     }

//     // iniciarCortinaEAtualizarSlides(categoria, ocultarPrimeiroBullet, callback) {
//     //     const swiperWrapper = document.querySelector('.swiper-wrapper');
//     //     const blackCurtain = document.createElement('div');
//     //     blackCurtain.style.position = 'absolute';
//     //     blackCurtain.style.left = 0;
//     //     blackCurtain.style.top = 0;
//     //     blackCurtain.style.width = '100%';
//     //     blackCurtain.style.height = '100%';
//     //     blackCurtain.style.backgroundColor = 'black';
//     //     blackCurtain.style.zIndex = 9999;
//     //     blackCurtain.style.transform = 'translateX(100%)';  // Inicia fora da tela, à direita
//     //     swiperWrapper.appendChild(blackCurtain);
    
//     //     // Animação de entrada (da direita para a esquerda)
//     //     gsap.to(blackCurtain, {
//     //         x: '0%',
//     //         duration: 1,
//     //         ease: 'power2.inOut',
//     //         onComplete: () => {
//     //             this.filtrarEExibirProjetos(categoria, ocultarPrimeiroBullet);
//     //             // Animação de saída (da esquerda para a direita)
//     //             gsap.to(blackCurtain, {
//     //                 x: '100%',  // Muda aqui para ir para a direita
//     //                 duration: 1,
//     //                 ease: 'power2.inOut',
//     //                 onComplete: () => {
//     //                     blackCurtain.remove(); // Remove a cortina após a animação
//     //                     if (callback) callback(); // Chama o callback após a animação e atualização dos slides
//     //                 }
//     //             });
//     //         }
//     //     });
//     // }

    


//     gerenciarPrimeiroBullet(ocultar) {
//         const firstBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
//         if (firstBullet) firstBullet.style.display = ocultar ? 'none' : '';
//     }

//     construirMenuLateral(projetosFiltrados) {
//         const menuLateral = document.querySelector('.project-menu-hover');
//         if (!menuLateral) {
//             console.error("Elemento do menu lateral não encontrado.");
//             return;
//         }

//         menuLateral.innerHTML = '';
//         projetosFiltrados.forEach(projeto => {
//             const li = document.createElement('li');
//             const a = document.createElement('a');
//             a.className = 'project-menu-item swiper-nav-link';
//             a.href = `#` + projeto.datahash;
//             a.dataset.filter = projeto.categoria;
//             a.innerText = projeto.title;
//             li.appendChild(a);
//             menuLateral.appendChild(li);
//         });
//     }
// }

