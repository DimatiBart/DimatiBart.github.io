/**
 * travelerDiscountDetails.js
 */


function getElementToInsert(traveller){
    switch (traveller.discountCard.cardType) {
        case 0:
            return additional_traveller_settings.cardLabels.isicCardLabel.isicElementToInsert;
            break;
        case 1:
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcElementToInsert;
            break;
        case 2:
            return additional_traveller_settings.cardLabels.iticCardLabel.teacherElementToInsert;
            break;
        case 3:
            return additional_traveller_settings.cardLabels.isicCardLabel.isicElementToInsert;
            break;
        default:
            throw "The traveller doesnt have this cardType:" + traveller.discountCard.cardType;
    }
}

function insertElementToTravelerSummary(traveller){
    // find traveleBox by taveler number/count
    var summaryBox =  $('#traveller' + traveller.count);
    // find list in the box
    var ulElement = $(summaryBox).find('.infoList.cartItemsInfoList');
    // inser new <li> elemment using template at the end of existing list(after round trip)
    var elementToInsert = getElementToInsert(traveller);//$('.insertElement').find('li').clone().removeClass('tmpl');
    var newLi = $(ulElement).find('li').last().after('<li>' + elementToInsert + '</li>');
    traveller.cartItems.push(elementToInsert);
    $(newLi).css('display','block');
    return elementToInsert;//$(elementToInsert).html();
}

function fieldValidation(input,validationResultArr){
    var isValid = checkout_validation.runFieldValidation(input);
    if(isValid==false){
        validationResultArr.push(input.attr('name'));
    }
}


//returns traveler from travellerDetailsObj
function getTraveler(number){
    var index = 'traveller' + number;
    return travellerDetailsObj[index];
}

function validate(traveler){
    var validationResults = [];
    var cardItemDiscount = checkCartItemsDiscount(traveler);
    if(cardItemDiscount !== true){
        var cardNumber = $('#discountWorkflow_' + traveler.count).find('.isicCardNumberInput');
        fieldValidation(cardNumber,validationResults);
        var expireMonthSelect = $('#discountWorkflow_' + traveler.count).find('.expireMonthSelect');
        fieldValidation(expireMonthSelect,validationResults);
        var expireYearSelect = $('#discountWorkflow_' + traveler.count).find('.expireYearSelect');
        fieldValidation(expireYearSelect,validationResults);
    }
    return validationResults;
}


$(document).ready(function(){
    /*
     * editTravelerDiscountBtn
     **********************************
     */
    $(document).on('click.editTravelerDiscountBtn','.editTravelerDiscountBtn', function(event) {
        event.preventDefault();
        hidePaymentDetailsSection();
        editTravellerDiscountCard(event);
    });

    /*
     * submitTravellerDiscountCardsBtn
     **********************************
     */
    $(document).on('click.submitTravellerDiscountCardsBtn','.submitTravellerDiscountCardsBtn', function(event) {
        event.preventDefault();
        processAdditionalTravellerSections();
        tryShowPaymentDetailsSection();
    });

    /*
     * haveDiscountCardLink
     **********************************
     */
    $(document).on('click.haveIsicLink','.haveIsicLink', function(event){
        event.preventDefault();
        haveDiscountCard(event);
    });

    /*
     * buyCardLink
     **********************************
     */
    $(document).on('click.buyCardLink','.buyCardLink', function(event){
        event.preventDefault();
        buyDiscountCard(event);
    });

    /*
     * addDiscountCard
     **********************************
     */
    $(document).on('click.submitTravellerDiscountCard','.submitTravellerDiscountCardBtn',function(event){
        event.preventDefault();
        addDiscountCard(event);
        var opcControlParent = $(this).closest('.travellerCardPurchaseSection');
        fillOPCFormWithDiscountData(opcControlParent);
        $(this).closest('.travellerCardPurchaseSection').find('.opcFormData').removeClass('opcFormData').attr('data-control-name','');
        tryShowPaymentDetailsSection();
    });
});

//TODO
var isUnder26 = false; // TODO need to calculate based on filled traveller data
var codeToPaxGroupsMap = {
    ADT: 'ADULT',
    STU: 'STUDENT',
    YTH: 'YOUTH',
    OTH: 'TEACHER',
    TEA: 'TEACHER'
};

function getTravelerProperty(traveler, propertyName){
    //var traveler =  $(travellerDetailsObj).prop(index);
    if(!$.isEmptyObject(traveler)){
        return  $(traveler).prop(propertyName);
    }
    return -1;
}

function setTravelerProperty(traveler, propertyName, propertyValue){
    //var traveler =  $(travellerDetailsObj).prop(index);
    if(!$.isEmptyObject(traveler)){
        // set property
        $(traveler).prop(propertyName, propertyValue);
        // re-set traveler
        //$(travellerDetailsObj).prop(index, traveler);
        return 0;
    }
    return -1;
}

function setIsUnder26Property(traveler){
    var result = false;
    if(!$.isEmptyObject(traveler)){
        var birthDay = getTravelerProperty(traveler, 'birthDate');
        var birthMonth = getTravelerProperty(traveler, 'birthMonth');
        var birthYear = getTravelerProperty(traveler, 'birthYear');
        var dateString = birthYear  + '-' + birthMonth + '-' + birthDay;
        var birthDate = new Date(Date.parse(dateString));
        birthDate.setFullYear(birthDate.getFullYear() + 26);
        // Fix bug https://statravel.atlassian.net/browse/IBEUI-4639
        // discard time's variable since there is dates comparison
        birthDate.setHours(0, 0, 0, 0);
        //console.log('birthDate', birthDate);
        //departureDate
        //console.log('originDay', '${originDay}');
        //console.log('originMonthYear', '${originMonthYear}');
        var originMonthYear = additional_traveller_settings.originMonthYear;// '${originMonthYear}';
        var tmp = originMonthYear.split('-');
        var originDay = additional_traveller_settings.originDay;//'${originDay}';
        var dapartureString = tmp[1] + '-' + tmp[0] + '-' + originDay;
        var dapartureDate = new Date(Date.parse(dapartureString));
        dapartureDate.setHours(0, 0, 0, 0);
        //console.log('dapartureDate:', dapartureDate);
        result =  dapartureDate.getTime() < birthDate.getTime();
        setTravelerProperty(traveler, 'isUnder26', result);
        //console.log('result', result);
    }
    return result;
}

function isTravellerHasYOUTH(traveler) {
    return discountType.IYTC == travelersDiscountCardsMapping['traveller'+traveler.count];
}

function isTravellerHasISIC(traveler) {
    return discountType.ISIC == travelersDiscountCardsMapping['traveller'+traveler.count];
}

function isTravellerHasTeacherCard(traveler) {
    return discountType.TEACHER == travelersDiscountCardsMapping['traveller'+traveler.count];
}


function travelerNeedCard(traveller) {
    var result = false;
    var isUnder26 = getTravelerProperty(traveller,'isUnder26');
    var paxCode = getTravelerProperty(traveller,'paxType');
    if ((additional_traveller_settings.isYouthEligibleFare || additional_traveller_settings.isStudentYouthEligibleFare) && paxCode == 'YOUTH') {
        if (!isTravellerHasYOUTH(traveller) && !isTravellerHasISIC(traveller) && isDiscountRequired) {
            result = true;
        }
    } else {
        if (additional_traveller_settings.isTeacherOnlyFare && paxCode == 'TEACHER') {
            if (!isTravellerHasTeacherCard(traveller)&& traveller.isQualified) {
                result = true;
            }
        } else {
            if ((additional_traveller_settings.isStudentOnlyFare || additional_traveller_settings.isStudentYouthEligibleFare) && paxCode == 'STUDENT' &&
                ((!isUnder26 && !isDiscountRequired) || isDiscountRequired)) {
                if (!isTravellerHasYOUTH(traveller) && !isTravellerHasISIC(traveller) && traveller.isQualified){
                    result = true;
                }
            }
        }
    }
    return result;
}
// returns travelers count;
function getTravelersCount(){
    var count = 0;
    for (var item in travellerDetailsObj) {
        count++;
    }
    return count;
}

function setTravellerHasFlight(traveler) {
    var result = false;
    if(!$.isEmptyObject(traveler)){
        // if there is only one traveler then don't check cartItem just return hasBasketFlight
        if(getTravelersCount()===1){
            result = additional_traveller_settings.hasBasketFlight;
        } else {
            // if cartItems isn't empty then we can say there is flight
            var cartItems = $(traveler).prop('cartItems');
            //console.log('cartItems.length', cartItems.length);
            if (cartItems.length > 0){
                result = true;
            }
        }
    }
    setTravelerProperty(traveler, 'isTravellerHasFlight', result);
}

function replaceCurvels(message){
    //TODO move 's to resource bundle if needed
    var str = "{0}";
    var result = message.replace(str, "`s");
    return result;
}

var discountType = {
    ISIC:'ISIC',
    IYTC: 'IYTC',
    TEACHER:'TEACHER'
}

function getDiscountCardPriceFromShoppingCard(cardType){
    var cardTypesControl = $('.travellerCardPurchaseSection.contentSection.tmpl').find('#cardTypesControl');
    var typeSpan = $(cardTypesControl).find('#' + cardType);
    return parseFloat($(typeSpan).attr('data-price'));
}

function getDiscountCurrencyFromShoppingCard(cardType){
    var cardTypesControl = $('.travellerCardPurchaseSection.contentSection.tmpl').find('#cardTypesControl');
    var typeSpan = $(cardTypesControl).find('#' + cardType);
    return $(typeSpan).attr('data-display').split(' ')[0];
}

var travelersDiscountCardsMapping = {};
var mappingHistory = {};

var discountCards={};

discountCardSource = {
    shoppingCard:'shoppingCard',
    OPC:'OPC'
}
function removeFromDiscountCards(traveler){
    $(discountCards['traveller' + traveler.count]).removeProp("discountCard");
}

