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

import { UserSettingOptions } from '../enums';
import { IBankUser, BankOffice } from '../task_2';

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
		return (this._user.name = newName) ? true : false;
	}

	private changeUserSurname(newSurname: string): boolean {
		return (this._user.surname = newSurname) ? true : false;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		if (!this._bankOffice.isCardTiedToUser(newCardId) && this._user.cards) {
			this._user.cards[0]['id'] = newCardId;
			return true;
		}
		return false;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		if (argsForChangeFunction === option[0]) {
			return this.changeUserName(argsForChangeFunction);
		} else if (argsForChangeFunction === option[1]) {
			return this.changeUserSurname(argsForChangeFunction);
		} else if (argsForChangeFunction === option[2]) {
			return this.registerForUserNewCard(argsForChangeFunction);
		}
	}
}