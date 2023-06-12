import { a, div, span } from '../../scripts/scripts.js';
import { toClassName } from '../../scripts/lib-franklin.js';

function decorateDescription(descriptionContent) {
  const links = descriptionContent.querySelectorAll('li > a');
  const linksArray = Array.from(links);
  let linksRemaining = linksArray.length;

  // For the landing page hero parse | delimited links from
  // the markdown to allow for title attribute specification
  linksArray.forEach((link) => {
    if (link.innerText.includes('|')) {
      const [linkText, linkTitle] = link.innerText.split('|');
      link.setAttribute('title', linkTitle);
      link.innerHTML = linkText;
    }
    // Inject span elements to act as dividers between the links
    if (linksRemaining > 1) {
      const spanDivider = span({ class: 'divider' }, '|');
      link.after(spanDivider);
      // eslint-disable-next-line no-plusplus
      linksRemaining--;
    }
  });

  // If the description texts bulleted list contained no links set the styling on bullets to be just plain text
  if (linksArray.length === 0) {
    descriptionContent.classList.add('inline-bulleted-list');
  }
}

function createVideoPlayButton(videoContent) {
  const videoUrl = videoContent.innerText;
  const videoPlayButton = document.createElement('div');
  videoPlayButton.innerHTML = `<button class="slim-video__cta" aria-label="Watch the Vonage Business Solutions overview view in a lightbox">
                                  <span class="play-video">
                                    <span class="play-video--background"></span>
                                  </span>
                                  <span class="play-video">
                                    <span class="play-video--arrow"></span>
                                  </span>
                               </button>`;

  videoPlayButton.addEventListener('click', () => {
    const videoOverlay = (document.querySelector('.video-overlay'));
    const videoPlayer = videoOverlay.querySelector('iframe');
    videoOverlay.classList.add('video-overlay--open');
    videoPlayer.setAttribute('src', videoUrl);
  });
  return videoPlayButton;
}
function createVideoOverlay() {
  const videoOverlay = div({ class: 'video-wrapper' });
  videoOverlay.innerHTML = `<section class="video-overlay">
                              <div class="video-overlay__background"></div>
                              <button class="video-overlay__close" aria-label="Close Button">
                                <span class="Vlt-icon-close-circle"></span>
                              </button>
                              <div class="video-overlay__video">
                               <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope;picture-in-picture" allowfullscreen="" class="video-overlay__iframe" title="Activate conversations everywhere with Vonage Business Communications" tabindex="0" id="video-iframe"></iframe>
                              </div>
                            </section>`;

  const videoCloseButton = videoOverlay.querySelector('.video-overlay__close');
  videoCloseButton.addEventListener('click', () => {
    const videoContainer = (document.querySelector('.video-overlay'));
    const videoPlayer = videoContainer.querySelector('iframe');
    videoContainer.classList.remove('video-overlay--open');
    videoPlayer.setAttribute('src', '');
  });

  return videoOverlay;
}

function assembleMediaContent(imageContent, videoContent, overlayContent, captionContent) {
  const mediaContent = div({ class: 'landing-page-hero-media-content' });
  if (imageContent) {
    mediaContent.appendChild(imageContent);
  }

  if (captionContent) {
    mediaContent.appendChild(captionContent);
  }

  if (overlayContent) {
    mediaContent.appendChild(overlayContent);
  }

  if (videoContent) {
    mediaContent.appendChild(createVideoPlayButton(videoContent));
  }

  mediaContent.appendChild(createVideoOverlay());
  return mediaContent;
}

function buildOverlay(overlayRawContent) {
  const overlayContent = div({ class: 'overlay' });

  const overlayImage = overlayRawContent.querySelector(':scope picture');
  const overlayLink = overlayRawContent.querySelector(':scope li > a');

  overlayRawContent.querySelectorAll(':scope li > ul > li > code').forEach((styleRule) => {
    overlayContent.style.cssText += styleRule.innerHTML;
  });

  overlayContent.appendChild(a({ class: 'overlay-link-wrapper', href: overlayLink.href }, overlayImage));

  return overlayContent;
}
function decorateCtasContent(ctasContent, stylesList) {
  stylesList.forEach((style) => {
    if (style.includes('button')) {
      ctasContent.classList.add(style);
    }
  });
}

export default function decorate(block) {
  // If the markdown specifies a background property, need to bubble that up to the section wrapper
  if (block.classList.contains('purple-gradient-background')) {
    block.parentElement.parentElement.classList.add('purple-gradient-background');
    block.classList.remove('purple-gradient-background');
  }

  const heroContainer = div({ class: block.classList });
  // TODO: Potentially add logic so that you can control which side is the descriptor and which is the media via the order
  //  of the class passed to the block? As well as to allow building a header with only one column
  heroContainer.appendChild(div({ class: 'landing-page-hero-column category' }));
  heroContainer.appendChild(div({ class: 'landing-page-hero-column media' }));

  // Iterate through all the divs of the raw block rows and apply the innerText of the first row as a class to the next since that's how we identify the styling of and nature of the content
  const rawDivElems = block.querySelectorAll(':scope div > div');

  // Parse the elements of the markdown taking the first column row as the classname to apply to the content of the second row, then ditch the first row
  for (let i = 0; i < rawDivElems.length - 1; i += 2) {
    rawDivElems[i + 1].classList.add(toClassName(rawDivElems[i].innerText));
    rawDivElems[i].remove();
  }

  const titleContent = block.querySelector(':scope div.title');
  const descriptionContent = block.querySelector(':scope div.description');
  decorateDescription(descriptionContent);

  const ctasContent = block.querySelector(':scope div.ctas');
  decorateCtasContent(ctasContent, block.classList);

  const imageContent = block.querySelector(':scope div.image');
  const videoContent = block.querySelector(':scope div.video');

  const rawOverlayContent = block.querySelector(':scope div.overlay');
  let overlayContent;
  if (rawOverlayContent) {
    overlayContent = buildOverlay(rawOverlayContent);
  }

  const captionContent = block.querySelector(':scope div.caption');

  heroContainer.querySelector('.category').appendChild(div({ class: 'landing-page-hero-category-content' }, titleContent, descriptionContent, ctasContent));
  heroContainer.querySelector('.media').appendChild(assembleMediaContent(imageContent, videoContent, overlayContent, captionContent));
  block.parentElement.replaceChild(heroContainer, block);
}
