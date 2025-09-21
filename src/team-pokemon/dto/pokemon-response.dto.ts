import { ApiProperty } from '@nestjs/swagger';

export class PokemonResponseDto {
  @ApiProperty({ description: 'Id do Pokémon na PokéAPI', example: 25 })
  id: number;

  @ApiProperty({ description: 'Nome do Pokémon', example: 'pikachu' })
  nome: string;

  @ApiProperty({ 
    description: 'URL da imagem oficial do Pokémon',
    example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
  })
  imagem: string;

  @ApiProperty({ description: 'Lista de tipos do Pokémon', type: [String], example: ['electric']})
  tipos: string[];

  @ApiProperty({ description: 'Lista de habilidades do Pokémon', type: [String], example: ['static', 'lightning-rod'] })
  habilidades: string[];
}
