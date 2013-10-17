"use strict";

module.exports = SqlDriver;

var isArray = require("util").isArray;
var isNumeric = require("useful-functions.js").isNumeric;
var inArray = require("useful-functions.js").inArray;
var isString = require("useful-functions.js").isString;
var varType = require("useful-functions.js").varType;

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
	//var _whereGroupCount = 0;
	//var _openWhereGroupCount = 0;
	
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
		//_whereGroupCount = 0;
		//_openWhereGroupCount = 0;
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
		// this.endQuery();
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
				_sets[_sets.length] = {
					name: i,
					value: name[i],
					wrapValue: true
				};
			}
		} else {
			if (arguments[3] === undefined) {
				wrapValue = true;
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
				select = select.split(/\s*,\s*/);
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
			_selects.push({
				"func": func,
				"field": args,
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
	
	SqlDriver.prototype.getSelect = function() {
		this.endQuery();
		var result = "select ";
		if (_distinct) {
			result += "distinct ";
		}
		var selects = "";
		for (var i = 0, count = _selects.length; i < count; ++i) {
			var item = _selects[i];
			var select = item.field;
			if (item.func) {
				select = item.func + "(" + select + ")";
			}
			if (item.alias) {
				select = select + " as " + item.alias;
			}
			if (i > 0) select = ", " + select;
			selects += select;
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
			result += "\n";
			result += "group by " + _groupBys.join(", ");
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
	
	SqlDriver.prototype.where = function(field, value) {
		if (typeof field == "object") {
			for (var i in field) {
				this.where(i, field[i]);
			}
			return this;
		}
		var operator = "=";
		var split = field.split(/\s*(=|<>|>|<|>=|<=|!=|like|not like|is null|is not null)$/i);
		if (split[1] !== undefined) {
			field = split[0];
			operator = split[1];
		}
		var wrapValue = true;
		if (value === null) {
			value = "@null";
		} else if (isString(value)) {
			var first = value.substr(0, 1);
			if (first == "@") {
				wrapValue = false;
				value = value.substr(1);
			}
		}

		var sql = field + " " + operator;
		if (value !== undefined) {
			if (wrapValue) {
				value = _wrap(value);
			}
			sql += " " + value;
		}
		_where(sql);
		return this;
	}

	var _where = function(sql) {
		var concat = "";
		if (_wheres.length > 0) {
			concat = (new Array(_wheres.length + 1)).join(" ") + _whereConcat + " ";
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
		throw "Not supported.";
	}

	SqlDriver.prototype.endQuery = function() {
		// TODO: endQuery function.
	}
	
	SqlDriver.prototype.query = function() {
		throw "Database engine is not defined.";
	}
	
	SqlDriver.prototype.get = function() {
		var f = "get" + _get;
		if (typeof this[f] != "function") {
			throw "Error while trying to call '"+f+"' method.";
		}
		return this[f].call(this);
	}

	var _wrap = function(value) {
		if (!isNumeric(value)) {
			value = value.replace("'", "\\'");
			value = "'" + value + "'";	
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

	SqlDriver.quote = _quote;
	
}