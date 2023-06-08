export default function decorate(block) {
  const innerContainer = document.createElement('div');
  innerContainer.append(...block.querySelectorAll(':scope > div'));
  block.append(innerContainer);
}
