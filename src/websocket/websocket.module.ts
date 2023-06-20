import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { CardsStoreModule } from 'src/cards-store/cards-store.module';

@Module({
  imports: [CardsStoreModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
