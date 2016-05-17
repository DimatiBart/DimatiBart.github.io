/**
 * Confirmation.js
 **********************************
 */


$(document).ready(function() {
    /*
     * Fare Term&Condition response variable
     ****************************************
     */
    var fareTermsHTML;

    /*
     * fareConditionLink
     ****************************************
     */
    $(document).on('click.fareConditionLink', '.fareTermsLink', function (event) {
        event.preventDefault();
        var fareTermsLink = $(this);
        if (fareTermsHTML) {
            showFareTermsPopup(fareTermsHTML);
        } else {
            var fareTermsRequest = $.ajax({
                type: "POST",
                url: "/staglobe/getFareRulesInformation.do",
                data: "requestSource=OnePageCheckout&selectedItinId=0",
                statusCode: {
                    200: function (response) {
                        fareTermsHTML = response;
                        showFareTermsPopup(response,fareTermsLink);
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

    function showFareTermsPopup(response,fareTermsLink) {
        var lightboxName = fareTermsLink.data('lightbox-name');
        var lightbox = $('.lightbox[data-lightbox-name="'+ lightboxName +'"]');
        lightbox.find('.lightboxContent').html(response);
        showLightbox(lightbox);
    }
});

