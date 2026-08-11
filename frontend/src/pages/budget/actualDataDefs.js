// ============================================================
// 实际数（第二章 2.1-2.5）页面配置
// 依据：飞书云文档「预算管理功能设计文档——0810」第二章 2.1-2.5 章节
// 说明：后台字段（年份/总部管理类型/总部管理团队/业务模式/数据口径/当期累计）仅作筛选与保存入参，不渲染为列
// ============================================================

const CURRENT_YEAR = new Date().getFullYear()

// ---------- 公共值集 ----------

// 年份可选范围：2021 ~ 当前年份
export const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 2020 },
  (_, i) => String(2021 + i)
)

// 总部管理类型 / 团队联动值集
export const MGMT_TYPE_OPTIONS = ['南区', '北区']
export const MGMT_TEAM_MAP = {
  南区: ['南一区', '南二区', '南三区', '南四区', '南商务'],
  北区: ['北一区', '北二区', '北三区', '北四区', '北五区', '北特区', '北商务'],
}

// 一级业务员（弹窗查询值集，demo 模拟）
export const SALESMAN_OPTIONS = [
  { id: 'S001', name: '李建国', entity: '科伦药业', province: '广东' },
  { id: 'S002', name: '张伟明', entity: '科伦药业', province: '四川' },
  { id: 'S003', name: '王丽华', entity: '科伦药业', province: '江苏' },
  { id: 'S004', name: '陈志强', entity: '科伦药物研究院', province: '湖北' },
  { id: 'S005', name: '刘芳', entity: '科伦药业', province: '湖南' },
]

// 一级客商（2.5 弹窗查询值集，demo 模拟）
export const CUSTOMER_OPTIONS = [
  { id: 'C001', name: '国药控股股份有限公司' },
  { id: 'C002', name: '华润医药商业集团有限公司' },
  { id: 'C003', name: '九州通医药集团' },
  { id: 'C004', name: '广州医药股份有限公司' },
  { id: 'C005', name: '上海医药集团' },
]

// 数据口径 / 当期累计
export const DATA_SCOPE_OPTIONS = ['调整前', '调整', '调整后']
export const PERIOD_TYPE_OPTIONS = ['当期', '累计']

// ---------- 显隐条件语法 ----------
// showWhen: { field: 'sales_mode', in: ['片区直营'] } 表示仅当筛选值 sales_mode 命中列表时展示
// 无 showWhen 表示无条件展示

// ---------- 通用月度指标组片段 ----------
// suffix:
//   total   - 按 1-12 月拆 12 列 + 全年合计列
//   avg     - 按 1-12 月拆 12 列 + 全年平均列
//   monthly - 仅按 1-12 月拆 12 列
//   auto    - 自动取数，单列展示（不拆月）
// precision: 数字精度（销量类统一保留两位小数）
// editable: 仅「销售量」指标允许调整（配合 数据口径=调整、当期/累计=当期、期间打开）

// 基础组（2.1-2.5 通用，不含配送点位/考核价）
const BASE_GROUPS = [
  { key: 'sales_volume', title: '销售量', suffix: 'total', precision: 2, editable: true },
  { key: 'convert_factor', title: '分析转换系数', suffix: 'monthly' },
  { key: 'sales_volume_conv', title: '销售量-转换后', suffix: 'total', precision: 2 },
  { key: 'sales_volume_min_spec', title: '销售量-最小规格', suffix: 'total', precision: 2 },
  { key: 'bid_price', title: '中标价/交易价', suffix: 'avg' },
  { key: 'bid_amount', title: '中标/交易金额', suffix: 'total' },
  { key: 'unit_price_incl_pre', title: '销售单价-含税（折前）', suffix: 'avg' },
  { key: 'revenue_incl_pre', title: '销售收入-含税（折前）', suffix: 'total' },
  { key: 'revenue_incl_disc', title: '销售收入-含税（折扣）', suffix: 'total' },
  { key: 'revenue_incl_post', title: '销售收入-含税（折后）', suffix: 'total' },
  { key: 'revenue_excl_pre', title: '销售收入-不含税（折前）', suffix: 'total' },
  { key: 'revenue_excl_disc', title: '销售收入-不含税（折扣）', suffix: 'total' },
  { key: 'revenue_excl_post', title: '销售收入-不含税（折后）', suffix: 'total' },
  { key: 'purchase_price_incl', title: '采购单价-含税', suffix: 'avg' },
  { key: 'purchase_amount_incl', title: '采购金额-含税', suffix: 'total' },
]

