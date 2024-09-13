export const toSimpleDateString = (timestamp) => {
  let date = new Date(timestamp);
  let formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");
  return formattedDate;
};

export const toDifferenceDayTimeToNow = (timestamp) => {
  const milliseconds = Date.now() - timestamp;
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return Math.floor(days) + " days ago";
  } else if (hours >= 1) {
    return Math.floor(hours) + " hours ago";
  } else if (minutes >= 1) {
    return Math.floor(minutes) + " minutes ago";
  } else {
    return Math.floor(seconds) + " seconds ago";
  }
};

export const toSimpleDateTimeString = (timestamp) => {
  let date = new Date(timestamp);
  let formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");
  return formattedDate;
};
