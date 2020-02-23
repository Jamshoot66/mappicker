export let missionItem = {
  guid: 1,
  name: 'string',
  mods: 'string', // "vanila" or "rhs"
  island: 'string',
  players: 200,
  author: 'string',
  rateAvg: 3,
  // syncRateState : "string" // - computed by app PENDING, ERROR, DONE // optional
  lastPlayed: 'string',
  // probability: 0.25 - computed by app // optional
};

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

export let scheduleMission = {
  date: 'sting',
  guid: 1,
};

export const islandList = [
  'altis',
  'beketov',
  'bozcaada',
  'bukovina',
  'bystrica',
  'chernarus',
  'chernarus_2020',
  'chernarus_summer',
  'chernarus_winter',
  'deniland',
  'desert',
  'dingor',
  'emita',
  'enoch',
  'fallujah',
  'fata',
  'hellanmaa',
  'Isla_abramia',
  'lingor',
  'lythium',
  'malden',
  'porto',
  'prei_khmaoch_luong',
  'proving_grounds',
  'rahmadi',
  'reshmaan_province',
  'ruha',
  'sahrani',
  'shapur',
  'southrn_sahrani',
  'stratis',
  'takistan',
  'takistan_mountains',
  'tanoa',
  'tem_anizay',
  'united_sahrani',
  'utes',
  'virtual_reality',
  'virolahti',
  'wl_rosche',
  'yellowstone',
  'zargabad',
];
