import m from 'mithril';
import styles from './styles.css';
import common from '../panels.css';

const countdownRep = window.nodecg.Replicant('countdown');

class CountdownControl {
  oninit() {
    this.time = countdownRep.value.formatted;
  }

  view() {
    const isRunning = countdownRep.value.state === 'running';

    return m('.div', { class: common.column },
      m('input', {
        class: isRunning ? styles.countdown_display : styles.countdown_input,
        autofocus: !isRunning,
        type: 'text',
        disabled: isRunning,
        value: isRunning ? countdownRep.value.formatted : this.time,
        oninput: (e) => { this.time = e.target.value; },
      }),
      m('div', { class: common.row },
        m('button', {
          class: common.button,
          disabled: isRunning,
          onclick: () => {
            window.nodecg.sendMessage('countdown.start', this.time);
          },
        }, 'Start'),
        m('button', {
          class: common.button,
          disabled: !isRunning,
          onclick: () => {
            window.nodecg.sendMessage('countdown.pause');
            this.time = countdownRep.value.formatted;
          },
        }, 'Pause')));
  }
}

countdownRep.once('change', () => { m.mount(document.body, CountdownControl); });
countdownRep.on('change', () => { m.redraw(); });
