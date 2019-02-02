import m from 'mithril';
import { waitForReplicants } from '../util';
import FloatyContainer from '../components/floaty';
import seLogo from './special_effect.png';
import wasdLogo from './wasd_logo.png';
import styles from './styles.css';
import '../common.css';

const scheduleRep = window.nodecg.Replicant('schedule');
const totalRep = window.nodecg.Replicant('total');

class RunTile {
  view(vnode) {
    const { attrs: { run } } = vnode;
    if (!run) {
      return null;
    }

    return m('div', { class: styles.run_tile },
      m('div', { class: styles.run_game }, run.game),
      m('div', run.category),
      m('div', `by ${run.runners.join(', ')}`));
  }
}

class BreakGraphic {
  view() {
    const { value: { runs, current: i } } = scheduleRep;
    return [
      m('div', { class: styles.left_col },
        m('div', { class: styles.box },
          m('img', { class: styles.logos, src: wasdLogo })),
        m('div', { class: styles.box },
          m('div', { class: styles.total }, `${totalRep.value.symbol}${totalRep.value.amount}`)),
        m('div', { class: styles.box },
          m('img', { class: styles.logos, src: seLogo })),
        m('div', { class: styles.box })),
      m('div', { class: styles.right_col },
        m('div', { class: styles.run_title }, 'Up Next'),
        m(RunTile, { run: runs[i + 1] }),
        m('div', { class: styles.run_title }, 'Later'),
        ...runs.slice(i + 2, i + 6).map(r => m(RunTile, { run: r }))),
      m(FloatyContainer),
    ];
  }
}

waitForReplicants(scheduleRep, totalRep).then(() => {
  m.mount(document.body, BreakGraphic);
});
scheduleRep.on('change', () => { m.redraw(); });
totalRep.on('change', () => { m.redraw(); });
