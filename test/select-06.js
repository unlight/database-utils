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
			.select("count", "*", "")
			.from("user")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select count(*) from user');
		
		sql = sqldriver
			.select("count", "*", "row_count")
			.from("user")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select count(*) as row_count from user');
		
		sql = sqldriver
			.select("concat", "id, name", "concat_alias")
			.from("user")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select concat(id, name) as concat_alias from user');
		
		sql = sqldriver
			.select("max", "id", "")
			.from("user")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == 'select max(id) from user');
		
	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}

