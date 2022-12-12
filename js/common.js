function cookieSet(index, value) {
    Cookies.set(index, value, {
        expires: null,
        path: '/',
        domain: document.location.hostname
    });
}

function cookieDel(index) {
    Cookies.remove(index, null, {
        expires: null,
        path: '/',
        domain: document.location.hostname
    });
}

function fnMorph(n, w1, w2, w3) {
    let count = parseInt(n);
    if (count > 10 && count < 20) return w3;
    count = count % 10;
    if (count > 1 && count < 5) return w2;
    if (count == 1) return w1;

    return w3;
}

function formCheck(where) {
    var errors = 0;
    $('input[type=text],input[type=email],input[type=password], textarea, select', where).each(function () {
        var el = $(this);
        if (el.attr('required') && el.val() == '') {
            el.addClass('error');
            errors++;
        } else el.removeClass('error');
    });
    $('.error:first', where).focus();
    setTimeout(function () {
        where.find('.error').removeClass('error');
    }, 3000);

    return errors == 0;
}

//Для элементов с прокруткой получаем высоту прокрутки
function get_scroll_height(element) {
    var temp = element.scrollTop
    element.scrollTop = 1 + element.scrollHeight - element.clientHeight;
    var height = element.scrollTop;
    element.scrollTop = temp;
    element.setAttribute("data-scroll", height);
}

function is_in_viewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

function update_extended_menu(text, doing) {
    let new_text = $(".js-menu-extended").find(".js-extended-text").text();
    $(".js-menu-extended").find(".js-extended-text").html(text + '<span class="red-ico icon-caret"></span>');
    $(".js-menu-extended").find(".js-extended-tippy").attr("data-tippy-content", text);
    //  console.log(tippy(document.querySelector('.js-extended-tippy')));

    $(".js-menu-extended").attr("data-text", new_text);
    if (doing == "open") {
        $(".js-menu-extended").addClass("open");
        $(".js-menu-extended").prev().slideDown();
        cookieSet("extended", "open");
    } else {
        $(".js-menu-extended").removeClass("open");
        $(".js-menu-extended").prev().slideUp();
        cookieSet("extended", "close");
    }

}

function change_visibile(block) {
    $(block).each(function () {
        if ($(this).attr("aria-expanded") == "true") {
            $(this).slideUp();
            $(this).attr("aria-expanded", "false");
        } else {
            $(this).slideDown();
            $(this).attr("aria-expanded", "true");
        }
    })

}

function create_tippy(element, theme) {

    let placement = "bottom";
    if (element.getAttribute('data-placement')) {
        placement = element.getAttribute('data-placement');
    }
    let trigger = "mouseenter";
    if (element.getAttribute('data-trigger')) {
        trigger = element.getAttribute('data-trigger');
    }
    let offset = element.getAttribute('data-offset');
    if (offset) {
        var offset_splits = offset.split(',').map(function (item) {
            return parseInt(item, 10);
        });
    } else {
        offset = [0, 0];
    }
    tippy(element, {
        content(reference) {
            const id = reference.getAttribute('data-template');
            if (id) {
                const template = document.getElementById(id);
                if (template) {
                    return "<div> " + template.innerHTML + "</div>";
                }
            } else {
                reference.getAttribute('data-tippy-content');
            }
        },
        arrow: false,
        allowHTML: true,
        theme: theme,
        interactive: true,
        trigger: trigger,
        offset: offset_splits,
        placement: placement
    });
}

function create_best_slider() {
    var sliderBest = tns({
        container: '#js-best-slider .js-slider-container',
        items: 3,
        nav: false,
        gutter: 16,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        speed: 500,
        mouseDrag: true,
        prevButton: '#js-best-slider .slider-prev',
        nextButton: '#js-best-slider .slider-next',
        responsive: {
            1650: {
                items: 4,
            }
        }
    });
}

var forEach = function (array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};


