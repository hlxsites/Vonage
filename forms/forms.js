import { div, span } from '../scripts/scripts.js';

const millisPerMinute = 60000;
const millisPerHour = millisPerMinute * 60;
const millisPerDay = millisPerHour * 24;

/**
 * Check whether a certain date (or if none is specified the current date) would be in DST
 * @param {Date} date - Date to check whether DST would be in effect (defaults to the current date)
 * @returns {boolean} - True if DST is in effect, false if not
 */
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

/**
 * Get the UTC offset for a given timezone
 * @param {string} timeZone - String representation of the timezones displayed in the timezone selector drop down (currently Eastern, Central, Mountain or Pacific)
 * @returns {{offset: number, name: string}} - An object containing the correct UTC offset (taking into account DST) as well as the name of the timezone (same as was input)
 */
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

/**
 * Get the local timezone and UTC offset
 * @returns {{offset: number, name: string}} - An object containing the correct UTC offset (taking into account DST) as well as the name of the timezone (same as was input)
 */
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

/**
 * Returns a representation of the time from the supplied date object suitable for writing in a dropdown menu
 * @param {Date} date - The date object with the desired time set.
 * @returns {string} - String representation of the time suitable for including in a time selector drop down menu (HH:MM AM||PM)
 */
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Add event handlers to perform form validation a form element
 * @param {Element} element - The form element to apply validation to on change / focus loss
 */
function addInputValidation(element) {
  element.addEventListener('change', () => {
    validateInput(element);
  });
  element.addEventListener('focus', () => {
    validateInput(element);
  });

  element.addEventListener('blur', () => {
    const formEl = element.closest('.vlt-form-element');
    formEl.classList.add('vlt-form-element-dirty');
    validateInput(element);
  });
}

/**
 * Create a time drop down selector, time is hard coded presently to start at UTC 13:00 and proceed in 30 minute increments up to UTC 22:00
 * will only display times that are in the future based on the specified time and timezone
 * @param {Object }timeZone - String representation of the timezones displayed in the timezone selector drop down (currently Eastern, Central, Mountain or Pacific)
 * @param {Date} date - The date to generate a time selector
 * @returns {Element} - Time selector as well as the drop down panel with only valid times to display
 */
function createTimeSelector(timeZone = calcLocalTimeZone(), date = new Date()) {
  const timeSelector = div({ class: 'vlt-form-element time-selector', 'is-required': 'true' });
  timeSelector.innerHTML = `
    <div class="vlt-dropdown vlt-dropdown-full-width">
      <div class="vlt-dropdown-trigger vlt-dropdown-trigger-btn">
        <div class="vlt-form-element vlt-form-element-big">
          <div class="vlt-input vlt-native-dropdown vlt-input-error">
            <input type="text" placeholder="Select" name="time" readOnly="readonly" required="required">
              <label class="vlt-form-input-label">Time</label>
          </div>
        </div>
      </div>
      <div class="vlt-dropdown-panel">
        <div class="vlt-dropdown-panel-content vlt-dropdown-panel-content-scroll-area">
            <!--Time drop down options to be dynamically populated based on the time zone specification-->
        </div>
      </div>
    </div>
    <small class="vlt-form-element-error vlt-icon-warning-icon">
      <span class="vlt-form-input-error-label">Required field.</span>
    </small>`;

  const timeDropDown = div({ class: 'vlt-dropdown-scroll' });
  let tmpDate = new Date(date.valueOf());

  // The allowed scheduling window (in UTC hours)
  const utcSchedulingStart = 13;

  tmpDate.setHours(utcSchedulingStart + timeZone.offset, 0, 0, 0);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 18; i++) {
    const timeOption = div({ class: 'vlt-dropdown-link', innerHTML: formatAMPM(tmpDate) });

    const compareDate = new Date();
    const localTimeZone = calcLocalTimeZone();
    compareDate.setHours(compareDate.getHours() - (localTimeZone.offset - timeZone.offset), compareDate.getMinutes(), 0, 0);
    if (tmpDate.getTime() - compareDate.getTime() > 0) {
      timeDropDown.append(timeOption);
    }
    tmpDate = new Date(tmpDate.valueOf() + 30 * millisPerMinute);
  }

  timeSelector.querySelector('.vlt-dropdown-panel-content.vlt-dropdown-panel-content-scroll-area').append(timeDropDown);

  return timeSelector;
}

