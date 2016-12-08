module.exports = function Request(query,table) {
  this.query = query;
  this.table = table;

  // Generate SQL select portion of query
  select_string = table.columns.map(function(column) {
    if ( column.data_type.includes('date') ) {
      return "to_char(date, 'DD Month YYYY') AS date";
    }
    else if ( column.data_type.includes('time') ) {
      return "to_char(time, 'HH12:MIAM') AS time";
    }
    return table.name + "." + column.column_name;
  }).join(", ");

  // SQL query string
  this.sql_query = "SELECT " + select_string + " FROM " + this.table.name;

  // Arrays request will joined and put into the SQL query
  this.conditions = [];
  this.param_values = [];

  // Find query keys request are valid column names
  this.column_keys = Object.keys(this.query).filter(function(key) {
    return !!table.find_column(key);
  });

  // Add column keys and values to the conditions and parameter values arrays
  this.add_column_keys = function() {
    var request = this;
    request.column_keys.forEach(function(key) {
      var data_type = table.find_column(key).data_type;
      if ( ['character varying', 'text'].includes(data_type) ) {
        request.conditions.push("LOWER(" + key + ") LIKE LOWER($" + (request.param_values.length + 1) + ")");
        request.param_values.push(request.query[key]);
      }
      else {
        request.conditions.push(key + "=$" + (request.param_values.length + 1) );
        request.param_values.push(request.query[key]);
      }
    });
  };

  // Search all strings in each row for q value, then add to conditions and parameters values arrays
  this.add_search = function() {
    var request = this;
    if (!!request.query.q) {
      var like_conditions = [];
      request.table.columns.forEach(function(column) {
        if ( ['character varying', 'text'].includes(column.data_type) ) {
          like_conditions.push("LOWER(" + column.column_name + ") LIKE LOWER($" + (request.param_values.length + 1) + ")");
          request.param_values.push("%" + request.query.q + "%");
        }
      });
      request.conditions.push("(" + like_conditions.join(" OR ") + ")");
    }
  };

  // Add sort column name and order into SQL query string
  this.add_range = function() {
    var request = this;
    if (!!request.query.time_from) {
      request.table.columns.forEach(function(column) {
        if ( column.column_name === 'time' ) {
          request.conditions.push(column.column_name + ">=$" + (request.param_values.length + 1));
          request.param_values.push(request.query.time_from);
        }
      });
    }
    if (!!request.query.time_to) {
      request.table.columns.forEach(function(column) {
        if ( column.column_name === 'time' ) {
          request.conditions.push(column.column_name + "<=$" + (request.param_values.length + 1));
          request.param_values.push(request.query.time_to);
        }
      });
    }
    if (!!request.query.date_from) {
      request.table.columns.forEach(function(column) {
        if ( column.column_name === 'date' ) {
          request.conditions.push(column.column_name + ">=$" + (request.param_values.length + 1));
          request.param_values.push(request.query.date_from);
        }
      });
    }
    if (!!request.query.date_to) {
      request.table.columns.forEach(function(column) {
        if ( column.column_name === 'date' ) {
          request.conditions.push(column.column_name + "<=$" + (request.param_values.length + 1));
          request.param_values.push(request.query.date_to);
        }
      });
    }
  };

  // Add sort column name and order into SQL query string
  this.add_sort = function() {
    var request = this;
    if (!!request.query.sort && !!table.find_column(request.query.sort)) {
      request.sql_query += " ORDER BY " + request.query.sort;
      if (!!request.query.order) {
        // Otherwise it will always be ASC
        if (request.query.order.toLowerCase() === "desc") {
          request.sql_query += " DESC";
        }
      }
      if (request.query.sort === "date") {
        request.sql_query += ", time";
        if (request.query.order.toLowerCase() === "desc") {
          request.sql_query += " DESC";
        }
      }
    }
  };

  // Add all conditions into the sql query string
  this.build_sql = function() {
    var request = this;
    request.add_column_keys();
    request.add_search();
    request.add_range();
    if (request.conditions.length > 0) {
      request.sql_query += " WHERE " + request.conditions.join(" AND ");
    }
    request.add_sort();
  };

  // Build sql string for creation of new row
  this.build_sql_post = function() {
    var request = this;
    var params = [];
    request.column_keys.forEach(function (key) {
      params.push("$" + (request.param_values.length + 1) );
      request.param_values.push(query[key]);
    });
    request.sql_query = "INSERT INTO " + table.name + " (" + request.column_keys.join(", ") + ") VALUES (" + params.join(", ") + ")";
  };

  // Build sql string for updating a row
  this.build_sql_put = function() {
    var request = this;
    var params = [];
    request.column_keys.forEach(function (key) {
      params.push(key + " = $" + (request.param_values.length + 1) );
      request.param_values.push(query[key]);
    });
    request.sql_query = "UPDATE " + request.table.name + " SET " + params.join(", ") + " WHERE id=" + query.id;
  };

  // Build sql string for deletion of a row
  this.build_sql_delete = function() {
    var request = this;
    request.sql_query = "DELETE FROM " + request.table.name + " WHERE id=" + query.id;
  };

  // Retrieve data from Postgres and sent response to client
  this.send_json = function(pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(request.sql_query, request.param_values, function (err, result) {
        if(err) {
          res.json({
            Response: "False"
          });
        }
        else {
          res.json({
            results: result.rows, 
            result_count: result.rows.length,
            response: "True"
          });
        }
        client.end();
      });
    });
  };

  // Retrieve data from Postgres, build the ejs page and send it to the client
  this.render_ejs = function(ejs,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(request.sql_query, request.param_values, function (err, result) {
        if(err) {
          res.send("Request failed");
        }
        else {
          res.render(ejs,{
            table: request.table,
            items: result.rows
          });
        }
        client.end();
      });
    });
  };

  // Execute the SQL string and redirect to a specified route
  this.redirect = function(route,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(request.sql_query, request.param_values, function (err, result) {
        if(err) {
          res.send("Request failed");
        }
        else {
          res.redirect(route);
        }
        client.end();
      });
    });
  };

  // Execute the SQL string and redirect to a specified route
  this.ajax = function(pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(request.sql_query, request.param_values, function (err, result) {
        if(!err && result.rowCount > 0) {
          res.json({success: true});
          return;
        }
        else {
          res.json({success: false});
        }
        client.end();
      });
    });
  };

  // For deletion, to delete one relation before deleting the item
  this.two_queries_redirect = function(sql_query,route,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(sql_query, function (err, result) {
        request.redirect(route,pg,config,res);
        client.end();
      });
    });
  };

  // For deletion, to delete two relations before deleting the item
  this.three_queries_redirect = function(sql_query,sql_query2,route,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(sql_query, function (err, result) {
        client.query(sql_query2, function (err, result) {
          request.redirect(route,pg,config,res);
          client.end();
        });
      });
    });
  };

  // For deletion, to delete one relation before deleting the item
  this.two_queries_ajax = function(sql_query,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(sql_query, function (err, result) {
        request.ajax(pg,config,res);
        client.end();
      });
    });
  };

  // For deletion, to delete two relations before deleting the item
  this.three_queries_ajax = function(sql_query,sql_query2,pg,config,res) {
    var request = this;
    var client = new pg.Client(config);
    client.connect(function (err) {
      client.query(sql_query, function (err, result) {
        client.query(sql_query2, function (err, result) {
          request.ajax(pg,config,res);
          client.end();
        });
      });
    });
  };
};