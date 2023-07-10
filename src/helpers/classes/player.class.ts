import { BoardState } from '../interfaces/board_state.interface';
import { Digimon } from './digimon.class';
import { RawCard } from '../interfaces/raw-card.interface';
import { WsResponse } from '../interfaces/response.interface';
import { PlacesType } from '../interfaces/types';
import { Card } from './card.class';
import { ErrMsg } from './errMsg.class';

export class Player {
  id: string;
  name: string;
  cards: Card[] = [];
  digimons: Digimon[] = [];
  raw_deck: RawCard[] = [];

  constructor(id: string, name: string, raw_deck: RawCard[]) {
    this.id = id;
    this.name = name;
    this.raw_deck = raw_deck;
  }

  drawCard(): WsResponse<BoardState> {
    const deck = this.cards.filter((c) => c.place == 'deck');
    const card = deck.shift();
    if (!card) return { resp: null, errMsg: new ErrMsg('Card not found') };

    card.place = 'hand';
    const state: BoardState = {
      hand: this.cards.filter((c) => c.place == 'hand'),
      deck: this.cards.filter((c) => c.place == 'deck'),
    };

    return { resp: state };
  }

  moveCard(
    card_id: string,
    placeF: PlacesType,
    digimon_id?: string,
  ): WsResponse<BoardState> {
    const card = this.cards.find((c) => c.id == card_id);
    if (!card) return { resp: null, errMsg: new ErrMsg('Card not found') };

    card.place = placeF;
    if (placeF == 'digimon') {
      card.digimon_id = digimon_id;
    }

    if (placeF == 'field') {
      card.place = 'digimon';
      const digimon = new Digimon('field', [card.id]);
      card.digimon_id = digimon.id;
      this.digimons.push(digimon);
    }

    const state: BoardState = {
      [placeF]: this.cards.filter((c) => c.place == placeF),
      [card.place]: this.cards.filter((c) => c.place == card.place),
    };

    return { resp: state };
  }

  hatchDigimon(): WsResponse<BoardState> {
    const hatch_down = this.cards.filter((c) => c.place == 'hatch_down');
    const card = hatch_down.pop();
    if (!card) return { resp: null, errMsg: new ErrMsg('Card not found') };

    const digimon = new Digimon('hatch_up', [card.id]);
    card.place = 'digimon';
    card.digimon_id = digimon.id;
    this.digimons.push(digimon);

    const state: BoardState = {
      hatch_down,
      hatch_up: digimon,
      digimon: [card],
    };

    return { resp: state };
  }

  rotateDigimon(digimon_id: string): WsResponse<BoardState> {
    const digimon = this.digimons.find((d) => d.id == digimon_id);
    const last_id = digimon.stages.pop();
    const last = this.cards.find((c) => c.id == last_id);

    if (!last) {
      return { resp: null, errMsg: new ErrMsg('Last stage not found') };
    }

    last.rotate();
    const state = {
      [digimon.place]: this.digimons.filter((d) => d.place == digimon.place),
    };
    return { resp: state };
  }

  moveDigimon(
    digimon_id: string,
    x: number,
    y: number,
  ): WsResponse<BoardState> {
    const digimon = this.digimons.find((d) => d.id == digimon_id);
    if (!digimon) {
      return { resp: null, errMsg: new ErrMsg('Digimon not found') };
    }

    digimon.x = x;
    digimon.y = y;

    const state: BoardState = {
      [digimon.place]: this.digimons.filter((d) => d.place == digimon.place),
    };

    return { resp: state };
  }
}
