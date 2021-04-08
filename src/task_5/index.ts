import { Currency, UserSettingOptions } from '../enums';
import { IMoneyUnit, MoneyRepository } from '../task_1';
import { BankOffice, IBankUser, ICard } from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';

class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;
	private _usersCard: ICard;

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
		this._moneyRepository = initMoneyRepository;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
		this._bankOffice = initBankOffice;
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
		if (!this._bankOffice.authorize(user.id, card.id, cardPin)) return false;
		this._authorizedUser = user;
		this._usersCard = card;
		return true;
	}

	public takeUsersMoney(moneyUnits: IMoneyUnit[]): boolean {
		if (!this._authorizedUser) return false;
		this._moneyRepository.takeMoney(moneyUnits);
		const sum = moneyUnits.reduce((sum, unit) => {
			return sum + unit.count * (+unit.moneyInfo.denomination.match(/\d/g).join(''));}, 0);
		this._usersCard.balance += sum;
		return true;
	}

	public giveOutUsersMoney(count: number): boolean {
		if (!this._authorizedUser || this._usersCard.balance < count)  return false;
		this._usersCard.balance -= count;
		return true;
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		if (!this._authorizedUser) return false;
		if (this._userSettingsModule.changeUserSettings(option, argsForChangeFunction)) return true;
		this._userSettingsModule.user = this._authorizedUser;
		return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit[]): boolean {
		const sum = moneyUnits.reduce((sum, unit) => {
			return sum + unit.count * (+unit.moneyInfo.denomination.match(/\d/g).join(''));}, 0);
		if (!this.giveOutUsersMoney(sum)) return false;
		return this.takeUsersMoney(this._currencyConverterModule
			.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits));
	}
}