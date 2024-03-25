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
                // Diretamente aplicando .find() no array retornado
                const projeto = data.find(proj => proj.datahash === datahash);
                if (projeto) {
                    this.criarSlides(projeto);
                    this.criarSlideDetalhes(projeto); // Em seguida, adiciona o slide de detalhes
                    this.criarBotaoVoltar(); 

                } else {
                    console.error("Projeto com datahash " + datahash + " não encontrado.");
                }

            })
            .catch(error => console.error("Erro ao carregar o conteúdo do projeto:", error));
          // Chama o método para adicionar o slide final
    }

    // criarSlides(projeto) {
    //     const swiperWrapper = document.querySelector('.swiper-wrapper');
    //     swiperWrapper.innerHTML = ''; // Limpa os slides existentes
        

    //     // Cria o slide com o título e a imagem de fundo
    //     swiperWrapper.innerHTML += `
    //     <div class="swiper-slide lazy-background com-imagem-de-fundo" 
    //     data-hash="${projeto.datahash}" 
    //     data-imagem1="${projeto.imagem1}" 
    //     data-bg="./img/${projeto.datahash}/${projeto.imagem1}.webp" 
    //     data-bg-mobile="./img/${projeto.datahash}/mobile/${projeto.imagem1}-mobile.webp"
    //     style="background-color:#f8f8f8;">


    //     <div class="slide-content-position">
    //                 <div class="slide-content-project">
    //                     <h1 class="main__title"><span class="subtitle__part1 project__name">${projeto.title}</span></h1>
    //                 </div>
    //             </div>
    //         </div>
    //     `;

    criarSlides(projeto) {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = ''; // Limpa os slides existentes

    // Cria o elemento do slide
    const slideElement = document.createElement('div');
    slideElement.className = 'swiper-slide com-imagem-de-fundo';
    slideElement.setAttribute('data-hash', projeto.datahash);
    slideElement.style.backgroundColor = '#f8f8f8';

    // Cria o elemento img para a imagem de fundo
    const backgroundImage = document.createElement('img');
    backgroundImage.className = 'slide-background-img';
    backgroundImage.setAttribute('alt', `Capa do projeto ${projeto.title}, destacando suas principais características`); // Acessibilidade
    backgroundImage.loading = "lazy"; // Lazy loading nativo

     // Define src, srcset e sizes
     backgroundImage.src = `./img/${projeto.datahash}/${projeto.imagem1}.webp`; // Fallback para navegadores que não suportam srcset
     backgroundImage.setAttribute('srcset', `
        ./img/${projeto.datahash}/${projeto.imagem1}-720w.webp 720w,
        ./img/${projeto.datahash}/${projeto.imagem1}-1024w.webp 1024w,
        ./img/${projeto.datahash}/${projeto.imagem1}-1920w.webp 1920w
     `);
     backgroundImage.setAttribute('sizes', `
        (max-width: 720px) 100vw,
        (max-width: 1024px) 100vw,
        100vw
     `);

    // Adiciona a imagem de fundo ao slideElement antes do conteúdo do slide
    slideElement.appendChild(backgroundImage);

    // Cria o conteúdo do slide
    const slideContentPosition = document.createElement('div');
    slideContentPosition.className = 'slide-content-position';

    const slideContentProject = document.createElement('div');
    slideContentProject.className = 'slide-content-project';

    const mainTitle = document.createElement('h1');
    mainTitle.className = 'main__title';
    mainTitle.innerHTML = `<span class="subtitle__part1 project__name">${projeto.title}</span>`;

    slideContentProject.appendChild(mainTitle);
    slideContentPosition.appendChild(slideContentProject);
    slideElement.appendChild(slideContentPosition);
    swiperWrapper.appendChild(slideElement);

    let slideDescricaoHtml = `
        <div class="swiper-slide" style="background-color: #f8f8f8">
            <div class="slide-content-position">
                <div class="slide-content-project">
                    <div class="bio__project">
                        <ul>`;

    const propriedadesBio = ["área", "local", "co-autor", "ano", "estado"];

    // Itera sobre a lista de propriedadesBio para gerar os itens da lista
    propriedadesBio.forEach(propriedade => {
        // Verifica se a propriedade existe no objeto projeto
        if (projeto.hasOwnProperty(propriedade) && projeto[propriedade]) {
            // Ajusta a formatação da chave para a apresentação
            let chaveFormatada = propriedade.charAt(0).toUpperCase() + propriedade.slice(1);
    
            // Verifica se a propriedade é 'área' para adicionar 'm²' ao valor
            let valorFormatado = propriedade === "área" ? `${projeto[propriedade]} m²` : projeto[propriedade];
    
            // Aqui, adicione uma verificação para assegurar que valorFormatado não é uma string vazia ou null
            if (valorFormatado) {
                // Adiciona o item ao HTML da descrição somente se valorFormatado tem um valor válido
                slideDescricaoHtml += `<li><span>${chaveFormatada}</span> <strong>${valorFormatado}</strong></li>`;
            }
        }
    });
                        
    slideDescricaoHtml += `</ul>
                        <p>${projeto.description}</p>
                    </div>
                </div>
            </div>
        </div>`;
    // Adiciona o HTML ao swiper
    swiperWrapper.innerHTML += slideDescricaoHtml;

    projeto.slides.forEach(slide => {
        let slideHTML = `<div class="swiper-slide"><div class="slide-content-position"><div class="slide-content-project-photo">`;
    
        // Verifica se o slide contém uma ou duas imagens
        if (slide.length === 2) {
            // Layout de duas imagens
            slideHTML += `<div class="photos__grid__2">`;
            slide.forEach(imgName => {
                const basePath = `./img/${projeto.datahash}/${imgName}`;
                const srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
                // Ajuste aqui para usar 100vw
                const sizes = `100vw`;
                slideHTML += `<img class="lazy" src="${basePath}.webp" srcset="${srcset}" sizes="${sizes}" alt="${projeto.title}">`;
            });
            slideHTML += `</div>`;
        } else if (slide.length === 1) {
            // Layout de uma imagem
            const imgName = slide[0];
            const basePath = `./img/${projeto.datahash}/${imgName}`;
            const srcset = `${basePath}-720w.webp 720w, ${basePath}-1024w.webp 1024w, ${basePath}-1920w.webp 1920w`;
            // Ajuste aqui para usar 100vw
            const sizes = `100vw`;
            slideHTML += `<div class="photos__grid"><img class="lazy" src="${basePath}.webp" srcset="${srcset}" sizes="${sizes}" alt="${projeto.title}"></div>`;
        }
        
        slideHTML += `</div></div></div>`;
        swiperWrapper.innerHTML += slideHTML;
    });
    } 

    criarSlideDetalhes(projeto) {
        // Verifica se projeto.detalhes é um array e tem itens
        if (!Array.isArray(projeto.detalhes) || !projeto.detalhes.length) {
          // Se não for um array ou estiver vazio, apenas atualiza o Swiper e Lazy Loader e retorna
          this.atualizarSwiperELazyLoader();
          return;
        }
        this.slideDetalhesCriado = true; // Atualiza o estado
        const swiperWrapper = document.querySelector('.swiper-wrapper'); 
        // Inicia o HTML do slide de detalhes
        let slideDetalhesHtml = `
          <div class="swiper-slide" data-hash="ficha-tecnica" style="background-color: #f8f8f8">
            <div class="slide-content-position">
              <div class="slide-content-project">
                <div class="detalhes__project">
                  <ul>`;
      
        // Itera sobre os detalhes do projeto para adicionar cada item na lista
        projeto.detalhes.forEach(detalhe => {
          slideDetalhesHtml += `<li>${detalhe.titulo}: <strong>${detalhe.valor}</strong></li>`;
        });
      
        // Finaliza o HTML do slide de detalhes
        slideDetalhesHtml += `
                  </ul>
                </div>
              </div>
            </div>
          </div>`;
      
        // Adiciona o slide de detalhes ao swiper
        swiperWrapper.innerHTML += slideDetalhesHtml;
        // Atualiza o Swiper e Lazy Loader independentemente
        this.atualizarSwiperELazyLoader();
        document.dispatchEvent(new CustomEvent('slideDetalhesCriado'));
      }

    //   criarSlideDetalhes(projeto) {
    //     // Verifica se projeto.detalhes é um array e tem itens
    //     if (!Array.isArray(projeto.detalhes) || !projeto.detalhes.length) {
    //       // Se não for um array ou estiver vazio, apenas atualiza o Swiper e Lazy Loader e retorna
    //       this.atualizarSwiperELazyLoader();
    //       return;
    //     }
      
    //     const swiperWrapper = document.querySelector('.swiper-wrapper');
      
    //     // Inicia o HTML do slide de detalhes
    //     let slideDetalhesHtml = `
    //       <div class="swiper-slide" data-hash="ficha-tecnica" style="background-color: #f8f8f8">
    //         <div class="slide-content-position">
    //           <div class="slide-content-project">
    //             <div class="detalhes__project">
    //               <ul>`;
      
    //     // Itera sobre os detalhes do projeto para adicionar cada item na lista
    //     projeto.detalhes.forEach(detalhe => {
    //       slideDetalhesHtml += `<li>${detalhe.titulo}: <strong>${detalhe.valor}</strong></li>`;
    //     });
      
    //     // Finaliza o HTML do slide de detalhes
    //     slideDetalhesHtml += `
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </div>`;
      
    //     // Adiciona o slide de detalhes ao swiper
    //     swiperWrapper.innerHTML += slideDetalhesHtml;
        
    //     // Atualiza o Swiper e Lazy Loader independentemente
    //     this.atualizarSwiperELazyLoader();  
    //       // Após atualizar o Swiper, chame a função para modificar elementos externos
    //     this.modificarElementosExternos();


    //   }

    criarBotaoVoltar() {
        const botaoVoltar = document.getElementById('botao-voltar');
        if (botaoVoltar) {
            botaoVoltar.addEventListener('click', function(e) {
                e.preventDefault(); // Prevenir a ação padrão
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/'; // URL de fallback
                }
            });
        }
      }
      

    //   atualizarImagemDeFundo() {
    //     // Seleciona todos os elementos .swiper-slide
    //     const slides = document.querySelectorAll('.swiper-slide.com-imagem-de-fundo');
    
    //     slides.forEach(slide => {
    //         const datahash = slide.getAttribute('data-hash');
    //         let imagePath;
    
    //         // Verifica a largura da tela para definir o caminho da imagem
    //         if (window.innerWidth <= 768) {
    //             // Caminho para imagens otimizadas para mobile
    //             // Certifique-se de que projeto.imagem1 está definido e possui um valor válido
    //             imagePath = `./img/${datahash}/mobile/${slide.getAttribute('data-imagem1')}-mobile.webp`;
    //         } else {
    //             // Caminho para imagens otimizadas para desktop
    //             imagePath = `./img/${datahash}/${slide.getAttribute('data-imagem1')}.webp`;
    //         }
    
    //         // Atualiza o estilo de fundo do slide, se aplicável
    //         slide.style.backgroundImage = `url('${imagePath}')`;
    //     });
    // }

      // Função dedicada para atualizar Swiper e Lazy Loader
      
      atualizarSwiperELazyLoader() {
        this.mySwiper.update();
        window.lazyLoaderInstance.update();
        // this.atualizarImagemDeFundo();

      }
}
