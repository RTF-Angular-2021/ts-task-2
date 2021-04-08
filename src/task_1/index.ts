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

	private order(a: IMoneyUnit, b: IMoneyUnit): number{
		return a.moneyInfo.denomination.length > b.moneyInfo.denomination.length ? -1 :
		a.moneyInfo.denomination.length < b.moneyInfo.denomination.length ? 1 :
		a.moneyInfo.denomination > b.moneyInfo.denomination ? -1 : 1;
	}

	public giveOutMoney(count: number, currency: Currency): boolean {
		let temp = count;
		const dollars = [1, 2, 5, 10, 20, 50, 100];
		const rubles = [10, 50, 100, 500, 1000, 5000];
		this._repository.forEach(e => {
			for (let key in e)
                if (e['moneyInfo']['currency'] === currency && temp >= e['count'] 
				&& (rubles.includes(e['count']) || dollars.includes(e['count']))) {
                    temp -= e['count'];
                    e['count'] = 0;
                } 
		});
		return temp === 0;
	}

	public takeMoney(moneyUnits: Array<IMoneyUnit>): number {
		moneyUnits.sort(this.order);
		let res = 0;
		for (let e of moneyUnits){
			const currency = e.moneyInfo.currency.toString();
			for (let moneyUnitInRepo of this._repository[currency])
				if (e.moneyInfo.denomination === moneyUnitInRepo.moneyInfo.denomination) {
					moneyUnitInRepo.count += e.count;
					res += e.count;
					break;
				}
		}
		return res;
	}
}
