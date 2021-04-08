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
	constructor(initialRepository: IMoneyUnit|IMoneyUnit[]) {
		if(this.instanceOfMoneyUnit(initialRepository))
			this._repository.push(<IMoneyUnit>initialRepository)
		else{
			for(let item in <IMoneyUnit[]>initialRepository){
				if(this.instanceOfMoneyUnit(item))
					this._repository.push(<IMoneyUnit><unknown>item)
			}
		}
	};

	private instanceOfMoneyUnit(item: any):boolean {
		return 'moneyInfo' in item && 'count' in item;
	};

	private getMoneyUnit(currency: Currency): IMoneyUnit{
		return this._repository.filter(x => x.moneyInfo.currency === currency).pop()
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		if(count < 0)
			return false;
			//throw new Error("Value cannot be negative")
		let thousandRadix = Math.floor(count / 1000);
		let hundredRadix = Math.floor(count %1000/100);
		let demihundredRadix = Math.floor(count %1000 % 100 / 50);
		if(count - (thousandRadix*1000 + hundredRadix*100 + demihundredRadix*50) !== 0)
			return false;
			//throw new Error("Value must be divisible by 50")
		this.getMoneyUnit(currency).count -= thousandRadix*1000 + hundredRadix*100 + demihundredRadix*50;
		return true
	}

	public takeMoney(moneyUnits: IMoneyUnit[]): boolean {
		for(let unit of moneyUnits){
			if(unit.count < 0)
				continue;
				//throw new Error("Value cannot be negative)
			this.getMoneyUnit(unit.moneyInfo.currency).count += unit.count;
		}
		return true;
	}
}
