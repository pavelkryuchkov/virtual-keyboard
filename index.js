import {
  KEYS,
  KEYS_RU,
  KEYS_SHIFT,
  KEYS_SHIFT_RU,
  KEYS_CAPS,
  KEYS_CAPS_RU,
  KEYS_CAPS_SHIFT,
  KEYS_CAPS_SHIFT_RU,
  KEYS_DARK,
  CODES_MAP,
} from './constants.js';

function renderPage() {
  const textarea = document.createElement('textarea');
  textarea.classList.add('textarea');
  document.body.append(textarea);

  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  document.body.append(keyboard);

  const text1 = document.createElement('p');
  text1.textContent = 'Клавиатура создана в операционной системе Windows';
  document.body.append(text1);

  const text2 = document.createElement('p');
  text2.textContent = 'Для переключения языка комбинация: левыe ctrl + alt';
  document.body.append(text2);
}

renderPage();

const keyboard = document.querySelector('.keyboard');
const textarea = document.querySelector('.textarea');
let lang;
if (localStorage.getItem('keyboardLanguage')) {
  lang = localStorage.getItem('keyboardLanguage');
} else {
  lang = 'en';
}
let keys = lang === 'en' ? KEYS : KEYS_RU;
let keysPressed = [];
let shiftPressed = false;
let shiftMousePressed = false;
let capsPressed = false;

function createKey(key, id) {
  const html = `
<div class="
    key 
    ${KEYS_DARK.includes(key) ? 'key_dark' : ''}
    ${key.length > 1 ? 'key_long' : ''} 
    ${key === 'Whitespace' ? 'key_whitespace' : ''}
    "
    data-key-id="${id}"
    >
  ${key === 'Whitespace' ? '' : key}
</div>
`;
  return html;
}

function createKeys() {
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

function renderKeys() {
  Array.from(keyboard.children).forEach((row, rowIndex) => {
    Array.from(row.children).forEach((key, keyIndex) => {
      key.classList.remove('key_active');
      const changeKey = key;
      let newText = keys[rowIndex][keyIndex];
      if (newText === 'Whitespace') {
        newText = '';
      }
      changeKey.textContent = newText;
      if (keysPressed.includes(key.dataset.keyId)) {
        key.classList.add('key_active');
      }
    });
  });
}

createKeys();

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
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const prevValue = textarea.value;
  let keyText = key.textContent.trim();

  if (keyText === 'Backspace') {
    if (start === end) {
      let newValue = prevValue.slice(0, Math.max(0, start - 1));
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = Math.max(0, start - 1);
      textarea.selectionEnd = Math.max(0, start - 1);
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
        keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
      } else {
        keys = lang === 'en' ? KEYS : KEYS_RU;
      }
      renderKeys();
    } else {
      capsPressed = true;
      key.classList.add('key_active');
      keysPressed.push(key.dataset.keyId);
      if (shiftPressed) {
        keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
      } else {
        keys = lang === 'en' ? KEYS_CAPS : KEYS_CAPS_RU;
      }
      renderKeys();
    }
  } else if (keyText === 'Shift') {
    shiftPressed = true;
    shiftMousePressed = true;
    keysPressed.push(key.dataset.keyId);
    if (capsPressed) {
      keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
      renderKeys();
    } else {
      keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
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

document.addEventListener('mouseup', () => {
  // for (const row of keyboard.children) {
  //   for (const key of row.children) {
  //     key.classList.remove('key_active');
  //   }
  // }
  if (shiftMousePressed) {
    shiftPressed = false;
    shiftMousePressed = false;
    keysPressed = keysPressed.filter((id) => id !== '3,0' && id !== '3,12');

    if (capsPressed) {
      keys = lang === 'en' ? KEYS_CAPS : KEYS_CAPS_RU;
      renderKeys();
    } else {
      keys = lang === 'en' ? KEYS : KEYS_RU;
      renderKeys();
    }
  }
});

document.addEventListener('keydown', (event) => {
  event.preventDefault();

  const { code } = event;
  if (!CODES_MAP[code]) return;
  keysPressed.push(CODES_MAP[code]);
  if (shiftPressed && capsPressed) {
    keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
    renderKeys();
  } else if (shiftPressed) {
    keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
    renderKeys();
  } else if (capsPressed) {
    keys = lang === 'en' ? KEYS_CAPS : KEYS_CAPS_RU;
    renderKeys();
  } else {
    keys = lang === 'en' ? KEYS : KEYS_RU;
    renderKeys();
  }
  // console.log(event);
  if (code === 'ControlLeft' && event.altKey) {
    lang = lang === 'en' ? 'ru' : 'en';
  } else if (code === 'AltLeft' && event.ctrlKey) {
    lang = lang === 'en' ? 'ru' : 'en';
  }

  textarea.focus();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const prevValue = textarea.value;
  let keyText;
  const [rowNumer, keyNumber] = CODES_MAP[code]
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
      let newValue = prevValue.slice(0, Math.max(0, start - 1));
      newValue += prevValue.slice(end);
      textarea.value = newValue;
      textarea.selectionStart = Math.max(0, start - 1);
      textarea.selectionEnd = Math.max(0, start - 1);
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
        keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
      } else {
        keys = lang === 'en' ? KEYS : KEYS_RU;
      }
      renderKeys();
    } else {
      capsPressed = true;
      keysPressed.push(CODES_MAP[code]);
      if (shiftPressed) {
        keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
      } else {
        keys = lang === 'en' ? KEYS_CAPS : KEYS_CAPS_RU;
      }
      renderKeys();
    }
  } else if (keyText === 'Shift') {
    shiftPressed = true;
    if (capsPressed) {
      keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
      renderKeys();
    } else {
      keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
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

  const { code } = event;
  if (code !== 'CapsLock') {
    keysPressed = keysPressed.filter((id) => id !== CODES_MAP[code]);
  } else if (capsPressed === false) {
    keysPressed = keysPressed.filter((id) => id !== CODES_MAP[code]);
  }

  if (code === 'ShiftLeft' || code === 'ShiftRight') {
    shiftPressed = false;
  }
  if (shiftPressed && capsPressed) {
    keys = lang === 'en' ? KEYS_CAPS_SHIFT : KEYS_CAPS_SHIFT_RU;
    renderKeys();
  } else if (shiftPressed) {
    keys = lang === 'en' ? KEYS_SHIFT : KEYS_SHIFT_RU;
    renderKeys();
  } else if (capsPressed) {
    keys = lang === 'en' ? KEYS_CAPS : KEYS_CAPS_RU;
    renderKeys();
  } else {
    keys = lang === 'en' ? KEYS : KEYS_RU;
    renderKeys();
  }
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('keyboardLanguage', lang);
});
