/*
 * M A I N
 * ================================
 */

$(document).ready(function(){

    $(document).on('click.submitPromoCode','.submitPromoCodeBtn',function(event){
        event.preventDefault();
        var promoCodeInput = $(this).closest('.promoCodeBox').find('.promoCodeInput');
        var validationCheck = promoCodeValidation(promoCodeInput);
        var promoCodeForm = $('form[name="PromoCodeShoppingCartForm"]');
        if( validationCheck == true ){
            promoCodeForm.find('input[name="promoCode"]').val(promoCodeInput.val());
            promoCodeForm.submit();
        }
    });

    $(document).on('focusin','.promoCodeInput',function(event){
        $(this).closest('.promoCodeRow').removeClass('errorRow');
    });

    $(document).on('click.hideErrorMsg','.promoCodeToggleBtn',function(event){
        $(this).closest('.promoCodeBox').find('.promoCodeRow').removeClass('errorRow');
    });

    function promoCodeValidation(promoCodeInput){
        var validationCheck = true;
        var promoCodePattern = new RegExp("^[A-Za-z0-9_]{1,25}$");
        var promoCodeValue = promoCodeInput.val();
        var errorMsg = promoCodeInput.closest('.promoCodeBox').find('.errorMsg.clientSideError');
        if( promoCodePattern.test(promoCodeValue) == false ){
            promoCodeInput.closest('.promoCodeRow').addClass('errorRow');
            validationCheck = false;
        }
        else {
            promoCodeInput.closest('.promoCodeRow').removeClass('errorRow');
        }
        return validationCheck;
    }

});

/*
 * donations validation
 */
function donationsValidation(){
    var donationSection = $('.donationSection');
    var donationRadioBtn = donationSection.find('.donationRadioBtn');
    if( donationRadioBtn.filter(':checked').length == 0 ){
        donationSection.addClass('errorSection');
        return false;
    }
    else {
        donationSection.removeClass('errorSection');
        return true;
    }
}

















 
