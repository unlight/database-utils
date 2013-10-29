var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("count", "name", "count_name")
	.from("user")
	.having("count_name >", 1)
	.get();


console.log(sql);