import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const wDiv = document.createElement('div');

    wDiv.classList.add('card-container');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    wDiv.innerHTML = li.innerHTML;
    if (block.classList.contains('gradient-shadow')) {
      const xDiv = document.createElement('div');
      xDiv.classList.add('card-extrusion');
      wDiv.prepend(xDiv);
    }
    li.innerHTML = wDiv.outerHTML;
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
