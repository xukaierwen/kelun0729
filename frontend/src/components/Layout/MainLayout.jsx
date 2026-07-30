import React, { useState } from 'react';
import { Layout, Menu, Input } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  DollarOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  ApiOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  LineChartOutlined,
  BarChartOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

// 一级菜单配置
const firstLevelMenus = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '首页概览',
  },
  {
    key: 'dimension',
    icon: <DatabaseOutlined />,
    label: '维度管理',
  },
  {
    key: 'budget',
    icon: <DollarOutlined />,
    label: '预算管理',
  },
  {
    key: '/ml-management',
    icon: <BgColorsOutlined />,
    label: 'AI 模型管理',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
  },
  {
    key: 'auth',
    icon: <UserOutlined />,
    label: '权限管理',
  },
  {
    key: '/logs/audit',
    icon: <FileTextOutlined />,
    label: '日志审计',
  },
];

// 二级菜单配置
const secondLevelMenus = {
  dimension: [
    {
      key: 'master-data',
      icon: <AppstoreOutlined />,
      label: '主数据管理',
      children: [
        { key: '/dimension/master/type', label: '总部管理类型' },
        { key: '/dimension/master/team', label: '总部管理团队' },
        { key: '/dimension/master/business-mode', label: '业务模式' },
        { key: '/dimension/master/sales-mode', label: '片区销售模式' },
        { key: '/dimension/master/province', label: '省份' },
        { key: '/dimension/master/region', label: '片区' },
        { key: '/dimension/master/entity', label: '实体' },
        { key: '/dimension/master/sales-group', label: '销售组' },
        { key: '/dimension/master/sales-office', label: '销售办公室' },
        { key: '/dimension/master/sales-officer-hq', label: '一级业务员（总部）' },
        { key: '/dimension/master/region-dimension', label: '片区管理区域' },
        { key: '/dimension/master/customer', label: '客户' },
        { key: '/dimension/master/product', label: '产品' },
        { key: '/dimension/master/product-arch', label: '产品架构' },
        { key: '/dimension/master/department', label: '部门' },
        { key: '/dimension/master/salesman-hn', label: '业务员（湖南湖北专用）' },
        { key: '/dimension/master/flow-unit', label: '流向单位（湖南专用）' },
        { key: '/dimension/master/scenario', label: '场景' },
        { key: '/dimension/master/data-scope', label: '数据口径' },
        { key: '/dimension/master/version', label: '版本' },
        { key: '/dimension/master/year', label: '年份' },
        { key: '/dimension/master/period', label: '期间' },
        { key: '/dimension/master/account', label: '科目维度' },
        { key: '/dimension/master/currency', label: '币种' },
      ],
    },
    {
      key: 'mapping-table',
      icon: <FileTextOutlined />,
      label: '映射表管理',
      children: [
        { key: '/dimension/mapping/business-mode-config', label: '业务模式配置表' },
        { key: '/dimension/mapping/product-owner-config', label: '产品负责人配置表' },
        { key: '/dimension/mapping/product-arch', label: '产品架构表' },
        { key: '/dimension/mapping/product-arch-mapping', label: '产品 - 架构映射表' },
        { key: '/dimension/mapping/office-group', label: '销售办公室 - 销售组映射表' },
        { key: '/dimension/mapping/region-salesman', label: '片区业务员 (片区业务员 2)' },
        { key: '/dimension/mapping/pure-sales', label: '纯销数据' },
        { key: '/dimension/mapping/commodity-class', label: '商品名分类配置表' },
        { key: '/dimension/mapping/product-tag', label: '片区产品标识配置表' },
        { key: '/dimension/mapping/dept-belong', label: '归属部门配置表' },
        { key: '/dimension/mapping/hq-salesman', label: '一级业务员配置表' },
        { key: '/dimension/mapping/salesman-entity', label: '业务员预算实体配置表' },
        { key: '/dimension/mapping/customer-sap', label: '客户主数据映射表' },
        { key: '/dimension/mapping/virtual-product', label: '虚拟产品映射表' },
      ],
    },
  ],
  budget: [
    {
      key: 'actual-data',
      icon: <LineChartOutlined />,
      label: '实际数',
      children: [
        {
          key: 'actual-sales',
          label: '销售',
          children: [
            { key: '/budget/actual-sales-digital', label: '数字营销&城市连锁' },
            { key: '/budget/actual-sales-direct', label: '费用制片区-片区直营' },
            { key: '/budget/actual-sales-investment', label: '费用制片区-片区招商' },
            { key: '/budget/actual-sales-chain', label: '费用制片区-片区城市连锁' },
            { key: '/budget/actual-sales-agent', label: '代理制片区&总代' },
            { key: '/budget/actual-sales-hq', label: '总部直营' },
          ],
        },
        {
          key: 'actual-expense',
          label: '费用',
          children: [
            { key: '/budget/actual-expense-output', label: '运营费用输出表' },
          ],
        },
        {
          key: 'actual-cost',
          label: '成本',
          children: [
            { key: '/budget/actual-cost-assessment', label: '成本实际数-考核成本' },
          ],
        },
      ],
    },
    { key: '/budget/actual-before', icon: <LineChartOutlined />, label: '实际数调整前' },
    { key: '/budget/planned-complete', icon: <LineChartOutlined />, label: '预计完成数' },
    { key: '/budget/annual', icon: <BarChartOutlined />, label: '年度预算' },
    { key: '/budget/adjust-plan', icon: <FileTextOutlined />, label: '预算调整 6+6' },
    { key: '/budget/rolling-forecast', icon: <LineChartOutlined />, label: '滚动预测' },
    { key: '/budget/analysis', icon: <BarChartOutlined />, label: '预实分析' },
    { key: '/budget/calc-program', icon: <SettingOutlined />, label: '计算程序' },
  ],
  system: [
    { key: '/system/params', label: '系统参数' },
    { key: '/system/workflow', label: '审批流程' },
    { key: '/system/dictionary', label: '字典管理' },
  ],
  auth: [
    { key: '/auth/roles', label: '角色管理' },
    { key: '/auth/permissions', label: '权限分配' },
  ],
};

