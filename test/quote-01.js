var wru = require("wru");
var package = require("..");
var SqlDriver = package.SqlDriver;
var sqldriver = new SqlDriver();
var basename = require("path").basename;

var _isParametrized = false;
function isNumeric() {
	return false;
}

	var _wrap = function(value) {
		if (_isParametrized) {
			_sqlParameters.push({value: value});
			return "?";
		}
		if (!isNumeric(value)) {
			value = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
				.replace(/'/g, "\\'")
				.replace(/\\"/g, '"') + '\'';
		}
		return value;
	}


var tests = [];
tests[tests.length] = {
	name: basename(__filename),
	test: function() {
		var qs = "Vestibulum 'consectetur' laoreet";
		var expect = "'Vestibulum \\'consectetur\\' laoreet'";
		var quoted = _wrap(qs);
		console.log(quoted);
		console.log(expect);
		wru.assert("quote", quoted == expect);
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}