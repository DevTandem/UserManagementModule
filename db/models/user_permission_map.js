'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_permission_map extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_permission_map.init({
    user_id: DataTypes.INTEGER,
    p_name: DataTypes.STRING,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_permission_map',
    timestamps : false
  });
  return user_permission_map;
};