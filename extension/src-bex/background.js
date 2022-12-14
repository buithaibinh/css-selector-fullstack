/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { bexBackground } from 'quasar/wrappers';

const state = {
  loaded: {},
  injected: {}
};

export default bexBackground((/* , allActiveConnections */) => {
  const toggleIn = ({ id: tab_id }) => {
    // toggle out: it's currently loaded and injected
    if (state.loaded[tab_id] && state.injected[tab_id]) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0].id === tab_id) {
          chrome.scripting.executeScript({
            target: { tabId: tab_id, allFrames: false },
            files: ['assets/eject.js']
          });
          state.injected[tab_id] = false;
        }
      });
    } else if (state.loaded[tab_id] && !state.injected[tab_id]) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        console.log('restore');
        if (tabs[0].id === tab_id) {
          console.log('restore');
          chrome.scripting.executeScript({
            target: { tabId: tab_id, allFrames: false },
            files: ['assets/restore.js']
          });
          state.injected[tab_id] = true;
        }
      });
    } else {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0].id === tab_id) {
          chrome.scripting.executeScript({
            target: { tabId: tab_id, allFrames: false },
            files: ['assets/inject.js']
          });
          state.loaded[tab_id] = true;
          state.injected[tab_id] = true;
        }
      });
    }

    chrome.tabs.onUpdated.addListener((tabId) => {
      if (tabId === tab_id) state.loaded[tabId] = false;
    });
  };

  // eslint-disable-next-line no-unused-vars
  chrome.action.onClicked.addListener(async ({ id: tab_id, url }) => {
    console.log('clicked', tab_id, url);
    toggleIn({ id: tab_id });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('onUpdated', tabId, changeInfo, tab);

    const url = new URL(tab.url);
    const action = url.searchParams.get('action');
    if (action === 'pick-css-selector') {
      console.log('complete', tabId, tab.url);
      toggleIn({ id: tabId });
    }
  });
});
