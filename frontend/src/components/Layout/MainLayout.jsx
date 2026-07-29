import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  DollarOutlined,
  BgColorsOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

// 四级菜单配置
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '首页概览',
  },
  {
    key: 'dimension',
    icon: <DatabaseOutlined />,
    label: '维度管理',
    children: [
      {
        key: 'master-data',
        icon: <AppstoreOutlined />,
        label: '主数据管理',
        children: [
          { key: '/dimension/master/type', label: '总部管理类型' },
          { key: '/dimension/master/team', label: '总部管理团队' },
          { key: '/dimension/master/business-mode', label: '业务模式' },
          { key: '/dimension/master/sales-mode', label: '销售模式' },
          { key: '/dimension/master/currency', label: '币种' },
          { key: '/dimension/master/product', label: '产品主数据' },
          { key: '/dimension/master/province', label: '省份' },
          { key: '/dimension/master/sales-officer-hq', label: '一级业务员(总部)' },
          { key: '/dimension/master/sales-office', label: '销售办公室' },
          { key: '/dimension/master/sales-group', label: '销售组(片区业务员1)' },
          { key: '/dimension/master/region-dimension', label: '片区管理维度' },
          { key: '/dimension/master/customer', label: '客户主数据' },
          { key: '/dimension/master/entity', label: '实体' },
          { key: '/dimension/master/department', label: '部门' },
          { key: '/dimension/master/scenario', label: '场景' },
          { key: '/dimension/master/version', label: '版本' },
          { key: '/dimension/master/period', label: '期间' },
          { key: '/dimension/master/year', label: '年份' },
          { key: '/dimension/master/account', label: '科目' },
          { key: '/dimension/master/project', label: '项目主数据' },
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
          { key: '/dimension/mapping/product-arch-mapping', label: '产品-架构映射表' },
          { key: '/dimension/mapping/office-group', label: '销售办公室-销售组映射表' },
          { key: '/dimension/mapping/region-salesman', label: '片区业务员(片区业务员2)' },
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
  },
  {
    key: 'budget',
    icon: <DollarOutlined />,
    label: '预算管理',
    children: [
      {
        key: 'actual-data',
        icon: <LineChartOutlined />,
        label: '实际数',
        children: [
          {
            key: 'actual-data-before',
            label: '实际数调整前',
            children: [
              {
                key: 'actual-sales',
                label: '销售实际数',
                children: [
                  { key: '/budget/actual-sales-digital', label: '数字营销' },
                ],
              },
            ],
          },
          {
            key: 'actual-data-summary',
            label: '实际数汇总查看',
            children: [
              { key: '/budget/actual-sales-summary', label: '销售实际数汇总查看' },
            ],
          },
        ],
      },
      { key: '/budget/actual-before', icon: <LineChartOutlined />, label: '实际数调整前' },
      { key: '/budget/planned-complete', icon: <LineChartOutlined />, label: '预计完成数' },
      { key: '/budget/annual', icon: <BarChartOutlined />, label: '年度预算' },
      { key: '/budget/adjust-plan', icon: <FileTextOutlined />, label: '预算调整6+6' },
      { key: '/budget/rolling-forecast', icon: <LineChartOutlined />, label: '滚动预测' },
      { key: '/budget/analysis', icon: <BarChartOutlined />, label: '预实分析' },
      { key: '/budget/calc-program', icon: <SettingOutlined />, label: '计算程序' },
    ],
  },
  {
    key: '/ml-management',
    icon: <BgColorsOutlined />,
    label: 'AI模型管理',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/params', label: '系统参数' },
      { key: '/system/workflow', label: '审批流程' },
      { key: '/system/dictionary', label: '字典管理' },
    ],
  },
  {
    key: 'auth',
    icon: <UserOutlined />,
    label: '权限管理',
    children: [
      { key: '/auth/roles', label: '角色管理' },
      { key: '/auth/permissions', label: '权限分配' },
    ],
  },
  {
    key: '/logs/audit',
    icon: <FileTextOutlined />,
    label: '日志审计',
  },
];

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 用户菜单
  const userMenuItems = [
    { key: 'profile', label: '个人信息' },
    { key: 'logout', label: '退出登录' },
  ];

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={220}>
        <div className="logo">
          <h2>{collapsed ? '预算' : '智能预算平台'}</h2>
        </div>
        <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['dimension', 'master-data', 'mapping-table', 'budget', 'actual-data', 'actual-data-before', 'actual-data-summary', 'actual-sales', 'system', 'auth']}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ marginTop: 8, borderRight: 0 }}
          />
        </div>
      </Sider>
      
      <Layout>
        <Header className="site-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          
          <div className="header-right">
            <Badge count={5} size="small">
              <BellOutlined className="header-icon" />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }}>
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
