/* eslint-disable no-plusplus */
import {
  a, button, div, domEl, img, li, p, span, ul,
} from '../../scripts/scripts.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

// noinspection JSUnusedGlobalSymbols
export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.dataset.page = 1;
  block.dataset.engineKey = config['swiftype-engine-key'];
  block.dataset.siteKey = config['swiftype-site-key'];
  block.dataset.productTag = config['swiftype-product-tag'];
  block.dataset.typeTag = config['swiftype-type-tag'];
  block.dataset.facets = JSON.stringify(config.facets.split(',').map((f) => f.trim().toLowerCase()));
  block.dataset.contentSections = JSON.stringify(config['content-sections'].split(',').map((f) => f.trim().toLowerCase()));

  block.innerHTML = `<div class="search-filters">
    <div class="filter-btn-options-wrapper">
        <ul class="btn-options-list">
            <li class="filter-btn active"><span>Filters</span> <span class="font-icon-filter"></span></li>
        </ul>
    </div>

    <dialog class="mobile-filter-dialog">
        <div class="dialog-head">
            <div class="close-button font-icon-close"></div>
            <div class="title"><span>Filters</span> <span class="font-icon-filter"></span></div>
            <div class="clear-wrap"></div>
        </div>
        <ul class="mobile-filters"></ul>
        <div class="dialog-foot button-container">
            <button type="button" class="">
                Show results
            </button>
        </div>
    </dialog>

    <div class="desktop-filter-options"></div>
</div>

<div class="results">
      <ul class="filter-btn-options-wrapper-desktop hidden">
      </ul>

      <div class="results-section-wrapper"></div>
    <div class="pagination">
</div>
`;

  block.querySelector('.filter-btn').addEventListener('click', () => {
    block.querySelector('.mobile-filter-dialog').showModal();
  });
  block.querySelector('.mobile-filter-dialog .close-button').addEventListener('click', async () => {
    await applyMobileFilters(block);
    block.querySelector('.mobile-filter-dialog').close();
  });
  block.querySelector('.mobile-filter-dialog .dialog-foot button').addEventListener('click', async () => {
    await applyMobileFilters(block);
    block.querySelector('.mobile-filter-dialog').close();
  });

  await refreshResults(block);
}

async function applyMobileFilters(block) {
  const filters = getActiveFilters(block.querySelector('.mobile-filter-dialog .mobile-filters'));
  await refreshResults(block, filters);
}

/**
 * @typedef {Object} SwiftypeResponse
 * @property {number} record_count
 * @property {Object} records - Holds page data
 * @property {Object[]} records.page
 * @property {string} records.page.title
 * @property {string} records.page.meta_description
 * @property {string} records.page.url
 * @property {string} records.page.image
 * @property {Object} info - Holds page information
 * @property {Object} info.page
 * @property {string} info.page.query
 * @property {number} info.page.current_page
 * @property {number} info.page.num_pages
 * @property {number} info.page.per_page
 * @property {number} info.page.total_result_count
 * @property {Object.<string, Object<string,number>>} info.page.facets
 * @property {Object.<string, any>} errors */

/**
 *
 * @param engineKey {string}
 * @param siteKey {string}
 * @param productTag {string}
 * @param pageNo {number}
 * @param filters {Object<string, string[]>}
 * @return {Promise<SwiftypeResponse>}
 */
async function getSearchResults(engineKey, siteKey, productTag, typeTag, facets, contentSections, pageNo, filters) {
  const query = {
    engine_key: engineKey,
    page: pageNo,
    per_page: 9,
    sort_field: { page: 'sortTitle' },
    sort_direction: { page: 'asc' },
    highlight_fields: {},
    spelling: 'retry',
    q: '',
    filters: {
      page: {
        site: [siteKey],
        language: ['en'],
        country: ['us'],
        ...filters,
      },
    },
    facets: { page: facets },
  };

  // apply filters depending on the page
  if (productTag && productTag !== 'undefined') {
    query.filters.page.ff_product = { type: 'and', values: [productTag] };
  }
  if (typeTag && typeTag !== 'undefined') {
    query.filters.page.type = { type: 'and', values: [typeTag] };
  }
  if (contentSections) {
    query.filters.page.content_section = contentSections;
  }

  const response = await fetch('https://api.swiftype.com/api/v1/public/engines/search.json', {
    body: JSON.stringify(query),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    credentials: 'omit',
  });
  return response.json();
}

/**
 * @return {Object.<string, string[]>}
 */
