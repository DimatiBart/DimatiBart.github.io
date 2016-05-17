/**
 * Checkout Validation
 */

/* Creadit card number validator */
var creditCardNumberValidator = {
    validate: function(options) {
        var cardNumber = options.cardNumber,
            cardCode = options.cardCode,
            cardNumberLength = cardNumber.length,
            result = true;

        if (!cardCode) return false; // credit card should be choosen firstly
        if (!this._isChecksumValid(cardNumber)) return false;

        var thirteen = 13, fifteen = 15, sixteen = 16;
        if ("AX" === cardCode) {
            var prefix = "34,37,",
                cardPrefix = cardNumber.substring(0, 2) + ",";
            result = prefix.indexOf(cardPrefix) !== -1 && cardNumberLength === fifteen;
        } else if ("CA" === cardCode) {
            var prefix = "51,52,53,54,55,",
                cardPrefix = cardNumber.substring(0, 2) + ",";
            result = prefix.indexOf(cardPrefix) !== -1 && cardNumberLength === sixteen;
        } else if ("VI" === cardCode || "VD" === cardCode) {
            var prefix = "4";
            result = cardNumber.substring(0, 1) === prefix
            && (cardNumberLength === thirteen || cardNumberLength === sixteen);
        } else if ("MD" === cardCode) {
            var prefix = "5,6,",
                cardPrefix = cardNumber.substring(0, 1) + ",";
            result = prefix.indexOf(cardPrefix) !== -1 && cardNumberLength === sixteen;
        }
        return result;
    },
    _isChecksumValid: function(cardNumber) {
        var nine = 9, ten = 10, thirteen = 13, nineteen = 19,
            cardNumberLength = cardNumber.length;
        if (cardNumberLength < thirteen
            || cardNumberLength > nineteen) return false;
        var oddOrEven = cardNumberLength & 1,
            sum = 0;
        for (var count = 0; count < cardNumberLength; count++) {
            var digit = parseInt(cardNumber.charAt(count));
            // Check if number otherwise it's invalid
            if (isNaN(digit)) return false;

            if (((count & 1) ^ oddOrEven) == 0) { // not
                digit *= 2;
                if (digit > nine) digit -= nine;
            }
            sum += digit;
        }

        return (sum == 0) ? false : (sum % ten == 0);
    }
};

/* Integer validator */
var integerValidator = {
    validate: function(options) {
        var val = options.fieldVal;
        if (!this._isAllDigits(val)) return false;
        var iVal = parseInt(val);
        if (isNaN(iVal)
            || !(iVal >= -2147483648 && iVal <= 2147483647))
            return false;
        return true;
    },
    _isAllDigits: function(argvalue) {
        argvalue = argvalue.toString();
        var validChars = "0123456789",
            startFrom = 0;
        if (argvalue.substring(0, 2) == "0x") {
            validChars = "0123456789abcdefABCDEF";
            startFrom = 2;
        } else if (argvalue.charAt(0) == "0") {
            validChars = "01234567";
            startFrom = 1;
        } else if (argvalue.charAt(0) == "-") {
            startFrom = 1;
        }

        for (var n = startFrom; n < argvalue.length; n++) {
            if (validChars.indexOf(argvalue.substring(n, n+1)) == -1) return false;
        }
        return true;
    }
};

/* Card cvv number validator */
var cardCvvNumberValidator = {
    validate: function(options) {
        var cardCode = options.cardCode,
            cvvNumber = options.cvvNumber,
            map = options.secureCodeLengthMap,
            expectedLength = map[cardCode];
        return expectedLength === 0 || cvvNumber.toString().length === expectedLength;
    }
};

/* Post code validator */
var postcodeValidator = {
    validate: function(options) {
        var ccode = options.countryCode,
            list = options.countryCodesPostcodeRequired,
            postcode = options.postcode;
        for (var i = 0, length = list.length; i < length; i++) {
            if (list[i] === ccode)
                return postcode && $.trim(postcode).length !== 0; // not empty
        }
        return true;
    }
};

