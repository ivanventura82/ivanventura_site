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
        if (window.innerWidth > 768) {
            this.construirMenuLateral(projetosFiltrados); // Atualize para usar os projetos filtrados
        }
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
        if (document.body.id === "index-page") {
            const swiperWrapper = document.querySelector('.swiper-wrapper');
            // Continua com a remoção segura de slides e adição dos novos slides
        } else {
            console.log("Não está na página Index, não executa a manipulação de slides.");
        }
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        
        // Seleciona todos os slides exceto o slide1
        const slidesParaRemover = Array.from(swiperWrapper.querySelectorAll('.swiper-slide:not([data-hash="slide1"])'));
        
        // Remove todos os slides exceto o slide1
        slidesParaRemover.forEach(slide => swiperWrapper.removeChild(slide));
    
        projetos.forEach(projeto => {
            // Criação do elemento do slide
            const slideElement = document.createElement('div');
            slideElement.className = 'swiper-slide com-imagem-de-fundo'; 
            slideElement.setAttribute('data-hash', projeto.datahash);
        
            // Cria o elemento img para a imagem de fundo
            const backgroundImage = document.createElement('img');
            backgroundImage.className = 'slide-background-img'; // Classe para estilizar e posicionar a imagem
            // Usa a imagem de menor resolução como 'src' para fallback
            backgroundImage.setAttribute('src', `./img/${projeto.datahash}/${projeto.imagemhome}.webp`);
            // Define 'srcset' com todas as versões da imagem nos três tamanhos especificados
            backgroundImage.setAttribute('srcset', `
                ./img/${projeto.datahash}/${projeto.imagemhome}-720w.webp 720w,
                ./img/${projeto.datahash}/${projeto.imagemhome}-1024w.webp 1024w,
                ./img/${projeto.datahash}/${projeto.imagemhome}-1920w.webp 1920w
            `);
            // O 'sizes' define como a imagem será exibida em diferentes larguras de viewport
            backgroundImage.setAttribute('sizes', `
                (max-width: 720px) 100vw,
                (max-width: 1024px) 100vw,
                100vw
            `);
            backgroundImage.setAttribute('alt', `Projeto ${projeto.title}`);
            backgroundImage.loading = "lazy"; // Habilita o lazy loading nativo
        
            // Adiciona a imagem de fundo ao slideElement antes do conteúdo do slide
            slideElement.appendChild(backgroundImage);

            document.addEventListener("DOMContentLoaded", function() {
                var link = document.querySelector(".link__title");
                if (link) {
                    link.style.cursor = "pointer";
                }
            });
        
            const slideContent = `
                <div class="slide-content">
                    <a class="link__title" href="/projeto.html?datahash=${projeto.datahash}">
                        <div class="slide__title__link subtitle__part1">
                            <h2 class="slide__title">${projeto.title}</h2>
                            <img src="./img/arrow-top-right.svg" class="slide__title__arrow" alt="Seta apontando para a direita, indicando link para a página do projeto." width="40" height="40">
                        </div>
                        <span class="subtitle__part2">${projeto.subtitulo1}</span>
                        <span class="subtitle__part3">${projeto.subtitulo2}</span>
                    </a>
                </div>
            `;
        
            // Adiciona o conteúdo do slide
            slideElement.insertAdjacentHTML('beforeend', slideContent);
            swiperWrapper.appendChild(slideElement);
        });
        

        if (this.swiperInstance) {
            setTimeout(() => {
                this.swiperInstance.update(); // Atualiza o Swiper para refletir as mudanças
                window.lazyLoaderInstance.update();

                // Condicionalmente oculta o primeiro bullet
                if (ocultarPrimeiroBullet) {
                    this.swiperInstance.applyDisplayNoneToFirstBullet();
                } else {
                    // Se não precisar ocultar, certifique-se de que ele está visível
                    const firstPaginationBullet = document.querySelector('.swiper-pagination .swiper-pagination-bullet');
                    if (firstPaginationBullet) {
                        firstPaginationBullet.style.display = ''; // Ou 'flex', dependendo do seu layout
                    }
                }
            }, 50); // Ajuste o tempo conforme necessário
        } else {
            console.error("Swiper instance is not defined in CarregaProjetos.");
        }

        // this.swiperInstance.update();
        window.lazyLoaderInstance.update();
    }

    // Dentro de CarregaProjetos
    setSwiperInstance(swiperInstance) {
        this.swiperInstance = swiperInstance;
    }
}

