$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('onlyRUS',
        function(value, element) {
            var pattern = /^[А-ЯЁ][а-яёА-ЯЁ\ \-']+$/;
            return this.optional(element) || pattern.test(value);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('onlyEN',
        function(value, element) {
            var pattern = /^[A-Z][a-zA-Z\ \-']+$/;
            return this.optional(element) || pattern.test(value);
        },
        'Ошибка заполнения'
    );

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var userDate = new Date(curDate.substr(6, 4), Number(curDate.substr(3, 2)) - 1, Number(curDate.substr(0, 2)));
                    if ($(element).attr('min')) {
                        var minDateStr = $(element).attr('min');
                        var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                        if (userDate < minDate) {
                            $.validator.messages['inputDate'] = 'Минимальная дата - ' + minDateStr;
                            return false;
                        }
                    }
                    if ($(element).attr('max')) {
                        var maxDateStr = $(element).attr('max');
                        var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                        if (userDate > maxDate) {
                            $.validator.messages['inputDate'] = 'Максимальная дата - ' + maxDateStr;
                            return false;
                        }
                    }
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input span').html(curName);
        } else {
            curField.find('.form-file-input span').html(curField.find('.form-file-input').attr('data-placeholder'));
        }
    });

    $('body').on('click', '.form-input-clear', function(e) {
        var curField = $(this).parents().filter('.form-input');
        curField.find('input').val('').trigger('blur').trigger('change');
        e.preventDefault();
    });

    $('.form-files').each(function() {
        var curFiles = $(this);
        if (curFiles.find('.form-files-list-item').length > 0) {
            curFiles.addClass('full');
            curFiles.find('.files-required').val('true');
        }
    });

    $('body').on('click', '.form-files-list-item-remove', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        $.ajax({
            type: 'GET',
            url: curLink.attr('href'),
            dataType: 'json',
            cache: false
        }).done(function(data) {
            curLink.parent().remove();
            if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
                curFiles.removeClass('full');
                curFiles.find('.files-required').val('');
            }
        });
        e.preventDefault();
    });

    $('body').on('click', '.form-files-list-item-cancel', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        curLink.parent().remove();
        if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
            curFiles.removeClass('full');
            curFiles.find('.files-required').val('');
        }
        e.preventDefault();
    });

    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });

    $(document).bind('dragover', function (e) {
        var dropZones = $('.form-files-dropzone'),
            timeout = window.dropZoneTimeout;
        if (timeout) {
            clearTimeout(timeout);
        } else {
            dropZones.addClass('in');
        }
        var hoveredDropZone = $(e.target).closest(dropZones);
        dropZones.not(hoveredDropZone).removeClass('hover');
        hoveredDropZone.addClass('hover');
        window.dropZoneTimeout = setTimeout(function () {
            window.dropZoneTimeout = null;
            dropZones.removeClass('in hover');
        }, 100);
    });

    $('body').on('click', '.form-files-dropzone', function(e) {
        var curLink = $(this);
        var curFiles = $(this).parents().filter('.form-files');
        curFiles.find('.form-files-input input').click();
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('copy paste cut', '#emailCopy', function() {
        return false;
    });

    $('body').on('click', '.btn-form-send', function(e) {
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
                    'event_category': 'button',
                    'event_label': eventLabel
                };
                gtag('event', 'click', data);
            }
        }

        curForm.validate().destroy();
        curForm.append('<input type="hidden" name="' + $(this).data('name') + '" value="1" />');
        curForm.trigger('submit');
        e.preventDefault();
    });

    $('body').on('click', '.-selected-', function(e) {
        if (!($(this).hasClass('-range-from-')) && !($(this).hasClass('-range-to-'))) {
            $('.form-input-date input').each(function() {
                var curDatepicker = $(this).data('datepicker');
                if (curDatepicker) {
                    curDatepicker.hide();
                }
            });
        }
    });

});

$.fn.datepicker.language['ru'] =  {
    days: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    daysShort: ['Вос','Пон','Вто','Сре','Чет','Пят','Суб'],
    daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthsShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    today: 'Сегодня',
    clear: 'Очистить',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'hh:ii',
    firstDay: 1
};

