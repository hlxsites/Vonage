import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { div, span } from '../../scripts/scripts.js';

function handleTitleClick(block) {
  const pBlock = block.querySelector('div.slim-promo.columns-2-cols p');
  const pH2 = block.querySelector('div.slim-promo.columns-2-cols h2');
  const openButton = block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.view-offer');
  const closeButton = block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.controls > span.close-x');

  // toggle the paragraph and the button display
  if (pBlock.style.display === 'block') {
    pBlock.style.display = 'none';
    pH2.style.fontSize = 'initial';
    openButton.style.display = 'initial';
    closeButton.style.display = 'none';
  } else {
    pBlock.style.display = 'block';
    pH2.style.fontSize = '2.4rem'; // enlarge the h2 font size
    openButton.style.display = 'none';
    closeButton.style.display = 'block';
  }
}

function addSlimPromoClickHandlers(block) {
  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > span.titleWrapper > h2').addEventListener('click', () => {
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
    const img = col.querySelector('div > picture > img');
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
      } else {
        col.classList.add('columns-other-col');
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
        if (col.classList.contains('columns-img-col')) {
          movePictureIntoAnchor(col);
        }
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
    const offerTitle = block.querySelector('div.columns-other-col h2');
    const offerDetails = block.querySelector('div.columns-other-col p');

    offerTitle.remove();
    offerDetails.remove();

    block.querySelector('.columns-other-col').appendChild(span({ class: 'titleWrapper' }, offerTitle));
    block.querySelector('.columns-other-col').appendChild(offerControls);
    block.querySelector('.columns-other-col').appendChild(span({ class: 'detailWrapper' }, offerDetails));

    addSlimPromoClickHandlers(block);
  }
}
