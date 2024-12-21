'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      otp: {
        type: Sequelize.STRING
      },
      expiresAt: {
        type: Sequelize.DATE
      }
    },
  {
    timestamps : true
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('otps');
  }
};