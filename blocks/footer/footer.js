import { decorateIcons, getMetadata, readBlockConfig } from '../../scripts/lib-franklin.js';
/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  // If the pages metadata has this special identifier, don't display a footer
  if (navMeta === 'ecommerce-header') {
    block.parentElement.remove();
  } else {
    const cfg = readBlockConfig(block);
    block.textContent = '';

    const wwwVonageDomain = 'www.vonage.com';

    // fetch footer content
    const footerPath = cfg.footer || '/footer';
    const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

    if (resp.ok) {
      const html = await resp.text();

      // The HTML from the /footer doc consists of a four <div> elements that
      // each contain a <ul> list of links and a fifth <div> element that
      // contains a <p> that contains a trademark disclaimer.
      // Some lists of links start with a non-link list item.

      // Put HTML response in a temporary element
      const source = document.createElement('div');
      source.innerHTML = html;

      // Row inside container
      const rowElement = document.createElement('div');
      rowElement.classList.add('footer-links-row');

      // For all but last div element, move child ul elements into footer-links-row
      while (source.children.length > 1) {
        if (source.children[0] instanceof HTMLDivElement) {
          rowElement.appendChild(source.children[0].firstElementChild);
        }
        source.children[0].remove();
      }

      // Add class to list catories labels, those list items without a link element child
      const listItems = rowElement.querySelectorAll('li');
      listItems.forEach((listItem) => {
        if (listItem.firstElementChild === null) {
          listItem.classList.add('footer-links-category');
        }
      });

      // Add classes to links for external reference and social links
      const links = rowElement.querySelectorAll('a');
      links.forEach((link) => {
        if (link.href.includes(wwwVonageDomain) === false && link.href.includes('.') && link.href.startsWith('https://')) {
          let domain = link.href.slice(8);
          domain = domain.slice(0, domain.indexOf('/'));
          const domainParts = domain.split('.');
          link.classList.add('footer-external-link');
          if (domainParts.length > 1 && domainParts[domainParts.length - 2] !== 'vonage') {
            link.classList.add('footer-social-icon');
            link.classList.add(`footer-social-link-${domainParts[domainParts.length - 2]}`);
          }
        }
      });

      // Build footer DOM
      const footer = document.createElement('div');
      footer.classList.add('footer-container');
      footer.appendChild(rowElement);
      footer.appendChild(source.firstElementChild);

      // Add class to disclaimer div element
      footer.lastElementChild.classList.add('footer-trade-disclaimer');

      source.remove();

      await decorateIcons(footer);
      block.append(footer);
    }
  }
}
