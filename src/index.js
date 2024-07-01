import createHash from 'hash-generator';
import tmpStyles from './index.scss';

const ID = `fps-meter-${createHash(16)}`;
const styles = tmpStyles.replace('fps-meter-tmp-id', ID);

const currentScript = document.currentScript;
const params = {
  show: currentScript.hasAttribute('data-show'),
  log: currentScript.hasAttribute('data-log'),
  className: currentScript.getAttribute('data-class-name'),
  interval: (Number(currentScript.getAttribute('data-interval')) || 500),
  namespace: (currentScript.getAttribute('data-namespace') || 'fpsMeter')
};

let element;
let styleElement;
let fps;
let isRunning = false;
let startTime;
let frameCount;
let frameRequestID;

function _log(message) {
  // eslint-disable-next-line no-console
  if (params.log) console.log(`FPS Meter: ${message}`);
}

function _update() {
  if (element) element.innerText = (fps || '--');
}

function _tick() {
  const time = Date.now();
  frameCount++;
  if (time - startTime > params.interval) {
    fps = Math.floor(frameCount / ((time - startTime) / 1000));
    _update();
    startTime = time;
    frameCount = 0;
  }
  if (isRunning) {
    frameRequestID = window.requestAnimationFrame(_tick);
  }
}

function show() {
  if (isRunning) return;
  isRunning = true;
  fps = undefined;
  startTime = Date.now();
  frameCount = 0;

  styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  element = document.createElement('div');
  element.id = ID;
  if (params.className) element.className = params.className;
  _update();
  document.body.appendChild(element);

  frameRequestID = window.requestAnimationFrame(_tick);
  _log('Shown.');
}

function hide() {
  if (!isRunning) return;
  isRunning = false;

  if (frameRequestID) {
    cancelAnimationFrame(frameRequestID);
    frameRequestID = undefined;
  }

  styleElement.remove();
  styleElement = undefined;
  element.remove();
  element = undefined;

  _log('Hidden.');
}

function _init() {
  window[params.namespace] = { show, hide };
  _log('Initiated.');
  if (params.show) show();
}

if (document.readyState === 'complete') {
  _init();
} else {
  window.addEventListener('load', _init);
}
