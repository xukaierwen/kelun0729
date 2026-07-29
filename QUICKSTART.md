# 智能预算平台 - 快速启动指南

## 🚀 一键启动 (已完成配置)

### 方式一: 分别启动(推荐)

打开两个终端窗口:

**终端 1 - 后端服务**
```bash
cd D:\SOFTWARE\qodertwo\smart-budget-platform\backend
npm run dev
```

**终端 2 - 前端服务**
```bash
cd D:\SOFTWARE\qodertwo\smart-budget-platform\frontend
npm run dev
```

### 方式二: 使用PowerShell脚本

创建一个启动脚本 `start.ps1`:

```powershell
# 启动后端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\SOFTWARE\qodertwo\smart-budget-platform\backend; npm run dev"

# 等待2秒
Start-Sleep -Seconds 2

# 启动前端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\SOFTWARE\qodertwo\smart-budget-platform\frontend; npm run dev"

# 等待5秒后打开浏览器
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "✅ 智能预算平台已启动!" -ForegroundColor Green
Write-Host "📍 前端: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 后端: http://localhost:8000" -ForegroundColor Cyan
```

## 📍 访问地址

启动成功后,可以访问以下地址:

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | 主界面 |
| 后端API | http://localhost:8000 | API服务 |
| 健康检查 | http://localhost:8000/api/health | 服务状态检查 |

## ✅ 验证清单

启动后,请验证以下功能:

### 前端验证
- [ ] 访问 http://localhost:3000
- [ ] 查看侧边栏菜单是否正常显示
- [ ] 点击"统一工作台"查看首页
- [ ] 查看指标卡片、待办事项、异常预警
- [ ] 点击"系统配置"查看参数配置页面
- [ ] 尝试表单输入和保存

### 后端验证
- [ ] 访问 http://localhost:8000/api/health
- [ ] 确认返回 `{"status": "ok"}`
- [ ] 检查 `backend/database/db.sqlite` 文件是否生成
- [ ] 使用SQLite工具查看表结构

## 🎯 当前可用功能

### 已完成的页面
1. ✅ **统一工作台** - 角色看板、待办、预警、进度
2. ✅ **系统参数配置** - 预测参数、预算周期
3. ✅ **审批流程配置** - 流程列表展示
4. ✅ **字典管理** - 字典分类和项展示
5. ✅ **Excel导入导出** - 通用组件和示例

### 路由导航
所有菜单项都已配置路由,但部分页面显示为占位文本,后续会逐步完善。

## 🔧 开发调试

### 前端调试
- 打开浏览器开发者工具 (F12)
- 查看Console日志
- 使用React Developer Tools扩展

### 后端调试
- 后端使用 `--watch` 模式,代码修改后自动重启
- 查看终端输出的日志
- 数据库文件位置: `backend/database/db.sqlite`

### 数据库查看
推荐使用以下工具查看SQLite数据库:
- **DB Browser for SQLite**: https://sqlitebrowser.org/
- **VS Code扩展**: SQLite Viewer

## 📝 下一步开发建议

### 立即可以做的
1. 浏览已完成的页面,熟悉界面风格
2. 查看 `PROGRESS.md` 了解整体进度
3. 查看需要确认的核心逻辑清单

### 继续开发
1. 完善主数据管理模块页面
2. 实现系统配置的后端API对接
3. 开发预算编制基础框架

## 🐛 常见问题

### 1. 端口被占用
```
错误: Port 3000 is already in use
```

**解决方法**:
- 修改 `frontend/vite.config.js` 中的 `port`
- 或关闭占用端口的进程

### 2. 依赖安装失败
```
错误: npm ERR! code ERESOLVE
```

**解决方法**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 数据库初始化失败
```
错误: unable to open database file
```

**解决方法**:
- 确保 `backend/database` 目录存在
- 检查文件权限

### 4. 前端无法连接后端
```
错误: Network Error
```

**解决方法**:
- 确认后端服务已启动 (http://localhost:8000/api/health)
- 检查 `frontend/vite.config.js` 中的代理配置
- 清除浏览器缓存

## 📚 相关文档

- [README.md](README.md) - 项目总体介绍
- [DEVELOPMENT.md](DEVELOPMENT.md) - 开发指南
- [PROGRESS.md](PROGRESS.md) - 详细进度报告

## 💬 获取帮助

如果遇到问题:
1. 查看本文档的常见问题部分
2. 检查终端输出的错误信息
3. 查看浏览器控制台的错误信息
4. 参考相关技术的官方文档

---

**祝您开发顺利!** 🎉