function addToDiscountCards(traveler, source, cardCode){
    //create DC by type
    discountCards['traveller' + traveler.count]={discountCard:{}};
    if(discountCardSource.shoppingCard){
        //DC from Shopping Card
        if(discountType.TEACHER == cardCode){
            //type teacher
            discountCards['traveller' + traveler.count].discountCard.total=
                getDiscountCardPriceFromShoppingCard(discountType.TEACHER);
            discountCards['traveller' + traveler.count].discountCard.currency=
                getDiscountCurrencyFromShoppingCard(discountType.TEACHER);
            discountCards['traveller' + traveler.count].discountCard.type="TEACHER";
            discountCards['traveller' + traveler.count].discountCard.cardName=
                additional_traveller_settings.cardLabels.iticCardLabel.teacherCardName;
        } else {
            if(discountType.IYTC == cardCode){
                //type IYTC
                discountCards['traveller' + traveler.count].discountCard.total=
                    getDiscountCardPriceFromShoppingCard(discountType.IYTC);
                discountCards['traveller' + traveler.count].discountCard.currency=
                    getDiscountCurrencyFromShoppingCard(discountType.IYTC);
                discountCards['traveller' + traveler.count].discountCard.type="IYTC";
                discountCards['traveller' + traveler.count].discountCard.cardName=
                    additional_traveller_settings.cardLabels.iytcCardLabel.iytcCardName;
            }else{
                //type ISIC
                discountCards['traveller' + traveler.count].discountCard.total=
                    getDiscountCardPriceFromShoppingCard(discountType.ISIC);
                discountCards['traveller' + traveler.count].discountCard.currency=
                    getDiscountCurrencyFromShoppingCard(discountType.ISIC);
                discountCards['traveller' + traveler.count].discountCard.type="ISIC";
                discountCards['traveller' + traveler.count].discountCard.cardName=
                    additional_traveller_settings.cardLabels.isicCardLabel.isicCardName;
            }
        }
    }else{
        //DC from OPC
        discountCards['traveller' + traveler.count].discountCard.total=traveler.discountCard.total;
        discountCards['traveller' + traveler.count].discountCard.currency=traveler.discountCard.currency;
        discountCards['traveller' + traveler.count].discountCard.type=traveler.discountCard.type;
        discountCards['traveller' + traveler.count].discountCard.cardName=traveler.discountCard.cardName;
    }
    discountCards['traveller' + traveler.count].discountCard.source=source;
}

function setTravelersDiscountCardsMapping(){
    mappingHistory = {};
    $.extend( mappingHistory, travelersDiscountCardsMapping );
    travelersDiscountCardsMapping = {};
    for (var item in travellerDetailsObj ) {
        var traveler = travellerDetailsObj[item];
        var travellerSection  = $('.travellerSection[data-traveller-count="'+ traveler.count +'"]');
        // from Shopping card
        var discountCheckbox = travellerSection.find('.cartItemCheckbox[data-item-name="discountCard"]');
        $(discountCheckbox).each(function(key, value){
            if($(value).prop('checked') == true){
                travelersDiscountCardsMapping['traveller'+traveler.count]=$(value).attr('data-discount-card-code');
                traveler.uiMode=uiMode.assigned;
                // add DC to discountCards object
                addToDiscountCards(traveler, discountCardSource.shoppingCard, $(value).attr('data-discount-card-code'));
            }else{
                var trIndex = 'traveller'+traveler.count;
                if(mappingHistory[trIndex]!==travelersDiscountCardsMapping[trIndex]){
                    traveler.uiMode=uiMode.init;
                    $(traveler).removeProp('discountCard');
                }
                // remove DC from discountCards object
                removeFromDiscountCards(traveler);
            }
        });
        // from OPC
        var addedDiscountCheckbox = travellerSection.find('.cartItemCheckbox[data-item-name="addedDiscountCard"]');
        $(addedDiscountCheckbox).each(function(key, value){
            if($(value).prop('checked') == true){
                travelersDiscountCardsMapping['traveller'+traveler.count]=$(value).attr('data-discount-card-code');
                traveler.uiMode=uiMode.assigned;
                // add DC to discountCards object
                addToDiscountCards(traveler, discountCardSource.OPC, $(value).attr('data-discount-card-code'));
            }else{
                var trIndex = 'traveller'+traveler.count;
                if(mappingHistory[trIndex]!==travelersDiscountCardsMapping[trIndex]){
                    traveler.uiMode=uiMode.init;
                    $(traveler).removeProp('discountCard');
                }
                // remove DC from discountCards object
                removeFromDiscountCards(traveler);
            }
        });
    }
}

function checkCartItemsDiscount(traveler){
    if(discountType.ISIC == travelersDiscountCardsMapping['traveller'+traveler.count]){
        if(traveler.discountCard == undefined){
            var isicCard = {
                number:'',
                expMonth:'',
                expYear:'',
                schoolName:'',
                schoolCheck:false,
                currency: "$",
                total: 0.00,
                cardType: cardType.isic,
                type: "ISIC",
                cardName: additional_traveller_settings.cardLabels.isicCardLabel.isicCardName
            }
            isicCard.currency=getDiscountCurrencyFromShoppingCard(isicCard.type);
            isicCard.total=getDiscountCardPriceFromShoppingCard(isicCard.type);
            setTravelerProperty(traveler,'discountCard',isicCard);
        }
        return true;
    }
    if(discountType.IYTC == travelersDiscountCardsMapping['traveller'+traveler.count]){
        if(traveler.discountCard == undefined){
            var youthCard = {
                number:'',
                expMonth:'',
                expYear:'',
                schoolName:'',
                schoolCheck:false,
                currency: "$",
                total: 0.00,
                cardType: cardType.iytc,
                type: "IYTC",
                cardName: additional_traveller_settings.cardLabels.iytcCardLabel.iytcCardName
            }
            youthCard.currency = getDiscountCurrencyFromShoppingCard(youthCard.type);
            youthCard.total = getDiscountCardPriceFromShoppingCard(youthCard.type);
            setTravelerProperty(traveler,'discountCard',youthCard);
        }
        return true;
    }
    if(discountType.TEACHER == travelersDiscountCardsMapping['traveller'+traveler.count]){
        if(traveler.discountCard == undefined){
            var teacherCard = {
                number:'',
                expMonth:'',
                expYear:'',
                schoolName:'',
                schoolCheck:false,
                currency: "$",
                total: 0.00,
                cardType: cardType.itic,
                type: "TEACHER",
                cardName: additional_traveller_settings.cardLabels.iticCardLabel.teacherCardName
            }
            teacherCard.currency = getDiscountCurrencyFromShoppingCard(teacherCard.type);
            teacherCard.total = getDiscountCardPriceFromShoppingCard(teacherCard.type);
            setTravelerProperty(traveler,'discountCard',teacherCard);
        }
        return true;
    }
    return false;
}

// Version 2

var uiMode = {
    init: 0,
    workflow: 1,
    purchase: 2,
    summary: 3,
    show: 4,
    flightReassigned: 5,
    assigned: 6
}

var cardType = {
    isic: 0,
    iytc: 1,
    itic: 2,
    mixed: 3
}

var defaultCard = {
    number:'',
    expMonth:'',
    expYear:'',
    schoolName:'',
    schoolCheck:false,
    currency: "$",
    total: 0.00,
    cardType: cardType.isic,
    type: "ISIC",
    cardName: "INTERNATIONAL STUDENT IDENTITY CARD"
}

function getStatuses(uiMode){
    var count = 0;
    for (var item in travellerDetailsObj ) {
        var traveler = travellerDetailsObj[item];
        if ( uiMode == traveler.uiMode){
            count++;
        }
    }
    return count;
}

function getPurchaseStatus(){
    var count = 0;
    for (var item in travellerDetailsObj ) {
        var traveler = travellerDetailsObj[item];
        if (traveler.hasOwnProperty('discountCard') && traveler.discountCard.total > 0){
            count++;
        }
    }
    return count;
}


function continueBtnController(hideBtn){
    if(hideBtn !== true){
        var flightReassignedStatus = getStatuses(uiMode.flightReassigned);
        var assignedStatus = getStatuses(uiMode.assigned);

        var workflowStatuses = getStatuses(uiMode.workflow);
        var purchaseStatuses = getPurchaseStatus()-assignedStatus-flightReassignedStatus;
        var summaryStatuses = getStatuses(uiMode.summary);
        var travellers = getTravelersCount()-assignedStatus-flightReassignedStatus;
        //console.log("Issue with continue btn: travellers=" + travellers);
        if((workflowStatuses == 0 && purchaseStatuses == 0 && summaryStatuses == 0)||
            (workflowStatuses == 0 && purchaseStatuses == 0 && summaryStatuses > 0)||
            (workflowStatuses == 0 && summaryStatuses >= 0 && purchaseStatuses <= travellers)||
            (workflowStatuses == 0 && summaryStatuses >= 0 && purchaseStatuses == 1)){
            $('#discountContinueBtn_workflow').hide();
        } else {
            if (workflowStatuses > 0 || purchaseStatuses >0){
                $('#discountContinueBtn_workflow').show();
            }
        }
    } else {
        $('#discountContinueBtn_workflow').hide();
    }

}

