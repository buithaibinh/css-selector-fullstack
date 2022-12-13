<template>
  <div></div>
</template>

<script>
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';

export default {
  setup() {
    const $q = useQuasar();

    // Our function which receives the URL sent by the background script.
    function doOnTabOpened({ data, respond }) {
      // Do something with the URL.
      console.log(data);

      // Respond to the background script.
      respond('Hello from the content script!');
    }

    // Add our listener
    $q.bex.on('bex.tab.opened', doOnTabOpened);

    // Don't forget to clean it up
    onBeforeUnmount(() => {
      $q.bex.off('bex.tab.opened', doOnTabOpened);
    });

    return {};
  }
};
</script>
