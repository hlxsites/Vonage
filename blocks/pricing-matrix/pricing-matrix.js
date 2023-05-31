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

export default async function decorate(block) {
  const lineSelector = document.createElement('div');
  lineSelector.innerHTML = `<div class="quantity-selector">
    <input id="employee-counter" autocomplete="off" class="quantity-count" type="text" name="counter"
           value="1" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
    <div class="widget-range " aria-hidden="true">
        <div class="range-length">
            <div class="range-start">1</div>
            <div class="range-end">1000 +</div>
        </div>
        <input id="slider" autocomplete="off" tabindex="-1" aria-hidden="true" class="quantity-range"
               type="range" min="1" max="99" value="0" data-s1-min="1" data-s1-max="49" data-s2-min="49"
               data-s2-max="499" data-s3-min="499" data-s3-max="1000"
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
  block.prepend(lineSelector);

  // workaround to color the slider. Chrome does not support the -moz-range-progress pseudo-element
  const rangeEl = lineSelector.querySelector('#slider');
  updateRangeBackground(rangeEl);
  rangeEl.addEventListener('input', () => updateRangeBackground(rangeEl));
}
