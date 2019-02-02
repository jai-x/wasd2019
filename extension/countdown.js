const EventEmitter = require('events');
const timeUtil = require('./timeUtil');
const nodecg = require('./apiContext').get();

class CountdownTimer extends EventEmitter {
  constructor() {
    super();
    this.state = 'paused';
    this.remainingMs = 300000; // 5 min
  }

  start(duration) {
    try {
      this.endtime = Date.now() + timeUtil.timeStringToMs(duration);
    } catch (e) {
      nodecg.log.warn('Invalid input to CountdownTimer.start:', duration);
      this.endtime = Date.now();
    }
    this.state = 'running';
    this.ticker = setInterval(this.tick.bind(this), 100);
  }

  pause() {
    clearInterval(this.ticker);
    this.state = 'paused';
    this.update();
  }

  update() {
    this.emit('tick', timeUtil.msToTimeString(this.remainingMs), this.state);
  }

  tick() {
    this.remainingMs = Math.max(this.endtime - Date.now(), 0);
    this.update();
    if (this.remainingMs === 0) {
      this.state = 'ended';
      this.update();
    }
  }
}

const countdownRep = nodecg.Replicant('countdown');
const instance = new CountdownTimer();
instance.on('tick', (formatted, state) => { countdownRep.value = { formatted, state }; });
instance.update(); // Broadcast reset state on startup

nodecg.listenFor('countdown.start', (msg) => { instance.start(msg); });
nodecg.listenFor('countdown.pause', () => { instance.pause(); });
