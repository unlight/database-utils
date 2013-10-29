var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.between("id", 3, 6)
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.between("id", "3..6")
	.get();


console.log(sql);