import { Server, Socket } from 'socket.io';
import { ErrMsg } from 'src/helpers/classes/errMsg.class';
import { Player } from 'src/helpers/classes/player.class';
import { random_code } from 'src/helpers/functions/randomCode.function';
import { WebsocketService } from './websocket.service';
import { CardsStoreService } from 'src/cards-store/cards-store.service';
import { RawCard } from 'src/helpers/interfaces/raw-card.interface';

let socketServ: WebsocketService;
let cardsServ: CardsStoreService;
let server: Server;
export function setRoomsServices(
  socket: WebsocketService,
  cards: CardsStoreService,
  serverInstance: Server,
) {
  socketServ = socket;
  cardsServ = cards;
  server = serverInstance;
}

export function handleHosting(client: Socket, data: any) {
  const deck = cardsServ.getDeckFromCodes(data.code_deck.code_deck);
  if (deck instanceof ErrMsg) {
    return {
      resp: null,
      errMsg: deck,
    };
  }

  const player = new Player(client.id, data.username, deck);
  const room_id = random_code();

  socketServ.addRoom(room_id, player);
  console.log(socketServ.getRooms());

  return {
    resp: { id: room_id, player: player.name },
  };
}

export async function stopHosting(client: Socket, requests: string[]) {
  socketServ.removeRoomByClientId(client.id);

  const sockets = await server.fetchSockets();
  for (const socket of sockets) {
    if (requests.some((r) => r == socket.id)) {
      socket.emit('dismis_request');
    }
  }
  return {
    resp: true,
  };
}

export async function requestJoin(client: Socket, data: any) {
  console.log(data);

  const code_deck = data.code_deck;
  if (!code_deck) {
    return {
      resp: null,
      errMsg: new ErrMsg('You need to provide a deck to continue'),
    };
  }

  const validation = cardsServ.getDeckFromCodes(code_deck);
  if (validation instanceof ErrMsg) {
    return {
      resp: null,
      errMsg: validation,
    };
  }

  const request = socketServ.getRoomOwner(data.room_id);
  if (!request) {
    return {
      resp: null,
      errMsg: new ErrMsg('Room not found...'),
    };
  }

  const sockets = await server.fetchSockets();
  const socket = sockets.find((s) => s.id == request);
  if (!socket) {
    return {
      resp: null,
      errMsg: new ErrMsg(
        'Error getting the room owner. Please, try another room',
      ),
    };
  }

  socket.emit('request_duel', {
    username: data.username,
    user_id: client.id,
    deck: validation,
  });
  return { resp: true };
}

export async function cancelRequest(client: Socket, data: any) {
  const owner_id = socketServ.getRoomOwner(data);
  if (!owner_id) {
    return { resp: null, errMsg: new ErrMsg('Room not found...') };
  }

  const sockets = await server.fetchSockets();
  const socket = sockets.find((s) => s.id == owner_id);
  socket.emit('cancel_request', client.id);

  return { resp: true };
}

export async function startDuel(client: Socket, data: any) {
  console.log(data);
  const op_id: string = data.op_id;
  const op_name: string = data.op_name;
  const op_deck: RawCard[] = data.op_deck;
  const room_id: string = data.room_id;

  const player = new Player(op_id, op_name, op_deck);
  socketServ.addPlayer(room_id, player);
  const players = socketServ.startDuel(room_id);

  if (!players) {
    return {
      resp: null,
      errMsg: new ErrMsg('Error starting duel...'),
    };
  }

  const sockets = await server.fetchSockets();
  const socket = sockets.find((s) => s.id == op_id);
  socket.emit('start_duel', { players, room_id });
  client.emit('start_duel', { players, room_id });
}

export function fakeDuel(socket: Socket, data: any) {
  const room_id = random_code(10);
  const raw_deck = cardsServ.getDeckFromCodes(data.code_deck);
  if (raw_deck instanceof ErrMsg) {
    return {
      resp: false,
      errMsg: raw_deck,
    };
  }

  const player = new Player(socket.id, 'fake player', raw_deck);
  socketServ.addRoom(room_id, player);

  const players = socketServ.startDuel(room_id);
  socket.emit('start_duel', { players, room_id });
}
