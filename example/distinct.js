var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("name")
	.distinct()
	.from("user")
	.orderby("id")
	.get();



console.log(sql);