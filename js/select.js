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
        const checkedIconElement = document.createElement('i');
        optionElement.innerText = option.label;
        checkedIconElement.classList.add('fa-solid', 'fa-check');
        checkedIconElement.classList.toggle('checked', option.selected);

        optionElement.append(checkedIconElement);

        optionElement.classList.add('custom-select-option');
        optionElement.classList.toggle('selected', option.selected);
        optionElement.dataset.value = option.value;
        
        // Set event listeners on each option
        optionElement.addEventListener('click', event => {
            select.optionsCustomElement
                .querySelector(`[data-value="${select.selectedOption.value}"]`)
                .classList.remove('selected');

            document.querySelectorAll('.fa-solid.fa-check').forEach(icon => {
                icon.classList.remove('checked');
            });

            event.target.lastChild.classList.add('checked');
            select.selectValue(option.value);
            select.optionsCustomElement.classList.toggle('show', option.selected);
        });

        // Add option to select
        select.optionsCustomElement.append(optionElement);
    })
    select.customElement.append(select.optionsCustomElement);

    select.customElement.addEventListener('click', () => {
        select.optionsCustomElement.classList.toggle('show');
    });

    select.customElement.addEventListener('blur', () => {
        select.optionsCustomElement.classList.remove('show');
    });

    // Variables for search functionality within custom select element
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
                setCheckOnSelectedOption(select, false);
                break;
            case 'ArrowDown':
                const nextOption = select.options[select.selectedOptionIndex + 1];
                if (nextOption) {
                    select.selectValue(nextOption.value);
                }
                setCheckOnSelectedOption(select, false);
                break;
            case 'Enter':
                setCheckOnSelectedOption(select, true);
                break;
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

function setCheckOnSelectedOption(select, dismissDropdown) {
    // Hide all check icons
    document.querySelectorAll('.fa-solid.fa-check').forEach(icon => icon.classList.remove('checked'));
    // Get selected option 
    const selectedOptionElement = document.querySelectorAll('.custom-select-option')[select.selectedOptionIndex];
    // Add checked class to selected option to show check
    selectedOptionElement.lastChild.classList.toggle('checked');
    // Show/hide options
    dismissDropdown ? select.optionsCustomElement.classList.remove('show') : select.optionsCustomElement.classList.add('show');
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

function capitalize(textString) {
    return `${textString[0].toUpperCase()}${textString.slice(1)}`; 
}