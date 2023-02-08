import moment from "moment";

export function getTime(seconds) {
  return moment(seconds * 1000)
    .startOf("minutes")
    .fromNow();
}
