'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      r_name: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.INTEGER
      },
      user_id : {
        type : Sequelize.INTEGER,
        references :{
          model : "users",
          key : "id"
         }
      },
      warehouse_id : {
        type : Sequelize.INTEGER,
        references :{
          model : "warehouses",
          key : "id"
         }
      }
    },
  {
    timestamps : true
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resources');
  }
};