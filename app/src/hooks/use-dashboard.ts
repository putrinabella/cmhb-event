import { useMemo } from "react";
import type { EventItem } from "@/services/eventAPI";
import { useEvents } from "./use-events";

export function useDashboardStats(events: EventItem[], today: Date) {
  return useMemo(() => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce(
      (sum, e) => sum + (e.participant_total || 0),
      0
    );

    const todayTime = today.getTime();
    const next7Days = todayTime + 7 * 24 * 60 * 60 * 1000;

    // Event dalam 7 hari ke depan
    const upcomingEvents = events.filter((e) => {
      const t = new Date(e.event_date).getTime();
      return t >= todayTime && t <= next7Days;
    });

    // Event bulan ini
    const thisMonthEvents = events.filter((e) => {
      const d = new Date(e.event_date);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    // Event sudah lewat
    const pastEvents = events.filter((e) => {
      const t = new Date(e.event_date).getTime();
      return t < todayTime;
    });

    // Event yang akan datang (lebih dari hari ini)
    const futureEvents = events.filter((e) => {
      const t = new Date(e.event_date).getTime();
      return t > todayTime;
    });

    return {
      totalEvents,
      totalParticipants,
      upcomingEvents, // dalam 7 hari
      thisMonthEvents, // bulan ini
      pastEvents, // sudah lewat
      futureEvents, // semua event mendatang (setelah hari ini)
      avgParticipants:
        totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0,
    };
  }, [events, today]);
}

export function useDashboardEvents() {
  const { data: events = [], loading, error } = useEvents(1);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach((event) => {
      const dateKey = new Date(event.event_date).toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  return { events, eventsByDate, loading, error };
}

export function useEventMap(events: EventItem[]) {
  return useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach((event) => {
      const key = new Date(event.event_date).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    });
    return map;
  }, [events]);
}

export function useCalendarData(currentDate: Date) {
  return useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startingDayOfWeek = first.getDay();

    return { daysInMonth, startingDayOfWeek };
  }, [currentDate]);
}

export function useMonthName(currentDate: Date) {
  return useMemo(
    () =>
      currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    [currentDate]
  );
}

export function useUpcomingEvents(today: Date) {
  return {
    getDaysUntil: (eventDate: string) => {
      const d = new Date(eventDate);
      return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    },
  };
}
