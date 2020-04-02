'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //addColumn(Tabela,NomeDaColuna, Propriedade dessa coluna)
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER, //Tipo inteiro
      references: { model: 'files', key: 'id' }, //Referencia todos os IDs da tabela users com os IDs da tabelas files
      onUpdate: 'CASCADE', //Quando o arquivo for atualizado atualize todas as tabelas referenciadas com o novo valor de ID
      onDelete: 'SET NULL', // Quando o arquivo for deletado atribua a avatar id null
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