function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');
    curForm.find('.form-input-date input').mask('00.00.0000');
    curForm.find('.form-input-date input').attr('autocomplete', 'off');
    curForm.find('.form-input-date input').addClass('inputDate');
    curForm.find('.form-input-date-range input').attr('autocomplete', 'off');
    curForm.find('input.digit3').mask('000');
    curForm.find('input.digit4').mask('0000');
    curForm.find('input.digit6').mask('000000');
    curForm.find('input.digit10').mask('0000000000');
    curForm.find('input.digit12').mask('000000000000');
    curForm.find('input.digit13').mask('0000000000000');
    curForm.find('input.digit15').mask('000000000000000');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 10,
            closeOnSelect: false
        };
        if (curSelect.parents().filter('.window').length == 1) {
            options['dropdownParent'] = $('.window-content');
        }
        if (typeof(curSelect.attr('data-searchplaceholder')) != 'undefined') {
            options['searchInputPlaceholder'] = curSelect.attr('data-searchplaceholder');
        }
        curSelect.select2(options);
        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            $(e.delegateTarget).parent().find('.select2-search--inline input').val('').trigger('input.search').trigger('focus');
            $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
        });
        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                $(e.delegateTarget).parent().find('.select2-container').removeClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-placeholder'));
            } else {
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
            }
        });
        if (typeof(curSelect.attr('multiple')) != 'undefined') {
            curSelect.on('select2:open', function(e) {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
            });
        }
        if (curSelect.find('option:selected').length > 0 && curSelect.find('option:selected').html() != '') {
            curSelect.trigger({type: 'select2:select'})
        }
    });

    curForm.find('input[type="number"]').each(function() {
        var curBlock = $(this).parent();
        curBlock.addClass('form-input-number');
        var curHTML = curBlock.html();
        curBlock.html(curHTML.replace(/type=\"number\"/g, 'type="text"'));
        curBlock.find('input').spinner({
            stop: function(event, ui) {
                $(this).valid();
            }
        });
        curBlock.find('input').keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 43 || charCode > 57)) {
                return false;
            }
            return true;
        });
    });

    curForm.find('.form-input-date input').on('change', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            var isCorrectDate = true;
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                }
            } else {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    myDatepicker.clear();
                }
            }
        }
    });

    curForm.find('.form-input-date input').on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    curForm.find('.form-input-date input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            autoClose: true,
            toggleSelected: false
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });

    curForm.find('.form-input-date-range input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        $(this).datepicker({
            language: 'ru',
            range: true,
            multipleDatesSeparator: ' - ',
            minDate: minDate,
            maxDate: maxDate
        });
    });

    window.setInterval(function() {
        $('.form-input-date input, .form-input-date-range input').each(function() {
            if ($(this).val() != '') {
                $(this).parent().addClass('focus');
            }
        });
    }, 100);

    curForm.find('.form-slider').each(function() {
        var curSlider = $(this);
        var curRange = curSlider.find('.form-slider-range-inner')[0];
        noUiSlider.create(curRange, {
            start: [Number(curSlider.find('.form-slider-from').val()), Number(curSlider.find('.form-slider-to').val())],
            connect: true,
            range: {
                'min': Number(curSlider.find('.form-slider-range-from').html()),
                'max': Number(curSlider.find('.form-slider-range-to').html())
            },
            format: wNumb({
                decimals: 0
            })
        });
        curRange.noUiSlider.on('update', function(values, handle) {
            if (handle == 0) {
                curSlider.find('.form-slider-from').val(values[handle]);
                curSlider.find('.form-slider-hint-from').html(values[handle]);
            } else {
                curSlider.find('.form-slider-to').val(values[handle]);
                curSlider.find('.form-slider-hint-to').html(values[handle]);
            }
        });
    });

    curForm.find('.onlyRUS').each(function() {
        $(this).keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 1039 && charCode < 1104) || charCode == 1105 || charCode == 1025 || charCode == 45 || charCode == 32 || charCode == 39) {
                return true;
            }
            return false;
        });
        $(this).on('keyup change', function() {
            var curValue = $(this).val();
            curValue = curValue.charAt(0).toUpperCase() + curValue.substr(1);
            $(this).val(curValue);
        });
    });

    curForm.find('.onlyEN').each(function() {
        $(this).keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 96 && charCode < 123) || (charCode > 64 && charCode < 91) || charCode == 45 || charCode == 32 || charCode == 39) {
                return true;
            }
            return false;
        });
        $(this).on('keyup change', function() {
            var curValue = $(this).val();
            curValue = curValue.charAt(0).toUpperCase() + curValue.substr(1);
            $(this).val(curValue);
        });
    });

    curForm.find('[data-analitycs]').change(function() {
        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var productName = curForm.attr('data-name');
            var stageID = curForm.attr('data-step');
            var price = $('#programCost');
            if (typeof (productID) != 'undefined' && typeof (stageID) != 'undefined' && typeof (productName) != 'undefined' && typeof (price) != 'undefined') {
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

    curForm.find('[data-analitycs]').blur(function() {
        if (typeof gtag === 'function') {
            var productID = curForm.attr('data-product');
            var productName = curForm.attr('data-name');
            var stageID = curForm.attr('data-step');
            var price = $('#programCost');
            if (typeof (productID) != 'undefined' && typeof (stageID) != 'undefined' && typeof (productName) != 'undefined' && typeof (price) != 'undefined') {
                var data = {
                    'url': document.location.href,
                    'id': productID,
                    'name': productName,
                    'content_type' : $(this).attr('data-analitycs'),
                    'type_select' : 'manual'
                };
                gtag('event', 'generate_lead', data);
            }
        }
    });

    curForm.find('.captcha-container').each(function() {
        if ($('script#smartCaptchaScript').length == 0) {
            $('body').append('<script src="https://captcha-api.yandex.ru/captcha.js?render=onload&onload=smartCaptchaLoad" defer id="smartCaptchaScript"></script>');
        } else {
            if (window.smartCaptcha) {
                var curID = window.smartCaptcha.render(this, {
                    sitekey: smartCaptchaKey,
                    callback: smartCaptchaCallback,
                    invisible: true,
                    hideShield: true,
                });
                $(this).attr('data-smartid', curID);
            }
        }
    });

    curForm.find('.form-files').each(function() {
        var curFiles = $(this);
        var curInput = curFiles.find('.form-files-input input');

        var uploadURL = curInput.attr('data-uploadurl');
        var uploadFiles = curInput.attr('data-uploadfiles');
        var removeURL = curInput.attr('data-removeurl');
        curInput.fileupload({
            url: uploadURL,
            dataType: 'json',
            dropZone: curFiles.find('.form-files-dropzone'),
            pasteZone: curFiles.find('.form-files-dropzone'),
            add: function(e, data) {
                if (typeof curInput.attr('multiple') !== 'undefined') {
                    curFiles.find('.form-files-list').append('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></span></div>');
                } else {
                    curFiles.find('.form-files-list').html('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></span></div>');
                }
                data.submit();
                curFiles.addClass('full');
            },
            done: function (e, data) {
                curFiles.find('.form-files-list-item-progress').eq(0).remove();
                if (data.result.status == 'success') {
                    if (typeof curInput.attr('multiple') !== 'undefined') {
                        curFiles.find('.form-files-list').append('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.2857 0H21.7063L32 11.215V37.5C32 38.8812 30.9761 40 29.7143 40H2.2857C1.02395 40 0 38.8812 0 37.5V2.49998C0 1.11877 1.02406 0 2.2857 0Z" fill="#F0F0F7"/><path d="M31.9674 11.2494H24.0005C22.7388 11.2494 21.7148 10.1295 21.7148 8.74943V0.0244141L31.9674 11.2494Z" fill="#C7C7D9"/></svg><span>' + data.result.ext + '</span></div><div class="form-files-list-item-detail"><div class="form-files-list-item-name"><a href="' + data.result.url + '" download>' + data.result.path + '</a></div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div></div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></a></div>');
                    } else {
                        curFiles.find('.form-files-list').html('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.2857 0H21.7063L32 11.215V37.5C32 38.8812 30.9761 40 29.7143 40H2.2857C1.02395 40 0 38.8812 0 37.5V2.49998C0 1.11877 1.02406 0 2.2857 0Z" fill="#F0F0F7"/><path d="M31.9674 11.2494H24.0005C22.7388 11.2494 21.7148 10.1295 21.7148 8.74943V0.0244141L31.9674 11.2494Z" fill="#C7C7D9"/></svg><span>' + data.result.ext + '</span></div><div class="form-files-list-item-detail"><div class="form-files-list-item-name"><a href="' + data.result.url + '" download>' + data.result.path + '</a></div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div></div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></a></div>');
                    }
                    curFiles.find('.files-required').val('true');
                    curFiles.find('label.error').remove();
                } else {
                    if (typeof curInput.attr('multiple') !== 'undefined') {
                        curFiles.find('.form-files-list').append('<div class="form-files-list-item error"><div class="form-files-list-item-icon"><svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.28613 0.5H21.4863L31.5 11.4082V37.5C31.5 38.648 30.6584 39.5 29.7139 39.5H2.28613C1.34161 39.5 0.5 38.648 0.5 37.5V2.5C0.5 1.352 1.34171 0.5 2.28613 0.5Z" fill="#F0F0F7" stroke="#BC3F46" /><path d="M31.9655 11.2494H23.9986C22.7368 11.2494 21.7129 10.1295 21.7129 8.74943V0.0244141L31.9655 11.2494Z" fill="#BC3F46" /><path d="M16.4782 26.7475C16.6086 26.6171 16.6738 26.4579 16.6738 26.2698C16.6738 26.0818 16.6086 25.9226 16.4782 25.7923C16.3479 25.662 16.1887 25.5969 16.0007 25.5969C15.8126 25.5969 15.6534 25.662 15.5232 25.7923C15.3927 25.9226 15.3275 26.0818 15.3275 26.2698C15.3275 26.4579 15.3927 26.6171 15.5232 26.7475C15.6534 26.8778 15.8126 26.9429 16.0007 26.9429C16.1887 26.9429 16.3479 26.8778 16.4782 26.7475ZM15.3757 23.8982H16.6257V18.8982H15.3757V23.8982ZM16.0021 30.9173C14.9071 30.9173 13.8779 30.7095 12.9144 30.294C11.9509 29.8784 11.1129 29.3145 10.4002 28.6021C9.6876 27.8897 9.12336 27.052 8.70753 26.089C8.29183 25.1259 8.08398 24.097 8.08398 23.0021C8.08398 21.9071 8.29176 20.8779 8.70732 19.9144C9.12287 18.9509 9.68683 18.1129 10.3992 17.4002C11.1116 16.6876 11.9493 16.1234 12.9123 15.7075C13.8754 15.2918 14.9043 15.084 15.9992 15.084C17.0942 15.084 18.1234 15.2918 19.0869 15.7073C20.0504 16.1229 20.8884 16.6868 21.6011 17.3992C22.3137 18.1116 22.8779 18.9493 23.2938 19.9123C23.7095 20.8754 23.9173 21.9043 23.9173 22.9992C23.9173 24.0942 23.7095 25.1234 23.294 26.0869C22.8784 27.0504 22.3145 27.8884 21.6021 28.6011C20.8897 29.3137 20.052 29.8779 19.089 30.2938C18.1259 30.7095 17.097 30.9173 16.0021 30.9173ZM16.0007 29.6673C17.8618 29.6673 19.4382 29.0215 20.7298 27.7298C22.0215 26.4382 22.6673 24.8618 22.6673 23.0007C22.6673 21.1395 22.0215 19.5632 20.7298 18.2715C19.4382 16.9798 17.8618 16.334 16.0007 16.334C14.1395 16.334 12.5632 16.9798 11.2715 18.2715C9.97982 19.5632 9.33398 21.1395 9.33398 23.0007C9.33398 24.8618 9.97982 26.4382 11.2715 27.7298C12.5632 29.0215 14.1395 29.6673 16.0007 29.6673Z" fill="#BC3F46" /></svg></div><div class="form-files-list-item-detail"><div class="form-files-list-item-name">' + data.result.path + '</div><div class="form-files-list-item-size">' + data.result.text + '</div></div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></a></div>');
                    } else {
                        curFiles.find('.form-files-list').html('<div class="form-files-list-item error"><div class="form-files-list-item-icon"><svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.28613 0.5H21.4863L31.5 11.4082V37.5C31.5 38.648 30.6584 39.5 29.7139 39.5H2.28613C1.34161 39.5 0.5 38.648 0.5 37.5V2.5C0.5 1.352 1.34171 0.5 2.28613 0.5Z" fill="#F0F0F7" stroke="#BC3F46" /><path d="M31.9655 11.2494H23.9986C22.7368 11.2494 21.7129 10.1295 21.7129 8.74943V0.0244141L31.9655 11.2494Z" fill="#BC3F46" /><path d="M16.4782 26.7475C16.6086 26.6171 16.6738 26.4579 16.6738 26.2698C16.6738 26.0818 16.6086 25.9226 16.4782 25.7923C16.3479 25.662 16.1887 25.5969 16.0007 25.5969C15.8126 25.5969 15.6534 25.662 15.5232 25.7923C15.3927 25.9226 15.3275 26.0818 15.3275 26.2698C15.3275 26.4579 15.3927 26.6171 15.5232 26.7475C15.6534 26.8778 15.8126 26.9429 16.0007 26.9429C16.1887 26.9429 16.3479 26.8778 16.4782 26.7475ZM15.3757 23.8982H16.6257V18.8982H15.3757V23.8982ZM16.0021 30.9173C14.9071 30.9173 13.8779 30.7095 12.9144 30.294C11.9509 29.8784 11.1129 29.3145 10.4002 28.6021C9.6876 27.8897 9.12336 27.052 8.70753 26.089C8.29183 25.1259 8.08398 24.097 8.08398 23.0021C8.08398 21.9071 8.29176 20.8779 8.70732 19.9144C9.12287 18.9509 9.68683 18.1129 10.3992 17.4002C11.1116 16.6876 11.9493 16.1234 12.9123 15.7075C13.8754 15.2918 14.9043 15.084 15.9992 15.084C17.0942 15.084 18.1234 15.2918 19.0869 15.7073C20.0504 16.1229 20.8884 16.6868 21.6011 17.3992C22.3137 18.1116 22.8779 18.9493 23.2938 19.9123C23.7095 20.8754 23.9173 21.9043 23.9173 22.9992C23.9173 24.0942 23.7095 25.1234 23.294 26.0869C22.8784 27.0504 22.3145 27.8884 21.6021 28.6011C20.8897 29.3137 20.052 29.8779 19.089 30.2938C18.1259 30.7095 17.097 30.9173 16.0021 30.9173ZM16.0007 29.6673C17.8618 29.6673 19.4382 29.0215 20.7298 27.7298C22.0215 26.4382 22.6673 24.8618 22.6673 23.0007C22.6673 21.1395 22.0215 19.5632 20.7298 18.2715C19.4382 16.9798 17.8618 16.334 16.0007 16.334C14.1395 16.334 12.5632 16.9798 11.2715 18.2715C9.97982 19.5632 9.33398 21.1395 9.33398 23.0007C9.33398 24.8618 9.97982 26.4382 11.2715 27.7298C12.5632 29.0215 14.1395 29.6673 16.0007 29.6673Z" fill="#BC3F46" /></svg></div><div class="form-files-list-item-detail"><div class="form-files-list-item-name">' + data.result.path + '</div><div class="form-files-list-item-size">' + data.result.text + '</div></div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3333 15H4.66667C4.31304 15 3.97391 14.863 3.72386 14.6192C3.47381 14.3754 3.33333 14.0448 3.33333 13.7V5.25H2.65C2.29102 5.25 2 4.95898 2 4.6C2 4.24101 2.29101 3.95 2.65 3.95H4.66667V3.3C4.66667 2.95522 4.80714 2.62456 5.05719 2.38076C5.30724 2.13696 5.64638 2 6 2H10C10.3536 2 10.6928 2.13696 10.9428 2.38076C11.1929 2.62456 11.3333 2.95522 11.3333 3.3V3.95H13.35C13.709 3.95 14 4.24101 14 4.6C14 4.95898 13.709 5.25 13.35 5.25H12.6667V13.7C12.6667 14.0448 12.5262 14.3754 12.2761 14.6192C12.0261 14.863 11.687 15 11.3333 15ZM4.66667 5.25V13.7H11.3333V5.25H4.66667ZM6 3.3V3.95H10V3.3H6ZM10 11.7333C10 12.1015 9.70152 12.4 9.33333 12.4C8.96514 12.4 8.66667 12.1015 8.66667 11.7333V7.21667C8.66667 6.84848 8.96514 6.55 9.33333 6.55C9.70152 6.55 10 6.84848 10 7.21667V11.7333ZM7.33333 11.7333C7.33333 12.1015 7.03486 12.4 6.66667 12.4C6.29848 12.4 6 12.1015 6 11.7333V7.21667C6 6.84848 6.29848 6.55 6.66667 6.55C7.03486 6.55 7.33333 6.84848 7.33333 7.21667V11.7333Z" /></svg></a></div>');
                    }
                }
                curFiles.addClass('full');
            }
        });
    });

    curForm.validate({
        ignore: '',
        invalidHandler: function(event, validator) {
            validator.showErrors();
            if (typeof gtag === 'function') {
                var curForm = $(validator.currentForm);
                var productID = curForm.attr('data-product');
                var stageID = curForm.attr('data-step');
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
            var curForm = $(form);
            if (typeof gtag === 'function') {
                var productID = curForm.attr('data-product');
                var formName = curForm.attr('data-name');
                var productName = curForm.attr('data-name');
                var stageID = curForm.attr('data-step');
                var price = $('#programCost');
                var eventLabel = curForm.find('.order-form-ctrl input').attr('data-eventLabel');
                if (typeof (productID) != 'undefined' && typeof (formName) != 'undefined' && typeof (eventLabel) != 'undefined' && typeof (productName) != 'undefined' && typeof (price) != 'undefined') {
                    var data = {
                        'event_category': productID,
                        'event_action' : stageID,
                        'event_label': 'Этап ' + stageID + ' - Кнопка: ' + $(this).attr('data-analitycs'),
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
                    gtag('event', 'click', data);
                }
            }

            var smartCaptchaWaiting = false;
            curForm.find('.captcha-container').each(function() {
                if (curForm.attr('form-smartcaptchawaiting') != 'true') {
                    var curBlock = $(this);
                    var curInput = curBlock.find('input[name="smart-token"]');
                    curInput.removeAttr('value');
                    smartCaptchaWaiting = true;
                    $('form[form-smartcaptchawaiting]').removeAttr('form-smartcaptchawaiting');
                    curForm.attr('form-smartcaptchawaiting', 'false');

                    if (!window.smartCaptcha) {
                        alert('Сервис временно недоступен');
                        return;
                    }
                    var curID = $(this).attr('data-smartid');
                    window.smartCaptcha.execute(curID);
                } else {
                    curForm.removeAttr('form-smartcaptchawaiting');
                }
            });

            if (!smartCaptchaWaiting) {

                if ($(form).hasClass('ajax-form')) {
                    windowOpen($(form).attr('action'), false, new FormData(form));
                } else {
                    form.submit();
                }

            }
        }
    });
}

var smartCaptchaKey = 'uahGSHTKJqjaJ0ezlhjrbOYH4OxS6zzL9CZ47OgY';

function smartCaptchaLoad() {
    $('.captcha-container').each(function() {
        if (!window.smartCaptcha) {
            return;
        }
        var curID = window.smartCaptcha.render(this, {
            sitekey: smartCaptchaKey,
            callback: smartCaptchaCallback,
            invisible: true,
            hideShield: true,
        });
        $(this).attr('data-smartid', curID);
    });
}

function smartCaptchaCallback(token) {
    $('form[form-smartcaptchawaiting]').attr('form-smartcaptchawaiting', 'true');
    $('form[form-smartcaptchawaiting] input[type="submit"]').trigger('click');
}