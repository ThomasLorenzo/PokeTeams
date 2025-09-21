import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddPokemonDto {
    @ApiProperty({ description: 'Id ou nome do Pokémon na PokéAPI', example: 'pikachu' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    pokemonIdOuNome: string;
}
