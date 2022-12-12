$(document).ready(function() {
  // Test type show
  (function() {
    showTestionType('1');

    $('body').on('change', '[name="type-testing"]', function() {
      showTestionType($(this).val());
    });

    function showTestionType (type) {
      $('[data-type-testing]').hide();
      $('[data-type-testing="'+ type +'"]').fadeIn(200);
    }
  })();

  // Custom variants for test's
  (function() {
    const placholderText = 'Укажите ответ';

    createVariants(2);

    // New variant
    $('.js-add-variant').on('click', function() {
      const $that = $(this);
      createVariants(1);

      $('html, body').animate({
        scrollTop: $that.offset().top
      }, 1000);
    });

    // Variant actions
    $('body').on('click', '[data-action]', function() {
      const action = $(this).data('action');
      const $parentNode = $(this).closest('[data-order]');
      const currentPosition = parseInt($parentNode.data('order'));

      switch (action) {
        case 'del':
          if ($('[data-order]').length > 1) {
            $parentNode.remove();
            reRenderIds();
          }
          break;

        case 'up':
          changePostion($parentNode, currentPosition, currentPosition - 1);
          reRenderIds();
          break;

        case 'down':
          changePostion($parentNode, currentPosition, currentPosition + 1);
          reRenderIds();
          break;
      }
    });

    function createVariants(cloneNum) {
      const $originalVariant = $('[data-order="1"]:first-child');
      const $parentWrapper = $originalVariant.parent();

      for (let i = 0; i < cloneNum; i++) {
        $originalVariant.clone().appendTo($parentWrapper);
      }

      reRenderIds();
    }

    function changePostion(element, curentPosition, newPosition) {
      newPosition > curentPosition  ? element.insertAfter(element.next()) : element.insertBefore(element.prev());
    }

    function reRenderIds() {
      const listVariants = $('[data-order]');

      listVariants.each(function(i) {
        const $that = $(this);
        const order = i + 1;

        const $orderInput = $that.find('input[type="hidden"]');
        const $textInput = $that.find('input[type="text"]');
        const $correctCheckbox = $that.find('input[type="checkbox"]');

        // change names & values
        $that.attr('data-order', order);
        $orderInput.val(order).attr('name', 'variant-' + order + '-order');
        $textInput.attr({
          'name': 'variant-' + order,
          'placeholder': placholderText + ' ' + order ,
        });
        $correctCheckbox.attr('name', 'variant-' + order + '-valid');
      });
    }
  })();
});
