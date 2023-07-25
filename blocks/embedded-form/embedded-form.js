import { div } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { setFormValue, fetchFormContent } from '../../forms/forms.js';

// TODO: submit fetch to the secondary endpoint (currently submitting to the value specified in the action attr of the form element)

export default async function decorate(block) {
  const cardWrapper = block.querySelector(':scope > div > div:first-child');
  cardWrapper.classList.add('card-wrapper');
  await decorateCard(cardWrapper);

  const rightColumnWrapper = block.querySelector(':scope > div > div:last-child');
  rightColumnWrapper.classList.add('right-column-wrapper');

  await decorateRightColumn(rightColumnWrapper);

  // Fetch and set properties for hidden form fields populated via page metadata
  document.querySelectorAll('input[type="hidden"]').forEach((field) => {
    const value = getMetadata(field.name);
    if (value !== '') {
      setFormValue(field.id, value);
    }
  });
}

async function decorateCard(cardWrapper) {
  const card = div({ class: 'card' });
  card.append(...cardWrapper.children);
  cardWrapper.append(card);
  // remove button containers

  card.querySelectorAll('.button-container').forEach((container) => {
    [...container.children].forEach((node) => {
      node.classList.remove('button');
      node.classList.remove('primary');
    });
    container.classList.remove('button-container');
  });
}

async function decorateRightColumn(formWrapper) {
  const rightColumn = div({ class: 'right-column' });

  const htmlFile = formWrapper.querySelector('p').textContent;
  formWrapper.querySelector('p').remove();
  formWrapper.querySelector('hr').remove();

  const thankYouMesage = [...formWrapper.children];
  rightColumn.append(div({ class: 'thank-you' }, ...thankYouMesage));

  rightColumn.append(await fetchFormContent(`/forms/${htmlFile}`));

  formWrapper.textContent = '';
  formWrapper.append(rightColumn);
}
