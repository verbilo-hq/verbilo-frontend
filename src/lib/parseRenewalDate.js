const MONTH_IDX = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export const parseRenewalDate = (str) => {
  if (!str) return null;
  const [day, mon, year] = str.split(" ");
  const m = MONTH_IDX[mon];
  return m !== undefined ? new Date(parseInt(year), m, parseInt(day)) : null;
};
