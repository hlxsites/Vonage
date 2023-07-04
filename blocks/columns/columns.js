import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/scripts.js';

function handleTitleClick(block) {
  const pBlock = block.querySelector('div.slim-promo.columns-2-cols p');
  const pButton = block.querySelector('.slim-promo a.button.secondary');
  const pH2 = block.querySelector('div.slim-promo.columns-2-cols h2');
  // toggle the paragraph and the button display
  if (pBlock.style.display === 'block') {
    pBlock.style.display = 'none';
    pButton.style.display = 'initial';
    pH2.style.fontSize = 'initial';
  } else {
    pBlock.style.display = 'block';
    pButton.style.display = 'none';
    pH2.style.fontSize = '2.4rem'; // enlarge the h2 font size
  }
}

// eslint-disable-next-line no-unused-vars
function addSlimPromoClick(block, mq) {
  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > div > a.button.secondary').addEventListener('click', () => {
    handleTitleClick(block);
  });
  if (mq.matches) {
    block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > h2').addEventListener('click', () => {
      handleTitleClick(block);
    });
  } else {
    block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > h2').removeEventListener('click', () => {
      // do nothing
    });
  }
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
        // For the div with no picture elements, place the last two links into
        // a new child div.    
        const buttonDiv = div();
        for (var i = col.children.length - 1; i >= 0; i--) {
          var child = col.children[i];
          if (child.classList.contains('button-container')) {
            var link = child.querySelector('a[href]');
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
}
