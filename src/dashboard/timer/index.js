import m from 'mithril';
import styles from './styles.css';
import common from '../panels.css';

const timerRep = window.nodecg.Replicant('timer');

class TimerControl {
  view() {
    return m('.div', { class: common.column },
      m('div', { class: styles.timer_display }, timerRep.value.formatted),
      m('div', { class: common.row },
        m('button', {
          class: common.button,
          disabled: ['running'].includes(timerRep.value.state),
          onclick: () => { window.nodecg.sendMessage('timer.start'); },
        }, 'Start'),
        m('button', {
          class: common.button,
          disabled: ['reset', 'paused'].includes(timerRep.value.state),
          onclick: () => { window.nodecg.sendMessage('timer.pause'); },
        }, 'Pause'),
        m('button', {
          class: common.button,
          disabled: ['running', 'reset'].includes(timerRep.value.state),
          onclick: () => { window.nodecg.sendMessage('timer.reset'); },
        }, 'Reset')));
  }
}

timerRep.once('change', () => { m.mount(document.body, TimerControl); });
timerRep.on('change', () => { m.redraw(); });
