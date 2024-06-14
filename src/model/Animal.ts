import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

export class Animal {
    private nomeAnimal: string;

    private idadeAnimal: number;

    private generoAnimal: string;

    constructor(_nome: string,
        _idade: number,
        _genero: string) {
        this.nomeAnimal = _nome;
        this.idadeAnimal = _idade;
        this.generoAnimal = _genero;
    }

    public getNomeAnimal(): string {
        return this.nomeAnimal;
    }

    public setNomeAnimal(nome: string): void {
        this.nomeAnimal = nome;
    }

    public getIdadeAnimal(): number {
        return this.idadeAnimal;
    }

    public setIdadeAnimal(idade: number): void {
        this.idadeAnimal = idade;
    }

    public getGeneroAnimal(): string {
        return this.generoAnimal;
    }

    public setGeneroAnimal(genero: string): void {
        this.generoAnimal = genero;
    }
}