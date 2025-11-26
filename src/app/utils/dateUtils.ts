import { Age } from "../shared/types";

export function milliSecondsToAge(itemAge: number): Age {
  const PER_SECOND = 1000;
  const PER_MINUTE = PER_SECOND * 60;
  const PER_HOUR = PER_MINUTE * 60;
  const PER_DAY = PER_HOUR * 24;
  const PER_WEEK = PER_DAY * 7;

  let age: number;
  let unit: string;
  // check for highest
  if (itemAge > PER_WEEK) {
    age = Math.floor(itemAge / PER_WEEK);
    unit = "week"
  }
  else if (itemAge > PER_DAY) {
    age = Math.floor(itemAge / PER_DAY);
    unit = "day"
  }
  else if(itemAge > PER_HOUR) {
    age = Math.floor(itemAge / PER_HOUR);
    unit = "hour"
  }
  else if(itemAge > PER_MINUTE) {
    age = Math.floor(itemAge / PER_MINUTE);
    unit = "min"
  }
  else {
    age = Math.floor(itemAge / PER_SECOND);
    unit = "sec"
  }

  return `${age}${unit}` as Age;
}