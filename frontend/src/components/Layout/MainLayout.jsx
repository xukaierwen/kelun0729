import React, { useState, useRef, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Popover, List, Tag } from 'antd';
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
  BellOutlined,
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
        { key: '/dimension/master/project', label: '项目' },
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
        { key: '/dimension/mapping/hq-salesman', label: '虚拟业务员映射表' },
                { key: '/dimension/mapping/mgmt-team', label: '总部管理团队映射表' },
        { key: '/dimension/mapping/salesman-entity', label: '业务员预算实体配置表' },
        { key: '/dimension/mapping/customer-sap', label: '客户主数据映射表' },
        { key: '/dimension/mapping/virtual-product', label: '虚拟产品映射表' },
                { key: '/dimension/mapping/virtual-customer', label: '虚拟客户映射表' },
                        { key: '/dimension/mapping/analysis-convert-factor', label: '分析转换系数配置表' },
                                { key: '/dimension/mapping/hq-dept-attribute', label: '总部直管部门属性维护表' },
      ],
    },
  ],
  budget: [
    {
      key: 'basic-data-import',
      icon: <FileTextOutlined />,
      label: '基础数据导入',
      children: [
        { key: '/budget/annual/import-point', label: '总部点位导入' },
        { key: '/budget/annual/import-point-price', label: '点位费单价导入' },
      ],
    },
    {
      key: 'actual-data',
      icon: <LineChartOutlined />,
      label: '实际数',
      children: [
        {
          key: 'actual-sales',
          label: '销售',
          children: [
            { key: '/budget/actual-sales-region', label: '费用制片区' },
            { key: '/budget/actual-sales-general-agent', label: '总代' },
            { key: '/budget/actual-sales-agent-region', label: '代理制片区' },
            { key: '/budget/actual-sales-hq', label: '总部直营' },
            { key: '/budget/actual-sales-digital', label: '数字营销&城市连锁' },
            { key: '/budget/actual-sales-summary', label: '销售实际数汇总查看' },
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
    {
      key: 'planned-complete',
      icon: <LineChartOutlined />,
      label: '预计完成数',
      children: [
        { key: '/budget/planned-complete-digital', label: '数字营销&城市连锁' },
        { key: '/budget/planned-complete-direct', label: '费用制片区-片区直营' },
        { key: '/budget/planned-complete-investment', label: '费用制片区-片区招商' },
        { key: '/budget/planned-complete-chain', label: '费用制片区-片区城市连锁' },
        { key: '/budget/planned-complete-agent', label: '代理制片区&总代' },
        { key: '/budget/planned-complete-hq', label: '总部直营' },
        { key: '/budget/planned-complete-review', label: '预计完成数审核' },
      ],
    },
    {
      key: 'annual-budget',
      icon: <BarChartOutlined />,
      label: '年度预算',
      children: [
        {
          key: 'target-management',
          label: '目标管理（仅销量）',
          children: [
            { key: '/budget/annual/target-compile', label: '总部目标编制' },
            { key: '/budget/annual/target-review', label: '总部目标审核' },
          ],
        },
        {
          key: 'budget-preparation',
          label: '编制管理',
          children: [
            { key: '/budget/annual/overview', label: '编制总览' },
            {
              key: 'sales-budget',
              label: '销售预算',
              children: [
                { key: '/budget/annual/sales-digital', label: '数字营销&城市连锁' },
                { key: '/budget/annual/sales-direct', label: '费用制片区-片区直营' },
                { key: '/budget/annual/sales-investment', label: '费用制片区-片区招商' },
                { key: '/budget/annual/sales-chain', label: '费用制片区-片区城市连锁' },
                { key: '/budget/annual/sales-agent', label: '代理制片区&总代' },
                { key: '/budget/annual/sales-hq', label: '总部直营' },
              ],
            },
            { key: '/budget/annual/sales-review', label: '销售预算校验审核' },
            {
              key: 'operation-expense',
              label: '运营费用',
              children: [
                { key: '/budget/annual/expense-check', label: '运营费用校验表' },
                { key: '/budget/annual/expense-dept', label: '部门费用 - 输入表' },
                { key: '/budget/annual/expense-market', label: '市场费用 - 输入表' },
                { key: '/budget/annual/expense-salary-count', label: '薪酬人数输入表' },
                { key: '/budget/annual/expense-salary-amount', label: '薪酬金额输入表' },
                { key: '/budget/annual/expense-academic', label: '学术推广费用输入表' },
                { key: '/budget/annual/expense-academic-split', label: '学术项目拆分' },
                { key: '/budget/annual/expense-hospital-project', label: '医院项目 - 项目类输入表' },
                { key: '/budget/annual/expense-hospital-donate', label: '医院项目 - 捐赠类输入表' },
                { key: '/budget/annual/expense-formal-project', label: '正式工程输入表' },
                { key: '/budget/annual/expense-minor-project', label: '零星工程输入表' },
                { key: '/budget/annual/expense-fixed-depreciation', label: '固定资产折旧年限残值率' },
                { key: '/budget/annual/expense-fixed-current', label: '已有固定资产当期折旧' },
                { key: '/budget/annual/expense-fixed-new', label: '新购固定资产价值 - 含税' },
                { key: '/budget/annual/expense-fixed-payment', label: '固定资产付款金额 - 输入表' },
                { key: '/budget/annual/expense-fixed-transfer', label: '工程项目转固输入表' },
                { key: '/budget/annual/expense-fixed-cleanup', label: '预计清理折旧输入表' },
                { key: '/budget/annual/expense-intangible-amortization', label: '无形资产摊销年限输入表' },
                { key: '/budget/annual/expense-intangible-current', label: '已有无形资产当期摊销' },
                { key: '/budget/annual/expense-intangible-payment', label: '无形资产付款金额 - 输入表' },
                { key: '/budget/annual/expense-intangible-transfer', label: '工程项目转无形资产输入表' },
                { key: '/budget/annual/expense-intangible-cleanup', label: '预计清理摊销输入表' },
                { key: '/budget/annual/expense-output', label: '运营费用输出表' },
              ],
            },
            { key: '/budget/annual/expense-review', label: '运营费用审核' },
            { key: '/budget/annual/cost-budget', label: '成本预算' },
            { key: '/budget/annual/profit-table', label: '毛利表' },
            { key: '/budget/annual/annual-review', label: '年度预算审核' },
          ],
        },
      ],
    },
    { key: '/budget/adjust-plan', icon: <FileTextOutlined />, label: '预算调整 6+6' },
    { key: '/budget/rolling-forecast', icon: <LineChartOutlined />, label: '滚动预测' },
    { key: '/budget/analysis', icon: <BarChartOutlined />, label: '预实分析' },
    { key: '/budget/calc-program', icon: <SettingOutlined />, label: '计算程序' },
  ],
  system: [
    { key: '/system/params', label: '系统参数' },
    { key: '/system/workflow', label: '审批流程' },
    { key: '/system/dictionary', label: '字典管理' },
    { key: '/auth/roles', label: '角色管理' },
    { key: '/auth/permissions', label: '权限分配' },
    { key: '/logs/audit', label: '日志审计' },
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
  '/dimension/master/project': '项目',
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
  '/dimension/mapping/hq-salesman': '虚拟业务员映射表',
    '/dimension/mapping/mgmt-team': '总部管理团队映射表',
  '/dimension/mapping/salesman-entity': '业务员预算实体配置表',
  '/dimension/mapping/customer-sap': '客户主数据映射表',
  '/dimension/mapping/virtual-product': '虚拟产品映射表',
    '/dimension/mapping/virtual-customer': '虚拟客户映射表',
      '/dimension/mapping/analysis-convert-factor': '分析转换系数配置表',
        '/dimension/mapping/hq-dept-attribute': '总部直管部门属性维护表',
  '/budget/actual-sales-region': '费用制片区-实际数',
  '/budget/actual-sales-general-agent': '总代-实际数',
  '/budget/actual-sales-agent-region': '代理制片区-实际数',
  '/budget/actual-sales-hq': '总部直营-实际数',
  '/budget/actual-sales-digital': '数字营销&城市连锁-实际数',
  '/budget/actual-sales-summary': '销售实际数汇总查看',
  '/budget/actual-expense-output': '运营费用输出表',
  '/budget/actual-cost-assessment': '成本实际数-考核成本',
  '/budget/planned-complete-digital': '数字营销&城市连锁',
  '/budget/planned-complete-direct': '费用制片区-片区直营',
  '/budget/planned-complete-investment': '费用制片区-片区招商',
  '/budget/planned-complete-chain': '费用制片区-片区城市连锁',
  '/budget/planned-complete-agent': '代理制片区&总代',
  '/budget/planned-complete-hq': '总部直营',
  '/budget/planned-complete-review': '预计完成数审核',
  '/budget/annual/target-compile': '总部目标编制',
  '/budget/annual/target-review': '总部目标审核',
  '/budget/annual/import-point': '总部点位导入',
  '/budget/annual/import-point-price': '点位费单价导入',
  '/budget/annual/overview': '编制总览',
  '/budget/annual/sales-digital': '数字营销&城市连锁',
  '/budget/annual/sales-direct': '费用制片区-片区直营',
  '/budget/annual/sales-investment': '费用制片区-片区招商',
  '/budget/annual/sales-chain': '费用制片区-片区城市连锁',
  '/budget/annual/sales-agent': '代理制片区&总代',
  '/budget/annual/sales-hq': '总部直营',
  '/budget/annual/sales-review': '销售预算校验审核',
  '/budget/annual/expense-check': '运营费用校验表',
  '/budget/annual/expense-dept': '部门费用 - 输入表',
  '/budget/annual/expense-market': '市场费用 - 输入表',
  '/budget/annual/expense-salary-count': '薪酬人数输入表',
  '/budget/annual/expense-salary-amount': '薪酬金额输入表',
  '/budget/annual/expense-academic': '学术推广费用输入表',
  '/budget/annual/expense-academic-split': '学术项目拆分',
  '/budget/annual/expense-hospital-project': '医院项目 - 项目类输入表',
  '/budget/annual/expense-hospital-donate': '医院项目 - 捐赠类输入表',
  '/budget/annual/expense-formal-project': '正式工程输入表',
  '/budget/annual/expense-minor-project': '零星工程输入表',
  '/budget/annual/expense-fixed-depreciation': '固定资产折旧年限残值率',
  '/budget/annual/expense-fixed-current': '已有固定资产当期折旧',
  '/budget/annual/expense-fixed-new': '新购固定资产价值 - 含税',
  '/budget/annual/expense-fixed-payment': '固定资产付款金额 - 输入表',
  '/budget/annual/expense-fixed-transfer': '工程项目转固输入表',
  '/budget/annual/expense-fixed-cleanup': '预计清理折旧输入表',
  '/budget/annual/expense-intangible-amortization': '无形资产摊销年限输入表',
  '/budget/annual/expense-intangible-current': '已有无形资产当期摊销',
  '/budget/annual/expense-intangible-payment': '无形资产付款金额 - 输入表',
  '/budget/annual/expense-intangible-transfer': '工程项目转无形资产输入表',
  '/budget/annual/expense-intangible-cleanup': '预计清理摊销输入表',
  '/budget/annual/expense-output': '运营费用输出表',
  '/budget/annual/expense-review': '运营费用审核',
  '/budget/annual/cost-budget': '成本预算',
  '/budget/annual/profit-table': '毛利表',
  '/budget/annual/annual-review': '年度预算审核',
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
  const [activeThirdLevel, setActiveThirdLevel] = useState(null);
  const [activeFourthLevel, setActiveFourthLevel] = useState(null);
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

  // 鼠标悬停一级菜单（自动滑出）
  const handleFirstLevelHover = (key) => {
    if (!key.startsWith('/')) {
      // 有二级菜单，自动展开
      setActiveFirstLevel(key);
      setActiveSecondLevel(null);
      setActiveThirdLevel(null);
      setActiveFourthLevel(null);
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

  // 鼠标悬停二级菜单（自动滑出）
  const handleSecondLevelHover = (item) => {
    if (item.children) {
      setActiveSecondLevel(item.key);
      setActiveThirdLevel(null);
      setActiveFourthLevel(null);
    }
  };

  // 点击三级菜单（父级或最终页面）
  const handleThirdLevelClick = (item) => {
    if (item.children) {
      // 有子菜单，展开/折叠
      if (activeThirdLevel === item.key) {
        setActiveThirdLevel(null);
        setActiveFourthLevel(null);
      } else {
        setActiveThirdLevel(item.key);
        setActiveFourthLevel(null);
      }
    } else if (item.key.startsWith('/')) {
      // 最终页面
      navigate(item.key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
      setActiveThirdLevel(null);
      setActiveFourthLevel(null);
    }
  };

  // 点击四级菜单（父级或最终页面）
  const handleFourthLevelClick = (item) => {
    if (item.children) {
      // 有子菜单，展开/折叠
      if (activeFourthLevel === item.key) {
        setActiveFourthLevel(null);
      } else {
        setActiveFourthLevel(item.key);
      }
    } else if (item.key.startsWith('/')) {
      // 最终页面
      navigate(item.key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
      setActiveThirdLevel(null);
      setActiveFourthLevel(null);
    }
  };

  // 点击五级菜单（最终页面）
  const handleFifthLevelClick = (item) => {
    if (item.key.startsWith('/')) {
      navigate(item.key);
      setActiveFirstLevel(null);
      setActiveSecondLevel(null);
      setActiveThirdLevel(null);
      setActiveFourthLevel(null);
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

  // 获取第 4 级显示的菜单项
  const currentFourthLevel = activeThirdLevel
    ? (currentDisplayLevel.find(item => item.key === activeThirdLevel)?.children || [])
    : [];

  // 获取第 4 级面板标题
  const fourthLevelTitle = activeThirdLevel
    ? (currentDisplayLevel.find(item => item.key === activeThirdLevel)?.label || '')
    : '';

  // 获取第 5 级显示的菜单项
  const currentFifthLevel = activeFourthLevel
    ? (currentFourthLevel.find(item => item.key === activeFourthLevel)?.children || [])
    : [];

  // 获取第 5 级面板标题
  const fifthLevelTitle = activeFourthLevel
    ? (currentFourthLevel.find(item => item.key === activeFourthLevel)?.label || '')
    : '';

  // 点击内容区域收起所有菜单
  const handleContentClick = () => {
    setActiveFirstLevel(null);
    setActiveSecondLevel(null);
    setActiveThirdLevel(null);
    setActiveFourthLevel(null);
  };

  // 获取当前页面标题
  const currentTitle = pageTitleMap[location.pathname] || '页面';

  // 审核通知数据
  const [notificationOpen, setNotificationOpen] = useState(false)
  const notificationRef = useRef(null)

  // 点击外部关闭通知面板
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const notifications = [
    { id: 1, title: '数字营销&城市连锁 销售预算待审核', desc: '张三提交了2026年度销售预算，待您审核', time: '10分钟前', status: 'pending' },
    { id: 2, title: '费用制片区-片区直营 预计完成数待审核', desc: '李四提交了片区直营预计完成数', time: '30分钟前', status: 'pending' },
    { id: 3, title: '费用制片区-片区招商 实际数待审核', desc: '王五提交了片区招商实际数数据', time: '1小时前', status: 'pending' },
    { id: 4, title: '总部目标编制 待审核', desc: '2026年度总部目标编制完成，待审核确认', time: '2小时前', status: 'pending' },
    { id: 5, title: '运营费用校验表 待审核', desc: '运营费用校验表已提交，请审核', time: '3小时前', status: 'pending' },
  ]

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
          <div className="notification-wrapper" ref={notificationRef}>
            <div className="notification-bell" onClick={() => setNotificationOpen(!notificationOpen)}>
              <Badge count={notifications.length} size="small" offset={[-2, 0]}>
                <BellOutlined style={{ fontSize: 18, color: 'white', cursor: 'pointer' }} />
              </Badge>
            </div>

            {/* 审核通知下拉面板 */}
            {notificationOpen && (
              <div className="notification-panel">
                <div className="notification-header">
                  <span>待审核内容</span>
                  <Tag color="blue">{notifications.length} 条</Tag>
                </div>
                <div className="notification-list">
                  {notifications.map(item => (
                    <div key={item.id} className="notification-item">
                      <div className="notification-item-title">{item.title}</div>
                      <div className="notification-item-desc">{item.desc}</div>
                      <div className="notification-item-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span className="user-name">管理员</span>
        </div>
      </Header>

      <Layout className="body-layout" onClick={handleContentClick}>
        {/* 左侧一级菜单 */}
        <Sider className="first-level-sider" width={150} theme="light" onClick={(e) => e.stopPropagation()}>
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
          <div className="second-level-panel" onClick={(e) => e.stopPropagation()}>
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

        {/* 三级菜单面板 - 最多向右展开三级，之后向下展开 + 缩进 */}
        {activeSecondLevel && currentDisplayLevel.length > 0 && (
          <div className="third-level-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <span>{currentPanelTitle}</span>
            </div>
            <div className="third-level-menu">
              {currentDisplayLevel.map(item => (
                <div key={item.key}>
                  <div
                    className={`third-level-item ${activeThirdLevel === item.key ? 'active' : ''}`}
                    onClick={() => handleThirdLevelClick(item)}
                  >
                    <span className="menu-label">{item.label}</span>
                    {item.children && <span className={activeThirdLevel === item.key ? 'arrow-icon expanded' : 'arrow-icon'}>›</span>}
                  </div>
                  {/* 四级菜单 - 内嵌缩进 */}
                  {activeThirdLevel === item.key && currentFourthLevel.length > 0 && (
                    <div className="sub-menu-inner">
                      {currentFourthLevel.map(child => (
                        <div key={child.key}>
                          <div
                            className={`sub-menu-item level-4 ${activeFourthLevel === child.key ? 'active' : ''} ${location.pathname === child.key ? 'selected' : ''}`}
                            onClick={() => handleFourthLevelClick(child)}
                          >
                            <span className="menu-label">{child.label}</span>
                            {child.children && <span className={activeFourthLevel === child.key ? 'arrow-icon expanded' : 'arrow-icon'}>›</span>}
                          </div>
                          {/* 五级菜单 - 内嵌缩进 */}
                          {activeFourthLevel === child.key && currentFifthLevel.length > 0 && (
                            <div className="sub-menu-inner">
                              {currentFifthLevel.map(grandchild => (
                                <div
                                  key={grandchild.key}
                                  className={`sub-menu-item level-5 ${location.pathname === grandchild.key ? 'active' : ''}`}
                                  onClick={() => handleFifthLevelClick(grandchild)}
                                >
                                  <span className="menu-label">{grandchild.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
