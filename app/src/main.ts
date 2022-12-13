import { defineCustomElement } from 'vue';
import CssSelector from './components/CssSelector.ce.vue';

// console.log(CssSelector.styles) // ["/* inlined css */"]

const cssSelector = defineCustomElement(CssSelector);

customElements.define('css-selector', cssSelector);
