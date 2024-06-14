import { DatabaseModel } from "./DatabaseModel";
import { Habitat } from "./Habitat";

const database = new DatabaseModel().pool;

export class Atracao {
    private nomeAtracao: string;
    private habitatAtracao: Habitat = new Habitat("");

    constructor(_nome: string) {
        this.nomeAtracao = _nome;
    }

    public getNomeAtracao(): string {
        return this.nomeAtracao;
    }

    public setNomeAtracao(_nomeAtracao: string): void {
        this.nomeAtracao = _nomeAtracao;
    }

    public getatracaos(): Habitat {
        return this.habitatAtracao;
    }

    public setatracao(_habitat: Habitat): void {
        this.habitatAtracao = _habitat;
    }

    static async listarAtracoes(): Promise<Array<Atracao> | string> {
        const listaDeAtracoes: Array<Atracao> = [];
        const querySelectAtracao = `SELECT * FROM atracao;`;
        try {
            const queryReturn = await database.query(querySelectAtracao);
            queryReturn.rows.forEach(atracao => {
                listaDeAtracoes.push(atracao);
            });
            return listaDeAtracoes;

        } catch (error) {
            console.log(`Erro no modelo ${error}`);
            return "error, verifique os logs do servidor";
        }
    }

    static async cadastrarAtracao(atracao: Atracao): Promise<boolean>;
    static async cadastrarAtracao(atracao: Atracao, idHabitat: Habitat): Promise<boolean>;

    static async cadastrarAtracao(atracao: Atracao, idHabitat?: Habitat): Promise<Boolean> {
        let insertResult = false;
        let queryInsertAtracao: string;
        try {
            if(!idHabitat) {
                queryInsertAtracao = `INSERT INTO atracao (nomeatracao) 
                                            VALUES 
                                            ('${atracao.getNomeAtracao().toUpperCase()}');`;
            } else {
                queryInsertAtracao = `INSERT INTO atracao (nomeatracao, idhabitat) 
                                            VALUES 
                                            ('${atracao.getNomeAtracao().toUpperCase()}', ${idHabitat});`;
            }

            await database.query(queryInsertAtracao)
                .then((resultAtracao) => {
                    if (resultAtracao.rowCount != 0) {
                        insertResult = true;
                    }
                });
            
               return insertResult;

        } catch (error) {
            console.log(error, insertResult);
            return insertResult;
        }
    }

    static async removerAtracao(idAtracao: number): Promise<Boolean> {
        let queryResult = true;

        try {
            const queryDeleteAtracao = `DELETE FROM atracao WHERE idatracao=${idAtracao};`;
            
            await database.query(queryDeleteAtracao)
            .then(async (result) => {
                if(result.rowCount !== 0) {
                    queryResult = true;
                }
            })

            return queryResult;
        
        } catch (error) {
            console.log(`Erro: ${error}`);
            return queryResult;
        }
    }

    static async atualizarAtracao(atracao: Atracao, idAtracao: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryUpdateAtracao = `UPDATE atracao SET
                                        nomeatracao='${atracao.getNomeAtracao().toUpperCase()}'
                                        WHERE idatracao=${idAtracao};`;

            await database.query(queryUpdateAtracao)
            .then((result) => {
                if(result.rowCount !== 0) {
                    queryResult = true;
                }
            })
            return queryResult;

        } catch (error) {
            console.log(`Erro: ${error}`);
            return queryResult;
        }
    }
}