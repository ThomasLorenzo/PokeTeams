import { Test, TestingModule } from '@nestjs/testing';
import { TeamPokemonService } from './team-pokemon.service';

describe('TeamPokemonService', () => {
  let service: TeamPokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamPokemonService],
    }).compile();

    service = module.get<TeamPokemonService>(TeamPokemonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
