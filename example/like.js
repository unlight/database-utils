var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.like("name", "joe")
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.like("name", "joe", "right")
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.like("name", "joe", "left")
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.where("name %", "joe")
	.get();

sql[sql.length] = "";

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.where("name ^%", "joe")
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.where("name %$", "joe")
	.get();

console.log(sql);