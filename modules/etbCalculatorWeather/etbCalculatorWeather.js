/*eslint-env node */
//Request Module
var httpRequest = require('request');

//Add Subtract Date Third Party Module
var addSubtractDate = require("add-subtract-date");








//Calculate Estimated Time of Berthing Taking into consideration the current weather at the destination
exports.calculateETBWithWeather = function(event,averageBerthingTime, weatherCompanyEndpoint, callback) {
	//Get the ETA from the queried event in SVP
	var eta = new Date(event.additionalInfo.$);
	
	//Get the latitude and longitute of the location
	var location = getLocation(event);
	
	//Get the WindSpeed forecast for the specific location through calling Weather Company
	getWindSpeedForecast(location, weatherCompanyEndpoint, function(e, windSpeed) {
		var etbWithWeather = {};
		etbWithWeather.windSpeed = windSpeed;
		var beaufortSpeed = convertMphToBeaufort(windSpeed);
		//ETB = ETA + Average Bething Time
		var etb = addSubtractDate.add(eta, averageBerthingTime * 60, "minutes");
		//Add the weather delay because of the wind (Time will increase by 5% for each Beaufort wind speed)
		etb = addSubtractDate.add(etb, averageBerthingTime * beaufortSpeed * 0.05 * 60, "minutes");
		etbWithWeather.etb=etb;
		callback(etbWithWeather);

	});
};

//Get the latitude and longitute of the location
function getLocation(event) {
	var bizLocation = event.bizLocation.$;
	var location = {};
	if (bizLocation === "Antwerp pilot station") {
		location.latidude = 4.214625;
		location.longitude = 51.434853;
	} //Add more else
	return location;
};


//Queries Weather Company for the forecast of the weather speed at the specified location
function getWindSpeedForecast(location,weatherCompanyEndpoint,  callback) {
	var options = {
		url: weatherCompanyEndpoint + '/api/weather/v1/geocode/' + location.latidude + '/' + location.longitude + '/forecast/hourly/48hour.json'
	};
	httpRequest(
		options,
		function(error, response, body) {
			try {
				var json = JSON.parse(body);
				var weatherSpeed = json.forecasts[0].wspd;
				convertMphToBeaufort(weatherSpeed);
				callback(null, weatherSpeed);
			} catch (e) {
				callback(e, null);
			}
		}
	);
};

//Convert miles per hour to Beaufort scale https://en.wikipedia.org/wiki/Beaufort_scale
function convertMphToBeaufort(windSpeed) {
	if (windSpeed < 1) {
		return 0;
	} else if (windSpeed <= 3) {
		return 1;
	} else if (windSpeed <= 7) {
		return 2;
	} else if (windSpeed <= 12) {
		return 3;
	} else if (windSpeed <= 18) {
		return 4;
	} else if (windSpeed <= 24) {
		return 5;
	} else if (windSpeed <= 31) {
		return 6;
	} else if (windSpeed <= 38) {
		return 7;
	} else if (windSpeed <= 46) {
		return 8;
	} else if (windSpeed <= 54) {
		return 9;
	} else if (windSpeed <= 63) {
		return 10;
	} else if (windSpeed <= 72) {
		return 11;
	} else {
		return 12;
	}
};