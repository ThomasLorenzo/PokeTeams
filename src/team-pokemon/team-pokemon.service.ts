import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { AddPokemonDto } from './dto/add-pokemon.dto';

const MAX_POKEMON_PER_TEAM = 6;

@Injectable()
export class TeamPokemonService {
    constructor(
        @InjectRepository(TeamPokemon) private readonly teamPokemonRepository: Repository<TeamPokemon>,
        @InjectRepository(Team) private readonly teamsRepository: Repository<Team>,
    ) {}

    async add(teamId: number, dto: AddPokemonDto) {
        // Verifica se o time para adicionar o pokémon existe
        const team = await this.teamsRepository.findOne({ where: { id: teamId }});

        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }    

        // Busca a quantidade pokémon em um time pelo id
        const countPokemon = await this.teamPokemonRepository.count({ 
            where: { time: { id: teamId }}
        });
        
        // Limita cada time a no máximo 6 pokémon
        if (countPokemon >= MAX_POKEMON_PER_TEAM) {
            throw new BadRequestException('Limite de 6 pokémon por time atingido');
        }

        const pokemonIdOrName = dto.pokemonIdOuNome.trim().toLowerCase();

        // TODO: Verificar se o pokémon existe com o nome ou id fornecido na PokéAPI
        // TODO: Se existir, pegar nome e id oficial e verificar se existe no time 

        // Verifica se já existe esse pokémon no time pelo id ou nome
        const existsPokemon = await this.teamPokemonRepository.findOne({
            where: { time: { id: teamId }, pokemonIdOuNome: pokemonIdOrName }
        });

        if (existsPokemon) {
            throw new BadRequestException('Esse pokémon já está no time');
        }

        const teamPokemon = this.teamPokemonRepository.create({ 
            time: team, pokemonIdOuNome: pokemonIdOrName  
        });

        return this.teamPokemonRepository.save(teamPokemon);
    }

    async list(teamId: number) {
        // Busca todos os pokémon do time pelo id
        const teamPokemon = await this.teamPokemonRepository.find({ where: { time: { id: teamId }} } );

        if (teamPokemon.length === 0) {
            throw new NotFoundException('Nenhum pokémon encontrado para o time informado');
        }

        return teamPokemon;
    }

    async remove(teamId: number, teamPokemonId: number) {
        // Verifica se o pokémon a remover está presente no time
        const teamPokemon = await this.teamPokemonRepository.findOne({
            where: { id: teamPokemonId, time: { id: teamId } },
        });

        if (!teamPokemon) {
            throw new NotFoundException('Pokémon não encontrado no time');
        }

        await this.teamPokemonRepository.remove(teamPokemon);

        return { deleted: true};
    }
}
