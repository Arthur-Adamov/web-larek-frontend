import { FormErrors, IOrder, IOrderData, TContactsForm, TOrderForm } from "../types"
import { IEvents } from "./base/events"

export class OrderData implements IOrderData {
  paymentMethod: string
  address: string
  email: string
  phone: string
  protected events: IEvents
  formErrors: FormErrors = {}

  constructor(events: IEvents) {
    this.events = events
  }

  setOrderInfo(orderData: TOrderForm){
    this.paymentMethod = orderData.paymentMethod
    this.address = orderData.address
  }

  setOrderField(field: keyof TOrderForm, value: string) {
    this[field] = value;

    // if (this.checkValidateAddress()) {
    //     this.events.emit('order:ready')
    // }
  }

  setContactsField(field: keyof TContactsForm, value: string) {
    this[field] = value;

    // if (this.checkValidateAddress()) {
    //     this.events.emit('contacts:ready')
    // }
  }

  setContactsInfo(contactsData: TContactsForm){
    this.email = contactsData.email
    this.phone = contactsData.phone
  }

  getOrderData() {
    return {
      paymentMethod: this.paymentMethod,
      address: this.address,
      email: this.email,
      phone: this.phone
    }
  }

  checkValidateAddress() {
    const errors: typeof this.formErrors = {}
    if (!this.address) {
      errors.address = 'Необходимо указать адрес'
    }
    this.formErrors = errors
    this.events.emit('formErrors:change', this.formErrors)
    return Object.keys(errors).length === 0
  }

  checkValidateContacts() {
    const errors: typeof this.formErrors = {}
    if (!this.email) {
      errors.email = 'Необходимо указать email'
    }
    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон'
    }
    this.formErrors = errors
    this.events.emit('formErrors:change', this.formErrors)
    return Object.keys(errors).length === 0
  }
}
