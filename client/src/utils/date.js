/**
 * 
 * @param {string} dateString 
 * @returns Formatted date or empty string 
 */
export const formatDate = dateString => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * 
 * @param {string} from - Start Date as a formatted string
 * @param {string} to - End Date as a formatted string
 * @param {Boolean} current - if there is no end date
 * @returns - Formatted range (e.g., "01/2020 → 12/2023" or "01/2020 → Present")
 */
export const getDateRange = (from, to, current) => {
  const fromDate = formatDate(from);
  const toDate = current ? "Now" : formatDate(to);
  return `${fromDate} ${"→"} ${toDate}`;
};
