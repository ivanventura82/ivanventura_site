
// export default class CarregaPaginaProjeto {
//     constructor(jsonURL, mySwiperInstance) {
//         this.jsonURL = jsonURL;
//         this.mySwiper = mySwiperInstance; // Referência à instância do Swiper
//         this.slideDetalhesCriado = false; // Estado para rastrear a criação do slide de detalhes
//     }

//     carregarConteudo(datahash) {
//         fetch(this.jsonURL)
//             .then(response => response.json())
//             .then(data => {
//                 // Diretamente aplicando .find() no array retornado
//                 const projeto = data.find(proj => proj.datahash === datahash);
//                 if (projeto) {
//                     this.criarSlides(projeto);
//                     this.criarSlideDetalhes(projeto); // Em seguida, adiciona o slide de detalhes
//                     this.criarBotaoVoltar(); 

//                 } else {
//                     console.error("Projeto com datahash " + datahash + " não encontrado.");
//                 }

//             })
//             .catch(error => console.error("Erro ao carregar o conteúdo do projeto:", error));
//           // Chama o método para adicionar o slide final
//     }

 
    

//     criarSlides(projeto) {
//     const swiperWrapper = document.querySelector('.swiper-wrapper');
//     swiperWrapper.innerHTML = ''; // Limpa os slides existentes

//     // Cria o elemento do slide
//     const slideElement = document.createElement('div');
//     slideElement.className = 'swiper-slide com-imagem-de-fundo';
//     slideElement.setAttribute('data-hash', projeto.datahash);
//     slideElement.style.backgroundColor = '#f8f8f8';

//     // Cria o elemento img para a imagem de fundo
//     const backgroundImage = document.createElement('img');
//     backgroundImage.className = 'slide-background-img';
//     backgroundImage.setAttribute('alt', `Capa do projeto ${projeto.title}, destacando suas principais características`); // Acessibilidade
//     backgroundImage.loading = "lazy"; // Lazy loading nativo

//      // Define src, srcset e sizes
//      backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagem1}.webp`; // Fallback para navegadores que não suportam srcset
//      backgroundImage.setAttribute('srcset', `
//         ./img/${projeto.datahash}/${projeto.imagem1}-720w.webp 720w,
//         ./img/${projeto.datahash}/${projeto.imagem1}-1024w.webp 1024w,
//         ./img/${projeto.datahash}/${projeto.imagem1}-1920w.webp 1920w
//      `);
//      backgroundImage.setAttribute('sizes', `
//         (max-width: 720px) 100vw,
//         (max-width: 1024px) 100vw,
//         100vw
//      `);

//     // Adiciona a imagem de fundo ao slideElement antes do conteúdo do slide
//     slideElement.appendChild(backgroundImage);

//     // Cria o conteúdo do slide
//     const slideContentPosition = document.createElement('div');
//     slideContentPosition.className = 'slide-content-position';

//     const slideContentProject = document.createElement('div');
//     slideContentProject.className = 'slide-content-project';

//     const mainTitle = document.createElement('h1');
//     mainTitle.className = 'main__title';
//     mainTitle.innerHTML = `<span class="subtitle__part1 project__name">${projeto.title}</span>`;

//     slideContentProject.appendChild(mainTitle);
//     slideContentPosition.appendChild(slideContentProject);
//     slideElement.appendChild(slideContentPosition);
//     swiperWrapper.appendChild(slideElement);

//     let slideDescricaoHtml = `
//         <div class="swiper-slide" style="background-color: #f8f8f8">
//             <div class="slide-content-position">
//                 <div class="slide-content-project">
//                     <div class="bio__project">
//                         <ul>`;

//     const propriedadesBio = ["área", "local", "co-autor", "ano", "estado"];

//     // Itera sobre a lista de propriedadesBio para gerar os itens da lista
//     propriedadesBio.forEach(propriedade => {
//         // Verifica se a propriedade existe no objeto projeto
//         if (projeto.hasOwnProperty(propriedade) && projeto[propriedade]) {
//             // Ajusta a formatação da chave para a apresentação
//             let chaveFormatada = propriedade.charAt(0).toUpperCase() + propriedade.slice(1);
    