// 配送点位（2.2-2.5 通用组；2.1 中仅片区直营展示）
const DELIVERY_POINT_GROUP = {
  key: 'delivery_point_ratio', title: '配送点位(%)', suffix: 'avg', isPercent: true,
}

// 考核价组
const ASSESS_PRICE_GROUPS = [
  { key: 'avg_assess_price_1', title: '平均考核价1', suffix: 'monthly' },
  { key: 'latest_assess_price_1', title: '最新考核价1', suffix: 'monthly' },
]

// 点位费组（2.1 片区直营 / 2.5 城市连锁）
const POINT_FEE_GROUPS = [
  { key: 'hq_region_point_ratio', title: '总部to片区销售团队点位（%）', suffix: 'monthly', isPercent: true },
  { key: 'region_team_point_ratio', title: '片区销售团队点位(%)', suffix: 'monthly', isPercent: true },
  { key: 'point_price', title: '点位费单价', suffix: 'monthly' },
  { key: 'market_maintain_point', title: '市场维护费-点位费', suffix: 'total' },
]

// 客户费用组（2.1 片区招商/城市连锁、2.5 城市连锁）
const CUSTOMER_FEE_GROUPS = [
  { key: 'service_fee_price_pre', title: '客户服务费单价-折前', suffix: 'monthly' },
  { key: 'promo_fee_price_pre', title: '客户促销费单价-折前', suffix: 'monthly' },
  { key: 'rebate_fee_price_pre', title: '客户返利费单价-折前', suffix: 'monthly' },
  { key: 'market_maintain_cust_pre', title: '市场维护费-客户费用-折前', suffix: 'total' },
  { key: 'service_fee_amount_pre', title: '客户服务费金额-折前', suffix: 'total' },
  { key: 'promo_fee_amount_pre', title: '客户促销费金额-折前', suffix: 'total' },
  { key: 'rebate_fee_amount_pre', title: '客户返利费金额-折前', suffix: 'total' },
  { key: 'market_maintain_cust_disc', title: '市场维护费-客户费用-折扣', suffix: 'total' },
  { key: 'service_fee_amount_disc', title: '客户服务费金额-折扣', suffix: 'total' },
  { key: 'promo_fee_amount_disc', title: '客户促销费金额-折扣', suffix: 'total' },
  { key: 'rebate_fee_amount_disc', title: '客户返利费金额-折扣', suffix: 'total' },
  { key: 'market_maintain_cust_post', title: '市场维护费-客户费用-折后', suffix: 'total' },
  { key: 'service_fee_amount_post', title: '客户服务费金额-折后', suffix: 'total' },
  { key: 'promo_fee_amount_post', title: '客户促销费金额-折后', suffix: 'total' },
  { key: 'rebate_fee_amount_post', title: '客户返利费金额-折后', suffix: 'total' },
]

// 服务费组（2.2 总代 / 2.3 代理制片区）
const SERVICE_FEE_GROUPS = [
  { key: 'service_fee_coef', title: '服务费系数', suffix: 'auto' },
  { key: 'service_fee_price', title: '服务费单价', suffix: 'monthly' },
  { key: 'market_maintain_service', title: '市场维护费-服务费', suffix: 'total' },
  { key: 'service_fee_amount', title: '服务费金额', suffix: 'total' },
]

// 通用固定列片段（2.2-2.5 共用基础）
const BASE_FIXED_COLUMNS = [
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
  { key: 'vat_rate', title: '增值税销项税率', width: 110 },
  { key: 'min_spec_rate', title: '最小规格转换率', width: 110 },
]