function uiController(traveller, hideSections){
    if (hideSections == true){
        $('#discountWorkflow_' + traveller.count).css('display', 'none');
        $('#discountPurchase_' + traveller.count).css('display', 'none');
        $('#discountSummary_' + traveller.count).css('display', 'none');
    }else{
        var mode = traveller.uiMode;
        switch(mode) {
            case 0:
                break;
            case 1:
                var section = $('#discountWorkflow_' + traveller.count);

                drawWorkflowUI(section, traveller);

                removeDiscountDataControls('#discountPurchase_' + traveller.count);
                var cardNumberControl = section.find('.isicCardNumberInput');
                var cardExpiryMonthControl = section.find('.expireMonthSelect');
                var cardExpiryYearControl = section.find('.expireYearSelect');
                var cardCodeControl = section.find('.cardCodeInput');
                var cardNumberControlName = 'traveler' + (traveller.count - 1) + '.cardNumber';
                var cardExpiryMonthControlName = 'traveler' + (traveller.count - 1) + '.cardExpiryMonth';
                var cardExpiryYearControlName = 'traveler' + (traveller.count - 1) + '.cardExpiryYear';
                var cardCodeControlName = 'discountCardCode' + (traveller.count - 1);
                cardNumberControl.attr('data-control-name',cardNumberControlName).addClass('opcFormData').attr('data-traveler-count',traveller.count).attr('data-card-info-control','cardNumber');
                cardExpiryMonthControl.attr('data-control-name',cardExpiryMonthControlName).addClass('opcFormData').attr('data-traveler-count',traveller.count).attr('data-card-info-control','cardExpiryMonth');
                cardExpiryYearControl.attr('data-control-name',cardExpiryYearControlName).addClass('opcFormData').attr('data-traveler-count',traveller.count).attr('data-card-info-control','cardExpiryYear');
                cardCodeControl.attr('data-control-name',cardCodeControlName).addClass('opcFormData').val(traveller.discountCard.type).attr('data-traveler-count',traveller.count).attr('data-card-info-control','discountCardCode');

                $(section).stop().slideDown(350);
                break;
            case 2:
                var section = $('#discountPurchase_' + traveller.count);
                $(section).find('.travelerName').html($(traveller).prop('firstName') + ' '
                + $(traveller).prop('lastName'));
                drawPurchaseUI(section, traveller);

                getDiscountPrice($('#discountPurchase_' + traveller.count), traveller.discountCard.type);

                removeDiscountDataControls('#discountWorkflow_' + traveller.count);
                var schoolNameControl = section.find('.schoolNameInput');
                var proofsControl = section.find('.schoolNameCheckbox');
                var cardCodeControl = section.find('.cardCodeInput');
                var schoolNameControlName = 'traveler' + (traveller.count - 1) + '.schoolName';
                var proofsControlName = 'traveler' + (traveller.count - 1) + '.proofs';
                var cardCodeControlName = 'discountCard' + (traveller.count - 1) + '.cardCode';
                schoolNameControl.attr('data-control-name',schoolNameControlName).addClass('opcFormData').attr('data-traveler-count',traveller.count).attr('data-card-info-control','schoolName');
                proofsControl.attr('data-control-name',proofsControlName).addClass('opcFormData').attr('data-traveler-count',traveller.count).attr('data-card-info-control','proofs');
                cardCodeControl.attr('data-control-name',cardCodeControlName).addClass('opcFormData').val(traveller.discountCard.type).attr('data-traveler-count',traveller.count).attr('data-card-info-control','cardCode');

                $(section).stop().slideDown(350);
                break;
            case 3:
                var section = $('#discountSummary_' + traveller.count);
                $(section).find('.travellerName').html($(traveller).prop('firstName') + ' '
                + $(traveller).prop('lastName'));
                $(section).find('.discountCardNumber').html(traveller.discountCard.number);
                $(section).find('.discountCardExpiration').html(traveller.discountCard.expMonth + ' '
                + traveller.discountCard.expYear);

                drawSummaryUI(section, traveller);

                $('#discountSummary_' + traveller.count).css('display', 'block');
                $('#discountWorkflow_' + traveller.count).css('display', 'none');
                break;
            case 4:
                break;
            case 5:
                $('#discountWorkflow_' + traveller.count).css('display', 'none');
                $('#discountPurchase_' + traveller.count).css('display', 'none');
                $('#discountSummary_' + traveller.count).css('display', 'none');
                break;
            case 6:
                $('#discountWorkflow_' + traveller.count).css('display', 'none');
                $('#discountPurchase_' + traveller.count).css('display', 'none');
                $('#discountSummary_' + traveller.count).css('display', 'none');
                break;
            default:
        }
    }
    continueBtnController(false);
}

function updateTraveller(traveller) {
    var section = $('#discountWorkflow_' + traveller.count);
    traveller.discountCard.number = $(section).find('.isicCardNumberInput').val();
    traveller.discountCard.expMonth = $(section).find('.expireMonthSelect option:selected').text();
    traveller.discountCard.expYear = $(section).find('.expireYearSelect').val();
    var validationResults = validate(traveller);
    if(validationResults.length==0) {
        traveller.uiMode = uiMode.summary;
    }else{
        //console.log('Traveller section is opened in workflow mode but was not updated.')
    }
}

function updateTravellerSummary(traveller){
    //var section = $('#discountWorkflow_' + travelerNumberToEdit);
    //$(section).find('.isicCardNumberInput').val(traveller.discountCard.number);
    //$(section).find('.expireMonthSelect option:selected').text();
    //$(section).find('.expireYearSelect').val(traveller.discountCard.expYear);
    //traveller.uiMode = uiMode.workflow;
}

function modeController(traveller){
    var mode = traveller.uiMode;
    switch(mode) {
        case 0://init
            initTravellerObject(traveller);
            initUITravellerModel(traveller);
            break;
        case 1://workflow
            initUITravellerModel(traveller);
            updateTraveller(traveller);
            break;
        case 2://purchase
            initUITravellerModel(traveller);
            break;
        case 3://summary
            initUITravellerModel(traveller);
            updateTravellerSummary(traveller);
            break;
        case 4://show
            break;
        case 5://hide
            break;
        case 6://assigned
            break;
        default:
            initTravellerObject(traveller);
            initUITravellerModel(traveller);
    }
    uiController(traveller);
}

var SummaryUI = function(){
    this.cardType = '';
};

SummaryUI.prototype = {
    setStrategy: function(cardType){
        this.cardType = cardType;
    },
    drawEditTravelerDiscountBtn: function(){
        return this.cardType.drawEditTravelerDiscountBtn();
    },
    drawDiscountCardInfoLabel: function(){
        return this.cardType.drawDiscountCardInfoLabel();
    },
    drawCardName: function(){
        return this.cardType.drawCardName();
    }
};

var ISICSummary = function(){
    this.drawEditTravelerDiscountBtn = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.isicEditLink;
    },
        this.drawDiscountCardInfoLabel = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSummaryNumber;
        },
        this.drawCardName = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSummaryDetails;
        }
};

var IYTCSummary = function(){
    this.drawEditTravelerDiscountBtn = function(){
        return additional_traveller_settings.cardLabels.iytcCardLabel.iytcEditLink;
    },
        this.drawDiscountCardInfoLabel = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcSummaryNumber;
        },
        this.drawCardName = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcSummaryDetails;
        }
};

var ITICSummary = function(){
    this.drawEditTravelerDiscountBtn = function(){
        return additional_traveller_settings.cardLabels.iticCardLabel.iticEditLink;
    },
        this.drawDiscountCardInfoLabel = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticSummaryNumber;
        },
        this.drawCardName = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticSummaryDetails;
        }

};

var MIXSummary = function(){
    this.drawEditTravelerDiscountBtn = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.isicEditLink;
    },
        this.drawDiscountCardInfoLabel = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSummaryNumber;
        },
        this.drawCardName = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSummaryDetails;
        }
};

var isicSummary = new ISICSummary();
var iytcSummary = new IYTCSummary();
var iticSummary = new ITICSummary();
var mixedSummary = new MIXSummary();
var summary = new SummaryUI();

function drawSummaryUI(section, traveller) {
    if (traveller.discountCard.cardType == 0) {
        summary.setStrategy(isicSummary);
    }
    if (traveller.discountCard.cardType == 1) {
        summary.setStrategy(iytcSummary);
    }
    if (traveller.discountCard.cardType == 2) {
        summary.setStrategy(iticSummary);
    }
    if (traveller.discountCard.cardType == 3) {
        summary.setStrategy(mixedSummary);
    }
    $(section).find('.editTravelerDiscountBtn').html(summary.drawEditTravelerDiscountBtn());
    $(section).find('.discountCardInfoLabel').eq(0).html(summary.drawDiscountCardInfoLabel());
    $(section).find('.cardName').html(summary.drawCardName());
}

var PurchaseUI = function(){
    this.cardType = '';
};

PurchaseUI.prototype = {
    setStrategy: function(cardType){
        this.cardType = cardType;
    },
    drawInsertAfterElement: function(){
        return this.cardType.drawInsertAfterElement();
    },
    drawSubTitle: function(){
        return this.cardType.drawSubTitle();
    },
    drawDiscountCardLabel: function(){
        return this.cardType.drawDiscountCardLabel();
    },
    drawSubmitTravellerDiscountCardBtn: function(){
        return this.cardType.drawSubmitTravellerDiscountCardBtn();
    },
    drawHaveIsicLink: function(){
        return this.cardType.drawHaveIsicLink();
    },
    drawPurchaseImagesBullets: function(traveller){
        return this.cardType.drawPurchaseImagesBullets(traveller);
    }
};

var ISICPurchase = function(){
    this.drawInsertAfterElement = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.isicPurchaseTitle;
    },
        this.drawSubTitle = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSchoolNameBoxSubTitle;
        },
        this.drawDiscountCardLabel = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicDiscountCardLabel;
        },
        this.drawSubmitTravellerDiscountCardBtn = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicPurchaseBtn;
        },
        this.drawHaveIsicLink = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicLink;
        },
        this.drawPurchaseImagesBullets = function(traveller){
            $('#discountPurchase_' + traveller.count).find('#isicImgBox').show();
            $('#discountPurchase_' + traveller.count).find('#isicBullets').show();
        }
};

var IYTCPurchase = function(){
    this.drawInsertAfterElement = function(){
        return additional_traveller_settings.cardLabels.iytcCardLabel.iytcPurchaseTitle;
    },
        this.drawSubTitle = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcSchoolNameBoxSubTitle;
        },
        this.drawDiscountCardLabel = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcDiscountCardLabel;
        },
        this.drawSubmitTravellerDiscountCardBtn = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcPurchaseBtn;
        },
        this.drawHaveIsicLink = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcLink;
        },
        this.drawPurchaseImagesBullets = function(traveller){
            $('#discountPurchase_' + traveller.count).find('#iytcImgBox').show();
            $('#discountPurchase_' + traveller.count).find('#iytcBullets').show();
        }
};

var ITICPurchase = function(){
    this.drawInsertAfterElement = function(){
        return additional_traveller_settings.cardLabels.iticCardLabel.iticPurchaseTitle;
    },
        this.drawSubTitle = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticSchoolNameBoxSubTitle;
        },
        this.drawDiscountCardLabel = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticDiscountCardLabel;
        },
        this.drawSubmitTravellerDiscountCardBtn = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticPurchaseBtn;
        },
        this.drawHaveIsicLink = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.iticLink;
        },
        this.drawPurchaseImagesBullets = function(traveller){
            $('#discountPurchase_' + traveller.count).find('#iticImgBox').show();
            $('#discountPurchase_' + traveller.count).find('#iticBullets').show();
        }
};

var MIXPurchase = function(){
    this.drawInsertAfterElement = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.isicPurchaseTitle;
    },
        this.drawSubTitle = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicSchoolNameBoxSubTitle;
        },
        this.drawDiscountCardLabel = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicDiscountCardLabel;
        },
        this.drawSubmitTravellerDiscountCardBtn = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicPurchaseBtn;
        },
        this.drawHaveIsicLink = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicLink;
        },
        this.drawPurchaseImagesBullets = function(traveller){
            $('#discountPurchase_' + traveller.count).find('#isicImgBox').show();
            $('#discountPurchase_' + traveller.count).find('#isicBullets').show();
        }
};

var isicPurchase = new ISICPurchase();
var iytcPurchase = new IYTCPurchase();
var iticPurchase = new ITICPurchase();
var mixedPurchase = new MIXPurchase();
var purchase = new PurchaseUI();

