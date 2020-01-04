export const missions = [
	{
		guid: 1,
		name:"Операция «Патифон»",
		mods: "rhs",
		island: "Altis",
		players: 200,
		author: "Вася",
		rateAvg: 1,
		lastPlayed: 1547236800000
	},
	{
		guid: 2,
		name:"Операция «Дрозды»",
		mods: "rhs",
		island: "Chernarus",
		players: 196,
		author: "Вася",
		rateAvg: 1,
		lastPlayed: 1552507200000
	},
	{
		guid: 3,
		name:"Операция «Ночная атака»",
		mods: "rhs",
		island: "Takistan",
		players: 130,
		author: "Коля",
		rateAvg: 3,
		lastPlayed: 1552507200000
	},
	{
		guid: 4,
		name:"Операция «Какая то гора»",
		mods: "rhs",
		island: "Takistan",
		players: 205,
		author: "Григорий",
		rateAvg: 3,
		lastPlayed: 1559764800000
	},
	{
		guid: 5,
		name:"Операция «Многабукф»",
		mods: "rhs",
		island: "Altis",
		players: 198,
		author: "Коля",
		rateAvg: 4,
		lastPlayed: 1559764800000
	},
	{
		guid: 6,
		name:"Операция «Безысходность»",
		mods: "vanila",
		island: "Altis",
		players: 197,
		author: "Кукуцаполь",
		rateAvg: 1,
		lastPlayed: 1571428800000
	},
	{
		guid: 7,
		name:"Операция «Абракадабра»",
		mods: "rhs",
		island: "Altis",
		players: 190,
		author: "Коля",
		rateAvg: 5,
		lastPlayed: 1571428800000
	},
	{
		guid: 8,
		name:"Операция «Гриффендорф»",
		mods: "vanila",
		island: "Altis",
		players: 100,
		author: "Епифонтий",
		rateAvg: 3,
		lastPlayed: 1568404800000
	},
	{
		guid: 9,
		name:"Операция «Тимон и Пумба»",
		mods: "rhs",
		island: "Stratis",
		players: 198,
		author: "Вася",
		rateAvg: 3,
		lastPlayed: 1570824000000
	},
	{
		guid: 10,
		name:"Операция «Лиса в курятнике»",
		mods: "vanila",
		island: "Altis",
		players: 161,
		author: "Вася",
		rateAvg: 5,
		lastPlayed: 1570651200000
	},
	{
		guid: 11,
		name:"Операция «Тусклый свет»",
		mods: "rhs",
		island: "Stratis",
		players: 188,
		author: "Андрей",
		rateAvg: 2,
		lastPlayed: 1570651200000
	},
] 

export const fakeGetData = () => {
	return new Promise(resolve => {
		resolve({
			json: () => {
				return new Promise(resolve => {
					resolve(missions)
				})
			}
		})
	})
}