"use strict";

module.exports = SqlParameters;

function SqlParameters() {
	this.reset();
}

SqlParameters.prototype.add = function(name, value) {
	if (arguments.length == 0) {
		throw new TypeError("Add() expecting at least 1 parameter.");
	} else if (arguments.length == 1) {
		value = arguments[0];
		if (typeof value == "object" && value.constructor === Object) {
			this._parameters.push(value);
		} else {
			this._parameters.push({value: value});
		}
	} else {
		this._parameters.push({
			name: name,
			value: value
		});
	}
}

SqlParameters.prototype.push = SqlParameters.prototype.add;

SqlParameters.prototype.values = function() {
	var result = [];
	for (var count = this._parameters.length, i = 0; i < count; i++) {
		var parameter = this._parameters[i];
		result[result.length] = parameter.value;
	}
	return result;
}

SqlParameters.prototype.reset() {
	this._parameters = [];
}