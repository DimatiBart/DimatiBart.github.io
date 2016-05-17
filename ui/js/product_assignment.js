var focusedElementId;
var clickedButtonIds = '';

var personalDetails = {

	__submit: function(alwaysFalse) {
		var doSubmit = true;

		// cards
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var elementId = 'cartItem_' + 'card' + '_' + itemCounter + '_' + travelerCounter;
					var element = getElementById(elementId);
					if (element != null) {
						if (!element.disabled && !element.checked) {							
							doSubmit = false;
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}
			
		// bundles
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var elementId = 'cartItem_' + 'bundle' + '_' + itemCounter + '_' + travelerCounter;
					var element = getElementById(elementId);
					if (element != null) {
						if (!element.disabled && !element.checked) {							
							doSubmit = false;
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}
			
		// visas
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var elementId = 'cartItem_' + 'visa' + '_' + itemCounter + '_' + travelerCounter;
					var element = getElementById(elementId);
					if (element != null) {
						if (!element.disabled && !element.checked) {							
							doSubmit = false;
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}

		// insurance
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var elementId = 'cartItem_' + 'insurance' + '_' + itemCounter + '_' + travelerCounter;
					var element = getElementById(elementId);
					if (element != null) {
						if (!element.disabled && !element.checked) {							
							doSubmit = false;
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}

		// flight
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var elementId = 'cartItem_' + 'flight' + '_' + itemCounter + '_' + travelerCounter;
					var element = getElementById(elementId);
					if (element != null) {
						if (!element.disabled && !element.checked) {							
							doSubmit = false;
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}

		// hotel
		var itemCounter = 1;
		var subItemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				inside:
					while (true) {
						while (true) {
							var elementId = 'cartItem_' + 'hotel' + '_' + itemCounter + '_' + subItemCounter + '_' + travelerCounter;
							var element = getElementById(elementId);
							if (element != null) {
								if (!element.disabled && !element.checked) {									
									doSubmit = false;
								}
								subItemCounter++;
							} else if (itemCounter == 1 && subItemCounter == 1) {
								break outside;
							} else if (subItemCounter == 1) {
								break inside;
							} else {
								break;
							}
						}
						itemCounter++;
						subItemCounter = 1;
					}
					itemCounter = 1;
					subItemCounter = 1;
					travelerCounter++;
			}

		if (alwaysFalse) {
			return false;
		}

		if (doSubmit) {
			//wtBirthYearTitle();
			//document.forms['ReservationCheckoutProcessForm'].submit();
		}

		if (!doSubmit) controls.unlock();

		return doSubmit;
	},

	initCartItemsSupplementaryMap: function() {
		// cards
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var element = getElementById('cartItem_' + 'card' + '_' + itemCounter + '_' + travelerCounter);
					if (element != null) {
						if (element.checked) {
							element.onclick();
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}
			
		//bundles
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var element = getElementById('cartItem_' + 'bundle' + '_' + itemCounter + '_' + travelerCounter);
					if (element != null) {
						if (element.checked) {
							element.onclick();
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}
			
		// visas
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var element = getElementById('cartItem_' + 'visa' + '_' + itemCounter + '_' + travelerCounter);
					if (element != null) {
						if (element.checked) {
							element.onclick();
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}
			
		// insurance
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var element = getElementById('cartItem_' + 'insurance' + '_' + itemCounter + '_' + travelerCounter);
					if (element != null) {
						if (element.checked) {
							element.onclick();
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}

		// flight
		var itemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				while (true) {
					var element = getElementById('cartItem_' + 'flight' + '_' + itemCounter + '_' + travelerCounter);
					if (element != null) {
						if (element.checked) {
							element.onclick();
						}
						itemCounter++;
					} else if (itemCounter == 1) {
						break outside;
					} else {
						break;
					}
				}
				itemCounter = 1;
				travelerCounter++;
			}

		// hotel
		var itemCounter = 1;
		var subItemCounter = 1;
		var travelerCounter = 1;

		outside:
			while (true) {
				inside:
					while (true) {
						while (true) {
							var element = getElementById('cartItem_' + 'hotel' + '_' + itemCounter + '_' + subItemCounter + '_' + travelerCounter);
							if (element != null) {
								if (element.checked) {
									element.onclick();
								}
								subItemCounter++;
							} else if (itemCounter == 1 && subItemCounter == 1) {
								break outside;
							} else if (subItemCounter == 1) {
								break inside;
							} else {
								break;
							}
						}
						itemCounter++;
						subItemCounter = 1;
					}
					itemCounter = 1;
					subItemCounter = 1;
					travelerCounter++;
			}
	},

	/*
	 * 
	 * 
	 * @t      traveler index
	 * @which  
	 * @b      true - assign; false - unassign
	 */
	assignCartItemTo: function(t, which, b) {
		if (b) {
			if (which.name == 'card' || which.name == 'insurance' || which.name == 'visa' || which.name == 'bundle') {
				var elementId = 'cartItem_' + which.name + '_' + which.sequence + '_' + t;
				
				CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty += 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty;
				CartItemsSupplementaryMap[which.name][which.sequence-1].free = false;
				if (selectedQty == maxQty) {
					this.disableCartItemsFor(which);
				}
			} else if (which.name == 'flight') {
				var elementId = 'cartItem_' + which.name + '_' + which.sequence + '_' + t;				

				if (secureFlightEnabled) {					
					var index = getUnchckedItemIndex('flight');
					assignItems('flight', index);
				}
				
								
				CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty += 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty;
				if (selectedQty == maxQty) {
					this.disableCartItemsFor(which);
				}
			} else if (which.name == 'hotel') {
				var elementId = 'cartItem_' + which.name + '_' + which.sequence + '_' + which.sequenceRoom + '_' + t;				

				CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].selectedQty += 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].selectedQty;
				CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].free = false;
				if (selectedQty == maxQty) {
					this.disableCartItemsFor(which);
				}
			}
		} else {
			if (which.name == 'card' || which.name == 'insurance' || which.name == 'visa' || which.name == 'bundle') {
				CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty -= 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty;
				CartItemsSupplementaryMap[which.name][which.sequence-1].free = true;
				if (selectedQty != maxQty) {
					this.enableCartItemsFor(which);
				}
			} else if (which.name == 'flight') {
				
				CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty -= 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1].selectedQty;
				if (selectedQty != maxQty) {
					this.enableCartItemsFor(which);
				}
			} else if (which.name == 'hotel') {
				CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].selectedQty -= 1;
				var maxQty = CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].maxQty;
				var selectedQty = CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].selectedQty;
				CartItemsSupplementaryMap[which.name][which.sequence-1][which.sequenceRoom-1].free = true;
				if (selectedQty != maxQty) {
					this.enableCartItemsFor(which);
				}
			}
		}
		$('.checkoutAssignCol').hide().show();
		return false;
	},		
	
	
	__iterateByCartElemets: function(which, f) {
		if (which.name != 'hotel') {
			var travelersCounter = 1;
			do {
				var isContinue = false;
				var elementId = 'cartItem_' + which.name + '_' + which.sequence + '_' + travelersCounter;
				var element = getElementById(elementId);
				if (element != null) {
					f(element, travelersCounter, which.name, elementId, which.sequence);
					isContinue = true;
				}
				travelersCounter += 1;
			} while (isContinue)
		} else {
			var travelersCounter = 1;
			do {
				var isContinue = false;
				var elementId = 'cartItem_' + which.name + '_' + which.sequence + '_' + which.sequenceRoom + '_' + travelersCounter;
				var element = getElementById(elementId);
				if (element != null) {
					f(element, travelersCounter, which.name, elementId, which.sequence, which.sequenceRoom);
					isContinue = true;
				}
				travelersCounter += 1;
			} while (isContinue)
		}
		
	},

	enableCartItemsFor: function(which) {
		var f = function(element, t, n, elementId, hotelSequence) {
				if (n == 'card') {
					if (!personalDetails.isCardSelectedFor(t)) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				} else  if (n == 'visa') {
					if (!personalDetails.isVisaSelectedFor(t)) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				} else  if (n == 'bundle') {
					if (!personalDetails.isDateBundleSelectedFor(t)) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				} else if (n == 'insurance') {
					if (!personalDetails.isInsuranceSelectedFor(t)) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				} else if (n == 'hotel') {
					if (!personalDetails.isRoomSelectedFor(t, hotelSequence)) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				} else {
					element.disabled = false;
					personalDetails.enableClass(elementId);
				}
			}
		this.__iterateByCartElemets(which, f);
	},

	disableCartItemsFor: function(which) {
		var f = function(element, t, n, elementId) {
				if (n == 'card') {
					if (!personalDetails.isCardSelectedFor(t)) {
						element.disabled = true;
						personalDetails.disableClass(elementId);
						
					}
				} else if (n == 'visa') {
					if (!personalDetails.isVisaSelectedFor(t)) {
						element.disabled = true;
						personalDetails.disableClass(elementId);
						
					}
				} else if (n == 'bundle') {
					if (!personalDetails.isDateBundleSelectedFor(t)) {
						element.disabled = true;
						personalDetails.disableClass(elementId);
						
					}
				} else if (n == 'insurance') {
					if (!personalDetails.isInsuranceSelectedFor(t)) {
						element.disabled = true;
						personalDetails.disableClass(elementId);
						
					}
				} else if (!element.checked) {
					element.disabled = true;
					personalDetails.disableClass(elementId);
					
				}
			}
		this.__iterateByCartElemets(which, f);
	},

	disableClass: function(elementId) {
		var checkbox = $('#'+elementId)	
		checkbox.closest('.customCheckbox').addClass('disabled');
		checkbox.closest('li').addClass('disabled withHelpText');

		var cartItemName = checkbox.data('item-name');		
		var helpTextElement = checkbox.closest('li').find('.helpTextTooltip .lightboxContent p');
		var helpText = helpTextElement.html();
		helpText = helpText.replace(/\{0\}/g, '<span class="assignedToTravellers"></span>');	
		helpText = helpText.replace(/\{1\}/g, '<span class="currentTraveller"></span>');		
		helpTextElement.html(helpText);
		var assignedCheckbox = $('.cartItemCheckbox[data-item-name="'+ cartItemName +'"]:checked');
		var assignedToArr = [];
		assignedCheckbox.each(function(){
			var travellerName = $(this).closest('.travellerSection').data('traveller-name');
			assignedToArr.push(travellerName);
		});
		var assignedToText = assignedToArr.join(', ');		
		var currentTraveller = checkbox.closest('.travellerSection').data('traveller-name');
		helpTextElement.find('.assignedToTravellers').html(assignedToText);
		helpTextElement.find('.currentTraveller').html(currentTraveller);
		checkbox.closest('li').removeClass('errorItem');
	},

	enableClass: function(elementId) {	
		var checkbox = $('#'+elementId)		
		checkbox.closest('.customCheckbox').removeClass('disabled');
		checkbox.closest('li').removeClass('disabled withHelpText');
	},	

	checkCardBounds: function(checked, t, s) {
		if (checked) {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'card' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					if (counter != s) {
						element.disabled = true;
						personalDetails.disableClass(elementId);						
					}
				}
				counter += 1;
			} while (element != null)
		} else {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'card' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					var maxQty = CartItemsSupplementaryMap['card'][counter -1].maxQty;
					var selectedQty = CartItemsSupplementaryMap['card'][counter -1].selectedQty;
					if (maxQty != selectedQty) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				}
				counter += 1;
			} while (element != null)
		}

		if(checked){
			var indexItem = getUnchckedItemIndex('card');
			assignItems('card', indexItem);
		}		
	},
	
	checkDateBundleBounds: function(checked, t, s) {
		if (checked) {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'bundle' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					if (counter != s) {
						element.disabled = true;
						personalDetails.disableClass(elementId);						
					}
				}
				counter += 1;
			} while (element != null)
		} else {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'bundle' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					var maxQty = CartItemsSupplementaryMap['bundle'][counter -1].maxQty;
					var selectedQty = CartItemsSupplementaryMap['bundle'][counter -1].selectedQty;
					if (maxQty != selectedQty) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				}
				counter += 1;
			} while (element != null)

		}
		if(checked){
			var indexItem = getUnchckedItemIndex('bundle');
			assignItems('bundle', indexItem);
		}		
	},
	
	checkVisaBounds: function(checked, t, s) {
		if (checked) {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'visa' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					if (counter != s) {
						element.disabled = true;
						personalDetails.disableClass(elementId);						
					}
				}
				counter += 1;
			} while (element != null)
			
		} else {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'visa' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					var maxQty = CartItemsSupplementaryMap['visa'][counter -1].maxQty;
					var selectedQty = CartItemsSupplementaryMap['visa'][counter -1].selectedQty;
					if (maxQty != selectedQty) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				}
				counter += 1;
			} while (element != null)			
		}
		if(checked){
			var indexItem = getUnchckedItemIndex('visa');
			assignItems('visa', indexItem);
		}		
	},
			
	
	checkInsuranceBounds: function(checked, t, s) {
		if (checked) {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'insurance' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					if (counter != s) {
						element.disabled = true;
						personalDetails.disableClass(elementId);						
					}
				}
				counter += 1;
			} while (element != null)
		} else {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'insurance' + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					var maxQty = CartItemsSupplementaryMap['insurance'][counter -1].maxQty;
					var selectedQty = CartItemsSupplementaryMap['insurance'][counter -1].selectedQty;
					if (maxQty != selectedQty) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				}
				counter += 1;
			} while (element != null)
		}
		
		if(checked){
			var indexItem = getUnchckedItemIndex('insurance');
			assignItems('insurance', indexItem);
		}	
		
	},

	isCardSelectedFor: function(t) {
		var counter = 1;
		do {
			var element = getElementById('cartItem_' + 'card' + '_' + counter + '_' + t);
			if (element != null && element.checked) {
				return true;
			}
			counter += 1;
		} while (element != null)
		return false;
	},
	
	isDateBundleSelectedFor: function(t) {
		var counter = 1;
		do {
			var element = getElementById('cartItem_' + 'bundle' + '_' + counter + '_' + t);
			if (element != null && element.checked) {
				return true;
			}
			counter += 1;
		} while (element != null)
		return false;
	},
	
	isVisaSelectedFor: function(t) {
		var counter = 1;
		do {
			var element = getElementById('cartItem_' + 'visa' + '_' + counter + '_' + t);
			if (element != null && element.checked) {
				return true;
			}
			counter += 1;
		} while (element != null)
		return false;
	},
	
	isInsuranceSelectedFor: function(t) {
		var counter = 1;
		do {
			var element = getElementById('cartItem_' + 'insurance' + '_' + counter + '_' + t);
			if (element != null && element.checked) {
				return true;
			}
			counter += 1;
		} while (element != null)
		return false;
	},

	isRoomSelectedFor: function(t, h) {
		var counter = 1;
		do {
			var element = getElementById('cartItem_' + 'hotel' + '_' + h + '_' + counter + '_' + t);
			if (element != null && element.checked) {
				return true;
			}
			counter += 1;
		} while (element != null)
		return false;
	},

	checkHotelRoomsBounds: function(checked, t, h, r) {

		if (checked) {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'hotel' + '_' + h + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					if (counter != r) {
						element.disabled = true;
						personalDetails.disableClass(elementId);						
					}
				}
				counter += 1;
			} while (element != null)
		} else {
			var counter = 1;
			do {
				var elementId = 'cartItem_' + 'hotel' + '_' + h + '_' + counter + '_' + t;
				var element = getElementById(elementId);
				if (element != null) {
					var maxQty = CartItemsSupplementaryMap['hotel'][h - 1][counter -1].maxQty;
					var selectedQty = CartItemsSupplementaryMap['hotel'][h - 1][counter -1].selectedQty;
					if (maxQty != selectedQty) {
						element.disabled = false;
						personalDetails.enableClass(elementId);
					}
				}
				counter += 1;
			} while (element != null)
		}

		if(checked){
			var cartItems = CartItemsSupplementaryMap['hotel'];
			var travelerCount = CartItemsSupplementaryMap.travelerCount;

			for(var i=0;i < cartItems.length; i++){
				var cartItemCounter = 0;
				var cartItemIndex = 0;
				var cartItemTotal = 0;
				for(var j=0;j < cartItems[i].length; j++){
					var cartItem = cartItems[i][j];
					cartItemTotal += cartItem.maxQty;
					if(cartItem.selectedQty != cartItem.maxQty){
						cartItemCounter++;
						cartItemIndex = i;
						hotelIndex = j;
					}
				}
				if(cartItemCounter == 1 && cartItemTotal == travelerCount){
					assignItems('hotel', cartItemIndex, hotelIndex);
				}
			}
		}
		
	}
}


