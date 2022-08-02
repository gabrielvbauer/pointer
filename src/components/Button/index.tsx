import React, {ButtonHTMLAttributes} from 'react';
import {CircleNotch} from 'phosphor-react';
import styles from './button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  loading: boolean
}

const Button = ({children, loading, ...rest}: Props) => {
  return (
    <button
      className={styles.button}
      {...rest}
    >
      {loading ?
      <CircleNotch className={styles.loadingIcon} /> :
      children
      }
    </button>
  );
};

export {Button};
