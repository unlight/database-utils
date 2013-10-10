var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("id, name")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("id as user_id")
	.select("name as user_name")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select(["u.id", "u.name"])
	.from("user u")
	.get();

sql[sql.length] = sqldriver
	.select("u.id, u.name")
	.from("user u")
	.get();

sql[sql.length] = sqldriver
	.select("id")
	.select("name", "length", "size")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select(["id", "name"],  "concat", "concatenatedA")
	.from("user")
	.get();

sql[sql.length] = sqldriver
	.select("1 + 1", "sum")
	.get();

sql[sql.length] = sqldriver
	.select("concat", "a, b, c", "concatenatedB")
	.get();


console.log(sql);
//for (var i in sql) {
//	console.log(i + ". " + sql[i]);
//}
