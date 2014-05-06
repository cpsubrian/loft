/*
===============================
INITIALIZATION
===============================
*/

$(function() {

  var scrollTimer;

  function alignSplashContent() {
    $.each($('.splash-content'), function(k,v) {
      var $self = $(this);
      var $parent = $self.parents('.imageHolder');

      var parentWidth = $parent.outerWidth();
      var visibilityValue = $parent.css('visibility');
      var translateValue = $parent.css('-webkit-transform');
      var leftTranslate = 0;

      if (visibilityValue == 'visible') {
        leftTranslate = translateValue.split(',')[4] * -1;
      }

      $self.css({ 
        width: (parentWidth - (leftTranslate * 2)) + 'px',
        left: leftTranslate + 'px' 
      });
    });
  }

  function updateNav() {
    var currentPosition = $(window).scrollTop();
    var taglineCutoff = $('.tagline').position().top + $('.tagline').outerHeight();

    $.each($('.nav-link'), function(k,v) {
      var $self = $(v);
      var $parent = $self.parent();
      var $section = $('#' + $self.attr('data-section-id'));

      var sectionStart = $section.offset().top;
      var sectionEnd = sectionStart + $section.outerHeight();

      if (!$section.next().length && currentPosition == ($('body').outerHeight() - $(window).height()) && ($(window).height() - $section.outerHeight()) < 200) {
        $('.nav-item.active').removeClass('active');
        $parent.addClass('active');
      }
      else if (sectionStart <= currentPosition && sectionEnd > currentPosition) {
        if (!$parent.hasClass('contact')) {
          $parent.addClass('active');
        }
      }
      else {
        $parent.removeClass('active');
      }
    });

    if (currentPosition > taglineCutoff) {
      $('.nav-wrapper').addClass('visible')
    }
    else {
      $('.nav-wrapper').removeClass('visible');
    }

    closeForm();
    alignSplashContent();
  }

  function openForm() {
    if (!$('.form').hasClass('open')) {
      $('.tagline').addClass('hidden');

      setTimeout(function() {
        $('.tagline').addClass('small');
        $('.tagline').removeClass('hidden');
      }, 300);

      $('.hidden-fields').stop().slideDown(500, 'easeInOutCirc', function() {
        $('.form .close').fadeIn(500);
      });

      $('.form').addClass('open');
    }
  }

  function closeForm() {
    if ($('.form').hasClass('open')) {
      $('.tagline').addClass('hidden');
    
      setTimeout(function() {
        $('.tagline').removeClass('small');
        $('.tagline').removeClass('hidden');
      }, 500);

      $('.form .close').fadeOut(150, function() {
        $('.hidden-fields').stop().slideUp(500, 'easeInOutCirc');
      });

      $('.form').removeClass('open');
    }
  }

  
  $(document).ready(function() {
    $('.splash').imageScroll({
      container: $('.main')
    });

    setTimeout(function() {
      $('.initial-fields .field').on('click', function() {
        openForm();
      });

      $('html, body').on('click', function(e) {
        var $target = $(e.target);

        if ($target.parents('.form-wrapper').length == 0) {
          closeForm();
        }
      });

      $('.form .close').on('click', function() {
        closeForm();
      });
    }, 500);

    updateNav();
    alignSplashContent();
  });

  $(window).resize(function() {
    alignSplashContent();
  });

  $(window).scroll(function() {
    updateNav();
  });


  $('.nav-link').on('click', function(e) {
    var $self = $(this);
    var $parent = $(this).parent();
    var sectionId = $self.attr('data-section-id');
    var scrollPosition = $('#' + sectionId).offset().top;

    scrollTimer = null;

    $('html, body').stop(true, true).animate({ scrollTop: scrollPosition }, 1000, 'easeInOutCubic');

    $(window).scroll(function() {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(function() {
        if ($parent.hasClass('contact')) {
          openForm();
        }
      }, 350);
    });

    if ($parent.hasClass('contact') && $(window).scrollTop() == 0) {
      openForm();
    }

    e.preventDefault();
    e.stopPropagation();
  });

});