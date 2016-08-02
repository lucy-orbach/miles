import { params } from './parameters.js';
import { addPolyline } from './trackMap.js';

const button = document.getElementById('submitBtn');
const container = document.getElementById('milesContainer');
const qtyLabel = document.getElementById('qty');


// Calculates distance...
export function getDistance(event) {
	event.preventDefault();
	//calculate...
	let radlat1 = Math.PI * (params.origin.lat / 180);
	let radlat2 = Math.PI * (params.destination.lat / 180);
	let theta = params.origin.lng - params.destination.lng;
	let radtheta = Math.PI * (theta / 180);
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * (180 / Math.PI);
	let miles = dist * 60 * 1.1515; 
	let nMiles = miles * 0.8684
	nMiles = Math.round(nMiles * 1000) / 1000; //displays 3 decimals only
	setDistance( nMiles );  
}

// Enables submit button when both inputs are set...
export function validateButton() {
	button.disabled =
		!(!params.origin.code === false && !params.destination.code === false);
}

// Displays result
export function setDistance(distance) {
	addPolyline(params);
	if (distance !== 0) {
		container.className += ' show-miles';
	} else {
		container.className = 'miles-container';
	}
	qtyLabel.innerHTML = distance;
}

// Resets Calculation
export function resetCalc() {
	container.className = 'miles-container';
	qtyLabel.innerHTML = '';
	button.disabled = true;;
}