/*
 *	Auto assignment for discound cards, flights, hotels and insurance.
 */
function autoAssignment()
{
	var travelerCount = CartItemsSupplementaryMap.travelerCount;
	//insurances
	var insurances = CartItemsSupplementaryMap['insurance'];
	if(insurances && insurances.length == 1)
	{
		var insurance = insurances[0];
		if(travelerCount == insurance.maxQty)
		{
			assignItems('insurance', 0, 0);
		}
	}

	/*if (loadTravelerParamsFromCookies()){
		cleanTravelerParamsFromCookies();
		return;
	}*/

	//discount cards
	var cards = CartItemsSupplementaryMap['card'];
	if(cards && cards.length == 1)
	{
		var card = cards[0];
		if(travelerCount == card.maxQty)
		{
			assignItems('card', 0, 0);
		}
	}

	//visas
	var visas = CartItemsSupplementaryMap['visa'];
	if(visas && visas.length == 1)
	{
		var visa = visas[0];
		if(travelerCount == visa.maxQty)
		{
			assignItems('visa', 0, 0);
		}
	}
	
	//bundles
	var bundles = CartItemsSupplementaryMap['bundle'];
	if(bundles && bundles.length == 1)
	{
		var bundle = bundles[0];
		if(travelerCount == bundle.maxQty)
		{
			assignItems('bundle', 0, 0);
		}
	}
	
	//flights
	var flights = CartItemsSupplementaryMap['flight'];
	if(flights && flights.length == 1)
	{
		var flight = flights[0];
		if(travelerCount == flight.maxQty)
		{
			assignItems('flight', 0, 0);
		}
	}
	
	//hotels
	var hotels = CartItemsSupplementaryMap['hotel'];
	if(hotels)
	{
		for(var i = 0; i < hotels.length; i++)
		{
			var hotel = hotels[i][0];
			if(hotel && travelerCount == hotel.maxQty && hotels[i].length == 1)
			{
				assignItems('hotel', 0, i);
			}
		}
	}

	$('.checkoutAssignCol').hide().show();
}

