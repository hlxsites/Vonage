
export default function decorate(block) {
  /* change to ul, li */
  const maindiv = document.createElement('div');
  maindiv.className = 'qanda';

  [...block.children].forEach((row) => {
    const questionlabel = document.createElement('label');
    const answerdiv = document.createElement('div');
    const list = row.getElementsByTagName('ul')[0];
    const question = list.getElementsByTagName('li')[0].innerHTML;
    const answer = list.getElementsByTagName('li')[1].innerHTML;
    questionlabel.innerHTML = '<span>Q. </span>' + question;
    answerdiv.innerHTML = '<span>A. </span>' + answer;
    maindiv.append(questionlabel);
    maindiv.append(answerdiv);
  });
  block.textContent = '';
  block.append(maindiv);
}
