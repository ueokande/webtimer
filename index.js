let params = {
  max: 600000,
  color1: '#70D6FF',
  color2:  '#FF70A6',
};

const initParams = () => {
  for (let kv of location.search.slice(1).split('&')) {
    let [key, value] = kv.split('=');
    if (key === 'timer') {
      let v = Number(value);
      if (!isNaN(v)) {
        params.max = v;
      }
    }
  }
};

const backgroundImage = (value, colorBar) => {
  let bgColor = '#E0E0E0';
  if (value < .5) {
    let deg = 90 + value * 360;
    return `linear-gradient(90deg, ${bgColor} 50%, transparent 50%, transparent),
linear-gradient(${deg}deg, ${colorBar} 50%, ${bgColor} 50%, ${bgColor})`;

  } else {
    let deg = -90 + 360 * (value - .5);
    return `linear-gradient(${deg}deg, ${colorBar} 50%, transparent 50%, transparent),
linear-gradient(270deg, ${colorBar} 50%, ${bgColor} 50%, ${bgColor})`;
  }
}

const formatTime = (millis) => {
  let min = Math.floor(Math.ceil(millis / 1000) / 60)
  let sec = Math.ceil(millis / 1000) % 60
  if (sec < 10) {
    return `${min}:0${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

const updateFavicon = (value, color) => {
  let favicon = document.querySelector('#favicon');

  var canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext('2d');
  var img = document.createElement('img');
  img.crossOrigin = "Anonymous";
  img.src = favicon.href;

  context.beginPath();
  context.arc(16 / 2 , 16 / 2, 16 / 3, -Math.PI / 2, -Math.PI/2 + Math.PI * 2 * value);
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.stroke();

  favicon.href = canvas.toDataURL('image/png');
};

const updateBar = (value, color) => {
  let div = document.querySelector('#timer');
  div.style.backgroundImage = backgroundImage(value, color);
}

let startTime = Date.now() - 1;

const loop = () => {
  let spent = Math.min(Date.now() - startTime, params.max);
  let value = 1 - spent / params.max;

  let textCurrent = formatTime(params.max - spent);
  let textMax = formatTime(params.max);

  document.title = `${textCurrent}/${textMax}`
  document.querySelector('#text-current').textContent = textCurrent;
  document.querySelector('#text-max').textContent = textMax;

  if (value > .2) {
    updateBar(value, params.color1);
    updateFavicon(value, params.color1);
  } else {
    updateBar(value, params.color2);
    updateFavicon(value, params.color2);
  }

  if (spent > params.max) {
    return;
  }

  window.requestAnimationFrame(loop);
};

initParams();
loop();
