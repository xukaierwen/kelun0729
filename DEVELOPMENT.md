# 智能预算平台 - 开发指南

## 项目启动

### 1. 安装依赖

```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend
npm install
```

### 2. 启动服务

#### 方式一:分别启动(推荐开发时使用)

```bash
# 终端1: 启动后端服务
cd backend
npm run dev

# 终端2: 启动前端服务
cd frontend
npm run dev
```

#### 方式二:使用脚本一键启动(待配置)

```bash
# 在项目根目录
npm run dev:all
```

### 3. 访问应用

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000
- **健康检查**: http://localhost:8000/api/health

## 当前开发进度

### ✅ 已完成
1. 项目基础结构搭建
2. 前端路由和布局系统
3. 统一工作台页面(首页)
4. 系统配置页面(参数/流程/字典)
5. API请求封装
6. 状态管理基础框架

### 🚧 进行中
- 主数据管理模块开发
- Excel导入导出公共组件

### 📋 待开发
- AI预测引擎模块
- 预算编制核心模块
- 预实分析模块
- 权限管理模块
- 日志审计模块

## 目录结构说明

```
smart-budget-platform/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── api/                # API接口封装
│   │   │   └── index.js       # axios配置和拦截器
│   │   ├── components/         # 公共组件
│   │   │   └── Layout/        # 布局组件
│   │   ├── pages/             # 页面组件
│   │   │   ├── Workbench.jsx  # 工作台
│   │   │   └── SystemConfig/  # 系统配置
│   │   ├── stores/            # Zustand状态管理
│   │   ├── App.jsx            # 应用根组件
│   │   └── main.jsx           # 入口文件
│   └── package.json
│
├── backend/                    # 后端项目
│   ├── server/
│   │   └── index.js           # Express服务入口
│   └── package.json
│
└── README.md
```

## 开发规范

### 前端规范

1. **组件命名**: PascalCase (如 `Workbench.jsx`)
2. **文件命名**: 
   - 组件: PascalCase
   - 工具函数: camelCase
3. **路由路径**: kebab-case (如 `/master-data/org`)
4. **状态管理**: 使用Zustand,按模块拆分store
5. **API调用**: 统一在 `api/` 目录下封装

### 后端规范

1. **RESTful API设计**:
   - GET: 查询
   - POST: 创建
   - PUT: 更新
   - DELETE: 删除
2. **路由组织**: 按模块拆分到 `routes/` 目录
3. **业务逻辑**: 放在 `services/` 目录
4. **数据模型**: 放在 `models/` 目录

## API接口规范

### 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## 常见问题

### 1. 端口冲突

如果3000或8000端口被占用,修改对应配置文件:
- 前端: `frontend/vite.config.js` 中的 `port`
- 后端: `backend/server/index.js` 中的 `PORT`

### 2. 依赖安装失败

```bash
# 清理缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

## 下一步计划

1. **完善系统配置模块**: 
   - 实现真实的API接口
   - 连接数据库持久化配置

2. **开发主数据管理**:
   - 组织架构维护页面
   - 产品档案维护
   - 批量导入功能

3. **Excel组件开发**:
   - 通用导入组件
   - 字段映射配置
   - 数据校验规则

## 技术支持

- React文档: https://react.dev/
- Ant Design: https://ant.design/
- Vite: https://vitejs.dev/
- Zustand: https://zustand-demo.pmnd.rs/
