window.initQuestionOnComplianceAdding = (() => {
  const complianceQuestionsFieldset = document.querySelector('#js-compliance-questions');
  const complianceQuestionsItemTemplate = document.querySelector('#js-template--compliance-questions-item');

  if (!complianceQuestionsFieldset || !complianceQuestionsItemTemplate) {
    return;
  }

  const complianceQuestionsBox = complianceQuestionsFieldset.querySelector('#js-compliance-questions--items-box');
  const complianceQuestionsItems = complianceQuestionsBox.querySelectorAll('[data-js-compliance-questions-element="parent"]');
  const complianceQuestionsItemAddButton = complianceQuestionsFieldset.querySelector('#js-compliance-questions--add-item');
  const complianceQuestionsRemovers = complianceQuestionsBox.querySelectorAll('[data-js-compliance-questions-element="remover"]');

  let complianceQuestionsItemsCounter = complianceQuestionsItems.length;

  // *** Геттер пропсов для новго элемента ***
  function getNewItemProps() {
    const newItemSerialNumber = ++complianceQuestionsItemsCounter;

    return {
      newQuestionNameAttr: `compliance-questions--question-${newItemSerialNumber}`,
      newAnswerNameAttr: `compliance-questions--answer-${newItemSerialNumber}`,
    };
  }

  // *** Оснонвая ф-ция для аппенда нового элемента в конец списка ***
  function appendNewItem() {
    const newItem = complianceQuestionsItemTemplate.content.cloneNode(true);
    const newItemQuestion = newItem.querySelector('[data-js-compliance-questions-element="question"]');
    const newItemAnswer = newItem.querySelector('[data-js-compliance-questions-element="answer"]');
    const newItemRemover = newItem.querySelector('[data-js-compliance-questions-element="remover"]');
    const newItemProp = getNewItemProps();

    newItemQuestion.setAttribute('name', newItemProp.newQuestionNameAttr);
    newItemAnswer.setAttribute('name', newItemProp.newAnswerNameAttr);
    newItemRemover.addEventListener('click', onRemoveItem);

    const newAppendedItem = newItem.querySelector('[data-js-compliance-questions-element="parent"]');
    complianceQuestionsBox.append(newItem);
    newAppendedItem.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // *** Хендлер для Удаления элементов ***
  const onRemoveItem = (evt) => {
    evt.preventDefault();

    const currentComplianceQuestionsItem = evt.currentTarget.closest('[data-js-compliance-questions-element="parent"]');
    currentComplianceQuestionsItem.remove();
  };

  // *** Хендлер для Добавления новых элементов ***
  const onAddNewItem = (evt) => {
    evt.preventDefault();
    appendNewItem();
  };


  // === Добавление хендлеров
  complianceQuestionsRemovers.forEach((remover) => {
    remover.addEventListener('click', onRemoveItem);
  });
  complianceQuestionsItemAddButton.addEventListener('click', onAddNewItem);
})();
