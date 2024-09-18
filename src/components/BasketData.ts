import { IBasketData, ICard, TBasket } from "../types"
import { IEvents } from "./base/events"

export class BasketData implements IBasketData {
  cards: ICard[] = []
  protected events: IEvents


  constructor(events: IEvents) {
    this.events = events
  }

  addCard(card: ICard) {
    this.cards.push(card)
    this.events.emit('basket:changed')
  }

  deleteCard(cardId: string) {
    this.cards = this.cards.filter((card) => card.id !== cardId)
    this.events.emit('basket:changed')
  }

  isCardInBasket(cardId: string): boolean {
    return this.cards.some((card) => card.id === cardId)
  }

  clearBasket(): void {
    this.cards = []
    this.events.emit('basket:changed')
  }

  getCards(): ICard[] {
    return this.cards
  }
}
