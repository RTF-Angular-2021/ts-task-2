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
	private _repository: IMoneyUnit[];
	constructor(initialRepository: IMoneyUnit[]) {
		this._repository = initialRepository;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		let copyCount = count;
		let currentArray = this._repository.filter(u => u.moneyInfo.currency === currency);
		currentArray.sort((prev, next) => parseInt(next.moneyInfo.denomination) - parseInt(prev.moneyInfo.denomination));
		currentArray.forEach(item => {
			for (let key in item) {
				if (copyCount > 0) {
					let maxCount = Math.floor(copyCount / parseInt(item.moneyInfo.denomination));
					if (maxCount > item.count) {
                        maxCount = item.count;
                    	item.count -= maxCount;
                    }
                    copyCount -= maxCount * parseInt(item.moneyInfo.denomination);
				}
			}
		});

		return copyCount === 0 ? true : false;
	}

	public takeMoney(moneyUnits: IMoneyUnit[]): void {
		for (let item of moneyUnits) {
			this._repository.push(item);
		}
	}
}

