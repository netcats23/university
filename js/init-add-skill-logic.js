'use strict';


/*
===================================================================================
------------------ МОДУЛЬ ЛОГИКИ РАБОТЫ ПОПАПА ДОБАВЛЕНИЯ СКИЛЛОВ -----------------
===================================================================================
*/
window.initAddSkillLogic = (() => {
  // ---------- КОНСТАНТЫ -----------
  const EMPTY_VALUE = '';
  const REG_EXP_FOR_NUMBER = /\d+/;
  const ID_RADIX = 10;
  const INITIAL_NEW_SKILL_ID_STATE = 'n-skill';

  // *** Словарик data-атрибутов для Действий внутри Скилла ***
  const SkillActionDatasetAttr = {
    NAME: 'skill-action-name',
    DATA_FROM: 'skill-action-data--from',
    DATA_TO: 'skill-action-data--to',
  };


  // --------- DOM-элементы ---------
  const skillForm = document.querySelector('#js-skills-form');
  const skillCardTemplate = document.querySelector('#js-skill-card-template');
  const skillCompetenceSelectTemplate = document.querySelector('#js-skill-competence-select-template');
  const skillCompetenceTextTemplate = document.querySelector('#js-skill-competence-text-template');
  const skillActionTemplate = document.querySelector('#js-skill-action-template');

  if (
    !skillForm
    || !skillCardTemplate
    || !skillCompetenceSelectTemplate
    || !skillCompetenceTextTemplate
    || !skillActionTemplate
  ) {
    return;
  }

  const skillCompetenceHiddenSelect = skillForm.querySelector('#js-skill-competence-hidden-select');
  const skillsList = skillForm.querySelector('#js-skills-list');
  const skillCardsHTMLCollection = skillsList.getElementsByClassName('js-skill-card');
  const skillAdderator = skillForm.querySelector('.js-add-new-skill-card');


  /*
  ===================================
  --------- ОСНОВНАЯ ЛОГИКА ---------
  ===================================
  */

  // --- Счётчик порядкового значения для ID Скиллов ---  
  let uniqueIDCounter = 1;
  const getUniqueIDCounter = () => {
    return uniqueIDCounter++;
  };

  /***
   ** ************************************************
   ** ====== Класс для создания Карточки Скилла ======
   ** ************************************************
   ***/
  class SkillCard {
    constructor(skillCardTemplate) {
      this._skillCard = skillCardTemplate;
      this._hiddenID = this._skillCard.querySelector('.js-skill-hidden-id');

      this._skillCategories = this._skillCard.querySelector('.js-skill-categories');

      this._skillCompetenceBox = this._skillCard.querySelector('.js-skill-competence-box');
      this._skillCompetence = this._skillCard.querySelector('.js-skill-competence');
      
      this._actionsList = this._skillCard.querySelector('.js-skill-card-actions-list');
      this._actionAdderator = this._skillCard.querySelector('.js-add-skill-action');

      this._skillMentor = this._skillCard.querySelector('.js-skill-mentor');

      this._remover = this._skillCard.querySelector('.js-skill-remove-button');

      this._onChangeSkillCategory = this._onChangeSkillCategory.bind(this);
      this._onAddAction = this._onAddAction.bind(this);
      this._onRemoveSkill = this._onRemoveSkill.bind(this);

      this._actionAdderator.addEventListener('click', this._onAddAction);
      this._remover.addEventListener('click', this._onRemoveSkill);

      
      this._setSkillID();
      this._skillParameters = this._getSkillValues(this._hiddenID.value);

      this._setupSkillCompetence()
      this._setupSkillCategory();
      this._setupSkillActions();
      this._setupSkillMentor();
    }


    // *** Метод получения новых параметров для Скилла ***
    _getSkillValues(skillUniqueValue) {
      const isSkillIdString = typeof skillUniqueValue === 'string';
      const isSkillIdNumber = typeof skillUniqueValue === 'number';
      let skillUniqueIDCounter;

      switch (true) {
        case isSkillIdString:
          skillUniqueIDCounter = parseInt( skillUniqueValue.match(REG_EXP_FOR_NUMBER), ID_RADIX );
          break;
  
        case isSkillIdNumber:
          skillUniqueIDCounter = skillUniqueValue;
          break;
      }

      return {
        NEW_SKILL_ID: `n-skill-${skillUniqueIDCounter}`,

        category_params: {
          NAME: `skill-category[${skillUniqueValue}]`,
          SOFT_ID: `skill-category-soft-id[${skillUniqueValue}]`,
          HARD_ID: `skill-category-hard-id[${skillUniqueValue}]`,
        },

        competence: `skill-competence[${skillUniqueValue}]`,

        action_props: {
          NAME: `skill-action-name[${skillUniqueValue}][]`,
          DATA_FROM: `skill-action-data--from[${skillUniqueValue}][]`,
          DATA_TO: `skill-action-data--to[${skillUniqueValue}][]`,
        },

        mentor: `skill-mentor[${skillUniqueValue}]`,
      };
    }


    // *** Метод установки корректного ID для Скилла ***
    _setSkillID() {
      const isGeneratedNewSkill = !this._hiddenID.value || this._hiddenID.value.includes(INITIAL_NEW_SKILL_ID_STATE);

      if (isGeneratedNewSkill) {
        const newSkillIDCounter = getUniqueIDCounter();
        const newSkillID = this._getSkillValues(newSkillIDCounter).NEW_SKILL_ID;
        this._hiddenID.setAttribute('value', newSkillID);
      }

      return this._hiddenID;
    }

    
    // *** Метод настройки Категории для Скилла ***
    _setupSkillCategory() {
      const isGeneratedNewSkill = !this._hiddenID.value || this._hiddenID.value.includes(INITIAL_NEW_SKILL_ID_STATE);

      if (isGeneratedNewSkill) {
        const skillCategoriesList = this._skillCategories;
        const skillCategoryItems = skillCategoriesList.querySelectorAll('.js-skill-category-item');
        const skillCategoryParameters = this._skillParameters.category_params;

        for (let categoryItem of skillCategoryItems) {
          const categoryHiddenInput = categoryItem.querySelector('input[type=radio]');
          const categoryLabel = categoryItem.querySelector('label');

          const isSoftSkill = categoryHiddenInput.dataset.jsSkillCategory === 'soft-skill';
          const isHardSkill = categoryHiddenInput.dataset.jsSkillCategory === 'hard-skill';

          switch (true) {
            case isSoftSkill:
              categoryHiddenInput.setAttribute('id', skillCategoryParameters.SOFT_ID);
              categoryLabel.setAttribute('for', skillCategoryParameters.SOFT_ID);
              break;

            case isHardSkill:
              categoryHiddenInput.setAttribute('id', skillCategoryParameters.HARD_ID);
              categoryLabel.setAttribute('for', skillCategoryParameters.HARD_ID);
              break;
          }

          categoryHiddenInput.setAttribute('name', skillCategoryParameters.NAME);
          categoryLabel.setAttribute('name', skillCategoryParameters.NAME);
        }
      }

      /* --- Добавление обработчиков событий на переключаторы Категорий --- */
      const categorySwitchers = this._skillCategories.querySelectorAll('input[type=radio]');
      Array.from(categorySwitchers).forEach((element) => {
        element.addEventListener('click', this._onChangeSkillCategory, false);
      });
    }


    // *** Метод установки начальной Компетенции для Скилла ***
    _setupSkillCompetence() {
      const isGeneratedNewSkill = !this._hiddenID.value || this._hiddenID.value.includes(INITIAL_NEW_SKILL_ID_STATE);

      if (isGeneratedNewSkill) {
        const currentSkillCompetence = this._skillCompetence;
        const currentSkillCompetenceName = this._skillParameters.competence;
        
        const softSkillCompetenciesClone = skillCompetenceHiddenSelect.cloneNode(true);
        const softSkillCompetencies = softSkillCompetenciesClone.querySelectorAll('option');
        
        Array.from(softSkillCompetencies).forEach((element) => {         
          currentSkillCompetence.appendChild(element);
        });

        const defaultSelectCompetence = currentSkillCompetence.querySelector('option[value="default"]');
        defaultSelectCompetence.selected = true;

        currentSkillCompetence.setAttribute('name', currentSkillCompetenceName);
      }
    }

    
    // *** Метод установки параметров Действия для Скилла ***
    _actionParams(skillAction = null) {
      return {
        /*--- Установка атрибутов для полей внтури Действия ---*/
        setPropAttributes: () => {
          const actionProperties = skillAction.querySelectorAll('.js-skill-action-prop');
          const actionPropValues = this._skillParameters.action_props;
          
          for (let actionProp of actionProperties) {
            const isSkillActionName = actionProp.dataset.jsActionProp === SkillActionDatasetAttr.NAME;
            const isSkillActionDataFrom= actionProp.dataset.jsActionProp === SkillActionDatasetAttr.DATA_FROM;
            const isSkillActionDataTo = actionProp.dataset.jsActionProp === SkillActionDatasetAttr.DATA_TO;
    
            switch (true) {
              case isSkillActionName:
                actionProp.setAttribute('name', actionPropValues.NAME);
                break;
    
              case isSkillActionDataFrom:
                actionProp.setAttribute('name', actionPropValues.DATA_FROM);
                break;
    
              case isSkillActionDataTo:
                actionProp.setAttribute('name', actionPropValues.DATA_TO);
                break;
            }
          }
        },

        /*--- Хендлеры для кнопок взаимодействия с Действием ---*/
        onMove: (evt) => {
          evt.preventDefault();

          const currentMoveButton = evt.currentTarget;

          // *** Внутренний геттер элементов из списка Действий ***
          const getActionElement = (movementButton, movementDirection) => {
            const currentActionElement = movementButton.closest('.js-skill-action');
            let actionSibling = null;

            const isMovementToDown = movementDirection === 'down';
            const isMovementToUp = movementDirection === 'up';

            switch (true) {
              case isMovementToDown:
                actionSibling = currentActionElement.nextElementSibling;
                break;

              case isMovementToUp:
                actionSibling = currentActionElement.previousElementSibling;
                break;

              default:
                break;
            }

            if ( actionSibling && actionSibling.classList.contains('js-skill-action') ) {
              return {
                current: currentActionElement,
                sibling: actionSibling,
              };
            }
          };

          // --- Словарик ф-ций для обработки событий Перемещения Действий ---
          const MoveAction = {
            _moveButton: currentMoveButton,

            down: function() {
              const downActionProps = getActionElement(this._moveButton, 'down'); 
              const currentAction = downActionProps.current;
              const downSibling = downActionProps.sibling;

              if (downSibling) {
                downSibling.after(currentAction);
              }
            },

            up: function() {
              const upActionProps = getActionElement(this._moveButton, 'up');
              const currentAction = upActionProps.current;
              const upSibling = upActionProps.sibling;

              if (upSibling) {
                upSibling.before(currentAction);
              }
            },
          };

          const isMoveDown = currentMoveButton.dataset.jsSkillActionMove === 'action-move--down';
          const isMoveUp = currentMoveButton.dataset.jsSkillActionMove === 'action-move--up';

          switch (true) {
            case isMoveDown:
              MoveAction.down();
              break;

            case isMoveUp:
              MoveAction.up();
              break;
          }
        },

        /*--- Хендлер для кнопки УДАЛЕНИЯ Действия ---*/
        onRemove: (evt) => {
          evt.preventDefault();

          const currentRemoveButton = evt.currentTarget;
          const currentActionElement = currentRemoveButton.closest('.js-skill-action');
          currentActionElement.remove();
        },
      };
    }


    // *** Метод установки Действий внутри Скилла ***
    _setupSkillActions() {
      const skillActions = this._actionsList.querySelectorAll('.js-skill-action');
      const isGeneratedNewSkill = !this._hiddenID.value || this._hiddenID.value.includes(INITIAL_NEW_SKILL_ID_STATE);
      
      Array.from(skillActions).forEach((element) => {
        if (isGeneratedNewSkill) {
          this._actionParams(element).setPropAttributes();
        }

        const skillActionMoveButtons = element.querySelectorAll('.js-skill-action-move');
        const skillActionRemoveButton = element.querySelector('.js-skill-action-remove');

        for (let moveButton of skillActionMoveButtons) {
          moveButton.addEventListener('click', this._actionParams().onMove);
        }

        skillActionRemoveButton.addEventListener('click', this._actionParams().onRemove);
      });

    }

    
    // *** Метод настройки Наставника для Скилла ***
    _setupSkillMentor() {
      const isGeneratedNewSkill = !this._hiddenID.value || this._hiddenID.value.includes(INITIAL_NEW_SKILL_ID_STATE);

      if (isGeneratedNewSkill) {
        const currentSkillMentor = this._skillMentor;
        const currentSkillMentorName = this._skillParameters.mentor;

        currentSkillMentor.setAttribute('name', currentSkillMentorName);
      }
    }


    // *** Геттер параметров Компетенции для выбранного Категории Скилла ***
    _getSkillCompetence() {
      this._skillCompetence.remove();

      return {
        /* --- для Категории "Софт-скилл" --- */
        soft: () => {
          const softSkillCompetenceTemplate = skillCompetenceSelectTemplate.content.cloneNode(true);
          const softSkillCompetenceSelect = softSkillCompetenceTemplate.querySelector('.js-skill-competence');

          softSkillCompetenceSelect.setAttribute('name', this._skillParameters.competence);

          const softSkillCompetenciesClone = skillCompetenceHiddenSelect.cloneNode(true);
          const softSkillCompetencies = softSkillCompetenciesClone.querySelectorAll('option');
          
          Array.from(softSkillCompetencies).forEach((element) => {         
            softSkillCompetenceSelect.appendChild(element);
          });

          const defaultSoftSelectCompetence = softSkillCompetenceSelect.querySelector('option[value="default"]');
          defaultSoftSelectCompetence.selected = true;

          this._skillCompetence = softSkillCompetenceSelect;
          this._skillCompetenceBox.appendChild(this._skillCompetence);
        },

        /* --- для Категории "Хард-скилл" --- */
        hard: () => {
          const hardSkillCompetenceTemplate = skillCompetenceTextTemplate.content.cloneNode(true);
          const hardSkillCompetence = hardSkillCompetenceTemplate.querySelector('.js-skill-competence');
    
          hardSkillCompetence.setAttribute('name', this._skillParameters.competence);
    
          this._skillCompetence = hardSkillCompetence;
          this._skillCompetenceBox.appendChild(this._skillCompetence);
        },
      };
    }

    
    // *** Метод для удаления атрибутов "checked" со всех радиокнопок внутри Скилла ***
    _uncheckCategoryRadioButtons() {
      const categoryRadioButtons = this._skillCategories.querySelectorAll('input[type="radio"]');
      
      for (let categoryRadio of categoryRadioButtons) {
        categoryRadio.removeAttribute('checked');
      }
    }


    // *** Метод обработки события Изменения Категории для Скилла ***
    _onChangeSkillCategory(evt) {
      const currentCategoryRadio = evt.currentTarget;
      const isCategoryAlreadySelected = currentCategoryRadio.hasAttribute('checked');

      if (isCategoryAlreadySelected) {
        return;
      }

      this._uncheckCategoryRadioButtons();
      currentCategoryRadio.setAttribute('checked', EMPTY_VALUE);

      const isSoftSkillCategorySelected = evt.currentTarget.dataset.jsSkillCategory === 'soft-skill';
      const isHardSkillCategorySelected = evt.currentTarget.dataset.jsSkillCategory === 'hard-skill';

      switch (true) {
        case isSoftSkillCategorySelected:
          this._getSkillCompetence().soft();
          break;

        case isHardSkillCategorySelected:
          this._getSkillCompetence().hard();
          break;
      }
    }


    // *** Метод обработки события Добавления нового Действия ***
    _onAddAction(evt) {
      evt.preventDefault();
      
      const newSkillActionTemplate = skillActionTemplate.content.cloneNode(true);
      const newSkillAction = newSkillActionTemplate.querySelector('.js-skill-action');

      const newSkillActionMoveButtons = newSkillAction.querySelectorAll('.js-skill-action-move');
      const newSkillActionRemoveButton = newSkillAction.querySelector('.js-skill-action-remove');
     
      this._actionParams(newSkillAction).setPropAttributes();

      Array.from(newSkillActionMoveButtons).forEach((element) => {
        element.addEventListener('click', this._actionParams().onMove);
      });
      newSkillActionRemoveButton.addEventListener('click', this._actionParams().onRemove);

      this._actionsList.appendChild(newSkillAction);
    }


    // *** Метод обработки события УДАЛЕНИЯ Скилла ***
    _onRemoveSkill(evt) {
      evt.preventDefault();

      const currentSkillCard = evt.currentTarget.closest('.js-skill-card');
      currentSkillCard.remove();
    }


    // *** Внешний метод генерации нового элемента карточки Скилла ***
    generate() {
      return this._skillCard;
    }
  }


  // *** Ф-ция для обработки события Добавбения нового Скилла ***
  const onNewSkillAdd = (evt) => {
    evt.preventDefault();

    const newSkillTemplate = skillCardTemplate.content.cloneNode(true).querySelector('.js-skill-card');
    const newSkill = new SkillCard(newSkillTemplate).generate();

    skillsList.appendChild(newSkill);
    newSkill.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };


  /*
   * --- Создание "наследников" класса SkillCard
   * --- на основе уже имеющейся на странице коллекции Скиллов
   */
  Array.from(skillCardsHTMLCollection).forEach((element) => {
    element = new SkillCard(element).generate();
  });


  // === Добавление обработчиков событий ===
  skillAdderator.addEventListener('click', onNewSkillAdd);
})();
