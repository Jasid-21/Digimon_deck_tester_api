import { Digimon } from '../interfaces/digimon.interface';
import { RawCard } from '../interfaces/raw-card.interface';
import { Card } from './card.class';

export class Player {
  id: string;
  name: string;
  hand: Card[] = [];
  field: Digimon[] = [];
  drop: Card[] = [];
  deck: Card[] = [];
  security: Card[] = [];
  hatch_down: Card[] = [];
  hatch_up: Digimon | null;
  raw_deck: RawCard[] = [];

  constructor(id: string, name: string, raw_deck: RawCard[]) {
    this.id = id;
    this.name = name;
    this.raw_deck = raw_deck;
  }

  drawCard() {
    const card: Card | undefined = this.deck.shift();
    if (!card) throw Error('Deck is out of cards');

    this.hand.push(card);
    return { hand: this.hand, deck: this.deck };
  }
}
