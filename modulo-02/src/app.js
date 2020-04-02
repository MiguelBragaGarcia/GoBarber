import 'dotenv/config';

import express from 'express';
import { resolve } from 'path';
import Youch from 'youch'; //Trata erros
import * as Sentry from '@sentry/node'; // Monitora os erros
import 'express-async-errors';
import routes from './routes'; // Recebe as rotas ddo arquivo routes
import sentryConfig from './config/sentry';
import cors from 'cors';

import './database';

class App {
  constructor() {
    this.server = express(); // Isso daquie é a mesma coisa que chamar as funções através de uma variavel que afziamos antes
    Sentry.init(sentryConfig);
    this.middleWares();
    this.routes();
    this.exceptionHandler();
  }

  middleWares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors()); //Permite acesso ao nosso backend através de uma api
    this.server.use(express.json()); // FAla ao express que vamos trabalhar com arquivos JSON

    // O método estático envia arquivos que podem ser diretamentes lidos pelo navegado tipo html, css e imagens
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes); // Fala para usar a constante routes
    this.server.use(Sentry.Handlers.errorHandler());
  }
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors); //Erros de servidor são código 500
      }
      return res.status(500).json({ error: 'Internal server error' }); //Erros de servidor são código 500
    });
  }
}

export default new App().server;
