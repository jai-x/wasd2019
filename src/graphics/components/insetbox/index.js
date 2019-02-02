import m from 'mithril';
import styles from './styles.css';

export default class InsetBox {
  view() {
    return m('div', { class: styles.inset_box },
      m('div', { class: styles.inset_border }));
  }
}
