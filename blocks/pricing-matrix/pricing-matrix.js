/* eslint-disable radix */
import { div } from '../../scripts/scripts.js';

/**
 *
 * @param numberOfLines {integer}
 * @param block {HTMLDivElement}
 */
function updateConditionalElements(numberOfLines, block) {
  // activate one price variant in each card
  block.querySelectorAll('.plans-card').forEach((card) => {
    // find the first price variant that is within the range of lines
    const firstPriceWithinMaxLines = [...card.querySelectorAll('[data-maxlines]')]
      .sort((a, b) => parseInt(a.dataset.maxlines) - parseInt(b.dataset.maxlines))
      .find((element) => numberOfLines <= element.dataset.maxlines);

    [...card.querySelectorAll('[data-maxlines]')].forEach((element) => {
      if (element === firstPriceWithinMaxLines) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    });
  });
}

// map values to 3 scales, 1-49, 50-500, 501-1000
const stops = [49, 500, 1000];
const nativeStops = [333, 666, 1000];

/**
 * maps the input range value to the customer segment scale.
 * e.g. 333 becomes 49, 666 becomes 500, 1000 becomes 1000.
 *
 * @param inputRangeValue {number} native range value, 0-1000
 * @return {number} customer segment scale value, 1-1000
 */
function mapValueToCustomerSegmentScale(inputRangeValue) {
  if (inputRangeValue <= nativeStops[0]) {
    // eslint-disable-next-line no-mixed-operators
    return Math.round(inputRangeValue / nativeStops[0] * stops[0]) || 1;
    // eslint-disable-next-line no-else-return
  } else if (inputRangeValue <= nativeStops[1]) {
    const ratio = (inputRangeValue - nativeStops[0]) / (nativeStops[1] - nativeStops[0]);
    return Math.round(stops[0] + ratio * (stops[1] - stops[0]));
  } else {
    const ratio = (inputRangeValue - nativeStops[1]) / (nativeStops[2] - nativeStops[1]);
    return Math.round(stops[1] + ratio * (stops[2] - stops[1]));
  }
}

/**
 * maps the customer segment scale to the native range scale.
 * e.g. 49 becomes 333, 500 becomes 666, 1000 becomes 1000.
 * @param userCount
 * @return {number}
 */
function mapCustomerSegmentToNativeScale(userCount) {
  if (userCount <= stops[0]) {
    // eslint-disable-next-line no-mixed-operators
    return Math.round(userCount / stops[0] * nativeStops[0]);
    // eslint-disable-next-line no-else-return
  } else if (userCount <= stops[1]) {
    const ratio = (userCount - stops[0]) / (stops[1] - stops[0]);
    return Math.round(nativeStops[0] + ratio * (nativeStops[1] - nativeStops[0]));
  } else {
    const ratio = (userCount - stops[1]) / (stops[2] - stops[1]);
    return Math.round(nativeStops[1] + ratio * (nativeStops[2] - nativeStops[1]));
  }
}

function updateBuyNowButtons(userCount, block) {
  // e.g. https://www.vonage.com/promo/buy/cart/?sku=SSU000&quantity=3&couponcode=SOMECODE
  block.querySelectorAll('a[href]').forEach((link) => {
    if (link.href.includes('quantity=')) {
      const url = new URL(link.href);
      url.searchParams.set('quantity', userCount);
      link.href = url.toJSON();
    }
  });
}

/**
 * creates a line range selector.
 * @return {HTMLDivElement}
 */
