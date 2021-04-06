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
	private _repository: Array<object>;
	constructor(initialRepository: Array<object>) {
		this._repository = initialRepository;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		let copyCount = count;
		const denominationRU = [10, 50, 100, 500, 1000, 5000];
		const denominationUS = [1, 2, 5, 10, 20, 50, 100];
		this._repository.forEach(item => {
			for (let key in item) {
				//сравниваю по индексу валюты currency - 0 (RUB) или 1 (USD)
                if (item['moneyInfo']['currency'] === currency 
				&& copyCount >= item['count'] 
				&& (denominationRU.includes(item['count']) || denominationUS.includes(item['count']))) {
                    copyCount -= item['count'];
                    item['count'] = 0;
                } 
            }
		});
		
		return copyCount === 0 ? true : false;
	}

	public takeMoney(moneyUnits: IMoneyUnit): void {
		this._repository.push(moneyUnits);
	}
}


