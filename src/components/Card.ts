import { ICard } from '../types';
import { Component } from './base/Components';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected cardId: string;
	protected cardImage?: HTMLImageElement;
	protected cardCategory?: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardDescription?: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardPrice: HTMLElement;
	protected cardIndex: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this.cardImage = container.querySelector('.card__image');
		this.cardCategory = container.querySelector('.card__category');
		this.cardTitle = container.querySelector('.card__title');
		this.cardDescription = container.querySelector('.card__text');
		this.cardButton = container.querySelector('.card__button');
		this.cardPrice = container.querySelector('.card__price');
		this.cardIndex = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	toggleActiveButton(state: boolean) {
		this.setDisabled(this.cardButton, state);
	}

	setDisabledButton() {
		this.cardButton.setAttribute('disabled', 'disabled');
	}

	set index(value: number) {
		this.setText(this.cardIndex, value);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	categoryСolors: Map<string, string> = new Map([
		['софт-скил', 'card__category_soft'],
		['хард-скил', 'card__category_hard'],
		['дополнительное', 'card__category_additional'],
		['другое', 'card__category_other'],
		['кнопка', 'card__category_button'],
	]);

	set category(value: string) {
		this.setText(this.cardCategory, value);

		if (this.cardCategory) {
			this.toggleClass(this.cardCategory, this.categoryСolors.get(value), true);
		}
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set description(value: string) {
		this.setText(this.cardDescription, value);
	}

	set button(value: string) {
		this.setText(this.cardButton, value);
	}

	set price(value: number) {
		if (value === null || value === 0) {
			this.setText(this.cardPrice, 'Бесценно');
			this.setDisabled(this.cardButton, true);
		} else {
			this.setText(this.cardPrice, `${value} синапсов`);
		}
	}
}
