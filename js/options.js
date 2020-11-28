// Limit scope pollution from any deprecated API
(function () {
  var matched, browser;

  // Use of jQuery.browser is frowned upon.
  // More details: http://api.jquery.com/jQuery.browser
  // jQuery.uaMatch maintained for back-compat
  jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

    return {
      browser: match[1] || "",
      version: match[2] || "0",
    };
  };

  matched = jQuery.uaMatch(navigator.userAgent);
  browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if (browser.chrome) {
    browser.webkit = true;
  } else if (browser.webkit) {
    browser.safari = true;
  }

  jQuery.browser = browser;

  jQuery.sub = function () {
    function jQuerySub(selector, context) {
      return new jQuerySub.fn.init(selector, context);
    }
    jQuery.extend(true, jQuerySub, this);
    jQuerySub.superclass = this;
    jQuerySub.fn = jQuerySub.prototype = this();
    jQuerySub.fn.constructor = jQuerySub;
    jQuerySub.sub = this.sub;
    jQuerySub.fn.init = function init(selector, context) {
      if (context && context instanceof jQuery && !(context instanceof jQuerySub)) {
        context = jQuerySub(context);
      }

      return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
    };
    jQuerySub.fn.init.prototype = jQuerySub.fn;
    var rootjQuerySub = jQuerySub(document);
    return jQuerySub;
  };
})();

// Instantiate theme collapse element object
$theme_accordion = {};
$theme_accordion.collapse = {};

/* ACCORDION */
$(".accordion-toggle").click(function () {
  if ($(this).parent().hasClass("active")) {
    $theme_accordion.collapse.close($(this).parent().parent());
    return;
  }
  $("#accordion")
    .children(".accordion-group")
    .each(function (i, elem) {
      $theme_accordion.collapse.close(elem);
    });
  $theme_accordion.collapse.open(this);
});

/* ACCORDION STATE MANAGER */
$theme_accordion.collapse.close = function close(element) {
  jQuery(element).children(".accordion-heading").removeClass("active");
  jQuery(element).children(".accordion-heading").find(".plus").html("+");
};
$theme_accordion.collapse.open = function open(element) {
  jQuery(element).parent().toggleClass("active");
  jQuery(element).find(".plus").html("-");
};
/* --------------------------- */

/* --------------- CALENDAR ------------------------ */
$(function () {
  if ($("#calendar").length) {
    var transEndEventNames = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        msTransition: "MSTransitionEnd",
        transition: "transitionend",
      },
      transEndEventName = transEndEventNames[Modernizr.prefixed("transition")],
      $wrapper = $("#custom-inner"),
      $calendar = $("#calendar"),
      cal = $calendar.calendario({
        onDayClick: function ($el, $contentEl, dateProperties) {
          if ($contentEl.length > 0) {
            showEvents($contentEl, dateProperties);
          }
        },
        caldata: codropsEvents,
        displayWeekAbbr: true,
      }),
      $month = $("#custom-month").html(cal.getMonthName()),
      $year = $("#custom-year").html(cal.getYear());

    $("#custom-next").on("click", function () {
      cal.gotoNextMonth(updateMonthYear);
    });
    $("#custom-prev").on("click", function () {
      cal.gotoPreviousMonth(updateMonthYear);
    });

    function updateMonthYear() {
      $month.html(cal.getMonthName());
      $year.html(cal.getYear());
    }

    // just an example..
    function showEvents($contentEl, dateProperties) {
      hideEvents();

      var $events = $(
          '<div id="custom-content-reveal" class="custom-content-reveal"><h4>Events for ' +
            dateProperties.monthname +
            " " +
            dateProperties.day +
            ", " +
            dateProperties.year +
            "</h4></div>"
        ),
        $close = $('<span class="custom-content-close"></span>').on("click", hideEvents);

      $events.append($contentEl.html(), $close).insertAfter($wrapper);

      setTimeout(function () {
        $events.css("top", "0%");
      }, 25);
    }
    function hideEvents() {
      var $events = $("#custom-content-reveal");
      if ($events.length > 0) {
        $events.css("top", "100%");
        Modernizr.csstransitions
          ? $events.on(transEndEventName, function () {
              $(this).remove();
            })
          : $events.remove();
      }
    }
  }
});

/* ================= SCROOL TOP ================= */
$(document).ready(function () {
  $(".backtotop").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      1200,
      "linear"
    );
    return false;
  });
});

/* ================= IE fix ================= */
$(document).ready(function () {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
      for (var i = start || 0, j = this.length; i < j; i++) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }
});

/* ================= START PLACE HOLDER ================= */
$(document).ready(function ($) {
  $("input[placeholder], textarea[placeholder]").placeholder();
});
/* ================= END PLACE HOLDER ================= */

