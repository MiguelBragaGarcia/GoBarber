import File from '../models/File';

class FileController {
  //Quando a função multer é chamada ela gera um req.file
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