function drawPurchaseUI(section, traveller){
    if(traveller.discountCard.cardType == 0){
        purchase.setStrategy(isicPurchase);
    }
    if ( traveller.discountCard.cardType == 1){
        purchase.setStrategy(iytcPurchase);
    }
    if ( traveller.discountCard.cardType == 2){
        purchase.setStrategy(iticPurchase);
    }
    if ( traveller.discountCard.cardType == 3){
        purchase.setStrategy(mixedPurchase);
    }
    if($(section).find('.inserAfterElement').length == 0){
        $('<div class="inserAfterElement">'
        + purchase.drawInsertAfterElement() + '</div>').insertAfter($(section).find('.travelerName'));
    } else {
        $(section).find('.inserAfterElement').html(purchase.drawInsertAfterElement());
    }
    $(section).find('.subtitle').eq(1).html(purchase.drawSubTitle());
    $(section).find('.discountCardLabel').html(purchase.drawDiscountCardLabel());
    $(section).find('.submitTravellerDiscountCardBtn').html(purchase.drawSubmitTravellerDiscountCardBtn());
    $(section).find('.haveIsicLink').html(purchase.drawHaveIsicLink());

    if(traveller.discountCard.cardType == 1){
        $(section).find('.schoolNameBox').hide();
    }else{
        $(section).find('.schoolNameBox').show();
        $(section).find('.schoolNameInput').attr('id','schoolNameInput_' + traveller.count);
    }

    $('#discountPurchase_' + traveller.count).find('#isicImgBox').hide();
    $('#discountPurchase_' + traveller.count).find('#iticImgBox').hide();
    $('#discountPurchase_' + traveller.count).find('#iytcImgBox').hide();

    $('#discountPurchase_' + traveller.count).find('#isicBullets').hide();
    $('#discountPurchase_' + traveller.count).find('#iytcBullets').hide();
    $('#discountPurchase_' + traveller.count).find('#iticBullets').hide();
    purchase.drawPurchaseImagesBullets(traveller);
}

var WorkflowUI = function(){
    this.cardType = '';
};

WorkflowUI.prototype = {
    setStrategy: function(cardType){
        this.cardType = cardType;
    },
    drawBuyCardText: function(){
        return this.cardType.drawBuyCardText();
    },
    drawH6Text: function(){
        return this.cardType.drawH6Text();
    },
    drawCartNumber: function(){
        return this.cardType.drawCartNumber();
    },
    drawQuestionSign: function(){
        return this.cardType.drawQuestionSign();
    },
    drawMessageByCardType: function(){
        return this.cardType.drawMessageByCardType();
    }
};

var ISICWorkflow = function(){
    this.drawBuyCardText = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.dontHaveMsg;
    },
        this.drawH6Text = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.text1;
        },
        this.drawCartNumber = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.cardNumberLabel;
        },
        this.drawQuestionSign = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicWorkFlowQuestionSign;
        },
        this.drawMessageByCardType = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.cardRequiredMsg;
        }
};

var IYTCWorkflow = function(){
    this.drawBuyCardText = function(){
        return additional_traveller_settings.cardLabels.iytcCardLabel.dontHaveMsg;
    },
        this.drawH6Text = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.text1;
        },
        this.drawCartNumber = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.cardNumberLabel;
        },
        this.drawQuestionSign = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.iytcWorkFlowQuestionSign;
        },
        this.drawMessageByCardType = function(){
            return additional_traveller_settings.cardLabels.iytcCardLabel.cardRequiredMsg;
        }
};

var ITICWorkflow = function(){
    this.drawBuyCardText = function(){
        return additional_traveller_settings.cardLabels.iticCardLabel.dontHaveMsg;
    },
        this.drawH6Text = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.text1;
        },
        this.drawCartNumber = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.cardNumberLabel;
        },
        this.drawQuestionSign = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.teacherWorkFlowQuestionSign;
        },
        this.drawMessageByCardType = function(){
            return additional_traveller_settings.cardLabels.iticCardLabel.cardRequiredMsg;
        }
};

var MIXWorkflow = function(){
    this.drawBuyCardText = function(){
        return additional_traveller_settings.cardLabels.isicCardLabel.dontHaveMsg;
    },
        this.drawH6Text = function(){
            return additional_traveller_settings.cardLabels.mixedCardLabel.text1;
        },
        this.drawCartNumber = function(){
            return additional_traveller_settings.cardLabels.mixedCardLabel.cardNumberLabel;
        },
        this.drawQuestionSign = function(){
            return additional_traveller_settings.cardLabels.isicCardLabel.isicWorkFlowQuestionSign;
        },
        this.drawMessageByCardType = function(){
            return additional_traveller_settings.cardLabels.mixedCardLabel.cardRequiredMsg;
        }
};

var isic = new ISICWorkflow();
var iytc = new IYTCWorkflow();
var itic = new ITICWorkflow();
var mixed = new MIXWorkflow();
var workflow = new WorkflowUI();
/*
 *    isic: 0,
 iytc: 1,
 itic: 2,
 mixed: 3
 * */
function drawWorkflowUI(section, traveller){
    if(traveller.discountCard.cardType == 0){
        workflow.setStrategy(isic);
    }
    if ( traveller.discountCard.cardType == 1){
        workflow.setStrategy(iytc);
    }
    if ( traveller.discountCard.cardType == 2){
        workflow.setStrategy(itic);
    }
    if ( traveller.discountCard.cardType == 3){
        workflow.setStrategy(mixed);
    }
    $(section).find('h5').html(traveller.firstName + ' '
    + traveller.lastName + replaceCurvels(workflow.drawMessageByCardType()));
    $(section).find('.buyCardText').html(workflow.drawBuyCardText());
    $(section).find('h6').html(workflow.drawH6Text());
    $(section).find("label[name~='cardNumberLabel']").html(workflow.drawCartNumber());
    $(section).find('.lightboxContent').find('p').html(workflow.drawQuestionSign());
}


function addWorkflowSection(parentUIPanel, traveller){
    var section = $('.travellerCardWorkflowSection.tmpl').clone();
    $(section).removeClass('tmpl');
    $(section).attr('id','discountWorkflow_' + traveller.count);
    $(section).find('.buyCardLink').attr('id','discountBuyLink_'+ traveller.count);

    if (traveller.cardNumber && traveller.cardExpiryMonth && traveller.cardExpiryYear) {
        $(section).find('.isicCardNumberInput').val(traveller.cardNumber);
        $(section).find('.expireMonthSelect').val(traveller.cardExpiryMonth);
        $(section).find('.expireYearSelect').val(traveller.cardExpiryYear);

        $(section).find('.isicCardNumberInput').closest('.formRow').addClass('validRow');
        $(section).find('.expireMonthSelect').closest('.formRow').addClass('validRow');
    }

    switch(traveller.discountCard.cardType) {
        case 0:
            $(section).find('h5').html(getTravelerProperty(traveller, 'firstName') + ' ' + getTravelerProperty(traveller, 'lastName')
            + replaceCurvels(additional_traveller_settings.cardLabels.isicCardLabel.cardRequiredMsg));
            $(section).find("label[name~='cardNumberLabel']").html(additional_traveller_settings.cardLabels.isicCardLabel.cardNumberLabel);
            $(section).find("label[name~='expDateLabel']").html(additional_traveller_settings.cardLabels.isicCardLabel.expireDateLabel);
            $(section).find('h6').html(additional_traveller_settings.cardLabels.isicCardLabel.text1);
            $(section).find('p').html(additional_traveller_settings.cardLabels.isicCardLabel.text2);
            $(section).find('.buyCardText').html(additional_traveller_settings.cardLabels.isicCardLabel.dontHaveMsg);
            break;
        case 1:
            $(section).find('h5').html(getTravelerProperty(traveller, 'firstName') + ' ' + getTravelerProperty(traveller, 'lastName')
            + replaceCurvels(additional_traveller_settings.cardLabels.iytcCardLabel.cardRequiredMsg));
            $(section).find("label[name~='cardNumberLabel']").html(additional_traveller_settings.cardLabels.iytcCardLabel.cardNumberLabel);
            $(section).find("label[name~='expDateLabel']").html(additional_traveller_settings.cardLabels.iytcCardLabel.expireDateLabel);
            $(section).find('h6').html(additional_traveller_settings.cardLabels.iytcCardLabel.text1);
            $(section).find('p').html(additional_traveller_settings.cardLabels.iytcCardLabel.text2);
            $(section).find('.buyCardText').html(additional_traveller_settings.cardLabels.iytcCardLabel.dontHaveMsg);
            break;
        case 2:
            $(section).find('h5').html(getTravelerProperty(traveller, 'firstName') + ' ' + getTravelerProperty(traveller, 'lastName')
            + replaceCurvels(additional_traveller_settings.cardLabels.iticCardLabel.cardRequiredMsg));
            $(section).find("label[name~='cardNumberLabel']").html(additional_traveller_settings.cardLabels.iticCardLabel.cardNumberLabel);
            $(section).find("label[name~='expDateLabel']").html(additional_traveller_settings.cardLabels.iticCardLabel.expireDateLabel);
            $(section).find('h6').html(additional_traveller_settings.cardLabels.iticCardLabel.text1);
            $(section).find('p').html(additional_traveller_settings.cardLabels.iticCardLabel.text2);
            $(section).find('.buyCardText').html(additional_traveller_settings.cardLabels.iticCardLabel.dontHaveMsg);
            break;
        case 3:
            $(section).find('h5').html(getTravelerProperty(traveller, 'firstName') + ' ' + getTravelerProperty(traveller, 'lastName')
            + replaceCurvels(additional_traveller_settings.cardLabels.mixedCardLabel.cardRequiredMsg));
            $(section).find("label[name~='cardNumberLabel']").html(additional_traveller_settings.cardLabels.mixedCardLabel.cardNumberLabel);
            $(section).find("label[name~='expDateLabel']").html(additional_traveller_settings.cardLabels.isicCardLabel.expireDateLabel);
            $(section).find('h6').html(additional_traveller_settings.cardLabels.isicCardLabel.text1);
            $(section).find('p').html(additional_traveller_settings.cardLabels.isicCardLabel.text2);
            $(section).find('.buyCardText').html(additional_traveller_settings.cardLabels.isicCardLabel.dontHaveMsg);
            break;
        default:
            throw "There is no such discount type. Please check your discount cards.";
    }
    $(parentUIPanel).append(section);
}

