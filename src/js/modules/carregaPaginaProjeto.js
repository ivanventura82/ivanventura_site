import gsap from 'gsap';

// export default class CarregaPaginaProjeto {
//     constructor(jsonURL, mySwiperInstance) {
//         this.jsonURL = jsonURL;
//         this.mySwiper = mySwiperInstance;
//         console.log("Inicializando CarregaPaginaProjeto com Swiper instance:", mySwiperInstance);

//         this.adicionarEventosDeToque();
//     }

//     adicionarEventosDeToque() {
//         const swiperContainer = document.querySelector('.swiper-container');

//         swiperContainer.addEventListener('touchstart', function(e) {
//             console.log('Touchstart:', e);
//         });
//         swiperContainer.addEventListener('touchmove', function(e) {
//             console.log('Touchmove:', e);
//         });
//         swiperContainer.addEventListener('touchend', () => {
//             console.log('Touchend');
//             setTimeout(() => {
//                 this.mySwiper.update();
//                 this.mySwiper.pagination.update();
//                 console.log('Swiper e paginação atualizados após toque');
//             }, 100); // Adiciona um pequeno atraso para garantir que o Swiper processe o toque
//         });
//     }

//     async carregarConteudo(datahash) {
//         try {
//             console.log("Iniciando carregarConteudo com datahash:", datahash);
//             const response = await fetch(this.jsonURL);
//             const data = await response.json();
//             console.log("Dados recebidos:", data);
//             const projeto = data.find(proj => proj.datahash === datahash);
//             if (projeto) {
//                 console.log("Projeto encontrado:", projeto);
//                 await this.processarProjeto(projeto);
//                 console.log("Preparando para atualizar Swiper");
//                 this.mySwiper.update(); // Atualiza o Swiper após todos os slides serem adicionados
//                 console.log("Swiper atualizado");
//                 this.mySwiper.pagination.update(); // Atualiza a paginação manualmente
//                 console.log("Paginação atualizada");
//             } else {
//                 console.error("Projeto com datahash " + datahash + " não encontrado.");
//             }
//         } catch (error) {
//             console.error("Erro ao carregar o conteúdo do projeto:", error);
//         }
//     }

//     async processarProjeto(projeto) {
//         this.limparSlidesExistentes();
//         const swiperWrapper = document.querySelector('.swiper-wrapper');

//         // Define a categoria do projeto no corpo da página para uso futuro
//         document.body.dataset.categoria = projeto.categoria; // Assume que a categoria do projeto está disponível em 'projeto.category'

//         const slidePrincipal = this.criarSlidePrincipal(projeto);
//         swiperWrapper.appendChild(slidePrincipal);

//         // Assumindo que a animação ocorre após todos os elementos serem carregados
//         requestAnimationFrame(() => this.animarSlide(slidePrincipal));

//         const slideBio = this.criarSlideBio(projeto);
//         swiperWrapper.appendChild(slideBio);

//         projeto.slides.forEach(slide => {
//             swiperWrapper.appendChild(this.criarSlideSecundario(projeto, slide));
//         });

//         this.criarSlideDetalhes(projeto);
//         this.criarBotaoVoltar();
//         this.atualizarMetaTags(projeto);

//         // Chama o método para marcar o link como ativo após carregar o projeto
//         this.mySwiper.markActiveLink(projeto.categoria);
//     }

    

//     atualizarMetaTags(projeto) {
//         if (projeto) {
//             // Atualiza o título da página usando a propriedade 'title' do projeto
//             document.title = `${projeto.title} - Arquitetura Ivan Ventura`;
    
//             // Localiza a tag meta 'description' e atualiza seu conteúdo com a propriedade 'description' do projeto
//             const metaDescription = document.querySelector('meta[name="description"]');
//             if (metaDescription) {
//                 // Verifica se a descrição do projeto é maior que 144 caracteres e, se sim, corta-a
//                 const truncatedDescription = projeto.description.length > 144
//                     ? projeto.description.substring(0, 141) + '...'  // Adiciona reticências para indicar que o texto foi cortado
//                     : projeto.description;
//                 metaDescription.setAttribute('content', truncatedDescription);
//             } else {
//                 console.error("Elemento meta description não encontrado no DOM.");
//             }
//         } else {
//             console.error("Nenhum projeto fornecido para atualizar as meta tags.");
//         }
//     }
    
//     limparSlidesExistentes() {
//         const swiperWrapper = document.querySelector('.swiper-wrapper');
//         swiperWrapper.innerHTML = '';
//     }

//     criarSlidePrincipal(projeto) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide com-imagem-de-fundo';
//         slideElement.style.backgroundColor = '#000000';
    
