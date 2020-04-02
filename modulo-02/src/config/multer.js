import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';
//Isso é um objeto de configuração
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        //Se der erro retorna o erro para a call back de filename
        if (err) return cb(err);

        //Se não der erro retorna a imagem
        //CALLBACK sempre retornam como primeiro parâmetro o erro e como não temo erro colocamos null como erro
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
