import { Test, TestingModule } from '@nestjs/testing';
import { CardsStoreService } from './cards-store.service';

describe('CardsStoreService', () => {
  let service: CardsStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsStoreService],
    }).compile();

    service = module.get<CardsStoreService>(CardsStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
