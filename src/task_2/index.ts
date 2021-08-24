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
import { IBankUser, ICard } from '../types';

export class BankOffice {
    private _users: Array<IBankUser>;
    private _cards: ICard[];

    constructor(users: IBankUser[], cards: ICard[]) {
        this._users = users;
        this._cards = cards;
    }

    public authorize(userId: string, cardId: string, cardPin: string): boolean {
		return this._users.filter(item => item.id === userId).some(el => el.cards.some(i => i.id === cardId && i.pin === cardPin))
        // let checkCardAndUser = this._users.filter(item => {
        //     if (item.id === userId) return item.cards.some(el => (el.id === cardId && el.pin === cardPin));
        // });
        // if (checkCardAndUser.length) return true;
        // else return false;
    }

    public getCardById(cardId: string): ICard {
        let cardObj: ICard;
        this._cards.forEach(item => {
            if (item.id === cardId) {
                cardObj = item;
            }
        });
        return cardObj;
    }

    public isCardTiedToUser(cardId: string): boolean {
        return this._users.some(item => item.cards.some(el => el.id === cardId));
    }
}