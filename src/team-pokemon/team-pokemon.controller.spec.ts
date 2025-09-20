import { Test, TestingModule } from '@nestjs/testing';
import { TeamPokemonController } from './team-pokemon.controller';

describe('TeamPokemonController', () => {
  let controller: TeamPokemonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPokemonController],
    }).compile();

    controller = module.get<TeamPokemonController>(TeamPokemonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
