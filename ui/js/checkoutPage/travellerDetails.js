/**
 * travellerDetails.js
 */

$(document).ready(function(){

    /*
     * submitTravellerDetails
     **********************************
     */
    $(document).on('click.submitTravellerDetails','.submitTravellerDetailsBtn',function(event){
        event.preventDefault();
        var validationControl = $('.validationControl');
        var travellerPanel = $('.travellerPanel');
        var validationResultArr = [];
        validationControl.each(function(){
            var field = $(this);
            var validationResult = checkout_validation.runFieldValidation(field);
            if( validationResult == false ){
                validationResultArr.push(field.attr('name'));
            }
        });
        $('.unassignedItemsMsgBox').remove();
        if( $('.cartItemCheckboxError').length > 0 ){
            var errorBox = $('.cartItemCheckboxError');
            var cartItemsCounter = errorBox.find('li').length;
            var errorText = errorBox.find('.errorText').html().replace(/\{1\}/g, cartItemsCounter);
            errorBox.find('.errorText').html(errorText);
        }
        if( validationResultArr.length == 0 ){
            var travellerDetails = createTravellerDetailsObj();
            travellerDetailsObj  = $.extend(true, {}, travellerDetailsObj, travellerDetails);
            for( var traveller_i in  travellerDetailsObj){
                travellerDetailsObj[traveller_i].cartItems = travellerDetails[traveller_i].cartItems;
            }

            //ReservationAddTravelerDetailsAction functionality
            //processAdditionalTravellerDetails();

            // show necessary sections
            for( var traveller in travellerDetails ){
                showTravellerDetailsSummary(travellerDetails[traveller]);
            }
            $('html, body').animate({
                scrollTop: 0
            }, 350);
            travellerPanel.slideUp(350,function(){
                var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
                showTravellerDetailsSummarySection();
                if( insuranceCrossSellPanel.length > 0 ){
                    showInsuranceCrossSellPanel();
                }
                else {
                    showPaymentDetailsPanel();
                    showHiddenPanel('termsConditionsPanel');
                }
            });
        }
    });

    /*
     * editTravellerDetailsBtn
     **********************************
     */
    $(document).on('click.startEditTravellerDetails','.editTravellerDetailsBtn', function(){
        var travellerPanel = $('.travellerPanel');
        var travellerSummaryPanel = $('.travellerSummaryPanel');
        var paymentDetailsPanel = $('.paymentDetailsPanel');
        var termsConditionsPanel = $('.termsConditionsPanel');

        travellerSummaryPanel.stop().slideUp(350,function(){
            $(this).find('.detailsSummaryBox').not('.tmpl').remove();
            travellerPanel.stop().slideDown(350);
        });
        hidePanel(paymentDetailsPanel);
        hidePanel(termsConditionsPanel);
        hideInsuranceCrossSellPanel();
    });

    /*
     * submitPaymentDetails
     **********************************
     */
    $(document).on('click.submitPaymentDetails','.submitPaymentDetailsBtn',function(event){
        event.preventDefault();
        var validationControl = $('.validationControl');
        var validationResultArr = [];
        validationControl.each(function(){
            var field = $(this);
            var validationResult = checkout_validation.runFieldValidation(field);
            if( validationResult == false ){
                validationResultArr.push(field.attr('name'));
            }
        });
        if( validationResultArr.length == 0 ) {
            createOPCForm();
            $('#OPCForm').submit();
        }
    });
});

/*
 * createTravellerDetailsObj
 **********************************
 */