function getActiveFilters(blockOrElement) {
  const checkedBoxes = [...blockOrElement.querySelectorAll('input[type="checkbox"]:checked')];
  return checkedBoxes
    .map((checkbox) => [checkbox.dataset.group, checkbox.value])
    .reduce((acc, [group, filterId]) => {
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(filterId);
      return acc;
    }, {});
}

/**
 * @param block
 * @param swiftypeResult {SwiftypeResponse}
 */
function updateResults(block, swiftypeResult) {
  const results = block.querySelector('.results-section-wrapper');
  results.innerHTML = '';

  swiftypeResult.records.page.forEach((entry) => {
    results.append(
      a(
        { href: entry.url, target: '_blank', class: 'card' },
        div(
          { class: 'card-left-wrapper' },
          div(
            { class: 'card-logo' },
            img({ src: entry.image, class: 'card-logo-image' }),
          ),
        ),
        div(
          { class: 'card-right' },
          span(
            { class: 'card-title' },
            entry.title,
            span({ 'aria-hidden': 'true', class: 'font-icon-arrow-right desktop-only' }),
          ),
          span(
            { class: 'card-body' },
            entry.meta_description,
          ),
        ),
        p(
          { class: 'button-container mobile-and-tablet-only' },
          a(
            { href: entry.url, target: '_blank', class: 'button primary ' },
            'Get started',
          ),
        ),
      ),
    );
  });
}

/**
 * @param block
 * @param swiftypeResult {SwiftypeResponse}
 */
function updatePagination(block, swiftypeResult) {
  const pagination = block.querySelector('.pagination');
  pagination.innerHTML = '';

  if (swiftypeResult.info.page.current_page > 1) {
    pagination.append(button(
      {
        'aria-label': 'Go to previous page',
        onClick: () => {
          block.dataset.page = swiftypeResult.info.page.current_page - 1;
          // noinspection JSIgnoredPromiseFromCall
          refreshResults(block);
        },
      },
      span({ class: 'font-icon-chevron left' }),
    ));
  }

  const firstPage = Math.max(1, swiftypeResult.info.page.current_page - 4);
  const lastPage = Math.max(5, swiftypeResult.info.page.current_page);
  for (let i = firstPage; i <= lastPage; i++) {
    const classList = [];
    if (i === swiftypeResult.info.page.current_page) {
      classList.push('current');
    }
    pagination.append(button(
      {
        'aria-label': `Go to page ${i}`,
        'data-page-number': i,
        class: classList,
        onClick: () => {
          block.dataset.page = i;
          // noinspection JSIgnoredPromiseFromCall
          refreshResults(block);
        },
      },
      i,
    ));
  }

  if (swiftypeResult.info.page.num_pages > swiftypeResult.info.page.current_page) {
    pagination.append(button(
      {
        'aria-label': 'Go to next page',
        class: 'page',
        onClick: () => {
          block.dataset.page = swiftypeResult.info.page.current_page + 1;
          // noinspection JSIgnoredPromiseFromCall
          refreshResults(block);
        },
      },
      span({ class: 'font-icon-chevron right' }),
    ));
  }
}

async function refreshResults(block, newFilters) {
  const activeFilters = newFilters ?? getActiveFilters(block.querySelector('.search-filters .desktop-filter-options'));

  const swiftypeResult = await getSearchResults(
    block.dataset.engineKey,
    block.dataset.siteKey,
    block.dataset.productTag,
    block.dataset.typeTag,
    JSON.parse(block.dataset.facets),
    JSON.parse(block.dataset.contentSections),
    block.dataset.page,
    activeFilters,
  );

  updateFilters(block, swiftypeResult, activeFilters);
  updateMobileFilters(block, swiftypeResult, activeFilters);
  updateFilterPills(block, swiftypeResult, activeFilters);
  updateResults(block, swiftypeResult);
  updatePagination(block, swiftypeResult);
}

/**
 * @param block
 * @param swiftypeResult {SwiftypeResponse}
 * @param activeFilters {Object.<string, string[]>}
 */
