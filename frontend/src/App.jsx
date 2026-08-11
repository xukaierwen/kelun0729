import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/Layout/MainLayout';
import Workbench from './pages/Workbench';
import SystemConfig from './pages/SystemConfig';

// 导入新页面
import BudgetDashboard from './pages/budget/BudgetDashboard';
import masterDataPages, { mappingTablePages } from './pages/budget/MasterDataFactory';
import SalesBudgetV2 from './pages/budget/SalesBudgetV2';
import OperationBudget from './pages/budget/OperationBudget';
import ActualDataPage from './pages/budget/ActualDataPage';
import SalesActualSummary from './pages/budget/SalesActualSummary';
import PlannedCompleteTable from './pages/budget/PlannedCompleteTable';
import PlannedCompleteReview from './pages/budget/PlannedCompleteReview';
import TargetCompileTable from './pages/budget/TargetCompileTable';
import TargetReviewTable from './pages/budget/TargetReviewTable';
import OverviewTable from './pages/budget/OverviewTable';
import SalesBudgetTable from './pages/budget/SalesBudgetTable';
import AnalysisReport from './pages/budget/AnalysisReport';
import DimensionNavigator from './pages/budget/DimensionNavigator';
import BudgetNavigator from './pages/budget/BudgetNavigator';
import AnnualBudgetNavigator from './pages/budget/AnnualBudgetNavigator';
import DataImportNavigator from './pages/budget/DataImportNavigator';
import PlaceholderPage from './components/PlaceholderPage';

import './App.css';

// 配置 Ant Design 主题
const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
};

// 辅助函数：渲染主数据页面
const renderMasterDataPage = (pageKey, title) => {
  const PageComponent = masterDataPages[pageKey];
  return PageComponent ? <PageComponent /> : <PlaceholderPage title={title} />;
};