function createTravellerDetailsObj(){

    var newTravellerDetailsObj = {};

    for( var i=0; i<$('.travellerSection').length; i++ ){
        var travellerSection = $('.travellerSection').eq(i);
        var travellerN = 'traveller' + travellerSection.data('traveller-count');
        var travellerObj = {};
        var cartItemsArr = [];

        if( $('.assignCartItemsSection').length != 0 ){
            travellerSection.find('input.cartItemCheckbox:checked').each(function(){
                var cartItemText = $(this).closest('li').find('.listItemText').html();
                cartItemsArr.push(cartItemText);
                if( $(this).data('item-name') == "flight" ){
                    travellerObj.hasFlight = true;
                }
                if( $(this).data('item-name') == "insurance" ){
                    travellerObj.insuranceIndex = cartItemsArr.length - 1;
                }
            });
        }
        else {
            cartItemsArr = travellerDetailsObj[travellerN].cartItems;
        }

        travellerObj.count = travellerSection.data('traveller-count');
        travellerObj.title = travellerSection.find('.titleSelect').val();
        travellerObj.firstName = travellerSection.find('.firstNameInput').val();
        travellerObj.middleName = travellerSection.find('.middleNameInput').val();
        travellerObj.lastName = travellerSection.find('.lastNameInput').val();
        travellerObj.birthDate = travellerSection.find('.birthDateSelect').val();
        travellerObj.birthMonth = travellerSection.find('.birthMonthSelect').val();
        travellerObj.birthYear = travellerSection.find('.birthYearSelect').val();
        travellerObj.email = travellerSection.find('.emailInput').val();
        travellerObj.confirmEmail = travellerSection.find('.confirmEmailInput').val();
        travellerObj.phoneNumber = travellerSection.find('.phoneNumberInput').val();
        travellerObj.cartItems = cartItemsArr;
        newTravellerDetailsObj[travellerN] = travellerObj;
    }

    return newTravellerDetailsObj;
}

/*
 * showTravellerDetailsSummary
 **********************************
 */
function showTravellerDetailsSummary(travellerObj,travellerNumber){
    var detailsSummaryWrapper = $('.travellerSummaryPanel').find('.detailsSummaryWrapper');
    var travellerSummary_tmpl = detailsSummaryWrapper.find('.detailsSummaryBox.tmpl').clone().removeClass('tmpl');
    var travellerName = travellerSummary_tmpl.find('.travellerInfoList .name');
    travellerSummary_tmpl.attr('id','traveller'+travellerObj.count);
    // Title
    travellerSummary_tmpl.find('.travellerTitle').append(' ' + travellerObj.count);
    // First Name
    travellerName.find('.firstName').html(travellerObj.firstName);
    // Middle Name
    if( travellerObj.middleName != '' ){
        travellerName.find('.middleName').html(travellerObj.middleName);
    }
    else {
        travellerName.find('.middleName').remove();
    }
    // Last Name
    travellerSummary_tmpl.find('.travellerInfoList .name .lastName').html(travellerObj.lastName);
    // Email
    if( travellerObj.email != undefined ){
        travellerSummary_tmpl.find('.travellerInfoList .email').html(travellerObj.email);
    }
    else {
        travellerSummary_tmpl.find('.travellerInfoList .email').remove();
    }
    // Phone Number
    if( travellerObj.phoneNumber != undefined ){
        travellerSummary_tmpl.find('.travellerInfoList .tel').html(travellerObj.phoneNumber);
    }
    else {
        travellerSummary_tmpl.find('.travellerInfoList .tel').remove();
    }
    // Cart Items
    for( var i=0; i<travellerObj.cartItems.length; i++ ){
        var listItem = '<li>'+travellerObj.cartItems[i]+'</li>';
        travellerSummary_tmpl.find('ul.cartItemsInfoList').append(listItem);
    }
    // Insurance Cart Item
    if( travellerObj.hasOwnProperty('insuranceIndex') ){
        travellerSummary_tmpl.find('ul.cartItemsInfoList').find('li').eq(travellerObj.insuranceIndex).addClass('insuranceCartItem');
    }
    detailsSummaryWrapper.append(travellerSummary_tmpl);
}

/*
 * showTravellerDetailsSummarySection
 **********************************
 */
function showTravellerDetailsSummarySection(){
    var travellerSummaryPanel = $('.travellerSummaryPanel');
    travellerSummaryPanel.stop().slideDown(350);
}

/*
 * hidePanel
 **********************************
 */
