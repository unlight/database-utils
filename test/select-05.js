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
			.selectcase("visible", {"1": "Yes"})
			.from("user")
			.get();
		sql = sql.replace(/\s+/g, " ");
		
		wru.assert(sql, sql == "select case visible when 1 then 'Yes' end from user");
		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

