import { ErrMsg } from '../classes/errMsg.class';

export interface WsResponse<type> {
  resp: type | null;
  errMsg?: ErrMsg;
}
