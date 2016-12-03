module.exports = function Table(table_name) {
  this.name = table_name;
  this.columns = [];

  // Retrieve column names from database
  this.get_columns = function(pg,config) {
    var that = this;
    var sql_query = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1";
    pg.connect(config, function (err, client) {
      client.query(sql_query, [that.name], function (err, result) {
        if(!err) {that.columns = result.rows;}
        client.end();
      });
    });
  };

  // Return column details with specified column name
  this.find_column = function(column_name) {
    return this.columns.find(function(column) {
      return column.column_name === column_name.toLowerCase();
    });
  };
};