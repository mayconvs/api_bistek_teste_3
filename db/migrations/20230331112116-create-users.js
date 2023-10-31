'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      codigo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      data: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('Products');
  }
};