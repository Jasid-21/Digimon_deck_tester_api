import { Injectable } from '@nestjs/common';
import { Room } from 'src/helpers/classes/Room.class';
import { Card } from 'src/helpers/classes/card.class';
import { ErrMsg } from 'src/helpers/classes/errMsg.class';
import { Player } from 'src/helpers/classes/player.class';
import { printError } from 'src/helpers/functions/printError.function';
import { random_code } from 'src/helpers/functions/randomCode.function';
import { shuffleArray } from 'src/helpers/functions/shuffleArray';
import { toPlayableCards } from 'src/helpers/functions/toPlayableCards.function';
import { BoardState } from 'src/helpers/interfaces/board_state.interface';
import { WsResponse } from 'src/helpers/interfaces/response.interface';
import { PlacesType } from 'src/helpers/interfaces/types';

export interface DuelResponse {
  state: BoardState | null;
  players: string[] | null;
  errMsg?: ErrMsg;
}

@Injectable()
export class WebsocketService {
  rooms: Room[] = [];

  addRoom(id: string, player: Player) {
    const room = new Room(id);
    room.addPlayer(player);
    this.rooms.push(room);
  }

  addPlayer(room_id: string, player: Player) {
    const room = this.rooms.find((r) => r.id == room_id);
    room.addPlayer(player);
  }

  startDuel(room_id: string) {
    const room = this.rooms.find((r) => r.id == room_id);
    if (!room) return new printError('Room not found');

    room.players.forEach((p) => {
      const deck = toPlayableCards(p.raw_deck, p.id);
      const base_main = deck.filter((c) => c.type != 'Digi-Egg');
      const base_digiEggs = deck.filter((c) => c.type == 'Digi-Egg');

      const main: Card[] = shuffleArray(base_main);
      const digiEggs: Card[] = shuffleArray(base_digiEggs);

      main.forEach((c) => (c.place = 'deck'));
      digiEggs.forEach((c) => (c.place = 'hatch_down'));
      const security = main.splice(0, 5);
      security.forEach((c) => (c.place = 'security'));

      p.cards.push(...main);
      p.cards.push(...digiEggs);
      p.cards.push(...security);
    });
    room.active = true;

    const players = room.players.map((p) => {
      return {
        player_id: p.id,
        deck: p.cards.filter((c) => c.place == 'deck'),
        hatch_down: p.cards.filter((c) => c.place == 'hatch_down'),
        security: p.cards.filter((c) => c.place == 'security'),
      };
    });

    return players;
  }

  removeRoomByClientId(client_id: string) {
    const index = this.rooms.findIndex((r) => {
      return r.players.some((p) => p.id == client_id);
    });

    if (index < 0) return;
    this.rooms.splice(index, 1);
  }

  getRooms() {
    return this.rooms.map((r) => ({
      id: r.id,
      players: r.players.map((p) => p.name),
    }));
  }

  getRoomOwner(room_id: string): boolean | string {
    const room = this.rooms.find((r) => r.id == room_id);

    if (!room) return false;
    if (room.players.length >= 2) return false;
    return room.players[0].id;
  }

  drawCard(room_id: string, player_id: string): DuelResponse {
    const resp = this.handleDuelAction(room_id, player_id, 'drawCard');
    return resp;
  }

  hatchDigimon(room_id: string, player_id: string): DuelResponse {
    const resp = this.handleDuelAction(room_id, player_id, 'hatchDigimon');
    return resp;
  }

  moveCard(
    room_id: string,
    player_id: string,
    card_id: string,
    placeF: PlacesType,
    digimon_id?: string,
  ): DuelResponse {
    const resp = this.handleDuelAction(room_id, player_id, 'moveCard', [
      card_id,
      placeF,
      digimon_id,
    ]);

    console.log(resp);
    return resp;
  }

  handleDuelAction(
    room_id: string,
    player_id: string,
    action: keyof Player,
    params?: any[],
  ): DuelResponse {
    const room = this.rooms.find((r) => r.id == room_id);
    if (!room)
      return {
        state: null,
        players: null,
        errMsg: new ErrMsg('Room not found'),
      };

    const player = room.players.find((p) => p.id == player_id);
    if (!player)
      return {
        state: null,
        players: null,
        errMsg: new ErrMsg('Player not found'),
      };

    const method = player[action] as (...args: any[]) => WsResponse<BoardState>;
    const boundMethod = method.bind(player);
    const state = params ? boundMethod(...params) : boundMethod();
    if (state.errMsg) {
      return { state: null, players: null, errMsg: state.errMsg };
    }

    return {
      state: state.resp,
      players: room.players.map((p) => p.id),
    };
  }
}
