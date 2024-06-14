import { Habitat } from "../model/Habitat";
import { Request, Response } from 'express';

class HabitatController extends Habitat {

    public async todos(req: Request, res: Response): Promise<Response> {
        try {
            const habitats = await Habitat.listarHabitats();

            return res.status(200).json(habitats);

        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return res.status(400).json(`Erro ao acessar as informações, acesse os logs no servidor`);
        }
    }

    public async novo(req: Request, res: Response): Promise<Response> {
        try {
            const { nomeHabitat } = req.body;

            const novoHabitat = new Habitat(nomeHabitat);

            const result = await Habitat.cadastrarHabitat(novoHabitat);

            if (result) {
                return res.status(200).json('Habitat cadastrado com sucesso');
            } else {
                return res.status(400).json('Não foi possível cadastrar o habitat no banco de dados');
            }

        } catch (error) {
            console.log(`Erro ao cadastrar a ave: ${error}`);
            return res.status(400).json('Erro ao cadastrar habitat, consulte os logs no servidor');
        }
    }

    public async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idHabitat = parseInt(req.query.idHabitat as string);

            const resultado = await Habitat.removerHabitat(idHabitat);

            if (resultado) {
                return res.status(200).json('Habitat foi removida com sucesso');
            } else {
                return res.status(401).json('Erro ao remover habitat');
            }

        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return res.status(400).json("Erro ao remover habitat, consulte os logs no servidor");
        }
    }

    public async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { nomeHabitat } = req.body;
            
            const idHabitat = parseInt(req.query.idHabitat as string);

            const novoHabitat = new Habitat(nomeHabitat);

            const resultado = await Habitat.atualizarHabitat(novoHabitat, idHabitat);

            if (resultado) {
                return res.status(200).json('Habitat foi atualizado com sucesso');
            } else {
                return res.status(401).json('Erro ao atualizar habitat, consulte os logs no servidor');
            }
        
        } catch (error) {
            console.log(`Erro ao acessar modelo: ${error}`);
            return res.status(400).json("Erro ao atualizar habitat, consulte os logs no servidor");
        }
    }
}

export default HabitatController;