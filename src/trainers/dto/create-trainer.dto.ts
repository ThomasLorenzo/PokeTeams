import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTrainerDto {
    @ApiProperty({ description: 'Nome do treinador', example: 'Ash Ketchum' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome: string;

    @ApiProperty({ description: 'Cidade de origem do treinador', example: 'Pallet Town', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    cidadeOrigem?: string;
}