// 页面标题映射
const pageTitleMap = {
  '/dashboard': '首页概览',
  '/dimension/master/type': '总部管理类型',
  '/dimension/master/team': '总部管理团队',
  '/dimension/master/business-mode': '业务模式',
  '/dimension/master/sales-mode': '片区销售模式',
  '/dimension/master/province': '省份',
  '/dimension/master/region': '片区',
  '/dimension/master/entity': '实体',
  '/dimension/master/sales-group': '销售组',
  '/dimension/master/sales-office': '销售办公室',
  '/dimension/master/sales-officer-hq': '一级业务员（总部）',
  '/dimension/master/region-dimension': '片区管理区域',
  '/dimension/master/customer': '客户',
  '/dimension/master/product': '产品',
  '/dimension/master/product-arch': '产品架构',
  '/dimension/master/department': '部门',
  '/dimension/master/salesman-hn': '业务员（湖南湖北专用）',
  '/dimension/master/flow-unit': '流向单位（湖南专用）',
  '/dimension/master/scenario': '场景',
  '/dimension/master/data-scope': '数据口径',
  '/dimension/master/version': '版本',
  '/dimension/master/year': '年份',
  '/dimension/master/period': '期间',
  '/dimension/master/account': '科目维度',
  '/dimension/master/currency': '币种',
  '/dimension/mapping/business-mode-config': '业务模式配置表',
  '/dimension/mapping/product-owner-config': '产品负责人配置表',
  '/dimension/mapping/product-arch': '产品架构表',
  '/dimension/mapping/product-arch-mapping': '产品 - 架构映射表',
  '/dimension/mapping/office-group': '销售办公室 - 销售组映射表',
  '/dimension/mapping/region-salesman': '片区业务员 (片区业务员 2)',
  '/dimension/mapping/pure-sales': '纯销数据',
  '/dimension/mapping/commodity-class': '商品名分类配置表',
  '/dimension/mapping/product-tag': '片区产品标识配置表',
  '/dimension/mapping/dept-belong': '归属部门配置表',
  '/dimension/mapping/hq-salesman': '一级业务员配置表',
  '/dimension/mapping/salesman-entity': '业务员预算实体配置表',
  '/dimension/mapping/customer-sap': '客户主数据映射表',
  '/dimension/mapping/virtual-product': '虚拟产品映射表',
  '/budget/actual-sales-digital': '数字营销&城市连锁',
  '/budget/actual-sales-direct': '费用制片区-片区直营',
  '/budget/actual-sales-investment': '费用制片区-片区招商',
  '/budget/actual-sales-chain': '费用制片区-片区城市连锁',
  '/budget/actual-sales-agent': '代理制片区&总代',
  '/budget/actual-sales-hq': '总部直营',
  '/budget/actual-expense-output': '运营费用输出表',
  '/budget/actual-cost-assessment': '成本实际数-考核成本',
  '/budget/actual-before': '实际数调整前',
  '/budget/planned-complete': '预计完成数',
  '/budget/annual': '年度预算',
  '/budget/adjust-plan': '预算调整 6+6',
  '/budget/rolling-forecast': '滚动预测',
  '/budget/analysis': '预实分析',
  '/budget/calc-program': '计算程序',
  '/ml-management': 'AI 模型管理',
  '/system/params': '系统参数',
  '/system/workflow': '审批流程',
  '/system/dictionary': '字典管理',
  '/auth/roles': '角色管理',
  '/auth/permissions': '权限分配',
  '/logs/audit': '日志审计',
};