//             // Verifica se a propriedade é 'área' para adicionar 'm²' ao valor
//             let valorFormatado = propriedade === "área" ? `${projeto[propriedade]} m²` : projeto[propriedade];
    
//             // Aqui, adicione uma verificação para assegurar que valorFormatado não é uma string vazia ou null
//             if (valorFormatado) {
//                 // Adiciona o item ao HTML da descrição somente se valorFormatado tem um valor válido
//                 slideDescricaoHtml += `<li><span>${chaveFormatada}</span> <strong>${valorFormatado}</strong></li>`;
//             }
//         }
//     });
                        
//     slideDescricaoHtml += `</ul>
//                         <p>${projeto.description}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>`;
//     // Adiciona o HTML ao swiper
//     swiperWrapper.innerHTML += slideDescricaoHtml;

//     projeto.slides.forEach(slide => {
//         let slideHTML = `<div class="swiper-slide"><div class="slide-content-position"><div class="slide-content-project-photo">`;
    
//         // Verifica se o slide contém uma ou duas imagens
//         if (slide.length === 2) {
//             // Layout de duas imagens
//             slideHTML += `<div class="photos__grid__2">`;
//             slide.forEach(imgName => {
//                 const basePath = `./img/${projeto.datahash}/${imgName}`;
//                 const srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
//                 // Ajuste aqui para usar 100vw
//                 const sizes = `100vw`;
//                 slideHTML += `<img class="lazy" src="${basePath}.webp" srcset="${srcset}" sizes="${sizes}" alt="${projeto.title}">`;
//             });
//             slideHTML += `</div>`;
//         } else if (slide.length === 1) {
//             // Layout de uma imagem
//             const imgName = slide[0];
//             const basePath = `./img/${projeto.datahash}/${imgName}`;
//             const srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
//             // Ajuste aqui para usar 100vw
//             const sizes = `100vw`;
//             slideHTML += `<div class="photos__grid"><img class="lazy" src="${basePath}.webp" srcset="${srcset}" sizes="${sizes}" alt="${projeto.title}"></div>`;
//         }
        
//         slideHTML += `</div></div></div>`;
//         swiperWrapper.innerHTML += slideHTML;
//     });
//     } 

//     criarSlideDetalhes(projeto) {
//         // Verifica se projeto.detalhes é um array e tem itens
//         if (!Array.isArray(projeto.detalhes) || !projeto.detalhes.length) {
//           // Se não for um array ou estiver vazio, apenas atualiza o Swiper e Lazy Loader e retorna
//           this.atualizarSwiperELazyLoader();
//           return;
//         }
//         this.slideDetalhesCriado = true; // Atualiza o estado
//         const swiperWrapper = document.querySelector('.swiper-wrapper'); 
//         // Inicia o HTML do slide de detalhes
//         let slideDetalhesHtml = `
//           <div class="swiper-slide" data-hash="ficha-tecnica" style="background-color: #f8f8f8">
//             <div class="slide-content-position">
//               <div class="slide-content-project">
//                 <div class="detalhes__project">
//                   <ul>`;
      
//         // Itera sobre os detalhes do projeto para adicionar cada item na lista
//         projeto.detalhes.forEach(detalhe => {
//           slideDetalhesHtml += `<li>${detalhe.titulo}: <strong>${detalhe.valor}</strong></li>`;
//         });
      
