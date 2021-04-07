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
/**
 * TODO:
 * 1. Second method
 * 2. Test everything
 * 3. Refactor the first method
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

type repoType = {[currency: string]: Array<IMoneyUnit>};

export class MoneyRepository{
	private _repository: repoType;

	constructor(initialRepository: repoType) {
		for (let currency in initialRepository){
			initialRepository[currency].sort(this.compareMoneyDenom);
		}
		this._repository = initialRepository;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		let currencyStr: string = currency.toString();
		let givenMoneyCount: {[denom: string] : number};
		for (let moneyUnit of this._repository[currencyStr]){
			if (count === 0)
				break;

			const denomination = Number(moneyUnit.moneyInfo.denomination);
			if (count > denomination){
				const denomCountNeeded = Math.floor(count / denomination);
				const denomCountToGive = denomCountNeeded <= moneyUnit.count ?
					denomCountNeeded : moneyUnit.count;
				count -= denomCountToGive * denomination;

				givenMoneyCount[denomination.toString()] = denomCountToGive;
			}
		}

		if (count === 0){
			for (let moneyUnit of this._repository[currencyStr]){
				const denomination = moneyUnit.moneyInfo.denomination;
				moneyUnit.count -= givenMoneyCount[denomination.toString()];
			}

			return true;
		}

		return false;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): number {
		moneyUnits.sort(this.compareMoneyDenom);

		let sum = 0;
		for (let moneyUnit of moneyUnits){
			const currency = moneyUnit.moneyInfo.currency.toString();
			for (let moneyUnitInRepo of this._repository[currency]){
				if (moneyUnit.moneyInfo.denomination
					== moneyUnitInRepo.moneyInfo.denomination){
					moneyUnitInRepo.count += moneyUnit.count;
					sum += moneyUnit.count;
					break;
				}
			}
		}

		return sum;
	}

	private compareMoneyDenom(a: IMoneyUnit, b: IMoneyUnit): number{
		if (a.moneyInfo.denomination.length > b.moneyInfo.denomination.length)
			return -1;
		if (a.moneyInfo.denomination.length < b.moneyInfo.denomination.length)
			return 1;
	
		return a.moneyInfo.denomination > b.moneyInfo.denomination ? -1 : 1;
	}
}
