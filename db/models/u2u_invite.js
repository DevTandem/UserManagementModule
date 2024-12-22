'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class u2u_invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  u2u_invite.init({
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER,
    register_status : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'u2u_invite',
    timestamps : false
  });
  return u2u_invite;
};