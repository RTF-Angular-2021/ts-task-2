/** Задача 1 - BankOffice
 * Имеется класс BankOffice. Который должен хранить пользователей и банковские карты.
 * Пользователи банка могу иметь карту, а могут не иметь.
 * Карты могут иметь своего владельца, а могут не иметь.
 * Требуется:
 * 1) Реализовать классу BankOffice 3 метода:
 * 		1.1) authorize - позволяет авторизировать пользователя:
 * 			 Пользователь считается авторизованым, если карта принадлежит ему и пин-код введен корректно
 * 			 Принимает аргументы userId - id пользователя, cardId - id банковской карты, cardPin - пин-код карты
 * 			 Если пользователь был успешно авторизован, то метод возвращает true, иначе false
 * 		1.2) getCardById - позволяет получить объект банковской карты из хранилища по id карты
 *		1.3) isCardTiedToUser - позволяет по id карты узнать, привзяана ли карта к какому-нибудь пользователю
 *			 возвращает true - если карта привязана к какому-нибудь пользователю, false в ином случае
 * 2) Типизировать все свойства и методы класса MoneyRepository,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

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
	private _users: Array<IBankUser>;
	private _cards: Array<ICard>;

	constructor(users: Array<IBankUser>, cards: Array<ICard>) {
		this._users = users;
		this._cards = cards;
	}

	public authorize(userId: string, cardId: string, cardPin: string): boolean {
		const user = this._users.find(x => x.id === userId);
		if(!user) return false;
		const card = user.cards.find(x=> x.id === cardId);
		if(!card) return false;
		return card.pin === cardPin;
	}

	public getCardById(cardId: string): ICard | undefined {
		return this._cards.find(x=> x.id === cardId);
	}

	public isCardTiedToUser(cardId: string): boolean {
		return this._users.filter(x=> x.cards.find(y=> y.id === cardId)).length > 0;
	}
}