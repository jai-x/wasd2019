import m from 'mithril';
import { TweenMax, Power1 } from 'gsap/TweenMax';
import { range, random, sample } from 'lodash';

import styles from './styles.css';

// helpers
const sign = () => (Math.random() < 0.5 ? -1 : 1);
const deviation = max => random(max) * sign();

class Floaty {
  oninit() {
    // Randomly choose floaty type from provided css classes
    this.type = sample([
      styles.floaty_cross,
      styles.floaty_dot,
      styles.floaty_circle,
      styles.floaty_triangle,
    ]);
  }

  view() {
    return m('div', { class: `${styles.floaty} ${this.type}` });
  }

  oncreate(vnode) {
    // Find out how far you should randomly offset from the center of the parent container
    const xMax = Math.floor(vnode.dom.offsetParent.offsetWidth / 2);
    const yMax = Math.floor(vnode.dom.offsetParent.offsetHeight / 2);
    const distMax = Math.max(yMax, xMax) + 150;

    // Animate starting from a random position within the distance calculated above
    TweenMax.fromTo(
      vnode.dom,
      20,
      {
        x: deviation(distMax),
        y: deviation(distMax),
        scale: random(0.2, 1.0).toFixed(1),
      },
      {
        y: deviation(300),
        ease: Power1.easeInOut,
        yoyo: true,
        repeat: -1,
        delay: random(15),
      },
    );
  }
}

export default class FloatyContainer {
  view() {
    const num = 45;
    // Uses `range` to create a number of child `Floaty` elements in place
    return m('div', { class: `${styles.floaty_container}` }, ...range(num).map(() => m(Floaty)));
  }

  oncreate(vnode) {
    // Fade in container
    TweenMax.fromTo(
      vnode.dom,
      2,
      { opacity: 0 },
      { opacity: 1, ease: Power1.easeOut },
    );
  }
}
