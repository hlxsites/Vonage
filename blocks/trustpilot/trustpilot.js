import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * This block relies on the TrustPilot script loading iframes
 * into this DIV.
 * @param [String] template The template ID that tells TP which widget to load.
 */
export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const tp = document.createElement('div');
  tp.classList.add('trustpilot-widget');
  // Required TrustPilot account ID
  tp.dataset.businessunitId = '481735560000640005026e18';

  // Required block argument
  try {
    tp.dataset.templateId = cfg.template;
  } catch {
    console.warn('Missing the required TrustPilot templateId');
  }

  // Optional block arguments
  if (cfg.height) {
    tp.dataset.styleHeight = cfg.height;
  } else {
    tp.dataset.styleHeight = '30px';
  }

  if (cfg.width) {
    tp.dataset.styleWidth = cfg.width;
  } else {
    tp.dataset.styleWidth = '100%';
  }

  if (cfg.theme) {
    tp.dataset.theme = cfg.theme;
  } else {
    tp.dataset.theme = 'light';
  }

  if (cfg.stars) {
    tp.dataset.stars = cfg.stars;
  } else {
    tp.dataset.stars = '4,5';
  }

  if (cfg.language) {
    tp.dataset.language = cfg.language;
  } else {
    tp.dataset.language = 'en';
  }

  if (cfg.locale) {
    tp.dataset.locale = cfg.locale;
  } else {
    tp.dataset.locale = 'en-US';
  }

  block.append(tp);
  decorateIcons(block);
}
