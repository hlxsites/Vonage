import {decorateIcons} from '../../scripts/lib-franklin.js';
import {div, domEl, li, span, ul,} from '../../scripts/scripts.js';

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
    sort_field: {page: 'sortTitle'},
    sort_direction: {page: 'asc'},
    highlight_fields: {},
    spelling: 'retry',
    q: '',
    filters: {
      page: {
        site: ['vonage-business-marketing'],
        language: ['en'],
        country: ['us'],
        content_section: ['apps', 'products'],
        ff_product: {type: 'and', values: ['product/unified-communications/feature']},
        ...filters,
      },
    },
    facets: {page: ['type', 'topic', 'region']},
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
                <li class="filter-btn">
                    <span aria-hidden="true" class="font-icon-filter"></span> <span>Filters</span>
                </li>
                <li class="filter-option">
                    <span aria-hidden="true" class="font-icon-close"></span> <span>Omnichannel (21)</span>
                </li>
                <li class="filter-option"><i aria-hidden="true" class="font-icon-close"></i>
                    <span>Mobility (22)</span></li>
                <span class="filter-option clear-filter-section">
					Clear All Filters
				</span></ul>
        </div>


        <div class="results-section-wrapper">
            <a href="https://www.vonage.com/unified-communications/features/admin-portal/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo">
                        <img src="https://www.vonage.com/content/dam/vonage/us-en/unified-communications/pictograms/Pictograms_2019_Admin%20Portal.svg"
                             class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Admin Portal
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Admin Portal from Vonage helps phone administrators manage their phone system anywhere. 
					</span></div>
                <p class="button-container">

                    <a href="https://www.vonage.com/unified-communications/features/admin-portal/"
                       target="_blank" class="card-action-btn mobile-only button">
                        Get started
                    </a>
                </p>

            </a>
            <a href="https://www.vonage.com/unified-communications/features/app-center/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/brand/vonage-does-that-site/App-Center.png"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						App Center 
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Vonage App Center integrates high-value apps within Vonage Business Communications for improved productivity and better employee and customer experiences. Learn more now.

					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/app-center/" target="_blank"
                   class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a
                    href="https://www.vonage.com/unified-communications/features/virtual-receptionist/"
                    target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/brand/iconography/Receptionist.svg"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Auto Attendant
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Fully automate your ability to route calls to specific people of departments with a virtual phone receptionist from Vonage. Learn more. 
					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/virtual-receptionist/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a href="https://www.vonage.com/unified-communications/features/block-caller-id/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/brand/iconography/vonage/Volta-product-icons/Calling/call-block/outline.svg"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Block Caller ID
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Block outbound calls with caller ID blocking from Vonage to help you bypass individuals who screen calls for your business. Learn more
					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/block-caller-id/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a
                    href="https://www.vonage.com/marketplace/unified-communications/vbc-company-call-recording/"
                    target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/brand/pictograms/with-margin/Pictograms_2019_Call%20Recording.svg"
                            alt="illustration-of-a-audio-tape-recording-of-a-phone-call"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Business Call Recording Service
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Easily enable the recording of all important business conversations so you can make the most of every customer interaction Learn more.
					</span> <span class="card-right-wrapper--fourth-liner"><span class="text-bold">
							$49.99/month
						</span></span></div>
                <a href="https://www.vonage.com/marketplace/unified-communications/vbc-company-call-recording/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a href="https://www.vonage.com/marketplace/unified-communications/business-inbox/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/unified-communications/pictograms/business-inbox.png"
                            alt="business-inbox-pictogram" class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Business Inbox
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Cross-channel texting with customers. 
					</span> <span class="card-right-wrapper--fourth-liner"><span class="text-bold">
							$9.99/month
						</span></span></div>
                <a href="https://www.vonage.com/marketplace/unified-communications/business-inbox/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a href="https://www.vonage.com/unified-communications/features/mobile-app/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/unified-communications/imagery/mobile-app-screens.png"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Business Phone App
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Never miss a work call and take your business phone system everywhere you go with just a simple app. Learn more.
					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/mobile-app/" target="_blank"
                   class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a href="https://www.vonage.com/unified-communications/features/business-sms/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/api/illustrations/MMS.svg"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Business SMS and MMS
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Easily reach customers and coworkers with reliable sms &amp; mms messaging solutions on mobile and desktop applications. Learn more.
					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/business-sms/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a>
            <a href="https://www.vonage.com/unified-communications/features/busy-lamp-field/"
               target="_blank" class="card">
                <div class="card-left-wrapper">
                    <div class="card-left-wrapper--logo"><img
                            src="https://www.vonage.com/content/dam/vonage/us-en/unified-communications/pictograms/Pictograms_2019_Handset.svg"
                            class="card-left-wrapper--logo-image"></div>
                </div>
                <div class="card-right-wrapper"><span class="card-right-wrapper--first-liner">
						
					</span> <span class="card-right-wrapper--second-liner">
						Busy Lamp Field
						<i aria-hidden="true" class="Vlt-icon-arrow-link arrow-icon desktop-only"></i></span> <span
                        class="card-right-wrapper--third-liner">
						Enable your business to know which phones in your system are in use with Busy Lamp Field feature from Vonage. Learn more.
					</span></div>
                <a href="https://www.vonage.com/unified-communications/features/busy-lamp-field/"
                   target="_blank" class="card-action-btn mobile-only">
                    Get started
                </a></a></div>
    </div>
    <div class="pagination">
        <button aria-label="Go to previous page" class="pagination__arrow pagination__arrow--show"><span
                class="Vlt-icon Vlt-icon-chevron"></span></button>
        <button aria-label="Go to page1" data-number="1"
                class="pagination__page pagination__page--current">
            1
        </button>
        <button aria-label="Go to page2" data-number="2" class="pagination__page">
            2
        </button>
        <button aria-label="Go to page3" data-number="3" class="pagination__page">
            3
        </button>
        <button aria-label="Go to page4" data-number="4" class="pagination__page">
            4
        </button>
        <button aria-label="Go to page5" data-number="5" class="pagination__page">
            5
        </button>
        <button aria-label="Go to next page"
                class="pagination__arrow pagination__arrow--next pagination__arrow--show">
            <span class="Vlt-icon Vlt-icon-chevron"></span>
        </button>
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