//         const blackCurtain = document.createElement('div');
//         blackCurtain.className = 'black-curtain';
//         blackCurtain.style.position = 'absolute';
//         blackCurtain.style.left = 0;
//         blackCurtain.style.top = 0;
//         blackCurtain.style.width = '100%';
//         blackCurtain.style.height = '100%';
//         blackCurtain.style.backgroundColor = '#1c1c1c';
//         blackCurtain.style.transform = 'translateX(-100%)';
//         slideElement.appendChild(blackCurtain);
    
//         const backgroundImage = this.criarElementoImagem(projeto);
//         slideElement.appendChild(backgroundImage);
//         slideElement.appendChild(this.criarConteudoSlide(projeto.title));
    
//         return slideElement;
//     }
    
//     animarSlide(slideElement) {
//         // Primeiro, vamos confirmar que o slideElement foi passado
//         if (!slideElement) {
//             console.error("slideElement está indefinido.");
//             return;
//         }
    
//         // Tentar encontrar a cortina preta dentro do slideElement
//         const blackCurtain = slideElement.querySelector('.black-curtain'); // Certifique-se de que essa classe existe
//         if (!blackCurtain) {
//             console.error("blackCurtain não encontrado.");
//             return;
//         }
    
//         // Tentar encontrar a imagem de fundo
//         const backgroundImage = slideElement.querySelector('.slide-background-img');
//         if (!backgroundImage) {
//             console.error("backgroundImage não encontrado.");
//             return;
//         }
    
//         // E o título principal
//         const mainTitle = slideElement.querySelector('.main__title');
//         if (!mainTitle) {
//             console.error("mainTitle não encontrado.");
//             return;
//         }
    
//         // Se tudo estiver correto, proceder com a animação
//         gsap.to(blackCurtain, {
//             x: '100%',
//             duration: 1,
//             ease: 'power2.inOut',
//             onComplete: () => blackCurtain.remove()
//         });
    
//         gsap.fromTo(backgroundImage, {
//             scale: 1.1,
//             autoAlpha: 0
//         }, {
//             scale: 1,
//             autoAlpha: 1,
//             duration: 1.5,
//             ease: 'power2.out',
//             delay: 0.5
//         });
    
//         gsap.fromTo(mainTitle, {
//             y: 30,
//             autoAlpha: 0
//         }, {
//             y: 0,
//             autoAlpha: 1,
//             duration: 1,
//             delay: 1,
//             ease: 'power2.out'
//         });
//     }
    
//     criarElementoImagem(projeto) {
//         const backgroundImage = document.createElement('img');
//         backgroundImage.className = 'slide-background-img';
//         backgroundImage.alt = `Capa do projeto ${projeto.title}`;
//         backgroundImage.loading = "lazy";
//         backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagem1}.webp`;
//         backgroundImage.srcset = `
//             ./img/${projeto.datahash}/${projeto.imagem1}-720w.webp 720w,
//             ./img/${projeto.datahash}/${projeto.imagem1}-1024w.webp 1024w,
//             ./img/${projeto.datahash}/${projeto.imagem1}-1920w.webp 1920w
//         `;
//         backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";

//         return backgroundImage;
//     }

//     criarConteudoSlide(title) {
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';

//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project';

//         const mainTitle = document.createElement('h1');
//         mainTitle.className = 'main__title';
//         mainTitle.innerHTML = `<span class="subtitle__part1 project__name">${title}</span>`;

//         slideContentProject.appendChild(mainTitle);
//         slideContentPosition.appendChild(slideContentProject);

//         return slideContentPosition;
//     }

//     criarSlideBio(projeto) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide';
//         slideElement.style.backgroundColor = '#f8f8f8';
    
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';
    
//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project';
    
//         const bioProject = document.createElement('div');
//         bioProject.className = 'bio__project';
//         const ul = document.createElement('ul');
    
//         const propriedadesBio = ["área", "local", "co-autor", "ano", "estado"];
//         propriedadesBio.forEach(propriedade => {
//             let valor = projeto[propriedade];
//             if (valor && valor.toString().trim() !== "" && valor !== "-") {
//                 const li = document.createElement('li');
//                 if (propriedade === "área") {
//                     li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor} m²</strong>`;
//                 } else {
//                     li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor}</strong>`;
//                 }
//                 ul.appendChild(li);
//             }
//         });
    
//         const descricao = document.createElement('p');
//         descricao.textContent = projeto.description || 'Descrição não disponível';
//         descricao.style.display = 'block';
    
//         const expandBtn = document.createElement('span');
//         expandBtn.textContent = '... mais';
//         expandBtn.className = 'expand-btn';
    
//         const collapseBtn = document.createElement('button');
//         collapseBtn.textContent = 'Voltar';
//         collapseBtn.className = 'collapse-btn';
//         collapseBtn.style.display = 'none';
    
//         bioProject.appendChild(ul);
//         bioProject.appendChild(descricao);
//         bioProject.appendChild(expandBtn);
//         bioProject.appendChild(collapseBtn);
    
//         slideContentProject.appendChild(bioProject);
//         slideContentPosition.appendChild(slideContentProject);
//         slideElement.appendChild(slideContentPosition);
    
