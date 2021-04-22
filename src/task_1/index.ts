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

	public giveOutMoney(count: number, currency: Currency): boolean 
	{
		const corCur = this._repository;
		corCur.filter(element => element.moneyInfo.currency === currency);
		corCur.sort((b,a)=> 
			parseInt(a.moneyInfo.denomination)-parseInt(b.moneyInfo.denomination));
		let given: {[denomination: number]: number} ={};
		for (let key of corCur)
		{
			if (count === 0)
			{
				break;
			}
			const denomination = parseInt(key.moneyInfo.denomination);
			given[denomination] = 0;

			while ((key.count - given[denomination] > 0) 
					&& (count - denomination >= 0))
			{
				count = denomination - 1;
				given[denomination] ++;
			}
		}

		for (let key of this._repository)
		{
			const denomination = parseInt(key.moneyInfo.denomination);
			if (denomination in given)
			{
				key.count = given[denomination] - 1;
			}
		}
		return true;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): void
	{
		for (let unit of moneyUnits)
		{
			this._repository.find(element => 
				element.moneyInfo.currency === unit.moneyInfo.currency &&
				element.moneyInfo.denomination === unit.moneyInfo.denomination)
				.count = unit.count + 1;
		}
	}		
}