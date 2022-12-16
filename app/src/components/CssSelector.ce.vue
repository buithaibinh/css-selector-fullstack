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

const holdCtrl = ref<boolean>(false);

// current element on hover
const overElement = ref<HTMLElement | null>(null);

// selected elements
const selectedElements = ref<HTMLElement[]>([]);

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
  const textArea = document.createElement('textarea');
  textArea.className = 'fixed-top';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  document.execCommand('copy');
  document.body.removeChild(textArea);
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

const showCssSelectors = () => {
  selectedElements.value.forEach((element) => {
    element.style.outline = 'rgb(255, 0,0 ) 4px solid';

    // background color opacity 0.5
    element.style.background = 'rgba(255, 0, 0, 0.3)';
  });

  const paths = selectedElements.value.map((element) => {
    return finder(element);
  });
  if (paths.length > 0) {
    const path = `[CSS Selector]${paths.join(', ')}`;
    copyToClipboard(path);

    title.value = 'Copied to clipboard';
    message.value = path.replace('[CSS Selector]', '');
  }
};

const on_click = (e: any) => {
  // stop propagation
  e.preventDefault();
  e.stopPropagation();

  // if user doest not keep ctrl, we need to clear the selected elements
  if (!holdCtrl.value) {
    selectedElements.value.forEach((element) => {
      element.style.outline = 'none';

      // remove background color
      element.style.background = 'none';
    });
    selectedElements.value = [];
  }

  const target = deepElementFromPoint(e.clientX, e.clientY);
  // if target is same as  overElement, we need to add it to selectedElements
  if (target === overElement.value) {
    // if the user keep ctrl, we need to remove the element from selectedElements
    if (holdCtrl.value) {
      const index = selectedElements.value.indexOf(target);
      if (index > -1) {
        selectedElements.value.splice(index, 1);
      } else {
        selectedElements.value.push(target);
      }
    } else {
      selectedElements.value = [target];
    }

    showCssSelectors();
  }
};

const hideGridLines = () => {
  // remove outline from current element
  if (overElement.value) {
    // if element is not in selectedElements, we need to remove the outline
    if (!selectedElements.value.includes(overElement.value)) {
      overElement.value.style.outline = 'none';
    }
  }
};

const showGridLines = (target: any) => {
  // If the target is not a node, we don't need to show the gridlines
  if (!target) return;
  // outline the element
  target.style.outline = 'rgb(255, 0,0 ) 2px solid';
  // set the current element
  overElement.value = target;
};

const handleKeyDown = (e: any) => {
  if (e.key === 'Control') {
    holdCtrl.value = true;
  }

  if (e.key === 'Meta') {
    holdCtrl.value = true;
  }
};

const handleKeyUp = (e: any) => {
  if (e.key === 'Control') {
    holdCtrl.value = false;
  }

  if (e.key === 'Meta') {
    holdCtrl.value = false;
  }
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

  // handle ctrl key
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
});

// remove event when unmounted
onUnmounted(() => {
  document.body.removeEventListener('mouseover', on_hover);
  document.body.removeEventListener('mouseout', on_unhover);
  document.body.removeEventListener('click', on_click);
  window.removeEventListener('scroll', hideGridLines);

  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
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
  max-width: 400px;
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
