import { Injectable } from '@nestjs/common';
import { CreateDeckBuilderDto } from './dto/create-deck-builder.dto';
import { CardsStoreService } from 'src/cards-store/cards-store.service';

@Injectable()
export class DeckBuilderService {
  constructor(private readonly cards: CardsStoreService) {}

  create(createDeckBuilderDto: CreateDeckBuilderDto) {
    return 'This action adds a new deckBuilder';
  }

  findAll() {
    return this.cards.getCards();
  }
}
