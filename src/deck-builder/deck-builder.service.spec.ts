import { Test, TestingModule } from '@nestjs/testing';
import { DeckBuilderService } from './deck-builder.service';

describe('DeckBuilderService', () => {
  let service: DeckBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeckBuilderService],
    }).compile();

    service = module.get<DeckBuilderService>(DeckBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
