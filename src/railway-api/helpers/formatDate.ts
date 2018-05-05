import padZero from './padZero';

/**
 *Takes a Date object and returns a 'dd-mm-yyyy' datestring.
 */
export default function formatDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth() + 1; // The month number returned by getMonth() is 0 indexed.
  const year = d.getFullYear();

  return `${padZero(day)}-${padZero(month)}-${year}`;
}
