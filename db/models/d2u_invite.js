'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class d2u_invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  d2u_invite.init({
    email: DataTypes.STRING,
    developer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'd2u_invite',
  });
  return d2u_invite;
};