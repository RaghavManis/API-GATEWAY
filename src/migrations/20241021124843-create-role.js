'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Enums } = require("../utills/common");
const { CUSTOMER, FLIGHT_COMPANY, ADMIN } = Enums.USER_ROLE_ENUMS;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.ENUM(CUSTOMER, FLIGHT_COMPANY, ADMIN),
        defaultValue: CUSTOMER,
        allowNull: false
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
    await queryInterface.dropTable('Roles');
  }
};
