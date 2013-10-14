"use strict";

var SqlDriver = require("./sqldriver.js");
MySqlDriver.prototype = Object.create(SqlDriver.prototype);
MySqlDriver.prototype.constructor = MySqlDriver;

function MySqlDriver() {

	SqlDriver.call(this);

	SqlDriver.prototype.getLimit = function(sql, limit, offset) {
		sql += "limit " + limit;
		if (offset) {
			sql += " offset " + offset;
		}
		return sql;
	}
}

module.exports = MySqlDriver;
