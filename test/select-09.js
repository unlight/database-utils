var wru = require("wru");
var package = require("..");
var SqlDriver = package.SqlDriver;
var MySqlDriver = package.MySqlDriver;
var sqldriver = new MySqlDriver();
var basename = require("path").basename;

var tests = [];
tests[tests.length] = {
	name: basename(__filename),
	test: function() {
		var sql;

		sql = sqldriver
			.select()
			.from("user")
			.where("id", 5)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select * from user where id = 5");

		sql = sqldriver
			.select()
			.from("user")
			.where("id >", 5)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select * from user where id > 5");

		sql = sqldriver
			.select()
			.from("user")
			.where("id !=", 5)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select * from user where id != 5");

		sql = sqldriver
			.select()
			.from("user")
			.where("name", "Jane")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select * from user where name = 'Jane'");
		
		sql = sqldriver
			.select("user.*")
			.from("user")
			.where("name is null")
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select user.* from user where name is null");
		
		sql = sqldriver
			.select("user.*")
			.from("user")
			.where({name: "Jane", "id >": 2})
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select user.* from user where name = 'Jane' and id > 2");

		sql = sqldriver
			.select("user.*")
			.from("user")
			.where({name: "Ivan", "id <": 8})
			.where("position_id", 3)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select user.* from user where name = 'Ivan' and id < 8 and position_id = 3");

		sql = sqldriver
			.select("user.*")
			.from("user")
			.limit(5)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select user.* from user limit 5");

		sql = sqldriver
			.select("user.*")
			.from("user")
			.limit(5, 2)
			.get();
		sql = sql.replace(/\s+/g, " ");
		wru.assert(sql, sql == "select user.* from user limit 5 offset 2");

	}
};

if (module.parent) {
	module.exports = tests;
} else {
	wru.test(tests);
}