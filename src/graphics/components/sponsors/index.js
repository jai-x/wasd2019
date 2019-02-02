import m from 'mithril';
import styles from './styles.css';

export default class SponsorRotation {
  view() {
    return m('div', { class: styles.sponsor_rotation },
      m('div', { class: styles.label }, 'Our sponsors'),
      m('div', { class: styles.inset_border }));
  }
}
