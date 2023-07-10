import { Card } from '../classes/card.class';
import { Digimon } from '../classes/digimon.class';
import { PlacesType } from './types';

export type BoardState = {
  [init_place in PlacesType]?: Card[] | Digimon[] | Digimon;
};
