$(document).ready(function() {
  startTour();
});

function startTour() {
  const welcomeModal = $("#js-welcome-bg");
  const welcomeLayout = $("#js-welcome-layout");

  if (!welcomeModal.length || !welcomeLayout.length) {
    return;
  }

  $("body").addClass("body--overflow").on('click', '[data-tour-to]', function(e) {
    const step = $(e.currentTarget).data("tour-to");

    showStep(step);
  });


  setTimeout(function() {
    welcomeModal.fadeIn(1300);
    welcomeLayout.show();

    showStep(0);
  }, 1000);  // задержка лоадера
}

function showStep(stepNum) {
  $("[data-tour]").hide();

  document.body.dataset.tourStep = stepNum;

  if (stepNum === 0) {
    $('[data-tour="0"]').fadeIn();
  } else if (!stepNum) {
    $("body").removeClass("body--overflow");
    $("#js-welcome-bg").fadeOut(300);
    $("#js-welcome-layout").hide();
  } else {
    $('[data-tour="' + stepNum + '"]').fadeIn();
  }
}
