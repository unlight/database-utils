var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];


sql[sql.length] = sqldriver
	.from("user")
	.delete()
	.get();


sql[sql.length] = sqldriver
	.from("user")
	.delete()
	.get();


sql[sql.length] = sqldriver
	.from("user")
	.where("id", 12)
	.delete()
	.get();

sql[sql.length] = sqldriver
	.delete("user")
	.where("name", "Joe")
	.get();

console.log(sql);