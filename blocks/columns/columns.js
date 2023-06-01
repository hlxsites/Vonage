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
  }
}
