import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Components';
import { IEvents } from '../base/events';

interface IBasket {
	list: HTMLElement;
	total: number;
	button: HTMLButtonElement;
}

export class Basket extends Component<IBasket> {
	protected events: IEvents;
	protected list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		const initialTotal = this.getInitialTotal();
		this.updateButtonState(initialTotal);

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	getInitialTotal(): number {
		return 0;
	}

	set cards(cards: HTMLElement[]) {
		if (cards.length) {
			this.list.replaceChildren(...cards);
		} else {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	protected toggleActiveButton(state: boolean) {
		this.setDisabled(this.button, state);
	}

	updateButtonState(total: number) {
		if (total === 0) {
			this.toggleActiveButton(true);
		} else {
			this.toggleActiveButton(false);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
		this.updateButtonState(total);
	}
}
