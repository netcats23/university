/*
--
-----
------- МОДУЛЬ Логики работы Кастомного Селекта
-----
--
*/

window.initCustomSelectMenu = (() => {
  // ---------- КОНСТАНТЫ -----------
  const EMPTY_STRING = '';
  const FIRST_ARRAY_ELEMENT = 0;
  const INPUT_TAG_NAME = 'INPUT';

  // --------- DOM-элементы ---------
  const selectmenuList = document.querySelectorAll('.js-selectmenu');

  if (selectmenuList.length === 0) {
    return null;
  }

  /*
  *** Настройки для класса Selectmenu ***
  */
  class Selectmenu {
    constructor(selectmenuElement) {
      this._selectmenu = selectmenuElement;
      this._hiddenSelectedValue = selectmenuElement.querySelector('.js-selectmenu-hidden-selected-value');
      this._actionButton = selectmenuElement.querySelector('.js-selectmenu-button');
      this._optionsList = selectmenuElement.querySelector('.js-selectmenu-options-list');

      this._actionButton.addEventListener('click', this._onOpenSelectmenuOptionsList);
      this._optionsList.addEventListener('click', this._onSelectOption);
    }


    // *** Метод получения списка :checked-опций ***
    _getCheckedOptionsValues = () => {
      const allOptions = this._optionsList.querySelectorAll('.js-selectmenu-option');
      let checkedOptionNamesCollection = [];

      for (let optionToCheck of allOptions) {
        if (optionToCheck.checked) {
          const checkedOptionContainer = optionToCheck.closest('.js-selectmenu-option-container');
          const checkedOptionValue = checkedOptionContainer.querySelector('.js-selectmenu-option-value');

          checkedOptionNamesCollection.push({
            visible: checkedOptionValue.textContent,
            hidden: checkedOptionValue.dataset.value,
          });
        }
      }

      return checkedOptionNamesCollection;
    };


    // *** Метод Переключения на выбранную опцию ***
    _switchToSelectedOption(selectedOptionContainer) {
      const selectedOption = selectedOptionContainer.querySelector('.js-selectmenu-option');
      const selectedOptionType = selectedOption.type;
      const selectedOptionValue = selectedOptionContainer.querySelector('.js-selectmenu-option-value');
      const selectedOptionValueVisible = selectedOptionValue.textContent;
      const selectedOptionValueHidden = selectedOptionValue.dataset.value;

      // --- Ф-ция для Сложения значений, когда тип Опции — это Чекбокс ---
      const addCheckboxesValues = () => {
        this._actionButton.textContent = EMPTY_STRING;
        this._hiddenSelectedValue.value = EMPTY_STRING;

        const checkedOptions = this._getCheckedOptionsValues();
        const LengthOfCheckedOptions = {
          IS_NULL: checkedOptions.length === 0,
          IS_ONLY_ONE_ELEMENT: checkedOptions.length === 1,
        };

        switch (true) {
          case LengthOfCheckedOptions.IS_NULL:
            this._actionButton.textContent = this._actionButton.title;
            this._hiddenSelectedValue.value = EMPTY_STRING;
            break;

          case LengthOfCheckedOptions.IS_ONLY_ONE_ELEMENT:
            this._actionButton.textContent = checkedOptions[FIRST_ARRAY_ELEMENT].visible;
            this._hiddenSelectedValue.value = checkedOptions[FIRST_ARRAY_ELEMENT].hidden;
            break;

          default:
            checkedOptions.forEach((checkedOption) => {
              this._actionButton.textContent += `${checkedOption.visible}; `;
              this._hiddenSelectedValue.value += `${checkedOption.hidden}; `;
            });
        }
      };

      /*
      --- Установка значений в зависимости от типа Опции ---
      */
      switch (selectedOptionType) {
        case 'radio':
          if (selectedOption.checked) {
            this._actionButton.textContent = selectedOptionValueVisible;
            this._hiddenSelectedValue.value = selectedOptionValueHidden;
          }
          break;

        case 'checkbox':
          addCheckboxesValues();
          break;
      }
    }


    // *** Методы для Открытия и Закрытия списка опций ***
    _openSelectmenuOptionsList() {
      this._selectmenu.classList.add('selectmenu--opened-options-list');
      document.addEventListener('keydown', this._onEscapePress);
      document.addEventListener('click', this._onEmptySpaceClick);
    }

    _closeSelectmenuOptionsList() {
      this._selectmenu.classList.remove('selectmenu--opened-options-list');
      document.removeEventListener('keydown', this._onEscapePress);
      document.removeEventListener('click', this._onEmptySpaceClick);
    }


    // *** Метод обработки события клика на "пустое пространство" ***
    _onEmptySpaceClick = (evt) => {
      const isNotSelectMenu = evt.target !== this._selectmenu;
      const isNotActionButton = evt.target !== this._actionButton;

      if (isNotSelectMenu && isNotActionButton) {
        this._closeSelectmenuOptionsList();
      }
    };


    // *** Метод обработки события нажатия на "Escape" ***
    _onEscapePress = (evt) => {
      const isEsc = evt.key === 'Escape' || evt.key === 'Esc';

      if (isEsc) {
        this._closeSelectmenuOptionsList();
      }
    };


    // *** Метод обработки события Открытия списка опций ***
    _onOpenSelectmenuOptionsList = (evt) => {
      evt.preventDefault();

      const isSelectmenuOptionsOpen = this._selectmenu.classList.contains('selectmenu--opened-options-list');

      if (isSelectmenuOptionsOpen) {
        this._closeSelectmenuOptionsList();
      } else {
        this._openSelectmenuOptionsList();
      }
    };


    // *** Метод обработки события Выбора опции ***
    _onSelectOption = (evt) => {
      const isInput = evt.target.tagName === INPUT_TAG_NAME;

      if (isInput) {
        const currentSelectedOptionContainer = evt.target.closest('.js-selectmenu-option-container');
        this._switchToSelectedOption(currentSelectedOptionContainer);
      }
    };
  }
  // *** Конец настроек класса Selectmenu ***

  // === Инициализация Кастомных Селектов ===
  selectmenuList.forEach((selectmenuElement) => {
    new Selectmenu(selectmenuElement);
  });
})();