/* Mandatory state validator */
var mandatoryStateValidator = {
    validate: function(options) {
        var state = options.state,
            states = options.statesMap[options.countryCode];
        if (states && states.length)
            return state && $.trim(state).length !== 0; // not empty
        return true;
    }
};

/* Pattern validator */
var patternValidator = {
    validate: function(options) {
        var val = options.fieldVal,
            regex = options.pattern;
        return regex.test(val);
    }
};

/* ISIC number validator*/
var isicNumberValidator = {
    validate: function isicValidation(options){
        var value = options.icisNumber;
        var numberStr = value.substring(1);
        var characterStr = value.substring(0,1);
        var textPattern = /[^a-zA-Z]/;
        var numberPattern = /[^0-9]/;
        var result = true;
        if( numberPattern.test(numberStr) == true || textPattern.test(characterStr) == true ){
            result = false;
        }
        return result;
    }

};

/* Expiry date validator */
var expiryDateValidator = {
    validate: function(options) {
        var dayRequired = !!options.day,
            day = dayRequired && parseInt(options.day),
            month = parseInt(options.month),
            year = parseInt(options.year);
        if (isNaN(month) || isNaN(year) || (dayRequired && isNaN(day))) return true; // validate only if date has fully defined
        this._clearValidationResult(options);
        // Date constructor get month from 0 to 11, but from form we get month in 1 to 12 range
        // So if there is no day in form then we can pass month as is
        var maxExpiryTime = new Date(year, dayRequired ? month - 1 : month, dayRequired ? day : 1).getTime() - 1,
            now = new Date().getTime(),
            res = maxExpiryTime > now;
        if (res) this.onSuccess(options);
        else this.onError(options);
        return res;
    },
    onError: function(options) {
        var $dayEl = $(options.daySelector),
            $monthEl = $(options.monthSelector),
            $yearEl = $(options.yearSelector);
        $dayEl.closest('.customSelect').addClass('errorSelect');
        $monthEl.closest('.customSelect').addClass('errorSelect');
        $yearEl.closest('.customSelect').addClass('errorSelect');
    },
    onSuccess: function(options) {
        var $dayEl = $(options.daySelector),
            $monthEl = $(options.monthSelector),
            $yearEl = $(options.yearSelector);
        $dayEl.closest('.customSelect').addClass('validSelect');
        $monthEl.closest('.customSelect').addClass('validSelect');
        $yearEl.closest('.customSelect').addClass('validSelect');
    },
    _clearValidationResult: function(options) {
        var $dayEl = $(options.daySelector),
            $monthEl = $(options.monthSelector),
            $yearEl = $(options.yearSelector);
        $dayEl.closest('.customSelect').removeClass('errorSelect');
        $monthEl.closest('.customSelect').removeClass('errorSelect');
        $yearEl.closest('.customSelect').removeClass('errorSelect');
        $monthEl.closest('.formRow').find('.errorBox').remove();
    }
};

/* Card's start date require validator */
var cardStartDateRequireValidator = {
    validate: function(options) {
        var val = options.fieldVal,
            required = options.displayStartDate;
        return required ? val && $.trim(val).length !== 0 : true;
    }
};

/* Card's start date validator */
var cardStartDateValidator = {
    validate: function(options) {
        var required = options.displayStartDate;
        if (!required) return true;
        var month = parseInt(options.month),
            year = parseInt(options.year);
        if (isNaN(month) || isNaN(year)) return true; // validate only if date has fully defined
        this._clearValidationResult();
        var startTime = new Date(year, month, 1).getTime(),
            now = new Date().getTime(),
            res = startTime <= now;
        if (res) this.onSuccess();
        else this.onError();
        return res;
    },
    onError: function() {
        var $monthEl = $('.cardDetailsForm .cardStartMonthSelect'),
            $yearEl = $('.cardDetailsForm .cardStartYearSelect');
        $monthEl.closest('.customSelect').addClass('errorSelect');
        $yearEl.closest('.customSelect').addClass('errorSelect');
    },
    onSuccess: function() {
        var $monthEl = $('.cardDetailsForm .cardStartMonthSelect'),
            $yearEl = $('.cardDetailsForm .cardStartYearSelect');
        $monthEl.closest('.customSelect').addClass('validSelect');
        $yearEl.closest('.customSelect').addClass('validSelect');
    },
    _clearValidationResult: function() {
        var $monthEl = $('.cardDetailsForm .cardStartMonthSelect'),
            $yearEl = $('.cardDetailsForm .cardStartYearSelect');
        $monthEl.closest('.customSelect').removeClass('errorSelect');
        $yearEl.closest('.customSelect').removeClass('errorSelect');
        $monthEl.closest('.formRow').find('.errorBox.cardStartMonthSelectError,.errorBox.cardStartYearSelectError').remove();
    }
};

