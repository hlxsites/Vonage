import { getMetadata, decorateIcons, toClassName } from '../../scripts/lib-franklin.js';

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
    document.getElementById('nav').querySelector('.nav-search').style.display = 'none';
    document.getElementById('nav').classList.replace('nav-big', 'nav-small');
    document.getElementById('brand-logo-big').style.display = 'none';
    document.getElementById('brand-logo-small').style.display = '';
  } else {
    document.getElementById('nav').querySelector('.nav-tools').style.display = 'flex';
    document.getElementById('nav').querySelector('.nav-search').style.display = 'block';
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
 * @param {string} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > div > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    section.parentElement.setAttribute('aria-expanded', expanded);
  });
}

function triggerMenuFadeIn(expanded) {
  const navSections = document.querySelector('.nav-sections');
  if (!isDesktop.matches) {
    navSections.querySelectorAll(':scope > ul > div > li').forEach((element) => {
      if (!expanded) {
        element.classList.add('animate-fade-in');
      } else {
        element.classList.remove('animate-fade-in');
      }
    });
  }
}

/**
 * Toggles the flyout animation of the nav menu in mobile mode
 */
async function toggleNavBackground(expanded) {
  const headerBackdrop = document.querySelector('.header-backdrop');
  const logo = document.getElementById('brand-logo-big');
  if (headerBackdrop && headerBackdrop.classList.contains('animate-open-backdrop') === expanded) {
    headerBackdrop.classList.toggle('animate-open-backdrop');
    logo.classList.toggle('logo-white');
  }

  // This seems like a total hack but is the only way I can get this animation to work
  // By triggering it after a brief delay to allow the display:none on the menu to change
  await new Promise((r) => setTimeout(r, 10));
  triggerMenuFadeIn(expanded);
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
  nav.setAttribute('aria-expanded', expanded || isDesktop.matches ? 'false' : 'true');
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
    toggleSubMenu();
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
        <svg id="brand-logo-small" class="nav-logo-small" style="display:none;" width="230px" height="200px" viewBox="0 0 230 200" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.3408,0 L-0.0002,0 L64.6808,146.958 C65.1748,148.081 66.7718,148.07 67.2508,146.942 L88.7628,96.337 L45.3408,0 Z"></path>
          <path fill="currentColor" d="M183.4502,0 C183.4502,0 113.9562,159.156 104.6482,173.833 C93.8292,190.896 86.6592,197.409 73.3912,199.496 C73.2682,199.515 73.1772,199.621 73.1772,199.746 C73.1772,199.886 73.2912,200 73.4312,200 L114.9552,200 C132.9432,200 145.9152,184.979 153.1042,171.714 C161.2742,156.637 229.5902,0 229.5902,0 L183.4502,0 Z"></path>
        </svg>
        <svg id="brand-logo-big" class="nav-logo-big" width="913px" height="200px" viewBox="0 0 913 200" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.3408,0 L-0.0002,0 L64.6808,146.958 C65.1748,148.081 66.7718,148.07 67.2508,146.942 L88.7628,96.337 L45.3408,0 Z"></path>
          <path fill="currentColor" d="M183.4502,0 C183.4502,0 113.9562,159.156 104.6482,173.833 C93.8292,190.896 86.6592,197.409 73.3912,199.496 C73.2682,199.515 73.1772,199.621 73.1772,199.746 C73.1772,199.886 73.2912,200 73.4312,200 L114.9552,200 C132.9432,200 145.9152,184.979 153.1042,171.714 C161.2742,156.637 229.5902,0 229.5902,0 L183.4502,0 Z"></path>
          <path fill="currentColor" d="M365.0527,127.6431 C364.9567,127.8531 364.6577,127.8531 364.5617,127.6431 L330.0887,52.2061 L310.7207,52.2061 C310.7207,52.2061 346.2497,132.2541 349.7987,138.2351 C353.2667,144.0801 357.4637,148.8991 364.8077,148.8991 C372.1517,148.8991 376.3487,144.0801 379.8167,138.2351 C383.3657,132.2541 418.8947,52.2061 418.8947,52.2061 L399.5267,52.2061 L365.0527,127.6431 Z"></path>
          <path fill="currentColor" d="M470.187,134.2002 C451.454,134.2002 439.186,121.9992 439.186,99.9992 C439.186,77.9992 451.454,65.8002 470.187,65.8002 C488.853,65.8002 501.186,77.9992 501.186,99.9992 C501.186,121.9992 488.853,134.2002 470.187,134.2002 M470.187,50.0002 C440.854,50.0002 421.987,69.0002 421.987,99.9992 C421.987,131.0002 440.854,150.0002 470.187,150.0002 C499.453,150.0002 518.387,131.0002 518.387,99.9992 C518.387,69.0002 499.453,50.0002 470.187,50.0002"></path>
          <polygon fill="currentColor" points="617.4829 52.2002 617.4829 147.8002 597.6299 147.8002 551.3499 77.9072 551.3499 147.8002 534.4169 147.8002 534.4169 52.2002 554.3359 52.2002 600.6169 122.5592 600.6169 52.2002"></polygon>
          <path fill="currentColor" d="M662.8662,108.6001 L679.5432,69.5551 C679.6372,69.3361 679.9462,69.3361 680.0392,69.5551 L696.7162,108.6001 L662.8662,108.6001 Z M679.7912,51.1071 C672.8172,51.1071 668.5552,56.3981 665.7452,61.6891 C662.8662,67.1111 628.4302,147.8001 628.4302,147.8001 L646.1242,147.8001 L656.0112,124.6511 L703.5712,124.6511 L713.4582,147.8001 L731.1512,147.8001 C731.1512,147.8001 696.7162,67.1111 693.8372,61.6891 C691.0272,56.3981 686.7642,51.1071 679.7912,51.1071 L679.7912,51.1071 Z"></path>
          <path fill="currentColor" d="M779.0156,110.9336 L809.3046,110.9336 C809.1626,125.7876 795.2966,134.2006 780.5996,134.2006 C762.1676,134.2006 750.0976,121.9986 750.0976,99.9996 C750.0976,76.2466 761.2716,65.6606 781.6336,65.6606 C794.3806,65.6606 804.9786,70.8726 807.2096,82.8856 L824.7716,82.8856 C821.6926,61.8536 802.3226,49.9996 780.5996,49.9996 C751.7376,49.9996 733.1746,68.9996 733.1746,99.9996 C733.1746,130.9996 751.7376,149.6286 780.5996,149.6286 C792.7686,149.6286 805.0416,143.1036 809.3636,136.2116 L809.3076,147.7996 L825.5076,147.7996 L825.5076,118.3036 L825.5076,96.3036 L779.0156,96.3036 L779.0156,110.9336 Z"></path>
          <polygon fill="currentColor" points="912.5908 68.1992 912.5908 52.2002 843.8578 52.2002 843.8578 147.8002 912.5908 147.8002 912.5908 131.7992 860.7908 131.7992 860.7908 106.6672 908.5508 106.6672 908.5508 90.6662 860.7908 90.6662 860.7908 68.1992"></polygon>
        </svg>
      </a>`;
  return logo;
}

export async function getSubSections(sectionName, subSectionName) {
  const navSubSections = [];
  const resp = await fetch(`/sub-nav/${sectionName}/${subSectionName}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();
    // Replace the div elements from the markdown to denote sections
    // with a top level li that will be piped into the sub-nav div as a flex child
    const temp = document.createElement('div');
    temp.innerHTML = html;

    temp.querySelectorAll(':scope > div > ul').forEach((navSubSection) => {
      navSubSection.classList.add(subSectionName);
      navSubSection.classList.add('sub-menu-section');
      navSubSections.push(navSubSection);
    });
  }

  if (navSubSections.length > 1) {
    navSubSections[navSubSections.length - 2].classList.add('sub-menu-section-no-border');
    navSubSections[navSubSections.length - 1].classList.add('sub-menu-section-last');
  }
  return navSubSections;
}

