import { decorateIcons, getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import {
  a, div, li, span, ul,
} from '../../scripts/scripts.js';

/* ------------------------------ Global Variables ----------------------------------- */
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

/* Hacky timeout delay in order to separate display change
  from chang eon prop[erties that can be animated */
const animationDelay = 10;

// Variable to track previous scroll direction for the scrollFunction event handler
let oldScrollY = window.scrollY;

/* ------------------------------ Event Listener Functions ----------------------------------- */

/**
 * Scroll event listener to handle transforming the nav bar from big to small
 *  when scrolling down after a certain threshold (160 px) and on any scroll up event
 */
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

/**
 * Event handler for mouse over events in the sub section index.
 * Toggles the display of the current and new section to display
 * @param event
 */
function toggleNavSubSection(event) {
  if (isDesktop.matches) {
    const subSectionName = event.target.id;
    const subMenu = event.target.closest('.sub-menu');
    // Query subMenu sections for <ul> that match the class of the event firer (to be turned on)
    // Or which are currently displayed via the class sub-menu-section-active (to be turned off)
    subMenu.querySelectorAll(`ul.${subSectionName},ul.sub-menu-section-active`).forEach((subSection) => {
      // Catch the active menu being either the section index (which is always displayed
      // Or the event firer already being active, where we don't want to toggle the section
      if (!subSection.classList.contains('sub-menu-index') && !(subSection.classList.contains(subSectionName) && subSection.classList.contains('sub-menu-section-active'))) {
        // Toggle the class that controls sub section display
        subSection.classList.toggle('sub-menu-section-active');
      }
    });
  }
}

function toggleBreadCrumb() {
  document.querySelector('.menu-option-sublist.l3-nav__menu-options').classList.toggle('active');
}

/* ------------------------------ Global Functions ----------------------------------- */

function buildHierarchy(flat) {
  // Array to build out with parent->child hierarchy for links
  const structuredLinks = [];

  // Iterate through the flat array of links
  flat.forEach((item) => {
    // If the link has no parent it's a top level node so append it to the top level array
    if (item.parent === null || item.parent === '') {
      structuredLinks.push(item);
      // Add a children array property to the parent object
      structuredLinks[structuredLinks.length - 1].children = [];
    }
    // Otherwise if the link has a listed parent find it in the array
    // and append it to the child array element of that parent
    else {
      const index = structuredLinks.indexOf(structuredLinks.find((o) => o.url === item.parent));
      structuredLinks[index].children.push(item);
    }
  });

  return structuredLinks;
}

/**
 * A utility function to create divs with specified ID and classes
 * @param {string} id The id to associate with the created div element
 * @param {[string]} classes an array of strings indicating the classes to add to the div element
 * @returns {HTMLDivElement}
 */
// ToDo: Deprecate this infavor of the new div implementation from Wegmuir
function createDiv(id, classes) {
  const div = document.createElement('div');
  div.id = id;
  classes.forEach((className) => {
    div.classList.add(className);
  });
  return div;
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > div > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    section.parentElement.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the fade in animation for the nav sections in mobile mode
 * Necessary given that they start and end in a display:none state
 */function triggerMenuFadeIn(expanded) {
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
  const headerBackdrop = document.querySelector('.header.backdrop');
  const logo = document.getElementById('brand-logo-big');
  if (headerBackdrop && headerBackdrop.classList.contains('animate-open-backdrop') === expanded) {
    headerBackdrop.classList.toggle('animate-open-backdrop');
    logo.classList.toggle('logo-white');
  }

  // This seems like a total hack but is the only way I can get this animation to work
  // By triggering it after a brief delay to allow the display:none on the menu to change
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, animationDelay));
  triggerMenuFadeIn(expanded);
}

/**
 * Toggles the div section containers on mouse-over of the elements in the index section
 */
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
 * Builds the Logo div injecting the two different SVGs so that they can be styled directly.
 * @returns {HTMLDivElement} Div element containing the two different logo SVGs
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

