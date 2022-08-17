import React from 'react';
import {Menu} from 'components/Menu';
import {Header} from 'components/Header';
import {Kpi} from 'components/Kpi';
import {
  Briefcase,
  CirclesThreePlus,
} from 'phosphor-react';
import {Button} from 'components/Button';
import styles from './dashboard.module.scss';
import {Marking} from 'components/Marking';
import {MonthRegister} from 'components/MonthRegister';
import {convertMStoHM} from 'utils/DateConversions';
import {useMarkings} from 'hooks/useMarkings';

const Dashboard = () => {
  const {addNewMarking, data, isLoading, markings} = useMarkings();
  const {
    kpiExtraHours,
    kpiMissingHours,
    kpiTotalHours,
    kpiWorkedHours,
    extraHours,
    maximumExitTime,
    minimumExitTime,
    missingHours,
    monthRegisters,
    recommendedExitTime,
    workedHours,
  } = data;

  async function handleAddNewPoint() {
    addNewMarking();
  }

  return (
    <>
      <Menu />
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.kpisContainer}>
          <Kpi
            icon={<Briefcase size={32} />}
            title="Trabalhadas"
            value={`${convertMStoHM(kpiWorkedHours)}h`}
            iconContainerStyle={{background: '#41B770'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Extras"
            value={`${convertMStoHM(kpiExtraHours)}h`}
            iconContainerStyle={{background: '#19756A'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Faltas"
            value={`${convertMStoHM(kpiMissingHours)}h`}
            iconContainerStyle={{background: '#EF476F'}}
          />
          <Kpi
            icon={<Briefcase size={32} />}
            title="Total"
            value={`${convertMStoHM(kpiTotalHours)}h`}
            iconContainerStyle={{background: '#9747FF'}}
          />
        </div>
        <div
          className={styles.todayPoints}
        >
          <div className={styles.boxHeader}>
            <h2>Marcações do dia</h2>
            <Button
              onClick={handleAddNewPoint}
              loading={isLoading}
              disabled={missingHours <= 0}
            >
              <CirclesThreePlus size={24} />
              Nova marcação
            </Button>
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
              {markings?.map((marking, index) => (
                <Marking key={index} {...marking} />
              ))}
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
              <div className={styles.detailItem}>
                <span>Saída mínima</span>
                <span>{convertMStoHM(minimumExitTime)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Saída recomendada</span>
                <span>{convertMStoHM(recommendedExitTime)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Saída máxima</span>
                <span>{convertMStoHM(maximumExitTime)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Horas trabalhadas</span>
                <span>{convertMStoHM(workedHours)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Horas extras</span>
                <span>{convertMStoHM(extraHours)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Horas faltantes</span>
                <span>{convertMStoHM(missingHours)}</span>
              </div>
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
            {monthRegisters.map((register, index) => (
              <MonthRegister key={index} {...register} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export {Dashboard};
