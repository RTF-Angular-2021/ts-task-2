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

import { Currency } from '../enums';
import { IMoneyUnit, TCash } from '../types';



export class MoneyRepository {
	private _repository: IMoneyUnit[];
	constructor(initialRepository: IMoneyUnit[]) {
		this._repository = initialRepository;
	}

	public giveOutMoney(count: number, currency: number): boolean {
		let newArr: Array<TCash> = [];
		let i = 0;
		let creminder = count;

		while (i < this._repository.length) {
			let coincounter = 0;
			while (Number(this._repository[i].moneyInfo.denomination) <= creminder && this._repository[i].moneyInfo.currency === currency && this._repository[i].count !== 0) {
				creminder = creminder - Number(this._repository[i].moneyInfo.denomination);
				coincounter++;
				this._repository[i].count -= 1;
			}

			if (coincounter !== 0) {
				newArr.push({
					count: coincounter,
					denomination: this._repository[i].moneyInfo.denomination,
					currency: this._repository[i].moneyInfo.currency
				})
			}
			i++;
		}
		console.log(newArr); //массив, который показывает какие купюры сняли и их количество 

		if (creminder == 0) { //если остаток 0 - пользовтель получил все деньги и купюр хватило 
			return true;
		} else { //если бабки снять не получилось, то мы возвращаем их обратно в _repository
			newArr.forEach(item => {
				this._repository.forEach(el => {
					if (item.currency === el.moneyInfo.currency && item.denomination === el.moneyInfo.denomination) {
						el.count += item.count;
					}
				})
			})
			return false;
		}
	}

	public takeMoney(moneyUnits: IMoneyUnit[]): boolean {

		let arrOfTakenMoney = moneyUnits.map(item => {
			return this._repository.some(el => {
				if (el.moneyInfo.currency === item.moneyInfo.currency && el.moneyInfo.denomination === item.moneyInfo.denomination) {
					el.count += item.count;
					return true;
				}
				return false;
			})
		})

		return arrOfTakenMoney.every(item => item === true);

	}
}

let arrOfMoney = [
	{
		moneyInfo: {
			denomination: "1000",
			currency: Currency.RUB
		},
		count: 10
	},
	{
		moneyInfo: {
			denomination: "500",
			currency: Currency.RUB
		},
		count: 100
	},
	{
		moneyInfo: {
			denomination: "200",
			currency: Currency.RUB
		},
		count: 15
	},
	{
		moneyInfo: {
			denomination: "100",
			currency: Currency.USD
		},
		count: 20
	},
	{
		moneyInfo: {
			denomination: "100",
			currency: Currency.RUB
		},
		count: 15
	},
	{
		moneyInfo: {
			denomination: "50",
			currency: Currency.USD
		},
		count: 15
	},
	{
		moneyInfo: {
			denomination: "50",
			currency: Currency.RUB
		},
		count: 50
	},
	{
		moneyInfo: {
			denomination: "10",
			currency: Currency.USD
		},
		count: 30
	},
	{
		moneyInfo: {
			denomination: "10",
			currency: Currency.RUB
		},
		count: 100
	},
	{
		moneyInfo: {
			denomination: "5",
			currency: Currency.USD
		},
		count: 30
	},
	{
		moneyInfo: {
			denomination: "1",
			currency: Currency.USD
		},
		count: 15
	}

]

let cards = [
	{
		id: "0",
		balance: 10000,
		currency: Currency.RUB,
		pin: "0000"
	},
	{
		id: "1",
		balance: 1000,
		currency: Currency.RUB,
		pin: "0001"
	},
	{
		id: "2",
		balance: 8000,
		currency: Currency.RUB,
		pin: "0002"
	},
	{
		id: "3",
		balance: 35000,
		currency: Currency.RUB,
		pin: "0003"
	},
	{
		id: "4",
		balance: 70000,
		currency: Currency.RUB,
		pin: "0004"
	},
	{
		id: "5",
		balance: 2000,
		currency: Currency.USD,
		pin: "0005"
	},
	{
		id: "6",
		balance: 5000,
		currency: Currency.USD,
		pin: "0006"
	},
	{
		id: "7",
		balance: 500,
		currency: Currency.USD,
		pin: "0007"
	},
	{
		id: "8",
		balance: 500,
		currency: Currency.USD,
		pin: "0008"
	},
	{
		id: "9",
		balance: 1500,
		currency: Currency.USD,
		pin: "0009"
	},
	{
		id: "10",
		balance: 7500,
		currency: Currency.USD,
		pin: "0010"
	},
]

let users = [
	{
		id: "1",
		name: "Grisha",
		surname: "Petrov",
		cards: [
			{
				id: "7",
				balance: 500,
				currency: Currency.USD,
				pin: "0007"
			},
			{
				id: "0",
				balance: 10000,
				currency: Currency.RUB,
				pin: "0000"
			}
		]
	},
	{
		id: "2",
		name: "Alex",
		surname: "Melik",
		cards: [
			{
				id: "6",
				balance: 5000,
				currency: Currency.USD,
				pin: "0006"
			},
		]
	},
	{
		id: "3",
		name: "Artem",
		surname: "Kojevnikov",
		cards: [
			{
				id: "1",
				balance: 1000,
				currency: Currency.RUB,
				pin: "0001"
			},
		]
	},
	{
		id: "4",
		name: "Grisha",
		surname: "Balagov",
		cards: [
			{
				id: "2",
				balance: 8000,
				currency: Currency.RUB,
				pin: "0002"
			},
		]
	},
	{
		id: "5",
		name: "Sveta",
		surname: "Milavina",
		cards: [
			{
				id: "4",
				balance: 70000,
				currency: Currency.RUB,
				pin: "0004"
			},
			{
				id: "5",
				balance: 2000,
				currency: Currency.USD,
				pin: "0005"
			},
		]
	},
	{
		id: "6",
		name: "Masha",
		surname: "Hudina",
		cards: [

		]
	},
	{
		id: "7",
		name: "Hana",
		surname: "Look",
		cards: [

		]
	},
]