//         requestAnimationFrame(() => {
//             const lineHeight = parseFloat(getComputedStyle(descricao).lineHeight);
//             const boxHeight = descricao.clientHeight;
//             const lineCount = boxHeight / lineHeight;
    
//             if (lineCount > 10) {
//                 descricao.textContent = projeto.description.substring(0, 380) + '...';
//                 expandBtn.style.display = 'inline';
    
//                 expandBtn.addEventListener('click', function() {
//                     descricao.textContent = projeto.description;
//                     ul.style.display = 'none';
//                     expandBtn.style.display = 'none';
//                     collapseBtn.style.display = 'inline';
//                     bioProject.classList.add('expanded');
//                 });
    
//                 collapseBtn.addEventListener('click', function() {
//                     descricao.textContent = projeto.description.substring(0, 380) + '...';
//                     ul.style.display = 'block';
//                     expandBtn.style.display = 'inline';
//                     collapseBtn.style.display = 'none';
//                     bioProject.classList.remove('expanded');
//                 });
//             } else {
//                 expandBtn.style.display = 'none';
//                 collapseBtn.style.display = 'none';
//             }
//         });
    
//         return slideElement;
//     }
    
//     criarSlideSecundario(projeto, slide) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide';
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';
    
//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project-photo';
        
//         // Verifica se o slide contém uma ou duas imagens
//         if (slide.length === 2) {
//             // Layout de duas imagens
//             const gridDiv = document.createElement('div');
//             gridDiv.className = 'photos__grid__2';
//             slide.forEach(imgName => {
//                 gridDiv.appendChild(this.criarImagem(projeto.datahash, imgName));
//             });
//             slideContentProject.appendChild(gridDiv);
//         } else if (slide.length === 1) {
//             // Layout de uma imagem
//             const gridDiv = document.createElement('div');
//             gridDiv.className = 'photos__grid';
//             gridDiv.appendChild(this.criarImagem(projeto.datahash, slide[0]));
//             slideContentProject.appendChild(gridDiv);
//         }
    
//         slideContentPosition.appendChild(slideContentProject);
//         slideElement.appendChild(slideContentPosition);
//         return slideElement;
//     }
    
//     criarImagem(datahash, imgName) {
//         const basePath = `./img/${datahash}/${imgName}`;
//         const image = document.createElement('img');
//         image.className = 'lazy';
//         image.src = `${basePath}.webp`;
//         image.srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
//         image.sizes = "100vw";
//         image.alt = `${imgName}`;
//         return image;
//     }
    
//     criarSlideDetalhes(projeto) {
//         const swiperWrapper = document.querySelector('.swiper-wrapper');

//         // Cria o slide de detalhes se existirem detalhes a serem exibidos
//         if (projeto.detalhes && projeto.detalhes.length > 0) {
//             const slideDetalhes = document.createElement('div');
//             slideDetalhes.className = 'swiper-slide';
//             slideDetalhes.style.backgroundColor = '#f8f8f8';
//             slideDetalhes.setAttribute('data-hash', 'ficha-tecnica'); 


//             const slideContentPosition = document.createElement('div');
//             slideContentPosition.className = 'slide-content-position';

//             const slideContentProject = document.createElement('div');
//             slideContentProject.className = 'slide-content-project';

//             const detalhesProject = document.createElement('div');
//             detalhesProject.className = 'detalhes__project';
//             const ul = document.createElement('ul');

//             // Adiciona cada detalhe como um item da lista
//             projeto.detalhes.forEach(detalhe => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `${detalhe.titulo}: <strong>${detalhe.valor}</strong>`;
//                 ul.appendChild(li);
//             });

//             detalhesProject.appendChild(ul);
//             slideContentProject.appendChild(detalhesProject);
//             slideContentPosition.appendChild(slideContentProject);
//             slideDetalhes.appendChild(slideContentPosition);
//             swiperWrapper.appendChild(slideDetalhes);
//         }

//         // Certifique-se de atualizar o swiper depois de adicionar o slide de detalhes
//         this.mySwiper.update();
//     }

//     criarBotaoVoltar() {
//         const botaoVoltar = document.getElementById('botao-voltar');
//         if (botaoVoltar) {
//             botaoVoltar.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 window.history.back();
//             });
//         }
//     }
// }

export default class CarregaPaginaProjeto {
    constructor(jsonURL, mySwiperInstance) {
        this.jsonURL = jsonURL;
        this.mySwiper = mySwiperInstance;
    }

