import { useState, useMemo } from 'react'
import { Table, Button, Space, Input, Select, Form, message } from 'antd'
import { SearchOutlined, ExportOutlined, SaveOutlined, ImportOutlined } from '@ant-design/icons'
import './ActualDataTable.css'

// 年份选项：当年上下5年
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i)

// 月份列表
const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)

// 指标顺序配置（包含月度指标和固定指标）
const METRICS_ORDER = [
  { name: '销售量', type: 'monthly' },
  { name: '分析转换系数', type: 'fixed' },
  { name: '销售量 - 转换后', type: 'monthly' },
  { name: '最小规格转换率', type: 'fixed' },
  { name: '销售量 - 最小规格', type: 'monthly' },
  { name: '中标价/交易价', type: 'monthly' },
  { name: '中标/交易金额', type: 'monthly' },
  { name: '销售单价 - 含税（折前）', type: 'monthly' },
  { name: '销售收入 - 含税（折前）', type: 'monthly' },
  { name: '销售收入 - 含税（折扣）', type: 'monthly' },
  { name: '销售收入 - 含税（折后）', type: 'monthly' },
  { name: '增值税销项税率', type: 'fixed' },
  { name: '销售收入 - 不含税（折前）', type: 'monthly' },
  { name: '销售收入 - 不含税（折扣）', type: 'monthly' },
  { name: '销售收入 - 不含税（折后）', type: 'monthly' },
]

// 默认维度字段（数字营销&城市连锁等）
const DIMENSION_FIELDS = [
  { key: 'product_owner', title: '产品负责人（总部）', width: 120 },
  { key: 'salesman_hq', title: '一级业务员（总部）', width: 120 },
  { key: 'sales_office', title: '销售办公室', width: 120 },
  { key: 'customer_name', title: '客户名称', width: 150 },
  { key: 'goods_class', title: '商品名分类', width: 120 },
  { key: 'product_code', title: '产品编码', width: 120 },
  { key: 'product_name', title: '产品名称', width: 150 },
  { key: 'spec', title: '规格', width: 100 },
  { key: 'package_spec', title: '包装规格', width: 100 },
  { key: 'product_type', title: '类型', width: 80 },
  { key: 'package_class', title: '包装分类', width: 100 },
  { key: 'unit', title: '计量单位', width: 80 },
  { key: 'approval_mfr', title: '批文厂家', width: 120 },
  { key: 'produce_mfr', title: '生产厂家', width: 120 },
  { key: 'analysis_arch', title: '分析架构', width: 120 },
  { key: 'group_purchase_attr', title: '集采属性', width: 100 },
  { key: 'group_purchase_batch', title: '集采批次', width: 100 },
  { key: 'budget_entity', title: '预算编制实体', width: 120 },
]

// 片区直营/招商共用维度字段
const REGION_DIMENSION_FIELDS = [
  { key: 'product_owner_hq', title: '产品负责人（总部）', width: 120 },
  { key: 'product_owner_region', title: '产品负责人（片区）', width: 120 },
  { key: 'province', title: '省份', width: 80 },
  { key: 'salesman_hq', title: '一级业务员（总部）', width: 120 },
  { key: 'sales_office', title: '销售办公室', width: 120 },
  { key: 'sales_group', title: '销售组（片区业务员）', width: 130 },
  { key: 'salesman_hn', title: '业务员（湖南湖北专用）', width: 140 },
  { key: 'region_manage', title: '片区管理区域（地区/人名）', width: 160 },
  { key: 'customer_name', title: '客户名称', width: 150 },
  { key: 'flow_unit', title: '流向单位（湖南片区专用）', width: 140 },
  { key: 'product_code', title: '产品编码', width: 120 },
  { key: 'product_name', title: '产品名称', width: 150 },
  { key: 'spec', title: '规格', width: 100 },
  { key: 'package_spec', title: '包装规格', width: 100 },
  { key: 'product_type', title: '类型', width: 80 },
  { key: 'package_class', title: '包装分类', width: 100 },
  { key: 'unit', title: '计量单位', width: 80 },
  { key: 'approval_mfr', title: '批文厂家', width: 120 },
  { key: 'produce_mfr', title: '生产厂家', width: 120 },
  { key: 'analysis_arch', title: '分析架构', width: 120 },
  { key: 'group_purchase_attr', title: '集采属性', width: 100 },
  { key: 'group_purchase_batch', title: '集采批次', width: 100 },
  { key: 'region_product_tag', title: '片区产品标识（直营/招商）', width: 150 },
  { key: 'delivery_mode', title: '基地直发/医贸发出', width: 130 },
  { key: 'budget_entity', title: '预算编制实体', width: 120 },
  { key: 'belong_dept', title: '归属部门', width: 120 },
]

