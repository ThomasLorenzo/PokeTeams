import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TeamsService } from '../teams/teams.service';

describe('TrainersController', () => {
  let controller: TrainersController;
  let trainersService: TrainersService;
  let teamsService: TeamsService;

  const mockTrainersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTeamsService = {
    findAllByTrainer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [
        { provide: TrainersService, useValue: mockTrainersService },
        { provide: TeamsService, useValue: mockTeamsService },
      ],
    }).compile();

    controller = module.get<TrainersController>(TrainersController);
    trainersService = module.get<TrainersService>(TrainersService);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
