const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const projects=JSON.parse(fs.readFileSync(path.join(ROOT,'.generated/projetos.json'),'utf8'));
const read=file=>fs.readFileSync(path.join(ROOT,'dist',file),'utf8');
const xml=read('sitemap.xml'),redirects=read('_redirects');
const seen=new Set();
for(const p of projects){
 const url=`https://ivanventura.com.br/projetos/${p.datahash}/`;
 assert(!seen.has(url),'Duplicate project URL');seen.add(url);
 const html=read(`projetos/${p.datahash}/index.html`);
 assert(html.includes(`<link rel="canonical" href="${url}">`));
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 assert(!html.includes('Carregando...'));
 assert(!html.includes('Carregando descrição'));
 assert(html.includes('<h1 class="main__title">'));
 const embedded=JSON.parse(html.match(/<script id="project-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 assert.deepEqual(embedded,p,'Embedded record differs from published content');
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
 const content=html.slice(html.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/g,'');
 for(const img of [p.imagemhome,...(p.slides||[]).flat()].filter(Boolean))assert(content.includes(`/img/${p.datahash}/${img}-1920w.webp`),'Missing static image');
 assert(!/src="\.\//.test(content),'Relative image or script breaks nested project URLs');
 assert(html.includes('src="/main.js?'),'Bundle must resolve from nested URL');
 assert(xml.includes(`<loc>${url}</loc>`));
 assert(redirects.includes(`/projeto.html datahash=${p.datahash} /projetos/${p.datahash}/ 301!`));
}
assert.equal((xml.match(/<loc>/g)||[]).length,projects.length+3);
for(const file of ['index.html','estudio.html','contato.html']){
 const html=read(file);assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 assert(!html.includes('www.ivanventuraarquitetura.com.br'),'Old domain remains');
}
assert(read('robots.txt').includes('Sitemap: https://ivanventura.com.br/sitemap.xml'));
assert(redirects.includes('datahash=p-4de80cf9-c38b-472d-85b7-6ce37877478c /projetos/arena-resende/ 301!'));
console.log(`SEO checks passed: ${projects.length} complete project pages, structured data, root assets, canonical URLs, sitemap and legacy redirects.`);
