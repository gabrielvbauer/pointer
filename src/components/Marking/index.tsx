import React from 'react';
import {SignIn, SignOut, Receipt, DotsThreeVertical} from 'phosphor-react';
import styles from './marking.module.scss';

export interface IMarking {
  type: 'entrance' | 'exit';
  title: string;
  time: string;
  point: boolean;
  date: Date;
}

type Props = IMarking;

const Marking = ({type, title, time, point}: Props) => {
  const date = new Date(Number(time));

  return (
    <div className={styles.listItem}>
      {
        type === 'entrance' ?
          <SignIn size={20} /> :
          <SignOut size={20} />
      }
      <span>{title}</span>
      <span>{`${date.getHours()}:${date.getMinutes()}h`}</span>
      <Receipt
        size={24}
        color={point ? '#1B9AAA' : '#FFFFFF'}
      />
      <DotsThreeVertical size={24} />
    </div>
  );
};

export {Marking};
