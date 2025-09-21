import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsInt()
    treinadorId: number;
}