function hidePanel(panel){
    panel.find('.panelContent').stop().slideUp(350,function(){
        panel.addClass('hiddenSection');
        panel.find('.validationControl').addClass('forValidation').removeClass('validationControl');
    });
}

/*
 * show payment details
 **********************************
 */
function showPaymentDetailsPanel(){
    var paymentDetailsPanel = $('.paymentDetailsPanel');
    paymentDetailsPanel.find('.panelContent').stop().slideDown(350,function(){
        paymentDetailsPanel.removeClass('hiddenSection');
    });
    paymentDetailsPanel.find('.forValidation').addClass('validationControl').removeClass('forValidation');
    var mql_640 = window.matchMedia("(min-width: 641px)");
    setPaymentMethodBox(mql_640);
}

/*
 * show hidden panel
 **********************************
 */
function showHiddenPanel(panelName){
    var hiddenPanel = $('.'+panelName);
    hiddenPanel.find('.panelContent').stop().slideDown(350,function(){
        hiddenPanel.removeClass('hiddenSection');
    });
    hiddenPanel.find('.forValidation').addClass('validationControl').removeClass('forValidation');
}

/*
 * show insuranceCrossSellPanel
 **********************************
 */
function showInsuranceCrossSellPanel(){
    var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
    insuranceCrossSellPanel.stop().slideDown(350,function(){
        if (window.matchMedia("(max-width: 640px)").matches) {
            setMobileTableSize();
            setSliderSize();
            slideToMostPopular();
        }
    });

}

/*
 * hide insuranceCrossSellPanel
 **********************************
 */
function hideInsuranceCrossSellPanel(){
    var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
    insuranceCrossSellPanel.stop().slideUp(350);
    insuranceCrossSellPanel.removeClass('hiddenSection').find('.panelContent').show();
}

/*
 * create OPC form
 **********************************
 */
function createOPCForm(){
    var OPC_Form = $('#OPCForm');
    OPC_Form.find('input.opcFormControl').each(function(){
        var formControl = $(this);
        var controlName = formControl.data('form-control-name');
        var opcControl = $('[data-control-name="'+ controlName +'"]');
        if( opcControl.length > 0 ){
            if( opcControl[0].nodeName == 'INPUT' && opcControl.prop('type') == "checkbox" ){
                formControl.val(opcControl.prop('checked'));
            }
            else if( opcControl[0].nodeName == 'INPUT' && opcControl.prop('type') == "radio" ){
                var radioBtnVal = opcControl.filter(':checked').val();
                formControl.val(radioBtnVal);
            }
            else {
                formControl.val(opcControl.val());
            }
        }
        if( controlName == 'insuranceId' ){
            if( $('.addInsuranceCrossSellBtn.insuranceAdded').length > 0 ){
                var insuranceId = $('.addInsuranceCrossSellBtn.insuranceAdded').eq(0).data('insurance-id');
                formControl.val(insuranceId);
            }
        }
        if( controlName == 'traveler.cartItemIds' || controlName == 'traveler.subElementIds' ){
            var cartItemId;
            if( $('.assignCartItemsSection').length > 0 ){
                var controlExtraName = formControl.data('form-control-extraname');
                var cartItemsControl = $('[data-control-name="'+ controlExtraName +'"]');
                if( cartItemsControl.prop('checked') == true ){
                    cartItemId = cartItemsControl.data('cart-item-id');
                    formControl.val(cartItemId);
                }
                else {
                    formControl.remove();
                }
            }
            else {
                var traveller = 'traveller'+(parseInt(formControl.data('traveler-count'))+1);
                var itemIdx = formControl.data('item-idx');
                if( controlName == 'traveler.cartItemIds' ){
                    cartItemId = travellerDetailsObj[traveller].cartItemIds[itemIdx];
                }
                if( controlName == 'traveler.subElementIds' ){
                    cartItemId = travellerDetailsObj[traveller].subElementIds[itemIdx];
                }
                formControl.val(cartItemId);
            }
        }
    });
}