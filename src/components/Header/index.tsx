import React from 'react';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>Pontos</h1>
      <div>
        <span className={styles.date}>Seg. 24/07/22</span>
        <span className={styles.hours}>17:48</span>
        <div className={styles.user}>
          <img src="https://github.com/gabrielvbauer.png" alt="Gabrielvbauer github pic" />
        </div>
      </div>
    </div>
  );
};

export {Header};
