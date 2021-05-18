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
		this._repository = this._repository.sort((a, b) =>
			parseInt(a.moneyInfo.denomination) > parseInt(b.moneyInfo.denomination) ? 1 : 0);
		for (let unit of this._repository) {
			if (unit.moneyInfo.currency !== currency) continue;
			if (count === 0) break;
			let denomination: number = parseInt(unit.moneyInfo.denomination)
			while (count >= denomination && unit.count !== 0) {
				count -= denomination;
				unit.count--;
			}
		}
		return count === 0;
	}

	public takeMoney(moneyUnits: IMoneyUnit[]): void {
		moneyUnits.forEach(unit => {
			let unitsFromRepository : IMoneyUnit[] = this._repository.filter(
				x => x.moneyInfo.currency === unit.moneyInfo.currency
					&& x.moneyInfo.denomination === unit.moneyInfo.denomination)
			if (unitsFromRepository.length !== 0)
				unitsFromRepository[0].count++;
			else this._repository.push(unit);
		})
	}
}