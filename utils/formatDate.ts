import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format thời gian ISO (UTC) sang định dạng theo giờ Việt Nam.
 * @param date Chuỗi ISO hoặc đối tượng Date.
 * @param format Chuỗi định dạng, mặc định là "DD/MM/YYYY HH:mm".
 * @returns Chuỗi thời gian đã format, hoặc rỗng nếu date không hợp lệ.
 */
export const formatDate = (
  date: string | Date | null | undefined,
  format: string = "DD/MM/YYYY HH:mm"
): string => {
  if (!date) return "";

  const parsed = dayjs.utc(date);
  if (!parsed.isValid()) return "";

  return parsed.tz("Asia/Ho_Chi_Minh").format(format);
}
