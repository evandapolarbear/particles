export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const fullDateFormat = 'ddd MMM D, YYYY';
export const longDateFormat = 'MMM D, YYYY';

const baseMonthsAndDays = ['MMDD', 'DDMM'];
const baseYears = ['YY', 'YYYY'];
const separators = ['/', '.', '-', '', ' '];

const yearsAfter = [].concat(...baseMonthsAndDays.map(bmad => baseYears.map(by => bmad + by)));
const yearsAfterSeparated = [].concat(...yearsAfter.map(ya => separators.map(s => ya.slice(0, 2) + s + ya.slice(2, 4) + s + ya.slice(4))));
const yearsBefore = [].concat(...baseMonthsAndDays.map(bmad => baseYears.map(by => by + bmad)));
const yearsBeforeSeparated = [].concat(...yearsBefore.map(ya => separators.map((s) => {
  const end = ya.length;
  return ya.slice(0, -4) + s + ya.slice(end - 4, end - 2) + s + ya.slice(end - 2, end);
})));

export const validDateFormats = [].concat.apply([], [yearsAfterSeparated, yearsBeforeSeparated, longDateFormat]);
