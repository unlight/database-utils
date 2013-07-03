/*
 * Generic SQL database driver.
 * 
 * The Gdn_DatabaseDriver class is used
 * by any given database driver to build and execute database queries.
 *
 * This class is HEAVILY inspired by and, in places, flat out copied from
 * Garden Framework (http://vanillaforums.org). My hat is off to them.
 * @author S
 * @author Mark O'Sullivan
 * @copyright 2003 Mark O'Sullivan
 */


function SqlDriver() {

	/**
	 * @type self
	 */
	_this = this;

   /**
    * Whether or not to reset the properties when a query is executed.
    *
    * @type int
    *   0 = The object will reset after query execution.
    *   1 = The object will not reset after the NEXT query execution.
    *   2 = The object will not reset after ALL query executions.
    */
	var _noReset = 0;
	// Object.defineProperty(this, "_noReset", {
	// 	get : function() { return _noReset; },
	// 	enumerable : false,
	// 	configurable : false
	// });

	/**
	 * The logical operator used to concatenate where clauses.
	 * @type string
	 */
	var _whereConcat;

   /**
    * The default _whereConcat that will be reverted back to after every where clause is appended.
    * @type string
    */
	var _whereConcatDefault;


   /**
    * An associative array of table alias => table name pairs.
    * @type array
    */
	var _AliasMap = [];
	
   /**
    * The name of the class that has been instantiated.
    * @type string
    */
	var _className;
   /**
    * A boolean value indicating if this is a distinct query.
    * @type boolean
    */
   var _Distinct = false;
	var _Froms;
	var _GroupBys;
	var _Havings;
	var _Joins;
	var _Limit;
	var _NamedParameters = {};

	var _Offset;
	var _OpenWhereGroupCount;
	var _OrderBys;
	var _Selects;
	var _Sets;

	var Database;
	var _DatabaseInfo;
   
   /**
    * The number of where groups to open.
    * @type int
    */
	var _WhereGroupCount = 0;
   
   /**
    * A collection of where clauses.
    * @type array
    */
   var _Wheres;

	/**
	* Resets properties of this object that relate to building a select
	* statement back to their default values. Called by this.get() and
	* this.getWhere().
	*/
	this.reset = function() {
		// Check the _noReset flag.
		switch (_noReset) {
			case 1: _noReset = 0; return _this;
			case 2: return _this;
		}

		_selects         = [];
		_froms           = [];
		_joins           = [];
		_wheres          = [];
		_whereConcat     = "and";
		_whereConcatDefault = "and";
		_whereGroupCount = 0;
		_openWhereGroupCount = 0;
		_groupBys        = [];
		_havings         = [];
		_orderBys        = [];
		_aliasMap        = [];
		_distinct        = false;
		_limit           = false;
		_offset          = false;
		_order           = false;
		_sets            = [];
		_namedParameters = {};

		return _this;
	}

   /**
    * Allows the specification of columns to be selected in a database query.
    * Returns this object for chaining purposes. ie. db.select().from();
    *
    * @param mixed select  The field(s) being selected. It
    * can be a comma delimited string, the name of a single field, or an array
    * of field names.
    * @param string function  The aggregate function to be used on
    * the select column. Only valid if a single column name is provided.
    * Accepted values are MAX, MIN, AVG, SUM.
    * @param string alias  The alias to give a column name.
    * @return this
    */
   this.select = function (select, func, alias) {
		select = select || "*";
		if (typeof select == "string") {
        	if (func == false) {
				select = select.split(",").map(function(string) {
					return string.trim();
				});
        	} else {
        		select = [select];
        	}
      	}
      	var count = select.length;

      	var i = 0;
        for (i = 0; i < count; i++) {
        	var field = select[i];
			// Try and figure out an alias for the field.
            if (alias == false || (count > 1 && i > 0)) {
            	var matches = field.match(/^([^\s]+)\s+(?:as\s+)?`?([^`]+)`?$/);
            	if (matches.length > 0) {
	                // This is an explicit alias in the select clause.
	               	field = matches[1];
	                alias = matches[2];
  	            } else {
  	            	matches = field.match(/^[^\.]+\.`?([^`]+)`?$/);
  	            	if (matches.length > 0) {
  	            		// This is an alias from the field name.
  	            		alias = matches[1];
  	            	} else {
	            		alias = "";
	            	}
  	            }
            	// Make sure we aren't selecting * as an alias.
            	if (alias == '*') alias = '';
         	}
         
         var expr = {
         	"field" => field,
         	"function" => func,
         	"alias" => alias
         };
         
         _selects.push(expr);
      	return _this;
   }

	/**
	 * Concat the next where expression with an "and" operator.
	 * Note: Since "and" is the default operator to begin with this method doesn't usually have to be called,
	 * unless SqlDriver.or(false) has previously been called.
	 * @param  boolean            false  Whether or not the "and" is one time or sets the default operator.
	 * @return SqlDriver          this.
	 */
   this.andOp = function(setDefault) {
		_WhereConcat = "and";
		if (setDefault) {
			_whereConcatDefault = "and";
		}
		return _this;
	}

	/**
	* Begin bracketed group in the where clause to group logical expressions together.
	* @return SqlDriver this
	*/
	this.beginWhereGroup = function() {
		_WhereGroupCount++;
		_OpenWhereGroupCount++;
		return _this;
	}

	this.query = function(sql) {
		var result = _this.database.query(sql, _namedParameters);
		_this.reset();
		return result;
	}
	
}

console.log('============');
var select = "x, y, z";
select = select.split(",").map(function(string) {
	return string.trim();
});
console.log(select);



// console.log('============');
// console.log(typeof SqlDriver, typeof SqlDriver.prototype);
// s = new SqlDriver();
// console.log('get _noReset', s._noReset);
// console.log('set _noReset', s._noReset = -1);
// console.log('get _noReset', s._noReset);

// console.log('s.reset()');
// s.reset();

// Object.defineProperty(SqlDriver.prototype, "_noReset", {
// 	get : function() { return bValue; },
// 	set : function(newValue){ bValue = newValue; },
// 	enumerable : false,
// 	configurable : true});



// Object.defineProperty(obj, "key", {
//   enumerable: false,
//   configurable: false,
//   writable: false,
//   value: "static"
// });