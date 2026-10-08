/* Authentication and repository permissions are enforced by GitHub, via Netlify OAuth. */
if (window.CMS) {
  // Root-relative upload URLs bypass Decap's repository asset resolver.
  // Resolve uploads by filename so local, draft and published files use getAsset.
  const repositoryAssetPath = value => typeof value === 'string' && value.startsWith('/uploads/')
    ? value.slice('/uploads/'.length) : value;
  const imageWidget = CMS.getWidget('image');
  const RepositoryImageControl = createClass({
    // Decap's outer Widget only forwards mediaPaths updates when the custom
    // control exposes shouldComponentUpdate. Without this hook, selecting a
    // second image can be swallowed before FileControl receives its controlID.
    shouldComponentUpdate() { return true; },
    getValidateValue() {
      return this.imageControl?.getValidateValue?.() ?? this.props.value;
    },
    setImageControl(control) { this.imageControl = control; },
    render() {
      // Decap re-renders thumbnails when getAsset changes after an upload loads.
      // Preserve that signal instead of hiding it behind a permanently bound method.
      if (this.assetResolver !== this.props.getAsset) {
        this.assetResolver = this.props.getAsset;
        const getAsset = this.props.getAsset;
        this.resolveAsset = (value, ...args) => getAsset(repositoryAssetPath(value), ...args);
      }
      return h(imageWidget.control, {...this.props, ref:this.setImageControl, getAsset:this.resolveAsset});
    }
  });
  CMS.registerWidget('image', RepositoryImageControl, imageWidget.preview, imageWidget.schema);
  const projectSlug = title => String(title || '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/g, '');
  CMS.registerWidget('project-id', createClass({
    shouldComponentUpdate() { return true; },
    render() {
      const entry = this.props.entry;
      const saved = Boolean(entry?.get('path') || entry?.get('slug'));
      return h('div', {},
        h('input', {
          id: this.props.forID, type: 'text', value: this.props.value || '',
          className: this.props.classNameWrapper, readOnly: saved,
          placeholder: 'Ex.: arena-resende', autoCapitalize: 'none', spellCheck: false,
          onChange: event => this.props.onChange(event.target.value),
          onBlur: () => { if (!saved) this.props.onChange(projectSlug(this.props.value)); },
          style: {width:'100%',padding:12,boxSizing:'border-box'}
        }),
        h('p', {style:{fontSize:13,color:'#555'}}, saved
          ? 'Endereço fixado ao salvar, para preservar os links do projeto.'
          : 'Escolha um endereço ou deixe em branco para usar o nome do projeto. Ex.: arena-resende.'));
    }
  }));
  CMS.registerEventListener({
    name: 'preSave',
    handler: async ({entry}) => {
      const data = entry.get('data');
      if (entry.get('collection') !== 'projetos') return data;
      if ((entry.get('path') || entry.get('slug')) && data.get('datahash')) return data;
      const manual = String(data.get('datahash') || '').trim();
      const base = projectSlug(manual || data.get('title'));
      if (!base) throw new Error('Informe um nome de projeto com letras ou números.');
      const response = await fetch('/projetos.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Não foi possível conferir os endereços. Tente salvar novamente.');
      const projects = await response.json();
      const used = new Set(projects.map(project => project.datahash));
      if (manual && used.has(base)) throw new Error('Esse endereço já pertence a outro projeto. Escolha outro endereço.');
      let id = base, suffix = 2;
      while (used.has(id)) id = base + '-' + suffix++;
      return data.set('datahash', id);
    }
  });
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
        ...(data.slides || []).map((slide,i)=>h('section',{key:i,className:'photos'},photo(slide.foto,'a'),photo(slide.foto2,'b'))),
        h('section',{className:'credits'},...(data.detalhes || []).map((detail,i)=>h('p',{key:i},h('strong',{},detail.titulo+' '),detail.valor)))
      );
    }
  }));
  CMS.init();
  document.getElementById('loading').remove();
}

