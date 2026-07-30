import { useState, useMemo } from 'react'
import { Table, Button, Select, Form, message } from 'antd'
import { SearchOutlined, ExportOutlined, SaveOutlined, ImportOutlined, LockOutlined, UnlockOutlined, CopyOutlined } from '@ant-design/icons'
import '../budget/ActualDataTable.css'

// 月份列表
const MONTHS_1_12 = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
const MONTHS_1_9 = Array.from({ length: 9 }, (_, i) => `${i + 1}月`)
const MONTHS_10_12 = ['10 月', '11 月', '12 月']

// 按月份展开的指标
const MONTHLY_METRICS = [
  '销售量',
  '销售量 - 转换后',
  '销售量 - 最小规格',
  '中标价/交易价',
  '中标/交易金额',
  '销售单价 - 含税（折前）',
  '销售收入 - 含税（折前）',
  '销售收入 - 含税（折扣）',
  '销售收入 - 含税（折后）',
  '销售收入 - 不含税（折前）',
  '销售收入 - 不含税（折扣）',
  '销售收入 - 不含税（折后）',
]

// 不按月份展开的指标
const FIXED_METRICS = [
  '分析转换系数',
  '最小规格转换率',
  '增值税销项税率',
]

// 维度字段
const DIMENSION_FIELDS = [
  { key: 'year', title: '年', width: 60 },
  { key: 'manage_type_code', title: '总部管理类型编码', width: 120 },
  { key: 'manage_type_name', title: '总部管理类型名称', width: 120 },
  { key: 'manage_team_code', title: '总部管理团队编码', width: 120 },
  { key: 'manage_team_name', title: '总部管理团队名称', width: 120 },
  { key: 'business_model_code', title: '业务模式编码', width: 120 },
  { key: 'business_model_name', title: '业务模式名称', width: 120 },
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

export default function SalesBudgetTable({ pageTitle }) {
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

    // 固定指标列（不按月份展开）
    FIXED_METRICS.forEach(metric => {
      cols.push({
        title: metric,
        dataIndex: metric,
        key: metric,
        width: 100,
        align: 'right',
      })
    })

    // 按月份展开的指标列（复杂结构）
    MONTHLY_METRICS.forEach(metric => {
      cols.push({
        title: metric,
        children: [
          // 1-9 月（实际数）
          ...MONTHS_1_9.map(month => ({
            title: `${month}(实际数)`,
            dataIndex: `${metric}_${month.replace('月', '')}_actual`,
            key: `${metric}_${month.replace('月', '')}_actual`,
            width: 90,
            align: 'right',
          })),
          // 10-12 月（预算数）
          ...MONTHS_10_12.map(month => ({
            title: `${month}(预算数)`,
            dataIndex: `${metric}_${month.replace('月', '')}_budget`,
            key: `${metric}_${month.replace('月', '')}_budget`,
            width: 90,
            align: 'right',
          })),
          // 12 月调整数
          {
            title: '12 月调整数',
            dataIndex: `${metric}_12_adjust`,
            key: `${metric}_12_adjust`,
            width: 90,
            align: 'right',
          },
          // 1-12 月（预算数）
          ...MONTHS_1_12.map(month => ({
            title: `${month}(预算数)`,
            dataIndex: `${metric}_${month.replace('月', '')}_budget_full`,
            key: `${metric}_${month.replace('月', '')}_budget_full`,
            width: 90,
            align: 'right',
          })),
        ],
      })
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

  // 导入
  const handleImport = () => {
    message.success('导入功能开发中')
  }

  // 锁定
  const handleLock = () => {
    message.success('锁定功能开发中')
  }

  // 解锁
  const handleUnlock = () => {
    message.success('解锁功能开发中')
  }

  // 版本复制
  const handleCopyVersion = () => {
    message.success('版本复制功能开发中')
  }

  // 查询条件字段
  const queryFields = [
    { key: 'year', label: '年份' },
    { key: 'manage_type', label: '总部管理类型' },
    { key: 'manage_team', label: '总部管理团队' },
    { key: 'business_model', label: '业务模式' },
    { key: 'sales_mode', label: '销售模式' },
    { key: 'budget_entity', label: '预算编制实体' },
  ]

  return (
    <div className="actual-data-table">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form form={searchForm} layout="inline" className="search-fields">
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key} className="search-field-item">
              <Select placeholder="请选择" allowClear showSearch size="small">
                <Select.Option value="test">测试数据</Select.Option>
              </Select>
            </Form.Item>
          ))}
        </Form>
        <div className="search-buttons">
          <Button size="small" icon={<ImportOutlined />} onClick={handleImport}>
            导入
          </Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button size="small" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
          <Button size="small" icon={<LockOutlined />} onClick={handleLock}>
            锁定
          </Button>
          <Button size="small" icon={<UnlockOutlined />} onClick={handleUnlock}>
            解锁
          </Button>
          <Button size="small" icon={<CopyOutlined />} onClick={handleCopyVersion}>
            版本复制
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
          scroll={{ x: 20000 }}
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