/** Traveller full name max length validator **/
var travellerMaxFullNameValidator = {
    validate: function(options, field, errMsg) {
        var fname = $.trim(options.firstName),
            mname = $.trim(options.middleName),
            lname = $.trim(options.lastName),
            fullNameParts = mname.length === 0 ? [fname, lname] : [fname, mname, lname],
            fullNameLength = fullNameParts.join(" ").length,
            res = fullNameLength <= options.maxLength;
        return res;
    },
    doValidate: function(options, field) {
        var fname = $.trim(options.firstName),
            mname = $.trim(options.middleName),
            lname = $.trim(options.lastName),
            $formEl = field.closest('.travellerForm'),
            $firstNameRow = $formEl.find('.firstNameInput').closest('.formRow'),
            $middleNameRow = $formEl.find('.middleNameInput').closest('.formRow'),
            $lastNameRow = $formEl.find('.lastNameInput').closest('.formRow');
        // validate only if name has fully defined and parts are separately valid
        return fname.length !== 0 && !$firstNameRow.hasClass('errorRow')
            && lname.length !== 0 && !$lastNameRow.hasClass('errorRow')
            && (mname.length === 0 || (mname.length !== 0 && !$middleNameRow.hasClass('errorRow')));
    },
    clearValidationResult: function(field) {
        var $nameEls = field.closest('.travellerForm').find('.firstNameInput,.middleNameInput,.lastNameInput');
        $nameEls.closest('.formRow').removeClass('nameLengthError validRow')
            .find('.errorBox.fullNameError')
            .remove();
    },
    onError: function(field, errMsg) {
        var $fields = this._getFields(field),
            $fieldRows = $fields.closest('.formRow');

        $fieldRows.addClass('nameLengthError');
        $fieldRows.append(checkout_validation.errorBox_tmpl);
        var errorBox = $fieldRows.find('.errorBox.tmpl').removeClass('tmpl').addClass('fullNameError');
        errorBox.find('.errorText').html(errMsg);
    },
    onSuccess: function(field) {
        var $fields = this._getFields(field);
        $fields.closest('.formRow').addClass('validRow');
        $fields.addClass('validField');
    },
    _getFields: function(field) {
        var $form = field.closest('.travellerForm'),
            $middleNameInput = $form.find('.middleNameInput'),
            middleNameEmpty = $.trim($middleNameInput.val()).length === 0;
        return middleNameEmpty
            ? $form.find('.firstNameInput,.lastNameInput')
            : $form.find('.firstNameInput,.middleNameInput,.lastNameInput');
    }
};

