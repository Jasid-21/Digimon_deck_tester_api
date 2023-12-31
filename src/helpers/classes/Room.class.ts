import { Player } from './player.class';
import { RawCard } from '../interfaces/raw-card.interface';

export class Room {
  id: string;
  players: Player[] = [];
  active = false;

  constructor(id: string) {
    this.id = id;
  }

  addPlayer(player: Player): number {
    this.players.push(player);
    return this.players.length;
  }

  getPlayers() {
    return this.players;
  }

  getPlayerById(player_id: string): Player | undefined {
    return this.players.find((p) => p.id == player_id);
  }
}
