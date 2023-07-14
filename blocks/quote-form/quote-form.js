import { div } from '../../scripts/scripts.js';

// TODO: style checkmark, only show if success
// TODO: submit with fetch, to both endpoints
// TODO: only submit if valid
// TODO: add error messages
// TODO: add loading spinner?
// TODO: UNCSS the styles https://uncss-online.com/

export default async function decorate(block) {
  const cardWrapper = block.querySelector(':scope > div > div:first-child');
  cardWrapper.classList.add('card-wrapper');
  await decorateCard(cardWrapper);

  const rightColumnWrapper = block.querySelector(':scope > div > div:last-child');
  rightColumnWrapper.classList.add('right-column-wrapper');

  await decorateRightColumn(rightColumnWrapper);
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

function validateInput(input) {
  const formEl = input.closest('.Vlt-form__element');
  if (input.validity.valid || document.activeElement === input) {
    formEl.classList.remove('Vlt-form__element--error');
  } else {
    formEl.classList.add('Vlt-form__element--error');
  }
}

async function decorateRightColumn(formWrapper) {
  const rightColumn = div({ class: 'right-column' });

  const htmlFile = formWrapper.querySelector('p').textContent;
  formWrapper.querySelector('p').remove();
  formWrapper.querySelector('hr').remove();

  const thankYouMesage = [...formWrapper.children];
  rightColumn.append(div({ class: 'thank-you' }, ...thankYouMesage));

  const form = div({ class: 'form' });
  rightColumn.append(form);

  formWrapper.textContent = '';
  formWrapper.append(rightColumn);

  const resp = await fetch(`/blocks/quote-form/${htmlFile}`);
  if (resp.ok) {
    form.innerHTML = await resp.text();
    const trackingEl = form.querySelector('input[name="digitaltracking"]');
    trackingEl.value = trackingEl.value.replace('/unified-communications/features/', new URL(document.location.href).pathname);
    // TODO: update country, cartid, webreferrerurl, formfriendly,

    form.querySelectorAll('input[required], select[required]').forEach((input) => {
      input.addEventListener('change', () => {
        validateInput(input);
      });
      input.addEventListener('focus', () => {
        validateInput(input);
      });

      input.addEventListener('blur', () => {
        const formEl = input.closest('.Vlt-form__element');
        formEl.classList.add('Vlt-form__element--dirty');
        validateInput(input);
      });
    });

    form.querySelectorAll('input[required]').forEach((input) => {

    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File not found: ${htmlFile} - can not render form`);
  }
}
