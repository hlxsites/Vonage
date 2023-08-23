/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */
const hr = (doc) => doc.createElement('hr');
const host = 'https://main--vonage--hlxsites.hlx.page';

function cleanAnchors(main) {
  const anchors = main.querySelectorAll('a');
  anchors.forEach((anchor) => {
    if (anchor.href.startsWith('/')) {
      anchor.href = host + anchor.href;
    } else if (anchor.href.startsWith('about:blank#')) {
      anchor.href = host + anchor.href.replace('about:blank', '');
    }
  });
}

const createMetadata = (main, document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  meta['nav-section'] = 'Unified Communications'; // this is static for now

  const navs = main.querySelectorAll('div.left-sec span.title-option > a > span:not(.nav-icon)');
  console.log(`navs: ${navs.length}`);
  if (navs[1]) {
    meta['nav-subsection'] = navs[1].innerHTML;
  }
  if (navs[2]) {
    meta['nav-breadcrumb'] = navs[2].innerHTML;
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function importSlimPromo(main, document) {
  const SPs = document.querySelectorAll('section.slimPromo');
  if (SPs && SPs.length > 0) {
    console.log(`slimPromos Found: ${SPs.length}`);

    SPs.forEach((slimPromo) => {
      const spImg = slimPromo.querySelector('div.slimPromo-image > img');
      const spCopy = slimPromo.querySelector('div.slimPromo-text');
      const spCells = [['Columns (slim-promo)'], [spImg, spCopy]];
      const columnsBlock = WebImporter.DOMUtils.createTable(spCells, document);

      // check to make sure BG is black
      if (slimPromo.querySelector('div.theme-black.theme-dark')) {
        const smCells = [['Section Metadata'], ['Style', 'black-bg']];
        const smBlock = WebImporter.DOMUtils.createTable(smCells, document);
        columnsBlock.append(smBlock);
        columnsBlock.append(hr(document));
      }
      slimPromo.replaceWith(columnsBlock);
    });
  }
}

function importPricingMatrix(main, document) {
  const pms = document.querySelectorAll('div.pricingMatrixUpdatedCtas');

  const slider = document.querySelector('div.quantitySlider');
  if (slider) {
    slider.remove();
  }
  pms.forEach((matrix) => {
    if (matrix.querySelector('div.plans-card.plans-card-extended:not(.plans-card-tagged)')) {
      console.log('Found Alt Extended Pricing Matrix');
      const matrixConfig = [['columns (plans)']];
      matrix.querySelectorAll('div.plans-card-info').forEach((info) => {
        info.querySelector('section.form-overlay > div.form-standard').remove();
        matrixConfig.push([info]);
      });
      const pmBlock = WebImporter.DOMUtils.createTable(matrixConfig, document);
      matrix.replaceWith(pmBlock);
    } else {
      const matrixConfig = [['Pricing-Matrix'], ['Show Condition', 'a', 'b', 'c']];
      const pmBlock = WebImporter.DOMUtils.createTable(matrixConfig, document);

      const fragConfig = [['Fragment'], ['FRAGMENT PATH']];
      const fragBlock = WebImporter.DOMUtils.createTable(fragConfig, document);
      pmBlock.append(fragBlock);

      const smCells = [['Section Metadata'], ['Style', 'background-pricing']];
      const smBlock = WebImporter.DOMUtils.createTable(smCells, document);
      pmBlock.append(smBlock);
      pmBlock.append(hr(document));
      matrix.replaceWith(pmBlock);
    }
  });
}

function import2upCards(main, document) {
  const ic = main.querySelectorAll('section.info-card-2-up');
  ic.forEach((card) => {
    const cardCells = [['Cards (info-card)']];
    const myCard = card.querySelectorAll('a.info-card');
    myCard.forEach((infoCard) => {
      const infoCwrapper = document.createElement('div');
      const infoClink = document.createElement('a');
      infoClink.href = infoCard.href;
      const infoCtitle = infoCard.querySelector('.info-card-title');
      const infoCdesc = infoCard.querySelector('.info-card-description');
      infoClink.append(infoCtitle, infoCdesc);
      infoCwrapper.append(infoClink);
      cardCells.push([infoCwrapper]);
    });
    const cardBlock = WebImporter.DOMUtils.createTable(cardCells, document);
    card.replaceWith(cardBlock);
  });
}

function importIconPanel(main, document) {
  const ip = main.querySelectorAll('section.icon-panel');
  ip.forEach((panel) => {
    const panCells = [['Cards']];
    const ips = panel.querySelectorAll('div.icon-panel-item');
    ips.forEach((ipanel) => {
      const img = ipanel.querySelector('div.icon-panel-image > img');
      const txt = document.createElement('div');
      const h2 = ipanel.querySelector('h2.icon-panel-headline');
      const desc = ipanel.querySelector('span.icon-panel-description');
      txt.append(h2, desc);
      panCells.push([img, txt]);
    });
    const panelMetadata = [['Section Metadata'], ['Style', 'icon-panel']];
    const panBlock = WebImporter.DOMUtils.createTable(panCells, document);
    const panMeta = WebImporter.DOMUtils.createTable(panelMetadata, document);
    panBlock.append(panMeta);
    panBlock.append(hr(document));
    panel.replaceWith(panBlock);
  });
}

function importCategoryGrid(main, document) {
  const cg = main.querySelectorAll('section.category-grid:not(#tiers, #pricing)');
  console.log(`category-grid: ${cg.length}`);
  cg.forEach((grid) => {
    const cgCells = [['Columns']];
    const gi = grid.querySelectorAll('section.category-grid-item');
    const cols = [];
    gi.forEach((item) => {
      const textNode = item.querySelector('p.text-link');
      const boldNode = document.createElement('h4');
      boldNode.append(textNode.innerHTML);
      textNode.replaceWith(boldNode);
      cols.push(item);
    });
    if (cols.length > 0) {
      cgCells.push(cols);
    }
    const columnsBlock = WebImporter.DOMUtils.createTable(cgCells, document);
    grid.replaceWith(columnsBlock);
  });
}

function importLandingPageHero(main, document) {
  const lph = main.querySelectorAll('header.landing-page-hero'); // .landing-page-hero--media-floating .landing-page-hero--media-contained
  // other selector: landing-page-hero-media-landscape (example: /unified-communications/)
  const lphCells = [['landing-page-hero (features)']];
  // really *should* be only one of these per page
  lph.forEach((hero) => {
    if (hero.classList.contains('landing-page-hero-media-landscape')) {
      lphCells.pop();
      lphCells.push(['landing-page-hero (category-media)']);
    }
    const title = hero.querySelector('h1.landing-page-hero-title');
    const description = hero.querySelector('.landing-page-hero-description');
    lphCells.push(['title', title.innerHTML]);
    lphCells.push(['description', description.innerHTML]);

    const media = hero.querySelector('div.landing-page-hero-media-container > div > div > div > img, div.landing-page-hero-media-container > img');
    if (media) {
      lphCells.push(['image', media]);
    }
    if (hero.classList.contains('landing-page-hero-media-landscape')) {
      const overlay = main.querySelector('div.stick-promo');
      if (overlay) {
        const ovrList = document.createElement('ul');
        const ovrImg = overlay.querySelector('img');
        const ovrLink = overlay.querySelector('a');
        ovrLink.append(ovrLink.href);
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');
        li1.append(ovrImg);
        li2.append(ovrLink);
        ovrList.append(li1, li2);
        lphCells.push(['overlay', ovrList]);
      }
    }
    const ctas = hero.querySelectorAll('.landing-page-hero-ctas > section > div > button.btn, .landing-page-hero-ctas > a.btn');
    const ctaList = document.createElement('ul');
    ctas.forEach((cta) => {
      const cItem = document.createElement('li');
      cItem.innerHTML = cta.outerHTML;
      ctaList.append(cItem);
    });
    lphCells.push(['ctas', ctaList]);
    const lphBlock = WebImporter.DOMUtils.createTable(lphCells, document);
    const metadata = [['Section Metadata'], ['Style', 'purple-gradient-background']];
    const metaBlock = WebImporter.DOMUtils.createTable(metadata, document);
    lphBlock.append(metaBlock);
    lphBlock.append(hr(document));
    hero.replaceWith(lphBlock);
  });
}

function importMarketplaceSummary(main, document) {
  const mps = main.querySelectorAll('div.marketPlaceSummary');
  mps.forEach((columns) => {
    const mpsCells = [['Columns (market-place-summary)']];
    const column1 = columns.querySelector('section.marketPlace-overview');
    const column2 = columns.querySelector('div.marketPlaceRecomm');
    mpsCells.push([column1, column2]);
    const colsBlock = WebImporter.DOMUtils.createTable(mpsCells, document);
    columns.replaceWith(colsBlock);
  });
}

function importCalloutPromo(main, document) {
  const callPromoX = main.querySelectorAll('div.callout-promo-extrusion, div.gs-promo-extrusion');
  callPromoX.forEach((promo) => {
    const cpxCells = [['callout-promo']];
    if (promo.classList.contains('gs-promo-extrusion')) {
      cpxCells.pop();
      cpxCells.push(['callout-promo (gs-promo-extrusion)']);
    }
    const items = promo.querySelectorAll('div.row > div.col-12');
    items.forEach((item) => {
      cpxCells.push([item]);
    });
    const cpxBlock = WebImporter.DOMUtils.createTable(cpxCells, document);
    promo.replaceWith(cpxBlock);
  });
}

function importDetailsGrid(main, document) {
  const detailsGrid = main.querySelectorAll('section.details-grid div.detail');
  detailsGrid.forEach((grid) => {
    const dgCells = [['columns']];
    const items = grid.querySelectorAll('div.detail-content');
    console.log(`items: ${items.innerHTML}`);
    const dpItems = [];
    items.forEach((item) => {
      dpItems.push(item);
    });
    dgCells.push(dpItems);
    const dGrid = WebImporter.DOMUtils.createTable(dgCells, document);
    grid.replaceWith(dGrid);
  });
}

function importCaseStudy(main, document) {
  const csGrid = main.querySelectorAll('section.case-study');
  csGrid.forEach((study) => {
    const csCells = [['columns (case-study)']];
    const col1 = study.querySelector('div.case-study-information');
    const col2 = study.querySelector('div.case-study-assets-group');
    csCells.push([col1, col2]);

    const caseGrid = WebImporter.DOMUtils.createTable(csCells, document);
    study.replaceWith(caseGrid);
  });
}

function importTrustPilot(main, document) {
  const tp = main.querySelectorAll('section.vonage-embed div.trustpilot-widget');
  tp.forEach((trust) => {
    const tpCells = [['trustpilot']];
    tpCells.push(['template', trust.getAttribute('data-template-id')]);
    const trustPilot = WebImporter.DOMUtils.createTable(tpCells, document);
    trust.replaceWith(trustPilot);
  });
}

function importQnA(main, document) {
  const qnas = main.querySelectorAll('h2.faq-title + div.aem-grid');
  qnas.forEach((qna) => {
    const faqCells = [['QandA']];
    const questions = qna.querySelectorAll('section.faq');
    questions.forEach((question) => {
      const q = question.querySelector('label.tab-label');
      const a = question.querySelector('div.faq-content');
      faqCells.push([q, a]);
    });
    const faqs = WebImporter.DOMUtils.createTable(faqCells, document);
    qna.replaceWith(faqs);
  });
}

function importHeroForm(main, document) {
  const heroForm = main.querySelectorAll('div.heroForm');
  heroForm.forEach((form) => {
    if (main.querySelector('section.flexibleRte')) {
      main.querySelector('section.flexibleRte').prepend(hr(document));
    }
    const hfCells = [['hero-form']];
    const hfContent = form.querySelector('div.campaign-hero-with-form-additional-content');
    const hfSuccess = form.querySelector('div.lightboxFormConfirmation');
    hfCells.push(['copy', hfContent]);
    hfCells.push(['form-id', 'lead-form']);
    hfCells.push(['success', hfSuccess]);
    const hForm = WebImporter.DOMUtils.createTable(hfCells, document);
    form.replaceWith(hForm);
    const smCells = [['section metadata']];
    smCells.push(['style', 'light-grey']);
    const sm = WebImporter.DOMUtils.createTable(smCells, document);
    hForm.append(sm);
  });

  console.log(`Hero Form(s): ${heroForm.length}`);
}

function injectLeadGenFragment(main, document) {
  const lga = main.querySelector('section.lead-gen-alternative');
  if (lga) {
    const frCells = [['fragment']];
    const fragDiv = document.createElement('div');
    const fraglink = document.createElement('a');
    fraglink.setAttribute('href', 'https://main--vonage--hlxsites.hlx.page/unified-communications/fragments/lead-gen');
    fraglink.innerHTML = 'https://main--vonage--hlxsites.hlx.page/unified-communications/fragments/lead-gen';
    fragDiv.append(fraglink);
    frCells.push([fragDiv]);
    const fragment = WebImporter.DOMUtils.createTable(frCells, document);
    fragment.prepend(hr(document));
    lga.replaceWith(fragment);
  }
}

function importLogoStrip(main, document) {
  const logoStrips = main.querySelectorAll('div.logoStrip');
  logoStrips.forEach((strip) => {
    const lsCells = [['cards (logo-strip)']];
    const logoItems = strip.querySelectorAll('div.logo-strip-logo');
    logoItems.forEach((logo) => {
      lsCells.push([logo]);
    });
    const logoStrip = WebImporter.DOMUtils.createTable(lsCells, document);
    strip.replaceWith(logoStrip);
  });
}

function importCardImage3up(main, document) {
  const cards = main.querySelectorAll('div.card-image-3-up > div.container > div.row');
  cards.forEach((card) => {
    const ciCells = [['cards (card-link)']];
    card.querySelectorAll('div.col-12').forEach((item) => {
      const typeDiv = document.createElement('div');
      const anchor = item.querySelector('a');
      const linkedDiv = document.createElement('div');
      const headDiv = document.createElement('div');
      const cat = item.querySelector('span.vlt-card-image-category').innerHTML;
      const type = (item.querySelector('span.vlt-card-image-type')) ? item.querySelector('span.vlt-card-image-type').innerHTML : '';
      const head = item.querySelector('span.vlt-card-image-headline').innerHTML;
      const image = item.querySelector('div.vlt-card-image-image-wrapper img');
      anchor.innerHTML = cat;
      typeDiv.innerHTML = type;
      headDiv.innerHTML = head;
      linkedDiv.append(anchor);
      linkedDiv.append(typeDiv);
      linkedDiv.append(headDiv);
      ciCells.push([image, linkedDiv]);
    });
    const ciCard = WebImporter.DOMUtils.createTable(ciCells, document);
    card.replaceWith(ciCard);
  });
}

function importSpeedBump(main, document) {
  const bumps = main.querySelectorAll('section.speed-bump');
  console.log(`Speed Bump(s): ${bumps.length}`);
  bumps.forEach((bump) => {
    const sbCells = [['speed-bump']];
    sbCells.push(['hero', bump.querySelector('div.speed-bump-container > img')]);
    const contentDiv = document.createElement('div');
    const heading = document.createElement('h3');
    const subHeading = document.createElement('p');
    const description = document.createElement('p');
    subHeading.append(bump.querySelector('div.speed-bump-headline').innerHTML);
    heading.append(bump.querySelector('span.speed-bump-eyebrow').innerHTML);
    description.append(bump.querySelector('div.speed-bump-description').innerHTML);
    contentDiv.append(heading);
    contentDiv.append(subHeading);
    contentDiv.append(description);
    bump.querySelectorAll('div.speed-bump-link-container').forEach((link) => {
      contentDiv.append(link);
    });
    sbCells.push(['copy', contentDiv]);
    const speedBump = WebImporter.DOMUtils.createTable(sbCells, document);
    bump.replaceWith(speedBump);
  });
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    createMetadata(main, document);

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'header.vlt-header',
      'footer',
      '#drift-frame-chat',
      '#drift-frame-controller',
      '#_hjSafeContext_34263817',
      '#onetrust-consent-sdk',
      'body > pre',
      '#new-window',
      'a.skip-to-main',
      'img[src^="https://s.ml-attr.com',
      'iframe[title="Adobe ID Syncing iFrame"]',
      'div.ietrigger',
      'section.date-time-section',
    ]);

    // create the metadata block and append it to the main element
    cleanAnchors(main);
    // createMetadata(main, document);
    importSlimPromo(main, document);
    importPricingMatrix(main, document);
    import2upCards(main, document);
    importIconPanel(main, document);
    importCategoryGrid(main, document);
    importLandingPageHero(main, document);
    importMarketplaceSummary(main, document);
    importCalloutPromo(main, document);
    importDetailsGrid(main, document);
    importCaseStudy(main, document);
    importTrustPilot(main, document);
    importQnA(main, document);
    importHeroForm(main, document);
    injectLeadGenFragment(main, document);
    importLogoStrip(main, document);
    importCardImage3up(main, document);
    importSpeedBump(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