function addPurchaseSection(parentUIPanel, traveller){
    var section =  $('.travellerCardPurchaseSection.tmpl').clone().removeClass('tmpl');
    $(section).find('.travelerName').html($(traveller).prop('firstName') + ' '
    + $(traveller).prop('lastName'));
    // remove school name section from purchse UI for IYTC card
    if(traveller.discountCard.cardType == 1){
        $(section).find('.schoolNameBox').hide();
    }else{
        $(section).find('.schoolNameBox').show();
        $(section).find('.schoolNameInput').attr('id','schoolNameInput_' + traveller.count);
    }
    $(section).attr('id', "discountPurchase_" + traveller.count);
    $(section).find('.submitTravellerDiscountCardBtn').attr('id',
        'addDiscountCardBtn_' + traveller.count);
    $(section).find('.haveIsicLink').attr('id', 'haveDiscount_' + traveller.count);
    $(parentUIPanel).append(section);
}

function addSummarySection(parentUIPanel, traveller){
    var section =  $('.discountCardSummaryBox.tmpl').clone().removeClass('tmpl');
    $(section).attr('id', "discountSummary_" + traveller.count);
    $(section).find('.travellerName').html($(traveller).prop('firstName') + ' '
    + $(traveller).prop('lastName'));
    $(section).find('.editBtn').attr('id', 'editBtn_' + traveller.count);
    $(section).find('.discountCardNumber').html(traveller.discountCard.number);
    $(section).find('.discountCardExpiration').html(traveller.discountCard.expireMonthSelect + ' '
    + traveller.discountCard.expireYearSelect);
    switch(traveller.discountCard.cardType){
        case 0:
            // cardLabels already done in tmpl for isic
            break;
        case 1:
            $(section).find('.discountCardInfoLabel').html(additional_traveller_settings.iytcSummaryNumber);
            $(section).find('.cardName').html(additional_traveller_settings.iytcSummaryDetails);
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            throw "There is no such discount type. Please check your discount cards.";
    }
    $(parentUIPanel).append(section);
}

function addContinueBtn(){
    var section = $('.discountContinueBtn.tmpl').clone();
    $(section).removeClass('tmpl');
    $(section).attr('id', "discountContinueBtn_workflow");
    $('.travellerDiscountCardsContinueBtnPanel').append(section);
}

function cleanParentUI(){
    var parentPanel = $('.travellerCardWorkflowPanel');
    //clean parent UI section
    $(parentPanel).empty();
}

function initUITravellerModel(traveller){
    var parentPanel = $('.travellerCardWorkflowPanel');
    addWorkflowSection(parentPanel, traveller);
    addPurchaseSection(parentPanel, traveller);
    addSummarySection(parentPanel, traveller);
    addContinueBtn();
}

function initTravellerObject(traveller){
    //setTravelerProperty(traveller, 'needSchoolName', false);
    //setTravelerProperty(traveller, 'needCardInfo', false);
    setTravelerProperty(traveller, 'uiMode', uiMode.workflow);
    //setTravelerProperty(traveller, 'discountCard', defaultCard);
}

function editTravellerDiscountCard(event){
    var id = event.currentTarget.id;
    var travelerNumber = id.split('_')[1];
    var traveler = getTraveler(travelerNumber);
    traveler.uiMode = uiMode.workflow;
    var section = $('#discountWorkflow_' + traveler.count);
    $(section).find('.isicCardNumberInput').val(traveler.discountCard.number);

    $('.expireMonthSelect').children().filter(function() {
        return $(this).text() == traveler.discountCard.expMonth;
    }).prop('selected', true);

    $(section).find('.expireYearSelect').val(traveler.discountCard.expYear);
    uiController(traveler, true);
    uiController(traveler, false);
}

function buyDiscountCard(event){
    var id = event.currentTarget.id;
    var travelerNumber = id.split('_')[1];
    var traveler = getTraveler(travelerNumber);
    traveler.uiMode = uiMode.purchase;
    uiController(traveler, true);
    uiController(traveler, false);
}

function haveDiscountCard(event){
    var id = event.currentTarget.id;
    var travelerNumber = id.split('_')[1];
    var traveler = getTraveler(travelerNumber);
    traveler.uiMode = uiMode.workflow;
    uiController(traveler, true);
    uiController(traveler, false);
}

function getDiscountCardByType(traveller, schoolName,schoolCheck,currency,total){
    var currentCardType = traveller.discountCard.cardType;
    var currentType = traveller.discountCard.type;
    var currentCardName = traveller.discountCard.cardName;
    return {
        number:'',
        expMonth:'',
        expYear:'',
        schoolName:schoolName,
        schoolCheck:schoolCheck,
        currency: currency,
        total: total,
        cardType: currentCardType,
        type: currentType,
        cardName: currentCardName
    }
}

function getDiscountPrice(discountPurchase, cardType){
    var discountPrice = $(discountPurchase).find('#' + cardType.toUpperCase()).html();
    var dataPrice = $(discountPurchase).find('#' + cardType.toUpperCase()).attr('data-price');
    var currency = $(discountPurchase).find('#' + cardType.toUpperCase()).attr('data-currency');
    var dataDisplay = $(discountPurchase).find('#' + cardType.toUpperCase()).attr('data-display');
    $(discountPurchase).find('.price').attr('data-price', dataPrice);
    $(discountPurchase).find('.price').attr('data-currency', currency);
    $(discountPurchase).find('.price').attr('data-display', dataDisplay);
    $(discountPurchase).find('.price').html(discountPrice);
}

function addDiscountCard(event) {
    event.preventDefault();
    var id = event.currentTarget.id;
    var travelerNumber = id.split('_')[1];
    var traveler = getTraveler(travelerNumber);
    traveler.uiMode = uiMode.assigned;
    var discountPurchase =$('#discountPurchase_' + travelerNumber);
    var schoolInput = $(discountPurchase).find('.schoolNameInput');
    // remove school name section from validation for IYTC card
    if(traveler.discountCard.cardType != 1) {
        var schoolCheck = $(discountPurchase).find('.schoolNameCheckbox');
        //validation
        var schoolInputValidation = checkout_validation.runFieldValidation(schoolInput);
        // add validator to customCheckBox
        var schoolCheckValidation = checkout_validation.runFieldValidation(schoolCheck);
        var validationResultArr = [];
    }
    if (((schoolInputValidation ==true)&&( schoolCheckValidation == true ))||(traveler.discountCard.cardType == 1)) {
        var textToInsert = insertElementToTravelerSummary(traveler);
        var discountPriceElm = $(discountPurchase).find('.price[data-price]');
        var amount =  discountPriceElm.eq(0).data('price');
        var currency = discountPriceElm.eq(0).data('currency');
        var dataDisplay = discountPriceElm.eq(0).data('display');
        var currencyDisplay = dataDisplay.split(' ')[0];
        var amountFloat = parseFloat(amount);
        var discountCard =getDiscountCardByType(traveler, $(schoolInput).val(), true, currencyDisplay, amountFloat);
        travelersDiscountCardsMapping['traveller'+traveler.count]=discountCard.type;
        // add to discountCards object
        addToDiscountCards(traveler, discountCardSource.OPC, discountCard.type);
        // update all totalPriceBox components
        setTravelerProperty(traveler, 'discountCard', discountCard);
        appendShippingMethodSection();
        updateTotalPriceByDiscountCard(amountFloat);
        // add discount panel to the Side Bar
        addDiscountCardPanel();
        uiController(traveler, true);
        updateNumberOfProducts(1);
        // Google Analytics
        // There is onclick handler on this element that pushs the appropriate data into dataLayer
        discountPurchase.find('#'+traveler.discountCard.type).click();
        // cart items
        addDiscountToCartItems(traveler);
    } else {
        validationResultArr.push(schoolInput.attr('name'));
        validationResultArr.push(schoolCheck.attr('name'));
        //console.log(validationResultArr);
    }
}

function processAdditionalTravellerSections(){
    setTravelersDiscountCardsMapping();
    for (var item in travellerDetailsObj ) {
        var traveler = travellerDetailsObj[item];
        var isDiscount = checkCartItemsDiscount(traveler);
        if(isDiscount !== true) {
            var validationResults = validate(traveler);
            if (validationResults.length == 0) {
                modeController(traveler);
                var opcControlParent = $('.travellerCardWorkflowSection');
                opcControlParent.each(function(){
                    fillOPCFormWithDiscountData($(this));
                });
                $('.travellerCardWorkflowSection').find('.opcFormData').removeClass('opcFormData').attr('data-control-name','');
            } else {
                //console.log('validationResultArr:', validationResults);
            }
        }
    }
}

function youthRevalidation(){
    $('.errorBox.errorNotice').each(function(){
        var travInd = $(this).closest('.travellerSection').data('travellerCount');
        // remove existing discountCard property
        var traveler = getTraveler(travInd);
        $(traveler).removeProp('discountCard');
        // remove old UI for corresponding all travellers, later it will be re-created
        cleanParentUI();
        //set ui mode to init
        traveler.uiMode=uiMode.init;
        // remove warning message
        $(this).remove();
    })
}

function checkDiscountCardsAfterFailure() {
    var result = false;
    var discountCount = 0,
        travellers = 0;
    for (var item in travellerDetailsObj) {
        var traveler = travellerDetailsObj[item];
        if (!traveler.hasOwnProperty('discountCard')
            &&travelersDiscountCardsMapping['traveller'+traveler.count]!=undefined){
            discountCount++;
        }
        travellers++;
    }
    return discountCount == travellers;
}
// if traveller count is the same as DC in shopping card int this case auto assigment should definitely happen
// otherwise it is a bug
function isAutoAssigmentHappend(){
    return additional_traveller_settings.travelerCount == additional_traveller_settings.discountCardCount;
}

function processFlight(traveler){
    var result=true;
    if (traveler.hasOwnProperty('hasFlight')) {
        if (!$(traveler).prop('hasFlight')) {
            // Remove existing discountCard and don't provide new one because it doesn't have flight assigned
            // Provide new card in any other cases
            $(traveler).removeProp('discountCard');
            traveler.uiMode = uiMode.flightReassigned;
            result = false;
        } else {
            if (traveler.uiMode != uiMode.summary && traveler.uiMode != uiMode.purchase
                && traveler.uiMode != uiMode.assigned){
                traveler.uiMode = uiMode.init;
            }
        }
    }
    return result;
}

