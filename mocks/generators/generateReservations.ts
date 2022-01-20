import moment, { Moment } from "moment";
import { db } from "../models/db";

function getEndTimeInToday(start: Moment): Moment {
  const end = start.clone().add(Math.floor(Math.random() * 12) * 30, "minutes");
  if(end.date() !== start.date() || (end.hours() === start.hours() && end.minutes() === start.minutes())) {
    return getEndTimeInToday(start)
  }
  return end;
}

export function generateReservations() {
  const user = db.user.create();
  const t = new Date();
  var date = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  const today = moment(date);
  const reservations = new Array(3 * 20).fill(null).reduce((aggr) => {
    
    const start = today.clone().add(Math.floor(Math.random() * 24), "hour");
    const end = getEndTimeInToday(start);

    return [
      ...aggr,
      db.reservation.create({
        start: start.toString() as any,
        end: end.toString() as any,
      }),
    ];
  }, []);
  return reservations;
}