function updateFilterPills(block, swiftypeResult, activeFilters) {
  const list = block.querySelector('.filter-btn-options-wrapper-desktop');
  list.innerHTML = '';
  if (Object.values(activeFilters).length === 0) {
    list.classList.add('hidden');
    return;
  }
  list.classList.remove('hidden');

  list.append(li(
    { class: 'filter-btn' },
    span({ class: 'font-icon-filter', 'aria-hidden': true }),
    span('Filters'),
  ));

  Object.entries(activeFilters).forEach(([group, filters]) => {
    filters.forEach((filterId) => {
      const pill = li(
        { class: 'filter-option' },
        span({ class: 'font-icon-close', 'aria-hidden': true }),
        span(`${getLabelForFacet(filterId)} (${swiftypeResult.info.page.facets[group][filterId]})`),
      );
      pill.addEventListener('click', () => clearFilter(block, group, filterId));
      list.append(pill);
    });
  });

  const clearAll = li(
    { class: 'filter-option clear-filter-section' },
    span('Clear All Filters'),
  );
  clearAll.addEventListener('click', () => clearFilters(block));
  list.append(clearAll);
}

function getLabelForFacet(facetId) {
  return facetId
    // remove dashes
    .replaceAll('-', ' ')
    // remove slashes
    .replaceAll(/^[^/]+[/]/g, '')
    // titleCase
    .replace(/\b[a-z]/, (str) => str.toUpperCase());
}

/**
 * @param block
 * @param swiftypeResult {SwiftypeResponse}
 * @param activeFilters {Object.<string, string[]>}
 */
function updateFilters(block, swiftypeResult, activeFilters) {
  const filters = block.querySelector('.desktop-filter-options');
  filters.innerHTML = '';

  JSON.parse(block.dataset.facets).forEach((groupId) => {
    const facetValues = swiftypeResult.info.page.facets[groupId];

    // noinspection JSUnusedGlobalSymbols
    const group = domEl(
      'details',
      { open: 'open', class: 'accordion-bar' },
      domEl(
        'summary',
        getLabelForFacet(groupId),
        div({ class: 'summary-chevron' }, span({ class: 'font-icon-chevron' })),
      ),
      ul(
        ...Object.entries(facetValues)
          .filter((pair) => pair[0].length > 0)
          .map(([name, count]) => li(
            div(
              { class: 'checkbox-wrapper' },
              domEl(
                'label',
                domEl('input', {
                  type: 'checkbox',
                  value: name,
                  'data-label': getLabelForFacet(name),
                  'data-group': groupId,
                  onChange: (e) => handleFilterChange(e, block),
                }),
                span({ class: 'checkmark' }),
                span({ class: 'option-txt' }, getLabelForFacet(name), span({ class: 'option-num' }, `(${count})`)),
              ),
            ),
          )),
      ),
    );

    // try to activate all previously active checkboxes
    activeFilters[groupId]?.forEach((filter) => {
      const checkbox = group.querySelector(`input[value="${filter}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    filters.append(group);
  });
}

/**
 *
 * @param block
 * @param swiftypeResult {SwiftypeResponse}
 * @param activeFilters {Object.<string, string[]>}
 */
function updateMobileFilters(block, swiftypeResult, activeFilters) {
  const filters = block.querySelector('.mobile-filter-dialog .mobile-filters');
  filters.innerHTML = '';

  Object.entries(swiftypeResult.info.page.facets).forEach(([groupId, facetValues]) => {
    const group = domEl(
      'details',
      { class: 'accordion-bar' },
      domEl(
        'summary',
        getLabelForFacet(groupId),
        div({ class: 'summary-chevron' }, span({ class: 'font-icon-chevron' })),
      ),
      ul(
        ...Object.entries(facetValues).map(([name, count]) => li(
          div(
            { class: 'checkbox-wrapper' },
            domEl(
              'label',
              domEl('input', {
                type: 'checkbox',
                value: name,
                'data-label': getLabelForFacet(name),
                'data-group': groupId,
              }),
              span({ class: 'checkmark' }),
              span({ class: 'option-txt' }, getLabelForFacet(name), span({ class: 'option-num' }, `(${count})`)),
            ),
          ),
        )),
      ),
    );

    // try to activate all previously active checkboxes
    activeFilters[groupId]?.forEach((filter) => {
      const checkbox = group.querySelector(`input[value="${filter}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    if (activeFilters[groupId]) {
      group.open = true;
    }

    filters.append(group);
  });
}

async function handleFilterChange(e, block) {
  await refreshResults(block);
}

async function clearFilter(block, group, filterId) {
  const checkbox = block.querySelector(`input[data-group="${group}"][value="${filterId}"]`);
  checkbox.checked = false;
  await refreshResults(block);
}

async function clearFilters(block) {
  const checkboxes = [...block.querySelectorAll('.search-filters input[type="checkbox"]')];
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  await refreshResults(block);
}
