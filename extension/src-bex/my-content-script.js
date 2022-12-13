/* eslint-disable func-names */
/* eslint-disable wrap-iife */
import { bexContent } from 'quasar/wrappers';

export default bexContent((bridge) => {
  bridge.on('css:toggle', ({ respond, data }) => {
    // // postMessage to the Web Page
    window.postMessage({ type: 'toggle', tabId: data.tabId }, '*');

    // must respond to the event. Otherwise the other side will wait forever
    respond('hey from content!');
  });
});
