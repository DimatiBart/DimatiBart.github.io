/**
 * checkoutPage.js
 */

$(document).ready(function(){

    /*
     * Fare Term&Condition response variable
     ****************************************
     */
    var fareTermsHTML;

    /*
     * assignCartItemsSection
     ****************************************
     */
    // isicCheckbox
    $(document).on('change.isicCheckboxChange','.assignCartItemsSection .isicCheckbox', function(){
        toggleCartItemTooltip($(this));
        var schoolNameBox = $(this).closest('li').find('.schoolNameBox');
        var schoolNameCheckbox = schoolNameBox.find('.schoolNameCheckbox');
        var schoolNameInput = schoolNameBox.find('.schoolNameInput');
        if( $(this).prop('checked') == true ){
            schoolNameCheckbox.addClass('validationControl');
            schoolNameInput.addClass('validationControl');
        }
        else {
            schoolNameCheckbox.removeClass('validationControl').prop('checked',false).trigger('change.checkboxChange');
            schoolNameInput.removeClass('validationControl').val('');
        }
    });
    $('.assignCartItemsSection .isicCheckbox').trigger('change.isicCheckboxChange');

    // australia visa
    $(document).on('change.visaCheckboxChange','.assignCartItemsSection .visaCheckbox', function(){
        toggleCartItemTooltip($(this));
        var passportInfoBox = $(this).closest('li').find('.passportInfoBox');
        var passportNumberInput = passportInfoBox.find('.passportNumberInput');
        var nationalitySelect = passportInfoBox.find('.nationalitySelect');
        var dateSelect = passportInfoBox.find('.dateSelect');
        var monthSelect = passportInfoBox.find('.monthSelect');
        var yearSelect = passportInfoBox.find('.yearSelect');
        var passportIssuePlaceInput = passportInfoBox.find('.passportIssuePlaceInput');
        var passportBirthPlaceInput = passportInfoBox.find('.passportBirthPlaceInput');
        if( $(this).prop('checked') == true ){
            passportInfoBox.find('.forValidation').addClass('validationControl');
        }
        else {
            passportNumberInput.removeClass('validationControl').val('');
            nationalitySelect.removeClass('validationControl').find('option[value=""]').prop('selected',true);
            dateSelect.removeClass('validationControl').find('option[value=""]').prop('selected',true).closest('.customSelect').removeClass('errorSelect');
            monthSelect.removeClass('validationControl').find('option[value=""]').prop('selected',true).closest('.customSelect').removeClass('errorSelect');
            yearSelect.removeClass('validationControl').find('option[value=""]').prop('selected',true).closest('.customSelect').removeClass('errorSelect');
            passportIssuePlaceInput.removeClass('validationControl').val('');
            passportBirthPlaceInput.removeClass('validationControl').val('');
        }
    });
    $('.assignCartItemsSection .visaCheckbox').trigger('change.visaCheckboxChange');

    // secure flights
    $(document).on('change.flightCheckboxChange','.assignCartItemsSection .flightCheckbox', function(){
        toggleCartItemTooltip($(this));
        var genderSelect = $(this).closest('li').find('.genderSelect');
        var redressNumberCheckbox = $(this).closest('li').find('.redressNumberCheckbox');
        var titleSelect = $(this).closest('.travellerSection').find('.titleSelect');
        if( $(this).prop('checked') == true ){
            genderSelect.addClass('validationControl');
        }
        else {
            titleSelect.trigger('change.titleChange');
            genderSelect.removeClass('validationControl');
            redressNumberCheckbox.prop('checked',false).trigger('change.redressNumberCheckbox').trigger('change.checkboxChange');
        }
    });
    $('.assignCartItemsSection .flightCheckbox').trigger('change.flightCheckboxChange');

    function toggleCartItemTooltip(checkbox){
        var tooltipBox = checkbox.closest('li').find('.cartItemTooltipBox');
        if( checkbox.prop('checked') == true ){
            tooltipBox.stop().slideDown(250,function(){
                $(this).css('height','auto');
            });
        }
        else {
            tooltipBox.stop().slideUp(250);
            tooltipBox.find('.formRow').removeClass('errorRow validRow errorDateRow').find('.errorBox').remove();
            tooltipBox.find('.dateRow').find('.errorBox').remove();
        }
    }

    $(document).on('change.cartItemCheckboxChange','.cartItemCheckbox ', function(){
        var checkbox = $(this);
        if( checkbox.prop('checked') == true || checkbox.prop('disabled') == true ){
            checkbox.closest('li').removeClass('errorItem');
        }
    });

    $('input.cartItemCheckbox:disabled').closest('.customCheckbox').addClass('disabled').closest('li').addClass('disabled withHelpText');

    $(document).on('click.cartItemCheckboxClick','.cartItemCheckbox ', function(){
        showUnassignedItemsMsg(checkout_validation_settings.productAssignmentValidation.cartItemCheckbox.errorMsg2);
    });


    /*
     * showUnassignedItemsMsg
     ****************************************
     */
    function showUnassignedItemsMsg(errorMsg){
        var assignCartItemsSection = $('.assignCartItemsSection').eq(0);
        var cartItemCheckboxError = $('.cartItemCheckboxError');
        var unassignedItemsMsgBox = $('.errorBox.unassignedItemsMsgBox');
        var checkboxGroupChecker = [];
        var errorBox_tmpl = '<div class="errorBox unassignedItemsMsgBox clearfix tmpl">' +
            '<p class="errorText"></p>' +
            '</div>';
        unassignedItemsMsgBox.remove();
        cartItemCheckboxError.remove();
        assignCartItemsSection.find('.cartItemCheckbox').each(function(){
            var cartItemName = $(this).data('item-name');
            var cartItemCheckbox = $('.cartItemCheckbox[data-item-name="'+ cartItemName +'"]');
            for( var i=0; i<cartItemCheckbox.length; i++ ){
                if( cartItemCheckbox.eq(i).prop('checked') == false && cartItemCheckbox.eq(i).prop('disabled') == false ){
                    checkboxGroupChecker.push(false);
                    break;
                }
            }
        });
        if( checkboxGroupChecker.length > 0 ){
            $('.travellerPanel').find('.panelFooter').prepend(errorBox_tmpl);
            var errorBox = $('.unassignedItemsMsgBox.tmpl');
            errorBox.find('.errorText').html(errorMsg);
            errorBox.stop().fadeIn(300,function(){
                $(this).removeClass('tmpl');
            })
        }
    }
    showUnassignedItemsMsg(checkout_validation_settings.productAssignmentValidation.cartItemCheckbox.errorMsg2);

    /*
     * Traveller Summary
     ****************************************
     */
    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(toggleDetailsSummaryBox);
        toggleDetailsSummaryBox(mql_640);
    }());

    function toggleDetailsSummaryBox(mql) {
        var detailsSummaryBox = $('.detailsSummaryBox');
        var toggleBtn = detailsSummaryBox.find('.detailsToggleBtn');
        var toggledContent = detailsSummaryBox.find('.boxContent');
        if (mql.matches) {
            toggledContent.stop().slideDown(250);
        } else {
            toggledContent.stop().slideUp(250);
            toggleBtn.removeClass('open');
        }
    }

    /*
     * Traveller Summary detailsToggleBtn
     ****************************************
     */
    $(document).on('click.detailsToggle','.detailsSummaryBox .detailsToggleBtn',function(){
        var toggleBtn = $(this);
        var toggledContent = toggleBtn.closest('.detailsSummaryBox').find('.boxContent');
        toggleBtn.toggleClass('open');
        toggledContent.stop().slideToggle(250);
    });

    /*
     * Secure Flights
     ****************************************
     */
    $(document).on('change.redressNumberCheckbox','.secureFlightsForm .redressNumberCheckbox',function(){
        var checkbox = $(this);
        var redressNumberRow = checkbox.closest('.secureFlightsForm').find('.redressNumberRow');
        var redressNumberInput = checkbox.closest('.secureFlightsForm').find('.redressNumberInput');
        if( checkbox.prop('checked') == true ){
            redressNumberRow.stop().slideDown(200);
            redressNumberInput.addClass('validationControl');
        }
        else {
            redressNumberRow.stop().slideUp(200,function(){
                redressNumberInput.removeClass('validationControl').val('');
                $(this).removeClass('errorRow validRow').find('.errorBox').remove();
            });
        }
    });

    /*
     * toggleSectionBtn
     **********************************************
     */
    $(document).on('click.toggleSection','.toggledSection .toggleSectionBtn',function(){
        var toggledSectionContent = $(this).closest('.toggledSection').find('.toggledSectionContent');
        $(this).toggleClass('open');
        toggledSectionContent.stop().slideToggle(350);
    });

    /*
     * Redress number gender select
     ****************************************
     */
    $(document).on('change.titleChange','select.titleSelect ',function(){
        var femaleArr = ['MRS','MISS','MS'];
        var maleArr = ['MR'];
        var genderSelect = $(this).closest('.travellerSection').find('select.genderSelect');
        for( var i=0; i<femaleArr.length; i++ ){
            if( femaleArr[i] == $(this).val() ){
                genderSelect.find('option[value="F"]').prop('selected',true).trigger('change.customSelectChange');
                checkout_validation.runFieldValidation(genderSelect);
                break;
            }
        }
        for( var j=0; j<maleArr.length; j++ ){
            if( maleArr[j] == $(this).val() ){
                genderSelect.find('option[value="M"]').prop('selected',true).trigger('change.customSelectChange');
                checkout_validation.runFieldValidation(genderSelect);
                break;
            }
        }
    });

    /*
     * date selects
     ****************************************
     */
    $(document).on('change.monthChange','.dateRow select.monthSelect',function(event){
        changeNumberOfDays(event);
    });
    $(document).on('change.yearChange','.dateRow select.yearSelect',function(event){
        changeNumberOfDays(event);
    });

    function changeNumberOfDays(event){
        var dateRow = $(event.target).closest('.dateRow');
        var dateSelect = dateRow.find('select.dateSelect');
        var monthSelect = dateRow.find('select.monthSelect');
        var yearSelect = dateRow.find('select.yearSelect');
        var dayInMonth = 31;
        var minNumberOfdays = 28;
        for( var j=minNumberOfdays; j<=dayInMonth; j++ ){
            if( dateSelect.find('option[value="'+ j +'"]').length == 0 ){
                var option_tmpl = '<option class="tmpl" value=""></option>';
                dateSelect.append(option_tmpl);
                dateSelect.find('option.tmpl').removeClass('tmpl').val(j).html(j);
            }
        }
        if( yearSelect.val() != '' && monthSelect.val() != '' ){
            var year = parseInt(yearSelect.val());
            var month = parseInt(monthSelect.val()) - 1;
            var monthStart = new Date(year, month, 1);
            var monthEnd = new Date(year, month + 1, 1);
            var monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
            for( var i=dayInMonth; i>monthLength; i-- ){
                if( dateSelect.find('option:selected').val() == i ){
                    dateSelect.find('option[value="'+ (i-1) +'"]').prop('selected',true);
                }
                dateSelect.find('option[value="'+ i +'"]').remove();
            }
            if( dateSelect.find('option:selected').css('display') == 'none' ){
                dateSelect.find('option:selected').prop('selected',false);
                checkout_validation.runFieldValidation(dateSelect);
            }
            checkout_validation.runFieldValidation(dateSelect);
        }
    }

    /*
     * revealMoreLink
     ***************************************
     */
    $(document).on('click.revealMore','.revealMoreLink',function(event){
        event.preventDefault();
        var revealMoreBox = $(this).closest('.travellerCardPurchaseSection').find('.revealMoreBox');
        revealMoreBox.stop().slideToggle(200);
    });

    function clearStateZip() {
        var $stateEl = $('.addressDetailsForm .stateAddressSelect'),
            $zipEl = $('.addressDetailsForm .postcodeAddressInput');
        $stateEl.val("");
        checkout_validation.clearValidationResults($stateEl);
        $zipEl.val("");
        checkout_validation.clearValidationResults($zipEl);
    }

    function populateStates(countryCode) {
        var stateEl = $('.addressDetailsForm .stateAddressSelect')[0],
            statesArray = statesMap[countryCode],
            $formRowEl = $(stateEl).closest('.formRow');
        stateEl.options.length = 0;
        // selectStateMessage is defined in B.paymentDetailsLogic.inc and corresponds 'newcheckout.paymentDetails.address.state.select' resource bundle
        stateEl.options[0] = new Option(selectStateMessage, "");
        if (!statesArray || statesArray.length === 0) {
            stateEl.disabled = true;
            $formRowEl.hide();
        } else {
            stateEl.disabled = false;
            $formRowEl.show();
            for (i = 0; i < statesArray.length; i++) {
                stateEl.options[i + 1] = statesArray[i];
            }
        }
        clearStateZip();
    }

    /*
     * Address details
     * Change country event handler
     */
    $(document).on('change.countryAddressSelect', '.addressDetailsForm .countryAddressSelect', function() {
        var countryCode = $(this).val();
        populateStates(countryCode);
    });
    $('.addressDetailsForm .countryAddressSelect').trigger('change.countryAddressSelect');

    /*
     * promoCodeToggleBtn
     ***************************************
     */
    $(document).on('click.togglePromoCode','.promoCodeToggleBtn',function(){
        var promoCodeForm = $(this).closest('.promoCodeBox').find('.promoCodeForm');
        promoCodeForm.stop().slideToggle(250);
        $(this).toggleClass('open');
    });

    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(promoCodeToggleBtnHandler);
        //promoCodeToggleBtnHandler(mql_640);
    }());

    function promoCodeToggleBtnHandler(mql) {
        var promoCodeToggleBtn = $('.promoCodeToggleBtn');
        var promoCodeForm = promoCodeToggleBtn.closest('.promoCodeBox').find('.promoCodeForm');
        promoCodeToggleBtn.removeClass('open');
        if (mql.matches) {
            promoCodeToggleBtn.hide();
            promoCodeForm.stop().slideDown(250);
        } else {
            promoCodeToggleBtn.show();
            promoCodeForm.stop().slideUp(250);
        }
    }

    /*
     * paymentMethodRadioBtn
     ***************************************
     */
    $(document).on('change.paymentMethod','.paymentMethodRadioBtn',function(){
        var checkedRadio = $('.paymentMethodRadioBtn:checked');
        var paymentMethodText = checkedRadio.closest('.paymentMethodLabel').find('.paymentResultText').html();
        $('.paymentMethodLabel').removeClass('selected');
        checkedRadio.closest('.paymentMethodLabel').addClass('selected');
        if( paymentMethodText != undefined && paymentMethodText != '' ){
            var paymentMethodInfoBox = '<div class="paymentMethodInfoBox"><p>' + paymentMethodText + '</p></div>';
            $('.paymentMethodInfoBox').remove();
            $('.paymentMethodSection').append(paymentMethodInfoBox);
        }
    });
    $('.paymentMethodRadioBtn').trigger('change.paymentMethod');

    /*
     * paymentMethodBox height
     ***************************************
     */
    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(setPaymentMethodBox);
        setPaymentMethodBox(mql_640);
    }());

    /*
     * sidebar
     ***************************************
     */
    $(document).on('click.toogleSidebar','.sidebarToggleBtn, .sidebarToggleElement',function(){
        var toggleSection = $('.sidebarToggleSection');
        toggleSection.stop().slideToggle(400);
        $(this).toggleClass('open');
    });

    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(toggleSidebar);
        toggleSidebar(mql_640);
    }());

    function toggleSidebar(mql) {
        var toggleSection = $('.sidebarToggleSection');
        var sidebarToggleBtn = $('.sidebarToggleBtn');
        if (mql.matches) {
            toggleSection.stop().show();
        } else {
            toggleSection.stop().hide();
        }
        sidebarToggleBtn.removeClass('open');
    }

    /* Should create global prices object before shippingMethod and paymentMethod triggers */
    pricesObj = calculatePricesObj();

    /*
     * shippingMethodsRadioBtn
     ***************************************
     */
    $(document).on('change.shippingMethod', '.shippingMethodsRadioBtn', function () {
        var $this = $(this);
        if ($this.prop('checked')) {
            var price = $this.data('shipping-method-price');
            updateTotalPriceByVarItem(price, 'shippingMtd');
        }
    });
    // should precede to the paymentMethod trigger
    $('.shippingMethodsRadioBtn:checked').trigger('change.shippingMethod');

    /*
     * paymentMethodsRadioBtn
     ***************************************
     */
    $(document).on('change.paymentMethod', '.paymentMethodRadioBtn', function () {
        var $this = $(this);
        if ($this.prop('checked')) {
            var totalPrice = getNumber($this.data('total-price'), 'Total price is not a number');
            updateTotalPriceHtml(totalPrice);
        }
    });
    $('.paymentMethodRadioBtn:checked').trigger('change.paymentMethod');

    function toggleStartDateSelectOption($el, rmvCls, addCls, dataAttrN, dataAttrV) {
        $el.removeClass(rmvCls).addClass(addCls);
        var attr = 'data-'+dataAttrN;
        if (dataAttrV) $el.attr(attr, dataAttrV);
        else $el.removeAttr(attr);
    }
    $(document).on('change.maestroPaymentMethod', '.paymentMethodRadioBtn', function () {
        var $this = $(this),
            doShow = $this.val() === 'MD' && $this.prop('checked'),
            $month = $('.cardStartMonthSelect'),
            $year = $('.cardStartYearSelect'),
            $startDate = $month.closest('.formRow'),
            rmvClass = doShow ? 'forValidation' : 'validationControl',
            addClass = doShow ? 'validationControl' : 'forValidation';
        $startDate.toggle(doShow);
        forTravellerAgeValidation.displayStartDate = doShow;
        toggleStartDateSelectOption($month, rmvClass, addClass, 'control-name', doShow ? 'startMonth' : '');
        toggleStartDateSelectOption($year, rmvClass, addClass, 'control-name', doShow ? 'startYear' : '');
    });
    $('.paymentMethodRadioBtn[value="MD"]').trigger('change.maestroPaymentMethod');

    /*
     * fareConditionLink
     ****************************************
     */
    $(document).on('click.fareConditionLink', '.fareConditionLink', function (event) {
        event.preventDefault();
        if (fareTermsHTML) {
            showFareTermsPopup(fareTermsHTML);
        } else {
            var request = $.ajax({
                type: "POST",
                url: "/staglobe/getFareRulesInformation.do",
                data: "requestSource=OnePageCheckout&selectedItinId=0",
                statusCode: {
                    200: function (response) {
                        fareTermsHTML = response;
                        showFareTermsPopup(response);
                    },
                    404: function () {
                    },
                    500: function () {
                    }
                },
                beforeSend: function (xhr) {
                    $('body').append(loading_layer);
                    $('#loadingLayer').fadeIn(300);
                },
                complete: function () {
                    $('#loadingLayer').fadeOut(300, function () {
                        $('#loadingLayer').remove();
                    });
                }
            });
        }
    });

    function showFareTermsPopup(response) {
        var lightboxName = 'sideBarFareConditionLightbox';
        var lightbox = $('.lightbox[data-lightbox-name="'+ lightboxName +'"]');
        lightbox.find('.lightboxContent').html(response);
        showLightbox(lightbox);
    }

    /*
     * fareBreakdownToggleBtn
     ***************************************
     */
    $(document).on('click.fareBreakdownToggle', '.fareBreakdownToggleBtn', function (event) {
        event.preventDefault();
        var fareBreakdownGrid = $(this).closest('.sideBarFlightsLightbox').find('.fareBreakdownGrid');
        fareBreakdownGrid.stop().slideToggle(300);
    });

    (function(){
        var mql_640 = window.matchMedia("(min-width: 641px)");
        mql_640.addListener(toggleFareBreakdownGrid);
        toggleFareBreakdownGrid(mql_640);
    }());

    function toggleFareBreakdownGrid(mql) {
        var fareBreakdownGrid = $('.sideBarFlightsLightbox').find('.fareBreakdownGrid');
        if (mql.matches) {
            fareBreakdownGrid.show();
        } else {
            fareBreakdownGrid.hide();
        }
    }

    /*
     * open next traveller section
     * when all data for
     * current section is filled
     * (validationControls == validFields)
     **********************************
     */
    $(document).on('focusout change','.validationControl',function(){
        var travellerSection = $(this).closest('.travellerSection');
        var validationControls = travellerSection.find('.validationControl').not('.optionalField');
        var validFields = travellerSection.find('.validationControl.validField');
        var assignCartItemsSection = travellerSection.find('.assignCartItemsSection');
        var validCartItemCheckbox = 0;
        if( assignCartItemsSection.length > 0 ){
            assignCartItemsSection.find('.cartItemCheckbox').each(function(){
                if( $(this).prop('checked') == true || $(this).prop('disabled') == true ){
                    validCartItemCheckbox += 1;
                }
            });
        }
        if( validationControls.length == (validFields.length + validCartItemCheckbox) ){
            var idx = parseInt(travellerSection.data('traveller-count')) + 1;
            var nextTravellerSection = $('.travellerSection[data-traveller-count="'+ idx +'"]');
            var toggleBtn = nextTravellerSection.find('.toggleSectionBtn');
            var toggledSectionContent = nextTravellerSection.find('.toggledSectionContent');
            toggledSectionContent.stop().slideDown(350);
            toggleBtn.addClass('open');
        }
    });
});

