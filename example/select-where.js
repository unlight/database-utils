var SqlDriver = require("./../library/sqldriver.js");

sqldriver = new SqlDriver();

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


console.log(sql);