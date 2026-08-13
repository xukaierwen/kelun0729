// ============================================================
// 预计完成数（Tab 1-5）页面配置
// 依据：需求文档「预计完成数」Tab 1-5 章节
// 说明：后台字段（年份/总部管理类型/总部管理团队/业务模式/数据口径/当期累计）仅作筛选与保存入参，不渲染为列
// structure 说明：
//   salesVolume - 销售量特殊结构（实际数-调整后 1-9月+合计 / 预算调整 6+6 / 预计调整数变化值 1-12月+合计 / 全年合计）
//   auto        - 自动取数，单列展示（不拆月）
//   monthly     - 按 1-12 月拆 12 列（无全年合计）
//   total       - 按 1-12 月拆 12 列 + 全年合计列（无变化值列）
//   changeOnly  - 按 1-12 月拆 12 列 + 1 列「变化值」（无全年合计）
//   change      - 按 1-12 月拆 12 列 + 1 列「变化值」 + 全年合计列
// showWhen: { field, includesAny: [...] } 表示多选命中任一值即展示；未选择（空）时展示全部
// ============================================================

import {
  YEAR_OPTIONS,
  MGMT_TYPE_OPTIONS,
  MGMT_TEAM_MAP,
  SALESMAN_OPTIONS,
  PERIOD_TYPE_OPTIONS,
} from './actualDataDefs'

export { YEAR_OPTIONS, MGMT_TYPE_OPTIONS, MGMT_TEAM_MAP, SALESMAN_OPTIONS, PERIOD_TYPE_OPTIONS }

// ---------- 业务模式值集 ----------
export const BUSINESS_MODEL_OPTIONS = ['费用制片区', '总代', '代理制片区', '总部直营', '数字营销', '城市连锁']
// 片区销售模式值集
export const SALES_MODE_OPTIONS = ['片区直营', '片区招商', '片区城市连锁']

// 产品分析架构（下拉树，demo 模拟）
export const ANALYSIS_ARCH_TREE = [
  {
    title: '处方药',
    value: '处方药',
    children: [
      { title: '输液', value: '处方药-输液' },
      { title: '固体制剂', value: '处方药-固体制剂' },
      { title: '注射剂', value: '处方药-注射剂' },
    ],
  },
  {
    title: 'OTC',
    value: 'OTC',
    children: [
      { title: '口服制剂', value: 'OTC-口服制剂' },
      { title: '外用药', value: 'OTC-外用药' },
    ],
  },
  {
    title: '大健康',
    value: '大健康',
    children: [{ title: '营养品', value: '大健康-营养品' }],
  },
]

// 导入导出模板（飞书共享表格，Tab1 使用）
export const IMPORT_TEMPLATE_URL = 'https://u0vocx8xrmg.feishu.cn/sheets/EoMGsRr4whs9Zttud9YcIeU9nLc'

// ---------- 通用单列字段片段 ----------
// Tab 2/3/4 共用基础（Tab4 不含服务费系数）
const AGENT_BASE_FIXED = [
  { key: 'entity', title: '实体', width: 130 },
  { key: 'product_owner_hq', title: '产品负责人（总部）', width: 130 },
  { key: 'province', title: '省份', width: 90 },
  { key: 'salesman_lv1', title: '一级业务员', width: 110 },
  { key: 'product_code', title: '产品编码', width: 110 },
  { key: 'product_name', title: '产品名称', width: 140 },
  { key: 'spec', title: '规格', width: 100 },
  { key: 'package_spec', title: '包装规格', width: 100 },
  { key: 'product_type', title: '类型', width: 80 },
  { key: 'package_class', title: '包装分类', width: 100 },
  { key: 'unit', title: '计量单位', width: 80 },
  { key: 'approval_mfr', title: '批文厂家', width: 120 },
  { key: 'produce_mfr', title: '生产厂家', width: 120 },
  { key: 'analysis_arch', title: '分析架构', width: 110 },
  { key: 'group_purchase_attr', title: '集采属性', width: 100 },
  { key: 'group_purchase_batch', title: '集采批次', width: 100 },
  { key: 'min_spec_rate', title: '最小规格转换率', width: 110 },
  { key: 'vat_rate', title: '增值税销项税率', width: 110 },
]