/* =================Twitter============================ */
var load_twitter = function () {
  var linkify = function (text) {
    text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
      return '<a href="' + s + '">' + s + "</a>";
    });
    text = text.replace(/(^|)@(\w+)/gi, function (s) {
      return '<a href="http://twitter.com/' + s + '">' + s + "</a>";
    });
    text = text.replace(/(^|)#(\w+)/gi, function (s) {
      return '<a href="http://search.twitter.com/search?q=' + s.replace(/#/, "%23") + '">' + s + "</a>";
    });
    return text;
  };
  $(".twitter_widget").each(function () {
    var t = $(this);
    var t_date_obj = new Date();
    var t_loading = "Loading tweets.."; //message to display before loading tweets
    var t_container = $("<ul>")
      .addClass("twitter")
      .append("<li>" + t_loading + "</li>");
    t.append(t_container);
    var t_user = t.attr("data-user");
    var t_posts = parseInt(t.attr("data-posts"), 10);
    $.getJSON("php/twitter.php?user=" + t_user, function (t_tweets) {
      t_container.empty();
      for (var i = 0; i < t_posts && i < t_tweets.length; i++) {
        var t_date = Math.floor((t_date_obj.getTime() - Date.parse(t_tweets[i].created_at)) / 1000);
        var t_date_str;
        var t_date_seconds = t_date % 60;
        t_date = Math.floor(t_date / 60);
        var t_date_minutes = t_date % 60;
        if (t_date_minutes) {
          t_date = Math.floor(t_date / 60);
          var t_date_hours = t_date % 60;
          if (t_date_hours) {
            t_date = Math.floor(t_date / 60);
            var t_date_days = t_date % 24;
            if (t_date_days) {
              t_date = Math.floor(t_date / 24);
              var t_date_weeks = t_date % 7;
              if (t_date_weeks) t_date_str = t_date_weeks + " week" + (1 == t_date_weeks ? "" : "s") + " ago";
              else t_date_str = t_date_days + " day" + (1 == t_date_days ? "" : "s") + " ago";
            } else t_date_str = t_date_hours + " hour" + (1 == t_date_hours ? "" : "s") + " ago";
          } else t_date_str = t_date_minutes + " minute" + (1 == t_date_minutes ? "" : "s") + " ago";
        } else t_date_str = t_date_seconds + " second" + (1 == t_date_seconds ? "" : "s") + " ago";
        var t_message = "<li>" + linkify(t_tweets[i].text) + "<span>" + t_date_str + "</span>" + "</li>";
        t_container.append(t_message);
      }
      load_twitter_rotator();
    });
  });
};
var load_twitter_rotator = function () {
  var t_interval = 6000; //time for tweet rotation in miliseconds
  var t_time = 1000; //time for fade effect in miliseconds; NOTE: must be equal or lower then t_interval
  var t_active_class = "active";
  var t_active_selector = "." + t_active_class;
  var t_items = $(".tt_twitter ul li");
  var t_current = 0;
  var t_max = t_items.length;
  var t_height = 0;
  t_items.each(function () {
    t_height = Math.max(t_height, $(this).outerHeight(true));
  });
  $(".tt_twitter").css({ height: t_height });
  t_items.filter(":first").addClass("active").css({ opacity: 1 });
  if (t_max) {
    t_max--;
    setInterval(function () {
      t_items
        .filter(":eq(" + t_current + ")")
        .removeClass(t_active_class)
        .stop()
        .fadeOut("slow", function () {
          t_items
            .filter(":eq(" + t_current + ")")
            .addClass(t_active_class)
            .stop()
            .fadeIn("slow");
        });
      t_current = t_current < t_max ? t_current + 1 : 0;
    }, t_interval);
  }
};
//load modules-------------

jQuery(document).ready(function ($) {
  load_twitter();
  load_carousel();
  load_changer();
  load_blog_masonry();
  load_portfolio_filters();
  // load_portfolio_titles();
  load_team();
});

//==============END TWITTER====================================

//=============Subscription =======================================
function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  } else {
    return false;
  }
}

jQuery("#subscribe").submit(function (event) {
  //preventing from normal submition
  event.preventDefault();
  //validating email
  var sEmail = jQuery("#subscribe .subscribe_line").val();
  if (jQuery.trim(sEmail).length === 0) {
    jQuery(".subscribe_info")
      .html("Email is missing")
      .fadeIn("fast", function () {
        setTimeout(function () {
          $(".subscribe_info").fadeOut("slow");
        }, 3000);
      });
    event.preventDefault(); //stops script execution
    return false;
  }
  //if valid email send info to php
  if (validateEmail(sEmail)) {
    jQuery.post("php/subscribes.php", jQuery("#subscribe").serialize(), function (result) {
      jQuery(".subscribe_info")
        .html(result)
        .fadeIn("fast", function () {
          setTimeout(function () {
            $(".subscribe_info").fadeOut("slow");
          }, 3000);
        });
    });
  } else {
    jQuery(".subscribe_info")
      .html("Invalid Email")
      .fadeIn("fast", function () {
        setTimeout(function () {
          $(".subscribe_info").fadeOut("slow");
        }, 3000);
      });
    event.preventDefault();
    return false;
  }
});

