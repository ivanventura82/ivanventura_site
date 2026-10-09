const fs = require('node:fs/promises');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://ivanventura.com.br';
const decode = value => String(value ?? '').replace(/&(amp|lt|gt|quot|#39);/g, (_, k) => ({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[k]);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const text = value => escape(decode(value));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/&/g, '\\u0026');
const projectPath = id => `/projetos/${id}/`;
const summary = p => (decode(p.description).replace(/\s+/g, ' ').trim() || `${decode(p.title)}${p.local ? ' em '+decode(p.local) : ''}. Projeto de Ivan Ventura Arquitetura.`).slice(0,160);
const cover = p => `/img/${p.datahash}/${p.imagemhome || p.imagem1}-1920w.webp`;
const projectImages = p => [...new Set([p.imagemhome, p.imagem1, ...(p.slides || []).flat()].filter(Boolean))]
  .map(name => `${ORIGIN}/img/${p.datahash}/${name}-1920w.webp`);

function sitemap(urls, projects) {
  const imagesByPath = new Map(projects.map(p => [projectPath(p.datahash), projectImages(p)]));
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    urls.map(u => {
      const images = imagesByPath.get(u) || [];
      if (images.length > 1000) throw Error(`Too many sitemap images for ${u}`);
      return `  <url><loc>${escape(ORIGIN + u)}</loc>` + images.map(src => `<image:image><image:loc>${escape(src)}</image:loc></image:image>`).join('') + '</url>';
    }).join('\n') + '\n</urlset>\n';
}

function metadata(html, {title,description,url,image,structured}) {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escape(title)}</title>`)
    .replace(/<meta\b[^>]*(?:name=["']description["']|property=["']og:[^"']+["']|name=["']twitter:[^"']+["'])[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');
  const tags = `<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${escape(url)}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(url)}">
<meta property="og:image" content="${escape(image)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ivan Ventura Arquitetura">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${json(structured)}</script>`;
  return html.replace('</head>', () => tags+'\n</head>');
}
function image(p, name, isCover = false) {
  const base = `/img/${p.datahash}/${name}`;
  return `<img class="${isCover ? 'slide-background-img' : 'lazy'}" src="${base}-1920w.webp" srcset="${base}-720w.webp 720w, ${base}-1024w.webp 1024w, ${base}-1920w.webp 1920w" sizes="100vw" alt="${isCover ? 'Capa' : 'Fotografia'} do projeto ${text(p.title)}" loading="${isCover ? 'eager' : 'lazy'}"${isCover ? ' fetchpriority="high"' : ''} decoding="async">`;
}
function panel(content, attributes = '') {
  return `<div class="swiper-slide project-text-slide" style="background-color:#f8f8f8" ${attributes}><div class="slide-content-position"><div class="slide-content-project">${content}</div></div></div>`;
}
function projectSlides(p) {
  const facts = [['Área',p['área'] ? p['área']+' m²' : ''],['Local',p.local],['Co-autor',p['co-autor']],['Ano',p.ano],['Estado',p.estado]];
  const hero = `<div class="swiper-slide com-imagem-de-fundo" style="background-color:#000">${image(p,p.imagemhome || p.imagem1,true)}<div class="slide-content-position"><div class="slide-content-project"><h1 class="main__title"><span class="subtitle__part1 project__name">${text(p.title)}</span></h1></div></div></div>`;
  const bio = panel(`<div class="bio__project"><ul>${facts.filter(([,v])=>v && v!=='-').map(([k,v])=>`<li><span>${k}</span><strong>${text(v)}</strong></li>`).join('')}</ul><p>${text(p.description)}</p></div>`);
  const pages = [...(p.slides || [])];
  if (p.imagem1 && p.imagem1 !== p.imagemhome && !pages.flat().includes(p.imagem1)) pages.unshift([p.imagem1]);
  const photos = pages.map(names=>`<div class="swiper-slide"><div class="slide-content-position"><div class="slide-content-project-photo"><div class="${names.length===2?'photos__grid__2':'photos__grid'}">${names.map(name=>`<div class="project-photo-window">${image(p,name)}</div>`).join('')}</div></div></div></div>`).join('');
  const credits = p.detalhes?.length ? panel(`<div class="detalhes__project"><h2>Ficha técnica</h2><ul>${p.detalhes.map(d=>`<li>${text(d.titulo)}: <strong>${text(d.valor)}</strong></li>`).join('')}</ul></div>`, 'data-hash="ficha-tecnica"') : '';
  return hero+bio+photos+credits;
}
const fallback = `<noscript><style>html,body{height:auto!important;overflow:auto!important}.swiper,.swiper-wrapper{height:auto!important;overflow:visible!important;display:block!important;transform:none!important}.swiper-slide{height:auto!important;min-height:0!important;opacity:1!important;visibility:visible!important;padding:32px 6vw;box-sizing:border-box}.slide-content-position,.slide-content-project,.slide-content-project-photo{position:static!important;transform:none!important;height:auto!important;max-height:none!important;overflow:visible!important}.slide-background-img{position:static!important;width:100%;height:auto!important}.main__title,.main__title span{color:#111!important;opacity:1!important;visibility:visible!important;transform:none!important}.com-imagem-de-fundo{background:#f8f8f8!important}.project-photo-window img{width:100%;height:auto}.menu-principal,.nav__button__mobile,.pagination{display:none!important}.seo-navigation{padding:24px;font:18px Arial}.seo-navigation a{margin-right:20px}</style><nav class="seo-navigation"><a href="/">Projetos</a><a href="/estudio">Estúdio</a><a href="/contato">Contato</a></nav></noscript>`;

async function build(root = ROOT) {
  const dist = path.join(root,'dist');
  const projects = JSON.parse(await fs.readFile(path.join(root,'.generated/projetos.json'),'utf8'));
  const template = await fs.readFile(path.join(dist,'projeto.html'),'utf8');
  const organization = {'@type':'Organization','@id':ORIGIN+'/#organization',name:'Ivan Ventura Arquitetura',url:ORIGIN+'/',logo:ORIGIN+'/img/logo-black.svg',email:'contato@ivanventura.com.br',sameAs:['https://www.instagram.com/ivanventura/']};
  const person = {'@type':'Person','@id':ORIGIN+'/#ivan-ventura',name:'Ivan Ventura',jobTitle:'Arquiteto',url:ORIGIN+'/estudio',worksFor:{'@id':organization['@id']}};
  const urls = ['/', '/estudio', '/contato'];
  const redirects = ['# Generated from published content; no project needs manual SEO setup.'];
  function legacy(id,destination) {
    for(const from of ['/projeto.html','/projeto','/projeto/']) {
      redirects.push(`${from} datahash=${id} mobile=:mobile ${destination}?mobile=:mobile 301!`);
      redirects.push(`${from} datahash=${id} ${destination}? 301!`);
    }
  }
  for(const p of projects) {
    if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(p.datahash)) throw Error('Invalid project address');
    const pathname=projectPath(p.datahash),url=ORIGIN+pathname;
    const title=decode(p.title)+' | Ivan Ventura Arquitetura', description=summary(p);
    let html=metadata(template,{title,description,url,image:ORIGIN+cover(p),structured:{'@context':'https://schema.org','@graph':[organization,person,{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,primaryImageOfPage:{'@type':'ImageObject',url:ORIGIN+cover(p)},about:{'@type':'CreativeWork',name:decode(p.title),description:decode(p.description)}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Projetos',item:ORIGIN+'/'},{'@type':'ListItem',position:2,name:decode(p.title),item:url}]}]}});
    if(!/<div class="swiper-wrapper">\s*<\/div>/.test(html))throw Error('Project template changed: cannot insert content');
    html=html.replace(/<div class="swiper-wrapper">\s*<\/div>/,()=>`<div class="swiper-wrapper">${projectSlides(p)}</div>`)
      .replace('</head>',()=>`<script id="project-data" type="application/json">${json(p)}</script>\n</head>`)
      .replace('</body>',()=>fallback+'</body>')
      .replace(/href="\.\/index\.html/g,'href="/index.html').replace(/href="\.\/estudio\.html/g,'href="/estudio.html').replace(/href="\.\/contato\.html/g,'href="/contato.html');
    const folder=path.join(dist,'projetos',p.datahash);await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'index.html'),html);
    urls.push(pathname);legacy(p.datahash,pathname);
  }
  legacy('p-4de80cf9-c38b-472d-85b7-6ce37877478c',projectPath('arena-resende'));
  redirects.push('/projetos/p-4de80cf9-c38b-472d-85b7-6ce37877478c/* /projetos/arena-resende/ 301!');
  const pages=[['index.html','/','Ivan Ventura Arquitetura | São Paulo','Arquitetura residencial, comercial e institucional, edifícios, interiores e design. Conheça os projetos de Ivan Ventura, arquiteto em São Paulo.'],['estudio.html','/estudio','Estúdio e trajetória | Ivan Ventura Arquitetura','Conheça Ivan Ventura, arquiteto formado pelo Mackenzie, sua trajetória, projetos premiados e publicações. Arquitetura em São Paulo desde 2008.'],['contato.html','/contato','Contato | Ivan Ventura Arquitetura','Converse com Ivan Ventura sobre seu projeto de arquitetura. Contato por WhatsApp e e-mail, endereço e localização do estúdio em São Paulo.']];
  for(const [file,pathname,title,description] of pages){
    let html=await fs.readFile(path.join(dist,file),'utf8');
    html=metadata(html,{title,description,url:ORIGIN+pathname,image:ORIGIN+'/img/casp/casp-1920w.webp',structured:{'@context':'https://schema.org','@graph':[organization,person,{'@type':pathname==='/contato'?'ContactPage':pathname==='/estudio'?'AboutPage':'WebSite','@id':ORIGIN+pathname+'#page',url:ORIGIN+pathname,name:title,description,publisher:{'@id':organization['@id']}}]}});
    if(pathname==='/') html=html.replace('</body>',()=>`<noscript><nav aria-label="Projetos"><h2>Projetos de arquitetura</h2><ul>${projects.map(p=>`<li><a href="${projectPath(p.datahash)}">${text(p.title)}</a>${p.local?' — '+text(p.local):''}</li>`).join('')}</ul></nav></noscript></body>`);
    html=html.replace(/(?:\.\/|\/)?projeto(?:\.html)?\?datahash=([a-z0-9-]+)/g,(_,id)=>projectPath(id));
    await fs.writeFile(path.join(dist,file),html);
  }
  await fs.writeFile(path.join(dist,'sitemap.xml'),sitemap(urls,projects));
  await fs.writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  await fs.writeFile(path.join(dist,'_redirects'),redirects.join('\n')+'\n');
  await fs.writeFile(path.join(dist,'_headers'),'/admin/*\n  X-Robots-Tag: noindex\n/preview-mobile/*\n  X-Robots-Tag: noindex\n');
  console.log(`${projects.length} project pages generated with content, metadata, canonical URLs and sitemap.`);
}
module.exports={build,projectSlides,metadata,sitemap,projectImages};
if(require.main===module)build().catch(error=>{console.error(error);process.exitCode=1;});
