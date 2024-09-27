import { ICard, ICardsData } from "../types"
import { IEvents } from "./base/events"

export class CardsData implements ICardsData {
  protected _cards: ICard[]
  preview: ICard | null
  protected events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  set cards(cards: ICard[]) {
    this._cards = cards
    this.events.emit('cards:changed')
  }

  get cards(): ICard[] {
    return this._cards
  }


  getCard(cardId: string): ICard {
    return this._cards.find((card) => card.id === cardId)
  }

  // setPreview(cardId: string | null) {
  //   if (!cardId) {
  //     this.preview = null;
  //     return;
  //   }
  //   const selectedCard = this.getCard(cardId);
  //   if (selectedCard) {
  //     this.preview = cardId;
  //     this.events.emit('card:selected')
  //   }
  // }


  setPreview(card: ICard) {
    this.preview = card
    this.events.emit('preview:changed', this.preview)
  }

  getPreview() {
    return this.preview
  }
}
