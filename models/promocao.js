'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promocao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promocao.belongsTo(models.Empresa,
        { foreignKey: 'EmpresaId', as: 'promocao' });

      Promocao.hasMany(models.Cartao),
        { foreignKey: 'CartaoId', through: 'Compra', as: 'compra_promocao' }

      Promocao.hasMany(models.Compra,
        { foreignKey: 'PromocaoId', as: 'compra' });



    }
  }
  Promocao.init({
    EmpresaId: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    validade: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Promocao',
  });
  return Promocao;
};