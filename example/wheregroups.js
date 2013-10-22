var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.where("id", 3)
	.orop()
	.where("id", 5)
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.where("name", "Joe")
	.andop()
	.where("job_id", 5)
	.orop()
	.where("job_id", 2)
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.beginwheregroup()
	.where("id <", 12)
	.orop()
	.where("id >", 19)
	.endwheregroup()
	.andop()
	.where("job_id", 5)
	.get();

console.log(sql);