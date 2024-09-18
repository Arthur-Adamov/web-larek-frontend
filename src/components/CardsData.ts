import { ICard, ICardsData } from "../types"
import { IEvents } from "./base/events"

export class CardsData implements ICardsData {
  cards:ICard[] = []
  preview: string | null
  protected events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  setCards(cards: ICard[]) {
    this.cards = cards
    this.events.emit('cards:changed')
  }

  getCards(): ICard[] {
    return this.cards
  }

  getCard(cardId: string): ICard {
    return this.cards.find((card) => card.id === cardId)
  }

  setPreview(cardId: string | null) {
    if (!cardId) {
      this.preview = null;
      return;
    }
    const selectedCard = this.getCard(cardId);
    if (selectedCard) {
      this.preview = cardId;
      this.events.emit('card:selected')
    }
  }

  getPreview() {
    return this.preview
  }
}
