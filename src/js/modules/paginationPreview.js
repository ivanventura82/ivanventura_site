// Preview and open the exact destination of each project pagination mark.
export default function installPaginationPreview(owner) {
  const pagination = document.querySelector('.swiper-pagination');
  if (!pagination || !owner.projectMotion) return;
  const preview = document.createElement('button');
  preview.type = 'button';
  preview.className = 'project-pagination-preview';
  preview.tabIndex = -1;
  document.body.appendChild(preview);
  let active = null;
  let closeTimer;
  const keep = () => clearTimeout(closeTimer);
  const hide = () => {
    keep(); active = null; preview.classList.remove('is-visible'); preview.tabIndex = -1;
  };
  const scheduleHide = () => {
    keep();
    closeTimer = setTimeout(() => {
      if (!preview.matches(':hover') && document.activeElement !== preview) hide();
    }, 220);
  };
  const show = bullet => {
    keep();
    if (document.body.id !== 'pagina-projeto' || !bullet || active === bullet) return;
    const index = [...pagination.querySelectorAll('.swiper-pagination-bullet')].indexOf(bullet);
    const slide = owner.swiper.slides[index];
    if (!slide) return;
    active = bullet; preview.replaceChildren();
    const photos = [...slide.querySelectorAll('.slide-background-img,.project-photo-window img')].slice(0,2);
    const media = document.createElement('div');
    media.className = 'project-preview-media';
    media.setAttribute('aria-hidden', 'true');
    let label = 'Abrir imagem ' + (index + 1);
    if (photos.length) {
      photos.forEach(photo => {
        const img = document.createElement('img'); img.alt = ''; img.decoding = 'async';
        img.src = photo.getAttribute('srcset')?.trim().split(',')[0].trim().split(/\s+/)[0] || photo.currentSrc || photo.src;
        img.addEventListener('error', () => { img.remove(); }, {once:true});
        media.appendChild(img);
      });
    } else {
      const source = slide.querySelector('.bio__project,.detalhes__project');
      if (!source) { hide(); return; }
      const title = source.matches('.detalhes__project') ? 'Ficha Técnica' : 'Sobre';
      label = 'Abrir ' + title;
      media.classList.add('project-preview-text');
      const page = document.createElement('div');
      page.className = 'project-preview-page';
      // Rebuild the real text without inheriting animation masks or controls.
      source.querySelectorAll('ul,p').forEach(block => {
        const copy = document.createElement(block.tagName.toLowerCase());
        if (block.tagName === 'UL') {
          block.querySelectorAll('li').forEach(item => {
            const row = document.createElement('li');
            row.textContent = item.textContent;
            copy.appendChild(row);
          });
        } else copy.textContent = block.textContent;
        page.appendChild(copy);
      });
      const heading = document.createElement('span');
      heading.className = 'project-preview-heading';
      heading.textContent = title;
      media.append(page, heading);
    }
    preview.append(media);
    preview.setAttribute('aria-label', label);
    preview.tabIndex = 0;
    const rect = bullet.getBoundingClientRect();
    preview.style.right = Math.max(12,innerWidth-rect.left+18)+'px';
    preview.style.top = Math.max(12,Math.min(innerHeight-120,rect.top-53))+'px';
    preview.classList.add('is-visible');
  };
  preview.addEventListener('click', () => {
    const destination = active;
    hide();
    destination?.click();
  });
  preview.addEventListener('pointerenter', keep);
  preview.addEventListener('pointerleave', scheduleHide);
  preview.addEventListener('focus', keep);
  preview.addEventListener('blur', scheduleHide);
  preview.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  pagination.addEventListener('pointerover', event => {
    if (event.pointerType !== 'touch') show(event.target.closest('.swiper-pagination-bullet'));
  });
  pagination.addEventListener('pointerleave', scheduleHide);
  pagination.addEventListener('focusin', event => show(event.target.closest('.swiper-pagination-bullet')));
  pagination.addEventListener('focusout', scheduleHide);
  pagination.addEventListener('click', hide);
  owner.swiper.on('slideChange', hide);
  window.addEventListener('resize', hide);
}
