// Projects arrive with plain CMS text and the processed cover basename.
function escape(value) {
  return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function renderAwards(projects) {
  return projects.filter(p => p.premiado === true)
    .sort((a,b) => Number(b.anoPremiacao || 0) - Number(a.anoPremiacao || 0))
    .map(p => {
      const id = encodeURIComponent(p.datahash);
      const cover = escape('/img/' + id + '/' + p.imagemhome + '-1920w.webp');
      return `<li class="premio">
        <div class="conteudo-premio">
          <div class="texto-premio"><span>${escape(p.anoPremiacao)}</span>
            <div><h3>${escape(p.title)}</h3><p>${escape(p.premiacao)}</p></div>
          </div>
          <div class="button__premio"><a href="/projetos/${id}/">Descobrir</a></div>
        </div>
        <div class="imagem__premio"><img src="${cover}" alt="${escape(p.title)}" width="240" height="120"></div>
      </li>`;
    }).join('\n');
}
function renderStudio(template, projects) {
  const marker = /<ul class="premios">[\s\S]*?<\/ul>/;
  if (!marker.test(template)) throw new Error('Lista de prêmios não encontrada no template do Estúdio.');
  return template.replace(marker, () => '<ul class="premios">\n' + renderAwards(projects) + '\n</ul>');
}
module.exports = {renderAwards, renderStudio};
