var wru = require("wru");
var package = require("..");
var SqlDriver = package.SqlDriver;
var sqldriver = new SqlDriver();
var basename = require("path").basename;

var tests = [];
tests[tests.length] = {
	name: basename(__filename),
	test: function() {
		var sql;
		var params;
	
		sql = sqldriver
			.parameters()
			.select("*")
			.from("user")
			.where("id", 5)
			.get();

		sql = sql.replace(/\s+/g, " ");


		params = sqldriver.parameters();

		wru.assert(params, params == "5");

		sql = sqldriver
			.parameters()
			.select("*")
			.from("user")
			.where("id", 12)
			.like("name", "Joe")
			.get();
		sql = sql.replace(/\s+/g, " ");

		params = sqldriver.parameters();

		wru.assert(params, params == "12,%Joe%");




	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}