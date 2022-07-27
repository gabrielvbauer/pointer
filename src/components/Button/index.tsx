import React, {ButtonHTMLAttributes} from 'react';
import styles from './button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}

const Button = ({children, ...rest}: Props) => {
  return (
    <button
      className={styles.button}
      {...rest}
    >
      {children}
    </button>
  );
};

export {Button};
