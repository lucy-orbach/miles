import { validateButton, setDistance, resetCalc } from './submitButton.js';
import { addMarker, deleteMarker } from './trackMap.js';

// Adds Input value after validation...
export let params = {
	origin: {},
	destination: {}
};

// Sets Input value in params...
export function setParams(element, airport) {
	// Adds param...
	params[element.name] = {
		code: airport.code,
		name: airport.code + ' - ' + airport.name, 
		lat: airport.lat,
		lng: airport.lng,
	};
	// Sets value in parameter
	setInput(element, params[element.name]);
	// Add marker to map...
	addMarker(params[element.name]);
	// Checks if form is valid
 	validateButton();
}

// Clears data on Params...
export function resetParam(name) {
	deleteMarker(params[name].name);
 	params[name] = {};
 	resetCalc();
}

//PRIVATE...
// Sets accurate input value...
function setInput(element, data) {
	return element.value = data.name;
}