/* ================= CONTACTS FORM ================= */

jQuery(".contact_form").each(function () {
  var t = jQuery(this);
  var t_result = jQuery(".contact_send");
  var t_result_init_val = t_result.val();
  var validate_email = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  t.submit(function (event) {
    //t_result.val('');
    event.preventDefault();
    var t_values = {};
    var t_values_items = t.find("input[name],textarea[name]");
    t_values_items.each(function () {
      t_values[this.name] = jQuery(this).val();
    });
    if (t_values["name"] === "" || t_values["email"] === "" || t_values["message"] === "") {
      t_result.val("Please fill in all the required fields.");
    } else if (!validate_email(t_values["email"])) t_result.val("Please provide a valid e-mail.");
    else
      jQuery.post("php/contacts.php", t.serialize(), function (result) {
        t_result.val(result);
      });
    setTimeout(function () {
      t_result.val(t_result_init_val);
    }, 3000);
  });
});

/* ================= Project FORM ================= */

jQuery(".project_form").each(function () {
  var t = jQuery(this);
  var t_result = jQuery(".project_send");
  var t_result_init_val = t_result.val();
  var validate_email = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  t.submit(function (event) {
    //t_result.val('');
    event.preventDefault();
    var t_values = {};
    var t_values_items = t.find("input[name],textarea[name]");
    t_values_items.each(function () {
      t_values[this.name] = jQuery(this).val();
    });
    if (t_values["name"] === "" || t_values["email"] === "" || t_values["description"] === "") {
      t_result.val("Fill in all fields.");
      setTimeout(function () {
        t_result.val(t_result_init_val);
      }, 3000);
    } else if (!validate_email(t_values["email"])) {
      t_result.val("Please provide a valid e-mail.");
      setTimeout(function () {
        t_result.val(t_result_init_val);
      }, 3000);
    } else {
      t_result.val("Sending project details...");
      jQuery.post("php/project.php", t.serialize(), function (result) {
        t_result.val(result);
        setTimeout(function () {
          t_result.val(t_result_init_val);
        }, 3000);
      });
    }
  });
});

