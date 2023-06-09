/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadBlocks,
} from '../../scripts/lib-franklin.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main);
      // Styling links properly, removing added classes
      const elements = Array.from(main.getElementsByTagName('a'));
      elements.forEach((el) => {
        if (el.parentElement.parentElement.tagName === 'P') {
          el.classList.remove('button');
          el.classList.remove('primary');
          el.classList.add('fragment-link');
        }
      });
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (!fragment) {
    // eslint-disable-next-line no-console
    console.warn(`Fragment not found: ${path}`);
    return;
  }
  block.classList.add(path.split('/').pop());
  block.replaceChildren(...fragment.childNodes);
}
