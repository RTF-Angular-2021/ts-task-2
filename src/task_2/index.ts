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
	private _users: IBankUser[];
	private _cards: ICard[];

	constructor(users: IBankUser[], cards: ICard[]) {
		this._users = users;
		this._cards = cards;
	}

	public getCardById(cardId: string): ICard | undefined {
		let temp : ICard[] = this._cards.filter(x => x.id === cardId);
		return temp.length === 0 ? undefined : temp[0];
	}

	public isCardTiedToUser(cardId: string): boolean {
		let flag = false;
		let card : ICard | undefined = this.getCardById(cardId);
		if (typeof card === "undefined") return false;
		for (let user of this._users)
			if (typeof card !== "undefined" && user.cards.indexOf(card) !== -1)
				return true;
		return flag;
	}

	public authorize(userId: string, cardId: string, cardPin: string): boolean {
		let card : ICard;
		let user : IBankUser = this._users.filter(x => x.id === userId)[0];
		if (typeof user === "undefined") return false
		card = user.cards.filter(x => x.id === cardId)[0];
		return typeof card !== "undefined" ? cardPin === card.pin : false;
	}
}