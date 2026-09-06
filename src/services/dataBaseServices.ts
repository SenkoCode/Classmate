import * as SQLLite from 'expo-sqlite';
import { DataBaseScheduleItem } from '../types/models';

export class DataBaseService {
    private db: SQLLite.SQLiteDatabase | null = null;
    private initPromise: Promise<void> | null = null;

    // Очередь операций (хранит промис, который завершается после выполнения текущей операции)
    private operationQueue: Promise<void> = Promise.resolve();

    // Метод для постановки операции в очередь (возвращает результат операции)
    private enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
        // Ждём завершения предыдущей операции, затем выполняем новую
        const currentOperation = this.operationQueue.then(() => operation());
        // Обновляем очередь: дожидаемся завершения текущей операции, но не сохраняем её результат
        this.operationQueue = currentOperation.then(() => {});
        // Возвращаем промис с результатом операции
        return currentOperation;
    }

    public async initDB(): Promise<void> {
        if (this.db) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                this.db = await SQLLite.openDatabaseAsync('schedule.db');
                await this.db.execAsync('PRAGMA journal_mode = WAL;');
                await this.db.execAsync(`
                    CREATE TABLE IF NOT EXISTS lessons (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        subject TEXT NOT NULL,
                        teacher TEXT,
                        room TEXT,
                        day_of_week INTEGER NOT NULL,
                        lesson_number INTEGER NOT NULL,
                        week_type TEXT NOT NULL
                    );
                `);
            } catch (error) {
                console.error("Критическая ошибка инициализации БД:", error);
                this.db = null;
                throw error;
            } finally {
                this.initPromise = null;
            }
        })();

        return this.initPromise;
    }

    public async getDbInstance(): Promise<SQLLite.SQLiteDatabase> {
        if (!this.db) {
            await this.initDB();
        }
        if (!this.db) {
            throw new Error('Не удалось инициализировать базу данных');
        }
        return this.db;
    }

    // Вставка занятий (через очередь)
    public async insertLessions(lessons: Omit<DataBaseScheduleItem, "id">[]): Promise<void> {
        return this.enqueueOperation(async () => {
            const database = await this.getDbInstance();
            const query = `
                INSERT INTO lessons (subject, teacher, room, day_of_week, lesson_number, week_type)
                VALUES (?, ?, ?, ?, ?, ?);
            `;

            await database.withTransactionAsync(async () => {
                for (const lesson of lessons) {
                    await database.runAsync(
                        query,
                        lesson.subject,
                        lesson.teacher ?? null,
                        lesson.room ?? null,
                        lesson.day_of_week,
                        lesson.lesson_number,
                        lesson.week_type
                    );
                }
            });
        });
    }

    // Чтение данных (без очереди, т.к. они не конфликтуют с транзакциями)
    public async getLessons(day: string, currentWeek: 'upper' | 'lower'): Promise<DataBaseScheduleItem[]> {
        const database = await this.getDbInstance();
        const query = `
            SELECT * FROM lessons
            WHERE day_of_week = ? AND (week_type = ? OR week_type = 'both')
            ORDER BY lesson_number ASC;
        `;
        return await database.getAllAsync<DataBaseScheduleItem>(query, [day, currentWeek]);
    }

    public async getLessonsWeek(currentWeek: 'upper' | 'lower'): Promise<DataBaseScheduleItem[]> {
        const database = await this.getDbInstance();
        const query = `
            SELECT * FROM lessons
            WHERE week_type = ? OR week_type = 'both'
            ORDER BY lesson_number ASC;
        `;
        return await database.getAllAsync<DataBaseScheduleItem>(query, [currentWeek]);
    }

    // Очистка базы данных (через очередь)
    public async clearDatabase(): Promise<void> {
        return this.enqueueOperation(async () => {
            const database = await this.getDbInstance();
            try {
                await database.withTransactionAsync(async () => {
                    await database.execAsync('DELETE FROM lessons;');
                    await database.execAsync("DELETE FROM sqlite_sequence WHERE name='lessons';");
                });
                console.log("База данных успешно полностью очищена!");
            } catch (error) {
                console.error("Ошибка при очистке базы данных:", error);
                throw error;
            }
        });
    }
}

export const dbService = new DataBaseService();