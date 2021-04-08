import { Currency } from '../enums';
import { IMoneyUnit, MoneyRepository } from '../task_1';

export class CurrencyConverterModule {
	private _moneyRepository: MoneyRepository;

	constructor(initialMoneyRepository: MoneyRepository) {
		this._moneyRepository = initialMoneyRepository;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit[]): IMoneyUnit[] {
		const K = fromCurrency === Currency.RUB ? 70 : 1/70;
		let res: IMoneyUnit[] = [];
		for (var e of moneyUnits) {
			res.push({ count: e.count, moneyInfo: {
					currency: toCurrency, denomination: (K * +e.moneyInfo.denomination).toString()
			}});
		}
		return res;
	}
}