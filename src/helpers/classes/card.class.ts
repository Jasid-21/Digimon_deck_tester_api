import { CardInterface } from '../interfaces/card.interface';
import { PlacesType } from '../interfaces/types';

export class Card implements CardInterface {
  id: string;
  name: string;
  imgUrl: string;
  cardnumber: string;
  type: string;

  maineffect: string;
  soureeffect: string;

  stage: string;
  digi_type: string;
  attribute: string;

  hidden: boolean;
  rested: boolean;
  faceDown: boolean;

  place: PlacesType;
  player: string;

  constructor(card: CardInterface) {
    this.id = card.id;
    this.name = card.name;
    this.imgUrl = card.imgUrl;
    this.cardnumber = card.cardnumber;
    this.type = card.type;

    this.maineffect = card.maineffect;
    this.soureeffect = card.soureeffect;

    this.stage = card.stage;
    this.digi_type = card.digi_type;
    this.attribute = card.attribute;

    this.hidden = true;
    this.rested = false;
    this.faceDown = true;

    this.place = card.place;
    this.player = card.player;
  }

  flip(): void {
    this.faceDown = !this.faceDown;
  }

  rotate(): void {
    this.rested = !this.rested;
  }
}
