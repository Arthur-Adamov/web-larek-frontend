import { IBasketData, ICard, } from "../types"
import { IEvents } from "./base/events"

export class BasketData implements IBasketData {
  cards: ICard[] = []
  total: number
  protected events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  addCard(card: ICard) {
    const isCardInBasket = this.cards.some((item) => {
      item.id === card.id
    })
    if(!isCardInBasket) {
      this.cards.push(card)
      this.events.emit('basket:changed')
      this.events.emit('counter:changed')
    }
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
    this.total = this.cards.reduce((acc, card) => {
      if (!card || card.price === null) {
        return acc
      }
      return acc + Number(card.price)
    }, 0)
    return this.total
  }
}
