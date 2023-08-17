import {
  button, div, h3, p, span,
} from '../../scripts/scripts.js';

const currencyLabels = [
  { currency: 'usd', label: '$US', symbol: '$' },
  { currency: 'euro', label: '€EURO', symbol: '€' }];

function handleTabButtonClick(event) {
  if (event.target.getAttribute('aria-selected') === 'false') {
    const tabIndex = event.target.getAttribute('tabindex');
    document.querySelectorAll('button.tabs-tab').forEach((buttonElem) => {
      buttonElem.setAttribute('aria-selected', buttonElem.getAttribute('aria-selected') === 'false' ? 'true' : 'false');
      document.querySelectorAll(`div.tabs-panel:not([tabindex="${tabIndex}"])`).forEach((tabElem) => {
        tabElem.setAttribute('aria-hidden', 'true');
      });
      document.querySelector(`div.tabs-panel[tabindex="${tabIndex}"]`).setAttribute('aria-hidden', 'false');
    });
  }
}

function populatePricingGrid(block, currencies, pricingData, endNoteContent) {
  currencies.forEach((currency, index) => {
    const currencyIndex = currencyLabels.findIndex((item) => item.currency === currency);
    const currencyLabel = currencyLabels[currencyIndex].label;
    const currencySymbol = currencyLabels[currencyIndex].symbol;

    // Check if the block already has a button, if not set the first button as true for selected, otherwise set false for not
    const selectedVal = !block.querySelector('button.tabs-tab');

    const tabButtonElem = button({
      class: 'tabs-tab', 'aria-controls': 'panel', 'aria-selected': selectedVal, id: 'tab', role: 'tab', tabIndex: index, innerHTML: currencyLabel,
    });

    tabButtonElem.addEventListener('click', handleTabButtonClick);
    block.querySelector('div.tabs-tabs').append(tabButtonElem);

    // Check if the block already has a tab, if not set the first tab as false for hidden, otherwise set true for hidden
    const hiddenVal = !!block.querySelector('section.product-card-tabbed .tabs-panel');

    // Built by appending pricingCardOption elements to the pricing-card-card div container
    const tabElem = div(
      {
        class: 'tabs-panel', tabIndex: index, 'aria-hidden': hiddenVal, id: 'panel', role: 'tab-panel',
      },
      div(
        { class: 'pricing-card' },
        div(
          { class: 'container' },
          div(
            { class: 'row' },
            div(
              { class: 'col-12' },
              div({ class: 'pricing-card-card not-dynamic' }),
            ),
          ),
        ),
      ),
    );

    pricingData.forEach((tier) => {
      // Built out by appending pricingCardOffer elements to the main div based on the supplied data
      const pricingCardOption = div(
        { class: 'pricing-card-option' },
        h3({ class: 'pricing-card-option-product', innerHTML: tier.data[0].label }),
      );

      tier.data.forEach((pricingRow) => {
        // Built by instantiating while providing the values per row of the returned pricing data
        const pricingCardOffer = div(
          { class: 'pricing-card-offer' },
          span({ class: 'pricing-card-offer-name', innerHTML: Number(pricingRow[currency]).toLocaleString('en-US') }),
          div(
            { class: 'pricing-card-offer-price-container' },
            span({ class: 'pricing-card-offer-price', innerHTML: currencySymbol + Number(pricingRow[currency]).toLocaleString('en-US') }),
          ),
        );
        pricingCardOption.append(pricingCardOffer);
      });
      tabElem.querySelector('.pricing-card-card').append(pricingCardOption);
    });

    const endNoteElem = div(
      { class: 'end-note' },
      div(
        { class: 'end-note-content' },
        p({ innerHTML: endNoteContent }),
      ),
    );
    tabElem.querySelector('.col-12').append(endNoteElem);
    block.querySelector('section.product-card-tabbed').append(tabElem);
  });
}
export default async function decorate(block) {
  const currencies = [];

  block.querySelectorAll('li').forEach((currency) => {
    currencies.push(currency.innerText);
  });

  const endNoteContent = block.querySelector('h3').innerText;

  block.innerHTML = `
  <div class="container" id="pricing">
    <div class="category-grid-group">
      <div class="row">
        <div class="col-12 col-lg-3">
          <div class="category-grid-header">
            <h2 class="category-grid-header-title">Pricing</h2>
          </div>
        </div>
        <div class="col-12 col-lg-9">
          <div class="category-grid-items three-col">
            <div class="aem-Grid aem-Grid-12 aem-Grid-default-12  row">
              <div class="productPricingTabs aem-GridColumn aem-GridColumn-default-12">
                <section id="product-card-tabbed" class="tabs product-card-tabbed">
                  <div class="container">
                    <div class="row">
                      <div class="col-12">
                        <div role="tablist" aria-label="SMS" class="tabs-tabs">
                            <!-  Tab button elements populated here while iterating through the returned pricing data->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-  Tab elements populated here while iterating through the returned pricing data->
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

  // Fetch pricing data
  const resp = await fetch(`${window.location.pathname}/pricing/data.json`);

  if (resp.ok) {
    const rawData = await resp.json();

    const pricingData = [];
    if (rawData && rawData[':names'].length !== 0) {
      rawData[':names'].sort().forEach((tierName) => {
        pricingData.push({ tier: tierName, data: rawData[tierName].data });
      });
    }
    populatePricingGrid(block, currencies, pricingData, endNoteContent);
  }
}