    async carregarConteudo(datahash) {
    try {
        const response = await fetch(this.jsonURL);
        const data = await response.json();
        const projeto = data.find(proj => proj.datahash === datahash);
        if (projeto) {
            await this.processarProjeto(projeto);
            this.mySwiper.update(); // Atualiza o Swiper após todos os slides serem adicionados

        } else {
            console.error("Projeto com datahash " + datahash + " não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao carregar o conteúdo do projeto:", error);
    }
}


    async processarProjeto(projeto) {
        this.limparSlidesExistentes();
        const swiperWrapper = document.querySelector('.swiper-wrapper');
    
        // Define a categoria do projeto no corpo da página para uso futuro
        document.body.dataset.categoria = projeto.categoria;  // Assume que a categoria do projeto está disponível em 'projeto.category'
    
        const slidePrincipal = this.criarSlidePrincipal(projeto);
        swiperWrapper.appendChild(slidePrincipal);
    
        // Assumindo que a animação ocorre após todos os elementos serem carregados
        requestAnimationFrame(() => this.animarSlide(slidePrincipal));
    
        const slideBio = this.criarSlideBio(projeto);
        swiperWrapper.appendChild(slideBio);
    
        projeto.slides.forEach(slide => {
            swiperWrapper.appendChild(this.criarSlideSecundario(projeto, slide));
        });
    
        this.criarSlideDetalhes(projeto);
        this.criarBotaoVoltar();
        this.atualizarMetaTags(projeto);
    
        // Chama o método para marcar o link como ativo após carregar o projeto
        this.mySwiper.markActiveLink(projeto.categoria);
    }
    

    atualizarMetaTags(projeto) {
        if (projeto) {
            // Atualiza o título da página usando a propriedade 'title' do projeto
            document.title = `${projeto.title} - Arquitetura Ivan Ventura`;
    
            // Localiza a tag meta 'description' e atualiza seu conteúdo com a propriedade 'description' do projeto
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                // Verifica se a descrição do projeto é maior que 144 caracteres e, se sim, corta-a
                const truncatedDescription = projeto.description.length > 144
                    ? projeto.description.substring(0, 141) + '...'  // Adiciona reticências para indicar que o texto foi cortado
                    : projeto.description;
                metaDescription.setAttribute('content', truncatedDescription);
            } else {
                console.error("Elemento meta description não encontrado no DOM.");
            }
        } else {
            console.error("Nenhum projeto fornecido para atualizar as meta tags.");
        }
    }
    
