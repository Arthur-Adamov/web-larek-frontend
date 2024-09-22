import { Component } from "./base/Components";

interface ICardsContainer {
  catalog: HTMLElement[]
}

export class CardsContainer extends Component<ICardsContainer> {
  protected _catalog: HTMLElement

  constructor(protected container: HTMLElement) {
    super(container)
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items)
  }
}

