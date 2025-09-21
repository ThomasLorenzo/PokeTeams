import { Test, TestingModule } from '@nestjs/testing';
import { TeamPokemonController } from './team-pokemon.controller';
import { TeamPokemonService } from './team-pokemon.service';

describe('TeamPokemonController', () => {
  let controller: TeamPokemonController;
  let teamPokemonService: TeamPokemonService;

  const mockTeamPokemonService = {
    add: jest.fn(),
    list: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPokemonController],
      providers: [
        { provide: TeamPokemonService, useValue: mockTeamPokemonService },
      ],
    }).compile();

    controller = module.get<TeamPokemonController>(TeamPokemonController);
    teamPokemonService = module.get<TeamPokemonService>(TeamPokemonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
