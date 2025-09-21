import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainerResponseDto } from './dto/trainer-response.dto';
import { TeamsService } from '../teams/teams.service';
import { TeamResponseDto } from '../teams/dto/team-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Treinadores')
@Controller('trainers')
export class TrainersController {
    constructor(
        private readonly trainersService: TrainersService,
        private readonly teamsService: TeamsService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo treinador' })
    @ApiResponse({ status: 201, description: 'Treinador criado com sucesso', type: TrainerResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    create(@Body() dto: CreateTrainerDto): Promise<TrainerResponseDto> {
        return this.trainersService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os treinadores' })
    @ApiResponse({ status: 200, description: 'Lista de treinadores', type: [TrainerResponseDto] })
    @ApiResponse({ status: 404, description: 'Nenhum treinador encontrado' })
    findAll(): Promise<TrainerResponseDto[]> {
        return this.trainersService.findAll();
    }

    @Get(':id/teams')
    @ApiOperation({ summary: 'Listar times de um treinador' })
    @ApiParam({ name: 'id', description: 'Id do treinador' })
    @ApiResponse({ status: 200, description: 'Lista de times do treinador', type: [TeamResponseDto] })
    @ApiResponse({ status: 404, description: 'Treinador ou times não encontrados' })
    findAllByTrainer(@Param('id', ParseIntPipe) trainerId: number): Promise<TeamResponseDto[]> {
        return this.teamsService.findAllByTrainer(trainerId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar treinador por ID' })
    @ApiParam({ name: 'id', description: 'Id do treinador' })
    @ApiResponse({ status: 200, description: 'Treinador encontrado', type: TrainerResponseDto })
    @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
    find(@Param('id', ParseIntPipe) id: number): Promise<TrainerResponseDto> {
        return this.trainersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar treinador' })
    @ApiParam({ name: 'id', description: 'Id do treinador' })
    @ApiResponse({ status: 200, description: 'Treinador atualizado com sucesso', type: TrainerResponseDto })
    @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrainerDto): Promise<TrainerResponseDto> {
        return this.trainersService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover treinador' })
    @ApiParam({ name: 'id', description: 'Id do treinador' })
    @ApiResponse({ status: 200, description: 'Treinador removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
        return this.trainersService.remove(id);
    }
}
