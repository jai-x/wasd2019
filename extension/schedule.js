const fs = require('fs');
const path = require('path');
const nodecg = require('./apiContext').get();

const scheduleRep = nodecg.Replicant('schedule');

let current = 0;
let runs = [];

/* Run format
{
    runners: ['No Runner'],
    category: 'No Category',
    estimate: '00:00',
    game: 'No Game',
    release_year: '1970',
    platform: 'No Platform',
} */

const update = () => {
  scheduleRep.value = { runs, current };
  // console.log(scheduleRep.value.runs[scheduleRep.value.current]);
};

const runPath = path.resolve(__dirname, '..', 'runs.json');
const load = () => {
  current = 0;
  try {
    const data = fs.readFileSync(runPath, { encoding: 'utf-8' });
    runs = JSON.parse(data);
  } catch(e) {
    nodecg.log.error(e);
    runs = [];
  }
  update();
};

nodecg.listenFor('schedule.next', () => {
  if (current === runs.length - 1) {
    return;
  }
  current += 1;
  update();
});

nodecg.listenFor('schedule.prev', () => {
  if (current === 0) {
    return;
  }
  current -= 1;
  update();
});

nodecg.listenFor('schedule.reload', () => { load(); });

load();
