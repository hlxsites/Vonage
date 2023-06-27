import { readBlockConfig, decorateIcons, createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const cfg = readBlockConfig(block);
  const container = document.createElement('div');
  const sbImage = document.createElement('div');
  const sbContent = block.querySelector(':scope > div:nth-child(2) > div:nth-child(2)');
  sbContent.className = 'speed-bump-content';
  sbImage.className = 'speed-bump-image';
  sbImage.append(createOptimizedPicture(cfg.hero, 'hero'));
  container.append(sbImage);
  container.append(sbContent);
  container.className = 'speed-bump-container';
  block.innerHTML = '';
  block.append(container);
  decorateIcons(block);
}
