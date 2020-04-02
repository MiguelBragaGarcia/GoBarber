import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        /*
         *Os campos que foram adicionados aqui não necessariamente precisam ser iguais ao banco de dados
         * eles são apenas os campos que o usuário pode preencher */
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, //Cria um campo que será utilizado apenas no lado do código e não do servidor
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }
  //Associa os arquivos de File com os arquivos de User para poder pegar o avartar_id
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
/**Quando se está mexendo com o modulo sequelize não necessita definir os outros parâmetros apenas o tipo é o suficiente */
