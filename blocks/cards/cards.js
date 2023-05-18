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
    }
    li.innerHTML = wDiv.outerHTML;
    li.prepend(xDiv);
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
