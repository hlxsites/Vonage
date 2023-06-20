import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  a, button, div, domEl, img, li, span, ul,
} from '../../scripts/scripts.js';

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
  const resultInfo = await response.json();
  return resultInfo;
}

export default async function decorate(block) {
  block.dataset.page = 1;
  block.innerHTML = `<div class="search-filters-root">
    <div class="filter-btn-options-wrapper">
        <ul class="btn-options-list">
            <li class="filter-btn"><span>Filters</span> <i class="Vlt-icon-filter"></i></li>
        </ul>
    </div>

    <dialog class="filter-options-container">
        <div class="filter-head">
            <div class="close-wrap Vlt-icon-close"></div>
            <div class="filters"><span>Filters</span> <i class="Vlt-icon-filter"></i></div>
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

    <div class="filter-options-wrapper">
        <details open="open" class="accordion-bar">
            <summary><span class="summary-title">Type</span>
                <div class="summary-chevron-down"><i class="Vlt-icon-chevron"></i></div>
            </summary>
            <div class="summary-content">
                <ul class="filter-options-wrap">
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;type/core-feature&quot;,&quot;label&quot;:&quot;Included feature&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Included feature 
                    <span class="option-num">(43)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;type/paid-add-on&quot;,&quot;label&quot;:&quot;Paid add-on&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Paid add-on 
                    <span class="option-num">(18)</span></span></label></div>
                    </li>
                </ul>
            </div>
            <div class="summary-chevron-up"><i class="Vlt-icon-chevron"></i></div>
        </details>
        <details open="open" class="accordion-bar">
            <summary><span class="summary-title">Topic</span>
                <div class="summary-chevron-down"><i class="Vlt-icon-chevron"></i></div>
            </summary>
            <div class="summary-content">
                <ul class="filter-options-wrap">
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/ai&quot;,&quot;label&quot;:&quot;AI&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    AI 
                    <span class="option-num">(1)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/call-center&quot;,&quot;label&quot;:&quot;Call center&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Call center 
                    <span class="option-num">(14)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/collaboration&quot;,&quot;label&quot;:&quot;Collaboration&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Collaboration 
                    <span class="option-num">(19)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/customer-engagement&quot;,&quot;label&quot;:&quot;Customer engagement&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Customer engagement 
                    <span class="option-num">(25)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/employee-experience&quot;,&quot;label&quot;:&quot;Employee experience&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Employee experience 
                    <span class="option-num">(25)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/flexibility&quot;,&quot;label&quot;:&quot;Flexibility&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Flexibility 
                    <span class="option-num">(20)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/infrastructure&quot;,&quot;label&quot;:&quot;Infrastructure&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Infrastructure 
                    <span class="option-num">(2)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/marketing&quot;,&quot;label&quot;:&quot;Marketing&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Marketing 
                    <span class="option-num">(12)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/mobility&quot;,&quot;label&quot;:&quot;Mobility&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Mobility 
                    <span class="option-num">(22)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/omnichannel&quot;,&quot;label&quot;:&quot;Omnichannel&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Omnichannel 
                    <span class="option-num">(21)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/productivity&quot;,&quot;label&quot;:&quot;Productivity&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Productivity 
                    <span class="option-num">(35)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/remote-work&quot;,&quot;label&quot;:&quot;Remote work&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Remote work 
                    <span class="option-num">(6)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;topic/support&quot;,&quot;label&quot;:&quot;Support&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    Support 
                    <span class="option-num">(13)</span></span></label></div>
                    </li>
                </ul>
            </div>
            <div class="summary-chevron-up"><i class="Vlt-icon-chevron"></i></div>
        </details>
        <details class="accordion-bar">
            <summary><span class="summary-title">Region</span>
                <div class="summary-chevron-down"><i class="Vlt-icon-chevron"></i></div>
            </summary>
            <div class="summary-content">
                <ul class="filter-options-wrap">
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;region/apac&quot;,&quot;label&quot;:&quot;APAC&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    APAC 
                    <span class="option-num">(51)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;region/emea&quot;,&quot;label&quot;:&quot;EMEA&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    EMEA 
                    <span class="option-num">(53)</span></span></label></div>
                    </li>
                    <li class="option-filter">
                        <div class="checkbox-wrapper"><label class="filter-container">
                            <input type="checkbox"
                                   value="{&quot;name&quot;:&quot;region/north-america&quot;,&quot;label&quot;:&quot;North America&quot;}">
                            <span class="checkmark"></span> <span class="option-txt">
                    North America 
                    <span class="option-num">(60)</span></span></label></div>
                    </li>
                </ul>
            </div>
            <div class="summary-chevron-up"><i class="Vlt-icon-chevron"></i></div>
        </details>
    </div>
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
  decorateIcons(block);
}

function getActiveFilters(block) {
  const checkedBoxes = [...block.querySelectorAll('.filter-container input[type="checkbox"]:checked')];
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
            { class: 'card-left-wrapper--logo' },
            img({ src: entry.image, class: 'card-left-wrapper--logo-image' }),
          ),
        ),
        div(
          { class: 'card-right-wrapper' },
          span({ class: 'card-right-wrapper--first-liner' }),
          span(
            { class: 'card-right-wrapper--second-liner' },
            entry.title,
            // TODO: icons
            span({ 'aria-hidden': 'true', class: 'Vlt-icon-arrow-link arrow-icon desktop-only' }),
          ),
          span(
            { class: 'card-right-wrapper--third-liner' },
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
        class: 'pagination__arrow pagination__arrow--show',
        onClick: () => {
          block.dataset.page = swiftypeResult.info.page.current_page - 1;
          refreshResults(block);
        },
      },
      span({ class: 'font-icon-chevron left' }),
    ));
  }

  const firstPage = Math.max(1, swiftypeResult.info.page.current_page - 4);
  const lastPage = Math.max(5, swiftypeResult.info.page.current_page);
  for (let i = firstPage; i <= lastPage; i++) {
    const classList = ['pagination__page'];
    if (i === swiftypeResult.info.page.current_page) {
      classList.push('pagination__page--current');
    }
    pagination.append(button(
      {
        'aria-label': `Go to page ${i}`,
        'data-page-number': i,
        class: classList,
        onClick: () => {
          block.dataset.page = i;
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
        class: 'pagination__page',
        onClick: () => {
          block.dataset.page = swiftypeResult.info.page.current_page + 1;
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
  const filters = block.querySelector('.filter-options-wrapper');
  filters.innerHTML = '';

  Object.entries(swiftypeResult.info.page.facets).forEach(([groupId, facetValues]) => {
    const group = domEl(
      'details',
      { open: 'open', class: 'accordion-bar' },
      domEl(
        'summary',
        getLabelForFacet(groupId),
        div({ class: 'summary-chevron' }, span({ class: '' })),
      ),
      ul(
        { class: 'filter-options-wrap' },
        ...Object.entries(facetValues).map(([name, count]) => li(
          { class: 'option-filter' },
          div(
            { class: 'checkbox-wrapper' },
            domEl('label', { class: 'filter-container' }, domEl('input', {
              type: 'checkbox',
              value: name,
              'data-label': getLabelForFacet(name),
              'data-group': groupId,
              onChange: (e) => handleFilterChange(e, block),
            }), span({ class: 'checkmark' }), span({ class: 'option-txt' }, getLabelForFacet(name), span({ class: 'option-num' }, `(${count})`))),
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

function handleFilterChange(e, block) {
  refreshResults(block);
}

function clearFilter(block, group, filterId) {
  const checkbox = block.querySelector(`input[data-group="${group}"][value="${filterId}"]`);
  checkbox.checked = false;
  refreshResults(block);
}

function clearFilters(block) {
  const checkboxes = [...block.querySelectorAll('.filter-container input[type="checkbox"]')];
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  refreshResults(block);
}
