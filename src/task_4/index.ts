/** Задача 4 - CurrencyConverterModule
 * Имеется класс CurrencyConverterModule. Который должен отвечать за
 * конвертацию валют.
 * Требуется:
 * 1) Реализовать классу CurrencyConverterModule 1 метод - convert
 * 	  метод должен принимать 3 аргумента:
 *		1.1) fromCurrency - валюта, из которой происходит конвертация
 *		1.2) toCurrency - валюта, в которую происходит конвертация
 *		1.3) moneyUnits - денежные единицы, полностью соответствующие валюте,
 *			 из которой происходит конвертация
 *	  Метод должен возвращать набор денежных единиц в той валюте, в которую происходит конвертация
 *	  Для простоты реализации будем считать, что банкомат конвертирует только по курсу
 *	  1USD = 70RUB и кратные курсу суммы (т.е. банкомат не может сконвертировать 100RUB, может только 70, 140 и т.д.)
 * 2) Типизировать все свойства и методы класса UserSettingsModule,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency } from '../enums';
import { MoneyRepository } from '../task_1';
import { IMoneyUnit } from '../types';

export class CurrencyConverterModule {
    private _moneyRepository: MoneyRepository;
    public oneUSD: number;
    constructor(initialMoneyRepository: MoneyRepository) {
        this._moneyRepository = initialMoneyRepository;
        this.oneUSD = 70;
    }

    public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit[]): boolean {
        // let currency = (fromCurrency === 0) ? "₽" : "$";
        let amount = 0;
        let checkMoneyUnitCurrency = moneyUnits.every(item => item.moneyInfo.currency === fromCurrency);
        // console.log("Валюта соответствует fromCurrency:", checkMoneyUnitCurrency);
        moneyUnits.forEach(el => amount += Number(el.count) * Number(el.moneyInfo.denomination));
        if (amount % this.oneUSD === 0 && toCurrency === 1 && checkMoneyUnitCurrency) {
            // console.log(`Сумма, которую получили: ${amount}${currency}`);        
            return this._moneyRepository.giveOutMoney(amount / this.oneUSD, toCurrency);
        } else if (toCurrency === 0 && checkMoneyUnitCurrency) {
            return this._moneyRepository.giveOutMoney(amount * this.oneUSD, toCurrency);
        }
        return false;
    }
}