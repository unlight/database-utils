var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.selectcase("visible", {"1": "Yes"})
	.from("user")
	.get();

console.log(sql);