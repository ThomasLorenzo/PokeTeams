import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TeamPokemonService } from './team-pokemon.service';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { Team } from '../teams/entities/team.entity';
import { PokeApiService } from '../pokeapi/pokeapi.service';
import { AddPokemonDto } from './dto/add-pokemon.dto';

describe('TeamPokemonService', () => {
  let service: TeamPokemonService;
  let teamPokemonRepository: Repository<TeamPokemon>;
  let teamsRepository: Repository<Team>;
  let pokeApiService: PokeApiService;

  const mockTeamPokemonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockTeamsRepository = {
    findOne: jest.fn(),
  };

  const mockPokeApiService = {
    fetchDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamPokemonService,
        { provide: getRepositoryToken(TeamPokemon), useValue: mockTeamPokemonRepository },
        { provide: getRepositoryToken(Team), useValue: mockTeamsRepository },
        { provide: PokeApiService, useValue: mockPokeApiService },
      ],
    }).compile();

    service = module.get<TeamPokemonService>(TeamPokemonService);
    teamPokemonRepository = module.get<Repository<TeamPokemon>>(getRepositoryToken(TeamPokemon));
    teamsRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    pokeApiService = module.get<PokeApiService>(PokeApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add a pokemon to team successfully', async () => {
      const teamId = 1;
      const addPokemonDto: AddPokemonDto = { pokemonIdOuNome: 'pikachu' };
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };
      const pokemonDetails = {
        id: 25,
        nome: 'pikachu',
        imagem: 'https://example.com/pikachu.png',
        tipos: ['electric'],
        habilidades: ['static'],
      };
      const savedTeamPokemon = { id: 1, timeId: teamId, pokemonIdOuNome: 'pikachu' };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.count.mockResolvedValue(2);
      mockPokeApiService.fetchDetails.mockResolvedValue(pokemonDetails);
      mockTeamPokemonRepository.findOne.mockResolvedValue(null);
      mockTeamPokemonRepository.create.mockReturnValue({ time: team, pokemonIdOuNome: 'pikachu' });
      mockTeamPokemonRepository.save.mockResolvedValue(savedTeamPokemon);

      const result = await service.add(teamId, addPokemonDto);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
      expect(mockTeamPokemonRepository.count).toHaveBeenCalledWith({ where: { time: { id: teamId } } });
      expect(mockPokeApiService.fetchDetails).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual({
        id: savedTeamPokemon.id,
        timeId: teamId,
        pokemonIdOuNome: savedTeamPokemon.pokemonIdOuNome,
        pokemon: pokemonDetails,
      });
    });

    it('should throw NotFoundException when team not found', async () => {
      const teamId = 999;
      const addPokemonDto: AddPokemonDto = { pokemonIdOuNome: 'pikachu' };

      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.add(teamId, addPokemonDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when team is full', async () => {
      const teamId = 1;
      const addPokemonDto: AddPokemonDto = { pokemonIdOuNome: 'pikachu' };
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.count.mockResolvedValue(6);

      await expect(service.add(teamId, addPokemonDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when pokemon already exists in team', async () => {
      const teamId = 1;
      const addPokemonDto: AddPokemonDto = { pokemonIdOuNome: 'pikachu' };
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };
      const pokemonDetails = {
        id: 25,
        nome: 'pikachu',
        imagem: 'https://example.com/pikachu.png',
        tipos: ['electric'],
        habilidades: ['static'],
      };
      const existingPokemon = { id: 1, timeId: teamId, pokemonIdOuNome: 'pikachu' };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.count.mockResolvedValue(2);
      mockPokeApiService.fetchDetails.mockResolvedValue(pokemonDetails);
      mockTeamPokemonRepository.findOne.mockResolvedValue(existingPokemon);

      await expect(service.add(teamId, addPokemonDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('list', () => {
    it('should return pokemon list for team', async () => {
      const teamId = 1;
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };
      const teamPokemon = [
        { id: 1, timeId: teamId, pokemonIdOuNome: 'pikachu' },
        { id: 2, timeId: teamId, pokemonIdOuNome: 'charizard' },
      ];
      const pokemonDetails = {
        id: 25,
        nome: 'pikachu',
        imagem: 'https://example.com/pikachu.png',
        tipos: ['electric'],
        habilidades: ['static'],
      };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.find.mockResolvedValue(teamPokemon);
      mockPokeApiService.fetchDetails.mockResolvedValue(pokemonDetails);

      const result = await service.list(teamId);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
      expect(mockTeamPokemonRepository.find).toHaveBeenCalledWith({ where: { time: { id: teamId } } });
      expect(result).toHaveLength(2);
    });

    it('should throw NotFoundException when team not found', async () => {
      const teamId = 999;

      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.list(teamId)).rejects.toThrow(NotFoundException);
    });

    it('should return empty array when no pokemon in team', async () => {
      const teamId = 1;
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.find.mockResolvedValue([]);

      const result = await service.list(teamId);

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove pokemon from team successfully', async () => {
      const teamId = 1;
      const teamPokemonId = 1;
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };
      const teamPokemon = { id: 1, timeId: teamId, pokemonIdOuNome: 'pikachu' };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.findOne.mockResolvedValue(teamPokemon);
      mockTeamPokemonRepository.remove.mockResolvedValue(teamPokemon);

      const result = await service.remove(teamId, teamPokemonId);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
      expect(mockTeamPokemonRepository.findOne).toHaveBeenCalledWith({
        where: { id: teamPokemonId, time: { id: teamId } },
      });
      expect(mockTeamPokemonRepository.remove).toHaveBeenCalledWith(teamPokemon);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException when team not found', async () => {
      const teamId = 999;
      const teamPokemonId = 1;

      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(teamId, teamPokemonId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when pokemon not found in team', async () => {
      const teamId = 1;
      const teamPokemonId = 999;
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };

      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(teamId, teamPokemonId)).rejects.toThrow(NotFoundException);
    });
  });
});
