import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        /*
         *Os campos que foram adicionados aqui não necessariamente precisam ser iguais ao banco de dados
         * eles são apenas os campos que o usuário pode preencher */
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default File;
/**Quando se está mexendo com o modulo sequelize não necessita definir os outros parâmetros apenas o tipo é o suficiente */