// 片区招商指标配置（含部分拆月指标）
const PAGE_METRICS_ORDER = {
  '费用制片区-片区招商': [
    { name: '销售量', type: 'monthly' },
    { name: '分析转换系数', type: 'fixed' },
    { name: '销售量-转换后', type: 'monthly' },
    { name: '最小规格转换率', type: 'fixed' },
    { name: '销售量-最小规格', type: 'monthly' },
    { name: '中标价/交易价', type: 'monthly' },
    { name: '中标/交易金额', type: 'monthly' },
    { name: '配送点位(%)', type: 'monthly' },
    { name: '销售单价-含税（折前）', type: 'monthly' },
    { name: '销售收入-含税（折前）', type: 'monthly' },
    { name: '销售收入-含税（折扣）', type: 'monthly' },
    { name: '销售收入-含税（折后）', type: 'monthly' },
    { name: '增值税销项税率', type: 'fixed' },
    { name: '销售收入-不含税（折前）', type: 'monthly' },
    { name: '销售收入-不含税（折扣）', type: 'monthly' },
    { name: '销售收入-不含税（折后）', type: 'monthly' },
    { name: '总部销售团队点位（%）', type: 'partialA' },
    { name: '片区销售团队点位(%)', type: 'monthly' },
    { name: '点位费单价', type: 'monthly' },
    { name: '市场维护费-点位费', type: 'monthly' },
    { name: '采购单价-含税', type: 'monthly' },
    { name: '采购金额-含税', type: 'monthly' },
    { name: '平均考核价1', type: 'partialA' },
    { name: '最新考核价1', type: 'partialB' },
    { name: '预测考核价1', type: 'fixed' },
  ],
}

// 页面维度映射
const PAGE_DIMENSION_FIELDS = {
  '费用制片区-片区直营': REGION_DIMENSION_FIELDS,
  '费用制片区-片区招商': REGION_DIMENSION_FIELDS,
  '费用制片区-片区城市连锁': REGION_DIMENSION_FIELDS,
}

// 总部管理类型与团队联动配置
const MGMT_TYPE_TEAM_MAP = {
  '南区': ['南一区', '南二区', '南三区', '南四区', '南商务'],
  '北区': ['北一区', '北二区', '北三区', '北四区', '北五区', '北特区', '北商务'],
}

