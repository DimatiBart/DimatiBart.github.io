var emailPattern = /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z\.]{2,4})$/;
var textPattern = /[^\sa-zA-Z]/;
var alphanumericPattern = /[^a-zA-Z0-9]/;
var alphanumericSpacePattern = /[^\sa-zA-Z0-9]/;
//var alphanumericspecialWithDiacritic = /[^@%+\/\\'!#$^?:\+*%\;.,_`"\)\(\]\[\~'\-\sa-zA-Z0-9Á-Źá-źÀ-Ùà-ùÂ-Ŷâ-ŷÄ-Ÿä-ÿÇ-Ţç-ţģǖǘǚǜÃãẼẽĨĩÑñÕõŨũỸỹẞßÅåŮů€¥£ƒ₤Ұ]/;
var alphanumericspecialWithDiacritic = /[^@%&=+\/\\'!#$^?:\+*%\;.,_`"\)\(\]\[\~'\-\}\{\>\<\|\sa-zA-Z0-9Á-Źá-źÀ-Ùà-ùÂ-Ŷâ-ŷÄ-Ÿä-ÿÇ-Ţç-ţģǖǘǚǜÃãẼẽĨĩÑñÕõŨũỸỹẞßÅåŮů€¥£ƒ₤Ұ]/;
var phoneNumberPattern = /[^\sa-zA-Z0-9\(\)\-]/;

var numericPattern = /[^\d]/;
var postcodePattern = /[^A-Za-z0-9 \-]/;
var isicNumberPattern = /(^[SsTtYy][\d]{12}$)|(^[\d]{18}$)/;
var statePattern = /^[A-Z]*$/;