function setPaymentMethodBox(mql) {
    var paymentMethodBox = $('.paymentMethodBox');
    paymentMethodBox.css('height','auto');
    if (mql.matches) {
        var maxHeight = 0;
        paymentMethodBox.each(function(){
            //$(this).css('height','auto');
            if( $(this).outerHeight() > maxHeight ){
                maxHeight = $(this).outerHeight();
            }
        });
        paymentMethodBox.height(maxHeight);
    }
}

/**
 * Total price calculating approach:
 * 1) Create global object that contains data to calculate total price
 * 	It has the following structure:
 * 	pricesObj = {
 * 		base: xxxx, 			  // To calculate total price it should be summarized with variable price's values 
 * 		merchantFeeBase: xxxx,	  // To calculate payment methods (which has % fee) flat fee it should be summarized with variable price's values
 * 		variablePrices: {		  // Variable price's values such as shipping method and insurance cross sell
 *	 		shippingMtd: xxxx,
 *	 		insuranceCrossSell: xxxx
 * 		},
 * 		totalMinusPaymentMtd: xxxx, // base + [variablePrices]; Total price without payment method since it may be in % and should be recalculated
 * 		totalMerchantFeeBase: xxxx, // merchantFeeBase + [variablePrices]; Used to calculate absolute value for payment methods with %
 * 	};
 */
