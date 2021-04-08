import { UserSettingOptions } from '../enums';
import { IBankUser, BankOffice } from '../task_2';

export class UserSettingsModule {
	private _bankOffice: BankOffice;
	private _user: IBankUser;

	public set user(user: IBankUser) {
		this._user = user;
	}

	constructor(initialBankOffice: BankOffice) {
		this._bankOffice = initialBankOffice;
	}

	private changeUserName(newName: string): boolean {
		return newName === this._user.name;
	}

	private changeUserSurname(newSurname: string): boolean {
		return newSurname === this._user.surname;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		if(this._bankOffice.isCardTiedToUser(newCardId) || !this._user.cards) return false;
		this._user.cards[0]['id'] = newCardId;
		return true;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		return argsForChangeFunction === option[0] ? this.changeUserName(argsForChangeFunction) :
		argsForChangeFunction === option[1] ? this.changeUserSurname(argsForChangeFunction) :
		this.registerForUserNewCard(argsForChangeFunction);
	}
}
