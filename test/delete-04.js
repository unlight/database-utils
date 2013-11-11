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
			.delete("user")
			.where("name", "Joe")
			.get();

		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'delete user where name = \'Joe\'');
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}