function calculatePricesObj() {
    var basePrice = $('.totalPriceBox').find('.price[data-price]').eq(0).data('price'),
        merchantFeeBasePrice = $('.paymentMethodContainer').data('merchant-fee-base');
    return new Prices(basePrice, merchantFeeBasePrice);
}

function Prices(base, merchantFeeBase) {
    var base = getNumber(base, 'Base price is not a number'),
        merchantFeeBase = getNumber(merchantFeeBase, 'Merchant fee base is not a number');
    this.base = base;
    this.merchantFeeBase = merchantFeeBase;
    this.totalMinusPaymentMtd = base;
    this.totalMerchantFeeBase = merchantFeeBase;
    this.variablePrices = {
        shippingMtd: 0,
        insuranceCrossSell: 0
    };
}

Prices.prototype.addToBase = function(amount) {
    this.base += amount;
    this.recalcTotalMinusPaymentMtd();
};

Prices.prototype.addToMerchantFeeBase = function(amount) {
    this.merchantFeeBase += amount;
    this.recalcTotalMerchantFeeBase();
};

Prices.prototype.updateVarPrice = function(amount, varName) {
    this.variablePrices[varName] = amount;
    this.recalcTotalMinusPaymentMtd();
    this.recalcTotalMerchantFeeBase();
};