// 辅助函数：渲染映射表页面
const renderMappingPage = (pageKey, title) => {
  const PageComponent = mappingTablePages[pageKey];
  return PageComponent ? <PageComponent /> : <PlaceholderPage title={title} />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/workbench" replace />} />
            <Route path="workbench" element={<Workbench />} />
            
            {/* 首页概览 */}
            <Route path="dashboard" element={<BudgetDashboard />} />
            
            {/* 维度管理 - 导航页 */}
            <Route path="dimension" element={<DimensionNavigator />} />
            
            {/* 维度管理 - 主数据管理 */}
            <Route path="dimension/master/type" element={renderMasterDataPage('md-mgmt-type', '总部管理类型')} />
            <Route path="dimension/master/team" element={renderMasterDataPage('md-mgmt-team', '总部管理团队')} />
            <Route path="dimension/master/business-mode" element={renderMasterDataPage('md-business-mode', '业务模式')} />
            <Route path="dimension/master/sales-mode" element={renderMasterDataPage('md-sales-mode', '片区销售模式')} />
            <Route path="dimension/master/province" element={renderMasterDataPage('md-province', '省份')} />
            <Route path="dimension/master/region" element={renderMasterDataPage('md-region', '片区')} />
            <Route path="dimension/master/entity" element={renderMasterDataPage('md-entity', '实体')} />
            <Route path="dimension/master/sales-group" element={renderMasterDataPage('md-sales-group', '销售组')} />
            <Route path="dimension/master/sales-office" element={renderMasterDataPage('md-sales-office', '销售办公室')} />
            <Route path="dimension/master/sales-officer-hq" element={renderMasterDataPage('md-sales-officer-hq', '一级业务员（总部）')} />
            <Route path="dimension/master/region-dimension" element={renderMasterDataPage('md-region-dimension', '片区管理区域')} />
            <Route path="dimension/master/customer" element={renderMasterDataPage('md-customer', '客户')} />
            <Route path="dimension/master/product" element={renderMasterDataPage('md-product', '产品')} />
            <Route path="dimension/master/product-arch" element={renderMasterDataPage('md-product-arch', '产品架构')} />
            <Route path="dimension/master/department" element={renderMasterDataPage('md-department', '部门')} />
            <Route path="dimension/master/salesman-hn" element={renderMasterDataPage('md-salesman-hn', '业务员（湖南湖北专用）')} />
            <Route path="dimension/master/flow-unit" element={renderMasterDataPage('md-flow-unit', '流向单位（湖南专用）')} />
            <Route path="dimension/master/scenario" element={renderMasterDataPage('md-scenario', '场景')} />
            <Route path="dimension/master/data-scope" element={renderMasterDataPage('md-data-scope', '数据口径')} />
            <Route path="dimension/master/version" element={renderMasterDataPage('md-version', '版本')} />
            <Route path="dimension/master/year" element={renderMasterDataPage('md-year', '年份')} />
            <Route path="dimension/master/period" element={renderMasterDataPage('md-period', '期间')} />
            <Route path="dimension/master/account" element={renderMasterDataPage('md-account', '科目维度')} />
            <Route path="dimension/master/currency" element={renderMasterDataPage('md-currency', '币种')} />
            <Route path="dimension/master/project" element={renderMasterDataPage('md-project', '项目')} />
            
            {/* 维度管理 - 映射表管理 */}
            <Route path="dimension/mapping/business-mode-config" element={renderMappingPage('map-business-mode-config', '业务模式配置表')} />
            <Route path="dimension/mapping/product-owner-config" element={renderMappingPage('map-product-owner-config', '产品负责人配置表')} />
            <Route path="dimension/mapping/product-arch" element={renderMappingPage('map-product-arch', '产品架构表')} />
            <Route path="dimension/mapping/product-arch-mapping" element={renderMappingPage('map-product-arch-mapping', '产品-架构映射表')} />
            <Route path="dimension/mapping/office-group" element={renderMappingPage('map-office-group', '销售办公室-销售组映射表')} />
            <Route path="dimension/mapping/region-salesman" element={renderMappingPage('map-region-salesman', '片区业务员')} />
            <Route path="dimension/mapping/pure-sales" element={renderMappingPage('map-pure-sales', '纯销数据')} />
            <Route path="dimension/mapping/commodity-class" element={renderMappingPage('map-commodity-class', '商品名分类配置表')} />
            <Route path="dimension/mapping/product-tag" element={renderMappingPage('map-product-tag', '片区产品标识配置表')} />
            <Route path="dimension/mapping/dept-belong" element={renderMappingPage('map-dept-belong', '归属部门配置表')} />
            <Route path="dimension/mapping/hq-salesman" element={renderMappingPage('map-hq-salesman', '虚拟业务员映射表')} />
                        <Route path="dimension/mapping/mgmt-team" element={renderMappingPage('map-mgmt-team', '总部管理团队映射表')} />
            <Route path="dimension/mapping/salesman-entity" element={renderMappingPage('map-salesman-entity', '业务员预算实体配置表')} />
            <Route path="dimension/mapping/customer-sap" element={renderMappingPage('map-customer-sap', '客户主数据映射表')} />
            <Route path="dimension/mapping/virtual-product" element={renderMappingPage('map-virtual-product', '虚拟产品映射表')} />
                        <Route path="dimension/mapping/virtual-customer" element={renderMappingPage('map-virtual-customer', '虚拟客户映射表')} />
                                    <Route path="dimension/mapping/analysis-convert-factor" element={renderMappingPage('map-analysis-convert-factor', '分析转换系数配置表')} />
                                                <Route path="dimension/mapping/hq-dept-attribute" element={renderMappingPage('map-hq-dept-attribute', '总部直管部门属性维护表')} />
            
            {/* 预算编制 - 导航页 */}
            <Route path="budget/nav" element={<BudgetNavigator />} />
            
            {/* 年度预算 - 导航页 */}
            <Route path="budget/annual/nav" element={<AnnualBudgetNavigator />} />
            
            {/* 基础数据导入 - 导航页 */}
            <Route path="budget/import/nav" element={<DataImportNavigator />} />
            
            {/* 预算管理 - 实际数（第二章 2.1-2.5） */}
            {/* 2.1 费用制片区（含片区直营/片区招商/片区城市连锁，片区销售模式下拉切换） */}
            <Route path="budget/actual-sales-region" element={<ActualDataPage sectionKey="2.1" />} />
            {/* 2.2 总代（业务模式锁定为总代） */}
            <Route path="budget/actual-sales-general-agent" element={<ActualDataPage sectionKey="2.2" />} />
            {/* 2.3 代理制片区（业务模式锁定为代理制片区） */}
            <Route path="budget/actual-sales-agent-region" element={<ActualDataPage sectionKey="2.3" />} />
            {/* 2.4 总部直营（业务模式锁定为总部直营） */}
            <Route path="budget/actual-sales-hq" element={<ActualDataPage sectionKey="2.4" />} />
            {/* 2.5 数字营销&城市连锁（共用页面，业务模式页内切换） */}
            <Route path="budget/actual-sales-digital" element={<ActualDataPage sectionKey="2.5" />} />
            <Route path="budget/actual-sales-summary" element={<SalesActualSummary />} />
            {/* 旧路由重定向（原三个费用制片区页面合并为 2.1，代理制片区&总代拆分为 2.2/2.3） */}
            <Route path="budget/actual-sales-direct" element={<Navigate to="/budget/actual-sales-region" replace />} />
            <Route path="budget/actual-sales-investment" element={<Navigate to="/budget/actual-sales-region" replace />} />
            <Route path="budget/actual-sales-chain" element={<Navigate to="/budget/actual-sales-region" replace />} />
            <Route path="budget/actual-sales-agent" element={<Navigate to="/budget/actual-sales-general-agent" replace />} />
            <Route path="budget/actual-expense-output" element={<PlaceholderPage title="运营费用输出表" />} />
            <Route path="budget/actual-cost-assessment" element={<PlaceholderPage title="成本实际数-考核成本" />} />
            <Route path="budget/annual/target-compile" element={<TargetCompileTable />} />
            <Route path="budget/annual/target-review" element={<TargetReviewTable />} />
            <Route path="budget/annual/import-point" element={<PlaceholderPage title="总部点位导入" />} />
            <Route path="budget/annual/import-point-price" element={<PlaceholderPage title="点位费单价导入" />} />
            <Route path="budget/annual/overview" element={<OverviewTable />} />
            <Route path="budget/annual/sales-digital" element={<SalesBudgetTable pageTitle="数字营销&城市连锁" />} />
            <Route path="budget/annual/sales-direct" element={<SalesBudgetTable pageTitle="费用制片区-片区直营" />} />
            <Route path="budget/annual/sales-investment" element={<SalesBudgetTable pageTitle="费用制片区-片区招商" />} />
            <Route path="budget/annual/sales-chain" element={<SalesBudgetTable pageTitle="费用制片区-片区城市连锁" />} />
            <Route path="budget/annual/sales-agent" element={<SalesBudgetTable pageTitle="代理制片区&总代" />} />
            <Route path="budget/annual/sales-hq" element={<SalesBudgetTable pageTitle="总部直营" />} />
            <Route path="budget/annual/sales-review" element={<PlaceholderPage title="销售预算校验审核" />} />
            <Route path="budget/annual/expense-check" element={<PlaceholderPage title="运营费用校验表" />} />
            <Route path="budget/annual/expense-dept" element={<PlaceholderPage title="部门费用 - 输入表" />} />
            <Route path="budget/annual/expense-market" element={<PlaceholderPage title="市场费用 - 输入表" />} />
            <Route path="budget/annual/expense-salary-count" element={<PlaceholderPage title="薪酬人数输入表" />} />
            <Route path="budget/annual/expense-salary-amount" element={<PlaceholderPage title="薪酬金额输入表" />} />
            <Route path="budget/annual/expense-academic" element={<PlaceholderPage title="学术推广费用输入表" />} />
            <Route path="budget/annual/expense-academic-split" element={<PlaceholderPage title="学术项目拆分" />} />
            <Route path="budget/annual/expense-hospital-project" element={<PlaceholderPage title="医院项目 - 项目类输入表" />} />
            <Route path="budget/annual/expense-hospital-donate" element={<PlaceholderPage title="医院项目 - 捐赠类输入表" />} />
            <Route path="budget/annual/expense-formal-project" element={<PlaceholderPage title="正式工程输入表" />} />
            <Route path="budget/annual/expense-minor-project" element={<PlaceholderPage title="零星工程输入表" />} />
            <Route path="budget/annual/expense-fixed-depreciation" element={<PlaceholderPage title="固定资产折旧年限残值率" />} />
            <Route path="budget/annual/expense-fixed-current" element={<PlaceholderPage title="已有固定资产当期折旧" />} />
            <Route path="budget/annual/expense-fixed-new" element={<PlaceholderPage title="新购固定资产价值 - 含税" />} />
            <Route path="budget/annual/expense-fixed-payment" element={<PlaceholderPage title="固定资产付款金额 - 输入表" />} />
            <Route path="budget/annual/expense-fixed-transfer" element={<PlaceholderPage title="工程项目转固输入表" />} />
            <Route path="budget/annual/expense-fixed-cleanup" element={<PlaceholderPage title="预计清理折旧输入表" />} />
            <Route path="budget/annual/expense-intangible-amortization" element={<PlaceholderPage title="无形资产摊销年限输入表" />} />
            <Route path="budget/annual/expense-intangible-current" element={<PlaceholderPage title="已有无形资产当期摊销" />} />
            <Route path="budget/annual/expense-intangible-payment" element={<PlaceholderPage title="无形资产付款金额 - 输入表" />} />
            <Route path="budget/annual/expense-intangible-transfer" element={<PlaceholderPage title="工程项目转无形资产输入表" />} />
            <Route path="budget/annual/expense-intangible-cleanup" element={<PlaceholderPage title="预计清理摊销输入表" />} />
            <Route path="budget/annual/expense-output" element={<PlaceholderPage title="运营费用输出表" />} />
            <Route path="budget/annual/expense-review" element={<PlaceholderPage title="运营费用审核" />} />
            <Route path="budget/annual/cost-budget" element={<PlaceholderPage title="成本预算" />} />
            <Route path="budget/annual/profit-table" element={<PlaceholderPage title="毛利表" />} />
            <Route path="budget/annual/annual-review" element={<PlaceholderPage title="年度预算审核" />} />
            <Route path="budget/planned-complete-digital" element={<PlannedCompleteTable pageTitle="数字营销&城市连锁" />} />
            <Route path="budget/planned-complete-direct" element={<PlannedCompleteTable pageTitle="费用制片区-片区直营" />} />
            <Route path="budget/planned-complete-investment" element={<PlannedCompleteTable pageTitle="费用制片区-片区招商" />} />
            <Route path="budget/planned-complete-chain" element={<PlannedCompleteTable pageTitle="费用制片区-片区城市连锁" />} />
            <Route path="budget/planned-complete-agent" element={<PlannedCompleteTable pageTitle="代理制片区&总代" />} />
            <Route path="budget/planned-complete-hq" element={<PlannedCompleteTable pageTitle="总部直营" />} />
            <Route path="budget/planned-complete-review" element={<PlannedCompleteReview />} />
            <Route path="budget/adjust-plan" element={<PlaceholderPage title="预算调整6+6" />} />
            <Route path="budget/rolling-forecast" element={<PlaceholderPage title="滚动预测" />} />
            <Route path="budget/analysis" element={<AnalysisReport />} />
            <Route path="budget/calc-program" element={<PlaceholderPage title="计算程序" />} />
            
            {/* AI模型管理 */}
            <Route path="ml-management" element={<PlaceholderPage title="AI模型管理" />} />
            
            {/* 系统管理 */}
            <Route path="system/params" element={<SystemConfig />} />
            <Route path="system/workflow" element={<SystemConfig />} />
            <Route path="system/dictionary" element={<SystemConfig />} />
            
            {/* 权限管理 */}
            <Route path="auth/roles" element={<PlaceholderPage title="角色管理" />} />
            <Route path="auth/permissions" element={<PlaceholderPage title="权限分配" />} />
            
            {/* 日志审计 */}
            <Route path="logs/audit" element={<PlaceholderPage title="操作日志" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
