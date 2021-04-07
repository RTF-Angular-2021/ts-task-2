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
import { IMoneyUnit, MoneyRepository } from '../task_1';
import { BankOffice, IBankUser, ICard } from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';

class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;
	private _authorizedCard: ICard;
	private _isUserAuthorized: boolean;

	constructor(
		initBankOffice: BankOffice,
		initMoneyRepository: MoneyRepository
	) {
		this._moneyRepository = initMoneyRepository;
		this._bankOffice = initBankOffice;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(
			initMoneyRepository
		);
		this._isUserAuthorized = false;
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): void {
		if (this._bankOffice.authorize(user.id, card.id, cardPin)){
			this._authorizedUser = user;
			this._userSettingsModule.user = user;
			this._authorizedCard = card;
			this._isUserAuthorized = true;
			return
		}

		throw new Error('Ошибка авторизации');
	}

	public takeUsersMoney(moneyUnits: Array<IMoneyUnit>): void {
		if (!this._isUserAuthorized)
			throw Error('Пользователь не авторизован');
		
		let moneyTaken = this._moneyRepository.takeMoney(moneyUnits);
		this._authorizedCard.balance += moneyTaken;
	}

	public giveOutUsersMoney(count: number): void {
		if (!this._isUserAuthorized)
			throw Error('Пользователь не авторизован');
		
		if (this._authorizedCard.balance < count)
			throw Error('Недостаточно средств');
		
		this._moneyRepository.giveOutMoney(
			count,
			this._authorizedCard.currency
		);
		this._authorizedCard.balance -= count;
	}

	public changeAuthorizedUserSettings(
		option: UserSettingOptions, 
		argsForChangeFunction: string
	): void {
		if (!this._isUserAuthorized)
			throw Error('Пользователь не авторизован');

		let isSettingsChanged = this._userSettingsModule.changeUserSettings(
			option, 
			argsForChangeFunction
		);

		if (!isSettingsChanged)
			throw Error('Ошибка изменения настроек пользователя');
	}

	public convertMoneyUnits(
		fromCurrency: Currency, 
		toCurrency: Currency, 
		moneyUnits: Array<IMoneyUnit>
	): Array<IMoneyUnit> {
		if (!this._isUserAuthorized)
			throw Error('Пользователь не авторизован');
		
		return this._currencyConverterModule.convertMoneyUnits(
			fromCurrency,
			toCurrency,
			moneyUnits
		);
	}
}
