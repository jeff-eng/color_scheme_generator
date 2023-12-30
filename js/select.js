export default class Select {
    constructor(element) {
        this.element = element;
        this.options = getFormattedOptions(element.querySelectorAll('option'));
        this.customElement = document.createElement('div');
        this.labelElement = document.createElement('span');
        this.iconElement = document.createElement('i');
        element.style.display = 'none';
        this.optionsCustomElement = document.createElement('ul');
        setupCustomElement(this);

        element.after(this.customElement);
    }

    get selectedOption() {
        return this.options.find(option => option.selected);
    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption);
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        });
        const previousSelectedOption = this.selectedOption;
        previousSelectedOption.selected = false;
        previousSelectedOption.element.selected = false;

        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.labelElement.innerText = newSelectedOption.label;

        this.optionsCustomElement
        .querySelector(`[data-value="${previousSelectedOption.value}"]`)
        .classList.remove('selected');
        this.optionsCustomElement
        .querySelector(`[data-value="${newSelectedOption.value}"]`)
        .classList.add('selected');

    }
}

function setupCustomElement(select) {
    select.customElement.classList.add('custom-select-container');
    // Have JS make div focus-able
    select.customElement.tabIndex = 0;

    select.iconElement.classList.add('fa-solid', 'fa-chevron-down');

    select.labelElement.classList.add('custom-select-value');

    select.labelElement.innerText = capitalize(select.selectedOption.value);
    // Put span within container
    select.customElement.append(select.labelElement, select.iconElement);

    select.optionsCustomElement.classList.add('custom-select-options');
    select.options.forEach(option => {
        // Create option
        const optionElement = document.createElement('li');
        optionElement.classList.add('custom-select-option');
        optionElement.classList.toggle('selected', option.selected);
        optionElement.innerText = option.label;
        optionElement.dataset.value = option.value;
        optionElement.addEventListener('click', () => {
            select.optionsCustomElement
                .querySelector(`[data-value="${select.selectedOption.value}"]`)
                .classList.remove('selected');

            select.selectedOption.element.classList.remove('selected');
            select.selectValue(option.value);
            
            select.optionsCustomElement.classList.remove('show');
        });

        // Add option to select
        select.optionsCustomElement.append(optionElement);
    })
    select.customElement.append(select.optionsCustomElement);

    select.labelElement.addEventListener('click', () => {
        select.optionsCustomElement.classList.toggle('show');
    });

    select.customElement.addEventListener('blur', () => {
        select.optionsCustomElement.classList.remove('show');
    });

    let debounceTimeout;
    let searchString = '';

    select.customElement.addEventListener('keydown', event => {
        switch (event.code) {
            case 'Space':
                select.optionsCustomElement.classList.toggle('show');
                break;
            case 'ArrowUp':
                const prevOption = select.options[select.selectedOptionIndex - 1];
                if (prevOption) {
                    select.selectValue(prevOption.value);
                }
                break;
            case 'ArrowDown':
                const nextOption = select.options[select.selectedOptionIndex + 1];
                if (nextOption) {
                    select.selectValue(nextOption.value);
                }
                break;
            case 'Enter':
            case 'Escape':
                select.optionsCustomElement.classList.remove('show');
                break;
            default:
                clearTimeout(debounceTimeout);
                searchString += event.key;
                debounceTimeout = setTimeout(() => {
                    searchString = '';
                }, 500);

                const matchingOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchString);
                });

                if (matchingOption) {
                    select.selectValue(matchingOption.value);
                }
        }
    });
}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        // Create object
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        };
    });
}

function capitalize(str) {
    return `${str[0].toUpperCase()}${str.slice(1)}`; 
}