function toggleNavSubSection(event) {
  if (isDesktop.matches) {
    const subSectionName = event.target.id;
    const subMenu = event.target.closest('.sub-menu');
    // Query subMenu sections for <ul> that match the class of the event firer (to be turned on)
    // Or which are currently displayed via the class sub-menu-section-active (to be turned off)
    subMenu.querySelectorAll(`ul.${subSectionName},ul.${'sub-menu-section-active'}`).forEach((subSection) => {
      // Catch the active menu being either the section index (which is always displayed
      // Or the event firer already being active, where we don't want to toggle the section
      if (!subSection.classList.contains('sub-menu-index') && !(subSection.classList.contains(subSectionName) && subSection.classList.contains('sub-menu-section-active'))) {
        // Toggle the class that controls sub section display
        subSection.classList.toggle('sub-menu-section-active');
      }
    });
  }
}

function toggleSubMenu() {
  // If the mobile menu is up and a submenu is open
  if (document.querySelector('header.sub-menu-selected')) {
    document.querySelectorAll('.nav-sections .sub-menu-section-active').forEach((section) => {
      section.classList.toggle('sub-menu-section-active');
    });
    document.querySelector('header').classList.toggle('sub-menu-selected');
    const activeSub = document.querySelector('span.sub-menu-label-active');
    if (activeSub) {
      activeSub.classList.remove('sub-menu-label-active');
    }
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.classList.remove('nav-back-button-active');
    }
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
// TODO: Split this function up breaking out to additional functions for ease of reading
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  function createDiv(id, classes) {
    const div = document.createElement('div');
    div.id = id;
    classes.forEach((className) => {
      div.classList.add(className);
    });
    return div;
  }

  function loadSubSections(navSection, sectionIndex) {
    // Get the top level text property from the nav html as the section menu name
    // As well as the id and class name for the menu sections
    const section = navSection.childNodes[0].nodeValue;
    const safeSectionName = toClassName(section);

    // Flag the nav menu button as a drop down in CSS
    navSection.classList.add('nav-drop');

    // Create a div to wrap the items in the drop-down menu to handle displaying as a popout
    const subMenuWrapper = createDiv(`sub-menu-${safeSectionName}`, ['sub-menu']);

    // Add a span for the close button in the menu
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-icon');
    closeButton.addEventListener('click', () => {
      const expanded = navSection.getAttribute('aria-expanded') === 'true';
      navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      navSection.parentElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    subMenuWrapper.appendChild(closeButton);

    // Drop the nested ul element add the wrapper and then the nested ul again
    sectionIndex.remove();
    navSection.after(subMenuWrapper);
    // Flag this first subsection as the special index section and flag it to always be active and add it back
    sectionIndex.classList.add('sub-menu-index', 'sub-menu-section');
    subMenuWrapper.appendChild(sectionIndex);

    // Iterate through all the li in the index to fetch markdowns to populate the sub sections
    sectionIndex.querySelectorAll(':scope > li').forEach(async (subNavSection) => {
      const subSections = subNavSection.innerHTML;
      const safeSubSectionName = toClassName(subSections);
      subNavSection.id = safeSubSectionName;
      subNavSection.addEventListener('mouseover', toggleNavSubSection);
      // Fetch the html of the nav sections children to populate in the popout menu
      const subNav = getSubSections(safeSectionName, safeSubSectionName);
      // Add the returned subnav to the submenu container
      (await subNav).forEach((subSection) => {
        subMenuWrapper.appendChild(subSection);
      });
    });
  }

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.classList.add('nav-big');

    nav.appendChild(createDiv('header-navigation', ['header-navigation']));
    nav.firstElementChild.innerHTML = html;
    const classes = ['sections', 'tools', 'search'];
    classes.forEach((c, i) => {
      const section = nav.firstElementChild.children[i];
      if (section) {
        section.classList.add(`nav-${c}`);
      }
    });

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      const sectionDivider = document.createElement('hr');
      sectionDivider.classList.add('nav-section-divider');
      navSections.after(sectionDivider);
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        const sectionIndex = navSection.querySelector(':scope > ul');
        navSection.remove();
        const navItemWrapper = document.createElement('div');
        navItemWrapper.classList.add('nav-item-wrapper');
        navSection.id = toClassName(navSection.childNodes[0].nodeValue);
        navItemWrapper.appendChild(navSection);
        navSections.querySelector('ul').appendChild(navItemWrapper);
        if (sectionIndex) {
          const subMenuLabel = document.createElement('span');
          const labeltext = toClassName(navSection.childNodes[0].nodeValue);
          subMenuLabel.id = `${labeltext}-label`;
          subMenuLabel.classList.add('sub-menu-label');
          subMenuLabel.innerHTML = labeltext.charAt(0).toUpperCase() + labeltext.slice(1);
          navItemWrapper.prepend(subMenuLabel);

          // Fetch and populate the subsection data
          loadSubSections(navSection, sectionIndex);
        }
        // TODO: Split these event listener functions off to two different non anonymous functions
        navSection.addEventListener('click', (event) => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            navSection.parentElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          } else {
            // For Mobile need to set the right subsection to active so it display
            document.getElementById(`sub-menu-${event.target.id}`).classList.toggle('sub-menu-section-active');

            // Turn on the Back to Main menu button
            const back = document.getElementById('back-button');
            back.classList.add('nav-back-button-active');
            // TODO: Need to implement a wait here in order to allow the animation to trigger after the display has changed
            back.classList.add('nav-back-button-animation-start');

            // Transition all of the other nav elements off to the left
            document.querySelector('header.header-wrapper').classList.add('sub-menu-selected');

            // Render a subsection text to let the user know what menu item they are currently on
            document.getElementById(`${event.target.id}-label`).classList.add('sub-menu-label-active');
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
    hamburger.addEventListener('click', () => toggleNavBackground(nav.attributes.getNamedItem('aria-expanded').value === 'false'));
    nav.prepend(hamburger);

    // Back button for mobile
    const backButton = createDiv('back-button', ['nav-back-button']);
    backButton.innerHTML = `<button type="button" aria-controls="nav" aria-label="back to site navigation menu">
        Main Menu
      </button>`;
    backButton.addEventListener('click', () => toggleSubMenu());
    nav.prepend(backButton);

    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';

    // Add the logo element before the nav elements which will stack vertically
    navWrapper.append(buildLogo());
    navWrapper.append(nav);

    // div element to be used for the mobile pop over menu
    const headerBackdrop = document.createElement('div');
    headerBackdrop.className = 'header-backdrop';

    // Get rid of any existing div elements in the header block
    if (block.hasChildNodes()) {
      while (block.firstChild) {
        block.removeChild(block.firstChild);
      }
    }

    // Make sure that on initial display the nav is not flagged as open
    nav.setAttribute('aria-expanded', 'false');
    block.append(headerBackdrop);
    block.append(navWrapper);
  }
}
