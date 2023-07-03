import { Card } from '../classes/card.class';
import { CardInterface } from '../interfaces/card.interface';
import { RawCard } from '../interfaces/raw-card.interface';
import { random_code } from './randomCode.function';

export function toPlayableCards(rawDeck: RawCard[], player_id: string): Card[] {
  const deck = rawDeck.map((c) => {
    const cardModel: CardInterface = {
      id: random_code(5),
      name: c.name,
      imgUrl: c.image_url,
      cardnumber: c.cardnumber,
      type: c.type,

      maineffect: c.maineffect,
      soureeffect: c.soureeffect,

      //Traits.
      stage: c.stage,
      digi_type: c.digi_type,
      attribute: c.attribute,

      //State properties.
      hidden: true,
      rested: false,
      faceDown: true,

      //Position properties.
      place: c.type == 'Digi-egg' ? 'hatch_down' : 'deck',
      player: player_id,
    };

    return new Card(cardModel);
  });

  return deck;
}
