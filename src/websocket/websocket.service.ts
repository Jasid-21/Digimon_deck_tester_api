import { Injectable } from '@nestjs/common';
import { Room } from 'src/helpers/classes/Room.class';
import { Player } from 'src/helpers/classes/player.class';

@Injectable()
export class WebsocketService {
  rooms: Room[] = [];

  addRoom(id: string, player: Player) {
    const room = new Room(id);
    room.addPlayer(player);
    this.rooms.push(room);
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
}
