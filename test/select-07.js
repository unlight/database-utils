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
			.select("job, salary")
			.from("user")
			.where("salary is null")
			.get();
			
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select job, salary from user where salary is null');
		
		
		
		sql = sqldriver
			.select("job, salary")
			.from("user")
			.where("salary", "@null")
			.get();
		
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select job, salary from user where salary = null');
		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}