    limparSlidesExistentes() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = '';
    }

    criarSlidePrincipal(projeto) {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide com-imagem-de-fundo';
        slideElement.style.backgroundColor = '#000000';
    
        const blackCurtain = document.createElement('div');
        blackCurtain.className = 'black-curtain';
        blackCurtain.style.position = 'absolute';
        blackCurtain.style.left = 0;
        blackCurtain.style.top = 0;
        blackCurtain.style.width = '100%';
        blackCurtain.style.height = '100%';
        blackCurtain.style.backgroundColor = '#1c1c1c';
        blackCurtain.style.transform = 'translateX(-100%)';
        slideElement.appendChild(blackCurtain);
    
        const backgroundImage = this.criarElementoImagem(projeto);
        slideElement.appendChild(backgroundImage);
        slideElement.appendChild(this.criarConteudoSlide(projeto.title));
    
        return slideElement;
    }
    
    animarSlide(slideElement) {
        // Primeiro, vamos confirmar que o slideElement foi passado
        if (!slideElement) {
            console.error("slideElement está indefinido.");
            return;
        }
    
        // Tentar encontrar a cortina preta dentro do slideElement
        const blackCurtain = slideElement.querySelector('.black-curtain'); // Certifique-se de que essa classe existe
        if (!blackCurtain) {
            console.error("blackCurtain não encontrado.");
            return;
        }
    
        // Tentar encontrar a imagem de fundo
        const backgroundImage = slideElement.querySelector('.slide-background-img');
        if (!backgroundImage) {
            console.error("backgroundImage não encontrado.");
            return;
        }
    
        // E o título principal
        const mainTitle = slideElement.querySelector('.main__title');
        if (!mainTitle) {
            console.error("mainTitle não encontrado.");
            return;
        }
    
        // Se tudo estiver correto, proceder com a animação
        gsap.to(blackCurtain, {
            x: '100%',
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => blackCurtain.remove()
        });
    
        gsap.fromTo(backgroundImage, {
            scale: 1.1,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.5
        });
    
        gsap.fromTo(mainTitle, {
            y: 30,
            autoAlpha: 0
        }, {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            delay: 1,
            ease: 'power2.out'
        });
    }
    
    criarElementoImagem(projeto) {
        const backgroundImage = document.createElement('img');
        backgroundImage.className = 'slide-background-img';
        backgroundImage.alt = `Capa do projeto ${projeto.title}`;
        backgroundImage.loading = "lazy";
        backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagem1}.webp`;
        backgroundImage.srcset = `
            ./img/${projeto.datahash}/${projeto.imagem1}-720w.webp 720w,
            ./img/${projeto.datahash}/${projeto.imagem1}-1024w.webp 1024w,
            ./img/${projeto.datahash}/${projeto.imagem1}-1920w.webp 1920w
        `;
        backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";

        return backgroundImage;
    }

    criarConteudoSlide(title) {
        const slideContentPosition = document.createElement('div');
        slideContentPosition.className = 'slide-content-position';

        const slideContentProject = document.createElement('div');
        slideContentProject.className = 'slide-content-project';

        const mainTitle = document.createElement('h1');
        mainTitle.className = 'main__title';
        mainTitle.innerHTML = `<span class="subtitle__part1 project__name">${title}</span>`;

        slideContentProject.appendChild(mainTitle);
        slideContentPosition.appendChild(slideContentProject);

        return slideContentPosition;
    }

    criarSlideBio(projeto) {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide';
        slideElement.style.backgroundColor = '#f8f8f8';
    
        const slideContentPosition = document.createElement('div');
        slideContentPosition.className = 'slide-content-position';
    
        const slideContentProject = document.createElement('div');
        slideContentProject.className = 'slide-content-project';
    
        const bioProject = document.createElement('div');
        bioProject.className = 'bio__project';
        const ul = document.createElement('ul');
    
        const propriedadesBio = ["área", "local", "co-autor", "ano", "estado"];
        propriedadesBio.forEach(propriedade => {
            let valor = projeto[propriedade];
            if (valor && valor.toString().trim() !== "" && valor !== "-") {
                const li = document.createElement('li');
                if (propriedade === "área") {
                    li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor} m²</strong>`;
                } else {
                    li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor}</strong>`;
                }
                ul.appendChild(li);
            }
        });
    
        const descricao = document.createElement('p');
        descricao.textContent = projeto.description || 'Descrição não disponível';
        descricao.style.display = 'block';
    
        const expandBtn = document.createElement('span');
        expandBtn.textContent = '... mais';
        expandBtn.className = 'expand-btn';
    
        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = 'Voltar';
        collapseBtn.className = 'collapse-btn';
        collapseBtn.style.display = 'none';
    
        bioProject.appendChild(ul);
        bioProject.appendChild(descricao);
        bioProject.appendChild(expandBtn);
        bioProject.appendChild(collapseBtn);
    
        slideContentProject.appendChild(bioProject);
        slideContentPosition.appendChild(slideContentProject);
        slideElement.appendChild(slideContentPosition);
    
        requestAnimationFrame(() => {
            const lineHeight = parseFloat(getComputedStyle(descricao).lineHeight);
            const boxHeight = descricao.clientHeight;
            const lineCount = boxHeight / lineHeight;
    
            if (lineCount > 10) {
                descricao.textContent = projeto.description.substring(0, 380) + '...';
                expandBtn.style.display = 'inline';
    
                expandBtn.addEventListener('click', function() {
                    descricao.textContent = projeto.description;
                    ul.style.display = 'none';
                    expandBtn.style.display = 'none';
                    collapseBtn.style.display = 'inline';
                    bioProject.classList.add('expanded');
                });
    
                collapseBtn.addEventListener('click', function() {
                    descricao.textContent = projeto.description.substring(0, 380) + '...';
                    ul.style.display = 'block';
                    expandBtn.style.display = 'inline';
                    collapseBtn.style.display = 'none';
                    bioProject.classList.remove('expanded');
                });
            } else {
                expandBtn.style.display = 'none';
                collapseBtn.style.display = 'none';
            }
        });
        
        return slideElement;
    }

    criarBotaoVoltar() {
        const botaoVoltar = document.getElementById('botao-voltar');
        if (botaoVoltar) {
            botaoVoltar.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.back();
            });
        }
    }
    
    criarSlideSecundario(projeto, slide) {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide';
        const slideContentPosition = document.createElement('div');
        slideContentPosition.className = 'slide-content-position';
    
        const slideContentProject = document.createElement('div');
        slideContentProject.className = 'slide-content-project-photo';
        
        // Verifica se o slide contém uma ou duas imagens
        if (slide.length === 2) {
            // Layout de duas imagens
            const gridDiv = document.createElement('div');
            gridDiv.className = 'photos__grid__2';
            slide.forEach(imgName => {
                gridDiv.appendChild(this.criarImagem(projeto.datahash, imgName));
            });
            slideContentProject.appendChild(gridDiv);
        } else if (slide.length === 1) {
            // Layout de uma imagem
            const gridDiv = document.createElement('div');
            gridDiv.className = 'photos__grid';
            gridDiv.appendChild(this.criarImagem(projeto.datahash, slide[0]));
            slideContentProject.appendChild(gridDiv);
        }
    
        slideContentPosition.appendChild(slideContentProject);
        slideElement.appendChild(slideContentPosition);
        return slideElement;
    }
    
    criarImagem(datahash, imgName) {
        const basePath = `./img/${datahash}/${imgName}`;
        const image = document.createElement('img');
        image.className = 'lazy';
        image.src = `${basePath}.webp`;
        image.srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
        image.sizes = "100vw";
        image.alt = `${imgName}`;
        return image;
    }
    
    criarSlideDetalhes(projeto) {
        const swiperWrapper = document.querySelector('.swiper-wrapper');

        // Cria o slide de detalhes se existirem detalhes a serem exibidos
        if (projeto.detalhes && projeto.detalhes.length > 0) {
            const slideDetalhes = document.createElement('div');
            slideDetalhes.className = 'swiper-slide';
            slideDetalhes.style.backgroundColor = '#f8f8f8';
            slideDetalhes.setAttribute('data-hash', 'ficha-tecnica'); 


            const slideContentPosition = document.createElement('div');
            slideContentPosition.className = 'slide-content-position';

            const slideContentProject = document.createElement('div');
            slideContentProject.className = 'slide-content-project';

            const detalhesProject = document.createElement('div');
            detalhesProject.className = 'detalhes__project';
            const ul = document.createElement('ul');

            // Adiciona cada detalhe como um item da lista
            projeto.detalhes.forEach(detalhe => {
                const li = document.createElement('li');
                li.innerHTML = `${detalhe.titulo}: <strong>${detalhe.valor}</strong>`;
                ul.appendChild(li);
            });

            detalhesProject.appendChild(ul);
            slideContentProject.appendChild(detalhesProject);
            slideContentPosition.appendChild(slideContentProject);
            slideDetalhes.appendChild(slideContentPosition);
            swiperWrapper.appendChild(slideDetalhes);
        }
        this.mySwiper.update();
    }
}

// export default class CarregaPaginaProjeto {
//     constructor(jsonURL, mySwiperInstance) {
//         this.jsonURL = jsonURL;
//         this.mySwiper = mySwiperInstance;
//     }

//     carregarConteudo(datahash) {
//         fetch(this.jsonURL)
//             .then(response => response.json())
//             .then(data => {
//                 const projeto = data.find(proj => proj.datahash === datahash);
//                 if (projeto) {
//                     this.processarProjeto(projeto)
//                         .then(() => this.mySwiper.update()) // Atualiza o Swiper após todos os slides serem adicionados
//                         .catch(error => console.error("Erro ao processar o projeto:", error));
//                 } else {
//                     console.error("Projeto com datahash " + datahash + " não encontrado.");
//                 }
//             })
//             .catch(error => console.error("Erro ao carregar o conteúdo do projeto:", error));
//     }

//     processarProjeto(projeto) {
//         return new Promise((resolve, reject) => {
//             try {
//                 this.limparSlidesExistentes();
//                 const swiperWrapper = document.querySelector('.swiper-wrapper');

//                 // Define a categoria do projeto no corpo da página para uso futuro
//                 document.body.dataset.categoria = projeto.categoria;

//                 const slidePrincipal = this.criarSlidePrincipal(projeto);
//                 swiperWrapper.appendChild(slidePrincipal);

//                 // Assumindo que a animação ocorre após todos os elementos serem carregados
//                 requestAnimationFrame(() => this.animarSlide(slidePrincipal));

//                 const slideBio = this.criarSlideBio(projeto);
//                 swiperWrapper.appendChild(slideBio);

//                 projeto.slides.forEach(slide => {
//                     swiperWrapper.appendChild(this.criarSlideSecundario(projeto, slide));
//                 });

//                 this.criarSlideDetalhes(projeto);
//                 this.criarBotaoVoltar();
//                 this.atualizarMetaTags(projeto);

//                 // Chama o método para marcar o link como ativo após carregar o projeto
//                 this.mySwiper.markActiveLink(projeto.categoria);

//                 resolve();
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     }

    

//     atualizarMetaTags(projeto) {
//         if (projeto) {
//             // Atualiza o título da página usando a propriedade 'title' do projeto
//             document.title = `${projeto.title} - Arquitetura Ivan Ventura`;
    
//             // Localiza a tag meta 'description' e atualiza seu conteúdo com a propriedade 'description' do projeto
//             const metaDescription = document.querySelector('meta[name="description"]');
//             if (metaDescription) {
//                 // Verifica se a descrição do projeto é maior que 144 caracteres e, se sim, corta-a
//                 const truncatedDescription = projeto.description.length > 144
//                     ? projeto.description.substring(0, 141) + '...'  // Adiciona reticências para indicar que o texto foi cortado
//                     : projeto.description;
//                 metaDescription.setAttribute('content', truncatedDescription);
//             } else {
//                 console.error("Elemento meta description não encontrado no DOM.");
//             }
//         } else {
//             console.error("Nenhum projeto fornecido para atualizar as meta tags.");
//         }
//     }
    
//     limparSlidesExistentes() {
//         const swiperWrapper = document.querySelector('.swiper-wrapper');
//         swiperWrapper.innerHTML = '';
//     }

//     criarSlidePrincipal(projeto) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide com-imagem-de-fundo';
//         slideElement.style.backgroundColor = '#000000';
    
//         const blackCurtain = document.createElement('div');
//         blackCurtain.className = 'black-curtain';
//         blackCurtain.style.position = 'absolute';
//         blackCurtain.style.left = 0;
//         blackCurtain.style.top = 0;
//         blackCurtain.style.width = '100%';
//         blackCurtain.style.height = '100%';
//         blackCurtain.style.backgroundColor = '#1c1c1c';
//         blackCurtain.style.transform = 'translateX(-100%)';
//         slideElement.appendChild(blackCurtain);
    
//         const backgroundImage = this.criarElementoImagem(projeto);
//         slideElement.appendChild(backgroundImage);
//         slideElement.appendChild(this.criarConteudoSlide(projeto.title));
    
//         return slideElement;
//     }
    
//     animarSlide(slideElement) {
//         // Primeiro, vamos confirmar que o slideElement foi passado
//         if (!slideElement) {
//             console.error("slideElement está indefinido.");
//             return;
//         }
    
//         // Tentar encontrar a cortina preta dentro do slideElement
//         const blackCurtain = slideElement.querySelector('.black-curtain'); // Certifique-se de que essa classe existe
//         if (!blackCurtain) {
//             console.error("blackCurtain não encontrado.");
//             return;
//         }
    
//         // Tentar encontrar a imagem de fundo
//         const backgroundImage = slideElement.querySelector('.slide-background-img');
//         if (!backgroundImage) {
//             console.error("backgroundImage não encontrado.");
//             return;
//         }
    
//         // E o título principal
//         const mainTitle = slideElement.querySelector('.main__title');
//         if (!mainTitle) {
//             console.error("mainTitle não encontrado.");
//             return;
//         }
    
//         // Se tudo estiver correto, proceder com a animação
//         gsap.to(blackCurtain, {
//             x: '100%',
//             duration: 1,
//             ease: 'power2.inOut',
//             onComplete: () => blackCurtain.remove()
//         });
    
//         gsap.fromTo(backgroundImage, {
//             scale: 1.1,
//             autoAlpha: 0
//         }, {
//             scale: 1,
//             autoAlpha: 1,
//             duration: 1.5,
//             ease: 'power2.out',
//             delay: 0.5
//         });
    
//         gsap.fromTo(mainTitle, {
//             y: 30,
//             autoAlpha: 0
//         }, {
//             y: 0,
//             autoAlpha: 1,
//             duration: 1,
//             delay: 1,
//             ease: 'power2.out'
//         });
//     }
    
//     criarElementoImagem(projeto) {
//         const backgroundImage = document.createElement('img');
//         backgroundImage.className = 'slide-background-img';
//         backgroundImage.alt = `Capa do projeto ${projeto.title}`;
//         backgroundImage.loading = "lazy";
//         backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagem1}.webp`;
//         backgroundImage.srcset = `
//             ./img/${projeto.datahash}/${projeto.imagem1}-720w.webp 720w,
//             ./img/${projeto.datahash}/${projeto.imagem1}-1024w.webp 1024w,
//             ./img/${projeto.datahash}/${projeto.imagem1}-1920w.webp 1920w
//         `;
//         backgroundImage.sizes = "(max-width: 720px) 100vw, (max-width: 1024px) 100vw, 100vw";

