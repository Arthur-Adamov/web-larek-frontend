import { TOrderForm } from "../types";
import { ensureAllElements } from "../utils/utils";
import { Component } from "./base/Components";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<TOrderForm> {

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value
  }
}

export type TPaymentState = {
  selected: string
}

export type TPaymentActions = {
  onClick: (tab: string) => void
}

export class Payment extends Component<TPaymentState> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLElement, actions?: TPaymentActions) {
    super(container);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        actions?.onClick?.(button.name);
      });
    })
  }

  set selected(name: string) {
    this._buttons.forEach(button => {
      this.toggleClass(button, 'button_alt-active', button.name === name);
      this.setDisabled(button, button.name === name)
    });
  }
}
