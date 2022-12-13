/* eslint-disable no-unused-vars */

console.log('eject.js');
document.querySelectorAll('css-selector').forEach((node) => {
  node.animate([{ transform: 'translateX(-200%)', opacity: 0 }], {
    duration: 300,
    easing: 'ease-out'
  }).onfinish = (e) => node.remove();
});
