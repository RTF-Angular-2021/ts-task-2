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
	private static readonly _usNominal: number[] = [100, 50, 20, 10, 5, 2, 1];
	private static readonly _ruNominal: number[] = [5000, 2000, 1000, 500, 200, 100, 50];
	constructor(initialRepository: IMoneyUnit[]) {
		this._repository = initialRepository;
	}

	private static _splitAmount(value: number, currency: Currency): [string, number][] {
		let result: [string, number][] = [];
		const denominations: number[] = currency === Currency.RUB ? this._ruNominal : this._usNominal;
		denominations.forEach(nominal => {
			if (nominal < value){
				const count: number = Math.floor(value / nominal);
				result.push([`${nominal}${Currency[currency]}`, count]);
				value -= nominal * count; 
			}
		})
		return result;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		const nominalCountPair = MoneyRepository._splitAmount(count, currency);
		nominalCountPair.forEach(pair => {
			if (!this._repository.find(unit => unit.moneyInfo.denomination === pair[0] && unit.count >= pair[1])) {
				return false;
			}
		})
		return true;
	}

	public takeMoney(moneyUnits: IMoneyUnit[]) {
		moneyUnits.forEach(unit1 => {
			let flag: boolean = true;
			for(const unit2 of this._repository){
				const isEqualNominal = unit1.moneyInfo.denomination === unit2.moneyInfo.denomination;
				const isEqualCurrency = unit1.moneyInfo.currency === unit2.moneyInfo.currency;
				if (isEqualNominal && isEqualCurrency) {
					unit2.count += unit1.count;
					flag = false;
				}
			}
			if (flag) {
				this._repository.push(unit1);
			}
		})
	}
}