import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

describe('TrainersService', () => {
  let service: TrainersService;
  let repository: Repository<Trainer>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainersService,
        { provide: getRepositoryToken(Trainer), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TrainersService>(TrainersService);
    repository = module.get<Repository<Trainer>>(getRepositoryToken(Trainer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a trainer successfully', async () => {
      const createTrainerDto: CreateTrainerDto = {
        nome: 'Ash Ketchum',
        cidadeOrigem: 'Pallet Town',
      };

      const expectedTrainer = { id: 1, ...createTrainerDto };

      mockRepository.create.mockReturnValue(createTrainerDto);
      mockRepository.save.mockResolvedValue(expectedTrainer);

      const result = await service.create(createTrainerDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTrainerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createTrainerDto);
      expect(result).toEqual(expectedTrainer);
    });
  });

  describe('findAll', () => {
    it('should return all trainers', async () => {
      const trainers = [
        { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' },
        { id: 2, nome: 'Misty', cidadeOrigem: 'Cerulean City' },
      ];

      mockRepository.findAndCount.mockResolvedValue([trainers, 2]);

      const result = await service.findAll();

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual(trainers);
      expect(result.pagination.total).toBe(2);
    });

    it('should throw NotFoundException when no trainers found', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a trainer by id', async () => {
      const trainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      mockRepository.findOne.mockResolvedValue(trainer);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(trainer);
    });

    it('should throw NotFoundException when trainer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a trainer successfully', async () => {
      const existingTrainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      const updateDto: UpdateTrainerDto = { nome: 'Ash Ketchum Updated' };
      const updatedTrainer = { ...existingTrainer, ...updateDto };

      mockRepository.findOne.mockResolvedValue(existingTrainer);
      mockRepository.save.mockResolvedValue(updatedTrainer);

      const result = await service.update(1, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTrainer);
      expect(result).toEqual(updatedTrainer);
    });

    it('should throw NotFoundException when trainer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { nome: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a trainer successfully', async () => {
      const trainer = { id: 1, nome: 'Ash Ketchum', cidadeOrigem: 'Pallet Town' };
      mockRepository.findOne.mockResolvedValue(trainer);
      mockRepository.remove.mockResolvedValue(trainer);

      const result = await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(trainer);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException when trainer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
