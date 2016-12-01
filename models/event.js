'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    datetime: DataTypes.DATE,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Event.hasOne(Venue);
        Event.belongsToMany(Presenter, {through: 'EventPresenter'});
        Event.belongsToMany(User, {through: 'EventUser'});

      }
    }
  });
  return Event;
};