/**
 * Fetches markdown for the specified subsection and returns an array of subsection div elements
 * @param sectionName The name of the parent section which is being fetched (used as a classname)
 * @param subSectionName The subsection (page name) that is having its navigation markdown fetched
 * @returns [{HTMLDivElement}] An array of section elements for the submenu items
 */

export async function fetchSubSections(sectionName, subSectionName) {
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

/**
 * Processes the section nav element to style drop down nav elements and fetch their subsection data
 * @param {HTMLElement} navSection The parent section for which to load subsections
 * @param sectionIndex The child section which is being processed
 */
function decorateSubSections(navSection, sectionIndex) {
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

  // Flag this first subsection as the special index section
  sectionIndex.classList.add('sub-menu-index', 'sub-menu-section');
  subMenuWrapper.appendChild(sectionIndex);

  // Iterate through all the li in the index to fetch markdowns to populate the sub sections
  sectionIndex.querySelectorAll(':scope > li').forEach(async (subNavSection) => {
    const subSections = subNavSection.innerHTML;
    const safeSubSectionName = toClassName(subSections);
    subNavSection.id = safeSubSectionName;
    subNavSection.addEventListener('mouseover', toggleNavSubSection);
    // Fetch the html of the nav sections children to populate in the popout menu
    const subNav = fetchSubSections(safeSectionName, safeSubSectionName);
    // Add the returned subnav to the submenu container
    (await subNav).forEach((subSection) => {
      subMenuWrapper.appendChild(subSection);
    });
  });
}

/**
 * Processes the section nav element adding necessary nodes and attributes for styling
 * as well as adding section menu event listeners
 * @param {HTMLElement} navSections The nodes of the section nav menu bar
 */
function decorateSections(navSections) {
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
      decorateSubSections(navSection, sectionIndex);
    }
    navSection.addEventListener('click', async (event) => {
      if (isDesktop.matches) {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);

        // Check if there's an active subsection tagged to display when the menu displays
        // if not select either the suitable one based on the current page, or the first
        const subSectionActive = event.target.nextSibling.querySelector('ul.sub-menu-section-active');
        if (!subSectionActive) {
          let path = window.location.pathname;
          path = path.replaceAll('/', '');
          const pagesSubSection = event.target.nextSibling.querySelectorAll(`ul.${path}`);
          // If the current page has a matching subsection in the
          // menu to be opened flag it as active
          if (pagesSubSection.length > 0) {
            pagesSubSection.forEach((sub) => {
              sub.classList.add('sub-menu-section-active');
            });
          } else {
            // Otherwise just take the first subsection of the section to display by default
            const defaultSubSectionName = navItemWrapper.querySelector(':scope > div > :nth-child(3)').classList[0];
            navItemWrapper.querySelectorAll(`:scope ul.${defaultSubSectionName}`).forEach((sub) => {
              sub.classList.add('sub-menu-section-active');
            });
          }
        }

        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navSection.parentElement.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      } else {
        // For Mobile need to set the right subsection to active so it display
        document.getElementById(`sub-menu-${event.target.id}`).classList.toggle('sub-menu-section-active');

        // Turn on the Back to Main menu button
        const back = document.getElementById('back-button');
        back.classList.add('nav-back-button-active');
        // This seems like a total hack but is the only way I can get this animation to work
        // By triggering it after a brief delay to allow the display:none on the menu to change
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((r) => setTimeout(r, animationDelay));
        back.classList.add('nav-back-button-animation-start');

        // Transition all of the other nav elements off to the left
        document.querySelector('header.header-wrapper').classList.add('sub-menu-selected');

        // Render a subsection text to let the user know what menu item they are currently on
        document.getElementById(`${event.target.id}-label`).classList.add('sub-menu-label-active');
      }
    });
  });
}

/**
 * Build the hamburger icon element which will trigger the menu display in mobile mode
 * @returns {HTMLDivElement} Div containing the close button with event listeners
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 */
function buildHamburger(nav, navSections) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  hamburger.addEventListener('click', () => toggleNavBackground(nav.attributes.getNamedItem('aria-expanded').value === 'false'));
  return hamburger;
}

