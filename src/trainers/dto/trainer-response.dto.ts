import { ApiProperty } from '@nestjs/swagger';

export class TrainerResponseDto {
  @ApiProperty({ description: 'Id único do treinador', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do treinador', example: 'Ash Ketchum' })
  nome: string;

  @ApiProperty({ description: 'Cidade de origem do treinador', required: false, example: 'Pallet Town' })
  cidadeOrigem?: string;
}
