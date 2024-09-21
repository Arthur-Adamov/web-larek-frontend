import { ICard } from "../types"
import { cloneTemplate, ensureElement } from "../utils/utils"
import { Component } from "./base/Components"
import { IEvents } from "./base/events"

export class Card extends Component<ICard> {
  protected element: HTMLElement
  protected events: IEvents
  protected cardId: string
  protected cardImage?: HTMLImageElement
  protected cardCategory?: HTMLElement
  protected cardTitle: HTMLElement
  protected cardDescription?: HTMLElement
  protected cardButton: HTMLButtonElement
  protected cardPrice: HTMLElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events

    // this.element = cloneTemplate()

    this.cardImage = container.querySelector('.card__image')
    this.cardCategory = container.querySelector('.card__category')
    this.cardTitle = ensureElement<HTMLElement>('.card__title', container)
    this.cardDescription = container.querySelector('.card__text')
    this.cardButton = container.querySelector('.card__button')
    this.cardPrice = ensureElement<HTMLElement>('.card__price', container)

    this.cardButton.addEventListener('click', () => {
      this.events.emit('card:add', {card: this})
    })
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set image(value: string) {
    this.setImage(this.cardImage, value, this.title)
  }

  set category(value: string) {
    this.setText(this.cardCategory, value)
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set description(value: string) {
    this.setText(this.cardDescription, value)
  }

  set button(value: string) {
    this.setText(this.cardButton, value)
  }

  set price(value: string) {
    this.setText(this.cardPrice, value)
  }
}
