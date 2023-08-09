import { div } from '../scripts/scripts.js';

/* TODO:
        Dynamically populate the next available dates (two weeks from current) in the date picker / or figure out how to leverage the flatpickr library directly instead of just the rendered html from the clients site
        Hook up the date picker and get it fully working and updating the form field
        Add a window resize event handler to adjust the position of the date picker so that it doesn't end up out of sync with the button
        Add an outside click event handler to close the date picker
        If the user selects the current date adjust available time options in the time selector drop down to exclude times in the past
        Adjust the times displayed in the time drop down based on the timezone selected
        Validate submission and success / failure behavior
 */

function addInputValidation(element) {
  element.addEventListener('change', () => {
    validateInput(element);
  });
  element.addEventListener('focus', () => {
    validateInput(element);
  });

  element.addEventListener('blur', () => {
    const formEl = element.closest('.Vlt-form__element');
    formEl.classList.add('Vlt-form__element--dirty');
    validateInput(element);
  });
}

function createScheduleElements() {
  const scheduleFormInputs = div({ class: 'bns-reschedule__form-inputs' });

  const dateSelector = div({ class: 'Vlt-form__element', 'is-required': 'true' });
  dateSelector.innerHTML = `
                                    <div class="Vlt-form__element">
                                        <div class="Vlt-form__element Vlt-form__element--big">
                                            <div class="Vlt-input Vlt-native-dropdown">
                                                <input name="date" type="hidden" placeholder="Select" required="required" class="flatpickr-input">
                                                <input class="form-control input" placeholder="Select" required="" tabindex="0" type="text" readonly="readonly">
                                                <label class="Vlt-form__input-label">Date</label>
                                            </div>
                                        </div>
                                        <small class="Vlt-form__element__error Vlt-icon-warning-icon">
                                            <span class="Vlt-form__input-error-label"></span>
                                        </small>
                                    </div>`;

  dateSelector.addEventListener('click', () => {
    document.querySelector('.flatpickr-calendar.Vlt-datepicker').classList.add('open');
    const buttonRect = scheduleFormInputs.querySelector('.Vlt-input.Vlt-native-dropdown').getBoundingClientRect();
    const dateSelectorModal = document.querySelector('.flatpickr-calendar.Vlt-datepicker');
    const dateSelectorModalRect = dateSelectorModal.getBoundingClientRect();
    const containerOffset = document.querySelector('form div.container').getBoundingClientRect().x;
    const scrollOffset = document.querySelector('.form-overlay__overlay-bnsform').scrollTop;
    if (buttonRect.y + dateSelectorModalRect.height > window.innerHeight) {
      dateSelectorModal.style = `top: ${buttonRect.y - dateSelectorModalRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
    } else {
      dateSelectorModal.style = `top: ${buttonRect.y + buttonRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
    }
  });

  const timeSelector = div({ class: 'Vlt-form__element', 'is-required': 'true' });
  timeSelector.innerHTML = `
    <div class="Vlt-dropdown Vlt-dropdown--full-width">
      <div class="Vlt-dropdown__trigger Vlt-dropdown__trigger--btn">
        <div class="Vlt-form__element Vlt-form__element--big">
          <div class="Vlt-input Vlt-native-dropdown Vlt-input--error">
            <input type="text" placeholder="Select" name="time" readOnly="readonly" required="required">
              <label class="Vlt-form__input-label">Time</label>
          </div>
        </div>
      </div>
      <div class="Vlt-dropdown__panel">
        <div class="Vlt-dropdown__panel__content Vlt-dropdown__panel__content--scroll-area">
          <div class="Vlt-dropdown__scroll">
            <div class="Vlt-dropdown__link">06:00 AM</div>
            <div class="Vlt-dropdown__link">06:30 AM</div>
            <div class="Vlt-dropdown__link">07:00 AM</div>
            <div class="Vlt-dropdown__link">07:30 AM</div>
            <div class="Vlt-dropdown__link">08:00 AM</div>
            <div class="Vlt-dropdown__link">08:30 AM</div>
            <div class="Vlt-dropdown__link">09:00 AM</div>
            <div class="Vlt-dropdown__link">09:30 AM</div>
            <div class="Vlt-dropdown__link">10:00 AM</div>
            <div class="Vlt-dropdown__link">10:30 AM</div>
            <div class="Vlt-dropdown__link">11:00 AM</div>
            <div class="Vlt-dropdown__link">11:30 AM</div>
            <div class="Vlt-dropdown__link">12:00 PM</div>
            <div class="Vlt-dropdown__link">12:30 PM</div>
            <div class="Vlt-dropdown__link">01:00 PM</div>
            <div class="Vlt-dropdown__link">01:30 PM</div>
            <div class="Vlt-dropdown__link">02:00 PM</div>
            <div class="Vlt-dropdown__link">02:30 PM</div>
          </div>
        </div>
      </div>
    </div>
    <small class="Vlt-form__element__error Vlt-icon-warning-icon">
      <span class="Vlt-form__input-error-label">Required field.</span>
    </small>`;

  const timeZoneSelector = div({ class: 'Vlt-form__element', 'is-required': 'true' });
  timeZoneSelector.innerHTML = `
                                    <div class="Vlt-form__element" is-required="true">
                                        <div class="Vlt-dropdown Vlt-dropdown--full-width">
                                            <div class="Vlt-dropdown__trigger Vlt-dropdown__trigger--btn">
                                                <div class="Vlt-form__element Vlt-form__element--big">
                                                    <div class="Vlt-input Vlt-native-dropdown">
                                                        <input type="text" placeholder="Select" name="tz" readonly="readonly" required="required">
                                                        <label class="Vlt-form__input-label">Time Zone</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="Vlt-dropdown__panel">
                                                <div class="Vlt-dropdown__panel__content Vlt-dropdown__panel__content--scroll-area">
                                                    <div class="Vlt-dropdown__scroll">
                                                        <div class="Vlt-dropdown__link">Eastern</div>
                                                        <div class="Vlt-dropdown__link">Central</div>
                                                        <div class="Vlt-dropdown__link">Mountain</div>
                                                        <div class="Vlt-dropdown__link">Pacific</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <small class="Vlt-form__element__error Vlt-icon-warning-icon">
                                            <span class="Vlt-form__input-error-label"></span>
                                        </small>
                                    </div>`;

  scheduleFormInputs.append(dateSelector);
  scheduleFormInputs.append(timeSelector);
  scheduleFormInputs.append(timeZoneSelector);

  scheduleFormInputs.querySelectorAll('.Vlt-form__element .Vlt-radio').forEach((radio) => {
    radio.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        radio.querySelector('input').checked = true;
        const showScheduleElems = event.target.getAttribute('value');
        if (showScheduleElems === 'true') {
          scheduleFormInputs.querySelector('.bns-form__fieldset--phone').append(createScheduleElements());
        } else {
          scheduleFormInputs.querySelector('.bns-reschedule__form-inputs').remove();
        }
      }
    });
  });

  scheduleFormInputs.querySelectorAll(' .Vlt-form__element .Vlt-dropdown').forEach((dropDown) => {
    // Add document level click handler per dropdown to listen for clicks outside of the dropdown to close it
    document.addEventListener('click', (event) => {
      const isClickInside = dropDown.contains(event.target);
      if (!isClickInside) {
        // The click was OUTSIDE the specifiedElement, do something
        dropDown.classList.remove('Vlt-dropdown--expanded');
      }
    });
    dropDown.addEventListener('click', () => {
      dropDown.classList.add('Vlt-dropdown--expanded');
    });
    dropDown.querySelectorAll('.Vlt-dropdown__link').forEach((dropDownLink) => {
      dropDownLink.addEventListener('click', (event) => {
        dropDown.querySelector('input').setAttribute('value', dropDownLink.innerHTML.trim());
        dropDown.classList.remove('Vlt-dropdown--expanded');
        event.stopPropagation();
      });
    });
  });

  scheduleFormInputs.querySelectorAll('input[required], select[required]').forEach(addInputValidation);

  return scheduleFormInputs;
}

