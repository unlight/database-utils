var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];


sql[sql.length] = sqldriver
	.set("name", "Mary")
	.from("user")
	.update()
	.get();


sql[sql.length] = sqldriver
	.set({name: "Mary", "job_id": 3})
	.from("user")
	.update()
	.get();


sql[sql.length] = sqldriver
	.set("name", "Joe")
	.from("user")
	.where("id", 12)
	.update()
	.get();

sql[sql.length] = sqldriver
	.update("user")
	.set("name", "Joseph")
	.where("name", "Joe")
	.get();

console.log(sql);