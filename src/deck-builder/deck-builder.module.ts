import { Module } from '@nestjs/common';
import { DeckBuilderService } from './deck-builder.service';
import { DeckBuilderController } from './deck-builder.controller';
import { CardsStoreModule } from 'src/cards-store/cards-store.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CardsStoreModule, HttpModule],
  controllers: [DeckBuilderController],
  providers: [DeckBuilderService],
  exports: [],
})
export class DeckBuilderModule {}
