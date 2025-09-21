import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { Trainer } from '../trainers/entities/trainer.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamsRepository: Repository<Team>;
  let trainersRepository: Repository<Trainer>;

  const mockTeamsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockTrainersRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: mockTeamsRepository },
        { provide: getRepositoryToken(Trainer), useValue: mockTrainersRepository},
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamsRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    trainersRepository = module.get<Repository<Trainer>>(getRepositoryToken(Trainer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a team successfully', async () => {
      const createTeamDto: CreateTeamDto = {
        nome: 'Time Principal',
        treinadorId: 1,
      };

      const trainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      const expectedTeam = {
        id: 1,
        ...createTeamDto,
        treinador: trainer,
      };

      mockTrainersRepository.findOne.mockResolvedValue(trainer);
      mockTeamsRepository.create.mockReturnValue(createTeamDto);
      mockTeamsRepository.save.mockResolvedValue(expectedTeam);

      const result = await service.create(createTeamDto);

      expect(mockTrainersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTeamsRepository.create).toHaveBeenCalledWith({
        nome: createTeamDto.nome,
        treinadorId: createTeamDto.treinadorId,
        treinador: trainer,
      });
      expect(result).toEqual(expectedTeam);
    });

    it('should throw NotFoundException when trainer not found', async () => {
      const createTeamDto: CreateTeamDto = {
        nome: 'Time Principal',
        treinadorId: 999,
      };

      mockTrainersRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createTeamDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      const teams = [
        { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } },
        { id: 2, nome: 'Time Secundário', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } },
      ];

      mockTeamsRepository.findAndCount.mockResolvedValue([teams, 2]);

      const result = await service.findAll();

      expect(mockTeamsRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['treinador'],
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(teams);
      expect(result.pagination.total).toBe(2);
    });

    it('should throw NotFoundException when no teams found', async () => {
      mockTeamsRepository.findAndCount.mockResolvedValue([[], 0]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByTrainer', () => {
    it('should return teams by trainer', async () => {
      const trainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      const teams = [
        { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: trainer },
      ];

      mockTrainersRepository.findOne.mockResolvedValue(trainer);
      mockTeamsRepository.find.mockResolvedValue(teams);

      const result = await service.findAllByTrainer(1);

      expect(mockTrainersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTeamsRepository.find).toHaveBeenCalledWith({
        where: { treinador: { id: 1 } },
        relations: ['treinador'],
      });
      expect(result).toEqual(teams);
    });

    it('should throw NotFoundException when trainer not found', async () => {
      mockTrainersRepository.findOne.mockResolvedValue(null);

      await expect(service.findAllByTrainer(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when no teams found for trainer', async () => {
      const trainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      
      mockTrainersRepository.findOne.mockResolvedValue(trainer);
      mockTeamsRepository.find.mockResolvedValue([]);

      await expect(service.findAllByTrainer(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a team by id', async () => {
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } };
      mockTeamsRepository.findOne.mockResolvedValue(team);

      const result = await service.findOne(1);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['treinador'] });
      expect(result).toEqual(team);
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a team successfully', async () => {
      const existingTeam = { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } };
      const updateDto: UpdateTeamDto = { nome: 'Time Atualizado' };
      const updatedTeam = { ...existingTeam, ...updateDto };

      mockTeamsRepository.findOne.mockResolvedValue(existingTeam);
      mockTeamsRepository.save.mockResolvedValue(updatedTeam);

      const result = await service.update(1, updateDto);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['treinador'] });
      expect(mockTeamsRepository.save).toHaveBeenCalledWith(updatedTeam);
      expect(result).toEqual(updatedTeam);
    });

    it('should update trainer when treinadorId is provided', async () => {
      const existingTeam = { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } };
      const newTrainer = { id: 2, nome: 'Misty', cidadeOrigem: 'Cerulean City' };
      const updateDto: UpdateTeamDto = { treinadorId: 2 };
      const updatedTeam = { ...existingTeam, treinadorId: 2, treinador: newTrainer };

      mockTeamsRepository.findOne.mockResolvedValue(existingTeam);
      mockTrainersRepository.findOne.mockResolvedValue(newTrainer);
      mockTeamsRepository.save.mockResolvedValue(updatedTeam);

      const result = await service.update(1, updateDto);

      expect(mockTrainersRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result).toEqual(updatedTeam);
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { nome: 'Test' })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when new trainer not found', async () => {
      const existingTeam = { id: 1, nome: 'Time Principal', treinadorId: 1, treinador: { id: 1, nome: 'Ash' } };
      const updateDto: UpdateTeamDto = { treinadorId: 999 };

      mockTeamsRepository.findOne.mockResolvedValue(existingTeam);
      mockTrainersRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a team successfully', async () => {
      const team = { id: 1, nome: 'Time Principal', treinadorId: 1 };
      mockTeamsRepository.findOne.mockResolvedValue(team);
      mockTeamsRepository.remove.mockResolvedValue(team);

      const result = await service.remove(1);

      expect(mockTeamsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTeamsRepository.remove).toHaveBeenCalledWith(team);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
