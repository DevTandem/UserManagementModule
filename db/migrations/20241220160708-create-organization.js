'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id"
        }
      }
    },
  {
    timestamps : true
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};