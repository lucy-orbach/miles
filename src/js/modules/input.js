import { displayError } from './library.js';
import { airports, apTitles } from './airports.js';
import { resetCalc } from './submitButton.js';
import { params, setParams, resetParam } from './parameters.js';
import autoComplete from '../plugins/auto-complete.js';

export function setUpInput(input, airports) {
	setAutoComplete(input);
	input.addEventListener('blur', (event) => {
		enterInput(event, airports);
	});
	input.addEventListener('keyup', (event) => {
		if (!event.target.value) { resetParam(event.target.name); }
	});
}

// PRIVATE FUNCTIONS...
// Adds Input value after validation.
function enterInput(event) {
	resetCalc();
	let { name, value } = event.target;
	// Substracts 3 character code...
	value = value.substring(0, 3).toUpperCase();
	// If value has content ...
	if (value.length > 0) { 
		let targetedParam = params[name];
		// Finds value in airports or returns -1 
		let i = getAirportIndex(value, airports);
		// If value is in airports...
		if ( airportIsValid(i)) { 
			let airport = airports[i];
			// Checks opposite value is not the same...
			if ( isDifferentFromOpposite(name, value) ) {
				// Checks is there is a value to replace and prevents reseting from autocomplete...
				if ( !paramIsEmpty(targetedParam) && isDifferentFromCurrentParam(targetedParam.code, value) ) {
					resetParam(name);
				}
	 			setParams(event.target, airport);
			} else {
		 		displayError(event.target, 'Origin and Destination can\'t be the same' );
			} 

		} else {
			displayError(event.target, 'Airport is not valid' );
		}
	} else {
		resetParam(name);
	}
}
	
// Initializes autocomplete
function setAutoComplete(input) {
	new autoComplete({
    selector: `input[name=${input.name}]`,
    minChars: 2,
    parent: `${input.name}List`,
    menuClass: 'drop-down drop-down-active',
    source: (term, suggest) => {
        term = term.toUpperCase();
        let choices = apTitles;
        let matches = [];
        for (let i = 0; i < choices.length; i++) 
          if (~choices[i].indexOf(term)) matches.push(choices[i]);
        suggest(matches);
    }
	});
}

// Gets value's index in airports...
function getAirportIndex(value, airports) {
	return airports.findIndex(airport => airport.code === value);
}

// Checks that value enter is inside airports...
function airportIsValid(index) {
	return index !== -1;
}

// Checks if params already has value
function paramIsEmpty(paramObj) {
	return Object.keys(paramObj).length === 0;
}

// Verifies input is not included in params already
function isDifferentFromCurrentParam(paramCode, value) {
	return paramCode !== value;
}

// Verifies input is not included in opposite param...
function isDifferentFromOpposite(name, value) {
	let oppositeParamName = name === 'origin' ? 'destination'
		: 'origin';
	return params[oppositeParamName].code !== value;
}

