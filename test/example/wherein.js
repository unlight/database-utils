var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.wherein("id", [2, '3'])
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.wherein("name", ["Joe", 'Mary'])
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.wherenotin("name", ["Joe", 'Mary'])
	.get();

console.log(sql);