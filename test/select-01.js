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
			.get();
		sql = sql.replace("\n", " ");
		wru.assert(sql, sql == "select * from user");
		
		sql = sqldriver
			.select("id, name")
			.from("user")
			.get();
		sql = sql.replace("\n", " ");
		wru.assert(sql, sql == "select id, name from user");
		
		
		sql = sqldriver
			.select("id as user_id")
			.select("name as user_name")
			.from("user")
			.get()
			.replace("\n", " ");
		wru.assert(sql, sql == "select id as user_id, name as user_name from user");

		sql = sqldriver
			.select(["u.id", "u.name"])
			.from("user u")
			.get()
			.replace("\n", " ");
		wru.assert(sql, sql == "select u.id, u.name from user u");

		sql = sqldriver
			.select("u.id, u.name")
			.from("user u")
			.get()
			.replace("\n", " ");
		
		wru.assert(sql, sql == "select u.id, u.name from user u");

		sql = sqldriver
			.select("id")
			.select("name", "length", "size")
			.from("user")
			.get()
			.replace("\n", " ");
		wru.assert(sql, sql == "select id, name(length) as size from user");

		sql = sqldriver
			.select("1 + 1", "sum")
			.get()
			.replace("\n", " ");
		wru.assert(sql, sql == "select 1 + 1 as sum");

		sql = sqldriver
			.select("concat", "a, b, c", "alias")
			.get()
			.replace("\n", " ");

		wru.assert(sql, sql == "select concat(a, b, c) as alias");
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

