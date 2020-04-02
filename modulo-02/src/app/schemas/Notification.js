import mongoose, { Mongoose } from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    //O conteúdo da nossa notificação
    content: {
      type: String,
      required: true,
    },
    //"Campo dos providers" aqui armazena o provider que será notificado
    user: {
      type: Number,
      required: true,
    },
    //"campo lido" tipo boleano e por padrão false
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);

/*Diferente dos models RELACIONAIS DO POSTGRES não precisamo adicionar manualmente 
os models e não precisamos de migrations.
  Também temos que tomar cuidado quando vamos alterar algum dado pois podemos não 
  conseguir acessar depois, já que os dados não são relacionados
*/
