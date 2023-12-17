const BASE_URL = 'https://www.thecolorapi.com/scheme?';
const colorSchemeForm = document.getElementById('color-scheme-form');

colorSchemeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get FormData object
    const formData = new FormData(colorSchemeForm);

    const selectedColorHexCode = formData.get('color-picker').slice(1).toUpperCase();
    const selectedMode = formData.get('color-mode-select');

    const completeUrl = `${BASE_URL}hex=${selectedColorHexCode}&mode=${selectedMode}`;
    getColorScheme(completeUrl);

});

function getColorScheme(url) {
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
        paletteCodeListItems[index].textContent = colorHexCode;
    });
}