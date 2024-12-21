'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_ug_maps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
         references :{
          model : "users",
          key : "id"
         }
      },
      ug_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "user_groups",
          key : "id"
        }
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references : {
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
    await queryInterface.dropTable('user_ug_maps');
  }
};