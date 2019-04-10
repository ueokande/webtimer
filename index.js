const color2 = '#E0E0E0';

const colorAlert = '#FF70A6';
const colorNormal = '#70D6FF'

const backgroundImage = (value, colorBar, colorBack) => {
  if (value < .5) {
    let nextdeg = 90 + value * 360;
    return `linear-gradient(90deg, ${colorBack} 50%, transparent 50%, transparent),
 linear-gradient(${nextdeg}deg, ${colorBar} 50%, ${colorBack} 50%, ${colorBack})`;

  } else {
    let nextdeg = -90 + 360 * (value - .5);
    return `linear-gradient(${nextdeg}deg, ${colorBar} 50%, transparent 50%, transparent),
 linear-gradient(270deg, ${colorBar} 50%, ${colorBack} 50%, ${colorBack})`;
  }
}

const formatTime = (millis) => {
  let min = Math.floor(millis / 1000 / 60)
  let sec = Math.floor(millis / 1000 % 60)
  if (sec < 10) {
    return `${min}:0${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

const timerParamValue = () => {
  let params = location.search.split('?');
  for (let kv of params) {
    let [key, value] = kv.split('=');
    if (key === 'timer') {
      return Number(value);
    }
  }
  return NaN;
}

let maxMillis = 10 * 60 * 1000;
let paramValue = timerParamValue();
if (!isNaN(paramValue)) {
  maxMillis = paramValue;
}

let startTime = Date.now();

const loop = () => {
  let rest = Math.min(Date.now() - startTime, maxMillis);
  let value = 1 - rest / maxMillis;

  let textCurrent = formatTime(maxMillis - rest);
  let textMax = formatTime(maxMillis);

  document.querySelector('#text-current').textContent = textCurrent;
  document.querySelector('#text-max').textContent = textMax;

  let div = document.querySelector('#timer');
  if (value < .2) {
    div.style.backgroundImage = backgroundImage(value, colorAlert, color2);
  } else {
    div.style.backgroundImage = backgroundImage(value, colorNormal, color2);
  }

  if (rest <= 0) {
    return;
  }
  setTimeout(loop, 100)
};

setTimeout(loop, 100);
