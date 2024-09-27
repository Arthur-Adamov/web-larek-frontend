import { createElement, ensureElement } from "../../utils/utils"
import { Component } from "../base/Components"
import { IEvents } from "../base/events"


interface IBasket {
  list: HTMLElement
  cards: HTMLElement[]
  total: number
  button: HTMLElement
}

export class Basket extends Component<IBasket> {
  protected events: IEvents
  protected list: HTMLElement
  protected _cards: HTMLElement[]
  protected _total: HTMLElement
  protected button: HTMLElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events
    this.list = ensureElement<HTMLElement>('.basket__list', this.container)
    this._total = this.container.querySelector('.basket__price')
    this.button = this.container.querySelector('.basket__button')

    if (this.button) {
      this.button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }
  }

  set cards(cards: HTMLElement[]) {
    if (cards.length) {
      this.list.replaceChildren(...cards);
    } else {
      this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
}

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`)
  }
}
