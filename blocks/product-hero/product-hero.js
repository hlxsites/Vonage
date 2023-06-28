import { div } from '../../scripts/scripts.js';

export default function decorate(block) {
  const titleElem = block.querySelector(':scope div:first-child h1');
  const descElem = block.querySelector(':scope div:first-child p');
  const mediaElem = block.querySelector(':scope div:nth-child(2) picture');

  const productHero = div({ class: 'product-hero block' }, div({ class: 'content-resource-header' }));
  productHero.append(div({ class: 'header-media__content' }));
  productHero.querySelector('.content-resource-header').append(div({ class: 'container text' }));

  productHero.querySelector('.container.text').append(div({ class: 'row headline' }));
  productHero.querySelector('.container.text').append(div({ class: 'row description' }));

  productHero.querySelector('.row.headline').append(div({ class: 'column' }, titleElem));
  productHero.querySelector('.row.description').append(div({ class: 'column' }, descElem));

  productHero.querySelector('.header-media__content').append(div({ class: 'media-background' }));
  productHero.querySelector('.header-media__content').append(div({ class: 'container media' }));
  productHero.querySelector('.container.media').append(div({ class: 'row media' }));
  productHero.querySelector('.row.media').append(div({ class: 'column' }, mediaElem));

  block.replaceChildren(productHero);
  return block;
}
