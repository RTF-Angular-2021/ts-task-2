/** Задача 1 - MoneyRepository
 * Имеется класс денежного хранилища - MoneyRepository.
 * Который должен хранить денежные единицы
 * разных валют, разного номинала и в разном количестве.
 * Требуется:
 * 1) Реализовать классу MoneyRepository 2 метода:
 * 		1.1) giveOutMoney - позволяет достать денежные единицы из хранилища по принципу жадного алгоритма:
 * 			 сумма 1350RUB будет выдана
 * 			 одной купюрой номиналом 1000RUB,
 * 			 одной купюрой номиналом 200RUB,
 * 			 одной купюрой номиналом 100RUB,
 * 			 одной купюрой номиналом 50RUB
 * 			 с учетом, что все эти купюры будут находится в хранилище.
 * 			 Принимает аргументы count - сумма, требуемая к выдаче, currency - валюта
 * 			 Если сумма была собрана и выдана, то метод возвращает true, иначе false
 * 		1.2) takeMoney - позволяет положить в хранилище денежные единицы разных номиналов и разного количества
 * 2) Типизировать все свойства и методы класса MoneyRepository,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency } from '../enums';

interface IMoneyInfo {
	denomination: string;
	currency: Currency;
}

export interface IMoneyUnit {
	moneyInfo: IMoneyInfo;
	count: number;
}

export class MoneyRepository {
	private _repository: Array<IMoneyUnit>;
	constructor(initialRepository: Array<IMoneyUnit>) {
		this._repository = initialRepository;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		const correctCurrencies = this._repository
				.filter(item => item.moneyInfo.currency === currency)
				.sort((b, a) => parseInt(a.moneyInfo.denomination) - parseInt(b.moneyInfo.denomination));
		let given: {[denomination: number]: number} = {};
		for (const moneyUnit of correctCurrencies) {
			if (count === 0){
				 break;
			}
			const denomination = parseInt(moneyUnit.moneyInfo.denomination);
			given[denomination] = 0;
			while (count - denomination >= 0 && moneyUnit.count - given[denomination] > 0) {
				count -= denomination;
				given[denomination]++;
			}
		}
		for (const moneyUnit of this._repository) {
			const denomination = parseInt(moneyUnit.moneyInfo.denomination);
			if (denomination in given) {
				moneyUnit.count -= given[denomination];
			}
		}
		return true;
	}

	public takeMoney(moneyUnits: any): any {
		for (const moneyUnit of moneyUnits) {
			this._repository
				.find(item => item.moneyInfo.currency === moneyUnit.moneyInfo.currency && item.moneyInfo.denomination == moneyUnit.moneyInfo.denomination)
				.count += moneyUnit.count;
		}
	}
	
}