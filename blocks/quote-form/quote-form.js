import { div } from '../../scripts/scripts.js';

// TODO: only submit if valid
// TODO: submit fetch to the secondary endpoint (currently submitting to the value specified in the action attr of the form element)
// TODO: Cleanup submitted form data to match what the clients example does:
// pagename=biz%3Amktg%3Aunified-communications
// omnitureid=40299102592989006554421665607769348004
// country=United+States
// utmts=
// PID=
// orderid=
// gclid=
// kwid=
// attributioncampaign=bizdirect
// utmcampaign=bizdirect
// utmcontent=
// utmmedium=
// utmrefererurl=
// utmsource=
// utmterm=
// Area_of_Interest=UC
// digitaltracking=Mobile%3A%3A%3A%3A%3AGet+your+quote%3A%3A%2Funified-communications%2F
// referralid=
// webreferrerurl=www.vonage.com%2Funified-communications%2F
// formfriendly=jsloaded+on+Fri%2C+21+Jul+2023+21%3A48%3A47+GMT+-+1689976127233
// recaptchascore=score
// firstname=Testing
// lastname=Form+Submission
// email=dgranber%40adobe.com
// cc=%2B1
// local=1234567890
// phonenumber=%2B1+1234567890
// companyname=Adobe
// industry=Web%2FMobile+Development
// numberofemployees=1-9
// numberofextensions=1
// privacypolicyoptin=true
// explain=2
// TODO: catch response to the POST (primary presumably).
// TODO: if submission was successful display the celebration content provided in the block
// TODO: add error messages if submission fails.
// TODO: left card style

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

function submitForm() {
  const form = document.querySelector("[data-form-type='lead form: apps: contact sales: in page']");
  form.querySelectorAll('input[required], select[required]').forEach((input) => {
    validateInput(input);
  });
  // there's a captcha that needs to be integrated. Thus, there will always be one error flag.
  if (form.querySelectorAll('.Vlt-form__element--error').length <= 1) {
    const url = form.getAttribute('action');
    // submit form here.
    const formData = new FormData();
    form.querySelectorAll('.Vlt-form__element input, .Vlt-form__element select').forEach((input) => {
      formData.append(input.name, input.value);
    });
    fetch(url, {
      method: 'post',
      body: formData,
    })
      .then(console.log('blarf'));
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

    form.querySelector('button[type="submit"]').addEventListener('click', (e) => {
      e.preventDefault();
      submitForm();
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(`File not found: ${htmlFile} - can not render form`);
  }
}
