import React from 'react';
import {Menu} from 'components/Menu';
import {Header} from 'components/Header';
import {Kpi} from 'components/Kpi';
import {Briefcase} from 'phosphor-react';
import styles from './dashboard.module.scss';

const Dashboard = () => {
  return (
    <>
      <Menu />
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.kpisContainer}>
          <Kpi
            icon={<Briefcase size={32} />}
            title="Trabalhadas"
            value="175:24h"
            iconContainerStyle={{background: '#41B770'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Extras"
            value="10:45h"
            iconContainerStyle={{background: '#19756A'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Faltas"
            value="01:30h"
            iconContainerStyle={{background: '#EF476F'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Total"
            value="184:30h"
            iconContainerStyle={{background: '#9747FF'}}
          />
        </div>
        <div className={styles.todayPoints}>

        </div>
        <div className={styles.todayDetails}>

        </div>
        <div className={styles.monthPoints}>

        </div>
      </div>
    </>
  );
};

export {Dashboard};
