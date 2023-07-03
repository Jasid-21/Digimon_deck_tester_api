export class ErrMsg {
  msg: string;
  type?: string;

  constructor(message: string, type?: string) {
    this.msg = message;
    if (type) this.type = type;
  }
}
