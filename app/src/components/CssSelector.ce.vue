<template>
  <div class="css-selector" ref="selector">
    <div class="css-selector__selector">
      <div class="css-selector__selector__title">{{ title }}</div>
      <div class="css-selector__selector__message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { finder } from '@medv/finder';

const selector = ref<HTMLElement | null>(null);

const message = ref<string | null>('');
const title = ref<string | null>('CSS Selector is enabled');

// current element
const currentElement = ref<HTMLElement | null>(null);

// enable css selector
const enable = () => {
  if (selector.value) {
    selector.value.style.display = 'block';
  }
};

// disable css selector
const disable = () => {
  if (selector.value) {
    selector.value.style.display = 'none';
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const deepElementFromPoint = (x: number, y: number) => {
  const el = document.elementFromPoint(x, y);

  const crawlShadows = (node: any): any => {
    if (node?.shadowRoot) {
      const potential = node.shadowRoot.elementFromPoint(x, y);

      if (potential == node) return node;
      else if (potential?.shadowRoot) return crawlShadows(potential);
      else return potential;
    } else return node;
  };

  const nested_shadow = crawlShadows(el);

  return nested_shadow || el;
};

const on_hover = (e: any) => {
  const target = deepElementFromPoint(e.clientX, e.clientY);
  if (target === selector.value) {
    console.log('hovering on the selector');
    return;
  }
  showGridLines(target);
};

const on_unhover = () => {
  hideGridLines();
};

const on_click = (e: any) => {
  // stop propagation
  e.preventDefault();
  e.stopPropagation();

  const target = deepElementFromPoint(e.clientX, e.clientY);

  if (target === currentElement.value) {
    const path = finder(target);
    copyToClipboard(path);

    title.value = 'Copied to clipboard';
    message.value = path;
  }
};

const hideGridLines = () => {
  // remove outline from current element
  if (currentElement.value) {
    currentElement.value.style.outline = '';
  }
};

const showGridLines = (target: any) => {
  // If the target is not a node, we don't need to show the gridlines
  if (!target) return;
  // outline the element
  target.style.outline = 'rgb(255, 0,0 ) 1px solid';
  // set the current element
  currentElement.value = target;
};

// listen event when mounted
onMounted(() => {
  // listen body mouseover event
  document.body.addEventListener('mouseover', on_hover);
  document.body.addEventListener('mouseout', on_unhover);

  // click event
  document.body.addEventListener('click', on_click);

  // listen window scroll event
  window.addEventListener('scroll', hideGridLines);
});

// remove event when unmounted
onUnmounted(() => {
  document.body.removeEventListener('mouseover', on_hover);
  document.body.removeEventListener('mouseout', on_unhover);
  document.body.removeEventListener('click', on_click);
  window.removeEventListener('scroll', hideGridLines);
});

// export some methods to use in other components
const test = () => {
  console.log('test');
};

defineExpose({
  enable,
  disable,
  test
});

</script>

<style scoped>
.css-selector {
  background-color: green;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 99999; /* on top of everything */
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-family: sans-serif;
  border: 1px solid #eee;
  color: white;
}

.css-selector__selector__title {
  font-size: 16px;
}

.css-selector__selector__message {
  font-size: 14px;
  color: rgb(238, 238, 238);
  padding-top: 5px;
}
</style>
