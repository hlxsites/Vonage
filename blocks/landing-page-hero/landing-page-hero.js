import {
  a, div, section, span,
} from '../../scripts/scripts.js';
import { toClassName } from '../../scripts/lib-franklin.js';
import { fetchFormContent } from '../../forms/forms.js';

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
  videoPlayButton.innerHTML = `<button class="slim-video-cta" aria-label="Watch the Vonage Business Solutions overview view in a lightbox">
                                  <span class="play-video">
                                    <span class="play-video-background"></span>
                                  </span>
                                  <span class="play-video">
                                    <span class="play-video-arrow"></span>
                                  </span>
                               </button>`;

  videoPlayButton.addEventListener('click', () => {
    const videoOverlay = (document.querySelector('.video-overlay'));
    const videoPlayer = videoOverlay.querySelector('iframe');
    videoOverlay.classList.add('video-overlay-open');
    videoPlayer.setAttribute('src', videoUrl);
  });
  return videoPlayButton;
}
function createVideoOverlay() {
  const videoOverlay = div({ class: 'video-wrapper' });
  videoOverlay.innerHTML = `<section class="video-overlay">
                              <div class="video-overlay-background"></div>
                              <button class="video-overlay-close" aria-label="Close Button">
                                <span class="vlt-icon-close-circle"></span>
                              </button>
                              <div class="video-overlay-video">
                               <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope;picture-in-picture" allowfullscreen="" class="video-overlay-iframe" title="Activate conversations everywhere with Vonage Business Communications" tabindex="0" id="video-iframe"></iframe>
                              </div>
                            </section>`;

  const videoCloseButton = videoOverlay.querySelector('.video-overlay-close');
  videoCloseButton.addEventListener('click', () => {
    const videoContainer = (document.querySelector('.video-overlay'));
    const videoPlayer = videoContainer.querySelector('iframe');
    videoContainer.classList.remove('video-overlay-open');
    videoPlayer.setAttribute('src', '');
  });

  return videoOverlay;
}

