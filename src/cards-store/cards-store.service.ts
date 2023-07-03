import { Injectable } from '@nestjs/common';
import { RawCard } from 'src/helpers/interfaces/raw-card.interface';
import * as fs from 'fs';
import * as path from 'path';
import { validateDeck } from 'src/helpers/functions/validateDeck.function';
import { ErrMsg } from 'src/helpers/classes/errMsg.class';
import { Card } from 'src/helpers/classes/card.class';
import { random_code } from 'src/helpers/functions/randomCode.function';
import { CardInterface } from 'src/helpers/interfaces/card.interface';

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

  getDeckFromCodes(codes: string[]): RawCard[] | ErrMsg {
    const deck: RawCard[] = codes.map((c) => {
      const card = this.cardSStore.find((cd) => cd.cardnumber == c);
      return card;
    });

    const validation = validateDeck(deck);
    if (validation instanceof ErrMsg) {
      return validation;
    }

    return deck;
  }
}
