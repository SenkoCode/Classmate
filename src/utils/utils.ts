import { WeekType } from "../types/models";

export const getDayNumber = ( ) => {
  const date = new Date();
  const day = date.getDay();
  
  return day === 0 ? 7 : day;
};

export const getTypeWeek = (dateInput? : string ) : WeekType => {
    const targetDate = dateInput ? new Date(dateInput) : new Date();
  
    const anchorDate = new Date(2026, 0, 5, 0, 0, 0);

    const targetZeroTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const msInDay = 24 * 60 * 60 * 1000;
    const daysPassed = Math.floor((targetZeroTime.getTime() - anchorDate.getTime()) / msInDay);


    const weeksPassed = Math.floor(daysPassed / 7);

    return (weeksPassed % 2 === 0) ? 'upper' : 'lower';
};

export const getTypeWeekText = (type : string) : string => {
    return type === "upper" ? "Вверхняя неделя" : "Нижняя неделя";
}

const getMinutes = (t : string) : number => {
    const [hours, minute] = t.split(':').map(Number);
    return hours * 60 + minute;
}

export const isCurrentSchedule = (time : string) => {
    if (!time) { return false; } 
    
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const times = time.trim().split(' - ');
    if (times.length < 2) { return false; }
    const timeStart = getMinutes(times[0]);
    const timeEnd = getMinutes(times[1]);

    return (nowMinutes >= (timeStart - 15)) && (nowMinutes < timeEnd) 
}

export const getScheduleProgress = (time: string): number => {
    if (!time) return 0;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const times = time.trim().split(' - ');
    if (times.length !== 2) return 0;

    const timeToMinutes = (t: string): number => {
        const [hours, minutes] = t.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(times[0]);
    const endMinutes = timeToMinutes(times[1]);

    if (currentMinutes < startMinutes) return 0;
    if (currentMinutes > endMinutes) return 100;

    const totalDuration = endMinutes - startMinutes;
    const elapsed = currentMinutes - startMinutes;

    if (totalDuration <= 0) return 0;

    return Math.round((elapsed / totalDuration) * 100);
};

export function isGoogleSheetsUrl(url: string): boolean {
  return /^https?:\/\/docs\.google\.com\/spreadsheets\/d\/[^/?#]+\/?/i.test(url);
}

export function extractGoogleSheetsInfo(url: string): { id: string | null; gid: string | null } {
  const idMatch = url.match(/\/d\/([^/?#]+)/);
  const id = idMatch ? idMatch[1] : null;

  const gidMatch = url.match(/[?#&]gid=([^&]+)/);
  const gid = gidMatch ? gidMatch[1] : null;

  return { id, gid };
}

export function getDownloadUrl(
  spreadsheetId: string,
  sheetId: string | null = null,
  format: string = 'xlsx'
): string {
  let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=${format}`;
  if (sheetId) {
    url += `&gid=${sheetId}`;
  }
  return url;
}