$(document).ready(function () {

    /*
     * addCrossSellInsurance
     **********************************
     */
    $(document).on('click.addInsuranceCrossSellBtn', '.insuranceBookingFlow .addInsuranceCrossSellBtn', function (event) {
        var insuranceAgeValidationResult = insuranceAgeValidation();
        if( insuranceAgeValidationResult.length == 0 ){
            if( $(this).hasClass('insuranceAdded') == false ){
                addInsuranceCrossSell(event);
                selectInsuranceCrossSell(event);
                addInsuranceToTravellerSummary(event);
                addInsuranceTermsAndConditions();
                disableInsuranceCheckbox();
            }
        }
    });

    /*
     * compare policies addInsuranceCrossSellBtn
     **********************************
     */
    $(document).on('click.lightboxAddInsuranceCrossSellBtn', '.comparePoliciesLightbox .addInsuranceCrossSellBtn', function (event) {
        var id = $(this).data('insurance-id');
        $('.insuranceBookingFlow').find('.addInsuranceCrossSellBtn[data-insurance-id="'+ id +'"]').trigger('click.addInsuranceCrossSellBtn');
        $(this).closest('.lightbox ').find('.closeLightboxBtn').trigger('click.closeLightbox');
        if (window.matchMedia("(max-width: 640px)").matches) {
            setMobileTableSize();
            setSliderSize();
        }
    }); 

    /*
     * removeInsurance
     **********************************
     */
    $(document).on('click.removeInsurance', '.removeInsuranceBtn', function (event) {
        removeInsurance(event);    
    });

    /*
     * comparePoliciesBtn
     **********************************
     */
    $(document).on('click.comparePolicies', '.comparePoliciesBtn', function (event) {
        if (window.matchMedia("(max-width: 640px)").matches) {
            setMobileTableSize();
            setSliderSize();
            slideToMostPopular();
        }
    });

    /*
     * insuranceContinueBtn
     **********************************
     */
    $(document).on('click.insuranceContinue', '.insuranceContinueBtn', function (event) {
        var haveInsuranceCheckbox = $('.haveInsuranceCheckbox');
        if( haveInsuranceCheckbox.length > 0 && haveInsuranceCheckbox.prop('disabled') == false ){
            var validationResult = checkout_validation.runFieldValidation(haveInsuranceCheckbox);
            if( validationResult == true ){
                hideCrossSellPanel();
            }
        }
        else {
            var insuranceAgeValidationResult = insuranceAgeValidation();
            if( insuranceAgeValidationResult.length == 0 ){
                hideCrossSellPanel();
            }
        }
    });

    function hideCrossSellPanel(){
        var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
        hidePanel(insuranceCrossSellPanel);
        setTimeout(showPaymentDetailsPanel, 350);
        setTimeout(showHiddenPanel, 350, "termsConditionsPanel");    
    }
    
    /*
     * editInsuranceBtn
     **********************************
     */
    $(document).on('click.editInsurance', '.editInsuranceBtn', function (event) {
        var paymentDetailsPanel = $('.paymentDetailsPanel');
        var termsConditionsPanel = $('.termsConditionsPanel');        
        hidePanel(paymentDetailsPanel);
        hidePanel(termsConditionsPanel);
        setTimeout(showHiddenPanel, 350, "insuranceCrossSellPanel");
        if (window.matchMedia("(max-width: 640px)").matches) {
            setTimeout(setMobileSize, 350);
        }
    });

    function setMobileSize(){
        setMobileTableSize();
        setSliderSize();
        slideToMostPopular();
    }

    /*
     * insuranceContinueMobileBtn
     **********************************
     */
    $(document).on('click.insuranceContinueMobile', '.insuranceContinueMobileBtn', function (event) {
        hideCrossSellPanel();
    });
});

function loadInsuranceCrossSell(url, data) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        statusCode: {
            200: function (response) {
                $(".insuranceCrossSell").append(response);
            },
            404: function () {
            },
            500: function () {
            }
        }
    });
}

function addInsuranceCrossSell(event) {
    event.preventDefault();
    var startDate = $("#insuranceStartDate").html();
    var endDate = $("#insuranceEndDate").html();
    var qty = $("#insuranceTravellersQTY").html();

    var insuranceId = $(event.currentTarget).data('insurance-id');
    var insurances = $.grep(crossSellInsuranceArray, function (e) {
        return e.id == insuranceId;
    });
    var insurance = insurances[0];
    //updateTotalPrice(insurance.amount, 'price', false);
    addInsuranceCrossSellPanel(startDate, endDate, qty, insurance);
}

function addInsuranceCrossSellPanel(startDate, endDate, qty, insurance) {
    var sidebar = $('#pageSidebar');
    var insuranceSidebarPanel = sidebar.find('.sidebarPanel.insuranceBox');
    if( insuranceSidebarPanel.length > 0 ){
        insuranceSidebarPanel.stop(true).slideUp(200,function(){
            $(this).remove();
            appendInsuranceSidebarPanel(startDate, endDate, qty, insurance,sidebar);
        });
    }
    else {
        appendInsuranceSidebarPanel(startDate, endDate, qty, insurance,sidebar);
    }
}

