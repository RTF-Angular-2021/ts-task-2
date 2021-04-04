/** Задача 3 - UserSettingsModule
 * Имеется класс UserSettingsModule. Который должен отвечать за
 * изменение настроек пользователя.
 * Требуется:
 * 1) Реализовать классу UserSettingsModule 4 метода:
 * 		1.1) changeUserName - метод, заменяющий имя пользователя на переданное в аргументе
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.2) changeUserSurname - метод, заменяющий фамилию пользователя на переданную в аргументе
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.3) registerForUserNewCard - метод, привязывающий пользователю банковскую
 * 			 Карта считается успешно привязанной, если она существует и она не привязана ни к одному пользователю
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.4) changeUserSettings - управляющий метод
 * 			 который возвращает резльтат работы одного из методов из 1.1 - 1.3
 * 			 на основе переданных аргументов
 * 2) Типизировать все свойства и методы класса UserSettingsModule,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency, UserSettingOptions } from '../enums';
import { BankOffice, IBankUser } from '../task_2';

export class UserSettingsModule {
	private _bankOffice: BankOffice;
	private _user: IBankUser;

	public set user(user: IBankUser) {
		this._user = user;
	}

	constructor(initialBankOffice: BankOffice) {
		this._bankOffice = initialBankOffice;
	}

	private changeUserName(newName: string): boolean {
		if (newName.length > 0 && newName.length <= 50
			&& newName.match(/[А-Яа-я]{1,50}/g) !== null) {
			this._user.name = newName[0].toUpperCase + newName.toLowerCase().slice(1);
			return true;
		}
		return false;
	}

	private changeUserSurname(newSurname: string): boolean {
		if (newSurname.length > 0 && newSurname.length <= 50
			&& newSurname.match(/[А-Яа-я]{1,50}/g) !== null) {
			this._user.surname = newSurname[0].toUpperCase() + newSurname.toLowerCase().slice(1);
			return true;
		}
		return false;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		if (newCardId && this._bankOffice.getCardById(newCardId) === null
			&& !this._bankOffice.isCardTiedToUser(newCardId)) {
			this._user.cards.push({
				id: newCardId,
				balance: 0,
				currency: Currency.RUB,
				pin: "",
			});
			return true;
		}
		return false;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		switch (Number(option)) {
			case UserSettingOptions.name:
				return this.changeUserName(argsForChangeFunction);

			case UserSettingOptions.surname:
				return this.changeUserSurname(argsForChangeFunction);

			case UserSettingOptions.newCard:
				return this.registerForUserNewCard(argsForChangeFunction);

			default:
				return false;
		}
	}
}