/* ================= CAROUSEL ================= */
var load_carousel = function () {
  $(".slide_content").each(function () {
    var t_time = 500; //time for animation effect
    var t = $(this);
    jQuery.browser = {};
    jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    var t_scroll_width = $.browser.mozilla || $.browser.opera || $.browser.msie ? scrollbarWidth() : 0;
    var t_prev = t.find(".slide_nav_back");
    var t_next = t.find(".slide_nav_next");
    var t_items = t.find(".slide_content_full>div").not(".clear");
    var t_items_n = t_items.length;
    var t_items_container_visible_width;
    var t_items_width;
    var t_visible;
    var t_index;
    var t_index_max;
    var t_prev_function;
    var t_next_function;
    var t_pre_process_specific;
    var t_pre_process = function () {
      t_items.attr("style", "overflow:hidden; padding:5px 0px;");
      t_index = 0;
      t_items_container_visible_width = t.find(".slide_content_show").width();
      t_items_width = t_items.outerWidth(true);
      t_visible = Math.round(t_items_container_visible_width / t_items_width);
      t_index_max = t_items.length - Math.min(t_items.length, t_visible);
      t_pre_process_specific();
    };
    var t_img = t.find("img");
    var t_img_n = t_img.length;
    var t_img_loaded = function () {
      t_prev.click(function (event) {
        t_prev_function();
        if (event.preventDefault !== undefined) event.preventDefault();
        else return false;
      });
      t_next.click(function (event) {
        t_next_function();
        if (event.preventDefault !== undefined) event.preventDefault();
        else return false;
      });
      var t_w = $(window);
      var t_w_x = -1;
      var t_d = $(document);
      var t_w_width_get = function () {
        var t_w_width = t_w.width();
        var t_w_height = t_w.height();
        var t_d_height = t_d.height();
        if (t_w_height < t_d_height) t_w_width += t_scroll_width;
        return t_w_width;
      };
      var t_w_resize_function = function () {
        var t_w_width = t_w_width_get();
        if (t_w_width >= 768) {
          if (t_w_x !== 1) {
            t_w_x = 1;

            t_pre_process_specific = function () {
              if (t_index_max)
                t_items.filter(":gt(" + String(t_visible - 1) + ")").each(function () {
                  var t_items_hidden = $(this);
                  t_items_hidden
                    .css({
                      marginTop: t_items_hidden.height() / 2,
                    })
                    .css({
                      display: "none",
                    });
                });
            };
            t_pre_process();
            t_prev_function = function () {
              if (t_index > 0) {
                t_index--;
                var t_items_current = t_items.filter(":eq(" + t_index + ")");
                t_items_current.stop(true, true).animate(
                  {
                    marginTop: 0,
                    height: "toggle",
                    width: "toggle",
                    marginLeft: "toggle",
                  },
                  {
                    queue: false,
                    duration: t_time,
                    easing: "linear",
                  }
                );
                var t_index_opposite = t_index + t_visible;
                var t_items_copposite = t_items.filter(":eq(" + t_index_opposite + ")");
                t_items_copposite.stop(true, true).animate(
                  {
                    marginTop: t_items_copposite.height() / 2,
                    height: "toggle",
                    width: "toggle",
                    marginLeft: "toggle",
                  },
                  {
                    queue: false,
                    duration: t_time,
                    easing: "linear",
                  }
                );
              }
            };
            t_next_function = function () {
              if (t_index < t_index_max) {
                var t_index_opposite = t_index + t_visible;
                var t_items_copposite = t_items.filter(":eq(" + t_index_opposite + ")");
                t_items_copposite.stop(true, true).animate(
                  {
                    marginTop: 0,
                    height: "toggle",
                    width: "toggle",
                    marginLeft: "toggle",
                  },
                  {
                    queue: false,
                    duration: t_time,
                    easing: "linear",
                  }
                );
                var t_items_current = t_items.filter(":eq(" + t_index + ")");
                t_items_current.stop(true, true).animate(
                  {
                    marginTop: t_items_current.height() / 2,
                    height: "toggle",
                    width: "toggle",
                    marginLeft: "toggle",
                  },
                  {
                    queue: false,
                    duration: t_time,
                    easing: "linear",
                  }
                );
                t_index++;
              }
            };
          }
        } else {
          if (t_w_x !== 2) {
            t_w_x = 2;

            t_pre_process_specific = function () {
              t_visible = 1;
              t_index_max = t_items_n - 1;
              if (t_index_max)
                t_items.filter(":gt(" + String(t_visible - 1) + ")").css({
                  display: "none",
                });
            };
            t_pre_process();
            t_prev_function = function () {
              if (t_index > 0) {
                t_items.filter(":eq(" + t_index + ")").css({
                  display: "none",
                });
                t_index--;
                t_items.filter(":eq(" + t_index + ")").css({
                  display: "block",
                });
              }
            };
            t_next_function = function () {
              if (t_index < t_index_max) {
                t_items.filter(":eq(" + t_index + ")").css({
                  display: "none",
                });
                t_index++;
                t_items.filter(":eq(" + t_index + ")").css({
                  display: "block",
                });
              }
            };
          }
        }
      };
      t_w.resize(t_w_resize_function);
      t_w_resize_function();
    };
    var t_img_ready = [];
    var t_img_ready_complete = false;
    var t_img_ready_all = function () {
      var i = 0;
      for (i = 0; i < t_img_n && (t_img_ready[i] === 1 || t_img[i].complete); i++);
      return i === t_img_n;
    };
    var t_img_ready_check = function () {
      var t_img_ready_complete_temp = t_img_ready_all();
      if (!t_img_ready_complete && t_img_ready_complete_temp) {
        t_img_ready_complete = t_img_ready_complete_temp;
        t_img_loaded();
      }
    };
    t_img.each(function (index) {
      t_img_ready[index] = 0;
    });
    if ($.browser.msie) {
      t_img.each(function () {
        this.src = this.src;
      });
    }
    t_img.load(function (index) {
      t_img_ready[index] = 1;
      t_img_ready_check();
    });
    t_img_ready_check();
    t_prev.mousedown(function () {
      return false;
    });
    t_next.mousedown(function () {
      return false;
    });
  });
};
function scrollbarWidth() {
  var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
  // Append our div, do our calculation and then remove it
  $("body").append(div);
  var w1 = $("div", div).innerWidth();
  div.css("overflow-y", "scroll");
  var w2 = $("div", div).innerWidth();
  $(div).remove();
  return w1 - w2;
}

/* ================= START SLIDER ================= */
var t_browser_has_css3;
var t_css3_array = ["transition", "-webkit-transition", "-moz-transition", "-o-transition", "-ms-transition"];
var t_css3_index;
$(document).ready(function () {
  var t_css3_test = $("body");
  for (
    t_css3_index = 0, t_css3_test.css(t_css3_array[t_css3_index], "");
    t_css3_index < t_css3_array.length && null == t_css3_test.css(t_css3_array[t_css3_index]);
    t_css3_test.css(t_css3_array[++t_css3_index], "")
  );
  if (t_css3_index < t_css3_array.length) t_browser_has_css3 = true;
  else t_browser_has_css3 = false;
  load_main_slider();
});

