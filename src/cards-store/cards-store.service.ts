import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RawCard } from 'src/helpers/interfaces/raw-card.interface';
import * as fs from 'fs';

@Injectable()
export class CardsStoreService {
  colors = ['blue', 'yellow', 'red', 'green', 'black', 'purple', 'white'];
  cardSStore: RawCard[];

  constructor(private readonly http: HttpService) {}
  /*
  setCards() {
    function getByColor(color: string, http: HttpService) {
      return http.get(
        `https://digimoncard.io/api-public/search.php?color=${color}`,
      );
    }

    const cards: RawCard[] = [];
    for (const c of this.colors) {
      getByColor(c, this.http).subscribe((v) => {
        cards.push(...v.data);
      });
    }

    setTimeout(() => {
      this.cardSStore = cards;
      console.log(this.cardSStore.length);
    }, 1500);
  }
  */

  setCards() {
    const file = fs.readFileSync(
      'src/helpers/resources/database.json',
      'utf-8',
    );
    this.cardSStore = JSON.parse(file);
  }

  getCards() {
    return this.cardSStore;
  }
}