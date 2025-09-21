import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { PokeApiService } from './pokeapi.service';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokeApiService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PokeApiService>(PokeApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
