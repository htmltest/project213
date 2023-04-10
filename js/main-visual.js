$(document).ready(function() {

    if ($('.main').length > 0) {
        $('footer').addClass('with-main');
    }

    $('.gallery').each(function() {
        var curGallery = $(this);
        curGallery.on('init', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
        var options = {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            adaptiveHeight: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        fade: false,
                        dots: false
                    }
                }
            ]
        };
        curGallery.slick(
            options
        ).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            var curSlide = curGallery.find('.slick-slide:not(.slick-cloned)').eq(nextSlide);
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
    });

    $('.nav-add-link').click(function(e) {
        if ($('header').hasClass('fixed')) {
            $('.nav').addClass('fixed');
        } else {
            $('.nav').removeClass('fixed');
        }

        var curScroll = $(window).scrollTop();
        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);

        $('html').addClass('nav-add-open');

        e.preventDefault();
    });

    $('.nav-add-close a').click(function(e) {
        $('html').removeClass('nav-add-open');
        $('.nav').removeClass('fixed');

        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));

        e.preventDefault();
    });

    $('.nav .nav-add-item-title').each(function() {
        var curItem = $(this);
        var curGroup = curItem.parent();
        if (curGroup.find('.nav-add-item-list').length == 1) {
            curItem.append('<span class="nav-add-item-title-mobile-link"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#nav-add-item-title-mobile-link"></use></svg></span>');
        }
    });

    $('body').on('click', '.nav-add-item-title-mobile-link', function() {
        var curGroup = $(this).parent().parent();
        if (curGroup.hasClass('open')) {
            curGroup.removeClass('open');
            $('html').removeClass('nav-add-sub-open');
        } else {
            curGroup.addClass('open');
            $('html').addClass('nav-add-sub-open');
        }

    });

    $('.nav .nav-add-item-list > ul > li').each(function() {
        var curGroup = $(this);
        if (curGroup.find('ul').length == 1) {
            curGroup.append('<span class="nav-add-item-sub-mobile-link"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#nav-add-item-title-mobile-link"></use></svg></span>');
        }
    });

    $('body').on('click', '.nav-add-item-sub-mobile-link', function() {
        var curGroup = $(this).parent();
        if (curGroup.hasClass('open')) {
            curGroup.removeClass('open');
            $('html').removeClass('nav-add-subsub-open');
        } else {
            curGroup.addClass('open');
            $('html').addClass('nav-add-subsub-open');
        }

    });

    $('.page-menu').each(function() {
        $('.page-menu-inner').append('<ul></ul>');
        $('.page-section-item').each(function() {
            var curItem = $(this);
            $('.page-menu-inner ul').append('<li><a href="#' + curItem.attr('id') + '">' + curItem.data('title') + '</a></li>');
        });
    });

    $('body').on('click', '.page-menu ul li a', function(e) {
        var curBlock = $($(this).attr('href'));
        if (curBlock.length > 0) {
            if (curBlock.parents().filter('.product-info-content').length == 1 && !curBlock.parents().filter('.product-info-content').hasClass('active')) {
                var curIndex = curBlock.parents().filter('.product-info-container').find('.product-info-content').index(curBlock.parents().filter('.product-info-content'));
                curBlock.parents().filter('.product-info').find('.product-info-menu li').eq(curIndex).find('a').trigger('click');
            }
            $('html, body').animate({'scrollTop': curBlock.offset().top - 75});
        }
        e.preventDefault();
    });

    $('.main-events-list').slick({
        infinite: true,
        variableWidth: true,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
        autoplay: true,
        autoplaySpeed: 15000,
        dots: true,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });
    $('.main-events-list').on('setPosition', function(event, slick) {
        if ($('.main-events-item.active').length > 0) {
            $('.main-events-list').slick('slickSetOption', 'autoplaySpeed', 9999999);
        }

    });

    $('.main-events-list').on('beforeChange', function(event, slick, currentSlide) {
        if ($(window).width() < 1200) {
            $('.main-events-item.active').removeClass('active');
            $('.main-events-form').html('').hide();
        }
    });

    $('body').on('click', '.main-events-item-inner', function(e) {
        var curLink = $(this);
        if (typeof ($(this).attr('data-href')) != 'undefined') {
            $('.main-events-list').slick('slickSetOption', 'autoplaySpeed', 9999999);
            if ($('.main-events-form').length > 0) {
                var curItem = curLink.parent();
                if (curItem.hasClass('active')) {
                    $('.main-events-form').html('').hide();
                    curItem.removeClass('active')
                } else {
                    $('.main-events-item.active').removeClass('active');
                    $('.main-events-form').html('<div class="loading"></div>').show();
                    curItem.addClass('active')
                    $.ajax({
                        type: 'POST',
                        url: curLink.attr('data-href'),
                        dataType: 'html',
                        cache: false
                    }).done(function(html) {
                        $('.main-events-form').html('<div class="container">' + html + '</div>');
                        initForm($('.main-events-form form'));
                        updatePrecalc($('.main-events-form form'));
                        $('#order-programm-select').each(function() {
                            var curValue = $(this).val();
                            $('.order-programm-detail').hide();
                            var curProgramm = $('.order-programm-detail[data-id="' + curValue + '"]');
                            curProgramm.show();
                        });
                        initVZR();
                    });
                }
                e.preventDefault();
            }
        }
    });

    $('.main-up').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.cookies-message-close').click(function(e) {
        $('.cookies-message').remove();
        e.preventDefault();
    });

    $('.psb-message-close').click(function(e) {
        $('.psb-message').remove();
        e.preventDefault();
    });

    $('.block-bg-docs-title span').click(function() {
        $(this).parents().filter('.block-bg-docs').toggleClass('open').find('.block-bg-docs-content').slideToggle();
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('window-add')) {
            windowOpen(curLink.attr('href'));
        } else {
            curLinkWindowAdd = curLink;
            windowOpen(curLink.attr('href'), true);
        }
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('.contacts-menu a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.contacts-menu li.active').removeClass();
            curLi.addClass('active');
            var curIndex = $('.contacts-menu li').index(curLi);
            $('.contacts-tab.active').removeClass('active');
            $('.contacts-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.vacancy-title', function(e) {
        var curItem = $(this).parent().filter('.vacancy');
        curItem.toggleClass('open');
        curItem.find('.vacancy-content').slideToggle();
        e.preventDefault();
    });

    $('body').on('click', '.vacancy-content-hide', function(e) {
        var curItem = $(this).parents().filter('.vacancy');
        curItem.toggleClass('open');
        curItem.find('.vacancy-content').slideToggle();
        e.preventDefault();
    });

    $('.main-insurance-event-mobile-btn-more-link a').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    $('.polis-price-list').each(function() {
        var countItems = $(this).find('.polis-price-item').length;
        $(this).addClass('polis-price-list-' + countItems);
    });

    $('.to-link').each(function() {
        var curItem = $(this);
        curItem.replaceWith('<a href="' + curItem.attr('data-href') + '" target="_blank">' + curItem.html() + '</a>');
    });

    $('.form-input .desktop-menu-icon').each(function() {
        $(this).parent().addClass('form-input-with-hint');
    });

    $('.form-select .desktop-menu-icon').each(function() {
        $(this).parent().addClass('form-select-with-hint');
    });

    $('body').on('mouseover', '.desktop-menu-icon', function() {
        var curHint = $(this);
        curHint.removeClass('to-left to-right');
        if (curHint.find('.desktop-menu-icon-text').offset().left + curHint.find('.desktop-menu-icon-text').outerWidth() > $(window).width()) {
            curHint.addClass('to-left');
        }
        if (curHint.find('.desktop-menu-icon-text').offset().left < 0) {
            curHint.addClass('to-right');
        }
    });

    $('body').on('click', '.text-with-hint-link', function(e) {
        var curBlock = $(this).parent();
        if (curBlock.hasClass('open')) {
            curBlock.removeClass('open');
        } else {
            $('.text-with-hint.open').removeClass('open');
            curBlock.removeClass('to-right');
            curBlock.addClass('open');
            var curPopup = curBlock.find('.text-with-hint-popup');
            if (curPopup.offset().left + curPopup.outerWidth() > $(window).width()) {
                curBlock.addClass('to-right');
            }
        }
        e.preventDefault();
    });

    $('body').on('click', '.text-with-hint-popup-close', function(e) {
        $('.text-with-hint.open').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.text-with-hint').length == 0) {
            $('.text-with-hint.open').removeClass('open');
        }
    });

    $('.product-info-menu ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.product-info-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.product-info-menu ul li').index(curLi);
            $('.product-info-content.active').removeClass('active');
            $('.product-info-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.news-header-select-current', function() {
        var curSelect = $(this).parent();
        if (curSelect.hasClass('open')) {
            curSelect.removeClass('open');
        } else {
            curSelect.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.news-header-select').length == 0) {
            $('.news-header-select').removeClass('open');
        }
    });

    $('body').on('change', '.news-header-select-list input', function() {
        $('.news-header-select-current span').html($('.news-header-select-list input:checked').parent().find('span').html());
        $('.news-header-select').removeClass('open');
    });

    $('.footer-menu-mobile-link a').click(function(e) {
        $('.footer-top').toggleClass('menu-open');
        e.preventDefault();
    });

});

