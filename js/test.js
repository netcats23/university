$(document).ready(function() {
  const baseTest = new Test(store);

  function Test(testStore, options) {
    if (!testStore) {
      return false;
    }

    let isResult = testStore.isResult || false;
    let isAdmin = testStore.isAdmin || false;
    let isInit = false;
    let currentStep = 0;
    let timerCountdown = null;
    const TEST_LENGTH = testStore.test.length;

    const $body = $('body');
    const $stepsForm = $('#js-test-form');
    const $pagElement = $('#js-test-pag');
    const $testTimerEl = $('#js-test-timer');
    const $testCore = $('#js-test-core');
    const $testResult = $('#js-test-result');
    const $stepNumberElement = $('#js-step-number');
    const $stepNextBtns = $('[data-step-go="next"]');
    const $resultText = $('.js-result-text');
    const $adminArea = $('#js-test-admin');

    const CLASSES = {
      init: 'is-init',
      sended: 'is-sended',
      last: 'is-last',
      first: 'is-first',
      active: 'is-active',
      timerShown: 'is-shown',

      stepWrapper: 'data-test-step',
      formActiveStep: 'data-active-step',
    }

    createTest(testStore);
    createTestPagination($pagElement, TEST_LENGTH);
    initStepClicks('[data-step-go]');
    initFieldsEvents();
    isAdmin && initAdminActions();


    // FUNCTIONS
    function initFieldsEvents() {
      $body.on('change, input', '['+CLASSES.stepWrapper+'] input, ['+CLASSES.stepWrapper+'] textarea', function() {
        preValidation($(this));
      });
    }

    function initAdminActions() {
      $adminArea.find('textarea, input').on('change, input', function() {
        const answerValue = $(this).val();
        const answerType= $(this).prop('tagName');

        $('['+CLASSES.stepWrapper+'="'+currentStep+'"]').find(answerType).val(answerValue).trigger('input');
      });
    }

    function initStepClicks(selector) {
      $body.on('click', selector, function(e) {
        let step = $(this).data('step-go') || 0;
        const isLastStep = currentStep + 1 > TEST_LENGTH;

        if (isLastStep && isResult) {
          return true;
        }

        e.preventDefault();

        switch (step) {
          case 'start':
            +testStore.timer && !isInit && createTimer(+testStore.timer, $testTimerEl);

            step = 1;
            setInit();
            break;

          case 'end':
            endingTest();
            break;

          case 'next':
            if (step = currentStep + 1 > TEST_LENGTH) {
              step = TEST_LENGTH
              isResult || finalValidate($stepsForm);
              return;
            } else {
              step = currentStep + 1;
            }
            break;

          case 'prev':
            step = currentStep - 1 < 0 ? 0 : currentStep - 1;
            break;
        }

        setCurrentStep(step);
        isAdmin && adminCopyFields($('['+CLASSES.stepWrapper+'="'+step+'"]'));
        preValidation(
          $('['+CLASSES.stepWrapper+'="'+step+'"]')
        );
      });
    }

    function adminCopyFields(el) {
      const stepTextValue = el.find('textarea').val();
      const $stepStatus = el.find('input');
      const stepStatusValue = $stepStatus.val();
      const $adminRadioStatus = $adminArea.find('input').eq(0);

      $adminArea.find('textarea').val(stepTextValue);

      if (stepStatusValue === '') {
        $adminRadioStatus.prop('checked', true);
        $stepStatus.val($adminRadioStatus.val());
      } else {
        $adminArea.find('input[value="'+stepStatusValue+'"]').prop('checked', true);
      }
    }

    function setInit() {
      $stepsForm.addClass(CLASSES.init);
      return isInit = true;
    }

    function unsetInit() {
      $stepsForm.removeClass(CLASSES.init);
      return isInit = false;
    }

    function setCurrentStep(step) {
      currentStep = +step;

      currentStep === TEST_LENGTH ? $stepsForm.addClass(CLASSES.last) : $stepsForm.removeClass(CLASSES.last);

      $stepNumberElement.text(currentStep);
      $stepsForm.attr(CLASSES.formActiveStep, currentStep);

      $pagElement.find('*').removeClass(CLASSES.active).eq(+step - 1).addClass(CLASSES.active);

      $('['+CLASSES.stepWrapper+']').hide();
      $('['+CLASSES.stepWrapper+'="'+ step + '"]').fadeIn(600);
      $stepNextBtns.attr('disabled', true);
    }

    function createTest(data) {
      const $wrapper = $('#js-test');
      const $template = $wrapper.find('['+CLASSES.stepWrapper+'="0"]');

      createStep($template, {
        title: data.title,
        text: data.text,
        cover: data.cover,
      });

      for (let i = 0; i < data.test.length; i++) {
        const questNum = i + 1;
        const questData = data.test[i];

        $template.clone().appendTo($wrapper);
        createStep(
          $wrapper.find('['+CLASSES.stepWrapper+']:last-child'),
          questData,
          questNum
        );
      }
    }

    function createTestPagination(element, nums) {
      if (!element) return;

      for (let i = 0; i < nums; i++) {
        element.append('<span data-step-go="'+ (i + 1) +'"></span>');
      }
    }

    function createStep(node, data, step) {
      if (!data) return;

      step && node.attr(CLASSES.stepWrapper, step);

      node.find('h1').text(data.title || '');
      node.find('.smodal-test__text').html(data.text || '');
      node.find('.smodal-test__cover').html(data.cover || '');

      if (data.questions) {
        const fieldsHtml = createField(data.questions);
        node.find('.smodal-test__body').html(fieldsHtml);
      }
    }

    function createField(data) {
      let fields = '';

      for (let i = 0; i < data.length; i++) {
        fields += renderElement(data[i], i);
      }

      return fields;
    }

    function showResult(type) {
      hideTest();
      unsetInit();
      $testResult.fadeIn(600);

      $('[data-result="' + type + '"]').addClass(CLASSES.active);

      switch(type){
        case 'timeout':
        case 'waiting':
          $stepsForm.attr(CLASSES.formActiveStep, 'close');
          break;

        case 'good':
        case 'bad':
          $stepsForm.attr(CLASSES.formActiveStep, 'show');
          break;
      }
    }

    function hideTest() {
      clearTimer();
      $testCore.hide();
    }

    function createTimer(seconds, el) {
      const startTime = +new Date();
      const endTime = +new Date() + seconds * 1000;

      setTimerValue(el, endTime - startTime);
      el.addClass(CLASSES.timerShown);

      timerCountdown = setInterval(function() {
        const distanceTime = endTime - (+new Date());

        if (distanceTime < 0) {
          showResult('timeout');
          return;
        }

        setTimerValue(el, distanceTime);
      }, 1000);
    }

    function setTimerValue(el, time) {
      const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);

      el.html(
        addLeadingZero(hours) + ":" +
        addLeadingZero(minutes) + ":" +
        addLeadingZero(seconds)
      );
    }

    function clearTimer() {
      timerCountdown && clearInterval(timerCountdown);
      $testTimerEl.removeClass(CLASSES.timerShown);
    }

    function addLeadingZero (num) {
      return num > 9 ? num : '0' + num;
    }

    function renderElement(data, i) {
      if (!data) return;

      const label = data.label;
      const name = data.name || data.type+'-' + i;
      const value = data.value;
      const readonly = data.readonly || isResult ? 'readonly disabled' : '';
      const checked = data.checked || data.userChoice ? 'checked' : '';

      const adminLabel = 'комментарий преподавателя';
      const answer = data.answer || '';
      const userChoice = data.userChoice || '';
      const teacherComment = data.comment ? "<div class=\"smodal-test__answer\"><b class=\"smodal-test__answer-label\">".concat(adminLabel, "</b><div class=\"smodal-test__answer-text\">").concat(data.comment, "</div></div>") : "";

      let status = '';

      if (answer && userChoice) {
        answer === userChoice ? status = 'is-good' : status = 'is-bad';
      } else if (answer) {
        status = 'is-good';
      } else if (userChoice) {
        status = 'is-bad'
      }

      switch (data.type) {
        case 'checkbox':
          return "<label class=\"test-variant ".concat(status, "\">\n                <span class=\"ui-checkbox ui-checkbox--center\">\n                  <input type=\"checkbox\" name=\"").concat(name, "\" value=\"").concat(value || label, "\" ").concat(readonly + ' ' + checked, ">\n                  <span class=\"ui-checkbox__label\">").concat(label || '', "</span>\n                </span>\n              </label>");

        case 'radio':
          return "<label class=\"test-variant ".concat(status, "\">\n                <div class=\"ui-radio\">\n                  <input type=\"radio\" name=\"").concat(name, "\" value=\"").concat(value || label, "\" ").concat(readonly + ' ' + checked, ">\n                  <span class=\"ui-radio__label\">").concat(label || '', "</span>\n                </div>\n              </label>");

        case 'textarea':
          return "<label class=\"test-variant test-variant--textarea ".concat(status, "\">\n                <textarea class=\"ui-input ui-input--size-small\" name=\"").concat(name, "\" cols=\"30\" rows=\"10\" placeholder=\"").concat(label || 'Напишите ваш вариант ответа', "\" ").concat(readonly, ">").concat(value || '', "</textarea>\n              </label>").concat(teacherComment);

        case 'answer':
          return "<div class=\"smodal-test__text\">".concat(value || '', "</div><textarea style=\"display:none\" name=\"").concat(name, "\" cols=\"30\" rows=\"10\" readonly></textarea><input name=\"").concat(name, "-status\" type=\"hidden\" value=\"\" readonly />");
      }
    }

    function preValidation(el) {
      const parentStep = el.closest('['+CLASSES.stepWrapper+']');
      const isFilled = hasStepAnswer(parentStep);

      $stepNextBtns.attr('disabled', !isFilled);
    }

    function hasStepAnswer(stepNode) {
      const hasAnswer = stepNode.find('input:checked').length > 0;
      const hasTextAnswer = stepNode.find('textarea').length > 0 && stepNode.find('textarea').val().length > 2;

      return hasAnswer || hasTextAnswer;
    }

    function finalValidate(form) {
      const formStep = form.find('['+CLASSES.stepWrapper+']').not('['+CLASSES.stepWrapper+'="0"]');
      let isFormValid = true;

      formStep.each(function(i) {
        const stepIndex = i + 1;
        const isFilled = hasStepAnswer($(this));

        if (!isFilled) {
          setCurrentStep(stepIndex);
          isAdmin && adminCopyFields($('['+CLASSES.stepWrapper+'="'+stepIndex+'"]'));
          isFormValid = false;
          return false;
        }
      });

      isFormValid && submitForm(form);
    }

    function submitForm(form) {
      form.addClass(CLASSES.sended);
      clearTimer();
      isAdmin && $('.test-admin').remove();

      // temp plug
      setTimeout(function () {
        showResult('waiting');
        $resultText.text('1 из 5 правильных ответов');
      }, 1500);
      return;
      // #temp plug

      // SEND FORM DATA
      $.ajax({
        type: 'POST',
        url: form.attr('action') || '',
        data: form.serialize(),
        success: function(data) {
          $resultText.text(data.text); // 1 из 5 правильных ответов
          showResult(data.type); // waiting || good || bad
        },
        error: function(data) {
          alert(data);
        }
      });
    }
  }
});
