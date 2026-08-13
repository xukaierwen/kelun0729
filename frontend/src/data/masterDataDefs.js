// 主数据表结构定义 - 根据最新文档字段要求更新

// ============================================================
// 共享值集（映射表新增弹窗下拉选择用，demo 静态值集）
// 结构：{ label: 展示文本, value: 编码, <linkField>: 联动字段值 }
// linkFields: 选中后自动带出的字段名
// ============================================================

// 产品值集
const PRODUCT_OPTIONS = [
  { label: 'P1001 氯化钠注射液', value: 'P1001', product_name: '氯化钠注射液' },
  { label: 'P1002 脂肪乳注射液', value: 'P1002', product_name: '脂肪乳注射液' },
  { label: 'P1003 奥硝唑注射液', value: 'P1003', product_name: '奥硝唑注射液' },
]

// 客户值集
const CUSTOMER_OPTIONS = [
  { label: 'C001 国药控股股份有限公司', value: 'C001', customer_name: '国药控股股份有限公司', delivery_customer_name: '国药控股股份有限公司' },
  { label: 'C002 华润医药商业集团有限公司', value: 'C002', customer_name: '华润医药商业集团有限公司', delivery_customer_name: '华润医药商业集团有限公司' },
  { label: 'C003 九州通医药集团', value: 'C003', customer_name: '九州通医药集团', delivery_customer_name: '九州通医药集团' },
  { label: 'C004 广州医药股份有限公司', value: 'C004', customer_name: '广州医药股份有限公司', delivery_customer_name: '广州医药股份有限公司' },
  { label: 'C005 上海医药集团', value: 'C005', customer_name: '上海医药集团', delivery_customer_name: '上海医药集团' },
]

// 一级业务员值集
const SALESMAN_OPTIONS = [
  { label: 'S001 李建国', value: 'S001', hq_salesman_name: '李建国' },
  { label: 'S002 张伟明', value: 'S002', hq_salesman_name: '张伟明' },
  { label: 'S003 王丽华', value: 'S003', hq_salesman_name: '王丽华' },
  { label: 'S004 陈志强', value: 'S004', hq_salesman_name: '陈志强' },
  { label: 'S005 刘芳', value: 'S005', hq_salesman_name: '刘芳' },
]

// 部门值集
const DEPT_OPTIONS = [
  { label: 'D001 处方药事业部', value: 'D001', dept_name: '处方药事业部' },
  { label: 'D002 非处方药事业部', value: 'D002', dept_name: '非处方药事业部' },
  { label: 'D003 大输液事业部', value: 'D003', dept_name: '大输液事业部' },
]

// 业务模式值集
const BUSINESS_MODEL_OPTIONS = [
  { label: 'BM001 总代', value: 'BM001', business_model_name: '总代' },
  { label: 'BM002 代理制片区', value: 'BM002', business_model_name: '代理制片区' },
  { label: 'BM003 总部直营', value: 'BM003', business_model_name: '总部直营' },
  { label: 'BM004 数字营销', value: 'BM004', business_model_name: '数字营销' },
  { label: 'BM005 城市连锁', value: 'BM005', business_model_name: '城市连锁' },
]

// 销售模式值集
const SALES_MODEL_OPTIONS = [
  { label: 'SM001 片区直营', value: 'SM001', sales_model_name: '片区直营' },
  { label: 'SM002 片区招商', value: 'SM002', sales_model_name: '片区招商' },
  { label: 'SM003 片区城市连锁', value: 'SM003', sales_model_name: '片区城市连锁' },
]

// 总部管理团队值集
const MGMT_TEAM_OPTIONS = [
  { label: '南一区', value: '南一区' },
  { label: '南二区', value: '南二区' },
  { label: '南三区', value: '南三区' },
  { label: '南四区', value: '南四区' },
  { label: '南商务', value: '南商务' },
  { label: '北一区', value: '北一区' },
  { label: '北二区', value: '北二区' },
  { label: '北三区', value: '北三区' },
  { label: '北四区', value: '北四区' },
  { label: '北五区', value: '北五区' },
  { label: '北特区', value: '北特区' },
  { label: '北商务', value: '北商务' },
]

// 品牌类型值集
const BRAND_TYPE_OPTIONS = [
  { label: '自有品牌', value: '自有品牌' },
  { label: '代理品牌', value: '代理品牌' },
  { label: '贴牌生产', value: '贴牌生产' },
]

