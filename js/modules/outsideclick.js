// export default function outsideClick(element, events, callback) {
//   const html = document.documentElement;
//   const outside = 'data-outside';

//   // function handleOutsideClick(event) {
//   //   console.log("Evento disparado:", event.type);
//   //   if (!element.contains(event.target) && !event.target.closest('[data-menu="email"], [data-menu="instagram"]')) {
//   //     console.log("Clique fora detectado.");
//   //     element.removeAttribute(outside);
//   //     events.forEach((userEvent) => {
//   //       console.log("Removendo ouvinte de evento:", userEvent);
//   //       html.removeEventListener(userEvent, handleOutsideClick);
//   //     });
//   //     callback();
//   //   }
//   // }

//   function handleOutsideClick(event) {
//     if (!element.contains(event.target) && event.target !== document.querySelector('[data-menu="button"]')) {
//       // Verifica se o clique não é no botão
//       element.removeAttribute(outside);
//       events.forEach((userEvent) => {
//         html.removeEventListener(userEvent, handleOutsideClick);
//       });
//       callback(); // Chama a função para fechar o menu
//     }
//   }
  

//   if (!element.hasAttribute(outside)) {
//     events.forEach((userEvent) => {
//       setTimeout(() => {
//         console.log("Adicionando ouvinte de evento:", userEvent);
//         html.addEventListener(userEvent, handleOutsideClick);
//       });
//     });
//     element.setAttribute(outside, '');
//   }
// }



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

export default function outsideClick(element, events, callback) {
  const html = document.documentElement;
  const outside = 'data-outside';

  function handleOutsideClick(event) {
    if (!element.contains(event.target) && !event.target.closest('[data-menu="button"]')) {
      console.log("Clique fora detectado.");
      events.forEach((userEvent) => {
        html.removeEventListener(userEvent, handleOutsideClick);
      });
      element.removeAttribute(outside);
      callback();
    }
  }

  if (!element.hasAttribute(outside)) {
    events.forEach((userEvent) => {
      html.addEventListener(userEvent, handleOutsideClick);
    });
    element.setAttribute(outside, '');
  }
}
