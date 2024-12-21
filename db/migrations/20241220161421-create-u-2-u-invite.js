'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('u2u_invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique : true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id"
        }
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "warehouses",
          key : "id"
        },
        allowNull : false
      },
      register_status : {
        type : Sequelize.BOOLEAN,
        defaultValue : false        
      }
    },
  {
    timestamps : true
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('u2u_invites');
  }
};