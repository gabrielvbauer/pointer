import React from 'react';
import {Menu} from 'components/Menu';
import {Header} from 'components/Header';
import {Kpi} from 'components/Kpi';
import {
  Briefcase,
  CirclesThreePlus,
  SignIn,
  Receipt,
  DotsThreeVertical,
  SignOut,
  CircleWavyCheck,
  CircleWavyWarning,
} from 'phosphor-react';
import {Button} from 'components/Button';
import styles from './dashboard.module.scss';
import {todayPoints} from 'Mock/todayPoints';
import {todayDetails} from 'Mock/todayDetails';
import {monthRegisters} from 'Mock/monthRegisters';

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
        <div
          className={styles.todayPoints}
        >
          <div className={styles.boxHeader}>
            <h2>Marcações do dia</h2>
            <Button><CirclesThreePlus size={24} />Nova marcação</Button>
          </div>
          <div className={styles.boxContent}>
            <div className={styles.listHeader}>
              <span></span>
              <span>Título</span>
              <span>Horário</span>
              <span>Ponto</span>
              <span></span>
            </div>
            <div className={styles.listContent}>
              {todayPoints.map((point, index) => {
                return (
                  <div className={styles.listItem} key={index}>
                    {
                      point.type === 'entrance' ?
                        <SignIn size={20} /> :
                        <SignOut size={20} />
                    }
                    <span>{point.title}</span>
                    <span>{point.time}</span>
                    <Receipt
                      size={24}
                      color={point.point ? '#1B9AAA' : '#FFFFFF'}
                    />
                    <DotsThreeVertical size={24} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={styles.todayDetails}
        >
          <div className={styles.boxHeader}>
            <h2>Detalhes do dia</h2>
          </div>
          <div className={styles.boxContent}>
            <div className={styles.detailsList}>
              {todayDetails.map((detail, index) => {
                return (
                  <div className={styles.detailItem} key={index}>
                    <span>{detail.label}</span>
                    <span>{detail.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={styles.monthPoints}
        >
          <div className={styles.boxHeader}>
            <h2>Registros do mês</h2>
          </div>
          <div className={styles.boxContent}>
            {monthRegisters.map((register, index) => {
              return (
                <div
                  className={
                    `${styles.monthRegister} 
                     ${register.valid ?
                      styles.registerValid :
                      styles.registerInvalid}`}
                  key={index}>
                  <div className={styles.monthRegisterHeader}>
                    {
                      register.valid ?
                        <CircleWavyCheck size={24} color='#41B770' /> :
                        <CircleWavyWarning size={24} color='#EF476F' />
                    }
                    <span>{register.date}</span>
                  </div>
                  <div className={styles.monthRegisterContent}>
                    <div>
                      <p>{register.workedHours}</p>
                      <small>Horas trabalhadas</small>
                    </div>
                    <div>
                      <p>{register.extraHours}</p>
                      <small>Horas extras</small>
                    </div>
                    <div>
                      <p>{register.remaningHours}</p>
                      <small>Horas faltantes</small>
                    </div>
                    <div>
                      <p>{register.total}</p>
                      <small>Total</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export {Dashboard};
