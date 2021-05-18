import {UserSettingOptions} from '../enums';
import {BankOffice, IBankUser} from "../task_2";

export class UserSettingsModule {
	private _bankOffice: BankOffice;
	private _user: IBankUser;

	public set user(user: IBankUser) {
		this._user = user;
	}

	constructor(initialBankOffice: BankOffice) {
		this._bankOffice = initialBankOffice;
	}

	private TryToChangeUser(property : string, value : string) : boolean {
		if (this._user && value.length > 0) {
			this[property] = value;
			return true;
		}
		return false;
	}

	private changeUserName(newName: string): boolean {
		return this.TryToChangeUser("name", newName);
	}

	private changeUserSurname(newSurname: string): boolean {
		return this.TryToChangeUser("surname", newSurname);
	}

	private registerForUserNewCard(newCardId: string): boolean {
		let card = this._bankOffice.getCardById(newCardId);
		if (!this._user || !card || this._bankOffice.isCardTiedToUser(newCardId))
			return false;
		this._user.cards.push(card);
		return true;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		switch (option) {
			case UserSettingOptions.name:
				return this.changeUserName(argsForChangeFunction);
			case UserSettingOptions.newCard:
				return this.registerForUserNewCard(argsForChangeFunction);
			case UserSettingOptions.surname:
				return this.changeUserSurname(argsForChangeFunction);
		}
	}
}