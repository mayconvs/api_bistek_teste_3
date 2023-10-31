'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    codigo: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Defina a chave primária como 'codigo'
    },
    descricao: DataTypes.STRING,
    categoria: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN,
    data: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};