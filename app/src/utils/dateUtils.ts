export function getAgeFromDob(dob: string | Date | null | undefined): string {
  if (!dob) return "";

  const birthDate = typeof dob === "string" ? new Date(dob) : dob;
  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} tahun ${months} bulan ${days} hari`;
}

export function getAgeYearsOnly(dob: string | Date | null | undefined): string {
  if (!dob) return "";

  const birthDate = typeof dob === "string" ? new Date(dob) : dob;
  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    years--;
  }

  return `${years} tahun`;
}
export function getDateIndonesianFormat(
  date: string | Date | null | undefined,
  shortMonth: boolean = false
): string {
  if (!date) return "";

  const dt = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dt.getTime())) return "";

  const bulanFull = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const bulanSingkat = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const bulan = shortMonth ? bulanSingkat : bulanFull;

  return `${dt.getDate()} ${bulan[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function getDateIndonesianFormatWithTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "";

  const dt = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dt.getTime())) return "";

  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const hours = dt.getHours().toString().padStart(2, "0");
  const minutes = dt.getMinutes().toString().padStart(2, "0");

  return `${day} ${bulanIndo[month]} ${year} pukul ${hours}:${minutes}`;
}

export function formatTanggal(date: string | Date | null | undefined): string {
  if (!date) return "";

  const dt = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dt.getTime())) return "";

  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function formatJamMenit(date: string | Date | null | undefined): string {
  if (!date) return "";

  const dt = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dt.getTime())) return "";

  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}

export function formatTanggalHari(
  date: string | Date | null | undefined
): string {
  if (!date) return "";

  const dt = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dt.getTime())) return "";

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const hariNama = hari[dt.getDay()];
  return `${hariNama}, ${dt.getDate()} ${
    bulanIndo[dt.getMonth()]
  } ${dt.getFullYear()}`;
}

export function formatJamMenitOnly(
  time: string | Date | null | undefined
): string {
  if (!time) return "";

  if (typeof time === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    const [hh, mm] = time.split(":");
    return `${hh}:${mm}`;
  }

  const dt = typeof time === "string" ? new Date(time) : time;
  if (!dt || isNaN(dt.getTime())) return "";

  const hh = String(dt.getHours()).padStart(2, "0");
  const mi = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mi}`;
}

export function formatRelativeDay(dateString: string): string {
  if (!dateString) return "";

  const givenDate = new Date(dateString);
  const today = new Date();

  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - givenDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "1 hari yang lalu";
  return `${diffDays} hari yang lalu`;
}
export function formatDateToLocalYYYYMMDD(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function formatDateLocalToString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getEventStatus(eventDateStr: string) {
  const eventDate = new Date(eventDateStr);
  const today = new Date();

  // Set jam ke 00:00 supaya hanya tanggal yang dibandingkan
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Selisih hari
  const diffDays = Math.ceil(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let statusLabel = "";
  let statusColor = "text-neutral";

  if (diffDays > 0) {
    // Hari sebelum event
    statusLabel = `H-${diffDays}`;
    statusColor = "text-success";
  } else if (diffDays === 0) {
    // Hari H
    statusLabel = "D-Day";
    statusColor = "text-primary font-semibold";
  } else {
    // Hari setelah event → ubah menjadi H+
    statusLabel = `H+${Math.abs(diffDays)}`;
    statusColor = "text-error";
  }

  return { statusLabel, statusColor };
}

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
    daysInMonth: lastDay.getDate(),
    startingDayOfWeek: firstDay.getDay(),
  };
};

export const getEventsForDate = (events: any[], date: Date) =>
  events.filter(
    (event) => new Date(event.event_date).toDateString() === date.toDateString()
  );

export const getDaysUntilEvent = (
  eventDate: string,
  today: Date = new Date()
) => {
  const event = new Date(eventDate);
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
