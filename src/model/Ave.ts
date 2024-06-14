import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";
import { Habitat } from "./Habitat";

const database = new DatabaseModel().pool;

export class Ave extends Animal {

    private envergadura: number;

    constructor(_nome: string,
        _idade: number,
        _genero: string,
        _envergadura: number) {
        super(_nome, _idade, _genero);
        this.envergadura = _envergadura;
    }

    public getEnvergadura(): number {
        return this.envergadura;
    }

    public setEnvergadura(_envergadura: number): void {
        this.envergadura = _envergadura;
    }

    static async listarAves() {
        const listaDeAves: Array<Ave> = [];

        const querySelectAve = `SELECT * FROM animal`;

        try {
            const queryReturn = await database.query(querySelectAve);
            queryReturn.rows.forEach(ave => {
                listaDeAves.push(ave);
            });

            return listaDeAves;
        } catch (error) {
            console.log(`Erro no modelo\n${error}`);
            return "error, verifique os logs do servidor";
        }
    }

    static async cadastrarAve(ave: Ave, idHabitat: number): Promise<Boolean> {
        let insertResult = false;

        try {
            const queryInsertAnimal = `INSERT INTO animal (nomeAnimal, idadeAnimal, generoAnimal, envergadura) 
                                        VALUES 
                                        ('${ave.getNomeAnimal().toUpperCase()}', ${ave.getIdadeAnimal()}, '${ave.getGeneroAnimal().toUpperCase()}', ${ave.getEnvergadura()})
                                        RETURNING idAnimal;`;

            await database.query(queryInsertAnimal)
                .then(async (result) => {
                    const idAnimal = result.rows[0].idanimal;

                    if (!await Habitat.inserirAnimalHabitat(idAnimal, idHabitat)) {
                        console.log("Erro ao cadastrar animal no habitat");
                    };
                  
                    insertResult = true;
                });
                return insertResult;
        } catch (error) {
            console.log(error);
            return insertResult;
        }
    }

    static async removerAve(idAnimal: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryDeleteAnimalHabitat = `DELETE FROM animal_habitat WHERE idanimal=${idAnimal} `;

            await database.query(queryDeleteAnimalHabitat)
            .then(async (result) => {
                if(result.rowCount != 0) {
                    const queryDeleteAnimal = `DELETE FROM animal WHERE idanimal=${idAnimal}`;
                    await database.query(queryDeleteAnimal)
                    .then ((result) => {
                        if(result.rowCount != 0) {
                            queryResult = true;
                        }
                    })
                }
            })

            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }

    static async atualizarAve(ave: Ave, idAve: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryUpdateAve = `UPDATE animal SET
                                        nomeAnimal='${ave.getNomeAnimal().toUpperCase()}',
                                        idadeAnimal=${ave.getIdadeAnimal()},
                                        generoAnimal='${ave.getGeneroAnimal().toUpperCase()}',
                                        envergadura=${ave.getEnvergadura()}
                                    WHERE idAnimal=${idAve}`;
            await database.query(queryUpdateAve)
            .then ((result) => {
                if (result.rowCount !== 0) {
                    queryResult = true;
                }
            })
            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}