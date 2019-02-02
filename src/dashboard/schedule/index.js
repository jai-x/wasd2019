import m from 'mithril';
import styles from './styles.css';
import common from '../panels.css';

const scheduleRep = window.nodecg.Replicant('schedule');

class LabelColumn {
  view() {
    return m('div', { class: styles.run_column },
      m('div', 'Label'),
      m('div', { class: styles.run_field }, 'Runner(s):'),
      m('div', { class: styles.run_field }, 'Category'),
      m('div', { class: styles.run_field }, 'Estimate'),
      m('div', { class: styles.run_field }, 'Game'),
      m('div', { class: styles.run_field }, 'Release year'),
      m('div', { class: styles.run_field }, 'Platform'));
  }
}

class RunColumn {
  view(vnode) {
    const { attrs: { run } } = vnode;
    if (!run) {
      return null;
    }
    return m('div', { class: styles.run_column },
      m('div', vnode.attrs.title),
      m('div', { class: styles.run_field }, run.runners.join(', ')),
      m('div', { class: styles.run_field }, run.category),
      m('div', { class: styles.run_field }, run.estimate),
      m('div', { class: styles.run_field }, run.game),
      m('div', { class: styles.run_field }, run.release_year),
      m('div', { class: styles.run_field }, run.platform));
  }
}

class ScheduleControl {
  view() {
    const i = scheduleRep.value.current;
    const now = scheduleRep.value.runs[i];
    const next = scheduleRep.value.runs[i + 1];

    return m('div', { class: common.column },
      m('div', { class: common.row },
        m(LabelColumn),
        m(RunColumn, { title: 'Now', run: now }),
        m(RunColumn, { title: 'Next', run: next })),
      m('div', { class: common.row },
        m('button', {
          class: common.button,
          onclick: () => { window.nodecg.sendMessage('schedule.prev'); },
        }, 'Prev'),
        m('button', {
          class: common.button,
          onclick: () => { window.nodecg.sendMessage('schedule.reload'); },
        }, 'Reload'),
        m('button', {
          class: common.button,
          onclick: () => { window.nodecg.sendMessage('schedule.next'); },
        }, 'Next')));
  }
}


scheduleRep.once('change', () => { m.mount(document.body, ScheduleControl); });
scheduleRep.on('change', () => { m.redraw(); });
