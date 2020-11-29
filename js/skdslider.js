/* ========= alt slider =========== */
(function ($) {
  $.slider = function (container, options) {
    // settings
    var config = {
      delay: 2000,
      fadeSpeed: 500,
      showNav: true,
      numericNav: false,
    };

    if (options) {
      $.extend(config, options);
    }
    // variables

    var element = $(container);
    element.find("ul").addClass("slides");
    var slides = element.find("ul.slides li");
    var targetSlide = 0;
    $.slider.currentSlide = 0;

    $.slider.createNav(element, slides, config);
    slides.eq(targetSlide).show();
    $.slider.interval = setTimeout(function () {
      $.slider.playSlide(element, slides, config);
    }, config.delay);
  };

  $.slider.createNav = function (element, slides, config) {
    var slideSet = '<ul class="slide-navs">';
    for (i = 0; i < slides.length; i++) {
      var slideContent = "";
      if (config.numericNav == true) slideContent = i + 1;
      if (i == 0) slideSet += '<li class="current-slide slide-nav-' + i + '"><a>' + slideContent + "</a></li>";
      else slideSet += '<li class="slide-nav-' + i + '"><a>' + slideContent + "</a></li>";
    }
    slideSet += "</ul>";

    if (config.showNav == true) {
      element.append(slideSet);
      var nav_width = element.find(".slide-navs")[0].offsetWidth;
      nav_width = parseInt(nav_width / 2);
      nav_width = -1 * nav_width;
      element.find(".slide-navs").css("margin-left", nav_width);
      // Slide marker clicked
      element.find(".slide-navs li").click(function () {
        index = element.find(".slide-navs li").index(this);
        targetSlide = index;
        clearTimeout($.slider.interval);
        $.slider.playSlide(element, slides, config, targetSlide);
        return false;
      });
    }
  };

  $.slider.playSlide = function (element, slides, config, targetSlide) {
    element.find(".slide-navs li").removeClass("current-slide");
    slides.eq($.slider.currentSlide).fadeOut(config.fadeSpeed);

    if (typeof targetSlide == "undefined") {
      targetSlide = $.slider.currentSlide + 1 == slides.length ? 0 : $.slider.currentSlide + 1;
    }

    element.find(".slide-navs li").eq(targetSlide).addClass("current-slide");
    slides.eq(targetSlide).fadeIn(config.fadeSpeed, function () {
      $.slider.removeIEFilter($(this)[0]);
    });
    $.slider.currentSlide = targetSlide;

    $.slider.interval = setTimeout(function () {
      $.slider.playSlide(element, slides, config);
    }, config.delay);
  };

  $.slider.removeIEFilter = function (elm) {
    if (elm.style.removeAttribute) {
      elm.style.removeAttribute("filter");
    }
  };

  $.fn.slider = function (options) {
    return this.each(function () {
      new $.slider(this, options);
    });
  };
})(jQuery);
$("#demo").slider({ delay: 5000, fadeSpeed: 2000 });