var load_main_slider = function () {
  $(".rs_mainslider").each(function () {
    var t_time = 1000; //time for transition animation
    var t_interval_time = 6000; //time for slide change, must be equal or bigger then effect transition time;
    var t_resume_time = 10000; //time to resume autoplay after a click
    var t_hover_time = 200; //time for hover eefect
    var t_text_time = 500; //time for text animation
    var t = $(this);
    var t_prev = t.find(".rs_mainslider_left");
    var t_next = t.find(".rs_mainslider_right");
    var t_items_container = t.find("ul.rs_mainslider_items");
    var t_items = t_items_container.find("li");
    var t_dots_container = t.find(".rs_mainslider_dots_container ul.rs_mainslider_dots");
    var t_dots;
    var t_items_active_class = "rs_mainslider_items_active";
    var t_items_active_selector = "." + t_items_active_class;
    var t_dots_active_class = "rs_mainslider_dots_active";
    var t_dots_active_selector = "." + t_dots_active_class;
    var t_index = 0;
    var t_index_max = t_items.length - 1;
    var t_select_fix = function () {
      return false;
    };
    var t_interval = 0;
    var t_timeout = 0;
    var t_autoplay_start = function () {
      t_interval = setInterval(t_next_function, t_interval_time);
    };
    var t_autoplay_stop = function () {
      clearInterval(t_interval);
      clearTimeout(t_timeout);
      t_timeout = setTimeout(t_autoplay_start, t_resume_time);
    };
    var t_text = t.find("ul.rs_mainslider_items li .rs_mainslider_items_text");
    var t_text_top = t_text.css("top");
    var t_text_last;
    var t_next_function = function () {
      var t_text_old = t_text.filter(":eq(" + t_index + ")");
      t_index++;
      if (t_index > t_index_max) t_index = 0;
      var t_text_current = t_text.filter(":eq(" + t_index + ")");
      if (t_text_last !== undefined) t_text_last.stop(true).css({ top: -t_text_last.height() });
      t_text_last = t_text_old;
      t_text_old.stop(true).animate(
        { top: "100%" },
        {
          queue: false,
          duration: t_text_time,
          easing: "easeInBack",
          complete: function () {
            t_text_current.stop(true).animate({ top: t_text_top }, { queue: false, duration: t_text_time, times: 1, easing: "easeOutBack" });
          },
        }
      );
      t_items_container.css({ height: t_items.filter(t_items_active_selector).outerHeight(true) });
      t_items
        .filter(t_items_active_selector)
        .removeClass(t_items_active_class)
        .children(".rs_mainslider_items_image")
        .stop(true)
        .animate({ opacity: 0 }, { queue: false, duration: t_time, easing: "linear" });
      t_dots.filter(t_dots_active_selector).removeClass(t_dots_active_class);
      t_items
        .filter(":eq(" + t_index + ")")
        .addClass(t_items_active_class)
        .children(".rs_mainslider_items_image")
        .stop(true)
        .animate({ opacity: 1 }, { queue: false, duration: t_time, easing: "linear" });
      t_dots.filter(":eq(" + t_index + ")").addClass(t_dots_active_class);
      t_items_container.css({ height: "auto" });
    };
    var t_items_count = t_items.length;
    t_text.each(function (i) {
      $(this).css({ top: "-100%" });
    });
    t_items.each(function () {
      var x = $(this);
      var x_img = x.children(".rs_mainslider_items_image");
      var x_text = x.children(".rs_mainslider_items_text");
      x_img.each(function () {
        var t_this = this;
        var t_loaded_function = function () {
          x_text.css({ top: -$(t_this).height() });
          t_items_count--;
          if (t_items_count === 0) {
            t_text
              .filter(":eq(" + t_index + ")")
              .stop(true)
              .animate({ top: t_text_top }, { queue: false, duration: t_text_time, easing: "easeOutBack" });
            for (i = 0; i <= t_index_max; i++)
              t_dots_container.append("<li" + (t_index === i ? ' class="' + t_dots_active_class + '"' : "") + "></li>");
            t_dots = t_dots_container.children("li");
            t_items
              .filter(":eq(" + t_index + ")")
              .addClass(t_items_active_class)
              .children(".rs_mainslider_items_image")
              .stop(true)
              .animate({ opacity: 1 }, { queue: false, duration: t_time, easing: "linear" });
            t_dots.filter(":eq(" + t_index + ")").addClass(t_dots_active_class);
            t_prev.click(function () {
              var t_text_old = t_text.filter(":eq(" + t_index + ")");
              t_index--;
              if (t_index < 0) t_index = t_index_max;
              var t_text_current = t_text.filter(":eq(" + t_index + ")");
              if (t_text_last !== undefined) t_text_last.stop(true).css({ top: -t_text_last.height() });
              t_text_last = t_text_old;
              t_text_old
                .stop(true)
                .css({ top: t_text_top })
                .animate(
                  { top: "100%" },
                  {
                    queue: false,
                    duration: t_text_time,
                    easing: "easeInBack",
                    complete: function () {
                      t_text_current
                        .stop(true)
                        .animate({ top: t_text_top }, { queue: false, duration: t_text_time, times: 1, easing: "easeOutBack" });
                    },
                  }
                );
              t_items_container.css({ height: t_items.filter(t_items_active_selector).outerHeight(true) });
              t_items
                .filter(t_items_active_selector)
                .removeClass(t_items_active_class)
                .children(".rs_mainslider_items_image")
                .stop(true)
                .animate({ opacity: 0 }, { queue: false, duration: t_time, easing: "linear" });
              t_dots.filter(t_dots_active_selector).removeClass(t_dots_active_class);
              t_items
                .filter(":eq(" + t_index + ")")
                .addClass(t_items_active_class)
                .children(".rs_mainslider_items_image")
                .stop(true)
                .animate({ opacity: 1 }, { queue: false, duration: t_time, easing: "linear" });
              t_dots.filter(":eq(" + t_index + ")").addClass(t_dots_active_class);
              t_items_container.css({ height: "auto" });
              t_autoplay_stop();
            });
            t_next.click(function () {
              t_next_function();
              t_autoplay_stop();
            });
            t_dots.click(function () {
              var t_dots_current = t_dots.filter(t_dots_active_selector).not(this);
              if (t_dots_current.length) {
                var t_text_old = t_text.filter(":eq(" + t_index + ")");
                t_index = t_dots.index(this);
                var t_text_current = t_text.filter(":eq(" + t_index + ")");
                if (t_text_last !== undefined) t_text_last.stop(true).css({ top: -t_text_last.height() });
                t_text_last = t_text_old;
                t_text_old
                  .stop(true)
                  .css({ top: t_text_top })
                  .animate(
                    { top: "100%" },
                    {
                      queue: false,
                      duration: t_text_time,
                      easing: "easeInBack",
                      complete: function () {
                        t_text_current
                          .stop(true)
                          .animate({ top: t_text_top }, { queue: false, duration: t_text_time, times: 1, easing: "easeOutBack" });
                      },
                    }
                  );
                t_items_container.css({ height: t_items.filter(t_items_active_selector).outerHeight(true) });
                t_items
                  .filter(t_items_active_selector)
                  .removeClass(t_items_active_class)
                  .children(".rs_mainslider_items_image")
                  .stop(true)
                  .animate({ opacity: 0 }, { queue: false, duration: t_time, easing: "linear" });
                t_dots_current.filter(t_dots_active_selector).removeClass(t_dots_active_class);
                t_items
                  .filter(":eq(" + t_index + ")")
                  .addClass(t_items_active_class)
                  .children(".rs_mainslider_items_image")
                  .stop(true)
                  .animate({ opacity: 1 }, { queue: false, duration: t_time, easing: "linear" });
                t_dots.filter(":eq(" + t_index + ")").addClass(t_dots_active_class);
                t_items_container.css({ height: "auto" });
              }
              t_autoplay_stop();
            });
            t.hover(
              function () {
                t_prev.stop(true).animate({ opacity: 1 }, { queue: false, duration: t_hover_time, easing: "linear" });
                t_next.stop(true).animate({ opacity: 1 }, { queue: false, duration: t_hover_time, easing: "linear" });
              },
              function () {
                t_prev.stop(true).animate({ opacity: 0 }, { queue: false, duration: t_hover_time, easing: "linear" });
                t_next.stop(true).animate({ opacity: 0 }, { queue: false, duration: t_hover_time, easing: "linear" });
              }
            );
            t_prev.mousedown(t_select_fix);
            t_next.mousedown(t_select_fix);
            t_dots.mousedown(t_select_fix);
            t_autoplay_start();
          }
        };
        var t_loaded_ready = false;
        var t_loaded_check = function () {
          if (!t_loaded_ready) {
            t_loaded_ready = true;
            t_loaded_function();
          }
        };
        var t_loaded_status = function () {
          if (t_this.complete) t_loaded_check();
        };
        $(this).load(function () {
          t_loaded_check();
        });
        t_loaded_status();
        if ($.browser.msie) this.src = this.src;
      });
    });
  });
};

