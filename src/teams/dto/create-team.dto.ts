import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({ description: 'Nome do time', example: 'Rocket' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome: string;

    @ApiProperty({ description: 'Id do treinador dono do time', example: 1 })
    @IsInt()
    treinadorId: number;
}