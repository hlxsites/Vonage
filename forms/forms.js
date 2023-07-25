import { div } from '../scripts/scripts.js';

async function fetchFormContent(formUrl) {
  const form = div({ class: 'form' });
  const resp = await fetch(formUrl);
  if (resp.ok) {
    form.innerHTML = await resp.text();
    const trackingEl = form.querySelector('input[name="digitaltracking"]');
    trackingEl.value = trackingEl.value.replace('/unified-communications/features/', new URL(document.location.href).pathname);

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
      submitForm();
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File not found: ${formUrl} - can not render form`);
  }
  return form;
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

function setFormValue(id, value) {
  const formElement = document.getElementById(id);
  if (formElement) {
    formElement.value = value;
  }
}

function submitForm() {
  const form = document.querySelector("[data-form-type='lead form: apps: contact sales: in page']");
  form.querySelectorAll('input[required], select[required]').forEach((input) => {
    validateInput(input);
  });
  // there's a captcha that needs to be integrated. Thus, there will always be one error flag.
  if (form.querySelectorAll('.Vlt-form__element--error').length <= 1) {
    // fill in composite form fields
    setFormValue('phonenumber', document.getElementById('dialing-code').value + document.getElementById('phone-number-local').value);
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
        document.querySelector('.quote-form .right-column .form').classList.add('submitted');
        if (response.redirected && response.url.includes('success')) {
          document.querySelector('.quote-form .right-column .thank-you').classList.add('success');
        } else {
          // Content to show if form submission wasn't successful?
        }
      });
  }
}

export {
  validateInput, setFormValue, submitForm, fetchFormContent,
};
