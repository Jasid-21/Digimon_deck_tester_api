import { Module } from '@nestjs/common';
import { CardsStoreService } from './cards-store.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CardsStoreService],
  exports: [CardsStoreService],
})
export class CardsStoreModule {}