function lineRangeSelector(block) {
  /**
   * Update the background of the range slider to show the progress.
   * This is a workaround for Chrome, which does not support the -moz-range-progress pseudo-element.
   * @param rangeEl {HTMLInputElement}
   */
  function updateRangeBackground(rangeEl) {
    // eslint-disable-next-line no-mixed-operators
    const progress = 100.0 * rangeEl.value / rangeEl.max;
    rangeEl.style.background = `linear-gradient(to right, 
    var(--accent-color) 0%, 
    var(--accent-color) ${progress}%, 
    white ${progress}%, 
    white 100%)`;
  }

  const label = block.closest('.section').querySelector('h2');
  console.log('label', label.id);

  const lineSelector = document.createElement('div');
  lineSelector.innerHTML = `<div class="quantity-selector">
    <input autocomplete="off" class="quantity-count" type="text" name="counter" value="1"  aria-labelledby="${label?.id}">
    <div class="widget-range " aria-hidden="true">
        <div class="range-length">
            <div class="range-start">1</div>
            <div class="range-end">1000 +</div>
        </div>
        <input id="slider" autocomplete="off"  aria-hidden="true" class="quantity-range"
               type="range" min="1" max="1000" value="1" >
        <div class="ranges">
            <div>Small</div>
            <div class="divider">&nbsp;</div>
            <div>Medium</div>
            <div class="divider">&nbsp;</div>
            <div>Enterprise</div>
        </div>
    </div>
</div>
`;
  const counter = lineSelector.querySelector('.quantity-count');
  const slider = lineSelector.querySelector('#slider');

  counter.addEventListener('input', (e) => {
    counter.value = e.target.value.replace(/[^0-9]/g, '');

    slider.value = mapCustomerSegmentToNativeScale(counter.value);
    updateRangeBackground(slider);
    updateConditionalElements(parseInt(counter.value || 1), block);
    updateBuyNowButtons(counter.value, block);
  });

  slider.addEventListener('input', (e) => {
    counter.value = mapValueToCustomerSegmentScale(e.target.value);

    updateRangeBackground(slider);
    updateConditionalElements(parseInt(counter.value), block);
    updateBuyNowButtons(counter.value, block);
  });
  return lineSelector;
}

function annotateConditions(card, conditions) {
  function parseAndFormatCondition(condition) {
    const cond = condition.replaceAll(/[^0-9=<>]/g, '').replaceAll(' ', '').trim();
    if (cond.startsWith('<=')) {
      return ['maxlines', parseInt(cond.replace('<=', ''))];
    }
    if (cond.startsWith('<')) {
      return ['maxlines', parseInt(cond.replace('<', '')) - 1];
    }
    if (cond.startsWith('>=')) {
      return ['minlines', parseInt(cond.replace('>=', ''))];
    }
    if (cond.startsWith('>')) {
      return ['minlines', parseInt(cond.replace('>', '')) + 1];
    }
    return [null, null];
  }

  [...card.children].forEach((divEl, i) => {
    const condition = conditions[i];
    const [attribute, value] = parseAndFormatCondition(condition);
    if (attribute) {
      divEl.dataset[attribute] = value;
    }
  });
}

function decorateCard(card) {
  const childrenArray = [...card.children];
  childrenArray[0].classList.add('plan-tag');

  childrenArray[1].classList.add('plan-basic-info');

  // last row has text. Anything in between are price variants.
  // eslint-disable-next-line no-plusplus
  for (let i = 2; i < childrenArray.length - 1; i++) {
    childrenArray[i].classList.add('plan-price');
    [...childrenArray[i].children].forEach((child, index) => {
      if (index === 0) {
        child.classList.add('plan-price-value');
      } else if (child.classList.contains('button-container')) {
        // unwrap from any <EM> tags
        if (child.firstElementChild.tagName === 'EM') {
          child.firstElementChild.replaceWith(child.firstElementChild.firstElementChild);
        }
      } else {
        child.classList.add('plan-price-description');
      }
    });
  }

  childrenArray.at(-1).classList.add('plan-basic-features');

  // wrap everything except the tag in a div
  card.append(div({ class: 'plan-content' }, ...childrenArray.slice(1)));
}


export default async function decorate(block) {
  const conditions = [...block.querySelectorAll(':scope > div > div:nth-child(1)')]
    .map((cell) => cell.innerText.trim());

  const offerColumns = [];
  const colCount = block.firstElementChild.childElementCount;
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < colCount; i++) {
    offerColumns.push(block.querySelectorAll(`:scope > div > div:nth-child(${i + 1})`));
  }

  block.innerText = '';
  block.prepend(lineRangeSelector(block));

  const plans = div({ class: 'plans' });

  offerColumns.forEach((column) => {
    const card = div({ class: 'plans-card' });
    card.append(...column);
    annotateConditions(card, conditions);
    decorateCard(card);
    plans.append(card);
  });

  block.append(plans);

  updateConditionalElements(parseInt(block.querySelector('.quantity-count').value), block);
  updateBuyNowButtons(parseInt(block.querySelector('.quantity-count').value), block);
}
