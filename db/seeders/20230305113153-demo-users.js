'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cadastrar o registro na tabela "situations"
    return queryInterface.bulkInsert('Products', [
      {
        codigo: 1,
        descricao: "Maçã",
        categoria: "",
        ativo: false,
        data: "09/10/2023",
        createdAt: '2023-10-09 00:52:22',
        updatedAt: '2023-10-09 00:52:22',
      },
      {
        codigo: 2,
        descricao: "Banana",
        categoria: "",
        ativo: true,
        data: "10/10/2023",
        createdAt: '2023-10-10 00:52:22',
        updatedAt: '2023-10-10 00:52:22',
      },
      {
        codigo: 3,
        descricao: "Pera",
        categoria: "Bazar",
        ativo: false,
        data: "11/10/2023",
        createdAt: '2023-10-11 00:52:22',
        updatedAt: '2023-10-11 00:52:22',
      },
      {
        codigo: 4,
        descricao: "Uva",
        categoria: "Bazar",
        ativo: true,
        data: "12/10/2023",
        createdAt: '2023-10-12 00:52:22',
        updatedAt: '2023-10-12 00:52:22',
      },
      {
        codigo: 5,
        descricao: "Abacaxi",
        categoria: "Bazar",
        ativo: false,
        data: "13/10/2023",
        createdAt: '2023-10-13 00:52:22',
        updatedAt: '2023-10-13 00:52:22',
      },
      {
        codigo: 6,
        descricao: "Mamão",
        categoria: "Bazar",
        ativo: true,
        data: "14/10/2023",
        createdAt: '2023-10-14 00:52:22',
        updatedAt: '2023-10-14 00:52:22',
      },
      {
        codigo: 7,
        descricao: "Laranja",
        categoria: "Bazar",
        ativo: false,
        data: "15/10/2023",
        createdAt: '2023-10-15 00:52:22',
        updatedAt: '2023-10-15 00:52:22',
      },
      {
        codigo: 8,
        descricao: "Ervilha",
        categoria: "Bazar",
        ativo: true,
        data: "16/10/2023",
        createdAt: '2023-10-16 00:52:22',
        updatedAt: '2023-10-16 00:52:22',
      },
      {
        codigo: 9,
        descricao: "Cerveja",
        categoria: "Bebidas",
        ativo: true,
        data: "17/10/2023",
        createdAt: '2023-10-17 00:52:22',
        updatedAt: '2023-10-17 00:52:22',
      },
      {
        codigo: 10,
        descricao: "Coca-Cola",
        categoria: "Bebidas",
        ativo: true,
        data: "18/10/2023",
        createdAt: '2023-10-18 00:52:22',
        updatedAt: '2023-10-18 00:52:22',
      },

    ]);
  },

  async down (queryInterface, Sequelize) {
   
  }
};
