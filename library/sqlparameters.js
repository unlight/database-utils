"use strict";

module.exports = SqlParameters;

function SqlParameters() {

	this._parameters = [];
}

SqlParameters.prototype.add = function(name, value) {
	if (arguments.length == 0) {
		throw new TypeError("Add() expecting at least 1 parameter.");
	} else if (arguments.length == 1) {
		value = arguments[0];
		this._parameters.push({value: value});
	} else {
		this._parameters.push({
			name: name,
			value: value
		});
	}
}

SqlParameters.prototype.arrayValues = function() {
	var result = [];
	for (var count = this._parameters.length, i = 0; i < count; i++) {
		var parameter = this._parameters[i];
		result[result.length] = parameter.value;
	}
	return result;
}