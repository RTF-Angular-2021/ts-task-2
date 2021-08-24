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
import { MoneyRepository } from '../task_1';
import { BankOffice } from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';
import { IBankUser, ICard, IMoneyUnit } from '../types';

class BankTerminal {
    private _bankOffice: BankOffice;
    private _moneyRepository: MoneyRepository;
    private _userSettingsModule: UserSettingsModule;
    private _currencyConverterModule: CurrencyConverterModule;
    private _authorizedUser: IBankUser;

    constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
        this._moneyRepository = initMoneyRepository;
        this._bankOffice = initBankOffice;
        this._userSettingsModule = new UserSettingsModule(initBankOffice);
        this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
    }

    public authorizeUser(user: IBankUser, card: ICard, cardPin: string): void {
        if (this._bankOffice.authorize(user.id, card.id, cardPin)) {
            this._authorizedUser = user;
        }
    }

    public takeUsersMoney(moneyUnits: IMoneyUnit[]): void {
        if (this._authorizedUser) {
            this._moneyRepository.takeMoney(moneyUnits);
            this._authorizedUser.cards.forEach(item => {
                moneyUnits.forEach(el => {
                    if (item.currency === el.moneyInfo.currency) {
                        this._bankOffice.getCardById(item.id).balance += el.count * Number(el.moneyInfo.denomination);
                    }
                })
            })
        }
    }

    public giveOutUsersMoney(count: number, currency: number): void {
        if (this._authorizedUser) {
            if (this._moneyRepository.giveOutMoney(10000, 0)) {
                this._authorizedUser.cards.forEach(item => {
                    if (item.currency === currency) {
                        item.balance -= count;
                    }
                })
            }
        }
    }

    public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
        if (this._authorizedUser) {
            this._userSettingsModule.user = this._authorizedUser;            
            return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
        }
    }

    public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit[]): boolean {
        if (this._authorizedUser) {
            return this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits);
        }
    }
}