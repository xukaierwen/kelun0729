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

  // 插入主数据示例数据
  insertMasterDataSamples(db);
}

// 插入主数据示例数据
function insertMasterDataSamples(db) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO master_data (table_key, data_json)
    VALUES (?, ?)
  `);

  const sampleData = [
    // 总部管理类型
    ['md-mgmt-type', JSON.stringify({ id: 'sample_1', seq: 1, manage_type_code: 'MT001', manage_type_name: '南区', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 总部管理团队
    ['md-mgmt-team', JSON.stringify({ id: 'sample_2', seq: 1, manage_team_code: 'TEAM001', manage_team_name: '南一区', manage_type_code: 'MT001', manage_type_name: '南区', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 业务模式
    ['md-business-mode', JSON.stringify({ id: 'sample_3', seq: 1, business_model_code: 'BM001', business_model_name: '数字营销', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 片区销售模式
    ['md-sales-mode', JSON.stringify({ id: 'sample_4', seq: 1, sales_model_code: 'SM001', sales_model_name: '直营', business_model_code: 'BM001', business_model_name: '数字营销', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 省份
    ['md-province', JSON.stringify({ id: 'sample_5', seq: 1, province_code: '110000', province_name: '北京市', province_short: '京', is_valid: 1, updatedAt: new Date().toLocaleString() })],
    // 片区
    ['md-region', JSON.stringify({ id: 'sample_6', seq: 1, region_code: 'RG001', region_name: '北京片区', province_code: '110000', province_name: '北京市', province_short: '京', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 实体
    ['md-entity', JSON.stringify({ id: 'sample_7', seq: 1, entity_code: 'ENT001', entity_name: '科伦集团', parent_entity_code: '', company_nature: '集团', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 销售组
    ['md-sales-group', JSON.stringify({ id: 'sample_8', seq: 1, sales_group_code: 'SG001', sales_group_name: '销售一组', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 销售办公室
    ['md-sales-office', JSON.stringify({ id: 'sample_9', seq: 1, sales_office_code: 'SO001', sales_office_name: '销售办公室A', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 一级业务员（总部）
    ['md-sales-officer-hq', JSON.stringify({ id: 'sample_10', seq: 1, salesman_code: 'HQ001', salesman_name: '张三', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 片区管理区域
    ['md-region-dimension', JSON.stringify({ id: 'sample_11', seq: 1, region_dim_code: 'RD001', region_dim_name: '北京区域', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 客户
    ['md-customer', JSON.stringify({ id: 'sample_12', seq: 1, customer_code: 'CUST001', customer_name: '科伦药业', customer_type: '医院', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 产品
    ['md-product', JSON.stringify({ id: 'sample_13', seq: 1, product_code: 'P001', product_name: '氯化钠注射液', spec: '250ml', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 产品架构
    ['md-product-arch', JSON.stringify({ id: 'sample_14', seq: 1, arch_code: 'ARCH001', arch_name: '大输液', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 部门
    ['md-department', JSON.stringify({ id: 'sample_15', seq: 1, dept_code: 'DEPT001', dept_name: '销售部', parent_dept_code: '', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 业务员（湖南湖北专用）
    ['md-salesman-hn', JSON.stringify({ id: 'sample_16', seq: 1, salesman_code: 'HN001', salesman_name: '李四', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 流向单位（湖南专用）
    ['md-flow-unit', JSON.stringify({ id: 'sample_17', seq: 1, flow_code: 'FU001', flow_name: '长沙医院', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 场景
    ['md-scenario', JSON.stringify({ id: 'sample_18', seq: 1, scenario_code: 'SC001', scenario_name: '预算编制', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 数据口径
    ['md-data-scope', JSON.stringify({ id: 'sample_19', seq: 1, scope_code: 'DS001', scope_name: '调整前', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 版本
    ['md-version', JSON.stringify({ id: 'sample_20', seq: 1, version_code: 'V001', version_name: 'V1.0', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 年份
    ['md-year', JSON.stringify({ id: 'sample_21', seq: 1, year_code: '2026', year_name: '2026年', is_valid: 1, valid_from: '2026-01-01', valid_to: '2026-12-31', updatedAt: new Date().toLocaleString() })],
    // 期间
    ['md-period', JSON.stringify({ id: 'sample_22', seq: 1, period_code: 'P01', period_name: '1月', quarter: 'Q1', half_year: 'H1', full_year: '2026', is_valid: 1, valid_from: '2026-01-01', valid_to: '2026-01-31', updatedAt: new Date().toLocaleString() })],
    // 科目维度
    ['md-account', JSON.stringify({ id: 'sample_23', seq: 1, account_code: 'ACC001', account_name: '销售收入', parent_code: '', parent_name: '', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
    // 币种
    ['md-currency', JSON.stringify({ id: 'sample_24', seq: 1, currency_code: 'CNY', currency_name: '人民币', country: '中国', is_valid: 1, valid_from: '2024-01-01', valid_to: '2099-12-31', updatedAt: new Date().toLocaleString() })],
  ];

  const insertMany = db.transaction((data) => {
    for (const [key, json] of data) {
      insert.run(key, json);
    }
  });

  insertMany(sampleData);
  console.log('✅ 插入主数据示例数据');
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
