'use strict';


/*
===================================================================================
------------------ МОДУЛЬ ЛОГИКИ РАБОТЫ ПОПАПА "ДОБАВИТЬ СКРИПТ" ------------------
===================================================================================
*/
window.initAddScriptLogic = (() => {
  // ---------- КОНСТАНТЫ -----------
  const REG_EXP_FOR_NUMBER = /\d+/;

  // *** Словарик CSS-классов для кнопок Перемещения Шага ***
  const MoveButtonClass = {
    DOWN: 'js-move-button--down',
    UP: 'js-move-button--up',
  };

  // *** Словарик служебных CSS-классов ***
  const ServiceElementClass = {
    updateStepSelect: {
      showRemovedStep: 'error',
    },
  };


  // --------- DOM-элементы ---------
  const addScriptForm = document.querySelector('#js-add-script-form');
  const stepTemplate = document.querySelector('#js-step-template');
  const selectOptionTemplate = document.querySelector('#js-select-option-template');

  // *** Проверка на существование эл-тов на странице ***
  if (!addScriptForm || !stepTemplate || !selectOptionTemplate) {
    return;
  }

  const stepsContainer = addScriptForm.querySelector('.js-steps-container');
  const moveStepButtons = stepsContainer.querySelectorAll('.js-move-button');
  const removeStepButtons = stepsContainer.querySelectorAll('.js-remove-step-button');

  const addTransitionButtons = stepsContainer.querySelectorAll('.js-add-transition-button');
  const transitionStepSelects = stepsContainer.querySelectorAll('.js-transition-select');
  const removeTransitionButtons = stepsContainer.querySelectorAll('.js-remove-transition-button');

  const addStepButton = addScriptForm.querySelector('.js-add-step-button');


  /*
  ===================================
  --------- ОСНОВНАЯ ЛОГИКА ---------
  ===================================
  */

  // *** Ф-ция для получения значений для нового Шага ***
  const getNewStepValues = (newStepUniqueID, newTransitionValue = 1) => {
    const isStepIdString = typeof newStepUniqueID === 'string';
    const isStepIdNumber = typeof newStepUniqueID === 'number';
    let newStepSerialNumber;

    switch (true) {
      case isStepIdString:
        newStepSerialNumber = parseInt(newStepUniqueID.match(REG_EXP_FOR_NUMBER));
        break;

      case isStepIdNumber:
        newStepSerialNumber = newStepUniqueID;
        break;
    }

    return {
      TITLE: `Шаг ${newStepSerialNumber}`,

      QUESTION_NAME: `question-name[${newStepUniqueID}]`,
      QUESTION_DESCRIPTION: `question-description[${newStepUniqueID}]`,

      DRAG_N_DROP: `drag-n-drop[${newStepUniqueID}]`,

      TRANSITION_NAME: `transition-name[${newStepUniqueID}][${newTransitionValue}]`,
      TRANSITION_ID: `transition-id--${newStepUniqueID}-${newTransitionValue}`,

      STEP_SELECT_NAME: `step-select-name[${newStepUniqueID}][${newTransitionValue}]`,
      STEP_SELECT_ID: `step-select-id--${newStepUniqueID}-${newTransitionValue}`,
    };
  };


  // *** Ф-ция для добалвения Обработчиков Событий на Коллекцию эл-тов ***
  const addEventListenerOnElementsCollection = (elementsCollection, eventTrigger, eventCallbackHandler) => {
    for (let currentElementInCollection of elementsCollection) {
      currentElementInCollection.addEventListener(eventTrigger, eventCallbackHandler);
    }
  };


  /*
   ****************************************************************************************************************************************
   * ***
   * ************************************************** ФУНКЦИИ для обновления СЕЛЕКТОВ ***************************************************
   * ***
   ****************************************************************************************************************************************
   */
  
  // *** Ф-ция обновления Cелектов ***
  const updateStepSelects = () => {
    const stepSelectToUpdateList = stepsContainer.querySelectorAll('.js-transition-select');
    const stepSectionList = stepsContainer.querySelectorAll('.js-step-section');

    // --- Проходим циклом по каждому Селекту для каждого Шага ---
    for (let selectToUpdate of stepSelectToUpdateList) {
      Array.from(stepSectionList).forEach((element) => {
        const updatedStepTitle = element.querySelector('.js-step-title').textContent;
        const updatedStepPosition = element.querySelector('.js-hidden-question-position').value;
        const updatedStepUniqueID = element.querySelector('.js-hidden-question-id').value;

        // --- Селект, который будет обновлён в текущем Шаге ---
        const selectToUpdateOption = selectToUpdate.querySelector(`option[value=${updatedStepUniqueID}]`);
        selectToUpdateOption.setAttribute('data-step-position', updatedStepPosition);
        selectToUpdateOption.textContent = updatedStepTitle;
      });

      
      // --- Обновление Опций текущего Селекта ---
      const selectToUpdateParentStep = selectToUpdate.closest('.js-step-section');
      const selectToUpdateParentStepUniqueID = selectToUpdateParentStep.querySelector('.js-hidden-question-id').value;
      const selectToUpdateOptions = selectToUpdate.querySelectorAll('option:not([value=default])');
      Array.from(selectToUpdateOptions).forEach((element) => {
        const currentOptionValue = element.value;
        /*
         * --- ЕСЛИ идентификатор текущей Опции совпадает с уникальным ID'шником текущего Шага,
         * --- ТО данная Опция становится 'hidden', чтобы Пользователь не имел возможности на неё сослаться
         */
        if (currentOptionValue === selectToUpdateParentStepUniqueID) {
          element.setAttribute('hidden', 'hidden');
        }
        
        const optionNextSibling = element.nextElementSibling;

        /*
         * --- ЕСЛИ у Опции есть следующий сосед,
         * --- ТО осуществляем проверку их Позишенов
         */
        if (optionNextSibling) {
          const currentOption = element;
          const currentOptionPosition = currentOption.dataset.stepPosition;
          const optionNextSiblingPosition = optionNextSibling.dataset.stepPosition;

          switch (true) {
            case optionNextSiblingPosition < currentOptionPosition:
              currentOption.before(optionNextSibling);
              break;

            default:
              return;
          }
        }
      });
    }
  };


  // *** Ф-ция для ДОБАВЛЕНИЯ новой Опции в Cелекты ***
  const addNewStepSelectOptions = () => {
    const stepSelectToUpdateList = stepsContainer.querySelectorAll('.js-transition-select');
    const stepSectionList = stepsContainer.querySelectorAll('.js-step-section');

    for (let selectToUpdate of stepSelectToUpdateList) {
      const currentSelectOptions = selectToUpdate.querySelectorAll('option:not([value=default])');

      for (let stepSection of stepSectionList) {
        const currentStepTitle = stepSection.querySelector('.js-step-title').textContent;
        const currentStepPosition = stepSection.querySelector('.js-hidden-question-position').value;
        const currentStepUniqueID = stepSection.querySelector('.js-hidden-question-id').value;

        let currentStepSelectOptionValues = [];
        Array.from(currentSelectOptions).forEach((element) => {
          currentStepSelectOptionValues.push(element.value);
        });

        const isOptionExist = Array.from(currentStepSelectOptionValues).includes(currentStepUniqueID);
  
        if (!isOptionExist) {
          const newSelectOptionTemplate = selectOptionTemplate.content.cloneNode(true);
          const newSelectOption = newSelectOptionTemplate.querySelector('option');

          newSelectOption.setAttribute('value', currentStepUniqueID);
          newSelectOption.setAttribute('data-step-position', currentStepPosition);
          newSelectOption.textContent = currentStepTitle;
  
          selectToUpdate.appendChild(newSelectOption);
        }
      }
    }

    updateStepSelects();
  };


  // *** Ф-ция для УДАЛЕНИЯ Опции из Cелектов ***
  const removeOptionFromSelect = (removedStepUniqueID) => {
    const stepSelectToUpdateList = stepsContainer.querySelectorAll('.js-transition-select');

    for (let selectToUpdate of stepSelectToUpdateList) {
      const currentSelectOptions = selectToUpdate.querySelectorAll('option:not([value=default])');

      let currentStepSelectOptionValues = [];
      Array.from(currentSelectOptions).forEach((element) => {
        currentStepSelectOptionValues.push(element.value);
      });

      const isOptionExist = Array.from(currentStepSelectOptionValues).includes(removedStepUniqueID);

      if (isOptionExist) {
        const optionToRemove = selectToUpdate.querySelector(`option[value=${removedStepUniqueID}]`);
        
        /*
         * --- ЕСЛИ удаляемая Опция была выбрана в текущем Селекте,
         * --- ТО выбрать в данном Селекте дефолтную Опцию и подсветить визуально
         */
        if (optionToRemove.selected) {
          // --- Переключение на Дефолтную Опцию, если данный Шаг в своём Переходе ссылался на удалённый Шаг ---
          const defaultOption = selectToUpdate.querySelector('option[value=default]');
          defaultOption.setAttribute('selected', 'selected');

          // --- Визуальное отображение: Селект подсвечивается, если была удалена выбранная Опция ---
          selectToUpdate.classList.add(ServiceElementClass.updateStepSelect.showRemovedStep);
        }

        optionToRemove.remove();
      }
    }

    updateStepSelects();
  };


  // *** Ф-ция для удаления класса ошибки с Селекта ***
  const onSelectErrorClassRemove = (evt) => {
    const currentErroredSelect = evt.target.closest('.js-transition-select');

    if (currentErroredSelect.classList.contains(ServiceElementClass.updateStepSelect.showRemovedStep)) {
      currentErroredSelect.classList.remove(ServiceElementClass.updateStepSelect.showRemovedStep)
    }
  };


  /*
   ****************************************************************************************************************************************
   * ***
   * ******************************************************** ФУНКЦИИ ЛОГИКИ РАБОТЫ *******************************************************
   * ***
   ****************************************************************************************************************************************
   */

  // *** Счётчик новых значений для поля "Question-ID" ***
  /*
   * *** По умолчанию — 1, т.к. в Форме изначально уже есть Шаг,
   * *** значение поля "Question-ID" которого равно 1.
   * *** Далее счётчик всегда будет увеличиваться на единицу.
   */
  let questionIDCounter = 1;
 
  // *** Ф-ция для добавления нового Шага ***
  const addNewStep = (newStepCounter) => {
    // --- DOM-элементы ---
    const newStep = stepTemplate.content.cloneNode(true);
    const newStepTitle = newStep.querySelector('.js-step-title');

    // *** Cкрытые поля для Индексов Шагов ***
    const hiddenQuestionID = newStep.querySelector('.js-hidden-question-id');
    const hiddenQuestionPosition = newStep.querySelector('.js-hidden-question-position');

    const newStepQuestionName = newStep.querySelector('.js-question-name');
    const newStepQuestionDescription = newStep.querySelector('.js-question-description');
    const newStepDragNDropd = newStep.querySelector('.js-drag-n-drop');

    const newStepMoveButtons = newStep.querySelectorAll('.js-move-button');
    const newStepRemoveButton = newStep.querySelector('.js-remove-step-button');

    // --- Логика изменения основных полей ---
    const newStepIndex = ++newStepCounter;
    const newQuestionIDValue = `n-${++questionIDCounter}`;
    const newStepValue = getNewStepValues(newQuestionIDValue);

    hiddenQuestionID.setAttribute('value', newQuestionIDValue);
    hiddenQuestionPosition.setAttribute('value', newStepIndex);

    newStepTitle.textContent = `Шаг ${hiddenQuestionPosition.value}`;
    newStepQuestionName.setAttribute('name', newStepValue.QUESTION_NAME);
    newStepQuestionDescription.setAttribute('name', newStepValue.QUESTION_DESCRIPTION);
    newStepDragNDropd.setAttribute('name', newStepValue.DRAG_N_DROP);

    const newStepTransitionAdd = newStep.querySelector('.js-add-transition-button');
    
    // --- Проверка на наличие кнопки "Добавить переход" ---
    if (newStepTransitionAdd) {
      const newStepTransitionRemove = newStep.querySelector('.js-remove-transition-button');
      const newStepTransitionNameLabel = newStep.querySelector('.js-transition-name-label');
      const newStepTransitionName = newStep.querySelector('.js-transition-name');
      const newStepSelectLabel = newStep.querySelector('.js-transition-select-label');
      const newStepSelect = newStep.querySelector('.js-transition-select');
  
      newStepTransitionNameLabel.setAttribute('for', newStepValue.TRANSITION_ID);
      newStepTransitionName.setAttribute('name', newStepValue.TRANSITION_NAME);
      newStepTransitionName.setAttribute('id', newStepValue.TRANSITION_ID);
      newStepSelectLabel.setAttribute('for', newStepValue.STEP_SELECT_ID);
      newStepSelect.setAttribute('name', newStepValue.STEP_SELECT_NAME);
      newStepSelect.setAttribute('id', newStepValue.STEP_SELECT_ID);

      // --- Добавление всех обработчиков событий ---
      newStepTransitionAdd.addEventListener('click', onTransitionAdd);
      newStepSelect.addEventListener('click', onSelectErrorClassRemove);
      newStepTransitionRemove.addEventListener('click', onTransitionRemove);
    }

    for (let moveButton of newStepMoveButtons) {
      moveButton.addEventListener('click', onStepMove);
    }
    newStepRemoveButton.addEventListener('click', onStepRemove);

    // === Добавление нового Шага в конец контейнера Шагов ===
    const newStepSection = newStep.querySelector('.js-step-section');

    stepsContainer.appendChild(newStep);
    newStepSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // --- Обновление Опций выбора Шагов ---
    addNewStepSelectOptions();
  };


  // *** Ф-ция для обновления списка Шагов после добавления нового Шага ***
  const updateStepsList = () => {
    const updatedStepsList = stepsContainer.querySelectorAll('.js-step-section');

    // --- "Перезапись" заголовков для всех секций ---
    Array.from(updatedStepsList).forEach((element, index) => {
      let correctElementIndex = index + 1;
      const updatedStepValue = getNewStepValues(correctElementIndex);

      let updatedStepTitle = element.querySelector('.js-step-title');
      updatedStepTitle.textContent = updatedStepValue.TITLE;

      let updatedHiddenQuestionPosition = element.querySelector('.js-hidden-question-position');
      updatedHiddenQuestionPosition.setAttribute('value', correctElementIndex);
    });
  };


  // *** Ф-ция для добавления новых Переходов внутрь Шага ***
  const addNewTransition = (currentStepEvt) => {    
    // --- DOM-элементы ---
    const stepTemplateClone = stepTemplate.content.cloneNode(true);

    const transitionItem = stepTemplateClone.querySelector('.js-transition-item');
    const transitionInputLabel = transitionItem.querySelector('.js-transition-name-label');
    const transitionName = transitionItem.querySelector('.js-transition-name');
    const transitionSelectLabel = transitionItem.querySelector('.js-transition-select-label');
    const transitionStepSelect = transitionItem.querySelector('.js-transition-select');
    const transitionRemoveButton = transitionItem.querySelector('.js-remove-transition-button');

    const currentStep = currentStepEvt.target.closest('.js-step-section');
    const currentStepHiddenQuestionID = currentStep.querySelector('.js-hidden-question-id').value;
    const currentTransitionsList = currentStep.querySelector('.js-transitions-list');
    let currentTransitionsCount = currentTransitionsList.querySelectorAll('.js-transition-item').length;

    // --- Логика добавления нового Перехода ---
    const newTransitionIndex = ++currentTransitionsCount;
    const currentStepID = parseInt(currentStepHiddenQuestionID.match(REG_EXP_FOR_NUMBER));
    const newCurrentTransitionValue = getNewStepValues(currentStepHiddenQuestionID, newTransitionIndex);

    transitionInputLabel.setAttribute('for', newCurrentTransitionValue.TRANSITION_ID);
    transitionName.setAttribute('name', newCurrentTransitionValue.TRANSITION_NAME);
    transitionName.setAttribute('id', newCurrentTransitionValue.TRANSITION_ID);
    transitionSelectLabel.setAttribute('for', newCurrentTransitionValue.STEP_SELECT_ID);
    transitionStepSelect.setAttribute('name', newCurrentTransitionValue.STEP_SELECT_NAME);
    transitionStepSelect.setAttribute('id', newCurrentTransitionValue.STEP_SELECT_ID);

    transitionStepSelect.addEventListener('click', onSelectErrorClassRemove);
    transitionRemoveButton.addEventListener('click', onTransitionRemove);

    // === Добавление нового Перехода в конец контейнера Переходов внутри Шага ===
    currentTransitionsList.appendChild(transitionItem);

    // --- Обновление Опций выбора Шагов ---
    addNewStepSelectOptions();
  };


  // *** Ф-ция для обновления списка Перкходов внтури Шага ***
  const updateTransitionsList = (currentStep) => {
    const currentStepQuestionID = currentStep.querySelector('.js-hidden-question-id').value;
    const updatedTransitionsList = currentStep.querySelectorAll('.js-transition-item');

    Array.from(updatedTransitionsList).forEach((element, index) => {
      let correctElementIndex = index + 1;
      const updatedTransitionValue = getNewStepValues(currentStepQuestionID, correctElementIndex);

      const updatedTransitionLabel = element.querySelector('.js-transition-name-label');
      const updatedTransitionName = element.querySelector('.js-transition-name');
      const updatedTransitionSelectLabel = element.querySelector('.js-transition-select-label');
      const updatedTransitionSelect = element.querySelector('.js-transition-select');

      updatedTransitionLabel.setAttribute('for', updatedTransitionValue.TRANSITION_ID);
      updatedTransitionName.setAttribute('name', updatedTransitionValue.TRANSITION_NAME);
      updatedTransitionName.setAttribute('id', updatedTransitionValue.TRANSITION_ID);
      updatedTransitionSelectLabel.setAttribute('for', updatedTransitionValue.STEP_SELECT_ID);
      updatedTransitionSelect.setAttribute('name', updatedTransitionValue.STEP_SELECT_NAME);
      updatedTransitionSelect.setAttribute('id', updatedTransitionValue.STEP_SELECT_ID);
    });
  };

  
  // *** Ф-ции для перемещения Шагов ***
  // --- 1. Ф-ция, описывающая всю логику иименения нужных полей Шагов ---
  const stepMovementLogic = (movingStep, siblingStep, moveButtonClass) => {
    if (siblingStep !== null) {
      const movingStepTitle = movingStep.querySelector('.js-step-title');
      const movingStepTitleCurrentText = movingStepTitle.textContent;
      const movingStepPositionField = movingStep.querySelector('.js-hidden-question-position');
      const movingStepPositionCurrentValue = movingStepPositionField.value;
      
      const siblingStepTitle = siblingStep.querySelector('.js-step-title');
      const siblingStepTitleCurrentText = siblingStepTitle.textContent;
      const siblingStepPositionField = siblingStep.querySelector('.js-hidden-question-position');
      const siblingPositionCurrentValue = siblingStepPositionField.value;
      
      movingStepTitle.textContent = siblingStepTitleCurrentText;
      movingStepPositionField.setAttribute('value', siblingPositionCurrentValue);
      
      siblingStepTitle.textContent = movingStepTitleCurrentText;
      siblingStepPositionField.setAttribute('value', movingStepPositionCurrentValue);

      // --- Определение метода вставки Шага в DOM ---
      switch (true) {
        case moveButtonClass === MoveButtonClass.DOWN:
          siblingStep.after(movingStep);
          break;

        case moveButtonClass === MoveButtonClass.UP:
          siblingStep.before(movingStep);
          break;
      }

      // --- Плавное перемещение к нужному Шагу ---
      movingStep.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // --- 2. Основная ф-ция для обработчика Перемещения Шага ---
  const moveStep = (movingStep, directionPointer) => {
    switch (true) {
      case directionPointer.classList.contains(MoveButtonClass.DOWN):
        const nextSiblingStep = movingStep.nextElementSibling;
        stepMovementLogic(movingStep, nextSiblingStep, MoveButtonClass.DOWN);
        break;

      case directionPointer.classList.contains(MoveButtonClass.UP):
        const previousSiblingStep = movingStep.previousElementSibling;
        stepMovementLogic(movingStep, previousSiblingStep, MoveButtonClass.UP);
        break;
    }
  };


  /*
   ****************************************************************************************************************************************
   * ***
   * **************************************************** ФУНКЦИИ ОБРАБОТЧИКОВ СОБЫТИЙ ****************************************************
   * ***
   ****************************************************************************************************************************************
   */

  // *** Хендлеры для добавления/удаления Шага ***
  const onStepAdd = (evt) => {
    evt.preventDefault();

    const stepsList = stepsContainer.querySelectorAll('.js-step-section');

    // --- Счётчик новых Шагов ---
    const stepsCounter = stepsList.length;
    addNewStep(stepsCounter);
  };


  const onStepRemove = (evt) => {
    evt.preventDefault();

    const currentStep = evt.target.closest('.js-step-section');
    const currentStepUniqueID = currentStep.querySelector('.js-hidden-question-id').value;
    currentStep.remove();

    updateStepsList();

    // --- Удаление Опции соотв-щего Шага из Селектов ---
    removeOptionFromSelect(currentStepUniqueID);
    updateStepSelects();
  };


  // *** Хендлеры для добавления/удаления Перехода внутри Шага ***
  const onTransitionAdd = (evt) => {
    evt.preventDefault();
    addNewTransition(evt);
  };

  const onTransitionRemove = (evt) => {
    evt.preventDefault();

    const currentStep = evt.target.closest('.js-step-section');
    const currentTransition = evt.target.closest('.js-transition-item');
    
    currentTransition.remove();
    updateTransitionsList(currentStep);
  };

  
  // *** Хендлер для Перемещения Шага ***
  const onStepMove = (evt) => {
    evt.preventDefault();

    const currentMoveEventer = evt.target.closest('.js-move-button');
    const currentStep = evt.target.closest('.js-step-section');

    moveStep(currentStep, currentMoveEventer);

    // --- Обновление Опций выбора Шагов ---
    updateStepSelects();
  };


  // === Добавление обработчиков событий ===
  // *** Первичная инициализация Обновления Селектов ***
  /*
   * --- Нужна для того, чтобы, при наличии ТОЛЬКО ОДНОГО (Шага 1) в Скрипте
   * --- в Селекте этого Шага не было доступно дефолтной (установленной в разметке)
   * --- Опции выбора Шага 1.
   */
  updateStepSelects();

  addStepButton.addEventListener('click', onStepAdd);

  // --- Добавление обработчиков событий на Коллекции эл-тов ---
  addEventListenerOnElementsCollection(addTransitionButtons, 'click', onTransitionAdd);
  addEventListenerOnElementsCollection(transitionStepSelects, 'click', onSelectErrorClassRemove);
  addEventListenerOnElementsCollection(removeTransitionButtons, 'click', onTransitionRemove);
  addEventListenerOnElementsCollection(moveStepButtons, 'click', onStepMove);
  addEventListenerOnElementsCollection(removeStepButtons, 'click', onStepRemove);
})();
