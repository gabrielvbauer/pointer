import React, {CSSProperties} from 'react';
import styles from './kpi.module.scss';

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string;
  iconContainerStyle?: CSSProperties;
}

const Kpi = ({icon, title, value, iconContainerStyle}: Props) => {
  return (
    <div className={styles.kpi}>
      <div className={styles.icon} style={iconContainerStyle}>
        {icon}
      </div>
      <div className={styles.content}>
        <small>{title}</small>
        <p>{value}</p>
      </div>
    </div>
  );
};

export {Kpi};
