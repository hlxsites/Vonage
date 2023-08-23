import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { div, span } from '../../scripts/scripts.js';

function handleTitleClick(block) {
  const colContainer = block.querySelector('div.slim-promo.columns-2-cols .columns-other-col');
  const pBlock = block.querySelector('div.slim-promo.columns-2-cols span.detail-wrapper p');
  const pH2 = block.querySelector('div.slim-promo.columns-2-cols span.title-wrapper');
  const hintSpan = block.querySelector('div.slim-promo.columns-2-cols span.hint-wrapper');
  const pHint = block.querySelector('div.slim-promo.columns-2-cols span.hint-wrapper p');
  const buyContainer = block.querySelector('div.slim-promo.columns-2-cols .columns-other-col p.button-container');
  const buyButton = block.querySelector('div.slim-promo.columns-2-cols .columns-other-col p.button-container a');
  const controlSpan = block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls');
  const openButton = block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.view-offer');
  const closeButton = block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.close-x');

  closeButton.style.top = `${controlSpan.offsetTop}px`;
  closeButton.style.right = '50px';

  if (hintSpan) {
    hintSpan.style.display = hintSpan.style.display === 'block' ? 'none' : 'block';
    hintSpan.style.maxWidth = hintSpan.style.maxWidth === '100%' ? '20%' : '100%';
    pHint.style.display = pHint.style.display === 'block' ? 'none' : 'block';
  }
  if (buyContainer) {
    buyContainer.width = '100%';
    buyContainer.style.display = buyContainer.style.display === 'block' ? 'none' : 'block';
    buyContainer.style.maxWidth = buyContainer.style.maxWidth === '100%' ? '20%' : '100%';
    buyContainer.style.width = buyContainer.style.width === '100%' ? 'unset' : '100%';
    buyButton.style.width = buyButton.style.width === '100%' ? 'unset' : '100%';
    buyButton.style.margin = 0;
    pH2.style.width = pH2.style.width === '95%' ? '75%' : '95%';
  }
  // toggle the paragraph and the button display
  if (pBlock.style.display === 'block') { // close
    colContainer.style.flexDirection = 'row';
    pBlock.style.display = 'none';
    pH2.style.fontSize = 'initial';
    openButton.style.display = 'initial';
    closeButton.style.display = 'none';
    controlSpan.style.padding = '1.5rem';
  } else { // open
    colContainer.style.flexDirection = 'column';
    pBlock.style.display = 'block';
    pH2.style.fontSize = '2.4rem'; // enlarge the h2 font size
    openButton.style.display = 'none';
    closeButton.style.display = 'block';
    controlSpan.style.padding = 0;
  }
}

function addSlimPromoClickHandlers(block) {
  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.title-wrapper').addEventListener('click', () => {
    handleTitleClick(block);
  });

  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.view-offer').addEventListener('click', () => {
    handleTitleClick(block);
  });

  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.close-x').addEventListener('click', () => {
    handleTitleClick(block);
  });
}

// For children of column <div>, if there is an <a> and a <picture> then move
// the <picture> to be a child of the <a>, if it isn't already a child.
function movePictureIntoAnchor(col) {
  const br = col.querySelector('br');
  if (br != null) {
    br.remove();
  }
  const aElem = col.querySelector('a[href]');
  if (aElem != null) {
    aElem.classList.remove('button', 'primary');
    const img = col.querySelector('img');
    if (img != null) {
      aElem.innerHTML = '';
      aElem.append(img.parentNode);
    }
  }
}

