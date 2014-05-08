/*
===============================
INITIALIZATION
===============================
*/

$(function() {

  var scrollTimer;

  function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
      var k = n + Math.floor(Math.random() * (sourceArray.length - n));
      var temp = sourceArray[k];

      sourceArray[k] = sourceArray[n];
      sourceArray[n] = temp;
    }
    return sourceArray;
  }

  function createGallery() {
    var $gallery = $('.gallery');

    var markup = "<li>&nbsp;</li>";
    var urlArray = [];

    for (i=0; i<25; i++) {
      urlArray.push('img/gallery/' + (i + 1) + '-comp.jpg');
      $gallery.append(markup);
    }

    var shuffledUrlArray = shuffle(urlArray);

    $.each($('.gallery > li'), function(k,v) {
      $(v).css({
        'background-image': 'url("' + shuffledUrlArray[k] + '")',
      });
    });
  }

  function updateGallery() {
    $.each($('.gallery > li'), function(k,v) {
      var $self = $(v);

      var width = $self.outerWidth();

      $self.css({ height: Math.ceil(width * 0.75) + 'px' });
    });
  }

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

      if ($section.attr('id') == 'two') {
        sectionStart -= $('.nav').outerHeight();
      }

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

    if (currentPosition >= $('#two').offset().top - $('.nav').outerHeight()) {
      $('.hidden-cta').addClass('visible');
    }
    else {
      $('.hidden-cta').removeClass('visible');
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
    if (!Modernizr.touch) {
      $('.splash').imageScroll({
        container: $('.main')
      });
    }
    else {
      $('body').addClass('device');

      $.each($('.splash'), function(k,v) {
        var $self = $(v);

        var mobileImgUrl = $self.attr('data-image-mobile');

        $self.css({
          'background': 'url("' + mobileImgUrl + '") center center',
          'background-size': 'cover' 
        });

        function resizeIntro() {
          $('#one .splash').css({
            height: $(window).height() + 'px'
          });
        }

        $(window).resize(function() {
          resizeIntro();
        });

        resizeIntro();
      });
    }

    setTimeout(function() {
      if (!$('body').hasClass('device')) {
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
      }
      else {
        var $formWrapper = $('.form-wrapper');
        var $form = $('.form');
        var $headerFonts = $form.find('.tk-modesto-text');

        function clipBody(ref) {
          $('html, body').css({
            height: ref.outerHeight() + 'px',
            overflow: 'hidden'
          });
        }
        function openDeviceForm() {
          clipBody($(window));

          $headerFonts.addClass('tk-modesto');
          $form.addClass('visible');
          $formWrapper.addClass('open-device');

          $(window).resize(function() {
            clipBody($(window));
          });
        }
        function closeDeviceForm() {
          $form.removeClass('visible');
          setTimeout(function() {
            $formWrapper.removeClass('open-device');
          }, 300);
          $headerFonts.removeClass('tk-modesto');
          $('html, body').css({
            height: '',
            overflow: ''
          })
        }

        $('.form-open-button').on('click', function(e) {
          openDeviceForm();

          e.preventDefault();
          e.stopPropagation();
        });
        $('.form .close').on('click', function(e) {
          closeDeviceForm();

          e.preventDefault();
          e.stopPropagation();
        });
        $('.open-device input').on('focus', function() {
          clipBody($('.form.open-device'));
        });
      }
    }, 500);

    updateNav();
    createGallery();
    updateGallery();
    alignSplashContent();
  });

  $(window).resize(function() {
    alignSplashContent();
    updateGallery();
  });

  $(window).scroll(function() {
    updateNav();
  });


  $('.nav-link').on('click', function(e) {
    var $self = $(this);
    var $parent = $(this).parent();
    var sectionId = $self.attr('data-section-id');
    var scrollPosition = $('#' + sectionId).offset().top;

    if (sectionId == 'two') {
      scrollPosition -= $('.nav').outerHeight();
    }

    scrollTimer = null;

    $('html, body').stop(true, true).animate({ scrollTop: scrollPosition }, 1000, 'easeInOutCubic');

    if (!$('body').hasClass('device')) {
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
    }
    

    e.preventDefault();
    e.stopPropagation();
  });

});