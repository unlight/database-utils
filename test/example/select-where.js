var SqlDriver = require("./../library/sqldriver.js");
var MySqlDriver = require("./../library/mysqldriver.js");

sqldriver = new MySqlDriver();

sql = [];

sql[sql.length] = sqldriver
	.select()
	.from("user")
	.where("id", 5)
	.get();

sql[sql.length] = sqldriver
	.select()
	.from("user")
	.where("id >", 5)
	.get();

sql[sql.length] = sqldriver
	.select()
	.from("user")
	.where("id !=", 5)
	.get();

sql[sql.length] = sqldriver
	.select()
	.from("user")
	.where("name", "Jane")
	.get()

sql[sql.length] = sqldriver
	.select("user.*")
	.from("user")
	.where("name is null")
	.get()

sql[sql.length] = sqldriver
	.select("user.*")
	.from("user")
	.where({name: "Jane", "id >": 2})
	.get()


sql[sql.length] = sqldriver
	.select("user.*")
	.from("user")
	.where({name: "Ivan", "id <": 8})
	.where("position_id", 3)
	.get()


sql[sql.length] = sqldriver
	.select("user.*")
	.from("user")
	.limit(5)
	.get()


sql[sql.length] = sqldriver
	.select("user.*")
	.from("user")
	.limit(5, 2)
	.get()

console.log(sql);