// ============================================================
// 五个章节配置
// ============================================================
export const ACTUAL_DATA_SECTIONS = {
  // ---------------- 2.1 费用制片区-实际数 ----------------
  '2.1': {
    section: '2.1',
    title: '费用制片区-实际数',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
      { key: 'sales_mode', label: '片区销售模式', type: 'select', options: ['片区直营', '片区招商', '片区城市连锁'], defaultValue: '片区直营' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'data_scope', label: '数据口径', type: 'select', options: DATA_SCOPE_OPTIONS, defaultValue: '调整前' },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
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
      { key: 'sales_mode', title: '片区销售模式', width: 110 },
      { key: 'delivery_mode', title: '基地直发/医贸发出', width: 130 },
      { key: 'vat_rate', title: '增值税销项税率', width: 110 },
      { key: 'min_spec_rate', title: '最小规格转换率', width: 110 },
    ],
    metricGroups: [
      ...BASE_GROUPS,
      { ...DELIVERY_POINT_GROUP, showWhen: { field: 'sales_mode', in: ['片区直营'] } },
      ...POINT_FEE_GROUPS.map(g => ({ ...g, showWhen: { field: 'sales_mode', in: ['片区直营'] } })),
      ...CUSTOMER_FEE_GROUPS.map(g => ({ ...g, showWhen: { field: 'sales_mode', in: ['片区招商', '片区城市连锁'] } })),
      ...ASSESS_PRICE_GROUPS,
    ],
  },

  // ---------------- 2.2 总代-实际数 ----------------
  '2.2': {
    section: '2.2',
    title: '总代-实际数',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['总代'], locked: true, defaultValue: '总代' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'data_scope', label: '数据口径', type: 'select', options: DATA_SCOPE_OPTIONS, defaultValue: '调整前' },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
      ...BASE_FIXED_COLUMNS,
      { key: 'hq_promo_pay', title: '总部促销费-支付口径', width: 140 },
    ],
    metricGroups: [
      ...BASE_GROUPS,
      DELIVERY_POINT_GROUP,
      ...SERVICE_FEE_GROUPS,
      ...ASSESS_PRICE_GROUPS,
    ],
  },

  // ---------------- 2.3 代理制片区-实际数 ----------------
  '2.3': {
    section: '2.3',
    title: '代理制片区-实际数',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['代理制片区'], locked: true, defaultValue: '代理制片区' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'data_scope', label: '数据口径', type: 'select', options: DATA_SCOPE_OPTIONS, defaultValue: '调整前' },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
      ...BASE_FIXED_COLUMNS,
      { key: 'hq_promo_pay', title: '总部促销费-支付口径', width: 140 },
      { key: 'hq_rebate_pay', title: '总部销售返利-支付口径', width: 150 },
    ],
    metricGroups: [
      ...BASE_GROUPS,
      DELIVERY_POINT_GROUP,
      ...SERVICE_FEE_GROUPS,
      ...ASSESS_PRICE_GROUPS,
    ],
  },

  // ---------------- 2.4 总部直营-实际数 ----------------
  '2.4': {
    section: '2.4',
    title: '总部直营-实际数',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['总部直营'], locked: true, defaultValue: '总部直营' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'data_scope', label: '数据口径', type: 'select', options: DATA_SCOPE_OPTIONS, defaultValue: '调整前' },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [...BASE_FIXED_COLUMNS],
    metricGroups: [
      ...BASE_GROUPS,
      DELIVERY_POINT_GROUP,
      { key: 'hq_team_point_ratio', title: '总部销售团队点位（%）', suffix: 'monthly', isPercent: true },
      { key: 'point_price', title: '点位费单价', suffix: 'monthly' },
      { key: 'market_maintain_point', title: '市场维护费-点位费', suffix: 'total' },
    ],
  },

  // ---------------- 2.5 数字营销&城市连锁-实际数 ----------------
  '2.5': {
    section: '2.5',
    title: '数字营销&城市连锁-实际数',
    filters: [
      { key: 'year', label: '年份', type: 'year' },
      { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
      { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
      { key: 'business_model', label: '业务模式', type: 'select', options: ['数字营销', '城市连锁'], defaultValue: '数字营销' },
      { key: 'salesman_lv1', label: '一级业务员', type: 'modalSearch', options: SALESMAN_OPTIONS },
      { key: 'customer_lv1', label: '一级客商', type: 'modalSearch', options: CUSTOMER_OPTIONS },
      { key: 'data_scope', label: '数据口径', type: 'select', options: DATA_SCOPE_OPTIONS, defaultValue: '调整前' },
      { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS, defaultValue: '当期' },
    ],
    fixedColumns: [
      { key: 'entity', title: '实体', width: 130 },
      { key: 'product_owner_hq', title: '产品负责人（总部）', width: 130 },
      { key: 'province', title: '省份', width: 90 },
      { key: 'salesman_lv1', title: '一级业务员', width: 110 },
      { key: 'sales_office', title: '销售办公室', width: 110 },
      { key: 'sales_group', title: '销售组', width: 110 },
      { key: 'region_manage', title: '片区管理区域', width: 130 },
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
      { key: 'vat_rate', title: '增值税销项税率', width: 110 },
      { key: 'min_spec_rate', title: '最小规格转换率', width: 110 },
      // 以下列：数字营销模式不展示，城市连锁模式展示
      { key: 'customer_name', title: '客户名称', width: 140, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'goods_class', title: '商品名分类', width: 110, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'sales_mode', title: '片区销售模式', width: 110, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'delivery_mode', title: '基地直发/医贸发出', width: 130, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'belong_dept', title: '归属部门', width: 120, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'product_owner_region', title: '产品负责人（片区）', width: 130, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'salesman_hn', title: '业务员（湖南湖北专用）', width: 140, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'deliver_customer', title: '发货客户', width: 120, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'pure_customer', title: '纯销客户', width: 120, showWhen: { field: 'business_model', in: ['城市连锁'] } },
      { key: 'flow_unit', title: '流向单位（湖南片区专用）', width: 140, showWhen: { field: 'business_model', in: ['城市连锁'] } },
    ],
    metricGroups: [
      // 数字营销&城市连锁：不展示「采购金额-含税」列
      ...BASE_GROUPS.filter((g) => g.key !== 'purchase_amount_incl'),
      DELIVERY_POINT_GROUP,
      // 以下组：数字营销模式不展示，城市连锁模式展示
      ...POINT_FEE_GROUPS.map(g => ({ ...g, showWhen: { field: 'business_model', in: ['城市连锁'] } })),
      ...ASSESS_PRICE_GROUPS.map(g => ({ ...g, showWhen: { field: 'business_model', in: ['城市连锁'] } })),
      ...CUSTOMER_FEE_GROUPS.map(g => ({ ...g, showWhen: { field: 'business_model', in: ['城市连锁'] } })),
    ],
  },
}

// ---------- 按钮配置（五个章节共用） ----------
// enabledWhen: 保存按钮可用条件「数据口径=调整」且「当期/累计=当期」，其他情况置灰
export const ACTION_BUTTONS = [
  { id: 'query', label: '查询', icon: 'search', position: 'search', type: 'primary' },
  { id: 'save', label: '保存', icon: 'save', position: 'action' },
  { id: 'import', label: '导入', icon: 'import', position: 'action' },
  { id: 'export', label: '导出', icon: 'export', position: 'action' },
  { id: 'period', label: '期间设置', icon: 'period', position: 'action' },
]

// 导入导出模板（飞书共享表格）
export const IMPORT_TEMPLATE_URL = 'https://u0vocx8xrmg.feishu.cn/sheets/EoMGsRr4whs9Zttud9YcIeU9nLc'

// ---------- 模拟数据生成（demo 用） ----------
// 量×价公式：销售收入 = 销售单价 × 销售量；折扣 = 折前金额 × 折扣率；折后 = 折前 - 折扣
// 不含税 = 含税 ÷ (1 + 税率)；采购金额 = 采购单价 × 销售量
export const MOCK_PRODUCTS = [
  { code: 'P1001', name: '氯化钠注射液', spec: '250ml:2.25g', package: '玻璃瓶', type: '普药', unit: '瓶', mfr: '四川科伦药业股份有限公司' },
  { code: 'P1002', name: '脂肪乳注射液', spec: '250ml:20%', package: '软袋', type: '肠外营养', unit: '袋', mfr: '科伦药业股份有限公司' },
  { code: 'P1003', name: '奥硝唑注射液', spec: '100ml:0.5g', package: '软袋', type: '抗感染', unit: '袋', mfr: '四川科伦药业股份有限公司' },
]
