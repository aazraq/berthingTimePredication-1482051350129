/*eslint-env node */
//Add Subtract Date Third Party Module
var addSubtractDate = require("add-subtract-date");


//Calculate Estimated Time of Berthing
exports.calculateETB = function(event, averageBerthingTime) {
	var eta = new Date(event.additionalInfo.$);
	var etb = addSubtractDate.add(eta, averageBerthingTime, "hours");
	return etb;
};
