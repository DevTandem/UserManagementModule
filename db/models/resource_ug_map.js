'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resource_ug_map extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  resource_ug_map.init({
    resource_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER,
    read_op: DataTypes.BOOLEAN,
    edit_op: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'resource_ug_map',
  });
  return resource_ug_map;
};