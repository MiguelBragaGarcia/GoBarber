import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    //Chave única
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('A Fila executou');
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM',às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();

//Quando o usuário importar o método key ele pode acessar o valor sem chamar o método em si com os ();
