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
    if (placeDetails.status === 'OK') 
        return placeDetails.results[0].place_id;
     else 
        return 'Invalid request';
    


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
async function getNearestHospitals(latitude, longitude) {
    let nearByPlaceResponse;
    try {
        nearByPlaceResponse = await rp(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=hospital&keyword=hospital&key=${API_KEY}`);
    } catch (error) {
        console.log('Error in getting nearby hospitals...', error);
    }
    let nearByHospitals = JSON.parse(nearByPlaceResponse);
    return nearByHospitals.results;
}

// consider using place details API
async function getNearByHospitalDetails(nearByHospitals) {
    let nearestHospitalDetails = [];
    try {
        for (Hospital in nearByHospitals) {
            const {name, place_id} = Hospital;
            nearestHospitalDetails.push({name, place_id});
        }
    } catch (error) {
        console.log('Error in getting place details', error);
    }
    return nearestHospitalDetails;
}

// consider using DistanceMatrix API
async function getNearestHospitalDistances(accidentLocationPlaceID, nearByHospitalDetails) {
    let placeDistanceResponse,
        placeDistanceDetails;
    try {
        for (Hospital in nearByHospitalDetails) {
            placeDistanceResponse = await rp(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${
                Hospital.place_id
            }&destinations=place_id:${accidentLocationPlaceID}&key=${API_KEY}`);
            placeDistanceDetails = JSON.parse(placeDistanceResponse);
            Hospital.distance = placeDistanceDetails.rows[0].elements[0].distance.text;
            Hospital.duration = placeDistanceDetails.rows[0].elements[0].duration.text;
        }
    } catch (error) {
        console.log('Error in getting place distance and duration', error);
    }
    return nearByHospitalDetails;
}

// consider using place details API
async function getNearestHospitalName(nearestHospital) {}
async function determineIfNearbyCrash(hospitalPlaceID, crashes) {
    let placeDistanceResponse,
        placeDistanceDetails,
        durationToHospital,
        distanceToHospital;
    closeCrashes = [];
    for (const crash of crashes) {
        placeDistanceResponse = await rp(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${hospitalPlaceID}&destinations=place_id:${
            crash.crashPlaceID
        }&key=${API_KEY}`);
        placeDistanceDetails = JSON.parse(placeDistanceResponse);
        distanceToHospital = placeDistanceDetails.rows[0].elements[0].distance.value;
        distanceToHospitalWords = placeDistanceDetails.rows[0].elements[0].distance.text;
        durationToHospital = placeDistanceDetails.rows[0].elements[0].duration.text;
        if (distanceToHospital < 1000) {
            // crash.HospitalCrash.distance = distanceToHospitalWords
            // crash.HospitalCrash.duration = durationToHospital
            closeCrashes.push(crash);
        }

    }
    // console.log(closeCrashes);
    return closeCrashes;
}

module.exports = {
    getAccidentPlaceId,
    getAccidentPlaceName,
    getNearestHospitals,
    getNearByHospitalDetails,
    getNearestHospitalDistances,
    getNearestHospitalName,
    determineIfNearbyCrash
};
