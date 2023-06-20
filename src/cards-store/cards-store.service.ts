import { Injectable } from '@nestjs/common';
import { RawCard } from 'src/helpers/interfaces/raw-card.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CardsStoreService {
  colors = ['blue', 'yellow', 'red', 'green', 'black', 'purple', 'white'];
  cardSStore: RawCard[];

  setCards() {
    const route = path.join(
      process.cwd(),
      'src',
      'helpers',
      'resources',
      'database.json',
    );
    const file = fs.readFileSync(route, 'utf-8');
    this.cardSStore = JSON.parse(file);
  }

  getCards() {
    return this.cardSStore;
  }

  getDeckFromCodes(codes: string[]): RawCard[] {
    const deck: RawCard[] = codes.map((c) => {
      const card = this.cardSStore.find((cd) => cd.cardnumber == c);
      return card;
    });

    return deck;
  }
}
