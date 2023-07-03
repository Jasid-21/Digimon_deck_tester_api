import { Injectable } from '@nestjs/common';
import { Room } from 'src/helpers/classes/Room.class';
import { ErrMsg } from 'src/helpers/classes/errMsg.class';
import { Player } from 'src/helpers/classes/player.class';
import { printError } from 'src/helpers/functions/printError.function';
import { random_code } from 'src/helpers/functions/randomCode.function';
import { shuffleArray } from 'src/helpers/functions/shuffleArray';
import { toPlayableCards } from 'src/helpers/functions/toPlayableCards.function';

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
      const main = deck.filter((c) => c.type != 'Digi-Egg');
      const digiEggs = deck.filter((c) => c.type == 'Digi-Egg');

      p.deck = shuffleArray(main);
      p.hatch_down = shuffleArray(digiEggs);
    });

    room.active = true;

    const players = room.players.map((p) => {
      return {
        player_id: p.id,
        deck: p.deck,
        hatch_down: p.hatch_down,
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

  drawCard(room_id: string, player_id: string) {
    const room = this.rooms.find((r) => r.id == room_id);
    if (!room) return new ErrMsg('Room not found');

    const player = room.players.find((p) => p.id == player_id);
    if (!player) return new ErrMsg('Player not found');

    const card = player.deck.pop();
    if (!card) return new ErrMsg('Deck is empty');
    player.hand.push(card);

    return {
      state: { deck: player.deck, hand: player.hand },
      players: room.players.map((p) => p.id),
    };
  }

  hatchDigimon(room_id: string, player_id: string) {
    const room = this.rooms.find((r) => r.id == room_id);
    if (!room) return new ErrMsg('Room not found');

    const player = room.players.find((p) => p.id == player_id);
    if (!player) return new ErrMsg('Player not found');

    const card = player.hatch_down.pop();
    if (!card) return new ErrMsg('Empty hatch deck');

    player.hatch_up = { id: random_code(5), stages: [card] };
    return {
      players: room.players.map((p) => p.id),
      state: { hatch_down: player.hatch_down, hatch_up: player.hatch_up },
    };
  }
}