/*
 *	Return how many items are unchecked.
 * 
 * @cartItemName  cart item name
 */
function getUnchckedItemIndex(cartItemName){

	var cartItemCounter = 0;
	var cartItemIndex = 0;
	var cartItemTotal = 0;
	var cartItems = CartItemsSupplementaryMap[cartItemName];
	var travelerCount = CartItemsSupplementaryMap.travelerCount;
	
	for(var i=0;i < cartItems.length; i++){
		var cartItem = cartItems[i];
		cartItemTotal += cartItem.maxQty;
		if(cartItem.selectedQty != cartItem.maxQty){
			cartItemCounter++;
			cartItemIndex = i;
		}
	}
	if(cartItemCounter == 1 && cartItemTotal == travelerCount){
		return cartItemIndex;
	}else{
		return -1;
	}
}

/*
 * According to cartItemName items will be assigned start from cartItemIndex.
 * cartItemIndex should be more zero.
 * 
 * @cartItemName  cart item name
 * @cartItemIndex  cart item index
 * @hotelIndex  hotel index(just for hotel)
 */
function assignItems(cartItemName, cartItemIndex, hotelIndex){
	if(cartItemIndex >= 0)
	{
		var travelerCount = CartItemsSupplementaryMap.travelerCount;
		for(var i=1;i <= travelerCount; i++)
		{
			if(cartItemName == 'hotel'){
				var cartItem = CartItemsSupplementaryMap[cartItemName][cartItemIndex][hotelIndex];
				var cartItemElement = document.getElementById('cartItem_'+ cartItemName + '_' + (cartItemIndex + 1) + '_' + (hotelIndex  + 1) +  '_' + i);
				var id = 'cartItem_'+ cartItemName + '_' + (cartItemIndex + 1) + '_' + (hotelIndex  + 1) +  '_' + i;

			}else{
				var cartItem = CartItemsSupplementaryMap[cartItemName][cartItemIndex];
				var cartItemElement = document.getElementById('cartItem_'+ cartItemName +'_' + (cartItemIndex + 1) + '_' + i);
				var id = 'cartItem_'+ cartItemName +'_' + (cartItemIndex + 1) + '_' + i;
			}
			var checkbox = $('#'+id);				
			if(cartItemElement && cartItemElement.checked == false && cartItemElement.disabled == false){
				cartItemElement.checked=true;
				checkbox.trigger('change.checkboxChange').trigger('change.isicCheckboxChange').trigger('change.australiaVisaCheckboxChange').trigger('change.flightCheckboxChange');
				cartItem.selectedQty++;				
			}
		}
	}
}



