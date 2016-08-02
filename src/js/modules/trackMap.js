const DESK = {
  coords: { lat: 40.0902, lng: -110.7129 }, 
  zoom: 4
};
const MOBILE = {
  coords: {lat: 5.0902, lng: -95.7129},
  zoom: 3
};

let map;
let markers = [];
let myPath;

export function initMap() {
	let mobileMedia = isMobile();
  let zoomValue = mobileMedia ? MOBILE.zoom : DESK.zoom;
  let coords = mobileMedia ? MOBILE.coords : DESK.coords;
  //creates map
  map = new google.maps.Map(document.getElementById('mapCanvas'), {
    center: coords, 
    zoom: zoomValue,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  });
  //styles map
  map.set('styles', [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]);
}

// adds new marker
export function addMarker(param) {
  let icon = './src/img/aMarker.png';
  if (findMarkerIndex(param.name) === -1) { //if marker is new
  	let latLng = new google.maps.LatLng(param.lat, param.lng);
  	// Creates marker...
    let marker = new google.maps.Marker({
        position: latLng,
        title: param.name,
        draggable: false,
        animation: google.maps.Animation.DROP,
        icon: icon,
        map: map
    });
    // Register marker...
    markers.push(marker);
  }
}

//deletes marker
export function deleteMarker(paramName) {
	if (paramName) {
		let markerIndex = findMarkerIndex(paramName);
		// Removes it from map...
		markers[markerIndex].setMap(null);
		// Removes it from our register...
		markers.splice(markerIndex, 1);
		// Deletes Polyline
		if (myPath !== undefined) {
		 		deletePolyline();
		 	}
	}
}

// traces path between airports
export function addPolyline(params) {
	let pathCoords = [
		{lat: params.origin.lat, lng: params.origin.lng},
    {lat: params.destination.lat, lng: params.destination.lng}
	];
	myPath = new google.maps.Polyline({
    path: pathCoords,
    geodesic: true,
    strokeColor: '#f4733d',
    strokeOpacity: 1.0,
    strokeWeight: 4
  });
	myPath.setMap(map);	
}

// detects if marker exist and gets its index
function findMarkerIndex(name) { //name 'SFO - San Fr...'
  return markers.findIndex(m => m.title === name);
}

// removes path between airports
function deletePolyline() {
  myPath.setMap(null);
}

// Detects if screen is mobile
function isMobile() {
  return ( window.matchMedia(`(max-width: 767px)`).matches );
}

// Resets coords and zoom on resize
// window.onresize = function() {
//   let newMobile = isMobile();
//   let zoomValue = newMobile ? MOBILE.zoom : DESK.zoom;
//   let coords = newMobile ? MOBILE.coords : DESK.coords;
//     map.setCenter(coords);
//     map.setZoom(zoomValue);
// };
	