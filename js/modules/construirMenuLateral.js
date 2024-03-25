export default function construirMenuLateral(projetosFiltrados) {
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