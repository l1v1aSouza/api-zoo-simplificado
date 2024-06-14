import express from 'express';
import cors from 'cors';
import { DatabaseModel } from './model/DatabaseModel';
import AveController from './controller/AveController';
import HabitatController from './controller/HabitatController';
import AtracaoController from './controller/AtracaoController';

const aveController = new AveController('', 0, '', 0);

const habitatController = new HabitatController('');

const atracaoController = new AtracaoController('');

const server = express();
const port = 3000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Hello World!');
});


server.get('/aves', aveController.todos);
server.get('/habitats', habitatController.todos);
server.get('/atracoes', atracaoController.todos);

server.post('/novo/ave', aveController.novo);
server.post('/novo/habitat', habitatController.novo);
server.post('/novo/atracao', atracaoController.novo);

server.delete('/remover/animal', aveController.remover);
server.delete('/remover/habitat', habitatController.atualizar);
server.delete('/remover/atracao', atracaoController.remover);


server.put('/atualizar/animal', aveController.atualizar);
server.put('/atualizar/habitat', habitatController.atualizar);
server.put('/atualizar/atracao', atracaoController.atualizar);

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.info(`Servidor executando no endereço http://localhost:${port}/`);
        })
    } else {
        console.log(`Não foi possível conectar ao banco de dados`);
    }
})