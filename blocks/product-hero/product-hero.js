import { div } from '../../scripts/scripts.js';

export default function decorate(block) {
  const titleElem = block.querySelector(':scope div:first-child h1');
  const descElem = block.querySelector(':scope div:first-child p');
  const mediaElem = block.querySelector(':scope div:nth-child(2) picture');

  const productHeroText = div({ class: 'content-resource-header' });
  productHeroText.append(div({ class: 'container text' }));

  const productHeroMedia = div({ class: 'header-media-content' });

  productHeroText.querySelector('.container.text').append(div({ class: 'row headline' }));
  productHeroText.querySelector('.container.text').append(div({ class: 'row description' }));

  productHeroText.querySelector('.row.headline').append(div({ class: 'column' }, titleElem));
  productHeroText.querySelector('.row.description').append(div({ class: 'column' }, descElem));

  productHeroMedia.append(div({ class: 'media-background' }));
  productHeroMedia.append(div({ class: 'container media' }));
  productHeroMedia.querySelector('.container.media').append(div({ class: 'row media' }));
  productHeroMedia.querySelector('.row.media').append(div({ class: 'column' }, mediaElem));

  block.replaceChildren(productHeroText);
  block.append(productHeroMedia);
  return block;
}
