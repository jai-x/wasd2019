import m from 'mithril';
import styles from './styles.css';

export default class RunInfo {
  view(vnode) {
    const { attrs: { schedule, timer } } = vnode;
    const run = schedule.runs[schedule.current];
    const timerClass = timer.state === 'paused' ? styles.run_timer_paused : styles.run_timer;
    return m('div', { class: styles.run_info },
      m('div', { class: timerClass }, timer.formatted),
      m('div', { class: styles.runners }, run.runners.join(', ')),
      m('div', { class: styles.inset_border }));
  }
}
