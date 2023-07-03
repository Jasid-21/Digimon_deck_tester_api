import { PlacesType } from './types';

export interface CardInterface {
  //Identity properties.
  id: string;
  name: string;
  imgUrl: string;
  cardnumber: string;
  type: string;

  //Effects.
  maineffect: string;
  soureeffect: string;

  //Traits.
  stage: string;
  digi_type: string;
  attribute: string;

  //State properties.
  hidden: boolean;
  rested: boolean;
  faceDown: boolean;

  //Position properties.
  place: PlacesType;
  player: string;
}