Prices.prototype.recalcTotalMinusPaymentMtd = function() {
    this.totalMinusPaymentMtd = this.base;
    for (var k in this.variablePrices) this.totalMinusPaymentMtd += this.variablePrices[k];
};

Prices.prototype.recalcTotalMerchantFeeBase = function() {
    this.totalMerchantFeeBase = this.merchantFeeBase;
    for (var k in this.variablePrices) this.totalMerchantFeeBase += this.variablePrices[k];
};

Prices.prototype.getTotalMinusPaymentMtd = function() {
    return this.totalMinusPaymentMtd;
};

Prices.prototype.getTotalMerchantFeeBase = function() {
    return this.totalMerchantFeeBase;
};

/**
 *  Since discount cards cann't be removed from basket
 *  Updates basePrice and mercantFeeBasePrice
 */
function updateTotalPriceByDiscountCard(amount) {
    var amount = getNumber(amount, 'Discount Card price is not a number');
    pricesObj.addToBase(amount);
    pricesObj.addToMerchantFeeBase(amount);
    updateTotalPriceHtml(pricesObj.getTotalMinusPaymentMtd());
    updatePaymentMethods();
}

/**
 * Updated by:
 * 	shipping method (varName='shippingMtd'),
 *  insurance cross sell (varName='insuranceCrossSell')
 */
