import { Test, TestingModule } from '@nestjs/testing';
import { DeckBuilderController } from './deck-builder.controller';
import { DeckBuilderService } from './deck-builder.service';

describe('DeckBuilderController', () => {
  let controller: DeckBuilderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeckBuilderController],
      providers: [DeckBuilderService],
    }).compile();

    controller = module.get<DeckBuilderController>(DeckBuilderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
