import { Atracao } from "../model/Atracao";
import { Request, Response } from "express";


class AtracaoController extends Atracao {

    public async todos(req: Request, res: Response): Promise<Response> {
        try {
            const atracoes = await Atracao.listarAtracoes();

            return res.status(200).json(atracoes);

        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return res.status(400).json(`Erro ao acessar as informações, consulte os logs no servidor`);
        }
    }

    public async novo(req: Request, res: Response): Promise<Response> {
        try {
            const { nomeAtracao, idHabitat } = req.body;

            const novaAtracao = new Atracao(nomeAtracao);

            let result = false;

            if (idHabitat != undefined) {
                result = await Atracao.cadastrarAtracao(novaAtracao, idHabitat);
            } else {
                result = await Atracao.cadastrarAtracao(novaAtracao);
            }

            if (result) {
                return res.status(200).json('Atração cadastrado com sucesso');
            } else {
                return res.status(400).json('Não foi possível cadastrar a atração no banco de dados');
            }

        } catch (error) {
            console.log(`Erro ao cadastrar a ave: ${error}`);
            return res.status(400).json('Não foi possível cadastrar a atração no banco de dados');
        }
    }

    public async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idAtracao = parseInt(req.query.idAtracao as string);

            const resultado = await Atracao.removerAtracao(idAtracao);

            if (resultado) {
                return res.status(200).json('Atração foi removida com sucesso');
            } else {
                return res.status(401).json('Erro ao remover atração');
            }

        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return res.status(400).json("Erro ao remover atração, consulte os logs no servidor");
        }
    }

    public async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const { nomeAtracao } = req.body;
            
            const idAtracao = parseInt(req.query.idAtracao as string);

            const novaAtracao = new Atracao(nomeAtracao);

            const resultado = await Atracao.atualizarAtracao(novaAtracao, idAtracao);

            if (resultado) {
                return res.status(200).json('Atração foi alterada com sucesso');
            } else {
                return res.status(401).json('Erro ao alterar atração');
            }
        
        } catch (error) {
            console.log(`Erro ao acessar modelo: ${error}`);
            return res.status(400).json("Erro ao atualizar atração, consulte os logs no servidor");
        }
    }
}

export default AtracaoController;