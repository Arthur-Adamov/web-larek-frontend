import { TContactsForm } from "../types"
import { ensureElement } from "../utils/utils"
import { IEvents } from "./base/events"
import { Form } from "./common/Form"

export class Contacts extends Form<TContactsForm> {
  protected _email: HTMLInputElement
  protected _phone: HTMLInputElement

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', container)
    this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', container)
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value
  }
}
