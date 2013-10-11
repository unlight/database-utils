var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("count", "*", "")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("count", "*", "row_count")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("concat", "id, name", "concat_alias")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("max", "id", "")
	.from("user")
	.get();

console.log(sql);