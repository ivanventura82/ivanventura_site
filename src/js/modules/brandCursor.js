import '../../css/brand-cursor.css';

export default function installBrandCursor() {
  if (document.getElementById('brand-cursor')) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('div');
  cursor.id = 'brand-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const arrow = new Image();
  arrow.alt = '';
  cursor.appendChild(arrow);
  document.body.appendChild(cursor);
  let ready = false;
  arrow.onload = () => { ready = true; };
  arrow.src = '/img/logo-r.svg';
  const hide = () => {
    document.documentElement.classList.remove('brand-cursor-active');
    cursor.classList.remove('is-visible', 'is-link');
  };
  document.addEventListener('pointermove', event => {
    if (!ready || !fine.matches || event.pointerType !== 'mouse' ||
        event.target.closest('input, textarea, select, [contenteditable="true"], iframe')) {
      hide(); return;
    }
    // Position follows the real pointer directly, with no trail or directional rotation.
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.classList.toggle('is-link', !!event.target.closest('a,button,[role="button"],.swiper-pagination-bullet'));
    cursor.classList.add('is-visible');
    document.documentElement.classList.add('brand-cursor-active');
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('pagehide', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
  fine.addEventListener('change', hide);
}