export default function ActualDataTable({ pageTitle }) {
  const [searchForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // 监听总部管理类型，用于团队联动
  const mgmtTypeValue = Form.useWatch('mgmt_type', searchForm)

  // 根据页面标题获取维度和指标配置
  const dimensionFields = PAGE_DIMENSION_FIELDS[pageTitle] || DIMENSION_FIELDS
  const metricsOrder = PAGE_METRICS_ORDER[pageTitle] || METRICS_ORDER

  // 生成月度指标子列
  const buildMonthlyChildren = (name) => [
    ...MONTHS.map(month => ({
      title: month,
      dataIndex: `${name}_${month.replace('月', '')}`,
      key: `${name}_${month.replace('月', '')}`,
      width: 80,
      align: 'right',
    })),
    { title: '全年合计', dataIndex: `${name}_total`, key: `${name}_total`, width: 90, align: 'right' },
  ]

  // 生成表格列配置
  const columns = useMemo(() => {
    const cols = []

    // 维度字段列（固定前两个）
    dimensionFields.forEach((field, index) => {
      cols.push({
        title: field.title,
        dataIndex: field.key,
        key: field.key,
        width: field.width,
        fixed: index < 2 ? 'left' : undefined,
        ellipsis: true,
      })
    })

    // 指标列
    metricsOrder.forEach(metric => {
      if (metric.type === 'fixed') {
        cols.push({
          title: metric.name,
          dataIndex: metric.name,
          key: metric.name,
          width: 100,
          align: 'right',
        })
      } else if (metric.type === 'monthly') {
        cols.push({ title: metric.name, children: buildMonthlyChildren(metric.name) })
      } else if (metric.type === 'partialA') {
        // 部分拆月：预计完成数/预算数拆 + 实际数单值
        cols.push({
          title: metric.name,
          children: [
            { title: '预计完成数/预算数拆', children: buildMonthlyChildren(`${metric.name}_forecast`) },
            { title: '实际数', children: [{ title: '实际数', dataIndex: `${metric.name}_actual`, key: `${metric.name}_actual`, width: 100, align: 'right' }] },
          ],
        })
      } else if (metric.type === 'partialB') {
        // 部分拆月：实际数/预计完成数拆 + 预算数单值
        cols.push({
          title: metric.name,
          children: [
            { title: '实际数/预计完成数拆', children: buildMonthlyChildren(`${metric.name}_actual`) },
            { title: '预算数', children: [{ title: '预算数', dataIndex: `${metric.name}_budget`, key: `${metric.name}_budget`, width: 100, align: 'right' }] },
          ],
        })
      }
    })

    return cols
  }, [dimensionFields, metricsOrder])

  // 查询
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('查询完成')
    }, 500)
  }

  // 导出
  const handleExport = () => {
    message.success('导出功能开发中')
  }

  // 保存
  const handleSave = () => {
    message.success('保存功能开发中')
  }

  // 导入
  const handleImport = () => {
    message.info('导入功能开发中')
  }

  // 查询条件字段（根据页面标题动态配置）
  const getQueryFields = () => {
    const baseFields = [
      { key: 'year', label: '年份' },
      { key: 'data_scope', label: '数据口径' },
      { key: 'period_type', label: '当期/累计' },
    ]

    // 数字营销&城市连锁、代理制片区&总代：业务模式 + 总部管理类型/团队
    if (pageTitle === '数字营销&城市连锁' || pageTitle === '代理制片区&总代') {
      return [
        { key: 'year', label: '年份' },
        { key: 'mgmt_type', label: '总部管理类型' },
        { key: 'mgmt_team', label: '总部管理团队' },
        { key: 'business_model', label: '业务模式' },
        { key: 'data_scope', label: '数据口径' },
        { key: 'period_type', label: '当期/累计' },
      ]
    }

    // 费用制片区系列页面
    if (pageTitle && pageTitle.startsWith('费用制片区')) {
      const fields = [{ key: 'year', label: '年份' }]
      // 招商页面额外加业务模式
      if (pageTitle === '费用制片区-片区招商') {
        fields.push({ key: 'business_model', label: '业务模式' })
      }
      fields.push(
        { key: 'region_sales_mode', label: '片区销售模式' },
        { key: 'mgmt_type', label: '总部管理类型' },
        { key: 'mgmt_team', label: '总部管理团队' },
        { key: 'data_scope', label: '数据口径' },
        { key: 'period_type', label: '当期/累计' },
      )
      return fields
    }

    // 其他页面
    return baseFields
  }

  const queryFields = getQueryFields()

  // 片区销售模式默认值：根据页面标题对应
  const defaultRegionSalesMode = pageTitle === '费用制片区-片区直营' ? '直营'
    : pageTitle === '费用制片区-片区招商' ? '招商'
    : pageTitle === '费用制片区-片区城市连锁' ? '城市连锁'
    : undefined

  return (
    <div className="actual-data-table">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form form={searchForm} layout="inline" className="search-fields" initialValues={{ year: String(CURRENT_YEAR), region_sales_mode: defaultRegionSalesMode }}>
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key} className="search-field-item">
              {field.key === 'period_type' ? (
                <Select placeholder="请选择" allowClear size="small">
                  <Select.Option value="current">当期</Select.Option>
                  <Select.Option value="cumulative">累计</Select.Option>
                </Select>
              ) : field.key === 'business_model' ? (
                <Select placeholder="请选择" allowClear size="small">
                  <Select.Option value="数字营销">数字营销</Select.Option>
                  <Select.Option value="城市连锁">城市连锁</Select.Option>
                </Select>
              ) : field.key === 'region_sales_mode' ? (
                <Select placeholder="请选择" allowClear size="small">
                  {(pageTitle === '费用制片区-片区直营') ? (
                    <Select.Option value="直营">直营</Select.Option>
                  ) : pageTitle === '费用制片区-片区招商' ? (
                    <Select.Option value="招商">招商</Select.Option>
                  ) : pageTitle === '费用制片区-片区城市连锁' ? (
                    <Select.Option value="城市连锁">城市连锁</Select.Option>
                  ) : (
                    <>
                      <Select.Option value="直营">直营</Select.Option>
                      <Select.Option value="招商">招商</Select.Option>
                      <Select.Option value="城市连锁">城市连锁</Select.Option>
                    </>
                  )}
                </Select>
              ) : field.key === 'mgmt_type' ? (
                <Select placeholder="请选择" allowClear size="small" onChange={() => searchForm.setFieldValue('mgmt_team', undefined)}>
                  <Select.Option value="南区">南区</Select.Option>
                  <Select.Option value="北区">北区</Select.Option>
                </Select>
              ) : field.key === 'mgmt_team' ? (
                <Select placeholder="请选择" allowClear size="small">
                  {(MGMT_TYPE_TEAM_MAP[mgmtTypeValue] || []).map(t => (
                    <Select.Option key={t} value={t}>{t}</Select.Option>
                  ))}
                </Select>
              ) : field.key === 'year' ? (
                <Select placeholder="请选择" showSearch size="small">
                  {YEAR_OPTIONS.map(y => (
                    <Select.Option key={y} value={String(y)}>{y}年</Select.Option>
                  ))}
                </Select>
              ) : field.key === 'data_scope' ? (
                <Select placeholder="请选择" allowClear size="small">
                  <Select.Option value="调整前">调整前</Select.Option>
                  <Select.Option value="调整">调整</Select.Option>
                  <Select.Option value="调整后">调整后</Select.Option>
                </Select>
              ) : (
                <Select placeholder="请选择" allowClear showSearch size="small">
                  <Select.Option value="test">测试数据</Select.Option>
                </Select>
              )}
            </Form.Item>
          ))}
        </Form>
        <div className="search-buttons">
          {/* 数字营销&城市连锁页面增加导入按钮 */}
          {pageTitle === '数字营销&城市连锁' && (
            <Button size="small" icon={<ImportOutlined />} onClick={handleImport}>
              导入
            </Button>
          )}
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button size="small" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={[]}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            size: 'small',
          }}
          scroll={{ x: 14000 }}
          size="small"
          bordered
          locale={{
            emptyText: '暂无数据',
          }}
        />
      </div>
    </div>
  )
}
