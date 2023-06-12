
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
        itemdiv.append(questionlabel);
        itemdiv.append(answerdiv);
        maindiv.append(itemdiv);
    });

    block.textContent = '';
    block.append(maindiv);
}
