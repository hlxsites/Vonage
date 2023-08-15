import { div, span } from '../scripts/scripts.js';

/* TODO:
*   Need to have the time drop down selector update when a date is selected (just like it does on the time zone change
*
* */
const millisPerMinute = 60000;
const millisPerHour = millisPerMinute * 60;
const millisPerDay = millisPerHour * 24;
function isDST(date = new Date()) {
  const january = new Date(
    date.getFullYear(),
    0,
    1,
  ).getTimezoneOffset();
  const july = new Date(
    date.getFullYear(),
    6,
    1,
  ).getTimezoneOffset();

  return Math.max(january, july) !== date.getTimezoneOffset();
}

function getOffsetByTimezone(timeZone) {
  let timeZoneOffset;
  if (isDST) {
    switch (timeZone) {
      case 'Pacific': {
        timeZoneOffset = -7;
        break;
      }
      case 'Mountain': {
        timeZoneOffset = -6;
        break;
      }
      case 'Central': {
        timeZoneOffset = -5;
        break;
      }
      case 'Eastern': {
        timeZoneOffset = -4;
        break;
      }
      default: {
        timeZoneOffset = -4;
        break;
      }
    }
  } else {
    switch (timeZone) {
      case 'Pacific': {
        timeZoneOffset = -8;
        break;
      }
      case 'Mountain': {
        timeZoneOffset = -7;
        break;
      }
      case 'Central': {
        timeZoneOffset = -6;
        break;
      }
      case 'Eastern': {
        timeZoneOffset = -5;
        break;
      }
      default: {
        timeZoneOffset = -5;
        break;
      }
    }
  }
  return { name: timeZone, offset: timeZoneOffset };
}
function calcLocalTimeZone() {
  const timeZoneOffset = -new Date().getTimezoneOffset() / 60;
  let timeZone;
  if (isDST) {
    switch (timeZoneOffset) {
      case -7: {
        timeZone = 'Pacific';
        break;
      }
      case -6: {
        timeZone = 'Mountain';
        break;
      }
      case -5: {
        timeZone = 'Central';
        break;
      }
      case -4: {
        timeZone = 'Eastern';
        break;
      }
      default: {
        timeZone = 'Eastern';
        break;
      }
    }
  } else {
    switch (timeZoneOffset) {
      case -8: {
        timeZone = 'Pacific';
        break;
      }
      case -7: {
        timeZone = 'Mountain';
        break;
      }
      case -6: {
        timeZone = 'Central';
        break;
      }
      case -5: {
        timeZone = 'Eastern';
        break;
      }
      default: {
        timeZone = 'Eastern';
        break;
      }
    }
  }
  return { name: timeZone, offset: timeZoneOffset };
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
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

function createTimeSelector(timeZone, date = new Date()) {
  const timeSelector = div({ class: 'Vlt-form__element time-selector', 'is-required': 'true' });
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
  let tmpDate = new Date(date.valueOf());

  // The allowed scheduling window (in UTC hours)
  const utcSchedulingStart = 13;
  // const utcSchedulingEnd = 22;

  tmpDate.setHours(utcSchedulingStart + timeZone.offset, 0, 0, 0);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 18; i++) {
    const timeOption = div({ class: 'Vlt-dropdown__link', innerHTML: formatAMPM(tmpDate) });

    const compareDate = new Date();
    const localTimeZone = calcLocalTimeZone();
    compareDate.setHours(compareDate.getHours() - (localTimeZone.offset - timeZone.offset), 0, 0, 0);
    if (tmpDate.getTime() - compareDate.getTime() > 0) {
      timeDropDown.append(timeOption);
    }
    tmpDate = new Date(tmpDate.valueOf() + 30 * millisPerMinute);
  }

  timeSelector.querySelector('.Vlt-dropdown__panel__content.Vlt-dropdown__panel__content--scroll-area').append(timeDropDown);

  return timeSelector;
}

function createScheduleElements() {
  const scheduleFormInputs = div({ class: 'bns-reschedule__form-inputs' });

  const dateSelector = div({ class: 'Vlt-form__element date-selector', 'is-required': 'true' });
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

  const timeZone = calcLocalTimeZone();
  const timeSelector = createTimeSelector(timeZone);

  const timeZoneSelector = div({ class: 'Vlt-form__element timezone-selector', 'is-required': 'true' });
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
                                                        <div id="Eastern" class="Vlt-dropdown__link">Eastern</div>
                                                        <div id="Central" class="Vlt-dropdown__link">Central</div>
                                                        <div id="Mountain" class="Vlt-dropdown__link">Mountain</div>
                                                        <div id="Pacific" class="Vlt-dropdown__link">Pacific</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <small class="Vlt-form__element__error Vlt-icon-warning-icon">
                                            <span class="Vlt-form__input-error-label"></span>
                                        </small>
                                    </div>`;

  timeZoneSelector.querySelector('.Vlt-input input').setAttribute('value', timeZone.name);
  timeZoneSelector.querySelectorAll('.Vlt-dropdown__scroll div').forEach((timeZoneLink) => {
    timeZoneLink.addEventListener('click', (event) => {
      let selectedDate;
      if (document.querySelector('input.form-control.input').value !== '') {
        selectedDate = new Date(Date.parse(document.querySelector('input.form-control.input').value));
      } else {
        selectedDate = new Date();
      }

      document.querySelector('.Vlt-form__element.time-selector').replaceWith(createTimeSelector(getOffsetByTimezone(event.target.innerHTML), selectedDate));
      const formElem = document.querySelector('form.Vlt-form');
      formElem.querySelectorAll(' .Vlt-form__element .Vlt-dropdown').forEach((dropDown) => {
        // Add document level click handler per dropdown to listen for clicks outside the dropdown to close it
        document.addEventListener('click', (clickEvent) => {
          const isClickInside = dropDown.contains(clickEvent.target);
          if (!isClickInside) {
            // The click was OUTSIDE the specifiedElement, do something
            dropDown.classList.remove('Vlt-dropdown--expanded');
          }
        });
        dropDown.addEventListener('click', () => {
          dropDown.classList.add('Vlt-dropdown--expanded');
        });
        dropDown.querySelectorAll('.Vlt-dropdown__link').forEach((dropDownLink) => {
          dropDownLink.addEventListener('click', (clickEvent) => {
            dropDown.querySelector('input').setAttribute('value', dropDownLink.innerHTML.trim());
            dropDown.classList.remove('Vlt-dropdown--expanded');
            clickEvent.stopPropagation();
          });
        });
      });
    });
  });

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

      // Add document level click handler per dropdown to listen for clicks outside the dropdown to close it
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
    form.querySelectorAll('.Vlt-form__element input, .Vlt-form__element select, .Vlt-form>input[type="hidden"]').forEach((input) => {
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

export {
  validateInput, setFormValue, submitForm, fetchFormContent,
};
