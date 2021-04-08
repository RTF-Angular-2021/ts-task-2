import { Currency } from '../enums';

export interface ICard {
	id: string;
	balance: number;
	currency: Currency,
	pin: string,
}

export interface IBankUser {
	id: string;
	name: string;
	surname: string;
	cards: Array<ICard>;
}

export class BankOffice {
	private _users: IBankUser;
	private _cards: ICard;

	constructor(users: IBankUser, cards: ICard) {
		this._users = users;
		this._cards = cards;
	}

	public authorize(userId: string, cardId: string, cardPin: string): boolean {
		return  cardId === userId && this._cards.pin === cardPin;
	}

	public getCardById(cardId: string): ICard {
		if (cardId === this._cards['id']) return this._cards;
	}

	public isCardTiedToUser(cardId: string): boolean {
		return this._users.cards[0].toString() === cardId
	}
}