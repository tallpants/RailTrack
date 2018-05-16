// Prepends a 0 if the number is one digit long.
// 9 -> 09, but 13 -> 13
export default function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}
