import React, {useEffect, useState} from 'react';
import {Menu} from 'components/Menu';
import {Header} from 'components/Header';
import {Kpi} from 'components/Kpi';
import {
  Briefcase,
  CirclesThreePlus,
} from 'phosphor-react';
import {Button} from 'components/Button';
import styles from './dashboard.module.scss';
import {IMarking, Marking} from 'components/Marking';
import {MonthRegister} from 'components/MonthRegister';
import {DayRegisterDTO} from 'DTOs/DayRegisterDTO';
import {convertMStoHM} from 'utils/DateConversions';
import {api} from 'api';
import {arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where} from 'firebase/firestore';

const MINIMUM_WORK_TIME_IN_MILLISECONDS = 31680000; // 8 hours and 48 minutes
const MINIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS = 1200000; // 20 minutes
const MAXIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS = 2400000; // 40 minutes
const MAXIMUM_EXTRA_HOURS_IN_MILLISECONDS = 4320000; // 1 hours and 12 minutes
const MAXIMUM_BREAK_TIME_IN_MILLISECONDS = 5400000; // 1 hour and 30 minutes

const Dashboard = () => {
  const [todayPoints, setTodayPoints] = useState<IMarking[]>([]);
  const [monthRegisters, setMonthRegisters] = useState<DayRegisterDTO[]>([]);
  const [minimumExitTime, setMinimumExitTime] = useState(0);
  const [recommendedExitTime, setRecommendedExitTime] = useState(0);
  const [maximumExitTime, setMaximumExitTime] = useState(0);
  const [workedHours, setWorkedHours] = useState(0);
  const [extraHours, setExtraHours] = useState(0);
  const [missingHours, setMissingHours] = useState(MINIMUM_WORK_TIME_IN_MILLISECONDS);
  const [kpiWorkedHours, setKpiWorkedHours] = useState(0);
  const [kpiExtraHours, setKpiExtraHours] = useState(0);
  const [kpiMissingHours, setKpiMissingHours] = useState(MINIMUM_WORK_TIME_IN_MILLISECONDS);
  const [kpiTotalHours, setKpiTotalHours] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddNewPoint() {
    setIsLoading(true);
    const lastPointMarked = todayPoints && todayPoints[todayPoints.length - 1];
    const currentPointCount = todayPoints && Math.floor(todayPoints.length / 2) + 1;

    const newPoint: IMarking = {
      type: lastPointMarked?.type === 'entrance' ? 'exit' : 'entrance',
      title: lastPointMarked?.type === 'entrance' ? `Saída ${currentPointCount}` : `Entrada ${currentPointCount}`,
      time: new Date().getTime().toString(),
      point: false,
      date: new Date(),
    };

    const id = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    const dayRegisterDocument = doc(api, 'dayRegister', id);

    await updateDoc(dayRegisterDocument, {
      workedHours: calculateWorkedHoursInMilliseconds(),
      extraHours: calculateExtraHoursInMilliseconds(),
      missingHours: calculateMissingHoursInMilliseconds(),
      total: calculateWorkedHoursInMilliseconds() + calculateExtraHoursInMilliseconds(),
      markings: arrayUnion(newPoint),
    }).then((res) => {
      setTodayPoints([...todayPoints, newPoint]);
    }).catch((err) => {
      alert('Ocorreu um erro ao salvar o ponto');
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function calculateMinimumExitInMilliseconds() {
    const _todayPoints = [...todayPoints];

    if (_todayPoints.length < 1) {
      return 0;
    }

    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const todayStart = new Date(year, month, day, 0, 0, 0, 0);
    const todayStartInMs = Date.parse(todayStart + '');

    if (_todayPoints.length % 2 === 0) {
      return Number(_todayPoints[0].time) - todayStartInMs + MINIMUM_WORK_TIME_IN_MILLISECONDS + MAXIMUM_BREAK_TIME_IN_MILLISECONDS;
    }

    const minimumExit = Number(_todayPoints[_todayPoints.length - 1].time) - todayStartInMs + MINIMUM_WORK_TIME_IN_MILLISECONDS + MAXIMUM_BREAK_TIME_IN_MILLISECONDS;

    return minimumExit;
  }

  function calculateWorkedHoursInMilliseconds() {
    const _todayPoints = todayPoints && [...todayPoints];

    if (_todayPoints.length % 2 !== 0) _todayPoints.pop();

    let workedHours = 0;

    for (let i = 0; i < _todayPoints.length; i+=2) {
      const entrance = _todayPoints[i];
      const exit = _todayPoints[i+1];

      workedHours += Number(exit.time) - Number(entrance.time);
    }

    return workedHours;
  }

  function calculateRecommendedExitInMilliseconds() {
    const minimumExit = calculateMinimumExitInMilliseconds();
    const extraHoursToWork = Math.random() * (MAXIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS - MINIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS) + MINIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS;

    return minimumExit + extraHoursToWork;
  }

  function calculateMaximumExitInMilliseconds() {
    const minimumExit = calculateMinimumExitInMilliseconds();
    return minimumExit + MAXIMUM_EXTRA_HOURS_IN_MILLISECONDS;
  }

  function calculateExtraHoursInMilliseconds() {
    const workedHours = calculateWorkedHoursInMilliseconds();
    if (workedHours > MINIMUM_WORK_TIME_IN_MILLISECONDS) {
      return workedHours - MINIMUM_WORK_TIME_IN_MILLISECONDS;
    }

    return 0;
  }

  function calculateMissingHoursInMilliseconds() {
    const workedHours = calculateWorkedHoursInMilliseconds();
    if (workedHours > MINIMUM_WORK_TIME_IN_MILLISECONDS) return 0;

    return MINIMUM_WORK_TIME_IN_MILLISECONDS - workedHours;
  }

  useEffect(() => {
    if (todayPoints.length === 0) return;

    setMinimumExitTime(calculateMinimumExitInMilliseconds());
    setRecommendedExitTime(calculateRecommendedExitInMilliseconds());
    setMaximumExitTime(calculateMaximumExitInMilliseconds());
    setWorkedHours(calculateWorkedHoursInMilliseconds());
    setExtraHours(calculateExtraHoursInMilliseconds());
    setMissingHours(calculateMissingHoursInMilliseconds());
  }, [todayPoints]);

  useEffect(() => {
    const handleTodayDocument = async () => {
      setIsLoading(true);
      const id = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
      const docRef = doc(api, 'dayRegister', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const {valid, date, extraHours, markings, remainingHours, workedHours, total} = docSnap.data();
        const register: DayRegisterDTO = {
          valid: valid,
          date: date,
          extraHours: extraHours,
          markings: markings,
          remainingHours: remainingHours,
          workedHours: workedHours,
          total: total,
        };

        setTodayPoints(register.markings);
        setIsLoading(false);
        return;
      }

      setDoc(docRef, {
        valid: workedHours >= MINIMUM_WORK_TIME_IN_MILLISECONDS,
        date: new Date(),
        workedHours: workedHours,
        extraHours: extraHours,
        missingHours: missingHours,
        total: workedHours + extraHours,
        markings: todayPoints,
      }, {merge: true}).then(() => {
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
    };

    handleTodayDocument();
  }, []);

  useEffect(() => {
    const retrieveMonthRegisters = async () => {
      setIsLoading(true);

      const date = new Date();
      const dateQuery = new Date(date.getFullYear(), date.getMonth(), 1);

      const dayRegistersRef = collection(api, 'dayRegister');
      const q1 = query(dayRegistersRef, where(
          'date',
          '>=',
          dateQuery,
      ), orderBy('date', 'desc'));

      const querySnapshots = await getDocs(q1);

      let kpiWorked = 0;
      let kpiExtras = 0;
      let kpiMissing = 0;
      let kpiTotal = 0;

      const data = querySnapshots.docs.map((doc) => {
        const {valid, workedHours, missingHours, extraHours, markings, date, total} = doc.data();

        kpiWorked += workedHours;
        kpiExtras += extraHours;
        kpiMissing += missingHours;
        kpiTotal += total;

        const obj: DayRegisterDTO = {
          valid,
          workedHours,
          remainingHours: missingHours,
          extraHours,
          markings,
          date,
          total: total,
        };

        return obj;
      });

      console.log(data);

      setIsLoading(false);
      setKpiWorkedHours(kpiWorked);
      setKpiExtraHours(kpiExtras);
      setKpiMissingHours(kpiMissing);
      setKpiTotalHours(kpiTotal);
      setMonthRegisters(data);
    };

    retrieveMonthRegisters();
  }, []);

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
              {todayPoints?.map((point, index) => (
                <Marking key={index} {...point} />
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
