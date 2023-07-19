import {
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { CardsStoreService } from 'src/cards-store/cards-store.service';
import { WsResponse } from 'src/helpers/interfaces/response.interface';
import {
  cancelRequest,
  fakeDuel,
  handleHosting,
  requestJoin,
  setRoomsServices,
  startDuel,
  stopHosting,
} from './rooms.gateway';

import {
  drawCard,
  hatchDigimon,
  moveCard,
  playDigimon,
  setDuelServices,
} from './duel.gateway';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
})
export class WebsocketGateway implements OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  constructor(
    private readonly socketServ: WebsocketService,
    private readonly cardsServ: CardsStoreService,
  ) {}
  afterInit() {
    setRoomsServices(this.socketServ, this.cardsServ, this.server);
    setDuelServices(this.socketServ, this.cardsServ, this.server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    this.socketServ.removeRoomByClientId(client.id);
  }

  // * Rooms listeners.
  @SubscribeMessage('refresh_rooms')
  refreshRooms() {
    return this.socketServ.getRooms();
  }
  @SubscribeMessage('host_room')
  handleHosting(client: Socket, data: any) {
    return handleHosting(client, data);
  }
  @SubscribeMessage('stop_hosting')
  async stopHosting(client: Socket, requests: string[]) {
    return stopHosting(client, requests);
  }
  @SubscribeMessage('request_duel')
  async requestJoin(client: Socket, data: any) {
    return requestJoin(client, data);
  }
  @SubscribeMessage('cancel_request')
  async cancelRequest(client: Socket, data: string) {
    return cancelRequest(client, data);
  }
  @SubscribeMessage('start_duel')
  async startDuel(client: Socket, data: any) {
    return startDuel(client, data);
  }
  @SubscribeMessage('fake_duel')
  fakeDuel(socket: Socket, data: any): WsResponse<boolean> {
    return fakeDuel(socket, data);
  }

  // *Duel state listeners.
  @SubscribeMessage('draw-card')
  async drawCard(client: Socket, data: { room_id: string }) {
    return drawCard(client, data);
  }
  @SubscribeMessage('hatch')
  hatchDigimon(client: Socket, data: { room_id: string }) {
    return hatchDigimon(client, data);
  }

  @SubscribeMessage('play-digimon')
  playDigimon(client: Socket, data: { room_id: string; card_id: string }) {
    return playDigimon(client, data);
  }

  @SubscribeMessage('move-card')
  moveCard(client: Socket, data: any) {
    return moveCard(client, data);
  }
}
