/* eslint-disable no-plusplus */
import {
  a, button, div, domEl, img, li, span, ul,
} from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.dataset.page = 1;
  block.innerHTML = `<div class="search-filters">
    <div class="filter-btn-options-wrapper">
        <ul class="btn-options-list">
            <li class="filter-btn"><span>Filters</span> <i class="font-icon-filter"></i></li>
        </ul>
    </div>

    <!-- TODO: mobile-->
    <dialog class="mobile-filter-options">
        <div class="filter-head">
            <div class="close-wrap Vlt-icon-close"></div>
            <div class="filters"><span>Filters</span> <i class="font-icon-filter"></i></div>
            <div class="clear-wrap"></div>
        </div>
        <div class="filter-body">
            <ul class="list-items">
                <li class="title"><span class="accordion">Type<i class="Vlt-icon-chevron"></i></span></li>
                <li class="title"><span class="accordion">
              Topic
              <i class="Vlt-icon-chevron"></i></span></li>
                <li class="title"><span class="accordion">
              Region
              <i class="Vlt-icon-chevron"></i></span></li>
            </ul>
        </div>
        <div class="filter-foot">
            <button type="button" class="prime-cta">
                Show results
            </button>
        </div>
    </dialog>

    <div class="desktop-filter-options"></div>
</div>

<div class="results">
    <div class="results-section">

        <div class="filter-btn-options-wrapper-desktop">
            <ul class="btn-options-list">
        </div>


        <div class="results-section-wrapper">
    </div>
    <div class="pagination">
    </div>
</div>
`;

  await refreshResults(block);
}

/**
 *
 * @param engineKey {string}
 * @param pageNo {number}
 * @param filters {Object<string, string[]>}
 * @return {Promise<any>}
 */
async function getSearchResults(engineKey, pageNo, filters) {
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
        site: ['vonage-business-marketing'],
        language: ['en'],
        country: ['us'],
        content_section: ['apps', 'products'],
        ff_product: { type: 'and', values: ['product/unified-communications/feature'] },
        ...filters,
      },
    },
    facets: { page: ['type', 'topic', 'region'] },
  };

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

function getActiveFilters(block) {
  const checkedBoxes = [...block.querySelectorAll('.search-filters input[type="checkbox"]:checked')];
  const activeFilters = checkedBoxes
    .map((checkbox) => [checkbox.dataset.group, checkbox.value])
    .reduce((acc, [group, filterId]) => {
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(filterId);
      return acc;
    }, {});
  return activeFilters;
}

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
            // TODO: icons
            span({ 'aria-hidden': 'true', class: 'font-icon-arrow-right desktop-only' }),
          ),
          span(
            { class: 'card-body' },
            entry.meta_description,
          ),
        ),
      ),
    );
  });
}

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

async function refreshResults(block) {
  const activeFilters = getActiveFilters(block);

  console.log('activeFilters', activeFilters);
  // TODO: extract bucket id
  const swiftypeResult = await getSearchResults('F2vatbs1LRkyNzs-Hv9D', block.dataset.page, activeFilters);
  console.log(swiftypeResult);

  updateFilters(block, swiftypeResult, activeFilters);
  updateFilterPills(block, swiftypeResult, activeFilters);
  updateResults(block, swiftypeResult);
  updatePagination(block, swiftypeResult);
}

function updateFilterPills(block, swiftypeResult, activeFilters) {
  const list = block.querySelector('.filter-btn-options-wrapper-desktop .btn-options-list');
  list.innerHTML = '';
  if (Object.values(activeFilters).length === 0) {
    return;
  }

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
      pill.addEventListener('click', () => {
        clearFilter(block, group, filterId);
      });
      list.append(pill);
    });
  });

  const clearAll = li(
    { class: 'filter-option clear-filter-section' },
    span('Clear All Filters'),
  );
  clearAll.addEventListener('click', () => {
    clearFilters(block);
  });
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

function updateFilters(block, swiftypeResult, activeFilters) {
  const filters = block.querySelector('.desktop-filter-options');
  filters.innerHTML = '';

  Object.entries(swiftypeResult.info.page.facets).forEach(([groupId, facetValues]) => {
    const group = domEl(
      'details',
      { open: 'open', class: 'accordion-bar' },
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
