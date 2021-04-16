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

	private _sortRepository() {
		this._repository.sort((a, b) => {
			const tmpA = Number(a.moneyInfo.denomination.match(/\d/g).join());
			const tmpB = Number(b.moneyInfo.denomination.match(/\d/g).join());
			return tmpA > tmpB ? -1 : 1;
		});
	}

	private _removeFromRepos(pairArray: [number, IMoneyUnit][]) {
		for(const pair of pairArray) {
			pair[1].count -= pair[0];
		}
	}

	private _createMoneyUnitFromUnit(count: number, unit: IMoneyUnit): IMoneyUnit {
		return {
			moneyInfo: {
				denomination: unit.moneyInfo.denomination,
				currency: unit.moneyInfo.currency,
			},
			count: count,
		}
	}

	public giveOutMoney(count: number, currency: Currency): IMoneyUnit[] {
		this._sortRepository();
		//Промежуточное хранилище для того, чтобы фиксировать денеж. ед, которые надо будет удалить, если удасться "жадно" набрать сумму из хранилища 
		const countDenominationsPair: [number, IMoneyUnit][] = [];
		const result: IMoneyUnit[] = [];
		for(const unit of this._repository) {
			const denomination = Number(unit.moneyInfo.denomination.match(/\d/g).join());
			if(denomination <= count) {
				const tmpCount = Math.floor(count / denomination);
				const val = tmpCount <= unit.count ? tmpCount : unit.count;
				count -= val === tmpCount ? val * denomination : unit.count * denomination;
				countDenominationsPair.push([val, unit]);
				result.push(this._createMoneyUnitFromUnit(val, unit));
				if (count === 0) {
					//Ниже следует метод для изъятия из хранилища купюр.
					this._removeFromRepos(countDenominationsPair);
					return result;
				}
			}
		}
		return null;
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
