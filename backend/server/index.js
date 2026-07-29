import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase, getDatabase } from '../database/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '智能预算平台后端服务运行中',
    timestamp: new Date().toISOString()
  });
});

// ========== 主数据 CRUD API ==========

// 获取主数据列表
app.get('/api/master-data/:tableKey', (req, res) => {
  try {
    const db = getDatabase();
    const { tableKey } = req.params;
    const rows = db.prepare('SELECT * FROM master_data WHERE table_key = ? ORDER BY id DESC').all(tableKey);
    const data = rows.map(row => JSON.parse(row.data_json));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 新增主数据
app.post('/api/master-data/:tableKey', (req, res) => {
  try {
    const db = getDatabase();
    const { tableKey } = req.params;
    const data = req.body;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    data.id = id;
    data.updatedAt = new Date().toLocaleString();
    
    const stmt = db.prepare('INSERT INTO master_data (table_key, data_json) VALUES (?, ?)');
    stmt.run(tableKey, JSON.stringify(data));
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 更新主数据
app.put('/api/master-data/:tableKey', (req, res) => {
  try {
    const db = getDatabase();
    const { tableKey } = req.params;
    const data = req.body;
    data.updatedAt = new Date().toLocaleString();
    
    // 查找现有记录
    const existing = db.prepare('SELECT * FROM master_data WHERE table_key = ?').all(tableKey);
    const row = existing.find(r => {
      const d = JSON.parse(r.data_json);
      return d.id === data.id;
    });
    
    if (row) {
      db.prepare('UPDATE master_data SET data_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(JSON.stringify(data), row.id);
    } else {
      const stmt = db.prepare('INSERT INTO master_data (table_key, data_json) VALUES (?, ?)');
      stmt.run(tableKey, JSON.stringify(data));
    }
    
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== 销售预算 API ==========

// 获取销售预算
app.get('/api/budget/sales', (req, res) => {
  try {
    const db = getDatabase();
    const { year, entity } = req.query;
    let rows;
    if (year && entity) {
      rows = db.prepare('SELECT * FROM sales_budgets WHERE year = ? AND entity = ?').all(year, entity);
    } else {
      rows = db.prepare('SELECT * FROM sales_budgets ORDER BY id DESC').all();
    }
    const data = rows.map(row => ({
      ...row,
      metrics: row.metrics_json ? JSON.parse(row.metrics_json) : {},
    }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 保存销售预算
app.post('/api/budget/sales', (req, res) => {
  try {
    const db = getDatabase();
    const { data } = req.body;
    
    const insertStmt = db.prepare(`
      INSERT INTO sales_budgets (year, entity, management_type, management_team, business_mode, sales_mode, product, salesperson, metrics_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertStmt.run(
          item.year,
          item.entity,
          item.managementType,
          item.managementTeam,
          item.businessMode,
          item.salesMode,
          item.product,
          item.salesperson,
          JSON.stringify(item.metrics || {})
        );
      }
    });
    
    insertMany(data);
    res.json({ success: true, message: '保存成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== 运营费用预算 API ==========

// 获取运营费用预算
app.get('/api/budget/operation', (req, res) => {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM operation_budgets ORDER BY id DESC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 保存运营费用预算
app.post('/api/budget/operation', (req, res) => {
  try {
    const db = getDatabase();
    const { data } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO operation_budgets (department, subject_type, subject, amount, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        stmt.run(item.department, item.subjectType, item.subject, item.amount, item.createdAt);
      }
    });
    
    insertMany(data);
    res.json({ success: true, message: '保存成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 删除运营费用预算
app.delete('/api/budget/operation/:id', (req, res) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    db.prepare('DELETE FROM operation_budgets WHERE id = ?').run(id);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== 实际数 API ==========

// 获取数字营销实际数
app.get('/api/actual-sales/digital-marketing', (req, res) => {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM actual_sales_digital_marketing ORDER BY id DESC').all();
    const data = rows.map(row => JSON.parse(row.data_json));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 新增数字营销实际数
app.post('/api/actual-sales/digital-marketing', (req, res) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const stmt = db.prepare('INSERT INTO actual_sales_digital_marketing (data_json) VALUES (?)');
    stmt.run(JSON.stringify(data));
    res.json({ success: true, message: '新增成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 批量导入数字营销实际数
app.post('/api/actual-sales/digital-marketing/batch', (req, res) => {
  try {
    const db = getDatabase();
    const { data } = req.body;
    const stmt = db.prepare('INSERT INTO actual_sales_digital_marketing (data_json) VALUES (?)');
    
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        stmt.run(JSON.stringify(item));
      }
    });
    
    insertMany(data);
    res.json({ success: true, message: `导入成功：${data.length} 条` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 获取销售实际数汇总
app.get('/api/actual-sales/summary', (req, res) => {
  try {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM actual_sales_summary ORDER BY id DESC').all();
    const data = rows.map(row => JSON.parse(row.data_json));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 批量导入销售实际数汇总
app.post('/api/actual-sales/summary/batch', (req, res) => {
  try {
    const db = getDatabase();
    const { data } = req.body;
    const stmt = db.prepare('INSERT INTO actual_sales_summary (data_json) VALUES (?)');
    
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        stmt.run(JSON.stringify(item));
      }
    });
    
    insertMany(data);
    res.json({ success: true, message: `导入成功：${data.length} 条` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== 仪表盘统计 API ==========

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const db = getDatabase();
    
    const salesBudgetCount = db.prepare('SELECT COUNT(*) as count FROM sales_budgets').get().count;
    const operationBudgetCount = db.prepare('SELECT COUNT(*) as count FROM operation_budgets').get().count;
    const masterDataCount = db.prepare('SELECT COUNT(DISTINCT table_key) as count FROM master_data').get().count;
    
    // 计算销售预算总额
    const salesBudgets = db.prepare('SELECT metrics_json FROM sales_budgets').all();
    let salesTotalAmount = 0;
    salesBudgets.forEach(row => {
      const metrics = JSON.parse(row.metrics_json || '{}');
      Object.values(metrics).forEach(val => {
        salesTotalAmount += parseFloat(val) || 0;
      });
    });
    
    // 计算运营费用总额
    const operationTotal = db.prepare('SELECT SUM(amount) as total FROM operation_budgets').get();
    const operationTotalAmount = operationTotal?.total || 0;
    
    res.json({
      success: true,
      data: {
        salesBudgetCount,
        operationBudgetCount,
        salesTotalAmount,
        operationTotalAmount,
        masterDataCount,
        mappingCount: 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ========== 其他模块占位 API ==========

app.use('/api/workbench', (req, res) => {
  res.json({ message: '工作台模块 - 开发中' });
});

app.use('/api/forecast', (req, res) => {
  res.json({ message: '预测引擎模块 - 开发中' });
});

app.use('/api/analysis', (req, res) => {
  res.json({ message: '预实分析模块 - 开发中' });
});

app.use('/api/auth', (req, res) => {
  res.json({ message: '权限管理模块 - 开发中' });
});

app.use('/api/logs', (req, res) => {
  res.json({ message: '日志审计模块 - 开发中' });
});

// 启动服务 - 监听所有网络接口（支持局域网访问）
app.listen(PORT, '0.0.0.0', () => {
  // 初始化数据库
  initDatabase();
  
  console.log(`🚀 智能预算平台后端服务已启动`);
  console.log(`📍 本地地址: http://localhost:${PORT}`);
  console.log(`🌐 局域网地址: http://10.200.5.181:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
});
