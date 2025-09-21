import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Times')
@Controller('teams')
export class TeamsController {
    constructor(private readonly service: TeamsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo time' })
    @ApiResponse({ status: 201, description: 'Time criado com sucesso', type: TeamResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
    create(@Body() dto: CreateTeamDto): Promise<TeamResponseDto> {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os times' })
    @ApiResponse({ status: 200, description: 'Lista de times', type: [TeamResponseDto] })
    @ApiResponse({ status: 404, description: 'Nenhum time encontrado' })
    findAll(): Promise<TeamResponseDto[]> {
        return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar time por id' })
    @ApiParam({ name: 'id', description: 'Id do time' })
    @ApiResponse({ status: 200, description: 'Time encontrado', type: TeamResponseDto })
    @ApiResponse({ status: 404, description: 'Time não encontrado' })
    find(@Param('id', ParseIntPipe) id: number): Promise<TeamResponseDto> {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar time' })
    @ApiParam({ name: 'id', description: 'Id do time' })
    @ApiResponse({ status: 200, description: 'Time atualizado com sucesso', type: TeamResponseDto })
    @ApiResponse({ status: 404, description: 'Time ou treinador não encontrado' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto): Promise<TeamResponseDto> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover time' })
    @ApiParam({ name: 'id', description: 'Id do time' })
    @ApiResponse({ status: 200, description: 'Time removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Time não encontrado' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
        return this.service.remove(id);
    }
}
