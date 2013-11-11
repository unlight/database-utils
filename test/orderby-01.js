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
			.orderby("id")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select * from user order by id desc');

		sql = sqldriver
			.select("id, name")
			.from("user")
			.orderby("id", "desc")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select id, name from user order by id desc');		
		
		
		sql = sqldriver
			.select("id as user_id")
			.select("name as user_name")
			.from("user")
			.orderby("id", "asc")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select id as user_id, name as user_name from user order by id asc');
		
		
		sql = sqldriver
			.select()
			.from("user")
			.orderby("name", "asc")
			.orderby("id", "desc")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select * from user order by name asc, id desc');
		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}