function processAdditionalTravellerDetails(){
    if (!isAutoAssigmentHappend()){
        if (additional_traveller_settings.hasBasketFlight){
            setTravelersDiscountCardsMapping();

            if(!$.isEmptyObject(discountCards)){
                // update side panel
                //addDiscountCardPanel();
            }

            if(!checkDiscountCardsAfterFailure()){
                setDiscountRequired();
                setPaxAndQualified();
                youthRevalidation();
                for (var item in travellerDetailsObj ) {
                    var traveler = travellerDetailsObj[item];
                    // check if flight was reassigned
                    var hasFlight = processFlight(traveler);
                    if(hasFlight){
                        var isDiscount = checkCartItemsDiscount(traveler);
                        if(isDiscount !== true){
                            var canDiscountProceed = preInitTravellerObject(traveler);
                            if(canDiscountProceed) {
                                if ($(traveler).prop('discountCard') == undefined) {
                                    setTravellerDiscountCard(traveler);
                                }else{
                                    //check if pax was changed: compare current discount type and traveller pax type
                                    changeTravellerDiscountCard(traveler);
                                    uiController(traveler, true);
                                }
                                modeController(traveler);
                            } else{
                                traveler.uiMode=uiMode.init;
                                uiController(traveler, true);
                            }
                        }else{
                            uiController(traveler, true);
                        }

                    }else{
                        uiController(traveler, true);
                    }
                }
                continueBtnController();
            }
        }
    }
    return true;
}


function setPaxAndQualified() {
    var travellerIndex = 1;
    for (var i=0;i<getTravelersCount();i++) {
        var traveller = getTraveler(travellerIndex + i);
        var $travellerSection = $('.travellerSection[data-traveller-count="' + (i + 1) + '"]'),
            hasAssignmentSection = $travellerSection.find('.assignCartItemsSection').length > 0;
        if (hasAssignmentSection
            && !$travellerSection.find('input[type="checkbox"][data-item-name="flight"]:checked').length)
            continue;
        var hasAssignmentSection = $travellerSection.find('.assignCartItemsSection').length > 0,
            passangerAssociations = passangerAssociationUtils.getPAAfterValidation($travellerSection, hasAssignmentSection),
            paxTypeCodeAndQualified = getPaxTypeCodeAndQualified(passangerAssociations, $travellerSection);

        setTravelerProperty(traveller, 'paxType', codeToPaxGroupsMap[paxTypeCodeAndQualified.paxTypeCode]);
        setTravelerProperty(traveller, 'isQualified', paxTypeCodeAndQualified.qualified);
    }
}

function getPaxTypeCodeAndQualified(pa, $travellerSection) {
    var res = {
            paxTypeCode: pa.passengerTypeCode,
            qualified: pa.qualifiedPassengerType
        },
        commonType = forTravellerAgeValidation.flight.commonPaxType;
    if (commonType && commonType !== 'ADT'
        && pa.alternateApplicablePassengerTypeList.length > 0
        && commonType !== pa.passengerTypeCode) {
        var day = $travellerSection.find('.birthDateSelect').val(),
            month = $travellerSection.find('.birthMonthSelect').val(),
            year = $travellerSection.find('.birthYearSelect').val(),
            date = ageValidatorMixin._buildBirthDate({day: day, month: month, year: year}),
            age = ageValidatorMixin._yearsElapsed(date, forTravellerAgeValidation.flight.departureFlightDate);
        for (var i = 0; i < pa.alternateApplicablePassengerTypeList.length; i++) {
            var altPa = pa.alternateApplicablePassengerTypeList[i],
                maxAge = passangerAssociationUtils.hasPassengerTypeMaxAge(altPa) ? altPa.passengerTypeMaxAge : Number.MAX_VALUE,
                minAge = altPa.hasPassengerTypeMinAge ? altPa.passengerTypeMinAge : -1;
            if (age >= minAge && age <= maxAge && commonType === altPa.passengerTypeCode) {
                res.paxTypeCode = altPa.passengerTypeCode;
                res.qualified = altPa.qualifiedPassengerType;
                break;
            }
        }
    }
    return res;
}

var responseText='';

var isDiscountRequired = false;

function setDiscountRequired(){
    isDiscountRequired = additional_traveller_settings.isDiscountRequired;
}

function preInitTravellerObject(traveler){
    setIsUnder26Property(traveler);
    setTravellerHasFlight(traveler);
    var needCard = travelerNeedCard(traveler);
    setTravelerProperty(traveler, 'needCardInfo', needCard );
    return needCard;
}

function setTravellerDiscountCard(traveler){
    var isUnder26 = getTravelerProperty(traveler,'isUnder26');
    defaultCard.cardName= additional_traveller_settings.cardLabels.isicCardLabel.isicCardName;
    if(additional_traveller_settings.isTeacherOnlyFare){
        var teacherCard = {
            number:'',
            expMonth:'',
            expYear:'',
            schoolName:'',
            schoolCheck:false,
            currency: "$",
            total: 0.00,
            cardType: cardType.itic,
            type: "TEACHER",
            cardName: additional_traveller_settings.cardLabels.iticCardLabel.teacherCardName
        }
        setTravelerProperty(traveler,'discountCard',teacherCard);
    }else{
        if (isUnder26 && additional_traveller_settings.isStudentYouthEligibleFare && traveler.paxType=='YOUTH'){
            var youthCard = {
                number:'',
                expMonth:'',
                expYear:'',
                schoolName:'',
                schoolCheck:false,
                currency: "$",
                total: 0.00,
                cardType: cardType.iytc,
                type: "IYTC",
                cardName: additional_traveller_settings.cardLabels.iytcCardLabel.iytcCardName
            }
            setTravelerProperty(traveler,'discountCard',youthCard);
        }else{
            if(isUnder26 && additional_traveller_settings.isStudentYouthEligibleFare && traveler.paxType=='STUDENT'){
                var mixedCard = {
                    number:'',
                    expMonth:'',
                    expYear:'',
                    schoolName:'',
                    schoolCheck:false,
                    currency: "$",
                    total: 0.00,
                    cardType: cardType.mixed,
                    type: "ISIC",
                    cardName: additional_traveller_settings.cardLabels.isicCardLabel.isicCardName
                }
                setTravelerProperty(traveler,'discountCard',mixedCard);
            } else {
                var isicCard = {
                    number:'',
                    expMonth:'',
                    expYear:'',
                    schoolName:'',
                    schoolCheck:false,
                    currency: "$",
                    total: 0.00,
                    cardType: cardType.isic,
                    type: "ISIC",
                    cardName: additional_traveller_settings.cardLabels.isicCardLabel.isicCardName
                }
                setTravelerProperty(traveler,'discountCard',isicCard);
            }
        }
    }
}

function changeTravellerDiscountCard(traveller){
    var currentDiscountCard = traveller.discountCard;
    setTravellerDiscountCard(traveller);
    var updatedDiscountCard = traveller.discountCard;
    if(currentDiscountCard.cardType == updatedDiscountCard.cardType){
        setTravelerProperty(traveller,'discountCard',currentDiscountCard);
    }
}

/*
 * fillOPCFormWithDiscountData
 * fill discount card data to the OPC form
 */
function fillOPCFormWithDiscountData(opcControlParent){
    var OPCForm = $('#OPCForm');
    opcControlParent.find('.opcFormData').each(function(){
        var opcControl = $(this);
        var controlName = opcControl.data('control-name');
        var opcFormControl = OPCForm.find('[data-form-control-name="'+ controlName +'"]');
        var traveller = 'traveller'+opcControl.data('traveler-count');
        var dataName = opcControl.data('card-info-control');

        if( travellerDetailsObj[traveller].hasOwnProperty('discountData') == false ){
            travellerDetailsObj[traveller].discountData = {};
        }

        if( opcControl[0].nodeName == 'INPUT' && opcControl.prop('type') == "checkbox" ){
            opcFormControl.val(opcControl.prop('checked'));
            travellerDetailsObj[traveller].discountData[dataName] = opcControl.prop('checked');
        }
        else if( opcControl[0].nodeName == 'INPUT' && opcControl.prop('type') == "radio" ){
            var radioBtnVal = opcControl.filter(':checked').val();
            opcFormControl.val(radioBtnVal);
            travellerDetailsObj[traveller].discountData[dataName] = radioBtnVal;
        }
        else {
            opcFormControl.val(opcControl.val());
            travellerDetailsObj[traveller].discountData[dataName] = opcControl.val();
        }

    });
}

function removeDiscountDataControls(discountCardSection){
    var discountCardSection = $('.travellerSummaryPanel').find(discountCardSection);
    discountCardSection.find('.opcFormData').removeClass('opcFormData').attr('data-control-name','');
}

function appendShippingMethodSection() {
    var shippingMethodPanel = $('.panelContent .shippingMethodSection');
    if (shippingMethodPanel.length > 0) {
        var sideBarMainSection = $('.sidebarMainSection');
        var giftLength = $(sideBarMainSection).find('.sidebarPanel.giftVouchersBox').length;
        var discCardLength = $(sideBarMainSection).find('.sidebarPanel.discountCardBox').length;

        var shippingMethodMsg;
        if (giftLength > 0) {
            if (discCardLength == 0) {
                shippingMethodMsg = shipping_method_settings.oneDiscCardWithGiftVoucher_msg;
            }
            if (discCardLength > 0) {
                shippingMethodMsg = shipping_method_settings.manyDiscCardWithGiftVoucher_msg;
            }
        } else {
            shippingMethodMsg = shipping_method_settings.manyDiscCard_msg;
        }
        $(shippingMethodPanel).find('.shippingMethodMessage').html(shippingMethodMsg);
    } else {
        var shippingMethodSection_tmpl = $('.shippingMethodSection.contentSection.tmpl').clone();
        $(shippingMethodSection_tmpl).find('.shippingMethodsRadioBtn').attr('data-control-name', 'shippingMethod');
        var inputs = $(shippingMethodSection_tmpl).find('.shippingMethodsRadioBtn');

        $.each(inputs, function(index, input) {
            var price = $(input).data('shipping-method-price-tmp');
            $(input).attr('data-shipping-method-price', price);
            $(input).removeAttr('data-shipping-method-price-tmp');
        });

        var price = $(shippingMethodSection_tmpl).find('.shippingMethodsRadioBtn:checked').data('shipping-method-price');
        updateTotalPriceByVarItem(price, 'shippingMtd');

        var targetElement = $('.paymentMethodSection');
        targetElement.before(shippingMethodSection_tmpl);
        shippingMethodSection_tmpl.stop().slideDown(350, function () {
            $(this).removeClass('tmpl');
        });
    }
}