export const MASTER_DATA_DEFS = {
  'md-mgmt-type': {
    name: '总部管理类型',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_type_code', title: '总部管理类型编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'manage_type_name', title: '总部管理类型名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-mgmt-team': {
    name: '总部管理团队',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_team_code', title: '总部管理团队编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'manage_team_name', title: '总部管理团队名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'manage_type_code', title: '所属总部管理类型编码', key: 'manage_type_code' },
      { dataIndex: 'manage_type_name', title: '所属总部管理类型名称', key: 'manage_type_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-business-mode': {
    name: '业务模式',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'business_model_code', title: '业务模式编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'business_model_name', title: '业务模式名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-sales-mode': {
    name: '片区销售模式',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_model_code', title: '片区销售模式编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'sales_model_name', title: '片区销售模式名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'business_model_code', title: '所属业务模式编码', key: 'business_model_code' },
      { dataIndex: 'business_model_name', title: '所属业务模式名称', key: 'business_model_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-province': {
    name: '省份',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'province_code', title: '省份编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'province_name', title: '省份名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'province_short', title: '省份简称', key: 'province_short' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-region': {
    name: '片区',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'region_code', title: '片区编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'region_name', title: '片区名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'province_code', title: '片区所属省份编码', key: 'province_code' },
      { dataIndex: 'province_name', title: '片区所属省份名称', key: 'province_name' },
      { dataIndex: 'province_short', title: '片区所属省份简称', key: 'province_short' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-entity': {
    name: '实体',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'entity_code', title: '实体编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'entity_name', title: '实体名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_entity_code', title: '父级实体编码', key: 'parent_entity_code' },
      { dataIndex: 'company_nature', title: '公司性质', key: 'company_nature' },
      { dataIndex: 'is_fee_control', title: '是否上线费控', key: 'is_fee_control', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'entity_type', title: '实体类型', key: 'entity_type' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-sales-group': {
    name: '销售组',
    readonly: true,
    columns: [
      { dataIndex: 'group_code', title: '销售组编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'group_name', title: '销售组名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'office_code', title: '销售办公室编码', key: 'office_code' },
      { dataIndex: 'office_name', title: '销售办公室名称', key: 'office_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-sales-office': {
    name: '销售办公室',
    readonly: true,
    columns: [
      { dataIndex: 'office_code', title: '销售办公室编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'office_name', title: '销售办公室名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-sales-officer-hq': {
    name: '一级业务员（总部）',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'hq_salesman_code', title: '一级业务员编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'hq_salesman_name', title: '一级业务员名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'business_model_code', title: '所属业务模式编码', key: 'business_model_code' },
      { dataIndex: 'business_model_name', title: '所属业务模式名称', key: 'business_model_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-region-dimension': {
    name: '片区管理区域',
    columns: [
      { dataIndex: 'area_code', title: '片区管理区域编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'area_name', title: '片区管理区域名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'budget_entity_code', title: '所属预算实体编码', key: 'budget_entity_code' },
      { dataIndex: 'budget_entity_name', title: '所属预算实体名称', key: 'budget_entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-customer': {
    name: '客户',
    searchFields: ['customer_code', 'customer_name', 'sap_customer_code', 'sap_customer_name', 'is_internal', 'is_valid'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'customer_code', title: '销管平台客户编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'customer_name', title: '销管平台客户名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sap_customer_code', title: '客户编码', key: 'sap_customer_code' },
      { dataIndex: 'sap_customer_name', title: '客户名称', key: 'sap_customer_name' },
      { dataIndex: 'is_internal', title: '是否内部关联客户', key: 'is_internal', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'customer_type', title: '客户类型', key: 'customer_type' },
      { dataIndex: 'is_active_customer', title: '客户活跃标识', key: 'is_active_customer', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-product': {
    name: '产品',
    searchFields: ['product_code', 'product_name', 'product_type', 'generic_name', 'package_spec', 'is_valid'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_code', title: '产品编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'product_name', title: '产品名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'generic_name', title: '产品通用名', key: 'generic_name' },
      { dataIndex: 'spec', title: '规格', key: 'spec' },
      { dataIndex: 'package_spec', title: '包装规格', key: 'package_spec' },
      { dataIndex: 'product_type', title: '类型', key: 'product_type' },
      { dataIndex: 'package_class', title: '包装分类', key: 'package_class' },
      { dataIndex: 'unit_code', title: '计量单位编码', key: 'unit_code' },
      { dataIndex: 'unit_name', title: '计量单位名称', key: 'unit_name' },
      { dataIndex: 'approval_mfr_code', title: '批文厂家编码', key: 'approval_mfr_code' },
      { dataIndex: 'approval_mfr_name', title: '批文厂家名称', key: 'approval_mfr_name' },
      { dataIndex: 'produce_mfr_code', title: '生产厂家编码', key: 'produce_mfr_code' },
      { dataIndex: 'produce_mfr_name', title: '生产厂家名称', key: 'produce_mfr_name' },
      { dataIndex: 'min_unit_code', title: '最小单位编码', key: 'min_unit_code' },
      { dataIndex: 'min_unit_name', title: '最小单位名称', key: 'min_unit_name' },
      { dataIndex: 'min_unit_convert_rate', title: '最小规格转换率', key: 'min_unit_convert_rate' },
      { dataIndex: 'group_purchase_property', title: '集采属性', key: 'group_purchase_property' },
      { dataIndex: 'group_purchase_batch', title: '集采批次', key: 'group_purchase_batch' },
      { dataIndex: 'special_tax_rate', title: '特殊销项税率', key: 'special_tax_rate' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-product-arch': {
    name: '产品架构',
    searchFields: ['arch_code', 'arch_name', 'is_parent', 'is_shared', 'is_valid'],
    readonly: true,
    columns: [
      { dataIndex: 'arch_code', title: '架构编码', key: 'arch_code', rules: [{ required: true }] },
      { dataIndex: 'arch_name', title: '架构名称', key: 'arch_name', rules: [{ required: true }] },
      { dataIndex: 'is_parent', title: '是否父节点', key: 'is_parent', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'is_shared', title: '是否共享节点', key: 'is_shared', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'arch_code_l1', title: '架构编码level1', key: 'arch_code_l1' },
      { dataIndex: 'arch_code_l2', title: '架构编码level2', key: 'arch_code_l2' },
      { dataIndex: 'arch_code_l3', title: '架构编码level3', key: 'arch_code_l3' },
      { dataIndex: 'arch_code_l4', title: '架构编码level4', key: 'arch_code_l4' },
      { dataIndex: 'arch_code_l5', title: '架构编码level5', key: 'arch_code_l5' },
      { dataIndex: 'arch_code_l6', title: '架构编码level6', key: 'arch_code_l6' },
      { dataIndex: 'arch_name_l1', title: '架构名称level1', key: 'arch_name_l1' },
      { dataIndex: 'arch_name_l2', title: '架构名称level2', key: 'arch_name_l2' },
      { dataIndex: 'arch_name_l3', title: '架构名称level3', key: 'arch_name_l3' },
      { dataIndex: 'arch_name_l4', title: '架构名称level4', key: 'arch_name_l4' },
      { dataIndex: 'arch_name_l5', title: '架构名称level5', key: 'arch_name_l5' },
      { dataIndex: 'arch_name_l6', title: '架构名称level6', key: 'arch_name_l6' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'md-department': {
    name: '部门',
    columns: [
      { dataIndex: 'dept_code', title: '部门编码', key: 'code', rules: [{ required: true }], readonlyOnEdit: true },
      { dataIndex: 'dept_name', title: '部门名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'entity_code', title: '所属实体编码', key: 'entity_code' },
      { dataIndex: 'entity_name', title: '所属实体名称', key: 'entity_name' },
      { dataIndex: 'parent_dept_code', title: '所属父级部门编码', key: 'parent_dept_code' },
      { dataIndex: 'parent_dept_name', title: '所属父级部门名称', key: 'parent_dept_name' },
      { dataIndex: 'is_leaf', title: '是否末级节点部门', key: 'is_leaf', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
    isTree: true,
  },
  'md-salesman-hn': {
    name: '业务员（湖南湖北专用）',
    columns: [
      { dataIndex: 'salesman_code', title: '业务员编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'salesman_name', title: '业务员名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'entity_code', title: '所属实体编码', key: 'entity_code' },
      { dataIndex: 'entity_name', title: '所属实体名称', key: 'entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-flow-unit': {
    name: '流向单位（湖南专用）',
    columns: [
      { dataIndex: 'flow_unit_code', title: '流向单位编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'flow_unit_name', title: '流向单位名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-scenario': {
    name: '场景',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'scenario_code', title: '场景编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'scenario_name', title: '场景名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-data-scope': {
    name: '数据口径',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'data_scope_code', title: '数据口径编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'data_scope_name', title: '数据口径名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-version': {
    name: '版本',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'version_code', title: '版本编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'version_name', title: '版本名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-year': {
    name: '年份',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'year_code', title: '年份编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'year_value', title: '年份', key: 'year_value' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-period': {
    name: '期间',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'period_code', title: '期间编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'period_name', title: '期间名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'quarter', title: '所属季度', key: 'quarter' },
      { dataIndex: 'half_year', title: '半年', key: 'half_year' },
      { dataIndex: 'full_year', title: '全年', key: 'full_year' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-account': {
    name: '科目维度',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'account_code', title: '科目编码', key: 'code', rules: [{ required: true }], readonlyOnEdit: true },
      { dataIndex: 'account_name', title: '科目名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '父级编码', key: 'parent_code' },
      { dataIndex: 'parent_name', title: '父级名称', key: 'parent_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
    isTree: true,
  },
  'md-currency': {
    name: '币种',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'currency_code', title: '币种编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'currency_name', title: '币种名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'country', title: '国家', key: 'country' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-project': {
    name: '项目',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'project_code', title: '项目编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'project_name', title: '项目名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'project_type', title: '项目类型', key: 'project_type' },
      { dataIndex: 'project_status', title: '项目状态', key: 'project_status' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
}

// 映射表定义
export const MAPPING_TABLE_DEFS = {
  'map-business-mode-config': {
    name: '业务模式配置表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_type_code', title: '总部管理类型编码', key: 'manage_type_code' },
      { dataIndex: 'manage_type_name', title: '总部管理类型名称', key: 'manage_type_name' },
      { dataIndex: 'manage_team_code', title: '总部管理团队编码', key: 'manage_team_code' },
      { dataIndex: 'manage_team_name', title: '总部管理团队名称', key: 'manage_team_name' },
      { dataIndex: 'business_model_code', title: '业务模式编码', key: 'business_model_code' },
      { dataIndex: 'business_model_name', title: '业务模式名称', key: 'business_model_name' },
      { dataIndex: 'sales_model_code', title: '销售模式编码', key: 'sales_model_code' },
      { dataIndex: 'sales_model_name', title: '销售模式名称', key: 'sales_model_name' },
      { dataIndex: 'product_arch_code', title: '产品架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_arch_name', title: '产品架构名称', key: 'product_arch_name' },
      { dataIndex: 'salesman_code', title: '业务员编码', key: 'salesman_code' },
      { dataIndex: 'salesman_name', title: '业务员姓名', key: 'salesman_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-product-owner-config': {
    name: '产品负责人配置表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'level', title: '层级', key: 'level', inputType: 'select', options: [
        { label: '总部', value: '总部' },
        { label: '片区', value: '片区' },
      ]},
      { dataIndex: 'product_analysis_arch_code', title: '产品分析架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_analysis_arch_name', title: '产品分析架构名称', key: 'product_arch_name' },
      { dataIndex: 'user_code', title: '用户编码', key: 'user_code' },
      { dataIndex: 'user_name', title: '姓名', key: 'user_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-office-group': {
    name: '销售办公室-销售组映射关系表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_office_code', title: '销售办公室编码', key: 'sales_office_code' },
      { dataIndex: 'sales_office_name', title: '销售办公室名称', key: 'sales_office_name' },
      { dataIndex: 'sales_group_code', title: '销售组编码', key: 'sales_group_code' },
      { dataIndex: 'sales_group_name', title: '销售组名称', key: 'sales_group_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-region-salesman': {
    name: '业务员（片区业务员2）',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_office_code', title: '销售办公室编码', key: 'sales_office_code' },
      { dataIndex: 'sales_office_name', title: '销售办公室名称', key: 'sales_office_name' },
      { dataIndex: 'sales_group_code', title: '销售组编码', key: 'sales_group_code' },
      { dataIndex: 'sales_group_name', title: '销售组名称', key: 'sales_group_name' },
      { dataIndex: 'customer_code', title: '客户编码（商业）', key: 'customer_code' },
      { dataIndex: 'customer_name', title: '客户名称', key: 'customer_name' },
      { dataIndex: 'flow_unit', title: '流向单位', key: 'flow_unit' },
      { dataIndex: 'variety', title: '品种', key: 'variety' },
      { dataIndex: 'terminal_customer_code', title: '终端客户编码', key: 'terminal_customer_code' },
      { dataIndex: 'terminal_customer_name', title: '终端客户名称', key: 'terminal_customer_name' },
      { dataIndex: 'salesman_code', title: '业务员编码', key: 'salesman_code' },
      { dataIndex: 'salesman_name', title: '业务员名称', key: 'salesman_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-commodity-class': {
    name: '商品名分类配置表',
    searchFields: ['product_code', 'product_name', 'delivery_customer_code', 'delivery_customer_name', 'brand_type', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code', rules: [{ required: true }], inputType: 'select', options: PRODUCT_OPTIONS, linkFields: ['product_name'] },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name', rules: [{ required: true }] },
      { dataIndex: 'delivery_customer_code', title: '发货客户编码', key: 'delivery_customer_code', inputType: 'select', options: CUSTOMER_OPTIONS, linkFields: ['delivery_customer_name'] },
      { dataIndex: 'delivery_customer_name', title: '发货客户名称', key: 'delivery_customer_name' },
      { dataIndex: 'brand_type', title: '品牌类型', key: 'brand_type', inputType: 'select', options: BRAND_TYPE_OPTIONS },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-product-tag': {
    name: '片区产品标识（发货/纯销）配置表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_analysis_arch_code', title: '产品分析架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_analysis_arch_name', title: '产品分析架构名称', key: 'product_arch_name' },
      { dataIndex: 'tag', title: '标识', key: 'tag' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-dept-belong': {
    name: '归属部门配置表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_analysis_arch_code', title: '产品分析架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_analysis_arch_name', title: '产品分析架构名称', key: 'product_arch_name' },
      { dataIndex: 'budget_center_code', title: '预算中心编码', key: 'budget_center_code' },
      { dataIndex: 'budget_center_name', title: '预算中心名称', key: 'budget_center_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-hq-salesman': {
    name: '虚拟业务员映射表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'virtual_salesman_code', title: '虚拟业务员编码', key: 'virtual_salesman_code', rules: [{ required: true }] },
      { dataIndex: 'virtual_salesman_name', title: '虚拟业务员名称', key: 'virtual_salesman_name', rules: [{ required: true }] },
      { dataIndex: 'hq_salesman_code', title: '一级业务员编码', key: 'hq_salesman_code', inputType: 'select', options: SALESMAN_OPTIONS, linkFields: ['hq_salesman_name'] },
      { dataIndex: 'hq_salesman_name', title: '一级业务员名称', key: 'hq_salesman_name' },
      { dataIndex: 'created_at', title: '创建时间', key: 'created_at', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-mgmt-team': {
    name: '总部管理团队映射表',
    searchFields: ['product_code', 'product_name', 'hq_salesman_code', 'hq_salesman_name', 'manage_team_name', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code', rules: [{ required: true }], inputType: 'select', options: PRODUCT_OPTIONS, linkFields: ['product_name'] },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name', rules: [{ required: true }] },
      { dataIndex: 'hq_salesman_code', title: '一级业务员(总部)编码', key: 'hq_salesman_code', rules: [{ required: true }], inputType: 'select', options: SALESMAN_OPTIONS, linkFields: ['hq_salesman_name'] },
      { dataIndex: 'hq_salesman_name', title: '一级业务员(总部)名称', key: 'hq_salesman_name', rules: [{ required: true }] },
      { dataIndex: 'manage_team_name', title: '总部管理团队名称', key: 'manage_team_name', rules: [{ required: true }], inputType: 'select', options: MGMT_TEAM_OPTIONS },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'map-salesman-entity': {
    name: '业务员所属预算实体配置表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'salesman_code', title: '业务员编码', key: 'salesman_code' },
      { dataIndex: 'salesman_name', title: '业务员名称', key: 'salesman_name' },
      { dataIndex: 'budget_entity_code', title: '预算实体编码', key: 'budget_entity_code' },
      { dataIndex: 'budget_entity_name', title: '预算实体名称', key: 'budget_entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-customer-sap': {
    name: '客户主数据映射关系表',
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sap_customer_code', title: 'SAP客户编码', key: 'sap_customer_code' },
      { dataIndex: 'sap_customer_name', title: 'SAP客户名称', key: 'sap_customer_name' },
      { dataIndex: 'flow_customer_code', title: '流向客户编码', key: 'flow_customer_code' },
      { dataIndex: 'flow_customer_name', title: '流向客户名称', key: 'flow_customer_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-virtual-product': {
    name: '虚拟产品映射表',
    searchFields: ['virtual_product_code', 'virtual_product_name', 'product_code', 'product_name', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'virtual_product_code', title: '虚拟产品编码', key: 'virtual_product_code', rules: [{ required: true }] },
      { dataIndex: 'virtual_product_name', title: '虚拟产品名称', key: 'virtual_product_name', rules: [{ required: true }] },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code', rules: [{ required: true }], inputType: 'select', options: PRODUCT_OPTIONS, linkFields: ['product_name'] },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-virtual-customer': {
    name: '虚拟客户映射表',
    searchFields: ['virtual_customer_code', 'virtual_customer_name', 'customer_code', 'customer_name', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'virtual_customer_code', title: '虚拟客户编码', key: 'virtual_customer_code', rules: [{ required: true }] },
      { dataIndex: 'virtual_customer_name', title: '虚拟客户名称', key: 'virtual_customer_name', rules: [{ required: true }] },
      { dataIndex: 'customer_code', title: '客户编码', key: 'customer_code', inputType: 'select', options: CUSTOMER_OPTIONS, linkFields: ['customer_name'] },
      { dataIndex: 'customer_name', title: '客户名称', key: 'customer_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-analysis-convert-factor': {
    name: '分析转换系数配置表',
    searchFields: ['year', 'product_code', 'product_name', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'year', title: '年份', key: 'year', rules: [{ required: true }] },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code', rules: [{ required: true }] },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name', rules: [{ required: true }] },
      { dataIndex: 'month_1', title: '1月', key: 'month_1', inputType: 'number' },
      { dataIndex: 'month_2', title: '2月', key: 'month_2', inputType: 'number' },
      { dataIndex: 'month_3', title: '3月', key: 'month_3', inputType: 'number' },
      { dataIndex: 'month_4', title: '4月', key: 'month_4', inputType: 'number' },
      { dataIndex: 'month_5', title: '5月', key: 'month_5', inputType: 'number' },
      { dataIndex: 'month_6', title: '6月', key: 'month_6', inputType: 'number' },
      { dataIndex: 'month_7', title: '7月', key: 'month_7', inputType: 'number' },
      { dataIndex: 'month_8', title: '8月', key: 'month_8', inputType: 'number' },
      { dataIndex: 'month_9', title: '9月', key: 'month_9', inputType: 'number' },
      { dataIndex: 'month_10', title: '10月', key: 'month_10', inputType: 'number' },
      { dataIndex: 'month_11', title: '11月', key: 'month_11', inputType: 'number' },
      { dataIndex: 'month_12', title: '12月', key: 'month_12', inputType: 'number' },
      { dataIndex: 'created_at', title: '创建时间', key: 'created_at', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-hq-dept-attribute': {
    name: '总部直管部门属性维护表',
    searchFields: ['dept_code', 'dept_name', 'business_model_name', 'sales_model_name', 'is_valid'],
    formHideFields: ['valid_from', 'valid_to'],
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'dept_code', title: '部门编码', key: 'dept_code', rules: [{ required: true }], inputType: 'select', options: DEPT_OPTIONS, linkFields: ['dept_name'] },
      { dataIndex: 'dept_name', title: '部门名称', key: 'dept_name', rules: [{ required: true }] },
      { dataIndex: 'business_model_code', title: '业务模式编码', key: 'business_model_code', inputType: 'select', options: BUSINESS_MODEL_OPTIONS, linkFields: ['business_model_name'] },
      { dataIndex: 'business_model_name', title: '业务模式名称', key: 'business_model_name' },
      { dataIndex: 'sales_model_code', title: '销售模式编码', key: 'sales_model_code', inputType: 'select', options: SALES_MODEL_OPTIONS, linkFields: ['sales_model_name'] },
      { dataIndex: 'sales_model_name', title: '销售模式名称', key: 'sales_model_name' },
      { dataIndex: 'created_at', title: '创建时间', key: 'created_at', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'switch', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
}

export default MASTER_DATA_DEFS
