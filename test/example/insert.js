var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];


sql[sql.length] = sqldriver
	.set("name", "Mary")
	.from("user")
	.insert()
	.get();


sql[sql.length] = sqldriver
	.set({name: "Mary", "job_id": 3})
	.from("user")
	.insert()
	.get();


console.log(sql);