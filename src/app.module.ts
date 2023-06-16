import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsStoreService } from './cards-store/cards-store.service';
import { HttpModule } from '@nestjs/axios';
import { DeckBuilderModule } from './deck-builder/deck-builder.module';
import { CardsStoreModule } from './cards-store/cards-store.module';

@Module({
  imports: [HttpModule, DeckBuilderModule, CardsStoreModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly cards: CardsStoreService) {}

  onModuleInit() {
    this.cards.setCards();
  }
}
