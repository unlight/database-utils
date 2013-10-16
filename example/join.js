var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select("*")
	.from("user")
	.join("role", "role.id = user.role_id")
	.get();

sql[sql.length] = sqldriver
	.select("*")
	.from("user u")
	.leftjoin("role r", "r.id = u.role_id")
	.get();

console.log(sql);