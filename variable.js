export const circleInterval = 50;

export const gameName = 'Higher or Lower';

export const textStyle = {
  fontFamily: 'Oswald',
  fontSize: '22px',
  color: '#FFFFE4',
  resolution: (window.devicePixelRatio = 8),
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

let preWidth;
let preHeight;

if (window.innerWidth > 1000) {
  preWidth = 1000;
} else {
  preWidth = window.innerWidth;
}

if (window.innerHeight > 600) {
  preHeight = 600;
} else {
  preHeight = window.innerHeight - 20;
}

export const width = preWidth;
export const height = preHeight;

export const scale = width / height;