//         return backgroundImage;
//     }

//     criarConteudoSlide(title) {
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';

//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project';

//         const mainTitle = document.createElement('h1');
//         mainTitle.className = 'main__title';
//         mainTitle.innerHTML = `<span class="subtitle__part1 project__name">${title}</span>`;

//         slideContentProject.appendChild(mainTitle);
//         slideContentPosition.appendChild(slideContentProject);

//         return slideContentPosition;
//     }

//     criarSlideBio(projeto) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide';
//         slideElement.style.backgroundColor = '#f8f8f8';
    
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';
    
//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project';
    
//         const bioProject = document.createElement('div');
//         bioProject.className = 'bio__project';
//         const ul = document.createElement('ul');
    
//         const propriedadesBio = ["área", "local", "co-autor", "ano", "estado"];
//         propriedadesBio.forEach(propriedade => {
//             let valor = projeto[propriedade];
//             if (valor && valor.toString().trim() !== "" && valor !== "-") {
//                 const li = document.createElement('li');
//                 if (propriedade === "área") {
//                     li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor} m²</strong>`;
//                 } else {
//                     li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${valor}</strong>`;
//                 }
//                 ul.appendChild(li);
//             }
//         });
    
//         const descricao = document.createElement('p');
//         descricao.textContent = projeto.description || 'Descrição não disponível';
//         descricao.style.display = 'block';
    
