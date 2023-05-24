import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const tp = document.createElement('div');
  tp.classList.add('trustpilot-widget');
  tp.dataset.locale = 'en-US';
  tp.dataset.templateId = '5406e65db0d04a09e042d5fc';
  tp.dataset.businessunitId = '481735560000640005026e18';
  tp.dataset.theme = 'light';
  if (cfg.type === 'narrow') {
    const tpiframe = document.createElement('iframe');
    tpiframe.title = 'Customer reviews powered by Trustpilot';
    if (cfg.src) {
      tpiframe.src = cfg.src;
      tp.append(tpiframe);
    }
  }
  block.append(tp);
  decorateIcons(block);
}
