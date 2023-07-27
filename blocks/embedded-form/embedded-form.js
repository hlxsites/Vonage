import { div } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

// TODO: submit fetch to the secondary endpoint (currently submitting to the value specified in the action attr of the form element)

export default async function decorate(block) {
  const cardWrapper = block.querySelector(':scope > div > div:first-child');
  cardWrapper.classList.add('card-wrapper');
  await decorateCard(cardWrapper);

  const rightColumnWrapper = block.querySelector(':scope > div > div:last-child');
  rightColumnWrapper.classList.add('right-column-wrapper');

  await decorateRightColumn(rightColumnWrapper);

  // Fetch and set properties for hidden form fields populated via page metadata
  block.querySelectorAll('input[type="hidden"]').forEach((field) => {
    const value = getMetadata(field.name);
    if (value !== '') {
      setFormValue(field.id, value);
    }
  });
}

function setFormValue(id, value) {
  const formElement = document.getElementById(id);
  if (formElement) {
    formElement.value = value;
  }
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
  const isFocused = document.activeElement === input;
  const isValid = input.validity.valid;
  const isDirty = formEl.classList.contains('Vlt-form__element--dirty');

  if (isFocused) {
    // remove all alerts when focused
    formEl.classList.remove('Vlt-form__element--error');
    formEl.classList.remove('Vlt-form__element--valid');
    return;
  }

  if (isValid) {
    formEl.classList.remove('Vlt-form__element--error');
  } else {
    formEl.classList.add('Vlt-form__element--error');
  }

  if (isValid && isDirty) {
    formEl.classList.add('Vlt-form__element--valid');
  } else {
    formEl.classList.remove('Vlt-form__element--valid');
  }
}

function submitForm(formWrapper) {
  const form = formWrapper.querySelector('form');
  form.querySelectorAll('input[required], select[required]').forEach((input) => {
    validateInput(input);
  });
  // there's a captcha that needs to be integrated. Thus, there will always be one error flag.
  if (form.querySelectorAll('.Vlt-form__element--error').length <= 1) {
    // fill in composite form fields
    setFormValue('phonenumber', form.querySelector('[name="cc"]').value + form.querySelector('[name="local"]').value);
    const url = form.getAttribute('action');

    // submit form here.
    const formData = new FormData();
    form.querySelectorAll('.Vlt-form__element input, .Vlt-form__element select, input[type="hidden"]').forEach((input) => {
      if (input.name !== '') {
        formData.append(input.name, input.value);
      }
    });
    fetch(url, {
      method: 'post',
      body: formData,
    })
      .then((response) => {
        formWrapper.classList.add('submitted');
        if (response.redirected && response.url.includes('success')) {
          formWrapper.classList.add('success');
        } else {
          // Flag the form submission as in error to display a warning
          formWrapper.classList.add('failure');
        }
      });
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

  const resp = await fetch(`/forms/${htmlFile}`);
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

    form.querySelector('button[type="submit"]').addEventListener('click', (e) => {
      e.preventDefault();
      submitForm(document.querySelector('.embedded-form'));
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File not found: ${htmlFile} - can not render form`);
  }
}