//         const expandBtn = document.createElement('span');
//         expandBtn.textContent = '... mais';
//         expandBtn.className = 'expand-btn';
    
//         const collapseBtn = document.createElement('button');
//         collapseBtn.textContent = 'Voltar';
//         collapseBtn.className = 'collapse-btn';
//         collapseBtn.style.display = 'none';
    
//         bioProject.appendChild(ul);
//         bioProject.appendChild(descricao);
//         bioProject.appendChild(expandBtn);
//         bioProject.appendChild(collapseBtn);
    
//         slideContentProject.appendChild(bioProject);
//         slideContentPosition.appendChild(slideContentProject);
//         slideElement.appendChild(slideContentPosition);
    
//         requestAnimationFrame(() => {
//             const lineHeight = parseFloat(getComputedStyle(descricao).lineHeight);
//             const boxHeight = descricao.clientHeight;
//             const lineCount = boxHeight / lineHeight;
    
//             if (lineCount > 10) {
//                 descricao.textContent = projeto.description.substring(0, 380) + '...';
//                 expandBtn.style.display = 'inline';
    
//                 expandBtn.addEventListener('click', function() {
//                     descricao.textContent = projeto.description;
//                     ul.style.display = 'none';
//                     expandBtn.style.display = 'none';
//                     collapseBtn.style.display = 'inline';
//                     bioProject.classList.add('expanded');
//                 });
    
