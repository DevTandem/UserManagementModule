'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_group.init({
    name: DataTypes.STRING,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_group',
    timestamps : false
  });
  return user_group;
};