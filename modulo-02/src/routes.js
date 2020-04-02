import { Router } from 'express';

import multer from 'multer'; //importa a biblioteca que lida com upload de arquivos
import multerconfig from './config/multer'; // Importa as configurações do Multer para upload de arquivos

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerconfig); //Cria uma instância do multer com a configuração

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

//Usa como middleware a instância do multer e passa como parâmetro de quantidade de arquivos single ou 1 arquivo por vez.
//O campo file é de onde da requisição ele irá pegar o arquivo ou seja a requisição tem que possuir um campo file como se fosse o token fque é fornecido pelo header
routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

export default routes;
