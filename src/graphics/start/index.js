import m from 'mithril';
import FloatyContainer from '../components/floaty';
import logoImg from './logo-color.svg';
import styles from './styles.css';
import '../common.css';

const countdownRep = window.nodecg.Replicant('countdown');

class StartGraphic {
  view() {
    return [
      m('img', { class: styles.start_logo, src: logoImg }),
      m('div', { class: styles.start_countdown }, countdownRep.value.formatted),
      m(FloatyContainer),
    ];
  }
}

countdownRep.once('change', () => { m.mount(document.body, StartGraphic); });
countdownRep.on('change', () => { m.redraw(); });
