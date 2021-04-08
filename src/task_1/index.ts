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

	public giveOutMoney(count: number, currency: Currency): boolean 
	{
		const rub = [10, 50, 100, 500, 1000, 5000];
		const doll = [1, 2, 5, 10, 20, 50, 100];
		let copy = count;

		this._repository.forEach(i =>
			{
				for (let key in i)
				{
					if (i['moneyInfo']['currency']===currency && copy >= i['count'] && (rub.includes(i['count']) || doll.includes(i['count'])))
					{
						copy -= i['count'];
						i['count'] = 0;
					}
				}
			});
		return copy === 0;
	}

	public money (a: IMoneyUnit, b: IMoneyUnit): number
	{
		if (a.moneyInfo.denomination.length > b.moneyInfo.denomination.length)
		{
			return -1;
		};

		if (a.moneyInfo.denomination.length < b.moneyInfo.denomination.length)
		{
			return 1;
		};

		return a.moneyInfo.denomination > b.moneyInfo.denomination ? -1: 1;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): number
	{
		moneyUnits.sort(this.money);
		
		let result = 0;

		for (let i of moneyUnits)
		{
			const cur = i.moneyInfo.currency.toString();
			for (let moneyUnitInRepo of this._repository[cur])
			{
				if (i.moneyInfo.denomination === moneyUnitInRepo.momeyInfo.denomination)
				{
					moneyUnitInRepo.count += i.count;
					result += i.count;
					break;
				}
			}
		return result;
		}
	}
}