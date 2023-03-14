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
        $('html').toggleClass('nav-add-open');
        e.preventDefault();
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

    $('.cookies-message-close').click(function() {
        $('.cookies-message').remove();
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

    $('.contacts-feedback-link a').click(function(e) {
        var curBlock = $($(this).attr('href'));
        if (curBlock.length > 0) {
            $('html, body').animate({'scrollTop': curBlock.offset().top});
        }
        e.preventDefault();
    });

    $('body').on('click', '.vacancy-title', function(e) {
        var curItem = $(this).parent().filter('.vacancy');
        curItem.toggleClass('open');
        curItem.find('.vacancy-content').slideToggle();
        e.preventDefault();
    });

    $('.mobile-menu-link').click(function(e) {
        $('html').toggleClass('mobile-menu-open');
        e.preventDefault();
    });

    $('.nav-add-item-title').click(function() {
        $(this).toggleClass('open');
    });

    $('.nav-add-item-title a').click(function(e) {
        if ($(window).width() < 1200) {
            if ($(this).parent().next().find('li').length > 1) {
                e.preventDefault();
            }
        }
    });

    $('.nav-add-item-title').each(function() {
        if ($(this).next().find('li').length > 1) {
            $(this).prepend('<svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 49.68 92.8"><path d="M5.6,91.92a3.21,3.21,0,0,1-2.32,1,3.2,3.2,0,0,1-2.32-1,3.28,3.28,0,0,1,0-4.64l40.8-40.8L1,5.68A3.28,3.28,0,0,1,5.6,1L48.72,44.16a3.28,3.28,0,0,1,0,4.64Zm0,0"/></svg>');
        }
    });

    $('.nav-add-item-list li').each(function() {
        var curLi = $(this);
        if (curLi.find('ul').length > 0) {
            curLi.addClass('mobile-with-submenu');
            curLi.find('> a').eq(0).append('<svg xmlns="http://www.w3.org/2000/svg" width="5" height="11" viewBox="0 0 49.68 92.8"><path d="M5.6,91.92a3.21,3.21,0,0,1-2.32,1,3.2,3.2,0,0,1-2.32-1,3.28,3.28,0,0,1,0-4.64l40.8-40.8L1,5.68A3.28,3.28,0,0,1,5.6,1L48.72,44.16a3.28,3.28,0,0,1,0,4.64Zm0,0" transform="translate(0 -0.08)"/></svg>');
            curLi.find('> span').eq(0).append('<svg xmlns="http://www.w3.org/2000/svg" width="5" height="11" viewBox="0 0 49.68 92.8"><path d="M5.6,91.92a3.21,3.21,0,0,1-2.32,1,3.2,3.2,0,0,1-2.32-1,3.28,3.28,0,0,1,0-4.64l40.8-40.8L1,5.68A3.28,3.28,0,0,1,5.6,1L48.72,44.16a3.28,3.28,0,0,1,0,4.64Zm0,0" transform="translate(0 -0.08)"/></svg>');
        }
    });

    $('.nav-add-item-list li a, .nav-add-item-list li span').click(function(e) {
        if ($(window).width() < 1200) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                curLi.toggleClass('open');
                e.preventDefault();
            }
        }
    });

    $(window).on('resize', function() {
        $('.nav-add-open').removeClass('nav-add-open');
    });

    $('.services-item').each(function() {
        var curItem = $(this);
        if (curItem.find('.services-item-list').length > 0) {
            curItem.find('.services-item-title a').prepend('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 92.87 49.68"><path d="M91.92,1.2a3.28,3.28,0,0,0-4.64,0L46.48,42.08,5.6,1.2A3.28,3.28,0,0,0,1,5.84L44.08,49a3.21,3.21,0,0,0,2.32,1,3.34,3.34,0,0,0,2.32-1L91.84,5.84a3.22,3.22,0,0,0,.08-4.64Zm0,0" transform="translate(0 -0.24)"/></svg>');
            curItem.find('.services-item-title span').prepend('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 92.87 49.68"><path d="M91.92,1.2a3.28,3.28,0,0,0-4.64,0L46.48,42.08,5.6,1.2A3.28,3.28,0,0,0,1,5.84L44.08,49a3.21,3.21,0,0,0,2.32,1,3.34,3.34,0,0,0,2.32-1L91.84,5.84a3.22,3.22,0,0,0,.08-4.64Zm0,0" transform="translate(0 -0.24)"/></svg>');
        }
    });

    $('.services-item-title a, .services-item-title span').click(function(e) {
        if ($(window).width() < 1200) {
            var curItem = $(this).parents().filter('.services-item');
            if (curItem.find('.services-item-list').length > 0) {
                curItem.toggleClass('open');
                e.preventDefault();
            }
        }
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
        $('.window:last').html('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.2 11.2"><path d="M11.2,1.12,10.08,0,5.6,4.48,1.12,0,0,1.12,4.48,5.6,0,10.08,1.12,11.2,5.6,6.72l4.48,4.48,1.12-1.12L6.72,5.6Zm0,0"/></svg></a></div></div>')

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
    $('.page-menu').each(function() {
        if ($(window).scrollTop() > $('.page-menu').offset().top) {
            $('.page-menu').addClass('fixed');
        } else {
            $('.page-menu').removeClass('fixed');
        }

        $('.page-menu li.active').removeClass('active');
        $('.page-menu').find('li').each(function() {
            var curBlock = $($(this).find('a').attr('href'));
            if (curBlock.length > 0) {
                if ($(window).scrollTop() + $(window).height() / 2 > curBlock.offset().top) {
                    $('.page-menu li.active').removeClass('active');
                    $(this).addClass('active');
                }
            }
        });
        window.clearTimeout(pageMenuTimer);
        pageMenuTimer = null;
        pageMenuTimer = window.setTimeout(function() {
            if ($('.page-menu ul').hasClass('slick-slider')) {
                $('.page-menu ul').slick('slickGoTo', $('.page-menu ul li').index($('.page-menu ul li.active')));
            }
        }, 100);
    });

    if ($(window).scrollTop() > $(window).height()) {
        $('.main-up').addClass('visible');
    } else {
        $('.main-up').removeClass('visible');
    }

    if ($(window).width() < 1200) {
        if (!$('.page-menu ul').hasClass('slick-slider')) {
            var curWidth = 0;
            $('.page-menu ul li').each(function() {
                curWidth += $(this).width();
            });
            if (curWidth > $('.page-menu').width()) {
                $('.page-menu ul').slick({
                    dots: false,
                    infinite: false,
                    variableWidth: true,
                    centerMode: true,
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 201.72 381.74"><path d="M26.14,191l172.4-172.4A10.8,10.8,0,0,0,183.26,3.28L3.18,183.36a10.77,10.77,0,0,0,0,15.28l180.08,180a10.85,10.85,0,0,0,7.6,3.2,10.55,10.55,0,0,0,7.6-3.2,10.77,10.77,0,0,0,0-15.28Zm0,0" transform="translate(0 -0.1)"/></svg></button>',
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 201.72 381.74"><path d="M26.14,191l172.4-172.4A10.8,10.8,0,0,0,183.26,3.28L3.18,183.36a10.77,10.77,0,0,0,0,15.28l180.08,180a10.85,10.85,0,0,0,7.6,3.2,10.55,10.55,0,0,0,7.6-3.2,10.77,10.77,0,0,0,0-15.28Zm0,0" transform="translate(0 -0.1)"/></svg></button>'
                });
            }
        }
    } else {
        if ($('.page-menu ul').hasClass('slick-slider')) {
            $('.page-menu ul').slick('unslick');
        }
    }
});