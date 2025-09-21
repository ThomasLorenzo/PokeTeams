import { ApiProperty } from '@nestjs/swagger';
import { TrainerResponseDto } from '../../trainers/dto/trainer-response.dto';

export class TeamResponseDto {
  @ApiProperty({ description: 'Id único do time', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do time', example: 'Rocket' })
  nome: string;

  @ApiProperty({ description: 'Id do treinador dono do time', example: 1 })
  treinadorId: number;

  @ApiProperty({ description: 'Dados do treinador', type: TrainerResponseDto, required: false })
  treinador?: TrainerResponseDto;
}
