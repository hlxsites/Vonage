function expand(event) {
  const label = event.target;//.closest('label');
  const answer = label.nextElementSibling;
  if (label.ariaExpanded === 'true') {
    answer.style.height = 0;
    answer.style.padding = 0;
    answer.ariaHidden = true;
    label.ariaExpanded = false;
  } else {
    answer.style.height = `${answer.scrollHeight}px`;
    answer.style.padding = null;
    answer.ariaHidden = false;
    label.ariaExpanded = true;
  }
}

export default function decorate(block) {
    const maindiv = document.createElement('div');
    maindiv.className = 'qanda-content';

    [...block.children].forEach((row) => {
        const itemdiv = document.createElement('div');
        const questionlabel = document.createElement('label');
        const answerdiv = document.createElement('div');
        const question = row.getElementsByTagName('div')[0].innerHTML;
        const answer = row.getElementsByTagName('div')[1].innerHTML;
        questionlabel.innerHTML = '<span>Q. </span>' + question;
        answerdiv.innerHTML = '<span>A. </span>' + answer;
        questionlabel.addEventListener('click', expand);
        answerdiv.style.height = 0;
        answerdiv.style.padding = 0;
        answerdiv.ariaHidden = true;
        questionlabel.ariaExpanded = false;
        itemdiv.append(questionlabel);
        itemdiv.append(answerdiv);
        maindiv.append(itemdiv);
    });

    block.textContent = '';
    block.append(maindiv);
}
