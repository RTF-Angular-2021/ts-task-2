import { Currency } from "./enums";

interface IMoneyInfo {
	denomination: string;
	currency: Currency;
}

export type TCash = {
	count: number;
	denomination: string;
	currency: number;
}

export interface IMoneyUnit {
	moneyInfo: IMoneyInfo;
	count: number;
}

export interface ICard {
	id: string;
	balance: number;
	currency: Currency,
	pin: string,
}

export interface IBankUser {
	id: string;
	name: string;
	surname: string;
	cards: Array<ICard>;
}