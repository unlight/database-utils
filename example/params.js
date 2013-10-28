var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.parameters()
	.select("*")
	.from("user")
	.where("id", 5)
	.get();

console.log(sql[sql.length-1]);
console.log(sqldriver.parameters());
console.log("");

sql[sql.length] = sqldriver
	.parameters()
	.select("*")
	.from("user")
	.where("id", 12)
	.like("name", "Joe")
	.get();

console.log(sql[sql.length-1]);
console.log(sqldriver.parameters());
console.log("");