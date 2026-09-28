import '../../css/logo-hover.css';

export default function installLogoHover() {
  const paths = [
    'M4.573 0H0v36.582h4.573V0z',
    'M16.208 0H11.41l11.228 36.582h4.8L16.207 0z',
    'M40.928 0h4.8L34.498 36.582H29.7L40.928 0z',
    'M50.481 36.582h-4.754L56.955 0h4.754L50.481 36.582z',
    'M75.246 36.582H80L68.772 0h-4.754l11.228 36.582z'
  ];
  document.querySelectorAll('[data-menu="logo"]').forEach(link => {
    if (link.querySelector('.brand-hover-svg')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 80 37');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.classList.add('brand-hover-svg');
    paths.forEach(d => {
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',d);
      svg.appendChild(path);
    });
    link.appendChild(svg);
    link.classList.add('brand-hover');
  });
}
