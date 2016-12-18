/*eslint-env node */
//Request Module
var httpRequest = require('request');


//queries SVP for Event
exports.queryEvent = function(objectId, svpQueryEventEndpoint, clientId, callback) {
	var options = {
		url: svpQueryEventEndpoint + '?objectId=' + objectId,
		headers: {
			'x-ibm-client-id': clientId
		}
	};
	httpRequest(
		options,
		function(error, response, body) {
			try {
				var json = JSON.parse(body);
				var events = json.Envelope.Body.queryResponse.events.event;
				if (events.length === null || events.length > 0) {
					events = events[events.length - 1];
				}
				callback(null, events);
			} catch (e) {
				callback(e, null);
			}
		}
	);
};