/**
 * Build the hamburger icon element which will trigger the menu display in mobile mode
 * @returns {HTMLDivElement} Breadcrumb header element
 // * @param {String} title The content of the root breadcrumb element that should be displayed (page section)
 // * @param {[Object]} links An array of link objects sorted in a parent -> child structure
 */
function buildBreadCrumb() {
  const breadCrumb = div({ class: 'nav-breadcrumb-wrapper' });
  breadCrumb.innerHTML = `
    <div class="container section-container">
      <div class="left-sec" tabindex="0">
      </div>
      <div class="right-sec">
        <div class="right-sec__menu-option">
          <a href="/unified-communications/pricing/" class="title-option" target="_self">
          See plans &amp; pricing
          </a>
        </div>
      <div class="right-sec__menu-option">
        <a href="tel:+1-855-430-6401" class="title-option" target="_self">
        1-855-430-6401
        </a>
      </div>
      </div>
    </div>`;
  return breadCrumb;
}

/**
 *
 * @param {HTMLDivElement} breadCrumb The div element in the breadcrumb which will receive the linksData
 * @param {Object} linksData An array of link objects sorted in a parent -> child structure
 * @param {[String]} sectionArray The current pages Section metadata element split to a 0 indexed array of strings on '/' to provide page hierarchy
 */
function populateBreadCrumb(breadCrumb, linksData, sectionArray) {
  const inSubPage = (sectionArray.length > 1) && (linksData.subTitle !== '');

  const title = div({ class: 'l3-nav__menu-title' });
  title.innerHTML = `<span class="title-option">
    <a class="title-option__l3nav" data-static-label="${linksData.title}">
              <span class="nav-icon Vlt-icon-phone"></span>
              <span>${linksData.title}</span>
            </a>
          </span>`;

  title.addEventListener('click', toggleBreadCrumb);
  breadCrumb.querySelector('.left-sec').appendChild(title);

  // If we are in a subpage need to add the sub page to the title of the bread crumb
  if (inSubPage) {
    const separator = span({ class: 'separator' });
    separator.innerHTML = '/';
    breadCrumb.querySelector('.left-sec :first-child').appendChild(separator);

    const subTitle = div({ class: 'l3-nav__menu-title bold' });
    subTitle.innerHTML = `<span class="title-option">
    <a class="title-option__l3nav" data-static-label="${linksData.subTitle}">
              <span>${linksData.subTitle}</span>
            </a>
          </span>`;
    const chevron = span({ class: 'Vlt-icon-chevron arrow-icn' });
    subTitle.addEventListener('click', toggleBreadCrumb);
    breadCrumb.querySelector('.left-sec').appendChild(subTitle);
    breadCrumb.querySelector('.l3-nav__menu-title:last-child').appendChild(chevron);
  } else {
    breadCrumb.querySelector('.l3-nav__menu-title').classList.add('bold');
    const chevron = span({ class: 'Vlt-icon-chevron arrow-icn' });
    breadCrumb.querySelector('.l3-nav__menu-title').appendChild(chevron);
  }

  const sectionBreadCrumb = div({ class: 'menu-option-sublist l3-nav__menu-options active' },
    div({ class: 'container sublist-container' },
      div({ class: 'list l3-nav__menu-options--list first' },
        ul())));

  // const sectionBreadCrumb = div({ class: 'list l3-nav__menu-options--list first' }, ul());
  // ToDo: This width needs to be based on a calculation of the width of of the title
  sectionBreadCrumb.querySelector('.list.l3-nav__menu-options--list.first').style.width = '197px';
  for (const root of linksData.links) {
    const breadCrumbLink = a({ class: 'l3-nav__submenu', href: root.url });
    breadCrumbLink.innerHTML = root.label;
    if (root.url === `/${sectionArray.join('/')}`) {
      breadCrumbLink.classList.add('bold');
    }
    sectionBreadCrumb.querySelector('ul').appendChild(li(breadCrumbLink));
  }
  breadCrumb.querySelector('.left-sec').appendChild(sectionBreadCrumb);

  // If the page is a subsection based on its section metadata
  // need to load the relevant subsection breadcrumb data
  if (inSubPage) {
    const subSectionBreadCrumb = div({ class: 'list l3-nav__menu-options--list' }, ul());
    const subSection = `/${sectionArray[0]}/${sectionArray[1]}/`;

    // Find the index in the linksData data of the root page we are currently on given the section metadata
    const index = linksData.links.indexOf(linksData.links.find((o) => o.url === subSection));

    for (const child of linksData.links[index].children) {
      const breadCrumbLink = a({ class: 'l3-nav__submenu', href: child.url });
      breadCrumbLink.innerHTML = child.label;
      if (child.url === `/${sectionArray.join('/')}`) {
        breadCrumbLink.classList.add('bold');
      }
      subSectionBreadCrumb.querySelector('ul').appendChild(li(breadCrumbLink));
    }
    breadCrumb.querySelector('.sublist-container').appendChild(subSectionBreadCrumb);
  }
}
/* ------------------------------ Main function invoked at load ------------------------------- */

