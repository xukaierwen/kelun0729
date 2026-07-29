import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../database/db.sqlite');

// 初始化数据库
export function initDatabase() {
  const db = new Database(DB_PATH);
  
  // 启用外键约束
  db.pragma('foreign_keys = ON');

  console.log('📦 初始化数据库...');

  // 1. 系统参数表
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_params (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      param_key TEXT UNIQUE NOT NULL,
      param_value TEXT,
      param_type TEXT DEFAULT 'string',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. 字典表
  db.exec(`
    CREATE TABLE IF NOT EXISTS dictionaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. 字典项表
  db.exec(`
    CREATE TABLE IF NOT EXISTS dictionary_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dictionary_id INTEGER NOT NULL,
      item_value TEXT NOT NULL,
      item_label TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (dictionary_id) REFERENCES dictionaries(id) ON DELETE CASCADE
    );
  `);

  // 4. 审批流程表
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. 审批流程层级表
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflow_levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id INTEGER NOT NULL,
      level_order INTEGER NOT NULL,
      level_name TEXT NOT NULL,
      role_code TEXT NOT NULL,
      FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
    );
  `);

  // 6. 组织架构表
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      parent_id INTEGER,
      level INTEGER NOT NULL,
      type TEXT NOT NULL,
      business_line TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES organizations(id)
    );
  `);

  // 7. 产品主数据表
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material_code TEXT UNIQUE NOT NULL,
      generic_name TEXT NOT NULL,
      specification TEXT,
      packaging TEXT,
      production_base TEXT,
      approval_number TEXT,
      collection_attribute TEXT,
      insurance_attribute TEXT,
      conversion_factor REAL DEFAULT 1.0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      real_name TEXT,
      email TEXT,
      phone TEXT,
      role TEXT NOT NULL,
      organization_id INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );
  `);

  // 9. 操作日志表
  db.exec(`
    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      detail TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // 10. 主数据通用表（用于存储所有主数据）
  db.exec(`
    CREATE TABLE IF NOT EXISTS master_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_key TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. 销售预算表
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      entity TEXT NOT NULL,
      management_type TEXT,
      management_team TEXT,
      business_mode TEXT,
      sales_mode TEXT,
      product TEXT,
      salesperson TEXT,
      metrics_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. 运营费用预算表
  db.exec(`
    CREATE TABLE IF NOT EXISTS operation_budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department TEXT NOT NULL,
      subject_type TEXT NOT NULL,
      subject TEXT NOT NULL,
      amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. 数字营销实际数表
  db.exec(`
    CREATE TABLE IF NOT EXISTS actual_sales_digital_marketing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 14. 销售实际数汇总表
  db.exec(`
    CREATE TABLE IF NOT EXISTS actual_sales_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 插入初始数据
  insertInitialData(db);

  console.log('✅ 数据库初始化完成');
  return db;
}

// 插入初始数据
function insertInitialData(db) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO system_params (param_key, param_value, param_type, description)
    VALUES (?, ?, ?, ?)
  `);

  // 系统默认参数
  const defaultParams = [
    ['season_coefficient', '1.0', 'number', '季节系数默认值'],
    ['price_alert_threshold', '10', 'number', '价差预警阈值(%)'],
    ['enable_negative_gross_profit', 'false', 'boolean', '允许负毛利'],
    ['enable_conversion_validation', 'true', 'boolean', '转换系数校验'],
    ['budget_cycle_month', '10', 'number', '年度预算启动月份'],
    ['half_year_cycle_month', '7', 'number', '半年度调整月份'],
  ];

  const insertMany = db.transaction((params) => {
    for (const param of params) {
      insert.run(param);
    }
  });

  insertMany(defaultParams);
  console.log('✅ 插入默认系统参数');

  // 插入默认字典
  const dictInsert = db.prepare(`
    INSERT OR IGNORE INTO dictionaries (category, code)
    VALUES (?, ?)
  `);

  const defaultDicts = [
    ['业务类型', 'business_type'],
    ['集采属性', 'collection_attribute'],
    ['医保属性', 'insurance_attribute'],
    ['省份', 'province'],
  ];

  const insertDicts = db.transaction((dicts) => {
    for (const dict of dicts) {
      dictInsert.run(dict);
    }
  });

  insertDicts(defaultDicts);
  console.log('✅ 插入默认字典');
}

// 获取数据库实例
let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = initDatabase();
  }
  return dbInstance;
}

// 关闭数据库
export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('🔌 数据库连接已关闭');
  }
}
