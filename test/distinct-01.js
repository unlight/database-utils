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
			.select("name")
			.distinct()
			.from("user")
			.orderby("id")
			.get();

		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select distinct name from user order by id desc');
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}