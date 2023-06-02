import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const wDiv = document.createElement('div');
    const xDiv = document.createElement('div');
    xDiv.classList.add('card-extrusion');
    wDiv.classList.add('card-container');

    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    wDiv.innerHTML = li.innerHTML;
    if (block.classList.contains('gradient-shadow')) {
      const title = document.createElement('div');
      title.classList.add('card-title');
      const titleImage = wDiv.querySelector('div.cards-card-image');
      title.append(titleImage);
      const h4title = wDiv.querySelector('h4');
      title.append(h4title);
      wDiv.prepend(title);
    } else if (block.classList.contains('info-card')) {
      // Setup an <a> to replace the <div> to make the whole card clickable
      // Note that this makes it impossible to have the two texts in the
      // markdown passed link to different places
      const cardLinkWrapper = document.createElement('a');
      cardLinkWrapper.classList.add('cards-card-body');
      const cardDivWrapper = wDiv.querySelector('div.cards-card-body');

      // Add class properties to the elements for styling
      cardDivWrapper.querySelector('h2').classList.add('header-container', 'card-title');
      cardDivWrapper.querySelector('p').classList.add('button', 'primary', 'button-container');

      // Get the first link from the markdown and add it to the <> tag as it's href
      cardLinkWrapper.href = cardDivWrapper.querySelector('h2 > a').getAttribute('href');

      const titleText = cardDivWrapper.querySelector('h2').innerText;
      const buttonText = cardDivWrapper.querySelector('p').innerText;

      // Pull out the <a> tags from the existing markdown
      cardDivWrapper.querySelector('h2').removeChild(cardDivWrapper.querySelector('h2 > a'));
      cardDivWrapper.querySelector('p').removeChild(cardDivWrapper.querySelector('p > a'));

      cardDivWrapper.querySelector('h2').innerText = titleText;
      cardDivWrapper.querySelector('p').innerText = buttonText;

      // Copy the div HTML contents as the a contents and
      // replace them in the parent container (the li)
      cardLinkWrapper.append(...cardDivWrapper.children);
      cardDivWrapper.parentNode.replaceChild(cardLinkWrapper, cardDivWrapper);

      // Add a span to contain the arrow decoration on the card
      const arrow = document.createElement('span');
      arrow.classList.add('icon-arrow-link');

      cardLinkWrapper.appendChild(arrow);
    }
    li.innerHTML = wDiv.outerHTML;
    li.prepend(xDiv);
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