var checkout_validation = {

    emptyValidation: function(field, settings){
        var emptyCheck = true,
            isAllowedEmpty = settings.isAllowedEmpty,
            emptyErrorMsg = settings.emptyErrorMsg,
            skipCheckOnOptional = settings.skipCheckOnOptional;

        if( isAllowedEmpty == false ) {
            if (!field.val() || $.trim(field.val()).length == 0 ){
                this.showError(emptyErrorMsg,field);
                emptyCheck = false;
            }
        }
        if( isAllowedEmpty == true && !skipCheckOnOptional){
            if ($.trim(field.val()).length > 0 ){
                field.removeClass('optionalField');
            }
            else {
                field.addClass('optionalField');
            }
        }
        return emptyCheck;
    },

    lengthValidation: function(field,lengthErrorMsg,maxLength,minLength,minLengthErrorMsg){
        var lengthCheck = true;
        if( minLength != false && minLengthErrorMsg != false ){
            if( field.val().length < parseInt(minLength) ){
                this.showError(minLengthErrorMsg, field);
                lengthCheck = false;
            }
            else {
                if( field.val().length > parseInt(maxLength) ){
                    this.showError(lengthErrorMsg, field);
                    lengthCheck = false;
                }
            }
        }
        else {
            if( field.val().length > parseInt(maxLength) ){
                this.showError(lengthErrorMsg, field);
                lengthCheck = false;
            }
        }
        return lengthCheck;
    },

    patternValidation: function(field,pattern,patternErrorMsg){
        var patternCheck = true;
        if( pattern && pattern.test(field.val()) == true ){
            checkout_validation.showError(patternErrorMsg,field);
            patternCheck = false;
        }
        return patternCheck;
    },

    emailPatternValidation: function(field,pattern,patternErrorMsg){
        var patternCheck = true;
        if( pattern.test(field.val()) == false ){
            checkout_validation.showError(patternErrorMsg,field);
            patternCheck = false;
        }
        return patternCheck;
    },

    emailCompareValidation: function(field,compareErrorMsg){
        var compareCheck = true;
        var email = field.closest('.contentForm ').find('.emailInput');
        var confirmEmail = field;
        if( confirmEmail.val().toLowerCase() != email.val().toLowerCase() ){
            checkout_validation.showError(compareErrorMsg,confirmEmail);
            compareCheck = false;
        }
        return compareCheck;
    },

    selectValidation: function(field, settings) { // may be need refactoring
        var defValue = settings.defValue,
            errorMsg = settings.errorMsg,
            validators = settings.validators,
            isAllowedEmpty = settings.isAllowedEmpty,
            selectCheck = true,
            isEmpty = field.val() == defValue,
            customValidation;
        errorMsg = isEmpty && !isAllowedEmpty ? errorMsg : (customValidation = this.customValidation(validators, field)).errorMsg;
        if (isEmpty && !isAllowedEmpty || !customValidation.isValid) {
            checkout_validation.showError(errorMsg,field);
            selectCheck = false;
        }
        return selectCheck;
    },

    dateSelectsValidation: function(field, settings) { // may be need refactoring
        var defValue = settings.defValue,
            errorMsg = settings.errorMsg,
            validators = settings.validators,
            isAllowedEmpty = settings.isAllowedEmpty,
            selectCheck = true,
            isEmpty = field.val() == defValue,
            customValidation;
        errorMsg = isEmpty && !isAllowedEmpty ? errorMsg : (customValidation = this.customValidation(validators, field)).errorMsg;
        if (isEmpty && !isAllowedEmpty || !customValidation.isValid) {
            checkout_validation.showError(errorMsg,field);
            field.closest('.customSelect').removeClass('validSelect').addClass('errorSelect');
            selectCheck = false;
        } else {
            field.closest('.customSelect').removeClass('errorSelect').addClass('validSelect');
        }
        return selectCheck;
    },

    checkboxValidation: function(field,errorMsg){
        var checkboxCheck = true;
        if( field.prop('checked') == false ){
            if( errorMsg != '' ) {
                var correctedErrorMsg = "(" + errorMsg + ")";
                checkout_validation.showError(correctedErrorMsg, field);
            }
            else {
                var formRow = field.closest('.formRow');
                formRow.addClass('errorRow');
            }
            checkboxCheck = false;
        }
        return checkboxCheck;
    },

    radioBtnValidation: function(field,errorMsg,settings){
        var radioBtnCheck = true;
        var fieldName = field.attr('name');
        var validationArr = [];
        if($('[name="'+ fieldName +'"]:checked').length == 0){
            if( settings.hasOwnProperty('errorDestination') ){
                checkout_validation.showDestinationError(errorMsg,field,settings.errorDestination);
            }
            else {
                checkout_validation.showError(errorMsg,field);
            }
            radioBtnCheck = false;
        }
        return radioBtnCheck;
    },

    productAssignmentValidation: function(field,fieldName,errorMsg,errorDestination){
        var productAssignmentCheck = true;
        field.closest('li').removeClass('errorItem');
        var errorList_tmpl = '<ul class="errorList ' + fieldName + 'ErrorList' + '"></ul>';
        var errorBox = $('.errorBox'+'.'+fieldName+'Error');
        var listItemText = field.closest('li').find('.listItemText').html();
        var cartItemName = field.data('item-name');
        var errorListItem = '<li data-item-name="'+ cartItemName +'">'+ listItemText + '</li>';
        if( field.prop('checked') == false && field.prop('disabled') == false ){
            field.closest('li').addClass('errorItem');
            if( errorBox.length == 0 ){
                checkout_validation.showDestinationError(errorMsg,field,errorDestination);
            }
            else {
                errorBox.find('.errorText').html(errorMsg);
            }
            if( errorBox.find('.errorList'+'.'+fieldName+'ErrorList').length == 0 ){
                errorBox.append(errorList_tmpl);
            }
            var errorList = errorBox.find('.errorList'+'.'+fieldName+'ErrorList');
            if( errorList.find('li[data-item-name="'+ cartItemName +'"]').length == 0 ){
                errorList.append(errorListItem);
            }
            productAssignmentCheck = false;
        }
        return productAssignmentCheck;
    },

    showValidHint: function(field){
        var formRow = field.closest('.formRow');
        formRow.addClass('validRow');
        field.addClass('validField');
    },

    showDateErrorHint: function(field){
        var formRow = field.closest('.formRow');
        formRow.addClass('errorDateRow');
    },

    showError: function(errorMsg,field){
        var formRow = field.closest('.formRow');
        if(formRow.hasClass('dateRow') == false){
            formRow.addClass('errorRow');
        }
        formRow.append(checkout_validation.errorBox_tmpl);
        var errorBox = formRow.find('.errorBox.tmpl').removeClass('tmpl').addClass(field.prop('name')+'Error');
        errorBox.find('.errorText').html(errorMsg);
    },

    showDestinationError: function(errorMsg,field,destinationName){
        var destination = field.closest('.panelBox').find('.'+destinationName);
        destination.prepend(checkout_validation.errorBox_tmpl);
        var errorBox = destination.find('.errorBox.tmpl').removeClass('tmpl').addClass(field.prop('name')+'Error');
        errorBox.find('.errorText').html(errorMsg);
    },

    /**
     validators - It's array where each item must have at least 3 properties:
     {
         validator: ...
         options: ...
         errorMsg: ...
     }
     */
    customValidation: function(validators, field) {
        var res = {
            isValid: true,
            hasSkip: false,
            errorMsg: null
        };
        if (validators && Object.prototype.toString.call(validators) === '[object Array]') { // validators should be array even with one item
            for (var i = 0, length = validators.length; i < length; i++) {
                var validator = validators[i].validator;
                if (typeof validator.validate !== 'function') continue;
                var opts = this._prepareCustomValidationOption(validators[i].options, field),
                    doValidate = typeof validator.doValidate === 'function' ? validator.doValidate(opts, field) : true;
                if (!doValidate) {
                    res.hasSkip = true;
                    continue;
                }
                if (typeof validator.clearValidationResult === 'function')
                    validator.clearValidationResult(field);
                var errMsg = validators[i].errorMsg,
                    isValid = validator.validate(opts, field, errMsg);
                if (!isValid) {
                    res.isValid = false;
                    res.errorMsg = errMsg;
                    if (typeof validator.onError === 'function')
                        res.onError = $.proxy(validator.onError, validator, field, errMsg);
                    break;
                } else {
                    if (typeof validator.onSuccess === 'function')
                        res.onSuccess = $.proxy(validator.onSuccess, validator, field);
                }
            }
        }
        return res;
    },

    _prepareCustomValidationOption: function(options, field) {
        if (!options || typeof options !== 'object') return options; // in case the options aren't required
        var opts = {};
        for (var k in options) {
            if (!options.hasOwnProperty(k)) continue;
            var val = options[k];
            opts[k] = typeof val === 'function' ? val(field) : val;
        }
        return opts;
    },

    clearValidationResults: function(field) {
        var fieldName = field.attr('name');
        field.removeClass('validField').closest('.formRow').removeClass('errorRow validRow errorDateRow').find('.errorBox'+'.'+fieldName+'Error').remove();
    },

    runFieldValidation: function(field){
        var validationCheck = false;
        var fieldName = field.attr('name');
        var settings;
        this.clearValidationResults(field);
        // input validation
        if(checkout_validation_settings.fieldsValidation.hasOwnProperty(fieldName)){
            settings = checkout_validation_settings.fieldsValidation[fieldName];
            // empty validation
            var emptyValidation = checkout_validation.emptyValidation(field, settings);
            if( field.hasClass('optionalField') ){
                validationCheck = true;
            }
            else {
                if(emptyValidation == true){
                    var minLength = false;
                    var minLengthErrorMsg = false;
                    if( settings.hasOwnProperty('minLength') && settings.hasOwnProperty('minLengthErrorMsg') ){
                        minLength = settings.minLength;
                        minLengthErrorMsg = settings.minLengthErrorMsg;
                    }
                    // length validation
                    var lengthValidation = checkout_validation.lengthValidation(field,settings.lengthErrorMsg,settings.maxLength,minLength,minLengthErrorMsg);
                    if( lengthValidation == true ){
                        // pattern validation
                        var patternValidation = checkout_validation.patternValidation(field,settings.pattern,settings.patternErrorMsg);
                        if( patternValidation == true ) {
                            // custom validation
                            var customValidation = checkout_validation.customValidation(settings.validators, field);
                            if (customValidation.hasSkip) return validationCheck;
                            if (customValidation.isValid) {
                                validationCheck = true;
                                if (typeof customValidation.onSuccess === 'function')
                                    customValidation.onSuccess();
                                else
                                    checkout_validation.showValidHint(field);
                            } else {
                                if (typeof customValidation.onError === 'function')
                                    customValidation.onError();
                                else
                                    this.showError(customValidation.errorMsg, field);
                            }
                        }
                    }
                }
            }
        }
        // select validation
        if(checkout_validation_settings.selectValidation.hasOwnProperty(fieldName)){
            settings = checkout_validation_settings.selectValidation[fieldName];
            if( field.closest('.formRow').hasClass('dateRow') ){
                // date selects
                field.closest('.customSelect').removeClass('errorSelect');
                var dateSelectValidation = checkout_validation.dateSelectsValidation(field, settings);
                var dateformRow = field.closest('.formRow');
                var date_selects_total = dateformRow.find('.customSelect').length;
                var valid_date_selects = dateformRow.find('.customSelect.validSelect').length;
                var error_date_selects = dateformRow.find('.customSelect.errorSelect').length;
                if( dateSelectValidation == true ){
                    field.addClass('validField');
                    validationCheck = true;
                    if(date_selects_total == valid_date_selects){
                        checkout_validation.showValidHint(field);
                    }
                }
                if( error_date_selects > 0) {
                    checkout_validation.showDateErrorHint(field);
                }
            }
            else {
                // select
                var selectValidation = checkout_validation.selectValidation(field, settings);
                if( selectValidation == true ){
                    checkout_validation.showValidHint(field);
                    validationCheck = true;
                }
            }

        }
        // email validation
        if(checkout_validation_settings.emailValidation.hasOwnProperty(fieldName)){
            settings = checkout_validation_settings.emailValidation[fieldName];
            // empty validation
            var emptyValidation = checkout_validation.emptyValidation(field, settings);
            if(emptyValidation == true){
                var minLength = false;
                var minLengthErrorMsg = false;
                if( settings.hasOwnProperty('minLength') && settings.hasOwnProperty('minLengthErrorMsg') ){
                    minLength = settings.minLength;
                    minLengthErrorMsg = settings.minLengthErrorMsg;
                }
                // length validation
                var lengthValidation = checkout_validation.lengthValidation(field,settings.lengthErrorMsg,settings.maxLength,minLength,minLengthErrorMsg);
                if( lengthValidation == true ){
                    // pattern validation
                    var patternValidation = checkout_validation.emailPatternValidation(field,settings.pattern,settings.patternErrorMsg);
                    if( patternValidation == true ){
                        // email confirmation validation
                        if( fieldName == 'confirmEmailInput' ){
                            var emailCompareValidation = checkout_validation.emailCompareValidation(field,settings.compareErrorMsg);
                            if( emailCompareValidation == true ){
                                checkout_validation.showValidHint(field);
                                validationCheck = true;
                            }
                        }
                        else {
                            checkout_validation.showValidHint(field);
                            validationCheck = true;
                        }

                    }
                }
            }
        }
        // checkbox validation
        if(checkout_validation_settings.checkboxValidation.hasOwnProperty(fieldName)){
            settings = checkout_validation_settings.checkboxValidation[fieldName];
            var checkboxValidation = checkout_validation.checkboxValidation(field,settings.errorMsg);
            if( checkboxValidation == true ){
                field.addClass('validField');
                validationCheck = true;
            }
        }
        // radioBtn validation
        if(checkout_validation_settings.radioBtnValidation.hasOwnProperty(fieldName)){
            $('.errorBox'+'.'+fieldName+'Error').remove();
            settings = checkout_validation_settings.radioBtnValidation[fieldName];
            var radioBtnValidation = checkout_validation.radioBtnValidation(field,settings.errorMsg,settings);
            if( radioBtnValidation == true ){
                field.addClass('validField');
                validationCheck = true;
            }
        }

        // product assignment validation
        if(checkout_validation_settings.productAssignmentValidation.hasOwnProperty(fieldName)){
            var cartItemCheckbox =  $('.cartItemCheckbox');
            var cartItemCheckboxChecker = [];
            for( var f = 0; f < cartItemCheckbox.length; f++ ){
                if( cartItemCheckbox.eq(f).prop('checked') == false && cartItemCheckbox.eq(f).prop('disabled') == false ){
                    cartItemCheckboxChecker.push(false);
                    break;
                }
            }
            if( cartItemCheckboxChecker.length == 0 ){
                $('.errorBox'+'.'+fieldName+'Error').remove();
            }
            $('.assignCartItemsSection').eq(0).find('.cartItemCheckbox').each(function(){
                var cartItemName = $(this).data('item-name');
                var checkboxGroupChecker = [];
                var cartItemCheckbox = $('.cartItemCheckbox[data-item-name="'+ cartItemName +'"]');
                for( var l=0; l<cartItemCheckbox.length; l++ ){
                    if( cartItemCheckbox.eq(l).prop('checked') == false && cartItemCheckbox.eq(l).prop('disabled') == false ){
                        checkboxGroupChecker.push(false);
                        break;
                    }
                }
                if( checkboxGroupChecker.length == 0 ){
                    $('.cartItemCheckboxErrorList').find('li[data-item-name="'+ cartItemName +'"]').remove();
                }
            });

            settings = checkout_validation_settings.productAssignmentValidation[fieldName];
            var productAssignmentValidation = checkout_validation.productAssignmentValidation(field,fieldName,settings.errorMsg,settings.errorDestination);
            if( productAssignmentValidation == true ){
                validationCheck = true;
            }
        }
        return validationCheck;
    },

    errorBox_tmpl: '<div class="errorBox clearfix tmpl">' +
    '<p class="errorText"></p>' +
    '</div>'
};

$(document).ready(function(){

    (function(){
        for(var validationField in checkout_validation_settings.fieldsValidation){
            $(document).on('focusout.startFieldValidation','.'+validationField,function(){
                var field = $(this);
                checkout_validation.runFieldValidation(field);
            });
        }
        for(var validationSelect in checkout_validation_settings.selectValidation){
            $(document).on('change.startSelectValidation focusout.startValidation','.'+validationSelect,function(){
                var field = $(this);
                checkout_validation.runFieldValidation(field);
            });
        }
        for(var validationEmailField in checkout_validation_settings.emailValidation){
            $(document).on('focusout.startEmailValidation','.'+validationEmailField,function(){
                var field = $(this);
                checkout_validation.runFieldValidation(field);
            });
        }
        for(var validationCheckbox in checkout_validation_settings.checkboxValidation){
            $(document).on('change.startCheckboxValidation','.'+validationCheckbox,function(){
                var field = $(this);
                checkout_validation.runFieldValidation(field);
            });
        }
    }());

});