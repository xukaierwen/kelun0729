import { useState, useMemo } from 'react'
import { Table, Button, Space, Input, Select, Form, message } from 'antd'
import { SearchOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons'
import './ActualDataTable.css'

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

// 维度字段（固定左侧）
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

export default function ActualDataTable({ pageTitle }) {
  const [searchForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 生成表格列配置
  const columns = useMemo(() => {
    const cols = []

    // 维度字段列（只固定前两个）
    DIMENSION_FIELDS.forEach((field, index) => {
      cols.push({
        title: field.title,
        dataIndex: field.key,
        key: field.key,
        width: field.width,
        fixed: index < 2 ? 'left' : undefined,
        ellipsis: true,
      })
    })

    // 指标列（按顺序配置渲染）
    METRICS_ORDER.forEach(metric => {
      if (metric.type === 'fixed') {
        // 固定指标：单列展示
        cols.push({
          title: metric.name,
          dataIndex: metric.name,
          key: metric.name,
          width: 100,
          align: 'right',
        })
      } else {
        // 月度指标：按月份展开
        cols.push({
          title: metric.name,
          children: [
            ...MONTHS.map(month => ({
              title: month,
              dataIndex: `${metric.name}_${month.replace('月', '')}`,
              key: `${metric.name}_${month.replace('月', '')}`,
              width: 80,
              align: 'right',
            })),
            {
              title: '全年合计',
              dataIndex: `${metric.name}_total`,
              key: `${metric.name}_total`,
              width: 90,
              align: 'right',
            },
          ],
        })
      }
    })

    return cols
  }, [])

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

  // 查询条件字段（根据页面标题动态配置）
  const getQueryFields = () => {
    const baseFields = [
      { key: 'year', label: '年份' },
      { key: 'data_scope', label: '数据口径' },
      { key: 'period_type', label: '当期/累计' },
    ]

    // 数字营销&城市连锁、代理制片区&总代：业务模式
    if (pageTitle === '数字营销&城市连锁' || pageTitle === '代理制片区&总代') {
      return [
        { key: 'year', label: '年份' },
        { key: 'business_model', label: '业务模式' },
        { key: 'data_scope', label: '数据口径' },
        { key: 'period_type', label: '当期/累计' },
      ]
    }

    // 其他页面：不需要片区销售模式
    return baseFields
  }

  const queryFields = getQueryFields()

  return (
    <div className="actual-data-table">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form form={searchForm} layout="inline" className="search-fields">
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key} className="search-field-item">
              {field.key === 'period_type' ? (
                <Select placeholder="请选择" allowClear size="small">
                  <Select.Option value="current">当期</Select.Option>
                  <Select.Option value="cumulative">累计</Select.Option>
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
