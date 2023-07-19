import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';
import { CardsStoreService } from 'src/cards-store/cards-store.service';

let socketServ: WebsocketService;
let server: Server;
export function setDuelServices(
  socket: WebsocketService,
  cards: CardsStoreService,
  serverInstance: Server,
) {
  socketServ = socket;
  server = serverInstance;
}

export function drawCard(client: Socket, data: any) {
  handleDuelChange(client, data, 'draw-card');
}

export function hatchDigimon(client: Socket, data: any) {
  handleDuelChange(client, data, 'hatch');
}

export function playDigimon(client: Socket, data: any) {
  handleDuelChange(client, data, 'play-digimon');
}

export function moveCard(client: Socket, data: any) {
  handleDuelChange(client, data, 'move-card');
}

async function handleDuelChange(
  client: Socket,
  data: { room_id: string; [key: string]: any },
  emitName: string,
) {
  const room_id = data.room_id;
  console.log(room_id);
  const resp: string[] | undefined = socketServ.getPlayers(room_id);
  if (!resp) return;

  const sockets = await server.fetchSockets();
  const ps = resp.map((p) => {
    return sockets.find((s) => s.id == p);
  });

  const toEmit = {
    player_id: client.id,
    ...data,
  };

  ps.forEach((p) => {
    p.emit(emitName, toEmit);
  });
}
