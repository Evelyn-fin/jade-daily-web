import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'jade-daily.db');
const migrationPath = path.join(process.cwd(), 'drizzle', '0000_fair_lady_ursula.sql');

// 确保数据目录存在
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 创建数据库连接
const db = new Database(dbPath);

// 读取迁移 SQL
const sql = fs.readFileSync(migrationPath, 'utf-8');

// 执行迁移
const statements = sql.split(';');
statements.forEach(stmt => {
  if (stmt.trim()) {
    db.exec(stmt);
  }
});

console.log('Migration completed successfully!');

db.close();
