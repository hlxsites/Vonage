import { decorateIcons, readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
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
    // To achieve the proper wrapping effect, each pair of lists are
    // placed into another <div> element.

    // Build footer DOM
    const footer = document.createElement('div');
    footer.classList.add('footer-container');
    footer.innerHTML = html;

    // Row inside container
    const rowElement = document.createElement('div');
    rowElement.classList.add('footer-links-row');

    // Insert lists within child div elements into pairs within row
    let linksListPair = null;
    let child = footer.firstElementChild;
    let nextChild = null;
    for (let i = 0; i < 4; i += 1) {
      if (i % 2 === 0) {
        linksListPair = document.createElement('div');
        linksListPair.classList.add('footer-links-pair');
        rowElement.appendChild(linksListPair);
      }
      nextChild = child.nextElementSibling;
      linksListPair.appendChild(child.firstElementChild);
      const previousNode = child.previousSibling;
      if (previousNode.nodeType === Node.TEXT_NODE) {
        previousNode.remove();
      }
      child.remove(); // Remove the now empty div element
      child = nextChild;
    }

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

    // Add row as first footer child
    footer.insertBefore(rowElement, footer.firstElementChild);

    // Add class to disclaimer div element
    footer.lastElementChild.classList.add('footer-trade-disclaimer');

    await decorateIcons(footer);
    block.append(footer);
  }
}
