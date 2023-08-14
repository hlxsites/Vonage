import { div, span } from '../scripts/scripts.js';

/* TODO:
        If the user selects the current date adjust available time options in the time selector drop down to exclude times in the past
        Adjust the times displayed in the time drop down based on the timezone selected
        Validate submission and success / failure behavior
        Add a window resize event handler to adjust the position of the date picker so that it doesn't end up out of sync with the button
 */

const millisPerDay = 86400000;
const millisPerMinute = 60000;

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  return strTime;
}

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

  dateSelector.addEventListener('click', (event) => {
    document.querySelector('.flatpickr-calendar.Vlt-datepicker').classList.add('open');

    event.stopPropagation();
    const buttonRect = scheduleFormInputs.querySelector('.Vlt-input.Vlt-native-dropdown').getBoundingClientRect();
    const dateSelectorModal = document.querySelector('.flatpickr-calendar.Vlt-datepicker');
    const dateSelectorModalRect = dateSelectorModal.getBoundingClientRect();
    const containerOffset = document.querySelector('form div.container').getBoundingClientRect().x;
    const scrollOffset = document.querySelector('.form-overlay__overlay-bnsform').scrollTop;
    if (buttonRect.y + dateSelectorModalRect.height > window.innerHeight) {
      document.querySelectorAll('.flatpickr-calendar.Vlt-datepicker').forEach((datePicker) => {
        datePicker.style = `top: ${buttonRect.y - dateSelectorModalRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
      });
    } else {
      document.querySelectorAll('.flatpickr-calendar.Vlt-datepicker').forEach((datePicker) => {
        datePicker.style = `top: ${buttonRect.y + buttonRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
      });
    }
  });

  // TODO: Need to break this out to a separate method call and one that can be invoked via a change event on the timezone selector
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
            <!--Time drop down options to be dynamically populated based on the time zone specification-->
        </div>
      </div>
    </div>
    <small class="Vlt-form__element__error Vlt-icon-warning-icon">
      <span class="Vlt-form__input-error-label">Required field.</span>
    </small>`;

  const timeDropDown = div({ class: 'Vlt-dropdown__scroll' });

  let tmpDate = new Date();
  // TODO: Need to pass in this value based on the time zone selected or a default value (seems like it should be the users time zone)
  tmpDate.setHours(6, 0, 0, 0);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 18; i++) {
    const timeOption = div({ class: 'Vlt-dropdown__link', innerHTML: formatAMPM(tmpDate) });
    timeDropDown.append(timeOption);
    tmpDate = new Date(tmpDate.valueOf() + 30 * millisPerMinute);
  }

  timeSelector.querySelector('.Vlt-dropdown__panel__content.Vlt-dropdown__panel__content--scroll-area').append(timeDropDown);

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

function createDateSelector(startDate, numberDays, index) {
  const headerMonth = startDate.toLocaleString('default', { month: 'long' });
  const headerYear = startDate.getFullYear();

  const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  // getDay returns 0-6 for Sunday - Monday, the calendar displayed starts on monday so need to offset by however far into the week we are minus 1
  const calendarOffset = firstDayOfMonth.getDay() - 1;
  const calendarDate = new Date(firstDayOfMonth - (calendarOffset * millisPerDay));

  const daysContainer = div({ class: 'dayContainer' });

  let counter = numberDays;
  while (calendarDate <= lastDayOfMonth) {
    const daySpan = span({
      class: 'flatpickr-day',
      'aria-label': `${calendarDate.toLocaleString('default', { month: 'long' })} ${calendarDate.getDate()}, ${calendarDate.getFullYear()}`,
      innerHTML: calendarDate.getDate(),
    });

    const datePadding = 2;
    daySpan.setAttribute('dateString', `${String(calendarDate.getMonth() + 1).padStart(datePadding, '0')}-${String(calendarDate.getDate()).padStart(datePadding, '0')}-${calendarDate.getFullYear()}`);
    if (calendarDate.getMonth() < lastDayOfMonth.getMonth()) {
      daySpan.classList.add('prevMonthDay');
    } else if (calendarDate < startDate) {
      daySpan.classList.add('flatpickr-disabled');
    } else if (calendarDate.getDay() === 0 || calendarDate.getDay() === 6) {
      daySpan.classList.add('flatpickr-disabled');
    } else if (counter < 0) {
      daySpan.classList.add('flatpickr-disabled');
    } else {
      daySpan.addEventListener('click', (event) => {
        daysContainer.querySelectorAll('.flatpickr-day.selected').forEach((day) => {
          day.classList.remove('selected');
        });
        daySpan.classList.add('selected');
        document.querySelector('.Vlt-input.Vlt-native-dropdown .form-control.input').value = event.target.getAttribute('dateString');
        document.querySelector('.flatpickr-calendar.Vlt-datepicker').classList.remove('open');
      });
      counter -= 1;
    }
    daysContainer.append(daySpan);
    calendarDate.setDate(calendarDate.getDate() + 1);
  }

  const dateSelector = div({ class: 'flatpickr-calendar Vlt-datepicker animate showTimeInput', tabIndex: index });
  dateSelector.innerHTML = `
        <div class="Vlt-datepicker__header">
          <span class="Vlt-datepicker__header-month">${headerMonth}</span>
          <span class="Vlt-datepicker__header-year">${headerYear}</span>
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
                      <!--A div containing spans of generated days will be inserted here--> 
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

  dateSelector.querySelector('.Vlt-datepicker__clear').addEventListener('click', () => {
    dateSelector.querySelector('.flatpickr-day.selected').classList.remove('selected');
    document.querySelector('.Vlt-input.Vlt-native-dropdown .form-control.input').value = '';
  });
  dateSelector.querySelector('.flatpickr-days').append(daysContainer);
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

    // If this is a scheduling form need to add the date picker modal
    if (formUrl.includes('schedule')) {
      form.querySelector('.bns-form__fieldset--phone').append(createScheduleElements());

      const schedulingWindow = 10;
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDateObject = getSchedulingWindowEndDate(startDate, schedulingWindow);
      form.append(createDateSelector(startDate, schedulingWindow, 1));

      // Add document level click handler per dropdown to listen for clicks outside of the dropdown to close it
      document.addEventListener('click', (event) => {
        const dateModal = form.querySelector('.flatpickr-calendar.Vlt-datepicker.open');
        if (dateModal) {
          const isClickInside = dateModal.contains(event.target);
          if (!isClickInside) {
            // The click was OUTSIDE the specifiedElement, do something
            dateModal.classList.remove('open');
          }
        }
      });

      if (startDate.getMonth() !== endDateObject.endDate.getMonth()) {
        form.append(createDateSelector(new Date(endDateObject.endDate.getFullYear(), endDateObject.endDate.getMonth(), 1), endDateObject.counter, 2));
        form.querySelectorAll('.Vlt-datepicker__nav-prev').forEach((prevButton) => {
          prevButton.addEventListener('click', () => {
            form.querySelectorAll('.flatpickr-calendar').forEach((datePicker) => {
              datePicker.classList.toggle('open');
            });
          });
        });
        form.querySelectorAll('.Vlt-datepicker__nav-next').forEach((nextButton) => {
          nextButton.addEventListener('click', () => {
            form.querySelectorAll('.flatpickr-calendar').forEach((datePicker) => {
              datePicker.classList.toggle('open');
            });
          });
        });
      } else {
        form.querySelector('.Vlt-datepicker__nav-prev').classList.add('disabled');
        form.querySelector('.Vlt-datepicker__nav-next').classList.add('disabled');
      }
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

function getSchedulingWindowEndDate(startDate, window) {
  const endDate = new Date(startDate);
  let counter = window;
  while (counter > 0 && endDate.getMonth() === startDate.getMonth()) {
    endDate.setDate(endDate.getDate() + 1);
    switch (endDate.getDay()) {
      case 0: break;
      case 1: {
        counter -= 1;
        break;
      }
      case 2: {
        counter -= 1;
        break;
      }
      case 3: {
        counter -= 1;
        break;
      }
      case 4: {
        counter -= 1;
        break;
      }
      case 5: {
        counter -= 1;
        break;
      }
      case 6: break;
      default: break;
    }
  }
  return { endDate, counter };
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
