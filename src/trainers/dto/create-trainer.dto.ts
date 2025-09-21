import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTrainerDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cidadeOrigem?: string;
}
