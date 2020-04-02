import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  //Metodo usado para listar ou seja é um "get"
  async index(req, res) {
    const { page = 1 } = req.query;

    const apppointments = await Appointment.findAll({
      //Encontre um user_id que seja igual a req.userId
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      //Ordene por datas
      order: ['date'],
      //Mostre os atributos setados tanto no appointment controller quanto na tabela do banco de dados
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20, //limita a quantidade de agendamentos que aparecerá na página
      offset: (page - 1) * 20, // Pula um certo numero de agendamentos conforme a página
      //Inclua
      include: [
        {
          //Modelo de User
          model: User,
          //como provider
          as: 'provider',
          //e mostre apenas o ID e o nome
          attributes: ['id', 'name'],
          //e também inclua
          include: [
            {
              //Modelo File
              model: File,
              //como avatar
              as: 'avatar',
              //e mostre apenas id path e url
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(apppointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const { provider_id, date } = req.body;

    //Check if provider_id is a provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create apppointments with providers' });
    }
    //------------CHECK SELF REFERENCE AT CREATTING A APPOINTMENT-----------
    console.log(req.userId);
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: 'You cannot create a appointmento fou yourself' });
    }

    //------------CHECK FOR PAST DATES -------------------------------------------
    //parseISO converte o formato da hora em um bojeto json
    //realiza a operação sempre transformar a hora na hora inicial entao 14:12 vira 14:00  ou 16:59 évira 16:00
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      //Verifica se a hora está antes da data atual
      return res.status(400).json({ error: 'Past dates is not permited' });
    }
    //-----------CHECK DATE AVALABILITY----------------------------------------
    const checkAvalability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvalability) {
      //Se encontrou alguma coisa não está disponível para marcar
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /* -------NOTIFY APPOINTMENT PROVIDER */
    const user = await User.findByPk(req.userId);

    //Formatando a data para => ex: dia 02 de Fevereiro, às 15:00h e traduz para o PT-BR
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM',às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });
    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    //Verifica se o usuário que está cancelando é o dono do agendamento
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    //Veririca se o horário de cancelamento está com duas horas de antecedência
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }
    //Atualiza o campo canceled_at e salva no banco de dados
    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
