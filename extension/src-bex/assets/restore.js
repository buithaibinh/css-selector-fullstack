/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
console.log('restore.js');

var restore = () => {
  const cssSelector = document.createElement('css-selector');
  document.body.prepend(cssSelector);
};

restore();
