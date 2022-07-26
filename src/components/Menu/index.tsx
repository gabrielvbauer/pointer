import React from 'react';
import {
  Record,
  Cards,
  ChartBarHorizontal,
  CirclesThreePlus,
} from 'phosphor-react';

import styles from './menu.module.scss';

const Menu = () => {
  return (
    <aside className={styles.container}>
      <Record size={34} color="#FFFFFF" />
      <nav>
        <div className={styles.navigationItem}>
          <Cards size={24} />
          <span>
            Pontos
          </span>
        </div>
        <div className={styles.navigationItem}>
          <ChartBarHorizontal size={24} />
          <span>
            Relatórios
          </span>
        </div>
      </nav>
      <button>
        <CirclesThreePlus size={24} />
        <span>Ponto</span>
      </button>
    </aside>
  );
};

export {Menu};
