// 主数据表结构定义 - 根据最新文档字段要求更新
export const MASTER_DATA_DEFS = {
  'md-mgmt-type': {
    name: '总部管理类型',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_type_code', title: '总部管理类型编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'manage_type_name', title: '总部管理类型名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'manage_team_code', title: '所属总部管理团队编码', key: 'manage_team_code' },
      { dataIndex: 'manage_team_name', title: '所属总部管理团队名称', key: 'manage_team_name' },
      { dataIndex: 'manage_type_code', title: '所属总部管理类型编码', key: 'manage_type_code' },
      { dataIndex: 'manage_type_name', title: '所属总部管理类型名称', key: 'manage_type_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-sales-group': {
    name: '销售组',
    columns: [
      { dataIndex: 'group_code', title: '销售组编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'group_name', title: '销售组名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'office_code', title: '所属销售办公室编码', key: 'office_code' },
      { dataIndex: 'office_name', title: '所属销售办公室名称', key: 'office_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-sales-office': {
    name: '销售办公室',
    columns: [
      { dataIndex: 'office_code', title: '销售办公室编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'office_name', title: '销售办公室名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-sales-officer-hq': {
    name: '一级业务员（总部）',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'salesman_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'salesman_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '上级编码', key: 'parent_code' },
      { dataIndex: 'level', title: '所在层级', key: 'level' },
      { dataIndex: 'is_leaf', title: '是否末级', key: 'is_leaf', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-region-dimension': {
    name: '片区管理区域',
    columns: [
      { dataIndex: 'area_code', title: '片区管理区域编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'area_name', title: '片区管理区域名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'budget_entity_code', title: '所属预算实体编码', key: 'budget_entity_code' },
      { dataIndex: 'budget_entity_name', title: '所属预算实体名称', key: 'budget_entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-customer': {
    name: '客户',
    columns: [
      { dataIndex: 'customer_code', title: '销管平台客户编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'customer_name', title: '销管平台客户名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sap_customer_code', title: 'SAP客户编码', key: 'sap_customer_code' },
      { dataIndex: 'sap_customer_name', title: 'SAP客户名称', key: 'sap_customer_name' },
      { dataIndex: 'is_internal', title: '是否内部关联客户', key: 'is_internal', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'customer_type', title: '客户类型', key: 'customer_type' },
      { dataIndex: 'customer_province', title: '客户所在省份', key: 'customer_province' },
      { dataIndex: 'customer_activity', title: '客户活跃度', key: 'customer_activity' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-product': {
    name: '产品',
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
      { dataIndex: 'material_type_code', title: '物料类型编码', key: 'material_type_code' },
      { dataIndex: 'material_type_name', title: '物料类型名称', key: 'material_type_name' },
      { dataIndex: 'material_group_code', title: '物料组编码', key: 'material_group_code' },
      { dataIndex: 'material_group_name', title: '物料组名称', key: 'material_group_name' },
      { dataIndex: 'group_purchase_attr', title: '集采属性', key: 'group_purchase_attr' },
      { dataIndex: 'group_purchase_batch', title: '集采批次', key: 'group_purchase_batch' },
      { dataIndex: 'special_tax_rate', title: '特殊销项税率', key: 'special_tax_rate' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
    ],
  },
  'md-product-arch': {
    name: '产品架构',
    columns: [
      { dataIndex: 'arch_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'arch_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '父级编码', key: 'parent_code' },
      { dataIndex: 'parent_name', title: '父级名称', key: 'parent_name' },
    ],
  },
  'md-department': {
    name: '部门',
    columns: [
      { dataIndex: 'dept_code', title: '部门编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'dept_name', title: '部门名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'entity_code', title: '所属实体编码', key: 'entity_code' },
      { dataIndex: 'entity_name', title: '所属实体名称', key: 'entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'account_code', title: '科目编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'account_name', title: '科目名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '父级编码', key: 'parent_code' },
      { dataIndex: 'parent_name', title: '父级名称', key: 'parent_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-product-owner-config': {
    name: '产品负责人配置表',
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-office-group': {
    name: '销售办公室-销售组映射关系表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_office_code', title: '销售办公室编码', key: 'sales_office_code' },
      { dataIndex: 'sales_office_name', title: '销售办公室名称', key: 'sales_office_name' },
      { dataIndex: 'sales_group_code', title: '销售组编码', key: 'sales_group_code' },
      { dataIndex: 'sales_group_name', title: '销售组名称', key: 'sales_group_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-region-salesman': {
    name: '业务员（片区业务员2）',
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
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-commodity-class': {
    name: '商品名分类配置表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'goods_class_name', title: '商品分类名称', key: 'goods_class_name' },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code' },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-product-tag': {
    name: '片区产品标识（发货/纯销）配置表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_analysis_arch_code', title: '产品分析架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_analysis_arch_name', title: '产品分析架构名称', key: 'product_arch_name' },
      { dataIndex: 'tag', title: '标识', key: 'tag' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-dept-belong': {
    name: '归属部门配置表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_analysis_arch_code', title: '产品分析架构编码', key: 'product_arch_code' },
      { dataIndex: 'product_analysis_arch_name', title: '产品分析架构名称', key: 'product_arch_name' },
      { dataIndex: 'budget_center_code', title: '预算中心编码', key: 'budget_center_code' },
      { dataIndex: 'budget_center_name', title: '预算中心名称', key: 'budget_center_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-hq-salesman': {
    name: '一级业务员（总部）配置表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_office_code', title: '销售办公室编码', key: 'sales_office_code' },
      { dataIndex: 'sales_office_name', title: '销售办公室名称', key: 'sales_office_name' },
      { dataIndex: 'hq_salesman_code', title: '一级业务员编码', key: 'salesman_code' },
      { dataIndex: 'hq_salesman_name', title: '一级业务员名称', key: 'salesman_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-salesman-entity': {
    name: '业务员所属预算实体配置表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'salesman_code', title: '业务员编码', key: 'salesman_code' },
      { dataIndex: 'salesman_name', title: '业务员名称', key: 'salesman_name' },
      { dataIndex: 'budget_entity_code', title: '预算实体编码', key: 'budget_entity_code' },
      { dataIndex: 'budget_entity_name', title: '预算实体名称', key: 'budget_entity_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-customer-sap': {
    name: '客户主数据映射关系表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sap_customer_code', title: 'SAP客户编码', key: 'sap_customer_code' },
      { dataIndex: 'sap_customer_name', title: 'SAP客户名称', key: 'sap_customer_name' },
      { dataIndex: 'flow_customer_code', title: '流向客户编码', key: 'flow_customer_code' },
      { dataIndex: 'flow_customer_name', title: '流向客户名称', key: 'flow_customer_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
  'map-virtual-product': {
    name: '虚拟产品映射表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'virtual_product_code', title: '虚拟产品编码', key: 'virtual_product_code' },
      { dataIndex: 'virtual_product_name', title: '虚拟产品名称', key: 'virtual_product_name' },
      { dataIndex: 'formal_product_code', title: '正式产品编码', key: 'formal_product_code' },
      { dataIndex: 'formal_product_name', title: '正式产品名称', key: 'formal_product_name' },
      { dataIndex: 'is_valid', title: '是否有效', key: 'is_valid', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
    ],
  },
}

export default MASTER_DATA_DEFS
