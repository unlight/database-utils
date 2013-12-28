"use strict";

var SqlDriver = require("./sqldriver.js");
MSSQLDriver.prototype = Object.create(SqlDriver.prototype);
MSSQLDriver.prototype.constructor = MSSQLDriver;

function MSSQLDriver() {
	SqlDriver.call(this);
}

// TODO: Implement getLimit.
// MSSQLDriver.prototype.getLimit = function(sql, limit, offset) {
// }

module.exports = MSSQLDriver;