function appendInsuranceSidebarPanel(startDate, endDate, qty, insurance,sidebar){
    var insuranceBox_tmpl = $('.sidebarPanel.insuranceBox.tmpl').clone();
    var sidebarPanels = sidebar.find('.sidebarPanel');
    var targetElement = sidebarPanels.eq(sidebarPanels.length - 1);
    //Put insuranceBox after hotelsBox if exists
    var hotelsBox = sidebar.find('.sidebarPanel.hotelsBox');
    if (hotelsBox.length == 0) {
        targetElement.after(insuranceBox_tmpl);
    } else {
        targetElement.before(insuranceBox_tmpl);
    }
    var insuranceBox = sidebar.find('.sidebarPanel.insuranceBox.tmpl');
    insuranceBox.find('.startDate').html(startDate);
    insuranceBox.find('.endDate').html(endDate);
    insuranceBox.find('.insuranceName').html(insurance.name);
    insuranceBox.find('.passengerQTY .qty').html(qty);
    insuranceBox.find('.sidebarPanelFooter .priceBox .price').html(insurance.price);
    insuranceBox.stop().slideDown(350, function () {
        $(this).removeClass('tmpl');
    });
}

function selectInsuranceCrossSell(event){
    var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
    var insuranceBookingFlow = $('.insuranceBookingFlow');
    var addInsuranceCrossSellBtn = $(event.currentTarget);
    var insuranceContinueBtn = $('.insuranceContinueBtn');
    var insuranceTable = insuranceBookingFlow.find('.insuranceTable');
    var mobileTableTopSection = insuranceBookingFlow.find('.mobileTableTopSection');
    var id = addInsuranceCrossSellBtn.data('insurance-id');
    var tableIdx,
        sliderIdx,
        dublicatedBtn;
    insuranceBookingFlow.find('.addInsuranceCrossSellBtn').removeClass('insuranceAdded');
    insuranceBookingFlow.find('.removeInsuranceBtn').hide();       
    if( addInsuranceCrossSellBtn.closest('.insuranceTable').length > 0 ){
        dublicatedBtn = mobileTableTopSection.find('.addInsuranceCrossSellBtn[data-insurance-id="'+ id +'"]');        
        sliderIdx = dublicatedBtn.closest('.sliderItem').index();
        tableIdx = addInsuranceCrossSellBtn.closest('td').index(); 
    }
    if( addInsuranceCrossSellBtn.closest('.mobileTableTopSection').length > 0 ){
        dublicatedBtn = insuranceTable.find('.addInsuranceCrossSellBtn[data-insurance-id="'+ id +'"]');       
        sliderIdx = dublicatedBtn.closest('td').index();
        tableIdx = addInsuranceCrossSellBtn.closest('.sliderItem').index(); 
    }        
    insuranceCrossSellPanel.addClass('insuranceAdded');
    addInsuranceCrossSellBtn.addClass('insuranceAdded');
    dublicatedBtn.addClass('insuranceAdded');
    insuranceTable.find('.removeBtnRow td').eq(tableIdx).find('.removeInsuranceBtn').show();
    mobileTableTopSection.find('.sliderItem').eq(sliderIdx).find('.removeInsuranceBtn').show();
}

function addInsuranceTermsAndConditions(){
    var insuranceTermsAndConditionsRow = $('.insuranceCheckboxTmpl').clone();
    var insuranceTermsAndConditionsLightBox = $('.lightbox[data-lightbox-name="insuranceMaterialsLightbox"]').detach();
    var termsConditionsPanel = $('.termsConditionsPanel');
    var termsConditionsWrapp = termsConditionsPanel.find('.termsConditionsWrapp');
    termsConditionsPanel.find('.insuranceCheckboxRow').remove();
    if( $('input.visaTermsConditionsCheckbox').length > 0 ){
        $('input.visaTermsConditionsCheckbox').closest('.checkboxRow').before(insuranceTermsAndConditionsRow);
    }
    else {
        termsConditionsWrapp.append(insuranceTermsAndConditionsRow);
    }
    termsConditionsWrapp.find('.insuranceCheckboxTmpl').slideDown(300,function(){
        $(this).removeClass('insuranceCheckboxTmpl').addClass('insuranceCheckboxRow').find('.forValidation').removeClass('forValidation').addClass('validationControl').attr('data-control-name','insuranceTermsConditions');
    });
    $('#mainSection').append(insuranceTermsAndConditionsLightBox);
}

function disableInsuranceCheckbox(){
    var haveInsuranceCheckbox = $('.haveInsuranceCheckbox');
    if( haveInsuranceCheckbox.length > 0 ){
        var haveInsuranceBox = $('.haveInsuranceBox');
        haveInsuranceCheckbox.prop('checked',false).trigger('change.checkboxChange').prop('disabled',true);
        haveInsuranceBox.removeClass('errorRow').addClass('disabled');
        haveInsuranceBox.find('.customCheckbox').addClass('disabled');
        haveInsuranceBox.find('.errorBox').remove();
    }
}

