export const missionItem = {
  guid: 1,
  name: "string",
  mods: "string", // "vanila" or "rhs"
  island: "string",
  players: 200,
  author: "string",
  rateAvg: 3,
  // syncRateState : "string" // - computed by app PENDING, ERROR, DONE // optional
  lastPlayed: "string",
  // probability: 0.25 - computed by app // optional
  // tags: '#tag,#tag2'
}

/*
guid: 1
name: "roket"
mods: "rhs"
island: "altis"
players: "197"
author: "Qwe"
rateAvg: 3
lastPlayed: 1550088000000

fileName: "rbc_197_roket_v2.altis"
link: "qwe"
*/

/*
autor: "Коля"
guid: "BCjf1DOuLT6e8h07zT9Q"
island: "Takistan"
lastPlayed: 123456
mods: "rhs"
name: "Операция «Ночная атака»"
players: 130
rateAvg: 2.75
*/

export const scheduleMission = {
  date: "string",
  guid: 1
}

export const tags = {
  actual: '#актуальная',
  aircrafts: '#самолеты',
  tanks: '#тяжелаятехника',
  apcs: '#легкаятехника',
  helicopters: '#вертолеты',
}