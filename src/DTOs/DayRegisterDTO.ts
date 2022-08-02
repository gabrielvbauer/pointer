import {IMarking} from '../components/Marking';

export type DayRegisterDTO = {
  valid: boolean;
  workedHours: number;
  remainingHours: number;
  extraHours: number;
  markings: IMarking[];
  date: number,
  total: number,
};