function removeInsurance(event){
    event.preventDefault();    
    var insuranceBookingFlow = $('.insuranceBookingFlow');
    var termsConditionsPanel = $('.termsConditionsPanel');
    var pageSidebar = $('#pageSidebar');
    var haveInsuranceCheckbox = $('.haveInsuranceCheckbox');
    var detailsSummaryBoxes = $('.detailsSummaryBox').not('.tmpl');
    var cartItemsList = $('.cartItemsList');
    var insuranceCartItemCheckbox = cartItemsList.find('.insuranceCartItemCheckbox');
    insuranceBookingFlow.find('.removeInsuranceBtn').hide();    
    $('.insuranceAdded').removeClass('insuranceAdded');
    pageSidebar.find('.sidebarPanel.insuranceBox').stop().slideUp(250,function(){
        $(this).remove();
    });
    termsConditionsPanel.find('.insuranceCheckboxRow').stop().slideUp(200,function(){
        $(this).remove();
    });
    if( haveInsuranceCheckbox.length > 0 ){
        haveInsuranceCheckbox.prop('disabled',false);
        $('.haveInsuranceBox').removeClass('disabled').find('.customCheckbox').removeClass('disabled');
    }
    detailsSummaryBoxes.find('.insuranceCartItem').remove();

    cartItemsList.find('.insuranceCartItemBlock').removeClass('disabled withHelpText errorItem').addClass('tmpl').find('.listItemText').html('');
    insuranceCartItemCheckbox.prop('disabled',false).prop('checked',false).removeClass('cartItemCheckbox validationControl').attr('name','').attr('data-control-name','').trigger('change.checkboxChange');
    insuranceCartItemCheckbox.closest('.customCheckbox').removeClass('disabled');
}

function addInsuranceToTravellerSummary(event){
    var addInsuranceCrossSellBtn = $(event.currentTarget);
    var insuranceText = addInsuranceCrossSellBtn.data('insurance-assignment-text');
    $('.detailsSummaryBox').not('.tmpl').find('li.insuranceCartItem').remove();
    for( var traveller in travellerDetailsObj ){
        if( travellerDetailsObj[traveller].hasOwnProperty('hasFlight') ){
            if( travellerDetailsObj[traveller].hasFlight == true ){
                var travellerSummaryBox = $('#'+traveller);
                var listItem = '<li class="insuranceCartItem">' + insuranceText + '</li>';
                travellerSummaryBox.find('.cartItemsInfoList').append(listItem);
            }
        }
    }
}

function insuranceAgeValidation(){
    var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
    var validationResultArr = [];
    var insuranceMaxAge = $('#insuranceMaxAge').val();
    var currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    insuranceCrossSellPanel.find('.insuranceMaxAgeError').remove();
    insuranceCrossSellPanel.find('.insuranceHelpTextBox').show();
    for( var traveller in travellerDetailsObj ){
        if( travellerDetailsObj[traveller].hasFlight == true ){
            var maxYear = parseInt(travellerDetailsObj[traveller].birthYear)+ parseInt(insuranceMaxAge);
            var maxMonth = parseInt(travellerDetailsObj[traveller].birthMonth)- 1;
            var maxDate = new Date(maxYear, maxMonth, travellerDetailsObj[traveller].birthDate);
            if( maxDate <= currentDate ){
                showInsuranceError();
                $('.insuranceBookingFlow').find('.removeInsuranceBtn').eq(0).trigger('click.removeInsurance');
                validationResultArr.push(false);
                break;
            }
        }
    }
    return validationResultArr;
}

function showInsuranceError(){
    var insuranceCrossSellPanel = $('.insuranceCrossSellPanel');
    var insuranceHelpTextBox = insuranceCrossSellPanel.find('.insuranceHelpTextBox');
    var errorDestination = insuranceCrossSellPanel.find('.panelFooter');
    errorDestination.prepend(checkout_validation.errorBox_tmpl);
    var errorBox = errorDestination.find('.errorBox.tmpl').removeClass('tmpl').addClass("insuranceMaxAgeError");
    errorBox.find('.errorText').html(checkout_validation_settings.insuranceValidation.maxAgeValidation.errorMsg);
    insuranceHelpTextBox.hide();
}

function addInsuranceToCartItems(){
    var addInsuranceCrossSellBtn = $(event.currentTarget);
    var insuranceText = addInsuranceCrossSellBtn.data('insurance-assignment-text');
    var cartItemsList = $('.cartItemsList');
    cartItemsList.find('.insuranceCartItemBlock').removeClass('tmpl');
    cartItemsList.find('.insuranceCartItemCheckbox').addClass('cartItemCheckbox validationControl').attr('name','cartItemCheckbox');
    cartItemsList.each(function(){
        var flightCartItemCheckbox = $(this).find('.flightCheckbox');
        if( flightCartItemCheckbox.length > 0 ){
            $(this).find('insuranceCartItemCheckbox').prop('checked');
        }
    });
}
