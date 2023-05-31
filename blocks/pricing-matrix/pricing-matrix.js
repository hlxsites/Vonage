/* eslint-disable radix */
import { div } from '../../scripts/scripts.js';

/**
 *
 * @param numberOfLines {integer}
 */
function updateConditionalElements(numberOfLines) {
  const firstPriceWithinMaxLines = [...document.querySelectorAll('[data-maxlines]')]
    .sort((a, b) => parseInt(a.dataset.maxlines) - parseInt(b.dataset.maxlines))
    .find((element) => numberOfLines <= element.dataset.maxlines);

  [...document.querySelectorAll('[data-maxlines]')].forEach((element) => {
    if (element === firstPriceWithinMaxLines) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}

/**
 * creates a line range selector.
 * @return {HTMLDivElement}
 */
function lineRangeSelector() {
  /**
   * Update the background of the range slider to show the progress.
   * This is a workaround for Chrome, which does not support the -moz-range-progress pseudo-element.
   * @param rangeEl {HTMLInputElement}
   */
  function updateRangeBackground(rangeEl) {
    // eslint-disable-next-line no-mixed-operators
    const progress = 100.0 * rangeEl.value / rangeEl.max;
    rangeEl.style.background = `linear-gradient(to right, 
    rgb(136, 31, 255) 0%, 
    rgb(136, 31, 255) ${progress}%, 
    rgb(255, 255, 255) ${progress}%, 
    white 100%)`;
  }

  const lineSelector = document.createElement('div');
  lineSelector.innerHTML = `<div class="quantity-selector">
    <input id="employee-counter" autocomplete="off" class="quantity-count" type="text" name="counter" value="1">
    <div class="widget-range " aria-hidden="true">
        <div class="range-length">
            <div class="range-start">1</div>
            <div class="range-end">1000 +</div>
        </div>
        <input id="slider" autocomplete="off" tabindex="-1" aria-hidden="true" class="quantity-range"
               type="range" min="1" max="1000" value="1"  
               
               style=";">
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
  const counter = lineSelector.querySelector('#employee-counter');
  const slider = lineSelector.querySelector('#slider');

  counter.addEventListener('input', (e) => {
    counter.value = e.target.value.replace(/[^0-9]/g, '');

    slider.value = counter.value;
    updateRangeBackground(slider);
    updateConditionalElements(parseInt(counter.value));
  });
  slider.addEventListener('input', (e) => {
    counter.value = e.target.value;
    updateRangeBackground(slider);
    updateConditionalElements(parseInt(counter.value));
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
}

export default async function decorate(block) {
  const conditions = [...block.querySelectorAll(':scope > div > div:nth-child(1)')]
    .map((cell) => cell.innerText.trim());

  const offerColumns = [];
  const colCount = block.querySelectorAll(':scope > div > div').length;
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < colCount; i++) {
    offerColumns.push(block.querySelectorAll(`:scope > div > div:nth-child(${i + 1})`));
  }

  block.innerText = '';
  block.prepend(lineRangeSelector());

  const plans = div({ class: 'plans' });
  const card = div({ class: 'plans-card' });
  card.append(...offerColumns[0]);
  decorateCard(card);

  annotateConditions(card, conditions);

  plans.append(card);
  block.append(plans);

  updateConditionalElements(parseInt(block.querySelector('#employee-counter').value));
}
