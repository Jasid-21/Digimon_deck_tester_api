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

  @SubscribeMessage('request_duel')
  async requestJoin(client: Socket, data: any) {
    console.log(data);
    const request = this.websocketService.getRoomOwner(data.room_id);
    if (!request) return request;

    const sockets = await this.server.fetchSockets();
    const socket = sockets.find((s) => s.id == request);
    if (!socket) return false;

    socket.emit('request_duel', {
      username: data.username,
      user_id: client.id,
    });
    return true;
  }

  @SubscribeMessage('cancel_request')
  async cancelRequest(client: Socket, data: string) {
    const owner_id = this.websocketService.getRoomOwner(data);
    if (!owner_id) return;

    const sockets = await this.server.fetchSockets();
    const socket = sockets.find((s) => s.id == owner_id);
    socket.emit('cancel_request', client.id);
  }
}
