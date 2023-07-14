import { div } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const card = block.querySelector(':scope > div > div:first-child');
  card.classList.add('card');
  await decorateCard(card);

  const form = block.querySelector(':scope > div > div:last-child');
  form.classList.add('form-wrapper');

  await decorateForm(form);
}

async function decorateCard(card) {
  // remove button containers
  card.querySelectorAll('.button-container').forEach((container) => {
    [...container.children].forEach((node) => {
      node.classList.remove('button');
      node.classList.remove('primary');
    });
    container.classList.remove('button-container');
  });
}

async function decorateForm(formWrapper) {
  const htmlFile = formWrapper.querySelector('p').textContent;
  formWrapper.querySelector('p').remove();
  formWrapper.querySelector('hr').remove();

  const thankYouMesage = formWrapper.children;
  formWrapper.textContent = '';

  const resp = await fetch(`/blocks/quote-form/${htmlFile}`);
  if (resp.ok) {
    const form = div({ class: 'form' });
    formWrapper.append(form);
    form.innerHTML = await resp.text();
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File not found: ${htmlFile} - can not render form`);
  }
}
