Database utils for node.js
--------------------------
- SqlBuilder
- ORM

TODO
----
- make new methods getQuerySql() return sql with ? getQueryParameters return place holder as array.
- warn if _wrap is going to wrap non-string or non-object
- [hold, need execute] replace($table = '', $set = null, $where, $checkexisting = false)
- [hold] history($updatefields = true, $insertfields = false)
- [hold, need depends on execute] simple getcount
- [hold, need depends on execute] simple getcountlike
- [hold, need depends on execute] simple getwhere
- move examples to unit tests
- [hold] limit in update()
- [hold] in delete()