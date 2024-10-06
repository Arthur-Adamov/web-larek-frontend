import { IBasketData, ICard, } from "../types"
import { IEvents } from "./base/events"
import { Card } from "./Card"

export class BasketData implements IBasketData {
  cards: ICard[] = []
  protected events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  addCard(card: ICard) {
    const isCardInBasket = this.cards.some((item) => item.id === card.id)
    if(!isCardInBasket) {
      this.cards.push(card)
      this.events.emit('basket:changed')
    }
  }

  getCount() {
    return this.cards.length
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

  getCardsId(): string[] {
    return this.cards.map(card => card.id)
  }

  getTotal(): number {
    return this.cards.reduce((acc, card) =>
      acc + card.price, 0
    )
  }
}
