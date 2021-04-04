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
		let moneyUnitsToGiveOut: Array<IMoneyUnit> = this.convertCountToMoneyUnits(count, currency);
		if (moneyUnitsToGiveOut !== null) {
			moneyUnitsToGiveOut.forEach(e => this.giveOutMoneyUnit(e));
			return true;
		} else {
			return false;
		}
	}

	public convertCountToMoneyUnits(count: number, currency: Currency, addMode = false): Array<IMoneyUnit> {
		let moneyUnits: Array<IMoneyUnit> = [];

		let denominations: any;
		if (currency === Currency.RUB) {
			denominations = {
				"5000": 0,
				"2000": 0,
				"1000": 0,
				"500": 0,
				"200": 0,
				"100": 0,
				"50": 0
			};
		} else {
			if (currency === Currency.USD) {
				denominations = {
					"100": 0,
					"50": 0,
					"20": 0,
					"10": 0,
					"5": 0,
					"2": 0,
					"1": 0
				};
			} else {
				return null;
			}
		}

		let keys = Object.keys(denominations).reverse();
		for (let denomination of keys) {
			if (count < Number(denomination)) continue;

			let moneyUnit = this.getMoneyUnit(denomination, currency);
			if (moneyUnit === null || moneyUnit.count === 0) continue;

			let div = Math.floor(count / Number(denomination));
			if (div <= moneyUnit.count || addMode) {
				count -= div * Number(denomination);
				denominations[denomination] = div;
			} else {
				count -= moneyUnit.count * Number(denomination);
				denominations[denomination] = moneyUnit.count;
			}
		}

		if (count === 0) {
			for (let denomination in denominations) {
				if (denominations[denomination] > 0) {
					let moneyUnit: IMoneyUnit = {
						moneyInfo: {
							denomination,
							currency,
						},
						count: denominations[denomination],
					}
					moneyUnits.push(moneyUnit);
				}
			}
			return moneyUnits;
		}

		return null;
	}

	private giveOutMoneyUnit(moneyUnit: IMoneyUnit): void {
		for (let repositoryItem of this._repository) {
			if (this.isMoneyInfoEqual(repositoryItem.moneyInfo, moneyUnit.moneyInfo)) {
				repositoryItem.count -= moneyUnit.count;
			}
		}
	}

	private getMoneyUnit(denomination: string, currency: Currency): IMoneyUnit {
		for (let repositoryItem of this._repository) {
			if (this.isMoneyInfoEqual(repositoryItem.moneyInfo, { denomination, currency })) {
				return repositoryItem;
			}
		}
		return null;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): void {
		for (let moneyUnit of moneyUnits) {
			let isInRepository: boolean = false;

			for (let repositoryItem of this._repository) {
				if (this.isMoneyInfoEqual(moneyUnit.moneyInfo, repositoryItem.moneyInfo)) {
					repositoryItem.count += moneyUnit.count;
					isInRepository = true;
					break;
				}
			}

			if (!isInRepository) {
				this._repository.push(moneyUnit);
			}
		}
	}

	private isMoneyInfoEqual(moneyInfo1: IMoneyInfo, moneyInfo2: IMoneyInfo): boolean {
		if (moneyInfo1.currency === moneyInfo2.currency
			&& moneyInfo1.denomination === moneyInfo2.denomination)
			return true;
		return false;
	}
}