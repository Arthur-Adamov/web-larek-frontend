import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected _cards: ICard[];
	preview: ICard | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('cards:changed');
	}

	get cards(): ICard[] {
		return this._cards;
	}

	getCard(cardId: string): ICard {
		return this._cards.find((card) => card.id === cardId);
	}

	setPreview(card: ICard) {
		this.preview = card;
		this.events.emit('preview:changed', this.preview);
	}

	getPreview() {
		return this.preview;
	}
}
