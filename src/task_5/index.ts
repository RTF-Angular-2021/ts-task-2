import {Currency, UserSettingOptions} from '../enums';
import {IMoneyUnit, MoneyRepository} from '../task_1';
import {BankOffice, IBankUser, ICard} from '../task_2';
import {UserSettingsModule} from '../task_3';
import {CurrencyConverterModule} from '../task_4';

class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;

	constructor(initBankOffice: any, initMoneyRepository: any) {
		this._moneyRepository = initMoneyRepository;
		this._bankOffice = initBankOffice;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
		if (this._bankOffice.authorize(user.id, card.id, cardPin)) {
			this._authorizedUser = user;
			return true;
		}
		return false;
	}

	public takeUsersMoney(moneyUnits: IMoneyUnit[]): void {
		if (this._authorizedUser)  this._moneyRepository.takeMoney(moneyUnits);
	}

	public giveOutUsersMoney(count: number, currency : Currency): boolean {
		if (this._authorizedUser)
			return this._moneyRepository.giveOutMoney(count, currency);
		return false;
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		if (this._authorizedUser)
			return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction)
		return false;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit) : boolean {
		if (this._authorizedUser)
			return Boolean(this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits));
		return false;
	}
}