import Bee from 'bee-queue';

import CancellationMail from '../app/jobs/CancellationMail';
import resdisConfig from '../config/redis';
//Isso é como se fosse o models dos banco de dados não relacional redis
const jobs = [CancellationMail];
class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    //Cria uma fila para cada elemento do vetor
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: resdisConfig,
        }),
        handle,
      };
    });
  }
  //Adiciona um novo job a fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }
  //Processa o que job conforme a configuração da fila correspondente
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }
  handleFailure(job, err) {
    console.log(`Queue: ${job.queue.name} : Failed`, err);
  }
}

export default new Queue();
