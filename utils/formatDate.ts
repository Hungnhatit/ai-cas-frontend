import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
* Format ISO time (UTC) to Vietnamese time format.
* @param date ISO string or Date object.
* @param format Format string, default is "DD/MM/YYYY HH:mm".
* @returns Formatted time string, or empty if date is invalid.
*/
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = "HH:mm:ss DD/MM/YYYY"
): string => {
  if (!date) return "";

  const parsed = dayjs.utc(date);
  if (!parsed.isValid()) return "";

  return parsed.tz("Asia/Ho_Chi_Minh").format(format);
}

export const calculateDuration = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return "N/A";

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diff = end - start;

  if (diff <= 0) return 0;
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${minutes}m ${seconds}s`;

}