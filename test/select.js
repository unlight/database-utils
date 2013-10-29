var wru = require("wru");
var package = require("..");
var SqlDriver = package.SqlDriver;
var sqldriver = new SqlDriver();

var tests = [];
tests[tests.length] = {
	name: "Select",
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
			.get();
		sql = sql.replace("\n", " ");
		wru.assert(sql, sql == "select id as user_id, name as user_name from user");
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}


//sql[sql.length] = sqldriver
//	.select("id as user_id")
//	.select("name as user_name")
//	.from("user")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select(["u.id", "u.name"])
//	.from("user u")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select("u.id, u.name")
//	.from("user u")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select("id")
//	.select("name", "length", "size")
//	.from("user")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select(["id", "name"],  "concat", "concatenatedA")
//	.from("user")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select("1 + 1", "sum")
//	.get();
//
//sql[sql.length] = sqldriver
//	.select("concat", "a, b, c", "concatenatedB")
//	.get();
//
//
//console.log(sql);