$(window).on('load resize scroll', function() {
    var curScroll = $(window).scrollTop();
    var curHeight = $(window).height();
    $('.vzr-form-window-mobile').each(function() {
        if ((curScroll + curHeight > $('.order-form').offset().top) && (curScroll + curHeight < $('.order-form').offset().top + $('.order-form').height())) {
            $('.vzr-form-window-mobile').addClass('visible');
        } else {
            $('.vzr-form-window-mobile').removeClass('visible');
        }
    });

    $('.order-form-results-inner').each(function() {
        if (($('.order-form-results-inner').height() < $(window).height() + 20) && ($('.order-form-results-inner').height() < $('.order-form-fields').height()) && (curScroll >= $('.order-form-results').offset().top - 20)) {
            $('.order-form-results').addClass('fixed');
            $('.order-form-results-inner').css({'left': $('.order-form-results').offset().left, 'top': 20});
            var curDiff = ($('.order-form-results-inner').offset().top + $('.order-form-results-inner').height() - curScroll) - ($('.order-form-ctrl').offset().top - curScroll);
            if (curDiff > 0) {
                $('.order-form-results').removeClass('fixed');
                $('.order-form-results-inner').css({'left': 'auto', 'top': $('.order-form-ctrl').offset().top - $('.order-form-results').offset().top - 40 - $('.order-form-results-inner').height()});
            }
        } else {
            $('.order-form-results').removeClass('fixed');
            $('.order-form-results-inner').css({'left': 'auto', 'top': 0});
        }
    });

    if (curScroll > $('.header-middle').offset().top + $('.header-middle').outerHeight()) {
        $('header').addClass('fixed');
    } else {
        $('header').removeClass('fixed');
    }
});

