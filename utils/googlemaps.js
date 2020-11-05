const rp = require('request-promise');
const API_KEY = 'AIzaSyBzjlPX8avexDZ9PDDSXyH9fTbXhB5Szrc';

// Get details of accident location
async function getAccidentPlaceId(latitude, longitude) {
    let geoCodeResponse;
    try {
        geoCodeResponse = await rp(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`);
    } catch (error) {
        console.log('Error in getting Geocoding cordinates', error);
    }
    let placeDetails = JSON.parse(geoCodeResponse);
    return placeDetails.status === 'OK' ? placeDetails.results[0].place_id : 'Invalid request'
}

// consider using place details API
async function getAccidentPlaceName(accidentPlaceID) {
    let placeDetailsResponse;
    try {
        placeDetailsResponse = await rp(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${accidentPlaceID}&fields=name&key=${API_KEY}`);
    } catch (error) {
        console.log('Error in getting place details', error);
    }
    let placeDetails = JSON.parse(placeDetailsResponse);
    return placeDetails.result.name;
}

// Get hospitals and health centers within 500 metre radius
// async function getNearestEmergencyPlaces(latitude, longitude) {
//     let nearByPlaceResponse;
//     try {
//         nearByPlaceResponse = await rp(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=hospital&keyword=hospital&key=${API_KEY}`);
//     } catch (error) {
//         console.log('Error in getting nearby hospitals...', error);
//     }
//     let nearByEmergencyPlaces = JSON.parse(nearByPlaceResponse);
//     return nearByEmergencyPlaces.results;
// }

// consider using place details API
async function getNearByEmergencyPlaceDetails(nearByEmergencyPlaces) {
    let nearestEmergencyPlaceDetails = [];
    try {
        for (EmergencyPlace in nearByEmergencyPlaces) {
            const {name, place_id} = EmergencyPlace;
            nearestEmergencyPlaceDetails.push({name, place_id});
        }
    } catch (error) {
        console.log('Error in getting place details', error);
    }
    return nearestEmergencyPlaceDetails;
}

// consider using DistanceMatrix API
async function getNearestEmergencyPlaceDistances(accidentLocationPlaceID, nearByEmergencyPlaceDetails) {
    let placeDistanceResponse,
        placeDistanceDetails;
    try {
        for (EmergencyPlace in nearByEmergencyPlaceDetails) {
            placeDistanceResponse = await rp(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${
                EmergencyPlace.place_id
            }&destinations=place_id:${accidentLocationPlaceID}&key=${API_KEY}`);
            placeDistanceDetails = JSON.parse(placeDistanceResponse);
            EmergencyPlace.distance = placeDistanceDetails.rows[0].elements[0].distance.text;
            EmergencyPlace.duration = placeDistanceDetails.rows[0].elements[0].duration.text;
        }
    } catch (error) {
        console.log('Error in getting place distance and duration', error);
    }
    return nearByEmergencyPlaceDetails;
}

// consider using place details API
async function determineIfNearbyCrash(EmergencyPlacePlaceID, crashes, tag) {
    let placeDistanceResponse,
        placeDistanceDetails,
        distanceToEmergencyPlace,
        distanceToEmergencyPlaceWords,
        durationToEmergencyPlaceWords;
    closeCrashes = [];
    for (const crash of crashes) {
        placeDistanceResponse = await rp(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${EmergencyPlacePlaceID}&destinations=place_id:${
            crash.crashPlaceID
        }&key=${API_KEY}`);
        placeDistanceDetails = JSON.parse(placeDistanceResponse);
        distanceToEmergencyPlace = placeDistanceDetails.rows[0].elements[0].distance.value;
        distanceToEmergencyPlaceWords = placeDistanceDetails.rows[0].elements[0].distance.text;
        durationToEmergencyPlaceWords = placeDistanceDetails.rows[0].elements[0].duration.text;
        if (distanceToEmergencyPlace < 2500) {
            let joinTable;
            joinTable = tag === 'police' ? PoliceCrash : HospitalCrash;
            crash.joinTable = {
                distance: distanceToEmergencyPlaceWords,
                duration: durationToEmergencyPlaceWords
            };
            closeCrashes.push(crash);
        }
    }
    return closeCrashes;
}

module.exports = {
    getAccidentPlaceId,
    getAccidentPlaceName,
    // getNearestEmergencyPlaces,
    getNearByEmergencyPlaceDetails,
    getNearestEmergencyPlaceDistances,
    determineIfNearbyCrash
};