/* ================= END SLIDER ================= */

var load_changer = function () {
  var t_body = $("body");
  var t_div = $(".boxed_fluid");
  var t_transition_time = 0;
  var t_transition_apply = function () {
    clearTimeout(t_transition_time);
    t_body.addClass("animated_change");
    t_transition_time = setTimeout(t_transition_end, 1500);
  };
  var t_transition_end = function () {
    t_body.removeClass("animated_change");
  };
  var t_color = $('select[name="site_color"]');
  var t_layout = $('select[name="site_layout"]');
  t_color.change(function () {
    var t = $(this);
    if (t.val() !== t.data("color")) {
      t_transition_apply();
      switch (t.val()) {
        case "dark":
          t_div.addClass("black_version");
          break;
        case "light":
          t_div.removeClass("black_version");
          break;
        default:
          break;
      }
      t.data("color", t.val());
    }
  });
  t_layout.change(function () {
    var t = $(this);
    if (t.val() !== t.data("layout")) {
      t_transition_apply();
      switch (t.val()) {
        case "boxed":
          t_body.addClass("boxed");
          break;
        case "wide":
          t_body.removeClass("boxed");
          break;
        default:
          break;
      }
      t.data("layout", t.val());
    }
  });
  $("#background_patterns>li").click(function () {
    if ("boxed" !== t_layout.data("layout")) {
      t_layout.val("boxed");
      t_transition_apply();
      t_body.addClass("boxed");
      t_layout.data("layout", "boxed");
    }
    t_body.css({ backgroundImage: "url(" + $(this).children("img").attr("src") + ")", backgroundRepeat: "repeat" });
  });
  $("#background_images>li").click(function () {
    if ("boxed" !== t_layout.data("layout")) {
      t_layout.val("boxed");
      t_transition_apply();
      t_body.addClass("boxed");
      t_layout.data("layout", "boxed");
    }
    t_body.css({ backgroundImage: "url(" + $(this).children("img").attr("src") + ")", backgroundRepeat: "no-repeat" });
  });
  var t_box = $(".color_scheme");
  var t_box_width = t_box.outerWidth();
  $(".color_scheme_settings").click(function () {
    if (t_box.data("visible")) {
      t_box.css({ left: -t_box_width });
      t_box.data("visible", false);
    } else {
      t_box.css({ left: 0 });
      t_box.data("visible", true);
    }
  });
};

