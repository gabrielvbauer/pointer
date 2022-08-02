import React from 'react';
import styles from './header.module.scss';

const Header = () => {
  const date = new Date();

  return (
    <div className={styles.header}>
      <h1>Pontos</h1>
      <div>
        <span className={styles.date}>{date.toLocaleDateString()}</span>
        <div className={styles.user}>
          <img src="https://github.com/gabrielvbauer.png" alt="Gabrielvbauer github pic" />
        </div>
      </div>
    </div>
  );
};

export {Header};