//         // Finaliza o HTML do slide de detalhes
//         slideDetalhesHtml += `
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>`;
      
//         // Adiciona o slide de detalhes ao swiper
//         swiperWrapper.innerHTML += slideDetalhesHtml;
//         // Atualiza o Swiper e Lazy Loader independentemente
//         this.atualizarSwiperELazyLoader();
//         document.dispatchEvent(new CustomEvent('slideDetalhesCriado'));
//       }

 

//     criarBotaoVoltar() {
//         const botaoVoltar = document.getElementById('botao-voltar');
//         if (botaoVoltar) {
//             botaoVoltar.addEventListener('click', function(e) {
//                 e.preventDefault(); // Prevenir a ação padrão
//                 if (window.history.length > 1) {
//                     window.history.back();
//                 } else {
//                     window.location.href = '/'; // URL de fallback
//                 }
//             });
//         }
//       }
      
//       atualizarSwiperELazyLoader() {
//         this.mySwiper.update();
//         window.lazyLoaderInstance.update();
//         // this.atualizarImagemDeFundo();

//       }
// }

import gsap from 'gsap';

export default class CarregaPaginaProjeto {
    constructor(jsonURL, mySwiperInstance) {
        this.jsonURL = jsonURL;
        this.mySwiper = mySwiperInstance; // Referência à instância do Swiper
        this.slideDetalhesCriado = false; // Estado para rastrear a criação do slide de detalhes
    }

    carregarConteudo(datahash) {
        fetch(this.jsonURL)
            .then(response => response.json())
            .then(data => {
                const projeto = data.find(proj => proj.datahash === datahash);
                if (projeto) {
                    this.processarProjeto(projeto);
                } else {
                    console.error("Projeto com datahash " + datahash + " não encontrado.");
                }
            })
            .catch(error => console.error("Erro ao carregar o conteúdo do projeto:", error));
    }

    processarProjeto(projeto) {
        this.limparSlidesExistentes();
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        
        // Criar e adicionar o slide principal primeiro
        const slidePrincipal = this.criarSlidePrincipal(projeto);
        swiperWrapper.appendChild(slidePrincipal);

        // Criar e adicionar o slide bio como segundo slide
        const slideBio = this.criarSlideBio(projeto);
        swiperWrapper.appendChild(slideBio);

        // Criar e adicionar os slides secundários
        projeto.slides.forEach(slide => {
            swiperWrapper.appendChild(this.criarSlideSecundario(projeto, slide));
        });

        // Adicionar slides de detalhes, se houver
        this.criarSlideDetalhes(projeto);
        this.criarBotaoVoltar();

        this.mySwiper.update(); // Atualiza o Swiper após todos os slides serem adicionados
    }

    limparSlidesExistentes() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = ''; // Limpa os slides existentes
    }

    criarSlidePrincipal(projeto) {
        const slideElement = document.createElement('div');
        slideElement.className = 'swiper-slide com-imagem-de-fundo';
        slideElement.style.backgroundColor = '#f8f8f8';
        slideElement.appendChild(this.criarElementoImagem(projeto));
        slideElement.appendChild(this.criarConteudoSlide(projeto.title));
        return slideElement;
    }

    criarElementoImagem(projeto) {
        const backgroundImage = document.createElement('img');
        backgroundImage.className = 'slide-background-img';
        backgroundImage.alt = `Capa do projeto ${projeto.title}`;
        backgroundImage.loading = "lazy";
        backgroundImage.onload = () => {
            gsap.fromTo(backgroundImage, {
                scale: 1.1,
                x: 20,
                opacity: 0
            }, {
                scale: 1,
                x: 0,
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out'
            });
        };
        
        
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

        // Adicionar GSAP Animation
    gsap.from(mainTitle, {
        opacity: 0, // Inicia transparente
        y: 20, // Começa um pouco abaixo da posição final
        duration: 1, // Duração da animação
        ease: 'power2.out', // Tipo de easing para a animação
        delay: 0.5 // Delay para começar a animação após o carregamento da imagem
    });
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
            if (projeto[propriedade]) {
                const li = document.createElement('li');
                li.innerHTML = `<span>${propriedade.charAt(0).toUpperCase() + propriedade.slice(1)}</span><strong>${projeto[propriedade]}</strong>`;
                ul.appendChild(li);
            }
        });

        const descricao = document.createElement('p');
        descricao.textContent = projeto.description;


        bioProject.appendChild(ul);
        bioProject.appendChild(descricao); // Adiciona a descrição ao projeto
        slideContentProject.appendChild(bioProject);
        slideContentPosition.appendChild(slideContentProject);
        slideElement.appendChild(slideContentPosition);
        return slideElement;
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
        image.alt = "Projeto Imagem";
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

        // Certifique-se de atualizar o swiper depois de adicionar o slide de detalhes
        this.mySwiper.update();
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
}

