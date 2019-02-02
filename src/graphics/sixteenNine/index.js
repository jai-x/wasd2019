import m from 'mithril';
import { waitForReplicants } from '../util';
import FloatyContainer from '../components/floaty';
import GameInfo from '../components/gameinfo';
import RunInfo from '../components/runinfo';
import InsetBox from '../components/insetbox';
import seImage from './special_effect.png';
import styles from './styles.css';
import '../common.css';

const scheduleRep = window.nodecg.Replicant('schedule');
const timerRep = window.nodecg.Replicant('timer');
const totalRep = window.nodecg.Replicant('total');

class SixteenNineGraphic {
  view() {
    return [
      m('div', { class: styles.bottom_content },
        m('div', { class: styles.game_info_container },
          m(GameInfo, { schedule: scheduleRep.value })),
        m('div', { class: styles.run_info_container },
          m(RunInfo, { schedule: scheduleRep.value, timer: timerRep.value }))),
      m('div', { class: styles.side_content },
        m('div', { class: styles.camera }),
        m('div', { class: styles.sponsor_container },
          m(InsetBox)),
        m('div', { class: styles.donations_container },
          m('img', { class: styles.donations_image, src: seImage }),
          m('div', { class: styles.donations_text }, `${totalRep.value.symbol}${totalRep.value.amount}`),
          m('div', { class: styles.inset_border }))),
      m('div', { class: styles.game }),
      m(FloatyContainer),
    ];
  }
}

waitForReplicants(scheduleRep, timerRep, totalRep).then(() => {
  m.mount(document.body, SixteenNineGraphic);
});
scheduleRep.on('change', () => { m.redraw(); });
timerRep.on('change', () => { m.redraw(); });
totalRep.on('change', () => { m.redraw(); });
