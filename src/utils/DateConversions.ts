import {padTo2Digits} from './Functions';

export function convertMStoHM(workedHoursInMS: number) {
  let seconds = Math.floor(workedHoursInMS / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
};
