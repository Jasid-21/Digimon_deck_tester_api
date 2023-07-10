import { random_code } from '../functions/randomCode.function';
import { DigimonInterface } from '../interfaces/digimon.interface';
import { WsResponse } from '../interfaces/response.interface';
import { PlacesType } from '../interfaces/types';
import { ErrMsg } from './errMsg.class';

export class Digimon implements DigimonInterface {
  id: string;
  stages: string[];

  place: PlacesType;
  x: number;
  y: number;

  constructor(place: PlacesType, stages: string[] = [], x = 0, y = 0) {
    this.id = random_code(5);
    this.stages = stages;
    this.place = place;
    this.x = x;
    this.y = y;
  }

  removeStageById(stage_id: string): WsResponse<string[]> {
    const index = this.stages.findIndex((s) => s == stage_id);
    if (index < 0)
      return {
        resp: null,
        errMsg: new ErrMsg('Stage not found'),
      };

    this.stages.splice(index, 1);
    return {
      resp: this.stages,
    };
  }
}
