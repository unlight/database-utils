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
			.where("id", 3)
			.orop()
			.where("id", 5)
			.get();
		
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select * from user where id = 3 or id = 5');


		sql = sqldriver
			.select("*")
			.from("user")
			.where("name", "Joe")
			.andop()
			.where("job_id", 5)
			.orop()
			.where("job_id", 2)
			.get();

		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select * from user where name = \'Joe\' and job_id = 5 or job_id = 2');


		sql = sqldriver
			.select("*")
			.from("user")
			.beginwheregroup()
			.where("id <", 12)
			.orop()
			.where("id >", 19)
			.endwheregroup()
			.andop()
			.where("job_id", 5)
			.get();	

		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select * from user where (id < 12 or id > 19) and job_id = 5');


		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}