var checkout_validation_settings = {
    fieldsValidation: {
        firstNameInput: {
            field: "firstNameInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "First name is required.",
            maxLength: "30",
            lengthErrorMsg: "First name can not be greater than 30 characters.",
            pattern: textPattern,
            patternErrorMsg: "Only letters and spaces are allowed."
        },

        middleNameInput: {
            field: "middleNameInput",
            isAllowedEmpty: true,
            emptyErrorMsg: "Middle name is required.",
            maxLength: "30",
            lengthErrorMsg: "Middle name can not be greater than 30 characters.",
            pattern: textPattern,
            patternErrorMsg: "Only letters and spaces are allowed."
        },

        lastNameInput: {
            field: "lastNameInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Last name is required.",
            maxLength: "30",
            lengthErrorMsg: "Last name can not be greater than 30 characters.",
            pattern: textPattern,
            patternErrorMsg: "Only letters and spaces are allowed."
        },

        phoneNumberInput: {
            field: "phoneNumberInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Phone is required.",
            maxLength: "20",
            lengthErrorMsg: "Phone can not be greater than 20 characters.",
            pattern: phoneNumberPattern,
            patternErrorMsg: "Phone is invalid."
        },

        passportNumberInput: {
            field: "passportNumberInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Passport Number is required.",
            maxLength: "30",
            lengthErrorMsg: "Passport Number can not be greater than 30 characters.",
            pattern: alphanumericPattern,
            patternErrorMsg: "Passport Number is invalid."
        },

        passportIssuePlaceInput: {
            field: "passportIssuePlaceInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Passport Number is required.",
            maxLength: "30",
            lengthErrorMsg: "Passport Place of Issue can not be greater than 30 characters.",
            pattern: alphanumericSpacePattern,
            patternErrorMsg: "Passport Place of Issue is invalid."
        },

        passportBirthPlaceInput: {
            field: "passportBirthPlaceInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Place of Birth is required.",
            maxLength: "30",
            lengthErrorMsg: "Place of Birth can not be greater than 30 characters.",
            pattern: alphanumericSpacePattern,
            patternErrorMsg: "Place of Birth is invalid."
        },

        redressNumberInput: {
            field: "redressNumberInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Redress Number is required.",
            maxLength: "13",
            lengthErrorMsg: "Redress Number can not be greater than 13 characters.",
            pattern: alphanumericPattern,
            patternErrorMsg: "Redress Number is invalid"
        },

        schoolNameInput : {
            field: "schoolNameInput ",
            isAllowedEmpty: false,
            emptyErrorMsg: "School name is required.",
            maxLength: "13",
            lengthErrorMsg: "School name should consist of the first letter followed by 12 digits.",
            pattern: alphanumericspecialWithDiacritic,
            patternErrorMsg: "School name should consist of the first letter followed by 12 digits."
        },

        cardNumberInput: {
            field: 'cardNumberInput',
            isAllowedEmpty: false,
            emptyErrorMsg: "Card number is required.",
            pattern: numericPattern,
            patternErrorMsg: "Card number is invalid."
        },

        cardHolderNameInput: {
            field: 'cardHolderNameInput',
            isAllowedEmpty: false,
            emptyErrorMsg: "Name is required.",
            maxLength: '50',
            lengthErrorMsg: "Name can not be greater than 50 characters.",
            pattern: alphanumericspecialWithDiacritic,
            patternErrorMsg: "Name is invalid."
        },



        firstAddressInput: {
            field: 'firstAddressInput',
            isAllowedEmpty: false,
            emptyErrorMsg: "House number or name is required.",
            maxLength: '40',
            lengthErrorMsg: "House number or name can not be greater than 40 characters.",
            pattern: alphanumericspecialWithDiacritic,
            patternErrorMsg: "House number or name is invalid."
        },

        secondAddressInput: {
            field: 'secondAddressInput',
            isAllowedEmpty: true,
            emptyErrorMsg: "Street is required.",
            maxLength: '40',
            lengthErrorMsg: "Street can not be greater than 40 characters.",
            pattern: alphanumericspecialWithDiacritic,
            patternErrorMsg: "Street is invalid."
        },

        cityAddressInput: {
            field: 'cityAddressInput',
            isAllowedEmpty: false,
            emptyErrorMsg: "City is required.",
            maxLength: '500',
            lengthErrorMsg: "City can not be greater than 40 characters.",
            pattern: alphanumericspecialWithDiacritic,
            patternErrorMsg: "City is invalid."
        }
    },

    selectValidation: {
        titleSelect: {
            field: "titleSelect",
            isAllowedEmpty: false,
            errorMsg: "Title is required.",
            defValue: ''
        },

        birthDateSelect: {
            field: "birthDateSelect",
            isAllowedEmpty: false,
            errorMsg: "Day of birth is required.",
            defValue: ''
        },

        birthMonthSelect: {
            field: "birthMonthSelect",
            isAllowedEmpty: false,
            errorMsg: "Month of birth is required.",
            defValue: ''
        },

        birthYearSelect: {
            field: "birthYearSelect",
            isAllowedEmpty: false,
            errorMsg: "Year of birth is required.",
            defValue: ''
        },

        nationalitySelect : {
            field: "nationalitySelect ",
            isAllowedEmpty: false,
            errorMsg: "Nationality is required.",
            defValue: ''
        },

        issueDateSelect : {
            field: "issueDateSelect ",
            isAllowedEmpty: false,
            errorMsg: "Day of issue date is required.",
            defValue: ''
        },

        issueMonthSelect : {
            field: "issueMonthSelect ",
            isAllowedEmpty: false,
            errorMsg: "Month of issue date is required.",
            defValue: ''
        },

        issueYearSelect : {
            field: "issueYearSelect ",
            isAllowedEmpty: false,
            errorMsg: "Year of issue date is required.",
            defValue: ''
        },

        expireDateSelect : {
            field: "issueYearSelect ",
            isAllowedEmpty: false,
            errorMsg: "Day of expiration date is required.",
            defValue: '',
            pastDateAllowed: true,
            pastDateMsg: 'The expiration date is invalid'
        },

        expireMonthSelect : {
            field: "expireMonthSelect ",
            isAllowedEmpty: false,
            errorMsg: "Month of expiration date is required.",
            defValue: '',
            pastDateAllowed: true,
            pastDateMsg: 'The expiration date is invalid'
        },

        expireYearSelect : {
            field: "expireYearSelect ",
            isAllowedEmpty: false,
            errorMsg: "Year of expiration date is required.",
            defValue: '',
            pastDateAllowed: true,
            pastDateMsg: 'The expiration date is invalid'
        },

        genderSelect: {
            field: "genderSelect",
            isAllowedEmpty: false,
            errorMsg: "Year of birth is required.",
            defValue: ''
        }
    },

    emailValidation: {
        emailInput: {
            field: "emailInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Email is required.",
            maxLength: "30",
            minLength: "5",
            lengthErrorMsg: "Email can not be greater than 50 characters.",
            minLengthErrorMsg: "Email can not be less than 5 characters.",
            pattern: emailPattern,
            patternErrorMsg: "Email is invalid.",
            compareErrorMsg: "Email must match"
        },
        confirmEmailInput: {
            field: "confirmEmailInput",
            isAllowedEmpty: false,
            emptyErrorMsg: "Email is required.",
            maxLength: "30",
            minLength: "5",
            lengthErrorMsg: "Email can not be greater than 50 characters.",
            minLengthErrorMsg: "Email can not be less than 5 characters.",
            pattern: emailPattern,
            patternErrorMsg: "Email is invalid.",
            compareErrorMsg: "Email must match"
        }
    },

    checkboxValidation: {
        schoolNameCheckbox: {
            field: "schoolNameCheckbox",
            errorMsg: "Some Textxttxtx"
        },
        termsConditionsCheckbox: {
            field: "termsConditionsCheckbox",
            errorMsg: ""
        },
        hazardousMaterialsCheckbox: {
            field: "hazardousMaterialsCheckbox",
            errorMsg: ""
        },
        insuranceTermsConditionsCheckbox: {
            field: "insuranceTermsConditionsCheckbox",
            errorMsg: ""
        },
        visaTermsConditionsCheckbox: {
            field: "visaTermsConditionsCheckbox",
            errorMsg: ""
        },
        haveInsuranceCheckbox: {
            field: "haveInsuranceCheckbox",
            errorMsg: "Box needs to be ticked"
        }
    },

    radioBtnValidation: {
        cardCodeInput: {
            field: "paymentMethodRadioBtn",
            errorMsg: "Please choose a payment method to purchase your booking",
            errorDestination: "panelFooter"
        }
    },

    productAssignmentValidation: {
        cartItemCheckbox: {
            field: "cartItemCheckbox",
            errorMsg: "You steel have <b>{1}</b> unassigned items in your cart. Make sure you've marked it as belong to the right traveller before continuing.",
            errorMsg2: "You steel have <b>unassigned items</b> in your cart. Make sure you've marked it as belong to the right traveller before continuing.",
            errorDestination: "panelFooter"
        }
    },

    insuranceValidation: {
        maxAgeValidation: {
            errorMsg: "Unfortunately one of your travellers is ineligible for this travel insurance, please click here to buy your policy"
        }
    }
};