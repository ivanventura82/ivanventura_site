// Preview the exact destination of each project pagination mark.
export default function installPaginationPreview(owner) {
  const pagination = document.querySelector('.swiper-pagination');
  if (!pagination || !owner.projectMotion) return;
  const preview = document.createElement('div');
  preview.className = 'project-pagination-preview';
  preview.setAttribute('aria-hidden', 'true');
  document.body.appendChild(preview);
  let active = null;
  const hide = () => { active = null; preview.classList.remove('is-visible'); };
  const show = bullet => {
    if (document.body.id !== 'pagina-projeto' || !bullet || active === bullet) return;
    const index = [...pagination.querySelectorAll('.swiper-pagination-bullet')].indexOf(bullet);
    const slide = owner.swiper.slides[index];
    if (!slide) return;
    active = bullet; preview.replaceChildren();
    const photos = [...slide.querySelectorAll('.slide-background-img,.project-photo-window img')].slice(0,2);
    const media = document.createElement('div'); media.className = 'project-preview-media';
    if (photos.length) {
      photos.forEach(photo => {
        const img = document.createElement('img'); img.alt = ''; img.decoding = 'async';
        img.src = photo.getAttribute('srcset')?.trim().split(',')[0].trim().split(/\s+/)[0] || photo.currentSrc || photo.src;
        img.addEventListener('error', () => { img.remove(); }, {once:true});
        media.appendChild(img);
      });
    } else {
      media.classList.add('project-preview-text');
      media.textContent = slide.querySelector('.detalhes__project') ? 'Ficha técnica' : 'Sobre o projeto';
    }
    const label = document.createElement('span');
    label.textContent = photos.length ? (index === 0 ? 'Capa' : 'Imagem ' + (index+1)) : media.textContent;
    preview.append(media,label);
    const rect = bullet.getBoundingClientRect();
    preview.style.right = Math.max(12,innerWidth-rect.left+18)+'px';
    preview.style.top = Math.max(12,Math.min(innerHeight-154,rect.top-65))+'px';
    preview.classList.add('is-visible');
  };
  pagination.addEventListener('pointerover', event => {
    if (event.pointerType !== 'touch') show(event.target.closest('.swiper-pagination-bullet'));
  });
  pagination.addEventListener('pointerleave', hide);
  pagination.addEventListener('focusin', event => show(event.target.closest('.swiper-pagination-bullet')));
  pagination.addEventListener('focusout', hide);
  pagination.addEventListener('click', hide);
  owner.swiper.on('slideChange', hide);
  window.addEventListener('resize', hide);
}
