var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.orderby("id")
	.get();

sql[sql.length] = sqldriver
	.select("id, name")
	.from("user")
	.orderby("id", "desc")
	.get();

sql[sql.length] = sqldriver
	.select("id as user_id")
	.select("name as user_name")
	.from("user")
	.orderby("id", "asc")
	.get();

sql[sql.length] = sqldriver
	.select()
	.from("user")
	.orderby("name", "asc")
	.orderby("id", "desc")
	.get();

console.log(sql);