/* DOCUMENT READY */
$(document).ready(function() {
  // 'Check all' checkbox
  (function() {
    const $checkAllToggle = $('#js-table-checkall');
    const $checkTable = $checkAllToggle.closest('table');
    const $tableCheckboxes = $checkTable.find('td:first-child input[type="checkbox"]:not(.js-table-checkall)');

    $checkAllToggle.on('change', function() {
      const isChecked = $(this).is(":checked");

      $tableCheckboxes.each(function() {
        $(this).prop('checked', isChecked);
      });
      $tableCheckboxes.trigger('change');
    });

    $tableCheckboxes.each(function() {
      $(this).on('change', function() {
        if ($checkAllToggle.is(':checked') && $tableCheckboxes.not(':checked').length > 0) {
          $checkAllToggle.prop('checked', false);
        } else if ($checkAllToggle.not(':checked') && $tableCheckboxes.not(':checked').length == 0) {
          $checkAllToggle.prop('checked', 'checked');
        }
      });
    });
  })();

  // Simple block spoiler
  (function() {
    $('.js-spoiler').on('click', function() {
      $(this).toggleClass('is-closed').next().slideToggle();
    });
  })();

  // Date/time to mask
  (function() {
    $('.js-date-to').mask('00/00/0000');
    $('.js-time').mask('00:00');
    $('.js-timelimit').mask('00:00:00');
  })();

  (function() {
    $('.js-expand-textarea').on('blur', function () {
      $(this).val() === '' && $(this).removeClass('is-active');
    }).on('focus', function () {
      $(this).addClass('is-active');
    });
  })();

  // Adaptive table
  (function() {
    $('.js-table-responsive table').wrap('<div class="table-responsive" />');
  })();

  // Toggle view type
  $('.js-view-toggle').on('click', function() {
    $(this).toggleClass('is-list');
    $('.js-view-items').toggleClass('is-list');
  });


  // Fileinput
  (function() {
    $('.ui-fileinput input').each(function() {
      const $that = $(this);

      $that.on('change', function() {
        const $parent = $that.parent();
        const placeholder = $that.attr('placeholder') || '';
        const files = $that[0].files[0];

        $that.siblings('span').text(
          files ? files.name : placeholder
        );

        files ? $parent.addClass('is-filled') : $parent.removeClass('is-filled');
      });

      $that.siblings('[data-clear]').on('click', function(e) {
        e.preventDefault();
        $that.val('').trigger('change');
      });
    });
  })();

  // PIE progress
  (function() {
    $('[data-pie]').each(function(){
      const $this = $(this);
      const percentage = $this.data('pie');
      const fill = $this.data('pie-fill');
      const track = $this.data('pie-track');
      const degrees = percentageDegrees(percentage);
      createGradient($this, degrees, fill, track);
    });

    function percentageDegrees(p) {
      p = ( p >= 100 ? 100 : p );
      return 3.6 * p;
    }

    function createGradient(elem, d, fill, track) {
      fill = fill || 'red';
      track = track || 'grey';

      if ( d <= 180 ) {
        d = 90 + d;
        elem.css( 'background', 'linear-gradient(90deg, '+track+' 50%, transparent 50%), linear-gradient('+ d +'deg, '+fill+' 50%, '+track+' 50%)' );
      } else {
        d = d - 90;
        elem.css( 'background', 'linear-gradient(-90deg, '+fill+' 50%, transparent 50%), linear-gradient('+ d +'deg, '+track+' 50%, '+fill+' 50%)' );
      }
    }
  })();

  // Star rate
  (function() {
    $('.js-stars').each(function() {
      const $that = $(this);

      $(this).on('click', 'span', function() {
        const ratePercent = calcRate($(this).index() + 1, 5);
        $that.addClass('is-voted').find('[data-rate]').css({width: ratePercent+'%'});
      });
    });

    function calcRate(current, full) {
      return (parseInt(current) / parseInt(full)) * 100;
    }
  })();

  // News fav
  (function() {
    $('body').on('click', '.js-fav', function(e) {
      e.preventDefault();
      $(this).toggleClass('is-added');
    });
  })();

  $(".video-js").on("click", function () {
      let video = $(this).find("video");
      if ($(this).hasClass("playing")) {
          video.trigger("pause");
          $(this).removeClass("playing");
      } else {
          video.trigger("play");
          $(this).addClass("playing");
      }
  });

    /* var sticky = new Sticky('#header');
    var sticky = new Sticky('#js-aside');*/

    if (Cookies.get("aside") == "close") {
        $(".js-aside-control").addClass("close");
        $("#js-aside").addClass("close");
    }
    if (Cookies.get("aside") == "close") {
        let text = $(".js-menu-extended").attr("data-text");
        update_extended_menu(text, "close");
    }
    //Разворачивает пункты левого меню
    $(".js-menu-extended").click(function () {

        let text = $(this).attr("data-text");
        if ($(this).hasClass("open")) {
            update_extended_menu(text, "close");
        } else {
            update_extended_menu(text, "open");
        }

    })
    //Разворачивает само меню
    $(".js-aside-control").click(function () {
        $(this).toggleClass("close");
        $("#js-aside").toggleClass("close");
        if ($(this).hasClass("close")) {
            cookieSet("aside", "close");
        } else {
            cookieSet("aside", "open");
        }
    })

    //Обработчик кнопок радио-баттонов которые что-то скрывают/показывают
    $(".js-toogle").change(function () {
        let id = $(this).attr("data-target");
        if ($(this).prop("checked")) {
            $(id).slideDown();
        } else {
            $(id).slideUp();
        }
    })
    //Выбор аккаунта в окне авторизации
    $(".js-choose-acc").click(function () {
        $(".js-choose-acc").not(this).hide();
        change_visibile(".js-choose");
    })
    if ($("#js-short-slider").length > 0) {
        var shortNews = tns({
            container: '#js-short-slider .js-slider-container',
            items: 1,
            nav: false,
            mouseDrag: true,
            prevButton: '#js-short-slider .slider-prev',
            nextButton: '#js-short-slider .slider-next',
        });
    }
    if ($("#js-news-slider").length > 0) {
        var sliderNews = tns({
            container: '#js-news-slider .js-slider-container',
            items: 3,
            nav: false,
            loop: false,
            mouseDrag: true,
            prevButton: '#js-news-slider .slider-prev',
            nextButton: '#js-news-slider .slider-next',
            responsive: {
                1650: {
                    items: 4
                }
            }
        });
    }
    if ($("#js-best-slider").length > 0) {
        create_best_slider();
    }
    // Fancybox.bind(".js-medals", {
    //     type       : 'iframe',
    //     mainClass: "popup-medals",
    //     hideScrollbar   : true
    // });
    // Fancybox.bind(".js-callback", {
    //     type       : 'iframe',
    //     hideScrollbar   : true,
    //     infinite : false
    // });
    $("body").on("click", ".js-fancy-frame", function (event) {
        console.log("fancy");
        event.preventDefault();
        let link = $(this).attr("href")
        let fancy = Fancybox.show([{
                hideScrollbar: true,
                src: link,
                type: 'iframe',
            }]);
    });


    let tippy_tooltips = document.querySelectorAll('[data-tippy-content]');
    for (let element of tippy_tooltips) {

        let theme = "eos-tooltip";
        if (element.getAttribute('data-theme')) {
            theme = element.getAttribute('data-theme');
        }
        create_tippy(element, theme);
    }

    let tippy_elements = document.querySelectorAll('.js-tippy');
    for (let element of tippy_elements) {
        let theme = "eos-dark";
        if (element.getAttribute('data-theme')) {
            theme = element.getAttribute('data-theme');
        }
        create_tippy(element, theme);
    }
    //Для элементов с прокруткой определяем прокрутку до конца. Должен работать в конце Ready
    let scroll_elements = document.querySelectorAll('.js-scrolling');
    for (let element of scroll_elements) {
        get_scroll_height(element);
        element.onscroll = function() {
            height = element.getAttribute("data-scroll");
            var scroll = element.scrollTop;

            if (height - scroll === 0) {
                $(this).addClass("end");
                element.classList.add('end');
            } else {
                element.classList.remove('end');
            }
        }
    }

    /*
if($('.js-sticky').length>0 && $(window).width() > 991){
    var sticky = new Sticky('.js-sticky');
    }*/

    //WINDOW SCROLL
    $(window).scroll(function () {


    });
    //END SCROLL
});


//RESIZE
$(window).resize(function () {
    //Обновляем высоту прокрутки у нужных элементов
    let scroll_elements = document.querySelectorAll('.js-scrolling');
    for (let element of scroll_elements) {
        get_scroll_height(element);
    }

    /*  if ($(window).width() <= 991) {

      } else {
          var sticky = new Sticky('.js-sticky');
      }*/

});

