import { div } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import { setFormValue, fetchFormContent } from '../../forms/forms.js';

export default async function decorate(block) {
  if (block.classList.contains('full-screen')) {
    const htmlFile = block.querySelector('p').textContent;
    const thankYouMesage = [...block.children];

    block.querySelector('p').remove();

    block.append(div({ class: 'thank-you' }, ...thankYouMesage));
    const formContainer = document.querySelector('.embedded-form') ? document.querySelector('.embedded-form') : document.querySelector('.fragment-container.embedded-form .fragment.block');
    block.append(await fetchFormContent(`/forms/${htmlFile}`, formContainer));
  } else {
    const cardWrapper = block.querySelector(':scope > div > div:first-child');
    cardWrapper.classList.add('card-wrapper');
    await decorateCard(cardWrapper);

    const rightColumnWrapper = block.querySelector(':scope > div > div:last-child');
    rightColumnWrapper.classList.add('right-column-wrapper');

    await decorateRightColumn(rightColumnWrapper);
  }

  // Fetch and set properties for hidden form fields populated via page metadata
  block.querySelectorAll('input[type="hidden"]').forEach((field) => {
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
  const formContainer = document.querySelector('.embedded-form') ? document.querySelector('.embedded-form') : document.querySelector('.fragment-container.embedded-form .fragment.block');

  rightColumn.append(await fetchFormContent(`/forms/${htmlFile}`, formContainer));

  formWrapper.textContent = '';
  formWrapper.append(rightColumn);
}

const content = `<div id="main-content" class="main-content--ecommerce">
  <div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
    <div class="bestNextStepForm aem-GridColumn aem-GridColumn--default--12">
      <section class="best-next-step">
        <div class="container bns-form">
          <div class="vng-modal v-loading__modal vng-modal--full">
            <section id="v0-modal" role="dialog" aria-modal="true" aria-labelledby="v0-modal-trigger"
                     class="vng-modal__overlay">
              <div class="vng-modal__backdrop"></div>
              <div class="vng-modal__content-wrapper">
                <div class="row no-gutters justify-content-md-center">
                  <div class="col-12">
                    <div class="vng-modal__content"><!---->
                      <section class="v-loading__content">
                        <div>
                          <div id="loading-div">
                            <div id="cup">
                              <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
                                <linearGradient id="my-cool-gradient" x2="1" y2="1">
                                  <stop offset="0%" stop-color="#d45662"></stop>
                                  <stop offset="50%" stop-color="#a33bac"></stop>
                                  <stop offset="100%" stop-color="#7f3ece"></stop>
                                </linearGradient>
                              </svg>
                              <svg class="tea" width="111" height="144" viewBox="0 0 37 48" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M27.0819 17H3.02508C1.91076 17 1.01376 17.9059 1.0485 19.0197C1.15761 22.5177 1.49703 29.7374 2.5 34C4.07125 40.6778 7.18553 44.8868 8.44856 46.3845C8.79051 46.79 9.29799 47 9.82843 47H20.0218C20.639 47 21.2193 46.7159 21.5659 46.2052C22.6765 44.5687 25.2312 40.4282 27.5 34C28.9757 29.8188 29.084 22.4043 29.0441 18.9156C29.0319 17.8436 28.1539 17 27.0819 17Z"
                                  stroke="var(--secondary)" stroke-width="2"
                                  style="fill:url(#my-cool-gradient) #6e4998;"></path>
                                <path
                                  d="M29 23.5C29 23.5 34.5 20.5 35.5 25.4999C36.0986 28.4926 34.2033 31.5383 32 32.8713C29.4555 34.4108 28 34 28 34"
                                  stroke="var(--secondary)" stroke-width="2"></path>
                                <g id="swing">
                                  <path id="teabag" fill="var(--secondary)" fill-rule="evenodd" clip-rule="evenodd"
                                        d="M16 25V17H14V25H12C10.3431 25 9 26.3431 9 28V34C9 35.6569 10.3431 37 12 37H18C19.6569 37 21 35.6569 21 34V28C21 26.3431 19.6569 25 18 25H16ZM11 28C11 27.4477 11.4477 27 12 27H18C18.5523 27 19 27.4477 19 28V34C19 34.5523 18.5523 35 18 35H12C11.4477 35 11 34.5523 11 34V28Z"
                                        style="fill: white;"></path>
                                  <path id="tag" class="cls-1"
                                        d="M11,28a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1H12a1,1,0,0,1-1-1Z"
                                        style="fill: #ab4090;"></path>
                                </g>
                                <path id="steamL" d="M17 1C17 1 17 4.5 14 6.5C11 8.5 11 12 11 12" stroke-width="2"
                                      stroke-linecap="round" stroke-linejoin="round" stroke="var(--secondary)"></path>
                                <path id="steamR" d="M21 6C21 6 21 8.22727 19 9.5C17 10.7727 17 13 17 13"
                                      stroke="var(--secondary)" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round"></path>
                              </svg>
                            </div>
                            <div id="tagline">
                              <div class="visible">
                                <ul>
                                  <li>Generating witty dialog...</li>
                                  <li>At least you're not on hold...</li>
                                  <li>Don't think of purple hippos...</li>
                                  <li>Hum something loud while others stare...</li>
                                  <li>Unicorns are at the end of this road, I promise...</li>
                                  <li>Granting wishes...</li>
                                  <li>We're testing your patience...</li>
                                  <li>I swear it's almost done...</li>
                                  <li>Let's take a mindfulness minute...</li>
                                  <li>My other loading screen is much faster...</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <svg id="v-loading__icon" xmlns="http://www.w3.org/2000/svg"
                               xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 688.800000 600"
                               shape-rendering="geometricPrecision" text-rendering="geometricPrecision" tabIndex="0"
                               role="img" class="v-loading__icon v-loading__icon--small"><title>
                            loading
                          </title>
                            <g transform="translate(344.399994,300) rotate(0)" class="v-loading__icon-group">
                              <path
                                d="M266.300000,289L136,0L0,0L195.100000,439C195.600000,440.200000,197.100000,440.800000,198.300000,440.200000C198.800000,440,199.300000,439.500000,199.500000,439L266.300000,289ZM550.300000,0C550.300000,0,373.900000,398,351.800000,446.700000C299.100000,563.100000,260,592.200000,220.200000,598.500000C219.800000,598.600000,219.500000,599,219.600000,599.400000C219.700000,599.800000,220,600,220.300000,600L344.900000,600C399.700000,600,437.300000,563.100000,490.100000,446.700000C508.500000,406,688.800000,0,688.800000,0L550.300000,0Z"
                                transform="scale(0.750000,0.750000) translate(-344.399994,-300)" fill="currentColor"
                                stroke="none" stroke-width="1"></path>
                            </g>
                          </svg>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="bns-form__inner Vlt-form">
              <!--FORM content gets loaded here-->
          </div>
        </div>
      </section>
    </div>
    <div class="endNote aem-GridColumn aem-GridColumn--default--12">
      <div class="end-note-block  end-note-block--keyline">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="end-note">
                <div class="end-note__content">
                  <p>*Please note our business hours are 9am - 6pm ET, Monday - Friday. If it is after business hours,
                    we will contact you the next business day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
