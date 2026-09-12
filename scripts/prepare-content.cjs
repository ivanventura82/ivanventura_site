const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..');
const CATEGORIES = ['institucionais','residencias','edificios','comerciais','design','interiores'];
const W = [720, 1024, 1920];
function assert(ok, message) { if (!ok) throw new Error(message); }
async function prepare(root = ROOT) {
  const previous = JSON.parse((await fs.readFile(path.join(root,'src/projetos.json'),'utf8')).replace(/^\uFEFF/,''));
  const existingRefs = new Set(previous.flatMap(p => [p.imagemhome,p.imagem1,...(p.slides || []).flat()].filter(Boolean).map(n => p.datahash+'/'+n)));
  const folder = path.join(root, 'content/projetos');
  const names = (await fs.readdir(folder)).filter(n => n.endsWith('.json')).sort();
  assert(names.length, 'Nenhum projeto encontrado.');
  const records = await Promise.all(names.map(async n => JSON.parse(await fs.readFile(path.join(folder,n),'utf8'))));
  records.sort((a,b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.datahash.localeCompare(b.datahash));
  const seen = new Set(), outputs = [], generated = path.join(root,'.generated');
  await fs.rm(generated,{recursive:true,force:true});
  await fs.mkdir(path.join(generated,'img'),{recursive:true});
  // Only referenced uploads are processed; originals never enter the public build.
  for (const record of records) {
    const {ordem, ...project} = record;
    const id = project.datahash;
    assert(typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id), 'Identificador de projeto inválido.');
    assert(!seen.has(id), `Identificador repetido: ${id}`); seen.add(id);
    assert(typeof project.title === 'string' && project.title.trim(), `${id}: informe o nome.`);
    assert(CATEGORIES.includes(project.categoria), `${id}: categoria inválida.`);
    const cache = new Map();
    async function image(ref, required = false) {
      if (!ref) { assert(!required, `${id}: escolha a capa.`); return ''; }
      assert(typeof ref === 'string', `${id}: imagem inválida.`);
      if (cache.has(ref)) return cache.get(ref);
      const legacy = ref.match(/^\/img\/([a-z0-9-]+)\/([^/]+)\.webp$/i);
      if (legacy) {
        assert(legacy[1] === id && !legacy[2].includes('..'), `${id}: imagem de outro projeto.`);
        const basename = legacy[2].replace(/-(720|1024|1920)w$/, '');
        assert(existingRefs.has(id+'/'+basename), `${id}: escolha um arquivo existente ou envie uma nova foto.`);
        // Preserve pre-existing references even if a legacy source file is missing.
        await fs.access(path.join(root,'src',ref)).catch(() => console.warn(`Referência anterior sem arquivo: ${ref}`));
        cache.set(ref, basename); return basename;
      }
      assert(/^\/uploads\/[^/]+\.(jpg|jpeg|png|webp)$/i.test(ref) && !ref.includes('..'), `${id}: envie JPG, PNG ou WebP.`);
      const source = path.join(root,'content',ref);
      const stat = await fs.stat(source);
      assert(stat.size <= 50*1024*1024, `${id}: cada foto pode ter até 50 MB.`);
      const bytes = await fs.readFile(source);
      const base = 'cms-' + crypto.createHash('sha256').update(bytes).digest('hex').slice(0,24);
      const out = path.join(generated,'img',id); await fs.mkdir(out,{recursive:true});
      const input = sharp(bytes, {limitInputPixels: 100000000, animated:false});
      const meta = await input.metadata();
      assert(['jpeg','png','webp'].includes(meta.format) && (meta.pages || 1) === 1, `${id}: formato não suportado.`);
      for (const width of W) {
        await input.clone().rotate().resize({width,withoutEnlargement:true}).webp({quality:85,effort:4}).toFile(path.join(out,`${base}-${width}w.webp`));
      }
      await fs.copyFile(path.join(out,`${base}-1920w.webp`),path.join(out,`${base}.webp`));
      cache.set(ref,base); return base;
    }
    project.imagemhome = await image(project.imagemhome,true);
    project.imagem1 = await image(project.imagem1);
    project.slides = project.slides || [];
    assert(Array.isArray(project.slides), `${id}: galeria inválida.`);
    project.slides = await Promise.all(project.slides.map(async (slide) => {
      assert(slide && slide.foto, `${id}: há uma página sem foto na galeria.`);
      const result = [await image(slide.foto,true)];
      if (slide.foto2) result.push(await image(slide.foto2));
      return result;
    }));
    // The public renderer inserts text into HTML; CMS content remains plain text.
    const escape = value => typeof value === 'string' ? value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : value;
    for (const key of ['title','subtitulo1','subtitulo2','description','área','local','co-autor','ano','estado']) project[key] = escape(project[key] ?? '');
    project.detalhes = project.detalhes || [];
    assert(Array.isArray(project.detalhes), `${id}: ficha técnica inválida.`);
    project.detalhes = project.detalhes.map(d => ({titulo:escape(d.titulo || ''),valor:escape(d.valor || '')}));
    outputs.push(project);
  }
  await fs.writeFile(path.join(generated,'projetos.json'),JSON.stringify(outputs,null,2)+'\n');
  console.log(`${outputs.length} projetos preparados; fotos originais excluídas do site público.`);
  return outputs;
}
module.exports = {prepare};
if (require.main === module) prepare().catch(error => {console.error(error.message); process.exitCode=1;});
