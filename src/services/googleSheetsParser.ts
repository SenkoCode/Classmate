import { DataBaseScheduleItem } from "../types/models";
import * as FileSystem from 'expo-file-system/legacy';
import * as XLSX from 'xlsx';
import { dbService } from "./dataBaseServices";
import { loadAppSettings } from "../utils/settingsManager";
import { extractGoogleSheetsInfo, getDownloadUrl } from "../utils/utils";
import { useAppStore } from "./appStore";

const fileUri = FileSystem.cacheDirectory + 'schedule.xlsx';

const DAY_RANGES: { day: number; startRow: number; endRow: number }[] = [
  { day: 1, startRow: 5, endRow: 14 },   // понедельник
  { day: 2, startRow: 15, endRow: 24 },  // вторник
  { day: 3, startRow: 25, endRow: 34 },  // среда
  { day: 4, startRow: 35, endRow: 44 },  // четверг
  { day: 5, startRow: 45, endRow: 54 },  // пятница
  { day: 6, startRow: 55, endRow: 60 },  // суббота
];

export async function updateSchedulesDatabase()
{
  await downloadScheduleFile();
  const settings = await loadAppSettings();
  const group = settings.group ?? 'Нету';
  const letter = await findColumnLetterByValue(group);
  if (letter)
  {
    await getLessonsFromXlsx(letter);
  }
}

const checkFileExists = async () : Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const getRowDataFromXlsx = async (
  rowIndex: number = 3,
  startCol: number = 2,
  endCol: number = 32
): Promise<string[]> => {
  try {
    if (!(await checkFileExists())) {
      await downloadScheduleFile();
    }

    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const workbook = XLSX.read(fileContent, { type: 'base64' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!data || data.length <= rowIndex) {
      console.warn(`Строка с индексом ${rowIndex} отсутствует`);
      return [];
    }

    const row = data[rowIndex] || [];
    const result = row
      .slice(startCol, endCol)
      .map(cell => String(cell).trim())
      .filter(cell => cell !== '');

    return result;
  } catch (error) {
    console.error('Ошибка получения строки из XLSX:', error);
    return [];
  }
};

// 1. Выносим логику в компактную функцию-парсер
function parseLesson(rawText: string) {
  const parts = rawText.split(/\n|\s{3,}/).map(s => s.trim()).filter(Boolean);
  
  if (!parts.length) return { subject: "Нету пары", teacher: "", room: "" };

  const subject = parts[0];
  const rooms = parts.slice(1).filter(p => /(каб|ауд|\d+)/i.test(p));
  const teachers = parts.slice(1).filter(p => !/(каб|ауд|\d+)/i.test(p));

  return {
    subject,
    teacher: teachers.join(', '),
    room: rooms.join(', ')
  };
}

async function getLessonsFromXlsx(letter : string)
{
  const dataFromXlsx = await parseVerticalColumn(letter);

  const dataForDataBase : Omit<DataBaseScheduleItem, "id">[] = [];
  console.log(dataFromXlsx)
  for (let i = 0; i < dataFromXlsx.length; i += 2) {
    const currentCell = dataFromXlsx[i];
    const nextCell = dataFromXlsx[i+1];

    if (currentCell)
    {
      const weekOfDay = DAY_RANGES.find(range => currentCell.row >= range.startRow && currentCell.row <= range.endRow)!;
      const lesson_number = Math.floor((currentCell.row - weekOfDay.startRow) / 2) + 1;
      const weekType = currentCell.isMerged ? "both" : "upper"; 

      const { subject, teacher, room } = parseLesson(currentCell.text);

      dataForDataBase.push({
        subject,
        teacher,
        room,
        day_of_week: weekOfDay ? weekOfDay.day : -1,
        lesson_number,
        week_type: weekType
      });
    }

    if (nextCell && !currentCell.isMerged)
    {
      const weekOfDay = DAY_RANGES.find(range => currentCell.row >= range.startRow && currentCell.row <= range.endRow)!;
      const lesson_number = Math.floor((currentCell.row - weekOfDay.startRow) / 2) + 1;
      const weekType = currentCell.isMerged ? "both" : "lower"; 

      const { subject, teacher, room } = parseLesson(nextCell.text);
      dataForDataBase.push({
        subject,
        teacher,
        room,
        day_of_week: weekOfDay ? weekOfDay.day : -1,
        lesson_number,
        week_type: weekType
      });

    }
  }
  dbService.clearDatabase();
  dbService.insertLessions(dataForDataBase);
}

function columnIndexToLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

export const findColumnLetterByValue = async (
  searchValue: string,
  caseSensitive: boolean = false,
  rangeStart: number = 0,
  rangeEnd?: number
): Promise<string | null> => {
  try {
    if (searchValue === null) 
    {
      console.warn('Параметр поиска пустой');
      return null;
    }

    if (!(await checkFileExists())) {
      await downloadScheduleFile();
    }

    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const workbook = XLSX.read(fileContent, { type: 'base64' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!data || data.length < 4) {
      console.warn('Строка 4 отсутствует в таблице');
      return null;
    }

    const fourthRow = data[3] || [];

    const start = Math.max(0, rangeStart);
    const end = rangeEnd !== undefined ? Math.min(rangeEnd, fourthRow.length) : fourthRow.length;
    const searchSlice = fourthRow.slice(start, end);

    const indexInSlice = searchSlice.findIndex(cell => {
      const cellStr = String(cell).trim();
      const searchStr = searchValue.trim();
      return caseSensitive ? cellStr === searchStr : cellStr.toLowerCase() === searchStr.toLowerCase();
    });

    console.log(indexInSlice);
    if (indexInSlice === -1) {
      return null;
    }

    const globalIndex = start + indexInSlice;
    const columnLetter = columnIndexToLetter(globalIndex);
    return columnLetter;
  } catch (error) {
    console.error('Ошибка поиска столбца:', error);
    return null;
  }
};

async function parseVerticalColumn(targetLetter: string) {
  try {
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const workbook = XLSX.read(fileBase64, { type: 'base64' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const result = [];
    const merges = worksheet['!merges'] || [];
    const targetColIndex = XLSX.utils.decode_col(targetLetter);

    const startRowIndex = 4;
    const endRowIndex = 59;

    for (let r = startRowIndex; r <= endRowIndex; r++) {
      const cellAddress = XLSX.utils.encode_cell({ r: r, c: targetColIndex });
      const cell = worksheet[cellAddress];
      const cellText = cell && cell.v !== undefined ? String(cell.v).trim() : '';

      let isMerged = false;
      for (const merge of merges) {
        if (
          targetColIndex === merge.s.c &&
          r >= merge.s.r && r <= merge.e.r  
        ) {
          isMerged = true;
          break;
        }
      }

      result.push({
        row: r + 1,        
        text: cellText,   
        isMerged: isMerged
      });
    }

    return result;

  } catch (error) {
    console.error('Ошибка парсинга:', error);
    return [];
  }
}

async function downloadScheduleFile(): Promise<string> {
  const settings = await loadAppSettings();

  const {id, gid} = extractGoogleSheetsInfo(settings.url);
  if (id == null) return "";

  const url = getDownloadUrl(id);
  const downloadResult = await FileSystem.downloadAsync(url, fileUri);
  if (downloadResult.status !== 200) {
    throw new Error(`Ошибка скачивания: статус ${downloadResult.status}`);
  }
  return downloadResult.uri;
}
