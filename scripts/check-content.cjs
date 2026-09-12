const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const sharp = require('sharp');
const {prepare} = require('./prepare-content.cjs');
(async()=>{
 const original=JSON.parse((await fs.readFile('src/projetos.json','utf8')).replace(/^\uFEFF/,''));
 const output=JSON.parse(await fs.readFile('.generated/projetos.json','utf8'));
 const decode=s=>typeof s !== 'string' ? s : s.replace(/&#39;/g,"'").replace(/&quot;/g,'\"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
 const normalize=p=>({...p,selecionado:p.selecionado===true,slides:p.slides||[],detalhes:p.detalhes||[]});
 const decoded=output.map(p=>({...p,...Object.fromEntries(Object.entries(p).filter(([k])=>!['slides','detalhes'].includes(k)).map(([k,v])=>[k,decode(v)])),detalhes:p.detalhes.map(d=>({titulo:decode(d.titulo),valor:decode(d.valor)}))}));
 assert.deepEqual(decoded.map(normalize),original.map(normalize),'Existing portfolio must remain semantically identical');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ivan-content-'));
 try{
  await fs.mkdir(path.join(root,'content/projetos'),{recursive:true}); await fs.mkdir(path.join(root,'content/uploads'),{recursive:true});await fs.mkdir(path.join(root,'src'),{recursive:true});
  await fs.writeFile(path.join(root,'src/projetos.json'),'[]');
  await sharp({create:{width:2400,height:1600,channels:3,background:'#456789'}}).jpeg().toFile(path.join(root,'content/uploads/large.jpg'));
  await sharp({create:{width:400,height:600,channels:3,background:'#654321'}}).png().toFile(path.join(root,'content/uploads/small.png'));
  const p={title:'<script>alert(1)</script>',datahash:'teste',categoria:'residencias',imagemhome:'/uploads/large.jpg',imagem1:'/uploads/small.png',slides:[{foto:'/uploads/large.jpg',foto2:'/uploads/small.png'}],detalhes:[]};
  const file=path.join(root,'content/projetos/teste.json');await fs.writeFile(file,JSON.stringify(p));
  let [result]=await prepare(root);
  assert.equal(result.title,'&lt;script&gt;alert(1)&lt;/script&gt;');assert.equal(result.slides[0].length,2);
  for(const width of [720,1024,1920]){const m=await sharp(path.join(root,'.generated/img/teste',result.imagemhome+`-${width}w.webp`)).metadata();assert.equal(m.width,width);assert.equal(m.height,Math.round(width*2/3));assert.equal(m.format,'webp');}
  const small=await sharp(path.join(root,'.generated/img/teste',result.imagem1+'-1920w.webp')).metadata();assert.equal(small.width,400);assert.equal(small.height,600);
  for(const invalid of ['/uploads/../secret.jpg','https://example.com/image.jpg','/uploads/missing.jpg']){p.imagemhome=invalid;await fs.writeFile(file,JSON.stringify(p));await assert.rejects(()=>prepare(root));}
  p.imagemhome='/uploads/large.jpg';await fs.writeFile(file,JSON.stringify(p));await fs.writeFile(path.join(root,'content/projetos/duplicate.json'),JSON.stringify(p));await assert.rejects(()=>prepare(root),/repetido/);
  console.log('PASS: 66 projects unchanged; paired photos; WebP dimensions; no upscaling; text escaping; invalid paths/missing image/duplicate ID rejected.');
 }finally{await fs.rm(root,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
