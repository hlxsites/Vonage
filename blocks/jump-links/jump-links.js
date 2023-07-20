import { div } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`jump-links-${cols.length}-cols`);

  const linkTexts = [...block.querySelectorAll('.jump-links h2')];
  const linkTargets = [...block.querySelectorAll('.jump-links a')];

  block.innerHTML = `
    <div class="jump-links-spacer "></div>
    <div class="container">
        <div class="row"></div>
    </div>`;

  linkTexts.forEach((linkText, index) => {
    const column = div({ class: 'column' });
    column.innerHTML = `<div class="jump-links-jump-link">
    <a class="jump-links-link" href="${linkTargets[index].getAttribute('href')}"</a>
    <div class="jump-links-heading">
      <div class="jump-links-icon">
      </div>
      <h2 class="jump-links-title">${linkText.innerText}</h2>
      <span class="vlt-icon-arrow-link" aria-hidden="true"></span>
    </div>
    <span class="jump-links-label"></span>`;

    block.querySelector('div.row').appendChild(column);
  });
}
