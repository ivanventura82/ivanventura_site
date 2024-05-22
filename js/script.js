import "./global.css";
import "./header.css";
import "./swiper.css";
import "./distancias.css";
import "./menu-mobile.css";
import "./menu-projetos.css";
import "./tipografia.css";
import "./cores.css";
import "./home.css";
import "./estudio.css";
import "./projetos.css";
import "./contato.css";

import MenuMobile from './modules/menu-mobile.js';
import MenuProjetos from './modules/menu-projetos.js';
import ScrollAnima from './modules/scroll-anima.js';
import MySwiper from './modules/mySwiper.js';
import HoverInteraction  from './modules/premios-content.js';
import CarregaProjetos from './modules/carregaProjetos.js';
import CarregaPaginaProjeto from './modules/carregaPaginaProjeto.js';

const scrollAnima = new ScrollAnima('[data-anime="scroll"]');
scrollAnima.init();

const menuMobile = new MenuMobile('[data-menu="button"]', '[data-menu="list"]', '[data-menu="logo"]', '[data-menu="email"]', '[data-menu="instagram"]');
menuMobile.init();

const elementsToAnimate = [
    document.querySelector('.nav__button__home'),
    document.querySelector('.menu__projetos'),
    document.querySelector('.nav__button__mobile'),
    document.querySelector('.nav__button__contato'),
    document.querySelector('.nav__button__estudio'),
    document.getElementById('botao-down'),
    document.getElementById('botao-voltar'),
    ].filter(element => element !== null); 
    
const menuProjetos = new MenuProjetos('[data-menu-projetos="button"]', '[data-menu-projetos="list"]');
menuProjetos.init();

new HoverInteraction();

const mySwiper = new MySwiper(menuProjetos);
mySwiper.initialize();
    
const urlParams = new URLSearchParams(window.location.search);
const categoriaInicial = urlParams.get('filter') || 'selecionado'; // Usa 'selecionado' como padrão, se não houver filtro

if (document.body.id === "index-page") {
    const carregaProjetos = new CarregaProjetos('./projetos.json', mySwiper);
    carregaProjetos.carregarProjetos(categoriaInicial); // Passa a categoriaInicial
    mySwiper.setCarregaProjetosInstance(carregaProjetos);
}   

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const datahash = urlParams.get('datahash');

    if (document.body.id === "pagina-projeto") {
        // Captura o ID do projeto da URL
        const projectId = urlParams.get('datahash'); // 'id' é o nome do parâmetro na URL

        // Verifica se o projectId foi capturado corretamente
        if (projectId) {
            const carregaPaginaProjeto = new CarregaPaginaProjeto('./projetos.json', mySwiper);
            carregaPaginaProjeto.carregarConteudo(datahash); // Passa o projectId para carregar o conteúdo específico
        } else {
            console.error("ID do projeto não especificado na URL.");
        }
    }
});