// ---------- 各 Tab 配置 ----------
export const PLANNED_COMPLETE_SECTIONS = {
  // ---------------- Tab 1 费用制片区 ----------------
  region: {
    key: 'region',
    title: '费用制片区',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', multiple: true, options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', multiple: true, dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['费用制片区'], locked: true, defaultValue: '费用制片区' },
      { key: 'sales_mode', label: '片区销售模式', type: 'select', options: SALES_MODE_OPTIONS, defaultValue: '片区直营', required: true },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'analysis_arch', label: '产品分析架构', type: 'treeSelect', options: ANALYSIS_ARCH_TREE },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
      { key: 'sales_mode', title: '片区销售模式', width: 110 },
      { key: 'delivery_mode', title: '医贸发货模式', width: 120 },
      { key: 'entity', title: '实体', width: 130 },
      { key: 'belong_dept', title: '归属部门', width: 120 },
      { key: 'product_owner_hq', title: '产品负责人（总部）', width: 130 },
      { key: 'product_owner_region', title: '产品负责人（片区）', width: 130 },
      { key: 'province', title: '省份', width: 90 },
      { key: 'salesman_lv1', title: '一级业务员', width: 110 },
      { key: 'sales_office', title: '销售办公室', width: 110 },
      { key: 'sales_group', title: '销售组', width: 110 },
      { key: 'region_manage', title: '片区管理区域', width: 130 },
      { key: 'salesman_hn', title: '业务员（湖南湖北专用）', width: 140 },
      { key: 'deliver_customer', title: '发货客户', width: 120 },
      { key: 'pure_customer', title: '纯销客户', width: 120 },
      { key: 'flow_unit', title: '流向单位（湖南片区专用）', width: 140 },
      { key: 'product_code', title: '产品编码', width: 110 },
      { key: 'product_name', title: '产品名称', width: 140 },
      { key: 'spec', title: '规格', width: 100 },
      { key: 'package_spec', title: '包装规格', width: 100 },
      { key: 'product_type', title: '类型', width: 80 },
      { key: 'package_class', title: '包装分类', width: 100 },
      { key: 'unit', title: '计量单位', width: 80 },
      { key: 'approval_mfr', title: '批文厂家', width: 120 },
      { key: 'produce_mfr', title: '生产厂家', width: 120 },
      { key: 'analysis_arch', title: '分析架构', width: 110 },
      { key: 'group_purchase_attr', title: '集采属性', width: 100 },
      { key: 'group_purchase_batch', title: '集采批次', width: 100 },
    ],
    metricGroups: [
      { key: 'sales_volume', title: '销售量', structure: 'salesVolume' },
      { key: 'convert_factor', title: '分析转换系数', structure: 'monthly' },
      { key: 'sales_volume_conv', title: '销售量-转换后', structure: 'sv14', precision: 2 },
      { key: 'min_spec_rate', title: '最小规格转换率', structure: 'auto' },
      { key: 'sales_volume_min_spec', title: '销售量-最小规格', structure: 'sv14', precision: 2 },
      { key: 'bid_price', title: '中标价/交易价', structure: 'sv13' },
      { key: 'bid_amount', title: '中标/交易金额', structure: 'sv14', precision: 2 },
      { key: 'delivery_point_ratio', title: '配送点位(%)', structure: 'sv13', isPercent: true },
      { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', structure: 'sv14' },
      { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_post', title: '销售收入-含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'vat_rate', title: '增值税销项税率', structure: 'auto' },
      { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', structure: 'sv14', precision: 2 },
      // 片区直营限定（非片区直营不显示）
      { key: 'hq_region_point_ratio', title: '总部销售团队点位（%）', structure: 'mg12', isPercent: true, showWhen: { field: 'sales_mode', includesAny: ['片区直营'] } },
      { key: 'region_team_point_ratio', title: '片区销售团队点位(%)', structure: 'mg12', isPercent: true, showWhen: { field: 'sales_mode', includesAny: ['片区直营'] } },
      { key: 'point_price', title: '点位费单价', structure: 'mg12', showWhen: { field: 'sales_mode', includesAny: ['片区直营'] } },
      { key: 'market_maintain_point', title: '市场维护费-点位费', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区直营'] } },
      // 片区招商/城市连锁限定（非片区招商/城市连锁不显示）
      { key: 'service_fee_price_pre', title: '客户服务费单价-折前', structure: 'mg12', showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'promo_fee_price_pre', title: '客户促销费单价-折前', structure: 'mg12', showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'rebate_fee_price_pre', title: '客户返利费单价-折前', structure: 'mg12', showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'market_maintain_cust_pre', title: '市场维护费-客户费用-折前', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'service_fee_amount_pre', title: '客户服务费金额-折前', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'promo_fee_amount_pre', title: '客户促销费金额-折前', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'rebate_fee_amount_pre', title: '客户返利费金额-折前', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'market_maintain_cust_disc', title: '市场维护费-客户费用-折扣', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'service_fee_amount_disc', title: '客户服务费金额-折扣', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'promo_fee_amount_disc', title: '客户促销费金额-折扣', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'rebate_fee_amount_disc', title: '客户返利费金额-折扣', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'market_maintain_cust_post', title: '市场维护费-客户费用-折后', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'service_fee_amount_post', title: '客户服务费金额-折后', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'promo_fee_amount_post', title: '客户促销费金额-折后', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'rebate_fee_amount_post', title: '客户返利费金额-折后', structure: 'sv14', precision: 2, showWhen: { field: 'sales_mode', includesAny: ['片区招商', '片区城市连锁'] } },
      { key: 'purchase_price_incl', title: '采购单价-含税', structure: 'sv13' },
      { key: 'purchase_amount_incl', title: '采购金额-含税', structure: 'sv14', precision: 2 },
      { key: 'avg_assess_price_1', title: '平均考核价1', structure: 'mg12' },
      { key: 'latest_assess_price_1', title: '最新考核价1', structure: 'mg12' },
      { key: 'cust_point_fee', title: '客户服务费-点位费', structure: 'mg12' },
    ],
  },

  // ---------------- Tab 2 总代 ----------------
  general_agent: {
    key: 'general_agent',
    title: '总代',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', multiple: true, options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', multiple: true, dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['总代'], locked: true, defaultValue: '总代' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: AGENT_BASE_FIXED.filter((c) => c.key !== 'min_spec_rate' && c.key !== 'vat_rate'),
    metricGroups: [
      { key: 'sales_volume', title: '销售量', structure: 'salesVolume' },
      { key: 'convert_factor', title: '分析转换系数', structure: 'monthly' },
      { key: 'sales_volume_conv', title: '销售量-转换后', structure: 'sv14', precision: 2 },
      { key: 'min_spec_rate', title: '最小规格转换率', structure: 'auto' },
      { key: 'sales_volume_min_spec', title: '销售量-最小规格', structure: 'sv14', precision: 2 },
      { key: 'bid_price', title: '中标价/交易价', structure: 'sv13' },
      { key: 'bid_amount', title: '中标/交易金额', structure: 'sv14', precision: 2 },
      { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', structure: 'sv13' },
      { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_post', title: '销售收入-含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'vat_rate', title: '增值税销项税率', structure: 'auto' },
      { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'service_fee_coef', title: '服务费系数', structure: 'auto' },
      { key: 'service_fee_price', title: '服务费单价', structure: 'sv13nt' },
      { key: 'service_fee_amount', title: '服务费金额', structure: 'sv14', precision: 2 },
      { key: 'purchase_price_incl', title: '采购单价-含税', structure: 'sv14' },
      { key: 'purchase_amount_incl', title: '采购金额-含税', structure: 'sv13', precision: 2 },
      { key: 'avg_assess_price_1', title: '平均考核价1', structure: 'mg12' },
      { key: 'latest_assess_price_1', title: '最新考核价1', structure: 'mg12' },
    ],
  },

  // ---------------- Tab 3 代理制片区 ----------------
  agent_region: {
    key: 'agent_region',
    title: '代理制片区',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', multiple: true, options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', multiple: true, dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['代理制片区'], locked: true, defaultValue: '代理制片区' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: AGENT_BASE_FIXED.filter((c) => c.key !== 'min_spec_rate' && c.key !== 'vat_rate'),
    metricGroups: [
      { key: 'sales_volume', title: '销售量', structure: 'salesVolume' },
      { key: 'convert_factor', title: '分析转换系数', structure: 'monthly' },
      { key: 'sales_volume_conv', title: '销售量-转换后', structure: 'sv14', precision: 2 },
      { key: 'min_spec_rate', title: '最小规格转换率', structure: 'auto' },
      { key: 'sales_volume_min_spec', title: '销售量-最小规格', structure: 'sv14', precision: 2 },
      { key: 'bid_price', title: '中标价/交易价', structure: 'sv13' },
      { key: 'bid_amount', title: '中标/交易金额', structure: 'sv14', precision: 2 },
      { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', structure: 'sv13' },
      { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_post', title: '销售收入-含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'vat_rate', title: '增值税销项税率', structure: 'auto' },
      { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'service_fee_coef', title: '服务费系数', structure: 'auto' },
      { key: 'service_fee_price', title: '服务费单价', structure: 'mg12' },
      { key: 'service_fee_amount', title: '服务费金额', structure: 'sv14', precision: 2 },
      { key: 'purchase_price_incl', title: '采购单价-含税', structure: 'sv14' },
      { key: 'purchase_amount_incl', title: '采购金额-含税', structure: 'sv13', precision: 2 },
      { key: 'avg_assess_price_1', title: '平均考核价1', structure: 'monthly' },
      { key: 'latest_assess_price_1', title: '最新考核价1', structure: 'monthly' },
    ],
  },

  // ---------------- Tab 4 总部直营 ----------------
  hq: {
    key: 'hq',
    title: '总部直营',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', multiple: true, options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', multiple: true, dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['总部直营'], locked: true, defaultValue: '总部直营' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: AGENT_BASE_FIXED.filter((c) => c.key !== 'min_spec_rate' && c.key !== 'vat_rate'),
    metricGroups: [
      { key: 'sales_volume', title: '销售量', structure: 'salesVolume' },
      { key: 'convert_factor', title: '分析转换系数', structure: 'monthly' },
      { key: 'sales_volume_conv', title: '销售量-转换后', structure: 'sv14', precision: 2 },
      { key: 'min_spec_rate', title: '最小规格转换率', structure: 'auto' },
      { key: 'sales_volume_min_spec', title: '销售量-最小规格', structure: 'sv14', precision: 2 },
      { key: 'bid_price', title: '中标价/交易价', structure: 'sv13' },
      { key: 'bid_amount', title: '中标/交易金额', structure: 'sv14', precision: 2 },
      { key: 'delivery_point_ratio', title: '配送点位(%)', structure: 'mg12t', isPercent: true },
      { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', structure: 'sv13' },
      { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_post', title: '销售收入-含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'vat_rate', title: '增值税销项税率', structure: 'auto' },
      { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'hq_team_point_ratio', title: '总部销售团队点位（%）', structure: 'mg12', isPercent: true },
      { key: 'point_price', title: '点位费单价', structure: 'sv13' },
      { key: 'market_maintain_point', title: '市场维护费-点位费', structure: 'sv13', precision: 2 },
    ],
  },

  // ---------------- Tab 5 数字营销&城市连锁 ----------------
  digital: {
    key: 'digital',
    title: '数字营销&城市连锁',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', multiple: true, options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', multiple: true, dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['数字营销', '城市连锁'] },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
      { key: 'entity', title: '实体', width: 130 },
      { key: 'product_owner_hq', title: '产品负责人（总部）', width: 130 },
      { key: 'province', title: '省份', width: 90 },
      { key: 'salesman_lv1', title: '一级业务员', width: 110 },
      { key: 'sales_office', title: '销售办公室', width: 110 },
      { key: 'customer_name', title: '客户名称', width: 140 },
      { key: 'goods_class', title: '商品名分类', width: 120 },
      { key: 'product_code', title: '产品编码', width: 110 },
      { key: 'product_name', title: '产品名称', width: 140 },
      { key: 'spec', title: '规格', width: 100 },
      { key: 'package_spec', title: '包装规格', width: 100 },
      { key: 'product_type', title: '类型', width: 80 },
      { key: 'package_class', title: '包装分类', width: 100 },
      { key: 'unit', title: '计量单位', width: 80 },
      { key: 'approval_mfr', title: '批文厂家', width: 120 },
      { key: 'produce_mfr', title: '生产厂家', width: 120 },
      { key: 'analysis_arch', title: '分析架构', width: 110 },
      { key: 'group_purchase_attr', title: '集采属性', width: 100 },
      { key: 'group_purchase_batch', title: '集采批次', width: 100 },
    ],
    metricGroups: [
      { key: 'sales_volume', title: '销售量', structure: 'salesVolume' },
      { key: 'convert_factor', title: '分析转换系数', structure: 'monthly' },
      { key: 'sales_volume_conv', title: '销售量-转换后', structure: 'sv14', precision: 2 },
      { key: 'min_spec_rate', title: '最小规格转换率', structure: 'auto' },
      { key: 'sales_volume_min_spec', title: '销售量-最小规格', structure: 'sv14', precision: 2 },
      { key: 'bid_price', title: '中标价/交易价', structure: 'sv13' },
      { key: 'bid_amount', title: '中标/交易金额', structure: 'sv14', precision: 2 },
      { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', structure: 'sv13' },
      { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_incl_post', title: '销售收入-含税（折后）', structure: 'sv14', precision: 2 },
      { key: 'vat_rate', title: '增值税销项税率', structure: 'auto' },
      { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', structure: 'sv14', precision: 2 },
      { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', structure: 'sv14', precision: 2 },
    ],
  },
}
