"use strict";

module.exports = SqlDriver;

var isArray = require("util").isArray;
var isNumeric = require("useful-functions.js").isNumeric;
var inArray = require("useful-functions.js").inArray;
var isString = require("useful-functions.js").isString;
var varType = require("useful-functions.js").varType;
var stringEndsWith = require("useful-functions.js").stringEndsWith;
var SqlParameters = require("./sqlparameters.js");

function SqlDriver() {
	
	var _get = "";
	var _selects = [];
	var _froms = [];
	var _distinct = false;
	var _wheres = [];
	var _whereConcat = "and";
	var _whereConcatDefault = "and";
	var _sets = [];
	var _limit;
	var _offset;
	var _orderBys = [];
	var _joins = [];
	var _groupBys = [];
	var _whereGroupCount = 0;
	var _openWhereGroupCount = 0;
	var _havings = [];
	var _isParametrized = false;
	var _sqlParameters = new SqlParameters();
	var _returnParameters = false;
	
	SqlDriver.prototype.reset = function() {
		_get = "";
		_selects = [];
		_froms = [];
		_distinct = false;
		_wheres = [];
		_whereConcat = "and";
		_whereConcatDefault = "and";
		_sets = [];
		_limit = undefined;
		_offset = undefined;
		_orderBys = [];
		_joins = [];
		_groupBys = [];
		_whereGroupCount = 0;
		_openWhereGroupCount = 0;
		_havings = [];
		_isParametrized = false;
		return this;
	}


	SqlDriver.prototype.parameters = function() {
		if (_sqlParameters.count() > 0) {
			var result = _sqlParameters.values();
			_sqlParameters.reset();
			_isParametrized = false;
			return result;
		} else {
			_isParametrized = true;
			return this;
		}
	}

	SqlDriver.prototype.selectcase = function(field, options, alias) {
		_get = "Select";
		var caseOptions = "";
		for (var key in options) {
			var value = _wrap(options[key]);
			if (key == "") {
				caseOptions += " else " + value;
			} else {
				caseOptions += " when " + key + " then " + value;
			}
		}
		_selects.push({
			"field": field,
			"alias": alias,
			"caseOptions": caseOptions
		});
		return this;
	}

	SqlDriver.prototype.between = function(field, value, otherValue) {
		if (otherValue === undefined) {
			var split = (""+value).split("..");
			if (split.length > 1) {
				value = split[0];
				otherValue = split[1];
			}
		}
		var sql = field + " between " + _wrap(value) + " and " + _wrap(otherValue);
		_where(sql);
		return this;
	}

	SqlDriver.prototype.notlike = function(field, match, side) {
		return this.like(field, match, side, "not like");
	}

	SqlDriver.prototype.like = function(field, match, side, op) {
		if (op === undefined) op = "like";
		if (side === undefined) side = "both";
		if (match === undefined) match = "";

		switch (side) {
			case "left": match = "%" + match; break;
			case "right": match += "%"; break;
			case "both": {
				if (typeof match == "string" && match.length == 0) {
					match = "%";
				} else {
					match = "%" + match + "%";
				}
			} break;
			default: 
				throw new Error("Unknown side " + side + ".");
		}
		var sql = field + " " + op + " " + _wrap(match);
		_where(sql);
		return this;
	}

	SqlDriver.prototype.groupby = function(fields) {
		if (!isArray(fields)) {
			fields = fields.toString().split(",");
		}
		for (var i in fields) {
			var field = fields[i].trim();
			if (field != "") {
				_groupBys[_groupBys.length] = field;
			}
		}
		return this;
	}

	SqlDriver.prototype.wherenotin = function(field, values) {
		return this.wherein(field, values, "not in");
	}

	SqlDriver.prototype.wherein = function(field, values, op) {
		if (op === undefined) {
			op = "in";
		}
		if (!isArray(values)) {
			values = ["" + values];
		}
		values = values.map(function(value) {
			return _wrap(value);
		});
		var value = "(" + values.join(",") + ")";
		var where = field + " " + op + " " + value;
		_where(where);
		return this;
	}

	SqlDriver.prototype.having = function(field, value) {
		var expr = _conditionExpr(field, value);
		var sql = expr.join(" ");
		_havings[_havings.length] = sql;
		return this;
	}

	SqlDriver.prototype.getCount = function(table, where) {
		// TODO: [hold]
		this.reset();
		if (table) {
			this.from(table);	
		}
		if (where) {
			this.where(where);	
		}
		this.select("count", "*", "RowCount")
	}

	SqlDriver.prototype.join = function(table, on, join) {
		join = String(join);
		if (!inArray(join, ["inner", "outer", "left", "right", "left outer", "right outer"])) {
			join = "";
		}
		_joins[_joins.length] = (join + " join " + table + " on " + on).trimLeft();
		return this;
	}
	
	SqlDriver.prototype.leftjoin = function(table, on) {
		return this.join(table, on, "left");
	}

	SqlDriver.prototype.orderby = function(field, direction) {
		direction = String(direction).toLowerCase();
		if (direction != "asc") {
			direction = "desc";
		}
		var orderby = field + " " + direction;
		_orderBys[_orderBys.length] = orderby;
		return this;
	}

	SqlDriver.prototype.executeScalar = function() {
		// TODO: return first column of first row.
		return this.execute();
	}

	SqlDriver.prototype.execute = function() {
		var query = this.get();
		// TODO: These should do insert, update, delete, select. Get() returns the query.
	}

	SqlDriver.prototype.delete = function(table) {
		_get = "Delete";
		if (table !== undefined) {
			_froms[_froms.length] = table;
		}
		return this;
	}

	SqlDriver.prototype.getDelete = function() {
		var table = _froms[0];
		var result = "delete " + table;
		if (_wheres.length > 0) {
			result += "\n" + "where " + _wheres.join("\n");
		}
		
		this.reset();
		return result;
	}

	SqlDriver.prototype.getUpdate = function() {
		this._endQuery();
		var table = _froms[0];
		var result = "update " + table + "\n" + "set ";
		for (var i = 0, count = _sets.length; i < count; ++i) {
			if (i > 0) {
				result += ", ";
			}
			var value = _sets[i].value;
			if (_sets[i].wrapValue) {
				value = _wrap(value);
			}
			result += _sets[i].name + " = " + value;
		}
		if (_wheres.length > 0) {
			result += "\n" + "where " + _wheres.join("\n");
		}
		this.reset();
		return result;
	}

	SqlDriver.prototype.update = function(table) {
		_get = "Update";
		if (table !== undefined) {
			_froms[_froms.length] = table;
		}
		return this;
	}


	SqlDriver.prototype.insert = function() {
		_get = "Insert";
		return this;
	}
	

	SqlDriver.prototype.set = function(name, value, wrapValue) {
		if (arguments.length == 1) {
			for (var i in name) {
				this.set(i, name[i], true);
			}
			return this;
		} else {
			if (arguments[2] === undefined) {
				wrapValue = true;
			}
			if (value === null || value === undefined) {
				value = "null";
				wrapValue = false;
			}
			_sets.push({
				name: name,
				value: value,
				wrapValue: wrapValue
			});
		}
		return this;
	}

	SqlDriver.prototype.getInsert = function() {
		// this.endQuery();
		var table = _froms[0];
		var result = "insert into " + table;
		var values = [];
		var names = [];
		for (var i = 0, count = _sets.length; i < count; ++i) {
			names[names.length] = _sets[i].name;
			var value = _sets[i].value;
			if (_sets[i].wrapValue) {
				value = _wrap(value);
			}
			values[values.length] = value;
		}
		result += "(" + names.join(", ") + ") values(" + values.join(", ") + ")";
		this.reset();
		return result;
	}
	
	SqlDriver.prototype.select = function(select, alias, func) {
		_get = "Select";
		if (arguments.length == 0) {
			_selects.push({
				"field": "*"
			});
		} else if (arguments.length == 1) {
			if (isString(select)) {
				select = select.split(",");
			}
			for (var i = 0, count = select.length; i < count; ++i) {
				var field = select[i].toString().trim();
				if (field === "") continue;
				var split = field.split(/\s*as\s*/i);
				if (split.length > 1) {
					field = split[0];
					alias = split[1];
				}
				_selects.push({
					"field": field,
					"alias": alias
				});
			}
		} else if (arguments.length == 2) {
			_selects.push({
				"field": select,
				"alias": alias
			});
		} else {
			var args = Array.prototype.slice.call(arguments);
			func = args.shift();
			alias = args.pop();
			// Do flatten array.
			for (var i = 0, count = args.length; i < count; ++i) {
				if (isArray(args[i])) {
					args[i] = args[i].join(", ");
				}
			}
			_selects.push({
				"func": func,
				"field": args.join(", "),
				"alias": alias
			});
		}
		return this;
	}
	
	SqlDriver.prototype.from = function(from) {
		parse: {
			if (isArray(from)) break parse;
			if (isString(from)) {
				from = from.split(",");
			}
		}
		for (var i = 0, count = from.length; i < count; ++i) {
			var table = from[i].toString().trim();
			if (table === "") continue;
			_froms.push(table);
		}
		return this;
	}

	SqlDriver.prototype.distinct = function(value) {
		if (typeof value == "boolean") {
			_distinct = value;
		} else {
			_distinct = true;
		}
		return this;
	}

	SqlDriver.prototype.subQuery = function() {
		var sql = this.get();
		return "(" + sql + ")";
	}
	
	SqlDriver.prototype.getSelect = function() {
		this._endQuery();
		var result = "select ";
		if (_distinct) {
			result += "distinct ";
		}
		var selects = "";
		for (var i = 0, count = _selects.length; i < count; ++i) {
			var item = _selects[i];
			var field = item.field;
			if (item.func) {
				field = item.func + "(" + field + ")";
			} else if ("caseOptions" in item) {
				field = "case " + field + item.caseOptions + " end";
			}
			if (item.alias) {
				field = field + " as " + item.alias;
			}
			if (i > 0) field = ", " + field;
			selects += field;
		}
		if (selects == "") {
			selects = "*";
		}
		result += selects;
		if (_froms.length > 0) {
			result += "\n" + "from " + _froms.join(", ");
		}
		if (_joins.length > 0) {
			result += "\n" + _joins.join("\n");
		}
		if (_wheres.length > 0) {
			result += "\n" + "where " + _wheres.join("\n");
		}
		if (_groupBys.length > 0) {
			result += "\n" + "group by " + _groupBys.join(", ");
		}
		if (_havings.length > 0) {
			result += "\n" + "having " + _havings.join("\n");
		}
		if (_orderBys.length > 0) {
			result += "\n" + "order by " + _orderBys.join(", ");
		}
		if (isNumeric(_limit)) {
			result += "\n";
			result = this.getLimit(result, _limit, _offset);
		}
		this.reset();
		return result;
	}

	var _conditionExpr = (function() {
		var operators = [">=", "<=", "!=", "<>", ">", "<", "!@", "@", "%$", "^%", "%", "like", "not like", "is null", "is not null"];
		return function(field, value) {
			var operator;
			for (var count = operators.length, i = 0; i < count; ++i) {
				var op = operators[i];
				if (stringEndsWith(field, op)) {
					field = field.slice(0, -op.length).trim();
					operator = op;
					break;
				}
			}
			if (operator === undefined) {
				operator = "=";
			}
			var wrapValue = true;
			if (value === null) {
				value = "@null";
			}
			if (isString(value)) {
				if (value.substr(0, 1) == "@") {
					wrapValue = false;
					value = value.substr(1);
				}
			}
			var result = [field, operator];
			if (value !== undefined) {
				if (wrapValue) {
					value = _wrap(value);
				}
				result[result.length] = value;
			}
			return result;
		}
	})();
	
	SqlDriver.prototype.where = function(field, value) {
		if (typeof field == "object") {
			for (var i in field) {
				this.where(i, field[i]);
			}
			return this;
		}
		var expr = _conditionExpr(field, value);
		var operator = expr[1];
		switch (operator) {
			case "@": return this.wherein(field.slice(0, -1), value);
			case "!@": return this.wherenotin(field.slice(0, -2), value);
			case "!%": return this.notlike(field.slice(0, -2), value, "both");
			case "%": return this.like(field.slice(0, -1), value, "both");
			case "^%": return this.like(field.slice(0, -2), value, "right");
			case "%$": return this.like(field.slice(0, -2), value, "left");
		}
		var sql = expr.join(" ");
		_where(sql);
		return this;
	}

	var _where = function(sql) {
		var concat = "";
		if (_wheres.length > 0) {
			concat = (new Array(_whereGroupCount + 2)).join(" ") + _whereConcat + " ";
		}
		while (_openWhereGroupCount > 0) {
			concat += "(";
			_openWhereGroupCount--;
		}
		_whereConcat = _whereConcatDefault;
		_wheres.push(concat + sql);
	}

	SqlDriver.prototype.limit = function(limit, offset) {
		_limit = limit;
		if (offset !== undefined) {
			_offset = offset;
		}
		return this;
	}

	SqlDriver.prototype.offset = function(offset) {
		_offset = offset;
		return this;
	}

	SqlDriver.prototype.getLimit = function(sql, limit, offset) {
		throw "getLimit() not supported.";
	}

	SqlDriver.prototype.endQuery = function() {
		// TODO: endQuery function.
	}
	
	SqlDriver.prototype.query = function() {
		throw "Database engine is not defined.";
	}
	
	SqlDriver.prototype.get = function() {
		if (!_get) {
			throw new Error("_get is not set.");
		}
		var f = "get" + _get;
		if (typeof this[f] != "function") {
			throw "Error while trying to call '"+f+"' method.";
		}
		return this[f].call(this);
	}

	SqlDriver.prototype.getQuery = function() {
		var sql = this.get();
		var parameters = this.parameters();
		return [sql, parameters];
	}

	var _wrap = function(value) {
		if (_isParametrized) {
			_sqlParameters.push({value: value});
			return "?";
		}
		if (!isNumeric(value)) {
			value = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
				.replace(/'/g, "\\'")
				.replace(/\\"/g, '"') + '\'';
		}
		return value;
	}

	var _quote = function (value, wrapInQuotes) {
		if (isNumeric(value)) {
			return value;
		}
		value = value
			.replace("\\", "\\\\")
			.replace("\0", "\\0")
			.replace("\n", "\\n")
			.replace("\r", "\\r")
			.replace("'", "\\'")
			.replace("\"", "\\\"")
			.replace("\x1a", "\\Z");
		if (wrapInQuotes === true) {
			value = "'" + value + "'";
		}
		return value;
	}

	SqlDriver.prototype.andop = function() {
		_whereConcat = "and";
		return this;
	}

	SqlDriver.prototype.orop = function() {
		_whereConcat = "or";
		return this;
	}

	SqlDriver.prototype.beginwheregroup = function() {
		_whereGroupCount++;
		_openWhereGroupCount++;
		return this;
	}

	SqlDriver.prototype.endwheregroup = function() {
		if (_whereGroupCount > 0) {
			var whereCount = _wheres.length;
			if (_openWhereGroupCount >= _whereGroupCount) {
				_openWhereGroupCount--;
			} else if (whereCount > 0) {
				_wheres[whereCount-1] += ")";
			}
			_whereGroupCount--;
		}
		return this;
	}

	SqlDriver.prototype._endQuery = function() {
		while (_whereGroupCount > 0) {
			this.endwheregroup();
		}
	}
}