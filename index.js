import {
  KEYS,
  KEYS_DARK,
  KEYS_SHIFT,
  KEYS_CAPS,
  KEYS_CAPS_SHIFT,
  CODES_MAP,
} from './constants.js';

function renderPage() {
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  document.body.append(textarea);

  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  document.body.append(keyboard);
}

renderPage();

const keyboard = document.querySelector('.keyboard');
const textarea = document.querySelector('.textarea');
let keys = KEYS;
let keysPressed = [];
let shiftPressed = false;
let capsPressed = false;

function createKey(key, id) {
  const html = `
<div class="
    key 
    ${KEYS_DARK.includes(key) ? 'key_dark' : ''}
    ${key.length > 1 ? 'key_long' : ''} 
    ${key === 'Whitespace' ? 'key_whitespace' : ''}
    ${keysPressed.includes(id) ? 'key_active' : ''}
    "
    data-key-id="${id}"
    >
  ${key === 'Whitespace' ? '' : key}
</div>
`;
  return html;
}

function renderKeys() {
  keyboard.innerHTML = '';
  keys.forEach((rowKeys, rowIndex) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    let rowHTML = '';
    rowKeys.forEach((key, keyIndex) => {
      rowHTML += createKey(key, `${rowIndex},${keyIndex}`);
    });
    keyboardRow.innerHTML = rowHTML;
    keyboard.append(keyboardRow);
  });
}

renderKeys();

textarea.addEventListener('blur', () => {
  textarea.selectionStart = textarea.value.length;
  textarea.selectionEnd = textarea.value.length;
});

keyboard.addEventListener('mousedown', (event) => {
  event.preventDefault();
  const key = event.target.closest('.key');
  if (!key) {
    return;
  }
  // key.classList.add('key_active');

  textarea.focus();
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  const prevValue = textarea.value;
  let keyText = key.textContent.trim();

  if (keyText === 'Backspace') {
    if (start === end) {
      let newValue = prevValue.slice(0, start - 1);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start - 1;
      textarea.selectionEnd = start - 1;
    } else {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    }
  } else if (keyText === 'Del') {
    if (start === end) {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end + 1);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    } else {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    }
  } else if (keyText === 'CapsLock') {
    if (capsPressed) {
      capsPressed = false;
      key.classList.remove('key_active');
      keysPressed = keysPressed.filter((id) => id !== key.dataset.keyId);
      if (shiftPressed) {
        keys = KEYS_SHIFT;
      } else {
        keys = KEYS;
      }
      renderKeys();
    } else {
      capsPressed = true;
      key.classList.add('key_active');
      keysPressed.push(key.dataset.keyId);
      if (shiftPressed) {
        keys = KEYS_CAPS_SHIFT;
      } else {
        keys = KEYS_CAPS;
      }
      renderKeys();
    }
  } else if (keyText === 'Shift') {
    shiftPressed = true;
    keysPressed.push(key.dataset.keyId);
    if (capsPressed) {
      keys = KEYS_CAPS_SHIFT;
      renderKeys();
    } else {
      keys = KEYS_SHIFT;
      renderKeys();
    }
  } else {
    if (keyText === '') {
      keyText = ' ';
    } else if (keyText === 'Tab') {
      keyText = '\t';
    } else if (keyText === 'Enter') {
      keyText = '\n';
    } else if (['Ctrl', 'Alt', 'Win'].includes(keyText)) {
      keyText = '';
    }
    let newValue = prevValue.slice(0, start);
    newValue += keyText;
    newValue += prevValue.slice(end);
    textarea.value = newValue;
    textarea.selectionStart = start + keyText.length;
    textarea.selectionEnd = start + keyText.length;
  }
  // console.log(key);
  // console.log(keysPressed);
});

document.addEventListener('mouseup', (event) => {
  // for (const row of keyboard.children) {
  //   for (const key of row.children) {
  //     key.classList.remove('key_active');
  //   }
  // }
  if (shiftPressed) {
    shiftPressed = false;
    keysPressed = keysPressed.filter((id) => id !== '3,0' && id !== '3,12');

    if (capsPressed) {
      keys = KEYS_CAPS;
      renderKeys();
    } else {
      keys = KEYS;
      renderKeys(KEYS);
    }
  }
});

document.addEventListener('keydown', (event) => {
  event.preventDefault();

  const code = event.code;
  keysPressed.push(CODES_MAP[code]);
  if (shiftPressed && capsPressed) {
    keys = KEYS_CAPS_SHIFT;
    renderKeys();
  } else if (shiftPressed) {
    keys = KEYS_SHIFT;
    renderKeys();
  } else if (capsPressed) {
    keys = KEYS_CAPS;
    renderKeys();
  } else {
    keys = KEYS;
    renderKeys();
  }

  textarea.focus();
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  const prevValue = textarea.value;
  let keyText;
  let [rowNumer, keyNumber] = CODES_MAP[code]
    .split(',')
    .map((num) => Number(num));
  keys.forEach((row, i) => {
    row.forEach((key, j) => {
      if (i === rowNumer && j === keyNumber) {
        keyText = key;
      }
    });
  });

  if (keyText === 'Backspace') {
    if (start === end) {
      let newValue = prevValue.slice(0, start - 1);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start - 1;
      textarea.selectionEnd = start - 1;
    } else {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    }
  } else if (keyText === 'Del') {
    if (start === end) {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end + 1);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    } else {
      let newValue = prevValue.slice(0, start);
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = start;
      textarea.selectionEnd = start;
    }
  } else if (keyText === 'CapsLock') {
    if (capsPressed) {
      capsPressed = false;
      if (shiftPressed) {
        keys = KEYS_SHIFT;
      } else {
        keys = KEYS;
      }
      renderKeys();
    } else {
      capsPressed = true;
      keysPressed.push(CODES_MAP[code]);
      if (shiftPressed) {
        keys = KEYS_CAPS_SHIFT;
      } else {
        keys = KEYS_CAPS;
      }
      renderKeys();
    }
  } else if (keyText === 'Shift') {
    shiftPressed = true;
    if (capsPressed) {
      keys = KEYS_CAPS_SHIFT;
      renderKeys();
    } else {
      keys = KEYS_SHIFT;
      renderKeys();
    }
  } else {
    if (keyText === 'Whitespace') {
      keyText = ' ';
    } else if (keyText === 'Tab') {
      keyText = '\t';
    } else if (keyText === 'Enter') {
      keyText = '\n';
    } else if (['Ctrl', 'Alt', 'Win'].includes(keyText)) {
      keyText = '';
    }
    let newValue = prevValue.slice(0, start);
    newValue += keyText;
    newValue += prevValue.slice(end);
    textarea.value = newValue;
    textarea.selectionStart = start + keyText.length;
    textarea.selectionEnd = start + keyText.length;
  }
});

document.addEventListener('keyup', (event) => {
  event.preventDefault();

  const code = event.code;
  if (code !== 'CapsLock') {
    keysPressed = keysPressed.filter((id) => id !== CODES_MAP[code]);
  } else if (capsPressed === false) {
    keysPressed = keysPressed.filter((id) => id !== CODES_MAP[code]);
  }

  if (code === 'ShiftLeft' || code === 'ShiftRight') {
    shiftPressed = false;
  }
  if (shiftPressed && capsPressed) {
    keys = KEYS_CAPS_SHIFT;
    renderKeys();
  } else if (shiftPressed) {
    keys = KEYS_SHIFT;
    renderKeys();
  } else if (capsPressed) {
    keys = KEYS_CAPS;
    renderKeys();
  } else {
    keys = KEYS;
    renderKeys();
  }
});
