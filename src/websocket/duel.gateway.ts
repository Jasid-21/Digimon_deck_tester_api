import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';
import { CardsStoreService } from 'src/cards-store/cards-store.service';
import { ErrMsg } from 'src/helpers/classes/errMsg.class';

let socketServ: WebsocketService;
let cardsServ: CardsStoreService;
let server: Server;
export function setDuelServices(
  socket: WebsocketService,
  cards: CardsStoreService,
  serverInstance: Server,
) {
  socketServ = socket;
  cardsServ = cards;
  server = serverInstance;
}

export function drawCard(client: Socket, data: any) {
  handleDuelChange(
    client,
    data,
    socketServ.drawCard.bind(socketServ),
    'draw-card',
  );
}

export function hatchDigimon(client: Socket, data: any) {
  handleDuelChange(
    client,
    data,
    socketServ.hatchDigimon.bind(socketServ),
    'hatch',
  );
}

async function handleDuelChange(
  client: Socket,
  data: { room_id: string },
  // eslint-disable-next-line @typescript-eslint/ban-types
  serviceAction: Function,
  emitName: string,
) {
  const room_id = data.room_id;
  console.log(room_id);
  const resp = serviceAction(room_id, client.id);
  if (resp instanceof ErrMsg) return resp;

  const sockets = await server.fetchSockets();
  const ps = resp.players.map((p) => {
    return sockets.find((s) => s.id == p);
  });

  const toEmit = {
    player_id: client.id,
    state: resp.state,
  };

  ps.forEach((p) => {
    p.emit(emitName, toEmit);
  });
}
