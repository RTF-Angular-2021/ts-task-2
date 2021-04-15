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
		let givenMoney: Array<IMoneyUnit> = new Array<IMoneyUnit>();
		this._repository
			.filter(function (unit){ 
				return unit.moneyInfo.currency === currency 
			})
			.sort(function (a, b) {
				return Number(a.moneyInfo.denomination) > Number(b.moneyInfo.denomination) ? -1 : 1;
			})
			.forEach(unit => {
				let currentDenomination = Number(unit.moneyInfo.denomination);
				let amount = Math.min((count - count % currentDenomination) / currentDenomination, unit.count);
				count -= amount * currentDenomination;
				givenMoney.push({
					moneyInfo:{
						denomination: unit.moneyInfo.denomination,
						currency: unit.moneyInfo.currency
					},
					count: amount
				});
			});
		if(count === 0){
			this.updateRepository(givenMoney, currency);
			return true;
		}
		return false;
	}

	public updateRepository(givenMoney: Array<IMoneyUnit>, currency: Currency):void {
		this._repository.forEach((value, index) => {
			let current = givenMoney.find(x => x.moneyInfo.denomination === this._repository[index].moneyInfo.denomination);
			if(this._repository[index].moneyInfo.currency === currency && current){
					this._repository[index].count -= current.count;
				}
		});
	}

	public convertMoney(count: number, currency: Currency, moneyUnits: Array<IMoneyUnit>):Array<IMoneyUnit>{
		let res: Array<IMoneyUnit> = new Array<IMoneyUnit>();
		let denominations = currency === Currency.RUB ? 
		[5000,2000,1000,500,200,100,50,10]:
		[100,50,20,10,5,2,1];
		denominations.forEach(x=> {
			let amount = (count - count % x) / x;
			if (amount === 0 || this._repository.filter(y => y.moneyInfo.currency === currency 
				&& y.moneyInfo.denomination === x.toString() && y.count >= amount).length === 0) return;
			res.push({
				moneyInfo:{
					denomination: x.toString(),
					currency: currency
				},
				count: amount
			});
			count -= amount * x;
		})
		if(res.length > 0){
			this.takeMoney(moneyUnits);
		}
		return res;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): void {
		moneyUnits.forEach(unit => {
			let unitExistIndex = this._repository
				.findIndex(x => JSON.stringify(x.moneyInfo) === JSON.stringify(unit.moneyInfo));
			unitExistIndex !== -1 ? this._repository[unitExistIndex].count += unit.count : this._repository.push(unit);
		});
	}
}