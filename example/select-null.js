var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("job, salary")
	.from("user")
	.where("salary is null")
	.get();

sql[sql.length] = sqldriver
	.select("job, salary")
	.from("user")
	.where("salary", "@null")
	.get();

console.log(sql);