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
			.select("concat", ["id", "name"], "alias")
			.from("user")
			.get()
			.replace("\n", " ");
		wru.assert(sql, sql == "select concat(id, name) as alias from user");
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}