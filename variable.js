export const width = 1000;
export const height = 600;
export const circleInterval = 50;

export const gameName = 'Higher or Lower';

export const textStyle = {
  fontFamily: 'Oswald',
  fontSize: '24px',
  color: '#FFFFE4',
  resolution: (window.devicePixelRatio = 4),
  align: 'center',
};

export let currRound = 1;
export const roundDurationSec = 10;
export const roundBeginInSec = 10;
export const numOfRounds = 5;
export const gameHeader = `${numOfRounds} ROUND SURVIVAL`;

export const conditions = 'NUMBERS RANGE FROM\n1 TO 21';

export const randomNum = () => {
  let result = Math.floor(Math.random() * 21) + 1;
  return result;
};
