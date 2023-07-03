import { ErrMsg } from '../classes/errMsg.class';
import { RawCard } from '../interfaces/raw-card.interface';

export function validateDeck(deck: RawCard[]): true | ErrMsg {
  const eggs = deck.filter((c) => c.type == 'Digi-Egg');
  const mains = deck.filter((c) => c.type != 'Digi-Egg');

  if (eggs.length > 5) {
    return new ErrMsg('Maximum number of digi eggs reached');
  }

  if (mains.length != 50) {
    return new ErrMsg('The number of cards into the main deck must be 50');
  }

  const codes = deck.map((c) => c.cardnumber);
  const unique = codes.filter((c, i) => codes.indexOf(c) == i);
  const cards: any[] = [];

  unique.forEach((u) => {
    const count = codes.filter((c) => c == u).length;
    cards.push({ code: u, num: count });
  });

  const exced = cards.filter((c) => c.num > 4);
  if (exced.length > 0) {
    return new ErrMsg('Some cards exced the maximum of 4 units...');
  }

  return true;
}
