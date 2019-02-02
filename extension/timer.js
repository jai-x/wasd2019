const EventEmitter = require('events');
const lsCore = require('livesplit-core');
const timeUtil = require('./timeUtil');
const nodecg = require('./apiContext').get();

// Library constants for livesplit-core
const LS_TIMER_PHASE = {
  notRunning: 0,
  running: 1,
  ended: 2,
  paused: 3,
};

// Class to wrap functions from livesplit-core
class RunTimer extends EventEmitter {
  constructor() {
    super();
    // Create a run with a single segment `finish`
    const lsRun = lsCore.Run.new();
    lsRun.pushSegment(lsCore.Segment.new('finish'));
    // Create an instance with the single segment run
    this.timer = lsCore.Timer.new(lsRun);
    this.state = 'reset';
  }

  tick() {
    const ms = this.timer.currentTime().gameTime().totalSeconds() * 1000;
    this.emit('tick', ms, timeUtil.msToTimeString(ms), this.state);
  }

  start(forceTimeMs) {
    if (this.timer.currentPhase() === LS_TIMER_PHASE.notRunning) {
      // Timer must be started before initialising game times
      this.timer.start();
      // Set loading time of game time to `0`
      this.timer.setLoadingTimes(lsCore.TimeSpan.fromSeconds(0));
      // Set actual game time to `forceTimeSeconds` or `0`
      const start = (forceTimeMs || 0) / 1000;
      this.timer.setGameTime(lsCore.TimeSpan.fromSeconds(start));
    } else {
      this.timer.resume();
    }

    this.state = 'running';
    this.ticker = setInterval(this.tick.bind(this), 100);
  }

  pause() {
    if (this.timer.currentPhase() === LS_TIMER_PHASE.notRunning) {
      return; // Don't pause while not running
    }

    clearInterval(this.ticker);
    this.timer.pause();
    this.state = 'paused';
    this.tick();
  }

  reset() {
    // Don't reset while running
    if (this.timer.currentPhase() === LS_TIMER_PHASE.running) {
      return;
    }

    clearInterval(this.ticker);
    this.timer.pause();
    this.timer.reset();
    this.state = 'reset';
    this.tick();
  }
}

const timerRep = nodecg.Replicant('timer');
const instance = new RunTimer();

if (timerRep.value.state === 'running') {
  // Attempt to recover if exited while running
  const delta = Date.now() - timerRep.value.timestamp;
  const restart = timerRep.value.raw + delta;
  instance.start(restart);
  nodecg.log.warn(`Recovered RunTimer: Restarted from ${timeUtil.msToTimeString(restart)}`);
} else {
  // Reset on startup
  timerRep.value = {
    raw: 0,
    formatted: '00:00',
    state: 'reset',
    timestamp: Date.now(),
  };
}

instance.on('tick', (raw, formatted, state) => {
  timerRep.value = {
    raw,
    formatted,
    state,
    timestamp: Date.now(),
  };
});

nodecg.listenFor('timer.start', () => { instance.start(); });
nodecg.listenFor('timer.pause', () => { instance.pause(); });
nodecg.listenFor('timer.reset', () => { instance.reset(); });
