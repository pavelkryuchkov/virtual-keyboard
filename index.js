import { KEYS, KEYS_DARK } from './constants.js';

function renderTextarea() {
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  document.body.append(textarea);
}

function createKey(key) {
  const html = `
<div class="
    key 
    ${KEYS_DARK.includes(key) ? 'key_dark' : ''}
    ${key.length > 1 ? 'key_long' : ''} 
    ${key === 'Whitespace' ? 'key_whitespace' : ''}
    ">
  ${key === 'Whitespace' ? '' : key}
</div>
`;
  return html;
}

function renderKeyboard() {
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  KEYS.forEach((rowKeys) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    let rowHTML = '';
    rowKeys.forEach((key) => {
      rowHTML += createKey(key);
    });
    keyboardRow.innerHTML = rowHTML;
    keyboard.append(keyboardRow);
  });
  document.body.append(keyboard);
}

renderTextarea();
renderKeyboard();

const textarea = document.querySelector('.textarea');
textarea.textContent = 'aaa';
// console.log(textarea.selectionEnd);
