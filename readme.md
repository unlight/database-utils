Collection of libraries to work with database
---------------------------------------------

Query builder
-------------
Example 1:
	```javascript
	var sqldriver = new SqlDriver();
	var sql = sqldriver
		.parameters()
		.select("*")
		.from("user")
		.where("id", 5)
		.get();
	// select * from user where id = 5
	```

Example 2:
	```javascript
	sql = sqldriver
		.parameters()
		.select("*")
		.from("user")
		.where("id", 5)
		.getQuerySql();
	
	var query = sql[0]; // select * from user where id = ?
	var params = sql[1]; // [5]
	```

TODO
----
- ORM
- make new methods getQuerySql() return sql with ? getQueryParameters return place holder as array.
- [hold, need execute] replace($table = '', $set = null, $where, $checkexisting = false)
- [hold] history($updatefields = true, $insertfields = false)
- [hold, need depends on execute] simple getcount
- [hold, need depends on execute] simple getcountlike
- [hold, need depends on execute] simple getwhere
- [hold] limit in update()
- [hold] in delete()