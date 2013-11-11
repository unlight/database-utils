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
			.join("role", "role.id = user.role_id")
			.get();
		sql = sql.replace(/\s+/g, " ");
		
		
		wru.assert(sql, sql == "select * from user join role on role.id = user.role_id");
		
		
		sql = sqldriver
		.select("*")
		.from("user u")
		.leftjoin("role r", "r.id = u.role_id")
		.get();
		
		sql = sql.replace(/\s+/g, " ");
		
		
		wru.assert(sql, sql == "select * from user u left join role r on r.id = u.role_id");

	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}