function createDateSelector() {
  const dateSelector = div({ class: 'flatpickr-calendar Vlt-datepicker animate showTimeInput', tabIndex: '-1', style: 'top: 269px; left: 641.484px; right: auto;' });
  dateSelector.innerHTML = `
        <div class="Vlt-datepicker__header">
            <span class="Vlt-datepicker__header-month">August </span>
            <span class="Vlt-datepicker__header-year">2023</span>
                <div class="Vlt-datepicker__nav">
                    <span class="Vlt-datepicker__nav-prev"></span>
                    <span class="Vlt-datepicker__nav-next"></span>
                </div>
            </div>
            <div class="Vlt-datepicker__range">
                <span class="Vlt-datepicker__range-start"></span>
                <span class="Vlt-datepicker__range-end"></span>
            </div>
            <div class="flatpickr-innerContainer">
                <div class="flatpickr-rContainer">
                    <div class="flatpickr-weekdays">
                        <div class="flatpickr-weekdaycontainer">
                            <span class="flatpickr-weekday">Mon</span>
                            <span class="flatpickr-weekday">Tue</span>
                            <span class="flatpickr-weekday">Wed</span>
                            <span class="flatpickr-weekday">Thu</span>
                            <span class="flatpickr-weekday">Fri</span>
                            <span class="flatpickr-weekday">Sat</span>
                            <span class="flatpickr-weekday">Sun</span>
                        </div>
                    </div>
                    <div class="flatpickr-days" tabindex="-1">
                        <div class="dayContainer">
                            <span class="flatpickr-day prevMonthDay flatpickr-disabled" aria-label="July 31, 2023">31</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 1, 2023">1</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 2, 2023">2</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 3, 2023">3</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 4, 2023">4</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 5, 2023">5</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 6, 2023">6</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 7, 2023">7</span>
                            <span class="flatpickr-day today" aria-label="August 8, 2023" aria-current="date" tabindex="-1">8</span>
                            <span class="flatpickr-day selected" aria-label="August 9, 2023" tabindex="-1">9</span>
                            <span class="flatpickr-day " aria-label="August 10, 2023" tabindex="-1">10</span>
                            <span class="flatpickr-day " aria-label="August 11, 2023" tabindex="-1">11</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 12, 2023">12</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 13, 2023">13</span>
                            <span class="flatpickr-day " aria-label="August 14, 2023" tabindex="-1">14</span>
                            <span class="flatpickr-day " aria-label="August 15, 2023" tabindex="-1">15</span>
                            <span class="flatpickr-day " aria-label="August 16, 2023" tabindex="-1">16</span>
                            <span class="flatpickr-day " aria-label="August 17, 2023" tabindex="-1">17</span>
                            <span class="flatpickr-day " aria-label="August 18, 2023" tabindex="-1">18</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 19, 2023">19</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 20, 2023">20</span>
                            <span class="flatpickr-day " aria-label="August 21, 2023" tabindex="-1">21</span>
                            <span class="flatpickr-day " aria-label="August 22, 2023" tabindex="-1">22</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 23, 2023">23</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 24, 2023">24</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 25, 2023">25</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 26, 2023">26</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 27, 2023">27</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 28, 2023">28</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 29, 2023">29</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 30, 2023">30</span>
                            <span class="flatpickr-day flatpickr-disabled" aria-label="August 31, 2023">31</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 1, 2023">1</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 2, 2023">2</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 3, 2023">3</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 4, 2023">4</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 5, 2023">5</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 6, 2023">6</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 7, 2023">7</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 8, 2023">8</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 9, 2023">9</span>
                            <span class="flatpickr-day nextMonthDay flatpickr-disabled" aria-label="September 10, 2023">10</span>
                        </div>
                    </div>
                    <div class="Vlt-datepicker__months">
                        <span class="Vlt-datepicker__month" data-month="0">Jan</span>
                        <span class="Vlt-datepicker__month" data-month="1">Feb</span>
                        <span class="Vlt-datepicker__month" data-month="2">Mar</span>
                        <span class="Vlt-datepicker__month" data-month="3">Apr</span>
                        <span class="Vlt-datepicker__month" data-month="4">May</span>
                        <span class="Vlt-datepicker__month" data-month="5">Jun</span>
                        <span class="Vlt-datepicker__month" data-month="6">Jul</span>
                        <span class="Vlt-datepicker__month" data-month="7">Aug</span>
                        <span class="Vlt-datepicker__month Vlt-datepicker__month-disabled" data-month="8">Sep</span>
                        <span class="Vlt-datepicker__month Vlt-datepicker__month-disabled" data-month="9">Oct</span>
                        <span class="Vlt-datepicker__month Vlt-datepicker__month-disabled" data-month="10">Nov</span>
                        <span class="Vlt-datepicker__month Vlt-datepicker__month-disabled" data-month="11">Dec</span>
                    </div>
                </div>
            </div>
            <div class="Vlt-datepicker__footer"><button class="Vlt-datepicker__clear">Clear</button></div>`;
  return dateSelector;
}
async function fetchFormContent(formUrl, formWrapper) {
  const form = div({ class: 'form' });
  const resp = await fetch(formUrl);
  if (resp.ok) {
    form.innerHTML = await resp.text();
    const trackingEl = form.querySelector('input[name="digitaltracking"]');
    trackingEl.value = trackingEl.value.replace('/unified-communications/features/', new URL(document.location.href).pathname);

    form.querySelectorAll('.bns-form__fieldset--phone .Vlt-radio').forEach((radio) => {
      radio.addEventListener('click', (event) => {
        if (event.target.type === 'radio') {
          radio.querySelector('input').checked = true;
          const showScheduleElems = event.target.getAttribute('value');
          const phoneFormFieldSet = form.querySelector('.bns-form__fieldset--phone');
          if (showScheduleElems === 'true' && !form.querySelector('.bns-reschedule__form-inputs')) {
            phoneFormFieldSet.classList.remove('bns-form__fieldset--margin');
            phoneFormFieldSet.append(createScheduleElements());
          } else if (showScheduleElems === 'false' && form.querySelector('.bns-reschedule__form-inputs')) {
            form.querySelector('.bns-reschedule__form-inputs').remove();
            phoneFormFieldSet.classList.add('bns-form__fieldset--margin');
          }
        }
      });
    });

    // If this is a scheduling from need to add the date picker modal
    if (formUrl.includes('schedule')) {
      form.querySelector('.bns-form__fieldset--phone').append(createScheduleElements());
      form.append(createDateSelector());
    }

    form.querySelectorAll('input[required], select[required]').forEach(addInputValidation);

    form.querySelector('button[type="submit"]').addEventListener('click', (e) => {
      e.preventDefault();
      submitForm(formWrapper);
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

function submitForm(formWrapper) {
  const form = formWrapper.querySelector('form');
  form.querySelectorAll('input[required], select[required]').forEach((input) => {
    validateInput(input);
  });
  // there's a captcha that needs to be integrated. Thus, there will always be one error flag.
  if (form.querySelectorAll('.Vlt-form__element--error').length <= 1) {
    // fill in composite form fields
    if (form.querySelector('[name="cc"]') && form.querySelector('[name="local"]')) {
      setFormValue('phonenumber', form.querySelector('[name="cc"]').value + form.querySelector('[name="local"]').value);
    }

    const url = form.getAttribute('action');

    // submit form here.
    const formData = new FormData();
    form.querySelectorAll('.Vlt-form__element input, .Vlt-form__element select, input[type="hidden"]').forEach((input) => {
      if (input.name !== '') {
        formData.append(input.name, input.value);
      }
    });
    fetch(url, {
      // TODO: Flip the method back to post and uncomment the body once done testing submission and failure behavior locally
      method: 'get',
      // body: formData,
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

export {
  validateInput, setFormValue, submitForm, fetchFormContent,
};
