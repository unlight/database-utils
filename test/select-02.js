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
			.select("*")
			.from("user")
			.wherein("id", [2, '3'])
			.get();
		
		sql = sql.replace(/\s+/g, " ");
		
		wru.assert(sql, sql == "select * from user where id in (2,3)");

	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

