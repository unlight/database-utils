/*
 * Generic SQL database driver
 * 
 * The Gdn_DatabaseDriver class is used
 * by any given database driver to build and execute database queries.
 *
 * This class is HEAVILY inspired by and, in places, flat out copied from
 * Garden Framework (http://vanillaforums.org). My hat is off to them.
*/

function SqlDriver {

// _AliasMap
// ClassName
// Database
// _DatabaseInfo

	/**
	 * The logical operator used to concatenate where clauses.
	 * @var string
	 */
	var _WhereConcat;

   /**
    * The default _WhereConcat that will be reverted back to after every where clause is appended.
    * @var string
    */
	var _WhereConcatDefault;

   /**
    * A boolean value indicating if this is a distinct query.
    * @var boolean
    */
   var _Distinct = false;
// 	_Froms
// 	_GroupBys
// 	_Havings
// 	_Joins
// 	_Limit
// 	_NamedParameters
// 	_NoReset
// 	_Offset
// 	_OpenWhereGroupCount
// 	_OrderBys
// 	_Selects
// 	_Sets
   
   /**
    * The number of where groups to open.
    * @var int
    */
	var _WhereGroupCount = 0;
   
   /**
    * A collection of where clauses.
    * @var array
    */
   var _Wheres;
	
}

/**
 * Concat the next where expression with an 'and' operator.
 * Note: Since 'and' is the default operator to begin with this method doesn't usually have to be called,
 * unless SqlDriver.or(false) has previously been called.
 * @param  boolean            false  Whether or not the 'and' is one time or sets the default operator.
 * @return SqlDriver          this.
 */
SqlDriver.prototype.andOp = function(setDefault) {
	this._WhereConcat = "and";
	if (setDefault) {
		this._WhereConcatDefault = "and";
	}
	return this;
};

   /**
    * Begin bracketed group in the where clause to group logical expressions together.
    *
    * @return Gdn_DatabaseDriver $this
    */
SqlDriver.prototype.BeginWhereGroup = function {
	this._WhereGroupCount++;
	this._OpenWhereGroupCount++;
	return this;
}