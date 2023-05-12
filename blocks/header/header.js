import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

/* Scroll event listener to handle transforming the nav bar from big to small
   when scrolling down after a certain threshold (160 px) and on any scroll up event */
let oldScrollY = window.scrollY;
function scrollFunction() {
  const scrollDistance = 160;
  const newScrollY = window.scrollY;
  const scrolledDown = (oldScrollY - newScrollY < 0);
  if ((scrolledDown && document.body.scrollTop > scrollDistance)
   || (scrolledDown && document.documentElement.scrollTop > scrollDistance)) {
    document.getElementById('nav').querySelector('.nav-tools').style.display = 'none';
    document.getElementById('nav').classList.replace('nav-big', 'nav-small');
    document.getElementById('brand-logo-big').style.display = 'none';
    document.getElementById('brand-logo-small').style.display = '';
  } else {
    document.getElementById('nav').querySelector('.nav-tools').style.display = 'flex';
    document.getElementById('nav').classList.replace('nav-small', 'nav-big');
    document.getElementById('brand-logo-small').style.display = 'none';
    document.getElementById('brand-logo-big').style.display = '';
  }
  oldScrollY = newScrollY;
}
// Add a scroll listener in order to handle transforming the nav on scroll down
if (isDesktop.matches) {
  window.onscroll = scrollFunction;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Builds the Logo Div.
 * @returns {HTMLDivElement}
 */
function buildLogo() {
  // Add the Logo.
  const logo = document.createElement('div');
  logo.classList.add('nav-logo');
  logo.innerHTML = `
      <a href="/" rel="noopener">
        <img id="brand-logo-big" alt="Vonage" class="nav-logo-big" src="/icons/vonage-nav-logo-black.svg" loading="lazy"/>
        <img id="brand-logo-small" alt="Vonage" class="nav-logo-small" src="/icons/vonage-v-logo-black.svg" loading="lazy" style="display:none;"/>
      </a>
    `;
  return logo;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.classList.add('nav-big');
    nav.innerHTML = html;

    const classes = ['sections', 'tools', 'search'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) {
        section.classList.add(`nav-${c}`);
      }
    });

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) {
          navSection.classList.add('nav-drop');
        }
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    // Add the logo element before the nav elements which will stack vertically
    navWrapper.append(buildLogo());
    navWrapper.append(nav);
    block.append(navWrapper);
  }
}