function MainLayout() {
  const [searchText, setSearchText] = useState('');
  const [activeFirstLevel, setActiveFirstLevel] = useState(null);
  const [activeSecondLevel, setActiveSecondLevel] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 点击一级菜单
  const handleFirstLevelClick = (key) => {
    if (key.startsWith('/')) {
      // 直接是页面路由
      navigate(key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
    } else {
      // 有二级菜单 - 支持切换收起/展开
      if (activeFirstLevel === key) {
        // 再次点击同一个菜单，收起面板
        setActiveFirstLevel(null);
        setActiveSecondLevel(null);
      } else {
        // 点击不同的菜单，展开对应的二级菜单
        setActiveFirstLevel(key);
        setActiveSecondLevel(null);
      }
    }
  };

  // 点击二级菜单
  const handleSecondLevelClick = (item) => {
    if (item.children) {
      // 有三级菜单
      setActiveSecondLevel(item.key);
    } else if (item.key.startsWith('/')) {
      // 直接是页面路由 - 自动收起菜单
      navigate(item.key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
    }
  };

  // 点击三级菜单（最终页面或父级）
  const handleThirdLevelClick = (item) => {
    if (item.children) {
      // 有子菜单，显示子菜单
      setActiveSecondLevel(item.key);
    } else {
      // 最终页面
      navigate(item.key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
    }
  };

  // 获取当前一级菜单的二级菜单
  const currentSecondLevel = activeFirstLevel ? secondLevelMenus[activeFirstLevel] || [] : [];
  
  // 获取当前显示的菜单项（可能是二级或三级）
  const currentDisplayLevel = activeSecondLevel 
    ? (currentSecondLevel.find(item => item.key === activeSecondLevel)?.children || 
       currentSecondLevel.flatMap(item => item.children || []).find(c => c.key === activeSecondLevel)?.children ||
       [])
    : [];

  // 获取当前面板标题
  const currentPanelTitle = activeSecondLevel
    ? (currentSecondLevel.find(item => item.key === activeSecondLevel)?.label ||
       currentSecondLevel.flatMap(item => item.children || []).find(c => c.key === activeSecondLevel)?.label ||
       '')
    : '';

  // 获取当前页面标题
  const currentTitle = pageTitleMap[location.pathname] || '页面';

  return (
    <Layout className="main-layout">
      {/* 顶部蓝色导航栏 */}
      <Header className="top-header">
        <div className="header-left">
          <div className="logo-area">
            <ApiOutlined className="logo-icon" />
            <span className="logo-text">智能预算平台</span>
          </div>
        </div>
        <div className="header-center">
          <div className="workspace-tab">
            <DashboardOutlined />
            <span>工作台</span>
          </div>
          <div className="current-page-tab">
            <span>{currentTitle}</span>
          </div>
        </div>
        <div className="header-right">
          <span className="user-name">管理员</span>
        </div>
      </Header>

      <Layout className="body-layout">
        {/* 左侧一级菜单 */}
        <Sider className="first-level-sider" width={200} theme="light">
          <div className="search-area">
            <Input
              placeholder="全站搜索"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="small"
            />
          </div>
          <div className="first-level-menu">
            {firstLevelMenus.map(item => (
              <div
                key={item.key}
                className={`first-level-item ${activeFirstLevel === item.key ? 'active' : ''} ${location.pathname === item.key ? 'selected' : ''}`}
                onClick={() => handleFirstLevelClick(item.key)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
                {secondLevelMenus[item.key] && <span className="arrow-icon">›</span>}
              </div>
            ))}
          </div>
        </Sider>

        {/* 二级菜单面板 */}
        {activeFirstLevel && (
          <div className="second-level-panel">
            <div className="panel-header">
              <span>{firstLevelMenus.find(m => m.key === activeFirstLevel)?.label}</span>
            </div>
            <div className="second-level-menu">
              {currentSecondLevel.map(item => (
                <div
                  key={item.key}
                  className={`second-level-item ${activeSecondLevel === item.key ? 'active' : ''}`}
                  onClick={() => handleSecondLevelClick(item)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {item.children && <span className="arrow-icon">›</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 三级菜单面板 */}
        {activeSecondLevel && currentDisplayLevel.length > 0 && (
          <div className="third-level-panel">
            <div className="panel-header">
              <span>{currentPanelTitle}</span>
            </div>
            <div className="third-level-menu">
              {currentDisplayLevel.map(item => (
                <div
                  key={item.key}
                  className={`third-level-item ${location.pathname === item.key ? 'active' : ''}`}
                  onClick={() => handleThirdLevelClick(item)}
                >
                  <span className="menu-label">{item.label}</span>
                  {item.children && <span className="arrow-icon">›</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
