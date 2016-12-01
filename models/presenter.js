'use strict';
module.exports = function(sequelize, DataTypes) {
  var Presenter = sequelize.define('Presenter', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    company: DataTypes.STRING,
    job_title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Presenter.belongsToMany(Event, {through: 'EventPresenter'});
      }
    }
  });
  return Presenter;
};