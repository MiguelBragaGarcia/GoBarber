import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token not provided',
    });
  }

  //usando a forma desestruturada de um array eliminando a primeira posição do vetor e usando somente a segunta [, token]
  const [, token] = authHeader.split(' '); // Como o retorno é o tipo enviado e depois o valor do token presiamos separar um do outro com o splite tranformando em um vetor de 2 posições
  //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTgwNzYzNzQzLCJleHAiOjE1ODEzNjg1NDN9.6HrVCeDxNUzWQNWopd_5rkmbyRpozZR5yuP6ktrBo_8

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id; //Cria uma variável dentro de requisição req que pode ser acessada externamente
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Token invalid',
    });
  }

  return next();
};
