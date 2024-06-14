import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

export class Habitat {

    private nomeHabitat: string;

    private listaAnimais: Array<Animal> = [];

    constructor(_nome: string) {
        this.nomeHabitat = _nome;
    }

    public getNomeHabitat(): string {
        return this.nomeHabitat;
    }

    public setNomeHabitat(_nome: string): void {
        this.nomeHabitat = _nome;
    }

    public getListaAnimais(): Array<Animal> {
        return this.listaAnimais;
    }

    public setListaAnimais(_listaAnimais: Array<Animal>): void {
        this.listaAnimais = _listaAnimais;
    }

    static async listarHabitats(): Promise<any> {
        const listaDeHabitats: Array<Habitat> = [];

        const querySelectHabitat = `SELECT * FROM habitat`;

        try {
            const queryReturn = await database.query(querySelectHabitat);
            queryReturn.rows.forEach(habitat => {
                listaDeHabitats.push(habitat);
            });

            return listaDeHabitats;
        } catch (error) {
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    static async cadastrarHabitat(habitat: Habitat): Promise<any> {
        let insertResult = false;
        try {
            const queryInsertHabitat = `INSERT INTO habitat (nomehabitat) 
                                        VALUES 
                                        ('${habitat.getNomeHabitat().toUpperCase()}');`;
            await database.query(queryInsertHabitat)
                .then((resultHabitat) => {
                    if (resultHabitat.rowCount != 0) {
                        insertResult = true;
                    }
                })
            return insertResult;
        } catch (error) {
            console.log(error);

            return insertResult;
        }
    }

    static async exibirAnimaisPorHabitat(idHabitat: number): Promise<any> {
        try {
            const querySelectHabitatsComAnimais = `
                SELECT
                    h.idHabitat,
                    h.nomeHabitat,
                    a.idAnimal,
                    a.nomeAnimal,
                    a.idadeAnimal,
                    a.generoAnimal
                FROM
                    Habitat h
                LEFT JOIN
                    Animal_Habitat ah ON h.idHabitat = ah.idHabitat
                LEFT JOIN
                    Animal a ON ah.idAnimal = a.idAnimal
                WHERE 
                    h.idHabitat = ${idHabitat} AND ah.idAnimal IS NOT NULL
                ORDER BY
                    h.idHabitat, a.idAnimal;
            `;

            const queryReturn = await database.query(querySelectHabitatsComAnimais);
            return queryReturn.rows;
        } catch (error) {
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    static async inserirAnimalHabitat(idAnimal: number, idHabitat: number): Promise<any> {
        let insertResult = false;
        try {
            const queryInsertAnimalHabitat = `INSERT INTO Animal_Habitat(idAnimal, idHabitat)
                                                VALUES
                                                (${idAnimal}, ${idHabitat});`;

            await database.query(queryInsertAnimalHabitat)
                .then((result) => {
                    if (result.rowCount != 0) {
                        insertResult = true;
                    }
                });
            return insertResult;
        } catch (error) {
            console.log(error);

            return insertResult;
        }
    }

    static async removerHabitat(idHabitat: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryDeleteAnimalHabitat = `DELETE FROM animal_habitat WHERE idhabitat=${idHabitat}`;

            await database.query(queryDeleteAnimalHabitat)
                .then(async (result) => {
                    if (result.rowCount != 0) {
                        const queryDeleteHabitatAtracao =`DELETE FROM atracao WHERE idhabitat=${idHabitat}`;

                        await database.query(queryDeleteHabitatAtracao)
                            .then(async (result) => {
                                if (result.rowCount != 0) {
                                    const queryDeleteHabitat = `DELETE FROM habitat WHERE idhabitat=${idHabitat}`;
                                    await database.query(queryDeleteHabitat)
                                        .then((result) => {
                                            if (result.rowCount != 0) {
                                                queryResult = true;
                                            }
                                        })
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

    static async atualizarHabitat(habitat: Habitat, idHabitat: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryUpdateHabitat = `UPDATE habitat SET
                                            nomeHabitat='${habitat.getNomeHabitat().toUpperCase()}'
                                        WHERE idHabitat=${idHabitat}`;
            await database.query(queryUpdateHabitat)
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