var load_blog_masonry = function () {
  if (!$(".blog_m").length) return;
  imagesLoaded(".blog_m>.row", function () {
    var blog_container = $(".blog_m>.row")[0];
    var blog_msnry = new Masonry(blog_container);
  });
};

var load_portfolio_filters = function () {
  $(".portfolio, .events").each(function () {
    var t_container = $(this);
    if (t_container.children(".filter").length) {
      imagesLoaded(t_container[0], function () {
        t_container.find(".filter+.row").children().addClass("active");
        var portfolio_container = t_container.find(".filter+.row")[0];
        var portfolio_msnry = new Masonry(portfolio_container, {
          itemSelector: ".active",
          hiddenStyle: { opacity: 0, transform: "scale(0.001)", top: 0, left: 0 },
        });
        var portfolio_animated_height = function () {
          t_container.find(".filter+.row").addClass("animated_height");
          portfolio_msnry.off("layoutComplete", portfolio_animated_height);
        };
        portfolio_msnry.on("layoutComplete", portfolio_animated_height);
        portfolio_msnry.layout();
        var filters = t_container.find(".filter>li>a");
        var items = t_container.find(".filter+.row").children();
        var get_active_items = function () {
          var a = undefined;
          if (filters.eq(0).hasClass("active")) {
            a = items;
          } else {
            a = $([]);
            filters.filter(".active").each(function () {
              var category = $(this).attr("data-category");
              a = a.add(items.filter("." + category));
            });
          }
          return a;
        };
        var visible_last = undefined;
        filters.click(function (e) {
          console.log();
          if (e.preventDefault) e.preventDefault();
          var index = filters.index(this);
          var t = $(this);
          if (index) {
            filters.eq(0).removeClass("active");
            if (t.hasClass("active")) {
              t.removeClass("active");
              if (!filters.filter(".active").length) {
                filters.eq(0).addClass("active");
              }
            } else {
              t.addClass("active");
            }
          } else {
            filters.filter(":gt(0)").removeClass("active");
            t.addClass("active");
          }

          var visible = get_active_items();
          visible.css({ display: "" }).addClass("active");

          items.not(visible).removeClass("active");
          portfolio_msnry.hide(portfolio_msnry.getItems(items.not(visible)));

          portfolio_msnry.reloadItems();

          if (undefined !== visible_last) {
            portfolio_msnry.reveal(portfolio_msnry.getItems(visible.not(visible_last)));
          }
          visible_last = visible;

          portfolio_msnry.layout();
          return false;
        });
      });
    }
  });
};

// var load_portfolio_titles = function () {
//   $(".portfolio_item>.item_hover").each(function () {
//     var t = $(this);
//     t.append(
//       $("<div/>")
//         .addClass("item_hover_wrapper")
//         .css({
//           top: "10px",
//           position: "relative",
//           background: "#ef3734",
//           maxHeight: "51px",
//           boxShadow: "2px 2px #451c0a",
//         })
//         .height(t.height())
//         .append(t.children().remove())
//     ).addClass("item_hover_full");
//   });
// };

var load_team = function () {
  if (!$(".our_team").length) return;
  $(".all_team>.row>div>a").click(function (e) {
    if (e.preventDefault) e.preventDefault();
    var t_single = $(".single_team");
    t_single.children().remove();
    t_single.append($(this).parent().children(".row").clone());
    return false;
  });
};

/* ================= CONTACTS FORM ================= */

