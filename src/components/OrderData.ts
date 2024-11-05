import { TFormErrors, IOrderData, TContactsForm, TOrderForm } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	protected events: IEvents;
	formErrors: TFormErrors = {};
	button: boolean = false;

	constructor(events: IEvents) {
		this.events = events;
	}

	setPayment(value: string) {
		this.payment = value;
		this.events.emit('payment:changed');
	}

	getPayment() {
		return this.payment;
	}

	setOrderInfo(orderData: TOrderForm) {
		this.payment = orderData.payment;
		this.address = orderData.address;
	}

	setOrderField(field: keyof TOrderForm, value: string) {
		this[field] = value;
	}

	setContactsField(field: keyof TContactsForm, value: string) {
		this[field] = value;
	}

	setContactsInfo(contactsData: TContactsForm) {
		this.email = contactsData.email;
		this.phone = contactsData.phone;
	}

	getOrderData() {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	checkValidateAddress() {
		const errors: typeof this.formErrors = {};
		if (!this.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}
		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	checkValidateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	resetFormData() {
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.formErrors = {};
	}
}
