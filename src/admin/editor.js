/* Authentication and repository permissions are enforced by GitHub, via Netlify OAuth. */
if (window.CMS) {
  // Root-relative upload URLs bypass Decap's repository asset resolver.
  // Resolve uploads by filename so local, draft and published files use getAsset.
  const repositoryAssetPath = value => typeof value === 'string' && value.startsWith('/uploads/')
    ? value.slice('/uploads/'.length) : value;
  const imageWidget = CMS.getWidget('image');
  const RepositoryImageControl = createClass({
    render() {
      // Decap re-renders thumbnails when getAsset changes after an upload loads.
      // Preserve that signal instead of hiding it behind a permanently bound method.
      if (this.assetResolver !== this.props.getAsset) {
        this.assetResolver = this.props.getAsset;
        const getAsset = this.props.getAsset;
        this.resolveAsset = (value, ...args) => getAsset(repositoryAssetPath(value), ...args);
      }
      return h(imageWidget.control, {...this.props, getAsset:this.resolveAsset});
    }
  });
  CMS.registerWidget('image', RepositoryImageControl, imageWidget.preview, imageWidget.schema);
  CMS.registerWidget('project-id', createClass({
    componentDidMount() {
      if (!this.props.value) this.props.onChange('p-' + crypto.randomUUID());
    },
    render() { return h('p', {style:{fontSize:14,color:'#555'}}, 'Endereço permanente gerado automaticamente.'); }
  }));
  CMS.registerPreviewStyle('/admin/preview.css');
  CMS.registerPreviewTemplate('projetos', createClass({
    render() {
      const data = this.props.entry.get('data').toJS();
      const asset = ref => ref ? String(this.props.getAsset(repositoryAssetPath(ref))) : '';
      const photo = (ref,key) => ref ? h('img',{key,src:asset(ref),alt:data.title || 'Foto do projeto',loading:'lazy'}) : null;
      const facts = [['Área',data['área'] ? data['área']+' m²' : ''],['Local',data.local],['Co-autor',data['co-autor']],['Ano',data.ano],['Estado',data.estado]];
      return h('article',{},
        h('header',{},h('span',{},'IV / '+(data.categoria || 'Projeto')),h('span',{},'Pré-visualização do conteúdo')),
        h('section',{className:'cover'},photo(data.imagemhome,'cover'),h('div',{className:'caption'},h('h1',{},data.title || 'Novo projeto'),h('p',{},data.subtitulo1),h('p',{},data.subtitulo2))),
        h('section',{className:'bio'},h('dl',{},facts.filter(f=>f[1]).map(([label,value])=>h('div',{key:label},h('dt',{},label),h('dd',{},String(value))))),h('p',{className:'description'},data.description)),
        data.imagem1 ? h('section',{className:'photos'},photo(data.imagem1,'first')) : null,
        ...(data.slides || []).map((slide,i)=>h('section',{key:i,className:'photos'},photo(slide.foto,'a'),photo(slide.foto2,'b'))),
        h('section',{className:'credits'},...(data.detalhes || []).map((detail,i)=>h('p',{key:i},h('strong',{},detail.titulo+' '),detail.valor)))
      );
    }
  }));
  CMS.init();
  document.getElementById('loading').remove();
}
