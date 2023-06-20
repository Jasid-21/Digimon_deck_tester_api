import { Digimon } from '../interfaces/digimon.interface';
import { RawCard } from '../interfaces/raw-card.interface';

export class Player {
  id: string;
  name: string;
  hand: RawCard[] = [];
  field: Digimon[] = [];
  drop: RawCard[] = [];
  deck: RawCard[] = [];
  security: RawCard[] = [];
  hatch_down: RawCard[] = [];
  hatch_up: Digimon | null;

  constructor(id: string, name: string, deck: RawCard[]) {
    this.id = id;
    this.name = name;
    this.deck = deck;
  }

  drawCard() {
    const card: RawCard | null = this.deck.shift();
    if (!card) throw Error('Deck is out of cards');

    this.hand.push(card);
    return { hand: this.hand, deck: this.deck };
  }
}
