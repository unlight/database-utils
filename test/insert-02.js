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
			.set({name: "Mary", "job_id": 3})
			.from("user")
			.insert()
			.get();

		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "insert into user(name, job_id) values('Mary', 3)");
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}