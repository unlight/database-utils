"use strict";

module.exports = SqlDriver;

var isArray = require("util").isArray;
var isNumeric = require("useful-functions").isNumeric;
var inArray = require("useful-functions").inArray;
var isString = require("useful-functions").isString;
var isIterable = require("useful-functions").isIterable;
var varType = require("useful-functions").varType;

function SqlDriver() {
	
	var _selects = [];
	var _froms = [];
    var _distinct = false;
	
	SqlDriver.prototype.reset = function() {
		_selects = [];
		_froms = [];
        _distinct = false;
		return this;
	}
	
	SqlDriver.prototype.select = function(select, alias, func) {
		if (arguments.length == 0) {
			_selects.push({
				"field": "*"
			});
		} else if (arguments.length == 1) {
			if (isString(select)) {
				select = select.split(/\s*,\s*/);
			}
			for (var i = 0, count = select.length; i < count; ++i) {
				var field = select[i].toString().trim();
				if (field === "") continue;
				var split = field.split(/\s*as\s*/i);
				if (split.length > 1) {
					field = split[0];
					alias = split[1];
				}
				_selects.push({
					"field": field,
					"alias": alias
				});
			}
		} else if (arguments.length == 2) {
			_selects.push({
				"field": select,
				"alias": alias
			});
		} else {
			var args = Array.prototype.slice.call(arguments);
			func = args.shift();
			alias = args.pop();
			_selects.push({
				"func": func,
				"field": args,
				"alias": alias
			});
		}
		return this;
	}
	
	SqlDriver.prototype.from = function(from) {
		parse: {
			if (isArray(from)) break parse;
			if (isString(from)) {
				from = from.split(",");
			}
		}
		for (var i = 0, count = from.length; i < count; ++i) {
			var table = from[i].toString().trim();
			if (table === "") continue;
			_froms.push(table);
		}
		return this;
	}
	
	SqlDriver.prototype.getSelect = function() {
		this.endQuery();
		var result = "select ";
        if (_distinct) {
            result += "distinct ";
        }
		var selects = "";
		for (var i = 0, count = _selects.length; i < count; ++i) {
			var item = _selects[i];
			var select = item.field;
			if (item.func) {
				select = item.func + "(" + select + ")";
			}
			if (item.alias) {
				select = select + " as " + item.alias;
			}
			if (i > 0) select = ", " + select;
			selects += select;
		}
		if (selects == "") {
			selects = "*";
		}
		result += selects;
		if (_froms.length > 0) {
			result += "\n" + "from " + _froms.join(", ");
		}
		this.reset();
		return result;
	}
	
	SqlDriver.prototype.endQuery = function() {
		// TODO: endQuery function.
	}
	
	SqlDriver.prototype.query = function() {
		throw "Database engine is not defined.";
	}
	
	SqlDriver.prototype.get = function() {
		var query = this.getSelect();
		//throw "The selected database engine does not perform the requested task.";
		return query;
	}

	SqlDriver.quote = function (value, wrapInQuotes) {
		if (isNumeric(value)) {
			return value;
		}
		value = value
			.replace("\\", "\\\\")
			.replace("\0", "\\0")
			.replace("\n", "\\n")
			.replace("\r", "\\r")
			.replace("'", "\\'")
			.replace("\"", "\\\"")
			.replace("\x1a", "\\Z");
		if (wrapInQuotes === true) {
			value = "'" + value + "'";
		}
		return value;
	}	
	
}