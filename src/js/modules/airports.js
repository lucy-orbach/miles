import { getData } from './library.js';

export let airports = [];
export let apTitles = [];


export function loadAirports() {
		let myURL = "http://cors.io/?u=https://airport.api.aero/airport?user_key=9568a415ae0ff16eddd37c8ed4c801f3";
		//creates XMLHttpRequest w Promise...
		getData(myURL).then(response => {
			airports = filterAirports(response);
		}).then(() => {
			setTitles(airports)
		});
	};

// Filters US airports...
function filterAirports(response) {
	let data = parseData(response);
	let airports = data.airports;
	return (
		airports.filter(airport => airport.country === 'United States')
	);
}
// Clears out response...
function parseData(response) {
	return JSON.parse(
		response.replace('callback(','').slice(0, -1)
	);
}

// Set AirportList for autocomplete...
function setTitles(airports) {
	apTitles = airports.map(a => `${a.code} - ${a.name}`);
}



