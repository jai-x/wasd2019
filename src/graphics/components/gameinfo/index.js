import m from 'mithril';
import styles from './styles.css';

export default class GameInfo {
  view(vnode) {
    const { attrs: { schedule } } = vnode;
    const run = schedule.runs[schedule.current];
    return m('div', { class: styles.game_info },
      m('div', { class: styles.title }, run.game),
      m('div', { class: styles.category }, run.category),
      m('div', { class: styles.row },
        m('div', `${run.platform} - ${run.release_year}`),
        m('div', `⏱  ${run.estimate}`)),
      m('div', { class: styles.inset_border }));
  }
}
