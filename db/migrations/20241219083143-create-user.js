'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fname: {
        type: Sequelize.STRING
      },
      lname: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        validate : {
          min : 8
        }
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      mobile_number: {
        type: Sequelize.STRING,
        unique: true
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references : {
          model: 'warehouses',
          key: 'id'
        },
        allowNull : true
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};