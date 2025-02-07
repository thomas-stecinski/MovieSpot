import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              // Simule les valeurs de configuration
              if (key === 'TMDB_API_KEY') return 'fake_api_key';
              if (key === 'TMDB_BASE_URL') return 'https://api.themoviedb.org/3';
              return null;
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // Mock de la méthode GET
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });
});
