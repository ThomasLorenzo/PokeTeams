import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TeamPokemonService } from './team-pokemon.service';
import { AddPokemonDto } from './dto/add-pokemon.dto';
import { TeamPokemonResponseDto } from './dto/team-pokemon-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Pokémon dos times')
@Controller('teams/:teamId/pokemon')
export class TeamPokemonController {
    constructor(private readonly service: TeamPokemonService) {}

    @Post()
    @ApiOperation({ summary: 'Adicionar Pokémon ao time' })
    @ApiParam({ name: 'teamId', description: 'Id do time' })
    @ApiResponse({ status: 201, description: 'Pokémon adicionado com sucesso', type: TeamPokemonResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou limite de Pokémon atingido' })
    @ApiResponse({ status: 404, description: 'Time ou Pokémon não encontrado' })
    add(@Param('teamId', ParseIntPipe) teamId: number, @Body() dto: AddPokemonDto): Promise<TeamPokemonResponseDto> {
        return this.service.add(teamId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar Pokémon do time' })
    @ApiParam({ name: 'teamId', description: 'Id do time' })
    @ApiResponse({ status: 200, description: 'Lista de Pokémon do time', type: [TeamPokemonResponseDto] })
    @ApiResponse({ status: 404, description: 'Time ou Pokémon não encontrados' })
    list(@Param('teamId', ParseIntPipe) teamId: number): Promise<TeamPokemonResponseDto[]> {
        return this.service.list(teamId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover Pokémon do time' })
    @ApiParam({ name: 'teamId', description: 'Id do time' })
    @ApiParam({ name: 'id', description: 'Id da relação Pokémon e time' })
    @ApiResponse({ status: 200, description: 'Pokémon removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Pokémon não encontrado no time' })
    remove(@Param('teamId', ParseIntPipe) teamId: number, @Param('id') pokeTeamId: number): Promise<{ deleted: boolean }> {
        return this.service.remove(teamId, pokeTeamId);
    }
}
