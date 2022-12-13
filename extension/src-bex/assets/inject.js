/* eslint-disable no-var */
/* eslint-disable vars-on-top */
console.log('Hello from inject.js');
var script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL('assets/bundle.min.js');
document.body.appendChild(script);

var selector = document.createElement('css-selector');
selector.setAttribute('id', 'css-selector');

document.body.prepend(selector);

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === 'toggle') {
    console.log('toggle');
  }
});
