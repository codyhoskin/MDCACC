export interface CalendarDate { year: number; month: number; day: number }
export const BOOKING_MONTHS = 12;

export function getCalendarMonth(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const offset = first.getUTCDay();
  return {
    year: first.getUTCFullYear(),
    month: first.getUTCMonth(),
    label: first.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
    cells: Array.from({ length: 42 }, (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= days ? day : null;
    }),
  };
}
