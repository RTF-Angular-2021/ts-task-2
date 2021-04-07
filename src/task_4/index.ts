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
import { IMoneyUnit, MoneyRepository } from '../task_1';

type coefficientsType = {[fromCurrency: number]: {[toCurrency: number]: number}};

export class CurrencyConverterModule {
	private _moneyRepository: MoneyRepository;
	private _coefficients: coefficientsType;

	constructor(initialMoneyRepository: MoneyRepository) {
		this._moneyRepository = initialMoneyRepository;
		this._coefficients = {
			0: {1: 1 / 70},
			1: {0: 70}
		}
	}

	public convertMoneyUnits(
		fromCurrency: Currency,
		toCurrency: Currency,
		moneyUnits: Array<IMoneyUnit>
	): Array<IMoneyUnit> {
		let newMoneyUnits: Array<IMoneyUnit> = [];
		for (let moneyUnit of moneyUnits){ // dodelat'
			let newDenom = (parseInt(moneyUnit.moneyInfo.denomination)
				* this._coefficients[fromCurrency][toCurrency]).toString();
			newMoneyUnits.push(
				{
					moneyInfo: 
					{
						denomination: newDenom,
						currency: toCurrency
					}, 
					count: moneyUnit.count
				}
			)
		}

		return newMoneyUnits;
	}
}
