import React, {useContext, useEffect} from 'react';
import {IMarking} from 'components/Marking';
import {createContext, ReactNode, useState} from 'react';
import {arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {api} from 'api';
import {DayRegisterDTO} from 'DTOs/DayRegisterDTO';
import {toast} from 'react-toastify';
import {generateDateId} from 'utils/GenerateID';

interface MarkingsProviderProps {
  children: ReactNode;
}

interface IMarkingsContext {
  markings: IMarking[]
  data: {
    monthRegisters: DayRegisterDTO[];
    minimumExitTime: number;
    recommendedExitTime: number;
    maximumExitTime: number;
    workedHours: number;
    extraHours: number;
    missingHours: number;
    kpiWorkedHours: number;
    kpiExtraHours: number;
    kpiMissingHours: number;
    kpiTotalHours: number;
  }
  isLoading: boolean;
  addNewMarking: () => void;
  editMarking: (marking: IMarking) => void;
}

const MarkingsContext = createContext<IMarkingsContext>({} as IMarkingsContext);

const MINIMUM_WORK_TIME_IN_MILLISECONDS = 31680000; // 8 hours and 48 minutes
const MINIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS = 1200000; // 20 minutes
const MAXIMUM_EXTRA_HOURS_DESIRED_IN_MILLISECONDS = 2400000; // 40 minutes
const MAXIMUM_EXTRA_HOURS_IN_MILLISECONDS = 4320000; // 1 hours and 12 minutes

export function MarkingsProvider({children}: MarkingsProviderProps) {
  const [markings, setMarkings] = useState<IMarking[]>([]);
  const auxiliaryMarking: IMarking[] = [...markings];
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

  async function addNewMarking() {
    setIsLoading(true);

    const lastMarking = markings && markings[markings.length - 1];
    const count = markings && Math.ceil(markings.length / 2);
    const id = generateDateId();
    const dayRegisterDocument = doc(api, 'dayRegister', id);

    const newMarking: IMarking = {
      type: lastMarking?.type === 'entrance' ? 'exit' : 'entrance',
      title: lastMarking?.type === 'entrance' ? `Saída ${count}` : `Entrada ${count}`,
      time: new Date().getTime().toString(),
      point: false,
      date: new Date(),
    };

    auxiliaryMarking.push(newMarking);

    const newDayRegister = {
      workedHours: calculateWorkedHoursInMilliseconds(),
      extraHours: calculateExtraHoursInMilliseconds(),
      missingHours: calculateMissingHoursInMilliseconds(),
      total: calculateWorkedHoursInMilliseconds() + calculateExtraHoursInMilliseconds(),
      valid: calculateWorkedHoursInMilliseconds() >= calculateMissingHoursInMilliseconds(),
    };

    await updateDoc(dayRegisterDocument, {
      ...newDayRegister,
      markings: arrayUnion(newMarking),
    }).then(() => {
      setMarkings([...markings, newMarking]);
    }).catch(() => {
      toast.error('Ocorreu um erro ao salvar o ponto.');
    }).finally(() => {
      setIsLoading(false);
    });
  }

  async function editMarking(marking: IMarking) {
    return;
  };

  function calculateMinimumExitInMilliseconds() {
    if (markings.length < 1) {
      return 0;
    }

    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const todayStart = new Date(year, month, day, 0, 0, 0, 0);
    const todayStartInMs = Date.parse(todayStart + '');

    const timestampRelativeToDayStart = Number(markings[0].time) - todayStartInMs;

    const minimumExit = timestampRelativeToDayStart + MINIMUM_WORK_TIME_IN_MILLISECONDS + calculateDifferenceBetweenDifferentMarkings();

    return minimumExit;
  }

  function calculateWorkedHoursInMilliseconds() {
    const _markings = auxiliaryMarking && [...auxiliaryMarking];
    const isLastMarkingAnEntrance = _markings.length % 2 !== 0;
    let workedHours = 0;

    if (isLastMarkingAnEntrance) {
      _markings.pop();
    }

    for (let i = 0; i < _markings.length; i+=2) {
      const entrance = _markings[i];
      const exit = _markings[i+1];

      workedHours += Number(exit.time) - Number(entrance.time);
    }

    return workedHours;
  }

  function calculateDifferenceBetweenDifferentMarkings() {
    const _markings = [...auxiliaryMarking];
    let differenceBetweenMarkings = 0;

    for (let i = 1; i < _markings.length / 2; i+=2) {
      const exit = _markings[i];
      const entrance = _markings[i + 1];

      differenceBetweenMarkings += Number(entrance.time) - Number(exit.time);
    };

    return differenceBetweenMarkings;
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
    if (markings.length === 0) return;

    setMinimumExitTime(calculateMinimumExitInMilliseconds());
    setRecommendedExitTime(calculateRecommendedExitInMilliseconds());
    setMaximumExitTime(calculateMaximumExitInMilliseconds());
    setWorkedHours(calculateWorkedHoursInMilliseconds());
    setExtraHours(calculateExtraHoursInMilliseconds());
    setMissingHours(calculateMissingHoursInMilliseconds());
  }, [markings]);

  useEffect(() => {
    const retrieveTodayMarkings = async () => {
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

        setMarkings(register.markings);
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
        markings: markings,
      }, {merge: true}).then(() => {
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
    };

    retrieveTodayMarkings();
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

      setIsLoading(false);
      setKpiWorkedHours(kpiWorked);
      setKpiExtraHours(kpiExtras);
      setKpiMissingHours(kpiMissing);
      setKpiTotalHours(kpiTotal);
      setMonthRegisters(data);
    };

    retrieveMonthRegisters();
  }, [markings]);

  return (
    <MarkingsContext.Provider
      value={{
        markings,
        addNewMarking,
        editMarking,
        isLoading,
        data: {
          extraHours,
          kpiExtraHours,
          kpiMissingHours,
          kpiTotalHours,
          kpiWorkedHours,
          maximumExitTime,
          minimumExitTime,
          missingHours,
          monthRegisters,
          recommendedExitTime,
          workedHours,
        },
      }}
    >
      {children}
    </MarkingsContext.Provider>
  );
}

function useMarkings() {
  const context = useContext(MarkingsContext);

  return context;
}

export {useMarkings};
