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
	
		sql = sqldriver
			.parameters()
			.select("*")
			.from("user")
			.where("id", 5)
			.getQuery();

		var query = sql[0].replace(/\s+/g, " ");
		var params = sql[1];

		wru.assert(params[0] == 5);
		wru.assert(query == "select * from user where id = ?");
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}