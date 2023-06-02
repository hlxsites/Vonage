function areaClick(block) {
  const pBlock = block.querySelector('div.slim-promo.columns-2-cols p');
  const pButton = block.querySelector('.slim-promo a.button.secondary');
  const pH2 = block.querySelector('div.slim-promo.columns-2-cols h2');
  // toggle the paragraph and the button display
  if (pBlock.style.display === 'block') {
    pBlock.style.display = 'none';
    pButton.style.display = 'block';
    pH2.style.fontSize = 'initial';
  } else {
    pBlock.style.display = 'block';
    pButton.style.display = 'none';
    pH2.style.fontSize = '2.4rem'; // enlarge the h2 font size
  }
}

function addSlimPromoClick(block, mq) {
  block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > div > a.button.secondary').addEventListener('click', () => {
    areaClick(block);
  });
  if (mq.matches) {
    block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > h2').addEventListener('click', () => {
      areaClick(block);
    });
  } else {
    block.querySelector('div.slim-promo.columns-2-cols > div > div:nth-child(2) > h2').removeEventListener('click');
  }
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  if (block.classList.contains('slim-promo')) {
    const bc = document.createElement('div');
    bc.classList.add('button-container');
    const vo = document.createElement('a');
    vo.innerText = 'View Offer';
    vo.classList.add('view-offer', 'button', 'secondary');
    bc.append(vo);
    block.querySelector('h2').insertAdjacentElement('afterend', bc);
    const mq = window.matchMedia('(max-width: 767px)');
    addSlimPromoClick(block, mq);
  }
}
