import {Currency} from '../enums';
import {IMoneyUnit, MoneyRepository} from "../task_1";

export class CurrencyConverterModule {
	private _moneyRepository: MoneyRepository;

	constructor(initialMoneyRepository: MoneyRepository) {
		this._moneyRepository = initialMoneyRepository;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
		if (fromCurrency === toCurrency) return 0;
		let denomination = parseInt(moneyUnits.moneyInfo.denomination);
		switch (fromCurrency) {
			case Currency.RUB:
				if (this._moneyRepository.giveOutMoney(moneyUnits.count * denomination / 70, toCurrency))
					return moneyUnits.count * denomination / 70;
				break;
			case Currency.USD:
				if (this._moneyRepository.giveOutMoney(moneyUnits.count * denomination * 70, toCurrency))
					return moneyUnits.count * denomination * 70;
		}
		return 0;
	}
}