/**
 * Build the hamburger icon element which will trigger the menu display in mobile mode
 * @returns {HTMLDivElement} Div containing the return to main menu button with event listeners
 */function buildBackButton() {
  // Back button for mobile
  const backButton = createDiv('back-button', ['nav-back-button']);
  backButton.innerHTML = `<button type="button" aria-controls="nav" aria-label="back to site navigation menu">
        Main Menu
      </button>`;
  backButton.addEventListener('click', () => toggleSubMenu());
  return backButton;
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

    // Add a wrapper div to contain the full nav (logo and sections)
    nav.appendChild(createDiv('header-navigation', ['header-navigation']));
    nav.firstElementChild.innerHTML = html;

    // Tag the sections from the returned markdown based on their order with class categorization
    const classes = ['sections', 'tools', 'search'];
    classes.forEach((c, i) => {
      const section = nav.firstElementChild.children[i];
      if (section) {
        section.classList.add(`nav-${c}`);
      }
    });

    /* If the nav markdown returned elements with children nav elements
       Fetch the child markdowns and style them accordingly */
    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      decorateSections(navSections);
    }

    // Create and append the mobile nav hamburger button
    const hamburger = buildHamburger(nav, navSections);
    nav.prepend(hamburger);

    // Create and append the mobile back to main menu button
    const backButton = buildBackButton();
    nav.prepend(backButton);

    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    await decorateIcons(nav);

    // Get rid of any existing div elements in the header block
    if (block.hasChildNodes()) {
      while (block.firstChild) {
        block.removeChild(block.firstChild);
      }
    }

    // Make sure that on initial display the nav is not flagged as open
    nav.setAttribute('aria-expanded', 'false');

    const navWrapper = createDiv('nav-wrapper', ['nav-wrapper']);

    // Add the logo element before the nav elements which will stack vertically
    navWrapper.append(buildLogo());
    navWrapper.append(nav);

    // div element to be used for the mobile pop over menu
    const headerBackdrop = createDiv('backdrop', ['header', 'backdrop']);
    block.append(headerBackdrop);
    block.append(navWrapper);
    block.append(buildBreadCrumb());
  }

  let sectionPathFull = getMetadata('section');

  // Pop off the first character of the section path if it's a /
  if (sectionPathFull[0] === '/') {
    sectionPathFull = sectionPathFull.slice(1);
  }
  const pathArray = sectionPathFull.split('/');
  // TODO: Implement a guard on a null array
  const subNavResp = await fetch(`/sub-nav/${pathArray[0]}.json`);
  if (subNavResp.ok) {
    const json = await subNavResp.text();
    const subNavs = JSON.parse(json);

    const breadCrumbWrapper = document.querySelector('.nav-breadcrumb-wrapper');

    const breadCrumbLinks = { title: getMetadata('sectiontitle'), subTitle: getMetadata('subsectiontitle'), links: buildHierarchy(subNavs.data) };
    populateBreadCrumb(breadCrumbWrapper, breadCrumbLinks, pathArray);
  }
}
