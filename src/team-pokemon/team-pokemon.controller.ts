import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TeamPokemonService } from './team-pokemon.service';
import { AddPokemonDto } from './dto/add-pokemon.dto';

@Controller('teams/:teamId/pokemons')
export class TeamPokemonController {
    constructor(private readonly service: TeamPokemonService) {}

    @Post()
    add(@Param('teamId', ParseIntPipe) teamId: number, @Body() dto: AddPokemonDto) {
        return this.service.add(teamId, dto);
    }

    @Get()
    list(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.service.list(teamId);
    }

    @Delete(':id')
    remove(@Param('teamId', ParseIntPipe) teamId: number, @Param('id') pokeTeamId: number) {
        return this.service.remove(teamId, pokeTeamId);
    }
}
