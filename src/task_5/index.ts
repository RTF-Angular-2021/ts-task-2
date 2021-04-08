/** Задача 5 - BankTerminal
 * Имеется класс BankTerminal. Класс представляет банковский терминал.
 * Требуется:
  * 1) Реализовать классу BankTerminal 5 методjd:
 * 		1.1) authorize - позволяет авторизировать пользователя c помощью авторизации в BankOffice
 * 		1.2) takeUsersMoney - позволяет авторизованному пользователю положить денежные единицы
 * 			 в хранилище и пополнить свой баланс на карте
 *		1.3) giveOutUsersMoney - позволяет авторизованному пользователю снять денежные единицы
 * 			 с карты и получить их наличными из хранилища
 *		1.4) changeAuthorizedUserSettings - позволяет авторизованному пользователю изменить свои
 * 			 настройки с помощью методов UserSettingsModule
 *		1.5) convertMoneyUnits - позволяет авторизованному пользователю конвертировать валюту
 *			 с помощью методов CurrencyConverterModule
 * 2) Типизировать все свойства и методы класса BankTerminal,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency, UserSettingOptions } from '../enums';
import { MoneyRepository, IMoneyUnit } from '../task_1';
import { BankOffice, IBankUser, ICard } from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';

class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _currentCard: ICard;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
		this._moneyRepository = initMoneyRepository;
		this._bankOffice = initBankOffice;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
		if (this._bankOffice.authorize(user.id, card.id, cardPin)) {
			this._currentCard = card;
			this._authorizedUser = user;
			return true;
		}
		return false;
	}

	public takeUsersMoney(moneyUnits: IMoneyUnit[]): boolean {
		if (this._authorizedUser != undefined) {
			this._moneyRepository.takeMoney(moneyUnits);
			for (const moneyUnit of moneyUnits) {
				const item = this._currentCard.currency === moneyUnit.moneyInfo.currency ? 1 : (this._currentCard.currency === Currency.RUB ? 70 : (1 / 70))
				this._currentCard.balance += moneyUnit.count * parseInt(moneyUnit.moneyInfo.denomination) * item;
			}
			return true;
		}
		return false;
	}

	public giveOutUsersMoney(count: number): boolean {
		if (this._authorizedUser != undefined) {
			if (this._moneyRepository.giveOutMoney(count, this._currentCard.currency)) {
				this._currentCard.balance -= count;
				return true;
			}
		}
		return false;
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: any): boolean {
		if (this._authorizedUser != undefined) {
			this._userSettingsModule.user = this._authorizedUser;
			return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
		}
		return false;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: any): number {
		if (this._authorizedUser != undefined) {
			const sum = this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits);
			this._currentCard.balance -= sum;
		}
		return 0;
	}
}