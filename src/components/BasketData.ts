import { IBasketData, ICard, } from "../types"
import { IEvents } from "./base/events"

export class BasketData implements IBasketData {
  cards: ICard[] = []
  total: number
  protected events: IEvents



  constructor(events: IEvents) {
    this.events = events
  }

  // addCard(card: ICard) {
  //   this.cards.push(card)
  //   this.events.emit('basket:changed')
  // }

  addCard(card: ICard) {
    const isCardInBasket = this.cards.some((item) => {
      item.id === card.id
    })
    if(!isCardInBasket) {
      this.cards.push(card)
      this.events.emit('basket:changed')
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

  // setTotal(value: number) {
  //   // this.setText(this._total, )
  // }
  // getTotal(): number {
  //   this.total = this.cards.reduce((a, c) => {
  //     const item = this.cards.find((it) => it.id === c)
  //     if (!item || item.price === null) {
  //       return a
  //     }
  //     return a + Number(item.price)
  //   }, 0)
  //   return this.total
  // }
}