function createFormOverlay(formContent) {
  const formOverlay = div({
    class: 'form-overlay__overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'form',
  });

  formOverlay.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-12 text-right">
            <button class="Vlt-icon-close form-overlay__close" aria-label="Close modal"></button>
          </div>
        </div>
      </div>`;

  formOverlay.querySelector('div.col-12').append(formContent);

  const formCloseButton = formOverlay.querySelector('.form-overlay__close');
  formCloseButton.addEventListener('click', () => {
    const formContainer = (document.querySelector('.form-overlay'));
    formContainer.classList.remove('form-overlay--open');
  });

  return formOverlay;
}
function assembleMediaContent(elements) {
  const mediaContent = div({ class: 'media-content' });

  // Iterate through the passed elements and append them to the media column
  elements.forEach((element) => {
    // If the element is a video reference set up the play icon and iframe video container
    if (element.classList.contains('video')) {
      mediaContent.appendChild(createVideoPlayButton(element));
      mediaContent.appendChild(createVideoOverlay());
    } else {
      mediaContent.appendChild(element);
    }
  });
  return mediaContent;
}

function buildOverlay(overlayRawContent) {
  const overlayContent = div({ class: 'overlay' });

  const overlayImage = overlayRawContent.querySelector('picture');
  const overlayLink = overlayRawContent.querySelector('li > a');

  overlayRawContent.querySelectorAll('li > ul > li > code').forEach((styleRule) => {
    overlayContent.style.cssText += styleRule.innerHTML;
  });

  overlayContent.appendChild(a({ class: 'overlay-link-wrapper', href: overlayLink.href }, overlayImage));

  return overlayContent;
}

function getFormSection(button) {
  const formSection = section({ class: 'form-overlay' });
  formSection.innerHTML = `<div class="form-overlay__trigger">
      <!--might need to think about how to styyle this button based on the styling of the landing-page-hero or section metadata -->
      <a class="btn form-overlay__button">${button.innerText}</a>
    </div>
    <div class="form-overlay__overlay">
      <!--Form Content Goes Here -->
    </div>`;

  return formSection;
}
async function decorateCtasContent(ctasContent, stylesList) {
  ctasContent.querySelectorAll('a').forEach(async (button) => {
    // If the CTA contains a reference to the forms/ folder pull in the referenced form html and adjust the button so that a click pops up the modal window with the referenced form
    const rawLink = button.getAttribute('href');
    if (rawLink.match('forms/')) {
      button.replaceWith(getFormSection(button));
      const formPath = rawLink.substring(rawLink.indexOf('/') + 1);
      const formContent = fetchFormContent(`${formPath}`);
      ctasContent.querySelector('.form-overlay__overlay').replaceWith(createFormOverlay(await formContent));

      const newButton = ctasContent.querySelector('.form-overlay__button');
      newButton.addEventListener('click', () => {
        const formOverlay = (document.querySelector('.form-overlay'));
        formOverlay.classList.add('form-overlay--open');
      });
    }
  });

  stylesList.forEach((style) => {
    if (style.includes('button')) {
      ctasContent.classList.add(style);
    }
  });
}

function buildTPWidget(tpElement) {
  const template = tpElement.innerText;
  tpElement.classList.add('trustpilot-widget');
  tpElement.dataset.businessunitId = '481735560000640005026e18';
  tpElement.dataset.templateId = template;
  tpElement.innerText = '';
  return tpElement;
}

export default async function decorate(block) {
  // If the markdown specifies a background property, need to bubble that up to the section wrapper
  // So that the background spans the width of hte page
  if (block.classList.contains('purple-gradient-background')) {
    block.parentElement.parentElement.classList.add('purple-gradient-background');
    block.classList.remove('purple-gradient-background');
  }

  const heroContainer = div({ class: block.classList });
  heroContainer.appendChild(div({ class: 'column category' }));
  heroContainer.appendChild(div({ class: 'column media' }));

  // Iterate through all the divs of the raw block rows and apply the innerText of the first row as a class to the next since that's how we identify the styling of and nature of the content
  const rawDivElems = block.querySelectorAll(':scope div > div');

  // Parse the elements of the markdown taking the first column row as the classname to apply to the content of the second row, then ditch the first row
  for (let i = 0; i < rawDivElems.length - 1; i += 2) {
    rawDivElems[i + 1].classList.add(toClassName(rawDivElems[i].innerText));
    rawDivElems[i].remove();
  }

  // Collect and decorate the elements from the markdown rows
  const titleContent = block.querySelector('div.title');
  const descriptionContent = block.querySelector('div.description');
  decorateDescription(descriptionContent);

  const ctasContent = block.querySelector('div.ctas');
  decorateCtasContent(ctasContent, block.classList);

  const disclaimerContent = block.querySelector('div.disclaimer');

  const imageContent = block.querySelector('div.image');
  const videoContent = block.querySelector('div.video');

  const rawOverlayContent = block.querySelector('div.overlay');
  let overlayContent;
  if (rawOverlayContent) {
    overlayContent = buildOverlay(rawOverlayContent);
  }

  const trustPilotDiv = block.querySelector('div.trustpilot-template');
  let trustPilotContent;
  if (trustPilotDiv) {
    trustPilotContent = buildTPWidget(trustPilotDiv);
  }

  const captionContent = block.querySelector('div.caption');

  // Build out the list of elements to include in the textual side of the hero
  const categoryElements = [];
  if (titleContent) {
    categoryElements.push(titleContent);
  }
  if (descriptionContent) {
    categoryElements.push(descriptionContent);
  }
  if (ctasContent) {
    categoryElements.push(ctasContent);
  }
  if (disclaimerContent) {
    categoryElements.push(disclaimerContent);
  }

  // Build out the list of elements to include in the media side of the hero
  const mediaElements = [];
  if (imageContent) {
    mediaElements.push(imageContent);
  }
  if (videoContent) {
    mediaElements.push(videoContent);
  }
  if (overlayContent) {
    mediaElements.push(overlayContent);
  }
  if (trustPilotContent) {
    mediaElements.push(trustPilotContent);
  }
  if (captionContent) {
    mediaElements.push(captionContent);
  }

  // Feed the appropriate elements to the appropriate column
  // Using a special method for the media column in order to allow for generating the video play button and iframe
  heroContainer.querySelector('.category').appendChild(div({ class: 'category-content' }, ...categoryElements));
  heroContainer.querySelector('.media').appendChild(assembleMediaContent(mediaElements));

  // Replace the raw markdown content with the stylized one
  block.parentElement.replaceChild(heroContainer, block);
}
