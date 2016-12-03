module.exports = function ApiRequest(req,res,table) {

  this.req = req;
  this.res = res;
  this.table = table;

  // SQL query string
  this.sql_query = "SELECT " + this.table.name + ".* FROM " + this.table.name;

  // Find request query keys that are valid column names
  this.lookup_keys = Object.keys(this.req.query).filter(function(key) {
      return !!table.find_column(key);
    });

  // Arrays that will joined and put into the SQL query
  this.conditions = [];
  this.param_values = [];

  // Add lookup keys and values to the conditions and parameter values arrays
  this.add_lookup = function() {
    var that = this;
    this.lookup_keys.forEach(function(key) {
      var data_type = table.find_column(key).data_type;
      if ( ['character varying', 'text'].includes(data_type) ) {
        that.conditions.push("LOWER(" + key + ") LIKE LOWER($" + (that.param_values.length + 1) + ")");
        that.param_values.push(that.req.query[key]);
      }
      else {
        that.conditions.push(key + "=$" + (that.param_values.length + 1) + "");
        that.param_values.push(that.req.query[key]);
      }
    });
  };

  // Search all strings in each row for q value
  this.add_search = function() {
    var that = this;
    if (!!this.req.query.q) {
      var like_conditions = [];
      this.table.columns.forEach(function(column) {
        if ( ['character varying', 'text'].includes(column.data_type) ) {
          like_conditions.push("LOWER(" + column.column_name + ") LIKE LOWER($" + (that.param_values.length + 1) + ")");
          that.param_values.push("%" + that.req.query.q + "%");
        }
      });
      this.conditions.push("(" + like_conditions.join(" OR ") + ")");
    }
  };

  // Add sort column name and order
  this.add_sort = function() {
    if (!!this.req.query.sort && !!table.find_column(this.req.query.sort)) {
      this.sql_query += " ORDER BY " + this.req.query.sort;
      if (!!this.req.query.order) {
        // Otherwise it will always be ASC
        if (this.req.query.order.toLowerCase() === "desc") {
          this.sql_query += " DESC";
        }
      }
    }
  };

  // Add all conditions into the sql query string
  this.build_sql = function() {
    this.add_lookup();
    this.add_search();
    if (this.conditions.length > 0) {
      this.sql_query += " WHERE " + this.conditions.join(" AND ");
    }
    this.add_sort();
  };

  // Retrieve data from Postgres and sent response to client
  this.execute = function(pg,config) {
    var that = this;
    pg.connect(config, function (err, client) {
      client.query(that.sql_query, that.param_values, function (err, result) {
        if(err) {res.json({Response: "False"});}
        else {res.json({Results: result.rows, Response: "True"});}
        client.end();
      });
    });
  };

};