async function refreshResults(block) {
  const activeFilters = getActiveFilters(block);

  console.log('activeFilters', activeFilters);
  const resultInfo = await getSearchResults('F2vatbs1LRkyNzs-Hv9D', 1, activeFilters);
  console.log(resultInfo);

  updateFilters(block, resultInfo, activeFilters);
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

function updateFilters(block, resultInfo, activeFilters) {
  const filters = block.querySelector('.filter-options-wrapper');
  filters.innerHTML = '';

  Object.entries(resultInfo.info.page.facets).forEach(([groupId, facetValues]) => {

    const group = domEl('details', {open: 'open', class: 'accordion-bar'},
      domEl('summary',
        getLabelForFacet(groupId),
        div({class: 'summary-chevron'}, span({class: ''}))
      ),
      ul({class: 'filter-options-wrap'},
        ...Object.entries(facetValues).map(([name, count]) => li({class: 'option-filter'},
            div({class: 'checkbox-wrapper'},
              domEl('label', {class: 'filter-container'},
                domEl('input', {
                  type: 'checkbox', value: name,
                  'data-label': getLabelForFacet(name),
                  'data-group': groupId,
                  onChange: (e) => handleFilterChange(e, block)
                }),
                span({class: 'checkmark'}),
                span({class: 'option-txt'}, getLabelForFacet(name),
                  span({class: 'option-num'}, `(${count})`),
                ),
              ),
            ),
          ),
        ),
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

  // <details open="open" class="accordion-bar">
  //   <summary><span className="summary-title">Type</span>
  //     <div className="summary-chevron-down"><i className="Vlt-icon-chevron"></i></div>
  //   </summary>
  //   <div className="summary-content">
  //     <ul className="filter-options-wrap">
  //       <li className="option-filter">
  //         <div className="checkbox-wrapper"><label className="filter-container">
  //           <input type="checkbox"
  //                  value="{&quot;name&quot;:&quot;type/core-feature&quot;,&quot;label&quot;:&quot;Included feature&quot;}">
  //             <span className="checkmark"></span> <span className="option-txt">
  //                   Included feature
  //                   <span className="option-num">(43)</span></span></label></div>
  //       </li>
  //       <li className="option-filter">
  //         <div className="checkbox-wrapper"><label className="filter-container">
  //           <input type="checkbox"
  //                  value="{&quot;name&quot;:&quot;type/paid-add-on&quot;,&quot;label&quot;:&quot;Paid add-on&quot;}">
  //             <span className="checkmark"></span> <span className="option-txt">
  //                   Paid add-on
  //                   <span className="option-num">(18)</span></span></label></div>
  //       </li>
  //     </ul>
  //   </div>
  //   <div className="summary-chevron-up"><i className="Vlt-icon-chevron"></i></div>
  // </details>
}

function handleFilterChange(e, block) {
  console.log(e.target.value);
  refreshResults(block);
}