function windowOpen(linkWindow, addWindow, dataWindow, callbackWindow) {
    if (addWindow === undefined) {
        addWindow = false;
    }
    if (!addWindow) {
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        if ($('.window').length == 0) {
            $('body').append('<div class="window"><div class="window-loading"></div></div>')
        }
    } else {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        processData: false,
        contentType: false,
        data: dataWindow,
        cache: false
    }).done(function(html) {
        $('.window:last').html('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div></div>')

        if ($('.window:last .window-container img').length > 0) {
            $('.window:last .window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window:last .window-container').data('curImg', 0);
            $('.window:last .window-container img').one('load', function() {
                var curImg = $('.window:last .window-container').data('curImg');
                curImg++;
                $('.window:last .window-container').data('curImg', curImg);
                if ($('.window:last .window-container img').length == curImg) {
                    $('.window:last .window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window:last .window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window:last form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window:last .window-container').css({'left': '50%', 'margin-left': -$('.window:last .window-container').width() / 2});

        $('.window:last .window-container').css({'top': '50%', 'margin-top': -$('.window:last .window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window:last .window-container').height() > $('.window:last').height() - 60) {
            $('.window:last .window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window:last').remove();
        if ($('.window').length == 0) {
            $('html').removeClass('window-open');
            $('body').css({'margin-right': 0});
        }
    }
}

var pageMenuTimer = null;

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.page-menu').each(function() {
        if (windowScroll > $('.page-menu').offset().top - $('.header-top').outerHeight() - 10) {
            $('.page-menu').addClass('fixed');
        } else {
            $('.page-menu').removeClass('fixed');
        }

        $('.page-menu li.active').removeClass('active');
        $('.page-menu').find('li').each(function() {
            var curBlock = $($(this).find('a').attr('href'));
            if (curBlock.length > 0) {
                if (curBlock.parents().filter('.product-info-content').length == 0 || curBlock.parents().filter('.product-info-content').hasClass('active')) {
                    if (windowScroll + windowHeight / 2 > curBlock.offset().top) {
                        $('.page-menu li.active').removeClass('active');
                        $(this).addClass('active');
                    }
            }
            }
        });
    });

    if ($('.main-up').length == 1) {
        if (windowScroll > windowHeight) {
            $('.main-up').addClass('visible');
        } else {
            $('.main-up').removeClass('visible');
        }
        if (windowScroll + windowHeight > $('footer').offset().top) {
            $('.main-up').css({'margin-bottom': (windowScroll + windowHeight) - $('footer').offset().top});
        } else {
            $('.main-up').css({'margin-bottom': 0});
        }
    }
});