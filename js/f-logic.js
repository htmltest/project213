$(document).ready(function() {

    $.validator.addMethod('passportHow',
        function(value, element) {
            var pattern = /^[а-яё][а-яё\ \-'\.0-9]+$/i;
            return this.optional(element) || pattern.test(value);
        },
        'Ошибка заполнения'
    );

    $('body').on('keypress', '.passportHow', function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 1039 && charCode < 1104) || (charCode > 47 && charCode < 58) || charCode == 1105 || charCode == 1025 || charCode == 45 || charCode == 32 || charCode == 39 || charCode == 46) {
            return true;
        }
        return false;
    });

    $.validator.addMethod('VZRSummPeople',
        function(value, element) {
            var summ = 0;
            $('.VZRSummPeople').each(function() {
                summ += Number($(this).val());
            });
            $('.order-form-vzr-peoples').find('.form-error').remove();
            if (summ > 0 && summ < 6) {
                $('.VZRSummPeople').removeClass('error');
                return true;
            } else {
                $('.VZRSummPeople').addClass('error');
                $('.order-form-vzr-peoples').append('<div class="form-error">Общее количество застрахованных должно быть от 1 до 5</div>');
                return false;
            }
        },
        ''
    );

    $.validator.addMethod('passportDate',
        function(passportDate, element) {
            var curForm = $(element).parents().filter('form');
            var birthdayDate = curForm.find('.birthdayDate').val();
            return checkPassportDate(passportDate, birthdayDate);
        },
        'Срок действия документа истек'
    );

    $.validator.addMethod('passportOrBirthDate',
        function(passportDate, element) {
            var curForm = $(element).parents().filter('form');
            var birthdayDate = $(element).data('birthday');
            return checkPassportDate(passportDate, birthdayDate);
        },
        'Срок действия документа истек'
    );

    $.validator.addMethod('passportSeries',
        function(curSeries, element) {
            return this.optional(element) || curSeries.match(/^[0-9]{4}$/);
        },
        'Серия введена некорректно'
    );

    $.validator.addMethod('birthsertSeries',
        function(curSeries, element) {
            return this.optional(element) || curSeries.match(/^[IVXLCivxlc]+-[А-Яа-я]{2}$/);
        },
        'Серия введена некорректно'
    );

    $.validator.addMethod('promoMask',
        function(curSeries, element) {
            return this.optional(element) || curSeries.match(/^[А-Яа-яA-Za-z0-9]{2,24}$/);
        },
        'Неверный формат промокода'
    );

    $.validator.addMethod('VZRAge0',
        function(value, element) {
            return checkVZRAge0(value);
        },
        'Дата рождения не соответствует возрастной группе'
    );

    $.validator.addMethod('VZRAge8',
        function(value, element) {
            return checkVZRAge8(value);
        },
        'Дата рождения не соответствует возрастной группе'
    );

    $.validator.addMethod('VZRAge65',
        function(value, element) {
            return checkVZRAge65(value);
        },
        'Дата рождения не соответствует возрастной группе'
    );

    $('#phone').change(function(e) {
        var curInput = $(this);
        var curValue = curInput.val();
        if (curValue.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/)) {
            curInput.parent().addClass('loading');
            $.ajax({
                type: 'POST',
                url: '/jsonResponse/checkPhone/',
                dataType: 'json',
                data: {'phone': curValue},
                cache: false
            }).done(function(data) {
                curInput.parent().removeClass('loading');
                if (data.status) {
                    $('#phone-hint').show();
                } else {
                    $('#phone-hint').hide();
                }
            });
        } else {
            $('#phone-hint').hide();
        }
    });

    $('#auth-link').click(function () {
        if (!$('#phone').val().match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/)) {
            $('#phone-hint').hide();
            return false;
        }
        $.post('/jsonResponse/LoginByPhone/', {'phone': $('#phone').val()}, function (data) {
            if (!data.status)
            {
                $('#phone-hint').hide();
                return false;
            }
            var newSearch = window.location.search;
            if (newSearch == '') {
                newSearch += '?auth-form=Y';
            } else {
                newSearch += '&auth-form=Y';
            }
            var newURL = window.location.origin + window.location.pathname + newSearch + window.location.hash;
            windowOpen(newURL);
        }, 'json');
    });

    $('.order-address-checkbox input').change(function() {
        if ($(this).prop('checked')) {
            $('.order-address-jur').hide();
            $('.order-address-jur input').removeClass('required');
        } else {
            $('.order-address-jur').show();
            $('.order-address-jur input').addClass('required');
        }
    });

    $('.order-address-checkbox input').each(function() {
        if ($(this).prop('checked')) {
            $('.order-address-jur').hide();
            $('.order-address-jur input').removeClass('required');
        } else {
            $('.order-address-jur').show();
            $('.order-address-jur input').addClass('required');
        }
    });

    $('.order-middlename-checkbox input').change(function() {
        if ($(this).prop('checked')) {
            $(this).parent().parent().prev().hide();
            $(this).parent().parent().prev().find('input').removeClass('required').val('');
            $(this).parent().parent().prev().find('em').hide();
        } else {
            $(this).parent().parent().prev().show();
            $(this).parent().parent().prev().find('input').addClass('required');
            $(this).parent().parent().prev().find('em').show();
        }
    });

    $('.order-middlename-checkbox input').each(function() {
        if ($(this).prop('checked')) {
            $(this).parent().parent().prev().hide();
            $(this).parent().parent().prev().find('input').removeClass('required').val('');
            $(this).parent().parent().prev().find('em').hide();
        } else {
            $(this).parent().parent().prev().show();
            $(this).parent().parent().prev().find('input').addClass('required');
            $(this).parent().parent().prev().find('em').show();
        }
    });

    $('#order-confirm-data').change(function() {
        var curForm = $(this).parents().filter('form');

        if ($(this).prop('checked')) {
            $(this).prop('disabled', true);
            $('.order-confirm-form').addClass('open');
            var content_value = 'yes';
        } else {
            $('.order-confirm-form').removeClass('open');
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'personal_agreement',
                    'content_value' : content_value,
                    'type_select' : 'manual'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('#order-confirm-data').each(function() {
        var curForm = $(this).parents().filter('form');

        if ($(this).prop('checked')) {
            $(this).prop('disabled', true);
            $('.order-confirm-form').addClass('open');
            var content_value = 'yes';
        } else {
            $('.order-confirm-form').removeClass('open');
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'personal_agreement',
                    'content_value' : content_value,
                    'type_select' : 'auto'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('#order-confirm-info').change(function() {
        var curForm = $(this).parents().filter('form');

        var accept = ($(this).prop('checked') ? 'Y' : 'N');
        $.post(
            window.location.href,
            {
                ADDITIONAL_PROMO: accept,
                secondStep: true
            },
            function (data) {
            },
            'json'
        );

        if ($(this).prop('checked')) {
            var content_value = 'yes';
        } else {
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'ad_agreement',
                    'content_value' : content_value,
                    'type_select' : 'manual'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('#order-confirm-info').each(function() {
        var curForm = $(this).parents().filter('form');

        if ($(this).prop('checked')) {
            var content_value = 'yes';
        } else {
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'ad_agreement',
                    'content_value' : content_value,
                    'type_select' : 'auto'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('#order-confirm').each(function() {
        var curForm = $(this).parents().filter('form');

        $(this).prop('checked', false);

        if ($(this).prop('checked')) {
            var content_value = 'yes';
        } else {
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'data_agreement',
                    'content_value' : content_value,
                    'type_select' : 'auto'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('#order-confirm').change(function() {
        var curForm = $(this).parents().filter('form');

        if ($(this).prop('checked')) {
            $(this).prop('disabled', true);
            var curCheckbox = $(this).parents().filter('.form-checkbox');
            curCheckbox.addClass('loading');
            $.ajax({
                type: 'POST',
                url: '/jsonResponse/checkPhoneBeforeBay/',
                data: {'phone': $('#confirmPhone').val(), 'url': $('#confirmURL').val()},
                dataType: 'json',
                cache: false,
                timeout: 30000
            }).fail(function(jqXHR, textStatus, errorThrown) {
                curCheckbox.removeClass('loading');
                curForm.find('.form-error').remove();
                curForm.append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">Сервис временно недоступен, попробуйте позже.</div></div>');
            }).done(function(data) {
                curCheckbox.removeClass('loading');
                if (data.status) {
                    curForm.find('.form-error').remove();
                    $('.order-confirm-sms').show();
                } else {
                    curForm.find('.form-error').remove();
                    curForm.append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">' + data.error + '</div></div>');
                }
            });
            var content_value = 'yes';
        } else {
            $('.order-confirm-sms').css('display', 'none');
            var content_value = 'no';
        }

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'content_type' : 'data_agreement',
                    'content_value' : content_value,
                    'type_select' : 'manual'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('.order-confirm-sms-new a').click(function(e) {
        var curForm = $(this).parents().filter('form');
        $('.order-confirm-sms-new a').addClass('loading');
        $.ajax({
            type: 'POST',
            url: '/jsonResponse/checkPhoneBeforeBay/',
            data: {'phone': $('#confirmPhone').val(), 'url': $('#confirmURL').val()},
            dataType: 'json',
            cache: false,
            timeout: 30000
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $('.order-confirm-sms-new a').removeClass('loading');
            curForm.find('.form-error').remove();
            curForm.append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">Сервис временно недоступен, попробуйте позже.</div></div>');
        }).done(function(data) {
            $('.order-confirm-sms-new a').removeClass('loading');
            if (data.status) {
                curForm.find('.form-error').remove();
            } else {
                curForm.find('.form-error').remove();
                curForm.append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">' + data.error + '</div></div>');
            }
        });

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'event_category': 'button',
                    'event_label': 'Этап 3: Кнопка «Отправить СМС»'
                };
                gtag('event', 'click', data);
            }
        }

        e.preventDefault();
    });

    $('.order-success-sms-link a').click(function(e) {
        var curForm = $(this).parents().filter('form');

        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'event_category': 'button',
                    'event_label': 'Этап 3: Кнопка «Оплатить и получить»'
                };
                gtag('event', 'click', data);
            }
        }
    });

    var confirmForm = $('.order-confirm-form');
    if (confirmForm.length > 0) {
        var validator = confirmForm.validate();
        validator.destroy();
        confirmForm.validate({
            ignore: '',
            invalidHandler: function(event, validator) {
                validator.showErrors();
                if (typeof gtag === 'function') {
                    var curForm = $(validator.currentForm);
                    var productID = curForm.attr('data-product');
                    var stageID = curForm.attr('data-stage');
                    if (typeof (productID) != 'undefined' && typeof (stageID) != 'undefined') {
                        var invalidElements = validator.invalidElements();
                        for (var i = 0; i < invalidElements.length; i++) {
                            var curElement = $(invalidElements[i]);
                            var curAnalitycs = curElement.attr('data-analitycs');
                            if (typeof (curAnalitycs) != 'undefined') {
                                var curError = curElement.parent().find('label.error').text();
                                var data = {
                                    'description': curError,
                                    'fatal': true,
                                    'product_id': productID,
                                    'stage_id': stageID,
                                    'field_id': curAnalitycs
                                };
                                gtag('event', 'exception', data);
                            }
                        }
                    }
                }
            },
            submitHandler: function(form) {
                confirmForm.addClass('loading');
                confirmForm.find('input[type="submit"]').attr('disabled', true);
                confirmForm.find('input[type="text"]').attr('readonly', true);
                confirmForm.find('input[type="text"]').parent().addClass('form-input-disabled');
                $(form).find('.form-error').remove();
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    dataType: 'json',
                    data: $(form).serialize(),
                    cache: false,
                    timeout: 30000
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    confirmForm.removeClass('loading');
                    confirmForm.find('input[type="submit"]').removeAttr('disabled');
                    confirmForm.find('input[type="text"]').removeAttr('readonly');
                    confirmForm.find('input[type="text"]').parent().removeClass('form-input-disabled');
                    $(form).append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">Сервис временно недоступен, попробуйте позже.</div></div>');
                }).done(function(data) {
                    confirmForm.removeClass('loading');
                    confirmForm.find('input[type="submit"]').removeAttr('disabled');
                    confirmForm.find('input[type="text"]').removeAttr('readonly');
                    confirmForm.find('input[type="text"]').parent().removeClass('form-input-disabled');
                    if (data.status) {
                        $('.order-confirm-form').addClass('sms-success');
                        $('.order-confirm-sms').hide();
                        $(form).find('.order-success-sms-link a.btn-orange').attr('href', data.response);
                    } else {
                        $(form).append('<div class="form-error"><div class="form-error-title">Произошла ошибка</div><div class="form-error-text">' + data.error + '</div></div>');
                    }
                });
            }
        });
    }

    $('body').on('change', '.order-field-type input', function() {
        var curIndex = $('.order-field-type input').index('.order-field-type input:checked');
        $('.order-types-tab.active input.required').removeClass('required').addClass('required_');
        $('.order-types-tab.active').removeClass('active');
        $('.order-types-tab').eq(curIndex).addClass('active');
        $('.order-types-tab').eq(curIndex).find('input.required_').addClass('required').removeClass('required_');
    });

    $('.order-field-type input:checked', function() {
        var curIndex = $('.order-field-type input').index('.order-field-type input:checked');
        $('.order-types-tab.active input.required').removeClass('required').addClass('required_');
        $('.order-types-tab.active').removeClass('active');
        $('.order-types-tab').eq(curIndex).addClass('active');
        $('.order-types-tab').eq(curIndex).find('input.required_').addClass('required').removeClass('required_');
    });

    $('body').on('change', '.order-field-doc input', function() {
        var curIndex = $('.order-field-doc input').index('.order-field-doc input:checked');
        if (curIndex == 0) {
            $('#passportORbirthsert').val('');
            $('#passportORbirthsert').mask('0000');
            $('#passportORbirthsert').removeClass('birthsertSeries').addClass('passportSeries');
        } else {
            var options =  {
                translation: {
                    'X': {
                        pattern: /[IVXLCivxlc]/
                    },
                    'W': {
                        pattern: /[IVXLCivxlc]/, optional: true
                    },
                    'Z': {
                        pattern: /[А-Яа-я]/
                    }
                }
            }
            $('#passportORbirthsert').val('');
            $('#passportORbirthsert').mask('XWW-ZZ', options);
            $('#passportORbirthsert').addClass('birthsertSeries').removeClass('passportSeries');
        }
    });

    $('.order-field-doc').each(function() {
        if (typeof ($(this).data('birthday')) != 'undefined') {
            var bitrhDate = new Date($(this).data('birthday').replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));

            var bDate15 = new Date(bitrhDate);
            bDate15.setFullYear(bDate15.getFullYear() + 15);

            var curDate = new Date();
            if (curDate >= bDate15) {
                $('.order-field-doc input').eq(0).prop('checked', true);
                $('.order-field-doc input').eq(1).parent().parent().hide();
            } else {
                $('.order-field-doc input').eq(1).parent().parent().show();
            }
        }
    });

    $('.order-field-doc input:checked', function() {
        var curIndex = $('.order-field-doc input').index('.order-field-doc input:checked');
        if (curIndex == 0) {
            $('#passportORbirthsert').mask('0000');
            $('#passportORbirthsert').removeClass('birthsertSeries').addClass('passportSeries');
        } else {
            var options =  {
                translation: {
                    'X': {
                        pattern: /[IVXLCivxlc0-9]/
                    },
                    'W': {
                        pattern: /[IVXLCivxlc]/, optional: true
                    },
                    'Z': {
                        pattern: /[А-Яа-я]/
                    }
                }
            }
            $('#passportORbirthsert').mask('XWW-ZZ', options);
            $('#passportORbirthsert').addClass('birthsertSeries').removeClass('passportSeries');
        }
    });

    $('body').on('click', '.main-events-form-results-info-type-header-value span', function() {
        $('.main-events-form-results-info-type').toggleClass('open');
        $('.main-events-form-results-info-type-content').slideToggle();
    });

    var options =  {
        translation: {
            'X': {
                pattern: /[IVXLCivxlc0-9]/
            },
            'W': {
                pattern: /[IVXLCivxlc]/, optional: true
            },
            'Z': {
                pattern: /[А-Яа-я]/
            }
        }
    }
    $('input.birthsertSeries').mask('XWW-ZZ', options);

    var optionsPromo =  {
        translation: {
            'X': {
                pattern: /[А-Яа-яA-Za-z0-9]/
            },
            'W': {
                pattern: /[А-Яа-яA-Za-z0-9]/, optional: true
            }
        }
    }
    $('input.promoMask').mask('XXWWWWWWWWWWWWWWWWWWWWWW', optionsPromo);

    $('body').on('change', '#order-programm-select', function() {
        var curValue = $(this).val();
        $('.order-programm-detail').hide();
        var curProgramm = $('.order-programm-detail[data-id="' + curValue + '"]');
        curProgramm.show();
    });

    $('#order-programm-select').each(function() {
        var curValue = $(this).val();
        $('.order-programm-detail').hide();
        var curProgramm = $('.order-programm-detail[data-id="' + curValue + '"]');
        curProgramm.show();
    });

    if ($('#order-date-start').length == 1) {
        $('#order-date-start').change(function() {
            var curDateText = $(this).val();
            if (curDateText.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                var curDateArray = curDateText.split('.');
                var curDate = new Date(Number(curDateArray[2]), Number(curDateArray[1]) - 1, Number(curDateArray[0]));
                $('#order-date-start').data('datepicker').selectDate(curDate);
                var newDate = new Date(curDate.getTime());
                newDate.setFullYear(newDate.getFullYear() + 1);
                newDate.setDate(newDate.getDate() - 1);
                $('#order-date-end').data('datepicker').selectDate(newDate);
            }
        });
        $('#order-date-start').each(function() {
            var curDateText = $(this).val();
            if (curDateText != '') {
                var curDateArray = curDateText.split('.');
                var curDate = new Date(Number(curDateArray[2]), Number(curDateArray[1]) - 1, Number(curDateArray[0]));
                $('#order-date-start').data('datepicker').selectDate(curDate);
                var newDate = new Date(curDate.getTime());
                newDate.setFullYear(newDate.getFullYear() + 1);
                newDate.setDate(newDate.getDate() - 1);
                $('#order-date-end').data('datepicker').selectDate(newDate);
            } else {
                $('#order-date-end').val('');
                $('#order-date-start').data('datepicker').clear();
                $('#order-date-end').data('datepicker').clear();
            }
        });
    }

    $('body').on('change', '[data-calcField]', function() {
        updatePrecalc($(this).parents().filter('form'));
    });

    $('body').on('click', '.order-form-results-code-btn a', function(e) {
        var curForm = $(this).parents().filter('form');
        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var formName = curForm.attr('data-name');
            var eventLabel = $(this).attr('data-eventLabel');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (eventLabel) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': formName,
                    'event_category' : 'button',
                    'event_label' : eventLabel
                };
                gtag('event', 'click', data);
            }
        }
        $('#order-promo').trigger('change');
        e.preventDefault();
    });

    $('body').on('change blur', '#order-promo', function(e) {
        if ($(this).val() == '') {
            $('.order-form-results-code').removeClass('success');
            $('#order-promo').parent().removeClass('focus');
            $('#order-promo').removeClass('error').prop('disabled', false);
            $('#order-promo').parent().find('label.error').remove();
        }
    });

    $('body').on('click', '.order-form-results-code .form-input-clear', function(e) {
        $('#order-promo').removeClass('error').prop('disabled', false);
        $('#order-promo').parent().find('label.error').remove();
        $('#order-promo').val('').trigger('change');
        e.preventDefault();
    });

    $('.address').each(function() {
        var curInput = $(this);
        curInput.attr('autocomplete', 'off');
        curInput.suggestions({
            token: 'b1ef55f1fac05ac03f0b616c47ace94e60ff6f0b',
            type: 'ADDRESS',
            count: 5,
            onSelect: function(suggestion) {
                var curDataField = curInput.parent().find('.form-input-dadata');
                curDataField.html('');
                if (curInput.hasClass('address-with-flat')) {
                    if (suggestion.data.flat != null) {
                        curInput.removeClass('error');
                        curInput.parent().find('label.error').remove();
                        for(curItem in suggestion.data) {
                            if (suggestion.data[curItem] != null) {
                                curDataField.append('<input type="hidden" name="' + curInput.attr('name') + '_DETAIL[' + curItem + ']" value="' + suggestion.data[curItem] + '" />');
                            }
                        }
                    } else {
                        curInput.addClass('error');
                        curInput.parent().find('label.error').remove();
                        curInput.after('<label class="error">Необходимо ввести квартиру</label>');
                    }
                } else {
                    curInput.removeClass('error');
                    curInput.parent().find('label.error').remove();
                    for(curItem in suggestion.data) {
                        if (suggestion.data[curItem] != null) {
                            curDataField.append('<input type="hidden" name="' + curInput.attr('name') + '_DETAIL[' + curItem + ']" value="' + suggestion.data[curItem] + '" />');
                        }
                    }
                }
            },
            onSelectNothing: function() {
                curInput.val('');
                curInput.removeClass('error');
                curInput.parent().find('label.error').remove();
                var curDataField = curInput.parent().find('.form-input-dadata');
                curDataField.html('');
            }
        });
    });

    $('body').on('change', '#vzr-country-select', function() {
        var curOption = $(this).find('option:selected');
        if (curOption.length == 1) {
            if (typeof (curOption.attr('data-schengen')) != 'undefined') {
                $('.order-vzr-schengen').addClass('visible');
            } else {
                $('.order-vzr-schengen').removeClass('visible');
            }

            if (typeof (curOption.attr('data-docs')) != 'undefined') {
                $('.order-vzr-docs').addClass('visible');
                $('#vzr-date-docs').addClass('required');
            } else {
                $('.order-vzr-docs').removeClass('visible');
                $('#vzr-date-docs').val('').trigger('change');
                $('#vzr-date-docs').parent().removeClass('focus')
                $('#vzr-date-docs').data('datepicker').clear();
                $('#vzr-date-docs').removeClass('required');
            }

            if (typeof (curOption.attr('data-rus')) != 'undefined') {
                $('#vzr-multiple').prop('checked', false).prop('disabled', true).trigger('change');
            } else {
                $('#vzr-multiple').prop('disabled', false);
            }
        }
    });

    $('body').on('change', '#vzr-date-start', function() {
        var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
        if (curDate) {
            var newDate = new Date(curDate.getTime());
            newDate.setDate(newDate.getDate() - 1);
            newDate.setFullYear(newDate.getFullYear() + 1);
            $('#vzr-date-end').data('datepicker').update({
                minDate: curDate,
                maxDate: newDate
            });
            $('#vzr-date-end').attr('min', getDateString(curDate));
            $('#vzr-date-end').attr('max', getDateString(newDate));
            var endDateCurr = $('#vzr-date-end').data('datepicker').selectedDates[0];
            if (endDateCurr && endDateCurr < curDate) {
                $('#vzr-date-end').data('datepicker').selectDate(curDate);
            }
            if ($('#vzr-multiple').prop('checked')) {
                $('#vzr-date-end').data('datepicker').selectDate(newDate);
            }

            $('#vzr-date-docs').data('datepicker').update({
                maxDate: curDate
            });
            $('#vzr-date-docs').attr('max', getDateString(newDate));
            var endDateCurr = $('#vzr-date-docs').data('datepicker').selectedDates[0];
            if (endDateCurr && endDateCurr > curDate) {
                $('#vzr-date-docs').data('datepicker').selectDate(curDate);
            }
        }
    });

    $('body').on('change', '#vzr-date-start, #vzr-date-end', function() {
        var startDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
        var endDate = $('#vzr-date-end').data('datepicker').selectedDates[0];
        if (startDate && endDate) {
            var countDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
            $('.order-vzr-days-count-value').html(countDays);
        }
    });

    initVZR();

    $('body').on('change', '#vzr-multiple', function() {
        if ($(this).prop('checked')) {
            $('.order-form-row-vzr-dates').addClass('multiple');
            $('#vzr-date-end').prop('disabled', true).parent().addClass('form-input-disabled');
            $('#vzr-date-start').trigger('change');

            var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (curDate) {
                var newDate = new Date(curDate.getTime());
                newDate.setDate(newDate.getDate() - 1);
                newDate.setFullYear(newDate.getFullYear() + 1);
                $('#vzr-date-end').data('datepicker').update({
                    minDate: newDate,
                    maxDate: newDate
                });
                $('#vzr-date-end').attr('min', getDateString(newDate));
                $('#vzr-date-end').attr('max', getDateString(newDate));
                $('#vzr-date-end').data('datepicker').selectDate(newDate);
            }
        } else {
            $('.order-form-row-vzr-dates').removeClass('multiple');
            $('#vzr-date-end').prop('disabled', false).parent().removeClass('form-input-disabled');

            var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (curDate) {
                var year = new Date(curDate.getTime());
                year.setDate(year.getDate() - 1);
                year.setFullYear(year.getFullYear() + 1);

                $('#vzr-date-end').data('datepicker').update({
                    minDate: curDate,
                    maxDate: year
                });
                $('#vzr-date-end').attr('min', getDateString(curDate));
                $('#vzr-date-end').attr('max', getDateString(year));
            }
        }
    });

    $('body').on('click', '[data-analitycs]', function() {
        if (typeof gtag === 'function') {
            var curForm = $(this).parents().filter('form');
            var productID = curForm.attr('data-product');
            var productName = curForm.attr('data-name');
            var stageID = curForm.attr('data-step');
            var price = $('#programCost');
            if (typeof (productID) != 'undefined' && typeof (stageID) != 'undefined') {
                var data = {
                    'event_category': productID,
                    'event_action' : stageID,
                    'event_label': 'Этап ' + stageID + ' - Поле: ' + $(this).attr('data-analitycs'),
                    'currency': 'RUB',
                    'checkout_step': stageID,
                    'items': [
                                {
                                    'id': productID,
                                    'name': productName,
                                    'list_name': document.location.href,
                                    'brand': 'СМП-Страхование',
                                    'list_position': 1,
                                    'quantity': 1,
                                    'price': price,
                                }
                    ]
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    $('.order-vzr').each(function() {

        function CalculatorVZR(parameters) {
            this.context = parameters;
        }

        CalculatorVZR.prototype.sendRequest = function(currency, packOptions, promocode) {
            var obj = this;
            var data;

            data = {
                dateStart: this.context.dateStart,
                dateEnd: this.context.dateEnd,
                country: this.context.country,
                countDays: this.context.countDays,
                people: this.context.people,
                currency: this.context.currency,
                multiple: (this.context.multiple === true ? 'Y' : 'N'),
                packOptions: [],
                promo: ''
            };

            if (typeof currency === 'string' && currency.length > 0) {
                data.currency = currency;
            }

            if (typeof packOptions === 'object') {
                data.packOptions = packOptions;
            }

            if (typeof this.context.promo === 'string' && this.context.promo.length > 0) {
                data.promo = this.context.promo;
            }

            if (typeof promocode === 'string' && promocode.length > 0) {
                data.promo = promocode;
            }

            $('.order-vzr .loading').remove();
            $('.order-vzr').append('<div class="loading"></div>');

            $.post({
                url: this.context.method,
                data: data,
                dataType: 'json'
            }).done(function(data) {
                if (data.status) {
                    $('#vzr-hidden-sum').attr('name', obj.context.inputs.sum);
                    $('#vzr-hidden-sum-old').attr('name', obj.context.inputs.oldSum);

                    $('.order-vzr .form-error').remove();

                    $('#vzr-hidden-currency').attr('name', obj.context.inputs.currency);
                    if (obj.context.currency == 'EUR') {
                        $('#vzr-currency').prop('checked', true);
                        $('#vzr-hidden-currency').val('EUR');
                    } else {
                        $('#vzr-currency').prop('checked', false);
                        $('#vzr-hidden-currency').val('USD');
                    }

                    $('.vzr-programms-header').remove();
                    $('.vzr-programms-mobile-item').remove();
                    var programmsTitles = data.response.programs.titles;
                    for (var i = 0; i < programmsTitles.length; i++) {
                        var newProgrammTitle = $('<div class="vzr-programms-header">' + $('.vzr-programms-header-template').html() + '</div>');
                        newProgrammTitle.find('.vzr-programms-header-inner').prepend(programmsTitles[i].title);

                        var newProgrammMobileTitle = $('<div class="vzr-programms-mobile-item">' + $('.vzr-programms-mobile-template').html() + '</div>');
                        newProgrammMobileTitle.find('.vzr-programms-mobile-inner').prepend(programmsTitles[i].title);

                        if (typeof (programmsTitles[i].description) != 'undefined' && programmsTitles[i].description != '') {
                            newProgrammTitle.find('.desktop-menu-icon-text').html(programmsTitles[i].description);
                            newProgrammMobileTitle.find('.desktop-menu-icon-text').html(programmsTitles[i].description);
                        } else {
                            newProgrammTitle.find('.desktop-menu-icon').remove();
                            newProgrammMobileTitle.find('.desktop-menu-icon').remove();
                        }
                        $('.vzr-programms-headers').append(newProgrammTitle);
                        $('.vzr-programms-mobile-tab').append(newProgrammMobileTitle);
                    }

                    $('.vzr-programms-item').remove();
                    var programmsItems = data.response.programs.items;
                    for (var i = 0; i < programmsItems.length; i++) {
                        var htmlOptions = '';
                        for (var j = 0; j < programmsItems[i].values.length; j++) {
                            htmlOptions += '<div class="vzr-programms-item-option">';
                            if (programmsItems[i].values[j]) {
                                htmlOptions += $('.vzr-programms-item-template').html();
                            } else {
                                $('.vzr-programms-mobile-tab').eq(i).find('.vzr-programms-mobile-item').eq(j).remove();
                            }
                            htmlOptions += '</div>';
                        }
                        $('.vzr-programms').append('<div class="vzr-programms-item" data-analitycs="programm" data-id="' + programmsItems[i].id + '" data-cost="' + programmsItems[i].cost + '" data-costOld="' + programmsItems[i].oldCost + '">' +
                                                        '<label>' +
                                                            '<input type="radio" name="' + obj.context.inputs.program + '" value="' + programmsItems[i].value + '" />' +
                                                            '<div class="vzr-programms-item-content">' +
                                                                '<div class="vzr-programms-item-price">' + programmsItems[i].name + '</div>' +
                                                                htmlOptions +
                                                            '</div>' +
                                                        '</label>' +
                                                    '</div>');

                        var curParams = $('.vzr-params-item').eq(i);
                        curParams.find('.vzr-type-checkbox').each(function() {
                            $(this).parent().remove();
                        });
                        curParams.find('.vzr-type-add-item:gt(0)').remove();

                        for (var j = 0; j < programmsItems[i].packs.length; j++) {
                            var curPack = programmsItems[i].packs[j];
                            var newParam = $('<div class="vzr-type-item" data-id="' + curPack.id + '" data-cost="' + curPack.cost + '" data-costOld="' + curPack.oldCost + '">' +
                                                '<label class="vzr-type-checkbox">' +
                                                    '<input type="checkbox" name="' + obj.context.inputs.packs + '[]" value="' + curPack.value + '" data-analitycs="vacantion_type" />' +
                                                    '<div class="vzr-type-checkbox-inner">' +
                                                        '<div class="vzr-type-title">' + curPack.name + '</div>' +
                                                    '</div>' +
                                                '</label>' +
                                            '</div>');
                            if (curPack.selected) {
                                newParam.find('input').prop('checked', true);
                            }
                            if (typeof (curPack.description) != 'undefined' && curPack.description != '') {
                                newParam.find('.vzr-type-checkbox-inner').prepend($('.vzr-params-hint-template').html());
                                newParam.find('.desktop-menu-icon-text').html(curPack.description);
                            }
                            curParams.find('.vzr-type-list').append(newParam);

                            if (typeof (curPack.options) != 'undefined') {
                                var active = '';
                                if (curPack.selected) {
                                    active = ' active';
                                }
                                var htmlOptions = '<div class="vzr-type-add-item' + active +'">';
                                if (curPack.options.length > 0) {
                                    htmlOptions += '<div class="vzr-add">' +
                                                        '<div class="vzr-add-title">' + curPack.nameOptions +'</div>' +
                                                        '<div class="vzr-add-list">';
                                    for (var k = 0; k < curPack.options.length; k++) {
                                        var curOption = curPack.options[k];
                                        var selected = '';
                                        if (curOption.selected) {
                                            selected = ' checked="checked"';
                                        }
                                        htmlOptions += '<div class="form-checkbox"><label><input type="checkbox" data-analitycs="extreme_type" data-id="' + curOption.value + '"  name="' + obj.context.inputs.packOptions +'[]" value="' + curOption.value + '"' + selected + ' /><span>' + curOption.name + '</span></label></div>';
                                    }
                                    htmlOptions += '</div>';
                                }
                                htmlOptions += '</div>';
                            }
                            curParams.find('.vzr-type-add').append(htmlOptions);
                        }

                        curParams.find('.vzr-more-item').remove();

                        for (var j = 0; j < programmsItems[i].options.length; j++) {
                            var curOption = programmsItems[i].options[j];
                            var costOption = curOption.cost;
                            var costOptionOld = '';
                            var costOptionOldMobile = '';
                            if (data.response.promocode.status) {
                                costOptionOld = ' <em>' + curOption.oldCost + ' ₽</em>';
                                costOptionOldMobile = '<em class="vzr-more-checkbox-price-old-mobile">' + curOption.oldCost + ' ₽</em>';
                            }
                            var newOption = $('<div class="vzr-more-item" data-id="' + curOption.id + '" data-cost="' + curOption.cost + '" data-costOld="' + curOption.oldCost + '">' +
                                                    '<label class="vzr-more-checkbox">' +
                                                        '<input type="checkbox" name="" value="' + curOption.id + '" data-analitycs="vacantion_option" />' +
                                                        '<div class="vzr-more-checkbox-inner">' +
                                                            '<div class="vzr-more-checkbox-title">' + curOption.name + '</div>' +
                                                            '<div class="vzr-more-checkbox-price">' + costOptionOldMobile + '+ ' + costOption + ' ₽' + costOptionOld + '</div>' +
                                                        '</div>' +
                                                    '</label>' +
                                                    '<input type="hidden" class="vzr-more-hidden-price" name="" value="' + curOption.cost + '" />' +
                                                '</div>');

                            if (curOption.selected) {
                                newOption.find('input').prop('checked', true);
                            }
                            if (typeof (curOption.description) != 'undefined' && curOption.description != '') {
                                newOption.find('.vzr-more-checkbox-inner').prepend($('.vzr-params-hint-template').html());
                                newOption.find('.desktop-menu-icon-text').html(curOption.description);
                            }
                            curParams.find('.vzr-more-list').append(newOption);
                        }
                    }

                    if (calculatorUserVZR == null) {
                        $('.vzr-programms-item').eq(data.response.programs.selected).find('input').prop('checked', true);
                    } else {
                        $('.vzr-programms-item[data-id="' + calculatorUserVZR['programm'] + '"]').find('input').prop('checked', true);
                    }

                    $('.vzr-programms-item input:checked').each(function() {
                        var curInput = $(this);
                        var curIndex = $('.vzr-programms-item input').index(curInput);
                        $('.vzr-programms-mobile-tab.active').removeClass('active');
                        $('.vzr-programms-mobile-tab').eq(curIndex).addClass('active');

                        $('.vzr-params-item.active').removeClass('active');
                        $('.vzr-params-item').eq(curIndex).addClass('active');
                        $('.vzr-params-item').each(function() {
                            var curItem = $(this);
                            if (curItem.hasClass('active')) {
                                curItem.find('.vzr-type-checkbox input').attr('name', calculatorObj.context.inputs.packs + '[]');
                                curItem.find('.vzr-add-list .form-checkbox input').attr('name', calculatorObj.context.inputs.packOptions + '[]');
                            } else {
                                curItem.find('.vzr-type-checkbox input').attr('name', '');
                                curItem.find('.vzr-add-list .form-checkbox input').attr('name', '');
                            }
                        });
                    });

                    restoreUserVZR();

                    $('.vzr-params-item .vzr-type-add-item .form-checkbox input').attr('name', '');
                    $('.vzr-params-item.active .vzr-type-add-item.active .form-checkbox input').attr('name', obj.context.inputs.packOptions + '[]');

                    recalcVZR();

                    if (data.response.promocode.value != '') {
                        $('#order-promo').parent().addClass('focus');
                        $('#order-promo').val(data.response.promocode.value);
                    } else {
                        $('#order-promo').parent().removeClass('focus');
                        $('#order-promo').val('');
                    }
                    if (data.response.promocode.status) {
                        $('#order-promo').removeClass('error').prop('disabled', true);
                        $('#order-promo').parent().find('label.error').remove();
                        $('.order-form-results-code').addClass('success');
                    } else {
                        if (data.response.promocode.error != '') {
                            $('#order-promo').addClass('error').parent().find('label.error').remove();
                            $('#order-promo').prop('disabled', false).after('<label class="error">' + data.response.promocode.error + '</label>');
                            $('.order-form-results-code').removeClass('success');
                        }
                    }

                    $('.order-vzr .loading').remove();
                } else {
                    $('.order-vzr .loading').remove();
                    $('.order-vzr .form-error').remove();
                    $('.order-vzr').prepend('<div class="form-error">' + data.error + '</div>');
                }
            }).fail(function() {
                $('.order-vzr .loading').remove();
                $('.order-vzr').prepend('<div class="form-error">Сервис временно недоступен, попробуйте позже.</div>');
            });
        }

        var calculatorObj = new CalculatorVZR(parameters);
        calculatorObj.sendRequest();

        $('body').on('change', '#vzr-currency', function() {
            if ($('#vzr-currency').prop('checked')) {
                $('#vzr-hidden-currency').val('EUR');
            } else {
                $('#vzr-hidden-currency').val('USD');
            }
            saveUserVZR();
            resendVZR();
        });

        $('body').on('change', '.vzr-programms-item input', function() {
            var curInput = $(this);
            if (curInput.prop('checked')) {
                var curIndex = $('.vzr-programms-item input').index(curInput);
                var oldIndex = $('.vzr-programms-mobile-tab').index($('.vzr-programms-mobile-tab.active'));
                $('.vzr-programms-mobile-tab.active').removeClass('active');
                $('.vzr-programms-mobile-tab').eq(curIndex).addClass('active');

                $('.vzr-params-item.active').removeClass('active');
                $('.vzr-params-item').eq(curIndex).addClass('active');
                $('.vzr-params-item').each(function() {
                    var curItem = $(this);
                    if (curItem.hasClass('active')) {
                        curItem.find('.vzr-type-checkbox input').attr('name', calculatorObj.context.inputs.packs + '[]');
                        curItem.find('.vzr-add-list .form-checkbox input').attr('name', calculatorObj.context.inputs.packOptions + '[]');
                    } else {
                        curItem.find('.vzr-type-checkbox input').attr('name', '');
                        curItem.find('.vzr-add-list .form-checkbox input').attr('name', '');
                    }
                });
                $('.vzr-params-item').eq(curIndex).find('.vzr-more-item').each(function() {
                    var curItem = $(this);
                    var curID = curItem.attr('data-id');
                    var oldItem = $('.vzr-params-item').eq(oldIndex).find('.vzr-more-item[data-id="' + curID + '"]');
                    if (oldItem.length == 1) {
                        curItem.find('.vzr-more-checkbox input').prop('checked', oldItem.find('.vzr-more-checkbox input').prop('checked'));
                    }
                });
                $('.vzr-params-item').eq(curIndex).find('.vzr-type-item').each(function() {
                    var curItem = $(this);
                    var curID = curItem.attr('data-id');
                    var oldItem = $('.vzr-params-item').eq(oldIndex).find('.vzr-type-item[data-id="' + curID + '"]');
                    if (oldItem.length == 1) {
                        curItem.find('.vzr-type-checkbox input').prop('checked', oldItem.find('.vzr-type-checkbox input').prop('checked')).trigger('change');
                    }
                });
            }

            saveUserVZR();
            recalcVZR();
        });

        $('#vzr-results-country').html(calculatorObj.context.country);
        if (calculatorObj.context.multiple) {
            $('#vzr-results-multiple').html('Да');
        } else {
            $('#vzr-results-multiple').html('Нет');
        }
        $('#vzr-results-days').html(calculatorObj.context.countDays + ' ' + getDaysText(calculatorObj.context.countDays));
        $('#vzr-results-dates').html(calculatorObj.context.dateStart + ' — ' + calculatorObj.context.dateEnd);
        if (typeof (calculatorObj.context.dateDocs) != 'undefined') {
            $('#vzr-results-date-docs').html(calculatorObj.context.dateDocs);
            $('#vzr-results-date-docs').parent().show();
        } else {
            $('#vzr-results-date-docs').parent().hide();
        }
        $('#vzr-results-people').html(calculatorObj.context.people.small + calculatorObj.context.people.middle + calculatorObj.context.people.large);

        function recalcVZR() {
            var curProgramm = $('.vzr-programms-item input:checked').parent().parent();
            var curIndexProgramm = $('.vzr-programms-item').index(curProgramm);

            $('#vzr-results-programm').html(curProgramm.find('.vzr-programms-item-price').html());
            var cost = parseFloat(curProgramm.attr('data-cost'));
            var costOld = parseFloat(curProgramm.attr('data-costOld'));

            var curParams = $('.vzr-params-item').eq(curIndexProgramm);
            if (curParams.find('.vzr-type-checkbox input:checked').length == 1) {
                var curType = curParams.find('.vzr-type-checkbox input:checked').parent().parent();
                cost += parseFloat(curType.attr('data-cost'));
                costOld += parseFloat(curType.attr('data-costOld'));

                var curTypeIndex = curParams.find('.vzr-type-item').index(curType);
                if (curParams.find('.vzr-type-add-item').eq(curTypeIndex).find('.vzr-add').length > 0) {
                    $('.main-events-form-results-info-type').removeClass('disabled');
                    $('.main-events-form-results-info-type-header-value span').html(curType.find('.vzr-type-title').html());

                    var newHTML = '';
                    curParams.find('.vzr-type-add-item').eq(curTypeIndex).find('.vzr-add-list input:checked').each(function() {
                        newHTML += '<div class="main-events-form-results-info-type-item">' + $(this).parent().find('span').html() + '</div>';
                    });
                    $('.main-events-form-results-info-type-content-inner').html(newHTML);
                } else {
                    $('.main-events-form-results-info-type').addClass('disabled');
                    $('.main-events-form-results-info-type-header-value span').html(curType.find('.vzr-type-title').html());
                    $('.main-events-form-results-info-type-content-inner').html('');
                }
            } else {
                $('.main-events-form-results-info-type').addClass('disabled');
                $('.main-events-form-results-info-type-header-value span').html(curParams.find('.vzr-type-static .vzr-type-title').html());
                $('.main-events-form-results-info-type-content-inner').html('');
            }

            var newHTML = '';
            $('.vzr-more-inputs').html('');
            var i = 0;
            curParams.find('.vzr-more-item input:checked').each(function() {
                newHTML += '<div class="main-events-form-results-info-add-row"><span class="main-events-form-results-info-add-label">' + $(this).parent().find('.vzr-more-checkbox-title').html() + '</span><span class="main-events-form-results-info-add-value">' + $(this).parent().find('.vzr-more-checkbox-price').html() + '</span></div>';
                cost += parseFloat($(this).parent().parent().attr('data-cost'));
                costOld += parseFloat($(this).parent().parent().attr('data-costOld'));

                $('.vzr-more-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.options + '[' + i + '][ID]" value="' + $(this).val() + '" />');
                $('.vzr-more-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.options + '[' + i + '][PRICE]" value="' + $(this).parents('.vzr-more-item').find('.vzr-more-hidden-price').val() + '" />');
                i++;
            });
            $('.main-events-form-results-info-add-row').remove();
            $('.main-events-form-results-info-add').append(newHTML);
            $('.main-events-form-results-info-add').find('em').remove();

            $('.main-events-form-results-value-price em').remove();
            $('#programCost').html(cost.toFixed(2) + ' ₽');
            if (costOld > 0) {
                $('.main-events-form-results-value-price').append('<em>' + costOld.toFixed(2) + ' ₽</em>');
            }

            $('#vzr-hidden-sum').val(cost.toFixed(0));
            $('#vzr-hidden-sum-old').val(costOld.toFixed(0));

            $('.vzr-empty-inputs').html('');
            if ($('input[name="' + calculatorObj.context.inputs.packs + '[]"]:checked').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.packs + '" value="" />');
            }
            if ($('input[name="' + calculatorObj.context.inputs.packOptions + '[]"]:checked').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.packOptions + '" value="" />');
            }
            if ($('.vzr-more-inputs input').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.options + '" value="" />');
            }
        }

        function resendVZR() {
            var currency = 'USD';
            if ($('#vzr-currency').prop('checked')) {
                currency = 'EUR';
            }
            var programm = $('.vzr-programms-item input:checked').val();
            var programmItem = $('.vzr-programms-item input:checked').parent().parent();
            var programmIndex = $('.vzr-programms-item').index(programmItem);
            var curParams = $('.vzr-params-item').eq(programmIndex);

            var packOptions = null;

            if (curParams.find('.vzr-type-checkbox input:checked').length == 1) {
                var curPackIndex = curParams.find('.vzr-type-checkbox input').index(curParams.find('.vzr-type-checkbox input:checked'));
                if (curParams.find('.vzr-type-add-item').eq(curPackIndex + 1).find('.form-checkbox input:checked').length > 0) {
                    packOptions = [];
                    curParams.find('.vzr-type-add-item').eq(curPackIndex + 1).find('.form-checkbox input:checked').each(function() {
                        packOptions.push($(this).val());
                    });
                }
            }

            var promocode = $('#order-promo').val();

            calculatorObj.sendRequest(currency, packOptions, promocode);
        }

        $('body').on('change', '.vzr-type-checkbox input', function() {
            var curInput = $(this);
            var curParams = curInput.parents().filter('.vzr-params-item');
            var curIndex = curParams.find('.vzr-type-checkbox input').index(curInput);
            if (curInput.prop('checked')) {
                curParams.find('.vzr-type-checkbox input').each(function() {
                    var newIndex = curParams.find('.vzr-type-checkbox input').index($(this));
                    if (newIndex != curIndex) {
                       $(this).prop('checked', false);
                   }
                });

                curParams.find('.vzr-type-add-item.active .form-checkbox input').attr('name', '');
                curParams.find('.vzr-type-add-item.active').removeClass('active');
                curParams.find('.vzr-type-add-item').eq(curIndex + 1).addClass('active');
                curParams.find('.vzr-type-add-item').eq(curIndex + 1).find('.form-checkbox input').attr('name', calculatorObj.context.inputs.packOptions + '[]');
            } else {
                curParams.find('.vzr-type-add-item.active .form-checkbox input').attr('name', '');
                curParams.find('.vzr-type-add-item.active').removeClass('active');
            }
            saveUserVZR();
            resendVZR();
        });

        $('body').on('change', '.vzr-add-list input', function() {
            saveUserVZR();
            resendVZR();
        });

        $('body').on('change', '.vzr-more-item input', function() {
            $(this).parents().filter('.vzr-more-item').find('.vzr-more-hidden-price').prop('checked', $(this).prop('checked'));
            saveUserVZR();
            recalcVZR();
        });

        $('body').on('change', '#order-promo', function(e) {
            saveUserVZR();
            resendVZR();
        });

        var calculatorUserVZR = null;

        function restoreUserVZR() {
            if (calculatorUserVZR != null) {
                if (calculatorUserVZR['currency'] == 'EUR') {
                    $('#vzr-currency').prop('checked', true);
                    $('#vzr-hidden-currency').val('EUR');
                } else {
                    $('#vzr-currency').prop('checked', false);
                    $('#vzr-hidden-currency').val('USD');
                }

                for (var i = 0; i < calculatorUserVZR['type'].length; i++) {
                    var curType = calculatorUserVZR['type'][i];
                    var curProgramm = curType.programm;
                    var curIndexParams = $('.vzr-programms-item').index($('.vzr-programms-item[data-id="' + curProgramm + '"]'));
                    $('.vzr-params-item').eq(curIndexParams).find('.vzr-type-item[data-id="' + curType.id + '"]').find('input').prop('checked', curType.checked);
                    $('.vzr-params-item').eq(curIndexParams).find('.vzr-type-item[data-id="' + curType.id + '"]').find('input').each(function() {
                        var curInput = $(this);
                        var curParams = curInput.parents().filter('.vzr-params-item');
                        var curIndex = curParams.find('.vzr-type-checkbox input').index(curInput);
                        if (curInput.prop('checked')) {
                            curParams.find('.vzr-type-checkbox input').each(function() {
                                var newIndex = curParams.find('.vzr-type-checkbox input').index($(this));
                                if (newIndex != curIndex) {
                                   $(this).prop('checked', false);
                               }
                            });

                            curParams.find('.vzr-type-add-item.active').removeClass('active');
                            curParams.find('.vzr-type-add-item').eq(curIndex + 1).addClass('active');
                        } else {
                            curParams.find('.vzr-type-add-item.active').removeClass('active');
                        }
                    });
                }

                for (var i = 0; i < calculatorUserVZR['typeAdd'].length; i++) {
                    var curAdd = calculatorUserVZR['typeAdd'][i];
                    var curProgramm = curAdd.programm;
                    var curIndexParams = $('.vzr-programms-item').index($('.vzr-programms-item[data-id="' + curProgramm + '"]'));
                    var curType = curAdd.type;
                    var curIndexType = $('.vzr-type-item').index($('.vzr-params-item').eq(curIndexParams).find('.vzr-type-item[data-id="' + curType + '"]'));
                    $('.vzr-type-add-item').eq(curIndexType).find('.vzr-add-list .form-checkbox input[data-id="' + curAdd.id + '"]').prop('checked', curAdd.checked);
                }

                for (var i = 0; i < calculatorUserVZR['more'].length; i++) {
                    var curMore = calculatorUserVZR['more'][i];
                    var curProgramm = curMore.programm;
                    var curIndexParams = $('.vzr-programms-item').index($('.vzr-programms-item[data-id="' + curProgramm + '"]'));
                    $('.vzr-params-item').eq(curIndexParams).find('.vzr-more-item[data-id="' + curMore.id + '"]').find('input').prop('checked', curMore.checked);
                }
            }

            $('.vzr-empty-inputs').html('');
            if ($('input[name="' + calculatorObj.context.inputs.packs + '[]"]:checked').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.packs + '" value="" />');
            }
            if ($('input[name="' + calculatorObj.context.inputs.packOptions + '[]"]:checked').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.packOptions + '" value="" />');
            }
            if ($('.vzr-more-inputs input').length == 0) {
                $('.vzr-empty-inputs').append('<input type="hidden" name="' + calculatorObj.context.inputs.options + '" value="" />');
            }
        }

        function saveUserVZR() {
            calculatorUserVZR = [];
            if ($('#vzr-currency').prop('checked')) {
                calculatorUserVZR['currency'] = 'EUR';
                $('#vzr-hidden-currency').val('EUR');
            } else {
                calculatorUserVZR['currency'] = 'USD';
                $('#vzr-hidden-currency').val('USD');
            }

            calculatorUserVZR['programm'] = $('.vzr-programms-item input:checked').parent().parent().attr('data-id');

            calculatorUserVZR['type'] = [];
            $('.vzr-type-checkbox').each(function() {
                var curType = $(this).parent();
                var curIndexParams = $('.vzr-params-item').index(curType.parents().filter('.vzr-params-item'));
                calculatorUserVZR['type'].push({
                    "programm"  : $('.vzr-programms-item').eq(curIndexParams).attr('data-id'),
                    "id"        : curType.attr('data-id'),
                    "checked"   : curType.find('input').prop('checked')
                });
            });

            calculatorUserVZR['typeAdd'] = [];
            $('.vzr-add-list .form-checkbox input').each(function() {
                var curAdd = $(this);
                var curIndexParams = $('.vzr-params-item').index(curAdd.parents().filter('.vzr-params-item'));
                var curIndexType = $('.vzr-type-add-item').index(curAdd.parents().filter('.vzr-type-add-item'));
                calculatorUserVZR['typeAdd'].push({
                    "programm"  : $('.vzr-programms-item').eq(curIndexParams).attr('data-id'),
                    "type"      : $('.vzr-type-item').eq(curIndexType).attr('data-id'),
                    "id"        : curAdd.attr('data-id'),
                    "checked"   : curAdd.prop('checked')
                });
            });

            calculatorUserVZR['more'] = [];
            $('.vzr-more-item').each(function() {
                var curMore = $(this);
                var curIndexParams = $('.vzr-params-item').index(curMore.parents().filter('.vzr-params-item'));
                calculatorUserVZR['more'].push({
                    "programm"  : $('.vzr-programms-item').eq(curIndexParams).attr('data-id'),
                    "id"        : curMore.attr('data-id'),
                    "checked"   : curMore.find('input').prop('checked')
                });
            });
        }

    });

    $('.vzr-form-window-mobile').each(function() {
        window.setInterval(function() {
            $('.vzr-form-window-mobile-cost').html($('.main-events-form-results-value-price').html());
        }, 100);
    });

    $('body').on('click', '.vzr-form-window-mobile-detail a', function(e) {
        $('html, body').animate({'scrollTop': $('.main-events-form-results-info').parent().offset().top});
        e.preventDefault();
    });

    $('.user-email-one, .user-email-two').each(function() {
        $(this).attr('autocomplete', 'off');
    });

    $('body').on('change', '.user-email-one, .user-email-two, .user-email-confirm-one', function(e) {
        combineEmail();
    });

    $('body').on('keyup', '.user-email-one, .user-email-confirm-one', function(e) {
        combineEmail();
    });

    $('.VZRAge0').each(function() {
        var curInput = $(this);

        var today = new Date();

        var VZRmaxDate = new Date(today.getTime());

        var VZRminDate = new Date(today.getTime());
        VZRminDate.setDate(VZRminDate.getDate() + 1);
        VZRminDate.setFullYear(VZRminDate.getFullYear() - 8);

        curInput.data('datepicker').update({
            minDate: VZRminDate,
            maxDate: VZRmaxDate
        });
    });

    $('.VZRAge8').each(function() {
        var curInput = $(this);

        var today = new Date();

        var VZRmaxDate = new Date(today.getTime());
        VZRmaxDate.setFullYear(VZRmaxDate.getFullYear() - 8);

        var VZRminDate = new Date(today.getTime());
        VZRminDate.setDate(VZRminDate.getDate() + 1);
        VZRminDate.setFullYear(VZRminDate.getFullYear() - 65);

        curInput.data('datepicker').update({
            minDate: VZRminDate,
            maxDate: VZRmaxDate
        });
    });

    $('.VZRAge65').each(function() {
        var curInput = $(this);

        var today = new Date();

        var VZRmaxDate = new Date(today.getTime());
        VZRmaxDate.setFullYear(VZRmaxDate.getFullYear() - 65);

        var VZRminDate = new Date(today.getTime());
        VZRminDate.setDate(VZRminDate.getDate() + 1);
        VZRminDate.setFullYear(VZRminDate.getFullYear() - 70);

        curInput.data('datepicker').update({
            minDate: VZRminDate,
            maxDate: VZRmaxDate
        });
    });

    $('.order-results').each(function() {
        if (typeof gtag === 'function') {
            var productID = $(this).attr('data-product');
            var formName = $(this).attr('data-name');
            var paymentsStatus = $(this).attr('data-paymentsStatus');
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (paymentsStatus) != 'undefined') {
                if (paymentsStatus == 'true') {
                    var data = {
                        'url': document.location.href,
                        'id': productID,
                        'name': formName,
                        'payment': 'yes'
                    };
                    gtag('event', 'page_load', data);

                    var transactionID = $(this).attr('data-transaction');
                    var productPrice = $(this).attr('data-price');
                    var category = $(this).attr('data-category');
                    var data = {
                        'transaction_id': transactionID,
                        'affiliation': 'Сайт СМП',
                        'value': productPrice,
                        'currency': 'RUB',
                        'shipping': 0,
                        'items': [
                                    {
                                        'id': productID,
                                        'name': formName,
                                        'list_name': 'Успешная оплата',
                                        'brand': 'СМП-Страхование',
                                        'category': category,
                                        'list_position': 1,
                                        'quantity': 1,
                                        'price': productPrice
                                    }
                                ]
                    };
                    gtag('event', 'purchase', data);
                } else {
                    var data = {
                        'url': document.location.href,
                        'id': productID,
                        'name': formName
                    };
                    gtag('event', 'page_load', data);
                }
            }
        }
    });

    $('.order-form form, .order-confirm-form').each(function() {
        if (typeof gtag === 'function') {
            var productID = $(this).attr('data-product');
            var formName = $(this).attr('data-name');
            var productPrice = $(this).attr('data-price');
            if (typeof (productPrice) == 'undefined') {
                productPrice = '';
            }
            var step = $(this).attr('data-step');
            var category = $(this).attr('data-category');
            var coupon = $('#order-promo').val();
            if (typeof (coupon) == 'undefined') {
                coupon = '';
            }
            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (step) != 'undefined' && typeof (category) != 'undefined') {
                var data = {
                    'checkout_step': step,
                    'value': productPrice,
                    'currency': 'RUB',
                    "items": [
                                {
                                    'id': productID,
                                    'name': formName,
                                    'list_name': 'Страница_заявки',
                                    'brand': 'СМП-Страхование',
                                    'category': category,
                                    'list_position': 1,
                                    'quantity': 1,
                                    'price': productPrice
                                }
                    ],
                    'coupon': coupon
                };
                if (step == 1) {
                    gtag('event', 'begin_checkout', data);
                } else {
                    gtag('event', 'checkout_progress', data);
                }
            }
        }
    });

});

function getDaysText(number) {
    var endings = Array('дней', 'день', 'дня');
    var num100 = number % 100;
    var num10 = number % 10;
    if (num100 >= 5 && num100 <= 20) {
        return endings[0];
    } else if (num10 == 0) {
        return endings[0];
    } else if (num10 == 1) {
        return endings[1];
    } else if (num10 >= 2 && num10 <= 4) {
        return endings[2];
    } else if (num10 >= 5 && num10 <= 9) {
        return endings[0];
    } else {
        return endings[2];
    }
}


function checkPassportDate(passportDate, dudeDate) {
    var dob = new Date(dudeDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    var pssprtDate = new Date(passportDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));

    var pDate20 = new Date(dob);
    pDate20.setFullYear(pDate20.getFullYear() + 20);
    var pDate45 = new Date(dob);
    pDate45.setFullYear(pDate45.getFullYear() + 45);

    var ageDude = parseInt(yearsDiff(new Date(dudeDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'))));

    if (ageDude >= 20 && ageDude < 45) {
        if (pssprtDate < pDate20) {
            return false;
        }
    }

    if (ageDude >= 45) {
        if (pssprtDate < pDate45) {
            return false;
        }
    }

    return true;
}

function yearsDiff(dt) {
    if (dt > new Date()) {
        return 0;
    }

    var crntDate = new Date();

    var yearDiff = parseInt(crntDate.getFullYear() - dt.getFullYear());

    var dat4check = new Date(dt);
    dat4check.setFullYear(crntDate.getFullYear());
    if (dat4check > crntDate) {
        yearDiff--;
    }

    if (yearDiff <= 0) {
        return 0;
    }

    if (yearDiff === 1) {
        var monthDiff = parseInt(crntDate.getMonth() - dt.getMonth());
        if (monthDiff >= 0) {
            if (monthDiff == 0) {
                var dayDiff = parseInt(crntDate.getDate() - dt.getDate());
                if (dayDiff > 0) {
                    return yearDiff;
                } else {
                    return 0;
                }
            } else {
                return crntDate.getFullYear() - dt.getFullYear();
            }
        } else {
            return 0;
        }
    } else {
        return yearDiff;
    }
}

function updatePrecalc(curForm, statusChange) {
    if (typeof (statusChange) == 'undefined') {
        statusChange = 'manual';
    }

    var curURL = curForm.attr('data-calcForm');
    if (typeof (curURL) != 'undefined') {
        $('#programCost').addClass('loading').html('');
        var curData = {};
        curForm.find('[data-calcField]').each(function() {
            var curField = $(this);
            if (curField.attr('id') == 'order-programm-select') {
                var selected = curField.find('option:selected');
                curData[curField.attr('data-calcField')] = selected.attr('data-value');
            } else {
                curData[curField.attr('data-calcField')] = curField.val();
            }
        });
        var promo = $('#order-promo').val();
        if (typeof promo === 'string' && promo.length > 0) {
            curURL = curForm.attr('data-calcFormPromo');
        }

        $.post({
            url: curURL,
            data: curData,
            dataType: 'json'
        }).done(function(data) {

            if (data.status) {
                if (typeof data.response === 'object') {
                    if (data.response.MESSAGE.length > 0) {
                        $('#order-promo').addClass('error').parent().find('label.error').remove();
                        $('#order-promo').prop('disabled', false).after('<label class="error">' + data.response.MESSAGE + '</label>');
                        $('.order-form-results-code').removeClass('success');
                        if (typeof gtag === 'function') {
                            gtag('event', 'exception', {
                                'description': data.response.MESSAGE,
                                'fatal': false
                            });
                        }
                    } else {
                        $('#order-promo').removeClass('error').prop('disabled', true);
                        $('#order-promo').parent().find('label.error').remove();
                        $('.order-form-results-code').addClass('success');
                    }

                    $('#programCost').removeClass('loading').html(data.response.SUM + ' ₽');

                    if (Number(data.response.OLD) > 0) {
                        $('#programCost').append(' <em>' + data.response.OLD + ' ₽</em>');
                    }
                    if (typeof gtag === 'function') {
                        var productID = curForm.attr('data-product');
                        var formName = curForm.attr('data-name');
                        var variant = curForm.find('#order-programm-select option:selected').html();
                        if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (variant) != 'undefined') {
                            var dataTag = {
                                'url': document.location.href,
                                'id': productID,
                                'quantity': 1,
                                'price': data.response.SUM,
                                'currency': 'RUB',
                                'type_select': statusChange,
                                'items': [
                                    {
                                        'id': productID,
                                        'name': formName,
                                        'variant': variant,
                                        'list_position': 1,
                                        'quantity': 1,
                                        'price': data.response.SUM,
                                        'currency': 'RUB'
                                    }
                                ]
                            };
                            gtag('event', 'product_select_program', dataTag);
                        }
                    }
                } else {
                    $('#programCost').removeClass('loading').html(data.response + ' ₽');
                    if (typeof gtag === 'function') {
                        var productID = curForm.attr('data-product');
                        var formName = curForm.attr('data-name');
                        var variant = curForm.find('#order-programm-select option:selected').html();
                        if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (variant) != 'undefined') {
                            var dataTag = {
                                'url': document.location.href,
                                'id': productID,
                                'quantity': 1,
                                'price': data.response,
                                'currency': 'RUB',
                                'type_select': statusChange,
                                'items': [
                                    {
                                        'id': productID,
                                        'name': formName,
                                        'variant': variant,
                                        'list_position': 1,
                                        'quantity': 1,
                                        'price': data.response,
                                        'currency': 'RUB'
                                    }
                                ]
                            };
                            gtag('event', 'product_select_program', dataTag);
                        }
                        if (typeof (curForm.data('firstPrecalc')) == 'undefined') {
                            var productPrice = data.response;
                            var step = curForm.attr('data-step');
                            var category = curForm.attr('data-category');
                            var coupon = $('#order-promo').val();
                            if (typeof (coupon) == 'undefined') {
                                coupon = '';
                            }
                            if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (step) != 'undefined' && typeof (category) != 'undefined' && typeof (productPrice) != 'undefined') {
                                var dataTag = {
                                    'checkout_step': step,
                                    'value': productPrice,
                                    'currency': 'RUB',
                                    "items": [
                                                {
                                                    'id': productID,
                                                    'name': formName,
                                                    'list_name': 'Страница_заявки',
                                                    'brand': 'СМП-Страхование',
                                                    'category': category,
                                                    'list_position': 1,
                                                    'quantity': 1,
                                                    'price': productPrice
                                                }
                                    ],
                                    'coupon': coupon
                                };
                                if (step == 1) {
                                    gtag('event', 'begin_checkout', dataTag);
                                    curForm.data('firstPrecalc', true);
                                }
                            }
                        }
                    }
                }
            }

        }).fail(function() {
            curForm.find('.form-error').remove()
            curForm.prepend('<div class="form-error">Сервис временно недоступен, попробуйте позже.</div>');
        });
    }
}

$(window).on('load', function() {

    $('form[data-calcForm]').each(function() {
        updatePrecalc($(this), 'auto');
    });

});

function sendUserCode(_code_)
{
    if (!$('#phone').val().match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/)) {
        windowClose();
        $('#phone-hint').hide();
        return false;
    }
    $.post('/jsonResponse/CheckLoginByPhone/', {'phone': $('#phone').val(), 'code':_code_}, function (data) {
        if (!data.status)
        {
            $('#phone-hint').hide();
            $('#codeFormError').removeAttr('style').find('.form-error-text').html(data.error);
            if (typeof gtag === 'function') {
                var data = {
                    'description': data.error,
                    'fatal': true
                };
                gtag('event', 'exception', data);
            }
            return false;
        }
        windowClose();
        $('#phone-hint').remove();
        $('#ajaxPersonalText').html('Профиль');
    }, 'json');
}

function combineEmail()
{
    $('.user-email-confirm-two option:selected').removeAttr('selected');

    $('.user-email-confirm-two option').each(function () {
        if ($(this).attr('value') == $('.user-email-two').val()) {
            $(this).attr('selected', 'selected');
        }
    });

    if ($('.user-email-confirm-two').hasClass('select2-hidden-accessible')) {
        $('.user-email-confirm-two').trigger('change');
    }

    $('.user-email').val(
        $('.user-email-one').val() + '@' + $('.user-email-two').val()
    );

    $('.user-email-confirm').val(
        $('.user-email-confirm-one').val() + '@' + $('.user-email-confirm-two').val()
    );
}

$(window).on('load', function() {
    combineEmail();
});

function checkVZRAge0(value) {
    var checkDate = new Date(value.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    var nowDate = new Date();

    var ageCurrent = parseInt(yearsDiff(checkDate));

    if (ageCurrent >= 8) {
        return false;
    }

    return true;
}

function checkVZRAge8(value) {
    var checkDate = new Date(value.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    var nowDate = new Date();

    var ageCurrent = parseInt(yearsDiff(checkDate));

    if (ageCurrent >= 8 && ageCurrent < 65) {
        return true;
    }

    return false;
}

function checkVZRAge65(value) {
    var checkDate = new Date(value.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
    var nowDate = new Date();

    var ageCurrent = parseInt(yearsDiff(checkDate));

    if (ageCurrent >= 65 && ageCurrent < 70) {
        return true;
    }

    return false;
}

function getDateString(curDate) {
    var curDay = curDate.getDate();
    if (curDay < 10) {
        curDay = '0' + curDay;
    }
    var curMonth = curDate.getMonth() + 1;
    if (curMonth < 10) {
        curMonth = '0' + curMonth;
    }
    var curYear = curDate.getFullYear();
    return curDay + '.' + curMonth + '.' + curYear;
}

function initVZR() {

    $('#vzr-country-select').each(function() {
        var curOption = $(this).find('option:selected');
        if (curOption.length == 1) {
            if (typeof (curOption.attr('data-schengen')) != 'undefined') {
                $('.order-vzr-schengen').addClass('visible');
            } else {
                $('.order-vzr-schengen').removeClass('visible');
            }

            if (typeof (curOption.attr('data-docs')) != 'undefined') {
                $('.order-vzr-docs').addClass('visible');
                $('#vzr-date-docs').addClass('required');
            } else {
                $('.order-vzr-docs').removeClass('visible');
                $('#vzr-date-docs').removeClass('required');
            }
        }
    });

    if ($('#vzr-date-start').length == 1) {
        var today = new Date();

        var tommorow = new Date(today.getTime());
        tommorow.setDate(tommorow.getDate() + 1);

        var selfyear = new Date(today.getTime());
        selfyear.setMonth(selfyear.getMonth() + 6);

        var year = new Date(tommorow.getTime());
        year.setDate(year.getDate() - 1);
        year.setFullYear(year.getFullYear() + 1);

        $('#vzr-date-start').data('datepicker').update({
            minDate: tommorow,
            maxDate: selfyear
        });
        $('#vzr-date-start').attr('min', getDateString(tommorow));
        $('#vzr-date-start').attr('max', getDateString(selfyear));

        $('#vzr-date-docs').data('datepicker').update({
            minDate: tommorow,
            maxDate: selfyear
        });
        $('#vzr-date-docs').attr('min', getDateString(tommorow));
        $('#vzr-date-docs').attr('max', getDateString(selfyear));

        if ($('#vzr-multiple').prop('checked')) {
            var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (curDate) {
                var newDate = new Date(curDate.getTime());
                newDate.setDate(newDate.getDate() - 1);
                newDate.setFullYear(newDate.getFullYear() + 1);
                $('#vzr-date-end').data('datepicker').update({
                    minDate: newDate,
                    maxDate: newDate
                });
                $('#vzr-date-end').attr('min', getDateString(newDate));
                $('#vzr-date-end').attr('max', getDateString(newDate));
                $('#vzr-date-end').data('datepicker').selectDate(newDate);
            }
        } else {
            $('#vzr-date-end').data('datepicker').update({
                minDate: tommorow,
                maxDate: year
            });
            $('#vzr-date-end').attr('min', getDateString(tommorow));
            $('#vzr-date-end').attr('max', getDateString(year));
        }

        $('#vzr-date-start').each(function() {
            var startDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (startDate) {
                if ($('#vzr-multiple').prop('checked')) {
                    var newDate = new Date(startDate.getTime());
                    newDate.setDate(newDate.getDate() - 1);
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    $('#vzr-date-end').data('datepicker').selectDate(newDate);
                }
            }
            var endDate = $('#vzr-date-end').data('datepicker').selectedDates[0];
            if (startDate && endDate) {
                var countDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
                $('.order-vzr-days-count-value').html(countDays);
            }
        });
    }

    $('#vzr-multiple').each(function() {
        if ($(this).prop('checked')) {
            $('.order-form-row-vzr-dates').addClass('multiple');
            $('#vzr-date-end').prop('disabled', true).parent().addClass('form-input-disabled');

            var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (curDate) {
                var newDate = new Date(curDate.getTime());
                newDate.setDate(newDate.getDate() - 1);
                newDate.setFullYear(newDate.getFullYear() + 1);
                $('#vzr-date-end').data('datepicker').update({
                    minDate: newDate,
                    maxDate: newDate
                });
                $('#vzr-date-end').attr('min', getDateString(newDate));
                $('#vzr-date-end').attr('max', getDateString(newDate));
                $('#vzr-date-end').data('datepicker').selectDate(newDate);
            }
        } else {
            $('.order-form-row-vzr-dates').removeClass('multiple');
            $('#vzr-date-end').prop('disabled', false).parent().removeClass('form-input-disabled');

            var curDate = $('#vzr-date-start').data('datepicker').selectedDates[0];
            if (curDate) {
                var year = new Date(curDate.getTime());
                year.setDate(year.getDate() - 1);
                year.setFullYear(year.getFullYear() + 1);

                $('#vzr-date-end').data('datepicker').update({
                    minDate: curDate,
                    maxDate: year
                });
                $('#vzr-date-end').attr('min', getDateString(curDate));
                $('#vzr-date-end').attr('max', getDateString(year));
            }
        }
    });
}

$(document).ready(function() {

    $('.agents-search-form form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        validator.destroy();
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                var isEmptyForm = true;
                curForm.find('.agents-search-form-tab.active .form-input input').each(function() {
                    if ($(this).val() != '') {
                        isEmptyForm = false;
                    }
                });
                if (isEmptyForm) {
                    curForm.find('.form-error').remove();
                    curForm.append('<div class="form-error"><div class="form-error-title">Сообщение</div><div class="form-error-text">Необходимо заполнить хотя бы одно поле.</div></div>');
                } else {
                    curForm.addClass('loading');
                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        dataType: 'html',
                        data: curForm.serialize(),
                        cache: false,
                        timeout: 30000
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        curForm.removeClass('loading');
                        curForm.find('.form-error').remove();
                        curForm.append('<div class="form-error"><div class="form-error-title">Сообщение</div><div class="form-error-text">Сервис временно недоступен, попробуйте позже.</div></div>');
                    }).done(function(html) {
                        curForm.removeClass('loading');
                        curForm.find('.form-error').remove();
                        $('.agents-search-results').html(html);
                        $('html, body').animate({'scrollTop': $('.agents-search-results').offset().top});
                    });
                }
            }
        });
    });

    $('body').on('click', '.agents-results-item-types-title a', function(e) {
        $(this).parent().parent().toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.agents-results-item-types-hide a', function(e) {
        $(this).parent().parent().removeClass('open');
        e.preventDefault();
    });

    var optionsINN =  {
        translation: {
            'W': {
                pattern: /[0-9]/, optional: true
            }
        }
    }
    $('input.INN').mask('WWWWWWWWWWWW', optionsINN);

    $('.agents-search-form-type input').change(function() {
        var curType = $('.agents-search-form-type input').index($(this));
        $('.agents-search-form-tab.active').removeClass('active');
        $('.agents-search-form-tab').eq(curType).addClass('active');
    });

    $('.agents-search-form-type').each(function() {
        var curType = $('.agents-search-form-type input').index($('.agents-search-form-type input:checked'));
        $('.agents-search-form-tab.active').removeClass('active');
        $('.agents-search-form-tab').eq(curType).addClass('active');
    });

});