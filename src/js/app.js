import { airports, apTitles, loadAirports } from './modules/airports.js';
import { setUpInput, enterInput } from './modules/input.js';
import { getData, removeElement } from './modules/library.js';
import { initMap } from './modules/trackMap.js';
import {getDistance} from './modules/submitButton.js';
import autoComplete from './plugins/auto-complete.js';

(function() {
	// Loads map...
		window.setTimeout(function(){
			initMap();
		}, 100);
	// Loads airports data...
	loadAirports();

	// Setup autocomplete and eventlistener on input texts...
	let inputs = document.querySelectorAll('.input-text');
	for (let value of inputs) {
  	setUpInput(value);
	}

	// Adds click handler to the start button...
	document.getElementById('startBtn').addEventListener('click', () => {
		//removes banner
		removeElement(document.getElementById('banner'));
		// adds class to slide in dashboard
		document.getElementById('dashboard').className += " show-dash";
	});

	// Adds click handler to submit button ...
	document.getElementById('submitBtn').addEventListener('click', (event) => {
		getDistance(event);
	});
	
//END OF APP IIFE
})();


