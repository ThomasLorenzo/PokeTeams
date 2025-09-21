import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';
import { AddPokemonDto } from './dto/add-pokemon.dto';
import { PokeApiService } from '../pokeapi/pokeapi.service';
import { TeamPokemonResponseDto } from './dto/team-pokemon-response.dto';

const MAX_POKEMON_PER_TEAM = 6;

@Injectable()
export class TeamPokemonService {
    constructor(
        @InjectRepository(TeamPokemon) private readonly teamPokemonRepository: Repository<TeamPokemon>,
        @InjectRepository(Team) private readonly teamsRepository: Repository<Team>,
        private readonly pokeApi: PokeApiService
    ) {}

    async add(teamId: number, dto: AddPokemonDto): Promise<TeamPokemonResponseDto> {
        // Verifica se o time existe
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

        const normalizedIdOrName = dto.pokemonIdOuNome.trim().toLowerCase();

        // Checa se o pokémon com nome ou id informado existe
        const pokemonDetails = await this.pokeApi.fetchDetails(normalizedIdOrName);

        // Verifica se já existe esse pokémon no time pelo id ou nome
        const existsPokemon = await this.teamPokemonRepository.findOne({
            where: [
                { time: { id: teamId }, pokemonIdOuNome: String(pokemonDetails.id) },
                { time: { id: teamId }, pokemonIdOuNome: pokemonDetails.nome },
            ]
        });

        if (existsPokemon) {
            throw new BadRequestException('Esse pokémon já está no time');
        }

        const teamPokemon = this.teamPokemonRepository.create({ 
            time: team, pokemonIdOuNome: normalizedIdOrName  
        });

        const savedTeamPokemon = await this.teamPokemonRepository.save(teamPokemon);

        return {
            id: savedTeamPokemon.id,
            timeId: teamId,
            pokemonIdOuNome: savedTeamPokemon.pokemonIdOuNome,
            pokemon: pokemonDetails,
        };
    }

    async list(teamId: number): Promise<TeamPokemonResponseDto[]> {
        // Verifica se o time existe
        const team = await this.teamsRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }

        // Busca todos os pokémon do time pelo id
        const teamPokemon = await this.teamPokemonRepository.find({ where: { time: { id: teamId }} } );

        if (teamPokemon.length === 0) {
            throw new NotFoundException('Nenhum pokémon encontrado para o time informado');
        }

        // Para cada pokémon no time, busca detalhes dele na PokéAPI e adiciona ao retorno
        return Promise.all(
            teamPokemon.map(async (teamPokemonEntry): Promise<TeamPokemonResponseDto> => {
                const details = await this.pokeApi.fetchDetails(teamPokemonEntry.pokemonIdOuNome);
                return {
                    id: teamPokemonEntry.id,
                    timeId: teamId,
                    pokemonIdOuNome: teamPokemonEntry.pokemonIdOuNome,
                    pokemon: details,
                };
            }),
        );
    }

    async remove(teamId: number, teamPokemonId: number): Promise<{ deleted: boolean }> {
        // Verifica se o time existe
        const team = await this.teamsRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }

        // Verifica se o pokémon a remover está presente no time
        const teamPokemon = await this.teamPokemonRepository.findOne({
            where: { id: teamPokemonId, time: { id: teamId } },
        });

        if (!teamPokemon) {
            throw new NotFoundException('Pokémon não encontrado no time');
        }

        await this.teamPokemonRepository.remove(teamPokemon);

        return { deleted: true };
    }
}
