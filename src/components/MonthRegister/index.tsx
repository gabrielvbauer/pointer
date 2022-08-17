import React from 'react';
import {CircleWavyCheck, CircleWavyWarning} from 'phosphor-react';
import styles from './monthregister.module.scss';
import {IMarking} from 'components/Marking';
import {convertMStoHM} from 'utils/DateConversions';

export interface IMonthRegister {
  valid: boolean,
  date: any,
  workedHours: number,
  extraHours: number,
  remainingHours: number,
  total: number,
  markings: IMarking[]
}

type Props = IMonthRegister;

const MonthRegister = ({
  valid,
  date,
  workedHours,
  extraHours,
  remainingHours,
  total,
}: Props) => {
  return (
    <div
      className={
        `${styles.monthRegister} 
         ${valid ?
          styles.registerValid :
          styles.registerInvalid}`}
    >
      <div className={styles.monthRegisterHeader}>
        {
          valid ?
            <CircleWavyCheck size={24} color='#41B770' /> :
            <CircleWavyWarning size={24} color='#EF476F' />
        }
        <span>{`${new Date(date.seconds * 1000).toLocaleDateString()}`}</span>
      </div>
      <div className={styles.monthRegisterContent}>
        <div>
          <p>{convertMStoHM(workedHours)}</p>
          <small>Horas trabalhadas</small>
        </div>
        <div>
          <p>{convertMStoHM(extraHours)}</p>
          <small>Horas extras</small>
        </div>
        <div>
          <p>{convertMStoHM(remainingHours)}</p>
          <small>Horas faltantes</small>
        </div>
        <div>
          <p>{convertMStoHM(total)}</p>
          <small>Total</small>
        </div>
      </div>
    </div>
  );
};

export {MonthRegister};