//                 collapseBtn.addEventListener('click', function() {
//                     descricao.textContent = projeto.description.substring(0, 380) + '...';
//                     ul.style.display = 'block';
//                     expandBtn.style.display = 'inline';
//                     collapseBtn.style.display = 'none';
//                     bioProject.classList.remove('expanded');
//                 });
//             } else {
//                 expandBtn.style.display = 'none';
//                 collapseBtn.style.display = 'none';
//             }
//         });
    
//         return slideElement;
//     }
    
//     criarSlideSecundario(projeto, slide) {
//         const slideElement = document.createElement('div');
//         slideElement.className = 'swiper-slide';
//         const slideContentPosition = document.createElement('div');
//         slideContentPosition.className = 'slide-content-position';
    
//         const slideContentProject = document.createElement('div');
//         slideContentProject.className = 'slide-content-project-photo';
        
//         // Verifica se o slide contém uma ou duas imagens
//         if (slide.length === 2) {
//             // Layout de duas imagens
//             const gridDiv = document.createElement('div');
//             gridDiv.className = 'photos__grid__2';
//             slide.forEach(imgName => {
//                 gridDiv.appendChild(this.criarImagem(projeto.datahash, imgName));
//             });
//             slideContentProject.appendChild(gridDiv);
//         } else if (slide.length === 1) {
//             // Layout de uma imagem
//             const gridDiv = document.createElement('div');
//             gridDiv.className = 'photos__grid';
//             gridDiv.appendChild(this.criarImagem(projeto.datahash, slide[0]));
//             slideContentProject.appendChild(gridDiv);
//         }
    
//         slideContentPosition.appendChild(slideContentProject);
//         slideElement.appendChild(slideContentPosition);
//         return slideElement;
//     }
    
//     criarImagem(datahash, imgName) {
//         const basePath = `./img/${datahash}/${imgName}`;
//         const image = document.createElement('img');
//         image.className = 'lazy';
//         image.src = `${basePath}.webp`;
//         image.srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
//         image.sizes = "100vw";
//         image.alt = `${imgName}`;
//         return image;
//     }
    
//     criarSlideDetalhes(projeto) {
//         const swiperWrapper = document.querySelector('.swiper-wrapper');

//         // Cria o slide de detalhes se existirem detalhes a serem exibidos
//         if (projeto.detalhes && projeto.detalhes.length > 0) {
//             const slideDetalhes = document.createElement('div');
//             slideDetalhes.className = 'swiper-slide';
//             slideDetalhes.style.backgroundColor = '#f8f8f8';
//             slideDetalhes.setAttribute('data-hash', 'ficha-tecnica'); 


//             const slideContentPosition = document.createElement('div');
//             slideContentPosition.className = 'slide-content-position';

//             const slideContentProject = document.createElement('div');
//             slideContentProject.className = 'slide-content-project';

//             const detalhesProject = document.createElement('div');
//             detalhesProject.className = 'detalhes__project';
//             const ul = document.createElement('ul');

//             // Adiciona cada detalhe como um item da lista
//             projeto.detalhes.forEach(detalhe => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `${detalhe.titulo}: <strong>${detalhe.valor}</strong>`;
//                 ul.appendChild(li);
//             });

//             detalhesProject.appendChild(ul);
//             slideContentProject.appendChild(detalhesProject);
//             slideContentPosition.appendChild(slideContentProject);
//             slideDetalhes.appendChild(slideContentPosition);
//             swiperWrapper.appendChild(slideDetalhes);
//         }

//         // Certifique-se de atualizar o swiper depois de adicionar o slide de detalhes
//         this.mySwiper.update();
//     }

//     criarBotaoVoltar() {
//         const botaoVoltar = document.getElementById('botao-voltar');
//         if (botaoVoltar) {
//             botaoVoltar.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 window.history.back();
//             });
//         }
//     }
// }