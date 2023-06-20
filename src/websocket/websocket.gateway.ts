import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { Player } from 'src/helpers/classes/player.class';
import { random_code } from 'src/helpers/functions/randomCode.function';
import { CardsStoreService } from 'src/cards-store/cards-store.service';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
})
export class WebsocketGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly cardsServ: CardsStoreService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    this.websocketService.removeRoomByClientId(client.id);
  }

  @SubscribeMessage('refresh_rooms')
  refreshRooms() {
    return this.websocketService.getRooms();
  }

  @SubscribeMessage('host_room')
  handleHosting(client: Socket, data: any) {
    const deck = this.cardsServ.getDeckFromCodes(data.code_deck.code_deck);
    const player = new Player(client.id, data.username, deck);
    const room_id = random_code();

    this.websocketService.addRoom(room_id, player);
    console.log(this.websocketService.getRooms());

    return { id: room_id, player: player.name };
  }

  @SubscribeMessage('stop_hosting')
  stopHosting(client: Socket) {
    this.websocketService.removeRoomByClientId(client.id);
    return true;
  }

  @SubscribeMessage('request_join')
  requestJoin(client: Socket, data: string) {
    const json = JSON.parse(data); // Username, room_id.
    const request = this.websocketService.requestJoin(json.room_id);

    if (!request) return request;
  }
}
