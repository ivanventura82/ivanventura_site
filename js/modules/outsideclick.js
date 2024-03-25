export default function outsideClick(element, events, callback) {
  const html = document.documentElement;
  const outside = 'data-outside';
  function handleOutsideClick(event) {
    if (!element.contains(event.target) && !event.target.closest('[data-menu="email"], [data-menu="instagram"]')) {
      element.removeAttribute(outside);
      events.forEach((userEvent) => {
        html.removeEventListener(userEvent, handleOutsideClick);
      });
      callback();
    }
  }

  if (!element.hasAttribute(outside)) {
    events.forEach((userEvent) => {
      setTimeout(() => html.addEventListener(userEvent, handleOutsideClick));
    });
    element.setAttribute(outside, '');
  }
}

// export default function outsideClick(element, events, callback) {
//   const html = document.documentElement;
//   const outside = 'data-outside';
  
//   function handleOutsideClick(event) {
//     if (!element.contains(event.target) && !event.target.closest('[data-menu="email"], [data-menu="instagram"]')) {
//       callback();
//     }
//   }

//   function setupOutsideClick() {
//     if (!element.hasAttribute(outside)) {
//       events.forEach((userEvent) => {
//         html.addEventListener(userEvent, handleOutsideClick);
//       });
//       element.setAttribute(outside, '');
//     }
//   }

//   setupOutsideClick();

//   // Evita a execução do callback quando o menu é aberto
//   element.addEventListener('click', () => {
//     element.setAttribute(outside, '');
//   });
// }