/**
 * Create a date selector which will toggle a modal calendar window and display the date selected from that calendar
 * @param {Element} form - The form in which the date selector will be added
 * @returns {Element} - The form element which can be clicked to launch the date picker
 */
function createDateSelector(form) {
  const dateSelector = div({ class: 'vlt-form-element date-selector', 'is-required': 'true' });
  dateSelector.innerHTML = `
                                    <div class="vlt-form-element">
                                        <div class="vlt-form-element vlt-form-element-big">
                                            <div class="vlt-input vlt-native-dropdown">
                                                <input name="date" type="hidden" placeholder="Select" required="required" class="flatpickr-input">
                                                <input class="form-control input" placeholder="Select" required="" tabindex="0" type="text" readonly="readonly">
                                                <label class="vlt-form-input-label">Date</label>
                                            </div>
                                        </div>
                                        <small class="vlt-form-element-error vlt-icon-warning-icon">
                                            <span class="vlt-form-input-error-label"></span>
                                        </small>
                                    </div>`;

  dateSelector.addEventListener('click', (event) => {
    event.stopPropagation();
    form.querySelector('.flatpickr-calendar.vlt-datepicker').classList.add('open');
    const buttonRect = form.querySelector('.vlt-input.vlt-native-dropdown').getBoundingClientRect();
    const dateSelectorModal = document.querySelector('.flatpickr-calendar.vlt-datepicker');
    const dateSelectorModalRect = dateSelectorModal.getBoundingClientRect();
    const containerOffset = document.querySelector('form div.container').getBoundingClientRect().x;
    const scrollOffset = document.querySelector('.form-overlay-overlay-bnsform').scrollTop;
    if (buttonRect.y + dateSelectorModalRect.height > window.innerHeight) {
      form.querySelectorAll('.flatpickr-calendar.vlt-datepicker').forEach((datePicker) => {
        datePicker.style = `top: ${buttonRect.y - dateSelectorModalRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
      });
    } else {
      form.querySelectorAll('.flatpickr-calendar.vlt-datepicker').forEach((datePicker) => {
        datePicker.style = `top: ${buttonRect.y + buttonRect.height + scrollOffset}px; left: ${buttonRect.x - containerOffset}px; right: auto;`;
      });
    }
  });
  return dateSelector;
}

/**
 * Create a time zone selector which will on change trigger an update of the time selector
 * @param {Element} form - The form in which the time zone selector will be added
 * @param {{offset: number, name: string}} timeZone - The desired timeZone to have active by default (defaults to the locally calculated time zone of the user
 * @returns {Element} - A timezone selector drop down
 */
function createTimeZoneSelector(form, timeZone = calcLocalTimeZone()) {
  const timeZoneSelector = div({ class: 'vlt-form-element timezone-selector', 'is-required': 'true' });
  timeZoneSelector.innerHTML = `
                                    <div class="vlt-form-element" is-required="true">
                                        <div class="vlt-dropdown vlt-dropdown-full-width">
                                            <div class="vlt-dropdown-trigger vlt-dropdown-trigger-btn">
                                                <div class="vlt-form-element vlt-form-element-big">
                                                    <div class="vlt-input vlt-native-dropdown">
                                                        <input type="text" placeholder="Select" name="tz" readonly="readonly" required="required">
                                                        <label class="vlt-form-input-label">Time Zone</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="vlt-dropdown-panel">
                                                <div class="vlt-dropdown-panel-content vlt-dropdown-panel-content-scroll-area">
                                                    <div class="vlt-dropdown-scroll">
                                                        <div id="Eastern" class="vlt-dropdown-link">Eastern</div>
                                                        <div id="Central" class="vlt-dropdown-link">Central</div>
                                                        <div id="Mountain" class="vlt-dropdown-link">Mountain</div>
                                                        <div id="Pacific" class="vlt-dropdown-link">Pacific</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <small class="vlt-form-element-error vlt-icon-warning-icon">
                                            <span class="vlt-form-input-error-label"></span>
                                        </small>
                                    </div>`;

  timeZoneSelector.querySelector('.vlt-input input').setAttribute('value', timeZone.name);
  timeZoneSelector.querySelectorAll('.vlt-dropdown-scroll div').forEach((timeZoneLink) => {
    timeZoneLink.addEventListener('click', (event) => {
      form.querySelector('.vlt-form-element.time-selector').replaceWith(createTimeSelector(getOffsetByTimezone(event.target.innerHTML), getSelectedDate(form.querySelector('.vlt-form-element.date-selector .form-control.input'))));
      form.querySelectorAll(' .vlt-form-element .vlt-dropdown').forEach((dropDown) => {
        addDropDownClickHandlers(dropDown);
        addOutsideDropDownClickHandler(dropDown);
      });
    });
  });
  return timeZoneSelector;
}

/**
 * Creates all the necessary schedule elements (date selector, time selector and time zone selector for a form with scheduling support
 * @param {Element} form - The form to which the form scheduling elements will be added.
 * @returns {Element} - Container element with all the scheduling form inputs
 */

function createScheduleElements(form) {
  const scheduleFormInputs = div({ class: 'bns-reschedule-form-inputs' });

  // Create the date, time and timezone drop down input fields
  scheduleFormInputs.append(createDateSelector(form));
  const timeZone = calcLocalTimeZone();
  scheduleFormInputs.append(createTimeSelector(timeZone));
  scheduleFormInputs.append(createTimeZoneSelector(form, timeZone));

  // Create the date picker modal elements
  const schedulingWindow = 10;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDateObject = getSchedulingWindowEndDate(startDate, schedulingWindow);
  form.append(createDatePickerModal(form, startDate, schedulingWindow, 1));

  if (startDate.getMonth() !== endDateObject.endDate.getMonth()) {
    form.append(createDatePickerModal(form, new Date(endDateObject.endDate.getFullYear(), endDateObject.endDate.getMonth(), 1), endDateObject.counter, 2));
    form.querySelectorAll('.vlt-datepicker-nav-prev,.vlt-datepicker-nav-next').forEach((button) => {
      button.addEventListener('click', () => {
        form.querySelectorAll('.flatpickr-calendar').forEach((datePicker) => {
          datePicker.classList.toggle('open');
        });
      });
    });
  } else {
    form.querySelectorAll('.vlt-datepicker-nav-prev,.vlt-datepicker-nav-next').forEach((button) => {
      button.classList.add('disabled');
    });
  }

  // Add document level click handler per dropdown to listen for clicks outside the date picker to close it
  document.addEventListener('click', (event) => {
    const dateModal = form.querySelector('.flatpickr-calendar.vlt-datepicker.open');
    if (dateModal) {
      const isClickInside = dateModal.contains(event.target);
      if (!isClickInside) {
        // The click was OUTSIDE the specifiedElement, do something
        dateModal.classList.remove('open');
      }
    }
  });

  // Add event listeners for the immediate / schedule radio button to show and hide the scheduling controls
  form.querySelectorAll('.bns-form-fieldset-phone .vlt-radio').forEach((radio) => {
    radio.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        radio.querySelector('input').checked = true;
        const showScheduleElems = event.target.getAttribute('value');
        const phoneFormFieldSet = form.querySelector('.bns-form-fieldset-phone');
        if (showScheduleElems === 'true' && !form.querySelector('.bns-reschedule-form-inputs')) {
          phoneFormFieldSet.classList.remove('bns-form-fieldset-margin');
          phoneFormFieldSet.append(createScheduleElements(form));
        } else if (showScheduleElems === 'false' && form.querySelector('.bns-reschedule-form-inputs')) {
          form.querySelector('.bns-reschedule-form-inputs').remove();
          phoneFormFieldSet.classList.add('bns-form-fieldset-margin');
        }
      }
    });
  });

  scheduleFormInputs.querySelectorAll(' .vlt-form-element .vlt-dropdown').forEach((dropDown) => {
    // Click handlers for the dropdown elements to update the form value and close the dropdown
    addDropDownClickHandlers(dropDown);
    addOutsideDropDownClickHandler(dropDown);
  });

  scheduleFormInputs.querySelectorAll('input[required], select[required]').forEach(addInputValidation);

  return scheduleFormInputs;
}

/**
 * Get the currently selected date from the date picker
 * @returns {Date} - Parsed date from the value of the date picker
 */
function getSelectedDate(dateSelector) {
  let selectedDate;
  if (dateSelector.value !== '') {
    selectedDate = new Date(Date.parse(dateSelector.value));
  } else {
    selectedDate = new Date();
  }
  return selectedDate;
}

/**
 * Get the currently selected time zone from the time zone selector
 * @param {Element} timeZoneSelector - The timezone selector element in the form to check for a value
 * @returns {string} - The value from the dropdown, or if not specified the calcualted local time zone
 */
function getSelectedTimeZone(timeZoneSelector) {
  let selectedTimeZone = '';
  if (timeZoneSelector.value !== '') {
    selectedTimeZone = timeZoneSelector.getAttribute('value');
  } else {
    selectedTimeZone = calcLocalTimeZone().name;
  }
  return selectedTimeZone;
}

/**
 * Adds click handlers to a dropdown so that on click of a drop down link the dropdown is closed and the value of the drop-down input field is set to the value from the drop-down events target
 * @param {Element} dropDown - The upper level wrapping element of the drop-down panel
 */
function addDropDownClickHandlers(dropDown) {
  dropDown.addEventListener('click', () => {
    dropDown.classList.add('vlt-dropdown-expanded');
  });
  dropDown.querySelectorAll('.vlt-dropdown-link').forEach((dropDownLink) => {
    dropDownLink.addEventListener('click', (clickEvent) => {
      dropDown.querySelector('input').setAttribute('value', dropDownLink.innerHTML.trim());
      dropDown.classList.remove('vlt-dropdown-expanded');
      clickEvent.stopPropagation();
    });
  });
}

/**
 * Adds click handlers to a dropdown so that a click outside the dropdown itself will trigger a close of the drop-down
 * @param {Element} dropDown - The upper level wrapping element of the drop-down panel
 */
function addOutsideDropDownClickHandler(dropDown) {
  // Add event listener to close the dropdown menu if a click outside the dropdown occurs.
  document.addEventListener('click', (clickEvent) => {
    const isClickInside = dropDown.contains(clickEvent.target);
    if (!isClickInside) {
      // The click was OUTSIDE the specifiedElement, do something
      dropDown.classList.remove('vlt-dropdown-expanded');
    }
  });
}

/**
 * Create a date picker modal element which will only show a certain number of days as active
 * @param form - The form from which this date picker will be opened
 * @param startDate - The first date to start iterating from when calculating the active days
 * @param numberDays - How many days to enable in the date picker from the start date (with days in the past, and weekends set to not be included).
 * @param index - Tab index for this date picker
 * @returns {Element} - Date pciker element suitable to use as a modal window opened from the date selector input
 */
function createDatePickerModal(form, startDate, numberDays, index) {
  const headerMonth = startDate.toLocaleString('default', { month: 'long' });
  const headerYear = startDate.getFullYear();

  const datePickerModal = div({ class: 'flatpickr-calendar vlt-datepicker animate showTimeInput', tabIndex: index });
  datePickerModal.innerHTML = `
        <div class="vlt-datepicker-header">
          <span class="vlt-datepicker-header-month">${headerMonth}</span>
          <span class="vlt-datepicker-header-year">${headerYear}</span>
                <div class="vlt-datepicker-nav">
                    <span class="vlt-datepicker-nav-prev"></span>
                    <span class="vlt-datepicker-nav-next"></span>
                </div>
            </div>
            <div class="vlt-datepicker-range">
                <span class="vlt-datepicker-range-start"></span>
                <span class="vlt-datepicker-range-end"></span>
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
            <div class="vlt-datepicker-footer"><button class="vlt-datepicker-clear">Clear</button></div>`;

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
        // Set the hidden date input fields value to the selected date
        form.querySelector('.vlt-input.vlt-native-dropdown .form-control.input').value = event.target.getAttribute('dateString');
        // Close the dete picker modal window
        document.querySelector('.flatpickr-calendar.vlt-datepicker').classList.remove('open');
        // Recreate the time selector
        // TODO: Could improve this to only recreate if changing either from today to another day or from any day to today (the only times the time selector would need to be updated)
        const selectedTimeZone = getOffsetByTimezone(getSelectedTimeZone(form.querySelector('.vlt-form-element.timezone-selector input')));
        const selectedDate = getSelectedDate(form.querySelector('.vlt-form-element.date-selector .form-control.input'));
        form.querySelector('.vlt-form-element.time-selector').replaceWith(createTimeSelector(selectedTimeZone, selectedDate));
        form.querySelectorAll(' .vlt-form-element.time-selector .vlt-dropdown').forEach((dropDown) => {
          addDropDownClickHandlers(dropDown);
          addOutsideDropDownClickHandler(dropDown);
        });
      });
      counter -= 1;
    }
    daysContainer.append(daySpan);
    calendarDate.setDate(calendarDate.getDate() + 1);
  }

  datePickerModal.querySelector('.vlt-datepicker-clear').addEventListener('click', () => {
    datePickerModal.querySelector('.flatpickr-day.selected').classList.remove('selected');
    document.querySelector('.vlt-input.vlt-native-dropdown .form-control.input').value = '';
  });
  datePickerModal.querySelector('.flatpickr-days').append(daysContainer);
  return datePickerModal;
}

/**
 * Function used to fetch and decorate the form content of an embedded or landing-page-hero form.  Returns the form DOM element to insert into the specified formWrapper
 * the formWrapper element is specified in order to reference it in the submit event handler tied to the forms submit button
 * @param formUrl - URI to retrieve the form content to render
 * @param formWrapper - Div element in the page which will contain the form content
*/
async function fetchFormContent(formUrl, formWrapper) {
  const form = div({ class: 'form' });
  const resp = await fetch(formUrl);
  if (resp.ok) {
    form.innerHTML = await resp.text();
    const trackingEl = form.querySelector('input[name="digitaltracking"]');
    trackingEl.value = trackingEl.value.replace('/unified-communications/features/', new URL(document.location.href).pathname);

    // If this is a scheduling form need to add the scheduling inputs as well as the date picker modal
    if (formUrl.includes('schedule')) {
      form.querySelector('.bns-form-fieldset-phone').append(createScheduleElements(form));
    }
    form.querySelectorAll('input[required], select[required]').forEach(addInputValidation);

    const termsCheckBox = form.querySelector('.vlt-checkbox-button .vlt-checkbox-input');
    termsCheckBox.addEventListener('click', (event) => {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton.hasAttribute('disabled') && event.target.checked === true) {
        submitButton.removeAttribute('disabled');
      } else {
        submitButton.setAttribute('disabled', '');
      }
    });

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

/**
 * Calculate the last date that should be displayed in the date picker based on a specified start date and number of days (counting only weekdays).
 * If the window extends past the starting month then the last day of the month is returned as well as a counter indicating how many more dayus of the window remained.
 * @param {Date} startDate - The date from which to start calculating the end date
 * @param {Number} window - The number of week days from the start date to count in order to find the end date to return
 * @returns {{endDate: Date, counter}} - An object representing the end date that was reached based on the counting of weekdays from the start, as well as the remaining number of days if the end of the month was reached
 */
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

/**
 * Perform validation on the specified element and flag it as in error if the validation failed.
 * @param {Element} input - The element triggering validation
 */
function validateInput(input) {
  const formEl = input.closest('.vlt-form-element');
  const isFocused = document.activeElement === input;
  const isValid = input.validity.valid;
  const isDirty = formEl.classList.contains('vlt-form-element-dirty');

  if (isFocused) {
    // remove all alerts when focused
    formEl.classList.remove('vlt-form-element-in-error');
    formEl.classList.remove('vlt-form-element-valid');
    return;
  }

  if (isValid) {
    formEl.classList.remove('vlt-form-element-in-error');
  } else {
    formEl.classList.add('vlt-form-element-in-error');
  }

  if (isValid && isDirty) {
    formEl.classList.add('vlt-form-element-valid');
  } else {
    formEl.classList.remove('vlt-form-element-valid');
  }
}

/**
 * Sets the value of a form element (queried by its id) to the specified value
 * @param {String} id - The id of the form element to update the value of
 * @param {String} value - The value to apply to the form element
 */
function setFormValue(id, value) {
  const formElement = document.getElementById(id);
  if (formElement) {
    formElement.value = value;
  }
}

/**
 * Trigger form validation and submission of the POST to the server
 * @param {Element} formWrapper - The form to submit
 */
function submitForm(formWrapper) {
  const form = formWrapper.querySelector('form');
  form.querySelectorAll('input[required], select[required]').forEach((input) => {
    validateInput(input);
  });
  // there's a captcha that needs to be integrated. Thus, there will always be one error flag.
  if (form.querySelectorAll('.vlt-form-element-in-error').length <= 1) {
    // fill in composite form fields
    if (form.querySelector('[name="cc"]') && form.querySelector('[name="local"]')) {
      setFormValue('phonenumber', form.querySelector('[name="cc"]').value + form.querySelector('[name="local"]').value);
    }

    const url = form.getAttribute('action');

    // submit form here.
    const formData = new FormData();
    form.querySelectorAll('.vlt-form-element input, .vlt-form-element select, .vlt-form>input[type="hidden"]').forEach((input) => {
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
