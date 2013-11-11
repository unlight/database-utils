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
			.set("name", "Mary")
			.from("user")
			.update()
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "update user set name = 'Mary'");


		sql = sqldriver
			.set({name: "Mary", "job_id": 3})
			.from("user")
			.update()
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "update user set name = 'Mary', job_id = 3");


		sql = sqldriver
			.set("name", "Joe")
			.from("user")
			.where("id", 12)
			.update()
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "update user set name = 'Joe' where id = 12");

		sql = sqldriver
			.update("user")
			.set("name", "Joseph")
			.where("name", "Joe")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "update user set name = 'Joseph' where name = 'Joe'");
	
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

