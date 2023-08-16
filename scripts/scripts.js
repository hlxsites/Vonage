import {
  buildBlock, decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme, loadBlock,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  sampleRUM,
  waitForLCP,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/* eslint-disable no-param-reassign */

/**
 * Example Usage:
 *
 * domEl('main',
 *  div({ class: 'card' },
 *  a({ href: item.path },
 *    div({ class: 'card-thumb' },
 *     createOptimizedPicture(item.image, item.title, 'lazy', [{ width: '800' }]),
 *    ),
 *   div({ class: 'card-caption' },
 *      h3(item.title),
 *      p({ class: 'card-description' }, item.description),
 *      p({ class: 'button-container' },
 *       a({ href: item.path, 'aria-label': 'Read More', class: 'button primary' }, 'Read More'),
 *     ),
 *   ),
 *  ),
 * )
 */

/**
 * Helper for more concisely generating DOM Elements with attributes and children
 * @param {string} tag HTML tag of the desired element
 * @param  {[Object?, ...Element]} items: First item can optionally be an object of attributes,
 *  everything else is a child element
 * @returns {Element} The constructred DOM Element
 */
export function domEl(tag, ...items) {
  const element = document.createElement(tag);

  if (!items || items.length === 0) return element;

  if (!(items[0] instanceof Element || items[0] instanceof HTMLElement) && typeof items[0] === 'object') {
    const [attributes, ...rest] = items;
    items = rest;

    Object.entries(attributes).forEach(([key, value]) => {
      // Add additional properties here for things that fail to reflect through setAttributes
      if (['innerHTML'].includes(key)) {
        element[key] = value;
      } else if (!key.startsWith('on')) {
        element.setAttribute(key, Array.isArray(value) ? value.join(' ') : value);
      } else {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      }
    });
  }

  items.forEach((item) => {
    item = item instanceof Element || item instanceof HTMLElement
      ? item
      : document.createTextNode(item);
    element.appendChild(item);
  });

  return element;
}

/*
  More shorthand functions can be added for very common DOM elements below.
  domEl function from above can be used for one-off DOM element occurrences.
*/
export function div(...items) { return domEl('div', ...items); }
export function p(...items) { return domEl('p', ...items); }
export function a(...items) { return domEl('a', ...items); }
export function h1(...items) { return domEl('h1', ...items); }
export function h2(...items) { return domEl('h2', ...items); }
export function h3(...items) { return domEl('h3', ...items); }
export function h4(...items) { return domEl('h4', ...items); }
export function h5(...items) { return domEl('h5', ...items); }
export function h6(...items) { return domEl('h6', ...items); }
export function ul(...items) { return domEl('ul', ...items); }
export function li(...items) { return domEl('li', ...items); }
export function i(...items) { return domEl('i', ...items); }
export function img(...items) { return domEl('img', ...items); }
export function span(...items) { return domEl('span', ...items); }
export function button(...items) { return domEl('button', ...items); }
export function hr(...items) { return domEl('hr', ...items); }
export function section(...items) { return domEl('section', ...items); }

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const heading = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (heading && picture
      // eslint-disable-next-line no-bitwise
      && (heading.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, heading] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateHyperlinkImages(container) {
  // picture + br + a in the same paragraph
  [...container.querySelectorAll('picture + br + a, picture + a')]
    // link text is an unformatted URL paste
    .filter((link) => link.textContent.trim().startsWith('http'))
    .forEach((link) => {
      const br = link.previousElementSibling;
      let picture = br.previousElementSibling;
      if (br.tagName === 'PICTURE') picture = br;
      picture.remove();
      br.remove();
      link.innerHTML = picture.outerHTML;
      // make sure the link is not decorated as a button
      link.parentNode.classList.remove('button-container');
      link.className = '';
    });
}

/**
 * Links that have the hash #modal-dialog in their href will open as a modal dialog.
 * @param block
 */
function decorateModalDialogLinks(block) {
  [...block.querySelectorAll('a')]
    .filter(({ href }) => href?.includes('#modal-dialog'))
    .forEach((link) => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();

        const dialog = domEl('dialog', { class: 'modal-dialog' });
        const closeButton = span({ class: 'vlt-icon-close', 'aria-label': 'Close modal' });
        dialog.append(closeButton);
        block.append(dialog);

        // load fragment
        const wrapper = div();
        const fragmentBlock = buildBlock('fragment', [
          [a({ href: new URL(link.href).pathname }, 'Open Fragment')],
        ]);
        wrapper.append(fragmentBlock);
        dialog.append(wrapper);
        decorateBlock(fragmentBlock);
        await loadBlock(fragmentBlock);

        dialog.showModal();
        // prevent scrolling of the background while the dialog is open
        document.body.style.overflow = 'hidden';

        function closeDialog() {
          dialog.remove();
          document.body.style.overflow = 'scroll';
        }

        dialog.addEventListener('close', () => closeDialog());
        closeButton.addEventListener('click', () => closeDialog());
      });
    });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateHyperlinkImages(main);
  decorateModalDialogLinks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer:not([class])'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

/**
 * Copies any non-standard classes at a fragment up to its enclosing
 * fragment-container.
 */
function copyFragmentClass() {
  const fragmentContainers = document.querySelectorAll('.fragment-container');
  fragmentContainers.forEach((fragmentContainer) => {
    const fragment = fragmentContainer.querySelector(':scope .fragment');
    if (fragment) {
      const classes = fragment.classList;
      const expectedClasses = ['fragment', 'block'];
      classes.forEach((c) => {
        if (!expectedClasses.includes(c)) {
          fragmentContainer.classList.add(c);
        }
      });
    }
  });
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  copyFragmentClass();
}

loadPage();
