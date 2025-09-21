import { ApiProperty } from '@nestjs/swagger';
import { PokemonResponseDto } from './pokemon-response.dto';

export class TeamPokemonResponseDto {
  @ApiProperty({ description: 'Id da relação Pokémon e time', example: 1 })
  id: number;

  @ApiProperty({ description: 'Id do time', example: 1 })
  timeId: number;

  @ApiProperty({ description: 'Id ou nome do Pokémon na PokéAPI', example: 'pikachu' })
  pokemonIdOuNome: string;

  @ApiProperty({ description: 'Detalhes do Pokémon obtidos da PokéAPI', type: PokemonResponseDto })
  pokemon: PokemonResponseDto;
}
