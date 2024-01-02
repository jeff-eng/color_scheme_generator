import Select from './select.js';

const BASE_URL = 'https://www.thecolorapi.com/scheme?';
const colorSchemeForm = document.getElementById('color-scheme-form');
const selectElements = document.querySelectorAll('[data-custom]');
let copiedToClipboard = false;

selectElements.forEach(selectElement => {
    new Select(selectElement);
});

// 
const throttledFetch = throttle((url) => {
    fetchColorScheme(url);
}, 2000);

colorSchemeForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get FormData object
    const formData = new FormData(colorSchemeForm);

    const selectedColorHexCode = formData.get('color-picker').slice(1).toUpperCase();
    const selectedMode = formData.get('color-mode-select');
    const completeUrl = `${BASE_URL}hex=${selectedColorHexCode}&mode=${selectedMode}`;
    
    throttledFetch(completeUrl);
});

document.addEventListener('click', event => {
    const clickedEl = event.target;
    // Make sure clicked element has data attribute 'bar'
    if (clickedEl.dataset.bar) {
        const hexCode = clickedEl.dataset.hexCode;
        copyToClipboard(hexCode);
    } else if (clickedEl.parentElement.dataset.bar) {
        const hexCode = clickedEl.parentElement.dataset.hexCode;
        copyToClipboard(hexCode);
    }
});

function fetchColorScheme(url) {
    // Make fetch request to Color API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderColors(data.colors);
        })
        .catch(err => console.error(err));
}

function renderColors(colorsArray) {
    const paletteBarListItems = document.querySelectorAll('[data-bar]');
    const paletteCodeListItems = document.querySelectorAll('[data-code]');

    // Iterate through color scheme array and render on DOM
    colorsArray.forEach((colorObj, index) => {
        const colorHexCode = colorObj.hex.value;

        paletteBarListItems[index].style.backgroundColor = colorHexCode;
        paletteBarListItems[index].dataset.hexCode = colorHexCode;
        paletteBarListItems[index].setAttribute('aria-label', `Color: ${colorHexCode}`);
        paletteCodeListItems[index].textContent = colorHexCode;
    });
}

function copyToClipboard(colorHexCode) {
    copiedToClipboard = true;

    if (!copiedToClipboard || !colorHexCode) {
        return;
    }

    // Copy hex code to clipboard
    navigator.clipboard.writeText(colorHexCode);
    
    // Show/hide toast notification
    document.getElementById('clipboard-alert').classList.add('clipboard-alert');
    document.getElementById('clipboard-alert').classList.remove('hide');
    copiedToClipboard = false;

    setTimeout(() => {
        document.getElementById('clipboard-alert').classList.remove('clipboard-alert');
        document.getElementById('clipboard-alert').classList.add('hide');
    }, 3000)
}

function throttle(callback, delay = 1000) {
    let shouldWait = false;

    return (...args) => {
        // Exit callback if timeout hasn't been reached
        if (shouldWait) return;
        // Invoke callback function
        callback(...args)
        // Enable waiting period
        shouldWait = true;
        // Reset/disable waiting period after timeout delay
        setTimeout(() => {
            shouldWait = false;
        }, delay);
    }
}