function addDiscountCardPanel(){
    var sidebar =  $('#pageSidebar');
    sidebar.find('.sidebarPanel.discountCardBox').remove();
    var discountCard_tmpl = $('.sidebarPanel.discountCardBox.tmpl').clone();
    var sidebarPanels = sidebar.find('.sidebarPanel');
    var targetElement = sidebarPanels.eq(sidebarPanels.length - 1);

    var multiFlexBox = sidebar.find('.sidebarPanel.multiFlexPassBox');
    if (multiFlexBox.length == 0) {
        var flightBox = sidebar.find('.sidebarPanel.flightsBox');
        if(flightBox.length == 0){
            targetElement = sidebar.find('.totalPriceBox.topPriceBox');
        } else {
            targetElement = flightBox;
        }
    } else {
        targetElement = multiFlexBox;
    }
    var discountCardObj = {};
    var discountCardsTotalPrice = 0;
    for( var traveller in discountCards){
        if( discountCards[traveller].hasOwnProperty('discountCard') &&
            discountCards[traveller].discountCard.total > 0 ){
            var cardType = discountCards[traveller].discountCard.type;
            if( discountCardObj.hasOwnProperty(cardType) ){
                discountCardObj[cardType].qty += 1;
            }
            else {
                discountCardObj[cardType] = {};
                discountCardObj[cardType].name = discountCards[traveller].discountCard.cardName;
                discountCardObj[cardType].qty = 1;
                discountCardObj[cardType].total = discountCards[traveller].discountCard.total;
                discountCardObj[cardType].currency = discountCards[traveller].discountCard.currency;
                discountCardObj[cardType].type = discountCards[traveller].discountCard.type;
            }
        }
    }
    targetElement.after(discountCard_tmpl);
    var discountCardBox = sidebar.find('.sidebarPanel.discountCardBox.tmpl');
    for( var card in discountCardObj){
        var discountCardInfoBox_tmpl = discountCardBox.find('.discountCardInfoBox.tmpl').clone().removeClass('tmpl');
        var discountCardInfoBoxMobile_tmpl = discountCardBox.find('.discountCardsGrid.tmpl').clone().removeClass('tmpl');
        discountCardInfoBox_tmpl.find('.cardName').html(discountCardObj[card].name);
        discountCardInfoBox_tmpl.find('.cardQty .qty').html(discountCardObj[card].qty);
        discountCardInfoBox_tmpl.find('.cellPrice .price').html(discountCardObj[card].currency+' '+normalizePrice(discountCardObj[card].total, discountCardObj[card].type));
        discountCardBox.find('.sidebarPanelContent').append(discountCardInfoBox_tmpl);
        discountCardInfoBoxMobile_tmpl.find('.cardName').html(discountCardObj[card].name);
        discountCardInfoBoxMobile_tmpl.find('.cardQty .qty').html(discountCardObj[card].qty);
        discountCardInfoBoxMobile_tmpl.find('.cellPrice').html(discountCardObj[card].currency+' '+normalizePrice(discountCardObj[card].total, discountCardObj[card].type));
        discountCardBox.find('.mobileInfoBox').append(discountCardInfoBoxMobile_tmpl);
        discountCardsTotalPrice = discountCardsTotalPrice + (discountCardObj[card].total*discountCardObj[card].qty);
    }
    discountCardBox.find('.sidebarPanelFooter .price').html(discountCardObj[card].currency+' '+normalizePrice(discountCardsTotalPrice, discountCardObj[card].type));
    discountCardBox.slideDown(300,function(){
        $(this).removeClass('tmpl');
    });
}

