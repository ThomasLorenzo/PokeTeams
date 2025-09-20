import { Test, TestingModule } from '@nestjs/testing';
import { PokeApiService } from './pokeapi.service';

describe('PokeApiService', () => {
  let service: PokeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeApiService],
    }).compile();

    service = module.get<PokeApiService>(PokeApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
