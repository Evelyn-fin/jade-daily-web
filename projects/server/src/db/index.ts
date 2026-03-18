import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// 确保数据目录存在
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 创建 SQLite 数据库连接
const sqlite = new Database(path.join(dataDir, 'jade-daily.db'));
sqlite.pragma('journal_mode = WAL');

// 创建 Drizzle 实例
export const db = drizzle(sqlite, { schema });

// 导出 schema
export * from './schema';
