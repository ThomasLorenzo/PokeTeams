import { IsNotEmpty, IsString } from "class-validator";

export class AddPokemonDto {
    @IsString()
    @IsNotEmpty()
    pokemonIdOuNome: string;
}
