'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resource_ug_maps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource_id: {
        type: Sequelize.INTEGER,
        references :{
          model : "resources",
          key : "id"
         }
      },
      ug_id: {
        type: Sequelize.INTEGER,
        references :{
          model : "user_groups",
          key : "id"
         }
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references :{
          model : "warehouses",
          key : "id"
         }
      },
      read_op: {
        type: Sequelize.BOOLEAN
      },
      edit_op: {
        type: Sequelize.BOOLEAN
      }
    },
  {
    timestamps : true
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resource_ug_maps');
  }
};