function addDiscountToCartItems(traveler){
    var cartItemsList = $('.cartItemsList');
    var pageSidebar = $('#pageSidebar');
    var sidebarDiscountPanel = pageSidebar.find('.sidebarPanel.discountCardBox');
    var id = '';
    var travellerSection  = $('.travellerSection[data-traveller-count="'+ traveler.count +'"]');
    var assignCartItemsSectionWrapper = $('.assignCartItemsSectionWrapper');
    var tmplName,
        cardName,
        tmplSubtitle,
        discountCartItemBlock,
        travelerCounter,
        extraTmplName;
    /*
     * choose necessary template
     */
    if( traveler.discountCard.type == "ISIC" ){
        tmplName = "discountWithSchoolNameCartItemBlock";
        tmplSubtitle = additional_traveller_settings.cardLabels.isicCardLabel.isicSchoolNameBoxSubTitle;
        cardName = additional_traveller_settings.cardLabels.isicCardLabel.isicElementToInsert;
    }
    if( traveler.discountCard.type == "IYTC" ){
        tmplName = "discountCartItemBlock";
        cardName = additional_traveller_settings.cardLabels.iytcCardLabel.iytcElementToInsert;
    }
    if( traveler.discountCard.type == "TEACHER" ){
        tmplName = "discountWithSchoolNameCartItemBlock";
        tmplSubtitle = additional_traveller_settings.cardLabels.iticCardLabel.iticSchoolNameBoxSubTitle;
        cardName = additional_traveller_settings.cardLabels.iticCardLabel.iticElementToInsert;
    }

    /*
     * show cartItemList
     */
    if( assignCartItemsSectionObj.autoAssignment == true ){
        for( var j=0; j<assignCartItemsSectionWrapper.length; j++ ){
            var travelerName = 'traveler'+(j+1);
            if( assignCartItemsSectionWrapper.eq(j).find('.assignCartItemsSection').length == 0 ){
                assignCartItemsSectionWrapper.eq(j).append(assignCartItemsSectionObj.sections[travelerName]);
                autoAssignment();
            }
        }
        $('.assignCartItemsSection').removeClass('tmpl');
        cartItemsList = $('.cartItemsList');
    }

    /*
     * add products to cartItemLists
     * assign products to travellers
     */
    if( travellerSection.find('.cartItemCheckbox[data-discount-card-code="'+ traveler.discountCard.type +'"]').length > 0 ){
        var discountCheckbox = travellerSection.find('.cartItemCheckbox[data-discount-card-code="'+ traveler.discountCard.type +'"]');
        discountCartItemBlock = discountCheckbox.closest('li');
        discountCartItemBlock.removeClass('disabled withHelpText');
        discountCheckbox.closest('.customCheckbox').removeClass('disabled');
        discountCheckbox.prop('disabled',false).prop('checked',true).trigger('change.checkboxChange').trigger('change.isicCheckboxChange');
        discountCartItemBlock.find('.schoolNameInput').val(traveler.discountCard.schoolName);
        discountCartItemBlock.find('.schoolNameCheckbox').prop('checked',true).trigger('change.checkboxChange');
    }
    else {
        extraTmplName = traveler.discountCard.type+"cartItemBlock";
        /*
         * set/get itemCounter
         */
        var itemCounter;
        if( cartItemsList.eq(0).find('.withItemCounter').length > 0 ){
            itemCounter = parseInt(cartItemsList.eq(0).find('.withItemCounter').data('item-counter')) + 1;
            cartItemsList.find('.withItemCounter').attr('data-item-counter',itemCounter);
        }
        else {
            itemCounter = assignCartItemsSectionObj.itemCounter;
            assignCartItemsSectionObj.itemCounter = itemCounter+1;
        }

        /*
         * add products to cartItemLists
         */
        cartItemsList.each(function(){
            discountCartItemBlock = $(this).find('.tmpl.'+tmplName).clone().removeClass('tmpl');
            travelerCounter = $(this).closest('.travellerSection').data('traveller-count');
            var elementId = 'cartItem_card_' + (itemCounter) + '_' + travelerCounter;
            var cartName = 'discountCard_' + (itemCounter) + '_' + travelerCounter;
            var discountCartItemCheckbox = discountCartItemBlock.find('.discountCartItemCheckbox');
            var schoolNameInputName = 'traveler' + (parseInt(travelerCounter)-1) + '.schoolName';
            var schoolNameCheckboxName = 'traveler' + (parseInt(travelerCounter)-1) + '.proofs';
            var discountCartItemBlockId = 'cartItem_card_' + (itemCounter) + '_' + travelerCounter + '_block';
            var onclickData = "personalDetails.assignCartItemTo(" + travelerCounter + ",{name:'card',sequence:" + itemCounter +"},this.checked); personalDetails.checkCardBounds(this.checked, " + travelerCounter +", " + itemCounter +");";

            discountCartItemBlock.addClass('disabled withHelpText').addClass(extraTmplName).attr('id',discountCartItemBlockId);
            discountCartItemBlock.find('.listItemText').html(cardName);
            discountCartItemCheckbox.closest('.customCheckbox').addClass('disabled');
            discountCartItemCheckbox.addClass('cartItemCheckbox validationControl').attr('id',elementId).attr('onclick',onclickData).attr('name','cartItemCheckbox').attr('data-cart-name',cartName).attr('data-discount-card-code',traveler.discountCard.type).prop('checked',false).prop('disabled',true);
            var schoolNameBox = discountCartItemBlock.find('.schoolNameBox');
            if( schoolNameBox.length > 0 ){
                schoolNameBox.find('.subtitle').html(tmplSubtitle);
                schoolNameBox.find('.schoolNameInput').attr('data-control-name',schoolNameInputName);
                schoolNameBox.find('.schoolNameCheckbox').attr('data-control-name',schoolNameCheckboxName);
            }
            $(this).find('.tmpl.'+tmplName).after(discountCartItemBlock);
            $(this).closest('.travellerSection').find('.toggledSectionContent').css('height','auto');
        });

        /*
         * assign product to particular traveler
         */
        travellerSection.find('.'+extraTmplName).removeClass('disabled withHelpText');
        travellerSection.find('.'+extraTmplName).find('.customCheckbox').removeClass('disabled');
        travellerSection.find('.'+extraTmplName).find('.discountCartItemCheckbox').prop('disabled',false).prop('checked',true).trigger('change.checkboxChange').trigger('change.isicCheckboxChange');
        travellerSection.find('.'+extraTmplName).find('.schoolNameInput').val(traveler.discountCard.schoolName);
        travellerSection.find('.'+extraTmplName).find('.schoolNameCheckbox').prop('checked',true).trigger('change.checkboxChange');

    }

    /*
     * data transfer between views
     */
    $('.travellerSection').each(function(){
        /*
         * add data from autoAssignmentSection to cartItemsList
         */
        var autoAssignmentSections = $(this).find('.autoAssignmentSection');
        if( autoAssignmentSections.length > 0 ){
            autoAssignmentSections.each(function(){
                var contentForm = $(this).find('.contentForm');
                var boxName;
                if( $(this).hasClass('secureFlightsSection') ){
                    boxName = 'secureFlightBox';
                }
                if( $(this).hasClass('schoolNameSection') ){
                    boxName = 'schoolNameBox';
                }
                if( $(this).hasClass('passportInfoSection') ){
                    boxName = 'passportInfoBox';
                }
                contentForm.find('input').each(function(){
                    var inputType = $(this).attr('type');
                    var inputName = $(this).attr('name');
                    var cartItemFormInput = $(this).closest('.travellerSection').find('.cartItemsList').find('.cartItemTooltipBox.'+boxName).find('input[name="'+ inputName +'"]');
                    cartItemFormInput.val($(this).val());
                    if( inputType == 'checkbox' ){
                        cartItemFormInput.prop('checked', $(this).prop('checked') ).trigger('change.checkboxChange').trigger('change.redressNumberCheckbox');
                    }
                });
                contentForm.find('select,textarea').each(function(){
                    var controlName = $(this).attr('name');
                    var cartItemFormControl = $(this).closest('.travellerSection').find('.cartItemsList').find('.cartItemTooltipBox.'+boxName).find('[name="'+ controlName +'"]');
                    cartItemFormControl.val($(this).val()).trigger('change.customSelectChange');
                });
            });
        }

        /*
         * add sections and data to the travellerSection
         * clone layouts from .assignCartItemsSection to .travellerSection
         */
        var travelerCartItemsList = $(this).find('.cartItemsList');
        var cartItemListForm;
        if( travelerCartItemsList.find('li').not('.tmpl').find('.secureFlightBox').length > 0 ){
            if( $(this).find('.secureFlightsSection').length == 0 ){
                var secureFlightBoxClone = travelerCartItemsList.find('li').not('.tmpl').find('.secureFlightBox').clone(true,true);
                secureFlightBoxClone.removeClass('cartItemTooltipBox secureFlightBox').addClass('secureFlightsSection contentSection autoAssignmentSection').attr('style','');
                $(this).find('.travellerDetailSection').after(secureFlightBoxClone);
                cartItemListForm = travelerCartItemsList.find('li').not('.tmpl').find('.secureFlightBox').find('.contentForm');
                transferDataToTravelerSection(cartItemListForm,$(this),'secureFlightsSection');
            }
        }
        if( travelerCartItemsList.find('li').not('.tmpl').find('.schoolNameBox').length > 0 ){
            if( $(this).find('.schoolNameSection').length == 0 ){
                var schoolNameBoxClone = travelerCartItemsList.find('li').not('.tmpl').find('.schoolNameBox').clone(true,true);
                schoolNameBoxClone.removeClass('cartItemTooltipBox schoolNameBox').addClass('schoolNameSection contentSection autoAssignmentSection').attr('style','');
                if( $(this).find('.secureFlightsSection').length > 0 ){
                    $(this).find('.secureFlightsSection').after(schoolNameBoxClone);
                }
                else {
                    $(this).find('.travellerDetailSection').after(schoolNameBoxClone);
                }
                cartItemListForm = travelerCartItemsList.find('li').not('.tmpl').find('.schoolNameBox').find('.contentForm');
                transferDataToTravelerSection(cartItemListForm,$(this),'schoolNameSection');
            }
        }
        if( travelerCartItemsList.find('li').not('.tmpl').find('.passportInfoBox').length > 0 ){
            if( $(this).find('.passportInfoSection').length == 0 ){
                var passportInfoBoxClone = travelerCartItemsList.find('li').not('.tmpl').find('.passportInfoBox').clone(true,true);
                passportInfoBoxClone.removeClass('cartItemTooltipBox passportInfoBox').addClass('passportInfoSection contentSection autoAssignmentSection').attr('style','');
                if( $(this).find('.schoolNameSection').length > 0 ){
                    $(this).find('.schoolNameSection').after(passportInfoBoxClone);
                }
                else if( $(this).find('.secureFlightsSection').length > 0 ){
                    $(this).find('.secureFlightsSection').after(passportInfoBoxClone);
                }
                else {
                    $(this).find('.travellerDetailSection').after(passportInfoBoxClone);
                }
                cartItemListForm = travelerCartItemsList.find('li').not('.tmpl').find('.passportInfoBox').find('.contentForm');
                transferDataToTravelerSection(cartItemListForm,$(this),'passportInfoSection');
            }
        }
        function transferDataToTravelerSection(cartItemListForm,traveller_section,contentSectionName){
            cartItemListForm.find('input').each(function(){
                var cartItemListFormInputType = $(this).attr('type');
                var cartItemListFormInputName = $(this).attr('name');
                var travelerSectionFormInput = traveller_section.find('.contentSection.'+contentSectionName).find('input[name="'+ cartItemListFormInputName +'"]');
                travelerSectionFormInput.val($(this).val());
                if( cartItemListFormInputType == 'checkbox' ){
                    travelerSectionFormInput.prop('checked',$(this).prop('checked')).trigger('change.checkboxChange').trigger('change.redressNumberCheckbox');
                }
            });
            cartItemListForm.find('select,textarea').each(function(){
                var cartItemListFormControlName = $(this).attr('name');
                var travelerSectionFormControl = traveller_section.find('.contentSection.'+contentSectionName).find('[name="'+ cartItemListFormControlName +'"]');
                travelerSectionFormControl.val($(this).val());
            });
        }
    });

    if( sidebarDiscountPanel.length > 0 ){
        var discountCardInfoBox = sidebarDiscountPanel.find('.infoBox.discountCardInfoBox').not('.tmpl');
        var sidebarPanels = $('.sidebarPanel').not('.discountCardBox').not('.hotelsBox');
        var sidebarHotelPanels = $('.sidebarPanel.hotelsBox');
        var discountAutoAssignmentCheckArr = [];
        var autoAssignmentCheckArr = [];
        var hotelAutoAssignmentCheckArr = [];
        var hotelsQty = 0;
        var cardQty;
        /*
         * build CartItemsSupplementaryMap object
         * object is used for auto assignment logic
         */
        if( CartItemsSupplementaryMap.hasOwnProperty('card') == false ){
            CartItemsSupplementaryMap.card = [];
        }
        for ( var i=0; i<discountCardInfoBox.length; i++ ){
            cardQty = parseInt(discountCardInfoBox.eq(i).find('.cardQty').find('.qty').html());
            if( CartItemsSupplementaryMap.card[i] == undefined ){
                CartItemsSupplementaryMap.card[i] = {};
            }
            CartItemsSupplementaryMap.card[i].free = false;
            if( CartItemsSupplementaryMap.card[i].id == undefined ){
                CartItemsSupplementaryMap.card[i].id = id;
            }
            CartItemsSupplementaryMap.card[i].maxQty = cardQty;
            CartItemsSupplementaryMap.card[i].selectedQty = cardQty;

            if( cardQty == $('.travellerSection').length ){
                discountAutoAssignmentCheckArr.push(true);
            }
        }

        /*
         * get number of each product in the cart
         * push true if number of travelers is equal to number of products
         */
        sidebarPanels.each(function(){
            var productQty = $(this).data('products-qty');
            if( productQty == $('.travellerSection').length ){
                autoAssignmentCheckArr.push(true);
            }
        });
        if( sidebarHotelPanels.length == 0 ){
            hotelsQty = $('.travellerSection').length;
        }
        else {
            sidebarHotelPanels.each(function(){
                hotelsQty += parseInt($(this).data('products-qty'));
            });
        }

        /*
         * show necessary views
         * if number of each product is equal to travelers number, then hide assignCartItemsSection
         * else hide autoAssignmentSections
         */
        if( discountCardInfoBox.length == discountAutoAssignmentCheckArr.length &&
            sidebarPanels.length == autoAssignmentCheckArr.length &&
            hotelsQty == $('.travellerSection').length){
            /*
             * set cartItemsIds
             */
            for( var n=0; n<$('.assignCartItemsSection').length; n++ ){
                travellerDetailsObj[('traveller'+(n+1))].cartItemIds = [];
                travellerDetailsObj[('traveller'+(n+1))].subElementIds = [];
                $('.assignCartItemsSection').eq(n).find('.cartItemCheckbox').each(function(){
                    if( $(this).data('discount-card-code') != undefined ){
                        var card_code = $(this).data('discount-card-code');
                        var cardCodeName_hasCard = 'discountCardCode' + n;
                        var cardCodeName_buyCard = 'discountCard[' + n + '].cardCode';
                        var OPCFormControl_has_discountCard =  $('#OPCForm').find('input[name="'+ cardCodeName_hasCard +'"]');
                        var OPCFormControl_buy_discountCard =  $('#OPCForm').find('input[name="'+ cardCodeName_buyCard +'"]');
                        if( OPCFormControl_has_discountCard.val() != card_code && OPCFormControl_buy_discountCard.val() != card_code ){
                            travellerDetailsObj[('traveller'+(n+1))].cartItemIds.push($(this).data('cart-item-id'));
                        }
                    }
                    else if( $(this).data('item-name') == 'hotel' ){
                        travellerDetailsObj[('traveller'+(n+1))].subElementIds.push($(this).data('cart-item-id'));
                    }
                    else {
                        travellerDetailsObj[('traveller'+(n+1))].cartItemIds.push($(this).data('cart-item-id'));
                    }
                });
            }

            /*
             * hide assignCartItemsSection
             */
            $('.travellerSection').each(function(){
                var assignCartItemsSectionClone = $(this).find('.assignCartItemsSection').detach();
                if( assignCartItemsSectionObj.hasOwnProperty('autoAssignmentSections') == false ){
                    assignCartItemsSectionObj.autoAssignmentSections = {};
                }
                assignCartItemsSectionObj.autoAssignmentSections['traveler'+traveler.count] = assignCartItemsSectionClone;
            });
        }
        else {
            /*
             * hide autoAssignmentSections
             */
            $('.travellerSection').each(function(){
                var autoAssignmentSections = $(this).find('.autoAssignmentSection');
                if( autoAssignmentSections.length > 0 ){
                    var autoAssignmentSectionsClone = autoAssignmentSections.detach();
                    if( assignCartItemsSectionObj.hasOwnProperty('autoAssignmentSections') == false ){
                        assignCartItemsSectionObj.autoAssignmentSections = {};
                    }
                    assignCartItemsSectionObj.autoAssignmentSections['traveler'+traveler.count] = autoAssignmentSectionsClone;
                }
            });
        }
    }
}

/*
 * Get number of discount cards in shopping cart
 */
function countDiscountCardsInCart(){
    var discountCardsCounter = {};
    var discountCardInfoBox = $('#pageSidebar').find('.infoBox.discountCardInfoBox').not('.tmpl');
    discountCardInfoBox.each(function(){
        var qtyElement = $(this).find('.cardQty').find('.qty');
        var cardCode = qtyElement.data('card-code');
        discountCardsCounter[cardCode] = parseInt(qtyElement.html());
    });
    return discountCardsCounter;
}