jQuery(".contact_form").each(function () {
  var t = jQuery(this);
  var t_result = jQuery(".contact_button");
  var t_result_init_val = t_result.val();
  var validate_email = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  t.submit(function (event) {
    //t_result.val('');
    event.preventDefault();
    var t_values = {};
    var t_values_items = t.find("input[name],textarea[name]");
    t_values_items.each(function () {
      t_values[this.name] = jQuery(this).val();
    });
    if (t_values["name"] === "" || t_values["email"] === "" || t_values["message"] === "") {
      t_result.val("Please fill in all the required fields.");
    } else if (!validate_email(t_values["email"])) t_result.val("Please provide a valid e-mail.");
    else
      jQuery.post("php/contacts.php", t.serialize(), function (result) {
        t_result.val(result);
      });
    setTimeout(function () {
      t_result.val(t_result_init_val);
    }, 3000);
  });
});

/* ================= Project FORM ================= */

jQuery(".project_form").each(function () {
  var t = jQuery(this);
  var t_result = jQuery(".input_button");
  var t_result_init_val = t_result.val();
  var validate_email = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  t.submit(function (event) {
    //t_result.val('');
    event.preventDefault();
    var t_values = {};
    var t_values_items = t.find("input[name],textarea[name]");
    t_values_items.each(function () {
      t_values[this.name] = jQuery(this).val();
    });
    if (t_values.name === "" || t_values.email === "" || t_values.description === "") {
      t_result.val("Fill in all fields.");
      setTimeout(function () {
        t_result.val(t_result_init_val);
      }, 3000);
    } else if (!validate_email(t_values.email)) {
      t_result.val("Please provide a valid e-mail.");
      setTimeout(function () {
        t_result.val(t_result_init_val);
      }, 3000);
    } else {
      t_result.val("Sending project details...");
      jQuery.post(TemplateDir + "/php/project.php", t.serialize(), function (result) {
        t_result.val(result);
        setTimeout(function () {
          t_result.val(t_result_init_val);
        }, 3000);
      });
    }
  });
});

/* AS JavaScript [START] */
$Electra = Object();

// Email object
$Electra.email = Object();

// Forms
$Electra.form = Object();
$Electra.form.errorClass = "s_error";

$Electra.form.subscribe = Object();
$Electra.form.subscribe.id = "#newsletter";

jQuery(document).ready(function ($) {
  /* COUNTDOWN */
  var cd_duedate = $("#electra_countdown").attr("data-duedate");
  var cd_start = new Date($("#electra_countdown").attr("data-startdate")).getTime();
  var cd_end = new Date(cd_duedate).getTime();
  $Electra.countdown = jQuery().countdown
    ? $("#electra_countdown").countdown(cd_duedate, function (event) {
        var $this = $(this);
        // Total days
        var days = Math.round(Math.abs(cd_start - cd_end) / (24 * 60 * 60 * 1000));
        var divider = {
          seconds: 60,
          minutes: 60,
          hours: 24,
        };
        var progress = null;
        switch (event.type) {
          case "seconds":
          case "minutes":
          case "hours":
          case "days":
          case "weeks":
          case "daysLeft":
            $this.find("b#" + event.type).html(event.value);
            if (event.type === "days") {
              progress = ((days - event.value) * 100) / days;
            } else {
              progress = (100 / divider[event.type]) * (divider[event.type] - event.value);
            }
            $this.find(".countdown_progress." + event.type + " .filled").css("width", progress + "%");
            break;
          case "finished":
            $this.hide();
            break;
        }
      })
    : null;

  /* GALLERY IMAGE ZOOM */
  $Electra.swipebox = jQuery().swipebox ? $(".swipebox").swipebox() : null;

  /* SUBSCRIBE FORM */
  $($Electra.form.subscribe.id).on("submit", function (e) {
    e.preventDefault();
    var form = $(this);
    var input = form.find("input");
    var input_ph = $(input).attr("placeholder");
    if ($Electra.form.validate(form)) {
      $.post("php/subscribe.php", form.serialize(), function (result) {
        console.log(result);
        $(input).attr("placeholder", "Subscribed");
        $(input).val("");
      });
    } else {
      setTimeout(function () {
        $(input).removeClass($Electra.form.errorClass);
      }, 800);
    }
    return false;
  });
});

/*  EMAIL VALIDATION FUNCTION */
$Electra.email.validate = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
/* --------------------------- */

/*  FORM ELEMENT VALIDATION FUNCTION */
$Electra.form.validate = function validate(form) {
  var valid = true;
  $.each(form.find(':input:not(:input[type="submit"])'), function (index, input) {
    var val = $(input).val();
    if ($.trim(val) === "") {
      $Electra.form.inputError(input);
      valid = false;
      return false;
    }
    if ($(input).attr("name") === "email") {
      if (!$Electra.email.validate(val)) {
        $Electra.form.inputError(input);
        valid = false;
        return false;
      }
    }
  });
  return valid;
};

/* TOGGLE INPUT ERROR CLASS */
$Electra.form.inputError = function inputError(input) {
  if (!$(input).hasClass($Electra.form.errorClass)) $(input).addClass($Electra.form.errorClass);
  $(input).focus();
};
/* AS JavaScript [END] */
