
const axios = require('axios');

let target = 'kyev';

const adderss = encodeURIComponent(target);
const geoURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${adderss}`;


axios.get(geoURL)
	.then((response) => {
		if(response.data.status === 'ZERO_RESULTS'){
			throw new Error('the adders is not found')
		}
		const location = {
			key : '84caa1599b48843b77ae6703606d40a7',
			lat: response.data.results[0].geometry.location.lat,
			lng: response.data.results[0].geometry.location.lng,
			url: 'https://api.darksky.net/forecast/',
		}
		const req = `${location.url}${location.key}/${location.lat},${location.lng}`;
		console.log(response.data.results[0].formatted_address);
		return axios.get(req);
	})
	.then( (response) => {
		const temperature = response.data.currently.temperature;
		const summary = response.data.currently.summary;
		console.log(`summary: ${summary}`);
		console.log(`temperature: ${Math.round((temperature-32)*5/9)}`);
	})
	.catch((error) => {
		if(error.code === 'ENOTFOUND'){
			console.log('error conecting with the server');
		}
		else{
			console.log(error);
		}
	})