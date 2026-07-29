// 主数据表结构定义 - 根据文档字段要求更新
export const MASTER_DATA_DEFS = {
  // 基础维度表
  'md-mgmt-type': {
    name: '总部管理类型',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_type_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'manage_type_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-mgmt-team': {
    name: '总部管理团队',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'manage_team_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'manage_team_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'manage_type', title: '总部类型编码', key: 'hq_type_code' },
      { dataIndex: 'manage_name', title: '总部类型名称', key: 'hq_type_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-business-mode': {
    name: '业务模式',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'business_model_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'business_model_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-sales-mode': {
    name: '销售模式',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'sales_model_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'sales_model_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'business_model_code', title: '业务模式编码', key: 'bm_code' },
      { dataIndex: 'business_model_name', title: '业务模式名称', key: 'bm_name' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-currency': {
    name: '币种',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'currency_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'currency_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },

  // 产品主数据
  'md-product': {
    name: '产品主数据',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_code', title: '产品编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'product_name', title: '产品名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'spec', title: '规格', key: 'spec' },
      { dataIndex: 'package_spec', title: '包装规格', key: 'package_spec' },
      { dataIndex: 'product_type', title: '产品类型', key: 'product_type', inputType: 'select', options: [
        { label: '制药', value: '制药' },
        { label: '医疗', value: '医疗' },
        { label: '日化', value: '日化' },
      ]},
      { dataIndex: 'package_class', title: '包装分类', key: 'package_class' },
      { dataIndex: 'unit', title: '计量单位', key: 'unit' },
      { dataIndex: 'approval_manufacturer', title: '批文厂家', key: 'approval_manufacturer' },
      { dataIndex: 'produce_manufacturer', title: '生产厂家', key: 'produce_manufacturer' },
      { dataIndex: 'min_unit_convert_rate', title: '最小单位转换率', key: 'min_unit_convert_rate' },
      { dataIndex: 'group_purchase_attr', title: '集采属性', key: 'group_purchase_attr' },
      { dataIndex: 'group_purchase_batch', title: '集采批次', key: 'group_purchase_batch' },
      { dataIndex: 'min_unit', title: '最小单位', key: 'min_unit' },
      { dataIndex: 'is_virtual', title: '是否虚拟', key: 'is_virtual', inputType: 'select', options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ]},
      { dataIndex: 'valid_from', title: '生效日期', key: 'valid_from' },
      { dataIndex: 'valid_to', title: '失效日期', key: 'valid_to' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },

  // 其他维度表
  'md-province': {
    name: '省份',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'province_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'province_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-sales-officer-hq': {
    name: '一级业务员(总部)',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'salesman_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'salesman_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-sales-office': {
    name: '销售办公室',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'office_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'office_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-sales-group': {
    name: '销售组(片区业务员1)',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'group_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'group_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-region-dimension': {
    name: '片区管理维度',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'area_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'area_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-entity': {
    name: '实体',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'entity_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'entity_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-customer': {
    name: '客户',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'customer_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'customer_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-department': {
    name: '部门',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'dept_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'dept_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '上级编码', key: 'parent_code' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
    isTree: true,
  },
  'md-scenario': {
    name: '场景',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'scenario_code', title: '编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'scenario_name', title: '名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-version': {
    name: '版本',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'version_code', title: '版本编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'version_name', title: '版本名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-period': {
    name: '期间',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'period_code', title: '期间编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'period_name', title: '期间名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-year': {
    name: '年份',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'year_code', title: '年份编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'year_name', title: '年份名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-account': {
    name: '科目',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'account_code', title: '科目编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'account_name', title: '科目名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'account_type', title: '科目类型', key: 'account_type' },
      { dataIndex: 'parent_code', title: '上级编码', key: 'parent_code' },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
    isTree: true,
  },
  'md-project': {
    name: '项目主数据',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'project_code', title: '项目编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'project_name', title: '项目名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'parent_code', title: '父级编码', key: 'parent_code' },
      { dataIndex: 'parent_name', title: '父级名称', key: 'parent_name' },
      { dataIndex: 'project_type', title: '项目类型', key: 'project_type' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'md-delivery-mode': {
    name: '医贸发货模式',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'delivery_mode_code', title: '发货模式编码', key: 'code', rules: [{ required: true }] },
      { dataIndex: 'delivery_mode_name', title: '发货模式名称', key: 'name', rules: [{ required: true }] },
      { dataIndex: 'sort_order', title: '排序号', key: 'sort_order' },
      { dataIndex: 'valid_from', title: '生效时间', key: 'valid_from', inputType: 'date' },
      { dataIndex: 'valid_to', title: '失效时间', key: 'valid_to', inputType: 'date' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
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
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'map-product-arch': {
    name: '产品架构表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'arch_code', title: '架构编码', key: 'arch_code' },
      { dataIndex: 'arch_name', title: '架构名称', key: 'arch_name' },
      { dataIndex: 'parent_code', title: '父级编码', key: 'parent_code' },
      { dataIndex: 'parent_name', title: '父级名称', key: 'parent_name' },
      { dataIndex: 'arch_type', title: '架构类型', key: 'arch_type' },
      { dataIndex: 'status', title: '状态', key: 'status', inputType: 'select', options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]},
    ],
  },
  'map-product-arch-mapping': {
    name: '产品-架构映射表',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code' },
      { dataIndex: 'product_name', title: '产品名称', key: 'product_name' },
      { dataIndex: 'arch_code', title: '架构编码', key: 'arch_code' },
      { dataIndex: 'arch_name', title: '架构名称', key: 'arch_name' },
    ],
  },
  'map-pure-sales': {
    name: '纯销数据',
    columns: [
      { dataIndex: 'seq', title: '序号', key: 'seq' },
      { dataIndex: 'year', title: '年份', key: 'year' },
      { dataIndex: 'customer_code', title: '客户编码', key: 'customer_code' },
      { dataIndex: 'product_code', title: '产品编码', key: 'product_code' },
      { dataIndex: 'quantity', title: '数量', key: 'quantity' },
      { dataIndex: 'amount', title: '金额', key: 'amount' },
    ],
  },
}

export default MASTER_DATA_DEFS