// For content between <hr> nodes, move all <li> into a single <ul> and move
// each subsequent <p> as child of the <li>.
function buildSingleList(col) {
  const hrList = col.querySelectorAll('hr');
  if (hrList.length < 1) {
    return;
  }
  const { children } = col;
  let inBetweenHR = false;
  let firstUlElem = null;

  [...children].forEach((child) => {
    if (child.nodeName === 'HR') {
      inBetweenHR = !inBetweenHR;
      child.remove();
      return;
    }

    if (inBetweenHR) {
      if (firstUlElem) {
        if (child.nodeName === 'UL') {
          // Move the <li> within a <ul> to the first <ul>
          const liElem = child.querySelector('li');
          if (liElem) {
            firstUlElem.append(liElem);
          }
        } else {
          // Move any other element to latest <li>
          const liElem = Array.from(firstUlElem.querySelectorAll('li')).pop();
          if (liElem) {
            liElem.append(child);
          }
        }
      }

      // Remove any <ul> except the first
      if (child.nodeName === 'UL') {
        if (firstUlElem == null) {
          firstUlElem = child;
        } else {
          child.remove();
        }
      }
    }
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector('picture')) {
        // column contains a picture
        col.classList.add('columns-img-col');
        // If there is a link specified after the image wrap the image in an a referencing the link
        movePictureIntoAnchor(col);
      } else {
        col.classList.add('columns-other-col');
        col.querySelectorAll('p').forEach((pElem) => {
          if (!pElem.classList.contains('button-container')) {
            pElem.classList.add('detail-paragraph');
          }
        });
      }

      if (block.classList.contains('case-study') && col.classList.contains('columns-other-col')) {
        // For the .columns-other-col <div>, place the last two links
        // into a new child <div>.
        const buttonDiv = div();
        for (let i = col.children.length - 1; i >= 0; i -= 1) {
          const child = col.children[i];
          if (child.classList.contains('button-container')) {
            const link = child.querySelector('a[href]');
            if (link) {
              buttonDiv.prepend(link);
              if (buttonDiv.children.length <= 2) {
                child.remove();
              }
              if (buttonDiv.children.length === 2) {
                col.append(buttonDiv);
                break;
              }
            }
          }
        }
      }
    });
  });

  if (block.classList.contains('market-place-summary')) {
    // with link and image in separate paragraphs
    [...block.querySelectorAll('p > a[href]')]
      // link (in a <p>) has no siblings
      .filter((link) => link.parentNode.childElementCount === 1)
      // is preceded by an image (in a <p>) and image has no other siblings
      .filter((link) => link.parentNode.previousElementSibling?.firstElementChild?.tagName === 'A')
      .filter((link) => link.parentNode.previousElementSibling?.childElementCount === 1)
      // link text is an unformatted URL paste
      .filter((link) => link.parentNode.classList.contains('button-container'))
      .forEach((link) => {
        const a = link.parentNode.previousElementSibling.firstElementChild;
        const label = document.createElement('div');
        label.textContent = link.textContent;
        a.append(label);
        link.parentNode.remove();
      });

    const recdiv = block.querySelector('div > div:nth-child(2)');
    recdiv.className = 'recs';
    const row = document.createElement('div');
    row.className = 'row';
    [...recdiv.querySelectorAll('img')].forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }])));

    [...recdiv.querySelectorAll('p')]
      .forEach((p) => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = p.innerHTML;
        row.append(col);
        p.remove();
      });
    recdiv.append(row);
  }

  /* Process details-columns */
  if (block.classList.contains('details-columns')) {
    [...block.children].forEach((row) => {
      [...row.children].forEach((col) => {
        if (col.classList.contains('columns-other-col')) {
          buildSingleList(col);

          // Remove all "button.primary" classes from links
          const buttonList = col.querySelectorAll('a.button');
          buttonList.forEach((button) => {
            button.classList.remove('button');
            button.classList.remove('primary');
          });
        }
      });
    });
  }

  if (block.classList.contains('slim-promo')) {
    const offerControls = span({ class: 'controls' }, span({ class: 'view-offer', innerHTML: 'View Offer' }), span({ class: 'close-x', innerHTML: 'x' }));
    const offerTitle2 = block.querySelector('div.columns-other-col h2');
    const offerTitle4 = block.querySelector('div.columns-other-col h4');
    let offerHint;
    let offerDetails;
    if (block.classList.contains('hint-buy')) {
      offerHint = block.querySelector('.hint-buy div.columns-other-col p');
      offerDetails = block.querySelector('div.columns-other-col p:nth-child(4)');
    } else {
      offerDetails = block.querySelector('div.columns-other-col p');
    }

    if (offerTitle2) {
      offerTitle2.remove();
      block.querySelector('.columns-other-col').appendChild(span({ class: 'title-wrapper' }, offerTitle2));
    } else if (offerTitle4) {
      offerTitle4.remove();
      block.querySelector('.columns-other-col').prepend(span({ class: 'title-wrapper' }, offerTitle4));
    }

    if (offerHint) {
      offerHint.remove();
      block.querySelector('.title-wrapper').after(span({ class: 'hint-wrapper' }, offerHint));
    }

    if (offerDetails) {
      offerDetails.remove();
      block.querySelector('.columns-other-col').appendChild(offerControls);
      block.querySelector('.columns-other-col').appendChild(span({ class: 'detail-wrapper' }, offerDetails));
      addSlimPromoClickHandlers(block);
    }
  }
}
