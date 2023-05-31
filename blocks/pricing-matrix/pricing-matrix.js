import { div } from '../../scripts/scripts.js';

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
  });
  slider.addEventListener('input', (e) => {
    counter.value = e.target.value;
    updateRangeBackground(slider);
  });
  return lineSelector;
}

function parseAndFormatCondition(condition) {
  return condition.replaceAll(/[^0-9=<>]/g, '').replaceAll(' ', '').trim();
}

function annotateConditions(card, conditions) {
  [...card.children].forEach((divEl, i) => {
    const condition = conditions[i];
    const parsedCondition = parseAndFormatCondition(condition);
    if (parsedCondition) {
      divEl.setAttribute('data-range-condition', parsedCondition);
    }
  });
}

export default async function decorate(block) {
  const conditions = [...block.querySelectorAll(':scope > div > div:nth-child(1)')]
    .map((cell) => cell.innerText.trim());

  const offerColumns = [];
  const colCount = block.querySelectorAll(':scope > div > div').length;
  for (let i = 1; i < colCount; i++) {
    offerColumns.push(block.querySelectorAll(`:scope > div > div:nth-child(${i + 1})`));
  }

  block.prepend(lineRangeSelector());
  block.innerText = '';

  const card = div({ class: 'plans-card' });
  card.append(...offerColumns[0]);
  annotateConditions(card, conditions);

  block.append(card);
}