function updateTotalPriceByVarItem(amount, varName) {
    var amount = getNumber(amount, varName+' price is not a number');
    pricesObj.updateVarPrice(amount, varName);
    updateTotalPriceHtml(pricesObj.getTotalMinusPaymentMtd());
    updatePaymentMethods();
}

function updateTotalPriceHtml(newPrice) {
    var newPrice = newPrice.toFixed(2);
    $('.totalPriceBox').find('.price[data-price]')
        .each(function() { replaceValue($(this), newPrice); });
}

/**
 * Updates payment methods
 */
function updatePaymentMethods() {
    var totalMerchantFeeBase = pricesObj.getTotalMerchantFeeBase(),
        totalPriceMinusPaymentMtd = pricesObj.getTotalMinusPaymentMtd();
    $('.paymentMethodContainer').find('.paymentMethodLabel').each(function() {
        var $this = $(this),
            $input = $this.find('input'),
            percentage = parseFloat($input.data('percentage-fee')),
            flatFee = parseFloat($input.data('flat-fee'));
        if (percentage) { // needs to recalculate fee
            flatFee = parseFloat((totalMerchantFeeBase * percentage / 100).toFixed(2)); // TODO needs more precise logic may be take in account VAT
            $input.data('flat-fee', flatFee);
        }
        /* Updates messages */
        /**
         * When no extra charge (flatFee === 0):
         * paymentInfoText - No extra charge
         * paymentResultText - You are about to pay <span>{0}</span> amount by {1}.
         *
         * When extra charge (flatFee > 0):
         * paymentInfoText - + <span>{0}</span> credit card fee
         * paymentResultText - You are about to pay <b class="paymentPrice">{0}</b> by <span class="paymentCard">{1}</span>.<span class="feeExtraText">This includes the <b class="feePrice">{2}</b> credit card fee</span>
         */
        var noExtraCharge = flatFee === 0,
            priceToPayTxt = (totalPriceMinusPaymentMtd + flatFee).toFixed(2),
            $priceToPay = $this.find('.paymentResultText '+(noExtraCharge?'span':'.paymentPrice')); // should try to wrap price text by <span> in all cases
        replaceValue($priceToPay, priceToPayTxt);
        if (flatFee && percentage) { // update fee in paymentInfoText
            replaceValue($this.find('.paymentInfoText span'), flatFee.toFixed(2));
        }
        // update total price data
        $input.data('total-price', parseFloat(priceToPayTxt));
    });
    $('.paymentMethodRadioBtn:checked').trigger('change.paymentMethod');
}

function isNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

function getNumber(val, msg) {
    var val = parseFloat(val);
    if (!isNumber(val)) return $.error(msg || 'The value '+val+' is not a number');
    return val;
}

function replaceValue($container, newValue) {
    var	rgx = /^([^\d]*)\d+([.,]?)\d*([^\d]*)$/,
        parts = newValue.split('.'),
        newText = $container.text().replace(rgx, '$1'+parts[0]+'$2'+parts[1]+'$3');
    $container.text(newText);
    $container.text(newText);
}

function normalizePrice(price, type){
    //find separator
    var cardTypesControl = $('.travellerCardPurchaseSection.contentSection.tmpl').find('#cardTypesControl');
    var typeSpan = $(cardTypesControl).find('#' + type);
    var valueString =  $(typeSpan).attr('data-display').split(' ')[1];
    var separator = '.';
    var value = price.toFixed(2);
    if(valueString.indexOf(',')>0){
        separator = valueString.charAt(valueString.indexOf(','));
        value = value.replace('.', separator);
    }
    return value;
}

function updateNumberOfProducts(qty) {
    var counter = $('.itemsCounter').find('.counter');
    var numberOfItems = parseInt(counter.html());
    counter.html(numberOfItems + qty);
}



