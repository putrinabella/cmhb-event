import { useMemo } from "react";

export function useCalendarData(currentDate: Date) {
  return useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthName = currentDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

    return { daysInMonth, startingDayOfWeek, monthName };
  }, [currentDate]);
}
