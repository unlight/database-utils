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
			.select("count", "name", "count_name")
			.from("user")
			.having("count_name >", 1)
			.get();
		sql = sql.replace(/\s+/g, " ");
		
		wru.assert(sql, sql == "select count(name) as count_name from user having count_name > 1");
		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

