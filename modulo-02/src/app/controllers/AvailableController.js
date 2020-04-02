import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController {
  async index(req, res) {
    //As datas são passadas por timestamps e não são iguais as datas formatadas e sim são numeros

    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    //converte a data para numero
    const searchDate = Number(date);

    //Busca os agendamentos
    const appointments = await Appointment.findAll({
      //Onde
      where: {
        // o provider_id seja o passado pelas query Params
        provider_id: req.params.providerId,
        // e que não esteja cancelado
        canceled_at: null,
        //Entre as horas do dia searchDate
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    //Horário de atendimento
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];
    const avaiable = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          //Verifica se o horário qie foi passado está disponível em questão ocupado ou se já passou a hora
          //Como a função isAfter retorna true ou false retornarár um boleano
          isAfter(value, new Date()) &&
          //
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });
    return res.json(avaiable);
  }
}

export default new AvailableController();
