/**
 * Formats a date string to a localized date format
 * @param dateString - The date string to format
 * @returns Formatted date or empty string
 */
export const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Formats a date range with start and end dates
 * @param from - Start Date as a formatted string
 * @param to - End Date as a formatted string
 * @param current - If there is no end date (currently active)
 * @returns Formatted range (e.g., "01/2020 → 12/2023" or "01/2020 → Current")
 */
export const getDateRange = (
  from: string | Date,
  to: string | Date | undefined,
  current: boolean
): string => {
  const fromDate = formatDate(from);
  const toDate = current ? "Current" : formatDate(to);
  return `${fromDate} ${"→"} ${toDate}`;
};
