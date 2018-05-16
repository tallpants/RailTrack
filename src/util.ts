// Takes a Date object and returns a 'dd-mm-yyyy' date string.
export function formatDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth() + 1; // The month number returned by getMonth() is 0 indexed.
  const year = d.getFullYear();

  return `${padZero(day)}-${padZero(month)}-${year}`;
}

// Prepends a 0 if the number is one digit long.
// 9 -> 09, but 13 -> 13
function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}
